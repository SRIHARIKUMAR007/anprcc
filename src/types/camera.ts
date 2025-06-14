
export interface LiveFeedCamera {
  id: string;
  location: string;
  status: 'active' | 'inactive' | 'maintenance';
  vehicles: number;
  fps: number;
  resolution: string;
  coordinates: { lat: number; lng: number };
  direction: string;
}

export interface CameraSelectorCamera {
  id: string;
  location: string;
  status: string;
  vehicles: number;
  fps: number;
  resolution: string;
  coordinates: { lat: number; lng: number };
  direction: string;
}

export interface CameraNetworkCamera {
  id: string;
  location: string;
  status: string;
  vehicles: number;
  fps: number;
  resolution: string;
}
