
import { Zap } from "lucide-react";

interface DetectionOverlayProps {
  detectedPlate: string | null;
  confidence: number;
  processingStep: string;
}

const DetectionOverlay = ({ detectedPlate, confidence, processingStep }: DetectionOverlayProps) => {
  if (!detectedPlate) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center p-4">
      <div className="bg-green-500/20 border-2 border-green-500 rounded-lg p-3 lg:p-6 backdrop-blur-sm animate-pulse max-w-full">
        <div className="text-green-400 text-xs lg:text-sm mb-2 flex items-center">
          <Zap className="w-3 h-3 lg:w-4 lg:h-4 mr-1" />
          ANPR Detection Active
        </div>
        <div className="text-white text-lg lg:text-2xl font-mono font-bold break-all">{detectedPlate}</div>
        <div className="text-green-400 text-xs lg:text-sm mt-2">Confidence: {confidence}%</div>
        <div className="text-blue-400 text-xs mt-1">Processing: {processingStep}</div>
        <div className="text-yellow-400 text-xs mt-1">
          {detectedPlate.startsWith('TN-') ? 'Tamil Nadu Vehicle' : 'Out-of-State Vehicle'}
        </div>
      </div>
    </div>
  );
};

export default DetectionOverlay;
