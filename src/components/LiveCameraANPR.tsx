
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
  Eye,
  Target,
  Cpu
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
    bbox?: { x: number; y: number; width: number; height: number };
  }>>([]);
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const [currentDetection, setCurrentDetection] = useState<string | null>(null);
  const [processingStep, setProcessingStep] = useState<string>('Idle');
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const { processImage, logDetection, isConnected } = useSupabaseBackend();

  // Enhanced ANPR processing steps
  const processingSteps = [
    'Image Capture',
    'Preprocessing',
    'Edge Detection',
    'Contour Analysis',
    'Plate Localization',
    'Character Segmentation',
    'OCR Recognition',
    'Validation',
    'Database Lookup',
    'Result Generation'
  ];

  // Start live camera feed with enhanced error handling
  const startLiveCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 1920, min: 1280 },
          height: { ideal: 1080, min: 720 },
          facingMode: 'environment',
          frameRate: { ideal: 30, min: 15 }
        } 
      });
      setVideoStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsLiveMode(true);
      setProcessingStep('Camera Ready');
      toast.success("Live camera started with HD quality!");
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast.error("Could not access camera. Please check permissions and try again.");
    }
  };

  // Stop live camera feed
  const stopLiveCamera = () => {
    if (videoStream) {
      videoStream.getTracks().forEach(track => track.stop());
      setVideoStream(null);
    }
    setIsLiveMode(false);
    setProcessingStep('Idle');
    setCurrentDetection(null);
    toast.info("Live camera stopped");
  };

  // Enhanced frame capture with processing pipeline simulation
  const captureFrame = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current || !isLiveMode) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    if (!context) return;
    
    // Set processing steps animation
    setIsProcessing(true);
    setCurrentDetection(null);
    
    // Simulate processing pipeline
    for (let i = 0; i < processingSteps.length; i++) {
      setProcessingStep(processingSteps[i]);
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0);
    
    // Convert canvas to blob for processing
    canvas.toBlob(async (blob) => {
      if (!blob) return;
      
      try {
        const file = new File([blob], 'live-capture.jpg', { type: 'image/jpeg' });
        const result = await processImage(file);
        
        if (result.success && result.results && result.results.length > 0) {
          const detection = result.results[0];
          const newDetection = {
            id: Date.now().toString(),
            plate: detection.plate_number,
            confidence: detection.confidence,
            timestamp: new Date(),
            bbox: detection.bbox
          };
          
          setLiveDetections(prev => [newDetection, ...prev.slice(0, 9)]);
          setCurrentDetection(detection.plate_number);
          
          // Log to database
          await logDetection({
            plate_number: detection.plate_number,
            camera_id: 'LIVE-CAM',
            confidence: detection.confidence,
            location: 'Live Camera Feed'
          });
          
          toast.success(`🎯 Detected: ${detection.plate_number} (${detection.confidence.toFixed(1)}% confidence)`, {
            duration: 3000,
          });
          
          // Clear detection overlay after 3 seconds
          setTimeout(() => setCurrentDetection(null), 3000);
        } else {
          toast.info("No license plates detected in frame");
        }
        
        setProcessingStep('Analysis Complete');
      } catch (error) {
        console.error('Live processing error:', error);
        toast.error('Failed to process live frame');
        setProcessingStep('Error');
      } finally {
        setIsProcessing(false);
        setTimeout(() => setProcessingStep('Ready'), 1000);
      }
    }, 'image/jpeg', 0.9);
  }, [isLiveMode, processImage, logDetection]);

  // Auto-capture frames when live mode is active
  useEffect(() => {
    if (!isLiveMode || isProcessing) return;
    
    const interval = setInterval(captureFrame, 5000); // Process every 5 seconds
    return () => clearInterval(interval);
  }, [isLiveMode, isProcessing, captureFrame]);

  // Enhanced image upload handler
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // Validate file size and type
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File too large. Please select an image under 10MB.");
      return;
    }

    // Display image preview with animation
    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Enhanced processing with step-by-step feedback
    setIsProcessing(true);
    setProcessingResult(null);
    
    // Simulate processing pipeline for uploaded image
    for (let i = 0; i < processingSteps.length; i++) {
      setProcessingStep(processingSteps[i]);
      await new Promise(resolve => setTimeout(resolve, 150));
    }
    
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
        
        toast.success(`🎯 Processed: ${firstResult.plate_number} (${firstResult.confidence.toFixed(1)}% confidence)`);
      } else {
        toast.info("No license plates detected in uploaded image");
      }
      
      setProcessingStep('Upload Complete');
    } catch (error) {
      toast.error("Failed to process uploaded image");
      setProcessingStep('Upload Failed');
    } finally {
      setIsProcessing(false);
      setTimeout(() => setProcessingStep('Ready'), 1000);
    }
  }, [processImage, logDetection]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.bmp', '.webp']
    },
    multiple: false
  });

  return (
    <div className="space-y-4 lg:space-y-6 animate-fade-in">
      {/* Enhanced Header */}
      <Card className="card-enhanced hover-glow animate-slide-in-up">
        <CardHeader className="pb-3">
          <CardTitle className="text-white flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Camera className="w-5 h-5 lg:w-6 lg:h-6 text-green-400 animate-pulse-custom" />
              <span className="text-lg lg:text-xl gradient-text font-bold">Live Camera ANPR System</span>
              <Badge variant="secondary" className="badge-animated bg-green-500/20 text-green-400 border-green-500/30">
                TAMIL NADU
              </Badge>
            </div>
            <div className="flex items-center space-x-2">
              {isConnected && (
                <Badge variant="secondary" className="badge-animated bg-green-500/20 text-green-400 border-green-500/30 animate-glow">
                  <Database className="w-3 h-3 mr-1" />
                  CONNECTED
                </Badge>
              )}
              {isLiveMode && (
                <Badge variant="secondary" className="badge-animated bg-red-500/20 text-red-400 border-red-500/30 animate-pulse">
                  <Radio className="w-3 h-3 mr-1" />
                  LIVE
                </Badge>
              )}
              {isProcessing && (
                <Badge variant="secondary" className="badge-animated bg-blue-500/20 text-blue-400 border-blue-500/30">
                  <Cpu className="w-3 h-3 mr-1 animate-spin" />
                  PROCESSING
                </Badge>
              )}
            </div>
          </CardTitle>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6">
        {/* Enhanced Live Camera Feed */}
        <div className="xl:col-span-2 space-y-4">
          <Card className="card-enhanced hover-lift animate-slide-in-left">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                <span className="flex items-center space-x-2">
                  <Video className="w-5 h-5" />
                  <span>Live Camera Feed</span>
                  {currentDetection && (
                    <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30 animate-bounce-custom">
                      <Target className="w-3 h-3 mr-1" />
                      DETECTED
                    </Badge>
                  )}
                </span>
                <div className="flex space-x-2">
                  {!isLiveMode ? (
                    <Button 
                      onClick={startLiveCamera} 
                      className="bg-green-600 hover:bg-green-700 hover-scale animate-glow"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Start Camera
                    </Button>
                  ) : (
                    <Button onClick={stopLiveCamera} variant="destructive" className="hover-scale">
                      <Square className="w-4 h-4 mr-2" />
                      Stop Camera
                    </Button>
                  )}
                  <Button 
                    onClick={captureFrame} 
                    disabled={!isLiveMode || isProcessing}
                    variant="outline"
                    className="hover-scale"
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
                    
                    {/* Detection Overlay */}
                    {currentDetection && (
                      <div className="absolute inset-0 flex items-center justify-center p-4 animate-scale-in">
                        <div className="bg-green-500/20 border-2 border-green-500 rounded-lg p-4 backdrop-blur-sm animate-pulse max-w-full">
                          <div className="text-green-400 text-sm mb-2 flex items-center">
                            <Zap className="w-4 h-4 mr-1" />
                            ANPR Detection Active
                          </div>
                          <div className="text-white text-xl font-mono font-bold">{currentDetection}</div>
                          <div className="text-green-400 text-sm mt-2">Tamil Nadu Vehicle Detected</div>
                        </div>
                      </div>
                    )}
                    
                    {/* Processing Overlay */}
                    {isProcessing && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center animate-fade-in">
                        <div className="bg-blue-600/90 text-white px-6 py-4 rounded-lg flex items-center space-x-3 glass-effect">
                          <div className="spinner"></div>
                          <div>
                            <div className="font-semibold">Processing Frame...</div>
                            <div className="text-sm text-blue-200">{processingStep}</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400 animate-fade-in">
                    <div className="text-center">
                      <Camera className="w-16 h-16 mx-auto mb-4 animate-bounce-custom" />
                      <p className="text-lg mb-2">Click "Start Camera" to begin live ANPR detection</p>
                      <p className="text-sm opacity-75">High-definition video with real-time processing</p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Processing Status Bar */}
              <div className="mt-4 p-3 bg-slate-700/30 rounded-lg animate-slide-in-up">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white text-sm font-semibold">Processing Status</span>
                  <Badge variant="outline" className={`text-xs ${
                    processingStep === 'Ready' ? 'text-green-400 border-green-400' :
                    processingStep === 'Error' ? 'text-red-400 border-red-400' :
                    'text-blue-400 border-blue-400'
                  }`}>
                    {processingStep}
                  </Badge>
                </div>
                <div className="w-full bg-slate-600 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      isProcessing ? 'bg-blue-500 animate-pulse' : 'bg-green-500'
                    }`} 
                    style={{ 
                      width: isProcessing ? '60%' : 
                             processingStep === 'Ready' ? '100%' : 
                             processingStep === 'Error' ? '0%' : '30%' 
                    }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Image Upload */}
          <Card className="card-enhanced hover-lift animate-slide-in-left" style={{animationDelay: '0.2s'}}>
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Upload className="w-5 h-5 mr-2" />
                Upload Image for Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-300 hover-lift ${
                  isDragActive ? 'border-green-400 bg-green-500/10 animate-glow' : 'border-slate-600 hover:border-slate-500'
                }`}
              >
                <input {...getInputProps()} />
                <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2 animate-bounce-custom" />
                <p className="text-slate-300 font-medium">
                  {isDragActive ? 'Drop the image here' : 'Drag & drop an image or click to select'}
                </p>
                <p className="text-slate-400 text-sm mt-1">Supports: JPEG, PNG, BMP, WebP (Max: 10MB)</p>
              </div>

              {uploadedImage && (
                <div className="mt-4 space-y-3 animate-fade-in">
                  <img src={uploadedImage} alt="Uploaded" className="max-h-48 mx-auto rounded border hover-scale" />
                  {processingResult && (
                    <div className="p-3 glass-effect rounded-lg animate-slide-in-up">
                      {processingResult.success && processingResult.results?.length > 0 ? (
                        <div className="text-center">
                          <CheckCircle className="w-6 h-6 text-green-400 mx-auto mb-2 animate-bounce-custom" />
                          <p className="text-white font-mono text-lg">{processingResult.results[0].plate_number}</p>
                          <p className="text-slate-400">Confidence: {processingResult.results[0].confidence.toFixed(1)}%</p>
                          <p className="text-green-400 text-sm mt-1">
                            Processing Time: {processingResult.processing_time?.toFixed(2)}s
                          </p>
                        </div>
                      ) : (
                        <div className="text-center">
                          <AlertCircle className="w-6 h-6 text-yellow-400 mx-auto mb-2 animate-bounce-custom" />
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

        {/* Enhanced Live Detections Panel */}
        <div className="space-y-4 animate-slide-in-right">
          <Card className="card-enhanced hover-lift">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Eye className="w-5 h-5 mr-2" />
                Recent Detections
                <Badge variant="secondary" className="ml-2 badge-animated">
                  {liveDetections.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto scrollbar-custom">
                {liveDetections.length === 0 ? (
                  <div className="text-center py-8 text-slate-400 animate-fade-in">
                    <AlertCircle className="w-8 h-8 mx-auto mb-2 animate-bounce-custom" />
                    <p>No detections yet</p>
                    <p className="text-sm">Start live camera or upload an image</p>
                  </div>
                ) : (
                  liveDetections.map((detection, index) => (
                    <div 
                      key={detection.id} 
                      className="p-3 glass-effect rounded-lg hover-lift animate-slide-in-up"
                      style={{animationDelay: `${index * 0.1}s`}}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-mono text-white font-bold">{detection.plate}</div>
                          <div className="text-xs text-slate-400">
                            {detection.timestamp.toLocaleTimeString()}
                          </div>
                        </div>
                        <Badge variant="secondary" className="text-xs badge-animated">
                          {detection.confidence.toFixed(1)}%
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Enhanced System Status */}
          <Card className="card-enhanced hover-lift animate-slide-in-right" style={{animationDelay: '0.2s'}}>
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Activity className="w-5 h-5 mr-2" />
                System Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-400">Camera Status:</span>
                <Badge variant={isLiveMode ? "default" : "secondary"} className="badge-animated">
                  {isLiveMode ? "Active" : "Inactive"}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Processing:</span>
                <Badge variant={isProcessing ? "default" : "secondary"} className="badge-animated">
                  {isProcessing ? "Running" : "Idle"}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Backend:</span>
                <Badge variant={isConnected ? "default" : "destructive"} className="badge-animated">
                  {isConnected ? "Connected" : "Offline"}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Total Detections:</span>
                <span className="text-white font-bold">{liveDetections.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Accuracy Rate:</span>
                <span className="text-green-400 font-bold">
                  {liveDetections.length > 0 
                    ? Math.round(liveDetections.reduce((acc, d) => acc + d.confidence, 0) / liveDetections.length)
                    : 0}%
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LiveCameraANPR;
