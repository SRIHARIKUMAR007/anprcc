
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Settings, Power, Camera, Database, Network, Shield, RotateCw, Download, Upload } from "lucide-react";

const SystemControls = () => {
  const [systemSettings, setSystemSettings] = useState({
    autoDetection: true,
    realTimeAlerts: true,
    dataBackup: true,
    networkMonitoring: true,
    securityMode: true,
    recognitionThreshold: [85],
    alertSensitivity: [75],
    cameraRefreshRate: [30],
    maxConcurrentStreams: [8]
  });

  const [cameraStates, setCameraStates] = useState([
    { id: "CAM-01", name: "Main Gate", active: true, recording: true },
    { id: "CAM-02", name: "Highway Junction", active: true, recording: true },
    { id: "CAM-03", name: "Parking Entrance", active: false, recording: false },
    { id: "CAM-04", name: "Toll Plaza", active: true, recording: true },
    { id: "CAM-05", name: "Security Checkpoint", active: true, recording: false },
    { id: "CAM-06", name: "Exit Gate", active: true, recording: true },
    { id: "CAM-07", name: "Service Area", active: false, recording: false },
    { id: "CAM-08", name: "Emergency Lane", active: true, recording: true },
  ]);

  const toggleCamera = (id: string, field: 'active' | 'recording') => {
    setCameraStates(cameras => cameras.map(camera => 
      camera.id === id ? { ...camera, [field]: !camera[field] } : camera
    ));
  };

  const updateSetting = (key: string, value: boolean) => {
    setSystemSettings(prev => ({ ...prev, [key]: value }));
  };

  const updateSliderSetting = (key: string, value: number[]) => {
    setSystemSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      {/* System Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-bold text-green-400">ONLINE</div>
                <div className="text-sm text-slate-400">System Status</div>
              </div>
              <Power className="w-6 h-6 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-bold text-white">6/8</div>
                <div className="text-sm text-slate-400">Active Cameras</div>
              </div>
              <Camera className="w-6 h-6 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-bold text-white">98.2%</div>
                <div className="text-sm text-slate-400">Network Health</div>
              </div>
              <Network className="w-6 h-6 text-cyan-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-bold text-white">SECURE</div>
                <div className="text-sm text-slate-400">Security Status</div>
              </div>
              <Shield className="w-6 h-6 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Settings */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Settings className="w-5 h-5 mr-2" />
            System Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Toggle Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                <div>
                  <div className="text-white font-semibold">Auto Detection</div>
                  <div className="text-slate-400 text-sm">Automatic plate recognition</div>
                </div>
                <Switch 
                  checked={systemSettings.autoDetection}
                  onCheckedChange={(value) => updateSetting('autoDetection', value)}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                <div>
                  <div className="text-white font-semibold">Real-time Alerts</div>
                  <div className="text-slate-400 text-sm">Immediate alert notifications</div>
                </div>
                <Switch 
                  checked={systemSettings.realTimeAlerts}
                  onCheckedChange={(value) => updateSetting('realTimeAlerts', value)}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                <div>
                  <div className="text-white font-semibold">Data Backup</div>
                  <div className="text-slate-400 text-sm">Automatic data synchronization</div>
                </div>
                <Switch 
                  checked={systemSettings.dataBackup}
                  onCheckedChange={(value) => updateSetting('dataBackup', value)}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                <div>
                  <div className="text-white font-semibold">Network Monitoring</div>
                  <div className="text-slate-400 text-sm">SDN network health tracking</div>
                </div>
                <Switch 
                  checked={systemSettings.networkMonitoring}
                  onCheckedChange={(value) => updateSetting('networkMonitoring', value)}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                <div>
                  <div className="text-white font-semibold">Security Mode</div>
                  <div className="text-slate-400 text-sm">Enhanced security protocols</div>
                </div>
                <Switch 
                  checked={systemSettings.securityMode}
                  onCheckedChange={(value) => updateSetting('securityMode', value)}
                />
              </div>

              <div className="p-4 bg-slate-700/30 rounded-lg">
                <Button className="w-full" variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export Configuration
                </Button>
              </div>
            </div>
          </div>

          {/* Slider Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="p-4 bg-slate-700/30 rounded-lg">
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <div className="text-white font-semibold">Recognition Threshold</div>
                    <div className="text-slate-400 text-sm">Minimum confidence level</div>
                  </div>
                  <div className="text-blue-400 font-semibold">{systemSettings.recognitionThreshold[0]}%</div>
                </div>
                <Slider
                  value={systemSettings.recognitionThreshold}
                  onValueChange={(value) => updateSliderSetting('recognitionThreshold', value)}
                  max={100}
                  min={50}
                  step={5}
                  className="w-full"
                />
              </div>

              <div className="p-4 bg-slate-700/30 rounded-lg">
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <div className="text-white font-semibold">Alert Sensitivity</div>
                    <div className="text-slate-400 text-sm">Alert trigger threshold</div>
                  </div>
                  <div className="text-blue-400 font-semibold">{systemSettings.alertSensitivity[0]}%</div>
                </div>
                <Slider
                  value={systemSettings.alertSensitivity}
                  onValueChange={(value) => updateSliderSetting('alertSensitivity', value)}
                  max={100}
                  min={25}
                  step={5}
                  className="w-full"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-slate-700/30 rounded-lg">
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <div className="text-white font-semibold">Camera Refresh Rate</div>
                    <div className="text-slate-400 text-sm">Frames per second</div>
                  </div>
                  <div className="text-blue-400 font-semibold">{systemSettings.cameraRefreshRate[0]} FPS</div>
                </div>
                <Slider
                  value={systemSettings.cameraRefreshRate}
                  onValueChange={(value) => updateSliderSetting('cameraRefreshRate', value)}
                  max={60}
                  min={10}
                  step={5}
                  className="w-full"
                />
              </div>

              <div className="p-4 bg-slate-700/30 rounded-lg">
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <div className="text-white font-semibold">Concurrent Streams</div>
                    <div className="text-slate-400 text-sm">Maximum active cameras</div>
                  </div>
                  <div className="text-blue-400 font-semibold">{systemSettings.maxConcurrentStreams[0]}</div>
                </div>
                <Slider
                  value={systemSettings.maxConcurrentStreams}
                  onValueChange={(value) => updateSliderSetting('maxConcurrentStreams', value)}
                  max={16}
                  min={4}
                  step={1}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Camera Controls */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center">
              <Camera className="w-5 h-5 mr-2" />
              Camera Management
            </CardTitle>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <RotateCw className="w-4 h-4 mr-2" />
                Refresh All
              </Button>
              <Button variant="outline" size="sm">
                <Upload className="w-4 h-4 mr-2" />
                Update Firmware
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {cameraStates.map((camera) => (
              <div key={camera.id} className="p-4 bg-slate-700/30 rounded-lg border border-slate-600/50">
                <div className="flex items-center justify-between mb-3">
                  <div className="font-mono text-white font-semibold">{camera.id}</div>
                  <Badge 
                    variant={camera.active ? "default" : "secondary"}
                    className={camera.active ? "bg-green-500/20 text-green-400 border-green-500/30" : ""}
                  >
                    {camera.active ? "Active" : "Offline"}
                  </Badge>
                </div>
                
                <div className="text-slate-400 text-sm mb-3">{camera.name}</div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-sm">Power</span>
                    <Switch 
                      checked={camera.active}
                      onCheckedChange={() => toggleCamera(camera.id, 'active')}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-sm">Recording</span>
                    <Switch 
                      checked={camera.recording}
                      onCheckedChange={() => toggleCamera(camera.id, 'recording')}
                      disabled={!camera.active}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* System Actions */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">System Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" size="lg" className="h-16">
              <div className="text-center">
                <RotateCw className="w-6 h-6 mx-auto mb-1" />
                <div>Restart System</div>
              </div>
            </Button>
            
            <Button variant="outline" size="lg" className="h-16">
              <div className="text-center">
                <Database className="w-6 h-6 mx-auto mb-1" />
                <div>Backup Data</div>
              </div>
            </Button>
            
            <Button variant="outline" size="lg" className="h-16">
              <div className="text-center">
                <Download className="w-6 h-6 mx-auto mb-1" />
                <div>Generate Report</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemControls;
