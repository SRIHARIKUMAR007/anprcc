
import { Camera, BarChart3, Database, AlertTriangle } from "lucide-react";
import { ResponsiveGrid } from "@/components/ResponsiveLayout";

interface StatusCardsProps {
  systemStatus: {
    cameras: number;
    activeCameras: number;
    vehiclesDetected: number;
    plateRecognitions: number;
    alerts: number;
    networkHealth: number;
  };
  systemStats: any;
}

const StatusCards = ({ systemStatus, systemStats }: StatusCardsProps) => {
  return (
    <ResponsiveGrid className="mb-10">
      <div className="enhanced-card animate-fade-in">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-200">Active Cameras</h3>
          <Camera className="h-6 w-6 text-blue-400" />
        </div>
        <div className="text-3xl font-bold gradient-text mb-3">
          {systemStatus.activeCameras}/{systemStatus.cameras}
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex-1 bg-slate-700/50 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-green-400 to-blue-400 h-2 rounded-full transition-all duration-500"
              style={{ width: `${Math.round((systemStatus.activeCameras / systemStatus.cameras) * 100)}%` }}
            ></div>
          </div>
          <span className="text-xs text-slate-400 font-medium">
            {Math.round((systemStatus.activeCameras / systemStatus.cameras) * 100)}%
          </span>
        </div>
      </div>

      <div className="enhanced-card animate-fade-in">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-200">Vehicles Detected</h3>
          <BarChart3 className="h-6 w-6 text-green-400" />
        </div>
        <div className="text-3xl font-bold gradient-text mb-3">
          {systemStatus.vehiclesDetected.toLocaleString()}
        </div>
        <p className="text-xs text-slate-400 font-medium">Today's total detections</p>
      </div>

      <div className="enhanced-card animate-fade-in">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-200">Plate Recognition</h3>
          <Database className="h-6 w-6 text-cyan-400" />
        </div>
        <div className="text-3xl font-bold gradient-text mb-3">
          {systemStatus.plateRecognitions.toLocaleString()}
        </div>
        <p className="text-xs text-slate-400 font-medium">
          {systemStats?.accuracy_rate ? `${systemStats.accuracy_rate.toFixed(1)}% accuracy` : '95.3% accuracy'}
        </p>
      </div>

      <div className="enhanced-card animate-fade-in">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-200">Active Alerts</h3>
          <AlertTriangle className="h-6 w-6 text-orange-400" />
        </div>
        <div className="text-3xl font-bold text-orange-400 mb-3">
          {systemStatus.alerts}
        </div>
        <div className="flex items-center space-x-2">
          <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded-md border border-red-500/30">
            2 high priority
          </span>
        </div>
      </div>
    </ResponsiveGrid>
  );
};

export default StatusCards;
