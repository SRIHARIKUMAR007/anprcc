
import { useRef, useEffect } from "react";
import { MapPin, Cpu, Clock } from "lucide-react";
import DetectionOverlay from "./DetectionOverlay";

interface LiveVideoCanvasProps {
  isRecording: boolean;
  isFullscreen: boolean;
  currentCamera: {
    id: string;
    location: string;
    vehicles: number;
    direction: string;
    status: string;
    coordinates: { lat: number; lng: number };
  } | undefined;
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
  const vehiclePositions = useRef<Array<{x: number, speed: number, plateNumber: string, color: string}>>([]);

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
      ctx.fillText(`${currentCamera.direction}`, 15, 40);
      ctx.fillText(`Vehicles: ${vehicleCount} • Direction: ${currentCamera.direction}`, 15, 55);

      // Performance metrics
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(canvas.width - 150, 10, 140, 45);
      ctx.fillStyle = '#ffffff';
      ctx.font = '11px monospace';
      ctx.fillText(`Processing: ${Math.floor(12 + Math.random() * 8)}ms`, canvas.width - 145, 25);
      ctx.fillText(`Quality: ${Math.floor(94 + Math.random() * 6)}%`, canvas.width - 145, 40);

      onVehicleCountUpdate(vehiclePositions.current.length);
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [isRecording, currentCamera, frameRate, onVehicleCountUpdate]);

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
      
      {/* Enhanced overlay information */}
      <div className="absolute top-2 left-2 lg:top-4 lg:left-4 space-y-1">
        <div className="text-white text-xs lg:text-sm font-mono bg-black/70 px-2 py-1 rounded">
          {currentCamera?.id} • {currentCamera?.location}
        </div>
        <div className="text-white text-xs lg:text-sm font-mono bg-black/70 px-2 py-1 rounded flex items-center">
          <MapPin className="w-3 h-3 mr-1" />
          {currentCamera?.coordinates.lat.toFixed(4)}, {currentCamera?.coordinates.lng.toFixed(4)}
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

      <DetectionOverlay 
        detectedPlate={detectedPlate}
        confidence={confidence}
        processingStep={processingStep}
      />

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
  );
};

export default LiveVideoCanvas;
