
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CameraSelector from "./livefeed/CameraSelector";
import CameraControls from "./livefeed/CameraControls";
import LiveVideoCanvas from "./livefeed/LiveVideoCanvas";
import ProcessingPipeline from "./livefeed/ProcessingPipeline";
import CameraNetworkStatus from "./livefeed/CameraNetworkStatus";
import RecentDetections from "./livefeed/RecentDetections";
import { mockCameras, processingSteps } from "./livefeed/mockData";
import { useRealTimeIntegration } from "@/hooks/useRealTimeIntegration";

const LiveFeed = () => {
  const [selectedCamera, setSelectedCamera] = useState("TN-01-NH01");
  const [isRecording, setIsRecording] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [vehicleCount, setVehicleCount] = useState(0);
  const [detectedPlate, setDetectedPlate] = useState<string | null>(null);
  const [confidence, setConfidence] = useState(0);
  const [processingStep, setProcessingStep] = useState("Initialization");
  const [plateHistory, setPlateHistory] = useState<string[]>([]);

  const { liveData, isLiveMode, cameras: realCameras } = useRealTimeIntegration();
  const cameras = realCameras.length > 0 ? realCameras : mockCameras;

  const currentCamera = cameras.find(cam => cam.id === selectedCamera);

  // Enhanced plate detection simulation
  useEffect(() => {
    if (!isRecording) return;

    const interval = setInterval(() => {
      // Cycle through processing steps
      const currentIndex = processingSteps.indexOf(processingStep);
      const nextIndex = (currentIndex + 1) % processingSteps.length;
      setProcessingStep(processingSteps[nextIndex]);

      // Random plate detection
      if (Math.random() > 0.7) {
        const plates = [
          "TN-01-AB-1234", "TN-09-CD-5678", "TN-33-EF-9012", 
          "TN-45-GH-3456", "TN-67-IJ-7890", "KA-09-UV-4567", 
          "AP-16-WX-8901", "KL-07-YZ-2345"
        ];
        const randomPlate = plates[Math.floor(Math.random() * plates.length)];
        const randomConfidence = Math.floor(85 + Math.random() * 15);
        
        setDetectedPlate(randomPlate);
        setConfidence(randomConfidence);
        
        // Add to history
        setPlateHistory(prev => [randomPlate, ...prev.slice(0, 9)]);
        
        // Clear after 3 seconds
        setTimeout(() => {
          setDetectedPlate(null);
          setConfidence(0);
        }, 3000);
      }
    }, 1500);

    return () => clearInterval(interval);
  }, [isRecording, processingStep]);

  const handleCameraSelect = (cameraId: string) => {
    setSelectedCamera(cameraId);
    setPlateHistory([]); // Clear history when switching cameras
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

  return (
    <div className="space-y-6">
      {/* Camera Selector */}
      <CameraSelector
        cameras={cameras}
        selectedCamera={selectedCamera}
        onCameraSelect={handleCameraSelect}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Live Video Feed */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-3">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <CardTitle className="text-white text-lg lg:text-xl">
                  Live Camera Feed - {currentCamera?.id}
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
                isRecording={isRecording}
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

        {/* Side Panel */}
        <div className="space-y-6">
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
  );
};

export default LiveFeed;
