
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

const PYTHON_BACKEND_URL = 'http://localhost:5000';

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

export interface CameraStreamData {
  camera_id: string;
  frame_data: string;
  timestamp: string;
}

export const useBackendIntegration = () => {
  const [isBackendConnected, setIsBackendConnected] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');

  // Enhanced connection checking with health endpoint
  useEffect(() => {
    const checkBackendConnection = async () => {
      try {
        const response = await fetch(`${PYTHON_BACKEND_URL}/health`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          signal: AbortSignal.timeout(5000) // 5 second timeout
        });
        
        if (response.ok) {
          const health = await response.json();
          setIsBackendConnected(true);
          setConnectionStatus('connected');
          console.log('Python ANPR backend connected:', health);
        } else {
          throw new Error('Health check failed');
        }
      } catch (error) {
        console.log('Python backend not available, using mock data mode');
        setIsBackendConnected(false);
        setConnectionStatus('disconnected');
      }
    };

    checkBackendConnection();
    const interval = setInterval(checkBackendConnection, 15000); // Check every 15 seconds
    return () => clearInterval(interval);
  }, []);

  const processImage = async (imageFile: File): Promise<ANPRProcessingResult> => {
    setIsProcessing(true);
    
    try {
      if (isBackendConnected) {
        // Convert file to base64 for Python backend
        const base64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(imageFile);
        });

        const response = await fetch(`${PYTHON_BACKEND_URL}/process-image`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64 }),
        });

        if (!response.ok) {
          throw new Error('Backend processing failed');
        }

        const result = await response.json();
        return result;
      } else {
        // Enhanced mock processing
        await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
        
        const mockPlates = [
          'DL-01-AB-1234', 'MH-12-CD-5678', 'UP-16-EF-9012', 
          'GJ-05-GH-3456', 'KA-09-IJ-7890', 'TN-33-LM-2468'
        ];
        
        const plateCount = Math.random() > 0.7 ? 2 : 1;
        const results = [];
        
        for (let i = 0; i < plateCount; i++) {
          const randomPlate = mockPlates[Math.floor(Math.random() * mockPlates.length)];
          const confidence = 85 + Math.random() * 15;
          
          results.push({
            plate_number: randomPlate,
            confidence: Math.round(confidence * 10) / 10,
            is_valid: confidence > 90,
            bbox: {
              x: Math.random() * 200,
              y: Math.random() * 100,
              width: 150 + Math.random() * 50,
              height: 30 + Math.random() * 20,
            },
            raw_text: randomPlate.replace(/-/g, '')
          });
        }

        return {
          success: true,
          plates_detected: results.length,
          results,
          processing_time: 1.2 + Math.random() * 0.8
        };
      }
    } catch (error) {
      console.error('Image processing error:', error);
      throw error;
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
        imageFiles.map(file => new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        }))
      );

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
    } finally {
      setIsProcessing(false);
    }
  };

  const logDetection = async (detection: ANPRProcessingResult['results'][0], cameraId: string, location: string) => {
    try {
      const { error } = await supabase
        .from('detections')
        .insert([{
          plate_number: detection.plate_number,
          camera_id: cameraId,
          confidence: Math.round(detection.confidence),
          location,
          status: detection.is_valid && detection.confidence > 90 ? 'cleared' : 'processing',
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
    connectionStatus,
    isProcessing,
    processImage,
    batchProcessImages,
    logDetection,
  };
};
