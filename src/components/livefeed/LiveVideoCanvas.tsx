
import { useRef, useEffect, useState } from "react";
import { MapPin, Cpu, Clock, Zap, AlertTriangle, Activity } from "lucide-react";
import DetectionOverlay from "./DetectionOverlay";
import { LiveFeedCamera } from "@/types/camera";

interface LiveVideoCanvasProps {
  isRecording: boolean;
  isFullscreen: boolean;
  currentCamera: LiveFeedCamera | undefined;
  frameRate: number;
  vehicleCount: number;
  detectedPlate: string | null;
  confidence: number;
  processingStep: string;
  onVehicleCountUpdate: (count: number) => void;
}

const LiveVideoCanvas = ({
  isRecording,
  isFullscreen,
  currentCamera,
  frameRate,
  vehicleCount,
  detectedPlate,
  confidence,
  processingStep,
  onVehicleCountUpdate
}: LiveVideoCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const vehiclePositions = useRef<Array<{x: number, speed: number, plateNumber: string, color: string, lane: number, type: string}>>([]);
  const [networkLatency, setNetworkLatency] = useState(12);
  const [fps, setFps] = useState(frameRate);
  const [processingLoad, setProcessingLoad] = useState(45);
  const [isAlert, setIsAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [timestamp, setTimestamp] = useState(new Date());

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

  // Real-time metrics updates
  useEffect(() => {
    if (!isRecording) return;

    const metricsInterval = setInterval(() => {
      setNetworkLatency(8 + Math.random() * 20);
      setFps(frameRate - 2 + Math.random() * 4);
      setProcessingLoad(35 + Math.random() * 30);
      setTimestamp(new Date());

      // Random alerts
      if (Math.random() > 0.97) {
        setIsAlert(true);
        const alerts = [
          "Overspeeding detected",
          "Suspicious vehicle behavior",
          "License plate mismatch",
          "Vehicle entering restricted zone"
        ];
        setAlertMessage(alerts[Math.floor(Math.random() * alerts.length)]);
        setTimeout(() => setIsAlert(false), 3000);
      }
    }, 1000);

    return () => clearInterval(metricsInterval);
  }, [isRecording, frameRate]);

  useEffect(() => {
    if (!canvasRef.current || !isRecording || !currentCamera || currentCamera.status !== 'active') return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    // Initialize vehicles with more variety
    if (vehiclePositions.current.length === 0) {
      const vehicleTypes = ['car', 'truck', 'bus', 'motorcycle'];
      for (let i = 0; i < (currentCamera?.vehicles || 5); i++) {
        vehiclePositions.current.push({
          x: Math.random() * (canvas.width + 200) - 100,
          speed: 0.5 + Math.random() * 2.5,
          plateNumber: generateRealisticPlate(),
          color: `hsl(${Math.random() * 360}, 70%, 50%)`,
          lane: Math.floor(Math.random() * 3),
          type: vehicleTypes[Math.floor(Math.random() * vehicleTypes.length)]
        });
      }
    }

    const animate = () => {
      // Clear canvas with gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#0f172a');
      gradient.addColorStop(0.6, '#1e293b');
      gradient.addColorStop(1, '#334155');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw road with enhanced markings
      ctx.fillStyle = '#374151';
      ctx.fillRect(0, canvas.height * 0.6, canvas.width, canvas.height * 0.4);

      // Draw lane markings with animation
      ctx.strokeStyle = '#ffffff';
      ctx.setLineDash([15, 10]);
      ctx.lineWidth = 2;
      
      // Multiple lanes
      for (let i = 1; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(0, canvas.height * (0.6 + i * 0.1));
        ctx.lineTo(canvas.width, canvas.height * (0.6 + i * 0.1));
        ctx.stroke();
      }

      // Draw road borders
      ctx.setLineDash([]);
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#facc15';
      ctx.beginPath();
      ctx.moveTo(0, canvas.height * 0.6);
      ctx.lineTo(canvas.width, canvas.height * 0.6);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(0, canvas.height);
      ctx.lineTo(canvas.width, canvas.height);
      ctx.stroke();

      // Animate vehicles with more realistic movement
      vehiclePositions.current.forEach((vehicle, index) => {
        vehicle.x += vehicle.speed;
        
        if (vehicle.x > canvas.width + 120) {
          vehicle.x = -120;
          vehicle.plateNumber = generateRealisticPlate();
          vehicle.color = `hsl(${Math.random() * 360}, 70%, 50%)`;
          vehicle.lane = Math.floor(Math.random() * 3);
        }

        const laneY = canvas.height * (0.62 + vehicle.lane * 0.12);
        
        // Draw vehicle based on type
        let vehicleWidth = 80;
        let vehicleHeight = 25;
        
        if (vehicle.type === 'truck') {
          vehicleWidth = 120;
          vehicleHeight = 35;
        } else if (vehicle.type === 'bus') {
          vehicleWidth = 140;
          vehicleHeight = 40;
        } else if (vehicle.type === 'motorcycle') {
          vehicleWidth = 40;
          vehicleHeight = 15;
        }
        
        // Vehicle body
        ctx.fillStyle = vehicle.color;
        ctx.fillRect(vehicle.x, laneY, vehicleWidth, vehicleHeight);
        
        // Vehicle windows
        ctx.fillStyle = '#87ceeb';
        ctx.fillRect(vehicle.x + 10, laneY + 2, vehicleWidth - 20, vehicleHeight * 0.4);
        
        // License plate
        ctx.fillStyle = '#ffffff';
        const plateWidth = Math.min(50, vehicleWidth * 0.6);
        const plateHeight = 8;
        ctx.fillRect(vehicle.x + (vehicleWidth - plateWidth) / 2, laneY + vehicleHeight - 12, plateWidth, plateHeight);
        
        // Plate text
        ctx.fillStyle = '#000000';
        ctx.font = '6px monospace';
        ctx.fillText(vehicle.plateNumber, vehicle.x + (vehicleWidth - plateWidth) / 2 + 2, laneY + vehicleHeight - 6);

        // Detection zone with enhanced scanning
        const detectionZoneStart = canvas.width * 0.35;
        const detectionZoneEnd = canvas.width * 0.65;
        
        if (vehicle.x > detectionZoneStart && vehicle.x < detectionZoneEnd) {
          // Detection box
          ctx.strokeStyle = '#10b981';
          ctx.lineWidth = 2;
          ctx.setLineDash([5, 5]);
          ctx.strokeRect(vehicle.x, laneY, vehicleWidth, vehicleHeight);
          
          // Scanning animation
          const scanLineX = vehicle.x + (Date.now() % 1000) / 1000 * vehicleWidth;
          ctx.strokeStyle = '#22d3ee';
          ctx.lineWidth = 1;
          ctx.setLineDash([]);
          ctx.beginPath();
          ctx.moveTo(scanLineX, laneY);
          ctx.lineTo(scanLineX, laneY + vehicleHeight);
          ctx.stroke();
          
          // Detection info popup
          ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
          ctx.fillRect(vehicle.x, laneY - 25, vehicleWidth, 20);
          ctx.fillStyle = '#10b981';
          ctx.font = '8px monospace';
          ctx.fillText(`Scanning: ${vehicle.plateNumber}`, vehicle.x + 2, laneY - 12);
        }
      });

      // Enhanced overlay information
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.fillRect(10, 10, 300, 80);
      ctx.fillStyle = '#ffffff';
      ctx.font = '12px monospace';
      ctx.fillText(`${currentCamera.id} • ${currentCamera.location}`, 15, 25);
      ctx.fillText(`Status: ${currentCamera.status.toUpperCase()}`, 15, 40);
      ctx.fillText(`Direction: ${currentCamera.direction}`, 15, 55);
      ctx.fillText(`Vehicles: ${vehicleCount} • Active Tracking`, 15, 70);

      // Live metrics panel
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.fillRect(canvas.width - 180, 10, 170, 100);
      ctx.fillStyle = '#ffffff';
      ctx.font = '10px monospace';
      ctx.fillText(`FPS: ${fps.toFixed(1)}`, canvas.width - 175, 25);
      ctx.fillText(`Latency: ${networkLatency.toFixed(0)}ms`, canvas.width - 175, 40);
      ctx.fillText(`Processing: ${processingLoad.toFixed(0)}%`, canvas.width - 175, 55);
      ctx.fillText(`Quality: ${Math.floor(94 + Math.random() * 6)}%`, canvas.width - 175, 70);
      ctx.fillText(`Accuracy: ${Math.floor(92 + Math.random() * 8)}%`, canvas.width - 175, 85);
      ctx.fillText(`${timestamp.toLocaleTimeString()}`, canvas.width - 175, 100);

      // Alert system
      if (isAlert) {
        ctx.fillStyle = 'rgba(239, 68, 68, 0.9)';
        ctx.fillRect(canvas.width / 2 - 150, canvas.height / 2 - 25, 300, 50);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 14px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('⚠️ ALERT', canvas.width / 2, canvas.height / 2 - 5);
        ctx.font = '12px sans-serif';
        ctx.fillText(alertMessage, canvas.width / 2, canvas.height / 2 + 15);
        ctx.textAlign = 'left';
      }

      onVehicleCountUpdate(vehiclePositions.current.length);
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [isRecording, currentCamera, frameRate, onVehicleCountUpdate, fps, networkLatency, processingLoad, isAlert, alertMessage, timestamp]);

  return (
    <div className={`relative bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg overflow-hidden ${
      isFullscreen ? 'fixed inset-0 z-50 bg-black' : 'aspect-video'
    }`}>
      <canvas
        ref={canvasRef}
        width={800}
        height={450}
        className="w-full h-full"
      />
      
      {/* Enhanced live status indicators */}
      <div className="absolute top-2 left-2 lg:top-4 lg:left-4 space-y-1">
        <div className="flex items-center space-x-2 text-white text-xs lg:text-sm font-mono bg-black/70 px-2 py-1 rounded">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          <span>LIVE</span>
          <span>{currentCamera?.id}</span>
        </div>
        <div className="text-white text-xs lg:text-sm font-mono bg-black/70 px-2 py-1 rounded flex items-center">
          <MapPin className="w-3 h-3 mr-1" />
          {currentCamera?.coordinates.lat.toFixed(4)}, {currentCamera?.coordinates.lng.toFixed(4)}
        </div>
        <div className="text-white text-xs lg:text-sm font-mono bg-black/70 px-2 py-1 rounded">
          {currentCamera?.location}
        </div>
      </div>
      
      {/* Real-time metrics */}
      <div className="absolute top-2 right-2 lg:top-4 lg:right-4 space-y-1">
        <div className="text-white text-xs lg:text-sm bg-green-500/20 border border-green-500/30 px-2 py-1 rounded flex items-center">
          <Activity className="w-3 h-3 mr-1 animate-pulse" />
          {fps.toFixed(1)} FPS
        </div>
        <div className="text-white text-xs lg:text-sm bg-black/70 px-2 py-1 rounded flex items-center">
          <Zap className="w-3 h-3 mr-1" />
          {networkLatency.toFixed(0)}ms
        </div>
        <div className="text-white text-xs lg:text-sm bg-black/70 px-2 py-1 rounded flex items-center">
          <Cpu className="w-3 h-3 mr-1" />
          Load: {processingLoad.toFixed(0)}%
        </div>
      </div>

      <DetectionOverlay 
        detectedPlate={detectedPlate}
        confidence={confidence}
        processingStep={processingStep}
      />

      {/* Live timestamp */}
      <div className="absolute bottom-2 left-2 lg:bottom-4 lg:left-4">
        <div className="bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center">
          <Clock className="w-3 h-3 mr-1" />
          {timestamp.toLocaleTimeString('en-IN', { 
            timeZone: 'Asia/Kolkata',
            hour12: false 
          })} IST
        </div>
      </div>

      {/* Processing status */}
      <div className="absolute bottom-2 right-2 lg:bottom-4 lg:right-4 space-y-1">
        <div className="bg-blue-500/20 border border-blue-500/30 text-blue-400 text-xs px-2 py-1 rounded">
          Processing: {processingStep}
        </div>
        <div className="bg-black/70 text-white text-xs px-2 py-1 rounded">
          Queue: {Math.floor(Math.random() * 5) + 1} frames
        </div>
      </div>
    </div>
  );
};

export default LiveVideoCanvas;
