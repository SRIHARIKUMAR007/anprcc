
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Database, CheckCircle, XCircle } from "lucide-react";

interface AuthWrapperProps {
  children: React.ReactNode;
}

const AuthWrapper = ({ children }: AuthWrapperProps) => {
  const { user, loading, isConnected } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      console.log('🔄 User not authenticated, redirecting to auth page');
      navigate('/auth', { replace: true });
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 p-6">
        <div className="container mx-auto space-y-6">
          {/* Header Skeleton */}
          <div className="flex justify-between items-center">
            <Skeleton className="h-8 w-64 bg-slate-700" />
            <div className="flex space-x-2">
              <Skeleton className="h-8 w-24 bg-slate-700" />
              <Skeleton className="h-8 w-32 bg-slate-700" />
            </div>
          </div>
          
          {/* Status Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32 bg-slate-700 rounded-lg" />
            ))}
          </div>
          
          {/* Main Content Skeleton */}
          <div className="space-y-4">
            <Skeleton className="h-12 w-full bg-slate-700" />
            <Skeleton className="h-96 w-full bg-slate-700" />
          </div>
        </div>

        {/* Connection Status */}
        <div className="fixed top-4 right-4 z-50">
          <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 backdrop-blur-sm">
            <div className="flex items-center space-x-2">
              <Database className="w-3 h-3" />
              <span className="text-xs">Connecting...</span>
            </div>
          </Badge>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Authentication Required</h2>
          <p className="text-slate-400">Redirecting to login page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {children}
      
      {/* Global Connection Status */}
      <div className="fixed top-4 right-4 z-50">
        <Badge 
          variant="secondary" 
          className={`${isConnected ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'} backdrop-blur-sm`}
        >
          <div className="flex items-center space-x-2">
            <Database className="w-3 h-3" />
            {isConnected ? (
              <>
                <CheckCircle className="w-3 h-3" />
                <span className="text-xs">DB Connected</span>
              </>
            ) : (
              <>
                <XCircle className="w-3 h-3" />
                <span className="text-xs">DB Offline</span>
              </>
            )}
          </div>
        </Badge>
      </div>
    </div>
  );
};

export default AuthWrapper;
