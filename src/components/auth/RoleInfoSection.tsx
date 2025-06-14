
import React from "react";
import { Shield, Eye } from "lucide-react";

const RoleInfoSection = () => {
  return (
    <div className="mt-6 pt-4 border-t border-slate-600">
      <h4 className="text-white text-sm font-semibold mb-3">Access Levels:</h4>
      <div className="space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Shield className="w-3 h-3 mr-2 text-red-400" />
            <span className="text-slate-300">Administrator</span>
          </div>
          <span className="text-slate-500">Full Access</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Eye className="w-3 h-3 mr-2 text-green-400" />
            <span className="text-slate-300">Viewer</span>
          </div>
          <span className="text-slate-500">View Only</span>
        </div>
      </div>
      <p className="text-xs text-slate-500 mt-2">
        Roles are automatically assigned based on your email address.
      </p>
    </div>
  );
};

export default RoleInfoSection;
