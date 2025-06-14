
import { Detection, SystemStats, Camera } from '@/types/supabase';
import { useDetections } from './useDetections';
import { useSystemStats } from './useSystemStats';
import { useCameras } from './useCameras';
import { useSupabaseConnection } from './useSupabaseConnection';

export const useSupabaseRealTimeData = () => {
  const { detections, addDetection } = useDetections();
  const { systemStats, updateSystemStats } = useSystemStats();
  const { cameras } = useCameras();
  const { isConnected } = useSupabaseConnection();

  return {
    detections,
    systemStats,
    cameras,
    isConnected,
    addDetection,
    updateSystemStats
  };
};

// Re-export types for backward compatibility
export type { Detection, SystemStats, Camera };
