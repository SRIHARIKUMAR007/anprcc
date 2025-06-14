
import { useState, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Upload, 
  Camera, 
  Image as ImageIcon, 
  Zap, 
  CheckCircle, 
  AlertCircle,
  Download,
  Eye,
  Cpu,
  Activity,
  Clock,
  Database
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSupabaseBackend } from "@/hooks/useSupabaseBackend";

interface PlateResult {
  plate_number: string;
  confidence: number;
  is_valid: boolean;
  bbox: { x: number; y: number; width: number; height: number };
  raw_text: string;
}

interface ProcessingResult {
  success: boolean;
  plates_detected: number;
  results: PlateResult[];
  error?: string;
  processing_time?: number;
}

const ImageProcessingPipeline = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState<string>("Idle");
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<ProcessingResult | null>(null);
  const [processingTime, setProcessingTime] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { processImage, isConnected } = useSupabaseBackend();

  const processingSteps = [
    "Uploading Image",
    "Preprocessing Image",
    "Detecting Plate Regions", 
    "Extracting Characters",
    "Validating Results",
    "Complete"
  ];

  const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        setResults(null);
        setProgress(0);
        setCurrentStep("Ready");
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const processImageFile = async () => {
    if (!selectedImage) {
      toast({
        title: "No Image Selected",
        description: "Please upload an image first",
        variant: "destructive"
      });
      return;
    }

    setProcessing(true);
    setProgress(0);
    const startTime = Date.now();

    try {
      // Simulate processing steps
      for (let i = 0; i < processingSteps.length; i++) {
        setCurrentStep(processingSteps[i]);
        setProgress((i + 1) * (100 / processingSteps.length));
        await new Promise(resolve => setTimeout(resolve, 800));
      }

      // Convert data URL to File object for processing
      const response = await fetch(selectedImage);
      const blob = await response.blob();
      const file = new File([blob], 'uploaded-image.jpg', { type: blob.type });

      const result = await processImage(file);
      setResults(result);
      setProcessingTime(Date.now() - startTime);

      if (result.success && result.plates_detected > 0) {
        toast({
          title: "Processing Complete",
          description: `Found ${result.plates_detected} license plate(s)`,
        });
      } else {
        toast({
          title: "No Plates Detected", 
          description: "No valid license plates found in the image",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Processing error:', error);
      toast({
        title: "Processing Failed",
        description: "Failed to process image using Supabase backend.",
        variant: "destructive"
      });
      setResults({
        success: false,
        plates_detected: 0,
        results: [],
        error: error instanceof Error ? error.message : 'Unknown error',
        processing_time: (Date.now() - startTime) / 1000
      });
    } finally {
      setProcessing(false);
      setCurrentStep("Complete");
    }
  };

  const downloadResults = () => {
    if (results) {
      const dataStr = JSON.stringify(results, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'anpr-results.json';
      link.click();
    }
  };

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Header */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-white flex items-center text-lg lg:text-xl">
            <Database className="w-5 h-5 lg:w-6 lg:h-6 mr-2 text-green-400" />
            Supabase ANPR Processing Pipeline
            <Badge variant="secondary" className="ml-3 bg-green-500/20 text-green-400 border-green-500/30">
              LOVABLE POWERED
            </Badge>
          </CardTitle>
          <p className="text-slate-400 text-sm">
            Upload vehicle images for automatic license plate recognition using Supabase backend
          </p>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {/* Image Upload Section */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center text-base lg:text-lg">
              <Upload className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
              Image Upload
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />
            
            <div className="border-2 border-dashed border-slate-600 rounded-lg p-4 lg:p-8 text-center hover:border-blue-500 transition-colors">
              {selectedImage ? (
                <div className="space-y-3">
                  <img 
                    src={selectedImage} 
                    alt="Selected" 
                    className="max-h-32 lg:max-h-48 mx-auto rounded border"
                  />
                  <p className="text-slate-300 text-sm">Image ready for processing</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <ImageIcon className="w-12 h-12 lg:w-16 lg:h-16 text-slate-500 mx-auto" />
                  <p className="text-slate-400 text-sm lg:text-base">Click to upload an image</p>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <Button 
                onClick={() => fileInputRef.current?.click()}
                variant="outline" 
                className="flex-1 bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
              >
                <Upload className="w-4 h-4 mr-2" />
                Choose Image
              </Button>
              <Button 
                onClick={processImageFile}
                disabled={!selectedImage || processing}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                <Zap className="w-4 h-4 mr-2" />
                {processing ? 'Processing...' : 'Process Image'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Processing Status */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center text-base lg:text-lg">
              <Activity className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
              Processing Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-slate-300 text-sm">Current Step:</span>
                <Badge variant={processing ? "default" : "secondary"} className="text-xs">
                  {currentStep}
                </Badge>
              </div>
              <Progress value={progress} className="w-full h-2" />
              <div className="text-slate-400 text-xs text-right">{progress}%</div>
            </div>

            {processingTime > 0 && (
              <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                <div className="flex items-center text-slate-300 text-sm">
                  <Clock className="w-4 h-4 mr-2" />
                  Processing Time
                </div>
                <span className="text-white font-mono">{processingTime}ms</span>
              </div>
            )}

            {/* Connection Status */}
            <div className="p-3 bg-slate-700/30 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-slate-300 text-sm">Backend Status:</span>
                <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
                  <Database className="w-3 h-3 mr-1" />
                  Supabase Connected
                </Badge>
              </div>
            </div>

            {/* Processing Steps */}
            <div className="space-y-2">
              <div className="text-slate-300 text-sm font-medium">Pipeline Steps:</div>
              <div className="grid grid-cols-1 gap-1">
                {processingSteps.map((step, index) => (
                  <div 
                    key={step}
                    className={`p-2 rounded text-xs transition-all ${
                      currentStep === step 
                        ? "bg-blue-500/30 text-blue-400 border border-blue-500/50" 
                        : index < processingSteps.indexOf(currentStep)
                        ? "bg-green-500/20 text-green-400"
                        : "bg-slate-600/30 text-slate-400"
                    }`}
                  >
                    <div className="flex items-center">
                      {index < processingSteps.indexOf(currentStep) ? (
                        <CheckCircle className="w-3 h-3 mr-2" />
                      ) : currentStep === step ? (
                        <Activity className="w-3 h-3 mr-2 animate-spin" />
                      ) : (
                        <div className="w-3 h-3 mr-2 rounded-full border border-slate-500" />
                      )}
                      {step}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Results Section */}
      {results && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <CardTitle className="text-white flex items-center text-base lg:text-lg">
                <Eye className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
                Detection Results
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge 
                  variant={results.success ? "default" : "destructive"}
                  className={results.success ? "bg-green-500/20 text-green-400" : ""}
                >
                  {results.success ? `${results.plates_detected} Plates Found` : 'Failed'}
                </Badge>
                {results.success && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={downloadResults}
                    className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
                  >
                    <Download className="w-3 h-3 mr-1" />
                    Export
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {results.success ? (
              <div className="space-y-4">
                {results.results.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {results.results.map((result, index) => (
                      <div 
                        key={index}
                        className="p-4 bg-slate-700/30 rounded-lg border border-slate-600/50"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="font-mono text-white font-bold text-lg">
                            {result.plate_number}
                          </div>
                          <div className="flex items-center gap-2">
                            {result.is_valid ? (
                              <CheckCircle className="w-4 h-4 text-green-400" />
                            ) : (
                              <AlertCircle className="w-4 h-4 text-yellow-400" />
                            )}
                            <Badge variant="secondary" className="text-xs">
                              {result.confidence}%
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 text-xs text-slate-400">
                          <div>
                            <span className="text-slate-300">Raw Text:</span>
                            <div className="font-mono text-slate-200">{result.raw_text}</div>
                          </div>
                          <div>
                            <span className="text-slate-300">Position:</span>
                            <div className="font-mono text-slate-200">
                              {result.bbox.x}, {result.bbox.y}
                            </div>
                          </div>
                          <div>
                            <span className="text-slate-300">Size:</span>
                            <div className="font-mono text-slate-200">
                              {result.bbox.width}×{result.bbox.height}
                            </div>
                          </div>
                          <div>
                            <span className="text-slate-300">Valid:</span>
                            <div className={result.is_valid ? "text-green-400" : "text-yellow-400"}>
                              {result.is_valid ? "Yes" : "No"}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <AlertCircle className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
                    <p className="text-slate-300">No license plates detected in this image</p>
                    <p className="text-slate-400 text-sm mt-1">Try uploading a clearer image with visible license plates</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
                <p className="text-slate-300">Processing failed</p>
                <p className="text-slate-400 text-sm mt-1">{results.error}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ImageProcessingPipeline;
