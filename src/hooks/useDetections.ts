
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Detection } from '@/types/supabase';
import { useAuth } from './useAuth';

export const useDetections = () => {
  const [detections, setDetections] = useState<Detection[]>([]);
  const { user } = useAuth();
  const channelRef = useRef<any>(null);

  useEffect(() => {
    if (!user) return;

    const loadDetections = async () => {
      try {
        console.log('Loading detections...');
        const { data, error } = await supabase
          .from('detections')
          .select('*')
          .order('timestamp', { ascending: false })
          .limit(50);
        
        if (error) {
          console.error('Error loading detections:', error);
        } else if (data) {
          console.log('Loaded detections:', data.length);
          const typedDetections = data.map(detection => ({
            ...detection,
            status: detection.status as 'cleared' | 'flagged' | 'processing'
          }));
          setDetections(typedDetections);
        }
      } catch (error) {
        console.error('Error loading detections:', error);
      }
    };

    loadDetections();

    // Set up real-time subscription
    channelRef.current = supabase
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

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
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

  return { detections, addDetection };
};
