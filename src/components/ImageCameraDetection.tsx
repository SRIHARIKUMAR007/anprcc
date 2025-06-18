
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Camera, Square, Play, Pause, Zap, Eye } from "lucide-react";
import { toast } from "sonner";
import DetectionOverlay from "./livefeed/DetectionOverlay";

interface Detection {
  plateNumber: string;
  confidence: number;
  timestamp: string;
  location: string;
}

const ImageCameraDetection = () => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [detectedPlate, setDetectedPlate] = useState<string | null>(null);
  const [confidence, setConfidence] = useState(0);
  const [processingStep, setProcessingStep] = useState("Initialization");
  const [recentDetections, setRecentDetections] = useState<Detection[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const processingSteps = [
    "Initialization",
    "Frame Capture",
    "Preprocessing",
    "Plate Detection",
    "OCR Processing",
    "Validation",
    "Complete"
  ];

  useEffect(() => {
    checkCameraPermission();
    return () => {
      stopStream();
    };
  }, []);

  // Auto-detection simulation when streaming
  useEffect(() => {
    if (!isStreaming) return;

    const interval = setInterval(() => {
      if (Math.random() < 0.3) { // 30% chance of detection
        simulateDetection();
      }
      // Cycle through processing steps
      const currentIndex = processingSteps.indexOf(processingStep);
      const nextIndex = (currentIndex + 1) % processingSteps.length;
      setProcessingStep(processingSteps[nextIndex]);
    }, 2000);

    return () => clearInterval(interval);
  }, [isStreaming, processingStep]);

  const checkCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setHasPermission(true);
      stream.getTracks().forEach(track => track.stop());
    } catch (error) {
      setHasPermission(false);
    }
  };

  const startStream = async () => {
    try {
      setIsProcessing(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          facingMode: 'environment'
        }
      });
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setIsStreaming(true);
        toast.success("Live camera detection started!");
      }
    } catch (error) {
      console.error('Camera access error:', error);
      toast.error("Camera access denied or not available");
    } finally {
      setIsProcessing(false);
    }
  };

  const stopStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    setIsStreaming(false);
    setDetectedPlate(null);
    setConfidence(0);
    setProcessingStep("Initialization");
    toast.info("Live detection stopped");
  };

  const generateRealisticPlate = () => {
    const states = ['TN', 'DL', 'MH', 'KA', 'AP', 'WB'];
    const state = states[Math.floor(Math.random() * states.length)];
    const numbers = String(Math.floor(10 + Math.random() * 89)).padStart(2, '0');
    const letters = String.fromCharCode(65 + Math.floor(Math.random() * 26)) + 
                   String.fromCharCode(65 + Math.floor(Math.random() * 26));
    const digits = String(Math.floor(1000 + Math.random() * 9000));
    return `${state}-${numbers}-${letters}-${digits}`;
  };

  const simulateDetection = () => {
    const plateNumber = generateRealisticPlate();
    const detectionConfidence = Math.floor(85 + Math.random() * 15);
    
    setDetectedPlate(plateNumber);
    setConfidence(detectionConfidence);
    
    // Add to recent detections
    const newDetection: Detection = {
      plateNumber,
      confidence: detectionConfidence,
      timestamp: new Date().toLocaleTimeString(),
      location: "Live Camera Feed"
    };
    
    setRecentDetections(prev => [newDetection, ...prev.slice(0, 9)]);
    
    // Clear detection after 3 seconds
    setTimeout(() => {
      setDetectedPlate(null);
      setConfidence(0);
    }, 3000);
  };

  const captureFrame = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const video = videoRef.current;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    if (context) {
      context.drawImage(video, 0, 0);
      
      // Simulate processing the captured frame
      toast.info("Processing captured frame...");
      setTimeout(() => {
        simulateDetection();
      }, 1000);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Camera className="w-5 h-5" />
              <span>Live Camera ANPR Detection</span>
              {isStreaming && (
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30 animate-pulse">
                  LIVE
                </Badge>
              )}
            </div>
            <div className="flex items-center space-x-2">
              {hasPermission ? (
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                  <Eye className="w-3 h-3 mr-1" />
                  Camera Ready
                </Badge>
              ) : (
                <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                  No Camera Access
                </Badge>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative bg-black rounded-lg overflow-hidden" style={{ aspectRatio: '16/9' }}>
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              playsInline
              muted
            />
            <canvas ref={canvasRef} className="hidden" />
            
            {/* Detection Overlay */}
            <DetectionOverlay
              detectedPlate={detectedPlate}
              confidence={confidence}
              processingStep={processingStep}
            />
            
            {!isStreaming && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80">
                <div className="text-center text-white">
                  <Camera className="w-16 h-16 mx-auto mb-4 text-slate-400" />
                  <p className="text-lg mb-2">Live Camera Detection</p>
                  <p className="text-sm text-slate-400">Start streaming to detect license plates</p>
                </div>
              </div>
            )}
          </div>

          {/* Camera Controls */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            {!isStreaming ? (
              <Button
                onClick={startStream}
                disabled={!hasPermission || isProcessing}
                className="bg-green-600 hover:bg-green-700"
              >
                <Play className="w-4 h-4 mr-2" />
                {isProcessing ? "Starting..." : "Start Live Detection"}
              </Button>
            ) : (
              <>
                <Button
                  onClick={stopStream}
                  variant="destructive"
                  className="bg-red-600 hover:bg-red-700"
                >
                  <Pause className="w-4 h-4 mr-2" />
                  Stop Detection
                </Button>
                <Button
                  onClick={captureFrame}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Square className="w-4 h-4 mr-2" />
                  Capture Frame
                </Button>
              </>
            )}
          </div>

          {/* Processing Status */}
          {isStreaming && (
            <div className="bg-slate-700/30 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-semibold">Processing Status</span>
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                  <Zap className="w-3 h-3 mr-1" />
                  {processingStep}
                </Badge>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-green-400 font-bold">98%</div>
                  <div className="text-xs text-slate-400">Detection Rate</div>
                </div>
                <div>
                  <div className="text-blue-400 font-bold">30 FPS</div>
                  <div className="text-xs text-slate-400">Processing Speed</div>
                </div>
                <div>
                  <div className="text-yellow-400 font-bold">{recentDetections.length}</div>
                  <div className="text-xs text-slate-400">Total Detections</div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Detections */}
      {recentDetections.length > 0 && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white text-lg">Recent Live Detections</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {recentDetections.map((detection, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="font-mono text-white font-bold">{detection.plateNumber}</span>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                      {detection.confidence}%
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div className="text-slate-400 text-sm">{detection.timestamp}</div>
                    <div className="text-slate-500 text-xs">{detection.location}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ImageCameraDetection;
