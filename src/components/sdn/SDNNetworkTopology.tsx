
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Network, Database, Router, AlertTriangle } from "lucide-react";

interface NetworkNode {
  id: string;
  name: string;
  type: 'controller' | 'switch' | 'server';
  status: 'online' | 'offline' | 'maintenance';
  load: number;
  position: { x: number; y: number };
  connections: string[];
}

const SDNNetworkTopology = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const [networkNodes, setNetworkNodes] = useState<NetworkNode[]>([
    {
      id: 'controller',
      name: 'SDN Controller',
      type: 'controller',
      status: 'online',
      load: 45,
      position: { x: 50, y: 20 },
      connections: ['switch-01', 'switch-02', 'switch-03']
    },
    {
      id: 'switch-01',
      name: 'Switch-01',
      type: 'switch',
      status: 'online',
      load: 78,
      position: { x: 15, y: 60 },
      connections: ['controller', 'anpr-server']
    },
    {
      id: 'switch-02',
      name: 'Switch-02',
      type: 'switch',
      status: 'online',
      load: 62,
      position: { x: 85, y: 60 },
      connections: ['controller', 'db-server']
    },
    {
      id: 'switch-03',
      name: 'Switch-03',
      type: 'switch',
      status: 'maintenance',
      load: 0,
      position: { x: 50, y: 75 },
      connections: ['controller']
    },
    {
      id: 'anpr-server',
      name: 'ANPR Server',
      type: 'server',
      status: 'online',
      load: 89,
      position: { x: 15, y: 90 },
      connections: ['switch-01']
    },
    {
      id: 'db-server',
      name: 'DB Server',
      type: 'server',
      status: 'online',
      load: 34,
      position: { x: 85, y: 90 },
      connections: ['switch-02']
    }
  ]);

  // Simulate real-time load updates
  useEffect(() => {
    const interval = setInterval(() => {
      setNetworkNodes(prev => prev.map(node => ({
        ...node,
        load: node.status === 'online' 
          ? Math.max(10, Math.min(95, node.load + (Math.random() - 0.5) * 20))
          : 0
      })));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setRefreshing(false);
  };

  const getNodeColor = (node: NetworkNode) => {
    if (node.status === 'offline') return 'bg-red-500';
    if (node.status === 'maintenance') return 'bg-orange-500';
    if (node.type === 'controller') return 'bg-gradient-to-br from-cyan-500 to-blue-500';
    if (node.type === 'switch') return 'bg-gradient-to-br from-green-500 to-emerald-500';
    return 'bg-gradient-to-br from-purple-500 to-pink-500';
  };

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'controller': return <Network className="w-6 h-6 text-white" />;
      case 'switch': return <Router className="w-5 h-5 text-white" />;
      case 'server': return <Database className="w-5 h-5 text-white" />;
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

  return (
    <Card className="cyber-card border-cyan-500/30 h-full">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Network className="w-6 h-6 text-cyan-400" />
            <span className="text-gradient">SDN Network Topology</span>
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
            Refresh Topology
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="h-96 relative">
        {/* Network Topology Canvas */}
        <div className="relative w-full h-full cyber-glass rounded-lg p-4 overflow-hidden">
          {/* Connection Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {networkNodes.map(node => 
              node.connections.map(connectionId => {
                const connectedNode = networkNodes.find(n => n.id === connectionId);
                if (!connectedNode) return null;
                
                return (
                  <line
                    key={`${node.id}-${connectionId}`}
                    x1={`${node.position.x}%`}
                    y1={`${node.position.y}%`}
                    x2={`${connectedNode.position.x}%`}
                    y2={`${connectedNode.position.y}%`}
                    stroke="rgba(0, 255, 255, 0.3)"
                    strokeWidth="2"
                    strokeDasharray={node.status === 'maintenance' || connectedNode.status === 'maintenance' ? "5,5" : "none"}
                    className="animate-pulse"
                  />
                );
              })
            )}
          </svg>

          {/* Network Nodes */}
          {networkNodes.map(node => (
            <div
              key={node.id}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 hover:scale-110 ${
                selectedNode === node.id ? 'scale-110 z-10' : ''
              }`}
              style={{ 
                left: `${node.position.x}%`, 
                top: `${node.position.y}%` 
              }}
              onClick={() => setSelectedNode(selectedNode === node.id ? null : node.id)}
            >
              <div className={`w-16 h-16 rounded-xl ${getNodeColor(node)} cyber-glow flex items-center justify-center relative`}>
                {getNodeIcon(node.type)}
                
                {/* Status indicator */}
                <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full ${
                  node.status === 'online' ? 'bg-green-400' : 
                  node.status === 'maintenance' ? 'bg-orange-400' : 'bg-red-400'
                } animate-pulse`}></div>
              </div>

              {/* Node Info */}
              <div className="mt-2 text-center">
                <div className="text-sm font-bold text-white font-cyber">{node.name}</div>
                <div className="text-xs text-slate-400">{node.load}% Load</div>
                <Badge className={`text-xs mt-1 ${getStatusBadge(node.status)}`}>
                  {node.status === 'maintenance' ? 'Maintenance' : node.status}
                </Badge>
              </div>

              {/* Detailed info on selection */}
              {selectedNode === node.id && (
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-4 bg-slate-900/95 backdrop-blur-xl border border-cyan-500/30 rounded-lg p-3 w-48 z-20 cyber-glass">
                  <h4 className="font-bold text-cyan-300 mb-2">{node.name}</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Type:</span>
                      <span className="text-white capitalize">{node.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Load:</span>
                      <span className="text-white">{node.load}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Status:</span>
                      <Badge className={`text-xs ${getStatusBadge(node.status)}`}>
                        {node.status}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Connections:</span>
                      <span className="text-white">{node.connections.length}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Network Stats */}
        <div className="absolute bottom-4 left-4 right-4 bg-slate-900/80 backdrop-blur-xl border border-slate-600/50 rounded-lg p-3">
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-xl font-bold text-green-300 font-cyber">
                {networkNodes.filter(n => n.status === 'online').length}
              </div>
              <div className="text-xs text-slate-400">Online</div>
            </div>
            <div>
              <div className="text-xl font-bold text-orange-300 font-cyber">
                {networkNodes.filter(n => n.status === 'maintenance').length}
              </div>
              <div className="text-xs text-slate-400">Maintenance</div>
            </div>
            <div>
              <div className="text-xl font-bold text-red-300 font-cyber">
                {networkNodes.filter(n => n.status === 'offline').length}
              </div>
              <div className="text-xs text-slate-400">Offline</div>
            </div>
            <div>
              <div className="text-xl font-bold text-cyan-300 font-cyber">
                {Math.round(networkNodes.filter(n => n.status === 'online').reduce((acc, n) => acc + n.load, 0) / networkNodes.filter(n => n.status === 'online').length)}%
              </div>
              <div className="text-xs text-slate-400">Avg Load</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SDNNetworkTopology;
