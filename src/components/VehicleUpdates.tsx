
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Car, MapPin, Clock, Shield, Eye, AlertTriangle, Activity, Zap, RefreshCw } from "lucide-react";
import { useSupabaseRealTimeData } from "@/hooks/useSupabaseRealTimeData";

const VehicleUpdates = () => {
  const { detections, addDetection, cameras } = useSupabaseRealTimeData();
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Get unique locations for filtering
  const uniqueLocations = ["All Locations", ...Array.from(new Set(detections.map(d => d.location)))];

  // Filter detections based on search and location
  const filteredDetections = detections.filter(detection => {
    const matchesSearch = detection.plate_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         detection.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = selectedLocation === "All Locations" || detection.location === selectedLocation;
    return matchesSearch && matchesLocation;
  });

  // Simulate adding new detection for demo
  const simulateDetection = async () => {
    const locations = ['East Checkpoint', 'West Barrier', 'North Gate', 'Main Road', 'South Gate', 'Toll Plaza'];
    const plateFormats = ['ZLA', 'VQQ', 'CFH', 'TRN', 'WNR', 'DBQ'];
    
    const mockDetection = {
      plate_number: `${plateFormats[Math.floor(Math.random() * plateFormats.length)]} ${String(Math.floor(100 + Math.random() * 900))}`,
      camera_id: `CAM-${String(Math.floor(Math.random() * 8) + 1).padStart(2, '0')}`,
      confidence: Math.floor(80 + Math.random() * 20),
      location: locations[Math.floor(Math.random() * locations.length)],
      status: Math.random() > 0.85 ? 'flagged' : 'cleared' as 'cleared' | 'flagged' | 'processing'
    };

    const success = await addDetection(mockDetection);
    if (success) {
      setLastUpdate(new Date());
    }
  };

  // Auto-refresh simulation - more frequent updates
  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      if (Math.random() > 0.4) { // 60% chance to add new detection
        simulateDetection();
      }
    }, 3000); // Update every 3 seconds instead of 8

    return () => clearInterval(interval);
  }, [autoRefresh]);

  // Update last update time when detections change
  useEffect(() => {
    setLastUpdate(new Date());
  }, [detections]);

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'flagged':
        return <Badge variant="destructive" className="bg-red-500 text-white animate-pulse">Alert</Badge>;
      case 'processing':
        return <Badge variant="secondary" className="bg-yellow-500 text-white">Processing</Badge>;
      default:
        return <Badge variant="secondary" className="bg-green-500 text-white">Normal</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center space-x-3">
          <Eye className="w-6 h-6 text-blue-400" />
          <div>
            <h2 className="text-xl font-bold text-white">Live Vehicle Updates</h2>
            <p className="text-slate-400 text-sm">
              Real-time ANPR detections and vehicle tracking • Last update: {lastUpdate.toLocaleTimeString()}
            </p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <Button
            variant={autoRefresh ? "default" : "outline"}
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
            className="flex items-center space-x-2"
          >
            <Activity className={`w-4 h-4 ${autoRefresh ? 'animate-pulse' : ''}`} />
            <span>{autoRefresh ? 'Auto-Updating' : 'Paused'}</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={simulateDetection}
            className="flex items-center space-x-2"
          >
            <Zap className="w-4 h-4" />
            <span>Add Detection</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setLastUpdate(new Date())}
            className="flex items-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </Button>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search plates or locations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="md:w-64">
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {uniqueLocations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>
            {searchTerm && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSearchTerm("")}
                className="whitespace-nowrap"
              >
                Clear
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Vehicle Detection Table */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <span className="flex items-center">
              <Car className="w-5 h-5 mr-2" />
              Vehicle Detection Log ({filteredDetections.length} entries)
            </span>
            <Badge variant="secondary" className={`${autoRefresh ? 'bg-green-500/20 text-green-400 border-green-500/30 animate-pulse' : 'bg-gray-500/20 text-gray-400 border-gray-500/30'}`}>
              {autoRefresh ? 'LIVE AUTO-UPDATE' : 'PAUSED'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700">
                  <TableHead className="text-slate-300">Plate Number</TableHead>
                  <TableHead className="text-slate-300">Location</TableHead>
                  <TableHead className="text-slate-300">Timestamp</TableHead>
                  <TableHead className="text-slate-300">Confidence</TableHead>
                  <TableHead className="text-slate-300">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDetections.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-slate-400">
                      <Car className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>No vehicle detections found</p>
                      <p className="text-sm">Try adjusting your search or filters</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDetections.map((detection, index) => (
                    <TableRow 
                      key={detection.id} 
                      className={`border-slate-700 hover:bg-slate-700/30 ${index === 0 && autoRefresh ? 'animate-pulse bg-blue-500/10' : ''}`}
                    >
                      <TableCell className="font-mono text-white font-bold">{detection.plate_number}</TableCell>
                      <TableCell className="text-slate-300">{detection.location}</TableCell>
                      <TableCell className="text-slate-300">{formatTime(detection.timestamp)}</TableCell>
                      <TableCell className="text-slate-300">{detection.confidence}%</TableCell>
                      <TableCell>{getStatusBadge(detection.status)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-400">Total Detections</div>
                <div className="text-2xl font-bold text-white">{detections.length}</div>
              </div>
              <Car className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-400">Alerts</div>
                <div className="text-2xl font-bold text-white">{detections.filter(d => d.status === 'flagged').length}</div>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-400">Locations</div>
                <div className="text-2xl font-bold text-white">{uniqueLocations.length - 1}</div>
              </div>
              <MapPin className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-400">Avg Confidence</div>
                <div className="text-2xl font-bold text-white">
                  {detections.length > 0 ? Math.round(detections.reduce((acc, d) => acc + d.confidence, 0) / detections.length) : 0}%
                </div>
              </div>
              <Shield className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VehicleUpdates;
