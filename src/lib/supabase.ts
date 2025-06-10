
import { createClient } from '@supabase/supabase-js';

// These will be replaced with your actual Supabase URL and anon key
// after connecting your project to Supabase through Lovable's integration
const supabaseUrl = 'your_supabase_url';
const supabaseAnonKey = 'your_supabase_anon_key';

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Vehicle related functions
export const getVehicleByPlate = async (plateNumber: string) => {
  const { data, error } = await supabase
    .from('vehicles')
    .select(`
      *,
      registration_details:registration_details(*),
      vehicle_details:vehicle_details(*),
      insurance:insurance(*),
      violations:violations(*)
    `)
    .eq('plate_number', plateNumber)
    .single();
    
  if (error) {
    console.error('Error fetching vehicle data:', error);
    return null;
  }
  
  return data;
};

export const logVehicleDetection = async (detectionData: {
  plate_number: string;
  camera_id: string;
  confidence: number;
  timestamp: string;
  location: string;
}) => {
  const { error } = await supabase
    .from('detections')
    .insert([detectionData]);
    
  if (error) {
    console.error('Error logging detection:', error);
    return false;
  }
  
  return true;
};

export const getRecentDetections = async (limit = 10) => {
  const { data, error } = await supabase
    .from('detections')
    .select('*')
    .order('timestamp', { ascending: false })
    .limit(limit);
    
  if (error) {
    console.error('Error fetching recent detections:', error);
    return [];
  }
  
  return data;
};

export const getSystemStats = async () => {
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
  const { data, error } = await supabase
    .rpc('get_vehicle_statistics');
    
  if (error) {
    console.error('Error fetching vehicle statistics:', error);
    return null;
  }
  
  return data;
};
