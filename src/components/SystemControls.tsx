
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { 
  Power, 
  RotateCcw, 
  Download, 
  FileText, 
  Settings, 
  Database, 
  Camera,
  Network,
  Shield,
  AlertTriangle,
  CheckCircle,
  Activity,
  HardDrive,
  Wifi
} from "lucide-react";
import { toast } from "sonner";

const SystemControls = () => {
  const [systemStatus, setSystemStatus] = useState({
    cameras: true,
    database: true,
    network: true,
    anpr: true,
    alerts: true,
    backup: false,
    autoRestart: true,
    debugMode: false
  });

  const [isRestarting, setIsRestarting] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [isBackingUp, setIsBackingUp] = useState(false);

  const handleSystemRestart = async () => {
    setIsRestarting(true);
    toast.info("Initiating system restart...");
    
    // Simulate restart process
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setIsRestarting(false);
    toast.success("System restarted successfully!");
  };

  const handleGenerateReport = async () => {
    setIsGeneratingReport(true);
    toast.info("Generating system report...");
    
    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Create and download PDF report
    const reportData = generateReportData();
    downloadPDFReport(reportData);
    
    setIsGeneratingReport(false);
    toast.success("Report generated and downloaded!");
  };

  const handleBackup = async () => {
    setIsBackingUp(true);
    toast.info("Starting system backup...");
    
    // Simulate backup process
    await new Promise(resolve => setTimeout(resolve, 4000));
    
    setIsBackingUp(false);
    toast.success("Backup completed successfully!");
  };

  const generateReportData = () => {
    return {
      timestamp: new Date().toISOString(),
      systemInfo: {
        uptime: "15h 42m",
        version: "ANPR v2.1.0",
        cameras: "8/10 active",
        detections: "2,847 today",
        accuracy: "96.8%"
      },
      performance: {
        cpuUsage: "68%",
        memoryUsage: "72%",
        diskUsage: "45%",
        networkLatency: "23ms"
      },
      alerts: [
        { type: "Warning", message: "Camera CAM-03 offline", timestamp: "10:30:15" },
        { type: "Info", message: "Daily backup completed", timestamp: "06:00:00" },
        { type: "Error", message: "Network latency spike detected", timestamp: "09:15:22" }
      ]
    };
  };

  const downloadPDFReport = (data: any) => {
    // Create HTML content for the report
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>ANPR System Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
            .header { text-align: center; border-bottom: 2px solid #3b82f6; padding-bottom: 10px; margin-bottom: 20px; }
            .section { margin-bottom: 20px; }
            .metric { display: inline-block; margin: 10px; padding: 10px; border: 1px solid #ddd; border-radius: 5px; }
            .alert { padding: 8px; margin: 5px 0; border-radius: 4px; }
            .warning { background-color: #fef3c7; border-left: 4px solid #f59e0b; }
            .error { background-color: #fee2e2; border-left: 4px solid #ef4444; }
            .info { background-color: #dbeafe; border-left: 4px solid #3b82f6; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>ANPR System Report</h1>
            <p>Generated on: ${new Date().toLocaleString()}</p>
          </div>
          
          <div class="section">
            <h2>System Information</h2>
            <div class="metric"><strong>Uptime:</strong> ${data.systemInfo.uptime}</div>
            <div class="metric"><strong>Version:</strong> ${data.systemInfo.version}</div>
            <div class="metric"><strong>Active Cameras:</strong> ${data.systemInfo.cameras}</div>
            <div class="metric"><strong>Detections Today:</strong> ${data.systemInfo.detections}</div>
            <div class="metric"><strong>Accuracy:</strong> ${data.systemInfo.accuracy}</div>
          </div>
          
          <div class="section">
            <h2>Performance Metrics</h2>
            <div class="metric"><strong>CPU Usage:</strong> ${data.performance.cpuUsage}</div>
            <div class="metric"><strong>Memory Usage:</strong> ${data.performance.memoryUsage}</div>
            <div class="metric"><strong>Disk Usage:</strong> ${data.performance.diskUsage}</div>
            <div class="metric"><strong>Network Latency:</strong> ${data.performance.networkLatency}</div>
          </div>
          
          <div class="section">
            <h2>Recent Alerts</h2>
            ${data.alerts.map((alert: any) => `
              <div class="alert ${alert.type.toLowerCase()}">
                <strong>${alert.type}:</strong> ${alert.message} <em>(${alert.timestamp})</em>
              </div>
            `).join('')}
          </div>
        </body>
      </html>
    `;

    // Create blob and download
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `anpr-system-report-${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const toggleService = (service: keyof typeof systemStatus) => {
    setSystemStatus(prev => ({
      ...prev,
      [service]: !prev[service]
    }));
    toast.info(`${service} ${systemStatus[service] ? 'disabled' : 'enabled'}`);
  };

  return (
    <div className="space-y-6">
      {/* System Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-green-900/20 to-green-800/10 border-green-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-400">Online</div>
                <div className="text-sm text-green-300">System Status</div>
              </div>
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-900/20 to-blue-800/10 border-blue-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-blue-400">15h 42m</div>
                <div className="text-sm text-blue-300">Uptime</div>
              </div>
              <Activity className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-900/20 to-purple-800/10 border-purple-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-purple-400">68%</div>
                <div className="text-sm text-purple-300">CPU Load</div>
              </div>
              <HardDrive className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-cyan-900/20 to-cyan-800/10 border-cyan-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-cyan-400">450 Mbps</div>
                <div className="text-sm text-cyan-300">Network</div>
              </div>
              <Wifi className="w-8 h-8 text-cyan-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="services" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 bg-slate-800/50">
          <TabsTrigger value="services" className="data-[state=active]:bg-blue-600">Services</TabsTrigger>
          <TabsTrigger value="maintenance" className="data-[state=active]:bg-blue-600">Maintenance</TabsTrigger>
          <TabsTrigger value="reports" className="data-[state=active]:bg-blue-600">Reports</TabsTrigger>
          <TabsTrigger value="settings" className="data-[state=active]:bg-blue-600">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="services">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                Service Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(systemStatus).map(([service, status]) => (
                  <div key={service} className="flex items-center justify-between p-4 bg-slate-700/30 rounded border border-slate-600/50">
                    <div className="flex items-center space-x-3">
                      {service === 'cameras' && <Camera className="w-5 h-5 text-blue-400" />}
                      {service === 'database' && <Database className="w-5 h-5 text-green-400" />}
                      {service === 'network' && <Network className="w-5 h-5 text-purple-400" />}
                      {service === 'anpr' && <Activity className="w-5 h-5 text-cyan-400" />}
                      {service === 'alerts' && <AlertTriangle className="w-5 h-5 text-orange-400" />}
                      {service === 'backup' && <HardDrive className="w-5 h-5 text-slate-400" />}
                      {service === 'autoRestart' && <RotateCcw className="w-5 h-5 text-yellow-400" />}
                      {service === 'debugMode' && <Settings className="w-5 h-5 text-red-400" />}
                      <div>
                        <div className="text-white font-semibold capitalize">{service.replace(/([A-Z])/g, ' $1')}</div>
                        <Badge className={status ? "bg-green-500/20 text-green-400 border-green-500/30" : "bg-red-500/20 text-red-400 border-red-500/30"}>
                          {status ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </div>
                    <Switch
                      checked={status}
                      onCheckedChange={() => toggleService(service as keyof typeof systemStatus)}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="maintenance">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Power className="w-5 h-5 mr-2" />
                  System Operations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  onClick={handleSystemRestart}
                  disabled={isRestarting}
                  variant="destructive"
                  className="w-full"
                >
                  {isRestarting ? (
                    <>
                      <RotateCcw className="w-4 h-4 mr-2 animate-spin" />
                      Restarting System...
                    </>
                  ) : (
                    <>
                      <Power className="w-4 h-4 mr-2" />
                      Restart System
                    </>
                  )}
                </Button>

                <Button 
                  onClick={handleBackup}
                  disabled={isBackingUp}
                  variant="outline"
                  className="w-full"
                >
                  {isBackingUp ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Creating Backup...
                    </>
                  ) : (
                    <>
                      <Database className="w-4 h-4 mr-2" />
                      Create Backup
                    </>
                  )}
                </Button>

                <div className="p-3 bg-slate-700/30 rounded">
                  <div className="text-sm text-slate-400 mb-2">Last Backup</div>
                  <div className="text-white">Today at 06:00 AM</div>
                  <div className="text-xs text-green-400">Successful</div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Activity className="w-5 h-5 mr-2" />
                  System Health
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-400">CPU Usage</span>
                    <span className="text-white">68%</span>
                  </div>
                  <Progress value={68} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-400">Memory Usage</span>
                    <span className="text-white">72%</span>
                  </div>
                  <Progress value={72} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-400">Storage</span>
                    <span className="text-white">45%</span>
                  </div>
                  <Progress value={45} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-400">Network</span>
                    <span className="text-white">85%</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                System Reports
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button 
                  onClick={handleGenerateReport}
                  disabled={isGeneratingReport}
                  className="h-20 flex flex-col items-center justify-center"
                >
                  {isGeneratingReport ? (
                    <>
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mb-2" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Download className="w-6 h-6 mb-2" />
                      Download System Report
                    </>
                  )}
                </Button>

                <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                  <FileText className="w-6 h-6 mb-2" />
                  Vehicle Detection Log
                </Button>

                <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                  <Shield className="w-6 h-6 mb-2" />
                  Security Audit Report
                </Button>

                <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                  <Activity className="w-6 h-6 mb-2" />
                  Performance Analytics
                </Button>
              </div>

              <div className="p-4 bg-slate-700/30 rounded border border-slate-600/50">
                <div className="text-white font-semibold mb-2">Report Schedule</div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Daily Summary:</span>
                    <span className="text-white">06:00 AM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Weekly Report:</span>
                    <span className="text-white">Sunday 08:00 AM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Monthly Analysis:</span>
                    <span className="text-white">1st of month</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                System Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 bg-slate-700/30 rounded">
                    <div className="text-white font-semibold mb-3">ANPR Settings</div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Confidence Threshold</span>
                        <span className="text-white">85%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Processing Speed</span>
                        <span className="text-white">High</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Auto-save Detections</span>
                        <Switch checked />
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-700/30 rounded">
                    <div className="text-white font-semibold mb-3">Alert Settings</div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Email Notifications</span>
                        <Switch checked />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">SMS Alerts</span>
                        <Switch />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Sound Alerts</span>
                        <Switch checked />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-slate-700/30 rounded">
                    <div className="text-white font-semibold mb-3">Network Settings</div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">SDN Controller</span>
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Active</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Bandwidth Limit</span>
                        <span className="text-white">1 Gbps</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">QoS Priority</span>
                        <span className="text-white">High</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-700/30 rounded">
                    <div className="text-white font-semibold mb-3">Storage Settings</div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Auto-cleanup</span>
                        <Switch checked />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Retention Period</span>
                        <span className="text-white">30 days</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Backup Frequency</span>
                        <span className="text-white">Daily</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SystemControls;
