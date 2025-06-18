
import { Zap, Target, MapPin } from "lucide-react";

interface DetectionOverlayProps {
  detectedPlate: string | null;
  confidence: number;
  processingStep: string;
}

const DetectionOverlay = ({ detectedPlate, confidence, processingStep }: DetectionOverlayProps) => {
  if (!detectedPlate) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center p-4 animate-scale-in">
      <div className="bg-green-500/20 border-2 border-green-500 rounded-lg p-3 lg:p-6 backdrop-blur-sm animate-glow max-w-full">
        <div className="text-green-400 text-xs lg:text-sm mb-2 flex items-center animate-pulse-custom">
          <Zap className="w-3 h-3 lg:w-4 lg:h-4 mr-1" />
          ANPR Detection Active
          <Target className="w-3 h-3 lg:w-4 lg:h-4 ml-2 animate-bounce-custom" />
        </div>
        <div className="text-white text-lg lg:text-2xl font-mono font-bold break-all animate-fade-in">
          {detectedPlate}
        </div>
        <div className="text-green-400 text-xs lg:text-sm mt-2 animate-slide-in-up">
          Confidence: {confidence}%
        </div>
        <div className="text-blue-400 text-xs mt-1 animate-slide-in-up" style={{animationDelay: '0.1s'}}>
          Processing: {processingStep}
        </div>
        <div className="text-yellow-400 text-xs mt-1 flex items-center animate-slide-in-up" style={{animationDelay: '0.2s'}}>
          <MapPin className="w-3 h-3 mr-1" />
          {detectedPlate.startsWith('TN-') ? 'Tamil Nadu Vehicle' : 'Out-of-State Vehicle'}
        </div>
        
        {/* Scanning effect */}
        <div className="absolute inset-0 border-2 border-transparent">
          <div className="absolute top-0 left-0 w-full h-0.5 bg-green-400 animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-full h-0.5 bg-green-400 animate-pulse" style={{animationDelay: '0.5s'}}></div>
        </div>
      </div>
    </div>
  );
};

export default DetectionOverlay;
