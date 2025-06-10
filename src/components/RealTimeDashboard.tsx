import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Activity, Zap, Eye, Database, Shield, AlertTriangle, TrendingUp, Clock } from "lucide-react";

interface ActivityItem {
  id: number;
  type: string;
  plate: string;
  camera: string;
  time: string;
  confidence?: number;
  reason?: string;
}

const RealTimeDashboard = () => {
  const [liveStats, setLiveStats] = useState({
    detectedToday: 2847,
    detectedThisHour: 127,
    accuracyRate: 96.8,
    processingSpeed: 342,
    activeCameras: 8,
    totalCameras: 10,
    alertsActive: 3,
    networkLatency: 23,
    systemLoad: 67,
    storageUsed: 78.5,
    blacklistHits: 2,
    flaggedVehicles: 8
  });

  const [realtimeActivity, setRealtimeActivity] = useState<ActivityItem[]>([
    { id: 1, type: "detection", plate: "DL-01-AB-1234", camera: "CAM-02", time: "10:45:32", confidence: 98 },
    { id: 2, type: "alert", plate: "MH-09-XY-9999", camera: "CAM-01", time: "10:45:28", reason: "Blacklisted" },
    { id: 3, type: "detection", plate: "UP-14-CD-5678", camera: "CAM-04", time: "10:45:25", confidence: 94 },
    { id: 4, type: "violation", plate: "GJ-05-EF-9012", camera: "CAM-03", time: "10:45:20", reason: "Speed Limit" },
  ]);

  const [performanceMetrics, setPerformanceMetrics] = useState({
    cpuUsage: 68,
    memoryUsage: 72,
    diskUsage: 45,
    networkThroughput: 85
  });

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveStats(prev => ({
        ...prev,
        detectedThisHour: prev.detectedThisHour + Math.floor(Math.random() * 3),
        detectedToday: prev.detectedToday + Math.floor(Math.random() * 3),
        accuracyRate: Math.max(90, Math.min(99.9, prev.accuracyRate + (Math.random() - 0.5) * 0.5)),
        processingSpeed: Math.floor(320 + Math.random() * 40),
        networkLatency: Math.floor(15 + Math.random() * 20),
        systemLoad: Math.max(20, Math.min(95, prev.systemLoad + (Math.random() - 0.5) * 10))
      }));

      setPerformanceMetrics(prev => ({
        cpuUsage: Math.max(20, Math.min(95, prev.cpuUsage + (Math.random() - 0.5) * 15)),
        memoryUsage: Math.max(30, Math.min(90, prev.memoryUsage + (Math.random() - 0.5) * 10)),
        diskUsage: Math.max(20, Math.min(80, prev.diskUsage + (Math.random() - 0.5) * 5)),
        networkThroughput: Math.max(50, Math.min(100, prev.networkThroughput + (Math.random() - 0.5) * 20))
      }));

      // Add new activity
      const activities = [
        { type: "detection", reason: null },
        { type: "alert", reason: "Blacklisted" },
        { type: "violation", reason: "Speed Limit" },
        { type: "detection", reason: null }
      ];

      const activity = activities[Math.floor(Math.random() * activities.length)];
      const newActivity: ActivityItem = {
        id: Date.now(),
        type: activity.type,
        plate: `${['DL', 'MH', 'UP', 'GJ', 'KA'][Math.floor(Math.random() * 5)]}-${String(Math.floor(10 + Math.random() * 89)).padStart(2, '0')}-${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}-${Math.floor(1000 + Math.random() * 9000)}`,
        camera: `CAM-${String(Math.floor(Math.random() * 8) + 1).padStart(2, '0')}`,
        time: new Date().toLocaleTimeString(),
      };

      if (activity.type === 'detection') {
        newActivity.confidence = Math.floor(85 + Math.random() * 15);
      } else if (activity.reason) {
        newActivity.reason = activity.reason;
      }

      setRealtimeActivity(prev => [newActivity, ...prev.slice(0, 19)]);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'detection': return <Eye className="w-4 h-4 text-blue-400" />;
      case 'alert': return <AlertTriangle className="w-4 h-4 text-red-400" />;
      case 'violation': return <Shield className="w-4 h-4 text-orange-400" />;
      default: return <Activity className="w-4 h-4 text-slate-400" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'detection': return 'border-l-blue-500 bg-blue-500/5';
      case 'alert': return 'border-l-red-500 bg-red-500/5';
      case 'violation': return 'border-l-orange-500 bg-orange-500/5';
      default: return 'border-l-slate-500 bg-slate-500/5';
    }
  };

  const getProgressColor = (value: number) => {
    if (value <= 50) return 'bg-green-500';
    if (value <= 75) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      {/* Live Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-900/20 to-blue-800/10 border-blue-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-blue-400">{liveStats.detectedThisHour}</div>
                <div className="text-sm text-blue-300">This Hour</div>
              </div>
              <Eye className="w-8 h-8 text-blue-400" />
            </div>
            <div className="mt-2 text-xs text-blue-200">
              +{Math.floor(Math.random() * 5 + 1)} in last 5 min
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-900/20 to-green-800/10 border-green-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-400">{liveStats.accuracyRate.toFixed(1)}%</div>
                <div className="text-sm text-green-300">Accuracy Rate</div>
              </div>
              <TrendingUp className="w-8 h-8 text-green-400" />
            </div>
            <div className="mt-2 text-xs text-green-200">
              Real-time OCR performance
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-900/20 to-purple-800/10 border-purple-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-purple-400">{liveStats.processingSpeed}</div>
                <div className="text-sm text-purple-300">Frames/min</div>
              </div>
              <Zap className="w-8 h-8 text-purple-400" />
            </div>
            <div className="mt-2 text-xs text-purple-200">
              Processing speed
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-900/20 to-red-800/10 border-red-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-red-400">{liveStats.alertsActive}</div>
                <div className="text-sm text-red-300">Active Alerts</div>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>
            <div className="mt-2 text-xs text-red-200">
              {liveStats.blacklistHits} blacklist hits
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Real-time Activity Feed */}
        <div className="lg:col-span-2">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Activity className="w-5 h-5 mr-2" />
                Live Activity Feed
                <Badge variant="secondary" className="ml-2 bg-green-500/20 text-green-400 border-green-500/30 animate-pulse">
                  LIVE
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {realtimeActivity.map((activity) => (
                  <div 
                    key={activity.id}
                    className={`p-3 rounded border-l-4 ${getActivityColor(activity.type)} transition-all duration-300`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getActivityIcon(activity.type)}
                        <div>
                          <div className="font-mono text-white font-semibold">{activity.plate}</div>
                          <div className="text-xs text-slate-400">{activity.camera} • {activity.time}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        {activity.confidence && (
                          <div className="text-sm text-blue-400">{activity.confidence}%</div>
                        )}
                        {activity.reason && (
                          <Badge variant="secondary" className="text-xs">
                            {activity.reason}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* System Performance */}
        <div>
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Database className="w-5 h-5 mr-2" />
                System Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-400">CPU Usage</span>
                  <span className="text-white">{performanceMetrics.cpuUsage}%</span>
                </div>
                <Progress value={performanceMetrics.cpuUsage} className="h-2" />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-400">Memory Usage</span>
                  <span className="text-white">{performanceMetrics.memoryUsage}%</span>
                </div>
                <Progress value={performanceMetrics.memoryUsage} className="h-2" />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-400">Storage</span>
                  <span className="text-white">{liveStats.storageUsed}%</span>
                </div>
                <Progress value={liveStats.storageUsed} className="h-2" />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-400">Network</span>
                  <span className="text-white">{performanceMetrics.networkThroughput}%</span>
                </div>
                <Progress value={performanceMetrics.networkThroughput} className="h-2" />
              </div>

              <div className="pt-4 border-t border-slate-600">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Latency:</span>
                    <span className="text-white">{liveStats.networkLatency}ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Uptime:</span>
                    <span className="text-white">15h 42m</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Cameras:</span>
                    <span className="text-white">{liveStats.activeCameras}/{liveStats.totalCameras}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Network Status */}
          <Card className="bg-slate-800/50 border-slate-700 mt-4">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Network Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-sm">SDN Controller</span>
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                    Online
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-sm">Flow Rules</span>
                  <span className="text-white">847 active</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-sm">Packet Rate</span>
                  <span className="text-white">2.3K/sec</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-sm">Bandwidth</span>
                  <span className="text-white">450 Mbps</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RealTimeDashboard;
