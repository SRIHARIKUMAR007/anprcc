
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useAuthLogic = () => {
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

  // Clean up auth state before new login
  const cleanupAuthState = () => {
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith('supabase.auth.') || key.includes('sb-'))) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        console.log('Attempting login with email:', email);
        
        // Clean up any existing auth state
        cleanupAuthState();
        
        // Attempt to sign out any existing session
        try {
          await supabase.auth.signOut({ scope: 'global' });
        } catch (err) {
          console.log('No existing session to sign out');
        }
        
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
          
          // Use window.location for clean redirect
          setTimeout(() => {
            window.location.href = "/";
          }, 500);
        }
      } else {
        console.log('Attempting signup with email:', email);
        const userRole = determineUserRole(email);
        
        // Clean up any existing auth state
        cleanupAuthState();
        
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
            toast.info("Account already exists! Please sign in instead.", {
              description: "Switching to sign in mode."
            });
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
            
            // Use window.location for clean redirect
            setTimeout(() => {
              window.location.href = "/";
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

  const handleToggleAuth = () => {
    setIsLogin(!isLogin);
    setEmail("");
    setPassword("");
    setFullName("");
  };

  return {
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
  };
};
