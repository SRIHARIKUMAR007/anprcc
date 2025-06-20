
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "@/components/auth/AuthForm";
import { useAuthLogic } from "@/components/auth/useAuthLogic";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { Shield, Database, CheckCircle, XCircle } from "lucide-react";

const Auth = () => {
  const { user, loading, isConnected } = useAuth();
  const navigate = useNavigate();
  
  const {
    isLogin,
    email,
    setEmail,
    password,
    setPassword,
    fullName,
    setFullName,
    isLoading,
    handleAuth,
    handleToggleAuth
  } = useAuthLogic();

  // Redirect if already authenticated
  useEffect(() => {
    if (!loading && user) {
      console.log('User already authenticated, redirecting to dashboard');
      navigate('/', { replace: true });
    }
  }, [user, loading, navigate]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render if user is authenticated
  if (user) {
    return null;
  }

  return (
    <div className="relative">
      <AuthForm
        isLogin={isLogin}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        fullName={fullName}
        setFullName={setFullName}
        isLoading={isLoading}
        onSubmit={handleAuth}
        onToggleMode={handleToggleAuth}
      />
      
      {/* Connection Status */}
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
                <span className="text-xs">Connected</span>
              </>
            ) : (
              <>
                <XCircle className="w-3 h-3" />
                <span className="text-xs">Disconnected</span>
              </>
            )}
          </div>
        </Badge>
      </div>

      {/* System Info */}
      <div className="fixed bottom-4 left-4 right-4 z-50">
        <div className="max-w-md mx-auto bg-slate-800/50 backdrop-blur-sm rounded-lg p-4 border border-slate-700">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-medium text-white">Tamil Nadu Traffic Control</span>
            </div>
            <Badge variant="secondary" className="text-xs bg-blue-500/20 text-blue-400 border-blue-500/30">
              v2.0
            </Badge>
          </div>
          <div className="text-xs text-slate-400 space-y-1">
            <p>• Automatic Number Plate Recognition System</p>
            <p>• Real-time Traffic Monitoring</p>
            <p>• Role-based Access Control</p>
            <p>• Secure Database Integration</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
