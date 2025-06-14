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
  const [serviceMetrics, setServiceMetrics] = useState({
    responseTime: 0,
    errorRate: 0,
    successfulRequests: 0,
    failedRequests: 0
  });

  // Enhanced connection checking with health endpoint
  useEffect(() => {
    const checkBackendConnection = async () => {
      try {
        setConnectionStatus('connecting');
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
          
          // Update metrics
          setServiceMetrics(prev => ({
            ...prev,
            successfulRequests: prev.successfulRequests + 1,
            responseTime: Date.now() % 1000 // Simple response time simulation
          }));
        } else {
          throw new Error('Health check failed');
        }
      } catch (error) {
        console.log('Python backend not available, using mock data mode');
        setIsBackendConnected(false);
        setConnectionStatus('disconnected');
        
        setServiceMetrics(prev => ({
          ...prev,
          failedRequests: prev.failedRequests + 1,
          errorRate: (prev.failedRequests / (prev.successfulRequests + prev.failedRequests)) * 100
        }));
      }
    };

    checkBackendConnection();
    const interval = setInterval(checkBackendConnection, 15000); // Check every 15 seconds
    return () => clearInterval(interval);
  }, []);

  const processImage = async (imageFile: File): Promise<ANPRProcessingResult> => {
    setIsProcessing(true);
    const startTime = Date.now();
    
    try {
      if (isBackendConnected) {
        // Convert file to base64 for Python backend
        const base64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(imageFile);
        });

        console.log('Sending image to Python ANPR service...');
        const response = await fetch(`${PYTHON_BACKEND_URL}/process-image`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64 }),
          signal: AbortSignal.timeout(10000) // 10 second timeout for processing
        });

        if (!response.ok) {
          throw new Error(`Backend processing failed: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();
        
        // Update success metrics
        setServiceMetrics(prev => ({
          ...prev,
          successfulRequests: prev.successfulRequests + 1,
          responseTime: Date.now() - startTime,
          errorRate: (prev.failedRequests / (prev.successfulRequests + 1 + prev.failedRequests)) * 100
        }));

        console.log('Python ANPR processing successful:', result);
        return {
          ...result,
          processing_time: (Date.now() - startTime) / 1000
        };
      } else {
        // Enhanced mock processing with realistic delays and error simulation
        console.log('Using enhanced mock processing...');
        await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
        
        // Simulate occasional processing errors
        if (Math.random() < 0.05) { // 5% error rate
          throw new Error('Mock processing error - image quality too low');
        }
        
        const mockPlates = [
          'DL-01-AB-1234', 'MH-12-CD-5678', 'UP-16-EF-9012', 
          'GJ-05-GH-3456', 'KA-09-IJ-7890', 'TN-33-LM-2468',
          'TN-01-BC-4567', 'TN-22-XY-8901', 'AP-07-PQ-2345'
        ];
        
        const plateCount = Math.random() > 0.7 ? 2 : Math.random() > 0.3 ? 1 : 0;
        const results = [];
        
        for (let i = 0; i < plateCount; i++) {
          const randomPlate = mockPlates[Math.floor(Math.random() * mockPlates.length)];
          const confidence = 75 + Math.random() * 25;
          
          results.push({
            plate_number: randomPlate,
            confidence: Math.round(confidence * 10) / 10,
            is_valid: confidence > 85,
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
          success: plateCount > 0,
          plates_detected: results.length,
          results,
          processing_time: 1.2 + Math.random() * 0.8,
          error: plateCount === 0 ? 'No license plates detected in image' : undefined
        };
      }
    } catch (error) {
      console.error('Image processing error:', error);
      
      // Update error metrics
      setServiceMetrics(prev => ({
        ...prev,
        failedRequests: prev.failedRequests + 1,
        errorRate: ((prev.failedRequests + 1) / (prev.successfulRequests + prev.failedRequests + 1)) * 100
      }));

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
    serviceMetrics,
    processImage,
    batchProcessImages,
    logDetection,
  };
};
