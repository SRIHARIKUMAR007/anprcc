import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Network } from "lucide-react";
import { useSupabaseRealTimeData } from "@/hooks/useSupabaseRealTimeData";
import NetworkNode from "./NetworkNode";
import NodeDetails from "./NodeDetails";
import NetworkConnections from "./NetworkConnections";
import LayerLabels from "./LayerLabels";
import NetworkStats from "./NetworkStats";

interface NetworkNodeType {
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
  const { systemStats, isConnected } = useSupabaseRealTimeData();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const [networkNodes, setNetworkNodes] = useState<NetworkNodeType[]>([
    // Controller Layer - Top Center
    {
      id: 'sdn-controller',
      name: 'SDN Controller',
      type: 'controller',
      status: 'online',
      load: 34,
      position: { x: 50, y: 15 },
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
      position: { x: 30, y: 30 },
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
      position: { x: 70, y: 30 },
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
      position: { x: 15, y: 50 },
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
      position: { x: 35, y: 50 },
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
      position: { x: 65, y: 50 },
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
      position: { x: 85, y: 50 },
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
      position: { x: 15, y: 70 },
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
      position: { x: 35, y: 70 },
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
      position: { x: 65, y: 70 },
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
      position: { x: 85, y: 70 },
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
      position: { x: 25, y: 85 },
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
      position: { x: 75, y: 85 },
      connections: ['core-sw-02'],
      throughput: 234.5,
      latency: 5.8
    }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setNetworkNodes(prev => prev.map(node => {
        const baseLoad = node.status === 'online' 
          ? Math.max(10, Math.min(95, node.load + (Math.random() - 0.5) * 15))
          : 0;
        
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

  const handleNodeClick = (nodeId: string) => {
    setSelectedNode(selectedNode === nodeId ? null : nodeId);
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
        <div className="relative w-full h-full cyber-glass rounded-lg p-8 overflow-hidden bg-gradient-to-br from-slate-900/95 to-slate-800/80 border border-slate-700/50">
          
          <NetworkConnections networkNodes={networkNodes} />
          <LayerLabels />

          {networkNodes.map(node => (
            <div key={node.id} className="relative">
              <NetworkNode 
                node={node} 
                selectedNode={selectedNode} 
                onNodeClick={handleNodeClick} 
              />
              <NodeDetails node={node} selectedNode={selectedNode} />
            </div>
          ))}

          <NetworkStats networkNodes={networkNodes} />
        </div>
      </CardContent>
    </Card>
  );
};

export default SDNNetworkTopology;
