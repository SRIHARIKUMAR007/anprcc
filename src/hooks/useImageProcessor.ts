
import { useState } from 'react';
import { 
  ANPRProcessingResult, 
  processImageWithPython, 
  batchProcessWithPython,
  convertFileToBase64 
} from '@/utils/imageProcessing';
import { generateMockProcessingResult } from '@/utils/mockProcessor';

export const useImageProcessor = (isBackendConnected: boolean, updateMetrics: (success: boolean, responseTime?: number) => void) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const processImage = async (imageFile: File): Promise<ANPRProcessingResult> => {
    setIsProcessing(true);
    const startTime = Date.now();
    
    try {
      if (isBackendConnected) {
        // Convert file to base64 for Python backend
        const base64 = await convertFileToBase64(imageFile);
        const result = await processImageWithPython(base64);
        
        // Update success metrics
        const processingTime = Date.now() - startTime;
        updateMetrics(true, processingTime);

        console.log('Python ANPR processing successful:', result);
        return {
          ...result,
          processing_time: processingTime / 1000
        };
      } else {
        // Use mock processing
        const result = await generateMockProcessingResult();
        return result;
      }
    } catch (error) {
      console.error('Image processing error:', error);
      
      // Update error metrics
      updateMetrics(false);

      // Return error result instead of throwing
      return {
        success: false,
        plates_detected: 0,
        results: [],
        error: error.message || 'Unknown processing error',
        processing_time: (Date.now() - startTime) / 1000
      };
    } finally {
      setIsProcessing(false);
    }
  };

  const batchProcessImages = async (imageFiles: File[]): Promise<ANPRProcessingResult[]> => {
    if (!isBackendConnected) {
      throw new Error('Batch processing requires backend connection');
    }

    setIsProcessing(true);
    try {
      const base64Images = await Promise.all(
        imageFiles.map(file => convertFileToBase64(file))
      );

      const results = await batchProcessWithPython(base64Images);
      return results;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    isProcessing,
    processImage,
    batchProcessImages
  };
};
