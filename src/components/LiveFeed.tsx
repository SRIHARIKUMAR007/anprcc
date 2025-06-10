
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Camera, Play, Pause, RotateCw, Zap } from "lucide-react";

const LiveFeed = () => {
  const [isRecording, setIsRecording] = useState(true);
  const [detectedPlate, setDetectedPlate] = useState<string | null>(null);
  const [confidence, setConfidence] = useState(0);
  const [processingStep, setProcessingStep] = useState("Idle");

  const mockCameras = [
    { id: "CAM-01", location: "Main Gate", status: "active", vehicles: 3 },
    { id: "CAM-02", location: "Highway Junction", status: "active", vehicles: 7 },
    { id: "CAM-03", location: "Parking Entrance", status: "maintenance", vehicles: 0 },
    { id: "CAM-04", location: "Toll Plaza", status: "active", vehicles: 12 },
  ];

  const processingSteps = [
    "Capturing Frame",
    "Preprocessing Image", 
    "Detecting Plate Region",
    "Character Segmentation",
    "OCR Recognition",
    "Validation Complete"
  ];

  useEffect(() => {
    if (!isRecording) return;

    const interval = setInterval(() => {
      // Simulate ANPR processing
      const stepIndex = Math.floor(Math.random() * processingSteps.length);
      setProcessingStep(processingSteps[stepIndex]);

      // Simulate plate detection
      if (Math.random() > 0.7) {
        const mockPlate = `${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}-${Math.floor(1000 + Math.random() * 9000)}`;
        setDetectedPlate(mockPlate);
        setConfidence(Math.floor(85 + Math.random() * 15));
        
        setTimeout(() => {
          setDetectedPlate(null);
          setProcessingStep("Idle");
        }, 3000);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [isRecording]);

  return (
    <div className="space-y-6">
      {/* Main Feed */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center">
              <Camera className="w-5 h-5 mr-2" />
              Live Camera Feed
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Badge variant={isRecording ? "default" : "secondary"} className="bg-red-500/20 text-red-400 border-red-500/30">
                {isRecording ? "LIVE" : "PAUSED"}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsRecording(!isRecording)}
              >
                {isRecording ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative aspect-video bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg overflow-hidden">
            {/* Simulated camera feed */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20">
              <div className="absolute top-4 left-4 text-white text-sm font-mono">
                CAM-02 • Highway Junction • 1920x1080
              </div>
              <div className="absolute top-4 right-4 text-white text-sm">
                {new Date().toLocaleTimeString()}
              </div>
              
              {/* Road simulation */}
              <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-slate-600 to-transparent opacity-50">
                <div className="absolute bottom-4 left-1/4 w-16 h-8 bg-slate-400 rounded-sm flex items-center justify-center">
                  <div className="text-xs font-mono text-black">Vehicle</div>
                </div>
              </div>

              {/* Plate detection overlay */}
              {detectedPlate && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-green-500/20 border-2 border-green-500 rounded-lg p-4 backdrop-blur-sm">
                    <div className="text-green-400 text-sm mb-2">Plate Detected</div>
                    <div className="text-white text-xl font-mono font-bold">{detectedPlate}</div>
                    <div className="text-green-400 text-sm mt-2">Confidence: {confidence}%</div>
                  </div>
                </div>
              )}

              {/* Processing indicator */}
              <div className="absolute bottom-4 left-4 bg-blue-500/20 border border-blue-500/30 rounded px-3 py-1">
                <div className="flex items-center text-blue-400 text-sm">
                  <RotateCw className="w-3 h-3 mr-2 animate-spin" />
                  {processingStep}
                </div>
              </div>
            </div>
          </div>

          {/* Processing Pipeline */}
          <div className="mt-4 p-4 bg-slate-700/30 rounded-lg">
            <div className="text-white text-sm font-semibold mb-3">ANPR Processing Pipeline</div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {processingSteps.map((step, index) => (
                <div 
                  key={step}
                  className={`p-2 rounded text-xs text-center transition-all ${
                    processingStep === step 
                      ? "bg-blue-500/30 text-blue-400 border border-blue-500/50" 
                      : "bg-slate-600/30 text-slate-400"
                  }`}
                >
                  {step}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Camera Grid */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Camera Network Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockCameras.map((camera) => (
              <div 
                key={camera.id}
                className="p-4 bg-slate-700/30 rounded-lg border border-slate-600/50"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="font-mono text-white font-semibold">{camera.id}</div>
                  <Badge 
                    variant={camera.status === "active" ? "default" : "secondary"}
                    className={camera.status === "active" ? "bg-green-500/20 text-green-400 border-green-500/30" : ""}
                  >
                    {camera.status}
                  </Badge>
                </div>
                <div className="text-slate-400 text-sm mb-1">{camera.location}</div>
                <div className="text-slate-300 text-sm">
                  {camera.vehicles} vehicles detected
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LiveFeed;
