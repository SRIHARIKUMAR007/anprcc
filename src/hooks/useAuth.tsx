
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

  // Cleanup function to clear all auth state
  const cleanupAuthState = () => {
    // Clear all Supabase auth keys from localStorage
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        localStorage.removeItem(key);
      }
    });
    
    // Clear state
    setUser(null);
    setSession(null);
    setUserProfile(null);
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        
        if (event === 'SIGNED_OUT') {
          console.log('Auth state changed: SIGNED_OUT');
          cleanupAuthState();
          setLoading(false);
          // Use href instead of replace to ensure proper navigation on Vercel
          if (window.location.pathname !== '/auth') {
            console.log('Redirecting to auth page from auth state change...');
            window.location.href = '/auth';
          }
          return;
        }
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Fetch user profile with a slight delay to avoid deadlocks
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
          cleanupAuthState();
          setLoading(false);
          return;
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
        cleanupAuthState();
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
      console.log('Starting sign out process...');
      
      // Clear local state first
      cleanupAuthState();
      
      // Attempt to sign out from Supabase with global scope
      try {
        await supabase.auth.signOut({ scope: 'global' });
        console.log('Supabase sign out successful');
      } catch (error) {
        console.error('Error during global sign out:', error);
        // Continue even if this fails
      }
      
      // Force page reload and redirect - this prevents 404 issues on Vercel
      console.log('Redirecting to auth page...');
      window.location.href = '/auth';
    } catch (error) {
      console.error('Error signing out:', error);
      // Force redirect even if sign out fails
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
