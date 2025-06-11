import { useState, useEffect } from "react";
import { Camera, Database, BarChart3, Settings, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { useSupabaseRealTimeData } from "@/hooks/useSupabaseRealTimeData";
import { useAuth } from "@/hooks/useAuth";
import VehicleUpdates from "@/components/VehicleUpdates";
import ImageProcessingPipeline from "@/components/ImageProcessingPipeline";
import SDNNetworkManager from "@/components/SDNNetworkManager";
import ParkingManagement from "@/components/ParkingManagement";

const Index = () => {
  const { user, userProfile } = useAuth();
  const { detections, systemStats, cameras, isConnected } = useSupabaseRealTimeData();
  
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
        {/* Header */}
        <header className="border-b border-slate-700 bg-slate-900/80 backdrop-blur-sm">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <Camera className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">ANPR Control Center</h1>
                  <p className="text-slate-400 text-sm">Automated Number Plate Recognition with SDN • Real-time Intelligence</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Badge variant="secondary" className={`${isConnected ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'} animate-pulse`}>
                  {isConnected ? 'Supabase Connected' : 'Mock Data Mode'}
                </Badge>
                <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                  SDN Active
                </Badge>
                <UserMenu />
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard */}
        <main className="container mx-auto px-6 py-8">
          {/* Welcome Message */}
          {user && (
            <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-blue-400">
                    Welcome back, {userProfile?.full_name || user.email}!
                  </h2>
                  <p className="text-blue-300 text-sm">
                    Role: {userProfile?.role || 'Loading...'} • 
                    Access Level: {userProfile?.role === 'admin' ? 'Full Control' : 
                                  userProfile?.role === 'operator' ? 'Operational' : 'View Only'}
                  </p>
                </div>
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                  {isConnected ? 'Real-time Data' : 'Demo Mode'}
                </Badge>
              </div>
            </div>
          )}

          {/* Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-200">Active Cameras</CardTitle>
                <Camera className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{systemStatus.activeCameras}/{systemStatus.cameras}</div>
                <p className="text-xs text-slate-400">
                  {Math.round((systemStatus.activeCameras / systemStatus.cameras) * 100)}% operational
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-200">Vehicles Detected</CardTitle>
                <BarChart3 className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{systemStatus.vehiclesDetected.toLocaleString()}</div>
                <p className="text-xs text-slate-400">Today's total</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-200">Plate Recognition</CardTitle>
                <Database className="h-4 w-4 text-cyan-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{systemStatus.plateRecognitions.toLocaleString()}</div>
                <p className="text-xs text-slate-400">
                  {systemStats?.accuracy_rate ? `${systemStats.accuracy_rate.toFixed(1)}% accuracy` : '95.3% accuracy'}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-200">Active Alerts</CardTitle>
                <AlertTriangle className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{systemStatus.alerts}</div>
                <p className="text-xs text-slate-400">2 high priority</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Dashboard Tabs */}
          <Tabs defaultValue="dashboard" className="space-y-6">
            <TabsList className="grid w-full lg:w-auto lg:grid-cols-12 bg-slate-800/50 border-slate-700">
              <TabsTrigger value="dashboard" className="data-[state=active]:bg-blue-600">Dashboard</TabsTrigger>
              <TabsTrigger value="live" className="data-[state=active]:bg-blue-600">Live Feed</TabsTrigger>
              <TabsTrigger value="image-processing" className="data-[state=active]:bg-blue-600">Image Processing</TabsTrigger>
              <TabsTrigger value="vehicle-updates" className="data-[state=active]:bg-blue-600">Vehicle Updates</TabsTrigger>
              <TabsTrigger value="vehicle-details" className="data-[state=active]:bg-blue-600">Vehicle Lookup</TabsTrigger>
              <TabsTrigger value="network" className="data-[state=active]:bg-blue-600">SDN Network</TabsTrigger>
              <TabsTrigger value="sdn-manager" className="data-[state=active]:bg-blue-600">SDN Manager</TabsTrigger>
              <TabsTrigger value="parking" className="data-[state=active]:bg-blue-600">Parking</TabsTrigger>
              <TabsTrigger value="database" className="data-[state=active]:bg-blue-600">Database</TabsTrigger>
              <TabsTrigger value="alerts" className="data-[state=active]:bg-blue-600">Alerts</TabsTrigger>
              <TabsTrigger value="analytics" className="data-[state=active]:bg-blue-600">Analytics</TabsTrigger>
              <TabsTrigger value="controls" className="data-[state=active]:bg-blue-600">Controls</TabsTrigger>
            </TabsList>

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
                              className="mb-1"
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
              <ImageProcessingPipeline />
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
          </Tabs>
        </main>
      </div>
    </AuthWrapper>
  );
};

export default Index;
