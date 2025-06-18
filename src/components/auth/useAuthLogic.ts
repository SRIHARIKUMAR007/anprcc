
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

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        // Sign in flow - improved error handling
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            toast.error("Invalid email or password. Please check your credentials and try again.");
          } else if (error.message.includes('Email not confirmed')) {
            toast.error("Please check your email and click the confirmation link before signing in.");
          } else {
            toast.error(`Sign in failed: ${error.message}`);
          }
        } else if (data.user) {
          toast.success("Welcome back! Signed in successfully.");
          navigate("/");
        }
      } else {
        // Sign up flow - better handling for existing users
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
            toast.error("An account with this email already exists. Switching to sign in mode.");
            setIsLogin(true);
            setPassword(""); // Clear password for security
          } else if (error.message.includes('Password should be at least')) {
            toast.error("Password must be at least 6 characters long.");
          } else {
            toast.error(`Registration failed: ${error.message}`);
          }
        } else if (data.user) {
          if (data.user.email_confirmed_at) {
            toast.success(`Account created and verified! You have ${userRole} access.`);
            navigate("/");
          } else {
            toast.success(`Account created! Please check your email to verify your account. Role: ${userRole}`);
          }
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      toast.error("An unexpected error occurred. Please try again later.");
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
