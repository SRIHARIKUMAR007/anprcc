
import { useState, useEffect } from "react";
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
  RefreshCw
} from "lucide-react";

interface NetworkNode {
  id: string;
  name: string;
  type: 'controller' | 'switch' | 'camera' | 'server';
  status: 'active' | 'inactive' | 'maintenance';
  bandwidth: number;
  latency: number;
  load: number;
}

interface TrafficFlow {
  id: string;
  source: string;
  destination: string;
  bandwidth: number;
  priority: 'high' | 'medium' | 'low';
  dataType: 'video' | 'image' | 'control' | 'data';
}

const SDNNetworkManager = () => {
  const [networkNodes, setNetworkNodes] = useState<NetworkNode[]>([
    { id: 'sdn-ctrl-01', name: 'OpenDaylight Controller', type: 'controller', status: 'active', bandwidth: 95, latency: 2, load: 45 },
    { id: 'switch-01', name: 'Core Switch', type: 'switch', status: 'active', bandwidth: 87, latency: 1, load: 62 },
    { id: 'switch-02', name: 'Edge Switch A', type: 'switch', status: 'active', bandwidth: 72, latency: 3, load: 38 },
    { id: 'switch-03', name: 'Edge Switch B', type: 'switch', status: 'active', bandwidth: 81, latency: 2, load: 54 },
    { id: 'cam-server', name: 'ANPR Processing Server', type: 'server', status: 'active', bandwidth: 91, latency: 5, load: 78 },
    { id: 'cam-01', name: 'Highway Camera 1', type: 'camera', status: 'active', bandwidth: 68, latency: 8, load: 43 },
    { id: 'cam-02', name: 'Toll Plaza Camera', type: 'camera', status: 'active', bandwidth: 74, latency: 6, load: 51 },
    { id: 'cam-03', name: 'Parking Gate Camera', type: 'camera', status: 'maintenance', bandwidth: 0, latency: 999, load: 0 }
  ]);

  const [trafficFlows, setTrafficFlows] = useState<TrafficFlow[]>([
    { id: 'flow-01', source: 'cam-01', destination: 'cam-server', bandwidth: 25.6, priority: 'high', dataType: 'video' },
    { id: 'flow-02', source: 'cam-02', destination: 'cam-server', bandwidth: 22.3, priority: 'high', dataType: 'video' },
    { id: 'flow-03', source: 'cam-server', destination: 'sdn-ctrl-01', bandwidth: 1.2, priority: 'medium', dataType: 'control' },
    { id: 'flow-04', source: 'cam-01', destination: 'cam-server', bandwidth: 5.8, priority: 'low', dataType: 'image' }
  ]);

  const [autoOptimization, setAutoOptimization] = useState(true);
  const [networkHealth, setNetworkHealth] = useState(94);

  // Simulate real-time network updates
  useEffect(() => {
    if (!autoOptimization) return;

    const interval = setInterval(() => {
      setNetworkNodes(nodes => nodes.map(node => ({
        ...node,
        bandwidth: Math.max(0, Math.min(100, node.bandwidth + (Math.random() - 0.5) * 10)),
        latency: Math.max(1, node.latency + (Math.random() - 0.5) * 2),
        load: Math.max(0, Math.min(100, node.load + (Math.random() - 0.5) * 15))
      })));

      setTrafficFlows(flows => flows.map(flow => ({
        ...flow,
        bandwidth: Math.max(0, flow.bandwidth + (Math.random() - 0.5) * 2)
      })));

      // Update network health based on node status
      const avgPerformance = networkNodes.reduce((acc, node) => {
        if (node.status === 'active') {
          return acc + (node.bandwidth - node.load) / 2;
        }
        return acc;
      }, 0) / networkNodes.filter(n => n.status === 'active').length;

      setNetworkHealth(Math.round(Math.max(70, Math.min(100, avgPerformance))));
    }, 2000);

    return () => clearInterval(interval);
  }, [autoOptimization, networkNodes]);

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'controller': return <CloudLightning className="w-4 h-4" />;
      case 'switch': return <Router className="w-4 h-4" />;
      case 'camera': return <Activity className="w-4 h-4" />;
      case 'server': return <Server className="w-4 h-4" />;
      default: return <Network className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'maintenance': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'inactive': return 'text-red-400 bg-red-500/20 border-red-500/30';
      default: return 'text-slate-400 bg-slate-500/20 border-slate-500/30';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400 bg-red-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20';
      case 'low': return 'text-green-400 bg-green-500/20';
      default: return 'text-slate-400 bg-slate-500/20';
    }
  };

  const optimizeNetwork = () => {
    // Simulate network optimization
    setNetworkNodes(nodes => nodes.map(node => ({
      ...node,
      load: Math.max(0, node.load - Math.random() * 20),
      latency: Math.max(1, node.latency - Math.random() * 2)
    })));
  };

  return (
    <div className="space-y-6">
      {/* SDN Controller Status */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center">
              <CloudLightning className="w-5 h-5 mr-2" />
              SDN Controller Dashboard
            </CardTitle>
            <div className="flex items-center space-x-3">
              <Badge className={`${getStatusColor('active')} animate-pulse`}>
                OpenDaylight Active
              </Badge>
              <Button
                variant={autoOptimization ? "default" : "outline"}
                size="sm"
                onClick={() => setAutoOptimization(!autoOptimization)}
              >
                <Zap className={`w-4 h-4 mr-2 ${autoOptimization ? 'animate-pulse' : ''}`} />
                Auto-Optimize
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-slate-700/30 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-400 text-sm">Network Health</span>
                <Gauge className="w-4 h-4 text-blue-400" />
              </div>
              <div className="text-2xl font-bold text-white">{networkHealth}%</div>
              <Progress value={networkHealth} className="h-2 mt-2" />
            </div>
            <div className="bg-slate-700/30 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-400 text-sm">Active Nodes</span>
                <Network className="w-4 h-4 text-green-400" />
              </div>
              <div className="text-2xl font-bold text-white">
                {networkNodes.filter(n => n.status === 'active').length}/{networkNodes.length}
              </div>
            </div>
            <div className="bg-slate-700/30 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-400 text-sm">Active Flows</span>
                <Activity className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-2xl font-bold text-white">{trafficFlows.length}</div>
            </div>
            <div className="bg-slate-700/30 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-400 text-sm">Avg Latency</span>
                <Zap className="w-4 h-4 text-yellow-400" />
              </div>
              <div className="text-2xl font-bold text-white">
                {Math.round(networkNodes.reduce((acc, n) => acc + n.latency, 0) / networkNodes.length)}ms
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Network Topology */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              <span className="flex items-center">
                <Router className="w-5 h-5 mr-2" />
                Network Nodes
              </span>
              <Button variant="outline" size="sm" onClick={optimizeNetwork}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Optimize
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {networkNodes.map((node) => (
                <div key={node.id} className="p-3 bg-slate-700/30 rounded-lg border border-slate-600/50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded ${getStatusColor(node.status)}`}>
                        {getNodeIcon(node.type)}
                      </div>
                      <div>
                        <div className="text-white font-medium">{node.name}</div>
                        <div className="text-slate-400 text-sm capitalize">{node.type}</div>
                      </div>
                    </div>
                    <Badge className={getStatusColor(node.status)}>
                      {node.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <div className="text-slate-400">Bandwidth</div>
                      <div className="text-white font-mono">{node.bandwidth.toFixed(1)}%</div>
                    </div>
                    <div>
                      <div className="text-slate-400">Latency</div>
                      <div className="text-white font-mono">{node.latency.toFixed(1)}ms</div>
                    </div>
                    <div>
                      <div className="text-slate-400">Load</div>
                      <div className="text-white font-mono">{node.load.toFixed(1)}%</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Activity className="w-5 h-5 mr-2" />
              Traffic Flows
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {trafficFlows.map((flow) => (
                <div key={flow.id} className="p-3 bg-slate-700/30 rounded-lg border border-slate-600/50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-white font-medium">
                      {flow.source} → {flow.destination}
                    </div>
                    <Badge className={getPriorityColor(flow.priority)}>
                      {flow.priority}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <div className="text-slate-400">Bandwidth</div>
                      <div className="text-white font-mono">{flow.bandwidth.toFixed(1)} Mbps</div>
                    </div>
                    <div>
                      <div className="text-slate-400">Data Type</div>
                      <div className="text-white capitalize">{flow.dataType}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* SDN Features */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Settings className="w-5 h-5 mr-2" />
            SDN Capabilities & Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <Database className="w-8 h-8 text-blue-400 mb-3" />
              <div className="text-white font-medium mb-1">Dynamic Bandwidth Allocation</div>
              <div className="text-slate-400 text-sm">Automatically allocate bandwidth based on ANPR processing load</div>
            </div>
            <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
              <Router className="w-8 h-8 text-green-400 mb-3" />
              <div className="text-white font-medium mb-1">Load Balancing</div>
              <div className="text-slate-400 text-sm">Distribute camera feeds across multiple processing servers</div>
            </div>
            <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
              <Activity className="w-8 h-8 text-purple-400 mb-3" />
              <div className="text-white font-medium mb-1">QoS Prioritization</div>
              <div className="text-slate-400 text-sm">Prioritize high-priority vehicle detection traffic</div>
            </div>
            <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <Zap className="w-8 h-8 text-yellow-400 mb-3" />
              <div className="text-white font-medium mb-1">Real-time Optimization</div>
              <div className="text-slate-400 text-sm">Continuously optimize network performance for ANPR workloads</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SDNNetworkManager;
