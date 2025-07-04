
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Network, ArrowRight } from "lucide-react";

interface RecentSDNActionsProps {
  cameraId: string;
}

const RecentSDNActions = ({ cameraId }: RecentSDNActionsProps) => {
  const recentActions = [
    {
      id: 1,
      action: "ALLOW",
      priority: "LOW",
      description: "Normal traffic flow",
      route: "standard-route",
      timestamp: new Date().toLocaleTimeString()
    },
    {
      id: 2,
      action: "ALLOW", 
      priority: "LOW",
      description: "Normal traffic flow",
      route: "standard-route",
      timestamp: new Date(Date.now() - 30000).toLocaleTimeString()
    }
  ];

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader className="pb-3">
        <CardTitle className="text-white text-sm">Recent SDN Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {recentActions.map((action) => (
          <div key={action.id} className="bg-slate-700/30 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs flex items-center">
                <CheckCircle className="w-3 h-3 mr-1" />
                {action.action}
              </Badge>
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">
                {action.priority}
              </Badge>
            </div>
            
            <div className="text-slate-300 text-xs mb-2">{action.description}</div>
            
            <div className="flex items-center text-blue-400 text-xs">
              <Network className="w-3 h-3 mr-1" />
              {action.route}
            </div>
            
            <div className="text-slate-500 text-xs mt-2">{action.timestamp}</div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default RecentSDNActions;
