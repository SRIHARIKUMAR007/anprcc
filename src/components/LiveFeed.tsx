import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Activity, Pause, Play, Radio, CheckCircle, Camera, Monitor, Zap, BarChart3 } from "lucide-react";
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

  const { isBackendConnected, connectionHealth, isConnected, systemStats, detections } = useEnhancedBackendIntegration();

  // Enhanced real-time analytics
  const [liveAnalytics, setLiveAnalytics] = useState({
    totalDetections: 0,
    averageConfidence: 0,
    detectionRate: 0,
    cameraHealth: {} as Record<string, number>
  });

  // Transform real cameras to match the expected format with enhanced data
  const transformedRealCameras: LiveFeedCamera[] = realCameras.map((camera: CameraType) => ({
    id: camera.camera_id,
    location: camera.location,
    status: (camera.status || 'active') as 'active' | 'inactive' | 'maintenance',
    vehicles: liveAnalytics.cameraHealth[camera.camera_id] || Math.floor(Math.random() * 15) + 1,
    fps: camera.status === 'active' ? 30 : 0,
    resolution: "1920x1080",
    coordinates: { 
      lat: 13.0827 + (Math.random() - 0.5) * 2,
      lng: 80.2707 + (Math.random() - 0.5) * 2 
    },
    direction: ["North-South", "East-West", "Bidirectional", "Multi-directional"][Math.floor(Math.random() * 4)]
  }));

  const cameras = transformedRealCameras.length > 0 ? transformedRealCameras : mockCameras;
  const currentCamera = cameras.find(cam => cam.id === selectedCamera);

  // Enhanced analytics update with real Supabase data
  useEffect(() => {
    if (detections.length > 0 && systemStats) {
      const recentDetections = detections.slice(-10);
      const avgConfidence = recentDetections.reduce((acc, det) => acc + det.confidence, 0) / recentDetections.length;
      
      setLiveAnalytics({
        totalDetections: systemStats.detections_today || 0,
        averageConfidence: avgConfidence,
        detectionRate: systemStats.detections_hour || 0,
        cameraHealth: cameras.reduce((acc, cam) => ({
          ...acc,
          [cam.id]: Math.floor(Math.random() * 15) + 5
        }), {})
      });
    }
  }, [detections, systemStats, cameras]);

  // Enhanced plate detection simulation with real-time integration
  useEffect(() => {
    if (!isRecording || !isLiveMode) return;

    const interval = setInterval(() => {
      const currentIndex = processingSteps.indexOf(processingStep);
      const nextIndex = (currentIndex + 1) % processingSteps.length;
      setProcessingStep(processingSteps[nextIndex]);

      // Enhanced AI-powered detection with real data integration
      const detectionProbability = trafficPattern.peakHours ? 0.8 : 0.5;
      
      if (Math.random() < detectionProbability) {
        processAIDetection(selectedCamera).then(aiData => {
          if (aiData) {
            setDetectedPlate(aiData.plateNumber);
            setConfidence(aiData.confidence);
            
            // Update analytics
            setLiveAnalytics(prev => ({
              ...prev,
              totalDetections: prev.totalDetections + 1,
              detectionRate: prev.detectionRate + 1
            }));
            
            const displayTime = aiData.confidence > 90 ? 4000 : 2000;
            setTimeout(() => {
              setDetectedPlate(null);
              setConfidence(0);
            }, displayTime);
          }
        });
      }
    }, isAIProcessing ? 1500 : 2000);

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
          {/* Enhanced Header with Real-time Analytics */}
          <div className="bg-gradient-to-r from-slate-800/80 to-indigo-900/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-2xl animate-fade-in">
            <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
              <div className="flex items-center space-x-4">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-600/20 border border-indigo-400/30 shadow-lg">
                  <Monitor className="w-8 h-8 text-indigo-300" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white via-indigo-200 to-purple-300 bg-clip-text text-transparent">
                    AI-Powered Live Camera Network
                  </h1>
                  <div className="flex items-center space-x-4 text-slate-300 text-sm sm:text-base mt-1">
                    <span>Real-time ANPR monitoring • {cameras.filter(c => c.status === 'active').length} active cameras</span>
                    {trafficPattern.peakHours && (
                      <Badge className="bg-amber-400/10 text-amber-300 border-amber-400/30">
                        Peak Traffic Hours
                      </Badge>
                    )}
                  </div>
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
                
                <Badge variant="secondary" className={connectionStatus.color}>
                  {connectionStatus.status}
                </Badge>

                {isAIProcessing && (
                  <Badge variant="secondary" className="bg-purple-400/10 text-purple-300 border-purple-400/30 animate-pulse">
                    AI PROCESSING
                  </Badge>
                )}

                {/* Real-time Analytics Display */}
                <div className="hidden md:flex items-center space-x-4 text-xs">
                  <div className="text-center">
                    <div className="text-cyan-400 font-bold">{liveAnalytics.totalDetections}</div>
                    <div className="text-slate-400">Total</div>
                  </div>
                  <div className="text-center">
                    <div className="text-green-400 font-bold">{liveAnalytics.averageConfidence.toFixed(1)}%</div>
                    <div className="text-slate-400">Accuracy</div>
                  </div>
                  <div className="text-center">
                    <div className="text-purple-400 font-bold">{liveAnalytics.detectionRate}/hr</div>
                    <div className="text-slate-400">Rate</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Real-time System Health Bar */}
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-800/30 rounded-lg p-3 border border-blue-500/20">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-slate-400">Active Cameras</div>
                    <div className="text-lg font-bold text-blue-300">{cameras.filter(c => c.status === 'active').length}</div>
                  </div>
                  <Camera className="w-5 h-5 text-blue-400" />
                </div>
              </div>
              <div className="bg-slate-800/30 rounded-lg p-3 border border-green-500/20">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-slate-400">Detections/Hr</div>
                    <div className="text-lg font-bold text-green-300">{liveAnalytics.detectionRate}</div>
                  </div>
                  <BarChart3 className="w-5 h-5 text-green-400" />
                </div>
              </div>
              <div className="bg-slate-800/30 rounded-lg p-3 border border-purple-500/20">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-slate-400">AI Accuracy</div>
                    <div className="text-lg font-bold text-purple-300">{liveAnalytics.averageConfidence.toFixed(1)}%</div>
                  </div>
                  <Activity className="w-5 h-5 text-purple-400" />
                </div>
              </div>
              <div className="bg-slate-800/30 rounded-lg p-3 border border-cyan-500/20">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-slate-400">System Load</div>
                    <div className="text-lg font-bold text-cyan-300">{systemLoad.cpu}%</div>
                  </div>
                  <Zap className="w-5 h-5 text-cyan-400" />
                </div>
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

          {/* Enhanced Camera Selector with Health Indicators */}
          <div className="animate-slide-in" style={{ animationDelay: '0.1s' }}>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 mb-4">
              {cameras.map((camera) => (
                <Button
                  key={camera.id}
                  variant={selectedCamera === camera.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCamera(camera.id)}
                  disabled={camera.status === 'maintenance'}
                  className={`text-xs p-3 h-auto ${
                    selectedCamera === camera.id ? 'bg-blue-600 border-blue-500' : ''
                  } ${camera.status === 'maintenance' ? 'opacity-50' : ''}`}
                >
                  <div className="text-center w-full">
                    <div className="flex items-center justify-between mb-1">
                      <div className="font-mono font-bold">{camera.id}</div>
                      <div className="text-xs text-green-400">
                        {liveAnalytics.cameraHealth[camera.id] || camera.vehicles}
                      </div>
                    </div>
                    <div className="text-xs opacity-75 truncate mb-1">{camera.location.split(' - ')[0]}</div>
                    <div className="flex items-center justify-between">
                      <div className={`w-2 h-2 rounded-full ${
                        camera.status === 'active' ? 'bg-green-400' : 
                        camera.status === 'maintenance' ? 'bg-yellow-400' : 'bg-red-400'
                      }`}></div>
                      <div className="text-xs text-slate-400">{camera.fps}fps</div>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
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
