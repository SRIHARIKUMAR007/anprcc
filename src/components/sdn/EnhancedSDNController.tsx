
import { useState } from "react";
import SDNHeader from "./SDNHeader";
import NetworkFlowMetrics from "./NetworkFlowMetrics";
import ControllerResources from "./ControllerResources";
import SecurityStatus from "./SecurityStatus";
import AdvancedConfiguration from "./AdvancedConfiguration";
import SDNNetworkTopology from "./SDNNetworkTopology";
import { useSupabaseRealTimeData } from "@/hooks/useSupabaseRealTimeData";

const EnhancedSDNController = () => {
  const { isConnected } = useSupabaseRealTimeData();
  
  const [networkMetrics] = useState({
    totalFlows: 1247,
    activeFlows: 1189,
    bandwidth: 2847.5,
    latency: 12.4,
    throughput: 1847.2,
    packetLoss: 0.02,
    qosLevel: 'Optimal',
    securityStatus: 'Protected'
  });

  const [controllerStats] = useState({
    uptime: '15d 8h 42m',
    connectedSwitches: 8,
    totalSwitches: 8,
    cpuUsage: 34,
    memoryUsage: 67,
    diskUsage: 45,
    networkHealth: 98
  });

  const [isOptimizing, setIsOptimizing] = useState(false);

  const optimizeNetwork = async () => {
    setIsOptimizing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsOptimizing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-4 md:p-6">
      {/* Enhanced Header with better spacing */}
      <div className="mb-6">
        <SDNHeader 
          isConnected={isConnected}
          isOptimizing={isOptimizing}
          controllerStats={controllerStats}
          networkMetrics={networkMetrics}
          onOptimize={optimizeNetwork}
        />
      </div>

      {/* Network Topology - Enhanced Full Width Section */}
      <div className="mb-8">
        <div className="cyber-glass rounded-xl border border-cyan-500/30 shadow-2xl overflow-hidden">
          <SDNNetworkTopology />
        </div>
      </div>

      {/* Metrics Grid - Better organized */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
        <div className="space-y-6">
          <NetworkFlowMetrics networkMetrics={networkMetrics} />
          <SecurityStatus />
        </div>
        <div className="space-y-6">
          <ControllerResources 
            controllerStats={controllerStats} 
            networkMetrics={networkMetrics} 
          />
          <AdvancedConfiguration />
        </div>
      </div>
    </div>
  );
};

export default EnhancedSDNController;
