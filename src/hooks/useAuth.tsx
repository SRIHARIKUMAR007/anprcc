
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
      console.log('Starting enhanced logout process...');
      
      // Immediate state cleanup
      setUser(null);
      setSession(null);
      setUserProfile(null);
      
      // Enhanced cleanup with multiple attempts
      const performCleanup = () => {
        try {
          // Clear all possible auth-related storage
          const storageKeys = Object.keys(localStorage);
          storageKeys.forEach(key => {
            if (key.includes('supabase') || key.includes('sb-') || key.includes('auth')) {
              localStorage.removeItem(key);
            }
          });
          
          // Clear session storage
          try {
            const sessionKeys = Object.keys(sessionStorage);
            sessionKeys.forEach(key => {
              if (key.includes('supabase') || key.includes('sb-') || key.includes('auth')) {
                sessionStorage.removeItem(key);
              }
            });
          } catch (e) {
            console.warn('Session storage cleanup failed:', e);
          }
          
          // Clear any remaining tokens
          document.cookie.split(";").forEach(cookie => {
            const eqPos = cookie.indexOf("=");
            const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
            if (name.trim().includes('supabase') || name.trim().includes('sb-')) {
              document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
            }
          });
          
        } catch (error) {
          console.error('Enhanced cleanup error:', error);
        }
      };
      
      // Perform initial cleanup
      performCleanup();
      
      // Attempt Supabase signout with enhanced error handling
      try {
        console.log('Attempting Supabase signOut...');
        const result = await Promise.race([
          supabase.auth.signOut({ scope: 'global' }),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Sign out timeout')), 3000)
          )
        ]);
        
        if (result && typeof result === 'object' && 'error' in result && result.error) {
          console.warn('Supabase signOut error (continuing):', result.error);
        } else {
          console.log('Supabase signOut successful');
        }
      } catch (error) {
        console.warn('Supabase signOut failed (continuing):', error);
      }
      
      // Final cleanup attempt
      performCleanup();
      
      // Enhanced redirect with fallback
      console.log('Redirecting to auth page...');
      
      // Multiple redirect attempts for reliability
      const redirect = () => {
        try {
          if (window.history && window.history.pushState) {
            window.history.replaceState(null, '', '/auth');
            window.location.replace('/auth');
          } else {
            window.location.href = '/auth';
          }
        } catch (error) {
          console.error('Redirect error:', error);
          // Force page reload as last resort
          window.location.href = '/auth';
        }
      };
      
      // Immediate redirect
      redirect();
      
      // Backup redirect after short delay
      setTimeout(() => {
        if (window.location.pathname !== '/auth') {
          console.log('Backup redirect executing...');
          redirect();
        }
      }, 500);
      
    } catch (error) {
      console.error('Critical logout error:', error);
      
      // Emergency cleanup and redirect
      try {
        localStorage.clear();
        sessionStorage.clear();
      } catch (e) {
        console.error('Emergency cleanup failed:', e);
      }
      
      // Force redirect regardless of errors
      window.location.href = '/auth';
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
