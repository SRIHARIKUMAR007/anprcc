
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Shield, Eye, Settings, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Determine role based on email
  const determineUserRole = (email: string) => {
    if (email === "sharisan2005@gmail.com") {
      return "operator";
    }
    return "viewer";
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            toast.error("Invalid email or password. Please check your credentials.");
          } else {
            toast.error(error.message);
          }
        } else {
          toast.success("Signed in successfully!");
          navigate("/");
        }
      } else {
        // Determine role for new user
        const userRole = determineUserRole(email);
        
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              full_name: fullName,
              role: userRole
            }
          }
        });

        if (error) {
          if (error.message.includes('User already registered')) {
            toast.error("An account with this email already exists. Please sign in instead.");
            setIsLogin(true);
          } else {
            toast.error(error.message);
          }
        } else {
          toast.success(`Account created successfully! You have been assigned ${userRole} role.`);
          if (userRole === "operator") {
            toast.info("You have operator privileges with enhanced system access.");
          }
          navigate("/");
        }
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.");
      console.error('Auth error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleInfo = (email: string) => {
    const role = determineUserRole(email);
    switch (role) {
      case 'operator':
        return {
          role: 'Operator',
          icon: <Settings className="w-4 h-4" />,
          color: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
          description: 'Enhanced system access with detection and monitoring capabilities'
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

  const roleInfo = email ? getRoleInfo(email) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-white">
            {isLogin ? "Sign In" : "Create Account"}
          </CardTitle>
          <p className="text-slate-400">
            {isLogin ? "Welcome back to ANPR Control Center" : "Join the ANPR Control Center"}
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAuth} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-white">Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required={!isLogin}
                  className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400"
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400"
              />
            </div>

            {/* Role Preview for Sign Up */}
            {!isLogin && email && roleInfo && (
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
                  <div className="mt-2 flex items-center text-xs text-blue-400">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    Special operator privileges detected
                  </div>
                )}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  {isLogin ? "Signing in..." : "Creating account..."}
                </div>
              ) : (
                isLogin ? "Sign In" : "Create Account"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-400">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
            </p>
            <Button
              variant="link"
              onClick={() => {
                setIsLogin(!isLogin);
                setEmail("");
                setPassword("");
                setFullName("");
              }}
              className="text-blue-400 hover:text-blue-300"
            >
              {isLogin ? "Create one here" : "Sign in here"}
            </Button>
          </div>

          {/* Role Information */}
          <div className="mt-6 pt-4 border-t border-slate-600">
            <h4 className="text-white text-sm font-semibold mb-3">Access Levels:</h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Settings className="w-3 h-3 mr-2 text-blue-400" />
                  <span className="text-slate-300">Operator</span>
                </div>
                <span className="text-slate-500">Special Access</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Eye className="w-3 h-3 mr-2 text-green-400" />
                  <span className="text-slate-300">Viewer</span>
                </div>
                <span className="text-slate-500">Standard Access</span>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Roles are automatically assigned based on your email address.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
