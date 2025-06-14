
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Shield, 
  AlertTriangle, 
  Activity, 
  Router,
  Eye,
  Ban,
  CheckCircle,
  Clock
} from "lucide-react";
import { useAIThreatDetection } from "@/hooks/useAIThreatDetection";

interface SDNThreatManagerProps {
  cameraId: string;
}

const SDNThreatManager = ({ cameraId }: SDNThreatManagerProps) => {
  const { 
    threatAssessments, 
    sdnResponses, 
    isAnalyzing, 
    getThreatStats,
    isBackendConnected 
  } = useAIThreatDetection();
  
  const [selectedThreat, setSelectedThreat] = useState<string | null>(null);
  const threatStats = getThreatStats();

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'block': return <Ban className="w-3 h-3" />;
      case 'restrict': return <AlertTriangle className="w-3 h-3" />;
      case 'monitor': return <Eye className="w-3 h-3" />;
      case 'allow': return <CheckCircle className="w-3 h-3" />;
      default: return <Activity className="w-3 h-3" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'block': return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'restrict': return 'text-orange-400 bg-orange-500/20 border-orange-500/30';
      case 'monitor': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'allow': return 'text-green-400 bg-green-500/20 border-green-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const getThreatColor = (level: string) => {
    switch (level) {
      case 'critical': return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'high': return 'text-orange-400 bg-orange-500/20 border-orange-500/30';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'low': return 'text-green-400 bg-green-500/20 border-green-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white text-sm flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4 text-blue-400" />
            <span>SDN Threat Management</span>
            {isAnalyzing && (
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            )}
          </div>
          <Badge variant="secondary" className={`${isBackendConnected ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'}`}>
            {isBackendConnected ? 'PYTHON ACTIVE' : 'MOCK MODE'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Threat Overview */}
        <div className="bg-slate-700/30 rounded-lg p-3">
          <div className="text-white text-sm font-semibold mb-2">Threat Analysis Overview</div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Critical:</span>
              <span className="text-red-400 font-bold">{threatStats.critical}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">High:</span>
              <span className="text-orange-400 font-bold">{threatStats.high}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Medium:</span>
              <span className="text-yellow-400 font-bold">{threatStats.medium}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Low:</span>
              <span className="text-green-400 font-bold">{threatStats.low}</span>
            </div>
          </div>
          <div className="mt-2">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400">Avg Confidence</span>
              <span className="text-white">{threatStats.avgConfidence}%</span>
            </div>
            <Progress value={threatStats.avgConfidence} className="h-1" />
          </div>
        </div>

        {/* Recent SDN Actions */}
        <div className="space-y-2">
          <div className="text-slate-400 text-xs font-medium">Recent SDN Actions</div>
          <div className="max-h-40 overflow-y-auto space-y-2">
            {sdnResponses.slice(0, 6).map((response, index) => (
              <div key={index} className="bg-slate-700/20 rounded p-2">
                <div className="flex items-center justify-between mb-1">
                  <Badge className={getActionColor(response.action)}>
                    <div className="flex items-center space-x-1">
                      {getActionIcon(response.action)}
                      <span className="text-xs">{response.action.toUpperCase()}</span>
                    </div>
                  </Badge>
                  <Badge className={getThreatColor(response.threatLevel.level)}>
                    {response.threatLevel.level.toUpperCase()}
                  </Badge>
                </div>
                <div className="text-xs text-slate-400 mb-1">{response.reason}</div>
                {response.networkPath && (
                  <div className="flex items-center space-x-1 text-xs">
                    <Router className="w-3 h-3 text-cyan-400" />
                    <span className="text-cyan-400">{response.networkPath}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Python Service Status */}
        <div className="bg-slate-700/30 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-xs">Python ANPR Service</span>
            <div className={`w-2 h-2 rounded-full ${isBackendConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
          </div>
          <div className="text-white text-sm font-bold">
            {isBackendConnected ? 'Connected & Processing' : 'Service Unavailable'}
          </div>
          <div className="text-xs text-slate-400">
            {isBackendConnected 
              ? 'Real-time image recognition active' 
              : 'Using mock data - Python service offline'
            }
          </div>
        </div>

        {/* Network Flow Control */}
        <div className="space-y-2">
          <div className="text-slate-400 text-xs font-medium">Network Flow Control</div>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-slate-700/20 rounded p-2 text-center">
              <div className="text-xs text-slate-400">Active Routes</div>
              <div className="text-white text-sm font-bold">4</div>
            </div>
            <div className="bg-slate-700/20 rounded p-2 text-center">
              <div className="text-xs text-slate-400">Blocked IPs</div>
              <div className="text-red-400 text-sm font-bold">{threatStats.critical}</div>
            </div>
          </div>
        </div>

        {/* Emergency Controls */}
        {threatStats.critical > 0 && (
          <div className="bg-red-500/20 border border-red-500/30 rounded p-2">
            <div className="flex items-center space-x-2 mb-2">
              <AlertTriangle className="w-3 h-3 text-red-400" />
              <span className="text-red-400 text-xs font-medium">Critical Threats Detected</span>
            </div>
            <Button 
              variant="destructive" 
              size="sm" 
              className="w-full text-xs bg-red-600 hover:bg-red-700"
            >
              Initiate Network Lockdown
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SDNThreatManager;
