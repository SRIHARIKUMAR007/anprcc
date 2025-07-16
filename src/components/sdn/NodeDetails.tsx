
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

interface NodeDetailsProps {
  node: NetworkNode;
  selectedNode: string | null;
}

const NodeDetails = ({ node, selectedNode }: NodeDetailsProps) => {
  const getStatusBadge = (status: string) => {
    const colors = {
      online: 'bg-green-500/20 text-green-400 border-green-500/30',
      offline: 'bg-red-500/20 text-red-400 border-red-500/30',
      maintenance: 'bg-orange-500/20 text-orange-400 border-orange-500/30'
    };
    return colors[status as keyof typeof colors] || colors.offline;
  };

  if (selectedNode !== node.id) return null;

  return (
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
  );
};

export default NodeDetails;
