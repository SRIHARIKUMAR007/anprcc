
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Activity, 
  Server, 
  Database, 
  Wifi, 
  HardDrive, 
  Cpu, 
  MemoryStick, 
  AlertTriangle,
  CheckCircle,
  RefreshCw
} from "lucide-react";
import { useSupabaseRealTimeData } from '@/hooks/useSupabaseRealTimeData';

interface SystemHealth {
  status: 'healthy' | 'warning' | 'critical';
  uptime: string;
  responseTime: number;
  errorRate: number;
  throughput: number;
}

const SystemHealthMonitor = () => {
  const { systemStats, cameras, isConnected } = useSupabaseRealTimeData();
  const [systemHealth, setSystemHealth] = useState<SystemHealth>({
    status: 'healthy',
    uptime: '99.8%',
    responseTime: 145,
    errorRate: 0.02,
    throughput: 1247
  });
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Simulate real-time system health updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemHealth(prev => ({
        ...prev,
        responseTime: Math.floor(Math.random() * 50) + 120,
        errorRate: Math.random() * 0.1,
        throughput: Math.floor(Math.random() * 200) + 1200
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const refreshHealth = async () => {
    setIsRefreshing(true);
    // Simulate refresh delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsRefreshing(false);
  };

  const getHealthStatus = () => {
    if (systemHealth.errorRate > 0.05 || systemHealth.responseTime > 300) return 'critical';
    if (systemHealth.errorRate > 0.02 || systemHealth.responseTime > 200) return 'warning';
    return 'healthy';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'warning': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      default: return 'text-green-400 bg-green-500/20 border-green-500/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'critical': return <AlertTriangle className="w-4 h-4" />;
      case 'warning': return <AlertTriangle className="w-4 h-4" />;
      default: return <CheckCircle className="w-4 h-4" />;
    }
  };

  const healthStatus = getHealthStatus();

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <div className="flex items-center">
            <Activity className="w-5 h-5 mr-2" />
            System Health Monitor
          </div>
          <div className="flex items-center space-x-2">
            <Badge className={getStatusColor(healthStatus)}>
              {getStatusIcon(healthStatus)}
              <span className="ml-1">{healthStatus.toUpperCase()}</span>
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={refreshHealth}
              disabled={isRefreshing}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall System Status */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-slate-700/30 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm">Uptime</span>
              <Server className="w-4 h-4 text-green-400" />
            </div>
            <div className="text-xl font-bold text-white">{systemHealth.uptime}</div>
            <div className="text-xs text-slate-500">Last 30 days</div>
          </div>

          <div className="bg-slate-700/30 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm">Response Time</span>
              <Wifi className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-xl font-bold text-white">{systemHealth.responseTime}ms</div>
            <div className="text-xs text-slate-500">Average response</div>
          </div>

          <div className="bg-slate-700/30 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm">Error Rate</span>
              <AlertTriangle className="w-4 h-4 text-yellow-400" />
            </div>
            <div className="text-xl font-bold text-white">{(systemHealth.errorRate * 100).toFixed(2)}%</div>
            <div className="text-xs text-slate-500">Last hour</div>
          </div>

          <div className="bg-slate-700/30 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm">Throughput</span>
              <Database className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-xl font-bold text-white">{systemHealth.throughput}</div>
            <div className="text-xs text-slate-500">Detections/hour</div>
          </div>
        </div>

        {/* Resource Usage */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Resource Usage</h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Cpu className="w-4 h-4 text-blue-400" />
                <span className="text-slate-300">CPU Usage</span>
              </div>
              <span className="text-white font-medium">{systemStats?.cpu_usage || 45}%</span>
            </div>
            <Progress value={systemStats?.cpu_usage || 45} className="h-2" />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MemoryStick className="w-4 h-4 text-green-400" />
                <span className="text-slate-300">Memory Usage</span>
              </div>
              <span className="text-white font-medium">{systemStats?.memory_usage || 67}%</span>
            </div>
            <Progress value={systemStats?.memory_usage || 67} className="h-2" />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <HardDrive className="w-4 h-4 text-purple-400" />
                <span className="text-slate-300">Storage Usage</span>
              </div>
              <span className="text-white font-medium">34%</span>
            </div>
            <Progress value={34} className="h-2" />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Wifi className="w-4 h-4 text-yellow-400" />
                <span className="text-slate-300">Network Latency</span>
              </div>
              <span className="text-white font-medium">{systemStats?.network_latency || 12}ms</span>
            </div>
            <Progress value={(systemStats?.network_latency || 12) * 2} className="h-2" />
          </div>
        </div>

        {/* Camera Status */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Camera Network Status</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-slate-700/30 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Active Cameras</span>
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                  {cameras.filter(c => c.status === 'active').length}/{cameras.length}
                </Badge>
              </div>
            </div>

            <div className="bg-slate-700/30 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Connection Status</span>
                <Badge className={isConnected ? 
                  "bg-green-500/20 text-green-400 border-green-500/30" : 
                  "bg-red-500/20 text-red-400 border-red-500/30"
                }>
                  {isConnected ? 'Connected' : 'Disconnected'}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Health Recommendations */}
        {healthStatus !== 'healthy' && (
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
            <h4 className="text-yellow-400 font-medium mb-2 flex items-center">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Health Recommendations
            </h4>
            <ul className="text-slate-300 text-sm space-y-1">
              {systemHealth.responseTime > 200 && (
                <li>• High response time detected - consider optimizing database queries</li>
              )}
              {systemHealth.errorRate > 0.02 && (
                <li>• Elevated error rate - check camera connections and network stability</li>
              )}
              {(systemStats?.cpu_usage || 0) > 80 && (
                <li>• High CPU usage - consider scaling resources</li>
              )}
              {(systemStats?.memory_usage || 0) > 80 && (
                <li>• High memory usage - review memory allocation</li>
              )}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SystemHealthMonitor;
