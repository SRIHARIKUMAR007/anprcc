
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
      <div className="relative mb-8">
        {/* Gradient fade for overflow */}
        <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-slate-800/80 to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-l from-slate-800/80 to-transparent z-10 pointer-events-none"></div>
        
        <div className="overflow-x-auto pb-2 scrollbar-hide">
          <TabsList className="flex w-max lg:grid lg:grid-cols-13 lg:w-full bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 p-2 h-auto rounded-xl shadow-lg min-w-max">
            <TabsTrigger 
              value="realtime" 
              className="flex flex-col items-center justify-center space-y-2 p-4 min-w-[90px] rounded-lg data-[state=active]:bg-gradient-to-br data-[state=active]:from-blue-500/30 data-[state=active]:to-cyan-500/20 data-[state=active]:text-blue-300 data-[state=active]:shadow-lg transition-all duration-300 hover:bg-slate-700/50 text-center"
            >
              <Monitor className="w-5 h-5 flex-shrink-0" />
              <span className="text-xs font-medium">Real-time</span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="dashboard" 
              className="flex flex-col items-center justify-center space-y-2 p-4 min-w-[90px] rounded-lg data-[state=active]:bg-gradient-to-br data-[state=active]:from-blue-500/30 data-[state=active]:to-cyan-500/20 data-[state=active]:text-blue-300 data-[state=active]:shadow-lg transition-all duration-300 hover:bg-slate-700/50 text-center"
            >
              <BarChart3 className="w-5 h-5 flex-shrink-0" />
              <span className="text-xs font-medium">Dashboard</span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="live" 
              className="flex flex-col items-center justify-center space-y-2 p-4 min-w-[90px] rounded-lg data-[state=active]:bg-gradient-to-br data-[state=active]:from-blue-500/30 data-[state=active]:to-cyan-500/20 data-[state=active]:text-blue-300 data-[state=active]:shadow-lg transition-all duration-300 hover:bg-slate-700/50 text-center"
            >
              <Camera className="w-5 h-5 flex-shrink-0" />
              <span className="text-xs font-medium">Live Feed</span>
            </TabsTrigger>

            <TabsTrigger 
              value="image-processing" 
              className="flex flex-col items-center justify-center space-y-2 p-4 min-w-[90px] rounded-lg data-[state=active]:bg-gradient-to-br data-[state=active]:from-blue-500/30 data-[state=active]:to-cyan-500/20 data-[state=active]:text-blue-300 data-[state=active]:shadow-lg transition-all duration-300 hover:bg-slate-700/50 text-center"
            >
              <FileImage className="w-5 h-5 flex-shrink-0" />
              <span className="text-xs font-medium">AI Process</span>
            </TabsTrigger>

            <TabsTrigger 
              value="vehicle-updates" 
              className="flex flex-col items-center justify-center space-y-2 p-4 min-w-[90px] rounded-lg data-[state=active]:bg-gradient-to-br data-[state=active]:from-blue-500/30 data-[state=active]:to-cyan-500/20 data-[state=active]:text-blue-300 data-[state=active]:shadow-lg transition-all duration-300 hover:bg-slate-700/50 text-center"
            >
              <Activity className="w-5 h-5 flex-shrink-0" />
              <span className="text-xs font-medium">Updates</span>
            </TabsTrigger>

            <TabsTrigger 
              value="vehicle-details" 
              className="flex flex-col items-center justify-center space-y-2 p-4 min-w-[90px] rounded-lg data-[state=active]:bg-gradient-to-br data-[state=active]:from-blue-500/30 data-[state=active]:to-cyan-500/20 data-[state=active]:text-blue-300 data-[state=active]:shadow-lg transition-all duration-300 hover:bg-slate-700/50 text-center"
            >
              <Car className="w-5 h-5 flex-shrink-0" />
              <span className="text-xs font-medium">Details</span>
            </TabsTrigger>

            <TabsTrigger 
              value="network" 
              className="flex flex-col items-center justify-center space-y-2 p-4 min-w-[90px] rounded-lg data-[state=active]:bg-gradient-to-br data-[state=active]:from-blue-500/30 data-[state=active]:to-cyan-500/20 data-[state=active]:text-blue-300 data-[state=active]:shadow-lg transition-all duration-300 hover:bg-slate-700/50 text-center"
            >
              <Network className="w-5 h-5 flex-shrink-0" />
              <span className="text-xs font-medium">Network</span>
            </TabsTrigger>

            <TabsTrigger 
              value="sdn-manager" 
              className="flex flex-col items-center justify-center space-y-2 p-4 min-w-[90px] rounded-lg data-[state=active]:bg-gradient-to-br data-[state=active]:from-blue-500/30 data-[state=active]:to-cyan-500/20 data-[state=active]:text-blue-300 data-[state=active]:shadow-lg transition-all duration-300 hover:bg-slate-700/50 text-center"
            >
              <Layers className="w-5 h-5 flex-shrink-0" />
              <span className="text-xs font-medium">SDN</span>
            </TabsTrigger>

            <TabsTrigger 
              value="parking" 
              className="flex flex-col items-center justify-center space-y-2 p-4 min-w-[90px] rounded-lg data-[state=active]:bg-gradient-to-br data-[state=active]:from-blue-500/30 data-[state=active]:to-cyan-500/20 data-[state=active]:text-blue-300 data-[state=active]:shadow-lg transition-all duration-300 hover:bg-slate-700/50 text-center"
            >
              <ParkingCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-xs font-medium">Parking</span>
            </TabsTrigger>

            <TabsTrigger 
              value="database" 
              className="flex flex-col items-center justify-center space-y-2 p-4 min-w-[90px] rounded-lg data-[state=active]:bg-gradient-to-br data-[state=active]:from-blue-500/30 data-[state=active]:to-cyan-500/20 data-[state=active]:text-blue-300 data-[state=active]:shadow-lg transition-all duration-300 hover:bg-slate-700/50 text-center"
            >
              <Database className="w-5 h-5 flex-shrink-0" />
              <span className="text-xs font-medium">Database</span>
            </TabsTrigger>

            <TabsTrigger 
              value="alerts" 
              className="flex flex-col items-center justify-center space-y-2 p-4 min-w-[90px] rounded-lg data-[state=active]:bg-gradient-to-br data-[state=active]:from-blue-500/30 data-[state=active]:to-cyan-500/20 data-[state=active]:text-blue-300 data-[state=active]:shadow-lg transition-all duration-300 hover:bg-slate-700/50 text-center"
            >
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              <span className="text-xs font-medium">Alerts</span>
            </TabsTrigger>

            <TabsTrigger 
              value="analytics" 
              className="flex flex-col items-center justify-center space-y-2 p-4 min-w-[90px] rounded-lg data-[state=active]:bg-gradient-to-br data-[state=active]:from-blue-500/30 data-[state=active]:to-cyan-500/20 data-[state=active]:text-blue-300 data-[state=active]:shadow-lg transition-all duration-300 hover:bg-slate-700/50 text-center"
            >
              <BarChart3 className="w-5 h-5 flex-shrink-0" />
              <span className="text-xs font-medium">Analytics</span>
            </TabsTrigger>

            <TabsTrigger 
              value="controls" 
              className="flex flex-col items-center justify-center space-y-2 p-4 min-w-[90px] rounded-lg data-[state=active]:bg-gradient-to-br data-[state=active]:from-blue-500/30 data-[state=active]:to-cyan-500/20 data-[state=active]:text-blue-300 data-[state=active]:shadow-lg transition-all duration-300 hover:bg-slate-700/50 text-center"
            >
              <Settings className="w-5 h-5 flex-shrink-0" />
              <span className="text-xs font-medium">Controls</span>
            </TabsTrigger>
          </TabsList>
        </div>
      </div>

      <div>
        {children}
      </div>
    </Tabs>
  );
};
