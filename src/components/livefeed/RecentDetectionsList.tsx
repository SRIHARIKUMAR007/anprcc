
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface RecentDetectionsListProps {
  detections: any[];
  isConnected: boolean;
}

const RecentDetectionsList = ({ detections, isConnected }: RecentDetectionsListProps) => {
  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white">Recent Detections</CardTitle>
        <CardDescription className="text-slate-400">
          {isConnected ? 'Live vehicle plate recognitions from Supabase' : 'Demo data'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {detections.slice(0, 5).map((detection) => (
          <div key={detection.id} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
            <div>
              <div className="font-mono text-white font-semibold">{detection.plate_number}</div>
              <div className="text-xs text-slate-400">
                {new Date(detection.timestamp).toLocaleTimeString()} • {detection.camera_id}
              </div>
            </div>
            <div className="text-right">
              <Badge 
                variant={detection.status === "flagged" ? "destructive" : "secondary"}
                className="mb-1 text-xs"
              >
                {detection.status}
              </Badge>
              <div className="text-xs text-slate-400">{detection.confidence}%</div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default RecentDetectionsList;
