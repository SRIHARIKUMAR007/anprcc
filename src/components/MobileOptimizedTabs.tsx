
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Activity, 
  Database, 
  BarChart3, 
  AlertTriangle, 
  Settings, 
  MapPin, 
  Shield, 
  Monitor,
  CloudSnow,
  Map,
  Coins,
  Heart,
  Download,
  Users,
  Camera,
  Upload,
  Radio
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
      <div className="w-full overflow-x-auto scrollbar-hide">
        <TabsList className="inline-flex w-max bg-slate-800/50 border border-slate-700 p-1 h-auto gap-1 min-w-full sm:min-w-max">
          {/* Main Dashboard Tabs */}
          <TabsTrigger 
            value="realtime" 
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-2 text-xs sm:text-sm whitespace-nowrap flex-shrink-0"
          >
            <Monitor className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Real-time</span>
            <span className="sm:hidden">Live</span>
          </TabsTrigger>

          <TabsTrigger 
            value="live-data" 
            className="data-[state=active]:bg-green-600 data-[state=active]:text-white flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-2 text-xs sm:text-sm whitespace-nowrap flex-shrink-0"
          >
            <Radio className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Live Data</span>
            <span className="sm:hidden">Data</span>
          </TabsTrigger>

          <TabsTrigger 
            value="tn-traffic" 
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-2 text-xs sm:text-sm whitespace-nowrap flex-shrink-0"
          >
            <Map className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">TN Traffic</span>
            <span className="sm:hidden">Map</span>
          </TabsTrigger>

          <TabsTrigger 
            value="toll-monitor" 
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-2 text-xs sm:text-sm whitespace-nowrap flex-shrink-0"
          >
            <Coins className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Toll Plaza</span>
            <span className="sm:hidden">Toll</span>
          </TabsTrigger>

          <TabsTrigger 
            value="weather" 
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-2 text-xs sm:text-sm whitespace-nowrap flex-shrink-0"
          >
            <CloudSnow className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Weather</span>
            <span className="sm:hidden">Weather</span>
          </TabsTrigger>

          <TabsTrigger 
            value="dashboard" 
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-2 text-xs sm:text-sm whitespace-nowrap flex-shrink-0"
          >
            <Activity className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Dashboard</span>
            <span className="sm:hidden">Dash</span>
          </TabsTrigger>

          <TabsTrigger 
            value="live" 
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-2 text-xs sm:text-sm whitespace-nowrap flex-shrink-0"
          >
            <Camera className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Live Feed</span>
            <span className="sm:hidden">Feed</span>
          </TabsTrigger>

          {/* Enhanced Features Tabs */}
          <TabsTrigger 
            value="health" 
            className="data-[state=active]:bg-green-600 data-[state=active]:text-white flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-2 text-xs sm:text-sm whitespace-nowrap flex-shrink-0"
          >
            <Heart className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Health</span>
            <span className="sm:hidden">Health</span>
          </TabsTrigger>

          {/* Role-based tabs */}
          <RoleBasedAccess allowedRoles={['admin', 'operator']}>
            <TabsTrigger 
              value="export" 
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-2 text-xs sm:text-sm whitespace-nowrap flex-shrink-0"
            >
              <Download className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Export</span>
              <span className="sm:hidden">Export</span>
            </TabsTrigger>

            <TabsTrigger 
              value="image-processing" 
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-2 text-xs sm:text-sm whitespace-nowrap flex-shrink-0"
            >
              <Upload className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">ANPR Live</span>
              <span className="sm:hidden">ANPR</span>
            </TabsTrigger>

            <TabsTrigger 
              value="vehicle-updates" 
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-2 text-xs sm:text-sm whitespace-nowrap flex-shrink-0"
            >
              <Camera className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Updates</span>
              <span className="sm:hidden">Updates</span>
            </TabsTrigger>
          </RoleBasedAccess>

          <TabsTrigger 
            value="network" 
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-2 text-xs sm:text-sm whitespace-nowrap flex-shrink-0"
          >
            <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Network</span>
            <span className="sm:hidden">Net</span>
          </TabsTrigger>

          {/* Admin only tabs */}
          <RoleBasedAccess allowedRoles={['admin']}>
            <TabsTrigger 
              value="activity" 
              className="data-[state=active]:bg-red-600 data-[state=active]:text-white flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-2 text-xs sm:text-sm whitespace-nowrap flex-shrink-0"
            >
              <Users className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Activity</span>
              <span className="sm:hidden">Users</span>
            </TabsTrigger>

            <TabsTrigger 
              value="sdn-manager" 
              className="data-[state=active]:bg-red-600 data-[state=active]:text-white flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-2 text-xs sm:text-sm whitespace-nowrap flex-shrink-0"
            >
              <Shield className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">SDN</span>
              <span className="sm:hidden">SDN</span>
            </TabsTrigger>

            <TabsTrigger 
              value="controls" 
              className="data-[state=active]:bg-red-600 data-[state=active]:text-white flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-2 text-xs sm:text-sm whitespace-nowrap flex-shrink-0"
            >
              <Settings className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Controls</span>
              <span className="sm:hidden">Config</span>
            </TabsTrigger>
          </RoleBasedAccess>

          <TabsTrigger 
            value="database" 
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-2 text-xs sm:text-sm whitespace-nowrap flex-shrink-0"
          >
            <Database className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Database</span>
            <span className="sm:hidden">DB</span>
          </TabsTrigger>

          <TabsTrigger 
            value="alerts" 
            className="data-[state=active]:bg-yellow-600 data-[state=active]:text-white flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-2 text-xs sm:text-sm whitespace-nowrap flex-shrink-0"
          >
            <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Alerts</span>
            <span className="sm:hidden">Alert</span>
          </TabsTrigger>

          <TabsTrigger 
            value="analytics" 
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-2 text-xs sm:text-sm whitespace-nowrap flex-shrink-0"
          >
            <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Analytics</span>
            <span className="sm:hidden">Stats</span>
          </TabsTrigger>
        </TabsList>
      </div>
      <div className="mt-4 w-full overflow-hidden">
        {children}
      </div>
    </Tabs>
  );
};
