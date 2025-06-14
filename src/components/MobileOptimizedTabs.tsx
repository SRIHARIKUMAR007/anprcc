
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
  Zap,
  MapPin,
  Navigation,
  Cloud
} from "lucide-react";

interface MobileOptimizedTabsProps {
  children: ReactNode;
  defaultValue: string;
}

export const MobileOptimizedTabs = ({ children, defaultValue }: MobileOptimizedTabsProps) => {
  return (
    <Tabs defaultValue={defaultValue} className="w-full">
      <div className="relative mb-8">
        {/* Enhanced horizontal scrolling container */}
        <div className="overflow-x-auto pb-3 scrollbar-hide">
          <TabsList className="inline-flex w-max bg-slate-800/80 backdrop-blur-sm border border-slate-700/60 p-2 h-auto rounded-2xl shadow-2xl shadow-black/20 min-w-max">
            <div className="flex items-center space-x-2">
              <TabsTrigger 
                value="realtime" 
                className="flex items-center space-x-3 px-6 py-4 min-w-[140px] rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500/40 data-[state=active]:to-cyan-500/30 data-[state=active]:text-blue-200 data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/25 transition-all duration-300 hover:bg-slate-700/60 text-slate-300 hover:text-white font-medium"
              >
                <Monitor className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm font-semibold whitespace-nowrap">Real-time</span>
              </TabsTrigger>
              
              <TabsTrigger 
                value="tn-traffic" 
                className="flex items-center space-x-3 px-6 py-4 min-w-[140px] rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500/40 data-[state=active]:to-cyan-500/30 data-[state=active]:text-blue-200 data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/25 transition-all duration-300 hover:bg-slate-700/60 text-slate-300 hover:text-white font-medium"
              >
                <MapPin className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm font-semibold whitespace-nowrap">TN Traffic</span>
              </TabsTrigger>

              <TabsTrigger 
                value="toll-monitor" 
                className="flex items-center space-x-3 px-6 py-4 min-w-[140px] rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500/40 data-[state=active]:to-cyan-500/30 data-[state=active]:text-blue-200 data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/25 transition-all duration-300 hover:bg-slate-700/60 text-slate-300 hover:text-white font-medium"
              >
                <Navigation className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm font-semibold whitespace-nowrap">Toll Plaza</span>
              </TabsTrigger>

              <TabsTrigger 
                value="weather" 
                className="flex items-center space-x-3 px-6 py-4 min-w-[140px] rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500/40 data-[state=active]:to-cyan-500/30 data-[state=active]:text-blue-200 data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/25 transition-all duration-300 hover:bg-slate-700/60 text-slate-300 hover:text-white font-medium"
              >
                <Cloud className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm font-semibold whitespace-nowrap">Weather</span>
              </TabsTrigger>
              
              <TabsTrigger 
                value="dashboard" 
                className="flex items-center space-x-3 px-6 py-4 min-w-[140px] rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500/40 data-[state=active]:to-cyan-500/30 data-[state=active]:text-blue-200 data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/25 transition-all duration-300 hover:bg-slate-700/60 text-slate-300 hover:text-white font-medium"
              >
                <BarChart3 className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm font-semibold whitespace-nowrap">Dashboard</span>
              </TabsTrigger>
              
              <TabsTrigger 
                value="live" 
                className="flex items-center space-x-3 px-6 py-4 min-w-[140px] rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500/40 data-[state=active]:to-cyan-500/30 data-[state=active]:text-blue-200 data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/25 transition-all duration-300 hover:bg-slate-700/60 text-slate-300 hover:text-white font-medium"
              >
                <Camera className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm font-semibold whitespace-nowrap">Live Feed</span>
              </TabsTrigger>

              <TabsTrigger 
                value="image-processing" 
                className="flex items-center space-x-3 px-6 py-4 min-w-[140px] rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500/40 data-[state=active]:to-cyan-500/30 data-[state=active]:text-blue-200 data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/25 transition-all duration-300 hover:bg-slate-700/60 text-slate-300 hover:text-white font-medium"
              >
                <FileImage className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm font-semibold whitespace-nowrap">AI Process</span>
              </TabsTrigger>

              <TabsTrigger 
                value="vehicle-updates" 
                className="flex items-center space-x-3 px-6 py-4 min-w-[140px] rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500/40 data-[state=active]:to-cyan-500/30 data-[state=active]:text-blue-200 data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/25 transition-all duration-300 hover:bg-slate-700/60 text-slate-300 hover:text-white font-medium"
              >
                <Activity className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm font-semibold whitespace-nowrap">Updates</span>
              </TabsTrigger>

              <TabsTrigger 
                value="vehicle-details" 
                className="flex items-center space-x-3 px-6 py-4 min-w-[140px] rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500/40 data-[state=active]:to-cyan-500/30 data-[state=active]:text-blue-200 data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/25 transition-all duration-300 hover:bg-slate-700/60 text-slate-300 hover:text-white font-medium"
              >
                <Car className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm font-semibold whitespace-nowrap">Details</span>
              </TabsTrigger>

              <TabsTrigger 
                value="network" 
                className="flex items-center space-x-3 px-6 py-4 min-w-[140px] rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500/40 data-[state=active]:to-cyan-500/30 data-[state=active]:text-blue-200 data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/25 transition-all duration-300 hover:bg-slate-700/60 text-slate-300 hover:text-white font-medium"
              >
                <Network className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm font-semibold whitespace-nowrap">Network</span>
              </TabsTrigger>

              <TabsTrigger 
                value="sdn-manager" 
                className="flex items-center space-x-3 px-6 py-4 min-w-[140px] rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500/40 data-[state=active]:to-cyan-500/30 data-[state=active]:text-blue-200 data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/25 transition-all duration-300 hover:bg-slate-700/60 text-slate-300 hover:text-white font-medium"
              >
                <Layers className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm font-semibold whitespace-nowrap">SDN</span>
              </TabsTrigger>

              <TabsTrigger 
                value="parking" 
                className="flex items-center space-x-3 px-6 py-4 min-w-[140px] rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500/40 data-[state=active]:to-cyan-500/30 data-[state=active]:text-blue-200 data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/25 transition-all duration-300 hover:bg-slate-700/60 text-slate-300 hover:text-white font-medium"
              >
                <ParkingCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm font-semibold whitespace-nowrap">Parking</span>
              </TabsTrigger>

              <TabsTrigger 
                value="database" 
                className="flex items-center space-x-3 px-6 py-4 min-w-[140px] rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500/40 data-[state=active]:to-cyan-500/30 data-[state=active]:text-blue-200 data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/25 transition-all duration-300 hover:bg-slate-700/60 text-slate-300 hover:text-white font-medium"
              >
                <Database className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm font-semibold whitespace-nowrap">Database</span>
              </TabsTrigger>

              <TabsTrigger 
                value="alerts" 
                className="flex items-center space-x-3 px-6 py-4 min-w-[140px] rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500/40 data-[state=active]:to-cyan-500/30 data-[state=active]:text-blue-200 data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/25 transition-all duration-300 hover:bg-slate-700/60 text-slate-300 hover:text-white font-medium"
              >
                <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm font-semibold whitespace-nowrap">Alerts</span>
              </TabsTrigger>

              <TabsTrigger 
                value="analytics" 
                className="flex items-center space-x-3 px-6 py-4 min-w-[140px] rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500/40 data-[state=active]:to-cyan-500/30 data-[state=active]:text-blue-200 data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/25 transition-all duration-300 hover:bg-slate-700/60 text-slate-300 hover:text-white font-medium"
              >
                <BarChart3 className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm font-semibold whitespace-nowrap">Analytics</span>
              </TabsTrigger>

              <TabsTrigger 
                value="controls" 
                className="flex items-center space-x-3 px-6 py-4 min-w-[140px] rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500/40 data-[state=active]:to-cyan-500/30 data-[state=active]:text-blue-200 data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/25 transition-all duration-300 hover:bg-slate-700/60 text-slate-300 hover:text-white font-medium"
              >
                <Settings className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm font-semibold whitespace-nowrap">Controls</span>
              </TabsTrigger>
            </div>
          </TabsList>
        </div>
      </div>

      <div className="w-full">
        {children}
      </div>
    </Tabs>
  );
};
