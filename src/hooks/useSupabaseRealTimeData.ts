
import { Detection, SystemStats, Camera } from '@/types/supabase';
import { useDetections } from './useDetections';
import { useSystemStats } from './useSystemStats';
import { useCameras } from './useCameras';
import { useSupabaseConnection } from './useSupabaseConnection';
import { useState, useEffect } from 'react';

interface EnhancedSystemStats extends SystemStats {
  network_health?: number;
  sdn_flows?: number;
  bandwidth_usage?: number;
  controller_uptime?: string;
}

export const useSupabaseRealTimeData = () => {
  const { detections, addDetection } = useDetections();
  const { systemStats, updateSystemStats } = useSystemStats();
  const { cameras } = useCameras();
  const { isConnected } = useSupabaseConnection();
  
  const [enhancedStats, setEnhancedStats] = useState<EnhancedSystemStats | null>(null);

  // Enhance system stats with SDN-specific metrics
  useEffect(() => {
    if (systemStats) {
      const enhanced: EnhancedSystemStats = {
        ...systemStats,
        network_health: 95 + Math.floor(Math.random() * 5),
        sdn_flows: 1200 + Math.floor(Math.random() * 200),
        bandwidth_usage: 2500 + Math.floor(Math.random() * 500),
        controller_uptime: '15d 8h 42m'
      };
      setEnhancedStats(enhanced);
    }
  }, [systemStats]);

  // Simulate real-time updates for enhanced metrics
  useEffect(() => {
    const interval = setInterval(() => {
      if (enhancedStats) {
        setEnhancedStats(prev => prev ? {
          ...prev,
          network_health: Math.max(90, Math.min(100, (prev.network_health || 95) + Math.floor(Math.random() * 4) - 2)),
          sdn_flows: Math.max(1000, (prev.sdn_flows || 1200) + Math.floor(Math.random() * 50) - 25),
          bandwidth_usage: Math.max(2000, (prev.bandwidth_usage || 2500) + Math.floor(Math.random() * 100) - 50)
        } : null);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [enhancedStats]);

  return {
    detections,
    systemStats: enhancedStats || systemStats,
    cameras,
    isConnected,
    addDetection,
    updateSystemStats
  };
};

// Re-export types for backward compatibility
export type { Detection, SystemStats, Camera };
