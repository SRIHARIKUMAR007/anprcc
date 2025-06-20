
import { TabsContent } from "@/components/ui/tabs";
import AuthWrapper from "@/components/AuthWrapper";
import { ResponsiveLayout } from "@/components/ResponsiveLayout";
import { MobileOptimizedTabs } from "@/components/MobileOptimizedTabs";
import HeaderSection from "@/components/dashboard/HeaderSection";
import AdvancedSearch from "@/components/AdvancedSearch";
import SystemHealthMonitor from "@/components/SystemHealthMonitor";
import DataExportManager from "@/components/DataExportManager";
import UserActivityTracker from "@/components/UserActivityTracker";
import AlertsPanel from "@/components/AlertsPanel";
import RoleBasedAccess from "@/components/RoleBasedAccess";
import { useEnhancedBackendIntegration } from "@/hooks/useEnhancedBackendIntegration";

const Features = () => {
  const { isConnected, isBackendConnected } = useEnhancedBackendIntegration();

  return (
    <AuthWrapper>
      <ResponsiveLayout>
        <HeaderSection 
          isConnected={isConnected}
          isBackendConnected={isBackendConnected}
        />

        <div className="animate-fade-in">
          <MobileOptimizedTabs defaultValue="search">
            
            <TabsContent value="search">
              <AdvancedSearch />
            </TabsContent>

            <TabsContent value="health">
              <SystemHealthMonitor />
            </TabsContent>

            <RoleBasedAccess allowedRoles={['admin', 'operator']}>
              <TabsContent value="export">
                <DataExportManager />
              </TabsContent>
            </RoleBasedAccess>

            <RoleBasedAccess allowedRoles={['admin']}>
              <TabsContent value="activity">
                <UserActivityTracker />
              </TabsContent>
            </RoleBasedAccess>

            <TabsContent value="alerts">
              <AlertsPanel />
            </TabsContent>

          </MobileOptimizedTabs>
        </div>
      </ResponsiveLayout>
    </AuthWrapper>
  );
};

export default Features;
