
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { 
  Activity, 
  Map, 
  Truck, 
  Cloud, 
  BarChart3, 
  Camera, 
  Upload, 
  RefreshCw, 
  Car, 
  Network, 
  Settings, 
  ParkingCircle, 
  Database, 
  AlertTriangle, 
  TrendingUp,
  Shield,
  Eye
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import RoleBasedAccess from "./RoleBasedAccess";

interface MobileOptimizedTabsProps {
  children: React.ReactNode;
  defaultValue: string;
}

export function MobileOptimizedTabs({ children, defaultValue }: MobileOptimizedTabsProps) {
  const { userProfile } = useAuth();
  
  const userRole = userProfile?.role || 'viewer';

  return (
    <Tabs defaultValue={defaultValue} className="w-full">
      <div className="sticky top-0 z-40 bg-gradient-to-r from-slate-900/95 to-blue-900/95 backdrop-blur-sm border-b border-slate-700/50 mb-6">
        <ScrollArea className="w-full whitespace-nowrap">
          <TabsList className="inline-flex h-12 items-center justify-start w-max bg-transparent p-1 text-slate-400">
            
            {/* Core tabs available to all roles */}
            <TabsTrigger 
              value="realtime" 
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm"
            >
              <Activity className="w-4 h-4 mr-2" />
              Live Monitor
            </TabsTrigger>

            <TabsTrigger 
              value="tn-traffic" 
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm"
            >
              <Map className="w-4 h-4 mr-2" />
              TN Traffic
            </TabsTrigger>

            <TabsTrigger 
              value="toll-monitor" 
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm"
            >
              <Truck className="w-4 h-4 mr-2" />
              Toll Plaza
            </TabsTrigger>

            <TabsTrigger 
              value="weather" 
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm"
            >
              <Cloud className="w-4 h-4 mr-2" />
              Weather
            </TabsTrigger>

            <TabsTrigger 
              value="dashboard" 
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Dashboard
            </TabsTrigger>

            <TabsTrigger 
              value="live" 
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm"
            >
              <Camera className="w-4 h-4 mr-2" />
              Live Feed
            </TabsTrigger>

            {/* Operator and Admin only tabs */}
            <RoleBasedAccess allowedRoles={['admin', 'operator']}>
              <TabsTrigger 
                value="image-processing" 
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm"
              >
                <Upload className="w-4 h-4 mr-2" />
                Processing
              </TabsTrigger>

              <TabsTrigger 
                value="vehicle-updates" 
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Updates
              </TabsTrigger>
            </RoleBasedAccess>

            <TabsTrigger 
              value="vehicle-details" 
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm"
            >
              <Car className="w-4 h-4 mr-2" />
              Vehicle Details
            </TabsTrigger>

            <TabsTrigger 
              value="network" 
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm"
            >
              <Network className="w-4 h-4 mr-2" />
              Network
            </TabsTrigger>

            {/* Admin only tabs */}
            <RoleBasedAccess allowedRoles={['admin']}>
              <TabsTrigger 
                value="sdn-manager" 
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm"
              >
                <Shield className="w-4 h-4 mr-2" />
                SDN Manager
              </TabsTrigger>

              <TabsTrigger 
                value="parking" 
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm"
              >
                <ParkingCircle className="w-4 h-4 mr-2" />
                Parking
              </TabsTrigger>

              <TabsTrigger 
                value="controls" 
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm"
              >
                <Settings className="w-4 h-4 mr-2" />
                System Controls
              </TabsTrigger>
            </RoleBasedAccess>

            <TabsTrigger 
              value="database" 
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm"
            >
              <Database className="w-4 h-4 mr-2" />
              Database
            </TabsTrigger>

            <TabsTrigger 
              value="alerts" 
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm"
            >
              <AlertTriangle className="w-4 h-4 mr-2" />
              Alerts
            </TabsTrigger>

            <TabsTrigger 
              value="analytics" 
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>

          </TabsList>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
        
        {/* Role indicator */}
        <div className="flex justify-end px-4 pb-2">
          <div className="flex items-center space-x-2 text-xs">
            {userRole === 'admin' && (
              <div className="flex items-center space-x-1 text-red-400">
                <Shield className="w-3 h-3" />
                <span>Admin Access</span>
              </div>
            )}
            {userRole === 'operator' && (
              <div className="flex items-center space-x-1 text-blue-400">
                <Settings className="w-3 h-3" />
                <span>Operator Access</span>
              </div>
            )}
            {userRole === 'viewer' && (
              <div className="flex items-center space-x-1 text-green-400">
                <Eye className="w-3 h-3" />
                <span>View Only</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-0">
        {children}
      </div>
    </Tabs>
  );
}
