
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Radio, 
  Activity, 
  Database, 
  Zap, 
  Eye, 
  AlertTriangle,
  Camera,
  MapPin,
  Clock,
  TrendingUp,
  Signal,
  Wifi
} from "lucide-react";
import { useSupabaseRealTimeData } from '@/hooks/useSupabaseRealTimeData';

const LiveDataMonitor = () => {
  const { detections, cameras, systemStats, isConnected } = useSupabaseRealTimeData();
  const [liveMetrics, setLiveMetrics] = useState({
    detectionsPerMinute: 0,
    totalVehicles: 0,
    averageConfidence: 0,
    flaggedCount: 0,
    activeStreams: 0
  });
  const [isLive, setIsLive] = useState(true);

  // Calculate live metrics
  useEffect(() => {
    const calculateMetrics = () => {
      const now = new Date();
      const oneMinuteAgo = new Date(now.getTime() - 60000);
      
      const recentDetections = detections.filter(d => 
        new Date(d.timestamp) >= oneMinuteAgo
      );
      
      const flaggedDetections = detections.filter(d => d.status === 'flagged');
      const averageConf = detections.length > 0 ? 
        detections.reduce((acc, d) => acc + d.confidence, 0) / detections.length : 0;

      setLiveMetrics({
        detectionsPerMinute: recentDetections.length,
        totalVehicles: detections.length,
        averageConfidence: Math.round(averageConf),
        flaggedCount: flaggedDetections.length,
        activeStreams: cameras.filter(c => c.status === 'active').length
      });
    };

    calculateMetrics();
    
    if (isLive) {
      const interval = setInterval(calculateMetrics, 1000);
      return () => clearInterval(interval);
    }
  }, [detections, cameras, isLive]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'flagged': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'processing': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-green-500/20 text-green-400 border-green-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center space-x-3">
          <Radio className="w-6 h-6 text-green-400" />
          <div>
            <h2 className="text-xl font-bold text-white">Live Data Monitor</h2>
            <p className="text-slate-400 text-sm">
              Real-time ANPR system data and analytics
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            variant={isLive ? "default" : "outline"}
            size="sm"
            onClick={() => setIsLive(!isLive)}
            className="flex items-center space-x-2"
          >
            <Activity className={`w-4 h-4 ${isLive ? 'animate-pulse' : ''}`} />
            <span>{isLive ? 'LIVE' : 'PAUSED'}</span>
          </Button>
          
          <Badge variant="secondary" className={`${isConnected ? 'bg-green-500/20 text-green-400 border-green-500/30 animate-pulse' : 'bg-red-500/20 text-red-400 border-red-500/30'}`}>
            {isConnected ? 'CONNECTED' : 'DISCONNECTED'}
          </Badge>
        </div>
      </div>

      {/* Live Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-400">Detections/Min</div>
                <div className="text-2xl font-bold text-white">{liveMetrics.detectionsPerMinute}</div>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-400">Total Vehicles</div>
                <div className="text-2xl font-bold text-white">{liveMetrics.totalVehicles}</div>
              </div>
              <Database className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-400">Avg Confidence</div>
                <div className="text-2xl font-bold text-white">{liveMetrics.averageConfidence}%</div>
              </div>
              <Eye className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-400">Flagged</div>
                <div className="text-2xl font-bold text-white">{liveMetrics.flaggedCount}</div>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-400">Active Streams</div>
                <div className="text-2xl font-bold text-white">{liveMetrics.activeStreams}</div>
              </div>
              <Signal className="w-8 h-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Live Detection Stream */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <span className="flex items-center">
              <Zap className="w-5 h-5 mr-2" />
              Live Detection Stream
            </span>
            <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`}></div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {detections.slice(0, 15).map((detection, index) => (
              <div 
                key={detection.id} 
                className={`flex items-center justify-between p-3 bg-slate-700/30 rounded-lg border border-slate-600/50 ${
                  index === 0 && isLive ? 'border-green-500/30 bg-green-500/5 animate-pulse' : ''
                }`}
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-mono text-white font-bold text-sm">{detection.plate_number}</span>
                    <Badge className={getStatusColor(detection.status)}>
                      {detection.status.toUpperCase()}
                    </Badge>
                    <span className="text-xs text-slate-400">{detection.confidence}%</span>
                  </div>
                  <div className="text-xs text-slate-400 flex items-center space-x-3">
                    <div className="flex items-center">
                      <Camera className="w-3 h-3 mr-1" />
                      {detection.camera_id}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-3 h-3 mr-1" />
                      {detection.location}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-400 flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {new Date(detection.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* System Health */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Wifi className="w-5 h-5 mr-2" />
              Connection Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Database Connection</span>
                <Badge className={isConnected ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'}>
                  {isConnected ? 'ONLINE' : 'OFFLINE'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Real-time Updates</span>
                <Badge className={isLive ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-gray-500/20 text-gray-400 border-gray-500/30'}>
                  {isLive ? 'ACTIVE' : 'PAUSED'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Total Cameras</span>
                <span className="text-white font-mono">{cameras.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Active Cameras</span>
                <span className="text-white font-mono">{cameras.filter(c => c.status === 'active').length}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Activity className="w-5 h-5 mr-2" />
              System Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {systemStats && (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">CPU Usage</span>
                    <span className="text-white font-mono">{systemStats.cpu_usage}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Memory Usage</span>
                    <span className="text-white font-mono">{systemStats.memory_usage}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Accuracy Rate</span>
                    <span className="text-white font-mono">{systemStats.accuracy_rate}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Network Latency</span>
                    <span className="text-white font-mono">{systemStats.network_latency}ms</span>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LiveDataMonitor;
