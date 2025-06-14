
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
import LiveTrafficFlow from "./livefeed/LiveTrafficFlow";
import LiveAlerts from "./livefeed/LiveAlerts";
import { mockCameras, processingSteps } from "./livefeed/mockData";
import { useRealTimeIntegration } from "@/hooks/useRealTimeIntegration";
import { LiveFeedCamera } from "@/types/camera";
import { Camera } from "@/types/supabase";

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

  // Enhanced plate detection simulation
  useEffect(() => {
    if (!isRecording || !isLiveMode) return;

    const interval = setInterval(() => {
      // Cycle through processing steps
      const currentIndex = processingSteps.indexOf(processingStep);
      const nextIndex = (currentIndex + 1) % processingSteps.length;
      setProcessingStep(processingSteps[nextIndex]);

      // Random plate detection with higher frequency for live feel
      if (Math.random() > 0.6) {
        const plates = [
          "TN-01-AB-1234", "TN-09-CD-5678", "TN-33-EF-9012", 
          "TN-45-GH-3456", "TN-67-IJ-7890", "KA-09-UV-4567", 
          "AP-16-WX-8901", "KL-07-YZ-2345", "TN-72-KL-2468",
          "TN-38-MN-1357", "TN-55-PQ-8642", "MH-12-DE-6789"
        ];
        const randomPlate = plates[Math.floor(Math.random() * plates.length)];
        const randomConfidence = Math.floor(85 + Math.random() * 15);
        
        setDetectedPlate(randomPlate);
        setConfidence(randomConfidence);
        
        // Add to history
        setPlateHistory(prev => [randomPlate, ...prev.slice(0, 19)]);
        
        // Clear after 2 seconds for more dynamic feel
        setTimeout(() => {
          setDetectedPlate(null);
          setConfidence(0);
        }, 2000);
      }
    }, 1000); // Faster updates for live feel

    return () => clearInterval(interval);
  }, [isRecording, isLiveMode, processingStep]);

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
    <div className="space-y-6">
      {/* Enhanced Header with Live Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center space-x-3">
          <Activity className="w-6 h-6 text-blue-400" />
          <div>
            <h2 className="text-xl font-bold text-white">Live Camera Feed System</h2>
            <p className="text-slate-400 text-sm">
              Real-time monitoring • {cameras.filter(c => c.status === 'active').length} active cameras
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
            <span>{isLiveMode ? 'LIVE MODE' : 'DEMO MODE'}</span>
          </Button>
          
          <Badge variant="secondary" className={`${isLiveMode ? 'bg-green-500/20 text-green-400 border-green-500/30 animate-pulse' : 'bg-gray-500/20 text-gray-400 border-gray-500/30'}`}>
            {isLiveMode ? 'REAL-TIME ACTIVE' : 'SIMULATION MODE'}
          </Badge>
          
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
                    <span>Live Camera Feed - {currentCamera?.id}</span>
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
                vehicleCount={vehicleCount}
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
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Side Panel */}
        <div className="space-y-4">
          {/* Live Alerts */}
          <LiveAlerts 
            selectedCamera={selectedCamera}
            isLive={isLiveMode && isRecording}
          />
          
          {/* Live Traffic Flow */}
          <LiveTrafficFlow
            cameraId={selectedCamera}
            isLive={isLiveMode && isRecording}
          />
          
          {/* Recent Detections */}
          <RecentDetections
            plateHistory={plateHistory}
            selectedCamera={selectedCamera}
          />
          
          {/* Camera Network Status */}
          <CameraNetworkStatus
            cameras={cameras}
            selectedCamera={selectedCamera}
            onCameraSelect={handleCameraSelect}
          />
        </div>
      </div>
    </div>
  );
};

export default LiveFeed;
