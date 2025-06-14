
import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Camera, Play, Pause, RotateCw, Zap, MapPin, Clock, Cpu, Monitor, Settings, Volume2, VolumeX, Maximize2 } from "lucide-react";

const LiveFeed = () => {
  const [isRecording, setIsRecording] = useState(true);
  const [selectedCamera, setSelectedCamera] = useState("CAM-02");
  const [detectedPlate, setDetectedPlate] = useState<string | null>(null);
  const [confidence, setConfidence] = useState(0);
  const [processingStep, setProcessingStep] = useState("Idle");
  const [frameRate, setFrameRate] = useState(30);
  const [detectedVehicles, setDetectedVehicles] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [currentLocation, setCurrentLocation] = useState({ lat: 28.6139, lng: 77.2090 });
  const [vehicleCount, setVehicleCount] = useState(0);
  const [plateHistory, setPlateHistory] = useState<string[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const vehiclePositions = useRef<Array<{x: number, speed: number, plateNumber: string, color: string}>>([]);

  const mockCameras = [
    { 
      id: "CAM-01", 
      location: "Chennai - GST Road Junction", 
      status: "active", 
      vehicles: 8, 
      fps: 30, 
      resolution: "4K (3840x2160)",
      coordinates: { lat: 13.0827, lng: 80.2707 },
      direction: "North-South"
    },
    { 
      id: "CAM-02", 
      location: "Coimbatore - Salem Highway", 
      status: "active", 
      vehicles: 12, 
      fps: 30, 
      resolution: "1920x1080",
      coordinates: { lat: 11.0168, lng: 76.9558 },
      direction: "East-West"
    },
    { 
      id: "CAM-03", 
      location: "Madurai - Trichy Road", 
      status: "maintenance", 
      vehicles: 0, 
      fps: 0, 
      resolution: "offline",
      coordinates: { lat: 9.9252, lng: 78.1198 },
      direction: "N/A"
    },
    { 
      id: "CAM-04", 
      location: "Salem - Bangalore Highway Toll", 
      status: "active", 
      vehicles: 15, 
      fps: 25, 
      resolution: "1920x1080",
      coordinates: { lat: 11.6643, lng: 78.1460 },
      direction: "Bidirectional"
    },
    { 
      id: "CAM-05", 
      location: "Tiruchirappalli - Main Junction", 
      status: "active", 
      vehicles: 6, 
      fps: 30, 
      resolution: "2K (2560x1440)",
      coordinates: { lat: 10.7905, lng: 78.7047 },
      direction: "Multi-directional"
    },
    { 
      id: "CAM-06", 
      location: "Tirunelveli - Highway Entry", 
      status: "active", 
      vehicles: 4, 
      fps: 30, 
      resolution: "1920x1080",
      coordinates: { lat: 8.7139, lng: 77.7567 },
      direction: "North-South"
    }
  ];

  const processingSteps = [
    "Capturing Frame",
    "Preprocessing Image", 
    "Detecting Plate Region",
    "Character Segmentation",
    "OCR Recognition",
    "Database Validation",
    "Alerting System Check",
    "Validation Complete"
  ];

  const generateRealisticPlate = () => {
    const tnPlates = [
      "TN-01-AB-1234", "TN-09-CD-5678", "TN-33-EF-9012", 
      "TN-45-GH-3456", "TN-67-IJ-7890", "TN-72-KL-2468",
      "TN-38-MN-1357", "TN-55-PQ-8642", "TN-02-RS-9753"
    ];
    const otherStates = ["KA-09-UV-4567", "AP-16-WX-8901", "KL-07-YZ-2345"];
    
    const allPlates = [...tnPlates, ...otherStates];
    return allPlates[Math.floor(Math.random() * allPlates.length)];
  };

  const currentCamera = mockCameras.find(cam => cam.id === selectedCamera);

  // Enhanced vehicle simulation
  useEffect(() => {
    if (!canvasRef.current || !isRecording || !currentCamera || currentCamera.status !== 'active') return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    // Initialize vehicles
    if (vehiclePositions.current.length === 0) {
      for (let i = 0; i < (currentCamera?.vehicles || 3); i++) {
        vehiclePositions.current.push({
          x: Math.random() * (canvas.width + 200) - 100,
          speed: 1 + Math.random() * 2,
          plateNumber: generateRealisticPlate(),
          color: `hsl(${Math.random() * 360}, 70%, 50%)`
        });
      }
    }

    const animate = () => {
      // Clear canvas
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw road with lane markings
      ctx.fillStyle = '#374151';
      ctx.fillRect(0, canvas.height * 0.65, canvas.width, canvas.height * 0.35);

      // Draw multiple lane lines
      ctx.strokeStyle = '#ffffff';
      ctx.setLineDash([15, 10]);
      ctx.lineWidth = 2;
      
      // Lane 1
      ctx.beginPath();
      ctx.moveTo(0, canvas.height * 0.75);
      ctx.lineTo(canvas.width, canvas.height * 0.75);
      ctx.stroke();
      
      // Lane 2
      ctx.beginPath();
      ctx.moveTo(0, canvas.height * 0.85);
      ctx.lineTo(canvas.width, canvas.height * 0.85);
      ctx.stroke();

      // Draw side markings
      ctx.setLineDash([]);
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, canvas.height * 0.65);
      ctx.lineTo(canvas.width, canvas.height * 0.65);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(0, canvas.height * 0.95);
      ctx.lineTo(canvas.width, canvas.height * 0.95);
      ctx.stroke();

      let detectionInProgress = false;

      // Draw and animate vehicles
      vehiclePositions.current.forEach((vehicle, index) => {
        vehicle.x += vehicle.speed;
        
        if (vehicle.x > canvas.width + 100) {
          vehicle.x = -100;
          vehicle.plateNumber = generateRealisticPlate();
          vehicle.color = `hsl(${Math.random() * 360}, 70%, 50%)`;
        }

        const laneY = index % 2 === 0 ? canvas.height * 0.68 : canvas.height * 0.78;
        
        // Draw vehicle
        ctx.fillStyle = vehicle.color;
        ctx.fillRect(vehicle.x, laneY, 80, 25);
        
        // Draw vehicle details (windows, etc.)
        ctx.fillStyle = '#87ceeb';
        ctx.fillRect(vehicle.x + 10, laneY + 2, 60, 8);
        
        // Draw license plate
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(vehicle.x + 15, laneY + 15, 50, 8);
        ctx.fillStyle = '#000000';
        ctx.font = '6px monospace';
        ctx.fillText(vehicle.plateNumber, vehicle.x + 17, laneY + 21);

        // Detection zone
        if (vehicle.x > canvas.width * 0.4 && vehicle.x < canvas.width * 0.6) {
          detectionInProgress = true;
          
          // Draw detection box
          ctx.strokeStyle = '#10b981';
          ctx.lineWidth = 2;
          ctx.setLineDash([5, 5]);
          ctx.strokeRect(vehicle.x + 15, laneY + 15, 50, 8);
          
          // Draw scanning lines
          ctx.strokeStyle = '#22d3ee';
          ctx.lineWidth = 1;
          ctx.setLineDash([]);
          for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.moveTo(vehicle.x + 15, laneY + 15 + (i * 3));
            ctx.lineTo(vehicle.x + 65, laneY + 15 + (i * 3));
            ctx.stroke();
          }
        }
      });

      // Camera info overlay
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(10, 10, 280, 60);
      ctx.fillStyle = '#ffffff';
      ctx.font = '12px monospace';
      ctx.fillText(`${currentCamera.id} • ${currentCamera.location}`, 15, 25);
      ctx.fillText(`${currentCamera.resolution} • ${frameRate} FPS`, 15, 40);
      ctx.fillText(`Vehicles: ${vehicleCount} • Direction: ${currentCamera.direction}`, 15, 55);

      // Performance metrics
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(canvas.width - 150, 10, 140, 45);
      ctx.fillStyle = '#ffffff';
      ctx.font = '11px monospace';
      ctx.fillText(`Processing: ${Math.floor(12 + Math.random() * 8)}ms`, canvas.width - 145, 25);
      ctx.fillText(`Quality: ${Math.floor(94 + Math.random() * 6)}%`, canvas.width - 145, 40);

      setVehicleCount(vehiclePositions.current.length);
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [isRecording, selectedCamera, currentCamera, frameRate]);

  // Enhanced detection simulation
  useEffect(() => {
    if (!isRecording || !currentCamera || currentCamera.status !== 'active') return;

    const interval = setInterval(() => {
      setFrameRate(28 + Math.floor(Math.random() * 5));
      setDetectedVehicles(prev => prev + Math.floor(Math.random() * 2));

      const stepIndex = Math.floor(Math.random() * processingSteps.length);
      setProcessingStep(processingSteps[stepIndex]);

      if (Math.random() > 0.7) {
        const mockPlate = generateRealisticPlate();
        setDetectedPlate(mockPlate);
        setConfidence(Math.floor(85 + Math.random() * 15));
        
        setPlateHistory(prev => [mockPlate, ...prev.slice(0, 9)]);
        
        setTimeout(() => {
          setDetectedPlate(null);
          setProcessingStep("Idle");
        }, 3000);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [isRecording, selectedCamera, currentCamera]);

  // Update location when camera changes
  useEffect(() => {
    if (currentCamera) {
      setCurrentLocation(currentCamera.coordinates);
    }
  }, [selectedCamera, currentCamera]);

  const switchCamera = (cameraId: string) => {
    setSelectedCamera(cameraId);
    vehiclePositions.current = []; // Reset vehicles for new camera
    setDetectedPlate(null);
    setProcessingStep("Idle");
  };

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Camera Selection and Controls */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <CardTitle className="text-white flex items-center text-base lg:text-lg">
              <Monitor className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
              Tamil Nadu Traffic Camera Network
            </CardTitle>
            <div className="flex items-center gap-2 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="text-xs"
              >
                <Maximize2 className="w-3 h-3 mr-1" />
                {isFullscreen ? "Exit" : "Fullscreen"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAudioEnabled(!audioEnabled)}
                className="text-xs"
              >
                {audioEnabled ? <Volume2 className="w-3 h-3" /> : <VolumeX className="w-3 h-3" />}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
              >
                <Settings className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 mb-4">
            {mockCameras.map((camera) => (
              <Button
                key={camera.id}
                variant={selectedCamera === camera.id ? "default" : "outline"}
                size="sm"
                onClick={() => switchCamera(camera.id)}
                disabled={camera.status === 'maintenance'}
                className={`text-xs p-2 h-auto ${
                  selectedCamera === camera.id ? 'bg-blue-600 border-blue-500' : ''
                } ${camera.status === 'maintenance' ? 'opacity-50' : ''}`}
              >
                <div className="text-center">
                  <div className="font-mono font-bold">{camera.id}</div>
                  <div className="text-xs opacity-75 truncate">{camera.location.split(' - ')[0]}</div>
                  <div className={`w-2 h-2 rounded-full mx-auto mt-1 ${
                    camera.status === 'active' ? 'bg-green-400' : 
                    camera.status === 'maintenance' ? 'bg-yellow-400' : 'bg-red-400'
                  }`}></div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Camera Feed */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <CardTitle className="text-white flex items-center text-base lg:text-lg">
              <Camera className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
              Live Feed - {selectedCamera}
            </CardTitle>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant={isRecording ? "default" : "secondary"} className="bg-red-500/20 text-red-400 border-red-500/30 text-xs">
                {isRecording ? "LIVE" : "PAUSED"}
              </Badge>
              <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                {frameRate} FPS
              </Badge>
              <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">
                {currentCamera?.resolution}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsRecording(!isRecording)}
                className="text-xs"
              >
                {isRecording ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className={`relative bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg overflow-hidden ${
            isFullscreen ? 'fixed inset-0 z-50 bg-black' : 'aspect-video'
          }`}>
            <canvas
              ref={canvasRef}
              width={800}
              height={450}
              className="w-full h-full"
            />
            
            {/* Enhanced overlay information */}
            <div className="absolute top-2 left-2 lg:top-4 lg:left-4 space-y-1">
              <div className="text-white text-xs lg:text-sm font-mono bg-black/70 px-2 py-1 rounded">
                {currentCamera?.id} • {currentCamera?.location}
              </div>
              <div className="text-white text-xs lg:text-sm font-mono bg-black/70 px-2 py-1 rounded flex items-center">
                <MapPin className="w-3 h-3 mr-1" />
                {currentLocation.lat.toFixed(4)}, {currentLocation.lng.toFixed(4)}
              </div>
              <div className="text-white text-xs lg:text-sm font-mono bg-black/70 px-2 py-1 rounded">
                Direction: {currentCamera?.direction}
              </div>
            </div>
            
            <div className="absolute top-2 right-2 lg:top-4 lg:right-4 space-y-1">
              <div className="text-white text-xs lg:text-sm bg-black/70 px-2 py-1 rounded">
                {new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' })} IST
              </div>
              <div className="text-white text-xs lg:text-sm bg-black/70 px-2 py-1 rounded flex items-center">
                <Cpu className="w-3 h-3 mr-1" />
                Active: {vehicleCount}
              </div>
            </div>

            {/* Enhanced plate detection overlay */}
            {detectedPlate && (
              <div className="absolute inset-0 flex items-center justify-center p-4">
                <div className="bg-green-500/20 border-2 border-green-500 rounded-lg p-3 lg:p-6 backdrop-blur-sm animate-pulse max-w-full">
                  <div className="text-green-400 text-xs lg:text-sm mb-2 flex items-center">
                    <Zap className="w-3 h-3 lg:w-4 lg:h-4 mr-1" />
                    ANPR Detection Active
                  </div>
                  <div className="text-white text-lg lg:text-2xl font-mono font-bold break-all">{detectedPlate}</div>
                  <div className="text-green-400 text-xs lg:text-sm mt-2">Confidence: {confidence}%</div>
                  <div className="text-blue-400 text-xs mt-1">Processing: {processingStep}</div>
                  <div className="text-yellow-400 text-xs mt-1">
                    {detectedPlate.startsWith('TN-') ? 'Tamil Nadu Vehicle' : 'Out-of-State Vehicle'}
                  </div>
                </div>
              </div>
            )}

            {/* Processing indicator */}
            <div className="absolute bottom-2 left-2 lg:bottom-4 lg:left-4 bg-blue-500/20 border border-blue-500/30 rounded px-2 lg:px-3 py-1 lg:py-2">
              <div className="flex items-center text-blue-400 text-xs lg:text-sm">
                <RotateCw className="w-3 h-3 mr-1 lg:mr-2 animate-spin" />
                <span className="hidden sm:inline">{processingStep}</span>
                <span className="sm:hidden">Processing...</span>
              </div>
            </div>

            {/* Performance metrics */}
            <div className="absolute bottom-2 right-2 lg:bottom-4 lg:right-4 space-y-1">
              <div className="bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                {Math.floor(10 + Math.random() * 15)}ms
              </div>
              <div className="bg-black/70 text-white text-xs px-2 py-1 rounded">
                Accuracy: {Math.floor(94 + Math.random() * 6)}%
              </div>
            </div>
          </div>

          {/* Enhanced Processing Pipeline */}
          <div className="mt-4 p-3 lg:p-4 bg-slate-700/30 rounded-lg">
            <div className="text-white text-sm font-semibold mb-3">Enhanced ANPR Processing Pipeline</div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2 lg:gap-3">
              {processingSteps.map((step, index) => (
                <div 
                  key={step}
                  className={`p-2 lg:p-3 rounded text-xs text-center transition-all duration-300 ${
                    processingStep === step 
                      ? "bg-blue-500/30 text-blue-400 border border-blue-500/50 scale-105 animate-pulse" 
                      : "bg-slate-600/30 text-slate-400 hover:bg-slate-600/50"
                  }`}
                >
                  <div className="font-semibold truncate text-xs" title={step}>
                    {step.split(' ')[0]}
                  </div>
                  {processingStep === step && (
                    <div className="text-xs mt-1 text-blue-300">●</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Camera Network Status with Recent Detections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white text-base lg:text-lg">Camera Network Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
                {mockCameras.map((camera) => (
                  <div 
                    key={camera.id}
                    className={`p-3 lg:p-4 bg-slate-700/30 rounded-lg border transition-all cursor-pointer hover:scale-105 ${
                      selectedCamera === camera.id 
                        ? 'border-blue-500/50 bg-blue-500/10' 
                        : 'border-slate-600/50 hover:border-blue-500/30'
                    }`}
                    onClick={() => switchCamera(camera.id)}
                  >
                    <div className="flex items-center justify-between mb-2 lg:mb-3">
                      <div className="font-mono text-white font-semibold text-sm lg:text-base">{camera.id}</div>
                      <Badge 
                        variant={camera.status === "active" ? "default" : "secondary"}
                        className={`text-xs ${
                          camera.status === "active" 
                            ? "bg-green-500/20 text-green-400 border-green-500/30" 
                            : camera.status === "maintenance"
                            ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                            : "bg-red-500/20 text-red-400 border-red-500/30"
                        }`}
                      >
                        {camera.status}
                      </Badge>
                    </div>
                    <div className="text-slate-400 text-xs lg:text-sm mb-2">{camera.location}</div>
                    <div className="grid grid-cols-2 gap-1 lg:gap-2 text-xs">
                      <div className="text-slate-300">
                        <span className="text-slate-400">Vehicles:</span> {camera.vehicles}
                      </div>
                      <div className="text-slate-300">
                        <span className="text-slate-400">FPS:</span> {camera.fps}
                      </div>
                      <div className="text-slate-300 col-span-2">
                        <span className="text-slate-400">Resolution:</span> {camera.resolution}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white text-base lg:text-lg">Recent Detections</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {plateHistory.length === 0 ? (
                  <div className="text-center py-8 text-slate-400">
                    <Camera className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No recent detections</p>
                  </div>
                ) : (
                  plateHistory.map((plate, index) => (
                    <div 
                      key={`${plate}-${index}`}
                      className={`flex items-center justify-between p-3 bg-slate-700/30 rounded-lg border border-slate-600/50 ${
                        index === 0 ? 'border-green-500/30 bg-green-500/5' : ''
                      }`}
                    >
                      <div>
                        <div className="font-mono text-white font-bold text-sm">{plate}</div>
                        <div className="text-xs text-slate-400">
                          {selectedCamera} • {new Date().toLocaleTimeString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge 
                          variant="secondary"
                          className={`text-xs ${
                            plate.startsWith('TN-') 
                              ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                              : "bg-orange-500/20 text-orange-400 border-orange-500/30"
                          }`}
                        >
                          {plate.startsWith('TN-') ? 'TN' : 'OUT'}
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LiveFeed;
