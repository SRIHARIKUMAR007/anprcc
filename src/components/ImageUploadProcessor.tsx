
import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, Camera, Zap, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { useDropzone } from 'react-dropzone';
import { useBackendIntegration } from '@/hooks/useBackendIntegration';
import { useToast } from '@/hooks/use-toast';

const ImageUploadProcessor = () => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [processingResult, setProcessingResult] = useState<any>(null);
  const { isBackendConnected, isProcessing, processImage, logDetection } = useBackendIntegration();
  const { toast } = useToast();

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
    try {
      const result = await processImage(file);
      setProcessingResult(result);
      
      // Log detection to database - use the first result if available
      if (result.success && result.results && result.results.length > 0) {
        const firstResult = result.results[0];
        const success = await logDetection(firstResult, 'CAM-UPLOAD', 'Manual Upload');
        
        if (success) {
          toast({
            title: "Processing Complete",
            description: `Detected ${result.plates_detected} plate(s). Primary: ${firstResult.plate_number} (${firstResult.confidence.toFixed(1)}% confidence)`,
          });
        }
      } else {
        toast({
          title: "Processing Complete",
          description: "No plates detected in the image.",
        });
      }
    } catch (error) {
      toast({
        title: "Processing Error",
        description: "Failed to process image. Please try again.",
        variant: "destructive",
      });
    }
  }, [processImage, logDetection, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.bmp']
    },
    multiple: false
  });

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Connection Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 sm:p-4 bg-slate-800/30 rounded-lg border border-slate-700">
        <div className="flex items-center space-x-2">
          <Camera className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
          <span className="text-sm sm:text-base text-white font-medium">ANPR Backend Status</span>
        </div>
        <Badge 
          variant={isBackendConnected ? "default" : "secondary"}
          className={`${isBackendConnected ? 
            'bg-green-500/20 text-green-400 border-green-500/30' : 
            'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
          } px-2 py-1 text-xs sm:text-sm`}
        >
          {isBackendConnected ? 'Connected' : 'Mock Mode'}
        </Badge>
      </div>

      {/* Image Upload Area */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="text-base sm:text-lg text-white flex items-center">
            <Upload className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            Upload Vehicle Image for ANPR Processing
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6">
          <div
            {...getRootProps()}
            className={`
              border-2 border-dashed rounded-lg p-6 sm:p-8 md:p-12 text-center cursor-pointer transition-colors
              ${isDragActive ? 'border-blue-400 bg-blue-500/10' : 'border-slate-600 hover:border-slate-500'}
              ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            <input {...getInputProps()} disabled={isProcessing} />
            <div className="space-y-2 sm:space-y-4">
              {isProcessing ? (
                <Loader2 className="w-8 h-8 sm:w-12 sm:h-12 text-blue-400 mx-auto animate-spin" />
              ) : (
                <Upload className="w-8 h-8 sm:w-12 sm:h-12 text-slate-400 mx-auto" />
              )}
              <div>
                <p className="text-sm sm:text-base text-white font-medium">
                  {isProcessing ? 'Processing image...' : 
                   isDragActive ? 'Drop the image here' : 
                   'Drag & drop an image here, or click to select'}
                </p>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Supports: JPEG, PNG, BMP files
                </p>
              </div>
            </div>
          </div>

          {/* Image Preview and Results */}
          {uploadedImage && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {/* Image Preview */}
              <div className="space-y-3">
                <h3 className="text-sm sm:text-base font-medium text-white">Uploaded Image</h3>
                <div className="relative overflow-hidden rounded-lg border border-slate-600">
                  <img 
                    src={uploadedImage} 
                    alt="Uploaded" 
                    className="w-full h-48 sm:h-64 object-cover"
                  />
                </div>
              </div>

              {/* Processing Results */}
              <div className="space-y-3">
                <h3 className="text-sm sm:text-base font-medium text-white">Processing Results</h3>
                {isProcessing ? (
                  <div className="flex items-center justify-center h-48 sm:h-64 bg-slate-700/30 rounded-lg">
                    <div className="text-center space-y-2">
                      <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400 mx-auto animate-spin" />
                      <p className="text-xs sm:text-sm text-slate-400">
                        {isBackendConnected ? 'Processing with AI backend...' : 'Simulating AI processing...'}
                      </p>
                    </div>
                  </div>
                ) : processingResult ? (
                  <div className="space-y-3 sm:space-y-4 p-3 sm:p-4 bg-slate-700/30 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
                      <span className="text-sm sm:text-base text-white font-medium">Detection Complete</span>
                    </div>
                    
                    {processingResult.success && processingResult.results && processingResult.results.length > 0 ? (
                      <div className="space-y-3">
                        <div className="text-xs sm:text-sm text-slate-400">
                          Found {processingResult.plates_detected} plate(s)
                        </div>
                        
                        {processingResult.results.map((result: any, index: number) => (
                          <div key={index} className="space-y-2 p-2 bg-slate-600/30 rounded">
                            <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                              <span className="text-xs sm:text-sm text-slate-400">Plate {index + 1}:</span>
                              <span className="text-sm sm:text-base font-mono text-white font-bold">
                                {result.plate_number}
                              </span>
                            </div>
                            
                            <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                              <span className="text-xs sm:text-sm text-slate-400">Confidence:</span>
                              <Badge 
                                variant={result.confidence > 90 ? "default" : "secondary"}
                                className="w-fit"
                              >
                                {result.confidence.toFixed(1)}%
                              </Badge>
                            </div>
                            
                            <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                              <span className="text-xs sm:text-sm text-slate-400">Valid:</span>
                              <Badge 
                                variant={result.is_valid ? "default" : "secondary"}
                                className="w-fit"
                              >
                                {result.is_valid ? 'Yes' : 'No'}
                              </Badge>
                            </div>
                          </div>
                        ))}
                        
                        <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                          <span className="text-xs sm:text-sm text-slate-400">Processing Time:</span>
                          <span className="text-xs sm:text-sm text-slate-300">
                            {processingResult.processing_time?.toFixed(2)}s
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <AlertCircle className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-400 mx-auto mb-2" />
                        <p className="text-xs sm:text-sm text-slate-400">No plates detected in this image</p>
                      </div>
                    )}

                    <Button
                      onClick={() => {
                        setUploadedImage(null);
                        setProcessingResult(null);
                      }}
                      variant="outline"
                      size="sm"
                      className="w-full mt-3"
                    >
                      <Zap className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                      Process Another Image
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-48 sm:h-64 bg-slate-700/30 rounded-lg">
                    <div className="text-center">
                      <AlertCircle className="w-6 h-6 sm:w-8 sm:h-8 text-slate-400 mx-auto mb-2" />
                      <p className="text-xs sm:text-sm text-slate-400">Waiting for processing...</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ImageUploadProcessor;
