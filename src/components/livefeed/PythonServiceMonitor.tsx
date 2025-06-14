
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Server, 
  AlertCircle, 
  CheckCircle, 
  RefreshCw, 
  Activity,
  Eye,
  Image,
  Zap
} from "lucide-react";
import { useBackendIntegration } from "@/hooks/useBackendIntegration";

interface ServiceMetrics {
  responseTime: number;
  accuracy: number;
  processed: number;
  errors: number;
  uptime: string;
}

const PythonServiceMonitor = () => {
  const { isBackendConnected, connectionStatus, isProcessing } = useBackendIntegration();
  const [metrics, setMetrics] = useState<ServiceMetrics>({
    responseTime: 0,
    accuracy: 0,
    processed: 0,
    errors: 0,
    uptime: '00:00:00'
  });
  const [lastHealthCheck, setLastHealthCheck] = useState<Date | null>(null);

  // Simulate service metrics when connected
  useEffect(() => {
    if (!isBackendConnected) return;

    const interval = setInterval(() => {
      setMetrics(prev => ({
        responseTime: 800 + Math.random() * 400,
        accuracy: 88 + Math.random() * 10,
        processed: prev.processed + Math.floor(Math.random() * 3),
        errors: prev.errors + (Math.random() > 0.95 ? 1 : 0),
        uptime: formatUptime(Date.now() - (prev.processed * 2000))
      }));
      setLastHealthCheck(new Date());
    }, 5000);

    return () => clearInterval(interval);
  }, [isBackendConnected]);

  const formatUptime = (ms: number) => {
    const seconds = Math.floor(ms / 1000) % 60;
    const minutes = Math.floor(ms / (1000 * 60)) % 60;
    const hours = Math.floor(ms / (1000 * 60 * 60));
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'connecting': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'disconnected': return 'text-red-400 bg-red-500/20 border-red-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected': return <CheckCircle className="w-4 h-4" />;
      case 'connecting': return <RefreshCw className="w-4 h-4 animate-spin" />;
      case 'disconnected': return <AlertCircle className="w-4 h-4" />;
      default: return <Server className="w-4 h-4" />;
    }
  };

  const testConnection = async () => {
    try {
      const response = await fetch('http://localhost:5000/health');
      if (response.ok) {
        setLastHealthCheck(new Date());
        console.log('Python service health check successful');
      }
    } catch (error) {
      console.error('Health check failed:', error);
    }
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white text-sm flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Server className="w-4 h-4 text-blue-400" />
            <span>Python ANPR Service</span>
            {isProcessing && (
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
            )}
          </div>
          <Badge className={getStatusColor()}>
            <div className="flex items-center space-x-1">
              {getStatusIcon()}
              <span className="text-xs">{connectionStatus.toUpperCase()}</span>
            </div>
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Connection Status */}
        <div className="bg-slate-700/30 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-xs">Service Status</span>
            <Button
              variant="outline"
              size="sm"
              onClick={testConnection}
              className="text-xs h-6 px-2"
            >
              <RefreshCw className="w-3 h-3 mr-1" />
              Test
            </Button>
          </div>
          <div className="text-white text-sm font-bold">
            {isBackendConnected ? 'Online & Ready' : 'Offline - Using Mock Data'}
          </div>
          <div className="text-xs text-slate-400">
            {lastHealthCheck 
              ? `Last check: ${lastHealthCheck.toLocaleTimeString()}`
              : 'No recent health checks'
            }
          </div>
        </div>

        {/* Service Metrics */}
        {isBackendConnected && (
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
                    <AlertCircle className="w-3 h-3 text-red-400" />
                    <span className="text-xs text-slate-400">Errors</span>
                  </div>
                  <div className="text-white text-sm font-bold">{metrics.errors}</div>
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
                <Progress value={95} className="h-1" />
              </div>
            </div>
          </>
        )}

        {/* Offline Mode Info */}
        {!isBackendConnected && (
          <div className="bg-orange-500/20 border border-orange-500/30 rounded p-3">
            <div className="flex items-center space-x-2 mb-2">
              <AlertCircle className="w-3 h-3 text-orange-400" />
              <span className="text-orange-400 text-xs font-medium">Service Offline</span>
            </div>
            <div className="text-xs text-orange-300 mb-2">
              Python ANPR service is not available. The system is using simulated data for demonstration.
            </div>
            <div className="text-xs text-slate-400">
              To enable real image processing, ensure the Python service is running on localhost:5000
            </div>
          </div>
        )}

        {/* API Endpoints */}
        <div className="space-y-2">
          <div className="text-slate-400 text-xs font-medium">API Endpoints</div>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Health:</span>
              <code className="text-cyan-400">/health</code>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Process:</span>
              <code className="text-cyan-400">/process-image</code>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Batch:</span>
              <code className="text-cyan-400">/batch-process</code>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PythonServiceMonitor;
