
import { PYTHON_BACKEND_URL } from './backendConnection';

export interface ANPRProcessingResult {
  success: boolean;
  plates_detected: number;
  results: Array<{
    plate_number: string;
    confidence: number;
    is_valid: boolean;
    bbox: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
    raw_text: string;
  }>;
  processing_time?: number;
  error?: string;
}

export const processImageWithPython = async (base64Image: string): Promise<ANPRProcessingResult> => {
  console.log('Sending image to Python ANPR service...');
  const response = await fetch(`${PYTHON_BACKEND_URL}/process-image`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image: base64Image }),
    signal: AbortSignal.timeout(10000) // 10 second timeout for processing
  });

  if (!response.ok) {
    throw new Error(`Backend processing failed: ${response.status} ${response.statusText}`);
  }

  return await response.json();
};

export const batchProcessWithPython = async (base64Images: string[]): Promise<ANPRProcessingResult[]> => {
  const response = await fetch(`${PYTHON_BACKEND_URL}/batch-process`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ images: base64Images }),
  });

  if (!response.ok) {
    throw new Error('Batch processing failed');
  }

  const result = await response.json();
  return result.results;
};

export const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(file);
  });
};
