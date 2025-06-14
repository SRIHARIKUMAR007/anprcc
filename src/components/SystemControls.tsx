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
import PDFReportGenerator from "./settings/PDFReportGenerator";

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
  const [isBackingUp, setIsBackingUp] = useState(false);

  const handleSystemRestart = async () => {
    setIsRestarting(true);
    toast.info("Initiating system restart...");
    
    // Simulate restart process
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setIsRestarting(false);
    toast.success("System restarted successfully!");
  };

  const handleBackup = async () => {
    setIsBackingUp(true);
    toast.info("Starting system backup...");
    
    // Simulate backup process
    await new Promise(resolve => setTimeout(resolve, 4000));
    
    setIsBackingUp(false);
    toast.success("Backup completed successfully!");
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
          <PDFReportGenerator />
        </TabsContent>

        <TabsContent value="settings">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                Quick Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Settings className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-400 mb-4">Access full settings from the user menu in the top right corner.</p>
                <p className="text-sm text-slate-500">Click on your profile → Settings for comprehensive system configuration.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SystemControls;
