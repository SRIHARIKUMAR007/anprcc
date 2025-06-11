
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Car, 
  MapPin, 
  Clock, 
  DollarSign, 
  CheckCircle, 
  XCircle,
  Timer,
  Building,
  BarChart3,
  AlertTriangle
} from "lucide-react";

interface ParkingSpot {
  id: string;
  floor: number;
  section: string;
  status: 'occupied' | 'available' | 'reserved';
  vehiclePlate?: string;
  entryTime?: string;
  duration?: string;
  amount?: number;
}

interface ParkingTransaction {
  id: string;
  plateNumber: string;
  entryTime: string;
  exitTime?: string;
  duration: string;
  amount: number;
  status: 'active' | 'completed' | 'violation';
}

const ParkingManagement = () => {
  const [parkingSpots, setParkingSpots] = useState<ParkingSpot[]>([]);
  const [transactions, setTransactions] = useState<ParkingTransaction[]>([]);
  const [occupancyRate, setOccupancyRate] = useState(0);
  const [dailyRevenue, setDailyRevenue] = useState(0);

  // Initialize parking data
  useEffect(() => {
    const generateParkingSpots = () => {
      const spots: ParkingSpot[] = [];
      const sections = ['A', 'B', 'C', 'D'];
      const mockPlates = ['DL 01 AB 1234', 'MH 12 CD 5678', 'UP 16 EF 9012', 'GJ 05 GH 3456'];
      
      for (let floor = 1; floor <= 3; floor++) {
        for (let section of sections) {
          for (let spot = 1; spot <= 25; spot++) {
            const id = `${section}${floor}${spot.toString().padStart(2, '0')}`;
            const isOccupied = Math.random() > 0.6;
            
            spots.push({
              id,
              floor,
              section,
              status: isOccupied ? 'occupied' : Math.random() > 0.9 ? 'reserved' : 'available',
              vehiclePlate: isOccupied ? mockPlates[Math.floor(Math.random() * mockPlates.length)] : undefined,
              entryTime: isOccupied ? new Date(Date.now() - Math.random() * 4 * 60 * 60 * 1000).toISOString() : undefined,
              duration: isOccupied ? `${Math.floor(Math.random() * 240) + 30} min` : undefined,
              amount: isOccupied ? Math.floor(Math.random() * 50) + 10 : undefined
            });
          }
        }
      }
      return spots;
    };

    const generateTransactions = () => {
      const transactions: ParkingTransaction[] = [];
      const mockPlates = ['DL 01 AB 1234', 'MH 12 CD 5678', 'UP 16 EF 9012', 'GJ 05 GH 3456', 'KA 03 IJ 7890'];
      
      for (let i = 0; i < 15; i++) {
        const entryTime = new Date(Date.now() - Math.random() * 8 * 60 * 60 * 1000);
        const isActive = Math.random() > 0.6;
        const duration = Math.floor(Math.random() * 300) + 30;
        
        transactions.push({
          id: `TXN-${Date.now()}-${i}`,
          plateNumber: mockPlates[Math.floor(Math.random() * mockPlates.length)],
          entryTime: entryTime.toISOString(),
          exitTime: !isActive ? new Date(entryTime.getTime() + duration * 60 * 1000).toISOString() : undefined,
          duration: `${duration} min`,
          amount: Math.floor(duration / 30) * 5,
          status: isActive ? 'active' : Math.random() > 0.95 ? 'violation' : 'completed'
        });
      }
      return transactions;
    };

    const spots = generateParkingSpots();
    const trans = generateTransactions();
    
    setParkingSpots(spots);
    setTransactions(trans);
    
    // Calculate metrics
    const occupied = spots.filter(s => s.status === 'occupied').length;
    setOccupancyRate(Math.round((occupied / spots.length) * 100));
    setDailyRevenue(trans.reduce((acc, t) => acc + t.amount, 0));
  }, []);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate vehicle entry/exit
      if (Math.random() > 0.7) {
        setParkingSpots(spots => {
          const availableSpots = spots.filter(s => s.status === 'available');
          const occupiedSpots = spots.filter(s => s.status === 'occupied');
          
          if (Math.random() > 0.5 && availableSpots.length > 0) {
            // Vehicle enters
            const randomSpot = availableSpots[Math.floor(Math.random() * availableSpots.length)];
            const mockPlates = ['DL 01 AB 1234', 'MH 12 CD 5678', 'UP 16 EF 9012'];
            
            return spots.map(spot => 
              spot.id === randomSpot.id ? {
                ...spot,
                status: 'occupied' as const,
                vehiclePlate: mockPlates[Math.floor(Math.random() * mockPlates.length)],
                entryTime: new Date().toISOString(),
                duration: '5 min',
                amount: 5
              } : spot
            );
          } else if (occupiedSpots.length > 0) {
            // Vehicle exits
            const randomSpot = occupiedSpots[Math.floor(Math.random() * occupiedSpots.length)];
            
            return spots.map(spot => 
              spot.id === randomSpot.id ? {
                ...spot,
                status: 'available' as const,
                vehiclePlate: undefined,
                entryTime: undefined,
                duration: undefined,
                amount: undefined
              } : spot
            );
          }
          return spots;
        });
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getSpotStatusColor = (status: string) => {
    switch (status) {
      case 'occupied': return 'bg-red-500';
      case 'available': return 'bg-green-500';
      case 'reserved': return 'bg-yellow-500';
      default: return 'bg-slate-500';
    }
  };

  const getTransactionStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-blue-400 bg-blue-500/20';
      case 'completed': return 'text-green-400 bg-green-500/20';
      case 'violation': return 'text-red-400 bg-red-500/20';
      default: return 'text-slate-400 bg-slate-500/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Parking Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-400">Total Spots</div>
                <div className="text-2xl font-bold text-white">{parkingSpots.length}</div>
              </div>
              <Building className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-400">Occupancy Rate</div>
                <div className="text-2xl font-bold text-white">{occupancyRate}%</div>
              </div>
              <BarChart3 className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-400">Daily Revenue</div>
                <div className="text-2xl font-bold text-white">₹{dailyRevenue}</div>
              </div>
              <DollarSign className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-400">Active Sessions</div>
                <div className="text-2xl font-bold text-white">{transactions.filter(t => t.status === 'active').length}</div>
              </div>
              <Timer className="w-8 h-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Parking Floor Maps */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <MapPin className="w-5 h-5 mr-2" />
            Real-time Parking Map
          </CardTitle>
        </CardHeader>
        <CardContent>
          {[1, 2, 3].map(floor => (
            <div key={floor} className="mb-6">
              <div className="text-white font-semibold mb-3">Floor {floor}</div>
              <div className="grid grid-cols-4 gap-4">
                {['A', 'B', 'C', 'D'].map(section => (
                  <div key={section} className="bg-slate-700/30 p-3 rounded-lg">
                    <div className="text-slate-300 font-medium mb-2">Section {section}</div>
                    <div className="grid grid-cols-5 gap-1">
                      {parkingSpots
                        .filter(spot => spot.floor === floor && spot.section === section)
                        .slice(0, 25)
                        .map(spot => (
                          <div
                            key={spot.id}
                            className={`w-6 h-4 rounded ${getSpotStatusColor(spot.status)} cursor-pointer`}
                            title={`${spot.id} - ${spot.status}${spot.vehiclePlate ? ` (${spot.vehiclePlate})` : ''}`}
                          />
                        ))
                      }
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          
          {/* Legend */}
          <div className="flex items-center space-x-4 mt-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-3 bg-green-500 rounded"></div>
              <span className="text-slate-300">Available</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-3 bg-red-500 rounded"></div>
              <span className="text-slate-300">Occupied</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-3 bg-yellow-500 rounded"></div>
              <span className="text-slate-300">Reserved</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            Recent Parking Transactions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {transactions.slice(0, 10).map(transaction => (
              <div key={transaction.id} className="p-3 bg-slate-700/30 rounded-lg border border-slate-600/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Car className="w-5 h-5 text-blue-400" />
                    <div>
                      <div className="font-mono text-white font-semibold">{transaction.plateNumber}</div>
                      <div className="text-slate-400 text-sm">
                        Entry: {new Date(transaction.entryTime).toLocaleString()}
                        {transaction.exitTime && (
                          <> • Exit: {new Date(transaction.exitTime).toLocaleString()}</>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={getTransactionStatusColor(transaction.status)}>
                      {transaction.status}
                    </Badge>
                    <div className="text-white font-semibold mt-1">₹{transaction.amount}</div>
                    <div className="text-slate-400 text-sm">{transaction.duration}</div>
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

export default ParkingManagement;
