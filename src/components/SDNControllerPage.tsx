
import { useState, useEffect } from 'react';
import { useSupabaseRealTimeData } from '@/hooks/useSupabaseRealTimeData';
import SDNHeader from './sdn/SDNHeader';
import NetworkFlowMetrics from './sdn/NetworkFlowMetrics';
import ControllerResources from './sdn/ControllerResources';
import SecurityStatus from './sdn/SecurityStatus';
import AdvancedConfiguration from './sdn/AdvancedConfiguration';

interface NetworkMetrics {
  totalFlows: number;
  activeFlows: number;
  bandwidth: number;
  latency: number;
  throughput: number;
  packetLoss: number;
  qosLevel: string;
  securityStatus: string;
}

interface ControllerStats {
  uptime: string;
  connectedSwitches: number;
  totalSwitches: number;
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  networkHealth: number;
}

const SDNControllerPage = () => {
  const { systemStats, cameras, isConnected } = useSupabaseRealTimeData();
  
  const [networkMetrics, setNetworkMetrics] = useState<NetworkMetrics>({
    totalFlows: 1247,
    activeFlows: 1189,
    bandwidth: 2847.5,
    latency: 12.4,
    throughput: 1847.2,
    packetLoss: 0.02,
    qosLevel: 'Optimal',
    securityStatus: 'Protected'
  });

  const [controllerStats, setControllerStats] = useState<ControllerStats>({
    uptime: '15d 8h 42m',
    connectedSwitches: 8,
    totalSwitches: 8,
    cpuUsage: 34,
    memoryUsage: 67,
    diskUsage: 45,
    networkHealth: 98
  });

  const [isOptimizing, setIsOptimizing] = useState(false);

  // Real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setNetworkMetrics(prev => ({
        ...prev,
        activeFlows: prev.activeFlows + Math.floor(Math.random() * 20) - 10,
        bandwidth: +(prev.bandwidth + (Math.random() * 100) - 50).toFixed(1),
        latency: +(Math.max(8, prev.latency + (Math.random() * 4) - 2)).toFixed(1),
        throughput: +(prev.throughput + (Math.random() * 50) - 25).toFixed(1),
        packetLoss: +(Math.max(0, prev.packetLoss + (Math.random() * 0.01) - 0.005)).toFixed(3)
      }));

      setControllerStats(prev => ({
        ...prev,
        cpuUsage: Math.max(20, Math.min(90, prev.cpuUsage + Math.floor(Math.random() * 10) - 5)),
        memoryUsage: Math.max(40, Math.min(85, prev.memoryUsage + Math.floor(Math.random() * 6) - 3)),
        networkHealth: Math.max(85, Math.min(100, prev.networkHealth + Math.floor(Math.random() * 4) - 2))
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const optimizeNetwork = async () => {
    setIsOptimizing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setNetworkMetrics(prev => ({
      ...prev,
      latency: Math.max(8, prev.latency * 0.8),
      packetLoss: prev.packetLoss * 0.5,
      qosLevel: 'Optimized'
    }));
    
    setControllerStats(prev => ({
      ...prev,
      cpuUsage: Math.max(15, prev.cpuUsage * 0.7),
      networkHealth: Math.min(100, prev.networkHealth + 5)
    }));
    
    setIsOptimizing(false);
  };

  return (
    <div className="space-y-8 p-6">
      <SDNHeader 
        isConnected={isConnected}
        isOptimizing={isOptimizing}
        controllerStats={controllerStats}
        networkMetrics={networkMetrics}
        onOptimize={optimizeNetwork}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <NetworkFlowMetrics networkMetrics={networkMetrics} />
        <ControllerResources 
          controllerStats={controllerStats} 
          networkMetrics={networkMetrics} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <SecurityStatus />
        <AdvancedConfiguration />
      </div>
    </div>
  );
};

export default SDNControllerPage;
