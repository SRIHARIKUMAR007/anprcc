
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CameraNetworkStatusProps {
  cameras: Array<{
    id: string;
    location: string;
    status: string;
    vehicles: number;
    fps: number;
    resolution: string;
  }>;
  selectedCamera: string;
  onCameraSelect: (cameraId: string) => void;
}

const CameraNetworkStatus = ({ cameras, selectedCamera, onCameraSelect }: CameraNetworkStatusProps) => {
  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white text-base lg:text-lg">Camera Network Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
          {cameras.map((camera) => (
            <div 
              key={camera.id}
              className={`p-3 lg:p-4 bg-slate-700/30 rounded-lg border transition-all cursor-pointer hover:scale-105 ${
                selectedCamera === camera.id 
                  ? 'border-blue-500/50 bg-blue-500/10' 
                  : 'border-slate-600/50 hover:border-blue-500/30'
              }`}
              onClick={() => onCameraSelect(camera.id)}
            >
              <div className="flex items-center justify-between mb-2 lg:mb-3">
                <div className="font-mono text-white font-semibold text-sm lg:text-base">{camera.id}</div>
                <Badge 
                  variant={camera.status === "active" ? "default" : "secondary"}
                  className={`text-xs ${
                    camera.status === "active" 
                      ? "bg-green-500/20 text-green-400 border-green-500/30" 
                      : camera.status === "maintenance"
                      ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                      : "bg-red-500/20 text-red-400 border-red-500/30"
                  }`}
                >
                  {camera.status}
                </Badge>
              </div>
              <div className="text-slate-400 text-xs lg:text-sm mb-2">{camera.location}</div>
              <div className="grid grid-cols-2 gap-1 lg:gap-2 text-xs">
                <div className="text-slate-300">
                  <span className="text-slate-400">Vehicles:</span> {camera.vehicles}
                </div>
                <div className="text-slate-300">
                  <span className="text-slate-400">FPS:</span> {camera.fps}
                </div>
                <div className="text-slate-300 col-span-2">
                  <span className="text-slate-400">Resolution:</span> {camera.resolution}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CameraNetworkStatus;
