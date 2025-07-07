
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Activity, Pause, Play, Radio, CheckCircle, Camera, Monitor, Zap } from "lucide-react";
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
      return { status: 'Live Connected', color: 'bg-emerald-400/10 text-emerald-300 border-emerald-400/30' };
    } else if (connectionHealth.database) {
      return { status: 'Database Only', color: 'bg-amber-400/10 text-amber-300 border-amber-400/30' };
    } else {
      return { status: 'Demo Mode', color: 'bg-cyan-400/10 text-cyan-300 border-cyan-400/30' };
    }
  };

  const connectionStatus = getConnectionStatus();

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-4 lg:p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Enhanced Header */}
          <div className="bg-gradient-to-r from-slate-800/80 to-indigo-900/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-2xl animate-fade-in">
            <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
              <div className="flex items-center space-x-4">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-600/20 border border-indigo-400/30 shadow-lg">
                  <Monitor className="w-8 h-8 text-indigo-300" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white via-indigo-200 to-purple-300 bg-clip-text text-transparent">
                    AI-Powered Live Camera Feed
                  </h1>
                  <p className="text-slate-300 text-sm sm:text-base mt-1">
                    Real-time ANPR monitoring • {cameras.filter(c => c.status === 'active').length} active cameras
                    {trafficPattern.peakHours && (
                      <span className="text-amber-300 ml-2">• Peak Traffic Hours</span>
                    )}
                  </p>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  variant={isLiveMode ? "default" : "outline"}
                  size="sm"
                  onClick={toggleLiveMode}
                  className={`flex items-center space-x-2 text-sm transition-all duration-300 ${
                    isLiveMode 
                      ? 'bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white border-0 shadow-lg' 
                      : 'bg-slate-700/50 text-slate-300 border-slate-600 hover:bg-slate-600/50'
                  }`}
                >
                  <Zap className={`w-4 h-4 ${isLiveMode ? 'animate-pulse' : ''}`} />
                  <span>{isLiveMode ? 'LIVE MODE' : 'DEMO MODE'}</span>
                </Button>
                
                <Badge variant="secondary" className={`${isLiveMode ? 'bg-emerald-400/10 text-emerald-300 border-emerald-400/30 animate-pulse' : 'bg-slate-600/20 text-slate-400 border-slate-500/30'}`}>
                  {isLiveMode ? 'REAL-TIME ACTIVE' : 'SIMULATION'}
                </Badge>

                <Badge variant="secondary" className={connectionStatus.color}>
                  {connectionStatus.status}
                </Badge>

                {isAIProcessing && (
                  <Badge variant="secondary" className="bg-purple-400/10 text-purple-300 border-purple-400/30 animate-pulse">
                    AI PROCESSING
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Status Indicator */}
          <div className="bg-gradient-to-r from-slate-800/60 to-slate-700/60 backdrop-blur-xl border border-slate-600/50 rounded-xl p-4 shadow-xl animate-slide-in">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-6 h-6 text-emerald-400 flex-shrink-0" />
              <div>
                <div className="text-emerald-300 font-semibold">System Operational</div>
                <div className="text-slate-300 text-sm mt-1">
                  Integrated backend processing with real-time ANPR detection and Tamil Nadu traffic monitoring.
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

          {/* Main Live Video Feed */}
          <div className="animate-slide-in" style={{ animationDelay: '0.2s' }}>
            <Card className="bg-gradient-to-br from-slate-800/60 to-slate-700/60 backdrop-blur-xl border border-slate-600/50 shadow-2xl rounded-2xl overflow-hidden">
              <CardHeader className="pb-4 bg-gradient-to-r from-slate-800/80 to-slate-700/80">
                <div className="flex flex-col space-y-3 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
                  <CardTitle className="text-white text-lg sm:text-xl lg:text-2xl flex items-center space-x-3">
                    <div className="flex items-center space-x-3 flex-wrap">
                      <div className={`w-4 h-4 rounded-full ${isLiveMode && isRecording ? 'bg-red-500 animate-pulse shadow-lg shadow-red-500/50' : 'bg-slate-500'}`}></div>
                      <span className="bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent font-bold">
                        Live Camera Feed - {currentCamera?.id}
                      </span>
                      {trafficPattern.peakHours && (
                        <Badge variant="secondary" className="bg-amber-400/10 text-amber-300 border-amber-400/30">
                          PEAK TRAFFIC
                        </Badge>
                      )}
                      <Badge variant="secondary" className="bg-indigo-400/10 text-indigo-300 border-indigo-400/30">
                        AI ENHANCED
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
              <CardContent className="p-6">
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

          {/* Processing Pipeline */}
          <div className="animate-slide-in" style={{ animationDelay: '0.3s' }}>
            <Card className="bg-gradient-to-br from-slate-800/60 to-slate-700/60 backdrop-blur-xl border border-slate-600/50 shadow-xl rounded-xl">
              <CardContent className="p-6">
                <ProcessingPipeline
                  processingStep={processingStep}
                  processingSteps={processingSteps}
                />
                
                {/* AI System Load Indicator */}
                <div className="mt-6 p-6 bg-gradient-to-r from-indigo-900/30 to-purple-900/30 rounded-xl border border-indigo-500/20 shadow-inner">
                  <div className="text-white text-lg font-semibold mb-4 flex items-center justify-between">
                    <span className="bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">
                      AI System Performance
                    </span>
                    <Badge variant="secondary" className="bg-indigo-400/10 text-indigo-300 border-indigo-400/30">
                      Real-time Monitoring
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-slate-700/30 rounded-lg border border-slate-600/30">
                      <div className="text-sm text-slate-400 mb-2">CPU Usage</div>
                      <div className="text-2xl font-bold text-cyan-300 mb-1">{systemLoad.cpu}%</div>
                      <div className="w-full bg-slate-600 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all duration-500" 
                          style={{ width: `${systemLoad.cpu}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="text-center p-4 bg-slate-700/30 rounded-lg border border-slate-600/30">
                      <div className="text-sm text-slate-400 mb-2">Memory</div>
                      <div className="text-2xl font-bold text-purple-300 mb-1">{systemLoad.memory}%</div>
                      <div className="w-full bg-slate-600 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500" 
                          style={{ width: `${systemLoad.memory}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="text-center p-4 bg-slate-700/30 rounded-lg border border-slate-600/30">
                      <div className="text-sm text-slate-400 mb-2">Processing</div>
                      <div className="text-2xl font-bold text-emerald-300 mb-1">{systemLoad.processing}%</div>
                      <div className="w-full bg-slate-600 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-emerald-500 to-green-500 h-2 rounded-full transition-all duration-500" 
                          style={{ width: `${systemLoad.processing}%` }}
                        ></div>
                      </div>
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
