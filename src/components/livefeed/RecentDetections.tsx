
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Camera } from "lucide-react";

interface RecentDetectionsProps {
  plateHistory: string[];
  selectedCamera: string;
}

const RecentDetections = ({ plateHistory, selectedCamera }: RecentDetectionsProps) => {
  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white text-base lg:text-lg">Recent Detections</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 max-h-80 overflow-y-auto">
          {plateHistory.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <Camera className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No recent detections</p>
            </div>
          ) : (
            plateHistory.map((plate, index) => (
              <div 
                key={`${plate}-${index}`}
                className={`flex items-center justify-between p-3 bg-slate-700/30 rounded-lg border border-slate-600/50 ${
                  index === 0 ? 'border-green-500/30 bg-green-500/5' : ''
                }`}
              >
                <div>
                  <div className="font-mono text-white font-bold text-sm">{plate}</div>
                  <div className="text-xs text-slate-400">
                    {selectedCamera} • {new Date().toLocaleTimeString()}
                  </div>
                </div>
                <div className="text-right">
                  <Badge 
                    variant="secondary"
                    className={`text-xs ${
                      plate.startsWith('TN-') 
                        ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                        : "bg-orange-500/20 text-orange-400 border-orange-500/30"
                    }`}
                  >
                    {plate.startsWith('TN-') ? 'TN' : 'OUT'}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentDetections;
