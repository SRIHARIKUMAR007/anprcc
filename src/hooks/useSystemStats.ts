
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { SystemStats } from '@/types/supabase';
import { useAuth } from './useAuth';

export const useSystemStats = () => {
  const [systemStats, setSystemStats] = useState<SystemStats | null>(null);
  const { user } = useAuth();
  const channelRef = useRef<any>(null);

  useEffect(() => {
    if (!user) return;

    const loadSystemStats = async () => {
      try {
        console.log('Loading system stats...');
        const { data, error } = await supabase
          .from('system_stats')
          .select('*')
          .order('timestamp', { ascending: false })
          .limit(1);
        
        if (error) {
          console.error('Error loading system stats:', error);
        } else if (data && data.length > 0) {
          console.log('Loaded system stats:', data[0]);
          setSystemStats(data[0]);
        }
      } catch (error) {
        console.error('Error loading system stats:', error);
      }
    };

    loadSystemStats();

    // Set up real-time subscription
    channelRef.current = supabase
      .channel(`system_stats_realtime_${Date.now()}_${Math.random()}`)
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'system_stats' }, 
        (payload) => {
          console.log('New system stats received:', payload.new);
          setSystemStats(payload.new as SystemStats);
        }
      )
      .subscribe();

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [user]);

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

  return { systemStats, updateSystemStats };
};
