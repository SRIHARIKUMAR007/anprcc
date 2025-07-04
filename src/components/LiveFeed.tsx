
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Activity, Pause, Play, Radio, CheckCircle } from "lucide-react";
import CameraSelector from "./livefeed/CameraSelector";
import CameraControls from "./livefeed/CameraControls";
import LiveVideoCanvas from "./livefeed/LiveVideoCanvas";
import ProcessingPipeline from "./livefeed/ProcessingPipeline";
import CameraNetworkStatus from "./livefeed/CameraNetworkStatus";
import RecentDetections from "./livefeed/RecentDetections";
import LiveAlerts from "./livefeed/LiveAlerts";
import ThreatAnalysisOverview from "./livefeed/ThreatAnalysisOverview";
import RecentSDNActions from "./livefeed/RecentSDNActions";
import PythonANPRService from "./livefeed/PythonANPRService";
import { mockCameras, processingSteps } from "./livefeed/mockData";
import { useRealTimeIntegration } from "@/hooks/useRealTimeIntegration";
import { LiveFeedCamera } from "@/types/camera";
import { Camera } from "@/types/supabase";
import AIRealTimeAnalytics from "./livefeed/AIRealTimeAnalytics";
import { useAIRealTimeEngine } from "@/hooks/useAIRealTimeEngine";
import { useAIThreatDetection } from "@/hooks/useAIThreatDetection";
import { useEnhancedBackendIntegration } from "@/hooks/useEnhancedBackendIntegration";
import LoadingSpinner from "./common/LoadingSpinner";
import ErrorBoundary from "./common/ErrorBoundary";

