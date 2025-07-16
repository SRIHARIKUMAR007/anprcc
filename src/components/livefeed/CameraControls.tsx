
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, Volume2, VolumeX, Maximize2, Settings, Zap } from "lucide-react";

interface CameraControlsProps {
  isRecording: boolean;
  frameRate: number;
  resolution: string;
  isFullscreen: boolean;
  audioEnabled: boolean;
  onRecordingToggle: () => void;
  onFullscreenToggle: () => void;
  onAudioToggle: () => void;
}

const CameraControls = ({
  isRecording,
  frameRate,
  resolution,
  isFullscreen,
  audioEnabled,
  onRecordingToggle,
  onFullscreenToggle,
  onAudioToggle
}: CameraControlsProps) => {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Badge variant={isRecording ? "default" : "secondary"} className="bg-red-500/20 text-red-400 border-red-500/30 text-xs">
        {isRecording ? "LIVE" : "PAUSED"}
      </Badge>
      <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
        {frameRate} FPS
      </Badge>
      <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">
        {resolution}
      </Badge>
      <Badge variant="secondary" className={`text-xs ${audioEnabled ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' : 'bg-gray-500/20 text-gray-400 border-gray-500/30'}`}>
        {audioEnabled ? "AUDIO ON" : "AUDIO OFF"}
      </Badge>
      
      <Button
        variant="outline"
        size="sm"
        onClick={onRecordingToggle}
        className="text-xs"
      >
        {isRecording ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={onAudioToggle}
        className={`text-xs ${audioEnabled ? 'bg-purple-500/10 border-purple-500/30' : ''}`}
      >
        {audioEnabled ? <Volume2 className="w-3 h-3" /> : <VolumeX className="w-3 h-3" />}
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={onFullscreenToggle}
        className="text-xs"
      >
        <Maximize2 className="w-3 h-3 mr-1" />
        {isFullscreen ? "Exit" : "Fullscreen"}
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        className="text-xs"
      >
        <Settings className="w-3 h-3" />
      </Button>
    </div>
  );
};

export default CameraControls;
