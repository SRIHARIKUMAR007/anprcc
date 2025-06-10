
import { useState, useEffect } from 'react';
import { supabase, getRecentDetections, getSystemStats } from '@/lib/supabase';

export interface Detection {
  id: number;
  plate_number: string;
  camera_id: string;
  confidence: number;
  timestamp: string;
  location: string;
  status: string;
  vehicle_type?: string;
}

export interface SystemStats {
  detected_today: number;
  detected_this_hour: number;
  accuracy_rate: number;
  processing_speed: number;
  active_cameras: number;
  total_cameras: number;
  alerts_active: number;
  network_latency: number;
  system_load: number;
  storage_used: number;
  blacklist_hits: number;
  flagged_vehicles: number;
}

export const useRealTimeDetections = (initialLimit = 10) => {
  const [detections, setDetections] = useState<Detection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let subscription: any;

    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const initialData = await getRecentDetections(initialLimit);
        setDetections(initialData as Detection[]);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    const setupSubscription = () => {
      subscription = supabase
        .channel('public:detections')
        .on('postgres_changes', 
          { event: 'INSERT', schema: 'public', table: 'detections' }, 
          (payload) => {
            setDetections(current => [payload.new as Detection, ...current.slice(0, initialLimit - 1)]);
          }
        )
        .subscribe();
    };

    fetchInitialData();
    setupSubscription();

    return () => {
      if (subscription) {
        supabase.removeChannel(subscription);
      }
    };
  }, [initialLimit]);

  return { detections, loading, error };
};

export const useSystemStats = () => {
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let subscription: any;
    
    const fetchInitialStats = async () => {
      try {
        setLoading(true);
        const initialStats = await getSystemStats();
        setStats(initialStats as SystemStats);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    const setupSubscription = () => {
      subscription = supabase
        .channel('public:system_stats')
        .on('postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'system_stats' },
          (payload) => {
            setStats(payload.new as SystemStats);
          }
        )
        .subscribe();
    };

    fetchInitialStats();
    setupSubscription();

    return () => {
      if (subscription) {
        supabase.removeChannel(subscription);
      }
    };
  }, []);

  return { stats, loading, error };
};
