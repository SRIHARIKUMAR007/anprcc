
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Shield, Eye, AlertCircle } from "lucide-react";

interface RolePreviewProps {
  email: string;
  isLogin: boolean;
}

const RolePreview = ({ email, isLogin }: RolePreviewProps) => {
  const determineUserRole = (email: string) => {
    if (email === "sharisan2005@gmail.com") {
      return "admin";
    }
    return "viewer";
  };

  const getRoleInfo = (email: string) => {
    const role = determineUserRole(email);
    switch (role) {
      case 'admin':
        return {
          role: 'Administrator',
          icon: <Shield className="w-4 h-4" />,
          color: 'bg-red-500/20 text-red-400 border-red-500/30',
          description: 'Full system access with all administrative capabilities'
        };
      default:
        return {
          role: 'Viewer',
          icon: <Eye className="w-4 h-4" />,
          color: 'bg-green-500/20 text-green-400 border-green-500/30',
          description: 'View-only access to system monitoring and reports'
        };
    }
  };

  if (!email || isLogin) return null;

  const roleInfo = getRoleInfo(email);

  return (
    <div className="p-3 bg-slate-700/30 rounded-lg border border-slate-600">
      <div className="flex items-center justify-between mb-2">
        <span className="text-slate-300 text-sm">Assigned Role:</span>
        <Badge className={`text-xs ${roleInfo.color}`}>
          {roleInfo.icon}
          <span className="ml-1">{roleInfo.role}</span>
        </Badge>
      </div>
      <p className="text-xs text-slate-400">{roleInfo.description}</p>
      {email === "sharisan2005@gmail.com" && (
        <div className="mt-2 flex items-center text-xs text-red-400">
          <AlertCircle className="w-3 h-3 mr-1" />
          Administrator privileges detected
        </div>
      )}
    </div>
  );
};

export default RolePreview;
