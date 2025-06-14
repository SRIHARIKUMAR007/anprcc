
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Brain, Zap, TrendingUp, AlertTriangle, Activity, Cpu, MemoryStick, Wifi } from "lucide-react";
import { useAIRealTimeEngine } from "@/hooks/useAIRealTimeEngine";

interface AIRealTimeAnalyticsProps {
  cameraId: string;
}

const AIRealTimeAnalytics = ({ cameraId }: AIRealTimeAnalyticsProps) => {
  const { 
    isAIProcessing, 
    aiGeneratedDetections, 
    trafficPattern, 
    systemLoad, 
    getAIInsights 
  } = useAIRealTimeEngine();
  
  const [insights, setInsights] = useState(getAIInsights());

  useEffect(() => {
    const interval = setInterval(() => {
      setInsights(getAIInsights());
    }, 2000);
    return () => clearInterval(interval);
  }, [getAIInsights]);

  const getCongestionColor = (level: number) => {
    if (level > 0.7) return 'bg-red-500/20 text-red-400 border-red-500/30';
    if (level > 0.4) return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    return 'bg-green-500/20 text-green-400 border-green-500/30';
  };

  const getSystemHealthColor = (value: number) => {
    if (value < 70) return 'bg-red-500';
    if (value < 85) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white text-sm flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="w-4 h-4 text-purple-400" />
            <span>AI Real-Time Analytics</span>
            {isAIProcessing && (
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
            )}
          </div>
          <Badge variant="secondary" className="bg-purple-500/20 text-purple-400 border-purple-500/30">
            AI ACTIVE
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* AI Processing Status */}
        <div className="bg-slate-700/30 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-xs">AI Processing</span>
            <Zap className={`w-3 h-3 ${isAIProcessing ? 'text-yellow-400 animate-pulse' : 'text-gray-400'}`} />
          </div>
          <div className="text-white text-sm font-bold">
            {isAIProcessing ? 'Analyzing...' : 'Ready'}
          </div>
          <div className="text-xs text-slate-400">
            Confidence: {insights.avgConfidence}% • Efficiency: {insights.processingEfficiency}%
          </div>
        </div>

        {/* Traffic Intelligence */}
        <div className="space-y-2">
          <div className="text-slate-400 text-xs font-medium">Traffic Intelligence</div>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-slate-700/20 rounded p-2">
              <div className="text-xs text-slate-400">Density</div>
              <div className="text-white text-sm font-bold">
                {Math.round(trafficPattern.congestionLevel * 100)}%
              </div>
              <Progress 
                value={trafficPattern.congestionLevel * 100} 
                className="h-1 mt-1"
              />
            </div>
            <div className="bg-slate-700/20 rounded p-2">
              <div className="text-xs text-slate-400">Avg Speed</div>
              <div className="text-white text-sm font-bold">
                {Math.round(trafficPattern.averageSpeed)} km/h
              </div>
            </div>
          </div>
        </div>

        {/* Risk Assessment */}
        <div className="space-y-2">
          <div className="text-slate-400 text-xs font-medium">AI Risk Assessment</div>
          <div className="grid grid-cols-1 gap-2">
            <div className="bg-slate-700/20 rounded p-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Out-of-State Vehicles</span>
                <Badge variant="outline" className="text-xs">
                  {insights.outOfStatePercentage}%
                </Badge>
              </div>
            </div>
            <div className="bg-slate-700/20 rounded p-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">High Risk Detected</span>
                <Badge 
                  variant={insights.highRiskCount > 0 ? "destructive" : "secondary"}
                  className="text-xs"
                >
                  {insights.highRiskCount}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* System Health */}
        <div className="space-y-2">
          <div className="text-slate-400 text-xs font-medium">System Health</div>
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-1">
                <Cpu className="w-3 h-3 text-blue-400" />
                <span className="text-slate-400">CPU</span>
              </div>
              <span className="text-white">{systemLoad.cpu}%</span>
            </div>
            <Progress 
              value={systemLoad.cpu} 
              className="h-1"
            />
            
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-1">
                <MemoryStick className="w-3 h-3 text-green-400" />
                <span className="text-slate-400">Memory</span>
              </div>
              <span className="text-white">{systemLoad.memory}%</span>
            </div>
            <Progress 
              value={systemLoad.memory} 
              className="h-1"
            />
            
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-1">
                <Wifi className="w-3 h-3 text-purple-400" />
                <span className="text-slate-400">Network</span>
              </div>
              <span className="text-white">{systemLoad.network}ms</span>
            </div>
          </div>
        </div>

        {/* Recent AI Detections */}
        <div className="space-y-2">
          <div className="text-slate-400 text-xs font-medium">Recent AI Detections</div>
          <div className="max-h-32 overflow-y-auto space-y-1">
            {aiGeneratedDetections.slice(0, 4).map((detection, index) => (
              <div key={index} className="flex items-center justify-between bg-slate-700/20 rounded px-2 py-1">
                <div className="flex items-center space-x-2">
                  <div className={`w-1 h-1 rounded-full ${
                    detection.riskLevel === 'high' ? 'bg-red-400' :
                    detection.riskLevel === 'medium' ? 'bg-yellow-400' : 'bg-green-400'
                  }`}></div>
                  <span className="text-white text-xs font-mono">
                    {detection.plateNumber}
                  </span>
                </div>
                <div className="text-xs text-slate-400">
                  {detection.confidence}%
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Peak Hours Indicator */}
        {trafficPattern.peakHours && (
          <div className="bg-orange-500/20 border border-orange-500/30 rounded p-2">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-3 h-3 text-orange-400" />
              <span className="text-orange-400 text-xs font-medium">Peak Hours Active</span>
            </div>
            <div className="text-xs text-orange-300 mt-1">
              Increased monitoring and processing
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIRealTimeAnalytics;
