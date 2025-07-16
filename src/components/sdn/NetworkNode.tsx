
import { Cpu, Router, Database, Activity, Zap, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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

interface NetworkNodeProps {
  node: NetworkNode;
  selectedNode: string | null;
  onNodeClick: (nodeId: string) => void;
}

const NetworkNode = ({ node, selectedNode, onNodeClick }: NetworkNodeProps) => {
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
      default: return <Router className="w-3 h-3 text-white" />;
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
    <div
      className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 hover:scale-105 hover:z-30 ${
        selectedNode === node.id ? 'scale-105 z-40' : 'z-20'
      }`}
      style={{ 
        left: `${node.position.x}%`, 
        top: `${node.position.y}%` 
      }}
      onClick={() => onNodeClick(node.id)}
    >
      {/* Node Container */}
      <div className={`w-10 h-10 rounded-lg ${getNodeColor(node)} cyber-glow flex flex-col items-center justify-center relative shadow-xl border-2 backdrop-blur-sm`}>
        <div className="flex items-center justify-center mb-0.5">
          {getNodeIcon(node.type)}
        </div>
        <div className="text-[8px] font-bold text-white font-mono leading-none">{node.load}%</div>
        
        {/* Status Indicator */}
        <div className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border border-slate-900 ${
          node.status === 'online' ? 'bg-green-400' : 
          node.status === 'maintenance' ? 'bg-orange-400' : 'bg-red-400'
        } ${node.status === 'online' ? 'animate-pulse' : ''} shadow-sm flex items-center justify-center`}>
          {node.status === 'online' && <Zap className="w-1 h-1 text-white" />}
          {node.status === 'maintenance' && <AlertTriangle className="w-1 h-1 text-white" />}
        </div>
      </div>

      {/* Node Label */}
      <div className="mt-1.5 text-center">
        <div className="text-[9px] font-bold text-white font-cyber bg-slate-900/90 px-1 py-0.5 rounded border border-slate-600/50 backdrop-blur-sm whitespace-nowrap">
          {node.name}
        </div>
        <Badge className={`text-[7px] mt-0.5 px-1 py-0 ${getStatusBadge(node.status)} backdrop-blur-sm`}>
          {node.status.toUpperCase()}
        </Badge>
      </div>
    </div>
  );
};

export default NetworkNode;
