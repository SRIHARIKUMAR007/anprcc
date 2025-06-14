
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
