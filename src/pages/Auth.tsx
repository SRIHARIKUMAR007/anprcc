
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Camera, Eye, EyeOff, AlertCircle, Info, Shield, Settings, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [selectedRole, setSelectedRole] = useState("viewer");
  const [error, setError] = useState("");
  const [accountExistsMessage, setAccountExistsMessage] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Clear any existing auth state when component mounts
    const clearAuthState = () => {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
          localStorage.removeItem(key);
        }
      });
    };

    // Check if user is already logged in
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          console.log('User already authenticated, redirecting to home');
          navigate("/", { replace: true });
        }
      } catch (error) {
        console.error('Error checking session:', error);
        clearAuthState();
      }
    };
    
    checkUser();
  }, [navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    setError("");
    setAccountExistsMessage("");

    try {
      // Clear any existing auth state first
      await supabase.auth.signOut();
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        console.error('Sign in error:', error);
        throw error;
      }

      if (data.user) {
        console.log('Sign in successful:', data.user.id);
        toast({
          title: "Welcome back!",
          description: "You have been successfully signed in.",
        });
        
        // Use replace to prevent back navigation to auth page
        navigate("/", { replace: true });
      }
    } catch (error: any) {
      console.error('Sign in error:', error);
      setError(error.message || "An error occurred during sign in");
      toast({
        title: "Sign in failed",
        description: error.message || "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !fullName) {
      setError("Please fill in all fields");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setIsLoading(true);
    setError("");
    setAccountExistsMessage("");

    try {
      // Clear any existing auth state first
      await supabase.auth.signOut();
      
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName,
            role: selectedRole,
          },
          emailRedirectTo: `${window.location.origin}/`,
        },
      });

      if (error) {
        console.error('Sign up error:', error);
        
        // Check if the error is due to account already existing
        if (error.message.includes("already registered") || 
            error.message.includes("already exists") ||
            error.message.includes("duplicate")) {
          setAccountExistsMessage(`An account with email ${email} already exists. Please sign in instead or use a different email address.`);
          setError("");
          return;
        }
        
        throw error;
      }

      if (data.user) {
        console.log('Sign up successful:', data.user.id);
        
        // Check if user was created but already existed
        if (data.user && !data.session) {
          setAccountExistsMessage(`An account with email ${email} already exists. Please check your email for a confirmation link or sign in instead.`);
          return;
        }
        
        toast({
          title: "Account created!",
          description: data.user.email_confirmed_at 
            ? `Your ${selectedRole} account has been created successfully!` 
            : "Please check your email to verify your account.",
        });
        
        // If email is already confirmed, redirect to home
        if (data.user.email_confirmed_at) {
          navigate("/", { replace: true });
        }
      }
    } catch (error: any) {
      console.error('Sign up error:', error);
      setError(error.message || "An error occurred during sign up");
      toast({
        title: "Sign up failed",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const switchToSignIn = () => {
    setAccountExistsMessage("");
    setError("");
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Shield className="w-4 h-4 text-red-400" />;
      case 'operator': return <Settings className="w-4 h-4 text-blue-400" />;
      case 'viewer': return <User className="w-4 h-4 text-green-400" />;
      default: return <User className="w-4 h-4 text-gray-400" />;
    }
  };

  const getRoleDescription = (role: string) => {
    switch (role) {
      case 'admin': return 'Full system access - manage users, cameras, and all settings';
      case 'operator': return 'Operational access - view feeds, create detections, manage traffic data';
      case 'viewer': return 'Read-only access - view dashboards and reports only';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Camera className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">ANPR Control Center</h1>
          <p className="text-slate-400">Automated Number Plate Recognition with SDN</p>
        </div>

        <Card className="bg-slate-800/80 border-slate-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white text-center">Access Control System</CardTitle>
            <CardDescription className="text-slate-400 text-center">
              Sign in to your account or create a new one
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2 bg-slate-700/50">
                <TabsTrigger 
                  value="signin" 
                  className="data-[state=active]:bg-blue-600"
                  onClick={switchToSignIn}
                >
                  Sign In
                </TabsTrigger>
                <TabsTrigger 
                  value="signup" 
                  className="data-[state=active]:bg-blue-600"
                  onClick={switchToSignIn}
                >
                  Sign Up
                </TabsTrigger>
              </TabsList>

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded p-3 flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-red-400" />
                  <span className="text-red-400 text-sm">{error}</span>
                </div>
              )}

              {accountExistsMessage && (
                <div className="bg-blue-500/10 border border-blue-500/30 rounded p-3 flex items-start space-x-2">
                  <Info className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                  <div className="text-blue-400 text-sm">
                    <p>{accountExistsMessage}</p>
                  </div>
                </div>
              )}

              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email" className="text-slate-200">Email</Label>
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-slate-700/50 border-slate-600 text-white"
                      disabled={isLoading}
                      autoComplete="email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-password" className="text-slate-200">Password</Label>
                    <div className="relative">
                      <Input
                        id="signin-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-slate-700/50 border-slate-600 text-white pr-10"
                        disabled={isLoading}
                        autoComplete="current-password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-slate-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-slate-400" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Signing In...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name" className="text-slate-200">Full Name</Label>
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="Enter your full name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="bg-slate-700/50 border-slate-600 text-white"
                      disabled={isLoading}
                      autoComplete="name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="text-slate-200">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-slate-700/50 border-slate-600 text-white"
                      disabled={isLoading}
                      autoComplete="email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="text-slate-200">Password</Label>
                    <div className="relative">
                      <Input
                        id="signup-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password (min 6 characters)"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-slate-700/50 border-slate-600 text-white pr-10"
                        disabled={isLoading}
                        autoComplete="new-password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-slate-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-slate-400" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-role" className="text-slate-200">Account Type</Label>
                    <Select value={selectedRole} onValueChange={setSelectedRole}>
                      <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-600">
                        <SelectItem value="viewer" className="text-white hover:bg-slate-700">
                          <div className="flex items-center space-x-2">
                            {getRoleIcon('viewer')}
                            <span>Viewer</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="operator" className="text-white hover:bg-slate-700">
                          <div className="flex items-center space-x-2">
                            {getRoleIcon('operator')}
                            <span>Operator</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="admin" className="text-white hover:bg-slate-700">
                          <div className="flex items-center space-x-2">
                            {getRoleIcon('admin')}
                            <span>Admin</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-slate-400 mt-1">
                      {getRoleDescription(selectedRole)}
                    </p>
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Creating Account...
                      </>
                    ) : (
                      <>
                        {getRoleIcon(selectedRole)}
                        <span className="ml-2">Create {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)} Account</span>
                      </>
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="text-center mt-6 text-slate-400 text-sm space-y-2">
          <p>For demo purposes, you can create an account with any email.</p>
          <div className="grid grid-cols-1 gap-2 mt-4">
            <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded border border-slate-700">
              <div className="flex items-center space-x-2">
                {getRoleIcon('admin')}
                <span className="font-semibold text-red-400">Admin</span>
              </div>
              <span className="text-xs text-slate-400">Full system control</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded border border-slate-700">
              <div className="flex items-center space-x-2">
                {getRoleIcon('operator')}
                <span className="font-semibold text-blue-400">Operator</span>
              </div>
              <span className="text-xs text-slate-400">View & create detections</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded border border-slate-700">
              <div className="flex items-center space-x-2">
                {getRoleIcon('viewer')}
                <span className="font-semibold text-green-400">Viewer</span>
              </div>
              <span className="text-xs text-slate-400">Read-only access</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
