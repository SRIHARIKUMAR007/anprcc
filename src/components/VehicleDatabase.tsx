
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Database, Shield, AlertTriangle, Plus, Download, FileText } from "lucide-react";
import { useSupabaseRealTimeData } from "@/hooks/useSupabaseRealTimeData";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import RoleBasedAccess from "./RoleBasedAccess";

const VehicleDatabase = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const { detections, systemStats, isConnected } = useSupabaseRealTimeData();
  const { userProfile } = useAuth();
  const [isExporting, setIsExporting] = useState(false);

  // Get unique locations for filtering
  const uniqueLocations = ["All Locations", ...Array.from(new Set(detections.map(d => d.location)))];

  // Filter detections based on search and location
  const filteredDetections = detections.filter(detection => {
    const matchesSearch = detection.plate_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         detection.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = selectedLocation === "All Locations" || detection.location === selectedLocation;
    return matchesSearch && matchesLocation;
  });

  // Calculate statistics from live data
  const statistics = {
    totalRecords: detections.length,
    todayDetections: detections.filter(d => {
      const today = new Date().toDateString();
      return new Date(d.timestamp).toDateString() === today;
    }).length,
    blacklisted: detections.filter(d => d.status === 'flagged').length,
    watchlist: detections.filter(d => d.status === 'processing').length,
    avgAccuracy: detections.length > 0 ? Math.round(detections.reduce((acc, d) => acc + d.confidence, 0) / detections.length) : 0
  };

  // Mock blacklisted vehicles (in real app, this would come from a separate table)
  const blacklistedVehicles = detections
    .filter(d => d.status === 'flagged')
    .slice(0, 5)
    .map(d => ({
      plate: d.plate_number,
      reason: "Flagged by AI Detection",
      dateAdded: new Date(d.timestamp).toLocaleDateString(),
      priority: d.confidence > 90 ? "high" : d.confidence > 70 ? "medium" : "low"
    }));

  const exportToPDF = async () => {
    setIsExporting(true);
    toast.info("Generating PDF export...");

    try {
      // Generate comprehensive report data
      const reportData = {
        title: "Vehicle Database Report",
        timestamp: new Date().toISOString(),
        statistics,
        detections: filteredDetections.slice(0, 50), // Limit for PDF
        blacklisted: blacklistedVehicles,
        systemInfo: systemStats,
        generatedBy: userProfile?.full_name || userProfile?.email || 'System',
        userRole: userProfile?.role || 'viewer'
      };

      // Create HTML content for PDF
      const htmlContent = generatePDFContent(reportData);
      
      // Create and download HTML file (can be converted to PDF)
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `vehicle-database-report-${new Date().toISOString().split('T')[0]}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success("PDF report exported successfully!");
    } catch (error) {
      toast.error("Failed to export PDF report");
      console.error('Export error:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const generatePDFContent = (data: any) => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${data.title}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
            .header { text-align: center; border-bottom: 2px solid #3b82f6; padding-bottom: 10px; margin-bottom: 20px; }
            .section { margin-bottom: 30px; page-break-inside: avoid; }
            .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin: 20px 0; }
            .stat-card { border: 1px solid #ddd; padding: 15px; border-radius: 5px; text-align: center; }
            .stat-value { font-size: 24px; font-weight: bold; color: #3b82f6; }
            .stat-label { font-size: 14px; color: #666; margin-top: 5px; }
            table { width: 100%; border-collapse: collapse; margin: 15px 0; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f5f5f5; font-weight: bold; }
            .flagged { color: #dc2626; font-weight: bold; }
            .cleared { color: #16a34a; }
            .processing { color: #ca8a04; }
            .metadata { background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin-bottom: 20px; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${data.title}</h1>
            <p>Generated on: ${new Date(data.timestamp).toLocaleString()}</p>
            <div class="metadata">
              <strong>Report Details:</strong><br>
              Generated by: ${data.generatedBy} (${data.userRole})<br>
              Total Records: ${data.statistics.totalRecords}<br>
              Connection Status: ${isConnected ? 'Live Data' : 'Offline Mode'}<br>
              Search Filter: ${searchTerm || 'None'}<br>
              Location Filter: ${selectedLocation}
            </div>
          </div>
          
          <div class="section">
            <h2>Database Statistics</h2>
            <div class="stats-grid">
              <div class="stat-card">
                <div class="stat-value">${data.statistics.totalRecords.toLocaleString()}</div>
                <div class="stat-label">Total Records</div>
              </div>
              <div class="stat-card">
                <div class="stat-value">${data.statistics.todayDetections}</div>
                <div class="stat-label">Today's Detections</div>
              </div>
              <div class="stat-card">
                <div class="stat-value">${data.statistics.blacklisted}</div>
                <div class="stat-label">Flagged Vehicles</div>
              </div>
              <div class="stat-card">
                <div class="stat-value">${data.statistics.avgAccuracy}%</div>
                <div class="stat-label">Avg Confidence</div>
              </div>
            </div>
          </div>
          
          <div class="section">
            <h2>Recent Vehicle Detections (Last 50)</h2>
            <table>
              <thead>
                <tr>
                  <th>Plate Number</th>
                  <th>Location</th>
                  <th>Timestamp</th>
                  <th>Camera ID</th>
                  <th>Confidence</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${data.detections.map((detection: any) => `
                  <tr>
                    <td><strong>${detection.plate_number}</strong></td>
                    <td>${detection.location}</td>
                    <td>${new Date(detection.timestamp).toLocaleString()}</td>
                    <td>${detection.camera_id}</td>
                    <td>${detection.confidence}%</td>
                    <td class="${detection.status}">${detection.status.toUpperCase()}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
          
          ${data.blacklisted.length > 0 ? `
          <div class="section">
            <h2>Flagged Vehicles</h2>
            <table>
              <thead>
                <tr><th>Plate Number</th><th>Reason</th><th>Date Flagged</th><th>Priority</th></tr>
              </thead>
              <tbody>
                ${data.blacklisted.map((vehicle: any) => `
                  <tr>
                    <td><strong>${vehicle.plate}</strong></td>
                    <td>${vehicle.reason}</td>
                    <td>${vehicle.dateAdded}</td>
                    <td class="${vehicle.priority === 'high' ? 'flagged' : vehicle.priority === 'medium' ? 'processing' : 'cleared'}">${vehicle.priority.toUpperCase()}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
          ` : ''}
          
          ${data.systemInfo ? `
          <div class="section">
            <h2>System Performance</h2>
            <div class="stats-grid">
              <div class="stat-card">
                <div class="stat-value">${data.systemInfo.active_cameras}/${data.systemInfo.total_cameras}</div>
                <div class="stat-label">Active Cameras</div>
              </div>
              <div class="stat-card">
                <div class="stat-value">${data.systemInfo.accuracy_rate}%</div>
                <div class="stat-label">System Accuracy</div>
              </div>
              <div class="stat-card">
                <div class="stat-value">${data.systemInfo.cpu_usage}%</div>
                <div class="stat-label">CPU Usage</div>
              </div>
              <div class="stat-card">
                <div class="stat-value">${data.systemInfo.network_latency}ms</div>
                <div class="stat-label">Network Latency</div>
              </div>
            </div>
          </div>
          ` : ''}
          
          <div class="section">
            <p style="text-align: center; color: #666; font-size: 12px; margin-top: 40px;">
              This report was generated from live ANPR system data.<br>
              Report contains ${data.detections.length} of ${data.statistics.totalRecords} total records.
            </p>
          </div>
        </body>
      </html>
    `;
  };

  return (
    <div className="space-y-6">
      {/* Database Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-white">{statistics.totalRecords.toLocaleString()}</div>
            <div className="text-sm text-slate-400">Total Records</div>
            <div className="text-xs text-slate-500 mt-1">{isConnected ? 'Live Data' : 'Cached'}</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-white">{statistics.todayDetections}</div>
            <div className="text-sm text-slate-400">Today's Detections</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-400">{statistics.blacklisted}</div>
            <div className="text-sm text-slate-400">Flagged</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-400">{statistics.watchlist}</div>
            <div className="text-sm text-slate-400">Processing</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-400">{statistics.avgAccuracy}%</div>
            <div className="text-sm text-slate-400">Avg Confidence</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Database Interface */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center">
              <Database className="w-5 h-5 mr-2" />
              Live Vehicle Database Management
              {isConnected && (
                <Badge className="ml-2 bg-green-500/20 text-green-400 border-green-500/30 animate-pulse">
                  LIVE
                </Badge>
              )}
            </CardTitle>
            <div className="flex space-x-2">
              <RoleBasedAccess allowedRoles={['admin', 'operator']}>
                <Button variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Vehicle
                </Button>
              </RoleBasedAccess>
              <Button 
                variant="outline" 
                size="sm"
                onClick={exportToPDF}
                disabled={isExporting}
              >
                {isExporting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Export PDF
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="records" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3 bg-slate-700/50">
              <TabsTrigger value="records" className="data-[state=active]:bg-blue-600">Live Records</TabsTrigger>
              <TabsTrigger value="blacklist" className="data-[state=active]:bg-blue-600">Flagged Vehicles</TabsTrigger>
              <TabsTrigger value="analytics" className="data-[state=active]:bg-blue-600">Live Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="records" className="space-y-4">
              {/* Search and Location Filter */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input 
                    placeholder="Search by plate number or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-slate-700/50 border-slate-600 text-white"
                  />
                </div>
                <div className="md:w-64">
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {uniqueLocations.map(location => (
                      <option key={location} value={location}>{location}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Records Table */}
              <div className="bg-slate-700/30 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-600/50">
                      <tr>
                        <th className="text-left p-4 text-slate-200 font-semibold">Plate Number</th>
                        <th className="text-left p-4 text-slate-200 font-semibold">Timestamp</th>
                        <th className="text-left p-4 text-slate-200 font-semibold">Location</th>
                        <th className="text-left p-4 text-slate-200 font-semibold">Camera ID</th>
                        <th className="text-left p-4 text-slate-200 font-semibold">Confidence</th>
                        <th className="text-left p-4 text-slate-200 font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredDetections.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="text-center py-8 text-slate-400">
                            <Database className="w-12 h-12 mx-auto mb-3 opacity-50" />
                            <p>No vehicle records found</p>
                            <p className="text-sm">
                              {isConnected ? 'Waiting for live data...' : 'No cached data available'}
                            </p>
                          </td>
                        </tr>
                      ) : (
                        filteredDetections.slice(0, 100).map((detection, index) => (
                          <tr key={detection.id} className={`border-t border-slate-600/50 hover:bg-slate-600/30 ${index === 0 && isConnected ? 'animate-pulse bg-blue-500/10' : ''}`}>
                            <td className="p-4 font-mono text-white font-semibold">{detection.plate_number}</td>
                            <td className="p-4 text-slate-300">{new Date(detection.timestamp).toLocaleString()}</td>
                            <td className="p-4 text-slate-300">{detection.location}</td>
                            <td className="p-4 text-slate-300">{detection.camera_id}</td>
                            <td className="p-4 text-slate-300">{detection.confidence}%</td>
                            <td className="p-4">
                              <Badge 
                                variant={
                                  detection.status === "flagged" ? "destructive" : 
                                  detection.status === "processing" ? "default" : 
                                  "secondary"
                                }
                                className={
                                  detection.status === "flagged" ? "bg-red-500/20 text-red-400 border-red-500/30" :
                                  detection.status === "processing" ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" :
                                  "bg-green-500/20 text-green-400 border-green-500/30"
                                }
                              >
                                {detection.status}
                              </Badge>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
                {filteredDetections.length > 100 && (
                  <div className="p-4 text-center text-slate-400 text-sm border-t border-slate-600/50">
                    Showing first 100 of {filteredDetections.length} records. Use filters to narrow results.
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="blacklist" className="space-y-4">
              <div className="space-y-4">
                {blacklistedVehicles.length === 0 ? (
                  <div className="text-center py-8 text-slate-400">
                    <Shield className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No flagged vehicles found</p>
                    <p className="text-sm">All vehicles are currently cleared</p>
                  </div>
                ) : (
                  blacklistedVehicles.map((vehicle) => (
                    <div key={vehicle.plate} className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-mono text-red-400 font-bold text-lg">{vehicle.plate}</div>
                        <Badge 
                          variant="destructive"
                          className={
                            vehicle.priority === "high" ? "bg-red-500/30 text-red-400" :
                            vehicle.priority === "medium" ? "bg-orange-500/30 text-orange-400" :
                            "bg-yellow-500/30 text-yellow-400"
                          }
                        >
                          {vehicle.priority} priority
                        </Badge>
                      </div>
                      <div className="text-slate-300 mb-1">Reason: {vehicle.reason}</div>
                      <div className="text-slate-400 text-sm">Flagged: {vehicle.dateAdded}</div>
                    </div>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-slate-700/30 border-slate-600">
                  <CardHeader>
                    <CardTitle className="text-white text-lg">Live Detection Trends</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Total Detections</span>
                        <span className="text-white font-semibold">{statistics.totalRecords} vehicles</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Today's Activity</span>
                        <span className="text-white font-semibold">{statistics.todayDetections} detections</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Average Confidence</span>
                        <span className="text-white font-semibold">{statistics.avgAccuracy}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Alert Rate</span>
                        <span className="text-white font-semibold">
                          {statistics.totalRecords > 0 ? Math.round((statistics.blacklisted / statistics.totalRecords) * 100) : 0}%
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-700/30 border-slate-600">
                  <CardHeader>
                    <CardTitle className="text-white text-lg">Top Detection Locations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {uniqueLocations.slice(1, 5).map(location => {
                        const count = detections.filter(d => d.location === location).length;
                        return (
                          <div key={location} className="flex justify-between">
                            <span className="text-slate-400">{location}</span>
                            <span className="text-white font-semibold">{count} vehicles</span>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default VehicleDatabase;
