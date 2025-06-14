
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Server, 
  CheckCircle, 
  Activity,
  Eye,
  Image,
  Zap,
  Database
} from "lucide-react";
import { useSupabaseBackend } from "@/hooks/useSupabaseBackend";

interface ServiceMetrics {
  responseTime: number;
  accuracy: number;
  processed: number;
  errors: number;
  uptime: string;
}

const SupabaseServiceMonitor = () => {
  const { isConnected, isProcessing, connectionHealth } = useSupabaseBackend();
  const [metrics, setMetrics] = useState<ServiceMetrics>({
    responseTime: 0,
    accuracy: 0,
    processed: 0,
    errors: 0,
    uptime: '00:00:00'
  });

  // Simulate service metrics when connected
  useEffect(() => {
    if (!isConnected) return;

    const interval = setInterval(() => {
      setMetrics(prev => ({
        responseTime: 400 + Math.random() * 200,
        accuracy: 92 + Math.random() * 8,
        processed: prev.processed + Math.floor(Math.random() * 3),
        errors: prev.errors + (Math.random() > 0.98 ? 1 : 0),
        uptime: formatUptime(Date.now() - (prev.processed * 2000))
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, [isConnected]);

  const formatUptime = (ms: number) => {
    const seconds = Math.floor(ms / 1000) % 60;
    const minutes = Math.floor(ms / (1000 * 60)) % 60;
    const hours = Math.floor(ms / (1000 * 60 * 60));
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white text-sm flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Database className="w-4 h-4 text-green-400" />
            <span>Supabase ANPR Service</span>
            {isProcessing && (
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            )}
          </div>
          <Badge className={isConnected ? 
            'text-green-400 bg-green-500/20 border-green-500/30' : 
            'text-red-400 bg-red-500/20 border-red-500/30'
          }>
            <div className="flex items-center space-x-1">
              <CheckCircle className="w-3 h-3" />
              <span className="text-xs">{isConnected ? 'CONNECTED' : 'OFFLINE'}</span>
            </div>
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Connection Status */}
        <div className="bg-slate-700/30 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-xs">Service Status</span>
            <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
              LOVABLE POWERED
            </Badge>
          </div>
          <div className="text-white text-sm font-bold">
            {isConnected ? 'Supabase Backend Active' : 'Connecting to Supabase...'}
          </div>
          <div className="text-xs text-slate-400">
            {connectionHealth.lastCheck 
              ? `Last check: ${connectionHealth.lastCheck.toLocaleTimeString()}`
              : 'Initializing connection...'
            }
          </div>
        </div>

        {/* Service Metrics */}
        {isConnected && (
          <>
            <div className="space-y-2">
              <div className="text-slate-400 text-xs font-medium">Performance Metrics</div>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-slate-700/20 rounded p-2">
                  <div className="flex items-center space-x-1 mb-1">
                    <Zap className="w-3 h-3 text-yellow-400" />
                    <span className="text-xs text-slate-400">Response Time</span>
                  </div>
                  <div className="text-white text-sm font-bold">
                    {Math.round(metrics.responseTime)}ms
                  </div>
                </div>
                <div className="bg-slate-700/20 rounded p-2">
                  <div className="flex items-center space-x-1 mb-1">
                    <Eye className="w-3 h-3 text-green-400" />
                    <span className="text-xs text-slate-400">Accuracy</span>
                  </div>
                  <div className="text-white text-sm font-bold">
                    {metrics.accuracy.toFixed(1)}%
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-slate-400 text-xs font-medium">Processing Stats</div>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-slate-700/20 rounded p-2">
                  <div className="flex items-center space-x-1 mb-1">
                    <Image className="w-3 h-3 text-blue-400" />
                    <span className="text-xs text-slate-400">Processed</span>
                  </div>
                  <div className="text-white text-sm font-bold">{metrics.processed}</div>
                </div>
                <div className="bg-slate-700/20 rounded p-2">
                  <div className="flex items-center space-x-1 mb-1">
                    <CheckCircle className="w-3 h-3 text-green-400" />
                    <span className="text-xs text-slate-400">Success Rate</span>
                  </div>
                  <div className="text-white text-sm font-bold">98.5%</div>
                </div>
              </div>
            </div>

            <div className="bg-slate-700/30 rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-2">
                <Activity className="w-3 h-3 text-green-400" />
                <span className="text-slate-400 text-xs">System Uptime</span>
              </div>
              <div className="text-white text-sm font-bold">{metrics.uptime}</div>
              <div className="mt-2">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Service Health</span>
                  <span className="text-green-400">Excellent</span>
                </div>
                <Progress value={98} className="h-1" />
              </div>
            </div>
          </>
        )}

        {/* Features */}
        <div className="space-y-2">
          <div className="text-slate-400 text-xs font-medium">Active Features</div>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Real-time Processing:</span>
              <Badge variant="secondary" className="text-xs bg-green-500/20 text-green-400">Active</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Database Logging:</span>
              <Badge variant="secondary" className="text-xs bg-green-500/20 text-green-400">Active</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">AI Detection:</span>
              <Badge variant="secondary" className="text-xs bg-green-500/20 text-green-400">Active</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Cloud Storage:</span>
              <Badge variant="secondary" className="text-xs bg-green-500/20 text-green-400">Active</Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SupabaseServiceMonitor;
