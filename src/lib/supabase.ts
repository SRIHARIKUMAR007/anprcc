
import { supabase } from '@/integrations/supabase/client';

// Vehicle related functions
export const getVehicleByPlate = async (plateNumber: string) => {
  try {
    const { data, error } = await supabase
      .from('detections')
      .select('*')
      .eq('plate_number', plateNumber)
      .order('timestamp', { ascending: false })
      .limit(1);
      
    if (error) {
      console.error('Error fetching vehicle data:', error);
      return null;
    }
    
    return data?.[0] || null;
  } catch (error) {
    console.error('Error fetching vehicle data:', error);
    return null;
  }
};

export const logVehicleDetection = async (detectionData: {
  plate_number: string;
  camera_id: string;
  confidence: number;
  timestamp: string;
  location: string;
}) => {
  try {
    const { error } = await supabase
      .from('detections')
      .insert([detectionData]);
      
    if (error) {
      console.error('Error logging detection:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error logging detection:', error);
    return false;
  }
};

export const getRecentDetections = async (limit = 10) => {
  try {
    const { data, error } = await supabase
      .from('detections')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(limit);
      
    if (error) {
      console.error('Error fetching recent detections:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching recent detections:', error);
    return [];
  }
};

export const getSystemStats = async () => {
  try {
    const { data, error } = await supabase
      .from('system_stats')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(1)
      .single();
      
    if (error) {
      console.error('Error fetching system stats:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching system stats:', error);
    return null;
  }
};

export const watchLiveDetections = () => {
  return supabase
    .channel('public:detections')
    .on('postgres_changes', 
      { event: 'INSERT', schema: 'public', table: 'detections' }, 
      (payload) => {
        return payload.new;
      }
    )
    .subscribe();
};

export const getVehicleStatistics = async () => {
  try {
    // Get aggregated statistics from detections
    const { data, error } = await supabase
      .from('detections')
      .select('status, confidence')
      .gte('timestamp', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());
      
    if (error) {
      console.error('Error fetching vehicle statistics:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching vehicle statistics:', error);
    return null;
  }
};

// Export the supabase client
export { supabase };