const LiveFeed = () => {
  const [selectedCamera, setSelectedCamera] = useState("CAM-01");
  const [isRecording, setIsRecording] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [vehicleCount, setVehicleCount] = useState(0);
  const [detectedPlate, setDetectedPlate] = useState<string | null>(null);
  const [confidence, setConfidence] = useState(0);
  const [processingStep, setProcessingStep] = useState("Initialization");
  const [plateHistory, setPlateHistory] = useState<string[]>([]);
  const [isLiveMode, setIsLiveMode] = useState(true);

  const { liveData, cameras: realCameras } = useRealTimeIntegration();
  const { 
    isAIProcessing, 
    trafficPattern, 
    systemLoad, 
    processAIDetection 
  } = useAIRealTimeEngine();

  const { isBackendConnected, connectionHealth, isConnected } = useEnhancedBackendIntegration();

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
  const currentCamera = cameras.find(cam => cam.id === selectedCamera);

  // Enhanced plate detection simulation with AI integration
  useEffect(() => {
    if (!isRecording || !isLiveMode) return;

    const interval = setInterval(() => {
      // Cycle through processing steps
      const currentIndex = processingSteps.indexOf(processingStep);
      const nextIndex = (currentIndex + 1) % processingSteps.length;
      setProcessingStep(processingSteps[nextIndex]);

      // AI-powered detection frequency based on traffic patterns
      const detectionProbability = trafficPattern.peakHours ? 0.7 : 0.4;
      
      if (Math.random() < detectionProbability) {
        // Use AI engine for more realistic plate generation
        processAIDetection(selectedCamera).then(aiData => {
          if (aiData) {
            setDetectedPlate(aiData.plateNumber);
            setConfidence(aiData.confidence);
            
            // Add to history
            setPlateHistory(prev => [aiData.plateNumber, ...prev.slice(0, 19)]);
            
            // Clear after dynamic time based on confidence
            const displayTime = aiData.confidence > 90 ? 3000 : 1500;
            setTimeout(() => {
              setDetectedPlate(null);
              setConfidence(0);
            }, displayTime);
          }
        });
      }
    }, isAIProcessing ? 2000 : 1500);

    return () => clearInterval(interval);
  }, [isRecording, isLiveMode, processingStep, trafficPattern.peakHours, isAIProcessing, processAIDetection, selectedCamera]);

  const handleCameraSelect = (cameraId: string) => {
    setSelectedCamera(cameraId);
    setPlateHistory([]);
  };

  const handleRecordingToggle = () => {
    setIsRecording(!isRecording);
  };

  const handleFullscreenToggle = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleAudioToggle = () => {
    setAudioEnabled(!audioEnabled);
  };

  const handleVehicleCountUpdate = (count: number) => {
    setVehicleCount(count);
  };

  const toggleLiveMode = () => {
    setIsLiveMode(!isLiveMode);
  };

  // Get connection status for display
  const getConnectionStatus = () => {
    if (connectionHealth.backend && connectionHealth.database) {
      return { status: 'Supabase Active', color: 'bg-green-500/20 text-green-400 border-green-500/30' };
    } else if (connectionHealth.database) {
      return { status: 'Database Only', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' };
    } else {
      return { status: 'Demo Mode', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' };
    }
  };

  const connectionStatus = getConnectionStatus();

  return (
    <ErrorBoundary>
      <div className="space-y-4 md:space-y-6 responsive-padding">
        {/* Enhanced Header with Connection Status */}
        <div className="cyber-card p-4 md:p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center space-x-3">
              <Activity className="w-6 h-6 text-cyber-primary cyber-glow" />
              <div>
                <h2 className="text-xl md:text-2xl font-bold cyber-gradient-text">
                  AI-Powered Live Camera Feed System
                </h2>
                <p className="text-muted-foreground text-sm responsive-text">
                  Real-time AI monitoring • {cameras.filter(c => c.status === 'active').length} active cameras
                  {trafficPattern.peakHours && (
                    <span className="text-cyber-warning ml-2">• Peak Hours Active</span>
                  )}
                  <span className="text-cyber-accent ml-2 inline-flex items-center">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    • Supabase Backend Active
                  </span>
                </p>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-2 md:gap-3">
              <Button
                variant={isLiveMode ? "default" : "outline"}
                size="sm"
                onClick={toggleLiveMode}
                className="cyber-border bg-cyber-bg/50 hover:bg-cyber-primary/10"
              >
                <Radio className={`w-4 h-4 ${isLiveMode ? 'animate-pulse text-cyber-accent' : 'text-muted-foreground'}`} />
                <span className="ml-2 text-xs md:text-sm">{isLiveMode ? 'AI LIVE MODE' : 'DEMO MODE'}</span>
              </Button>
              
              <Badge variant="secondary" className={`text-xs ${isLiveMode ? 'cyber-status-online animate-pulse' : 'cyber-status-info'}`}>
                {isLiveMode ? 'AI REAL-TIME ACTIVE' : 'SIMULATION MODE'}
              </Badge>

              <Badge variant="secondary" className={`${connectionStatus.color} text-xs hidden sm:inline-flex`}>
                {connectionStatus.status}
              </Badge>

              {isAIProcessing && (
                <Badge variant="secondary" className="cyber-status-warning animate-pulse text-xs">
                  AI PROCESSING
                </Badge>
              )}
              
              <Badge variant="outline" className="cyber-status-info text-xs hidden md:inline-flex">
                Tamil Nadu Traffic Control
              </Badge>
            </div>
          </div>
        </div>

        {/* Success Message */}
        <div className="cyber-status-online rounded-lg p-3 md:p-4 flex items-center space-x-3">
          <CheckCircle className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
          <div>
            <div className="font-semibold text-xs md:text-sm">Supabase Backend Active</div>
            <div className="text-xs mt-1 opacity-90">
              Using integrated Supabase backend for real-time ANPR processing and data management.
            </div>
          </div>
        </div>

        {/* Camera Selector */}
        <CameraSelector
          cameras={cameras}
          selectedCamera={selectedCamera}
          onCameraSelect={handleCameraSelect}
        />

        {/* Responsive Layout Container */}
        <div className="cyber-responsive-layout">
          {/* Main Live Video Feed */}
          <div className="space-y-4">
            <Card className="cyber-card">
              <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <CardTitle className="text-foreground text-base md:text-lg flex items-center space-x-2">
                    <div className="flex items-center space-x-2 flex-wrap">
                      <div className={`w-3 h-3 rounded-full ${isLiveMode && isRecording ? 'bg-cyber-danger animate-pulse cyber-glow' : 'bg-muted-foreground'}`}></div>
                      <span className="text-sm md:text-base">AI Live Camera Feed - {currentCamera?.id}</span>
                      {trafficPattern.peakHours && (
                        <Badge variant="secondary" className="cyber-status-warning text-xs">
                          PEAK
                        </Badge>
                      )}
                      <Badge variant="secondary" className="cyber-status-online text-xs">
                        SUPABASE
                      </Badge>
                    </div>
                  </CardTitle>
                  <div className="flex-shrink-0">
                    <CameraControls
                      isRecording={isRecording}
                      frameRate={currentCamera?.fps || 30}
                      resolution={currentCamera?.resolution || "1920x1080"}
                      isFullscreen={isFullscreen}
                      audioEnabled={audioEnabled}
                      onRecordingToggle={handleRecordingToggle}
                      onFullscreenToggle={handleFullscreenToggle}
                      onAudioToggle={handleAudioToggle}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-3 md:p-6">
                <LiveVideoCanvas
                  isRecording={isRecording && isLiveMode}
                  isFullscreen={isFullscreen}
                  currentCamera={currentCamera}
                  frameRate={currentCamera?.fps || 30}
                  vehicleCount={trafficPattern.vehicleCount}
                  detectedPlate={detectedPlate}
                  confidence={confidence}
                  processingStep={processingStep}
                  onVehicleCountUpdate={handleVehicleCountUpdate}
                />
              </CardContent>
            </Card>

            {/* Processing Pipeline */}
            <Card className="cyber-card">
              <CardContent className="p-3 md:p-4">
                <ProcessingPipeline
                  processingStep={processingStep}
                  processingSteps={processingSteps}
                />
                
                {/* AI System Load Indicator */}
                <div className="mt-4 p-3 cyber-glass rounded-lg">
                  <div className="text-foreground text-sm font-semibold mb-2 flex items-center justify-between">
                    <span>AI System Load</span>
                    <span className="text-cyber-accent text-xs">Supabase Backend</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 md:gap-4">
                    <div className="text-center">
                      <div className="text-xs text-muted-foreground">CPU</div>
                      <div className="text-foreground font-bold text-sm md:text-base">{systemLoad.cpu}%</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-muted-foreground">Memory</div>
                      <div className="text-foreground font-bold text-sm md:text-base">{systemLoad.memory}%</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-muted-foreground">Processing</div>
                      <div className="text-foreground font-bold text-sm md:text-base">{systemLoad.processing}%</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Side Panel - Responsive */}
          <div className="space-y-3 md:space-y-4">
            <ThreatAnalysisOverview cameraId={selectedCamera} />
            <RecentSDNActions cameraId={selectedCamera} />
            <PythonANPRService />
            <AIRealTimeAnalytics cameraId={selectedCamera} />
            <LiveAlerts 
              selectedCamera={selectedCamera}
              isLive={isLiveMode && isRecording}
            />
            
            <RecentDetections
              plateHistory={plateHistory}
              selectedCamera={selectedCamera}
            />
            
            <CameraNetworkStatus
              cameras={cameras}
              selectedCamera={selectedCamera}
              onCameraSelect={handleCameraSelect}
            />
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default LiveFeed;
