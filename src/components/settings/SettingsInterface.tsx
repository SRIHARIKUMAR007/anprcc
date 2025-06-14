
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Settings, 
  Bell, 
  Shield, 
  Database, 
  Network,
  Camera,
  User,
  Save,
  RotateCcw,
  Monitor,
  Mail,
  Smartphone,
  Volume2
} from "lucide-react";
import { toast } from "sonner";
import PDFReportGenerator from "./PDFReportGenerator";

const SettingsInterface = () => {
  const [settings, setSettings] = useState({
    // System Settings
    system: {
      autoRestart: true,
      debugMode: false,
      maintenanceMode: false,
      autoBackup: true,
      backupFrequency: "daily",
      dataRetention: "30"
    },
    // ANPR Settings
    anpr: {
      confidenceThreshold: "85",
      processingSpeed: "high",
      autoSaveDetections: true,
      plateValidation: true,
      multiRegionSupport: true
    },
    // Alert Settings
    alerts: {
      emailNotifications: true,
      smsAlerts: false,
      soundAlerts: true,
      pushNotifications: true,
      alertThreshold: "medium",
      quietHours: false,
      quietStart: "22:00",
      quietEnd: "06:00"
    },
    // Network Settings
    network: {
      sdnController: true,
      qosPriority: "high",
      bandwidthLimit: "1000",
      autoFailover: true,
      networkMonitoring: true
    },
    // Security Settings
    security: {
      twoFactorAuth: false,
      sessionTimeout: "60",
      auditLogging: true,
      encryptionEnabled: true,
      accessControl: true
    },
    // User Preferences
    user: {
      theme: "dark",
      language: "en",
      timezone: "UTC",
      dateFormat: "DD/MM/YYYY",
      refreshRate: "5"
    }
  });

  const [hasChanges, setHasChanges] = useState(false);

  const updateSetting = (category: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value
      }
    }));
    setHasChanges(true);
  };

  const saveSettings = async () => {
    try {
      toast.info("Saving settings...");
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setHasChanges(false);
      toast.success("Settings saved successfully!");
    } catch (error) {
      toast.error("Failed to save settings");
    }
  };

  const resetToDefaults = () => {
    toast.info("Settings reset to defaults");
    setHasChanges(true);
    // Reset logic would go here
  };

  return (
    <div className="space-y-6">
      {/* Settings Header */}
      <Card className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border-blue-500/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <div className="flex items-center">
              <Settings className="w-6 h-6 mr-3" />
              System Settings
            </div>
            {hasChanges && (
              <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                Unsaved Changes
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Button onClick={saveSettings} disabled={!hasChanges}>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
            <Button variant="outline" onClick={resetToDefaults}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset to Defaults
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="system" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 bg-slate-800/50">
          <TabsTrigger value="system" className="data-[state=active]:bg-blue-600">
            <Monitor className="w-4 h-4 mr-1" />
            System
          </TabsTrigger>
          <TabsTrigger value="anpr" className="data-[state=active]:bg-blue-600">
            <Camera className="w-4 h-4 mr-1" />
            ANPR
          </TabsTrigger>
          <TabsTrigger value="alerts" className="data-[state=active]:bg-blue-600">
            <Bell className="w-4 h-4 mr-1" />
            Alerts
          </TabsTrigger>
          <TabsTrigger value="network" className="data-[state=active]:bg-blue-600">
            <Network className="w-4 h-4 mr-1" />
            Network
          </TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-blue-600">
            <Shield className="w-4 h-4 mr-1" />
            Security
          </TabsTrigger>
          <TabsTrigger value="reports" className="data-[state=active]:bg-blue-600">
            Reports
          </TabsTrigger>
        </TabsList>

        <TabsContent value="system">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">System Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-white">Auto Restart</Label>
                    <Switch
                      checked={settings.system.autoRestart}
                      onCheckedChange={(checked) => updateSetting('system', 'autoRestart', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label className="text-white">Debug Mode</Label>
                    <Switch
                      checked={settings.system.debugMode}
                      onCheckedChange={(checked) => updateSetting('system', 'debugMode', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label className="text-white">Maintenance Mode</Label>
                    <Switch
                      checked={settings.system.maintenanceMode}
                      onCheckedChange={(checked) => updateSetting('system', 'maintenanceMode', checked)}
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label className="text-white">Data Retention (days)</Label>
                    <Input
                      type="number"
                      value={settings.system.dataRetention}
                      onChange={(e) => updateSetting('system', 'dataRetention', e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white mt-1"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label className="text-white">Auto Backup</Label>
                    <Switch
                      checked={settings.system.autoBackup}
                      onCheckedChange={(checked) => updateSetting('system', 'autoBackup', checked)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="anpr">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">ANPR Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-white">Confidence Threshold (%)</Label>
                    <Input
                      type="range"
                      min="50"
                      max="99"
                      value={settings.anpr.confidenceThreshold}
                      onChange={(e) => updateSetting('anpr', 'confidenceThreshold', e.target.value)}
                      className="mt-2"
                    />
                    <div className="text-right text-slate-400 text-sm">{settings.anpr.confidenceThreshold}%</div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label className="text-white">Auto-save Detections</Label>
                    <Switch
                      checked={settings.anpr.autoSaveDetections}
                      onCheckedChange={(checked) => updateSetting('anpr', 'autoSaveDetections', checked)}
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-white">Plate Validation</Label>
                    <Switch
                      checked={settings.anpr.plateValidation}
                      onCheckedChange={(checked) => updateSetting('anpr', 'plateValidation', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label className="text-white">Multi-Region Support</Label>
                    <Switch
                      checked={settings.anpr.multiRegionSupport}
                      onCheckedChange={(checked) => updateSetting('anpr', 'multiRegionSupport', checked)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Alert Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-2 text-blue-400" />
                      <Label className="text-white">Email Notifications</Label>
                    </div>
                    <Switch
                      checked={settings.alerts.emailNotifications}
                      onCheckedChange={(checked) => updateSetting('alerts', 'emailNotifications', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Smartphone className="w-4 h-4 mr-2 text-green-400" />
                      <Label className="text-white">SMS Alerts</Label>
                    </div>
                    <Switch
                      checked={settings.alerts.smsAlerts}
                      onCheckedChange={(checked) => updateSetting('alerts', 'smsAlerts', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Volume2 className="w-4 h-4 mr-2 text-purple-400" />
                      <Label className="text-white">Sound Alerts</Label>
                    </div>
                    <Switch
                      checked={settings.alerts.soundAlerts}
                      onCheckedChange={(checked) => updateSetting('alerts', 'soundAlerts', checked)}
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-white">Quiet Hours</Label>
                    <Switch
                      checked={settings.alerts.quietHours}
                      onCheckedChange={(checked) => updateSetting('alerts', 'quietHours', checked)}
                    />
                  </div>
                  
                  {settings.alerts.quietHours && (
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-slate-400 text-sm">Start</Label>
                        <Input
                          type="time"
                          value={settings.alerts.quietStart}
                          onChange={(e) => updateSetting('alerts', 'quietStart', e.target.value)}
                          className="bg-slate-700 border-slate-600 text-white"
                        />
                      </div>
                      <div>
                        <Label className="text-slate-400 text-sm">End</Label>
                        <Input
                          type="time"
                          value={settings.alerts.quietEnd}
                          onChange={(e) => updateSetting('alerts', 'quietEnd', e.target.value)}
                          className="bg-slate-700 border-slate-600 text-white"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="network">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Network Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-white">SDN Controller</Label>
                    <Switch
                      checked={settings.network.sdnController}
                      onCheckedChange={(checked) => updateSetting('network', 'sdnController', checked)}
                    />
                  </div>
                  
                  <div>
                    <Label className="text-white">Bandwidth Limit (Mbps)</Label>
                    <Input
                      type="number"
                      value={settings.network.bandwidthLimit}
                      onChange={(e) => updateSetting('network', 'bandwidthLimit', e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white mt-1"
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-white">Auto Failover</Label>
                    <Switch
                      checked={settings.network.autoFailover}
                      onCheckedChange={(checked) => updateSetting('network', 'autoFailover', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label className="text-white">Network Monitoring</Label>
                    <Switch
                      checked={settings.network.networkMonitoring}
                      onCheckedChange={(checked) => updateSetting('network', 'networkMonitoring', checked)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Security Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-white">Two-Factor Authentication</Label>
                    <Switch
                      checked={settings.security.twoFactorAuth}
                      onCheckedChange={(checked) => updateSetting('security', 'twoFactorAuth', checked)}
                    />
                  </div>
                  
                  <div>
                    <Label className="text-white">Session Timeout (minutes)</Label>
                    <Input
                      type="number"
                      value={settings.security.sessionTimeout}
                      onChange={(e) => updateSetting('security', 'sessionTimeout', e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white mt-1"
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-white">Audit Logging</Label>
                    <Switch
                      checked={settings.security.auditLogging}
                      onCheckedChange={(checked) => updateSetting('security', 'auditLogging', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label className="text-white">Encryption Enabled</Label>
                    <Switch
                      checked={settings.security.encryptionEnabled}
                      onCheckedChange={(checked) => updateSetting('security', 'encryptionEnabled', checked)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <PDFReportGenerator />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsInterface;
