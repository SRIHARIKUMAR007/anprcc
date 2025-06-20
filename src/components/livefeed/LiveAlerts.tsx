
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle, Clock, X, Bell } from "lucide-react";

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

  const alertTypes = [
    { type: 'critical', message: 'Suspicious vehicle detected', probability: 0.02 },
    { type: 'warning', message: 'Vehicle overspeeding', probability: 0.05 },
    { type: 'warning', message: 'License plate obscured', probability: 0.03 },
    { type: 'info', message: 'Vehicle count threshold exceeded', probability: 0.08 },
    { type: 'critical', message: 'Unauthorized vehicle in restricted zone', probability: 0.01 },
    { type: 'warning', message: 'Vehicle stopped in no-parking zone', probability: 0.04 },
    { type: 'info', message: 'Peak traffic detected', probability: 0.06 },
    { type: 'critical', message: 'Emergency vehicle priority needed', probability: 0.01 }
  ];

  const generatePlate = () => {
    const formats = ['TN-01-AB-', 'TN-09-CD-', 'KA-05-EF-', 'AP-16-GH-'];
    const format = formats[Math.floor(Math.random() * formats.length)];
    const number = String(Math.floor(1000 + Math.random() * 9000));
    return format + number;
  };

  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      // Generate random alerts based on probability
      alertTypes.forEach(alertType => {
        if (Math.random() < alertType.probability) {
          const newAlert: Alert = {
            id: `alert-${Date.now()}-${Math.random()}`,
            type: alertType.type as 'critical' | 'warning' | 'info',
            message: alertType.message,
            timestamp: new Date().toISOString(),
            cameraId: selectedCamera,
            plateNumber: Math.random() > 0.5 ? generatePlate() : undefined,
            acknowledged: false,
            autoResolve: alertType.type === 'info' || Math.random() > 0.7
          };
          
          setAlerts(prev => [newAlert, ...prev.slice(0, 19)]);
          setUnreadCount(prev => prev + 1);
        }
      });

      // Auto-resolve some alerts
      setAlerts(prev => prev.map(alert => {
        if (alert.autoResolve && !alert.acknowledged && 
            Date.now() - new Date(alert.timestamp).getTime() > 10000) {
          return { ...alert, acknowledged: true };
        }
        return alert;
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, [isLive, selectedCamera]);

  const acknowledgeAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, acknowledged: true } : alert
    ));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const clearAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
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
            <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`}></div>
            <span className="text-xs text-slate-400">
              {isLive ? 'MONITORING' : 'PAUSED'}
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
            <p className="text-xs">System monitoring active</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LiveAlerts;
