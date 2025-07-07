
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Shield, 
  AlertTriangle, 
  Activity, 
  Router,
  Eye,
  Ban,
  CheckCircle,
  Network,
  Zap,
  Lock,
  Unlock,
  Server,
  Globe,
  Settings
} from "lucide-react";
import { useAIThreatDetection } from "@/hooks/useAIThreatDetection";

interface SDNThreatManagerProps {
  cameraId: string;
}

const SDNThreatManager = ({ cameraId }: SDNThreatManagerProps) => {
  const { 
    threatAssessments, 
    sdnResponses, 
    isAnalyzing, 
    getThreatStats,
    isBackendConnected 
  } = useAIThreatDetection();
  
  const [networkStats, setNetworkStats] = useState({
    activeFlows: 847,
    droppedPackets: 23,
    bandwidth: 847.2,
    latency: 12.4,
    qosLevel: 'High Priority',
    securityStatus: 'Protected'
  });

  const [sdnConfig, setSdnConfig] = useState({
    autoBlock: true,
    adaptiveQoS: true,
    trafficShaping: true,
    dynamicRouting: true,
    intrusion_prevention: true
  });

  const threatStats = getThreatStats();

  // Simulate real SDN controller metrics
  useEffect(() => {
    const interval = setInterval(() => {
      setNetworkStats(prev => ({
        ...prev,
        activeFlows: prev.activeFlows + Math.floor(Math.random() * 20) - 10,
        droppedPackets: Math.max(0, prev.droppedPackets + Math.floor(Math.random() * 5) - 2),
        bandwidth: +(prev.bandwidth + (Math.random() * 50) - 25).toFixed(1),
        latency: +(prev.latency + (Math.random() * 2) - 1).toFixed(1)
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'block': return <Ban className="w-3 h-3" />;
      case 'restrict': return <AlertTriangle className="w-3 h-3" />;
      case 'monitor': return <Eye className="w-3 h-3" />;
      case 'allow': return <CheckCircle className="w-3 h-3" />;
      case 'reroute': return <Router className="w-3 h-3" />;
      case 'prioritize': return <Zap className="w-3 h-3" />;
      default: return <Activity className="w-3 h-3" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'block': return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'restrict': return 'text-orange-400 bg-orange-500/20 border-orange-500/30';
      case 'monitor': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'allow': return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'reroute': return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
      case 'prioritize': return 'text-purple-400 bg-purple-500/20 border-purple-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const getThreatColor = (level: string) => {
    switch (level) {
      case 'critical': return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'high': return 'text-orange-400 bg-orange-500/20 border-orange-500/30';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'low': return 'text-green-400 bg-green-500/20 border-green-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const toggleSDNFeature = (feature: keyof typeof sdnConfig) => {
    setSdnConfig(prev => ({
      ...prev,
      [feature]: !prev[feature]
    }));
  };

  return (
    <div className="space-y-4">
      {/* SDN Controller Status */}
      <Card className="cyber-card">
        <CardHeader>
          <CardTitle className="text-white text-sm flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Network className="w-4 h-4 text-cyan-400 cyber-text-glow" />
              <span className="text-gradient">SDN Controller</span>
              {isAnalyzing && (
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse-cyber"></div>
              )}
            </div>
            <Badge variant="secondary" className={`${isBackendConnected ? 'cyber-glow-green bg-green-500/20 text-green-400 border-green-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'}`}>
              {isBackendConnected ? 'ACTIVE' : 'SIMULATION'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Network Metrics */}
          <div className="grid grid-cols-2 gap-3">
            <div className="cyber-glass rounded-lg p-3">
              <div className="text-xs text-slate-400">Active Flows</div>
              <div className="text-lg font-bold text-cyan-300 font-cyber">{networkStats.activeFlows.toLocaleString()}</div>
            </div>
            <div className="cyber-glass rounded-lg p-3">
              <div className="text-xs text-slate-400">Dropped Packets</div>
              <div className="text-lg font-bold text-red-300 font-cyber">{networkStats.droppedPackets}</div>
            </div>
            <div className="cyber-glass rounded-lg p-3">
              <div className="text-xs text-slate-400">Bandwidth (Mbps)</div>
              <div className="text-lg font-bold text-purple-300 font-cyber">{networkStats.bandwidth}</div>
            </div>
            <div className="cyber-glass rounded-lg p-3">
              <div className="text-xs text-slate-400">Latency (ms)</div>
              <div className="text-lg font-bold text-green-300 font-cyber">{networkStats.latency}</div>
            </div>
          </div>

          {/* QoS Status */}
          <div className="cyber-glass rounded-lg p-3">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-slate-400">Quality of Service</span>
              <Badge className="cyber-glow bg-purple-500/20 text-purple-300 border-purple-400/30">
                {networkStats.qosLevel}
              </Badge>
            </div>
            <Progress value={85} className="h-2 bg-slate-700" />
          </div>

          {/* Security Status */}
          <div className="cyber-glass rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Lock className="w-4 h-4 text-green-400" />
                <span className="text-sm text-white">Security Status</span>
              </div>
              <Badge className="cyber-glow-green bg-green-500/20 text-green-400 border-green-500/30">
                {networkStats.securityStatus}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SDN Configuration */}
      <Card className="cyber-card">
        <CardHeader>
          <CardTitle className="text-white text-sm flex items-center space-x-2">
            <Settings className="w-4 h-4 text-purple-400" />
            <span>SDN Configuration</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {Object.entries(sdnConfig).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between p-2 cyber-glass rounded">
              <span className="text-sm text-slate-300 capitalize">
                {key.replace(/([A-Z])/g, ' $1').replace('_', ' ')}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleSDNFeature(key as keyof typeof sdnConfig)}
                className={`h-6 px-2 ${value ? 'text-green-400 hover:bg-green-500/20' : 'text-slate-400 hover:bg-slate-500/20'}`}
              >
                {value ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Threat Analysis Overview */}
      <Card className="cyber-card">
        <CardHeader>
          <CardTitle className="text-white text-sm">AI Threat Analysis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Critical:</span>
              <span className="text-red-400 font-bold font-cyber">{threatStats.critical}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">High:</span>
              <span className="text-orange-400 font-bold font-cyber">{threatStats.high}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Medium:</span>
              <span className="text-yellow-400 font-bold font-cyber">{threatStats.medium}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Low:</span>
              <span className="text-green-400 font-bold font-cyber">{threatStats.low}</span>
            </div>
          </div>
          <div className="mt-2">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400">AI Confidence</span>
              <span className="text-white font-cyber">{threatStats.avgConfidence}%</span>
            </div>
            <Progress value={threatStats.avgConfidence} className="h-2 cyber-glow" />
          </div>
        </CardContent>
      </Card>

      {/* Recent SDN Actions */}
      <Card className="cyber-card">
        <CardHeader>
          <CardTitle className="text-white text-sm">Recent SDN Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-h-32 overflow-y-auto space-y-2">
            {sdnResponses.slice(0, 4).map((response, index) => (
              <div key={index} className="cyber-glass rounded p-2">
                <div className="flex items-center justify-between mb-1">
                  <Badge className={getActionColor(response.action)}>
                    <div className="flex items-center space-x-1">
                      {getActionIcon(response.action)}
                      <span className="text-xs font-cyber">{response.action.toUpperCase()}</span>
                    </div>
                  </Badge>
                  <Badge className={getThreatColor(response.threatLevel.level)}>
                    {response.threatLevel.level.toUpperCase()}
                  </Badge>
                </div>
                <div className="text-xs text-slate-400 mb-1">{response.reason}</div>
                {response.networkPath && (
                  <div className="flex items-center space-x-1 text-xs">
                    <Globe className="w-3 h-3 text-cyan-400" />
                    <span className="text-cyan-400 font-cyber">{response.networkPath}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Emergency Controls */}
      {threatStats.critical > 0 && (
        <Card className="cyber-card border-red-500/50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-red-400 animate-pulse" />
              <span className="text-red-400 text-sm font-medium">Critical Threats Detected</span>
            </div>
            <Button 
              variant="destructive" 
              size="sm" 
              className="w-full text-xs bg-red-600 hover:bg-red-700 cyber-glow font-cyber"
            >
              <Ban className="w-3 h-3 mr-1" />
              Initiate Network Lockdown
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SDNThreatManager;
