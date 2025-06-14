
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
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
import { useSupabaseRealTimeData } from '@/hooks/useSupabaseRealTimeData';
import { toast } from "sonner";

interface ExportJob {
  id: string;
  type: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  fileName: string;
  createdAt: Date;
}

const DataExportManager = () => {
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
      toast.success(`Export completed: ${newJob.fileName}`);
    }, 2000);
  };

  const downloadExport = (job: ExportJob) => {
    // Simulate download
    const blob = new Blob(['Sample export data'], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = job.fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success(`Downloaded: ${job.fileName}`);
  };

  const getJobStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'failed': return <AlertCircle className="w-4 h-4 text-red-400" />;
      default: return <Clock className="w-4 h-4 text-yellow-400" />;
    }
  };

  const getJobStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'failed': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'processing': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Download className="w-5 h-5 mr-2" />
          Data Export Manager
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
                  onCheckedChange={setIncludeImages}
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
                  onCheckedChange={setIncludeAnalytics}
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
                      {getJobStatusIcon(job.status)}
                      <span className="text-white font-medium">{job.fileName}</span>
                      <Badge className={getJobStatusColor(job.status)}>
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
                          onClick={() => downloadExport(job)}
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

export default DataExportManager;
