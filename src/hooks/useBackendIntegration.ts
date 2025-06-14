
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

const PYTHON_BACKEND_URL = 'http://localhost:8000';

export interface ANPRProcessingResult {
  plate_number: string;
  confidence: number;
  bounding_box?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  processing_time: number;
}

export const useBackendIntegration = () => {
  const [isBackendConnected, setIsBackendConnected] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Check backend connection
  useEffect(() => {
    const checkBackendConnection = async () => {
      try {
        const response = await fetch(`${PYTHON_BACKEND_URL}/health`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });
        setIsBackendConnected(response.ok);
      } catch (error) {
        console.log('Backend not available, using mock data mode');
        setIsBackendConnected(false);
      }
    };

    checkBackendConnection();
    const interval = setInterval(checkBackendConnection, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const processImage = async (imageFile: File): Promise<ANPRProcessingResult> => {
    setIsProcessing(true);
    
    try {
      if (isBackendConnected) {
        // Real backend processing
        const formData = new FormData();
        formData.append('image', imageFile);

        const response = await fetch(`${PYTHON_BACKEND_URL}/process-image`, {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Backend processing failed');
        }

        const result = await response.json();
        return result;
      } else {
        // Mock processing for demonstration
        await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate processing time
        
        const mockResults = [
          { plate_number: 'ABC-123', confidence: 95.2 },
          { plate_number: 'XYZ-789', confidence: 87.8 },
          { plate_number: 'DEF-456', confidence: 92.1 },
        ];
        
        const randomResult = mockResults[Math.floor(Math.random() * mockResults.length)];
        return {
          ...randomResult,
          bounding_box: {
            x: Math.random() * 100,
            y: Math.random() * 100,
            width: 200 + Math.random() * 100,
            height: 50 + Math.random() * 30,
          },
          processing_time: 1.5 + Math.random() * 2,
        };
      }
    } catch (error) {
      console.error('Image processing error:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  const logDetection = async (detection: ANPRProcessingResult, cameraId: string, location: string) => {
    try {
      const { error } = await supabase
        .from('detections')
        .insert([{
          plate_number: detection.plate_number,
          camera_id: cameraId,
          confidence: Math.round(detection.confidence),
          location,
          status: detection.confidence > 90 ? 'cleared' : 'processing',
          timestamp: new Date().toISOString(),
        }]);

      if (error) {
        console.error('Error logging detection:', error);
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error logging detection:', error);
      return false;
    }
  };

  return {
    isBackendConnected,
    isProcessing,
    processImage,
    logDetection,
  };
};
