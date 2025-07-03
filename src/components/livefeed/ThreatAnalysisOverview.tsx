
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, AlertTriangle, CheckCircle, TrendingUp } from "lucide-react";

interface ThreatAnalysisOverviewProps {
  cameraId: string;
}

const ThreatAnalysisOverview = ({ cameraId }: ThreatAnalysisOverviewProps) => {
  const threatData = {
    critical: 0,
    high: 0,
    medium: 3,
    low: 6,
    avgConfidence: 84
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader className="pb-3">
        <CardTitle className="text-white text-sm flex items-center justify-between">
          <span className="flex items-center">
            <Shield className="w-4 h-4 mr-2" />
            Threat Analysis Overview
          </span>
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
            ACTIVE
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs">Critical:</span>
            <span className="text-red-400 font-bold">{threatData.critical}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs">High:</span>
            <span className="text-orange-400 font-bold">{threatData.high}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs">Medium:</span>
            <span className="text-yellow-400 font-bold">{threatData.medium}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs">Low:</span>
            <span className="text-green-400 font-bold">{threatData.low}</span>
          </div>
        </div>
        
        <div className="pt-2 border-t border-slate-700">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs">Avg Confidence</span>
            <span className="text-white font-bold">{threatData.avgConfidence}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ThreatAnalysisOverview;
