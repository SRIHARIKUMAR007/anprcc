
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
  Settings,
  Users,
  FileImage,
  TrendingUp,
  Network,
  Home
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import RoleBasedAccess from "./RoleBasedAccess";

interface MobileOptimizedTabsProps {
  children: React.ReactNode;
  defaultValue?: string;
}

export const MobileOptimizedTabs = ({ children, defaultValue = "home" }: MobileOptimizedTabsProps) => {
  const { userProfile } = useAuth();
  
  return (
    <Tabs defaultValue={defaultValue} className="w-full">
      <div className="w-full border-b border-cyan-500/30 cyber-glass sticky top-0 z-40 backdrop-blur-xl">
        <ScrollArea className="w-full whitespace-nowrap">
          <TabsList className="inline-flex h-20 w-max min-w-full items-center justify-start gap-3 p-4 bg-transparent">
            
            {/* Home Tab - New primary tab */}
            <TabsTrigger 
              value="home" 
              className="flex flex-col items-center space-y-2 p-4 min-w-[100px] h-16 text-xs data-[state=active]:cyber-glow data-[state=active]:bg-gradient-to-br data-[state=active]:from-emerald-500/30 data-[state=active]:to-cyan-500/30 data-[state=active]:text-emerald-300 data-[state=active]:border-2 data-[state=active]:border-emerald-400/50 hover:bg-slate-700/40 transition-all duration-300 rounded-xl cyber-glass shadow-lg"
            >
              <Home className="w-6 h-6" />
              <span className="font-semibold">Home</span>
            </TabsTrigger>
            
            {/* Core Tabs - Available to all users */}
            <TabsTrigger 
              value="realtime" 
              className="flex flex-col items-center space-y-2 p-4 min-w-[100px] h-16 text-xs data-[state=active]:cyber-glow data-[state=active]:bg-gradient-to-br data-[state=active]:from-blue-500/30 data-[state=active]:to-cyan-500/30 data-[state=active]:text-cyan-300 data-[state=active]:border-2 data-[state=active]:border-cyan-400/50 hover:bg-slate-700/40 transition-all duration-300 rounded-xl cyber-glass shadow-lg"
            >
              <Activity className="w-6 h-6" />
              <span className="font-semibold">Real-time</span>
            </TabsTrigger>

            <TabsTrigger 
              value="sdn-controller" 
              className="flex flex-col items-center space-y-2 p-4 min-w-[100px] h-16 text-xs data-[state=active]:cyber-glow data-[state=active]:bg-gradient-to-br data-[state=active]:from-purple-500/30 data-[state=active]:to-pink-500/30 data-[state=active]:text-purple-300 data-[state=active]:border-2 data-[state=active]:border-purple-400/50 hover:bg-slate-700/40 transition-all duration-300 rounded-xl cyber-glass shadow-lg"
            >
              <Network className="w-6 h-6" />
              <span className="font-semibold">SDN Control</span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="live-data" 
              className="flex flex-col items-center space-y-2 p-4 min-w-[100px] h-16 text-xs data-[state=active]:cyber-glow-green data-[state=active]:bg-gradient-to-br data-[state=active]:from-emerald-500/30 data-[state=active]:to-green-500/30 data-[state=active]:text-emerald-300 data-[state=active]:border-2 data-[state=active]:border-emerald-400/50 hover:bg-slate-700/40 transition-all duration-300 rounded-xl cyber-glass shadow-lg"
            >
              <Database className="w-6 h-6" />
              <span className="font-semibold">Live Data</span>
            </TabsTrigger>

            <TabsTrigger 
              value="security" 
              className="flex flex-col items-center space-y-2 p-4 min-w-[100px] h-16 text-xs data-[state=active]:cyber-glow data-[state=active]:bg-gradient-to-br data-[state=active]:from-red-500/30 data-[state=active]:to-orange-500/30 data-[state=active]:text-red-300 data-[state=active]:border-2 data-[state=active]:border-red-400/50 hover:bg-slate-700/40 transition-all duration-300 rounded-xl cyber-glass shadow-lg"
            >
              <Shield className="w-6 h-6" />
              <span className="font-semibold">Security</span>
            </TabsTrigger>

            <TabsTrigger 
              value="tn-traffic" 
              className="flex flex-col items-center space-y-2 p-4 min-w-[100px] h-16 text-xs data-[state=active]:bg-gradient-to-br data-[state=active]:from-orange-500/30 data-[state=active]:to-amber-500/30 data-[state=active]:text-orange-300 data-[state=active]:border-2 data-[state=active]:border-orange-400/50 hover:bg-slate-700/40 transition-all duration-300 rounded-xl cyber-glass shadow-lg"
            >
              <MapPin className="w-6 h-6" />
              <span className="font-semibold">TN Traffic</span>
            </TabsTrigger>

            <TabsTrigger 
              value="toll-monitor" 
              className="flex flex-col items-center space-y-2 p-4 min-w-[100px] h-16 text-xs data-[state=active]:cyber-glow-cyan data-[state=active]:bg-gradient-to-br data-[state=active]:from-cyan-500/30 data-[state=active]:to-teal-500/30 data-[state=active]:text-cyan-300 data-[state=active]:border-2 data-[state=active]:border-cyan-400/50 hover:bg-slate-700/40 transition-all duration-300 rounded-xl cyber-glass shadow-lg"
            >
              <Truck className="w-6 h-6" />
              <span className="font-semibold">Toll Plaza</span>
            </TabsTrigger>

            <TabsTrigger 
              value="weather" 
              className="flex flex-col items-center space-y-2 p-4 min-w-[100px] h-16 text-xs data-[state=active]:bg-gradient-to-br data-[state=active]:from-indigo-500/30 data-[state=active]:to-blue-500/30 data-[state=active]:text-indigo-300 data-[state=active]:border-2 data-[state=active]:border-indigo-400/50 hover:bg-slate-700/40 transition-all duration-300 rounded-xl cyber-glass shadow-lg"
            >
              <Cloud className="w-6 h-6" />
              <span className="font-semibold">Weather</span>
            </TabsTrigger>

            <TabsTrigger 
              value="dashboard" 
              className="flex flex-col items-center space-y-2 p-4 min-w-[100px] h-16 text-xs data-[state=active]:bg-gradient-to-br data-[state=active]:from-violet-500/30 data-[state=active]:to-purple-500/30 data-[state=active]:text-violet-300 data-[state=active]:border-2 data-[state=active]:border-violet-400/50 hover:bg-slate-700/40 transition-all duration-300 rounded-xl cyber-glass shadow-lg"
            >
              <BarChart3 className="w-6 h-6" />
              <span className="font-semibold">Dashboard</span>
            </TabsTrigger>

            <TabsTrigger 
              value="live" 
              className="flex flex-col items-center space-y-2 p-4 min-w-[100px] h-16 text-xs data-[state=active]:bg-gradient-to-br data-[state=active]:from-pink-500/30 data-[state=active]:to-rose-500/30 data-[state=active]:text-pink-300 data-[state=active]:border-2 data-[state=active]:border-pink-400/50 hover:bg-slate-700/40 transition-all duration-300 rounded-xl cyber-glass shadow-lg"
            >
              <Camera className="w-6 h-6" />
              <span className="font-semibold">Live Feed</span>
            </TabsTrigger>

            <TabsTrigger 
              value="health" 
              className="flex flex-col items-center space-y-2 p-4 min-w-[100px] h-16 text-xs data-[state=active]:cyber-glow-green data-[state=active]:bg-gradient-to-br data-[state=active]:from-green-500/30 data-[state=active]:to-emerald-500/30 data-[state=active]:text-green-300 data-[state=active]:border-2 data-[state=active]:border-green-400/50 hover:bg-slate-700/40 transition-all duration-300 rounded-xl cyber-glass shadow-lg"
            >
              <Heart className="w-6 h-6" />
              <span className="font-semibold">Health</span>
            </TabsTrigger>

            {/* Operator and Admin only tabs */}
            <RoleBasedAccess allowedRoles={['admin', 'operator']}>
              <TabsTrigger 
                value="export" 
                className="flex flex-col items-center space-y-2 p-4 min-w-[100px] h-16 text-xs data-[state=active]:cyber-glow-cyan data-[state=active]:bg-gradient-to-br data-[state=active]:from-teal-500/30 data-[state=active]:to-cyan-500/30 data-[state=active]:text-teal-300 data-[state=active]:border-2 data-[state=active]:border-teal-400/50 hover:bg-slate-700/40 transition-all duration-300 rounded-xl cyber-glass shadow-lg"
              >
                <Download className="w-6 h-6" />
                <span className="font-semibold">Export</span>
              </TabsTrigger>

              <TabsTrigger 
                value="image-processing" 
                className="flex flex-col items-center space-y-2 p-4 min-w-[100px] h-16 text-xs data-[state=active]:bg-gradient-to-br data-[state=active]:from-pink-500/30 data-[state=active]:to-rose-500/30 data-[state=active]:text-pink-300 data-[state=active]:border-2 data-[state=active]:border-pink-400/50 hover:bg-slate-700/40 transition-all duration-300 rounded-xl cyber-glass shadow-lg"
              >
                <FileImage className="w-6 h-6" />
                <span className="font-semibold">Image Proc</span>
              </TabsTrigger>

              <TabsTrigger 
                value="vehicle-updates" 
                className="flex flex-col items-center space-y-2 p-4 min-w-[100px] h-16 text-xs data-[state=active]:bg-gradient-to-br data-[state=active]:from-lime-500/30 data-[state=active]:to-green-500/30 data-[state=active]:text-lime-300 data-[state=active]:border-2 data-[state=active]:border-lime-400/50 hover:bg-slate-700/40 transition-all duration-300 rounded-xl cyber-glass shadow-lg"
              >
                <Upload className="w-6 h-6" />
                <span className="font-semibold">Updates</span>
              </TabsTrigger>
            </RoleBasedAccess>

            {/* Common tabs */}
            <TabsTrigger 
              value="vehicle-details" 
              className="flex flex-col items-center space-y-2 p-4 min-w-[100px] h-16 text-xs data-[state=active]:bg-gradient-to-br data-[state=active]:from-yellow-500/30 data-[state=active]:to-amber-500/30 data-[state=active]:text-yellow-300 data-[state=active]:border-2 data-[state=active]:border-yellow-400/50 hover:bg-slate-700/40 transition-all duration-300 rounded-xl cyber-glass shadow-lg"
            >
              <Car className="w-6 h-6" />
              <span className="font-semibold">Vehicles</span>
            </TabsTrigger>

            <TabsTrigger 
              value="alerts" 
              className="flex flex-col items-center space-y-2 p-4 min-w-[100px] h-16 text-xs data-[state=active]:bg-gradient-to-br data-[state=active]:from-red-500/30 data-[state=active]:to-orange-500/30 data-[state=active]:text-red-300 data-[state=active]:border-2 data-[state=active]:border-red-400/50 hover:bg-slate-700/40 transition-all duration-300 rounded-xl cyber-glass shadow-lg"
            >
              <Bell className="w-6 h-6" />
              <span className="font-semibold">Alerts</span>
            </TabsTrigger>

            <TabsTrigger 
              value="analytics" 
              className="flex flex-col items-center space-y-2 p-4 min-w-[100px] h-16 text-xs data-[state=active]:cyber-glow data-[state=active]:bg-gradient-to-br data-[state=active]:from-purple-500/30 data-[state=active]:to-pink-500/30 data-[state=active]:text-purple-300 data-[state=active]:border-2 data-[state=active]:border-purple-400/50 hover:bg-slate-700/40 transition-all duration-300 rounded-xl cyber-glass shadow-lg"
            >
              <TrendingUp className="w-6 h-6" />
              <span className="font-semibold">Analytics</span>
            </TabsTrigger>

            <TabsTrigger 
              value="database" 
              className="flex flex-col items-center space-y-2 p-4 min-w-[100px] h-16 text-xs data-[state=active]:cyber-glow-green data-[state=active]:bg-gradient-to-br data-[state=active]:from-emerald-500/30 data-[state=active]:to-teal-500/30 data-[state=active]:text-emerald-300 data-[state=active]:border-2 data-[state=active]:border-emerald-400/50 hover:bg-slate-700/40 transition-all duration-300 rounded-xl cyber-glass shadow-lg"
            >
              <Database className="w-6 h-6" />
              <span className="font-semibold">Database</span>
            </TabsTrigger>

            {/* Admin only tabs */}
            <RoleBasedAccess allowedRoles={['admin']}>
              <TabsTrigger 
                value="activity" 
                className="flex flex-col items-center space-y-2 p-4 min-w-[100px] h-16 text-xs data-[state=active]:bg-gradient-to-br data-[state=active]:from-indigo-500/30 data-[state=active]:to-purple-500/30 data-[state=active]:text-indigo-300 data-[state=active]:border-2 data-[state=active]:border-indigo-400/50 hover:bg-slate-700/40 transition-all duration-300 rounded-xl cyber-glass shadow-lg"
              >
                <Users className="w-6 h-6" />
                <span className="font-semibold">Activity</span>
              </TabsTrigger>

              <TabsTrigger 
                value="controls" 
                className="flex flex-col items-center space-y-2 p-4 min-w-[100px] h-16 text-xs data-[state=active]:bg-gradient-to-br data-[state=active]:from-gray-500/30 data-[state=active]:to-slate-500/30 data-[state=active]:text-gray-300 data-[state=active]:border-2 data-[state=active]:border-gray-400/50 hover:bg-slate-700/40 transition-all duration-300 rounded-xl cyber-glass shadow-lg"
              >
                <Settings className="w-6 h-6" />
                <span className="font-semibold">Controls</span>
              </TabsTrigger>
            </RoleBasedAccess>
          </TabsList>
          <ScrollBar orientation="horizontal" className="h-2 bg-slate-700/50 rounded-full" />
        </ScrollArea>
      </div>

      <div className="mt-6">
        {children}
      </div>
    </Tabs>
  );
};
