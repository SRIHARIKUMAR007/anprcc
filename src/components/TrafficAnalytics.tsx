
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, Clock, MapPin } from "lucide-react";
import { useSupabaseRealTimeData } from '@/hooks/useSupabaseRealTimeData';

const TrafficAnalytics = () => {
  const { detections, systemStats, isConnected } = useSupabaseRealTimeData();
  const [hourlyData, setHourlyData] = useState([
    { hour: "00", vehicles: 0, accuracy: 95 },
    { hour: "01", vehicles: 0, accuracy: 95 },
    { hour: "02", vehicles: 0, accuracy: 93 },
    { hour: "03", vehicles: 0, accuracy: 96 },
    { hour: "04", vehicles: 0, accuracy: 94 },
    { hour: "05", vehicles: 0, accuracy: 95 },
    { hour: "06", vehicles: 0, accuracy: 93 },
    { hour: "07", vehicles: 0, accuracy: 94 },
    { hour: "08", vehicles: 0, accuracy: 92 },
    { hour: "09", vehicles: 0, accuracy: 95 },
    { hour: "10", vehicles: 0, accuracy: 96 },
    { hour: "11", vehicles: 0, accuracy: 94 },
    { hour: "12", vehicles: 0, accuracy: 95 },
    { hour: "13", vehicles: 0, accuracy: 93 },
    { hour: "14", vehicles: 0, accuracy: 96 },
    { hour: "15", vehicles: 0, accuracy: 94 },
    { hour: "16", vehicles: 0, accuracy: 95 },
    { hour: "17", vehicles: 0, accuracy: 92 },
    { hour: "18", vehicles: 0, accuracy: 94 },
    { hour: "19", vehicles: 0, accuracy: 95 },
    { hour: "20", vehicles: 0, accuracy: 96 },
    { hour: "21", vehicles: 0, accuracy: 94 },
    { hour: "22", vehicles: 0, accuracy: 93 },
    { hour: "23", vehicles: 0, accuracy: 95 },
  ]);

  const [currentStats, setCurrentStats] = useState({
    totalDetections: 0,
    avgAccuracy: 95.1,
    flaggedVehicles: 0,
    activeLocations: 0
  });

  // Update hourly data with live detections in real-time
  useEffect(() => {
    if (detections.length > 0) {
      console.log('Updating hourly analytics with live data:', detections.length, 'detections');
      
      // Group detections by hour
      const hourlyGroups = detections.reduce((acc, detection) => {
        const hour = new Date(detection.timestamp).getHours().toString().padStart(2, '0');
        if (!acc[hour]) {
          acc[hour] = [];
        }
        acc[hour].push(detection);
        return acc;
      }, {} as Record<string, typeof detections>);

      // Update hourly data with live counts and accuracy
      setHourlyData(prev => prev.map(data => {
        const hourDetections = hourlyGroups[data.hour] || [];
        const vehicles = hourDetections.length;
        
        // Calculate average confidence for this hour
        const avgConfidence = hourDetections.length > 0 
          ? hourDetections.reduce((sum, d) => sum + d.confidence, 0) / hourDetections.length
          : data.accuracy;
        
        return {
          ...data,
          vehicles,
          accuracy: Math.round(avgConfidence)
        };
      }));

      // Update overall stats with live data
      const flaggedCount = detections.filter(d => d.status === 'flagged').length;
      const avgConfidence = detections.length > 0
        ? detections.reduce((sum, d) => sum + d.confidence, 0) / detections.length
        : 95.1;
      
      setCurrentStats({
        totalDetections: detections.length,
        avgAccuracy: Math.round(avgConfidence * 10) / 10,
        flaggedVehicles: flaggedCount,
        activeLocations: new Set(detections.map(d => d.location)).size
      });
    }
  }, [detections]);

  // Update with system stats if available
  useEffect(() => {
    if (systemStats) {
      console.log('Updating analytics with system stats:', systemStats);
      setCurrentStats(prev => ({
        ...prev,
        totalDetections: systemStats.detections_today,
        avgAccuracy: systemStats.accuracy_rate
      }));
    }
  }, [systemStats]);

  // Generate location stats from live data
  const locationStats = currentStats.activeLocations > 0 ? 
    Array.from(new Set(detections.map(d => d.location))).map(location => {
      const locationDetections = detections.filter(d => d.location === location);
      const flagged = locationDetections.filter(d => d.status === 'flagged').length;
      const avgAccuracy = locationDetections.length > 0
        ? locationDetections.reduce((sum, d) => sum + d.confidence, 0) / locationDetections.length
        : 95;
      
      return {
        location,
        detections: locationDetections.length,
        flagged,
        accuracy: avgAccuracy
      };
    }).slice(0, 4) : [
      { location: "Highway Junction", detections: Math.floor(currentStats.totalDetections * 0.33), flagged: Math.floor(currentStats.flaggedVehicles * 0.32), accuracy: currentStats.avgAccuracy + 0.1 },
      { location: "Main Gate", detections: Math.floor(currentStats.totalDetections * 0.29), flagged: Math.floor(currentStats.flaggedVehicles * 0.12), accuracy: currentStats.avgAccuracy + 1.0 },
      { location: "Toll Plaza", detections: Math.floor(currentStats.totalDetections * 0.24), flagged: Math.floor(currentStats.flaggedVehicles * 0.48), accuracy: currentStats.avgAccuracy - 1.4 },
      { location: "Parking Entrance", detections: Math.floor(currentStats.totalDetections * 0.15), flagged: Math.floor(currentStats.flaggedVehicles * 0.08), accuracy: currentStats.avgAccuracy + 2.2 },
    ];

  const maxVehicles = Math.max(...hourlyData.map(d => d.vehicles), 1);

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Live Traffic Analytics</h1>
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
          <span className="text-sm text-slate-400">
            {isConnected ? 'Live Data Active' : 'Offline Mode'}
          </span>
        </div>
      </div>

      {/* Live Data Status Banner */}
      {isConnected && detections.length > 0 && (
        <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4 flex items-center space-x-3">
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          <div>
            <div className="text-green-400 font-semibold text-sm">Live Analytics Active</div>
            <div className="text-green-300 text-xs mt-1">
              Real-time data from {detections.length} detections • Last update: {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>
      )}

      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-white">{currentStats.totalDetections.toLocaleString()}</div>
                <div className="text-sm text-slate-400">Total Detections</div>
                {isConnected && <div className="text-xs text-green-400 mt-1">● Live</div>}
              </div>
              <BarChart3 className="w-6 h-6 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-400">{currentStats.avgAccuracy}%</div>
                <div className="text-sm text-slate-400">Avg Accuracy</div>
                {isConnected && <div className="text-xs text-green-400 mt-1">● Live</div>}
              </div>
              <TrendingUp className="w-6 h-6 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-yellow-400">{currentStats.flaggedVehicles}</div>
                <div className="text-sm text-slate-400">Flagged Vehicles</div>
                {isConnected && <div className="text-xs text-green-400 mt-1">● Live</div>}
              </div>
              <Clock className="w-6 h-6 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-cyan-400">{currentStats.activeLocations}</div>
                <div className="text-sm text-slate-400">Active Locations</div>
                {isConnected && <div className="text-xs text-green-400 mt-1">● Live</div>}
              </div>
              <MapPin className="w-6 h-6 text-cyan-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Live Hourly Traffic Chart */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <span>Live Hourly Traffic Analysis</span>
            <div className="flex items-center space-x-2">
              {isConnected && (
                <span className="text-xs text-green-400 flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></div>
                  Live Updates
                </span>
              )}
              <span className="text-xs text-slate-400">Peak: {maxVehicles} vehicles</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Vehicle Detections by Hour (Real-time)</span>
              <span className="text-slate-400">Total Today: {currentStats.totalDetections}</span>
            </div>
            
            <div className="grid grid-cols-12 gap-1 h-64">
              {hourlyData.map((data) => (
                <div key={data.hour} className="flex flex-col justify-end items-center space-y-2">
                  <div className="text-xs text-slate-400 mb-1">{data.vehicles}</div>
                  <div 
                    className={`w-full rounded-t transition-all hover:from-blue-400 hover:to-cyan-300 ${
                      data.vehicles > 0 ? 'bg-gradient-to-t from-blue-500 to-cyan-400' : 'bg-slate-600'
                    } ${isConnected && data.vehicles > 0 ? 'animate-pulse' : ''}`}
                    style={{ 
                      height: `${(data.vehicles / maxVehicles) * 200}px`,
                      minHeight: data.vehicles > 0 ? '8px' : '4px'
                    }}
                  ></div>
                  <div className="text-xs text-slate-400">{data.hour}:00</div>
                </div>
              ))}
            </div>

            <div className="mt-4 p-3 bg-slate-700/30 rounded-lg">
              <div className="text-sm text-slate-300 mb-2 flex items-center justify-between">
                <span>Recognition Accuracy by Hour</span>
                {isConnected && <span className="text-xs text-green-400">● Live</span>}
              </div>
              <div className="grid grid-cols-12 gap-1">
                {hourlyData.map((data) => (
                  <div key={`acc-${data.hour}`} className="text-center">
                    <div className={`text-xs ${data.accuracy >= 95 ? 'text-green-400' : data.accuracy >= 90 ? 'text-yellow-400' : 'text-red-400'}`}>
                      {data.accuracy}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Live Location Statistics */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <span>Live Location Performance</span>
            {isConnected && (
              <span className="text-xs text-green-400 flex items-center">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></div>
                Real-time Data
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {locationStats.map((location) => (
              <div key={location.location} className="p-4 bg-slate-700/30 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-white font-semibold">{location.location}</div>
                  <div className="flex items-center space-x-2">
                    <div className="text-slate-400 text-sm">{location.accuracy.toFixed(1)}% accuracy</div>
                    {isConnected && <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>}
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="text-slate-400">Detections</div>
                    <div className="text-white font-semibold">{location.detections.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-slate-400">Flagged</div>
                    <div className="text-yellow-400 font-semibold">{location.flagged}</div>
                  </div>
                  <div>
                    <div className="text-slate-400">Flag Rate</div>
                    <div className="text-slate-300 font-semibold">
                      {location.detections > 0 ? ((location.flagged / location.detections) * 100).toFixed(2) : '0.00'}%
                    </div>
                  </div>
                </div>

                <div className="mt-3">
                  <div className="w-full bg-slate-600 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all ${
                        isConnected ? 'bg-gradient-to-r from-blue-500 to-cyan-400 animate-pulse' : 'bg-gradient-to-r from-blue-500 to-cyan-400'
                      }`}
                      style={{ width: `${Math.max((location.detections / Math.max(...locationStats.map(l => l.detections), 1)) * 100, 5)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Live Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              <span>Live System Performance</span>
              {isConnected && <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Processing Speed</span>
              <span className="text-white font-semibold">
                {systemStats ? `${(systemStats.network_latency || 2.3).toFixed(1)}ms avg` : '2.3ms avg'}
              </span>
            </div>
            <div className="w-full bg-slate-600 rounded-full h-2">
              <div className={`bg-green-500 h-2 rounded-full w-4/5 ${isConnected ? 'animate-pulse' : ''}`}></div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-400">CPU Usage</span>
              <span className="text-white font-semibold">
                {systemStats ? `${Math.round(systemStats.cpu_usage)}%` : '75%'}
              </span>
            </div>
            <div className="w-full bg-slate-600 rounded-full h-2">
              <div className={`bg-blue-500 h-2 rounded-full ${isConnected ? 'animate-pulse' : ''}`} 
                   style={{ width: `${systemStats ? systemStats.cpu_usage : 75}%` }}></div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-400">Memory Usage</span>
              <span className="text-white font-semibold">
                {systemStats ? `${Math.round(systemStats.memory_usage)}%` : '67%'}
              </span>
            </div>
            <div className="w-full bg-slate-600 rounded-full h-2">
              <div className={`bg-yellow-500 h-2 rounded-full ${isConnected ? 'animate-pulse' : ''}`}
                   style={{ width: `${systemStats ? systemStats.memory_usage : 67}%` }}></div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              <span>Live Detection Trends</span>
              {isConnected && <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-slate-400">Current Hour Detections</span>
              <span className="text-green-400 font-semibold">
                {systemStats ? systemStats.detections_hour : hourlyData[new Date().getHours()]?.vehicles || 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Today's Total</span>
              <span className="text-green-400 font-semibold">
                {systemStats ? systemStats.detections_today : currentStats.totalDetections}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Accuracy Rate</span>
              <span className="text-green-400 font-semibold">
                {systemStats ? `${systemStats.accuracy_rate.toFixed(1)}%` : `${currentStats.avgAccuracy}%`}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Active Cameras</span>
              <span className="text-green-400 font-semibold">
                {systemStats ? `${systemStats.active_cameras}/${systemStats.total_cameras}` : '8/10'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">System Status</span>
              <span className={`font-semibold ${isConnected ? 'text-green-400' : 'text-yellow-400'}`}>
                {isConnected ? 'Live & Connected' : 'Demo Mode'}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TrafficAnalytics;
