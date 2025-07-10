
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface RealTimeSystemData {
  detections: any[];
  systemStats: any;
  cameras: any[];
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

        // Set initial data
        setData(prev => ({
          ...prev,
          detections: detectionsResult.data || [],
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
              setData(prev => {
                const newDetections = payload.eventType === 'INSERT' 
                  ? [payload.new, ...prev.detections.slice(0, 99)]
                  : prev.detections.map(d => d.id === payload.new?.id ? payload.new : d);
                
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
              setData(prev => ({
                ...prev,
                systemStats: payload.new || prev.systemStats,
                networkHealth: 100 - ((payload.new?.cpu_usage || 0) + (payload.new?.memory_usage || 0)) / 2
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
              setData(prev => ({
                ...prev,
                cameras: payload.eventType === 'INSERT' 
                  ? [...prev.cameras, payload.new]
                  : prev.cameras.map(c => c.id === payload.new?.id ? payload.new : c)
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
