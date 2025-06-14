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
import TamilNaduTrafficMap from "@/components/TamilNaduTrafficMap";
import TollPlazaMonitor from "@/components/TollPlazaMonitor";
import LiveWeatherWidget from "@/components/LiveWeatherWidget";
import { ResponsiveLayout, ResponsiveGrid } from "@/components/ResponsiveLayout";
import { MobileOptimizedTabs } from "@/components/MobileOptimizedTabs";
import { useSupabaseRealTimeData } from "@/hooks/useSupabaseRealTimeData";
import { useBackendIntegration } from "@/hooks/useBackendIntegration";
import { useAuth } from "@/hooks/useAuth";
import RealTimeMonitor from "@/components/RealTimeMonitor";

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
        {/* Enhanced Header */}
        <header className="border-b border-slate-700/50 bg-slate-900/90 backdrop-blur-xl -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 mb-8 shadow-lg">
          <div className="py-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25 animate-pulse-glow">
                  <Camera className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold gradient-text text-shadow">
                    Tamil Nadu ANPR Control Center
                  </h1>
                  <p className="text-slate-400 font-medium">
                    Smart Traffic Management • Real-time Intelligence • Tamil Nadu Highways
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-yellow-400'} animate-pulse`}></div>
                  <span className={`text-xs font-medium px-3 py-1.5 rounded-full border ${isConnected ? 'status-online' : 'status-warning'}`}>
                    {isConnected ? 'DB Connected' : 'Mock Data'}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${isBackendConnected ? 'bg-green-400' : 'bg-orange-400'} animate-pulse`}></div>
                  <span className={`text-xs font-medium px-3 py-1.5 rounded-full border ${isBackendConnected ? 'status-online' : 'status-warning'}`}>
                    {isBackendConnected ? 'AI Online' : 'AI Mock'}
                  </span>
                </div>
                <span className="text-xs font-medium px-3 py-1.5 rounded-full border status-info">
                  TN Highways
                </span>
                <UserMenu />
              </div>
            </div>
          </div>
        </header>

        {/* Enhanced Welcome Message */}
        {user && (
          <div className="mb-8 p-6 enhanced-card animate-fade-in">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-blue-300 mb-2">
                  Welcome to Tamil Nadu Traffic Control, {userProfile?.full_name || user.email}!
                </h2>
                <p className="text-blue-200/80">
                  Role: <span className="font-semibold">{userProfile?.role || 'Loading...'}</span> • 
                  Coverage: <span className="font-semibold">All Major TN Highways & Cities</span> •
                  Access Level: <span className="font-semibold">
                    {userProfile?.role === 'admin' ? 'Full Control' : 
                     userProfile?.role === 'operator' ? 'Operational' : 'View Only'}
                  </span>
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-green-400 to-blue-400 animate-pulse"></div>
                <span className="text-sm font-medium px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 text-blue-300">
                  {isConnected && isBackendConnected ? 'Full System' : 
                   isConnected ? 'Database Only' : 'Demo Mode'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Status Cards */}
        <ResponsiveGrid className="mb-10">
          <div className="enhanced-card animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-200">Active Cameras</h3>
              <Camera className="h-6 w-6 text-blue-400" />
            </div>
            <div className="text-3xl font-bold gradient-text mb-3">
              {systemStatus.activeCameras}/{systemStatus.cameras}
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex-1 bg-slate-700/50 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-green-400 to-blue-400 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${Math.round((systemStatus.activeCameras / systemStatus.cameras) * 100)}%` }}
                ></div>
              </div>
              <span className="text-xs text-slate-400 font-medium">
                {Math.round((systemStatus.activeCameras / systemStatus.cameras) * 100)}%
              </span>
            </div>
          </div>

          <div className="enhanced-card animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-200">Vehicles Detected</h3>
              <BarChart3 className="h-6 w-6 text-green-400" />
            </div>
            <div className="text-3xl font-bold gradient-text mb-3">
              {systemStatus.vehiclesDetected.toLocaleString()}
            </div>
            <p className="text-xs text-slate-400 font-medium">Today's total detections</p>
          </div>

          <div className="enhanced-card animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-200">Plate Recognition</h3>
              <Database className="h-6 w-6 text-cyan-400" />
            </div>
            <div className="text-3xl font-bold gradient-text mb-3">
              {systemStatus.plateRecognitions.toLocaleString()}
            </div>
            <p className="text-xs text-slate-400 font-medium">
              {systemStats?.accuracy_rate ? `${systemStats.accuracy_rate.toFixed(1)}% accuracy` : '95.3% accuracy'}
            </p>
          </div>

          <div className="enhanced-card animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-200">Active Alerts</h3>
              <AlertTriangle className="h-6 w-6 text-orange-400" />
            </div>
            <div className="text-3xl font-bold text-orange-400 mb-3">
              {systemStatus.alerts}
            </div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded-md border border-red-500/30">
                2 high priority
              </span>
            </div>
          </div>
        </ResponsiveGrid>

        {/* Main Dashboard Tabs */}
        <div className="animate-fade-in">
          <MobileOptimizedTabs defaultValue="tn-traffic">
            
            <TabsContent value="realtime">
              <RealTimeMonitor />
            </TabsContent>

            <TabsContent value="tn-traffic">
              <TamilNaduTrafficMap />
            </TabsContent>

            <TabsContent value="toll-monitor">
              <TollPlazaMonitor />
            </TabsContent>

            <TabsContent value="weather">
              <LiveWeatherWidget />
            </TabsContent>

            <TabsContent value="dashboard">
              <RealTimeDashboard />
            </TabsContent>

            <TabsContent value="live" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <LiveFeed />
                </div>
                <div>
                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardHeader>
                      <CardTitle className="text-white">Recent Detections</CardTitle>
                      <CardDescription className="text-slate-400">
                        {isConnected ? 'Live vehicle plate recognitions from Supabase' : 'Demo data'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {detections.slice(0, 5).map((detection) => (
                        <div key={detection.id} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                          <div>
                            <div className="font-mono text-white font-semibold">{detection.plate_number}</div>
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
              <div className="space-y-6">
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
        </div>
      </ResponsiveLayout>
    </AuthWrapper>
  );
};

export default Index;
