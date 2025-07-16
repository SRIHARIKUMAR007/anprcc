import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  MapPin, 
  Camera, 
  AlertTriangle, 
  Activity,
  Zap,
  Car,
  Clock,
  Navigation,
  Radio,
  Wifi,
  Database
} from "lucide-react";
import { useRealTimeIntegration } from '@/hooks/useRealTimeIntegration';

interface LocationData {
  id: string;
  name: string;
  district: string;
  coordinates: [number, number];
  cameras: number;
  activeCameras: number;
  vehicleCount: number;
  incidents: number;
  averageSpeed: number;
  congestionLevel: 'low' | 'medium' | 'high';
  lastUpdate: string;
}

const RealTimeMonitor = () => {
  const { liveData, isLiveMode, toggleLiveMode, getEnhancedSystemMetrics, detections, cameras } = useRealTimeIntegration();
  const [selectedDistrict, setSelectedDistrict] = useState('All Districts');
  const [locationData, setLocationData] = useState<LocationData[]>([]);
  const [systemMetrics, setSystemMetrics] = useState(getEnhancedSystemMetrics());

  // Tamil Nadu districts and key locations
  const tamilNaduLocations: LocationData[] = [
    {
      id: 'CHN-001',
      name: 'Chennai Central - Anna Salai',
      district: 'Chennai',
      coordinates: [13.0827, 80.2707],
      cameras: 8,
      activeCameras: 7,
      vehicleCount: 234,
      incidents: 1,
      averageSpeed: 35,
      congestionLevel: 'high',
      lastUpdate: new Date().toISOString()
    },
    {
      id: 'CHN-002', 
      name: 'OMR IT Corridor',
      district: 'Chennai',
      coordinates: [12.9716, 80.2431],
      cameras: 12,
      activeCameras: 11,
      vehicleCount: 456,
      incidents: 2,
      averageSpeed: 28,
      congestionLevel: 'high',
      lastUpdate: new Date().toISOString()
    },
    {
      id: 'CBE-001',
      name: 'Coimbatore - Avinashi Road',
      district: 'Coimbatore',
      coordinates: [11.0168, 76.9558],
      cameras: 6,
      activeCameras: 6,
      vehicleCount: 89,
      incidents: 0,
      averageSpeed: 45,
      congestionLevel: 'medium',
      lastUpdate: new Date().toISOString()
    },
    {
      id: 'MDU-001',
      name: 'Madurai - Bypass Junction',
      district: 'Madurai',
      coordinates: [9.9252, 78.1198],
      cameras: 5,
      activeCameras: 4,
      vehicleCount: 67,
      incidents: 0,
      averageSpeed: 52,
      congestionLevel: 'low',
      lastUpdate: new Date().toISOString()
    },
    {
      id: 'TCY-001',
      name: 'Trichy - Main Junction',
      district: 'Tiruchirappalli',
      coordinates: [10.7905, 78.7047],
      cameras: 4,
      activeCameras: 4,
      vehicleCount: 45,
      incidents: 0,
      averageSpeed: 48,
      congestionLevel: 'low',
      lastUpdate: new Date().toISOString()
    },
    {
      id: 'SLM-001',
      name: 'Salem - Bangalore Highway',
      district: 'Salem',
      coordinates: [11.6643, 78.1460],
      cameras: 3,
      activeCameras: 3,
      vehicleCount: 34,
      incidents: 0,
      averageSpeed: 65,
      congestionLevel: 'low',
      lastUpdate: new Date().toISOString()
    },
    {
      id: 'VLR-001',
      name: 'Vellore - Chennai Highway',
      district: 'Vellore',
      coordinates: [12.9165, 79.1325],
      cameras: 2,
      activeCameras: 1,
      vehicleCount: 23,
      incidents: 1,
      averageSpeed: 0,
      congestionLevel: 'low',
      lastUpdate: new Date().toISOString()
    },
    {
      id: 'TNV-001',
      name: 'Tirunelveli - Highway Entry',
      district: 'Tirunelveli',
      coordinates: [8.7139, 77.7567],
      cameras: 2,
      activeCameras: 2,
      vehicleCount: 18,
      incidents: 0,
      averageSpeed: 58,
      congestionLevel: 'low',
      lastUpdate: new Date().toISOString()
    }
  ];

  const districts = ['All Districts', ...Array.from(new Set(tamilNaduLocations.map(loc => loc.district)))];

  // Initialize location data
  useEffect(() => {
    setLocationData(tamilNaduLocations);
  }, []);

  // Real-time updates simulation
  useEffect(() => {
    if (!isLiveMode) return;

    const interval = setInterval(() => {
      setLocationData(prev => prev.map(location => ({
        ...location,
        vehicleCount: Math.max(0, location.vehicleCount + Math.floor(Math.random() * 20 - 10)),
        averageSpeed: location.activeCameras > 0 ? 
          Math.max(15, Math.min(80, location.averageSpeed + Math.floor(Math.random() * 10 - 5))) : 0,
        incidents: Math.random() > 0.95 ? location.incidents + 1 : 
                  Math.random() > 0.98 ? Math.max(0, location.incidents - 1) : location.incidents,
        congestionLevel: Math.random() > 0.8 ? 
          (['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high') : 
          location.congestionLevel,
        lastUpdate: new Date().toISOString()
      })));

      setSystemMetrics(getEnhancedSystemMetrics());
    }, 2000);

    return () => clearInterval(interval);
  }, [isLiveMode, getEnhancedSystemMetrics]);

  const filteredLocations = selectedDistrict === 'All Districts' ? 
    locationData : locationData.filter(loc => loc.district === selectedDistrict);

  const getCongestionColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-green-500/20 text-green-400 border-green-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Real-time Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center space-x-3">
          <Activity className="w-6 h-6 text-blue-400" />
          <div>
            <h2 className="text-xl font-bold text-white">Tamil Nadu Real-Time Traffic Monitor</h2>
            <p className="text-slate-400 text-sm">Live data from {locationData.length} key locations across TN</p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {districts.map(district => (
              <option key={district} value={district}>{district}</option>
            ))}
          </select>
          
          <Button
            variant={isLiveMode ? "default" : "outline"}
            size="sm"
            onClick={toggleLiveMode}
            className="flex items-center space-x-2"
          >
            <Radio className={`w-4 h-4 ${isLiveMode ? 'animate-pulse' : ''}`} />
            <span>{isLiveMode ? 'LIVE' : 'PAUSED'}</span>
          </Button>
          
          <Badge variant="secondary" className={`${isLiveMode ? 'bg-green-500/20 text-green-400 border-green-500/30 animate-pulse' : 'bg-gray-500/20 text-gray-400 border-gray-500/30'}`}>
            {isLiveMode ? 'REAL-TIME ACTIVE' : 'STATIC MODE'}
          </Badge>
        </div>
      </div>

      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-400">Total Detections</div>
                <div className="text-2xl font-bold text-white">{systemMetrics.totalDetections}</div>
              </div>
              <Database className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-400">Active Cameras</div>
                <div className="text-2xl font-bold text-white">
                  {systemMetrics.activeCameras}/{systemMetrics.totalCameras}
                </div>
              </div>
              <Camera className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-400">Flagged Vehicles</div>
                <div className="text-2xl font-bold text-white">{systemMetrics.flaggedDetections}</div>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-400">System Uptime</div>
                <div className="text-2xl font-bold text-white">{systemMetrics.systemUptime}</div>
              </div>
              <Wifi className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Location-Based Real-Time Data */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <span className="flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              Live Location Data ({filteredLocations.length} locations)
            </span>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${isLiveMode ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`}></div>
              <span className="text-sm text-slate-400">
                Last update: {new Date().toLocaleTimeString()}
              </span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredLocations.map((location) => (
              <div key={location.id} className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/50 hover:border-blue-500/30 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Navigation className="w-4 h-4 text-blue-400" />
                    <span className="font-mono text-sm text-white font-bold">{location.id}</span>
                  </div>
                  <Badge variant="secondary" className={getCongestionColor(location.congestionLevel)}>
                    {location.congestionLevel.toUpperCase()}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="text-sm text-slate-300 font-medium">{location.name}</div>
                  <div className="text-xs text-slate-400">{location.district} District</div>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs pt-2">
                    <div className="flex items-center space-x-1">
                      <Camera className="w-3 h-3 text-blue-400" />
                      <span className="text-slate-300">{location.activeCameras}/{location.cameras}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Car className="w-3 h-3 text-green-400" />
                      <span className="text-slate-300">{location.vehicleCount}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Zap className="w-3 h-3 text-yellow-400" />
                      <span className="text-slate-300">{location.averageSpeed} km/h</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <AlertTriangle className="w-3 h-3 text-red-400" />
                      <span className="text-slate-300">{location.incidents} alerts</span>
                    </div>
                  </div>
                  
                  <div className="pt-2 text-xs text-slate-400 flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    Updated: {new Date(location.lastUpdate).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Real-Time Detections */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Zap className="w-5 h-5 mr-2" />
            Recent Real-Time Detections (Last 10)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {detections.slice(0, 10).map((detection, index) => (
              <div 
                key={detection.id} 
                className={`flex items-center justify-between p-3 bg-slate-700/30 rounded-lg border border-slate-600/50 ${
                  index === 0 && isLiveMode ? 'border-green-500/30 bg-green-500/5 animate-pulse' : ''
                }`}
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-mono text-white font-bold text-sm">{detection.plate_number}</span>
                    <Badge 
                      variant="secondary"
                      className={detection.status === 'flagged' ? 
                        'bg-red-500/20 text-red-400 border-red-500/30' : 
                        'bg-green-500/20 text-green-400 border-green-500/30'
                      }
                    >
                      {detection.status}
                    </Badge>
                  </div>
                  <div className="text-xs text-slate-400">
                    {detection.location} • {detection.camera_id} • {detection.confidence}%
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-400">
                    {new Date(detection.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RealTimeMonitor;
