
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, BarChart3, Database, AlertTriangle, RefreshCw } from "lucide-react";
import { useSupabaseRealTimeData } from "@/hooks/useSupabaseRealTimeData";
import { ResponsiveGrid } from "@/components/ResponsiveLayout";

const EnhancedDashboard = () => {
  const { systemStats, cameras, isConnected } = useSupabaseRealTimeData();
  const [refreshing, setRefreshing] = useState(false);

  const [dashboardStats, setDashboardStats] = useState({
    activeCameras: 7,
    totalCameras: 8,
    vehiclesDetected: 2847,
    plateRecognitions: 2847,
    activeAlerts: 3,
    highPriorityAlerts: 2,
    accuracyRate: 95.3
  });

  // Real-time updates
  useEffect(() => {
    if (systemStats && cameras.length > 0) {
      setDashboardStats({
        activeCameras: cameras.filter(c => c.status === 'active').length,
        totalCameras: cameras.length,
        vehiclesDetected: systemStats.detections_today || 2847,
        plateRecognitions: systemStats.detections_today || 2847,
        activeAlerts: 3,
        highPriorityAlerts: 2,
        accuracyRate: systemStats.accuracy_rate || 95.3
      });
    }
  }, [systemStats, cameras]);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate refresh
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header Section */}
      <div className="cyber-glass rounded-xl p-6 border border-cyan-500/30">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gradient mb-2">
              Welcome to Tamil Nadu Traffic Control, hari!
            </h1>
            <p className="text-slate-400 font-cyber">
              Role: operator • Coverage: All Major TN Highways & Cities • Access Level: Operational
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse"></div>
            <span className="text-sm font-medium px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 text-blue-300 font-cyber">
              Full System
            </span>
            <Button
              onClick={handleRefresh}
              disabled={refreshing}
              className="cyber-glow bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 font-cyber"
            >
              {refreshing ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <ResponsiveGrid className="grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Active Cameras */}
        <Card className="cyber-card border-blue-500/30 animate-fade-in">
          <CardHeader className="pb-3">
            <CardTitle className="text-white flex items-center justify-between text-lg">
              <span>Active Cameras</span>
              <Camera className="w-6 h-6 text-blue-400" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-gradient mb-3 font-cyber">
              {dashboardStats.activeCameras}/{dashboardStats.totalCameras}
            </div>
            <div className="flex items-center space-x-2 mb-2">
              <div className="flex-1 bg-slate-700/50 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-green-400 to-blue-400 h-3 rounded-full transition-all duration-500 cyber-glow-green"
                  style={{ width: `${Math.round((dashboardStats.activeCameras / dashboardStats.totalCameras) * 100)}%` }}
                ></div>
              </div>
              <span className="text-sm text-slate-300 font-cyber font-bold">
                {Math.round((dashboardStats.activeCameras / dashboardStats.totalCameras) * 100)}%
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Vehicles Detected */}
        <Card className="cyber-card border-green-500/30 animate-fade-in">
          <CardHeader className="pb-3">
            <CardTitle className="text-white flex items-center justify-between text-lg">
              <span>Vehicles Detected</span>
              <BarChart3 className="w-6 h-6 text-green-400" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-green-300 mb-3 font-cyber">
              {dashboardStats.vehiclesDetected.toLocaleString()}
            </div>
            <p className="text-sm text-slate-400 font-cyber">Today's total detections</p>
          </CardContent>
        </Card>

        {/* Plate Recognition */}
        <Card className="cyber-card border-cyan-500/30 animate-fade-in">
          <CardHeader className="pb-3">
            <CardTitle className="text-white flex items-center justify-between text-lg">
              <span>Plate Recognition</span>
              <Database className="w-6 h-6 text-cyan-400" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-cyan-300 mb-3 font-cyber">
              {dashboardStats.plateRecognitions.toLocaleString()}
            </div>
            <p className="text-sm text-slate-400 font-cyber">
              {dashboardStats.accuracyRate.toFixed(1)}% accuracy
            </p>
          </CardContent>
        </Card>

        {/* Active Alerts */}
        <Card className="cyber-card border-orange-500/30 animate-fade-in">
          <CardHeader className="pb-3">
            <CardTitle className="text-white flex items-center justify-between text-lg">
              <span>Active Alerts</span>
              <AlertTriangle className="w-6 h-6 text-orange-400" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-orange-400 mb-3 font-cyber">
              {dashboardStats.activeAlerts}
            </div>
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1.5 bg-red-500/20 text-red-400 text-sm rounded-lg border border-red-500/30 font-cyber">
                {dashboardStats.highPriorityAlerts} high priority
              </span>
            </div>
          </CardContent>
        </Card>
      </ResponsiveGrid>
    </div>
  );
};

export default EnhancedDashboard;
