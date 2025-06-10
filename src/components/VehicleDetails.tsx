
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Car, Shield, AlertTriangle, Clock, MapPin } from "lucide-react";
import { getVehicleByPlate } from "@/lib/supabase";
import VehicleDetailsInfo from "@/components/VehicleDetailsInfo";

const VehicleDetails = () => {
  const [searchPlate, setSearchPlate] = useState("");
  const [searchResults, setSearchResults] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);

  // Mock vehicle database for demo purposes until Supabase is connected
  const vehicleDatabase = {
    "DL-01-AB-1234": {
      plateNumber: "DL-01-AB-1234",
      vinNumber: "1HGBH41JXMN109186",
      registration_details: {
        owner_name: "Rajesh Kumar",
        owner_address: "123 Sector 15, Noida, UP 201301",
        registration_date: "2020-03-15",
        registration_state: "Delhi",
        registration_rto: "DL-01"
      },
      vehicle_details: {
        make: "Honda",
        model: "City",
        year: 2020,
        color: "White",
        fuel_type: "Petrol",
        engine_number: "HC20E123456",
        chassis_number: "MA3FCEB1S00123456",
        seating_capacity: 5,
        class: "Motor Car",
        vin_number: "1HGBH41JXMN109186"
      },
      insurance: {
        provider: "HDFC ERGO",
        policy_number: "HD/VEH/2023/0012345",
        valid_from: "2023-06-01",
        valid_to: "2024-05-31",
        status: "active",
        premium: "₹8,500",
        idv: "₹6,50,000"
      },
      puc: {
        certificate_number: "PUC/DL/2024/001234",
        valid_from: "2024-01-15",
        valid_to: "2024-07-14",
        status: "valid",
        test_center: "Delhi Pollution Control Center"
      },
      fitness: {
        certificate_number: "FIT/DL/2024/001234",
        valid_from: "2024-02-01",
        valid_to: "2025-01-31",
        status: "valid"
      },
      permits: [
        {
          type: "All India Tourist Permit",
          number: "AITP/DL/2024/001234",
          validTo: "2024-12-31",
          status: "active"
        }
      ],
      violations: [
        {
          id: "CHAL001234",
          date: "2024-05-15",
          violation: "Speed Limit Violation",
          fine: "₹1,000",
          status: "paid",
          location: "NH-1, Gurgaon"
        },
        {
          id: "CHAL001235",
          date: "2024-03-20",
          violation: "No Parking",
          fine: "₹500",
          status: "pending",
          location: "Connaught Place, Delhi"
        }
      ],
      riskScore: 25,
      lastSeen: {
        location: "Highway Junction",
        timestamp: "2024-06-10 10:45:32",
        camera: "CAM-02"
      }
    },
    "MH-12-CD-5678": {
      plateNumber: "MH-12-CD-5678",
      vinNumber: "2HGFA16528H123456",
      registration_details: {
        owner_name: "Priya Sharma",
        owner_address: "456 Bandra West, Mumbai, MH 400050",
        registration_date: "2019-08-22",
        registration_state: "Maharashtra",
        registration_rto: "MH-12"
      },
      vehicle_details: {
        make: "Maruti Suzuki",
        model: "Swift",
        year: 2019,
        color: "Red",
        fuel_type: "Petrol",
        engine_number: "K12M789012",
        chassis_number: "MA3EJEBL000789012",
        seating_capacity: 5,
        class: "Motor Car",
        vin_number: "2HGFA16528H123456"
      },
      insurance: {
        provider: "ICICI Lombard",
        policy_number: "IC/VEH/2023/0056789",
        valid_from: "2023-08-01",
        valid_to: "2024-07-31",
        status: "active",
        premium: "₹7,200",
        idv: "₹4,80,000"
      },
      puc: {
        certificate_number: "PUC/MH/2024/005678",
        valid_from: "2024-02-10",
        valid_to: "2024-08-09",
        status: "valid",
        test_center: "Mumbai Pollution Control Center"
      },
      fitness: {
        certificate_number: "FIT/MH/2024/005678",
        valid_from: "2024-01-15",
        valid_to: "2024-12-14",
        status: "valid"
      },
      permits: [],
      violations: [],
      riskScore: 5,
      lastSeen: {
        location: "Toll Plaza",
        timestamp: "2024-06-10 09:30:15",
        camera: "CAM-04"
      }
    }
  };

  const handleSearch = async () => {
    if (!searchPlate.trim()) return;
    
    setIsSearching(true);
    
    try {
      // Try to get data from Supabase first
      const supabaseData = await getVehicleByPlate(searchPlate.toUpperCase());
      
      if (supabaseData) {
        setSearchResults(supabaseData);
      } else {
        // Fall back to mock data for demo purposes
        const mockResult = vehicleDatabase[searchPlate.toUpperCase() as keyof typeof vehicleDatabase];
        setSearchResults(mockResult || null);
      }
    } catch (error) {
      console.error("Error searching for vehicle:", error);
      // Fall back to mock data
      const mockResult = vehicleDatabase[searchPlate.toUpperCase() as keyof typeof vehicleDatabase];
      setSearchResults(mockResult || null);
    } finally {
      setIsSearching(false);
    }
  };

  const getRiskScoreColor = (score: number) => {
    if (score <= 10) return 'text-green-400';
    if (score <= 30) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="space-y-6">
      {/* Search Section */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Search className="w-5 h-5 mr-2" />
            Vehicle Details Lookup
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <div className="flex-1">
              <Input 
                placeholder="Enter plate number (e.g., DL-01-AB-1234)"
                value={searchPlate}
                onChange={(e) => setSearchPlate(e.target.value)}
                className="bg-slate-700/50 border-slate-600 text-white"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <Button 
              onClick={handleSearch}
              disabled={isSearching}
              className="px-6"
            >
              {isSearching ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Search Results */}
      {searchResults && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white flex items-center">
                <Car className="w-5 h-5 mr-2" />
                Vehicle Information: {searchResults.plateNumber || searchResults.plate_number}
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Badge className={getRiskScoreColor(searchResults.riskScore || searchResults.risk_score || 0)}>
                  Risk Score: {searchResults.riskScore || searchResults.risk_score || 0}
                </Badge>
                <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                  {searchResults.vehicle_details?.make || "Unknown"} {searchResults.vehicle_details?.model || ""}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="basic" className="space-y-4">
              <TabsList className="grid w-full grid-cols-5 bg-slate-700/50">
                <TabsTrigger value="basic" className="data-[state=active]:bg-blue-600">Basic Info</TabsTrigger>
                <TabsTrigger value="documents" className="data-[state=active]:bg-blue-600">Documents</TabsTrigger>
                <TabsTrigger value="violations" className="data-[state=active]:bg-blue-600">Violations</TabsTrigger>
                <TabsTrigger value="tracking" className="data-[state=active]:bg-blue-600">Tracking</TabsTrigger>
                <TabsTrigger value="history" className="data-[state=active]:bg-blue-600">History</TabsTrigger>
              </TabsList>

              <TabsContent value="basic">
                <VehicleDetailsInfo vehicleData={searchResults} />
              </TabsContent>

              <TabsContent value="documents">
                <VehicleDetailsInfo vehicleData={searchResults} />
              </TabsContent>

              <TabsContent value="violations">
                <VehicleDetailsInfo vehicleData={searchResults} />
              </TabsContent>

              <TabsContent value="tracking" className="space-y-4">
                <Card className="bg-slate-700/30 border-slate-600">
                  <CardHeader>
                    <CardTitle className="text-white text-lg flex items-center">
                      <Clock className="w-5 h-5 mr-2" />
                      Vehicle Tracking
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded">
                        <div className="text-blue-400 font-semibold mb-2">Last Known Location</div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-slate-400">Location:</span>
                            <div className="text-white">{searchResults.lastSeen?.location || "Unknown"}</div>
                          </div>
                          <div>
                            <span className="text-slate-400">Time:</span>
                            <div className="text-white">{searchResults.lastSeen?.timestamp || "Unknown"}</div>
                          </div>
                          <div>
                            <span className="text-slate-400">Camera:</span>
                            <div className="text-white">{searchResults.lastSeen?.camera || "Unknown"}</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-center py-4">
                        <div className="text-slate-400 mb-2">Historical tracking data available</div>
                        <Button variant="outline" size="sm">
                          View Full Tracking History
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="history" className="space-y-4">
                <Card className="bg-slate-700/30 border-slate-600">
                  <CardHeader>
                    <CardTitle className="text-white text-lg flex items-center">
                      <MapPin className="w-5 h-5 mr-2" />
                      Detection History
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[1, 2, 3].map((_, index) => (
                        <div key={index} className="p-3 bg-slate-600/30 rounded border border-slate-500/30">
                          <div className="flex items-center justify-between mb-1">
                            <div className="text-white font-semibold">
                              {new Date(Date.now() - (index * 24 * 60 * 60 * 1000)).toLocaleDateString()}
                            </div>
                            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                              {3 - index} detections
                            </Badge>
                          </div>
                          <div className="text-xs text-slate-400 space-y-1">
                            <div className="flex justify-between">
                              <span>CAM-02 • Highway Junction</span>
                              <span>14:25:12</span>
                            </div>
                            {index < 2 && (
                              <div className="flex justify-between">
                                <span>CAM-04 • Toll Plaza</span>
                                <span>09:12:45</span>
                              </div>
                            )}
                            {index === 0 && (
                              <div className="flex justify-between">
                                <span>CAM-01 • Main Gate</span>
                                <span>19:54:31</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {searchResults === null && searchPlate && !isSearching && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="text-center py-8">
            <AlertTriangle className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
            <div className="text-white mb-2">Vehicle not found</div>
            <div className="text-slate-400 text-sm">
              No records found for plate number: <span className="font-mono">{searchPlate}</span>
            </div>
            <div className="text-slate-400 text-xs mt-2">
              Try searching: DL-01-AB-1234 or MH-12-CD-5678 for demo data
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VehicleDetails;
