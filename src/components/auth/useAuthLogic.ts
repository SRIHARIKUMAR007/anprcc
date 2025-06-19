
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

  // Cleanup function to clear all auth state
  const cleanupAuthState = () => {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        localStorage.removeItem(key);
      }
    });
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        // Clean up any existing auth state before login
        cleanupAuthState();
        
        // Attempt global sign out first
        try {
          await supabase.auth.signOut({ scope: 'global' });
        } catch (err) {
          // Continue even if this fails
        }

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
          // Force page reload for clean state
          window.location.href = "/";
        }
      } else {
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
          } else {
            toast.success(`Account created successfully! You have been assigned ${userRole} role.`);
            if (userRole === "admin") {
              toast.info("You have administrator privileges with full system access.");
            }
            // Force page reload for clean state
            window.location.href = "/";
          }
        }
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.");
      console.error('Auth error:', error);
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
