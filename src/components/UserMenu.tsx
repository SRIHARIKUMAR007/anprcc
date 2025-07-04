
import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { User, LogOut, Settings, Shield, Eye } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import SettingsInterface from "./settings/SettingsInterface";
import RoleBasedAccess from "./RoleBasedAccess";

const UserMenu = () => {
  const { user, userProfile, signOut } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      console.log('User menu: Starting sign out...');
      toast({
        title: "Signing out...",
        description: "Please wait while we log you out.",
      });
      
      // Call the signOut function - it will handle redirect
      await signOut();
      
      // Note: We don't show success toast here as the page will redirect
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Sign out failed",
        description: "There was an error signing out. Redirecting anyway...",
        variant: "destructive",
      });
      
      // Force redirect even if there's an error
      window.location.href = '/auth';
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

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="bg-slate-800/50 border-slate-600 text-white hover:bg-slate-700/50">
            <User className="w-4 h-4 mr-2" />
            {userProfile?.full_name || user?.email || 'User'}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-64 bg-slate-800 border-slate-600 z-50">
          <DropdownMenuLabel className="text-white">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{userProfile?.full_name || 'User'}</p>
              <p className="text-xs leading-none text-slate-400">{user?.email}</p>
              <div className="pt-2">
                <Badge className={`text-xs ${getRoleBadgeColor(userProfile?.role || 'viewer')}`}>
                  {getRoleIcon(userProfile?.role || 'viewer')}
                  <span className="ml-1">{getRoleDisplayName(userProfile?.role || 'viewer')}</span>
                </Badge>
              </div>
              <div className="pt-1">
                <p className="text-xs text-slate-500">
                  Access Level: {userProfile?.role === 'admin' ? 'Full Control' : 
                                userProfile?.role === 'operator' ? 'Operations' : 'View Only'}
                </p>
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
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-slate-600" />
          </RoleBasedAccess>
          
          <DropdownMenuItem 
            className="text-red-400 hover:bg-red-500/10 hover:text-red-300 cursor-pointer"
            onClick={handleSignOut}
            disabled={isLoading}
          >
            <LogOut className="w-4 h-4 mr-2" />
            {isLoading ? "Signing out..." : "Sign out"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Settings Dialog - Only for Admin and Operator */}
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
