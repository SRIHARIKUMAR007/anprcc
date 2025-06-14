
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Activity, 
  Camera, 
  Zap, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Cpu,
  Monitor,
  Play,
  Pause,
  RefreshCw
} from "lucide-react";
import { useRealTimeIntegration } from '@/hooks/useRealTimeIntegration';

const RealTimeMonitor = () => {
  const { 
    liveData, 
    isLiveMode, 
    toggleLiveMode, 
    getSystemMetrics, 
    detections,
    cameras,
    isBackendConnected 
  } = useRealTimeIntegration();

  const [lastUpdate, setLastUpdate] = useState(new Date());
  const systemMetrics = getSystemMetrics();

  // Update timestamp when data changes
  useEffect(() => {
    setLastUpdate(new Date());
  }, [detections, liveData]);

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Real-time Control Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 sm:p-4 bg-slate-800/30 rounded-lg border border-slate-700">
        <div className="flex items-center space-x-3">
          <Monitor className="w-5 h-5 text-blue-400" />
          <div>
            <h2 className="text-lg font-bold text-white">Real-Time ANPR Monitor</h2>
            <p className="text-sm text-slate-400">
              Live processing • Last update: {lastUpdate.toLocaleTimeString()}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 flex-wrap">
          <Badge 
            variant={isBackendConnected ? "default" : "secondary"}
            className={`${isBackendConnected ? 
              'bg-green-500/20 text-green-400 border-green-500/30' : 
              'bg-orange-500/20 text-orange-400 border-orange-500/30'
            } text-xs`}
          >
            {isBackendConnected ? 'Python AI Online' : 'Mock Mode'}
          </Badge>
          
          <Button
            variant={isLiveMode ? "default" : "outline"}
            size="sm"
            onClick={toggleLiveMode}
            className="flex items-center space-x-2"
          >
            {isLiveMode ? (
              <>
                <Pause className="w-3 h-3" />
                <span className="hidden sm:inline">Pause Live</span>
              </>
            ) : (
              <>
                <Play className="w-3 h-3" />
                <span className="hidden sm:inline">Start Live</span>
              </>
            )}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setLastUpdate(new Date())}
            className="flex items-center space-x-2"
          >
            <RefreshCw className="w-3 h-3" />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
        </div>
      </div>

      {/* System Metrics Grid - Responsive */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 lg:gap-4">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-3 lg:p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-400">Total</div>
                <div className="text-lg lg:text-xl font-bold text-white">{systemMetrics.totalDetections}</div>
              </div>
              <Camera className="w-4 h-4 lg:w-5 lg:h-5 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-3 lg:p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-400">Alerts</div>
                <div className="text-lg lg:text-xl font-bold text-white">{systemMetrics.flaggedDetections}</div>
              </div>
              <AlertTriangle className="w-4 h-4 lg:w-5 lg:h-5 text-red-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-3 lg:p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-400">Accuracy</div>
                <div className="text-lg lg:text-xl font-bold text-white">{systemMetrics.avgConfidence}%</div>
              </div>
              <CheckCircle className="w-4 h-4 lg:w-5 lg:h-5 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-3 lg:p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-400">Cameras</div>
                <div className="text-lg lg:text-xl font-bold text-white">
                  {systemMetrics.activeCameras}/{systemMetrics.totalCameras}
                </div>
              </div>
              <Activity className="w-4 h-4 lg:w-5 lg:h-5 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-3 lg:p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-400">Queue</div>
                <div className="text-lg lg:text-xl font-bold text-white">{systemMetrics.processingQueue}</div>
              </div>
              <Clock className="w-4 h-4 lg:w-5 lg:h-5 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-3 lg:p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-400">Uptime</div>
                <div className="text-lg lg:text-xl font-bold text-white">{systemMetrics.systemUptime}</div>
              </div>
              <Cpu className="w-4 h-4 lg:w-5 lg:h-5 text-cyan-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-3 lg:p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-400">Status</div>
                <div className="text-sm lg:text-base font-bold text-green-400">
                  {isLiveMode ? 'LIVE' : 'PAUSED'}
                </div>
              </div>
              <Zap className={`w-4 h-4 lg:w-5 lg:h-5 ${isLiveMode ? 'text-green-400 animate-pulse' : 'text-gray-400'}`} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Live Camera Feed Status - Responsive */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between text-base lg:text-lg">
            <span className="flex items-center">
              <Activity className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
              Live Camera Analytics
            </span>
            <Badge 
              variant="secondary" 
              className={`${isLiveMode ? 
                'bg-green-500/20 text-green-400 border-green-500/30 animate-pulse' : 
                'bg-gray-500/20 text-gray-400 border-gray-500/30'
              } text-xs`}
            >
              {isLiveMode ? 'REAL-TIME' : 'PAUSED'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700">
                  <TableHead className="text-slate-300 text-xs lg:text-sm">Camera</TableHead>
                  <TableHead className="text-slate-300 text-xs lg:text-sm">Location</TableHead>
                  <TableHead className="text-slate-300 text-xs lg:text-sm">Recent Detections</TableHead>
                  <TableHead className="text-slate-300 text-xs lg:text-sm">Queue</TableHead>
                  <TableHead className="text-slate-300 text-xs lg:text-sm">Accuracy</TableHead>
                  <TableHead className="text-slate-300 text-xs lg:text-sm">Last Detection</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {liveData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 lg:py-8 text-slate-400">
                      <Camera className="w-8 h-8 lg:w-12 lg:h-12 mx-auto mb-3 opacity-50" />
                      <p className="text-sm lg:text-base">No camera data available</p>
                      <p className="text-xs lg:text-sm">Start live mode to see real-time analytics</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  liveData.map((cameraData) => {
                    const camera = cameras.find(c => c.camera_id === cameraData.camera_id);
                    return (
                      <TableRow key={cameraData.camera_id} className="border-slate-700 hover:bg-slate-700/30">
                        <TableCell className="font-mono text-white font-bold text-xs lg:text-sm">
                          {cameraData.camera_id}
                        </TableCell>
                        <TableCell className="text-slate-300 text-xs lg:text-sm">
                          {camera?.location || 'Unknown'}
                        </TableCell>
                        <TableCell className="text-slate-300 text-xs lg:text-sm">
                          <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                            {cameraData.detection_count}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-slate-300 text-xs lg:text-sm">
                          {cameraData.processing_queue > 0 ? (
                            <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                              {cameraData.processing_queue}
                            </Badge>
                          ) : (
                            <span className="text-green-400">Clear</span>
                          )}
                        </TableCell>
                        <TableCell className="text-slate-300 text-xs lg:text-sm">
                          <Badge 
                            variant={cameraData.accuracy_rate > 95 ? "default" : "secondary"}
                            className={cameraData.accuracy_rate > 95 ? 
                              "bg-green-500/20 text-green-400 border-green-500/30" : 
                              "bg-orange-500/20 text-orange-400 border-orange-500/30"
                            }
                          >
                            {cameraData.accuracy_rate}%
                          </Badge>
                        </TableCell>
                        <TableCell className="text-slate-300 text-xs lg:text-sm">
                          {cameraData.last_detection ? 
                            new Date(cameraData.last_detection).toLocaleTimeString() : 
                            'No recent activity'
                          }
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Recent Real-time Detections */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white text-base lg:text-lg">Latest Real-time Detections</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 lg:space-y-3 max-h-64 lg:max-h-80 overflow-y-auto">
            {detections.slice(0, 10).map((detection, index) => (
              <div 
                key={detection.id}
                className={`flex items-center justify-between p-2 lg:p-3 bg-slate-700/30 rounded-lg border border-slate-600/50 
                  ${index === 0 && isLiveMode ? 'animate-pulse bg-blue-500/10 border-blue-500/30' : ''}
                `}
              >
                <div className="flex-1">
                  <div className="font-mono text-white font-bold text-sm lg:text-base">
                    {detection.plate_number}
                  </div>
                  <div className="text-xs lg:text-sm text-slate-400">
                    {detection.camera_id} • {detection.location}
                  </div>
                </div>
                <div className="text-right">
                  <Badge 
                    variant={detection.status === "flagged" ? "destructive" : "secondary"}
                    className={`mb-1 text-xs ${
                      detection.status === "flagged" ? 
                      "animate-pulse" : 
                      detection.status === "cleared" ? 
                      "bg-green-500/20 text-green-400 border-green-500/30" : ""
                    }`}
                  >
                    {detection.status}
                  </Badge>
                  <div className="text-xs lg:text-sm text-slate-400">
                    {detection.confidence}% • {new Date(detection.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RealTimeMonitor;
