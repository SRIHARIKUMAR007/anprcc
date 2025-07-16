
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

interface Vehicle {
  x: number;
  speed: number;
  plateNumber: string;
  color: string;
  lane: number;
  type: string;
  id: string;
  direction: 'left' | 'right';
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
  const vehiclePositions = useRef<Vehicle[]>([]);
  const [networkLatency, setNetworkLatency] = useState(12);
  const [fps, setFps] = useState(frameRate);
  const [processingLoad, setProcessingLoad] = useState(45);
  const [isAlert, setIsAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [timestamp, setTimestamp] = useState(new Date());

  // Generate camera-specific realistic plates
  const generateCameraSpecificPlate = (cameraId: string) => {
    const cameraSeeds = {
      'CAM-01': ['TN-01', 'TN-09', 'TN-33'],
      'CAM-02': ['KA-05', 'KA-09', 'AP-16'],
      'CAM-03': ['TN-45', 'TN-67', 'MH-12'],
      'CAM-04': ['DL-08', 'UP-16', 'HR-26'],
      'CAM-05': ['TN-72', 'TN-38', 'WB-19'],
      'CAM-06': ['GJ-15', 'RJ-27', 'PB-03'],
      'CAM-07': ['TN-55', 'TN-02', 'OR-07'],
      'CAM-08': ['MP-09', 'CG-04', 'JH-05']
    };
    
    const seeds = cameraSeeds[cameraId as keyof typeof cameraSeeds] || ['TN-01', 'TN-09'];
    const state = seeds[Math.floor(Math.random() * seeds.length)];
    const letters = String.fromCharCode(65 + Math.floor(Math.random() * 26)) + 
                   String.fromCharCode(65 + Math.floor(Math.random() * 26));
    const digits = String(Math.floor(1000 + Math.random() * 9000));
    return `${state}-${letters}-${digits}`;
  };

  // Camera-specific vehicle configurations
  const getCameraConfig = (cameraId: string) => {
    const configs = {
      'CAM-01': { 
        vehicleCount: 6, 
        speedRange: [1.2, 2.8], 
        vehicleTypes: ['car', 'truck', 'bus'],
        trafficDensity: 'high',
        direction: 'bidirectional'
      },
      'CAM-02': { 
        vehicleCount: 4, 
        speedRange: [0.8, 2.2], 
        vehicleTypes: ['car', 'motorcycle'],
        trafficDensity: 'medium',
        direction: 'left-to-right'
      },
      'CAM-03': { 
        vehicleCount: 8, 
        speedRange: [0.5, 1.8], 
        vehicleTypes: ['car', 'truck', 'bus', 'motorcycle'],
        trafficDensity: 'high',
        direction: 'right-to-left'
      },
      'CAM-04': { 
        vehicleCount: 3, 
        speedRange: [1.5, 3.2], 
        vehicleTypes: ['car', 'truck'],
        trafficDensity: 'low',
        direction: 'bidirectional'
      },
      'CAM-05': { 
        vehicleCount: 7, 
        speedRange: [0.7, 2.5], 
        vehicleTypes: ['car', 'bus', 'motorcycle'],
        trafficDensity: 'high',
        direction: 'left-to-right'
      },
      'CAM-06': { 
        vehicleCount: 5, 
        speedRange: [1.0, 2.8], 
        vehicleTypes: ['car', 'truck', 'motorcycle'],
        trafficDensity: 'medium',
        direction: 'bidirectional'
      },
      'CAM-07': { 
        vehicleCount: 4, 
        speedRange: [1.8, 3.5], 
        vehicleTypes: ['car', 'motorcycle'],
        trafficDensity: 'medium',
        direction: 'right-to-left'
      },
      'CAM-08': { 
        vehicleCount: 6, 
        speedRange: [0.6, 2.0], 
        vehicleTypes: ['car', 'truck', 'bus'],
        trafficDensity: 'high',
        direction: 'left-to-right'
      }
    };
    
    return configs[cameraId as keyof typeof configs] || configs['CAM-01'];
  };

  // Real-time metrics updates with camera-specific variations
  useEffect(() => {
    if (!isRecording) return;

    const metricsInterval = setInterval(() => {
      const cameraConfig = getCameraConfig(currentCamera?.id || 'CAM-01');
      const baseLatency = cameraConfig.trafficDensity === 'high' ? 15 : 
                         cameraConfig.trafficDensity === 'medium' ? 10 : 8;
      
      setNetworkLatency(baseLatency + Math.random() * 10);
      setFps(frameRate - 1 + Math.random() * 2);
      
      const baseLoad = cameraConfig.trafficDensity === 'high' ? 50 : 
                      cameraConfig.trafficDensity === 'medium' ? 35 : 25;
      setProcessingLoad(baseLoad + Math.random() * 20);
      setTimestamp(new Date());

      // Camera-specific alert probability
      const alertProbability = cameraConfig.trafficDensity === 'high' ? 0.98 : 0.985;
      if (Math.random() > alertProbability) {
        setIsAlert(true);
        const alerts = [
          `${currentCamera?.id}: Overspeeding detected`,
          `${currentCamera?.id}: Suspicious vehicle behavior`,
          `${currentCamera?.id}: License plate verification needed`,
          `${currentCamera?.id}: Traffic congestion alert`
        ];
        setAlertMessage(alerts[Math.floor(Math.random() * alerts.length)]);
        setTimeout(() => setIsAlert(false), 3000);
      }
    }, 1000);

    return () => clearInterval(metricsInterval);
  }, [isRecording, frameRate, currentCamera]);

  useEffect(() => {
    if (!canvasRef.current || !isRecording || !currentCamera || currentCamera.status !== 'active') return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    const cameraConfig = getCameraConfig(currentCamera.id);

    // Initialize camera-specific vehicles
    if (vehiclePositions.current.length === 0 || vehiclePositions.current[0]?.id !== currentCamera.id) {
      vehiclePositions.current = [];
      for (let i = 0; i < cameraConfig.vehicleCount; i++) {
        const direction = cameraConfig.direction === 'left-to-right' ? 'right' :
                         cameraConfig.direction === 'right-to-left' ? 'left' :
                         Math.random() > 0.5 ? 'right' : 'left';
        
        vehiclePositions.current.push({
          x: Math.random() * (canvas.width + 200) - 100,
          speed: cameraConfig.speedRange[0] + Math.random() * (cameraConfig.speedRange[1] - cameraConfig.speedRange[0]),
          plateNumber: generateCameraSpecificPlate(currentCamera.id),
          color: `hsl(${Math.random() * 360}, 70%, ${45 + Math.random() * 20}%)`,
          lane: Math.floor(Math.random() * 3),
          type: cameraConfig.vehicleTypes[Math.floor(Math.random() * cameraConfig.vehicleTypes.length)],
          id: `${currentCamera.id}-${i}`,
          direction
        });
      }
    }

    const animate = () => {
      // Enhanced gradient background with camera-specific styling
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      const cameraHue = parseInt(currentCamera.id.split('-')[1]) * 30;
      gradient.addColorStop(0, `hsl(${220 + cameraHue % 60}, 25%, 8%)`);
      gradient.addColorStop(0.6, `hsl(${220 + cameraHue % 60}, 20%, 12%)`);
      gradient.addColorStop(1, `hsl(${220 + cameraHue % 60}, 15%, 18%)`);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Enhanced road with camera-specific markings
      ctx.fillStyle = '#374151';
      ctx.fillRect(0, canvas.height * 0.6, canvas.width, canvas.height * 0.4);

      // Dynamic lane markings based on traffic density
      ctx.strokeStyle = cameraConfig.trafficDensity === 'high' ? '#fbbf24' : '#ffffff';
      ctx.setLineDash([12, 8]);
      ctx.lineWidth = cameraConfig.trafficDensity === 'high' ? 3 : 2;
      
      for (let i = 1; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(0, canvas.height * (0.6 + i * 0.1));
        ctx.lineTo(canvas.width, canvas.height * (0.6 + i * 0.1));
        ctx.stroke();
      }

      // Enhanced road borders
      ctx.setLineDash([]);
      ctx.lineWidth = 3;
      ctx.strokeStyle = cameraConfig.trafficDensity === 'high' ? '#ef4444' : '#facc15';
      ctx.beginPath();
      ctx.moveTo(0, canvas.height * 0.6);
      ctx.lineTo(canvas.width, canvas.height * 0.6);
      ctx.stroke();

      // Animate vehicles with enhanced movement
      vehiclePositions.current.forEach((vehicle, index) => {
        const moveDirection = vehicle.direction === 'right' ? 1 : -1;
        vehicle.x += vehicle.speed * moveDirection;
        
        // Reset vehicle position based on direction
        if ((vehicle.direction === 'right' && vehicle.x > canvas.width + 120) ||
            (vehicle.direction === 'left' && vehicle.x < -120)) {
          vehicle.x = vehicle.direction === 'right' ? -120 : canvas.width + 120;
          vehicle.plateNumber = generateCameraSpecificPlate(currentCamera.id);
          vehicle.color = `hsl(${Math.random() * 360}, 70%, ${45 + Math.random() * 20}%)`;
          vehicle.lane = Math.floor(Math.random() * 3);
        }

        const laneY = canvas.height * (0.62 + vehicle.lane * 0.12);
        
        // Enhanced vehicle rendering
        let vehicleWidth = 80;
        let vehicleHeight = 25;
        
        switch (vehicle.type) {
          case 'truck':
            vehicleWidth = 120;
            vehicleHeight = 35;
            break;
          case 'bus':
            vehicleWidth = 140;
            vehicleHeight = 40;
            break;
          case 'motorcycle':
            vehicleWidth = 40;
            vehicleHeight = 15;
            break;
        }
        
        // Vehicle shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.fillRect(vehicle.x + 2, laneY + 2, vehicleWidth, vehicleHeight);
        
        // Vehicle body with gradient
        const vehicleGradient = ctx.createLinearGradient(vehicle.x, laneY, vehicle.x, laneY + vehicleHeight);
        vehicleGradient.addColorStop(0, vehicle.color);
        vehicleGradient.addColorStop(1, vehicle.color.replace(/\d+%\)$/, '35%)'));
        ctx.fillStyle = vehicleGradient;
        ctx.fillRect(vehicle.x, laneY, vehicleWidth, vehicleHeight);
        
        // Enhanced vehicle details
        ctx.fillStyle = '#87ceeb';
        ctx.fillRect(vehicle.x + 10, laneY + 2, vehicleWidth - 20, vehicleHeight * 0.4);
        
        // License plate with better visibility
        ctx.fillStyle = '#ffffff';
        const plateWidth = Math.min(50, vehicleWidth * 0.6);
        const plateHeight = 10;
        ctx.fillRect(vehicle.x + (vehicleWidth - plateWidth) / 2, laneY + vehicleHeight - 14, plateWidth, plateHeight);
        
        // Enhanced plate text
        ctx.fillStyle = '#000000';
        ctx.font = 'bold 7px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(
          vehicle.plateNumber, 
          vehicle.x + vehicleWidth / 2, 
          laneY + vehicleHeight - 6
        );
        ctx.textAlign = 'left';

        // Enhanced detection zone
        const detectionZoneStart = canvas.width * 0.35;
        const detectionZoneEnd = canvas.width * 0.65;
        
        if (vehicle.x > detectionZoneStart && vehicle.x < detectionZoneEnd) {
          // Multi-colored detection box
          ctx.strokeStyle = '#10b981';
          ctx.lineWidth = 2;
          ctx.setLineDash([3, 3]);
          ctx.strokeRect(vehicle.x - 5, laneY - 5, vehicleWidth + 10, vehicleHeight + 10);
          
          // Enhanced scanning animation
          const scanProgress = ((Date.now() + index * 200) % 2000) / 2000;
          const scanLineX = vehicle.x + scanProgress * vehicleWidth;
          ctx.strokeStyle = '#22d3ee';
          ctx.lineWidth = 2;
          ctx.setLineDash([]);
          ctx.beginPath();
          ctx.moveTo(scanLineX, laneY - 5);
          ctx.lineTo(scanLineX, laneY + vehicleHeight + 5);
          ctx.stroke();
          
          // Enhanced detection info
          ctx.fillStyle = 'rgba(16, 185, 129, 0.9)';
          ctx.fillRect(vehicle.x, laneY - 30, vehicleWidth, 22);
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 8px monospace';
          ctx.textAlign = 'center';
          ctx.fillText(`SCANNING: ${vehicle.plateNumber.slice(0, 8)}`, vehicle.x + vehicleWidth / 2, laneY - 16);
          ctx.fillText(`Conf: ${(85 + Math.random() * 15).toFixed(1)}%`, vehicle.x + vehicleWidth / 2, laneY - 8);
          ctx.textAlign = 'left';
        }
      });

      // Enhanced camera info overlay
      ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
      ctx.fillRect(10, 10, 320, 90);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 13px monospace';
      ctx.fillText(`${currentCamera.id} • ${currentCamera.location}`, 15, 28);
      ctx.font = '11px monospace';
      ctx.fillText(`Status: ${currentCamera.status.toUpperCase()} • ${cameraConfig.direction.toUpperCase()}`, 15, 43);
      ctx.fillText(`Density: ${cameraConfig.trafficDensity.toUpperCase()} • Vehicles: ${vehicleCount}`, 15, 58);
      ctx.fillText(`Direction: ${currentCamera.direction} • Active Tracking`, 15, 73);
      ctx.fillText(`Traffic Pattern: ${cameraConfig.trafficDensity} density`, 15, 88);

      // Enhanced metrics panel
      ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
      ctx.fillRect(canvas.width - 190, 10, 180, 110);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px monospace';
      ctx.fillText(`CAMERA METRICS`, canvas.width - 185, 25);
      ctx.font = '10px monospace';
      ctx.fillText(`FPS: ${fps.toFixed(1)}`, canvas.width - 185, 40);
      ctx.fillText(`Latency: ${networkLatency.toFixed(0)}ms`, canvas.width - 185, 55);
      ctx.fillText(`Processing: ${processingLoad.toFixed(0)}%`, canvas.width - 185, 70);
      ctx.fillText(`Quality: ${Math.floor(90 + Math.random() * 10)}%`, canvas.width - 185, 85);
      ctx.fillText(`Accuracy: ${Math.floor(88 + Math.random() * 12)}%`, canvas.width - 185, 100);
      ctx.fillText(`${timestamp.toLocaleTimeString()}`, canvas.width - 185, 115);

      // Enhanced alert system
      if (isAlert) {
        ctx.fillStyle = 'rgba(239, 68, 68, 0.95)';
        ctx.fillRect(canvas.width / 2 - 200, canvas.height / 2 - 30, 400, 60);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.strokeRect(canvas.width / 2 - 200, canvas.height / 2 - 30, 400, 60);
        
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('⚠️ ALERT', canvas.width / 2, canvas.height / 2 - 8);
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText(alertMessage, canvas.width / 2, canvas.height / 2 + 12);
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
