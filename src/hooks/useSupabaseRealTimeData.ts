
import { useState, useEffect, useRef } from 'react';
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
  ip_address?: string | null;
  last_heartbeat?: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export const useSupabaseRealTimeData = () => {
  const [detections, setDetections] = useState<Detection[]>([]);
  const [systemStats, setSystemStats] = useState<SystemStats | null>(null);
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const { user } = useAuth();
  const channelsRef = useRef<any[]>([]);

  useEffect(() => {
    if (!user) return;

    // Clean up any existing channels first
    channelsRef.current.forEach(channel => {
      supabase.removeChannel(channel);
    });
    channelsRef.current = [];

    // Load initial data
    const loadInitialData = async () => {
      try {
        console.log('Loading initial data...');
        
        // Load recent detections
        const { data: detectionsData, error: detectionsError } = await supabase
          .from('detections')
          .select('*')
          .order('timestamp', { ascending: false })
          .limit(50);
        
        if (detectionsError) {
          console.error('Error loading detections:', detectionsError);
        } else if (detectionsData) {
          console.log('Loaded detections:', detectionsData.length);
          const typedDetections = detectionsData.map(detection => ({
            ...detection,
            status: detection.status as 'cleared' | 'flagged' | 'processing'
          }));
          setDetections(typedDetections);
        }

        // Load latest system stats
        const { data: statsData, error: statsError } = await supabase
          .from('system_stats')
          .select('*')
          .order('timestamp', { ascending: false })
          .limit(1);
        
        if (statsError) {
          console.error('Error loading system stats:', statsError);
        } else if (statsData && statsData.length > 0) {
          console.log('Loaded system stats:', statsData[0]);
          setSystemStats(statsData[0]);
        }

        // Load cameras
        const { data: camerasData, error: camerasError } = await supabase
          .from('cameras')
          .select('*')
          .order('camera_id');
        
        if (camerasError) {
          console.error('Error loading cameras:', camerasError);
        } else if (camerasData) {
          console.log('Loaded cameras:', camerasData.length);
          const typedCameras = camerasData.map(camera => ({
            ...camera,
            status: camera.status as 'active' | 'inactive' | 'maintenance',
            ip_address: camera.ip_address as string | null
          }));
          setCameras(typedCameras);
        }

        setIsConnected(true);
        console.log('Initial data loading complete');
      } catch (error) {
        console.error('Error loading initial data:', error);
        setIsConnected(false);
      }
    };

    loadInitialData();

    // Set up real-time subscriptions with unique channel names
    const detectionsChannel = supabase
      .channel(`detections_realtime_${Date.now()}_${Math.random()}`)
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'detections' }, 
        (payload) => {
          console.log('New detection received:', payload.new);
          const newDetection = {
            ...payload.new,
            status: payload.new.status as 'cleared' | 'flagged' | 'processing'
          } as Detection;
          setDetections(prev => [newDetection, ...prev.slice(0, 49)]);
        }
      )
      .on('postgres_changes', 
        { event: 'UPDATE', schema: 'public', table: 'detections' }, 
        (payload) => {
          console.log('Detection updated:', payload.new);
          const updatedDetection = {
            ...payload.new,
            status: payload.new.status as 'cleared' | 'flagged' | 'processing'
          } as Detection;
          setDetections(prev => prev.map(d => d.id === updatedDetection.id ? updatedDetection : d));
        }
      )
      .subscribe();

    const statsChannel = supabase
      .channel(`system_stats_realtime_${Date.now()}_${Math.random()}`)
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'system_stats' }, 
        (payload) => {
          console.log('New system stats received:', payload.new);
          setSystemStats(payload.new as SystemStats);
        }
      )
      .subscribe();

    const camerasChannel = supabase
      .channel(`cameras_realtime_${Date.now()}_${Math.random()}`)
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'cameras' }, 
        (payload) => {
          console.log('Camera update received:', payload);
          // Reload cameras data
          loadInitialData();
        }
      )
      .subscribe();

    channelsRef.current = [detectionsChannel, statsChannel, camerasChannel];

    return () => {
      channelsRef.current.forEach(channel => {
        supabase.removeChannel(channel);
      });
      channelsRef.current = [];
    };
  }, [user]);

  const addDetection = async (detection: Omit<Detection, 'id' | 'timestamp'>) => {
    if (!user) {
      console.error('User not authenticated');
      return false;
    }

    try {
      console.log('Adding detection:', detection);
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
      console.log('Detection added successfully');
      return true;
    } catch (error) {
      console.error('Error adding detection:', error);
      return false;
    }
  };

  const updateSystemStats = async (stats: Partial<Omit<SystemStats, 'id' | 'timestamp'>>) => {
    if (!user) {
      console.error('User not authenticated');
      return false;
    }

    try {
      console.log('Updating system stats:', stats);
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
      console.log('System stats updated successfully');
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
