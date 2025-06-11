
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Car, MapPin, Clock, Shield, Eye, AlertTriangle, Activity, Zap } from "lucide-react";
import { useSupabaseRealTimeData } from "@/hooks/useSupabaseRealTimeData";

const VehicleUpdates = () => {
  const { detections, addDetection, cameras } = useSupabaseRealTimeData();
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Simulate adding new detection for demo
  const simulateDetection = async () => {
    const randomCameras = ['CAM-01', 'CAM-02', 'CAM-03', 'CAM-04'];
    const randomLocations = ['Main Entrance', 'Parking Lot A', 'Highway Junction', 'Toll Plaza'];
    const plateFormats = ['DL', 'MH', 'UP', 'GJ', 'KA'];
    
    const mockDetection = {
      plate_number: `${plateFormats[Math.floor(Math.random() * plateFormats.length)]}-${String(Math.floor(10 + Math.random() * 89)).padStart(2, '0')}-${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}-${Math.floor(1000 + Math.random() * 9000)}`,
      camera_id: randomCameras[Math.floor(Math.random() * randomCameras.length)],
      confidence: Math.floor(85 + Math.random() * 15),
      location: randomLocations[Math.floor(Math.random() * randomLocations.length)],
      status: Math.random() > 0.8 ? 'flagged' : 'cleared' as 'cleared' | 'flagged' | 'processing'
    };

    await addDetection(mockDetection);
  };

  // Auto-refresh simulation
  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance to add new detection
        simulateDetection();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'flagged': return <AlertTriangle className="w-4 h-4 text-red-400" />;
      case 'processing': return <Clock className="w-4 h-4 text-yellow-400" />;
      default: return <Shield className="w-4 h-4 text-green-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'flagged': return 'border-l-red-500 bg-red-500/5';
      case 'processing': return 'border-l-yellow-500 bg-yellow-500/5';
      default: return 'border-l-green-500 bg-green-500/5';
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      {/* Header with controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Eye className="w-6 h-6 text-blue-400" />
          <div>
            <h2 className="text-xl font-bold text-white">Live Vehicle Updates</h2>
            <p className="text-slate-400 text-sm">Real-time ANPR detections and vehicle tracking</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant={autoRefresh ? "default" : "outline"}
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
            className="flex items-center space-x-2"
          >
            <Activity className={`w-4 h-4 ${autoRefresh ? 'animate-pulse' : ''}`} />
            <span>{autoRefresh ? 'Live' : 'Paused'}</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={simulateDetection}
            className="flex items-center space-x-2"
          >
            <Zap className="w-4 h-4" />
            <span>Add Detection</span>
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-400">Total Today</div>
                <div className="text-2xl font-bold text-white">{detections.length + 2847}</div>
              </div>
              <Car className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-400">Active Cameras</div>
                <div className="text-2xl font-bold text-white">{cameras.filter(c => c.status === 'active').length}</div>
              </div>
              <Eye className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-400">Flagged</div>
                <div className="text-2xl font-bold text-white">{detections.filter(d => d.status === 'flagged').length}</div>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-400">Last Hour</div>
                <div className="text-2xl font-bold text-white">{Math.floor(detections.length / 2) + 127}</div>
              </div>
              <Clock className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Live Updates Feed */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <span className="flex items-center">
              <Activity className="w-5 h-5 mr-2" />
              Live Vehicle Feed
            </span>
            <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30 animate-pulse">
              {autoRefresh ? 'LIVE' : 'PAUSED'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {detections.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <Car className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No vehicle detections yet</p>
                <p className="text-sm">Click "Add Detection" to simulate a vehicle detection</p>
              </div>
            ) : (
              detections.map((detection) => (
                <div 
                  key={detection.id}
                  className={`p-4 rounded-lg border-l-4 ${getStatusColor(detection.status)} transition-all duration-300 hover:bg-slate-700/30`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {getStatusIcon(detection.status)}
                      <div>
                        <div className="font-mono text-white font-bold text-lg">{detection.plate_number}</div>
                        <div className="flex items-center space-x-4 text-sm text-slate-400">
                          <span className="flex items-center">
                            <MapPin className="w-3 h-3 mr-1" />
                            {detection.location}
                          </span>
                          <span className="flex items-center">
                            <Eye className="w-3 h-3 mr-1" />
                            {detection.camera_id}
                          </span>
                          <span className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {formatTime(detection.timestamp)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge 
                        variant={detection.status === "flagged" ? "destructive" : "secondary"}
                        className="mb-2"
                      >
                        {detection.status.toUpperCase()}
                      </Badge>
                      <div className="text-sm text-slate-400">
                        Confidence: {detection.confidence}%
                      </div>
                      <div className="text-xs text-slate-500">
                        {formatDate(detection.timestamp)}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Camera Status */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Eye className="w-5 h-5 mr-2" />
            Camera Network Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {cameras.map((camera) => (
              <div key={camera.id} className="p-3 bg-slate-700/30 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-white">{camera.camera_id}</span>
                  <Badge 
                    variant={camera.status === 'active' ? 'default' : 'secondary'}
                    className={camera.status === 'active' ? 'bg-green-500/20 text-green-400 border-green-500/30' : ''}
                  >
                    {camera.status}
                  </Badge>
                </div>
                <div className="text-sm text-slate-400">{camera.location}</div>
                {camera.ip_address && (
                  <div className="text-xs text-slate-500 mt-1">{camera.ip_address}</div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VehicleUpdates;
