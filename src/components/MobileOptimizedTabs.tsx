
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { 
  Activity, 
  Database, 
  Shield, 
  MapPin, 
  Truck, 
  Cloud, 
  BarChart3,
  Camera,
  Heart,
  Download,
  Upload,
  Car,
  Bell,
  Network,
  Settings,
  ParkingCircle,
  Users,
  FileImage,
  TrendingUp
} from "lucide-react";

interface MobileOptimizedTabsProps {
  children: React.ReactNode;
  defaultValue?: string;
}

export const MobileOptimizedTabs = ({ children, defaultValue = "realtime" }: MobileOptimizedTabsProps) => {
  return (
    <Tabs defaultValue={defaultValue} className="w-full">
      <div className="w-full border-b border-purple-500/20 bg-gradient-to-r from-slate-900/90 to-purple-900/90 backdrop-blur-md">
        <ScrollArea className="w-full whitespace-nowrap">
          <TabsList className="inline-flex h-16 w-max min-w-full items-center justify-start gap-1 p-2 bg-transparent">
            <TabsTrigger 
              value="realtime" 
              className="flex flex-col items-center space-y-1 p-3 min-w-[90px] text-xs data-[state=active]:bg-gradient-to-br data-[state=active]:from-blue-500/20 data-[state=active]:to-cyan-500/20 data-[state=active]:text-cyan-300 data-[state=active]:border data-[state=active]:border-cyan-400/30 hover:bg-slate-700/30 transition-all duration-200 rounded-lg"
            >
              <Activity className="w-5 h-5" />
              <span>Real-time</span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="live-data" 
              className="flex flex-col items-center space-y-1 p-3 min-w-[90px] text-xs data-[state=active]:bg-gradient-to-br data-[state=active]:from-emerald-500/20 data-[state=active]:to-green-500/20 data-[state=active]:text-emerald-300 data-[state=active]:border data-[state=active]:border-emerald-400/30 hover:bg-slate-700/30 transition-all duration-200 rounded-lg"
            >
              <Database className="w-5 h-5" />
              <span>Live Data</span>
            </TabsTrigger>

            <TabsTrigger 
              value="security" 
              className="flex flex-col items-center space-y-1 p-3 min-w-[90px] text-xs data-[state=active]:bg-gradient-to-br data-[state=active]:from-purple-500/20 data-[state=active]:to-violet-500/20 data-[state=active]:text-purple-300 data-[state=active]:border data-[state=active]:border-purple-400/30 hover:bg-slate-700/30 transition-all duration-200 rounded-lg"
            >
              <Shield className="w-5 h-5" />
              <span>Security</span>
            </TabsTrigger>

            <TabsTrigger 
              value="tn-traffic" 
              className="flex flex-col items-center space-y-1 p-3 min-w-[90px] text-xs data-[state=active]:bg-gradient-to-br data-[state=active]:from-orange-500/20 data-[state=active]:to-amber-500/20 data-[state=active]:text-orange-300 data-[state=active]:border data-[state=active]:border-orange-400/30 hover:bg-slate-700/30 transition-all duration-200 rounded-lg"
            >
              <MapPin className="w-5 h-5" />
              <span>TN Traffic</span>
            </TabsTrigger>

            <TabsTrigger 
              value="toll-monitor" 
              className="flex flex-col items-center space-y-1 p-3 min-w-[90px] text-xs data-[state=active]:bg-gradient-to-br data-[state=active]:from-cyan-500/20 data-[state=active]:to-teal-500/20 data-[state=active]:text-cyan-300 data-[state=active]:border data-[state=active]:border-cyan-400/30 hover:bg-slate-700/30 transition-all duration-200 rounded-lg"
            >
              <Truck className="w-5 h-5" />
              <span>Toll Plaza</span>
            </TabsTrigger>

            <TabsTrigger 
              value="weather" 
              className="flex flex-col items-center space-y-1 p-3 min-w-[90px] text-xs data-[state=active]:bg-gradient-to-br data-[state=active]:from-indigo-500/20 data-[state=active]:to-blue-500/20 data-[state=active]:text-indigo-300 data-[state=active]:border data-[state=active]:border-indigo-400/30 hover:bg-slate-700/30 transition-all duration-200 rounded-lg"
            >
              <Cloud className="w-5 h-5" />
              <span>Weather</span>
            </TabsTrigger>

            <TabsTrigger 
              value="dashboard" 
              className="flex flex-col items-center space-y-1 p-3 min-w-[90px] text-xs data-[state=active]:bg-gradient-to-br data-[state=active]:from-violet-500/20 data-[state=active]:to-purple-500/20 data-[state=active]:text-violet-300 data-[state=active]:border data-[state=active]:border-violet-400/30 hover:bg-slate-700/30 transition-all duration-200 rounded-lg"
            >
              <BarChart3 className="w-5 h-5" />
              <span>Dashboard</span>
            </TabsTrigger>

            <TabsTrigger 
              value="live" 
              className="flex flex-col items-center space-y-1 p-3 min-w-[90px] text-xs data-[state=active]:bg-gradient-to-br data-[state=active]:from-red-500/20 data-[state=active]:to-pink-500/20 data-[state=active]:text-red-300 data-[state=active]:border data-[state=active]:border-red-400/30 hover:bg-slate-700/30 transition-all duration-200 rounded-lg"
            >
              <Camera className="w-5 h-5" />
              <span>Live Feed</span>
            </TabsTrigger>

            <TabsTrigger 
              value="health" 
              className="flex flex-col items-center space-y-1 p-3 min-w-[90px] text-xs data-[state=active]:bg-gradient-to-br data-[state=active]:from-emerald-500/20 data-[state=active]:to-green-500/20 data-[state=active]:text-emerald-300 data-[state=active]:border data-[state=active]:border-emerald-400/30 hover:bg-slate-700/30 transition-all duration-200 rounded-lg"
            >
              <Heart className="w-5 h-5" />
              <span>Health</span>
            </TabsTrigger>

            <TabsTrigger 
              value="export" 
              className="flex flex-col items-center space-y-1 p-3 min-w-[90px] text-xs data-[state=active]:bg-gradient-to-br data-[state=active]:from-teal-500/20 data-[state=active]:to-cyan-500/20 data-[state=active]:text-teal-300 data-[state=active]:border data-[state=active]:border-teal-400/30 hover:bg-slate-700/30 transition-all duration-200 rounded-lg"
            >
              <Download className="w-5 h-5" />
              <span>Export</span>
            </TabsTrigger>

            <TabsTrigger 
              value="image-processing" 
              className="flex flex-col items-center space-y-1 p-3 min-w-[90px] text-xs data-[state=active]:bg-gradient-to-br data-[state=active]:from-pink-500/20 data-[state=active]:to-rose-500/20 data-[state=active]:text-pink-300 data-[state=active]:border data-[state=active]:border-pink-400/30 hover:bg-slate-700/30 transition-all duration-200 rounded-lg"
            >
              <FileImage className="w-5 h-5" />
              <span>Image Proc</span>
            </TabsTrigger>

            <TabsTrigger 
              value="vehicle-updates" 
              className="flex flex-col items-center space-y-1 p-3 min-w-[90px] text-xs data-[state=active]:bg-gradient-to-br data-[state=active]:from-lime-500/20 data-[state=active]:to-green-500/20 data-[state=active]:text-lime-300 data-[state=active]:border data-[state=active]:border-lime-400/30 hover:bg-slate-700/30 transition-all duration-200 rounded-lg"
            >
              <Upload className="w-5 h-5" />
              <span>Updates</span>
            </TabsTrigger>

            <TabsTrigger 
              value="vehicle-details" 
              className="flex flex-col items-center space-y-1 p-3 min-w-[90px] text-xs data-[state=active]:bg-gradient-to-br data-[state=active]:from-yellow-500/20 data-[state=active]:to-amber-500/20 data-[state=active]:text-yellow-300 data-[state=active]:border data-[state=active]:border-yellow-400/30 hover:bg-slate-700/30 transition-all duration-200 rounded-lg"
            >
              <Car className="w-5 h-5" />
              <span>Vehicles</span>
            </TabsTrigger>

            <TabsTrigger 
              value="alerts" 
              className="flex flex-col items-center space-y-1 p-3 min-w-[90px] text-xs data-[state=active]:bg-gradient-to-br data-[state=active]:from-red-500/20 data-[state=active]:to-orange-500/20 data-[state=active]:text-red-300 data-[state=active]:border data-[state=active]:border-red-400/30 hover:bg-slate-700/30 transition-all duration-200 rounded-lg"
            >
              <Bell className="w-5 h-5" />
              <span>Alerts</span>
            </TabsTrigger>

            <TabsTrigger 
              value="network" 
              className="flex flex-col items-center space-y-1 p-3 min-w-[90px] text-xs data-[state=active]:bg-gradient-to-br data-[state=active]:from-blue-500/20 data-[state=active]:to-indigo-500/20 data-[state=active]:text-blue-300 data-[state=active]:border data-[state=active]:border-blue-400/30 hover:bg-slate-700/30 transition-all duration-200 rounded-lg"
            >
              <Network className="w-5 h-5" />
              <span>Network</span>
            </TabsTrigger>

            <TabsTrigger 
              value="analytics" 
              className="flex flex-col items-center space-y-1 p-3 min-w-[90px] text-xs data-[state=active]:bg-gradient-to-br data-[state=active]:from-purple-500/20 data-[state=active]:to-pink-500/20 data-[state=active]:text-purple-300 data-[state=active]:border data-[state=active]:border-purple-400/30 hover:bg-slate-700/30 transition-all duration-200 rounded-lg"
            >
              <TrendingUp className="w-5 h-5" />
              <span>Analytics</span>
            </TabsTrigger>

            <TabsTrigger 
              value="activity" 
              className="flex flex-col items-center space-y-1 p-3 min-w-[90px] text-xs data-[state=active]:bg-gradient-to-br data-[state=active]:from-indigo-500/20 data-[state=active]:to-purple-500/20 data-[state=active]:text-indigo-300 data-[state=active]:border data-[state=active]:border-indigo-400/30 hover:bg-slate-700/30 transition-all duration-200 rounded-lg"
            >
              <Users className="w-5 h-5" />
              <span>Activity</span>
            </TabsTrigger>

            <TabsTrigger 
              value="sdn-manager" 
              className="flex flex-col items-center space-y-1 p-3 min-w-[90px] text-xs data-[state=active]:bg-gradient-to-br data-[state=active]:from-cyan-500/20 data-[state=active]:to-blue-500/20 data-[state=active]:text-cyan-300 data-[state=active]:border data-[state=active]:border-cyan-400/30 hover:bg-slate-700/30 transition-all duration-200 rounded-lg"
            >
              <Network className="w-5 h-5" />
              <span>SDN</span>
            </TabsTrigger>

            <TabsTrigger 
              value="parking" 
              className="flex flex-col items-center space-y-1 p-3 min-w-[90px] text-xs data-[state=active]:bg-gradient-to-br data-[state=active]:from-orange-500/20 data-[state=active]:to-red-500/20 data-[state=active]:text-orange-300 data-[state=active]:border data-[state=active]:border-orange-400/30 hover:bg-slate-700/30 transition-all duration-200 rounded-lg"
            >
              <ParkingCircle className="w-5 h-5" />
              <span>Parking</span>
            </TabsTrigger>

            <TabsTrigger 
              value="controls" 
              className="flex flex-col items-center space-y-1 p-3 min-w-[90px] text-xs data-[state=active]:bg-gradient-to-br data-[state=active]:from-gray-500/20 data-[state=active]:to-slate-500/20 data-[state=active]:text-gray-300 data-[state=active]:border data-[state=active]:border-gray-400/30 hover:bg-slate-700/30 transition-all duration-200 rounded-lg"
            >
              <Settings className="w-5 h-5" />
              <span>Controls</span>
            </TabsTrigger>

            <TabsTrigger 
              value="database" 
              className="flex flex-col items-center space-y-1 p-3 min-w-[90px] text-xs data-[state=active]:bg-gradient-to-br data-[state=active]:from-emerald-500/20 data-[state=active]:to-teal-500/20 data-[state=active]:text-emerald-300 data-[state=active]:border data-[state=active]:border-emerald-400/30 hover:bg-slate-700/30 transition-all duration-200 rounded-lg"
            >
              <Database className="w-5 h-5" />
              <span>Database</span>
            </TabsTrigger>
          </TabsList>
          <ScrollBar orientation="horizontal" className="h-2 bg-slate-700/30" />
        </ScrollArea>
      </div>

      <div className="mt-4">
        {children}
      </div>
    </Tabs>
  );
};
