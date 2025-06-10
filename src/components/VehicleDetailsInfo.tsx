
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getVehicleByPlate } from "@/lib/supabase";
import { Shield, Calendar, FileText, CheckCircle, AlertTriangle } from "lucide-react";

interface VehicleDetailsInfoProps {
  vehicleData: any;
}

const VehicleDetailsInfo = ({ vehicleData }: VehicleDetailsInfoProps) => {
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
    <div className="space-y-4">
      {/* Basic Info Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-slate-700/30 border-slate-600">
          <CardHeader>
            <CardTitle className="text-white text-lg">Vehicle Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-slate-400">VIN:</span>
                <div className="text-white font-mono">{vehicleData.vehicle_details.vin_number}</div>
              </div>
              <div>
                <span className="text-slate-400">Year:</span>
                <div className="text-white">{vehicleData.vehicle_details.year}</div>
              </div>
              <div>
                <span className="text-slate-400">Color:</span>
                <div className="text-white">{vehicleData.vehicle_details.color}</div>
              </div>
              <div>
                <span className="text-slate-400">Fuel:</span>
                <div className="text-white">{vehicleData.vehicle_details.fuel_type}</div>
              </div>
              <div>
                <span className="text-slate-400">Engine No:</span>
                <div className="text-white font-mono">{vehicleData.vehicle_details.engine_number}</div>
              </div>
              <div>
                <span className="text-slate-400">Chassis No:</span>
                <div className="text-white font-mono">{vehicleData.vehicle_details.chassis_number}</div>
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
                <div className="text-white">{vehicleData.registration_details.owner_name}</div>
              </div>
              <div>
                <span className="text-slate-400">Address:</span>
                <div className="text-white">{vehicleData.registration_details.owner_address}</div>
              </div>
              <div>
                <span className="text-slate-400">Registration Date:</span>
                <div className="text-white">{vehicleData.registration_details.registration_date}</div>
              </div>
              <div>
                <span className="text-slate-400">RTO:</span>
                <div className="text-white">{vehicleData.registration_details.registration_rto}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Insurance Card */}
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
                <div className="text-white font-semibold">{vehicleData.insurance.provider}</div>
              </div>
              <div>
                <span className="text-slate-400 text-sm">Policy Number:</span>
                <div className="text-white font-mono">{vehicleData.insurance.policy_number}</div>
              </div>
              <div>
                <span className="text-slate-400 text-sm">Status:</span>
                <div>
                  <Badge className={getStatusColor(vehicleData.insurance.status)}>
                    {vehicleData.insurance.status}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <span className="text-slate-400 text-sm">Valid From:</span>
                <div className="text-white">{vehicleData.insurance.valid_from}</div>
              </div>
              <div>
                <span className="text-slate-400 text-sm">Valid To:</span>
                <div className="text-white">{vehicleData.insurance.valid_to}</div>
              </div>
              <div>
                <span className="text-slate-400 text-sm">Premium:</span>
                <div className="text-white font-semibold">{vehicleData.insurance.premium}</div>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <span className="text-slate-400 text-sm">IDV:</span>
                <div className="text-white font-semibold">{vehicleData.insurance.idv}</div>
              </div>
              <div className="flex items-center">
                {vehicleData.insurance.status === 'active' ? (
                  <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-red-400 mr-2" />
                )}
                <span className="text-slate-300">Insurance {vehicleData.insurance.status}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documents Card */}
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
              <Badge className={getStatusColor(vehicleData.puc.status)}>
                {vehicleData.puc.status}
              </Badge>
            </div>
            <div>
              <span className="text-slate-400 text-sm">Certificate No:</span>
              <div className="text-white font-mono">{vehicleData.puc.certificate_number}</div>
            </div>
            <div>
              <span className="text-slate-400 text-sm">Valid Until:</span>
              <div className="text-white">{vehicleData.puc.valid_to}</div>
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
              <Badge className={getStatusColor(vehicleData.fitness.status)}>
                {vehicleData.fitness.status}
              </Badge>
            </div>
            <div>
              <span className="text-slate-400 text-sm">Certificate No:</span>
              <div className="text-white font-mono">{vehicleData.fitness.certificate_number}</div>
            </div>
            <div>
              <span className="text-slate-400 text-sm">Valid Until:</span>
              <div className="text-white">{vehicleData.fitness.valid_to}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Violations Card */}
      <Card className="bg-slate-700/30 border-slate-600">
        <CardHeader>
          <CardTitle className="text-white text-lg">Traffic Violations</CardTitle>
        </CardHeader>
        <CardContent>
          {vehicleData.violations && vehicleData.violations.length > 0 ? (
            <div className="space-y-3">
              {vehicleData.violations.map((violation: any, index: number) => (
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
    </div>
  );
};

export default VehicleDetailsInfo;
