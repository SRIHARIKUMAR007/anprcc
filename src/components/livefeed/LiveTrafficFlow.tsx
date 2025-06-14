
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus, Car, Truck, Bus, Bike } from "lucide-react";

interface TrafficData {
  timestamp: string;
  totalVehicles: number;
  cars: number;
  trucks: number;
  buses: number;
  motorcycles: number;
  averageSpeed: number;
  congestionLevel: 'low' | 'medium' | 'high';
  trend: 'up' | 'down' | 'stable';
}

interface LiveTrafficFlowProps {
  cameraId: string;
  isLive: boolean;
}

const LiveTrafficFlow = ({ cameraId, isLive }: LiveTrafficFlowProps) => {
  const [trafficData, setTrafficData] = useState<TrafficData[]>([]);
  const [currentData, setCurrentData] = useState<TrafficData>({
    timestamp: new Date().toISOString(),
    totalVehicles: 12,
    cars: 8,
    trucks: 2,
    buses: 1,
    motorcycles: 1,
    averageSpeed: 45,
    congestionLevel: 'medium',
    trend: 'stable'
  });

  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      const newData: TrafficData = {
        timestamp: new Date().toISOString(),
        totalVehicles: Math.max(0, currentData.totalVehicles + Math.floor(Math.random() * 6 - 3)),
        cars: Math.max(0, currentData.cars + Math.floor(Math.random() * 4 - 2)),
        trucks: Math.max(0, currentData.trucks + Math.floor(Math.random() * 3 - 1)),
        buses: Math.max(0, currentData.buses + Math.floor(Math.random() * 2 - 1)),
        motorcycles: Math.max(0, currentData.motorcycles + Math.floor(Math.random() * 3 - 1)),
        averageSpeed: Math.max(15, Math.min(80, currentData.averageSpeed + Math.floor(Math.random() * 10 - 5))),
        congestionLevel: Math.random() > 0.8 ? 
          (['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high') : 
          currentData.congestionLevel,
        trend: Math.random() > 0.7 ? 
          (['up', 'down', 'stable'][Math.floor(Math.random() * 3)] as 'up' | 'down' | 'stable') : 
          currentData.trend
      };

      setCurrentData(newData);
      setTrafficData(prev => [newData, ...prev.slice(0, 19)]);
    }, 3000);

    return () => clearInterval(interval);
  }, [isLive, currentData]);

  const getCongestionColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-green-500/20 text-green-400 border-green-500/30';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-3 h-3 text-green-400" />;
      case 'down': return <TrendingDown className="w-3 h-3 text-red-400" />;
      default: return <Minus className="w-3 h-3 text-yellow-400" />;
    }
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white text-sm flex items-center justify-between">
          <span>Live Traffic Flow - {cameraId}</span>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`}></div>
            <Badge variant="secondary" className={getCongestionColor(currentData.congestionLevel)}>
              {currentData.congestionLevel.toUpperCase()}
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-700/30 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-xs">Total Vehicles</span>
              {getTrendIcon(currentData.trend)}
            </div>
            <div className="text-white text-lg font-bold">{currentData.totalVehicles}</div>
          </div>
          
          <div className="bg-slate-700/30 rounded-lg p-3">
            <div className="text-slate-400 text-xs mb-2">Avg Speed</div>
            <div className="text-white text-lg font-bold">{currentData.averageSpeed} km/h</div>
          </div>
        </div>

        {/* Vehicle Breakdown */}
        <div className="space-y-2">
          <div className="text-slate-400 text-xs font-medium">Vehicle Types</div>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center justify-between bg-slate-700/20 rounded px-2 py-1">
              <div className="flex items-center space-x-1">
                <Car className="w-3 h-3 text-blue-400" />
                <span className="text-slate-300 text-xs">Cars</span>
              </div>
              <span className="text-white text-xs font-bold">{currentData.cars}</span>
            </div>
            
            <div className="flex items-center justify-between bg-slate-700/20 rounded px-2 py-1">
              <div className="flex items-center space-x-1">
                <Truck className="w-3 h-3 text-orange-400" />
                <span className="text-slate-300 text-xs">Trucks</span>
              </div>
              <span className="text-white text-xs font-bold">{currentData.trucks}</span>
            </div>
            
            <div className="flex items-center justify-between bg-slate-700/20 rounded px-2 py-1">
              <div className="flex items-center space-x-1">
                <Bus className="w-3 h-3 text-green-400" />
                <span className="text-slate-300 text-xs">Buses</span>
              </div>
              <span className="text-white text-xs font-bold">{currentData.buses}</span>
            </div>
            
            <div className="flex items-center justify-between bg-slate-700/20 rounded px-2 py-1">
              <div className="flex items-center space-x-1">
                <Bike className="w-3 h-3 text-purple-400" />
                <span className="text-slate-300 text-xs">Bikes</span>
              </div>
              <span className="text-white text-xs font-bold">{currentData.motorcycles}</span>
            </div>
          </div>
        </div>

        {/* Recent History */}
        <div className="space-y-2">
          <div className="text-slate-400 text-xs font-medium">Recent Activity</div>
          <div className="max-h-32 overflow-y-auto space-y-1">
            {trafficData.slice(0, 5).map((data, index) => (
              <div key={index} className="flex items-center justify-between text-xs bg-slate-700/20 rounded px-2 py-1">
                <span className="text-slate-400">
                  {new Date(data.timestamp).toLocaleTimeString()}
                </span>
                <div className="flex items-center space-x-2">
                  <span className="text-white">{data.totalVehicles} vehicles</span>
                  <span className="text-slate-400">{data.averageSpeed} km/h</span>
                  {getTrendIcon(data.trend)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LiveTrafficFlow;
