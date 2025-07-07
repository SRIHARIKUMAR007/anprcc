
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings } from "lucide-react";

const AdvancedConfiguration = () => {
  return (
    <Card className="cyber-card border-orange-500/30">
      <CardHeader>
        <CardTitle className="text-white flex items-center space-x-2">
          <Settings className="w-5 h-5 text-orange-400" />
          <span>Advanced Configuration</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="cyber-glass rounded-lg p-4">
            <div className="text-sm text-slate-400 mb-2">Flow Table Optimization</div>
            <div className="flex items-center justify-between">
              <span className="text-white">Auto-cleanup enabled</span>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            </div>
          </div>
          <div className="cyber-glass rounded-lg p-4">
            <div className="text-sm text-slate-400 mb-2">Load Balancing</div>
            <div className="flex items-center justify-between">
              <span className="text-white">Round-robin active</span>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            </div>
          </div>
          <div className="cyber-glass rounded-lg p-4">
            <div className="text-sm text-slate-400 mb-2">Failover Protection</div>
            <div className="flex items-center justify-between">
              <span className="text-white">Multi-path ready</span>
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdvancedConfiguration;
