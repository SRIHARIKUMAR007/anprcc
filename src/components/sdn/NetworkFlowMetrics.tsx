
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Activity } from "lucide-react";

interface NetworkFlowMetricsProps {
  networkMetrics: {
    totalFlows: number;
    activeFlows: number;
    bandwidth: number;
    throughput: number;
    latency: number;
  };
}

const NetworkFlowMetrics = ({ networkMetrics }: NetworkFlowMetricsProps) => {
  return (
    <Card className="cyber-card border-cyan-500/30">
      <CardHeader>
        <CardTitle className="text-white flex items-center space-x-2">
          <Activity className="w-5 h-5 text-cyan-400" />
          <span>Network Flow Analytics</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="cyber-glass rounded-lg p-4">
            <div className="text-sm text-slate-400 mb-1">Total Flows</div>
            <div className="text-2xl font-bold text-cyan-300 font-cyber">{networkMetrics.totalFlows.toLocaleString()}</div>
            <div className="text-xs text-slate-500">System-wide</div>
          </div>
          <div className="cyber-glass rounded-lg p-4">
            <div className="text-sm text-slate-400 mb-1">Active Flows</div>
            <div className="text-2xl font-bold text-green-300 font-cyber">{networkMetrics.activeFlows.toLocaleString()}</div>
            <div className="text-xs text-slate-500">Real-time</div>
          </div>
          <div className="cyber-glass rounded-lg p-4">
            <div className="text-sm text-slate-400 mb-1">Bandwidth</div>
            <div className="text-2xl font-bold text-purple-300 font-cyber">{networkMetrics.bandwidth} Mbps</div>
            <div className="text-xs text-slate-500">Aggregate</div>
          </div>
          <div className="cyber-glass rounded-lg p-4">
            <div className="text-sm text-slate-400 mb-1">Throughput</div>
            <div className="text-2xl font-bold text-yellow-300 font-cyber">{networkMetrics.throughput} Mbps</div>
            <div className="text-xs text-slate-500">Current</div>
          </div>
        </div>
        
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-slate-400">Network Utilization</span>
              <span className="text-white font-cyber">{Math.round((networkMetrics.activeFlows / networkMetrics.totalFlows) * 100)}%</span>
            </div>
            <Progress value={(networkMetrics.activeFlows / networkMetrics.totalFlows) * 100} className="h-2 cyber-glow" />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-slate-400">Latency</span>
              <span className="text-white font-cyber">{networkMetrics.latency}ms</span>
            </div>
            <Progress value={Math.max(0, 100 - networkMetrics.latency * 2)} className="h-2 cyber-glow-green" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NetworkFlowMetrics;
