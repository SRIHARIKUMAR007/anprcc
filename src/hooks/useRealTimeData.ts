
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface Detection {
  id: string;
  plate_number: string;
  camera_id: string;
  confidence: number;
  timestamp: string;
  location: string;
  status?: 'cleared' | 'flagged';
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

export const useRealTimeData = () => {
  const [detections, setDetections] = useState<Detection[]>([]);
  const [systemStats, setSystemStats] = useState<SystemStats | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  // Mock data generator for when Supabase is not connected
  const generateMockDetection = (): Detection => {
    const states = ['DL', 'MH', 'UP', 'GJ', 'KA', 'TN', 'AP'];
    const state = states[Math.floor(Math.random() * states.length)];
    const numbers = Math.floor(10 + Math.random() * 89);
    const letters = String.fromCharCode(65 + Math.floor(Math.random() * 26)) + 
                   String.fromCharCode(65 + Math.floor(Math.random() * 26));
    const digits = Math.floor(1000 + Math.random() * 9000);
    
    return {
      id: Date.now().toString(),
      plate_number: `${state}-${numbers}-${letters}-${digits}`,
      camera_id: `CAM-${String(Math.floor(Math.random() * 8) + 1).padStart(2, '0')}`,
      confidence: Math.floor(85 + Math.random() * 15),
      timestamp: new Date().toISOString(),
      location: ['Highway Junction', 'Main Gate', 'Toll Plaza', 'Parking Entrance'][Math.floor(Math.random() * 4)],
      status: Math.random() > 0.85 ? 'flagged' : 'cleared'
    };
  };

  const generateMockStats = (): SystemStats => ({
    id: Date.now().toString(),
    timestamp: new Date().toISOString(),
    active_cameras: 7 + Math.floor(Math.random() * 2),
    total_cameras: 10,
    detections_today: 2847 + Math.floor(Math.random() * 50),
    detections_hour: 127 + Math.floor(Math.random() * 10),
    accuracy_rate: 95 + Math.random() * 3,
    cpu_usage: 65 + Math.random() * 10,
    memory_usage: 70 + Math.random() * 10,
    network_latency: 20 + Math.random() * 10
  });

  useEffect(() => {
    if (supabase) {
      // Real-time subscription to detections
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

      // Real-time subscription to system stats
      const statsChannel = supabase
        .channel('system_stats')
        .on('postgres_changes', 
          { event: 'INSERT', schema: 'public', table: 'system_stats' }, 
          (payload) => {
            setSystemStats(payload.new as SystemStats);
          }
        )
        .subscribe();

      setIsConnected(true);

      return () => {
        supabase.removeChannel(detectionsChannel);
        supabase.removeChannel(statsChannel);
      };
    } else {
      // Use mock data when Supabase is not connected
      console.log('Supabase not connected, using mock real-time data');
      
      const interval = setInterval(() => {
        // Add new mock detection
        const newDetection = generateMockDetection();
        setDetections(prev => [newDetection, ...prev.slice(0, 9)]);
        
        // Update mock stats
        setSystemStats(generateMockStats());
      }, 3000);

      // Initialize with some mock data
      const initialDetections = Array.from({ length: 5 }, generateMockDetection);
      setDetections(initialDetections);
      setSystemStats(generateMockStats());

      return () => clearInterval(interval);
    }
  }, []);

  const addDetection = async (detection: Omit<Detection, 'id' | 'timestamp'>) => {
    if (supabase) {
      const { error } = await supabase
        .from('detections')
        .insert([{
          ...detection,
          timestamp: new Date().toISOString()
        }]);
      
      if (error) {
        console.error('Error adding detection:', error);
        return false;
      }
      return true;
    } else {
      // Mock add for demo
      const newDetection: Detection = {
        ...detection,
        id: Date.now().toString(),
        timestamp: new Date().toISOString()
      };
      setDetections(prev => [newDetection, ...prev.slice(0, 9)]);
      return true;
    }
  };

  const updateSystemStats = async (stats: Partial<SystemStats>) => {
    if (supabase) {
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
    } else {
      // Mock update for demo
      setSystemStats(prev => prev ? { ...prev, ...stats } : generateMockStats());
      return true;
    }
  };

  return {
    detections,
    systemStats,
    isConnected,
    addDetection,
    updateSystemStats
  };
};
