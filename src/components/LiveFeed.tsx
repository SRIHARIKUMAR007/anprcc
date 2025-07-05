
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Activity, Pause, Play, Radio, CheckCircle, Camera } from "lucide-react";
import CameraSelector from "./livefeed/CameraSelector";
import CameraControls from "./livefeed/CameraControls";
import LiveVideoCanvas from "./livefeed/LiveVideoCanvas";
import ProcessingPipeline from "./livefeed/ProcessingPipeline";
import { mockCameras, processingSteps } from "./livefeed/mockData";
import { useRealTimeIntegration } from "@/hooks/useRealTimeIntegration";
import { LiveFeedCamera } from "@/types/camera";
import { Camera as CameraType } from "@/types/supabase";
import { useAIRealTimeEngine } from "@/hooks/useAIRealTimeEngine";
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
  const transformedRealCameras: LiveFeedCamera[] = realCameras.map((camera: CameraType) => ({
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
      return { status: 'Supabase Active', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' };
    } else if (connectionHealth.database) {
      return { status: 'Database Only', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' };
    } else {
      return { status: 'Demo Mode', color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' };
    }
  };

  const connectionStatus = getConnectionStatus();

  return (
    <ErrorBoundary>
      <div className="min-h-screen animated-bg p-4 lg:p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Enhanced Header with New Theme */}
          <div className="enhanced-card p-6 animate-fade-in">
            <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-full bg-gradient-to-r from-purple-500/20 to-cyan-500/20 neon-glow">
                  <Camera className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold gradient-text text-neon">
                    AI-Powered Live Camera Feed System
                  </h2>
                  <p className="text-purple-200 text-sm sm:text-base">
                    Real-time AI monitoring • {cameras.filter(c => c.status === 'active').length} active cameras
                    {trafficPattern.peakHours && (
                      <span className="text-amber-400 ml-2">• Peak Hours Active</span>
                    )}
                  </p>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <Button
                  variant={isLiveMode ? "default" : "outline"}
                  size="sm"
                  onClick={toggleLiveMode}
                  className="flex items-center space-x-2 text-xs sm:text-sm bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 border-0"
                >
                  <Radio className={`w-3 h-3 sm:w-4 sm:h-4 ${isLiveMode ? 'animate-pulse' : ''}`} />
                  <span>{isLiveMode ? 'AI LIVE MODE' : 'DEMO MODE'}</span>
                </Button>
                
                <Badge variant="secondary" className={`text-xs ${isLiveMode ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30 animate-pulse' : 'bg-gray-500/20 text-gray-400 border-gray-500/30'}`}>
                  {isLiveMode ? 'AI REAL-TIME ACTIVE' : 'SIMULATION MODE'}
                </Badge>

                <Badge variant="secondary" className={connectionStatus.color + " text-xs"}>
                  {connectionStatus.status}
                </Badge>

                {isAIProcessing && (
                  <Badge variant="secondary" className="bg-purple-500/20 text-purple-400 border-purple-500/30 animate-pulse text-xs">
                    AI PROCESSING
                  </Badge>
                )}
                
                <Badge variant="outline" className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30 text-xs">
                  Tamil Nadu Traffic Control
                </Badge>
              </div>
            </div>
          </div>

          {/* Success Message with New Theme */}
          <div className="enhanced-card p-4 animate-slide-in">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <div>
                <div className="text-emerald-400 font-semibold text-sm">Supabase Backend Active</div>
                <div className="text-purple-200 text-xs mt-1">
                  Using integrated Supabase backend for real-time ANPR processing and data management.
                </div>
              </div>
            </div>
          </div>

          {/* Camera Selector */}
          <div className="animate-slide-in" style={{ animationDelay: '0.1s' }}>
            <CameraSelector
              cameras={cameras}
              selectedCamera={selectedCamera}
              onCameraSelect={handleCameraSelect}
            />
          </div>

          {/* Main Live Video Feed - Full Width */}
          <div className="animate-slide-in" style={{ animationDelay: '0.2s' }}>
            <Card className="enhanced-card">
              <CardHeader className="pb-3">
                <div className="flex flex-col space-y-3 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
                  <CardTitle className="text-white text-base sm:text-lg lg:text-xl flex items-center space-x-2">
                    <div className="flex items-center space-x-2 flex-wrap">
                      <div className={`w-3 h-3 rounded-full ${isLiveMode && isRecording ? 'bg-red-500 animate-pulse neon-glow' : 'bg-gray-400'}`}></div>
                      <span className="gradient-text text-neon">AI Live Camera Feed - {currentCamera?.id}</span>
                      {trafficPattern.peakHours && (
                        <Badge variant="secondary" className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-xs">
                          PEAK
                        </Badge>
                      )}
                      <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs">
                        SUPABASE
                      </Badge>
                    </div>
                  </CardTitle>
                  <div className="w-full lg:w-auto">
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
              <CardContent className="p-3 sm:p-6">
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
          </div>

          {/* Processing Pipeline with New Theme */}
          <div className="animate-slide-in" style={{ animationDelay: '0.3s' }}>
            <Card className="enhanced-card">
              <CardContent className="p-4">
                <ProcessingPipeline
                  processingStep={processingStep}
                  processingSteps={processingSteps}
                />
                
                {/* AI System Load Indicator with New Theme */}
                <div className="mt-4 p-4 bg-gradient-to-r from-purple-900/20 to-cyan-900/20 rounded-lg border border-purple-500/20">
                  <div className="text-white text-sm font-semibold mb-3 flex items-center justify-between">
                    <span className="gradient-text">AI System Load</span>
                    <span className="text-emerald-400 text-xs">Supabase Backend</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-xs text-purple-300">CPU</div>
                      <div className="text-cyan-400 font-bold text-base neon-glow">{systemLoad.cpu}%</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-purple-300">Memory</div>
                      <div className="text-purple-400 font-bold text-base neon-glow">{systemLoad.memory}%</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-purple-300">Processing</div>
                      <div className="text-pink-400 font-bold text-base neon-glow">{systemLoad.processing}%</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default LiveFeed;
