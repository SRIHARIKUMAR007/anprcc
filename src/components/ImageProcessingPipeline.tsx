
import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Camera, 
  Upload, 
  Image as ImageIcon, 
  Eye, 
  Cpu, 
  Search, 
  CheckCircle, 
  AlertCircle,
  Play,
  Pause,
  Settings
} from "lucide-react";

interface ProcessingStep {
  id: string;
  name: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress: number;
  description: string;
}

const ImageProcessingPipeline = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [extractedPlate, setExtractedPlate] = useState<string | null>(null);
  const [confidence, setConfidence] = useState(0);
  const [processingSteps, setProcessingSteps] = useState<ProcessingStep[]>([
    { id: 'capture', name: 'Image Capture', status: 'pending', progress: 0, description: 'Capturing vehicle image from camera' },
    { id: 'preprocess', name: 'Image Pre-processing', status: 'pending', progress: 0, description: 'Noise reduction, contrast enhancement, sharpening' },
    { id: 'detection', name: 'Plate Detection', status: 'pending', progress: 0, description: 'Identifying license plate region using edge detection' },
    { id: 'segmentation', name: 'Plate Segmentation', status: 'pending', progress: 0, description: 'Extracting plate region from image' },
    { id: 'ocr', name: 'Character Extraction (OCR)', status: 'pending', progress: 0, description: 'Using Tesseract OCR for character recognition' },
    { id: 'verification', name: 'Character Verification', status: 'pending', progress: 0, description: 'ML model verification and database lookup' }
  ]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const mockPlates = [
    "DL 01 AB 1234", "MH 12 CD 5678", "UP 16 EF 9012", 
    "GJ 05 GH 3456", "KA 03 IJ 7890", "TN 09 KL 2345"
  ];

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        resetProcessing();
      };
      reader.readAsDataURL(file);
    }
  };

  const resetProcessing = () => {
    setProcessingSteps(steps => steps.map(step => ({
      ...step,
      status: 'pending',
      progress: 0
    })));
    setExtractedPlate(null);
    setConfidence(0);
  };

  const simulateProcessingStep = (stepId: string, duration: number) => {
    return new Promise<void>((resolve) => {
      setProcessingSteps(steps => steps.map(step => 
        step.id === stepId ? { ...step, status: 'processing' } : step
      ));

      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 20;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          setProcessingSteps(steps => steps.map(step => 
            step.id === stepId ? { ...step, status: 'completed', progress: 100 } : step
          ));
          resolve();
        } else {
          setProcessingSteps(steps => steps.map(step => 
            step.id === stepId ? { ...step, progress } : step
          ));
        }
      }, duration / 10);
    });
  };

  const processImage = async () => {
    if (!selectedImage) return;
    
    setIsProcessing(true);
    resetProcessing();

    try {
      // Step 1: Image Capture (already done via upload)
      await simulateProcessingStep('capture', 500);
      
      // Step 2: Image Pre-processing
      await simulateProcessingStep('preprocess', 1500);
      
      // Step 3: Plate Detection
      await simulateProcessingStep('detection', 2000);
      
      // Step 4: Plate Segmentation
      await simulateProcessingStep('segmentation', 1000);
      
      // Step 5: OCR
      await simulateProcessingStep('ocr', 2500);
      
      // Step 6: Verification
      await simulateProcessingStep('verification', 1500);
      
      // Simulate successful extraction
      const randomPlate = mockPlates[Math.floor(Math.random() * mockPlates.length)];
      setExtractedPlate(randomPlate);
      setConfidence(Math.floor(85 + Math.random() * 15));
      
    } catch (error) {
      console.error('Processing error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const drawImageToCanvas = () => {
    if (!selectedImage || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = 400;
      canvas.height = 300;
      ctx.drawImage(img, 0, 0, 400, 300);
      
      // Draw detection box if processing completed
      if (processingSteps.find(s => s.id === 'detection')?.status === 'completed') {
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 3;
        ctx.strokeRect(120, 200, 160, 40);
        
        // Draw extracted plate text
        if (extractedPlate) {
          ctx.fillStyle = 'rgba(16, 185, 129, 0.2)';
          ctx.fillRect(120, 200, 160, 40);
          ctx.fillStyle = '#10b981';
          ctx.font = '14px monospace';
          ctx.fillText(extractedPlate, 125, 225);
        }
      }
    };
    img.src = selectedImage;
  };

  useEffect(() => {
    drawImageToCanvas();
  }, [selectedImage, processingSteps, extractedPlate]);

  return (
    <div className="space-y-6">
      {/* Image Input Section */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Camera className="w-5 h-5 mr-2" />
            ANPR Image Processing Pipeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Image Upload/Display */}
            <div className="space-y-4">
              <div className="border-2 border-dashed border-slate-600 rounded-lg p-6 text-center">
                {selectedImage ? (
                  <div className="space-y-4">
                    <canvas
                      ref={canvasRef}
                      className="max-w-full h-auto rounded border border-slate-600"
                    />
                    <Button
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="mr-2"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload New Image
                    </Button>
                    <Button
                      onClick={processImage}
                      disabled={isProcessing}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {isProcessing ? (
                        <>
                          <Pause className="w-4 h-4 mr-2" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 mr-2" />
                          Process Image
                        </>
                      )}
                    </Button>
                  </div>
                ) : (
                  <div className="text-slate-400">
                    <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg mb-2">Upload Vehicle Image</p>
                    <p className="text-sm mb-4">Select an image containing a vehicle with visible license plate</p>
                    <Button
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Choose Image
                    </Button>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            {/* Processing Results */}
            <div className="space-y-4">
              {extractedPlate && (
                <Card className="bg-green-500/10 border-green-500/30">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-green-400 font-semibold">Extracted Plate:</span>
                      <Badge className="bg-green-500/20 text-green-400">
                        {confidence}% Confidence
                      </Badge>
                    </div>
                    <div className="text-2xl font-mono font-bold text-white">{extractedPlate}</div>
                  </CardContent>
                </Card>
              )}

              {/* Processing Techniques */}
              <Card className="bg-slate-700/30 border-slate-600">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-sm flex items-center">
                    <Settings className="w-4 h-4 mr-2" />
                    Applied Techniques
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="text-xs space-y-1">
                    <div className="text-slate-300">• <span className="text-blue-400">OpenCV</span> for image processing</div>
                    <div className="text-slate-300">• <span className="text-green-400">Edge Detection</span> for plate localization</div>
                    <div className="text-slate-300">• <span className="text-purple-400">Tesseract OCR</span> for character extraction</div>
                    <div className="text-slate-300">• <span className="text-yellow-400">ML Verification</span> for accuracy</div>
                    <div className="text-slate-300">• <span className="text-cyan-400">Database Lookup</span> for validation</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Processing Steps */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Cpu className="w-5 h-5 mr-2" />
            Processing Pipeline Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {processingSteps.map((step, index) => (
              <div key={step.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                      step.status === 'processing' ? 'bg-blue-500/20 text-blue-400' :
                      step.status === 'error' ? 'bg-red-500/20 text-red-400' :
                      'bg-slate-600/20 text-slate-400'
                    }`}>
                      {step.status === 'completed' ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : step.status === 'processing' ? (
                        <Cpu className="w-4 h-4 animate-spin" />
                      ) : step.status === 'error' ? (
                        <AlertCircle className="w-4 h-4" />
                      ) : (
                        <span className="text-xs">{index + 1}</span>
                      )}
                    </div>
                    <div>
                      <div className="text-white font-medium">{step.name}</div>
                      <div className="text-slate-400 text-sm">{step.description}</div>
                    </div>
                  </div>
                  <Badge variant={
                    step.status === 'completed' ? 'default' :
                    step.status === 'processing' ? 'secondary' :
                    step.status === 'error' ? 'destructive' : 'outline'
                  } className={
                    step.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                    step.status === 'processing' ? 'bg-blue-500/20 text-blue-400 animate-pulse' :
                    ''
                  }>
                    {step.status}
                  </Badge>
                </div>
                {step.status === 'processing' && (
                  <Progress value={step.progress} className="h-2" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ImageProcessingPipeline;
