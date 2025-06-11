
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface Detection {
  id: string;
  plate_number: string;
  camera_id: string;
  confidence: number;
  timestamp: string;
  location: string;
  status: 'cleared' | 'flagged' | 'processing';
  image_url?: string;
  user_id?: string;
}

export interface SystemStats {
  id: string;
  timestamp: string;
  active_cameras: number;
  total_cameras: number;
  detections_today: number;
  detections_hour: number;
  accuracy_rate: number;
  cpu_usage: number;
  memory_usage: number;
  network_latency: number;
}

export interface Camera {
  id: string;
  camera_id: string;
  location: string;
  status: 'active' | 'inactive' | 'maintenance';
  ip_address?: string;
  last_heartbeat?: string;
  created_at: string;
  updated_at: string;
}

export const useSupabaseRealTimeData = () => {
  const [detections, setDetections] = useState<Detection[]>([]);
  const [systemStats, setSystemStats] = useState<SystemStats | null>(null);
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    // Load initial data
    const loadInitialData = async () => {
      try {
        // Load recent detections
        const { data: detectionsData } = await supabase
          .from('detections')
          .select('*')
          .order('timestamp', { ascending: false })
          .limit(10);
        
        if (detectionsData) {
          setDetections(detectionsData as Detection[]);
        }

        // Load latest system stats
        const { data: statsData } = await supabase
          .from('system_stats')
          .select('*')
          .order('timestamp', { ascending: false })
          .limit(1)
          .single();
        
        if (statsData) {
          setSystemStats(statsData as SystemStats);
        }

        // Load cameras
        const { data: camerasData } = await supabase
          .from('cameras')
          .select('*')
          .order('camera_id');
        
        if (camerasData) {
          setCameras(camerasData as Camera[]);
        }

        setIsConnected(true);
      } catch (error) {
        console.error('Error loading initial data:', error);
      }
    };

    loadInitialData();

    // Set up real-time subscriptions
    const detectionsChannel = supabase
      .channel('detections')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'detections' }, 
        (payload) => {
          const newDetection = payload.new as Detection;
          setDetections(prev => [newDetection, ...prev.slice(0, 9)]);
        }
      )
      .subscribe();

    const statsChannel = supabase
      .channel('system_stats')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'system_stats' }, 
        (payload) => {
          setSystemStats(payload.new as SystemStats);
        }
      )
      .subscribe();

    const camerasChannel = supabase
      .channel('cameras')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'cameras' }, 
        () => {
          // Reload cameras on any change
          loadInitialData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(detectionsChannel);
      supabase.removeChannel(statsChannel);
      supabase.removeChannel(camerasChannel);
    };
  }, [user]);

  const addDetection = async (detection: Omit<Detection, 'id' | 'timestamp'>) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('detections')
        .insert([{
          ...detection,
          user_id: user.id,
          timestamp: new Date().toISOString()
        }]);
      
      if (error) {
        console.error('Error adding detection:', error);
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error adding detection:', error);
      return false;
    }
  };

  const updateSystemStats = async (stats: Partial<Omit<SystemStats, 'id' | 'timestamp'>>) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('system_stats')
        .insert([{
          ...stats,
          timestamp: new Date().toISOString()
        }]);
      
      if (error) {
        console.error('Error updating system stats:', error);
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error updating system stats:', error);
      return false;
    }
  };

  return {
    detections,
    systemStats,
    cameras,
    isConnected,
    addDetection,
    updateSystemStats
  };
};
