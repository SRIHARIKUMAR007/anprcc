
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, CheckCircle } from "lucide-react";

const SecurityStatus = () => {
  return (
    <Card className="cyber-card border-green-500/30">
      <CardHeader>
        <CardTitle className="text-white flex items-center space-x-2">
          <Shield className="w-5 h-5 text-green-400" />
          <span>Security Status</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 cyber-glass rounded-lg">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-white">DDoS Protection</span>
            </div>
            <Badge className="cyber-glow-green bg-green-500/20 text-green-400 border-green-500/30">Active</Badge>
          </div>
          <div className="flex items-center justify-between p-3 cyber-glass rounded-lg">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-white">Intrusion Detection</span>
            </div>
            <Badge className="cyber-glow-green bg-green-500/20 text-green-400 border-green-500/30">Monitoring</Badge>
          </div>
          <div className="flex items-center justify-between p-3 cyber-glass rounded-lg">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-white">Traffic Encryption</span>
            </div>
            <Badge className="cyber-glow-green bg-green-500/20 text-green-400 border-green-500/30">Enabled</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SecurityStatus;
