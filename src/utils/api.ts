
export class APIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export const handleAPIError = (error: any): APIError => {
  if (error instanceof APIError) {
    return error;
  }
  
  if (error.response) {
    return new APIError(
      error.response.data?.message || 'API request failed',
      error.response.status,
      error.response.data?.code
    );
  }
  
  if (error.request) {
    return new APIError('Network error - unable to reach server');
  }
  
  return new APIError(error.message || 'Unknown error occurred');
};

export const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  baseDelay = 1000
): Promise<T> => {
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      if (attempt === maxRetries) {
        throw handleAPIError(error);
      }
      
      const delay = baseDelay * Math.pow(2, attempt - 1);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw handleAPIError(lastError);
};
