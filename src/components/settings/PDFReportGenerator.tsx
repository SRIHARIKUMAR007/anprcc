
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  Download, 
  FileText, 
  Calendar,
  Settings,
  Activity,
  Shield,
  Database
} from "lucide-react";
import { toast } from "sonner";

const PDFReportGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportConfig, setReportConfig] = useState({
    type: "system",
    dateRange: "today",
    customStartDate: "",
    customEndDate: "",
    includeSections: {
      systemInfo: true,
      performance: true,
      detections: true,
      alerts: true,
      analytics: false,
      security: false
    }
  });

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    toast.info("Generating PDF report...");
    
    try {
      // Simulate report generation
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Generate and download the PDF
      const reportData = generateReportData();
      downloadPDFReport(reportData);
      
      toast.success("PDF report generated successfully!");
    } catch (error) {
      toast.error("Failed to generate report");
    } finally {
      setIsGenerating(false);
    }
  };

  const generateReportData = () => {
    return {
      title: getReportTitle(),
      timestamp: new Date().toISOString(),
      config: reportConfig,
      data: {
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
        detections: [
          { plate: "TN01AB1234", time: "14:30:15", location: "Camera-01", confidence: "96%" },
          { plate: "TN02CD5678", time: "14:25:32", location: "Camera-03", confidence: "94%" },
          { plate: "TN03EF9012", time: "14:20:18", location: "Camera-02", confidence: "98%" }
        ],
        alerts: [
          { type: "Warning", message: "Camera CAM-03 offline", timestamp: "10:30:15" },
          { type: "Info", message: "Daily backup completed", timestamp: "06:00:00" },
          { type: "Error", message: "Network latency spike detected", timestamp: "09:15:22" }
        ]
      }
    };
  };

  const getReportTitle = () => {
    const typeMap = {
      system: "System Report",
      detection: "Detection Log Report",
      security: "Security Audit Report",
      performance: "Performance Analytics Report"
    };
    return typeMap[reportConfig.type as keyof typeof typeMap] || "System Report";
  };

  const downloadPDFReport = (data: any) => {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${data.title}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
            .header { text-align: center; border-bottom: 2px solid #3b82f6; padding-bottom: 10px; margin-bottom: 20px; }
            .section { margin-bottom: 20px; page-break-inside: avoid; }
            .metric { display: inline-block; margin: 10px; padding: 10px; border: 1px solid #ddd; border-radius: 5px; min-width: 150px; }
            .alert { padding: 8px; margin: 5px 0; border-radius: 4px; }
            .warning { background-color: #fef3c7; border-left: 4px solid #f59e0b; }
            .error { background-color: #fee2e2; border-left: 4px solid #ef4444; }
            .info { background-color: #dbeafe; border-left: 4px solid #3b82f6; }
            table { width: 100%; border-collapse: collapse; margin: 10px 0; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f5f5f5; }
            .config { background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${data.title}</h1>
            <p>Generated on: ${new Date().toLocaleString()}</p>
            <div class="config">
              <strong>Report Configuration:</strong><br>
              Type: ${reportConfig.type}<br>
              Date Range: ${reportConfig.dateRange}<br>
              Sections: ${Object.entries(reportConfig.includeSections).filter(([_, enabled]) => enabled).map(([key, _]) => key).join(', ')}
            </div>
          </div>
          
          ${reportConfig.includeSections.systemInfo ? `
          <div class="section">
            <h2>System Information</h2>
            <div class="metric"><strong>Uptime:</strong> ${data.data.systemInfo.uptime}</div>
            <div class="metric"><strong>Version:</strong> ${data.data.systemInfo.version}</div>
            <div class="metric"><strong>Active Cameras:</strong> ${data.data.systemInfo.cameras}</div>
            <div class="metric"><strong>Detections Today:</strong> ${data.data.systemInfo.detections}</div>
            <div class="metric"><strong>Accuracy:</strong> ${data.data.systemInfo.accuracy}</div>
          </div>
          ` : ''}
          
          ${reportConfig.includeSections.performance ? `
          <div class="section">
            <h2>Performance Metrics</h2>
            <div class="metric"><strong>CPU Usage:</strong> ${data.data.performance.cpuUsage}</div>
            <div class="metric"><strong>Memory Usage:</strong> ${data.data.performance.memoryUsage}</div>
            <div class="metric"><strong>Disk Usage:</strong> ${data.data.performance.diskUsage}</div>
            <div class="metric"><strong>Network Latency:</strong> ${data.data.performance.networkLatency}</div>
          </div>
          ` : ''}
          
          ${reportConfig.includeSections.detections ? `
          <div class="section">
            <h2>Recent Detections</h2>
            <table>
              <thead>
                <tr><th>License Plate</th><th>Time</th><th>Location</th><th>Confidence</th></tr>
              </thead>
              <tbody>
                ${data.data.detections.map((detection: any) => `
                  <tr>
                    <td>${detection.plate}</td>
                    <td>${detection.time}</td>
                    <td>${detection.location}</td>
                    <td>${detection.confidence}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
          ` : ''}
          
          ${reportConfig.includeSections.alerts ? `
          <div class="section">
            <h2>System Alerts</h2>
            ${data.data.alerts.map((alert: any) => `
              <div class="alert ${alert.type.toLowerCase()}">
                <strong>${alert.type}:</strong> ${alert.message} <em>(${alert.timestamp})</em>
              </div>
            `).join('')}
          </div>
          ` : ''}
        </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${data.title.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const updateIncludeSection = (section: string, checked: boolean) => {
    setReportConfig(prev => ({
      ...prev,
      includeSections: {
        ...prev.includeSections,
        [section]: checked
      }
    }));
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <FileText className="w-5 h-5 mr-2" />
          PDF Report Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Report Type Selection */}
        <div className="space-y-3">
          <Label className="text-white font-semibold">Report Type</Label>
          <RadioGroup
            value={reportConfig.type}
            onValueChange={(value) => setReportConfig(prev => ({ ...prev, type: value }))}
            className="grid grid-cols-2 gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="system" id="system" />
              <Label htmlFor="system" className="text-slate-300">System Report</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="detection" id="detection" />
              <Label htmlFor="detection" className="text-slate-300">Detection Log</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="security" id="security" />
              <Label htmlFor="security" className="text-slate-300">Security Audit</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="performance" id="performance" />
              <Label htmlFor="performance" className="text-slate-300">Performance Analytics</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Date Range Selection */}
        <div className="space-y-3">
          <Label className="text-white font-semibold">Date Range</Label>
          <RadioGroup
            value={reportConfig.dateRange}
            onValueChange={(value) => setReportConfig(prev => ({ ...prev, dateRange: value }))}
            className="grid grid-cols-2 gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="today" id="today" />
              <Label htmlFor="today" className="text-slate-300">Today</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="week" id="week" />
              <Label htmlFor="week" className="text-slate-300">This Week</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="month" id="month" />
              <Label htmlFor="month" className="text-slate-300">This Month</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="custom" id="custom" />
              <Label htmlFor="custom" className="text-slate-300">Custom Range</Label>
            </div>
          </RadioGroup>

          {reportConfig.dateRange === 'custom' && (
            <div className="grid grid-cols-2 gap-4 mt-3">
              <div>
                <Label className="text-slate-400">Start Date</Label>
                <Input
                  type="date"
                  value={reportConfig.customStartDate}
                  onChange={(e) => setReportConfig(prev => ({ ...prev, customStartDate: e.target.value }))}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <div>
                <Label className="text-slate-400">End Date</Label>
                <Input
                  type="date"
                  value={reportConfig.customEndDate}
                  onChange={(e) => setReportConfig(prev => ({ ...prev, customEndDate: e.target.value }))}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
            </div>
          )}
        </div>

        {/* Include Sections */}
        <div className="space-y-3">
          <Label className="text-white font-semibold">Include Sections</Label>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(reportConfig.includeSections).map(([section, checked]) => (
              <div key={section} className="flex items-center space-x-2">
                <Checkbox
                  id={section}
                  checked={checked}
                  onCheckedChange={(checked) => updateIncludeSection(section, checked as boolean)}
                />
                <Label htmlFor={section} className="text-slate-300 capitalize">
                  {section.replace(/([A-Z])/g, ' $1').trim()}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <Button
          onClick={handleGenerateReport}
          disabled={isGenerating}
          className="w-full h-12"
        >
          {isGenerating ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Generating PDF...
            </>
          ) : (
            <>
              <Download className="w-4 h-4 mr-2" />
              Generate PDF Report
            </>
          )}
        </Button>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-600">
          <Button variant="outline" size="sm" className="text-slate-300">
            <Calendar className="w-4 h-4 mr-2" />
            Schedule Report
          </Button>
          <Button variant="outline" size="sm" className="text-slate-300">
            <Settings className="w-4 h-4 mr-2" />
            Save Template
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PDFReportGenerator;
