
import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Camera, Play, Pause, RotateCw, Zap, MapPin, Clock, Cpu } from "lucide-react";

const LiveFeed = () => {
  const [isRecording, setIsRecording] = useState(true);
  const [detectedPlate, setDetectedPlate] = useState<string | null>(null);
  const [confidence, setConfidence] = useState(0);
  const [processingStep, setProcessingStep] = useState("Idle");
  const [frameRate, setFrameRate] = useState(30);
  const [detectedVehicles, setDetectedVehicles] = useState(0);
  const [currentLocation, setCurrentLocation] = useState({ lat: 28.6139, lng: 77.2090 });
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const mockCameras = [
    { id: "CAM-01", location: "Main Gate", status: "active", vehicles: 3, fps: 30, resolution: "1920x1080" },
    { id: "CAM-02", location: "Highway Junction", status: "active", vehicles: 7, fps: 30, resolution: "1920x1080" },
    { id: "CAM-03", location: "Parking Entrance", status: "maintenance", vehicles: 0, fps: 0, resolution: "offline" },
    { id: "CAM-04", location: "Toll Plaza", status: "active", vehicles: 12, fps: 25, resolution: "1920x1080" },
  ];

  const processingSteps = [
    "Capturing Frame",
    "Preprocessing Image", 
    "Detecting Plate Region",
    "Character Segmentation",
    "OCR Recognition",
    "Validation Complete"
  ];

  const generateRealisticPlate = () => {
    const states = ["DL", "MH", "UP", "GJ", "KA", "TN", "AP"];
    const state = states[Math.floor(Math.random() * states.length)];
    const numbers = Math.floor(10 + Math.random() * 89);
    const letters = String.fromCharCode(65 + Math.floor(Math.random() * 26)) + 
                   String.fromCharCode(65 + Math.floor(Math.random() * 26));
    const digits = Math.floor(1000 + Math.random() * 9000);
    return `${state}-${numbers}-${letters}-${digits}`;
  };

  // Simulate camera feed with moving vehicles
  useEffect(() => {
    if (!canvasRef.current || !isRecording) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let vehicleX = -100;

    const animate = () => {
      // Clear canvas
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw road
      ctx.fillStyle = '#374151';
      ctx.fillRect(0, canvas.height * 0.7, canvas.width, canvas.height * 0.3);

      // Draw lane lines
      ctx.strokeStyle = '#ffffff';
      ctx.setLineDash([20, 10]);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, canvas.height * 0.8);
      ctx.lineTo(canvas.width, canvas.height * 0.8);
      ctx.stroke();

      // Draw moving vehicle
      vehicleX += 2;
      if (vehicleX > canvas.width + 100) vehicleX = -100;

      ctx.fillStyle = '#3b82f6';
      ctx.fillRect(vehicleX, canvas.height * 0.73, 80, 40);
      
      // Draw license plate
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(vehicleX + 15, canvas.height * 0.78, 50, 12);
      ctx.fillStyle = '#000000';
      ctx.font = '8px monospace';
      ctx.fillText('DL-01-AB-1234', vehicleX + 17, canvas.height * 0.785);

      // Detection box when vehicle is in center
      if (vehicleX > canvas.width * 0.4 && vehicleX < canvas.width * 0.6) {
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 2;
        ctx.setLineDash([]);
        ctx.strokeRect(vehicleX + 15, canvas.height * 0.78, 50, 12);
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [isRecording]);

  useEffect(() => {
    if (!isRecording) return;

    const interval = setInterval(() => {
      // Update frame rate
      setFrameRate(28 + Math.floor(Math.random() * 5));
      
      // Update detected vehicles count
      setDetectedVehicles(prev => prev + Math.floor(Math.random() * 3));

      // Simulate ANPR processing
      const stepIndex = Math.floor(Math.random() * processingSteps.length);
      setProcessingStep(processingSteps[stepIndex]);

      // Simulate plate detection with higher frequency
      if (Math.random() > 0.6) {
        const mockPlate = generateRealisticPlate();
        setDetectedPlate(mockPlate);
        setConfidence(Math.floor(88 + Math.random() * 12));
        
        setTimeout(() => {
          setDetectedPlate(null);
          setProcessingStep("Idle");
        }, 4000);
      }
    }, 1500);

    return () => clearInterval(interval);
  }, [isRecording]);

  return (
    <div className="space-y-6">
      {/* Main Feed */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center">
              <Camera className="w-5 h-5 mr-2" />
              Live Camera Feed - CAM-02
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Badge variant={isRecording ? "default" : "secondary"} className="bg-red-500/20 text-red-400 border-red-500/30">
                {isRecording ? "LIVE" : "PAUSED"}
              </Badge>
              <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
                {frameRate} FPS
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsRecording(!isRecording)}
              >
                {isRecording ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative aspect-video bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg overflow-hidden">
            <canvas
              ref={canvasRef}
              width={800}
              height={450}
              className="w-full h-full"
            />
            
            {/* Camera info overlay */}
            <div className="absolute top-4 left-4 space-y-1">
              <div className="text-white text-sm font-mono bg-black/50 px-2 py-1 rounded">
                CAM-02 • Highway Junction • 1920x1080
              </div>
              <div className="text-white text-sm font-mono bg-black/50 px-2 py-1 rounded flex items-center">
                <MapPin className="w-3 h-3 mr-1" />
                {currentLocation.lat}, {currentLocation.lng}
              </div>
            </div>
            
            <div className="absolute top-4 right-4 space-y-1">
              <div className="text-white text-sm bg-black/50 px-2 py-1 rounded">
                {new Date().toLocaleTimeString()}
              </div>
              <div className="text-white text-sm bg-black/50 px-2 py-1 rounded flex items-center">
                <Cpu className="w-3 h-3 mr-1" />
                Vehicles: {detectedVehicles}
              </div>
            </div>

            {/* Plate detection overlay */}
            {detectedPlate && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-green-500/20 border-2 border-green-500 rounded-lg p-6 backdrop-blur-sm animate-pulse">
                  <div className="text-green-400 text-sm mb-2 flex items-center">
                    <Zap className="w-4 h-4 mr-1" />
                    Plate Detected
                  </div>
                  <div className="text-white text-2xl font-mono font-bold">{detectedPlate}</div>
                  <div className="text-green-400 text-sm mt-2">Confidence: {confidence}%</div>
                  <div className="text-blue-400 text-xs mt-1">Processing vehicle details...</div>
                </div>
              </div>
            )}

            {/* Processing indicator */}
            <div className="absolute bottom-4 left-4 bg-blue-500/20 border border-blue-500/30 rounded px-3 py-2">
              <div className="flex items-center text-blue-400 text-sm">
                <RotateCw className="w-3 h-3 mr-2 animate-spin" />
                {processingStep}
              </div>
            </div>

            {/* Performance metrics */}
            <div className="absolute bottom-4 right-4 space-y-1">
              <div className="bg-black/50 text-white text-xs px-2 py-1 rounded flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                Latency: {Math.floor(15 + Math.random() * 10)}ms
              </div>
              <div className="bg-black/50 text-white text-xs px-2 py-1 rounded">
                Quality: {Math.floor(92 + Math.random() * 8)}%
              </div>
            </div>
          </div>

          {/* Enhanced Processing Pipeline */}
          <div className="mt-4 p-4 bg-slate-700/30 rounded-lg">
            <div className="text-white text-sm font-semibold mb-3">Real-time ANPR Processing Pipeline</div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {processingSteps.map((step, index) => (
                <div 
                  key={step}
                  className={`p-3 rounded text-xs text-center transition-all ${
                    processingStep === step 
                      ? "bg-blue-500/30 text-blue-400 border border-blue-500/50 scale-105" 
                      : "bg-slate-600/30 text-slate-400"
                  }`}
                >
                  <div className="font-semibold">{step}</div>
                  {processingStep === step && (
                    <div className="text-xs mt-1 text-blue-300">Active</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Camera Grid */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Live Camera Network Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockCameras.map((camera) => (
              <div 
                key={camera.id}
                className="p-4 bg-slate-700/30 rounded-lg border border-slate-600/50 hover:border-blue-500/50 transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="font-mono text-white font-semibold">{camera.id}</div>
                  <Badge 
                    variant={camera.status === "active" ? "default" : "secondary"}
                    className={camera.status === "active" ? "bg-green-500/20 text-green-400 border-green-500/30" : ""}
                  >
                    {camera.status}
                  </Badge>
                </div>
                <div className="text-slate-400 text-sm mb-2">{camera.location}</div>
                <div className="grid grid-cols-2 gap-2 text-xs">
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
  );
};

export default LiveFeed;
