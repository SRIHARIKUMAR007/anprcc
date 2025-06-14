
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
      <div className="relative">
        {/* Gradient fade for overflow */}
        <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-slate-800/80 to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-l from-slate-800/80 to-transparent z-10 pointer-events-none"></div>
        
        <div className="overflow-x-auto pb-2 scrollbar-hide">
          <TabsList className="grid w-max grid-cols-13 lg:w-full bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 p-1.5 h-auto rounded-xl shadow-lg">
            <TabsTrigger 
              value="realtime" 
              className="flex flex-col items-center space-y-1.5 p-3 lg:p-4 min-w-[90px] rounded-lg data-[state=active]:bg-gradient-to-br data-[state=active]:from-blue-500/30 data-[state=active]:to-cyan-500/20 data-[state=active]:text-blue-300 data-[state=active]:shadow-lg transition-all duration-300 hover:bg-slate-700/50"
            >
              <Monitor className="w-4 h-4 lg:w-5 lg:h-5" />
              <span className="text-xs font-medium hidden sm:block">Real-time</span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="dashboard" 
              className="flex flex-col items-center space-y-1.5 p-3 lg:p-4 min-w-[90px] rounded-lg data-[state=active]:bg-gradient-to-br data-[state=active]:from-blue-500/30 data-[state=active]:to-cyan-500/20 data-[state=active]:text-blue-300 data-[state=active]:shadow-lg transition-all duration-300 hover:bg-slate-700/50"
            >
              <BarChart3 className="w-4 h-4 lg:w-5 lg:h-5" />
              <span className="text-xs font-medium hidden sm:block">Dashboard</span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="live" 
              className="flex flex-col items-center space-y-1.5 p-3 lg:p-4 min-w-[90px] rounded-lg data-[state=active]:bg-gradient-to-br data-[state=active]:from-blue-500/30 data-[state=active]:to-cyan-500/20 data-[state=active]:text-blue-300 data-[state=active]:shadow-lg transition-all duration-300 hover:bg-slate-700/50"
            >
              <Camera className="w-4 h-4 lg:w-5 lg:h-5" />
              <span className="text-xs font-medium hidden sm:block">Live Feed</span>
            </TabsTrigger>

            <TabsTrigger 
              value="image-processing" 
              className="flex flex-col items-center space-y-1.5 p-3 lg:p-4 min-w-[90px] rounded-lg data-[state=active]:bg-gradient-to-br data-[state=active]:from-blue-500/30 data-[state=active]:to-cyan-500/20 data-[state=active]:text-blue-300 data-[state=active]:shadow-lg transition-all duration-300 hover:bg-slate-700/50"
            >
              <FileImage className="w-4 h-4 lg:w-5 lg:h-5" />
              <span className="text-xs font-medium hidden sm:block">AI Process</span>
            </TabsTrigger>

            <TabsTrigger 
              value="vehicle-updates" 
              className="flex flex-col items-center space-y-1.5 p-3 lg:p-4 min-w-[90px] rounded-lg data-[state=active]:bg-gradient-to-br data-[state=active]:from-blue-500/30 data-[state=active]:to-cyan-500/20 data-[state=active]:text-blue-300 data-[state=active]:shadow-lg transition-all duration-300 hover:bg-slate-700/50"
            >
              <Activity className="w-4 h-4 lg:w-5 lg:h-5" />
              <span className="text-xs font-medium hidden sm:block">Updates</span>
            </TabsTrigger>

            <TabsTrigger 
              value="vehicle-details" 
              className="flex flex-col items-center space-y-1.5 p-3 lg:p-4 min-w-[90px] rounded-lg data-[state=active]:bg-gradient-to-br data-[state=active]:from-blue-500/30 data-[state=active]:to-cyan-500/20 data-[state=active]:text-blue-300 data-[state=active]:shadow-lg transition-all duration-300 hover:bg-slate-700/50"
            >
              <Car className="w-4 h-4 lg:w-5 lg:h-5" />
              <span className="text-xs font-medium hidden sm:block">Details</span>
            </TabsTrigger>

            <TabsTrigger 
              value="network" 
              className="flex flex-col items-center space-y-1.5 p-3 lg:p-4 min-w-[90px] rounded-lg data-[state=active]:bg-gradient-to-br data-[state=active]:from-blue-500/30 data-[state=active]:to-cyan-500/20 data-[state=active]:text-blue-300 data-[state=active]:shadow-lg transition-all duration-300 hover:bg-slate-700/50"
            >
              <Network className="w-4 h-4 lg:w-5 lg:h-5" />
              <span className="text-xs font-medium hidden sm:block">Network</span>
            </TabsTrigger>

            <TabsTrigger 
              value="sdn-manager" 
              className="flex flex-col items-center space-y-1.5 p-3 lg:p-4 min-w-[90px] rounded-lg data-[state=active]:bg-gradient-to-br data-[state=active]:from-blue-500/30 data-[state=active]:to-cyan-500/20 data-[state=active]:text-blue-300 data-[state=active]:shadow-lg transition-all duration-300 hover:bg-slate-700/50"
            >
              <Layers className="w-4 h-4 lg:w-5 lg:h-5" />
              <span className="text-xs font-medium hidden sm:block">SDN</span>
            </TabsTrigger>

            <TabsTrigger 
              value="parking" 
              className="flex flex-col items-center space-y-1.5 p-3 lg:p-4 min-w-[90px] rounded-lg data-[state=active]:bg-gradient-to-br data-[state=active]:from-blue-500/30 data-[state=active]:to-cyan-500/20 data-[state=active]:text-blue-300 data-[state=active]:shadow-lg transition-all duration-300 hover:bg-slate-700/50"
            >
              <ParkingCircle className="w-4 h-4 lg:w-5 lg:h-5" />
              <span className="text-xs font-medium hidden sm:block">Parking</span>
            </TabsTrigger>

            <TabsTrigger 
              value="database" 
              className="flex flex-col items-center space-y-1.5 p-3 lg:p-4 min-w-[90px] rounded-lg data-[state=active]:bg-gradient-to-br data-[state=active]:from-blue-500/30 data-[state=active]:to-cyan-500/20 data-[state=active]:text-blue-300 data-[state=active]:shadow-lg transition-all duration-300 hover:bg-slate-700/50"
            >
              <Database className="w-4 h-4 lg:w-5 lg:h-5" />
              <span className="text-xs font-medium hidden sm:block">Database</span>
            </TabsTrigger>

            <TabsTrigger 
              value="alerts" 
              className="flex flex-col items-center space-y-1.5 p-3 lg:p-4 min-w-[90px] rounded-lg data-[state=active]:bg-gradient-to-br data-[state=active]:from-blue-500/30 data-[state=active]:to-cyan-500/20 data-[state=active]:text-blue-300 data-[state=active]:shadow-lg transition-all duration-300 hover:bg-slate-700/50"
            >
              <AlertTriangle className="w-4 h-4 lg:w-5 lg:h-5" />
              <span className="text-xs font-medium hidden sm:block">Alerts</span>
            </TabsTrigger>

            <TabsTrigger 
              value="analytics" 
              className="flex flex-col items-center space-y-1.5 p-3 lg:p-4 min-w-[90px] rounded-lg data-[state=active]:bg-gradient-to-br data-[state=active]:from-blue-500/30 data-[state=active]:to-cyan-500/20 data-[state=active]:text-blue-300 data-[state=active]:shadow-lg transition-all duration-300 hover:bg-slate-700/50"
            >
              <BarChart3 className="w-4 h-4 lg:w-5 lg:h-5" />
              <span className="text-xs font-medium hidden sm:block">Analytics</span>
            </TabsTrigger>

            <TabsTrigger 
              value="controls" 
              className="flex flex-col items-center space-y-1.5 p-3 lg:p-4 min-w-[90px] rounded-lg data-[state=active]:bg-gradient-to-br data-[state=active]:from-blue-500/30 data-[state=active]:to-cyan-500/20 data-[state=active]:text-blue-300 data-[state=active]:shadow-lg transition-all duration-300 hover:bg-slate-700/50"
            >
              <Settings className="w-4 h-4 lg:w-5 lg:h-5" />
              <span className="text-xs font-medium hidden sm:block">Controls</span>
            </TabsTrigger>
          </TabsList>
        </div>
      </div>

      <div className="mt-6 lg:mt-8">
        {children}
      </div>
    </Tabs>
  );
};
