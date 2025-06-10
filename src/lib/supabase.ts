
import { createClient } from '@supabase/supabase-js';

// These will be replaced with your actual Supabase URL and anon key
// after connecting your project to Supabase through Lovable's integration
const supabaseUrl = 'your_supabase_url';
const supabaseAnonKey = 'your_supabase_anon_key';

// Validate URL before creating client
const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Only create client if we have valid credentials
const createSupabaseClient = () => {
  if (!isValidUrl(supabaseUrl) || supabaseAnonKey === 'your_supabase_anon_key') {
    console.warn('Supabase not configured. Using mock data for demo purposes.');
    return null;
  }
  return createClient(supabaseUrl, supabaseAnonKey);
};

// Create a single supabase client for interacting with your database
export const supabase = createSupabaseClient();

// Vehicle related functions
export const getVehicleByPlate = async (plateNumber: string) => {
  if (!supabase) {
    console.log('Supabase not configured, returning null');
    return null;
  }

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
  if (!supabase) {
    console.log('Supabase not configured, skipping detection log');
    return false;
  }

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
  if (!supabase) {
    console.log('Supabase not configured, returning empty array');
    return [];
  }

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
  if (!supabase) {
    console.log('Supabase not configured, returning null');
    return null;
  }

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
  if (!supabase) {
    console.log('Supabase not configured, returning null subscription');
    return null;
  }

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
  if (!supabase) {
    console.log('Supabase not configured, returning null');
    return null;
  }

  const { data, error } = await supabase
    .rpc('get_vehicle_statistics');
    
  if (error) {
    console.error('Error fetching vehicle statistics:', error);
    return null;
  }
  
  return data;
};
