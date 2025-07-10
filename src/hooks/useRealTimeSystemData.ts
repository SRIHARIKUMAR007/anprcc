
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { Detection, SystemStats, Camera } from '@/types/supabase';

interface RealTimeSystemData {
  detections: Detection[];
  systemStats: SystemStats | null;
  cameras: Camera[];
  networkHealth: number;
  threatLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  activeIncidents: number;
  isConnected: boolean;
}

export const useRealTimeSystemData = () => {
  const { user } = useAuth();
  const [data, setData] = useState<RealTimeSystemData>({
    detections: [],
    systemStats: null,
    cameras: [],
    networkHealth: 95,
    threatLevel: 'LOW',
    activeIncidents: 0,
    isConnected: false
  });

  useEffect(() => {
    if (!user) return;

    let detectionChannel: any;
    let systemChannel: any;
    let cameraChannel: any;

    const setupRealTimeSubscriptions = async () => {
      try {
        // Load initial data
        const [detectionsResult, systemStatsResult, camerasResult] = await Promise.all([
          supabase.from('detections').select('*').order('timestamp', { ascending: false }).limit(100),
          supabase.from('system_stats').select('*').order('timestamp', { ascending: false }).limit(1),
          supabase.from('cameras').select('*')
        ]);

        // Transform detections data to ensure proper typing
        const transformedDetections = (detectionsResult.data || []).map(detection => ({
          ...detection,
          status: (detection.status || 'cleared') as 'cleared' | 'flagged' | 'processing'
        }));

        // Set initial data
        setData(prev => ({
          ...prev,
          detections: transformedDetections,
          systemStats: systemStatsResult.data?.[0] || null,
          cameras: camerasResult.data || [],
          isConnected: true
        }));

        // Set up real-time subscriptions
        detectionChannel = supabase
          .channel('realtime-detections')
          .on('postgres_changes', 
            { event: '*', schema: 'public', table: 'detections' }, 
            (payload) => {
              console.log('Detection update:', payload);
              const rawDetection = payload.new as any;
              
              // Properly cast the detection with status type
              const newDetection: Detection = {
                ...rawDetection,
                status: (rawDetection?.status || 'cleared') as 'cleared' | 'flagged' | 'processing'
              };
              
              setData(prev => {
                const newDetections = payload.eventType === 'INSERT' && newDetection?.id
                  ? [newDetection, ...prev.detections.slice(0, 99)]
                  : prev.detections.map(d => d.id === newDetection?.id ? newDetection : d);
                
                return {
                  ...prev,
                  detections: newDetections,
                  activeIncidents: newDetections.filter(d => d.status === 'flagged').length,
                  threatLevel: newDetections.filter(d => d.status === 'flagged').length > 5 ? 'HIGH' : 
                              newDetections.filter(d => d.status === 'flagged').length > 2 ? 'MEDIUM' : 'LOW'
                };
              });
            }
          )
          .subscribe();

        systemChannel = supabase
          .channel('realtime-system-stats')
          .on('postgres_changes', 
            { event: '*', schema: 'public', table: 'system_stats' }, 
            (payload) => {
              console.log('System stats update:', payload);
              const newStats = payload.new as SystemStats;
              
              setData(prev => ({
                ...prev,
                systemStats: newStats || prev.systemStats,
                networkHealth: newStats?.cpu_usage && newStats?.memory_usage 
                  ? 100 - ((newStats.cpu_usage + newStats.memory_usage) / 2)
                  : prev.networkHealth
              }));
            }
          )
          .subscribe();

        cameraChannel = supabase
          .channel('realtime-cameras')
          .on('postgres_changes', 
            { event: '*', schema: 'public', table: 'cameras' }, 
            (payload) => {
              console.log('Camera update:', payload);
              const newCamera = payload.new as Camera;
              
              setData(prev => ({
                ...prev,
                cameras: payload.eventType === 'INSERT' && newCamera?.id
                  ? [...prev.cameras, newCamera]
                  : prev.cameras.map(c => c.id === newCamera?.id ? newCamera : c)
              }));
            }
          )
          .subscribe();

      } catch (error) {
        console.error('Error setting up real-time subscriptions:', error);
        setData(prev => ({ ...prev, isConnected: false }));
      }
    };

    setupRealTimeSubscriptions();

    return () => {
      if (detectionChannel) supabase.removeChannel(detectionChannel);
      if (systemChannel) supabase.removeChannel(systemChannel);
      if (cameraChannel) supabase.removeChannel(cameraChannel);
    };
  }, [user]);

  return data;
};
