
import { Badge } from "@/components/ui/badge";
import { Activity, Wifi, Shield, AlertTriangle } from "lucide-react";
import { useRealTimeSystemData } from "@/hooks/useRealTimeSystemData";

const RealTimeStatusBar = () => {
  const { isConnected, networkHealth, threatLevel, activeIncidents } = useRealTimeSystemData();

  const getThreatColor = (level: string) => {
    switch (level) {
      case 'HIGH': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'MEDIUM': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      default: return 'bg-green-500/20 text-green-400 border-green-500/30';
    }
  };

  return (
    <div className="cyber-glass rounded-lg p-4 border border-slate-600/30">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
            <span className="text-sm font-cyber text-slate-300">
              {isConnected ? 'SYSTEM ONLINE' : 'SYSTEM OFFLINE'}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Wifi className="w-4 h-4 text-cyan-400" />
            <span className="text-sm text-slate-300">Network: {networkHealth}%</span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Badge className={getThreatColor(threatLevel)}>
            <Shield className="w-3 h-3 mr-1" />
            THREAT: {threatLevel}
          </Badge>
          
          {activeIncidents > 0 && (
            <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
              <AlertTriangle className="w-3 h-3 mr-1" />
              {activeIncidents} Active
            </Badge>
          )}
          
          <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30 animate-pulse">
            <Activity className="w-3 h-3 mr-1" />
            LIVE DATA
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default RealTimeStatusBar;
