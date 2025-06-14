
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle, Clock, X, Bell, Shield, Activity } from "lucide-react";
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
  location?: string;
}

interface LiveAlertsProps {
  selectedCamera: string;
  isLive: boolean;
}

const LiveAlerts = ({ selectedCamera, isLive }: LiveAlertsProps) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { detections, isConnected } = useSupabaseRealTimeData();

  // Generate alerts based on live detection data with enhanced logic
  useEffect(() => {
    if (!isLive || !isConnected || detections.length === 0) return;

    console.log('Processing alerts from live detections:', detections.length);

    // Process latest detections for alerts
    const latestDetections = detections.slice(0, 20);
    
    latestDetections.forEach(detection => {
      const existingAlert = alerts.find(alert => 
        alert.plateNumber === detection.plate_number && 
        Math.abs(new Date(alert.timestamp).getTime() - new Date(detection.timestamp).getTime()) < 5000
      );

      if (!existingAlert) {
        let alertType: 'critical' | 'warning' | 'info' = 'info';
        let message = '';
        
        // Enhanced alert generation logic
        if (detection.status === 'flagged') {
          alertType = 'critical';
          message = `🚨 FLAGGED VEHICLE: ${detection.plate_number} detected at ${detection.location}`;
        } else if (detection.confidence < 60) {
          alertType = 'warning';
          message = `⚠️ Low confidence detection: ${detection.plate_number} (${detection.confidence}% confidence)`;
        } else if (detection.confidence > 98) {
          alertType = 'info';
          message = `✅ High confidence detection: ${detection.plate_number} (${detection.confidence}% confidence)`;
        } else if (detection.confidence >= 85) {
          alertType = 'info';
          message = `📍 Vehicle detected: ${detection.plate_number} at ${detection.location}`;
        }

        if (message) {
          const newAlert: Alert = {
            id: `alert-${detection.id}-${Date.now()}`,
            type: alertType,
            message,
            timestamp: detection.timestamp,
            cameraId: detection.camera_id,
            plateNumber: detection.plate_number,
            location: detection.location,
            acknowledged: false,
            autoResolve: alertType === 'info' && detection.confidence < 95
          };
          
          setAlerts(prev => {
            const filtered = prev.filter(a => 
              !(a.plateNumber === newAlert.plateNumber && a.cameraId === newAlert.cameraId)
            );
            return [newAlert, ...filtered.slice(0, 24)];
          });
          
          if (alertType !== 'info' || detection.confidence > 95) {
            setUnreadCount(prev => prev + 1);
          }
        }
      }
    });

    // Auto-resolve info alerts after 20 seconds
    const autoResolveTimer = setTimeout(() => {
      setAlerts(prev => prev.map(alert => {
        if (alert.autoResolve && !alert.acknowledged && 
            Date.now() - new Date(alert.timestamp).getTime() > 20000) {
          return { ...alert, acknowledged: true };
        }
        return alert;
      }));
    }, 2000);

    return () => clearTimeout(autoResolveTimer);
  }, [detections, isLive, isConnected]);

  // Generate system-level alerts based on patterns
  useEffect(() => {
    if (!isLive || !isConnected || detections.length < 5) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const recentDetections = detections.filter(d => 
        now - new Date(d.timestamp).getTime() < 120000 // Last 2 minutes
      );

      // Alert for multiple flagged vehicles
      const flaggedCount = recentDetections.filter(d => d.status === 'flagged').length;
      if (flaggedCount >= 2) {
        const alertId = `system-flagged-${Date.now()}`;
        const existingAlert = alerts.find(a => a.message.includes('Multiple flagged vehicles'));
        
        if (!existingAlert) {
          const systemAlert: Alert = {
            id: alertId,
            type: 'critical',
            message: `🔴 SECURITY ALERT: ${flaggedCount} flagged vehicles detected in last 2 minutes`,
            timestamp: new Date().toISOString(),
            cameraId: 'SYSTEM',
            acknowledged: false,
            autoResolve: false
          };
          
          setAlerts(prev => [systemAlert, ...prev.slice(0, 24)]);
          setUnreadCount(prev => prev + 1);
        }
      }

      // Alert for low confidence pattern
      const lowConfidenceCount = recentDetections.filter(d => d.confidence < 70).length;
      if (lowConfidenceCount >= 3) {
        const alertId = `system-lowconf-${Date.now()}`;
        const existingAlert = alerts.find(a => a.message.includes('Multiple low confidence'));
        
        if (!existingAlert) {
          const systemAlert: Alert = {
            id: alertId,
            type: 'warning',
            message: `⚠️ QUALITY ALERT: ${lowConfidenceCount} low confidence detections - check camera quality`,
            timestamp: new Date().toISOString(),
            cameraId: 'SYSTEM',
            acknowledged: false,
            autoResolve: true
          };
          
          setAlerts(prev => [systemAlert, ...prev.slice(0, 24)]);
          setUnreadCount(prev => prev + 1);
        }
      }

      // Alert for unusual activity patterns
      const hourlyDetections = recentDetections.length;
      const avgHourlyRate = detections.length > 0 ? detections.length / 24 : 5;
      
      if (hourlyDetections > avgHourlyRate * 3) {
        const alertId = `system-highact-${Date.now()}`;
        const existingAlert = alerts.find(a => a.message.includes('Unusual high activity'));
        
        if (!existingAlert) {
          const systemAlert: Alert = {
            id: alertId,
            type: 'warning',
            message: `📈 ACTIVITY ALERT: Unusual high activity detected (${hourlyDetections} detections in 2 min)`,
            timestamp: new Date().toISOString(),
            cameraId: 'SYSTEM',
            acknowledged: false,
            autoResolve: true
          };
          
          setAlerts(prev => [systemAlert, ...prev.slice(0, 24)]);
          setUnreadCount(prev => prev + 1);
        }
      }

      // Camera-specific alerts
      const cameraGroups = recentDetections.reduce((acc, d) => {
        acc[d.camera_id] = (acc[d.camera_id] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      Object.entries(cameraGroups).forEach(([cameraId, count]) => {
        if (count === 0 && detections.some(d => d.camera_id === cameraId)) {
          const alertId = `camera-inactive-${cameraId}-${Date.now()}`;
          const existingAlert = alerts.find(a => a.message.includes(`Camera ${cameraId} inactive`));
          
          if (!existingAlert) {
            const cameraAlert: Alert = {
              id: alertId,
              type: 'warning',
              message: `📹 CAMERA ALERT: Camera ${cameraId} inactive - no detections in 2 minutes`,
              timestamp: new Date().toISOString(),
              cameraId: cameraId,
              acknowledged: false,
              autoResolve: true
            };
            
            setAlerts(prev => [cameraAlert, ...prev.slice(0, 24)]);
            setUnreadCount(prev => prev + 1);
          }
        }
      });

    }, 45000); // Check every 45 seconds

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

  const acknowledgeAllAlerts = () => {
    setAlerts(prev => prev.map(alert => ({ ...alert, acknowledged: true })));
    setUnreadCount(0);
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
      case 'critical': return <Shield className="w-4 h-4 animate-pulse" />;
      case 'warning': return <AlertTriangle className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  const activeAlerts = alerts.filter(alert => !alert.acknowledged);
  const acknowledgedAlerts = alerts.filter(alert => alert.acknowledged);
  const criticalAlerts = activeAlerts.filter(alert => alert.type === 'critical');
  const warningAlerts = activeAlerts.filter(alert => alert.type === 'warning');

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
              {isLive && isConnected ? 'LIVE' : 'OFFLINE'}
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Alert Summary */}
        {activeAlerts.length > 0 && (
          <div className="flex items-center justify-between p-2 bg-slate-700/30 rounded-lg">
            <div className="flex items-center space-x-4 text-xs">
              <div className="flex items-center space-x-1">
                <Shield className="w-3 h-3 text-red-400" />
                <span className="text-red-400">{criticalAlerts.length} Critical</span>
              </div>
              <div className="flex items-center space-x-1">
                <AlertTriangle className="w-3 h-3 text-yellow-400" />
                <span className="text-yellow-400">{warningAlerts.length} Warning</span>
              </div>
            </div>
            {unreadCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={acknowledgeAllAlerts}
                className="h-6 text-xs text-green-400 border-green-500/30 hover:bg-green-500/20"
              >
                Ack All
              </Button>
            )}
          </div>
        )}

        {/* Active Alerts */}
        {activeAlerts.length > 0 && (
          <div className="space-y-2">
            <div className="text-slate-400 text-xs font-medium flex items-center justify-between">
              <span>Active Alerts ({activeAlerts.length})</span>
              {isConnected && <Activity className="w-3 h-3 animate-pulse text-green-400" />}
            </div>
            <div className="max-h-48 overflow-y-auto space-y-2">
              {activeAlerts.map((alert) => (
                <div key={alert.id} className={`border rounded-lg p-3 ${getAlertColor(alert.type, alert.acknowledged)}`}>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {getAlertIcon(alert.type, alert.acknowledged)}
                      <Badge variant="secondary" className={getAlertColor(alert.type, alert.acknowledged)}>
                        {alert.type.toUpperCase()}
                      </Badge>
                      {alert.type === 'critical' && (
                        <Badge variant="destructive" className="bg-red-500 text-white text-xs animate-pulse">
                          URGENT
                        </Badge>
                      )}
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
                  
                  <div className="text-sm font-medium mb-2">{alert.message}</div>
                  
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                      <span className="text-slate-400">{alert.cameraId}</span>
                      {alert.plateNumber && (
                        <span className="font-mono text-white bg-slate-700 px-1 rounded">
                          {alert.plateNumber}
                        </span>
                      )}
                      {alert.location && (
                        <span className="text-slate-300">@ {alert.location}</span>
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
            <div className="text-slate-400 text-xs font-medium">Recent (Acknowledged - {acknowledgedAlerts.length})</div>
            <div className="max-h-32 overflow-y-auto space-y-1">
              {acknowledgedAlerts.slice(0, 5).map((alert) => (
                <div key={alert.id} className="flex items-center justify-between bg-slate-700/20 rounded px-2 py-1">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-3 h-3 text-green-400" />
                    <span className="text-slate-400 text-xs truncate max-w-48">{alert.message}</span>
                  </div>
                  <div className="text-xs text-slate-500">
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
            <p className="text-xs mt-1">
              {isConnected ? 'System monitoring live data stream...' : 'Waiting for live connection...'}
            </p>
            {isConnected && (
              <div className="mt-2 text-xs text-green-400 flex items-center justify-center">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></div>
                Live monitoring active
              </div>
            )}
          </div>
        )}

        {/* Connection Status Footer */}
        <div className="pt-2 border-t border-slate-600">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">
              Data: {detections.length} detections
            </span>
            <span className={`flex items-center ${isConnected ? 'text-green-400' : 'text-red-400'}`}>
              <div className={`w-2 h-2 rounded-full mr-1 ${isConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
              {isConnected ? 'Live Feed Active' : 'Demo Mode'}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LiveAlerts;
