
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Network, 
  Server, 
  Activity, 
  Zap, 
  Settings, 
  Router,
  Database,
  CloudLightning,
  Gauge,
  RefreshCw,
  Shield,
  Wifi,
  HardDrive,
  Cpu,
  MemoryStick,
  Clock,
  TrendingUp,
  AlertTriangle,
  CheckCircle
} from "lucide-react";
import { useSupabaseRealTimeData } from '@/hooks/useSupabaseRealTimeData';

interface NetworkMetrics {
  totalFlows: number;
  activeFlows: number;
  bandwidth: number;
  latency: number;
  throughput: number;
  packetLoss: number;
  qosLevel: string;
  securityStatus: string;
}

interface ControllerStats {
  uptime: string;
  connectedSwitches: number;
  totalSwitches: number;
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  networkHealth: number;
}

const SDNControllerPage = () => {
  const { systemStats, cameras, isConnected } = useSupabaseRealTimeData();
  
  const [networkMetrics, setNetworkMetrics] = useState<NetworkMetrics>({
    totalFlows: 1247,
    activeFlows: 1189,
    bandwidth: 2847.5,
    latency: 12.4,
    throughput: 1847.2,
    packetLoss: 0.02,
    qosLevel: 'Optimal',
    securityStatus: 'Protected'
  });

  const [controllerStats, setControllerStats] = useState<ControllerStats>({
    uptime: '15d 8h 42m',
    connectedSwitches: 8,
    totalSwitches: 8,
    cpuUsage: 34,
    memoryUsage: 67,
    diskUsage: 45,
    networkHealth: 98
  });

  const [isOptimizing, setIsOptimizing] = useState(false);

  // Real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setNetworkMetrics(prev => ({
        ...prev,
        activeFlows: prev.activeFlows + Math.floor(Math.random() * 20) - 10,
        bandwidth: +(prev.bandwidth + (Math.random() * 100) - 50).toFixed(1),
        latency: +(Math.max(8, prev.latency + (Math.random() * 4) - 2)).toFixed(1),
        throughput: +(prev.throughput + (Math.random() * 50) - 25).toFixed(1),
        packetLoss: +(Math.max(0, prev.packetLoss + (Math.random() * 0.01) - 0.005)).toFixed(3)
      }));

      setControllerStats(prev => ({
        ...prev,
        cpuUsage: Math.max(20, Math.min(90, prev.cpuUsage + Math.floor(Math.random() * 10) - 5)),
        memoryUsage: Math.max(40, Math.min(85, prev.memoryUsage + Math.floor(Math.random() * 6) - 3)),
        networkHealth: Math.max(85, Math.min(100, prev.networkHealth + Math.floor(Math.random() * 4) - 2))
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const optimizeNetwork = async () => {
    setIsOptimizing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setNetworkMetrics(prev => ({
      ...prev,
      latency: Math.max(8, prev.latency * 0.8),
      packetLoss: prev.packetLoss * 0.5,
      qosLevel: 'Optimized'
    }));
    
    setControllerStats(prev => ({
      ...prev,
      cpuUsage: Math.max(15, prev.cpuUsage * 0.7),
      networkHealth: Math.min(100, prev.networkHealth + 5)
    }));
    
    setIsOptimizing(false);
  };

  return (
    <div className="space-y-8 p-6">
      {/* Header Section */}
      <div className="cyber-glass rounded-xl p-6 border border-cyan-500/30">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 cyber-glow-cyan">
              <CloudLightning className="w-8 h-8 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gradient">SDN Controller Dashboard</h1>
              <p className="text-slate-400 font-cyber">OpenDaylight Network Management System</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Badge className={`${isConnected ? 'cyber-glow-green bg-green-500/20 text-green-400 border-green-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'} animate-pulse-cyber`}>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
                <span className="font-cyber">{isConnected ? 'ONLINE' : 'OFFLINE'}</span>
              </div>
            </Badge>
            <Button
              onClick={optimizeNetwork}
              disabled={isOptimizing}
              className="cyber-glow bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 font-cyber"
            >
              {isOptimizing ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Zap className="w-4 h-4 mr-2" />
              )}
              {isOptimizing ? 'Optimizing...' : 'Auto-Optimize'}
            </Button>
          </div>
        </div>

        {/* Controller Uptime & Status */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="cyber-glass rounded-lg p-4 border border-purple-500/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm">System Uptime</span>
              <Clock className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-xl font-bold text-purple-300 font-cyber">{controllerStats.uptime}</div>
          </div>
          <div className="cyber-glass rounded-lg p-4 border border-cyan-500/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm">Connected Switches</span>
              <Router className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-xl font-bold text-cyan-300 font-cyber">
              {controllerStats.connectedSwitches}/{controllerStats.totalSwitches}
            </div>
          </div>
          <div className="cyber-glass rounded-lg p-4 border border-green-500/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm">Network Health</span>
              <Gauge className="w-4 h-4 text-green-400" />
            </div>
            <div className="text-xl font-bold text-green-300 font-cyber">{controllerStats.networkHealth}%</div>
          </div>
          <div className="cyber-glass rounded-lg p-4 border border-yellow-500/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm">QoS Level</span>
              <TrendingUp className="w-4 h-4 text-yellow-400" />
            </div>
            <div className="text-xl font-bold text-yellow-300 font-cyber">{networkMetrics.qosLevel}</div>
          </div>
        </div>
      </div>

      {/* Network Flow Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="cyber-card border-cyan-500/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Activity className="w-5 h-5 text-cyan-400" />
              <span>Network Flow Analytics</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="cyber-glass rounded-lg p-4">
                <div className="text-sm text-slate-400 mb-1">Total Flows</div>
                <div className="text-2xl font-bold text-cyan-300 font-cyber">{networkMetrics.totalFlows.toLocaleString()}</div>
                <div className="text-xs text-slate-500">System-wide</div>
              </div>
              <div className="cyber-glass rounded-lg p-4">
                <div className="text-sm text-slate-400 mb-1">Active Flows</div>
                <div className="text-2xl font-bold text-green-300 font-cyber">{networkMetrics.activeFlows.toLocaleString()}</div>
                <div className="text-xs text-slate-500">Real-time</div>
              </div>
              <div className="cyber-glass rounded-lg p-4">
                <div className="text-sm text-slate-400 mb-1">Bandwidth</div>
                <div className="text-2xl font-bold text-purple-300 font-cyber">{networkMetrics.bandwidth} Mbps</div>
                <div className="text-xs text-slate-500">Aggregate</div>
              </div>
              <div className="cyber-glass rounded-lg p-4">
                <div className="text-sm text-slate-400 mb-1">Throughput</div>
                <div className="text-2xl font-bold text-yellow-300 font-cyber">{networkMetrics.throughput} Mbps</div>
                <div className="text-xs text-slate-500">Current</div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-400">Network Utilization</span>
                  <span className="text-white font-cyber">{Math.round((networkMetrics.activeFlows / networkMetrics.totalFlows) * 100)}%</span>
                </div>
                <Progress value={(networkMetrics.activeFlows / networkMetrics.totalFlows) * 100} className="h-2 cyber-glow" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-400">Latency</span>
                  <span className="text-white font-cyber">{networkMetrics.latency}ms</span>
                </div>
                <Progress value={Math.max(0, 100 - networkMetrics.latency * 2)} className="h-2 cyber-glow-green" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cyber-card border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Server className="w-5 h-5 text-purple-400" />
              <span>Controller Resources</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="cyber-glass rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Cpu className="w-4 h-4 text-blue-400" />
                  <span className="text-sm text-slate-400">CPU Usage</span>
                </div>
                <div className="text-xl font-bold text-blue-300 font-cyber">{controllerStats.cpuUsage}%</div>
                <Progress value={controllerStats.cpuUsage} className="h-2 mt-2" />
              </div>
              <div className="cyber-glass rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <MemoryStick className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-slate-400">Memory</span>
                </div>
                <div className="text-xl font-bold text-green-300 font-cyber">{controllerStats.memoryUsage}%</div>
                <Progress value={controllerStats.memoryUsage} className="h-2 mt-2 cyber-glow-green" />
              </div>
              <div className="cyber-glass rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <HardDrive className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm text-slate-400">Disk Usage</span>
                </div>
                <div className="text-xl font-bold text-yellow-300 font-cyber">{controllerStats.diskUsage}%</div>
                <Progress value={controllerStats.diskUsage} className="h-2 mt-2" />
              </div>
              <div className="cyber-glass rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Wifi className="w-4 h-4 text-cyan-400" />
                  <span className="text-sm text-slate-400">Packet Loss</span>
                </div>
                <div className="text-xl font-bold text-cyan-300 font-cyber">{networkMetrics.packetLoss}%</div>
                <div className="text-xs text-slate-500 mt-1">
                  {networkMetrics.packetLoss < 0.1 ? 'Excellent' : networkMetrics.packetLoss < 0.5 ? 'Good' : 'Needs Attention'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Security & QoS Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="cyber-card border-green-500/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Shield className="w-5 h-5 text-green-400" />
              <span>Security Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 cyber-glass rounded-lg">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-white">DDoS Protection</span>
                </div>
                <Badge className="cyber-glow-green bg-green-500/20 text-green-400 border-green-500/30">Active</Badge>
              </div>
              <div className="flex items-center justify-between p-3 cyber-glass rounded-lg">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-white">Intrusion Detection</span>
                </div>
                <Badge className="cyber-glow-green bg-green-500/20 text-green-400 border-green-500/30">Monitoring</Badge>
              </div>
              <div className="flex items-center justify-between p-3 cyber-glass rounded-lg">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-white">Traffic Encryption</span>
                </div>
                <Badge className="cyber-glow-green bg-green-500/20 text-green-400 border-green-500/30">Enabled</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cyber-card border-orange-500/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Settings className="w-5 h-5 text-orange-400" />
              <span>Advanced Configuration</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="cyber-glass rounded-lg p-4">
                <div className="text-sm text-slate-400 mb-2">Flow Table Optimization</div>
                <div className="flex items-center justify-between">
                  <span className="text-white">Auto-cleanup enabled</span>
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                </div>
              </div>
              <div className="cyber-glass rounded-lg p-4">
                <div className="text-sm text-slate-400 mb-2">Load Balancing</div>
                <div className="flex items-center justify-between">
                  <span className="text-white">Round-robin active</span>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                </div>
              </div>
              <div className="cyber-glass rounded-lg p-4">
                <div className="text-sm text-slate-400 mb-2">Failover Protection</div>
                <div className="flex items-center justify-between">
                  <span className="text-white">Multi-path ready</span>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SDNControllerPage;
