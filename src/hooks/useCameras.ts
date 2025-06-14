
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Camera } from '@/types/supabase';
import { useAuth } from './useAuth';

export const useCameras = () => {
  const [cameras, setCameras] = useState<Camera[]>([]);
  const { user } = useAuth();
  const channelRef = useRef<any>(null);

  useEffect(() => {
    if (!user) return;

    const loadCameras = async () => {
      try {
        console.log('Loading cameras...');
        const { data, error } = await supabase
          .from('cameras')
          .select('*')
          .order('camera_id');
        
        if (error) {
          console.error('Error loading cameras:', error);
        } else if (data) {
          console.log('Loaded cameras:', data.length);
          const typedCameras = data.map(camera => ({
            ...camera,
            status: camera.status as 'active' | 'inactive' | 'maintenance',
            ip_address: camera.ip_address as string | null
          }));
          setCameras(typedCameras);
        }
      } catch (error) {
        console.error('Error loading cameras:', error);
      }
    };

    loadCameras();

    // Set up real-time subscription
    channelRef.current = supabase
      .channel(`cameras_realtime_${Date.now()}_${Math.random()}`)
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'cameras' }, 
        (payload) => {
          console.log('Camera update received:', payload);
          loadCameras(); // Reload cameras data
        }
      )
      .subscribe();

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [user]);

  return { cameras };
};
