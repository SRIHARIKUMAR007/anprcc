
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
  Heart,
  Download,
  Users,
  Camera,
  Upload,
  RefreshCw,
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
      <div className="overflow-x-auto">
        <TabsList className="inline-flex w-max bg-slate-800/50 border border-slate-700 p-1 h-auto gap-1">
          {/* Main Dashboard Tabs */}
          <TabsTrigger 
            value="realtime" 
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white flex items-center space-x-2 px-3 py-2 text-sm whitespace-nowrap"
          >
            <Monitor className="w-4 h-4" />
            <span>Real-time</span>
          </TabsTrigger>

          <TabsTrigger 
            value="live-data" 
            className="data-[state=active]:bg-green-600 data-[state=active]:text-white flex items-center space-x-2 px-3 py-2 text-sm whitespace-nowrap"
          >
            <Radio className="w-4 h-4" />
            <span>Live Data</span>
          </TabsTrigger>

          <TabsTrigger 
            value="tn-traffic" 
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white flex items-center space-x-2 px-3 py-2 text-sm whitespace-nowrap"
          >
            <Map className="w-4 h-4" />
            <span>TN Traffic</span>
          </TabsTrigger>

          <TabsTrigger 
            value="toll-monitor" 
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white flex items-center space-x-2 px-3 py-2 text-sm whitespace-nowrap"
          >
            <Coins className="w-4 h-4" />
            <span>Toll Plaza</span>
          </TabsTrigger>

          <TabsTrigger 
            value="weather" 
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white flex items-center space-x-2 px-3 py-2 text-sm whitespace-nowrap"
          >
            <CloudSnow className="w-4 h-4" />
            <span>Weather</span>
          </TabsTrigger>

          <TabsTrigger 
            value="dashboard" 
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white flex items-center space-x-2 px-3 py-2 text-sm whitespace-nowrap"
          >
            <Activity className="w-4 h-4" />
            <span>Dashboard</span>
          </TabsTrigger>

          <TabsTrigger 
            value="live" 
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white flex items-center space-x-2 px-3 py-2 text-sm whitespace-nowrap"
          >
            <Camera className="w-4 h-4" />
            <span>Live Feed</span>
          </TabsTrigger>

          {/* Enhanced Features Tabs */}
          <TabsTrigger 
            value="health" 
            className="data-[state=active]:bg-green-600 data-[state=active]:text-white flex items-center space-x-2 px-3 py-2 text-sm whitespace-nowrap"
          >
            <Heart className="w-4 h-4" />
            <span>Health</span>
          </TabsTrigger>

          {/* Role-based tabs */}
          <RoleBasedAccess allowedRoles={['admin', 'operator']}>
            <TabsTrigger 
              value="export" 
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white flex items-center space-x-2 px-3 py-2 text-sm whitespace-nowrap"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </TabsTrigger>

            <TabsTrigger 
              value="image-processing" 
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white flex items-center space-x-2 px-3 py-2 text-sm whitespace-nowrap"
            >
              <Upload className="w-4 h-4" />
              <span>Images</span>
            </TabsTrigger>

            <TabsTrigger 
              value="vehicle-updates" 
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white flex items-center space-x-2 px-3 py-2 text-sm whitespace-nowrap"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Updates</span>
            </TabsTrigger>
          </RoleBasedAccess>

          <TabsTrigger 
            value="vehicle-details" 
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white flex items-center space-x-2 px-3 py-2 text-sm whitespace-nowrap"
          >
            <Car className="w-4 h-4" />
            <span>Vehicle</span>
          </TabsTrigger>

          <TabsTrigger 
            value="network" 
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white flex items-center space-x-2 px-3 py-2 text-sm whitespace-nowrap"
          >
            <MapPin className="w-4 h-4" />
            <span>Network</span>
          </TabsTrigger>

          {/* Admin only tabs */}
          <RoleBasedAccess allowedRoles={['admin']}>
            <TabsTrigger 
              value="activity" 
              className="data-[state=active]:bg-red-600 data-[state=active]:text-white flex items-center space-x-2 px-3 py-2 text-sm whitespace-nowrap"
            >
              <Users className="w-4 h-4" />
              <span>Activity</span>
            </TabsTrigger>

            <TabsTrigger 
              value="sdn-manager" 
              className="data-[state=active]:bg-red-600 data-[state=active]:text-white flex items-center space-x-2 px-3 py-2 text-sm whitespace-nowrap"
            >
              <Shield className="w-4 h-4" />
              <span>SDN</span>
            </TabsTrigger>

            <TabsTrigger 
              value="parking" 
              className="data-[state=active]:bg-red-600 data-[state=active]:text-white flex items-center space-x-2 px-3 py-2 text-sm whitespace-nowrap"
            >
              <Car className="w-4 h-4" />
              <span>Parking</span>
            </TabsTrigger>

            <TabsTrigger 
              value="controls" 
              className="data-[state=active]:bg-red-600 data-[state=active]:text-white flex items-center space-x-2 px-3 py-2 text-sm whitespace-nowrap"
            >
              <Settings className="w-4 h-4" />
              <span>Controls</span>
            </TabsTrigger>
          </RoleBasedAccess>

          <TabsTrigger 
            value="database" 
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white flex items-center space-x-2 px-3 py-2 text-sm whitespace-nowrap"
          >
            <Database className="w-4 h-4" />
            <span>Database</span>
          </TabsTrigger>

          <TabsTrigger 
            value="alerts" 
            className="data-[state=active]:bg-yellow-600 data-[state=active]:text-white flex items-center space-x-2 px-3 py-2 text-sm whitespace-nowrap"
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Alerts</span>
          </TabsTrigger>

          <TabsTrigger 
            value="analytics" 
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white flex items-center space-x-2 px-3 py-2 text-sm whitespace-nowrap"
          >
            <BarChart3 className="w-4 h-4" />
            <span>Analytics</span>
          </TabsTrigger>
        </TabsList>
      </div>
      {children}
    </Tabs>
  );
};
