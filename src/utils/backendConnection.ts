
const PYTHON_BACKEND_URL = 'http://localhost:5000';

export interface ConnectionMetrics {
  responseTime: number;
  errorRate: number;
  successfulRequests: number;
  failedRequests: number;
}

export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected';

export const checkBackendHealth = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${PYTHON_BACKEND_URL}/health`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(5000) // 5 second timeout
    });
    
    if (response.ok) {
      const health = await response.json();
      console.log('Python ANPR backend connected:', health);
      return true;
    } else {
      throw new Error('Health check failed');
    }
  } catch (error) {
    console.log('Python backend not available, using mock data mode');
    return false;
  }
};

export const updateConnectionMetrics = (
  metrics: ConnectionMetrics,
  success: boolean,
  responseTime?: number
): ConnectionMetrics => {
  if (success) {
    return {
      ...metrics,
      successfulRequests: metrics.successfulRequests + 1,
      responseTime: responseTime || Date.now() % 1000,
      errorRate: (metrics.failedRequests / (metrics.successfulRequests + 1 + metrics.failedRequests)) * 100
    };
  } else {
    return {
      ...metrics,
      failedRequests: metrics.failedRequests + 1,
      errorRate: ((metrics.failedRequests + 1) / (metrics.successfulRequests + metrics.failedRequests + 1)) * 100
    };
  }
};

export { PYTHON_BACKEND_URL };
