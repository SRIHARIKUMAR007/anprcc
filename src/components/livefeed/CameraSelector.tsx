
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Camera } from "lucide-react";
import { CameraSelectorCamera } from "@/types/camera";

interface CameraSelectorProps {
  cameras: CameraSelectorCamera[];
  selectedCamera: string;
  onCameraSelect: (cameraId: string) => void;
}

const CameraSelector = ({ cameras, selectedCamera, onCameraSelect }: CameraSelectorProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 mb-4">
      {cameras.map((camera) => (
        <Button
          key={camera.id}
          variant={selectedCamera === camera.id ? "default" : "outline"}
          size="sm"
          onClick={() => onCameraSelect(camera.id)}
          disabled={camera.status === 'maintenance'}
          className={`text-xs p-2 h-auto ${
            selectedCamera === camera.id ? 'bg-blue-600 border-blue-500' : ''
          } ${camera.status === 'maintenance' ? 'opacity-50' : ''}`}
        >
          <div className="text-center">
            <div className="font-mono font-bold">{camera.id}</div>
            <div className="text-xs opacity-75 truncate">{camera.location.split(' - ')[0]}</div>
            <div className={`w-2 h-2 rounded-full mx-auto mt-1 ${
              camera.status === 'active' ? 'bg-green-400' : 
              camera.status === 'maintenance' ? 'bg-yellow-400' : 'bg-red-400'
            }`}></div>
          </div>
        </Button>
      ))}
    </div>
  );
};

export default CameraSelector;
