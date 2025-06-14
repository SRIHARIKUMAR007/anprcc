
import { ReactNode } from 'react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, 
  Camera, 
  Database, 
  Settings, 
  AlertTriangle, 
  Network,
  Car,
  FileImage,
  Activity,
  ParkingCircle,
  Layers,
  Monitor,
  Zap
} from "lucide-react";

interface MobileOptimizedTabsProps {
  children: ReactNode;
  defaultValue: string;
}

export const MobileOptimizedTabs = ({ children, defaultValue }: MobileOptimizedTabsProps) => {
  return (
    <Tabs defaultValue={defaultValue} className="w-full">
      <div className="overflow-x-auto pb-2">
        <TabsList className="grid w-max grid-cols-13 lg:w-full bg-slate-800/50 border border-slate-700 p-1 h-auto">
          <TabsTrigger 
            value="realtime" 
            className="flex flex-col items-center space-y-1 p-2 lg:p-3 min-w-[80px] data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400"
          >
            <Monitor className="w-4 h-4" />
            <span className="text-xs hidden sm:block">Real-time</span>
          </TabsTrigger>
          
          <TabsTrigger 
            value="dashboard" 
            className="flex flex-col items-center space-y-1 p-2 lg:p-3 min-w-[80px] data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400"
          >
            <BarChart3 className="w-4 h-4" />
            <span className="text-xs hidden sm:block">Dashboard</span>
          </TabsTrigger>
          
          <TabsTrigger 
            value="live" 
            className="flex flex-col items-center space-y-1 p-2 lg:p-3 min-w-[80px] data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400"
          >
            <Camera className="w-4 h-4" />
            <span className="text-xs hidden sm:block">Live Feed</span>
          </TabsTrigger>

          <TabsTrigger 
            value="image-processing" 
            className="flex flex-col items-center space-y-1 p-2 lg:p-3 min-w-[80px] data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400"
          >
            <FileImage className="w-4 h-4" />
            <span className="text-xs hidden sm:block">AI Process</span>
          </TabsTrigger>

          <TabsTrigger 
            value="vehicle-updates" 
            className="flex flex-col items-center space-y-1 p-2 lg:p-3 min-w-[80px] data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400"
          >
            <Activity className="w-4 h-4" />
            <span className="text-xs hidden sm:block">Updates</span>
          </TabsTrigger>

          <TabsTrigger 
            value="vehicle-details" 
            className="flex flex-col items-center space-y-1 p-2 lg:p-3 min-w-[80px] data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400"
          >
            <Car className="w-4 h-4" />
            <span className="text-xs hidden sm:block">Details</span>
          </TabsTrigger>

          <TabsTrigger 
            value="network" 
            className="flex flex-col items-center space-y-1 p-2 lg:p-3 min-w-[80px] data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400"
          >
            <Network className="w-4 h-4" />
            <span className="text-xs hidden sm:block">Network</span>
          </TabsTrigger>

          <TabsTrigger 
            value="sdn-manager" 
            className="flex flex-col items-center space-y-1 p-2 lg:p-3 min-w-[80px] data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400"
          >
            <Layers className="w-4 h-4" />
            <span className="text-xs hidden sm:block">SDN</span>
          </TabsTrigger>

          <TabsTrigger 
            value="parking" 
            className="flex flex-col items-center space-y-1 p-2 lg:p-3 min-w-[80px] data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400"
          >
            <ParkingCircle className="w-4 h-4" />
            <span className="text-xs hidden sm:block">Parking</span>
          </TabsTrigger>

          <TabsTrigger 
            value="database" 
            className="flex flex-col items-center space-y-1 p-2 lg:p-3 min-w-[80px] data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400"
          >
            <Database className="w-4 h-4" />
            <span className="text-xs hidden sm:block">Database</span>
          </TabsTrigger>

          <TabsTrigger 
            value="alerts" 
            className="flex flex-col items-center space-y-1 p-2 lg:p-3 min-w-[80px] data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400"
          >
            <AlertTriangle className="w-4 h-4" />
            <span className="text-xs hidden sm:block">Alerts</span>
          </TabsTrigger>

          <TabsTrigger 
            value="analytics" 
            className="flex flex-col items-center space-y-1 p-2 lg:p-3 min-w-[80px] data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400"
          >
            <BarChart3 className="w-4 h-4" />
            <span className="text-xs hidden sm:block">Analytics</span>
          </TabsTrigger>

          <TabsTrigger 
            value="controls" 
            className="flex flex-col items-center space-y-1 p-2 lg:p-3 min-w-[80px] data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400"
          >
            <Settings className="w-4 h-4" />
            <span className="text-xs hidden sm:block">Controls</span>
          </TabsTrigger>
        </TabsList>
      </div>

      <div className="mt-4 lg:mt-6">
        {children}
      </div>
    </Tabs>
  );
};
