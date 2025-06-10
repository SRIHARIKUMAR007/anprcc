import { useState, useEffect } from "react";
import { Camera, Database, Network, Shield, BarChart3, Settings, AlertTriangle, Car, Activity } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LiveFeed from "@/components/LiveFeed";
import NetworkTopology from "@/components/NetworkTopology";
import VehicleDatabase from "@/components/VehicleDatabase";
import VehicleDetails from "@/components/VehicleDetails";
import AlertsPanel from "@/components/AlertsPanel";
import TrafficAnalytics from "@/components/TrafficAnalytics";
import SystemControls from "@/components/SystemControls";
import RealTimeDashboard from "@/components/RealTimeDashboard";

const Index = () => {
  // ... keep existing code (systemStatus state and recentDetections)

  const [systemStatus, setSystemStatus] = useState({
    cameras: 8,
    activeCameras: 7,
    vehiclesDetected: 1247,
    plateRecognitions: 1189,
    alerts: 3,
    networkHealth: 98
  });

  const [recentDetections, setRecentDetections] = useState([
    { id: 1, plate: "ABC-1234", time: "10:45:32", camera: "Cam-01", status: "cleared", confidence: 98 },
    { id: 2, plate: "XYZ-9876", time: "10:45:28", camera: "Cam-03", status: "flagged", confidence: 95 },
    { id: 3, plate: "DEF-5678", time: "10:45:25", camera: "Cam-02", status: "cleared", confidence: 92 },
    { id: 4, plate: "GHI-2468", time: "10:45:20", camera: "Cam-05", status: "cleared", confidence: 97 },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate real-time updates
      setSystemStatus(prev => ({
        ...prev,
        vehiclesDetected: prev.vehiclesDetected + Math.floor(Math.random() * 3),
        plateRecognitions: prev.plateRecognitions + Math.floor(Math.random() * 2)
      }));

      // Add new detection every 10 seconds
      const newDetection = {
        id: Date.now(),
        plate: `${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}-${Math.floor(1000 + Math.random() * 9000)}`,
        time: new Date().toLocaleTimeString(),
        camera: `Cam-${String(Math.floor(Math.random() * 8) + 1).padStart(2, '0')}`,
        status: Math.random() > 0.85 ? "flagged" : "cleared",
        confidence: Math.floor(85 + Math.random() * 15)
      };

      setRecentDetections(prev => [newDetection, ...prev.slice(0, 9)]);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
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
              <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30 animate-pulse">
                System Online
              </Badge>
              <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                SDN Active
              </Badge>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Dashboard */}
      <main className="container mx-auto px-6 py-8">
        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-200">Active Cameras</CardTitle>
              <Camera className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{systemStatus.activeCameras}/{systemStatus.cameras}</div>
              <p className="text-xs text-slate-400">87.5% operational</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-200">Vehicles Detected</CardTitle>
              <BarChart3 className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{systemStatus.vehiclesDetected.toLocaleString()}</div>
              <p className="text-xs text-slate-400">+23 from last hour</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-200">Plate Recognition</CardTitle>
              <Database className="h-4 w-4 text-cyan-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{systemStatus.plateRecognitions.toLocaleString()}</div>
              <p className="text-xs text-slate-400">95.3% accuracy</p>
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
          <TabsList className="grid w-full lg:w-auto lg:grid-cols-8 bg-slate-800/50 border-slate-700">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-blue-600">Dashboard</TabsTrigger>
            <TabsTrigger value="live" className="data-[state=active]:bg-blue-600">Live Feed</TabsTrigger>
            <TabsTrigger value="vehicle-details" className="data-[state=active]:bg-blue-600">Vehicle Lookup</TabsTrigger>
            <TabsTrigger value="network" className="data-[state=active]:bg-blue-600">SDN Network</TabsTrigger>
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
                    <CardDescription className="text-slate-400">Live vehicle plate recognitions</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {recentDetections.map((detection) => (
                      <div key={detection.id} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                        <div>
                          <div className="font-mono text-white font-semibold">{detection.plate}</div>
                          <div className="text-xs text-slate-400">{detection.time} • {detection.camera}</div>
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

          <TabsContent value="vehicle-details">
            <VehicleDetails />
          </TabsContent>

          <TabsContent value="network">
            <NetworkTopology />
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
  );
};

export default Index;
