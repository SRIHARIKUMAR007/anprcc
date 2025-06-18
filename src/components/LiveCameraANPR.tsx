
import { useState, useCallback, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Camera, 
  Video, 
  Square, 
  Play,
  Upload, 
  Zap, 
  CheckCircle, 
  AlertCircle,
  Activity,
  Database,
  Radio,
  Eye
} from "lucide-react";
import { useDropzone } from 'react-dropzone';
import { useSupabaseBackend } from '@/hooks/useSupabaseBackend';
import { toast } from 'sonner';

const LiveCameraANPR = () => {
  const [isLiveMode, setIsLiveMode] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [processingResult, setProcessingResult] = useState<any>(null);
  const [liveDetections, setLiveDetections] = useState<Array<{
    id: string;
    plate: string;
    confidence: number;
    timestamp: Date;
  }>>([]);
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const { processImage, logDetection, isConnected } = useSupabaseBackend();

  // Start live camera feed
  const startLiveCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'environment' // Use back camera on mobile
        } 
      });
      setVideoStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsLiveMode(true);
      toast.success("Live camera started successfully!");
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast.error("Could not access camera. Please check permissions.");
    }
  };

  // Stop live camera feed
  const stopLiveCamera = () => {
    if (videoStream) {
      videoStream.getTracks().forEach(track => track.stop());
      setVideoStream(null);
    }
    setIsLiveMode(false);
    toast.info("Live camera stopped");
  };

  // Capture frame from live video for processing
  const captureFrame = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current || !isLiveMode) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    if (!context) return;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0);
    
    // Convert canvas to blob for processing
    canvas.toBlob(async (blob) => {
      if (!blob) return;
      
      setIsProcessing(true);
      try {
        const file = new File([blob], 'live-capture.jpg', { type: 'image/jpeg' });
        const result = await processImage(file);
        
        if (result.success && result.results && result.results.length > 0) {
          const detection = result.results[0];
          const newDetection = {
            id: Date.now().toString(),
            plate: detection.plate_number,
            confidence: detection.confidence,
            timestamp: new Date()
          };
          
          setLiveDetections(prev => [newDetection, ...prev.slice(0, 9)]);
          
          // Log to database
          await logDetection({
            plate_number: detection.plate_number,
            camera_id: 'LIVE-CAM',
            confidence: detection.confidence,
            location: 'Live Camera Feed'
          });
          
          toast.success(`Detected: ${detection.plate_number} (${detection.confidence.toFixed(1)}%)`);
        }
      } catch (error) {
        console.error('Live processing error:', error);
        toast.error('Failed to process live frame');
      } finally {
        setIsProcessing(false);
      }
    }, 'image/jpeg', 0.8);
  }, [isLiveMode, processImage, logDetection]);

  // Auto-capture frames when live mode is active
  useEffect(() => {
    if (!isLiveMode || isProcessing) return;
    
    const interval = setInterval(captureFrame, 3000); // Process every 3 seconds
    return () => clearInterval(interval);
  }, [isLiveMode, isProcessing, captureFrame]);

  // Handle image upload for static processing
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // Display image preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Process image
    setIsProcessing(true);
    try {
      const result = await processImage(file);
      setProcessingResult(result);
      
      if (result.success && result.results && result.results.length > 0) {
        const firstResult = result.results[0];
        await logDetection({
          plate_number: firstResult.plate_number,
          camera_id: 'UPLOAD',
          confidence: firstResult.confidence,
          location: 'Image Upload'
        });
        
        toast.success(`Processed: ${firstResult.plate_number} (${firstResult.confidence.toFixed(1)}%)`);
      } else {
        toast.info("No license plates detected in image");
      }
    } catch (error) {
      toast.error("Failed to process image");
    } finally {
      setIsProcessing(false);
    }
  }, [processImage, logDetection]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.bmp']
    },
    multiple: false
  });

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Header */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-white flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Camera className="w-5 h-5 lg:w-6 lg:h-6 text-green-400" />
              <span className="text-lg lg:text-xl">Live Camera ANPR System</span>
              <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
                TAMIL NADU
              </Badge>
            </div>
            <div className="flex items-center space-x-2">
              {isConnected && (
                <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
                  <Database className="w-3 h-3 mr-1" />
                  CONNECTED
                </Badge>
              )}
              {isLiveMode && (
                <Badge variant="secondary" className="bg-red-500/20 text-red-400 border-red-500/30 animate-pulse">
                  <Radio className="w-3 h-3 mr-1" />
                  LIVE
                </Badge>
              )}
            </div>
          </CardTitle>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6">
        {/* Live Camera Feed */}
        <div className="xl:col-span-2 space-y-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                <span className="flex items-center space-x-2">
                  <Video className="w-5 h-5" />
                  <span>Live Camera Feed</span>
                </span>
                <div className="flex space-x-2">
                  {!isLiveMode ? (
                    <Button onClick={startLiveCamera} className="bg-green-600 hover:bg-green-700">
                      <Play className="w-4 h-4 mr-2" />
                      Start Camera
                    </Button>
                  ) : (
                    <Button onClick={stopLiveCamera} variant="destructive">
                      <Square className="w-4 h-4 mr-2" />
                      Stop Camera
                    </Button>
                  )}
                  <Button 
                    onClick={captureFrame} 
                    disabled={!isLiveMode || isProcessing}
                    variant="outline"
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    {isProcessing ? 'Processing...' : 'Capture & Analyze'}
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
                {isLiveMode ? (
                  <>
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />
                    <canvas
                      ref={canvasRef}
                      className="hidden"
                    />
                    {isProcessing && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <div className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
                          <Activity className="w-4 h-4 animate-spin" />
                          <span>Processing Frame...</span>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    <div className="text-center">
                      <Camera className="w-16 h-16 mx-auto mb-4" />
                      <p>Click "Start Camera" to begin live ANPR detection</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Image Upload for Static Analysis */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Upload className="w-5 h-5 mr-2" />
                Upload Image for Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                  isDragActive ? 'border-green-400 bg-green-500/10' : 'border-slate-600 hover:border-slate-500'
                }`}
              >
                <input {...getInputProps()} />
                <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-slate-300">
                  {isDragActive ? 'Drop the image here' : 'Drag & drop an image or click to select'}
                </p>
                <p className="text-slate-400 text-sm mt-1">Supports: JPEG, PNG, BMP</p>
              </div>

              {uploadedImage && (
                <div className="mt-4 space-y-3">
                  <img src={uploadedImage} alt="Uploaded" className="max-h-48 mx-auto rounded border" />
                  {processingResult && (
                    <div className="p-3 bg-slate-700/30 rounded-lg">
                      {processingResult.success && processingResult.results?.length > 0 ? (
                        <div className="text-center">
                          <CheckCircle className="w-6 h-6 text-green-400 mx-auto mb-2" />
                          <p className="text-white font-mono text-lg">{processingResult.results[0].plate_number}</p>
                          <p className="text-slate-400">Confidence: {processingResult.results[0].confidence.toFixed(1)}%</p>
                        </div>
                      ) : (
                        <div className="text-center">
                          <AlertCircle className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                          <p className="text-slate-400">No license plates detected</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Live Detections Panel */}
        <div className="space-y-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Eye className="w-5 h-5 mr-2" />
                Recent Detections
                <Badge variant="secondary" className="ml-2">
                  {liveDetections.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {liveDetections.length === 0 ? (
                  <div className="text-center py-8 text-slate-400">
                    <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                    <p>No detections yet</p>
                    <p className="text-sm">Start live camera or upload an image</p>
                  </div>
                ) : (
                  liveDetections.map((detection) => (
                    <div key={detection.id} className="p-3 bg-slate-700/30 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-mono text-white font-bold">{detection.plate}</div>
                          <div className="text-xs text-slate-400">
                            {detection.timestamp.toLocaleTimeString()}
                          </div>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {detection.confidence.toFixed(1)}%
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Processing Status */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Activity className="w-5 h-5 mr-2" />
                System Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-400">Camera Status:</span>
                <Badge variant={isLiveMode ? "default" : "secondary"}>
                  {isLiveMode ? "Active" : "Inactive"}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Processing:</span>
                <Badge variant={isProcessing ? "default" : "secondary"}>
                  {isProcessing ? "Running" : "Idle"}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Backend:</span>
                <Badge variant={isConnected ? "default" : "destructive"}>
                  {isConnected ? "Connected" : "Offline"}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Total Detections:</span>
                <span className="text-white font-bold">{liveDetections.length}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LiveCameraANPR;
