
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Database, Shield, AlertTriangle, Plus, Download } from "lucide-react";

const VehicleDatabase = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const vehicleRecords = [
    { id: 1, plate: "ABC-1234", timestamp: "2024-06-10 10:45:32", location: "Main Gate", status: "cleared", owner: "John Doe", vehicle: "Toyota Camry" },
    { id: 2, plate: "XYZ-9876", timestamp: "2024-06-10 10:43:15", location: "Highway Junction", status: "flagged", owner: "Flagged Vehicle", vehicle: "Unknown" },
    { id: 3, plate: "DEF-5678", timestamp: "2024-06-10 10:41:28", location: "Parking Entrance", status: "cleared", owner: "Jane Smith", vehicle: "Honda Civic" },
    { id: 4, plate: "GHI-2468", timestamp: "2024-06-10 10:39:45", location: "Toll Plaza", status: "cleared", owner: "Mike Johnson", vehicle: "Ford F-150" },
    { id: 5, plate: "JKL-1357", timestamp: "2024-06-10 10:37:22", location: "Main Gate", status: "watchlist", owner: "Under Investigation", vehicle: "BMW X5" },
  ];

  const blacklistedVehicles = [
    { plate: "XYZ-9876", reason: "Stolen Vehicle", dateAdded: "2024-06-01", priority: "high" },
    { plate: "STU-4444", reason: "Outstanding Violations", dateAdded: "2024-06-05", priority: "medium" },
    { plate: "VWX-7777", reason: "Suspicious Activity", dateAdded: "2024-06-08", priority: "low" },
  ];

  const statistics = {
    totalRecords: 15749,
    todayDetections: 287,
    blacklisted: 23,
    watchlist: 8,
    avgAccuracy: 95.3
  };

  const filteredRecords = vehicleRecords.filter(record => 
    record.plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.vehicle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Database Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-white">{statistics.totalRecords.toLocaleString()}</div>
            <div className="text-sm text-slate-400">Total Records</div>
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
            <div className="text-sm text-slate-400">Blacklisted</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-400">{statistics.watchlist}</div>
            <div className="text-sm text-slate-400">Watchlist</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-400">{statistics.avgAccuracy}%</div>
            <div className="text-sm text-slate-400">Avg Accuracy</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Database Interface */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center">
              <Database className="w-5 h-5 mr-2" />
              Vehicle Database Management
            </CardTitle>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Vehicle
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="records" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3 bg-slate-700/50">
              <TabsTrigger value="records" className="data-[state=active]:bg-blue-600">All Records</TabsTrigger>
              <TabsTrigger value="blacklist" className="data-[state=active]:bg-blue-600">Blacklist</TabsTrigger>
              <TabsTrigger value="analytics" className="data-[state=active]:bg-blue-600">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="records" className="space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input 
                  placeholder="Search by plate number, owner, or vehicle..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-700/50 border-slate-600 text-white"
                />
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
                        <th className="text-left p-4 text-slate-200 font-semibold">Owner</th>
                        <th className="text-left p-4 text-slate-200 font-semibold">Vehicle</th>
                        <th className="text-left p-4 text-slate-200 font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRecords.map((record) => (
                        <tr key={record.id} className="border-t border-slate-600/50 hover:bg-slate-600/30">
                          <td className="p-4 font-mono text-white font-semibold">{record.plate}</td>
                          <td className="p-4 text-slate-300">{record.timestamp}</td>
                          <td className="p-4 text-slate-300">{record.location}</td>
                          <td className="p-4 text-slate-300">{record.owner}</td>
                          <td className="p-4 text-slate-300">{record.vehicle}</td>
                          <td className="p-4">
                            <Badge 
                              variant={
                                record.status === "flagged" ? "destructive" : 
                                record.status === "watchlist" ? "default" : 
                                "secondary"
                              }
                              className={
                                record.status === "flagged" ? "bg-red-500/20 text-red-400 border-red-500/30" :
                                record.status === "watchlist" ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" :
                                "bg-green-500/20 text-green-400 border-green-500/30"
                              }
                            >
                              {record.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="blacklist" className="space-y-4">
              <div className="space-y-4">
                {blacklistedVehicles.map((vehicle) => (
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
                    <div className="text-slate-400 text-sm">Added: {vehicle.dateAdded}</div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-slate-700/30 border-slate-600">
                  <CardHeader>
                    <CardTitle className="text-white text-lg">Detection Trends</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Today</span>
                        <span className="text-white font-semibold">287 detections</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Yesterday</span>
                        <span className="text-white font-semibold">245 detections</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">This Week</span>
                        <span className="text-white font-semibold">1,834 detections</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">This Month</span>
                        <span className="text-white font-semibold">7,295 detections</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-700/30 border-slate-600">
                  <CardHeader>
                    <CardTitle className="text-white text-lg">Top Locations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Highway Junction</span>
                        <span className="text-white font-semibold">89 vehicles</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Main Gate</span>
                        <span className="text-white font-semibold">76 vehicles</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Toll Plaza</span>
                        <span className="text-white font-semibold">65 vehicles</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Parking Entrance</span>
                        <span className="text-white font-semibold">42 vehicles</span>
                      </div>
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
