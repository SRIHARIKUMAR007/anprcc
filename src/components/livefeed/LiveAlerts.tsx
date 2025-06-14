
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle, Clock, X, Bell } from "lucide-react";
import { useSupabaseRealTimeData } from '@/hooks/useSupabaseRealTimeData';

interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  message: string;
  timestamp: string;
  cameraId: string;
  plateNumber?: string;
  acknowledged: boolean;
  autoResolve?: boolean;
}

interface LiveAlertsProps {
  selectedCamera: string;
  isLive: boolean;
}

const LiveAlerts = ({ selectedCamera, isLive }: LiveAlertsProps) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { detections, isConnected } = useSupabaseRealTimeData();

  // Generate alerts based on live detection data
  useEffect(() => {
    if (!isLive || !isConnected) return;

    // Check latest detections for alert conditions
    const latestDetections = detections.slice(0, 10);
    
    latestDetections.forEach(detection => {
      const existingAlert = alerts.find(alert => 
        alert.plateNumber === detection.plate_number && 
        alert.timestamp === detection.timestamp
      );

      if (!existingAlert) {
        let alertType: 'critical' | 'warning' | 'info' = 'info';
        let message = '';
        
        // Generate alerts based on detection status and confidence
        if (detection.status === 'flagged') {
          alertType = 'critical';
          message = `Flagged vehicle detected: ${detection.plate_number}`;
        } else if (detection.confidence < 70) {
          alertType = 'warning';
          message = `Low confidence detection: ${detection.plate_number}`;
        } else if (detection.confidence > 95) {
          alertType = 'info';
          message = `High confidence detection: ${detection.plate_number}`;
        }

        if (message) {
          const newAlert: Alert = {
            id: `alert-${detection.id}`,
            type: alertType,
            message,
            timestamp: detection.timestamp,
            cameraId: detection.camera_id,
            plateNumber: detection.plate_number,
            acknowledged: false,
            autoResolve: alertType === 'info'
          };
          
          setAlerts(prev => {
            const filtered = prev.filter(a => a.id !== newAlert.id);
            return [newAlert, ...filtered.slice(0, 19)];
          });
          
          if (alertType !== 'info') {
            setUnreadCount(prev => prev + 1);
          }
        }
      }
    });

    // Auto-resolve info alerts after 15 seconds
    const autoResolveTimer = setTimeout(() => {
      setAlerts(prev => prev.map(alert => {
        if (alert.autoResolve && !alert.acknowledged && 
            Date.now() - new Date(alert.timestamp).getTime() > 15000) {
          return { ...alert, acknowledged: true };
        }
        return alert;
      }));
    }, 1000);

    return () => clearTimeout(autoResolveTimer);
  }, [detections, isLive, isConnected]);

  // Generate additional system alerts based on patterns
  useEffect(() => {
    if (!isLive || !isConnected) return;

    const interval = setInterval(() => {
      const recentDetections = detections.filter(d => 
        Date.now() - new Date(d.timestamp).getTime() < 60000 // Last minute
      );

      // Alert if too many flagged vehicles in short time
      const flaggedCount = recentDetections.filter(d => d.status === 'flagged').length;
      if (flaggedCount >= 3) {
        const alertId = `system-alert-${Date.now()}`;
        const existingAlert = alerts.find(a => a.message.includes('Multiple flagged vehicles'));
        
        if (!existingAlert) {
          const systemAlert: Alert = {
            id: alertId,
            type: 'critical',
            message: `Multiple flagged vehicles detected (${flaggedCount} in last minute)`,
            timestamp: new Date().toISOString(),
            cameraId: 'SYSTEM',
            acknowledged: false,
            autoResolve: false
          };
          
          setAlerts(prev => [systemAlert, ...prev.slice(0, 19)]);
          setUnreadCount(prev => prev + 1);
        }
      }

      // Alert if detection rate is unusually low
      if (recentDetections.length < 2 && detections.length > 10) {
        const alertId = `low-activity-${Date.now()}`;
        const existingAlert = alerts.find(a => a.message.includes('Low detection activity'));
        
        if (!existingAlert) {
          const activityAlert: Alert = {
            id: alertId,
            type: 'warning',
            message: 'Low detection activity - possible camera issues',
            timestamp: new Date().toISOString(),
            cameraId: 'SYSTEM',
            acknowledged: false,
            autoResolve: true
          };
          
          setAlerts(prev => [activityAlert, ...prev.slice(0, 19)]);
          setUnreadCount(prev => prev + 1);
        }
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [detections, isLive, isConnected, alerts]);

  const acknowledgeAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, acknowledged: true } : alert
    ));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const clearAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const getAlertColor = (type: string, acknowledged: boolean) => {
    if (acknowledged) return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    
    switch (type) {
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30 animate-pulse';
      case 'warning': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
  };

  const getAlertIcon = (type: string, acknowledged: boolean) => {
    if (acknowledged) return <CheckCircle className="w-4 h-4" />;
    
    switch (type) {
      case 'critical': return <AlertTriangle className="w-4 h-4 animate-pulse" />;
      case 'warning': return <AlertTriangle className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  const activeAlerts = alerts.filter(alert => !alert.acknowledged);
  const acknowledgedAlerts = alerts.filter(alert => alert.acknowledged);

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white text-sm flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4" />
            <span>Live Security Alerts</span>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="bg-red-500 text-white animate-pulse">
                {unreadCount}
              </Badge>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isLive && isConnected ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`}></div>
            <span className="text-xs text-slate-400">
              {isLive && isConnected ? 'LIVE DATA' : 'PAUSED'}
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Active Alerts */}
        {activeAlerts.length > 0 && (
          <div className="space-y-2">
            <div className="text-slate-400 text-xs font-medium">Active Alerts</div>
            <div className="max-h-40 overflow-y-auto space-y-2">
              {activeAlerts.map((alert) => (
                <div key={alert.id} className={`border rounded-lg p-3 ${getAlertColor(alert.type, alert.acknowledged)}`}>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {getAlertIcon(alert.type, alert.acknowledged)}
                      <Badge variant="secondary" className={getAlertColor(alert.type, alert.acknowledged)}>
                        {alert.type.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => acknowledgeAlert(alert.id)}
                        className="h-6 w-6 p-0 text-green-400 hover:bg-green-500/20"
                      >
                        <CheckCircle className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => clearAlert(alert.id)}
                        className="h-6 w-6 p-0 text-red-400 hover:bg-red-500/20"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="text-sm font-medium mb-1">{alert.message}</div>
                  
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                      <span className="text-slate-400">{alert.cameraId}</span>
                      {alert.plateNumber && (
                        <span className="font-mono text-white bg-slate-700 px-1 rounded">
                          {alert.plateNumber}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-1 text-slate-400">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(alert.timestamp).toLocaleTimeString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Acknowledged Alerts */}
        {acknowledgedAlerts.length > 0 && (
          <div className="space-y-2">
            <div className="text-slate-400 text-xs font-medium">Recent (Acknowledged)</div>
            <div className="max-h-32 overflow-y-auto space-y-1">
              {acknowledgedAlerts.slice(0, 3).map((alert) => (
                <div key={alert.id} className="flex items-center justify-between bg-slate-700/20 rounded px-2 py-1">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-3 h-3 text-green-400" />
                    <span className="text-slate-400 text-xs">{alert.message}</span>
                  </div>
                  <div className="text-xs text-slate-400">
                    {new Date(alert.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No alerts state */}
        {alerts.length === 0 && (
          <div className="text-center py-6 text-slate-400">
            <AlertTriangle className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No alerts detected</p>
            <p className="text-xs">
              {isConnected ? 'System monitoring live data' : 'Waiting for connection'}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LiveAlerts;
