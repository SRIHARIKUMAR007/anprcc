
import { useRef, useEffect, useState, useCallback } from "react";
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
  y: number;
  speed: number;
  plateNumber: string;
  color: string;
  lane: number;
  type: string;
  id: string;
  direction: 'left' | 'right';
  size: { width: number; height: number };
  lastDetectionTime: number;
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
  const audioContextRef = useRef<AudioContext | null>(null);
  const lastVehicleCountRef = useRef<number>(0);
  const [networkLatency, setNetworkLatency] = useState(12);
  const [fps, setFps] = useState(frameRate);
  const [processingLoad, setProcessingLoad] = useState(45);
  const [isAlert, setIsAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [timestamp, setTimestamp] = useState(new Date());

  // Throttled vehicle count update to prevent infinite loops
  const throttledVehicleCountUpdate = useCallback((count: number) => {
    if (lastVehicleCountRef.current !== count) {
      lastVehicleCountRef.current = count;
      onVehicleCountUpdate(count);
    }
  }, [onVehicleCountUpdate]);

  // Initialize audio context
  useEffect(() => {
    if (typeof window !== 'undefined' && !audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }, []);

  // Play detection sound
  const playDetectionSound = useCallback((frequency: number = 800, duration: number = 200) => {
    if (!audioContextRef.current || !isRecording) return;
    
    try {
      const oscillator = audioContextRef.current.createOscillator();
      const gainNode = audioContextRef.current.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);
      
      oscillator.frequency.setValueAtTime(frequency, audioContextRef.current.currentTime);
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.05, audioContextRef.current.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + duration / 1000);
      
      oscillator.start(audioContextRef.current.currentTime);
      oscillator.stop(audioContextRef.current.currentTime + duration / 1000);
    } catch (error) {
      console.log('Audio not available');
    }
  }, [isRecording]);

  // Generate unique camera-specific plates
  const generateCameraSpecificPlate = useCallback((cameraId: string) => {
    const cameraPatterns = {
      'CAM-01': { states: ['TN-01', 'TN-09', 'TN-33'], suffix: 'A' },
      'CAM-02': { states: ['KA-05', 'KA-09', 'AP-16'], suffix: 'B' },
      'CAM-03': { states: ['TN-45', 'TN-67', 'MH-12'], suffix: 'C' },
      'CAM-04': { states: ['DL-08', 'UP-16', 'HR-26'], suffix: 'D' },
      'CAM-05': { states: ['TN-72', 'TN-38', 'WB-19'], suffix: 'E' },
      'CAM-06': { states: ['GJ-15', 'RJ-27', 'PB-03'], suffix: 'F' },
      'CAM-07': { states: ['TN-55', 'TN-02', 'OR-07'], suffix: 'G' },
      'CAM-08': { states: ['MP-09', 'CG-04', 'JH-05'], suffix: 'H' }
    };
    
    const pattern = cameraPatterns[cameraId as keyof typeof cameraPatterns] || cameraPatterns['CAM-01'];
    const state = pattern.states[Math.floor(Math.random() * pattern.states.length)];
    const letters = String.fromCharCode(65 + Math.floor(Math.random() * 26)) + 
                   String.fromCharCode(65 + Math.floor(Math.random() * 26));
    const digits = String(Math.floor(1000 + Math.random() * 9000));
    return `${state} ${letters} ${digits}${pattern.suffix}`;
  }, []);

  // Enhanced camera-specific configurations
  const getCameraConfig = useCallback((cameraId: string) => {
    const configs = {
      'CAM-01': { 
        vehicleCount: 8, 
        speedRange: [3.5, 5.2], 
        vehicleTypes: ['car', 'truck', 'bus', 'motorcycle'],
        trafficDensity: 'high',
        direction: 'bidirectional',
        laneCount: 4,
        roadColor: '#374151',
        environment: 'highway'
      },
      'CAM-02': { 
        vehicleCount: 5, 
        speedRange: [2.8, 4.5], 
        vehicleTypes: ['car', 'motorcycle', 'auto'],
        trafficDensity: 'medium',
        direction: 'left-to-right',
        laneCount: 3,
        roadColor: '#4b5563',
        environment: 'city'
      },
      'CAM-03': { 
        vehicleCount: 12, 
        speedRange: [1.8, 3.2], 
        vehicleTypes: ['car', 'truck', 'bus', 'motorcycle', 'auto'],
        trafficDensity: 'very-high',
        direction: 'bidirectional',
        laneCount: 6,
        roadColor: '#374151',
        environment: 'toll-plaza'
      },
      'CAM-04': { 
        vehicleCount: 3, 
        speedRange: [4.2, 6.5], 
        vehicleTypes: ['car', 'truck'],
        trafficDensity: 'low',
        direction: 'right-to-left',
        laneCount: 2,
        roadColor: '#6b7280',
        environment: 'rural'
      },
      'CAM-05': { 
        vehicleCount: 9, 
        speedRange: [2.5, 4.2], 
        vehicleTypes: ['car', 'bus', 'motorcycle', 'auto'],
        trafficDensity: 'high',
        direction: 'left-to-right',
        laneCount: 4,
        roadColor: '#374151',
        environment: 'commercial'
      },
      'CAM-06': { 
        vehicleCount: 6, 
        speedRange: [3.0, 5.0], 
        vehicleTypes: ['car', 'truck', 'motorcycle'],
        trafficDensity: 'medium',
        direction: 'bidirectional',
        laneCount: 3,
        roadColor: '#4b5563',
        environment: 'suburban'
      },
      'CAM-07': { 
        vehicleCount: 4, 
        speedRange: [3.8, 5.8], 
        vehicleTypes: ['car', 'motorcycle'],
        trafficDensity: 'medium-low',
        direction: 'right-to-left',
        laneCount: 2,
        roadColor: '#6b7280',
        environment: 'residential'
      },
      'CAM-08': { 
        vehicleCount: 10, 
        speedRange: [3.2, 4.8], 
        vehicleTypes: ['car', 'truck', 'bus'],
        trafficDensity: 'high',
        direction: 'left-to-right',
        laneCount: 5,
        roadColor: '#374151',
        environment: 'expressway'
      }
    };
    
    return configs[cameraId as keyof typeof configs] || configs['CAM-01'];
  }, []);

  // Get vehicle specifications
  const getVehicleSpecs = useCallback((type: string) => {
    const specs = {
      'car': { width: 65, height: 28, color: () => `hsl(${Math.random() * 360}, 70%, ${45 + Math.random() * 15}%)` },
      'truck': { width: 110, height: 38, color: () => `hsl(${20 + Math.random() * 40}, 60%, ${35 + Math.random() * 15}%)` },
      'bus': { width: 130, height: 42, color: () => `hsl(${200 + Math.random() * 60}, 50%, ${40 + Math.random() * 20}%)` },
      'motorcycle': { width: 35, height: 18, color: () => `hsl(${Math.random() * 360}, 80%, ${50 + Math.random() * 20}%)` },
      'auto': { width: 45, height: 22, color: () => `hsl(${40 + Math.random() * 80}, 70%, ${45 + Math.random() * 15}%)` }
    };
    return specs[type as keyof typeof specs] || specs.car;
  }, []);

  // Real-time metrics updates
  useEffect(() => {
    if (!isRecording) return;

    const metricsInterval = setInterval(() => {
      const cameraConfig = getCameraConfig(currentCamera?.id || 'CAM-01');
      const baseLatency = cameraConfig.trafficDensity === 'very-high' ? 18 : 
                         cameraConfig.trafficDensity === 'high' ? 15 : 
                         cameraConfig.trafficDensity === 'medium' ? 12 : 8;
      
      setNetworkLatency(baseLatency + Math.random() * 8);
      setFps(frameRate - 1 + Math.random() * 2);
      
      const baseLoad = cameraConfig.trafficDensity === 'very-high' ? 65 :
                      cameraConfig.trafficDensity === 'high' ? 55 : 
                      cameraConfig.trafficDensity === 'medium' ? 40 : 30;
      setProcessingLoad(baseLoad + Math.random() * 15);
      setTimestamp(new Date());

      // Camera-specific alert probability
      const alertProbability = cameraConfig.trafficDensity === 'very-high' ? 0.97 :
                              cameraConfig.trafficDensity === 'high' ? 0.985 : 0.99;
      if (Math.random() > alertProbability) {
        setIsAlert(true);
        const alerts = [
          `${currentCamera?.id}: Speed violation detected`,
          `${currentCamera?.id}: Suspicious vehicle behavior`,
          `${currentCamera?.id}: License plate verification required`,
          `${currentCamera?.id}: Traffic congestion alert`,
          `${currentCamera?.id}: Vehicle classification anomaly`
        ];
        setAlertMessage(alerts[Math.floor(Math.random() * alerts.length)]);
        
        playDetectionSound(1200, 300);
        
        setTimeout(() => setIsAlert(false), 4000);
      }
    }, 2000);

    return () => clearInterval(metricsInterval);
  }, [isRecording, frameRate, currentCamera, getCameraConfig, playDetectionSound]);

  // Main animation effect
  useEffect(() => {
    if (!canvasRef.current || !isRecording || !currentCamera || currentCamera.status !== 'active') return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    const cameraConfig = getCameraConfig(currentCamera.id);

    // Initialize vehicles for current camera
    if (vehiclePositions.current.length === 0 || 
        vehiclePositions.current[0]?.id.split('-')[0] !== currentCamera.id) {
      vehiclePositions.current = [];
      
      for (let i = 0; i < cameraConfig.vehicleCount; i++) {
        const vehicleType = cameraConfig.vehicleTypes[Math.floor(Math.random() * cameraConfig.vehicleTypes.length)];
        const specs = getVehicleSpecs(vehicleType);
        
        const direction = cameraConfig.direction === 'left-to-right' ? 'right' :
                         cameraConfig.direction === 'right-to-left' ? 'left' :
                         Math.random() > 0.5 ? 'right' : 'left';
        
        const lane = Math.floor(Math.random() * cameraConfig.laneCount);
        const startX = direction === 'right' ? -specs.width - Math.random() * 300 : 
                      canvas.width + specs.width + Math.random() * 300;
        
        vehiclePositions.current.push({
          x: startX,
          y: 0,
          speed: cameraConfig.speedRange[0] + Math.random() * (cameraConfig.speedRange[1] - cameraConfig.speedRange[0]),
          plateNumber: generateCameraSpecificPlate(currentCamera.id),
          color: specs.color(),
          lane,
          type: vehicleType,
          id: `${currentCamera.id}-${i}`,
          direction,
          size: { width: specs.width, height: specs.height },
          lastDetectionTime: 0
        });
      }
    }

    const animate = () => {
      // Enhanced gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      const cameraHue = parseInt(currentCamera.id.split('-')[1]) * 45;
      gradient.addColorStop(0, `hsl(${(220 + cameraHue) % 360}, 25%, 8%)`);
      gradient.addColorStop(0.6, `hsl(${(220 + cameraHue) % 360}, 20%, 12%)`);
      gradient.addColorStop(1, `hsl(${(220 + cameraHue) % 360}, 15%, 16%)`);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Enhanced road
      const roadHeight = canvas.height * 0.45;
      const roadY = canvas.height * 0.55;
      
      ctx.fillStyle = cameraConfig.roadColor;
      ctx.fillRect(0, roadY, canvas.width, roadHeight);

      // Lane markings
      ctx.strokeStyle = '#ffffff';
      ctx.setLineDash([15, 10]);
      ctx.lineWidth = 3;
      
      const laneHeight = roadHeight / cameraConfig.laneCount;
      for (let i = 1; i < cameraConfig.laneCount; i++) {
        ctx.beginPath();
        ctx.moveTo(0, roadY + i * laneHeight);
        ctx.lineTo(canvas.width, roadY + i * laneHeight);
        ctx.stroke();
      }

      // Road borders
      ctx.setLineDash([]);
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#facc15';
      ctx.beginPath();
      ctx.moveTo(0, roadY);
      ctx.lineTo(canvas.width, roadY);
      ctx.stroke();

      // Animate vehicles
      vehiclePositions.current.forEach((vehicle, index) => {
        const moveDirection = vehicle.direction === 'right' ? 1 : -1;
        vehicle.x += vehicle.speed * moveDirection;
        
        // Calculate lane position
        const laneHeight = roadHeight / cameraConfig.laneCount;
        vehicle.y = roadY + (vehicle.lane * laneHeight) + (laneHeight - vehicle.size.height) / 2;
        
        // Reset vehicle position
        if ((vehicle.direction === 'right' && vehicle.x > canvas.width + vehicle.size.width + 50) ||
            (vehicle.direction === 'left' && vehicle.x < -vehicle.size.width - 50)) {
          
          vehicle.x = vehicle.direction === 'right' ? 
            -vehicle.size.width - Math.random() * 200 : 
            canvas.width + vehicle.size.width + Math.random() * 200;
          
          vehicle.plateNumber = generateCameraSpecificPlate(currentCamera.id);
          const newType = cameraConfig.vehicleTypes[Math.floor(Math.random() * cameraConfig.vehicleTypes.length)];
          const newSpecs = getVehicleSpecs(newType);
          vehicle.type = newType;
          vehicle.size = { width: newSpecs.width, height: newSpecs.height };
          vehicle.color = newSpecs.color();
          vehicle.lane = Math.floor(Math.random() * cameraConfig.laneCount);
          vehicle.speed = cameraConfig.speedRange[0] + Math.random() * (cameraConfig.speedRange[1] - cameraConfig.speedRange[0]);
        }

        // Enhanced vehicle rendering with shadows
        const shadowOffset = 3;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.fillRect(vehicle.x + shadowOffset, vehicle.y + shadowOffset, vehicle.size.width, vehicle.size.height);
        
        // Vehicle body with gradient
        const vehicleGradient = ctx.createLinearGradient(vehicle.x, vehicle.y, vehicle.x, vehicle.y + vehicle.size.height);
        vehicleGradient.addColorStop(0, vehicle.color);
        vehicleGradient.addColorStop(1, vehicle.color.replace(/\d+%\)$/, '25%)'));
        ctx.fillStyle = vehicleGradient;
        ctx.fillRect(vehicle.x, vehicle.y, vehicle.size.width, vehicle.size.height);
        
        // Vehicle details
        if (vehicle.type === 'bus') {
          ctx.fillStyle = '#87ceeb';
          for (let w = 0; w < 4; w++) {
            ctx.fillRect(vehicle.x + 15 + w * 25, vehicle.y + 3, 20, vehicle.size.height * 0.4);
          }
        } else if (vehicle.type === 'truck') {
          ctx.fillStyle = '#4a5568';
          ctx.fillRect(vehicle.x + vehicle.size.width * 0.7, vehicle.y, vehicle.size.width * 0.3, vehicle.size.height);
        } else {
          ctx.fillStyle = '#87ceeb';
          ctx.fillRect(vehicle.x + 8, vehicle.y + 2, vehicle.size.width - 16, vehicle.size.height * 0.4);
        }
        
        // License plate
        ctx.fillStyle = '#ffffff';
        const plateWidth = Math.min(45, vehicle.size.width * 0.6);
        const plateHeight = 12;
        const plateX = vehicle.x + (vehicle.size.width - plateWidth) / 2;
        const plateY = vehicle.y + vehicle.size.height - 16;
        ctx.fillRect(plateX, plateY, plateWidth, plateHeight);
        
        ctx.fillStyle = '#000000';
        ctx.font = 'bold 8px monospace';
        ctx.textAlign = 'center';
        const plateText = vehicle.plateNumber.length > 10 ? 
          vehicle.plateNumber.substring(0, 10) : vehicle.plateNumber;
        ctx.fillText(plateText, plateX + plateWidth / 2, plateY + 9);
        ctx.textAlign = 'left';

        // Detection zone
        const detectionZoneStart = canvas.width * 0.3;
        const detectionZoneEnd = canvas.width * 0.7;
        
        if (vehicle.x + vehicle.size.width > detectionZoneStart && vehicle.x < detectionZoneEnd) {
          const now = Date.now();
          
          ctx.strokeStyle = '#10b981';
          ctx.lineWidth = 3;
          ctx.setLineDash([4, 4]);
          ctx.strokeRect(vehicle.x - 6, vehicle.y - 6, vehicle.size.width + 12, vehicle.size.height + 12);
          
          // Scanning animation
          const scanProgress = ((now + index * 300) % 2500) / 2500;
          const scanLineX = vehicle.x + scanProgress * vehicle.size.width;
          ctx.strokeStyle = '#22d3ee';
          ctx.lineWidth = 2;
          ctx.setLineDash([]);
          ctx.beginPath();
          ctx.moveTo(scanLineX, vehicle.y - 6);
          ctx.lineTo(scanLineX, vehicle.y + vehicle.size.height + 6);
          ctx.stroke();
          
          // Play detection sound occasionally
          if (now - vehicle.lastDetectionTime > 8000 && Math.random() > 0.985) {
            playDetectionSound(600, 150);
            vehicle.lastDetectionTime = now;
          }
          
          // Detection info overlay
          ctx.fillStyle = 'rgba(16, 185, 129, 0.9)';
          ctx.fillRect(vehicle.x, vehicle.y - 35, vehicle.size.width, 28);
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 8px monospace';
          ctx.textAlign = 'center';
          ctx.fillText(`SCAN: ${plateText.slice(0, 9)}`, vehicle.x + vehicle.size.width / 2, vehicle.y - 22);
          const confidence = 87 + Math.random() * 12;
          ctx.fillText(`${confidence.toFixed(1)}% • ${vehicle.type.toUpperCase()}`, vehicle.x + vehicle.size.width / 2, vehicle.y - 12);
          ctx.textAlign = 'left';
        }
      });

      // Camera info overlay
      ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
      ctx.fillRect(10, 10, 320, 90);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 13px monospace';
      ctx.fillText(`${currentCamera.id} • ${currentCamera.location}`, 15, 28);
      ctx.font = '11px monospace';
      ctx.fillText(`Status: ${currentCamera.status.toUpperCase()} • ${cameraConfig.direction.toUpperCase()}`, 15, 43);
      ctx.fillText(`Density: ${cameraConfig.trafficDensity.toUpperCase()} • Vehicles: ${vehiclePositions.current.length}`, 15, 58);
      ctx.fillText(`Environment: ${cameraConfig.environment.toUpperCase()}`, 15, 73);
      ctx.fillText(`Lanes: ${cameraConfig.laneCount} • Speed: ${cameraConfig.speedRange[0].toFixed(1)}-${cameraConfig.speedRange[1].toFixed(1)}`, 15, 88);

      // Metrics panel
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

      // Alert system
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

      // Update vehicle count (throttled to prevent infinite loops)
      throttledVehicleCountUpdate(vehiclePositions.current.length);
      
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [isRecording, currentCamera, frameRate, getCameraConfig, getVehicleSpecs, generateCameraSpecificPlate, playDetectionSound, throttledVehicleCountUpdate, fps, networkLatency, processingLoad, isAlert, alertMessage, timestamp]);

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
      
      {/* Live status indicators */}
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
