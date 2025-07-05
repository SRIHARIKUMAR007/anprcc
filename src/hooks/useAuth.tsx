
import { useState, useEffect, createContext, useContext } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
  userProfile: any;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);

  // Enhanced auth state cleanup utility
  const cleanupAuthState = () => {
    try {
      // Remove all Supabase auth keys from localStorage
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
          localStorage.removeItem(key);
        }
      });
      
      // Remove from sessionStorage if present
      const sessionKeys = Object.keys(sessionStorage || {});
      sessionKeys.forEach(key => {
        if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
          sessionStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Error cleaning up auth state:', error);
    }
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user && event === 'SIGNED_IN') {
          // Defer profile fetching to avoid deadlocks
          setTimeout(async () => {
            try {
              const { data: profile, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();
              
              if (error) {
                console.error('Error fetching user profile:', error);
              } else {
                setUserProfile(profile);
              }
            } catch (error) {
              console.error('Error fetching user profile:', error);
            }
          }, 100);
        } else {
          setUserProfile(null);
        }
        
        setLoading(false);
      }
    );

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting initial session:', error);
        }
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          try {
            const { data: profile, error: profileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();
            
            if (profileError) {
              console.error('Error fetching initial user profile:', profileError);
            } else {
              setUserProfile(profile);
            }
          } catch (error) {
            console.error('Error fetching initial user profile:', error);
          }
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    try {
      setLoading(true);
      console.log('Starting enhanced sign out process...');
      
      // Clean up auth state first
      cleanupAuthState();
      
      // Clear local state immediately
      setUser(null);
      setSession(null);
      setUserProfile(null);
      
      // Enhanced sign out with multiple attempts and timeout
      const signOutWithRetry = async (attempts = 3) => {
        for (let i = 0; i < attempts; i++) {
          try {
            console.log(`Sign out attempt ${i + 1}/${attempts}`);
            
            // Create timeout promise
            const timeoutPromise = new Promise((_, reject) => 
              setTimeout(() => reject(new Error(`Sign out timeout on attempt ${i + 1}`)), 3000)
            );
            
            // Try different sign out methods
            const signOutPromises = [
              supabase.auth.signOut({ scope: 'global' }),
              supabase.auth.signOut({ scope: 'local' }),
              supabase.auth.signOut()
            ];
            
            // Race against timeout
            await Promise.race([
              Promise.allSettled(signOutPromises),
              timeoutPromise
            ]);
            
            console.log(`Sign out attempt ${i + 1} completed`);
            break;
            
          } catch (error) {
            console.error(`Sign out attempt ${i + 1} failed:`, error);
            
            if (i === attempts - 1) {
              console.log('All sign out attempts failed, proceeding with cleanup');
            } else {
              // Wait before retry
              await new Promise(resolve => setTimeout(resolve, 500));
            }
          }
        }
      };
      
      await signOutWithRetry();
      
      // Final comprehensive cleanup
      cleanupAuthState();
      
      console.log('Sign out process completed, redirecting...');
      
      // Enhanced redirect with multiple fallbacks
      const redirect = () => {
        try {
          // Method 1: Try router navigation if available
          if (window.history && window.history.pushState) {
            window.history.pushState(null, '', '/auth');
            window.location.reload();
            return;
          }
          
          // Method 2: Direct location change
          window.location.href = '/auth';
          
        } catch (error) {
          console.error('Redirect error, using fallback:', error);
          // Method 3: Force page reload to root
          window.location.reload();
        }
      };
      
      // Small delay to ensure cleanup completes
      setTimeout(redirect, 200);
      
    } catch (error) {
      console.error('Critical sign out error:', error);
      
      // Force cleanup and redirect even on critical error
      cleanupAuthState();
      setUser(null);
      setSession(null);
      setUserProfile(null);
      
      // Force redirect as last resort
      setTimeout(() => {
        try {
          window.location.href = '/auth';
        } catch (redirectError) {
          console.error('Failed to redirect, reloading page:', redirectError);
          window.location.reload();
        }
      }, 100);
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signOut, userProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
