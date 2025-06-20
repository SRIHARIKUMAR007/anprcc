
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const determineUserRole = (email: string) => {
    if (email === "sharisan2005@gmail.com") {
      return "admin";
    }
    return "viewer";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        // Sign in
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            toast.error("Invalid email or password");
          } else {
            toast.error(error.message);
          }
        } else if (data.user) {
          toast.success("Signed in successfully!");
          navigate('/', { replace: true });
        }
      } else {
        // Sign up
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
          if (error.message.includes('User already registered')) {
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
            toast.success(`Account created successfully! You have ${userRole} access.`);
            navigate('/', { replace: true });
          }
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      toast.error("An unexpected error occurred");
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
    </div>
  );
};

export default AuthForm;
