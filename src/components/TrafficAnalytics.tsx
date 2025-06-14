
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, Clock, MapPin } from "lucide-react";
import { useSupabaseRealTimeData } from '@/hooks/useSupabaseRealTimeData';

const TrafficAnalytics = () => {
  const { detections, systemStats, isConnected } = useSupabaseRealTimeData();
  const [hourlyData, setHourlyData] = useState([
    { hour: "00", vehicles: 12, accuracy: 94 },
    { hour: "01", vehicles: 8, accuracy: 95 },
    { hour: "02", vehicles: 5, accuracy: 93 },
    { hour: "03", vehicles: 7, accuracy: 96 },
    { hour: "04", vehicles: 15, accuracy: 94 },
    { hour: "05", vehicles: 45, accuracy: 95 },
    { hour: "06", vehicles: 120, accuracy: 93 },
    { hour: "07", vehicles: 198, accuracy: 94 },
    { hour: "08", vehicles: 245, accuracy: 92 },
    { hour: "09", vehicles: 189, accuracy: 95 },
    { hour: "10", vehicles: 156, accuracy: 96 },
    { hour: "11", vehicles: 178, accuracy: 94 },
  ]);

  const [currentStats, setCurrentStats] = useState({
    totalDetections: 3795,
    avgAccuracy: 95.1,
    flaggedVehicles: 25,
    activeLocations: 8
  });

  // Update analytics with live data
  useEffect(() => {
    if (detections.length > 0) {
      // Update hourly data based on live detections
      const currentHour = new Date().getHours();
      const recentDetections = detections.filter(d => {
        const detectionHour = new Date(d.timestamp).getHours();
        return detectionHour === currentHour;
      });

      if (recentDetections.length > 0) {
        setHourlyData(prev => prev.map(data => {
          if (data.hour === currentHour.toString().padStart(2, '0')) {
            const avgConfidence = recentDetections.reduce((sum, d) => sum + d.confidence, 0) / recentDetections.length;
            return {
              ...data,
              vehicles: recentDetections.length,
              accuracy: Math.round(avgConfidence)
            };
          }
          return data;
        }));
      }

      // Update overall stats
      const flaggedCount = detections.filter(d => d.status === 'flagged').length;
      const avgConfidence = detections.reduce((sum, d) => sum + d.confidence, 0) / detections.length;
      
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
      setCurrentStats(prev => ({
        ...prev,
        totalDetections: systemStats.detections_today,
        avgAccuracy: systemStats.accuracy_rate
      }));
    }
  }, [systemStats]);

  const locationStats = [
    { location: "Highway Junction", detections: Math.floor(currentStats.totalDetections * 0.33), flagged: Math.floor(currentStats.flaggedVehicles * 0.32), accuracy: currentStats.avgAccuracy + 0.1 },
    { location: "Main Gate", detections: Math.floor(currentStats.totalDetections * 0.29), flagged: Math.floor(currentStats.flaggedVehicles * 0.12), accuracy: currentStats.avgAccuracy + 1.0 },
    { location: "Toll Plaza", detections: Math.floor(currentStats.totalDetections * 0.24), flagged: Math.floor(currentStats.flaggedVehicles * 0.48), accuracy: currentStats.avgAccuracy - 1.4 },
    { location: "Parking Entrance", detections: Math.floor(currentStats.totalDetections * 0.15), flagged: Math.floor(currentStats.flaggedVehicles * 0.08), accuracy: currentStats.avgAccuracy + 2.2 },
  ];

  const maxVehicles = Math.max(...hourlyData.map(d => d.vehicles));

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Traffic Analytics</h1>
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
          <span className="text-sm text-slate-400">
            {isConnected ? 'Live Data' : 'Offline'}
          </span>
        </div>
      </div>

      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-white">{currentStats.totalDetections.toLocaleString()}</div>
                <div className="text-sm text-slate-400">Total Detections</div>
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
              </div>
              <MapPin className="w-6 h-6 text-cyan-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Hourly Traffic Chart */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <span>Hourly Traffic Analysis</span>
            {isConnected && (
              <span className="text-xs text-green-400">● Live Updates</span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Vehicle Detections by Hour</span>
              <span className="text-slate-400">Peak: {maxVehicles} vehicles</span>
            </div>
            
            <div className="grid grid-cols-12 gap-2 h-64">
              {hourlyData.map((data) => (
                <div key={data.hour} className="flex flex-col justify-end items-center space-y-2">
                  <div className="text-xs text-slate-400 mb-1">{data.vehicles}</div>
                  <div 
                    className="w-full bg-gradient-to-t from-blue-500 to-cyan-400 rounded-t transition-all hover:from-blue-400 hover:to-cyan-300"
                    style={{ 
                      height: `${(data.vehicles / maxVehicles) * 200}px`,
                      minHeight: '4px'
                    }}
                  ></div>
                  <div className="text-xs text-slate-400">{data.hour}:00</div>
                </div>
              ))}
            </div>

            <div className="mt-4 p-3 bg-slate-700/30 rounded-lg">
              <div className="text-sm text-slate-300 mb-2">Recognition Accuracy by Hour</div>
              <div className="grid grid-cols-12 gap-2">
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

      {/* Location Statistics */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Location Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {locationStats.map((location) => (
              <div key={location.location} className="p-4 bg-slate-700/30 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-white font-semibold">{location.location}</div>
                  <div className="text-slate-400 text-sm">{location.accuracy.toFixed(1)}% accuracy</div>
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
                      {((location.flagged / location.detections) * 100).toFixed(2)}%
                    </div>
                  </div>
                </div>

                <div className="mt-3">
                  <div className="w-full bg-slate-600 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-cyan-400 h-2 rounded-full transition-all"
                      style={{ width: `${(location.detections / Math.max(...locationStats.map(l => l.detections))) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">System Performance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Processing Speed</span>
              <span className="text-white font-semibold">2.3ms avg</span>
            </div>
            <div className="w-full bg-slate-600 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full w-4/5"></div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-400">Network Throughput</span>
              <span className="text-white font-semibold">89% utilization</span>
            </div>
            <div className="w-full bg-slate-600 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full w-5/6"></div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-400">Storage Usage</span>
              <span className="text-white font-semibold">67% capacity</span>
            </div>
            <div className="w-full bg-slate-600 rounded-full h-2">
              <div className="bg-yellow-500 h-2 rounded-full w-2/3"></div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Detection Trends</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-slate-400">Today vs Yesterday</span>
              <span className="text-green-400 font-semibold">+17.2%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">This Week vs Last</span>
              <span className="text-green-400 font-semibold">+8.5%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Accuracy Improvement</span>
              <span className="text-green-400 font-semibold">+2.1%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">False Positives</span>
              <span className="text-red-400 font-semibold">-12.3%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">System Uptime</span>
              <span className="text-green-400 font-semibold">99.8%</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TrafficAnalytics;
