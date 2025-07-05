
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
      <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 xl:grid-cols-8 gap-1 h-auto p-1 bg-slate-800/50 backdrop-blur-sm">
        <TabsTrigger 
          value="realtime" 
          className="flex flex-col items-center space-y-1 p-2 text-xs data-[state=active]:bg-blue-600/20 data-[state=active]:text-blue-400"
        >
          <Activity className="w-4 h-4" />
          <span className="hidden sm:inline">Real-time</span>
          <span className="sm:hidden">Live</span>
        </TabsTrigger>
        
        <TabsTrigger 
          value="live-data" 
          className="flex flex-col items-center space-y-1 p-2 text-xs data-[state=active]:bg-green-600/20 data-[state=active]:text-green-400"
        >
          <Database className="w-4 h-4" />
          <span className="hidden sm:inline">Live Data</span>
          <span className="sm:hidden">Data</span>
        </TabsTrigger>

        <TabsTrigger 
          value="security" 
          className="flex flex-col items-center space-y-1 p-2 text-xs data-[state=active]:bg-purple-600/20 data-[state=active]:text-purple-400"
        >
          <Shield className="w-4 h-4" />
          <span className="hidden sm:inline">Security</span>
          <span className="sm:hidden">Sec</span>
        </TabsTrigger>

        <TabsTrigger 
          value="tn-traffic" 
          className="flex flex-col items-center space-y-1 p-2 text-xs data-[state=active]:bg-orange-600/20 data-[state=active]:text-orange-400"
        >
          <MapPin className="w-4 h-4" />
          <span className="hidden sm:inline">TN Traffic</span>
          <span className="sm:hidden">Map</span>
        </TabsTrigger>

        <TabsTrigger 
          value="toll-monitor" 
          className="flex flex-col items-center space-y-1 p-2 text-xs data-[state=active]:bg-cyan-600/20 data-[state=active]:text-cyan-400"
        >
          <Truck className="w-4 h-4" />
          <span className="hidden sm:inline">Toll Plaza</span>
          <span className="sm:hidden">Toll</span>
        </TabsTrigger>

        <TabsTrigger 
          value="weather" 
          className="flex flex-col items-center space-y-1 p-2 text-xs data-[state=active]:bg-indigo-600/20 data-[state=active]:text-indigo-400"
        >
          <Cloud className="w-4 h-4" />
          <span className="hidden sm:inline">Weather</span>
          <span className="sm:hidden">Weather</span>
        </TabsTrigger>

        <TabsTrigger 
          value="dashboard" 
          className="flex flex-col items-center space-y-1 p-2 text-xs data-[state=active]:bg-violet-600/20 data-[state=active]:text-violet-400"
        >
          <BarChart3 className="w-4 h-4" />
          <span className="hidden sm:inline">Dashboard</span>
          <span className="sm:hidden">Dash</span>
        </TabsTrigger>

        <TabsTrigger 
          value="live" 
          className="flex flex-col items-center space-y-1 p-2 text-xs data-[state=active]:bg-red-600/20 data-[state=active]:text-red-400"
        >
          <Camera className="w-4 h-4" />
          <span className="hidden sm:inline">Live Feed</span>
          <span className="sm:hidden">Feed</span>
        </TabsTrigger>
      </TabsList>

      {/* Secondary Tabs Row */}
      <div className="mt-2">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 xl:grid-cols-8 gap-1 h-auto p-1 bg-slate-700/30 backdrop-blur-sm">
          <TabsTrigger 
            value="health" 
            className="flex flex-col items-center space-y-1 p-2 text-xs data-[state=active]:bg-emerald-600/20 data-[state=active]:text-emerald-400"
          >
            <Heart className="w-4 h-4" />
            <span className="hidden sm:inline">Health</span>
            <span className="sm:hidden">Health</span>
          </TabsTrigger>

          <TabsTrigger 
            value="export" 
            className="flex flex-col items-center space-y-1 p-2 text-xs data-[state=active]:bg-teal-600/20 data-[state=active]:text-teal-400"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export</span>
            <span className="sm:hidden">Export</span>
          </TabsTrigger>

          <TabsTrigger 
            value="image-processing" 
            className="flex flex-col items-center space-y-1 p-2 text-xs data-[state=active]:bg-pink-600/20 data-[state=active]:text-pink-400"
          >
            <FileImage className="w-4 h-4" />
            <span className="hidden sm:inline">Image Proc</span>
            <span className="sm:hidden">Image</span>
          </TabsTrigger>

          <TabsTrigger 
            value="vehicle-updates" 
            className="flex flex-col items-center space-y-1 p-2 text-xs data-[state=active]:bg-lime-600/20 data-[state=active]:text-lime-400"
          >
            <Upload className="w-4 h-4" />
            <span className="hidden sm:inline">Updates</span>
            <span className="sm:hidden">Updates</span>
          </TabsTrigger>

          <TabsTrigger 
            value="vehicle-details" 
            className="flex flex-col items-center space-y-1 p-2 text-xs data-[state=active]:bg-yellow-600/20 data-[state=active]:text-yellow-400"
          >
            <Car className="w-4 h-4" />
            <span className="hidden sm:inline">Vehicles</span>
            <span className="sm:hidden">Cars</span>
          </TabsTrigger>

          <TabsTrigger 
            value="alerts" 
            className="flex flex-col items-center space-y-1 p-2 text-xs data-[state=active]:bg-red-600/20 data-[state=active]:text-red-400"
          >
            <Bell className="w-4 h-4" />
            <span className="hidden sm:inline">Alerts</span>
            <span className="sm:hidden">Alerts</span>
          </TabsTrigger>

          <TabsTrigger 
            value="network" 
            className="flex flex-col items-center space-y-1 p-2 text-xs data-[state=active]:bg-blue-600/20 data-[state=active]:text-blue-400"
          >
            <Network className="w-4 h-4" />
            <span className="hidden sm:inline">Network</span>
            <span className="sm:hidden">Net</span>
          </TabsTrigger>

          <TabsTrigger 
            value="analytics" 
            className="flex flex-col items-center space-y-1 p-2 text-xs data-[state=active]:bg-purple-600/20 data-[state=active]:text-purple-400"
          >
            <TrendingUp className="w-4 h-4" />
            <span className="hidden sm:inline">Analytics</span>
            <span className="sm:hidden">Stats</span>
          </TabsTrigger>
        </TabsList>
      </div>

      {/* Additional Admin Tabs */}
      <div className="mt-2">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-1 h-auto p-1 bg-slate-600/20 backdrop-blur-sm">
          <TabsTrigger 
            value="activity" 
            className="flex flex-col items-center space-y-1 p-2 text-xs data-[state=active]:bg-indigo-600/20 data-[state=active]:text-indigo-400"
          >
            <Users className="w-4 h-4" />
            <span className="hidden sm:inline">Activity</span>
            <span className="sm:hidden">Users</span>
          </TabsTrigger>

          <TabsTrigger 
            value="sdn-manager" 
            className="flex flex-col items-center space-y-1 p-2 text-xs data-[state=active]:bg-cyan-600/20 data-[state=active]:text-cyan-400"
          >
            <Network className="w-4 h-4" />
            <span className="hidden sm:inline">SDN</span>
            <span className="sm:hidden">SDN</span>
          </TabsTrigger>

          <TabsTrigger 
            value="parking" 
            className="flex flex-col items-center space-y-1 p-2 text-xs data-[state=active]:bg-orange-600/20 data-[state=active]:text-orange-400"
          >
            <ParkingCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Parking</span>
            <span className="sm:hidden">Park</span>
          </TabsTrigger>

          <TabsTrigger 
            value="controls" 
            className="flex flex-col items-center space-y-1 p-2 text-xs data-[state=active]:bg-gray-600/20 data-[state=active]:text-gray-400"
          >
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">Controls</span>
            <span className="sm:hidden">Ctrl</span>
          </TabsTrigger>

          <TabsTrigger 
            value="database" 
            className="flex flex-col items-center space-y-1 p-2 text-xs data-[state=active]:bg-emerald-600/20 data-[state=active]:text-emerald-400"
          >
            <Database className="w-4 h-4" />
            <span className="hidden sm:inline">Database</span>
            <span className="sm:hidden">DB</span>
          </TabsTrigger>
        </TabsList>
      </div>

      <div className="mt-4">
        {children}
      </div>
    </Tabs>
  );
};
