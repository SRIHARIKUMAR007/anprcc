
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
      position: { x: 50, y: 10 },
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
      position: { x: 15, y: 40 },
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
      position: { x: 35, y: 40 },
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
      position: { x: 65, y: 40 },
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
      position: { x: 85, y: 40 },
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
      position: { x: 15, y: 55 },
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
      position: { x: 35, y: 55 },
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
      position: { x: 65, y: 55 },
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
      position: { x: 85, y: 55 },
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
      position: { x: 25, y: 70 },
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
      position: { x: 75, y: 70 },
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
      case 'controller': return <Cpu className="w-3 h-3 text-white" />;
      case 'switch': return <Router className="w-3 h-3 text-white" />;
      case 'server': return <Database className="w-3 h-3 text-white" />;
      case 'camera': return <Activity className="w-3 h-3 text-white" />;
      default: return <Network className="w-3 h-3 text-white" />;
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
      return "stroke-orange-400/80 stroke-[2]";
    }
    if (node.status === 'offline' || connectedNode.status === 'offline') {
      return "stroke-red-400/80 stroke-[2]";
    }
    
    const avgThroughput = ((node.throughput || 0) + (connectedNode.throughput || 0)) / 2;
    if (avgThroughput > 1000) return "stroke-cyan-400/90 stroke-[2.5]";
    if (avgThroughput > 500) return "stroke-green-400/80 stroke-[2]";
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
      
      <CardContent className="h-[800px] relative">
        {/* Network Topology Canvas */}
        <div className="relative w-full h-full cyber-glass rounded-lg p-8 overflow-hidden bg-gradient-to-br from-slate-900/95 to-slate-800/80 border border-slate-700/50">
          
          {/* Connection Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
            <defs>
              <marker id="arrowhead" markerWidth="8" markerHeight="6" 
                refX="7" refY="3" orient="auto">
                <polygon points="0 0, 8 3, 0 6" fill="rgba(0, 255, 255, 0.8)" />
              </marker>
              <filter id="connection-glow">
                <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
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
                
                // Calculate exact connection points for boxes
                const nodeX = (node.position.x / 100) * 100;
                const nodeY = (node.position.y / 100) * 100;
                const connectedX = (connectedNode.position.x / 100) * 100;
                const connectedY = (connectedNode.position.y / 100) * 100;
                
                return (
                  <line
                    key={`${node.id}-${connectionId}`}
                    x1={`${nodeX}%`}
                    y1={`${nodeY}%`}
                    x2={`${connectedX}%`}
                    y2={`${connectedY}%`}
                    className={getConnectionColor(node, connectedNode)}
                    strokeDasharray={node.status === 'maintenance' || connectedNode.status === 'maintenance' ? "4,2" : "none"}
                    markerEnd="url(#arrowhead)"
                    filter="url(#connection-glow)"
                  />
                );
              })
            )}
          </svg>

          {/* Layer Labels */}
          <div className="absolute left-2 top-0 bottom-0 flex flex-col justify-around text-slate-400 text-xs font-cyber pointer-events-none">
            <div className="bg-slate-900/90 px-2 py-1 rounded-r-md border-l-2 border-cyan-500 text-cyan-300">Controller</div>
            <div className="bg-slate-900/90 px-2 py-1 rounded-r-md border-l-2 border-green-500 text-green-300">Core</div>
            <div className="bg-slate-900/90 px-2 py-1 rounded-r-md border-l-2 border-blue-500 text-blue-300">Edge</div>
            <div className="bg-slate-900/90 px-2 py-1 rounded-r-md border-l-2 border-purple-500 text-purple-300">Access</div>
            <div className="bg-slate-900/90 px-2 py-1 rounded-r-md border-l-2 border-indigo-500 text-indigo-300">Services</div>
          </div>

          {/* Network Nodes */}
          {networkNodes.map(node => (
            <div
              key={node.id}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 hover:scale-105 hover:z-30 ${
                selectedNode === node.id ? 'scale-105 z-40' : 'z-20'
              }`}
              style={{ 
                left: `${node.position.x}%`, 
                top: `${node.position.y}%` 
              }}
              onClick={() => setSelectedNode(selectedNode === node.id ? null : node.id)}
            >
              {/* Node Container - Compact Size */}
              <div className={`w-12 h-12 rounded-lg ${getNodeColor(node)} cyber-glow flex flex-col items-center justify-center relative shadow-xl border-2 backdrop-blur-sm`}>
                {getNodeIcon(node.type)}
                <div className="text-[9px] font-bold text-white mt-0.5 font-mono">{node.load}%</div>
                
                {/* Status Indicator */}
                <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border border-slate-900 ${
                  node.status === 'online' ? 'bg-green-400' : 
                  node.status === 'maintenance' ? 'bg-orange-400' : 'bg-red-400'
                } ${node.status === 'online' ? 'animate-pulse' : ''} shadow-sm flex items-center justify-center`}>
                  {node.status === 'online' && <Zap className="w-1.5 h-1.5 text-white" />}
                  {node.status === 'maintenance' && <AlertTriangle className="w-1.5 h-1.5 text-white" />}
                </div>
              </div>

              {/* Node Label - Positioned Below */}
              <div className="mt-2 text-center">
                <div className="text-[10px] font-bold text-white font-cyber bg-slate-900/90 px-1.5 py-0.5 rounded border border-slate-600/50 backdrop-blur-sm whitespace-nowrap">
                  {node.name}
                </div>
                <Badge className={`text-[8px] mt-1 px-1 py-0 ${getStatusBadge(node.status)} backdrop-blur-sm`}>
                  {node.status.toUpperCase()}
                </Badge>
              </div>

              {/* Detailed Info Panel */}
              {selectedNode === node.id && (
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-4 bg-slate-900/95 backdrop-blur-xl border border-cyan-500/40 rounded-xl p-3 w-64 z-50 cyber-glass shadow-2xl">
                  <h4 className="font-bold text-cyan-300 mb-2 text-sm border-b border-cyan-500/30 pb-1">{node.name}</h4>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between items-center p-1.5 bg-slate-800/50 rounded">
                      <span className="text-slate-400">Type:</span>
                      <Badge className="capitalize bg-indigo-500/20 text-indigo-300 border-indigo-500/30 text-[10px]">
                        {node.type}
                      </Badge>
                    </div>
                    <div className="flex justify-between p-1.5 bg-slate-800/50 rounded">
                      <span className="text-slate-400">Load:</span>
                      <span className={`font-bold font-mono ${node.load > 80 ? 'text-red-400' : node.load > 60 ? 'text-orange-400' : 'text-green-400'}`}>
                        {node.load}%
                      </span>
                    </div>
                    <div className="flex justify-between p-1.5 bg-slate-800/50 rounded">
                      <span className="text-slate-400">Status:</span>
                      <Badge className={`text-[10px] ${getStatusBadge(node.status)}`}>
                        {node.status}
                      </Badge>
                    </div>
                    <div className="flex justify-between p-1.5 bg-slate-800/50 rounded">
                      <span className="text-slate-400">Connections:</span>
                      <span className="text-white font-bold">{node.connections.length}</span>
                    </div>
                    {node.throughput && (
                      <div className="flex justify-between p-1.5 bg-slate-800/50 rounded">
                        <span className="text-slate-400">Throughput:</span>
                        <span className="text-cyan-300 font-bold font-mono">{node.throughput.toFixed(1)} Mbps</span>
                      </div>
                    )}
                    {node.latency && (
                      <div className="flex justify-between p-1.5 bg-slate-800/50 rounded">
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
        <div className="absolute bottom-4 left-4 right-4 bg-slate-900/95 backdrop-blur-xl border border-slate-600/50 rounded-xl p-3 shadow-2xl">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3 text-center">
            <div className="p-2 bg-slate-800/50 rounded-lg border border-green-500/30">
              <div className="text-xl font-bold text-green-300 font-cyber">
                {networkNodes.filter(n => n.status === 'online').length}
              </div>
              <div className="text-[10px] text-slate-400 mt-1">Online</div>
            </div>
            <div className="p-2 bg-slate-800/50 rounded-lg border border-orange-500/30">
              <div className="text-xl font-bold text-orange-300 font-cyber">
                {networkNodes.filter(n => n.status === 'maintenance').length}
              </div>
              <div className="text-[10px] text-slate-400 mt-1">Maintenance</div>
            </div>
            <div className="p-2 bg-slate-800/50 rounded-lg border border-red-500/30">
              <div className="text-xl font-bold text-red-300 font-cyber">
                {networkNodes.filter(n => n.status === 'offline').length}
              </div>
              <div className="text-[10px] text-slate-400 mt-1">Offline</div>
            </div>
            <div className="p-2 bg-slate-800/50 rounded-lg border border-cyan-500/30">
              <div className="text-xl font-bold text-cyan-300 font-cyber">
                {Math.round(networkNodes.filter(n => n.status === 'online').reduce((acc, n) => acc + n.load, 0) / networkNodes.filter(n => n.status === 'online').length)}%
              </div>
              <div className="text-[10px] text-slate-400 mt-1">Avg Load</div>
            </div>
            <div className="p-2 bg-slate-800/50 rounded-lg border border-purple-500/30">
              <div className="text-xl font-bold text-purple-300 font-cyber">
                {networkNodes.reduce((acc, n) => acc + (n.throughput || 0), 0).toFixed(0)}
              </div>
              <div className="text-[10px] text-slate-400 mt-1">Total Mbps</div>
            </div>
            <div className="p-2 bg-slate-800/50 rounded-lg border border-indigo-500/30">
              <div className="text-xl font-bold text-indigo-300 font-cyber">
                {(networkNodes.filter(n => n.status === 'online').reduce((acc, n) => acc + (n.latency || 0), 0) / networkNodes.filter(n => n.status === 'online').length).toFixed(1)}
              </div>
              <div className="text-[10px] text-slate-400 mt-1">Avg Latency (ms)</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SDNNetworkTopology;
