
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Car, Shield, Calendar, FileText, AlertTriangle, CheckCircle, Clock } from "lucide-react";

const VehicleDetails = () => {
  const [searchPlate, setSearchPlate] = useState("");
  const [searchResults, setSearchResults] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);

  // Mock vehicle database with comprehensive details
  const vehicleDatabase = {
    "DL-01-AB-1234": {
      plateNumber: "DL-01-AB-1234",
      vinNumber: "1HGBH41JXMN109186",
      registrationDetails: {
        ownerName: "Rajesh Kumar",
        ownerAddress: "123 Sector 15, Noida, UP 201301",
        registrationDate: "2020-03-15",
        registrationState: "Delhi",
        registrationRTO: "DL-01"
      },
      vehicleDetails: {
        make: "Honda",
        model: "City",
        year: 2020,
        color: "White",
        fuelType: "Petrol",
        engineNumber: "HC20E123456",
        chassisNumber: "MA3FCEB1S00123456",
        seatingCapacity: 5,
        class: "Motor Car"
      },
      insurance: {
        provider: "HDFC ERGO",
        policyNumber: "HD/VEH/2023/0012345",
        validFrom: "2023-06-01",
        validTo: "2024-05-31",
        status: "active",
        premium: "₹8,500",
        idv: "₹6,50,000"
      },
      puc: {
        certificateNumber: "PUC/DL/2024/001234",
        validFrom: "2024-01-15",
        validTo: "2024-07-14",
        status: "valid",
        testCenter: "Delhi Pollution Control Center"
      },
      fitness: {
        certificateNumber: "FIT/DL/2024/001234",
        validFrom: "2024-02-01",
        validTo: "2025-01-31",
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
      registrationDetails: {
        ownerName: "Priya Sharma",
        ownerAddress: "456 Bandra West, Mumbai, MH 400050",
        registrationDate: "2019-08-22",
        registrationState: "Maharashtra",
        registrationRTO: "MH-12"
      },
      vehicleDetails: {
        make: "Maruti Suzuki",
        model: "Swift",
        year: 2019,
        color: "Red",
        fuelType: "Petrol",
        engineNumber: "K12M789012",
        chassisNumber: "MA3EJEBL000789012",
        seatingCapacity: 5,
        class: "Motor Car"
      },
      insurance: {
        provider: "ICICI Lombard",
        policyNumber: "IC/VEH/2023/0056789",
        validFrom: "2023-08-01",
        validTo: "2024-07-31",
        status: "active",
        premium: "₹7,200",
        idv: "₹4,80,000"
      },
      puc: {
        certificateNumber: "PUC/MH/2024/005678",
        validFrom: "2024-02-10",
        validTo: "2024-08-09",
        status: "valid",
        testCenter: "Mumbai Pollution Control Center"
      },
      fitness: {
        certificateNumber: "FIT/MH/2024/005678",
        validFrom: "2024-01-15",
        validTo: "2024-12-14",
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
    
    // Simulate API call delay
    setTimeout(() => {
      const result = vehicleDatabase[searchPlate.toUpperCase() as keyof typeof vehicleDatabase];
      setSearchResults(result || null);
      setIsSearching(false);
    }, 1500);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'valid':
      case 'paid':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'pending':
      case 'expired':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'inactive':
      case 'invalid':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
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
                Vehicle Information: {searchResults.plateNumber}
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Badge className={getRiskScoreColor(searchResults.riskScore)}>
                  Risk Score: {searchResults.riskScore}
                </Badge>
                <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                  {searchResults.vehicleDetails.make} {searchResults.vehicleDetails.model}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="basic" className="space-y-4">
              <TabsList className="grid w-full grid-cols-5 bg-slate-700/50">
                <TabsTrigger value="basic" className="data-[state=active]:bg-blue-600">Basic Info</TabsTrigger>
                <TabsTrigger value="insurance" className="data-[state=active]:bg-blue-600">Insurance</TabsTrigger>
                <TabsTrigger value="documents" className="data-[state=active]:bg-blue-600">Documents</TabsTrigger>
                <TabsTrigger value="violations" className="data-[state=active]:bg-blue-600">Violations</TabsTrigger>
                <TabsTrigger value="tracking" className="data-[state=active]:bg-blue-600">Tracking</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-slate-700/30 border-slate-600">
                    <CardHeader>
                      <CardTitle className="text-white text-lg">Vehicle Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-slate-400">VIN:</span>
                          <div className="text-white font-mono">{searchResults.vinNumber}</div>
                        </div>
                        <div>
                          <span className="text-slate-400">Year:</span>
                          <div className="text-white">{searchResults.vehicleDetails.year}</div>
                        </div>
                        <div>
                          <span className="text-slate-400">Color:</span>
                          <div className="text-white">{searchResults.vehicleDetails.color}</div>
                        </div>
                        <div>
                          <span className="text-slate-400">Fuel:</span>
                          <div className="text-white">{searchResults.vehicleDetails.fuelType}</div>
                        </div>
                        <div>
                          <span className="text-slate-400">Engine No:</span>
                          <div className="text-white font-mono">{searchResults.vehicleDetails.engineNumber}</div>
                        </div>
                        <div>
                          <span className="text-slate-400">Chassis No:</span>
                          <div className="text-white font-mono">{searchResults.vehicleDetails.chassisNumber}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-700/30 border-slate-600">
                    <CardHeader>
                      <CardTitle className="text-white text-lg">Registration Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-slate-400">Owner:</span>
                          <div className="text-white">{searchResults.registrationDetails.ownerName}</div>
                        </div>
                        <div>
                          <span className="text-slate-400">Address:</span>
                          <div className="text-white">{searchResults.registrationDetails.ownerAddress}</div>
                        </div>
                        <div>
                          <span className="text-slate-400">Registration Date:</span>
                          <div className="text-white">{searchResults.registrationDetails.registrationDate}</div>
                        </div>
                        <div>
                          <span className="text-slate-400">RTO:</span>
                          <div className="text-white">{searchResults.registrationDetails.registrationRTO}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="insurance" className="space-y-4">
                <Card className="bg-slate-700/30 border-slate-600">
                  <CardHeader>
                    <CardTitle className="text-white text-lg flex items-center">
                      <Shield className="w-5 h-5 mr-2" />
                      Insurance Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-3">
                        <div>
                          <span className="text-slate-400 text-sm">Provider:</span>
                          <div className="text-white font-semibold">{searchResults.insurance.provider}</div>
                        </div>
                        <div>
                          <span className="text-slate-400 text-sm">Policy Number:</span>
                          <div className="text-white font-mono">{searchResults.insurance.policyNumber}</div>
                        </div>
                        <div>
                          <span className="text-slate-400 text-sm">Status:</span>
                          <div>
                            <Badge className={getStatusColor(searchResults.insurance.status)}>
                              {searchResults.insurance.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <span className="text-slate-400 text-sm">Valid From:</span>
                          <div className="text-white">{searchResults.insurance.validFrom}</div>
                        </div>
                        <div>
                          <span className="text-slate-400 text-sm">Valid To:</span>
                          <div className="text-white">{searchResults.insurance.validTo}</div>
                        </div>
                        <div>
                          <span className="text-slate-400 text-sm">Premium:</span>
                          <div className="text-white font-semibold">{searchResults.insurance.premium}</div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <span className="text-slate-400 text-sm">IDV:</span>
                          <div className="text-white font-semibold">{searchResults.insurance.idv}</div>
                        </div>
                        <div className="flex items-center">
                          {searchResults.insurance.status === 'active' ? (
                            <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                          ) : (
                            <AlertTriangle className="w-5 h-5 text-red-400 mr-2" />
                          )}
                          <span className="text-slate-300">Insurance {searchResults.insurance.status}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="documents" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="bg-slate-700/30 border-slate-600">
                    <CardHeader>
                      <CardTitle className="text-white text-lg flex items-center">
                        <FileText className="w-5 h-5 mr-2" />
                        PUC Certificate
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Status:</span>
                        <Badge className={getStatusColor(searchResults.puc.status)}>
                          {searchResults.puc.status}
                        </Badge>
                      </div>
                      <div>
                        <span className="text-slate-400 text-sm">Certificate No:</span>
                        <div className="text-white font-mono">{searchResults.puc.certificateNumber}</div>
                      </div>
                      <div>
                        <span className="text-slate-400 text-sm">Valid Until:</span>
                        <div className="text-white">{searchResults.puc.validTo}</div>
                      </div>
                      <div>
                        <span className="text-slate-400 text-sm">Test Center:</span>
                        <div className="text-white">{searchResults.puc.testCenter}</div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-700/30 border-slate-600">
                    <CardHeader>
                      <CardTitle className="text-white text-lg flex items-center">
                        <Calendar className="w-5 h-5 mr-2" />
                        Fitness Certificate
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Status:</span>
                        <Badge className={getStatusColor(searchResults.fitness.status)}>
                          {searchResults.fitness.status}
                        </Badge>
                      </div>
                      <div>
                        <span className="text-slate-400 text-sm">Certificate No:</span>
                        <div className="text-white font-mono">{searchResults.fitness.certificateNumber}</div>
                      </div>
                      <div>
                        <span className="text-slate-400 text-sm">Valid Until:</span>
                        <div className="text-white">{searchResults.fitness.validTo}</div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="violations" className="space-y-4">
                <Card className="bg-slate-700/30 border-slate-600">
                  <CardHeader>
                    <CardTitle className="text-white text-lg">Traffic Violations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {searchResults.violations.length > 0 ? (
                      <div className="space-y-3">
                        {searchResults.violations.map((violation: any, index: number) => (
                          <div key={index} className="p-3 bg-slate-600/30 rounded border border-slate-500/30">
                            <div className="flex items-center justify-between mb-2">
                              <div className="font-mono text-white">{violation.id}</div>
                              <Badge className={getStatusColor(violation.status)}>
                                {violation.status}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>
                                <span className="text-slate-400">Date:</span>
                                <div className="text-white">{violation.date}</div>
                              </div>
                              <div>
                                <span className="text-slate-400">Fine:</span>
                                <div className="text-white font-semibold">{violation.fine}</div>
                              </div>
                              <div className="col-span-2">
                                <span className="text-slate-400">Violation:</span>
                                <div className="text-white">{violation.violation}</div>
                              </div>
                              <div className="col-span-2">
                                <span className="text-slate-400">Location:</span>
                                <div className="text-white">{violation.location}</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
                        <div className="text-white">No violations found</div>
                        <div className="text-slate-400 text-sm">This vehicle has a clean record</div>
                      </div>
                    )}
                  </CardContent>
                </Card>
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
                            <div className="text-white">{searchResults.lastSeen.location}</div>
                          </div>
                          <div>
                            <span className="text-slate-400">Time:</span>
                            <div className="text-white">{searchResults.lastSeen.timestamp}</div>
                          </div>
                          <div>
                            <span className="text-slate-400">Camera:</span>
                            <div className="text-white">{searchResults.lastSeen.camera}</div>
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
