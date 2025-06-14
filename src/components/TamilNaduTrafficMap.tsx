
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  MapPin, 
  Camera, 
  AlertTriangle, 
  Navigation, 
  Zap,
  Activity,
  Car,
  Clock
} from "lucide-react";

interface TrafficCamera {
  id: string;
  location: string;
  city: string;
  coordinates: [number, number];
  status: 'active' | 'maintenance' | 'offline';
  vehicleCount: number;
  averageSpeed: number;
  congestionLevel: 'low' | 'medium' | 'high';
}

interface TrafficIncident {
  id: string;
  type: 'accident' | 'congestion' | 'roadwork' | 'weather';
  location: string;
  severity: 'low' | 'medium' | 'high';
  timestamp: string;
  description: string;
}

const TamilNaduTrafficMap = () => {
  const [selectedCity, setSelectedCity] = useState('Chennai');
  const [cameras, setCameras] = useState<TrafficCamera[]>([]);
  const [incidents, setIncidents] = useState<TrafficIncident[]>([]);
  const [isLiveMode, setIsLiveMode] = useState(true);

  const tamilNaduCities = [
    'Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 
    'Tirunelveli', 'Vellore', 'Erode', 'Thoothukudi', 'Thanjavur'
  ];

  // Initialize Tamil Nadu traffic cameras
  useEffect(() => {
    const initializeCameras = () => {
      const tamilNaduCameras: TrafficCamera[] = [
        // Chennai Cameras
        { id: 'TN-CHN-001', location: 'Anna Salai - Mount Road', city: 'Chennai', coordinates: [13.0827, 80.2707], status: 'active', vehicleCount: 45, averageSpeed: 35, congestionLevel: 'medium' },
        { id: 'TN-CHN-002', location: 'OMR - IT Corridor', city: 'Chennai', coordinates: [12.9716, 80.2431], status: 'active', vehicleCount: 67, averageSpeed: 25, congestionLevel: 'high' },
        { id: 'TN-CHN-003', location: 'GST Road - Airport', city: 'Chennai', coordinates: [12.9941, 80.1709], status: 'active', vehicleCount: 38, averageSpeed: 45, congestionLevel: 'low' },
        { id: 'TN-CHN-004', location: 'ECR - East Coast Road', city: 'Chennai', coordinates: [12.9279, 80.2284], status: 'active', vehicleCount: 29, averageSpeed: 55, congestionLevel: 'low' },
        
        // Coimbatore Cameras
        { id: 'TN-CBE-001', location: 'Avinashi Road', city: 'Coimbatore', coordinates: [11.0168, 76.9558], status: 'active', vehicleCount: 32, averageSpeed: 40, congestionLevel: 'medium' },
        { id: 'TN-CBE-002', location: 'Trichy Road', city: 'Coimbatore', coordinates: [11.0041, 77.0025], status: 'active', vehicleCount: 28, averageSpeed: 35, congestionLevel: 'medium' },
        
        // Madurai Cameras
        { id: 'TN-MDU-001', location: 'Alagarkoil Road', city: 'Madurai', coordinates: [9.9252, 78.1198], status: 'active', vehicleCount: 24, averageSpeed: 42, congestionLevel: 'low' },
        { id: 'TN-MDU-002', location: 'Bypass Road', city: 'Madurai', coordinates: [9.9197, 78.1378], status: 'active', vehicleCount: 31, averageSpeed: 38, congestionLevel: 'medium' },
        
        // Salem Cameras
        { id: 'TN-SLM-001', location: 'Bangalore Highway', city: 'Salem', coordinates: [11.6643, 78.1460], status: 'active', vehicleCount: 19, averageSpeed: 50, congestionLevel: 'low' },
        
        // Vellore Cameras
        { id: 'TN-VLR-001', location: 'Chennai-Bangalore Highway', city: 'Vellore', coordinates: [12.9165, 79.1325], status: 'maintenance', vehicleCount: 0, averageSpeed: 0, congestionLevel: 'low' }
      ];
      
      setCameras(tamilNaduCameras);
    };

    const initializeIncidents = () => {
      const tamilNaduIncidents: TrafficIncident[] = [
        {
          id: 'INC-001',
          type: 'congestion',
          location: 'OMR - Sholinganallur',
          severity: 'high',
          timestamp: new Date().toISOString(),
          description: 'Heavy traffic due to office hours rush'
        },
        {
          id: 'INC-002',
          type: 'roadwork',
          location: 'Anna Salai - Teynampet',
          severity: 'medium',
          timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
          description: 'Metro construction work in progress'
        },
        {
          id: 'INC-003',
          type: 'weather',
          location: 'ECR - Mahabalipuram',
          severity: 'low',
          timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
          description: 'Light rain affecting visibility'
        }
      ];
      
      setIncidents(tamilNaduIncidents);
    };

    initializeCameras();
    initializeIncidents();
  }, []);

  // Live updates simulation
  useEffect(() => {
    if (!isLiveMode) return;

    const interval = setInterval(() => {
      setCameras(prev => prev.map(camera => ({
        ...camera,
        vehicleCount: Math.max(0, camera.vehicleCount + Math.floor(Math.random() * 10 - 5)),
        averageSpeed: Math.max(10, Math.min(80, camera.averageSpeed + Math.floor(Math.random() * 20 - 10))),
        congestionLevel: Math.random() > 0.7 ? 
          (['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high') : 
          camera.congestionLevel
      })));

      // Occasionally add new incidents
      if (Math.random() > 0.9) {
        const newIncident: TrafficIncident = {
          id: `INC-${Date.now()}`,
          type: ['accident', 'congestion', 'roadwork'][Math.floor(Math.random() * 3)] as 'accident' | 'congestion' | 'roadwork',
          location: `${tamilNaduCities[Math.floor(Math.random() * tamilNaduCities.length)]} - Random Location`,
          severity: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high',
          timestamp: new Date().toISOString(),
          description: 'Live incident detected by traffic monitoring system'
        };
        
        setIncidents(prev => [newIncident, ...prev.slice(0, 9)]);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isLiveMode, tamilNaduCities]);

  const filteredCameras = cameras.filter(camera => 
    selectedCity === 'All Cities' || camera.city === selectedCity
  );

  const getCongestionColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-green-500/20 text-green-400 border-green-500/30';
    }
  };

  const getIncidentColor = (type: string) => {
    switch (type) {
      case 'accident': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'roadwork': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'weather': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default: return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center space-x-3">
          <MapPin className="w-6 h-6 text-blue-400" />
          <div>
            <h2 className="text-xl font-bold text-white">Tamil Nadu Traffic Monitor</h2>
            <p className="text-slate-400 text-sm">Live traffic cameras and incident tracking across TN</p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All Cities">All Cities</option>
            {tamilNaduCities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
          
          <Button
            variant={isLiveMode ? "default" : "outline"}
            size="sm"
            onClick={() => setIsLiveMode(!isLiveMode)}
            className="flex items-center space-x-2"
          >
            <Activity className={`w-4 h-4 ${isLiveMode ? 'animate-pulse' : ''}`} />
            <span>{isLiveMode ? 'Live' : 'Paused'}</span>
          </Button>
        </div>
      </div>

      {/* Traffic Cameras Grid */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <span className="flex items-center">
              <Camera className="w-5 h-5 mr-2" />
              Live Traffic Cameras ({filteredCameras.length})
            </span>
            <Badge variant="secondary" className={`${isLiveMode ? 'bg-green-500/20 text-green-400 border-green-500/30 animate-pulse' : 'bg-gray-500/20 text-gray-400 border-gray-500/30'}`}>
              {isLiveMode ? 'LIVE UPDATES' : 'STATIC'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredCameras.map((camera) => (
              <div key={camera.id} className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/50">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Camera className="w-4 h-4 text-blue-400" />
                    <span className="font-mono text-sm text-white font-bold">{camera.id}</span>
                  </div>
                  <Badge 
                    variant="secondary" 
                    className={camera.status === 'active' ? 
                      'bg-green-500/20 text-green-400 border-green-500/30' : 
                      'bg-red-500/20 text-red-400 border-red-500/30'
                    }
                  >
                    {camera.status}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="text-sm text-slate-300 font-medium">{camera.location}</div>
                  <div className="text-xs text-slate-400">{camera.city}, Tamil Nadu</div>
                  
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center space-x-1">
                      <Car className="w-3 h-3 text-cyan-400" />
                      <span className="text-xs text-slate-300">{camera.vehicleCount} vehicles</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Zap className="w-3 h-3 text-yellow-400" />
                      <span className="text-xs text-slate-300">{camera.averageSpeed} km/h</span>
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <Badge variant="secondary" className={getCongestionColor(camera.congestionLevel)}>
                      {camera.congestionLevel.toUpperCase()} Traffic
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Live Incidents */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" />
            Live Traffic Incidents ({incidents.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {incidents.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <AlertTriangle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No active incidents reported</p>
              </div>
            ) : (
              incidents.map((incident) => (
                <div key={incident.id} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg border border-slate-600/50">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <Badge variant="secondary" className={getIncidentColor(incident.type)}>
                        {incident.type.toUpperCase()}
                      </Badge>
                      <Badge variant="secondary" className={getCongestionColor(incident.severity)}>
                        {incident.severity.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="text-sm font-medium text-white">{incident.location}</div>
                    <div className="text-xs text-slate-400">{incident.description}</div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1 text-xs text-slate-400">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(incident.timestamp).toLocaleTimeString()}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats for Tamil Nadu */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-400">Active Cameras</div>
                <div className="text-2xl font-bold text-white">
                  {cameras.filter(c => c.status === 'active').length}
                </div>
              </div>
              <Camera className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-400">Total Vehicles</div>
                <div className="text-2xl font-bold text-white">
                  {cameras.reduce((sum, cam) => sum + cam.vehicleCount, 0)}
                </div>
              </div>
              <Car className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-400">Active Incidents</div>
                <div className="text-2xl font-bold text-white">{incidents.length}</div>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-400">Cities Covered</div>
                <div className="text-2xl font-bold text-white">{tamilNaduCities.length}</div>
              </div>
              <MapPin className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TamilNaduTrafficMap;
