
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
          <div className="w-full max-w-full overflow-x-hidden">
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
            <div className="animate-fade-in w-full">
              <MobileOptimizedTabs defaultValue="realtime">
                
                <TabsContent value="realtime" className="w-full">
                  <RealTimeMonitor />
                </TabsContent>

                <TabsContent value="live-data" className="w-full">
                  <LiveDataMonitor />
                </TabsContent>

                <TabsContent value="tn-traffic" className="w-full">
                  <TamilNaduTrafficMap />
                </TabsContent>

                <TabsContent value="toll-monitor" className="w-full">
                  <TollPlazaMonitor />
                </TabsContent>

                <TabsContent value="weather" className="w-full">
                  <LiveWeatherWidget />
                </TabsContent>

                <TabsContent value="dashboard" className="w-full">
                  <RealTimeDashboard />
                </TabsContent>

                <TabsContent value="live" className="space-y-4 sm:space-y-6 w-full">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
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
                <TabsContent value="health" className="w-full">
                  <SystemHealthMonitor />
                </TabsContent>

                {/* Operator and Admin only features */}
                <RoleBasedAccess allowedRoles={['admin', 'operator']}>
                  <TabsContent value="export" className="w-full">
                    <DataExportManager />
                  </TabsContent>

                  <TabsContent value="image-processing" className="w-full">
                    <div className="space-y-4 sm:space-y-6">
                      <ImageUploadProcessor />
                      <ImageProcessingPipeline />
                    </div>
                  </TabsContent>

                  <TabsContent value="vehicle-updates" className="w-full">
                    <VehicleUpdates />
                  </TabsContent>
                </RoleBasedAccess>

                <TabsContent value="network" className="w-full">
                  <NetworkTopology />
                </TabsContent>

                {/* Admin only features */}
                <RoleBasedAccess allowedRoles={['admin']}>
                  <TabsContent value="activity" className="w-full">
                    <UserActivityTracker />
                  </TabsContent>

                  <TabsContent value="sdn-manager" className="w-full">
                    <SDNNetworkManager />
                  </TabsContent>

                  <TabsContent value="parking" className="w-full">
                    <ParkingManagement />
                  </TabsContent>

                  <TabsContent value="controls" className="w-full">
                    <SystemControls />
                  </TabsContent>
                </RoleBasedAccess>

                <TabsContent value="database" className="w-full">
                  <VehicleDatabase />
                </TabsContent>

                <TabsContent value="alerts" className="w-full">
                  <AlertsPanel />
                </TabsContent>

                <TabsContent value="analytics" className="w-full">
                  <TrafficAnalytics />
                </TabsContent>
              </MobileOptimizedTabs>
            </div>
          </div>
        </ResponsiveLayout>
      </ErrorBoundary>
    </AuthWrapper>
  );
};

export default Index;
