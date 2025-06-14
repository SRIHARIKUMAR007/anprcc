
import { supabase } from '@/integrations/supabase/client';

interface DetectionResult {
  plate_number: string;
  confidence: number;
  is_valid: boolean;
}

export const useDetectionLogger = () => {
  const logDetection = async (
    detection: DetectionResult, 
    cameraId: string, 
    location: string
  ): Promise<boolean> => {
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

  return { logDetection };
};
