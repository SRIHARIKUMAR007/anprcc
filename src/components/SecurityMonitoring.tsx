
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Network, AlertTriangle, Eye, Lock } from "lucide-react";
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
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-purple-950 p-4 lg:p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-800/80 to-purple-900/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-2xl animate-fade-in">
            <div className="flex items-center space-x-4">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-500/20 to-indigo-600/20 border border-purple-400/30 shadow-lg">
                <Lock className="w-8 h-8 text-purple-300" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white via-purple-200 to-indigo-300 bg-clip-text text-transparent">
                  Security Monitoring Center
                </h1>
                <p className="text-slate-300 mt-1">
                  Advanced AI-powered threat detection and network security management
                </p>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-3 mt-6">
              <Badge className="bg-emerald-400/10 text-emerald-300 border-emerald-400/30 animate-pulse">
                <Eye className="w-3 h-3 mr-1" />
                LIVE MONITORING
              </Badge>
              <Badge className="bg-purple-400/10 text-purple-300 border-purple-400/30">
                <Network className="w-3 h-3 mr-1" />
                SDN ACTIVE
              </Badge>
              <Badge className="bg-cyan-400/10 text-cyan-300 border-cyan-400/30">
                <AlertTriangle className="w-3 h-3 mr-1" />
                AI THREAT DETECTION
              </Badge>
            </div>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {/* Column 1 */}
            <div className="space-y-6 animate-slide-in">
              <Card className="bg-gradient-to-br from-slate-800/60 to-slate-700/60 backdrop-blur-xl border border-slate-600/50 shadow-xl rounded-xl">
                <ThreatAnalysisOverview cameraId={selectedCamera} />
              </Card>
              
              <Card className="bg-gradient-to-br from-slate-800/60 to-slate-700/60 backdrop-blur-xl border border-slate-600/50 shadow-xl rounded-xl">
                <RecentSDNActions cameraId={selectedCamera} />
              </Card>
            </div>

            {/* Column 2 */}
            <div className="space-y-6 animate-slide-in" style={{ animationDelay: '0.1s' }}>
              <Card className="bg-gradient-to-br from-slate-800/60 to-slate-700/60 backdrop-blur-xl border border-slate-600/50 shadow-xl rounded-xl">
                <PythonANPRService />
              </Card>

              <Card className="bg-gradient-to-br from-slate-800/60 to-slate-700/60 backdrop-blur-xl border border-slate-600/50 shadow-xl rounded-xl">
                <LiveAlerts 
                  selectedCamera={selectedCamera}
                  isLive={true}
                />
              </Card>
            </div>

            {/* Column 3 */}
            <div className="space-y-6 animate-slide-in" style={{ animationDelay: '0.2s' }}>
              <Card className="bg-gradient-to-br from-slate-800/60 to-slate-700/60 backdrop-blur-xl border border-slate-600/50 shadow-xl rounded-xl">
                <RecentDetections
                  plateHistory={plateHistory}
                  selectedCamera={selectedCamera}
                />
              </Card>

              <Card className="bg-gradient-to-br from-slate-800/60 to-slate-700/60 backdrop-blur-xl border border-slate-600/50 shadow-xl rounded-xl">
                <CameraNetworkStatus
                  cameras={cameras}
                  selectedCamera={selectedCamera}
                  onCameraSelect={handleCameraSelect}
                />
              </Card>
            </div>
          </div>

          {/* Real-time Status Bar */}
          <div className="bg-gradient-to-r from-slate-800/60 to-slate-700/60 backdrop-blur-xl border border-slate-600/50 rounded-xl p-6 shadow-xl animate-fade-in">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="space-y-2">
                <div className="text-3xl font-bold text-emerald-300">
                  {cameras.filter(c => c.status === 'active').length}
                </div>
                <div className="text-sm text-slate-400">Active Cameras</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-cyan-300">0</div>
                <div className="text-sm text-slate-400">Critical Threats</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-amber-300">3</div>
                <div className="text-sm text-slate-400">Medium Alerts</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-purple-300">98%</div>
                <div className="text-sm text-slate-400">System Health</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default SecurityMonitoring;
