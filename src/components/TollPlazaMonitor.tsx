
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
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Users,
  Truck,
  Bike
} from "lucide-react";
import { useSupabaseRealTimeData } from "@/hooks/useSupabaseRealTimeData";

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
  vehicleTypes: {
    cars: number;
    trucks: number;
    bikes: number;
  };
  hourlyTrend: number[];
  efficiency: number;
}

const TollPlazaMonitor = () => {
  const { systemStats, isConnected } = useSupabaseRealTimeData();
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
          status: 'operational',
          vehicleTypes: { cars: 850, trucks: 290, bikes: 100 },
          hourlyTrend: [45, 52, 48, 61, 73, 68, 72, 85],
          efficiency: 87
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
          status: 'operational',
          vehicleTypes: { cars: 680, trucks: 220, bikes: 80 },
          hourlyTrend: [38, 42, 45, 51, 56, 52, 58, 67],
          efficiency: 92
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
          status: 'congested',
          vehicleTypes: { cars: 520, trucks: 180, bikes: 56 },
          hourlyTrend: [42, 48, 45, 52, 68, 71, 67, 73],
          efficiency: 68
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
          status: 'maintenance',
          vehicleTypes: { cars: 450, trucks: 142, bikes: 50 },
          hourlyTrend: [32, 35, 38, 41, 44, 40, 37, 42],
          efficiency: 75
        },
        {
          id: 'TP-005',
          name: 'Coimbatore Toll Plaza',
          location: 'Coimbatore',
          highway: 'NH-47',
          totalLanes: 10,
          activeLanes: 9,
          queueLength: 15,
          averageWaitTime: 4.2,
          revenue: 298000,
          vehiclesPassed: 1456,
          status: 'operational',
          vehicleTypes: { cars: 980, trucks: 356, bikes: 120 },
          hourlyTrend: [55, 62, 58, 71, 83, 78, 82, 95],
          efficiency: 89
        },
        {
          id: 'TP-006',
          name: 'Madurai Toll Plaza',
          location: 'Madurai',
          highway: 'NH-38',
          totalLanes: 6,
          activeLanes: 6,
          queueLength: 18,
          averageWaitTime: 5.8,
          revenue: 201000,
          vehiclesPassed: 1123,
          status: 'congested',
          vehicleTypes: { cars: 760, trucks: 263, bikes: 100 },
          hourlyTrend: [48, 52, 49, 58, 72, 68, 71, 78],
          efficiency: 78
        },
        {
          id: 'TP-007',
          name: 'Vellore Toll Plaza',
          location: 'Vellore',
          highway: 'NH-46',
          totalLanes: 8,
          activeLanes: 8,
          queueLength: 7,
          averageWaitTime: 2.8,
          revenue: 189000,
          vehiclesPassed: 967,
          status: 'operational',
          vehicleTypes: { cars: 650, trucks: 237, bikes: 80 },
          hourlyTrend: [41, 45, 42, 49, 58, 54, 61, 68],
          efficiency: 91
        },
        {
          id: 'TP-008',
          name: 'Tirunelveli Toll Plaza',
          location: 'Tirunelveli',
          highway: 'NH-44',
          totalLanes: 4,
          activeLanes: 4,
          queueLength: 11,
          averageWaitTime: 3.9,
          revenue: 134000,
          vehiclesPassed: 678,
          status: 'operational',
          vehicleTypes: { cars: 456, trucks: 167, bikes: 55 },
          hourlyTrend: [35, 38, 36, 42, 48, 45, 50, 56],
          efficiency: 82
        }
      ];
      
      setTollPlazas(tamilNaduTolls);
    };

    initializeTollPlazas();
  }, []);

  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      setTollPlazas(prev => prev.map(toll => {
        const queueChange = Math.floor(Math.random() * 8 - 4);
        const newQueue = Math.max(0, toll.queueLength + queueChange);
        
        return {
          ...toll,
          queueLength: newQueue,
          averageWaitTime: Math.max(0.8, toll.averageWaitTime + Math.random() * 2 - 1),
          revenue: toll.revenue + Math.floor(Math.random() * 8000),
          vehiclesPassed: toll.vehiclesPassed + Math.floor(Math.random() * 15),
          status: newQueue > 20 ? 'congested' : 
                  toll.activeLanes < toll.totalLanes ? 'maintenance' : 'operational',
          vehicleTypes: {
            cars: toll.vehicleTypes.cars + Math.floor(Math.random() * 8),
            trucks: toll.vehicleTypes.trucks + Math.floor(Math.random() * 4),
            bikes: toll.vehicleTypes.bikes + Math.floor(Math.random() * 3)
          },
          hourlyTrend: [...toll.hourlyTrend.slice(1), toll.hourlyTrend[toll.hourlyTrend.length - 1] + Math.floor(Math.random() * 10 - 5)],
          efficiency: Math.max(50, Math.min(100, toll.efficiency + Math.floor(Math.random() * 6 - 3)))
        };
      }));
    }, 3000);

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

  const getTrendIcon = (trend: number[]) => {
    const recent = trend.slice(-3).reduce((a, b) => a + b, 0) / 3;
    const earlier = trend.slice(0, 3).reduce((a, b) => a + b, 0) / 3;
    return recent > earlier ? <TrendingUp className="w-4 h-4 text-green-400" /> : <TrendingDown className="w-4 h-4 text-red-400" />;
  };

  const totalRevenue = tollPlazas.reduce((sum, toll) => sum + toll.revenue, 0);
  const totalVehicles = tollPlazas.reduce((sum, toll) => sum + toll.vehiclesPassed, 0);
  const avgEfficiency = tollPlazas.reduce((sum, toll) => sum + toll.efficiency, 0) / tollPlazas.length;

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 min-h-screen">
      {/* Enhanced Header */}
      <div className="cyber-glass rounded-xl p-6 border border-cyan-500/30">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-600/20 border border-indigo-400/30">
              <Navigation className="w-8 h-8 text-indigo-300" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gradient bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
                Tamil Nadu Toll Plaza Network
              </h2>
              <p className="text-slate-400 text-sm mt-1">
                Real-time monitoring of {tollPlazas.length} highway toll plazas across Tamil Nadu
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Badge className={`${isConnected ? 'bg-green-500/20 text-green-400 border-green-500/30 animate-pulse' : 'bg-red-500/20 text-red-400 border-red-500/30'}`}>
              {isConnected ? 'DATABASE LIVE' : 'OFFLINE'}
            </Badge>
            <Button
              variant={isLive ? "default" : "outline"}
              size="sm"
              onClick={() => setIsLive(!isLive)}
              className={`flex items-center space-x-2 ${isLive ? 'cyber-glow bg-gradient-to-r from-emerald-600 to-green-600' : ''}`}
            >
              <Activity className={`w-4 h-4 ${isLive ? 'animate-pulse' : ''}`} />
              <span>{isLive ? 'Live Updates' : 'Paused'}</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Enhanced Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="cyber-card border-green-500/30">
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

        <Card className="cyber-card border-blue-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-400">Total Vehicles</div>
                <div className="text-2xl font-bold text-white">{totalVehicles.toLocaleString()}</div>
              </div>
              <Car className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="cyber-card border-purple-500/30">
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

        <Card className="cyber-card border-orange-500/30">
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

        <Card className="cyber-card border-cyan-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-400">Avg Efficiency</div>
                <div className="text-2xl font-bold text-white">
                  {avgEfficiency.toFixed(0)}%
                </div>
              </div>
              <TrendingUp className="w-8 h-8 text-cyan-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Toll Plaza Grid */}
      <Card className="cyber-card border-slate-600/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <span className="flex items-center text-gradient bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
              <Navigation className="w-5 h-5 mr-2 text-cyan-400" />
              Live Toll Plaza Status
            </span>
            <Badge variant="secondary" className={`${isLive ? 'bg-green-500/20 text-green-400 border-green-500/30 animate-pulse' : 'bg-gray-500/20 text-gray-400 border-gray-500/30'}`}>
              {isLive ? 'REAL-TIME' : 'STATIC'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {tollPlazas.map((toll) => (
              <div key={toll.id} className="cyber-glass rounded-lg p-5 border border-slate-600/50 hover:border-cyan-500/50 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(toll.status)}
                    <div>
                      <span className="font-semibold text-white text-lg">{toll.name}</span>
                      <div className="flex items-center space-x-2 mt-1">
                        {getTrendIcon(toll.hourlyTrend)}
                        <span className="text-xs text-slate-400">Efficiency: {toll.efficiency}%</span>
                      </div>
                    </div>
                  </div>
                  <Badge variant="secondary" className={getStatusColor(toll.status)}>
                    {toll.status.toUpperCase()}
                  </Badge>
                </div>
                
                <div className="space-y-3">
                  <div className="text-sm text-slate-300 font-medium">{toll.highway}</div>
                  <div className="text-xs text-slate-400">{toll.location}, Tamil Nadu</div>
                  
                  {/* Vehicle Type Breakdown */}
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="bg-slate-800/50 rounded p-2 text-center">
                      <Car className="w-4 h-4 text-blue-400 mx-auto mb-1" />
                      <div className="text-xs text-slate-400">Cars</div>
                      <div className="text-sm font-bold text-white">{toll.vehicleTypes.cars}</div>
                    </div>
                    <div className="bg-slate-800/50 rounded p-2 text-center">
                      <Truck className="w-4 h-4 text-orange-400 mx-auto mb-1" />
                      <div className="text-xs text-slate-400">Trucks</div>
                      <div className="text-sm font-bold text-white">{toll.vehicleTypes.trucks}</div>
                    </div>
                    <div className="bg-slate-800/50 rounded p-2 text-center">
                      <Bike className="w-4 h-4 text-green-400 mx-auto mb-1" />
                      <div className="text-xs text-slate-400">Bikes</div>
                      <div className="text-sm font-bold text-white">{toll.vehicleTypes.bikes}</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-800/50 rounded p-3">
                      <div className="text-xs text-slate-400">Queue Length</div>
                      <div className={`text-lg font-bold ${toll.queueLength > 20 ? 'text-red-400' : toll.queueLength > 10 ? 'text-orange-400' : 'text-green-400'}`}>
                        {toll.queueLength}
                      </div>
                    </div>
                    <div className="bg-slate-800/50 rounded p-3">
                      <div className="text-xs text-slate-400">Wait Time</div>
                      <div className="text-lg font-bold text-white">{toll.averageWaitTime.toFixed(1)}m</div>
                    </div>
                    <div className="bg-slate-800/50 rounded p-3">
                      <div className="text-xs text-slate-400">Active Lanes</div>
                      <div className="text-lg font-bold text-white">{toll.activeLanes}/{toll.totalLanes}</div>
                    </div>
                    <div className="bg-slate-800/50 rounded p-3">
                      <div className="text-xs text-slate-400">Revenue</div>
                      <div className="text-lg font-bold text-white flex items-center">
                        <IndianRupee className="w-3 h-3 mr-1" />
                        {(toll.revenue / 1000).toFixed(0)}K
                      </div>
                    </div>
                  </div>

                  {/* Efficiency Bar */}
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-slate-400 mb-1">
                      <span>Efficiency</span>
                      <span>{toll.efficiency}%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-1000 ${
                          toll.efficiency > 85 ? 'bg-green-500' : 
                          toll.efficiency > 70 ? 'bg-orange-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${toll.efficiency}%` }}
                      ></div>
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
