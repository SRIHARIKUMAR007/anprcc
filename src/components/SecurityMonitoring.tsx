
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Network, AlertTriangle, Eye } from "lucide-react";
import ThreatAnalysisOverview from "./livefeed/ThreatAnalysisOverview";
import RecentSDNActions from "./livefeed/RecentSDNActions";
import PythonANPRService from "./livefeed/PythonANPRService";
import LiveAlerts from "./livefeed/LiveAlerts";
import RecentDetections from "./livefeed/RecentDetections";
import CameraNetworkStatus from "./livefeed/CameraNetworkStatus";
import { mockCameras } from "./livefeed/mockData";
import { useRealTimeIntegration } from "@/hooks/useRealTimeIntegration";
import { LiveFeedCamera } from "@/types/camera";
import { Camera } from "@/types/supabase";
import ErrorBoundary from "./common/ErrorBoundary";

const SecurityMonitoring = () => {
  const [selectedCamera, setSelectedCamera] = useState("CAM-01");
  const [plateHistory] = useState<string[]>([
    "TN-09-AB-1234",
    "KA-05-XY-5678", 
    "TN-12-CD-9012",
    "AP-07-EF-3456"
  ]);

  const { cameras: realCameras } = useRealTimeIntegration();

  // Transform real cameras to match the expected format
  const transformedRealCameras: LiveFeedCamera[] = realCameras.map((camera: Camera) => ({
    id: camera.camera_id,
    location: camera.location,
    status: (camera.status || 'active') as 'active' | 'inactive' | 'maintenance',
    vehicles: Math.floor(Math.random() * 15) + 1,
    fps: 30,
    resolution: "1920x1080",
    coordinates: { 
      lat: 13.0827 + (Math.random() - 0.5) * 2,
      lng: 80.2707 + (Math.random() - 0.5) * 2 
    },
    direction: ["North-South", "East-West", "Bidirectional", "Multi-directional"][Math.floor(Math.random() * 4)]
  }));

  const cameras = transformedRealCameras.length > 0 ? transformedRealCameras : mockCameras;

  const handleCameraSelect = (cameraId: string) => {
    setSelectedCamera(cameraId);
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen animated-bg p-4 lg:p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="enhanced-card p-6 animate-fade-in">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-full bg-gradient-to-r from-purple-500/20 to-cyan-500/20 neon-glow">
                <Shield className="w-8 h-8 text-cyan-400" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold gradient-text text-neon">
                  Security Monitoring Center
                </h1>
                <p className="text-purple-200 mt-1">
                  Advanced AI-powered threat detection and network security management
                </p>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-3 mt-4">
              <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 animate-pulse">
                <Eye className="w-3 h-3 mr-1" />
                LIVE MONITORING
              </Badge>
              <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                <Network className="w-3 h-3 mr-1" />
                SDN ACTIVE
              </Badge>
              <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
                <AlertTriangle className="w-3 h-3 mr-1" />
                AI THREAT DETECTION
              </Badge>
            </div>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {/* Column 1 */}
            <div className="space-y-6 animate-slide-in">
              <div className="enhanced-card">
                <ThreatAnalysisOverview cameraId={selectedCamera} />
              </div>
              
              <div className="enhanced-card">
                <RecentSDNActions cameraId={selectedCamera} />
              </div>
            </div>

            {/* Column 2 */}
            <div className="space-y-6 animate-slide-in" style={{ animationDelay: '0.1s' }}>
              <div className="enhanced-card">
                <PythonANPRService />
              </div>

              <div className="enhanced-card">
                <LiveAlerts 
                  selectedCamera={selectedCamera}
                  isLive={true}
                />
              </div>
            </div>

            {/* Column 3 */}
            <div className="space-y-6 animate-slide-in" style={{ animationDelay: '0.2s' }}>
              <div className="enhanced-card">
                <RecentDetections
                  plateHistory={plateHistory}
                  selectedCamera={selectedCamera}
                />
              </div>

              <div className="enhanced-card">
                <CameraNetworkStatus
                  cameras={cameras}
                  selectedCamera={selectedCamera}
                  onCameraSelect={handleCameraSelect}
                />
              </div>
            </div>
          </div>

          {/* Real-time Status Bar */}
          <div className="enhanced-card p-4 animate-fade-in">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="space-y-1">
                <div className="text-2xl font-bold text-emerald-400">
                  {cameras.filter(c => c.status === 'active').length}
                </div>
                <div className="text-xs text-purple-200">Active Cameras</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-cyan-400">0</div>
                <div className="text-xs text-purple-200">Critical Threats</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-amber-400">3</div>
                <div className="text-xs text-purple-200">Medium Alerts</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-purple-400">98%</div>
                <div className="text-xs text-purple-200">System Health</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default SecurityMonitoring;
