
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Shield, Eye, AlertCircle } from "lucide-react";

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        console.log('Attempting login with email:', email);
        
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          console.error('Login error:', error);
          if (error.message.includes('Invalid login credentials')) {
            toast.error("Invalid email or password. Please check your credentials.");
          } else {
            toast.error(error.message);
          }
        } else if (data.user) {
          console.log('Login successful:', data.user.email);
          toast.success("Signed in successfully!");
          
          // Force redirect to home page
          setTimeout(() => {
            window.location.href = '/';
          }, 500);
        }
      } else {
        console.log('Attempting signup with email:', email);
        const userRole = determineUserRole(email);
        
        const { data, error } = await supabase.auth.signUp({
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
          console.error('Signup error:', error);
          if (error.message.includes('User already registered') || 
              error.message.includes('already registered') ||
              error.message.includes('already been registered')) {
            toast.info("Account already exists! Please sign in instead.");
            setIsLogin(true);
            setPassword("");
            setFullName("");
          } else {
            toast.error(error.message);
          }
        } else {
          if (data.user && !data.session) {
            toast.success("Please check your email for verification link!");
          } else if (data.user && data.session) {
            console.log('Signup successful:', data.user.email);
            toast.success(`Account created successfully! You have been assigned ${userRole} role.`);
            if (userRole === "admin") {
              toast.info("You have administrator privileges with full system access.");
            }
            
            // Force redirect to home page
            setTimeout(() => {
              window.location.href = '/';
            }, 500);
          }
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
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

        {!isLogin && email && (
          <div className="p-3 bg-slate-700/30 rounded-lg border border-slate-600">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-300 text-sm">Assigned Role:</span>
              <Badge className={`text-xs ${getRoleInfo(email).color}`}>
                {getRoleInfo(email).icon}
                <span className="ml-1">{getRoleInfo(email).role}</span>
              </Badge>
            </div>
            <p className="text-xs text-slate-400">{getRoleInfo(email).description}</p>
            {email === "sharisan2005@gmail.com" && (
              <div className="mt-2 flex items-center text-xs text-red-400">
                <AlertCircle className="w-3 h-3 mr-1" />
                Administrator privileges detected
              </div>
            )}
          </div>
        )}

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

      <div className="text-center">
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

      <div className="mt-6 p-4 bg-slate-800/50 rounded-lg border border-slate-600">
        <h4 className="text-white font-medium mb-2">Access Levels:</h4>
        <div className="space-y-2 text-sm">
          <div className="flex items-center text-red-400">
            <Shield className="w-3 h-3 mr-2" />
            <span>Administrator (sharisan2005@gmail.com): Full system control</span>
          </div>
          <div className="flex items-center text-green-400">
            <Eye className="w-3 h-3 mr-2" />
            <span>Viewer (All other emails): View-only access</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
