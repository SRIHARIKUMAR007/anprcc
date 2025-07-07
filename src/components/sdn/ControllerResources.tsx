
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Server, Cpu, MemoryStick, HardDrive, Wifi } from "lucide-react";

interface ControllerResourcesProps {
  controllerStats: {
    cpuUsage: number;
    memoryUsage: number;
    diskUsage: number;
  };
  networkMetrics: {
    packetLoss: number;
  };
}

const ControllerResources = ({ controllerStats, networkMetrics }: ControllerResourcesProps) => {
  return (
    <Card className="cyber-card border-purple-500/30">
      <CardHeader>
        <CardTitle className="text-white flex items-center space-x-2">
          <Server className="w-5 h-5 text-purple-400" />
          <span>Controller Resources</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="cyber-glass rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Cpu className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-slate-400">CPU Usage</span>
            </div>
            <div className="text-xl font-bold text-blue-300 font-cyber">{controllerStats.cpuUsage}%</div>
            <Progress value={controllerStats.cpuUsage} className="h-2 mt-2" />
          </div>
          <div className="cyber-glass rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <MemoryStick className="w-4 h-4 text-green-400" />
              <span className="text-sm text-slate-400">Memory</span>
            </div>
            <div className="text-xl font-bold text-green-300 font-cyber">{controllerStats.memoryUsage}%</div>
            <Progress value={controllerStats.memoryUsage} className="h-2 mt-2 cyber-glow-green" />
          </div>
          <div className="cyber-glass rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <HardDrive className="w-4 h-4 text-yellow-400" />
              <span className="text-sm text-slate-400">Disk Usage</span>
            </div>
            <div className="text-xl font-bold text-yellow-300 font-cyber">{controllerStats.diskUsage}%</div>
            <Progress value={controllerStats.diskUsage} className="h-2 mt-2" />
          </div>
          <div className="cyber-glass rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Wifi className="w-4 h-4 text-cyan-400" />
              <span className="text-sm text-slate-400">Packet Loss</span>
            </div>
            <div className="text-xl font-bold text-cyan-300 font-cyber">{networkMetrics.packetLoss}%</div>
            <div className="text-xs text-slate-500 mt-1">
              {networkMetrics.packetLoss < 0.1 ? 'Excellent' : networkMetrics.packetLoss < 0.5 ? 'Good' : 'Needs Attention'}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ControllerResources;
