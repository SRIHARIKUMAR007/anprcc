
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Shield, Clock, CheckCircle, XCircle, Bell } from "lucide-react";

const AlertsPanel = () => {
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      type: "security",
      priority: "high",
      title: "Blacklisted Vehicle Detected",
      description: "Vehicle XYZ-9876 (stolen) detected at Highway Junction",
      timestamp: "2024-06-10 10:43:15",
      status: "active",
      location: "Highway Junction",
      action: "Law enforcement notified"
    },
    {
      id: 2,
      type: "system",
      priority: "medium",
      title: "Camera Maintenance Required",
      description: "Camera CAM-03 showing reduced image quality",
      timestamp: "2024-06-10 09:15:22",
      status: "acknowledged",
      location: "Parking Entrance",
      action: "Maintenance scheduled"
    },
    {
      id: 3,
      type: "traffic",
      priority: "low",
      title: "High Traffic Volume",
      description: "Unusual traffic density at Main Gate (150% above normal)",
      timestamp: "2024-06-10 08:30:45",
      status: "resolved",
      location: "Main Gate",
      action: "Traffic flow normalized"
    },
    {
      id: 4,
      type: "security",
      priority: "critical",
      title: "Unauthorized Access Attempt",
      description: "Multiple failed plate recognition attempts from unknown source",
      timestamp: "2024-06-10 07:45:12",
      status: "investigating",
      location: "Network Controller",
      action: "Security team investigating"
    },
    {
      id: 5,
      type: "system",
      priority: "high",
      title: "Database Connection Issue",
      description: "Intermittent connection failures to backup database",
      timestamp: "2024-06-10 06:22:33",
      status: "active",
      location: "Data Center",
      action: "IT team notified"
    }
  ]);

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "security":
        return <Shield className="w-5 h-5" />;
      case "system":
        return <AlertTriangle className="w-5 h-5" />;
      case "traffic":
        return <Clock className="w-5 h-5" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "high":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      case "medium":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "low":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/30";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <AlertTriangle className="w-4 h-4 text-red-400" />;
      case "acknowledged":
        return <Clock className="w-4 h-4 text-yellow-400" />;
      case "investigating":
        return <Shield className="w-4 h-4 text-blue-400" />;
      case "resolved":
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      default:
        return <XCircle className="w-4 h-4 text-slate-400" />;
    }
  };

  const updateAlertStatus = (id: number, newStatus: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === id ? { ...alert, status: newStatus } : alert
    ));
  };

  const activeAlertsCount = alerts.filter(alert => alert.status === "active").length;
  const criticalAlertsCount = alerts.filter(alert => alert.priority === "critical").length;

  return (
    <div className="space-y-6">
      {/* Alert Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-white">{alerts.length}</div>
                <div className="text-sm text-slate-400">Total Alerts</div>
              </div>
              <Bell className="w-6 h-6 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-red-400">{activeAlertsCount}</div>
                <div className="text-sm text-slate-400">Active</div>
              </div>
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-orange-400">{criticalAlertsCount}</div>
                <div className="text-sm text-slate-400">Critical</div>
              </div>
              <Shield className="w-6 h-6 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-400">{alerts.filter(a => a.status === "resolved").length}</div>
                <div className="text-sm text-slate-400">Resolved</div>
              </div>
              <CheckCircle className="w-6 h-6 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts List */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Security & System Alerts
            </CardTitle>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                Mark All Read
              </Button>
              <Button variant="outline" size="sm">
                Clear Resolved
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div 
                key={alert.id} 
                className={`p-4 rounded-lg border transition-all ${
                  alert.status === "active" ? "bg-red-500/10 border-red-500/30" :
                  alert.status === "investigating" ? "bg-blue-500/10 border-blue-500/30" :
                  alert.status === "acknowledged" ? "bg-yellow-500/10 border-yellow-500/30" :
                  "bg-slate-700/30 border-slate-600/50"
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${
                      alert.type === "security" ? "bg-red-500/20" :
                      alert.type === "system" ? "bg-orange-500/20" :
                      "bg-blue-500/20"
                    }`}>
                      {getAlertIcon(alert.type)}
                    </div>
                    <div>
                      <div className="font-semibold text-white">{alert.title}</div>
                      <div className="text-slate-300 text-sm">{alert.description}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getPriorityColor(alert.priority)}>
                      {alert.priority}
                    </Badge>
                    {getStatusIcon(alert.status)}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-slate-400">Time: </span>
                    <span className="text-slate-300">{alert.timestamp}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Location: </span>
                    <span className="text-slate-300">{alert.location}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Action: </span>
                    <span className="text-slate-300">{alert.action}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-600/50">
                  <div className="flex items-center space-x-2">
                    <span className="text-slate-400 text-sm">Status:</span>
                    <Badge 
                      variant="secondary" 
                      className={
                        alert.status === "active" ? "bg-red-500/20 text-red-400" :
                        alert.status === "investigating" ? "bg-blue-500/20 text-blue-400" :
                        alert.status === "acknowledged" ? "bg-yellow-500/20 text-yellow-400" :
                        "bg-green-500/20 text-green-400"
                      }
                    >
                      {alert.status}
                    </Badge>
                  </div>
                  <div className="flex space-x-2">
                    {alert.status === "active" && (
                      <>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => updateAlertStatus(alert.id, "acknowledged")}
                        >
                          Acknowledge
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => updateAlertStatus(alert.id, "investigating")}
                        >
                          Investigate
                        </Button>
                      </>
                    )}
                    {(alert.status === "acknowledged" || alert.status === "investigating") && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => updateAlertStatus(alert.id, "resolved")}
                      >
                        Resolve
                      </Button>
                    )}
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

export default AlertsPanel;
