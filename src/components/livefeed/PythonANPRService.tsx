
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, CheckCircle, Database } from "lucide-react";

const PythonANPRService = () => {
  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader className="pb-3">
        <CardTitle className="text-white text-sm flex items-center">
          <Activity className="w-4 h-4 mr-2" />
          Python ANPR Service
          <Badge className="ml-2 bg-green-500/20 text-green-400 border-green-500/30 text-xs animate-pulse">
            ACTIVE
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-white font-medium text-sm">Connected & Processing</span>
            <CheckCircle className="w-4 h-4 text-green-400" />
          </div>
          
          <div className="text-slate-400 text-xs">
            Real-time image recognition active
          </div>
          
          <div className="pt-3 border-t border-slate-700">
            <div className="text-white text-sm font-medium mb-2">Network Flow Control</div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-slate-400 text-xs">Active Routes</div>
                <div className="text-white font-bold text-lg">4</div>
              </div>
              <div className="text-center">
                <div className="text-slate-400 text-xs">Blocked IPs</div>
                <div className="text-red-400 font-bold text-lg">0</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PythonANPRService;
