
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { User, LogOut, Settings, Shield, Eye, Database, CheckCircle, XCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import SettingsInterface from "./settings/SettingsInterface";
import RoleBasedAccess from "./RoleBasedAccess";

const UserMenu = () => {
  const { user, userProfile, signOut, isConnected } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error("Error signing out. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSettings = () => {
    setShowSettings(true);
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'operator': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'viewer': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Shield className="w-3 h-3" />;
      case 'operator': return <Settings className="w-3 h-3" />;
      case 'viewer': return <Eye className="w-3 h-3" />;
      default: return <User className="w-3 h-3" />;
    }
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrator';
      case 'operator': return 'Operator';
      case 'viewer': return 'Viewer';
      default: return 'User';
    }
  };

  const getAccessLevel = (role: string) => {
    switch (role) {
      case 'admin': return 'Full Control';
      case 'operator': return 'Operations';
      case 'viewer': return 'View Only';
      default: return 'Limited';
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="bg-slate-800/50 border-slate-600 text-white hover:bg-slate-700/50">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <span className="hidden sm:inline">{userProfile?.full_name || user?.email?.split('@')[0] || 'User'}</span>
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-80 bg-slate-800 border-slate-600 z-50">
          <DropdownMenuLabel className="text-white">
            <div className="flex flex-col space-y-3 p-2">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium leading-none text-white">
                    {userProfile?.full_name || 'User'}
                  </p>
                  <p className="text-xs leading-none text-slate-400 mt-1">
                    {user?.email}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <Badge className={`text-xs ${getRoleBadgeColor(userProfile?.role || 'viewer')}`}>
                  {getRoleIcon(userProfile?.role || 'viewer')}
                  <span className="ml-1">{getRoleDisplayName(userProfile?.role || 'viewer')}</span>
                </Badge>
                
                <Badge 
                  variant="secondary" 
                  className={`text-xs ${isConnected ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'}`}
                >
                  <Database className="w-3 h-3 mr-1" />
                  {isConnected ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                </Badge>
              </div>
              
              <div className="bg-slate-700/30 rounded-lg p-2">
                <div className="text-xs text-slate-400 space-y-1">
                  <div className="flex justify-between">
                    <span>Access Level:</span>
                    <span className="text-slate-300">{getAccessLevel(userProfile?.role || 'viewer')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Database:</span>
                    <span className={isConnected ? 'text-green-400' : 'text-red-400'}>
                      {isConnected ? 'Connected' : 'Offline'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-slate-600" />
          
          <RoleBasedAccess allowedRoles={['admin', 'operator']}>
            <DropdownMenuItem 
              className="text-slate-300 hover:bg-slate-700 hover:text-white cursor-pointer"
              onClick={handleSettings}
            >
              <Settings className="w-4 h-4 mr-2" />
              System Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-slate-600" />
          </RoleBasedAccess>
          
          <DropdownMenuItem 
            className="text-red-400 hover:bg-red-500/10 hover:text-red-300 cursor-pointer"
            onClick={handleSignOut}
            disabled={isLoading}
          >
            <LogOut className="w-4 h-4 mr-2" />
            {isLoading ? "Signing out..." : "Sign Out"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Settings Dialog */}
      <RoleBasedAccess allowedRoles={['admin', 'operator']}>
        <Dialog open={showSettings} onOpenChange={setShowSettings}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-900 border-slate-700">
            <DialogHeader>
              <DialogTitle className="text-white flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                System Settings
                <Badge className={`ml-2 text-xs ${getRoleBadgeColor(userProfile?.role || 'viewer')}`}>
                  {getRoleIcon(userProfile?.role || 'viewer')}
                  <span className="ml-1">{getRoleDisplayName(userProfile?.role || 'viewer')}</span>
                </Badge>
              </DialogTitle>
            </DialogHeader>
            <SettingsInterface />
          </DialogContent>
        </Dialog>
      </RoleBasedAccess>
    </>
  );
};

export default UserMenu;
