
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Navigation, 
  Car, 
  Clock, 
  IndianRupee, 
  Activity,
  BarChart3,
  AlertTriangle,
  CheckCircle
} from "lucide-react";

interface TollPlaza {
  id: string;
  name: string;
  location: string;
  highway: string;
  totalLanes: number;
  activeLanes: number;
  queueLength: number;
  averageWaitTime: number;
  revenue: number;
  vehiclesPassed: number;
  status: 'operational' | 'maintenance' | 'congested';
}

const TollPlazaMonitor = () => {
  const [tollPlazas, setTollPlazas] = useState<TollPlaza[]>([]);
  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    const initializeTollPlazas = () => {
      const tamilNaduTolls: TollPlaza[] = [
        {
          id: 'TP-001',
          name: 'Krishnagiri Toll Plaza',
          location: 'Krishnagiri',
          highway: 'NH-44 (Chennai-Bangalore)',
          totalLanes: 8,
          activeLanes: 7,
          queueLength: 12,
          averageWaitTime: 3.5,
          revenue: 245000,
          vehiclesPassed: 1240,
          status: 'operational'
        },
        {
          id: 'TP-002',
          name: 'Kancheepuram Toll Plaza',
          location: 'Kancheepuram',
          highway: 'NH-4 (Chennai-Mumbai)',
          totalLanes: 6,
          activeLanes: 6,
          queueLength: 8,
          averageWaitTime: 2.1,
          revenue: 187000,
          vehiclesPassed: 980,
          status: 'operational'
        },
        {
          id: 'TP-003',
          name: 'Trichy Toll Plaza',
          location: 'Tiruchirappalli',
          highway: 'NH-38',
          totalLanes: 6,
          activeLanes: 5,
          queueLength: 25,
          averageWaitTime: 8.2,
          revenue: 156000,
          vehiclesPassed: 756,
          status: 'congested'
        },
        {
          id: 'TP-004',
          name: 'Salem Toll Plaza',
          location: 'Salem',
          highway: 'NH-544',
          totalLanes: 4,
          activeLanes: 3,
          queueLength: 5,
          averageWaitTime: 1.8,
          revenue: 123000,
          vehiclesPassed: 642,
          status: 'maintenance'
        }
      ];
      
      setTollPlazas(tamilNaduTolls);
    };

    initializeTollPlazas();
  }, []);

  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      setTollPlazas(prev => prev.map(toll => ({
        ...toll,
        queueLength: Math.max(0, toll.queueLength + Math.floor(Math.random() * 6 - 3)),
        averageWaitTime: Math.max(0.5, toll.averageWaitTime + Math.random() * 2 - 1),
        revenue: toll.revenue + Math.floor(Math.random() * 5000),
        vehiclesPassed: toll.vehiclesPassed + Math.floor(Math.random() * 10),
        status: toll.queueLength > 20 ? 'congested' : 
                toll.activeLanes < toll.totalLanes ? 'maintenance' : 'operational'
      })));
    }, 4000);

    return () => clearInterval(interval);
  }, [isLive]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'congested': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'maintenance': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational': return <CheckCircle className="w-4 h-4" />;
      case 'congested': return <AlertTriangle className="w-4 h-4" />;
      case 'maintenance': return <Clock className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const totalRevenue = tollPlazas.reduce((sum, toll) => sum + toll.revenue, 0);
  const totalVehicles = tollPlazas.reduce((sum, toll) => sum + toll.vehiclesPassed, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center space-x-3">
          <Navigation className="w-6 h-6 text-blue-400" />
          <div>
            <h2 className="text-xl font-bold text-white">Tamil Nadu Toll Plaza Monitor</h2>
            <p className="text-slate-400 text-sm">Live monitoring of highway toll plazas</p>
          </div>
        </div>
        
        <Button
          variant={isLive ? "default" : "outline"}
          size="sm"
          onClick={() => setIsLive(!isLive)}
          className="flex items-center space-x-2"
        >
          <Activity className={`w-4 h-4 ${isLive ? 'animate-pulse' : ''}`} />
          <span>{isLive ? 'Live Updates' : 'Paused'}</span>
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-400">Total Revenue</div>
                <div className="text-2xl font-bold text-white flex items-center">
                  <IndianRupee className="w-5 h-5 mr-1" />
                  {(totalRevenue / 100000).toFixed(1)}L
                </div>
              </div>
              <BarChart3 className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-400">Vehicles Passed</div>
                <div className="text-2xl font-bold text-white">{totalVehicles.toLocaleString()}</div>
              </div>
              <Car className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-400">Active Plazas</div>
                <div className="text-2xl font-bold text-white">
                  {tollPlazas.filter(t => t.status === 'operational').length}/{tollPlazas.length}
                </div>
              </div>
              <CheckCircle className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-400">Avg Wait Time</div>
                <div className="text-2xl font-bold text-white">
                  {(tollPlazas.reduce((sum, t) => sum + t.averageWaitTime, 0) / tollPlazas.length).toFixed(1)}m
                </div>
              </div>
              <Clock className="w-8 h-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Toll Plaza Details */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <span className="flex items-center">
              <Navigation className="w-5 h-5 mr-2" />
              Live Toll Plaza Status
            </span>
            <Badge variant="secondary" className={`${isLive ? 'bg-green-500/20 text-green-400 border-green-500/30 animate-pulse' : 'bg-gray-500/20 text-gray-400 border-gray-500/30'}`}>
              {isLive ? 'REAL-TIME' : 'STATIC'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {tollPlazas.map((toll) => (
              <div key={toll.id} className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/50">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(toll.status)}
                    <span className="font-semibold text-white">{toll.name}</span>
                  </div>
                  <Badge variant="secondary" className={getStatusColor(toll.status)}>
                    {toll.status.toUpperCase()}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="text-sm text-slate-300">{toll.highway}</div>
                  <div className="text-xs text-slate-400">{toll.location}, Tamil Nadu</div>
                  
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="bg-slate-800/50 rounded p-2">
                      <div className="text-xs text-slate-400">Queue Length</div>
                      <div className="text-lg font-bold text-white">{toll.queueLength}</div>
                    </div>
                    <div className="bg-slate-800/50 rounded p-2">
                      <div className="text-xs text-slate-400">Wait Time</div>
                      <div className="text-lg font-bold text-white">{toll.averageWaitTime.toFixed(1)}m</div>
                    </div>
                    <div className="bg-slate-800/50 rounded p-2">
                      <div className="text-xs text-slate-400">Active Lanes</div>
                      <div className="text-lg font-bold text-white">{toll.activeLanes}/{toll.totalLanes}</div>
                    </div>
                    <div className="bg-slate-800/50 rounded p-2">
                      <div className="text-xs text-slate-400">Revenue</div>
                      <div className="text-lg font-bold text-white flex items-center">
                        <IndianRupee className="w-3 h-3 mr-1" />
                        {(toll.revenue / 1000).toFixed(0)}K
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TollPlazaMonitor;
