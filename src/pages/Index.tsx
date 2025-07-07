
import { useState, useEffect } from "react";
import { TabsContent } from "@/components/ui/tabs";
import AuthWrapper from "@/components/AuthWrapper";
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
import ErrorBoundary from "@/components/common/ErrorBoundary";
import RoleBasedAccess from "@/components/RoleBasedAccess";
import SecurityMonitoring from "@/components/SecurityMonitoring";
import EnhancedDashboard from "@/components/dashboard/EnhancedDashboard";
import EnhancedSDNController from "@/components/sdn/EnhancedSDNController";

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

  return (
    <AuthWrapper>
      <ErrorBoundary>
        <ResponsiveLayout>
          <HeaderSection 
            isConnected={isConnected}
            isBackendConnected={isBackendConnected}
          />

          {/* Main Dashboard Tabs */}
          <div className="animate-fade-in">
            <MobileOptimizedTabs defaultValue="home">
              
              <TabsContent value="home">
                <EnhancedDashboard />
              </TabsContent>

              <TabsContent value="realtime">
                <RealTimeMonitor />
              </TabsContent>

              <TabsContent value="sdn-controller">
                <EnhancedSDNController />
              </TabsContent>

              <TabsContent value="live-data">
                <LiveDataMonitor />
              </TabsContent>

              <TabsContent value="security">
                <SecurityMonitoring />
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
                <div className="grid grid-cols-1 gap-6">
                  <LiveFeed />
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
                    <ImageUploadProcessor />
                    <ImageProcessingPipeline />
                  </div>
                </TabsContent>

                <TabsContent value="vehicle-updates">
                  <VehicleUpdates />
                </TabsContent>
              </RoleBasedAccess>

              <TabsContent value="vehicle-details">
                <VehicleDetails />
              </TabsContent>

              {/* Admin only features */}
              <RoleBasedAccess allowedRoles={['admin']}>
                <TabsContent value="activity">
                  <UserActivityTracker />
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
