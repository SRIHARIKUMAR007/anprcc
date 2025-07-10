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
    // Controller Layer - Top Center
    {
      id: 'sdn-controller',
      name: 'SDN Controller',
      type: 'controller',
      status: 'online',
      load: 34,
      position: { x: 50, y: 8 },
      connections: ['core-sw-01', 'core-sw-02'],
      throughput: 2847.5,
      latency: 1.2
    },
    
    // Core Layer - Second Row
    {
      id: 'core-sw-01',
      name: 'Core-SW-01',
      type: 'switch',
      status: 'online',
      load: 78,
      position: { x: 30, y: 25 },
      connections: ['sdn-controller', 'edge-sw-01', 'edge-sw-02'],
      throughput: 1847.2,
      latency: 2.4
    },
    {
      id: 'core-sw-02',
      name: 'Core-SW-02',
      type: 'switch',
      status: 'online',
      load: 62,
      position: { x: 70, y: 25 },
      connections: ['sdn-controller', 'edge-sw-03', 'edge-sw-04'],
      throughput: 1456.8,
      latency: 2.1
    },
    
    // Edge Layer - Third Row
    {
      id: 'edge-sw-01',
      name: 'Edge-SW-01',
      type: 'switch',
      status: 'online',
      load: 45,
      position: { x: 15, y: 45 },
      connections: ['core-sw-01', 'cam-cluster-a'],
      throughput: 567.3,
      latency: 3.2
    },
    {
      id: 'edge-sw-02',
      name: 'Edge-SW-02',
      type: 'switch',
      status: 'maintenance',
      load: 0,
      position: { x: 35, y: 45 },
      connections: ['core-sw-01', 'anpr-srv'],
      throughput: 0,
      latency: 999
    },
    {
      id: 'edge-sw-03',
      name: 'Edge-SW-03',
      type: 'switch',
      status: 'online',
      load: 71,
      position: { x: 65, y: 45 },
      connections: ['core-sw-02', 'db-srv'],
      throughput: 723.1,
      latency: 3.8
    },
    {
      id: 'edge-sw-04',
      name: 'Edge-SW-04',
      type: 'switch',
      status: 'online',
      load: 58,
      position: { x: 85, y: 45 },
      connections: ['core-sw-02', 'cam-cluster-b'],
      throughput: 445.6,
      latency: 4.1
    },
    
    // Access Layer - Bottom Row
    {
      id: 'cam-cluster-a',
      name: 'Cam-Cluster-A',
      type: 'camera',
      status: 'online',
      load: 67,
      position: { x: 15, y: 65 },
      connections: ['edge-sw-01'],
      throughput: 345.6,
      latency: 8.9
    },
    {
      id: 'anpr-srv',
      name: 'ANPR-Server',
      type: 'server',
      status: 'online',
      load: 89,
      position: { x: 35, y: 65 },
      connections: ['edge-sw-02'],
      throughput: 1234.5,
      latency: 5.2
    },
    {
      id: 'db-srv',
      name: 'DB-Server',
      type: 'server',
      status: 'online',
      load: 34,
      position: { x: 65, y: 65 },
      connections: ['edge-sw-03'],
      throughput: 456.7,
      latency: 4.1
    },
    {
      id: 'cam-cluster-b',
      name: 'Cam-Cluster-B',
      type: 'camera',
      status: 'online',
      load: 54,
      position: { x: 85, y: 65 },
      connections: ['edge-sw-04'],
      throughput: 278.3,
      latency: 7.2
    },
    
    // Infrastructure Services - Bottom Support
    {
      id: 'backup-srv',
      name: 'Backup-Server',
      type: 'server',
      status: 'online',
      load: 12,
      position: { x: 25, y: 80 },
      connections: ['core-sw-01'],
      throughput: 123.4,
      latency: 6.7
    },
    {
      id: 'monitor-srv',
      name: 'Monitor-Server',
      type: 'server',
      status: 'online',
      load: 25,
      position: { x: 75, y: 80 },
      connections: ['core-sw-02'],
      throughput: 234.5,
      latency: 5.8
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
        const actualLoad = node.id === 'sdn-controller' && systemStats 
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
    if (node.status === 'offline') return 'bg-red-500/90 border-red-400/70';
    if (node.status === 'maintenance') return 'bg-orange-500/90 border-orange-400/70';
    if (node.type === 'controller') return 'bg-gradient-to-br from-cyan-500 to-blue-600 border-cyan-400/80';
    if (node.type === 'switch') return 'bg-gradient-to-br from-green-500 to-emerald-600 border-green-400/80';
    if (node.type === 'camera') return 'bg-gradient-to-br from-purple-500 to-pink-600 border-purple-400/80';
    return 'bg-gradient-to-br from-indigo-500 to-blue-600 border-indigo-400/80';
  };

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'controller': return <Cpu className="w-4 h-4 text-white" />;
      case 'switch': return <Router className="w-4 h-4 text-white" />;
      case 'server': return <Database className="w-4 h-4 text-white" />;
      case 'camera': return <Activity className="w-4 h-4 text-white" />;
      default: return <Network className="w-4 h-4 text-white" />;
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
      return "stroke-orange-400/80 stroke-[2.5]";
    }
    if (node.status === 'offline' || connectedNode.status === 'offline') {
      return "stroke-red-400/80 stroke-[2.5]";
    }
    
    const avgThroughput = ((node.throughput || 0) + (connectedNode.throughput || 0)) / 2;
    if (avgThroughput > 1000) return "stroke-cyan-400/90 stroke-[3]";
    if (avgThroughput > 500) return "stroke-green-400/80 stroke-[2.5]";
    return "stroke-blue-400/70 stroke-[2]";
  };

  return (
    <Card className="cyber-card border-cyan-500/30 h-full">
      <CardHeader className="pb-4">
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
      
      <CardContent className="h-[750px] relative">
        {/* Network Topology Canvas */}
        <div className="relative w-full h-full cyber-glass rounded-lg p-6 overflow-hidden bg-gradient-to-br from-slate-900/95 to-slate-800/80 border border-slate-700/50">
          
          {/* Connection Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" 
                refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="rgba(0, 255, 255, 0.8)" />
              </marker>
              <filter id="connection-glow">
                <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
                <feMerge> 
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
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
                      strokeDasharray={node.status === 'maintenance' || connectedNode.status === 'maintenance' ? "6,3" : "none"}
                      markerEnd="url(#arrowhead)"
                      filter="url(#connection-glow)"
                    />
                    {/* Data flow indicators */}
                    {node.status === 'online' && connectedNode.status === 'online' && (
                      <circle r="2" fill="rgba(0, 255, 255, 0.9)" className="animate-pulse">
                        <animateMotion
                          dur="3s"
                          repeatCount="indefinite"
                          path={`M ${node.position.x * 7.5} ${node.position.y * 7.5} L ${connectedNode.position.x * 7.5} ${connectedNode.position.y * 7.5}`}
                        />
                      </circle>
                    )}
                  </g>
                );
              })
            )}
          </svg>

          {/* Layer Labels */}
          <div className="absolute left-2 top-0 bottom-0 flex flex-col justify-around text-slate-400 text-xs font-cyber pointer-events-none">
            <div className="bg-slate-900/90 px-2 py-1 rounded-r-md border-l-3 border-cyan-500 text-cyan-300">Controller</div>
            <div className="bg-slate-900/90 px-2 py-1 rounded-r-md border-l-3 border-green-500 text-green-300">Core</div>
            <div className="bg-slate-900/90 px-2 py-1 rounded-r-md border-l-3 border-blue-500 text-blue-300">Edge</div>
            <div className="bg-slate-900/90 px-2 py-1 rounded-r-md border-l-3 border-purple-500 text-purple-300">Access</div>
            <div className="bg-slate-900/90 px-2 py-1 rounded-r-md border-l-3 border-indigo-500 text-indigo-300">Services</div>
          </div>

          {/* Network Nodes */}
          {networkNodes.map(node => (
            <div
              key={node.id}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 hover:scale-110 hover:z-30 ${
                selectedNode === node.id ? 'scale-110 z-40' : 'z-20'
              }`}
              style={{ 
                left: `${node.position.x}%`, 
                top: `${node.position.y}%` 
              }}
              onClick={() => setSelectedNode(selectedNode === node.id ? null : node.id)}
            >
              {/* Node Container - Smaller Size */}
              <div className={`w-16 h-16 rounded-xl ${getNodeColor(node)} cyber-glow flex flex-col items-center justify-center relative shadow-xl border-2 backdrop-blur-sm`}>
                {getNodeIcon(node.type)}
                <div className="text-xs font-bold text-white mt-1 font-mono">{node.load}%</div>
                
                {/* Status Indicator */}
                <div className={`absolute -top-2 -right-2 w-5 h-5 rounded-full border-2 border-slate-900 ${
                  node.status === 'online' ? 'bg-green-400 shadow-green-400/70' : 
                  node.status === 'maintenance' ? 'bg-orange-400 shadow-orange-400/70' : 'bg-red-400 shadow-red-400/70'
                } ${node.status === 'online' ? 'animate-pulse' : ''} shadow-lg flex items-center justify-center`}>
                  {node.status === 'online' && <Zap className="w-2 h-2 text-white" />}
                  {node.status === 'maintenance' && <AlertTriangle className="w-2 h-2 text-white" />}
                </div>

                {/* Load Indicator */}
                <div className="absolute -bottom-8 w-14 h-2 bg-slate-800/80 rounded-full overflow-hidden border border-slate-600/50 backdrop-blur-sm">
                  <div 
                    className={`h-full transition-all duration-1000 rounded-full ${
                      node.load > 80 ? 'bg-gradient-to-r from-red-500 to-red-600' : 
                      node.load > 60 ? 'bg-gradient-to-r from-orange-500 to-orange-600' : 
                      'bg-gradient-to-r from-green-500 to-green-600'
                    }`}
                    style={{ width: `${node.load}%` }}
                  ></div>
                </div>

                {/* Throughput Indicator */}
                {(node.throughput || 0) > 500 && (
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-cyan-500/20 text-cyan-300 text-xs px-1 py-0.5 rounded border border-cyan-500/30 backdrop-blur-sm">
                    {node.throughput?.toFixed(0)}M
                  </div>
                )}
              </div>

              {/* Node Label - Positioned Closer */}
              <div className="mt-10 text-center">
                <div className="text-xs font-bold text-white font-cyber bg-slate-900/90 px-2 py-1 rounded-md border border-slate-600/50 backdrop-blur-sm whitespace-nowrap">
                  {node.name}
                </div>
                <Badge className={`text-xs mt-1 ${getStatusBadge(node.status)} backdrop-blur-sm`}>
                  {node.status.toUpperCase()}
                </Badge>
              </div>

              {/* Detailed Info Panel */}
              {selectedNode === node.id && (
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-6 bg-slate-900/95 backdrop-blur-xl border border-cyan-500/40 rounded-xl p-4 w-72 z-50 cyber-glass shadow-2xl">
                  <h4 className="font-bold text-cyan-300 mb-3 text-lg border-b border-cyan-500/30 pb-2">{node.name}</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center p-2 bg-slate-800/50 rounded-lg">
                      <span className="text-slate-400">Type:</span>
                      <Badge className="capitalize bg-indigo-500/20 text-indigo-300 border-indigo-500/30">
                        {node.type}
                      </Badge>
                    </div>
                    <div className="flex justify-between p-2 bg-slate-800/50 rounded-lg">
                      <span className="text-slate-400">Load:</span>
                      <span className={`font-bold font-mono ${node.load > 80 ? 'text-red-400' : node.load > 60 ? 'text-orange-400' : 'text-green-400'}`}>
                        {node.load}%
                      </span>
                    </div>
                    <div className="flex justify-between p-2 bg-slate-800/50 rounded-lg">
                      <span className="text-slate-400">Status:</span>
                      <Badge className={`text-xs ${getStatusBadge(node.status)}`}>
                        {node.status}
                      </Badge>
                    </div>
                    <div className="flex justify-between p-2 bg-slate-800/50 rounded-lg">
                      <span className="text-slate-400">Connections:</span>
                      <span className="text-white font-bold">{node.connections.length}</span>
                    </div>
                    {node.throughput && (
                      <div className="flex justify-between p-2 bg-slate-800/50 rounded-lg">
                        <span className="text-slate-400">Throughput:</span>
                        <span className="text-cyan-300 font-bold font-mono">{node.throughput.toFixed(1)} Mbps</span>
                      </div>
                    )}
                    {node.latency && (
                      <div className="flex justify-between p-2 bg-slate-800/50 rounded-lg">
                        <span className="text-slate-400">Latency:</span>
                        <span className="text-purple-300 font-bold font-mono">{node.latency.toFixed(1)} ms</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Network Performance Stats */}
        <div className="absolute bottom-4 left-4 right-4 bg-slate-900/95 backdrop-blur-xl border border-slate-600/50 rounded-xl p-4 shadow-2xl">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-center">
            <div className="p-2 bg-slate-800/50 rounded-lg border border-green-500/30">
              <div className="text-2xl font-bold text-green-300 font-cyber">
                {networkNodes.filter(n => n.status === 'online').length}
              </div>
              <div className="text-xs text-slate-400 mt-1">Online</div>
            </div>
            <div className="p-2 bg-slate-800/50 rounded-lg border border-orange-500/30">
              <div className="text-2xl font-bold text-orange-300 font-cyber">
                {networkNodes.filter(n => n.status === 'maintenance').length}
              </div>
              <div className="text-xs text-slate-400 mt-1">Maintenance</div>
            </div>
            <div className="p-2 bg-slate-800/50 rounded-lg border border-red-500/30">
              <div className="text-2xl font-bold text-red-300 font-cyber">
                {networkNodes.filter(n => n.status === 'offline').length}
              </div>
              <div className="text-xs text-slate-400 mt-1">Offline</div>
            </div>
            <div className="p-2 bg-slate-800/50 rounded-lg border border-cyan-500/30">
              <div className="text-2xl font-bold text-cyan-300 font-cyber">
                {Math.round(networkNodes.filter(n => n.status === 'online').reduce((acc, n) => acc + n.load, 0) / networkNodes.filter(n => n.status === 'online').length)}%
              </div>
              <div className="text-xs text-slate-400 mt-1">Avg Load</div>
            </div>
            <div className="p-2 bg-slate-800/50 rounded-lg border border-purple-500/30">
              <div className="text-2xl font-bold text-purple-300 font-cyber">
                {networkNodes.reduce((acc, n) => acc + (n.throughput || 0), 0).toFixed(0)}
              </div>
              <div className="text-xs text-slate-400 mt-1">Total Mbps</div>
            </div>
            <div className="p-2 bg-slate-800/50 rounded-lg border border-indigo-500/30">
              <div className="text-2xl font-bold text-indigo-300 font-cyber">
                {(networkNodes.filter(n => n.status === 'online').reduce((acc, n) => acc + (n.latency || 0), 0) / networkNodes.filter(n => n.status === 'online').length).toFixed(1)}
              </div>
              <div className="text-xs text-slate-400 mt-1">Avg Latency (ms)</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SDNNetworkTopology;
