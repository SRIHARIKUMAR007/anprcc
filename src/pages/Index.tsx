
import { useState, useEffect } from "react";
import { Camera, Database, BarChart3, Settings, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TabsContent } from "@/components/ui/tabs";
import AuthWrapper from "@/components/AuthWrapper";
import UserMenu from "@/components/UserMenu";
import LiveFeed from "@/components/LiveFeed";
import NetworkTopology from "@/components/NetworkTopology";
import VehicleDatabase from "@/components/VehicleDatabase";
import VehicleDetails from "@/components/VehicleDetails";
import AlertsPanel from "@/components/AlertsPanel";
import TrafficAnalytics from "@/components/TrafficAnalytics";
import SystemControls from "@/components/SystemControls";
import RealTimeDashboard from "@/components/RealTimeDashboard";
import VehicleUpdates from "@/components/VehicleUpdates";
import ImageProcessingPipeline from "@/components/ImageProcessingPipeline";
import SDNNetworkManager from "@/components/SDNNetworkManager";
import ParkingManagement from "@/components/ParkingManagement";
import ImageUploadProcessor from "@/components/ImageUploadProcessor";
import { ResponsiveLayout, ResponsiveGrid } from "@/components/ResponsiveLayout";
import { MobileOptimizedTabs } from "@/components/MobileOptimizedTabs";
import { useSupabaseRealTimeData } from "@/hooks/useSupabaseRealTimeData";
import { useBackendIntegration } from "@/hooks/useBackendIntegration";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const { user, userProfile } = useAuth();
  const { detections, systemStats, cameras, isConnected } = useSupabaseRealTimeData();
  const { isBackendConnected } = useBackendIntegration();
  
  const [systemStatus, setSystemStatus] = useState({
    cameras: cameras.length || 8,
    activeCameras: cameras.filter(c => c.status === 'active').length || 7,
    vehiclesDetected: systemStats?.detections_today || 1247,
    plateRecognitions: systemStats?.detections_today || 1189,
    alerts: 3,
    networkHealth: 98
  });

  // Update system status when real data changes
  useEffect(() => {
    if (systemStats && cameras.length > 0) {
      setSystemStatus({
        cameras: cameras.length,
        activeCameras: cameras.filter(c => c.status === 'active').length,
        vehiclesDetected: systemStats.detections_today,
        plateRecognitions: systemStats.detections_today,
        alerts: 3,
        networkHealth: 98
      });
    }
  }, [systemStats, cameras]);

  return (
    <AuthWrapper>
      <ResponsiveLayout>
        {/* Header */}
        <header className="border-b border-slate-700 bg-slate-900/80 backdrop-blur-sm -mx-2 sm:-mx-4 md:-mx-6 lg:-mx-8 px-2 sm:px-4 md:px-6 lg:px-8 mb-4 sm:mb-6 md:mb-8">
          <div className="py-3 sm:py-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <Camera className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-white">ANPR Control Center</h1>
                  <p className="text-xs sm:text-sm text-slate-400">Automated Number Plate Recognition with SDN • Real-time Intelligence</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-4">
                <Badge variant="secondary" className={`${isConnected ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'} animate-pulse text-xs px-2 py-1`}>
                  {isConnected ? 'DB Connected' : 'Mock Data'}
                </Badge>
                <Badge variant="secondary" className={`${isBackendConnected ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-orange-500/20 text-orange-400 border-orange-500/30'} text-xs px-2 py-1`}>
                  {isBackendConnected ? 'AI Online' : 'AI Mock'}
                </Badge>
                <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs px-2 py-1">
                  SDN Active
                </Badge>
                <UserMenu />
              </div>
            </div>
          </div>
        </header>

        {/* Welcome Message */}
        {user && (
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-base sm:text-lg font-semibold text-blue-400">
                  Welcome back, {userProfile?.full_name || user.email}!
                </h2>
                <p className="text-xs sm:text-sm text-blue-300">
                  Role: {userProfile?.role || 'Loading...'} • 
                  Access Level: {userProfile?.role === 'admin' ? 'Full Control' : 
                                userProfile?.role === 'operator' ? 'Operational' : 'View Only'}
                </p>
              </div>
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs w-fit">
                {isConnected && isBackendConnected ? 'Full System' : 
                 isConnected ? 'Database Only' : 'Demo Mode'}
              </Badge>
            </div>
          </div>
        )}

        {/* Status Cards */}
        <ResponsiveGrid className="mb-6 sm:mb-8">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-slate-200">Active Cameras</CardTitle>
              <Camera className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold text-white">{systemStatus.activeCameras}/{systemStatus.cameras}</div>
              <p className="text-xs text-slate-400">
                {Math.round((systemStatus.activeCameras / systemStatus.cameras) * 100)}% operational
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-slate-200">Vehicles Detected</CardTitle>
              <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold text-white">{systemStatus.vehiclesDetected.toLocaleString()}</div>
              <p className="text-xs text-slate-400">Today's total</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-slate-200">Plate Recognition</CardTitle>
              <Database className="h-3 w-3 sm:h-4 sm:w-4 text-cyan-500" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold text-white">{systemStatus.plateRecognitions.toLocaleString()}</div>
              <p className="text-xs text-slate-400">
                {systemStats?.accuracy_rate ? `${systemStats.accuracy_rate.toFixed(1)}% accuracy` : '95.3% accuracy'}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-slate-200">Active Alerts</CardTitle>
              <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold text-white">{systemStatus.alerts}</div>
              <p className="text-xs text-slate-400">2 high priority</p>
            </CardContent>
          </Card>
        </ResponsiveGrid>

        {/* Main Dashboard Tabs */}
        <MobileOptimizedTabs defaultValue="dashboard">
          <TabsContent value="dashboard">
            <RealTimeDashboard />
          </TabsContent>

          <TabsContent value="live" className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
              <div className="lg:col-span-2">
                <LiveFeed />
              </div>
              <div>
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-sm sm:text-base text-white">Recent Detections</CardTitle>
                    <CardDescription className="text-xs sm:text-sm text-slate-400">
                      {isConnected ? 'Live vehicle plate recognitions from Supabase' : 'Demo data'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2 sm:space-y-3">
                    {detections.slice(0, 5).map((detection) => (
                      <div key={detection.id} className="flex items-center justify-between p-2 sm:p-3 bg-slate-700/30 rounded-lg">
                        <div>
                          <div className="font-mono text-sm sm:text-base text-white font-semibold">{detection.plate_number}</div>
                          <div className="text-xs text-slate-400">
                            {new Date(detection.timestamp).toLocaleTimeString()} • {detection.camera_id}
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge 
                            variant={detection.status === "flagged" ? "destructive" : "secondary"}
                            className="mb-1 text-xs"
                          >
                            {detection.status}
                          </Badge>
                          <div className="text-xs text-slate-400">{detection.confidence}%</div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="image-processing">
            <div className="space-y-4 sm:space-y-6">
              <ImageUploadProcessor />
              <ImageProcessingPipeline />
            </div>
          </TabsContent>

          <TabsContent value="vehicle-updates">
            <VehicleUpdates />
          </TabsContent>

          <TabsContent value="vehicle-details">
            <VehicleDetails />
          </TabsContent>

          <TabsContent value="network">
            <NetworkTopology />
          </TabsContent>

          <TabsContent value="sdn-manager">
            <SDNNetworkManager />
          </TabsContent>

          <TabsContent value="parking">
            <ParkingManagement />
          </TabsContent>

          <TabsContent value="database">
            <VehicleDatabase />
          </TabsContent>

          <TabsContent value="alerts">
            <AlertsPanel />
          </TabsContent>

          <TabsContent value="analytics">
            <TrafficAnalytics />
          </TabsContent>

          <TabsContent value="controls">
            <SystemControls />
          </TabsContent>
        </MobileOptimizedTabs>
      </ResponsiveLayout>
    </AuthWrapper>
  );
};

export default Index;
