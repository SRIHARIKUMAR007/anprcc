
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Network, Database, Router, AlertTriangle, Cpu, Activity, Zap } from "lucide-react";
import { useSupabaseRealTimeData } from "@/hooks/useSupabaseRealTimeData";

interface NetworkNode {
  id: string;
  name: string;
  type: 'controller' | 'switch' | 'server' | 'camera';
  status: 'online' | 'offline' | 'maintenance';
  load: number;
  position: { x: number; y: number };
  connections: string[];
  throughput?: number;
  latency?: number;
}

const SDNNetworkTopology = () => {
  const { systemStats, cameras, isConnected } = useSupabaseRealTimeData();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const [networkNodes, setNetworkNodes] = useState<NetworkNode[]>([
    {
      id: 'controller',
      name: 'SDN Controller',
      type: 'controller',
      status: 'online',
      load: 34,
      position: { x: 50, y: 15 },
      connections: ['core-switch-01', 'core-switch-02', 'edge-switch-01'],
      throughput: 2847.5,
      latency: 1.2
    },
    {
      id: 'core-switch-01',
      name: 'Core Switch 01',
      type: 'switch',
      status: 'online',
      load: 78,
      position: { x: 25, y: 35 },
      connections: ['controller', 'edge-switch-01', 'edge-switch-02', 'anpr-server'],
      throughput: 1847.2,
      latency: 2.4
    },
    {
      id: 'core-switch-02',
      name: 'Core Switch 02',
      type: 'switch',
      status: 'online',
      load: 62,
      position: { x: 75, y: 35 },
      connections: ['controller', 'edge-switch-03', 'db-server', 'backup-server'],
      throughput: 1456.8,
      latency: 2.1
    },
    {
      id: 'edge-switch-01',
      name: 'Edge Switch 01',
      type: 'switch',
      status: 'online',
      load: 45,
      position: { x: 15, y: 55 },
      connections: ['core-switch-01', 'cam-cluster-01'],
      throughput: 567.3,
      latency: 3.2
    },
    {
      id: 'edge-switch-02',
      name: 'Edge Switch 02',
      type: 'switch',
      status: 'maintenance',
      load: 0,
      position: { x: 35, y: 55 },
      connections: ['core-switch-01'],
      throughput: 0,
      latency: 999
    },
    {
      id: 'edge-switch-03',
      name: 'Edge Switch 03',
      type: 'switch',
      status: 'online',
      load: 71,
      position: { x: 85, y: 55 },
      connections: ['core-switch-02', 'cam-cluster-02'],
      throughput: 723.1,
      latency: 3.8
    },
    {
      id: 'anpr-server',
      name: 'ANPR Processing Server',
      type: 'server',
      status: 'online',
      load: 89,
      position: { x: 25, y: 75 },
      connections: ['core-switch-01'],
      throughput: 1234.5,
      latency: 5.2
    },
    {
      id: 'db-server',
      name: 'Database Server',
      type: 'server',
      status: 'online',
      load: 34,
      position: { x: 75, y: 75 },
      connections: ['core-switch-02'],
      throughput: 456.7,
      latency: 4.1
    },
    {
      id: 'backup-server',
      name: 'Backup Server',
      type: 'server',
      status: 'online',
      load: 12,
      position: { x: 85, y: 85 },
      connections: ['core-switch-02'],
      throughput: 123.4,
      latency: 6.7
    },
    {
      id: 'cam-cluster-01',
      name: 'Camera Cluster 01',
      type: 'camera',
      status: 'online',
      load: 67,
      position: { x: 10, y: 85 },
      connections: ['edge-switch-01'],
      throughput: 345.6,
      latency: 8.9
    },
    {
      id: 'cam-cluster-02',
      name: 'Camera Cluster 02',
      type: 'camera',
      status: 'online',
      load: 54,
      position: { x: 90, y: 75 },
      connections: ['edge-switch-03'],
      throughput: 278.3,
      latency: 7.2
    }
  ]);

  // Enhanced real-time updates with system integration
  useEffect(() => {
    const interval = setInterval(() => {
      setNetworkNodes(prev => prev.map(node => {
        const baseLoad = node.status === 'online' 
          ? Math.max(10, Math.min(95, node.load + (Math.random() - 0.5) * 15))
          : 0;
        
        // Use actual system stats for controller load
        const actualLoad = node.id === 'controller' && systemStats 
          ? systemStats.cpu_usage 
          : baseLoad;

        return {
          ...node,
          load: actualLoad,
          throughput: node.status === 'online' 
            ? Math.max(0, (node.throughput || 0) + (Math.random() - 0.5) * 100)
            : 0,
          latency: node.status === 'online'
            ? Math.max(0.5, (node.latency || 5) + (Math.random() - 0.5) * 2)
            : 999
        };
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, [systemStats]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setRefreshing(false);
  };

  const getNodeColor = (node: NetworkNode) => {
    if (node.status === 'offline') return 'bg-red-500/80';
    if (node.status === 'maintenance') return 'bg-orange-500/80';
    if (node.type === 'controller') return 'bg-gradient-to-br from-cyan-500 to-blue-600 shadow-cyan-500/50';
    if (node.type === 'switch') return 'bg-gradient-to-br from-green-500 to-emerald-600 shadow-green-500/30';
    if (node.type === 'camera') return 'bg-gradient-to-br from-purple-500 to-pink-600 shadow-purple-500/30';
    return 'bg-gradient-to-br from-indigo-500 to-blue-600 shadow-indigo-500/30';
  };

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'controller': return <Cpu className="w-6 h-6 text-white" />;
      case 'switch': return <Router className="w-5 h-5 text-white" />;
      case 'server': return <Database className="w-5 h-5 text-white" />;
      case 'camera': return <Activity className="w-5 h-5 text-white" />;
      default: return <Network className="w-5 h-5 text-white" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      online: 'bg-green-500/20 text-green-400 border-green-500/30',
      offline: 'bg-red-500/20 text-red-400 border-red-500/30',
      maintenance: 'bg-orange-500/20 text-orange-400 border-orange-500/30'
    };
    return colors[status as keyof typeof colors] || colors.offline;
  };

  const getConnectionColor = (node: NetworkNode, connectedNode: NetworkNode) => {
    if (node.status === 'maintenance' || connectedNode.status === 'maintenance') {
      return "stroke-orange-400/50";
    }
    if (node.status === 'offline' || connectedNode.status === 'offline') {
      return "stroke-red-400/50";
    }
    
    const avgThroughput = ((node.throughput || 0) + (connectedNode.throughput || 0)) / 2;
    if (avgThroughput > 1000) return "stroke-cyan-400/80";
    if (avgThroughput > 500) return "stroke-green-400/70";
    return "stroke-blue-400/60";
  };

  return (
    <Card className="cyber-card border-cyan-500/30 h-full">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Network className="w-6 h-6 text-cyan-400" />
            <span className="text-gradient bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
              SDN Network Topology
            </span>
            <Badge className={`${isConnected ? 'bg-green-500/20 text-green-400 border-green-500/30 animate-pulse' : 'bg-red-500/20 text-red-400 border-red-500/30'}`}>
              {isConnected ? 'LIVE' : 'OFFLINE'}
            </Badge>
          </div>
          <Button
            onClick={handleRefresh}
            disabled={refreshing}
            className="cyber-glow bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700"
          >
            {refreshing ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            Refresh
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[500px] relative">
        {/* Enhanced Network Topology Canvas */}
        <div className="relative w-full h-full cyber-glass rounded-lg p-6 overflow-hidden bg-gradient-to-br from-slate-900/80 to-slate-800/60">
          {/* Connection Lines with Data Flow Animation */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" 
                refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="rgba(0, 255, 255, 0.6)" />
              </marker>
            </defs>
            {networkNodes.map(node => 
              node.connections.map(connectionId => {
                const connectedNode = networkNodes.find(n => n.id === connectionId);
                if (!connectedNode) return null;
                
                return (
                  <g key={`${node.id}-${connectionId}`}>
                    <line
                      x1={`${node.position.x}%`}
                      y1={`${node.position.y}%`}
                      x2={`${connectedNode.position.x}%`}
                      y2={`${connectedNode.position.y}%`}
                      className={getConnectionColor(node, connectedNode)}
                      strokeWidth="3"
                      strokeDasharray={node.status === 'maintenance' || connectedNode.status === 'maintenance' ? "8,4" : "none"}
                      markerEnd="url(#arrowhead)"
                    />
                    {/* Data flow indicator */}
                    <circle r="2" fill="rgba(0, 255, 255, 0.8)" className="animate-pulse">
                      <animateMotion
                        dur="3s"
                        repeatCount="indefinite"
                        path={`M ${node.position.x * 4} ${node.position.y * 2} L ${connectedNode.position.x * 4} ${connectedNode.position.y * 2}`}
                      />
                    </circle>
                  </g>
                );
              })
            )}
          </svg>

          {/* Enhanced Network Nodes */}
          {networkNodes.map(node => (
            <div
              key={node.id}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 hover:scale-110 hover:z-20 ${
                selectedNode === node.id ? 'scale-110 z-30' : 'z-10'
              }`}
              style={{ 
                left: `${node.position.x}%`, 
                top: `${node.position.y}%` 
              }}
              onClick={() => setSelectedNode(selectedNode === node.id ? null : node.id)}
            >
              <div className={`w-20 h-20 rounded-xl ${getNodeColor(node)} cyber-glow flex flex-col items-center justify-center relative shadow-2xl`}>
                {getNodeIcon(node.type)}
                <div className="text-xs font-bold text-white mt-1">{node.load}%</div>
                
                {/* Status indicator with pulse */}
                <div className={`absolute -top-2 -right-2 w-5 h-5 rounded-full ${
                  node.status === 'online' ? 'bg-green-400 shadow-green-400/50' : 
                  node.status === 'maintenance' ? 'bg-orange-400 shadow-orange-400/50' : 'bg-red-400 shadow-red-400/50'
                } ${node.status === 'online' ? 'animate-pulse' : ''} shadow-lg`}>
                  {node.status === 'online' && <Zap className="w-3 h-3 text-white m-1" />}
                  {node.status === 'maintenance' && <AlertTriangle className="w-3 h-3 text-white m-1" />}
                </div>

                {/* Load indicator bar */}
                <div className="absolute -bottom-8 w-16 h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 ${
                      node.load > 80 ? 'bg-red-500' : 
                      node.load > 60 ? 'bg-orange-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${node.load}%` }}
                  ></div>
                </div>
              </div>

              {/* Node Name */}
              <div className="mt-12 text-center">
                <div className="text-sm font-bold text-white font-cyber">{node.name}</div>
                <Badge className={`text-xs mt-1 ${getStatusBadge(node.status)}`}>
                  {node.status.toUpperCase()}
                </Badge>
              </div>

              {/* Enhanced detailed info on selection */}
              {selectedNode === node.id && (
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-6 bg-slate-900/95 backdrop-blur-xl border border-cyan-500/30 rounded-lg p-4 w-64 z-30 cyber-glass shadow-2xl">
                  <h4 className="font-bold text-cyan-300 mb-3 text-lg">{node.name}</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Type:</span>
                      <Badge className="capitalize bg-indigo-500/20 text-indigo-300 border-indigo-500/30">
                        {node.type}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Load:</span>
                      <span className={`font-bold ${node.load > 80 ? 'text-red-400' : node.load > 60 ? 'text-orange-400' : 'text-green-400'}`}>
                        {node.load}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Status:</span>
                      <Badge className={`text-xs ${getStatusBadge(node.status)}`}>
                        {node.status}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Connections:</span>
                      <span className="text-white font-bold">{node.connections.length}</span>
                    </div>
                    {node.throughput && (
                      <div className="flex justify-between">
                        <span className="text-slate-400">Throughput:</span>
                        <span className="text-cyan-300 font-bold">{node.throughput.toFixed(1)} Mbps</span>
                      </div>
                    )}
                    {node.latency && (
                      <div className="flex justify-between">
                        <span className="text-slate-400">Latency:</span>
                        <span className="text-purple-300 font-bold">{node.latency.toFixed(1)} ms</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Enhanced Network Performance Stats */}
        <div className="absolute bottom-4 left-4 right-4 bg-slate-900/90 backdrop-blur-xl border border-slate-600/50 rounded-lg p-4">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-300 font-cyber">
                {networkNodes.filter(n => n.status === 'online').length}
              </div>
              <div className="text-xs text-slate-400">Online Nodes</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-300 font-cyber">
                {networkNodes.filter(n => n.status === 'maintenance').length}
              </div>
              <div className="text-xs text-slate-400">Maintenance</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-300 font-cyber">
                {networkNodes.filter(n => n.status === 'offline').length}
              </div>
              <div className="text-xs text-slate-400">Offline</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-cyan-300 font-cyber">
                {Math.round(networkNodes.filter(n => n.status === 'online').reduce((acc, n) => acc + n.load, 0) / networkNodes.filter(n => n.status === 'online').length)}%
              </div>
              <div className="text-xs text-slate-400">Avg Load</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-300 font-cyber">
                {networkNodes.reduce((acc, n) => acc + (n.throughput || 0), 0).toFixed(0)}
              </div>
              <div className="text-xs text-slate-400">Total Mbps</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-indigo-300 font-cyber">
                {(networkNodes.filter(n => n.status === 'online').reduce((acc, n) => acc + (n.latency || 0), 0) / networkNodes.filter(n => n.status === 'online').length).toFixed(1)}
              </div>
              <div className="text-xs text-slate-400">Avg Latency (ms)</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SDNNetworkTopology;
