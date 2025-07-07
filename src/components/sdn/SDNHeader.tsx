
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CloudLightning, RefreshCw, Zap, Clock, Router, Gauge, TrendingUp } from "lucide-react";

interface SDNHeaderProps {
  isConnected: boolean;
  isOptimizing: boolean;
  controllerStats: {
    uptime: string;
    connectedSwitches: number;
    totalSwitches: number;
    networkHealth: number;
  };
  networkMetrics: {
    qosLevel: string;
  };
  onOptimize: () => void;
}

const SDNHeader = ({ isConnected, isOptimizing, controllerStats, networkMetrics, onOptimize }: SDNHeaderProps) => {
  return (
    <div className="cyber-glass rounded-xl p-6 border border-cyan-500/30">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 cyber-glow-cyan">
            <CloudLightning className="w-8 h-8 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gradient">SDN Controller Dashboard</h1>
            <p className="text-slate-400 font-cyber">OpenDaylight Network Management System</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Badge className={`${isConnected ? 'cyber-glow-green bg-green-500/20 text-green-400 border-green-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'} animate-pulse-cyber`}>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
              <span className="font-cyber">{isConnected ? 'ONLINE' : 'OFFLINE'}</span>
            </div>
          </Badge>
          <Button
            onClick={onOptimize}
            disabled={isOptimizing}
            className="cyber-glow bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 font-cyber"
          >
            {isOptimizing ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Zap className="w-4 h-4 mr-2" />
            )}
            {isOptimizing ? 'Optimizing...' : 'Auto-Optimize'}
          </Button>
        </div>
      </div>

      {/* Controller Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="cyber-glass rounded-lg p-4 border border-purple-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-sm">System Uptime</span>
            <Clock className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-xl font-bold text-purple-300 font-cyber">{controllerStats.uptime}</div>
        </div>
        <div className="cyber-glass rounded-lg p-4 border border-cyan-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-sm">Connected Switches</span>
            <Router className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-xl font-bold text-cyan-300 font-cyber">
            {controllerStats.connectedSwitches}/{controllerStats.totalSwitches}
          </div>
        </div>
        <div className="cyber-glass rounded-lg p-4 border border-green-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-sm">Network Health</span>
            <Gauge className="w-4 h-4 text-green-400" />
          </div>
          <div className="text-xl font-bold text-green-300 font-cyber">{controllerStats.networkHealth}%</div>
        </div>
        <div className="cyber-glass rounded-lg p-4 border border-yellow-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-sm">QoS Level</span>
            <TrendingUp className="w-4 h-4 text-yellow-400" />
          </div>
          <div className="text-xl font-bold text-yellow-300 font-cyber">{networkMetrics.qosLevel}</div>
        </div>
      </div>
    </div>
  );
};

export default SDNHeader;
