
import { useState, useEffect } from "react";
import { TabsContent } from "@/components/ui/tabs";
import AuthWrapper from "@/components/AuthWrapper";
import LiveFeed from "@/components/LiveFeed";
import NetworkTopology from "@/components/NetworkTopology";
import VehicleDatabase from "@/components/VehicleDatabase";
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
import RealTimeMonitor from "@/components/RealTimeMonitor";
import LiveDataMonitor from "@/components/LiveDataMonitor";
import SystemHealthMonitor from "@/components/SystemHealthMonitor";
import DataExportManager from "@/components/DataExportManager";
import UserActivityTracker from "@/components/UserActivityTracker";
import ImageCameraDetection from "@/components/ImageCameraDetection";
import { ResponsiveLayout } from "@/components/ResponsiveLayout";
import { MobileOptimizedTabs } from "@/components/MobileOptimizedTabs";
import { useAuth } from "@/hooks/useAuth";
import { useEnhancedBackendIntegration } from "@/hooks/useEnhancedBackendIntegration";
import HeaderSection from "@/components/dashboard/HeaderSection";
import WelcomeMessage from "@/components/dashboard/WelcomeMessage";
import StatusCards from "@/components/dashboard/StatusCards";
import RecentDetectionsList from "@/components/livefeed/RecentDetectionsList";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import RoleBasedAccess from "@/components/RoleBasedAccess";

const Index = () => {
  const { user, userProfile } = useAuth();
  const { 
    detections, 
    systemStats, 
    cameras, 
    isConnected,
    isBackendConnected,
    connectionHealth,
    isFullyConnected
  } = useEnhancedBackendIntegration();
  
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
        networkHealth: isFullyConnected ? 98 : 75
      });
    }
  }, [systemStats, cameras, isFullyConnected]);

  return (
    <AuthWrapper>
      <ErrorBoundary>
        <ResponsiveLayout>
          <HeaderSection 
            isConnected={isConnected}
            isBackendConnected={isBackendConnected}
          />

          <WelcomeMessage 
            user={user}
            userProfile={userProfile}
            isConnected={isConnected}
            isBackendConnected={isBackendConnected}
          />

          <StatusCards 
            systemStatus={systemStatus}
            systemStats={systemStats}
          />

          {/* Main Dashboard Tabs */}
          <div className="animate-fade-in">
            <MobileOptimizedTabs defaultValue="realtime">
              
              <TabsContent value="realtime">
                <RealTimeMonitor />
              </TabsContent>

              <TabsContent value="live-data">
                <LiveDataMonitor />
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
                    <RecentDetectionsList 
                      detections={detections}
                      isConnected={isConnected}
                    />
                  </div>
                </div>
              </TabsContent>

              {/* Enhanced Features Tabs */}
              <TabsContent value="health">
                <SystemHealthMonitor />
              </TabsContent>

              {/* Operator and Admin only features */}
              <RoleBasedAccess allowedRoles={['admin', 'operator']}>
                <TabsContent value="export">
                  <DataExportManager />
                </TabsContent>

                <TabsContent value="image-processing">
                  <div className="space-y-6">
                    <ImageCameraDetection />
                    <ImageUploadProcessor />
                    <ImageProcessingPipeline />
                  </div>
                </TabsContent>

                <TabsContent value="vehicle-updates">
                  <VehicleUpdates />
                </TabsContent>
              </RoleBasedAccess>

              <TabsContent value="network">
                <NetworkTopology />
              </TabsContent>

              {/* Admin only features */}
              <RoleBasedAccess allowedRoles={['admin']}>
                <TabsContent value="activity">
                  <UserActivityTracker />
                </TabsContent>

                <TabsContent value="sdn-manager">
                  <SDNNetworkManager />
                </TabsContent>

                <TabsContent value="parking">
                  <ParkingManagement />
                </TabsContent>

                <TabsContent value="controls">
                  <SystemControls />
                </TabsContent>
              </RoleBasedAccess>

              <TabsContent value="database">
                <VehicleDatabase />
              </TabsContent>

              <TabsContent value="alerts">
                <AlertsPanel />
              </TabsContent>

              <TabsContent value="analytics">
                <TrafficAnalytics />
              </TabsContent>
            </MobileOptimizedTabs>
          </div>
        </ResponsiveLayout>
      </ErrorBoundary>
    </AuthWrapper>
  );
};

export default Index;
