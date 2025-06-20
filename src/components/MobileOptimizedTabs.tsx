
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Activity, 
  Database, 
  BarChart3, 
  AlertTriangle, 
  Settings, 
  Car, 
  MapPin, 
  Shield, 
  Monitor,
  CloudSnow,
  Map,
  Coins,
  Search,
  Heart,
  Download,
  Users,
  Camera,
  Upload,
  RefreshCw
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import RoleBasedAccess from "./RoleBasedAccess";

interface MobileOptimizedTabsProps {
  children: React.ReactNode;
  defaultValue: string;
}

export const MobileOptimizedTabs = ({ children, defaultValue }: MobileOptimizedTabsProps) => {
  const { userProfile } = useAuth();
  
  return (
    <Tabs defaultValue={defaultValue} className="w-full">
      <TabsList className="grid w-full bg-slate-800/50 border border-slate-700 p-1 h-auto flex-wrap min-h-[60px]">
        {/* Main Dashboard Tabs */}
        <TabsTrigger 
          value="realtime" 
          className="data-[state=active]:bg-blue-600 data-[state=active]:text-white flex items-center space-x-1 px-2 py-2 text-xs"
        >
          <Monitor className="w-3 h-3" />
          <span className="hidden sm:inline">Real-time</span>
        </TabsTrigger>

        <TabsTrigger 
          value="tn-traffic" 
          className="data-[state=active]:bg-blue-600 data-[state=active]:text-white flex items-center space-x-1 px-2 py-2 text-xs"
        >
          <Map className="w-3 h-3" />
          <span className="hidden sm:inline">TN Traffic</span>
        </TabsTrigger>

        <TabsTrigger 
          value="toll-monitor" 
          className="data-[state=active]:bg-blue-600 data-[state=active]:text-white flex items-center space-x-1 px-2 py-2 text-xs"
        >
          <Coins className="w-3 h-3" />
          <span className="hidden sm:inline">Toll Plaza</span>
        </TabsTrigger>

        <TabsTrigger 
          value="weather" 
          className="data-[state=active]:bg-blue-600 data-[state=active]:text-white flex items-center space-x-1 px-2 py-2 text-xs"
        >
          <CloudSnow className="w-3 h-3" />
          <span className="hidden sm:inline">Weather</span>
        </TabsTrigger>

        <TabsTrigger 
          value="dashboard" 
          className="data-[state=active]:bg-blue-600 data-[state=active]:text-white flex items-center space-x-1 px-2 py-2 text-xs"
        >
          <Activity className="w-3 h-3" />
          <span className="hidden sm:inline">Dashboard</span>
        </TabsTrigger>

        <TabsTrigger 
          value="live" 
          className="data-[state=active]:bg-blue-600 data-[state=active]:text-white flex items-center space-x-1 px-2 py-2 text-xs"
        >
          <Camera className="w-3 h-3" />
          <span className="hidden sm:inline">Live Feed</span>
        </TabsTrigger>

        {/* Enhanced Features Tabs */}
        <TabsTrigger 
          value="search" 
          className="data-[state=active]:bg-green-600 data-[state=active]:text-white flex items-center space-x-1 px-2 py-2 text-xs"
        >
          <Search className="w-3 h-3" />
          <span className="hidden sm:inline">Search</span>
        </TabsTrigger>

        <TabsTrigger 
          value="health" 
          className="data-[state=active]:bg-green-600 data-[state=active]:text-white flex items-center space-x-1 px-2 py-2 text-xs"
        >
          <Heart className="w-3 h-3" />
          <span className="hidden sm:inline">Health</span>
        </TabsTrigger>

        {/* Role-based tabs */}
        <RoleBasedAccess allowedRoles={['admin', 'operator']}>
          <TabsTrigger 
            value="export" 
            className="data-[state=active]:bg-purple-600 data-[state=active]:text-white flex items-center space-x-1 px-2 py-2 text-xs"
          >
            <Download className="w-3 h-3" />
            <span className="hidden sm:inline">Export</span>
          </TabsTrigger>

          <TabsTrigger 
            value="image-processing" 
            className="data-[state=active]:bg-purple-600 data-[state=active]:text-white flex items-center space-x-1 px-2 py-2 text-xs"
          >
            <Upload className="w-3 h-3" />
            <span className="hidden sm:inline">Images</span>
          </TabsTrigger>

          <TabsTrigger 
            value="vehicle-updates" 
            className="data-[state=active]:bg-purple-600 data-[state=active]:text-white flex items-center space-x-1 px-2 py-2 text-xs"
          >
            <RefreshCw className="w-3 h-3" />
            <span className="hidden sm:inline">Updates</span>
          </TabsTrigger>
        </RoleBasedAccess>

        <TabsTrigger 
          value="vehicle-details" 
          className="data-[state=active]:bg-blue-600 data-[state=active]:text-white flex items-center space-x-1 px-2 py-2 text-xs"
        >
          <Car className="w-3 h-3" />
          <span className="hidden sm:inline">Vehicle</span>
        </TabsTrigger>

        <TabsTrigger 
          value="network" 
          className="data-[state=active]:bg-blue-600 data-[state=active]:text-white flex items-center space-x-1 px-2 py-2 text-xs"
        >
          <MapPin className="w-3 h-3" />
          <span className="hidden sm:inline">Network</span>
        </TabsTrigger>

        {/* Admin only tabs */}
        <RoleBasedAccess allowedRoles={['admin']}>
          <TabsTrigger 
            value="activity" 
            className="data-[state=active]:bg-red-600 data-[state=active]:text-white flex items-center space-x-1 px-2 py-2 text-xs"
          >
            <Users className="w-3 h-3" />
            <span className="hidden sm:inline">Activity</span>
          </TabsTrigger>

          <TabsTrigger 
            value="sdn-manager" 
            className="data-[state=active]:bg-red-600 data-[state=active]:text-white flex items-center space-x-1 px-2 py-2 text-xs"
          >
            <Shield className="w-3 h-3" />
            <span className="hidden sm:inline">SDN</span>
          </TabsTrigger>

          <TabsTrigger 
            value="parking" 
            className="data-[state=active]:bg-red-600 data-[state=active]:text-white flex items-center space-x-1 px-2 py-2 text-xs"
          >
            <Car className="w-3 h-3" />
            <span className="hidden sm:inline">Parking</span>
          </TabsTrigger>

          <TabsTrigger 
            value="controls" 
            className="data-[state=active]:bg-red-600 data-[state=active]:text-white flex items-center space-x-1 px-2 py-2 text-xs"
          >
            <Settings className="w-3 h-3" />
            <span className="hidden sm:inline">Controls</span>
          </TabsTrigger>
        </RoleBasedAccess>

        <TabsTrigger 
          value="database" 
          className="data-[state=active]:bg-blue-600 data-[state=active]:text-white flex items-center space-x-1 px-2 py-2 text-xs"
        >
          <Database className="w-3 h-3" />
          <span className="hidden sm:inline">Database</span>
        </TabsTrigger>

        <TabsTrigger 
          value="alerts" 
          className="data-[state=active]:bg-yellow-600 data-[state=active]:text-white flex items-center space-x-1 px-2 py-2 text-xs"
        >
          <AlertTriangle className="w-3 h-3" />
          <span className="hidden sm:inline">Alerts</span>
        </TabsTrigger>

        <TabsTrigger 
          value="analytics" 
          className="data-[state=active]:bg-blue-600 data-[state=active]:text-white flex items-center space-x-1 px-2 py-2 text-xs"
        >
          <BarChart3 className="w-3 h-3" />
          <span className="hidden sm:inline">Analytics</span>
        </TabsTrigger>
      </TabsList>
      {children}
    </Tabs>
  );
};
