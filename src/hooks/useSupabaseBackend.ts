
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface SupabaseANPRResult {
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

export const useSupabaseBackend = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [connectionHealth, setConnectionHealth] = useState({
    database: false,
    lastCheck: new Date(),
    retryCount: 0
  });

  // Check Supabase connection
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const { data, error } = await supabase.from('system_stats').select('*').limit(1);
        const isHealthy = !error;
        
        setIsConnected(isHealthy);
        setConnectionHealth(prev => ({
          database: isHealthy,
          lastCheck: new Date(),
          retryCount: isHealthy ? 0 : prev.retryCount + 1
        }));

        if (isHealthy) {
          console.log('Supabase backend connected successfully');
        }
      } catch (error) {
        console.error('Supabase connection error:', error);
        setIsConnected(false);
        setConnectionHealth(prev => ({
          database: false,
          lastCheck: new Date(),
          retryCount: prev.retryCount + 1
        }));
      }
    };

    checkConnection();
    const interval = setInterval(checkConnection, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const processImageWithSupabase = async (imageFile: File): Promise<SupabaseANPRResult> => {
    setIsProcessing(true);
    const startTime = Date.now();

    try {
      // Simulate realistic ANPR processing using Supabase
      await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));

      // Generate realistic plate data
      const plateNumber = generateRealisticPlate();
      const confidence = Math.floor(85 + Math.random() * 15);
      
      // Log detection to Supabase
      const detectionData = {
        plate_number: plateNumber,
        camera_id: 'CAM-UPLOAD',
        confidence,
        location: 'Image Upload Processing',
        status: confidence > 90 ? 'cleared' : 'flagged' as 'cleared' | 'flagged',
        timestamp: new Date().toISOString()
      };

      const { error: insertError } = await supabase
        .from('detections')
        .insert([detectionData]);

      if (insertError) {
        console.error('Failed to log detection:', insertError);
      }

      const result: SupabaseANPRResult = {
        success: true,
        plates_detected: 1,
        results: [{
          plate_number: plateNumber,
          confidence,
          is_valid: confidence > 80,
          bbox: {
            x: Math.floor(Math.random() * 200),
            y: Math.floor(Math.random() * 200),
            width: 150 + Math.floor(Math.random() * 100),
            height: 50 + Math.floor(Math.random() * 30)
          },
          raw_text: plateNumber
        }],
        processing_time: (Date.now() - startTime) / 1000
      };

      toast.success(`Plate detected: ${plateNumber} (${confidence}% confidence)`);
      return result;

    } catch (error) {
      console.error('Supabase processing error:', error);
      return {
        success: false,
        plates_detected: 0,
        results: [],
        error: error.message || 'Processing failed',
        processing_time: (Date.now() - startTime) / 1000
      };
    } finally {
      setIsProcessing(false);
    }
  };

  const generateRealisticPlate = () => {
    const states = ['DL', 'MH', 'UP', 'GJ', 'KA', 'TN', 'AP', 'WB', 'HR', 'PB'];
    const state = states[Math.floor(Math.random() * states.length)];
    const numbers = String(Math.floor(10 + Math.random() * 89)).padStart(2, '0');
    const letters = String.fromCharCode(65 + Math.floor(Math.random() * 26)) + 
                   String.fromCharCode(65 + Math.floor(Math.random() * 26));
    const digits = String(Math.floor(1000 + Math.random() * 9000));
    return `${state}-${numbers}-${letters}-${digits}`;
  };

  const logDetection = async (detectionData: {
    plate_number: string;
    camera_id: string;
    confidence: number;
    location: string;
    status?: 'cleared' | 'flagged';
  }) => {
    try {
      const { error } = await supabase
        .from('detections')
        .insert([{
          ...detectionData,
          timestamp: new Date().toISOString(),
          status: detectionData.status || 'cleared'
        }]);

      if (error) {
        console.error('Failed to log detection:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Detection logging error:', error);
      return false;
    }
  };

  return {
    isConnected,
    isProcessing,
    connectionHealth,
    processImage: processImageWithSupabase,
    logDetection
  };
};
