
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

interface NetworkStatsProps {
  networkNodes: NetworkNode[];
}

const NetworkStats = ({ networkNodes }: NetworkStatsProps) => {
  const onlineNodes = networkNodes.filter(n => n.status === 'online');
  const maintenanceNodes = networkNodes.filter(n => n.status === 'maintenance');
  const offlineNodes = networkNodes.filter(n => n.status === 'offline');
  
  const avgLoad = onlineNodes.length > 0 
    ? Math.round(onlineNodes.reduce((acc, n) => acc + n.load, 0) / onlineNodes.length)
    : 0;
  
  const totalThroughput = networkNodes.reduce((acc, n) => acc + (n.throughput || 0), 0);
  
  const avgLatency = onlineNodes.length > 0
    ? (onlineNodes.reduce((acc, n) => acc + (n.latency || 0), 0) / onlineNodes.length)
    : 0;

  return (
    <div className="absolute bottom-4 left-4 right-4 bg-slate-900/95 backdrop-blur-xl border border-slate-600/50 rounded-xl p-3 shadow-2xl">
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3 text-center">
        <div className="p-2 bg-slate-800/50 rounded-lg border border-green-500/30">
          <div className="text-xl font-bold text-green-300 font-cyber">
            {onlineNodes.length}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Online</div>
        </div>
        <div className="p-2 bg-slate-800/50 rounded-lg border border-orange-500/30">
          <div className="text-xl font-bold text-orange-300 font-cyber">
            {maintenanceNodes.length}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Maintenance</div>
        </div>
        <div className="p-2 bg-slate-800/50 rounded-lg border border-red-500/30">
          <div className="text-xl font-bold text-red-300 font-cyber">
            {offlineNodes.length}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Offline</div>
        </div>
        <div className="p-2 bg-slate-800/50 rounded-lg border border-cyan-500/30">
          <div className="text-xl font-bold text-cyan-300 font-cyber">
            {avgLoad}%
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Avg Load</div>
        </div>
        <div className="p-2 bg-slate-800/50 rounded-lg border border-purple-500/30">
          <div className="text-xl font-bold text-purple-300 font-cyber">
            {totalThroughput.toFixed(0)}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Total Mbps</div>
        </div>
        <div className="p-2 bg-slate-800/50 rounded-lg border border-indigo-500/30">
          <div className="text-xl font-bold text-indigo-300 font-cyber">
            {avgLatency.toFixed(1)}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Avg Latency (ms)</div>
        </div>
      </div>
    </div>
  );
};

export default NetworkStats;
