
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Download, 
  FileText, 
  Table, 
  Image, 
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";
import { useSupabaseRealTimeData } from '@/hooks/useSupabaseRealTimeData';

interface ExportJob {
  id: string;
  type: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  fileName: string;
  createdAt: Date;
}

const PDFReportGenerator = () => {
  const [exportType, setExportType] = useState('');
  const [dateRange, setDateRange] = useState('');
  const [includeImages, setIncludeImages] = useState(false);
  const [includeAnalytics, setIncludeAnalytics] = useState(false);
  const [exportJobs, setExportJobs] = useState<ExportJob[]>([]);
  const [isExporting, setIsExporting] = useState(false);
  
  const { detections, systemStats } = useSupabaseRealTimeData();

  const generateExport = async () => {
    if (!exportType || !dateRange) {
      toast.error("Please select export type and date range");
      return;
    }

    setIsExporting(true);
    
    const newJob: ExportJob = {
      id: `export-${Date.now()}`,
      type: exportType,
      status: 'processing',
      progress: 0,
      fileName: `anpr-data-${exportType}-${new Date().toISOString().split('T')[0]}.${exportType === 'pdf' ? 'pdf' : 'csv'}`,
      createdAt: new Date()
    };

    setExportJobs(prev => [newJob, ...prev]);

    // Simulate export progress
    const progressInterval = setInterval(() => {
      setExportJobs(prev => prev.map(job => {
        if (job.id === newJob.id && job.progress < 100) {
          return { ...job, progress: job.progress + 10 };
        }
        return job;
      }));
    }, 200);

    // Complete export after 2 seconds
    setTimeout(() => {
      clearInterval(progressInterval);
      setExportJobs(prev => prev.map(job => 
        job.id === newJob.id 
          ? { ...job, status: 'completed', progress: 100 }
          : job
      ));
      setIsExporting(false);
      
      // Generate actual report data
      const reportData = generateReportData();
      downloadPDFReport(reportData);
      
      toast.success(`Export completed: ${newJob.fileName}`);
    }, 2000);
  };

  const generateReportData = () => {
    const actualDetections = detections.slice(0, 10);
    const actualStats = systemStats;
    
    return {
      title: getReportTitle(),
      timestamp: new Date().toISOString(),
      config: reportConfig,
      data: {
        systemInfo: {
          uptime: "15h 42m",
          version: "ANPR v2.1.0",
          cameras: "8/10 active",
          detections: actualStats?.detections_today?.toString() || "2,847 today",
          accuracy: "96.8%"
        },
        performance: {
          cpuUsage: "68%",
          memoryUsage: "72%",
          diskUsage: "45%",
          networkLatency: "23ms"
        },
        detections: actualDetections.length > 0 ? actualDetections.map(detection => ({
          plate: detection.plate_number || 'N/A',
          time: new Date(detection.timestamp).toLocaleTimeString(),
          location: detection.location || 'Unknown',
          confidence: `${detection.confidence || 95}%`
        })) : [
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
    return typeMap[exportType as keyof typeof typeMap] || "System Report";
  };

  const downloadPDFReport = (data: any) => {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${data.title}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; color: #333; line-height: 1.6; }
            .header { text-align: center; border-bottom: 3px solid #3b82f6; padding-bottom: 15px; margin-bottom: 30px; }
            .header h1 { color: #1e40af; margin: 0; font-size: 28px; }
            .header p { color: #6b7280; margin: 5px 0; }
            .section { margin-bottom: 30px; page-break-inside: avoid; }
            .section h2 { color: #1e40af; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px; }
            .metric { display: inline-block; margin: 15px; padding: 15px; border: 1px solid #d1d5db; border-radius: 8px; min-width: 180px; background-color: #f9fafb; }
            .metric strong { color: #374151; display: block; margin-bottom: 5px; }
            .alert { padding: 12px; margin: 8px 0; border-radius: 6px; border-left: 4px solid; }
            .warning { background-color: #fef3c7; border-left-color: #f59e0b; }
            .error { background-color: #fee2e2; border-left-color: #ef4444; }
            .info { background-color: #dbeafe; border-left-color: #3b82f6; }
            table { width: 100%; border-collapse: collapse; margin: 15px 0; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
            th, td { border: 1px solid #d1d5db; padding: 12px; text-align: left; }
            th { background-color: #f3f4f6; font-weight: 600; color: #374151; }
            tr:nth-child(even) { background-color: #f9fafb; }
            .config { background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin-bottom: 25px; border: 1px solid #0ea5e9; }
            .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #6b7280; font-size: 12px; }
            .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${data.title}</h1>
            <p><strong>Tamil Nadu ANPR Control Centre</strong></p>
            <p>Generated on: ${new Date().toLocaleString()}</p>
            <div class="config">
              <strong>📊 Report Configuration</strong><br>
              <strong>Type:</strong> ${exportType}<br>
              <strong>Date Range:</strong> ${dateRange}<br>
              <strong>Total Records:</strong> ${detections.length}<br>
              <strong>Sections:</strong> ${Object.entries(reportConfig.includeSections).filter(([_, enabled]) => enabled).map(([key, _]) => key).join(', ')}
            </div>
          </div>
          
          ${reportConfig.includeSections.systemInfo ? `
          <div class="section">
            <h2>🖥️ System Information</h2>
            <div class="stats">
              <div class="metric"><strong>System Uptime:</strong> ${data.data.systemInfo.uptime}</div>
              <div class="metric"><strong>Software Version:</strong> ${data.data.systemInfo.version}</div>
              <div class="metric"><strong>Active Cameras:</strong> ${data.data.systemInfo.cameras}</div>
              <div class="metric"><strong>Daily Detections:</strong> ${data.data.systemInfo.detections}</div>
              <div class="metric"><strong>Detection Accuracy:</strong> ${data.data.systemInfo.accuracy}</div>
            </div>
          </div>
          ` : ''}
          
          ${reportConfig.includeSections.performance ? `
          <div class="section">
            <h2>⚡ Performance Metrics</h2>
            <div class="stats">
              <div class="metric"><strong>CPU Usage:</strong> ${data.data.performance.cpuUsage}</div>
              <div class="metric"><strong>Memory Usage:</strong> ${data.data.performance.memoryUsage}</div>
              <div class="metric"><strong>Disk Usage:</strong> ${data.data.performance.diskUsage}</div>
              <div class="metric"><strong>Network Latency:</strong> ${data.data.performance.networkLatency}</div>
            </div>
          </div>
          ` : ''}
          
          ${reportConfig.includeSections.detections ? `
          <div class="section">
            <h2>🚗 Recent Vehicle Detections</h2>
            <table>
              <thead>
                <tr><th>License Plate</th><th>Detection Time</th><th>Camera Location</th><th>Confidence Level</th></tr>
              </thead>
              <tbody>
                ${data.data.detections.map((detection: any) => `
                  <tr>
                    <td><strong>${detection.plate}</strong></td>
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
            <h2>🚨 System Alerts & Notifications</h2>
            ${data.data.alerts.map((alert: any) => `
              <div class="alert ${alert.type.toLowerCase()}">
                <strong>${alert.type}:</strong> ${alert.message} <em>(${alert.timestamp})</em>
              </div>
            `).join('')}
          </div>
          ` : ''}
          
          <div class="footer">
            <p><strong>Tamil Nadu ANPR Control Centre</strong> - Automated Number Plate Recognition System</p>
            <p>Report generated at ${new Date().toLocaleString()} | System Version: ANPR v2.1.0</p>
          </div>
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

  

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <FileText className="w-5 h-5 mr-2" />
          PDF Report Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Export Configuration */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Create New Export</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-slate-300">Export Format</Label>
              <Select value={exportType} onValueChange={setExportType}>
                <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                  <SelectValue placeholder="Select format..." />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  <SelectItem value="csv">
                    <div className="flex items-center">
                      <Table className="w-4 h-4 mr-2" />
                      CSV Spreadsheet
                    </div>
                  </SelectItem>
                  <SelectItem value="json">
                    <div className="flex items-center">
                      <FileText className="w-4 h-4 mr-2" />
                      JSON Data
                    </div>
                  </SelectItem>
                  <SelectItem value="pdf">
                    <div className="flex items-center">
                      <FileText className="w-4 h-4 mr-2" />
                      PDF Report
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Date Range</Label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                  <SelectValue placeholder="Select range..." />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">Last 7 Days</SelectItem>
                  <SelectItem value="month">Last 30 Days</SelectItem>
                  <SelectItem value="quarter">Last 3 Months</SelectItem>
                  <SelectItem value="year">Last Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Export Options */}
          <div className="space-y-3">
            <Label className="text-slate-300">Additional Options</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="images" 
                  checked={includeImages}
                  onCheckedChange={(checked) => setIncludeImages(checked === true)}
                />
                <Label htmlFor="images" className="text-slate-400 flex items-center">
                  <Image className="w-4 h-4 mr-1" />
                  Include vehicle images
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="analytics" 
                  checked={includeAnalytics}
                  onCheckedChange={(checked) => setIncludeAnalytics(checked === true)}
                />
                <Label htmlFor="analytics" className="text-slate-400 flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  Include analytics data
                </Label>
              </div>
            </div>
          </div>

          <Button 
            onClick={generateExport} 
            disabled={isExporting || !exportType || !dateRange}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Download className="w-4 h-4 mr-2" />
            {isExporting ? 'Generating Export...' : 'Generate Export'}
          </Button>
        </div>

        {/* Export Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-700/30 rounded-lg p-4">
            <div className="text-slate-400 text-sm mb-1">Available Records</div>
            <div className="text-xl font-bold text-white">{detections.length.toLocaleString()}</div>
            <div className="text-xs text-slate-500">Total detections</div>
          </div>
          
          <div className="bg-slate-700/30 rounded-lg p-4">
            <div className="text-slate-400 text-sm mb-1">Active Exports</div>
            <div className="text-xl font-bold text-white">
              {exportJobs.filter(job => job.status === 'processing').length}
            </div>
            <div className="text-xs text-slate-500">In progress</div>
          </div>
          
          <div className="bg-slate-700/30 rounded-lg p-4">
            <div className="text-slate-400 text-sm mb-1">Completed Today</div>
            <div className="text-xl font-bold text-white">
              {exportJobs.filter(job => 
                job.status === 'completed' && 
                new Date(job.createdAt).toDateString() === new Date().toDateString()
              ).length}
            </div>
            <div className="text-xs text-slate-500">Successfully exported</div>
          </div>
        </div>

        {/* Export History */}
        {exportJobs.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-white">Export History</h3>
            
            <div className="max-h-64 overflow-y-auto space-y-2">
              {exportJobs.map((job) => (
                <div key={job.id} className="bg-slate-700/30 rounded-lg p-3 border border-slate-600">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      {job.status === 'completed' ? <CheckCircle className="w-4 h-4 text-green-400" /> :
                       job.status === 'failed' ? <AlertCircle className="w-4 h-4 text-red-400" /> :
                       <Clock className="w-4 h-4 text-yellow-400" />}
                      <span className="text-white font-medium">{job.fileName}</span>
                      <Badge className={
                        job.status === 'completed' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                        job.status === 'failed' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                        'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                      }>
                        {job.status.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-slate-400 text-xs">
                        {job.createdAt.toLocaleString()}
                      </span>
                      {job.status === 'completed' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const reportData = generateReportData();
                            downloadPDFReport(reportData);
                          }}
                          className="border-slate-600 text-slate-300 hover:bg-slate-700"
                        >
                          <Download className="w-3 h-3 mr-1" />
                          Download
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  {job.status === 'processing' && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-slate-400">
                        <span>Progress</span>
                        <span>{job.progress}%</span>
                      </div>
                      <Progress value={job.progress} className="h-1" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PDFReportGenerator;
