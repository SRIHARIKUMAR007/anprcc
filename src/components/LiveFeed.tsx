import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Activity, Pause, Play, Radio } from "lucide-react";
import CameraSelector from "./livefeed/CameraSelector";
import CameraControls from "./livefeed/CameraControls";
import LiveVideoCanvas from "./livefeed/LiveVideoCanvas";
import ProcessingPipeline from "./livefeed/ProcessingPipeline";
import CameraNetworkStatus from "./livefeed/CameraNetworkStatus";
import RecentDetections from "./livefeed/RecentDetections";
import LiveAlerts from "./livefeed/LiveAlerts";
import { mockCameras, processingSteps } from "./livefeed/mockData";
import { useRealTimeIntegration } from "@/hooks/useRealTimeIntegration";
import { LiveFeedCamera } from "@/types/camera";
import { Camera } from "@/types/supabase";
import AIRealTimeAnalytics from "./livefeed/AIRealTimeAnalytics";
import { useAIRealTimeEngine } from "@/hooks/useAIRealTimeEngine";
import SDNThreatManager from "./livefeed/SDNThreatManager";
import PythonServiceMonitor from "./livefeed/PythonServiceMonitor";
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

  const { isBackendConnected, connectionHealth } = useEnhancedBackendIntegration();

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

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        {/* Enhanced Header with AI Status */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center space-x-3">
            <Activity className="w-6 h-6 text-blue-400" />
            <div>
              <h2 className="text-xl font-bold text-white">AI-Powered Live Camera Feed System</h2>
              <p className="text-slate-400 text-sm">
                Real-time AI monitoring • {cameras.filter(c => c.status === 'active').length} active cameras
                {trafficPattern.peakHours && (
                  <span className="text-orange-400 ml-2">• Peak Hours Active</span>
                )}
                {connectionHealth.backend && (
                  <span className="text-green-400 ml-2">• Python ANPR Active</span>
                )}
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant={isLiveMode ? "default" : "outline"}
              size="sm"
              onClick={toggleLiveMode}
              className="flex items-center space-x-2"
            >
              <Radio className={`w-4 h-4 ${isLiveMode ? 'animate-pulse' : ''}`} />
              <span>{isLiveMode ? 'AI LIVE MODE' : 'DEMO MODE'}</span>
            </Button>
            
            <Badge variant="secondary" className={`${isLiveMode ? 'bg-green-500/20 text-green-400 border-green-500/30 animate-pulse' : 'bg-gray-500/20 text-gray-400 border-gray-500/30'}`}>
              {isLiveMode ? 'AI REAL-TIME ACTIVE' : 'SIMULATION MODE'}
            </Badge>

            {connectionHealth.backend && (
              <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 border-blue-500/30 animate-pulse">
                PYTHON ANPR ONLINE
              </Badge>
            )}

            {isAIProcessing && (
              <Badge variant="secondary" className="bg-purple-500/20 text-purple-400 border-purple-500/30 animate-pulse">
                AI PROCESSING
              </Badge>
            )}
            
            <Badge variant="outline" className="bg-blue-500/20 text-blue-400 border-blue-500/30">
              Tamil Nadu Traffic Control
            </Badge>
          </div>
        </div>

        {/* Camera Selector */}
        <CameraSelector
          cameras={cameras}
          selectedCamera={selectedCamera}
          onCameraSelect={handleCameraSelect}
        />

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Main Live Video Feed */}
          <div className="xl:col-span-3 space-y-4">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="pb-3">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <CardTitle className="text-white text-lg lg:text-xl flex items-center space-x-2">
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${isLiveMode && isRecording ? 'bg-red-500 animate-pulse' : 'bg-gray-400'}`}></div>
                      <span>AI Live Camera Feed - {currentCamera?.id}</span>
                      {trafficPattern.peakHours && (
                        <Badge variant="secondary" className="bg-orange-500/20 text-orange-400 border-orange-500/30 text-xs">
                          PEAK
                        </Badge>
                      )}
                    </div>
                  </CardTitle>
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
              </CardHeader>
              <CardContent>
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
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4">
                <ProcessingPipeline
                  processingStep={processingStep}
                  processingSteps={processingSteps}
                />
                
                {/* AI System Load Indicator */}
                <div className="mt-4 p-3 bg-slate-700/30 rounded-lg">
                  <div className="text-white text-sm font-semibold mb-2">AI System Load</div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-xs text-slate-400">CPU</div>
                      <div className="text-white font-bold">{systemLoad.cpu}%</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-slate-400">Memory</div>
                      <div className="text-white font-bold">{systemLoad.memory}%</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-slate-400">Processing</div>
                      <div className="text-white font-bold">{systemLoad.processing}%</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Side Panel */}
          <div className="space-y-4">
            <PythonServiceMonitor />
            <SDNThreatManager cameraId={selectedCamera} />
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
