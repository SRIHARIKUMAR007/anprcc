
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

  // Clean up authentication state completely
  const cleanupAuthState = () => {
    console.log('Cleaning up auth state...');
    
    // Clear all possible auth keys from localStorage
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith('supabase.auth.') || key.includes('sb-'))) {
        keysToRemove.push(key);
      }
    }
    
    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
      console.log(`Removed: ${key}`);
    });

    // Clear session storage as well
    if (typeof sessionStorage !== 'undefined') {
      const sessionKeysToRemove = [];
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key && (key.startsWith('supabase.auth.') || key.includes('sb-'))) {
          sessionKeysToRemove.push(key);
        }
      }
      sessionKeysToRemove.forEach(key => {
        sessionStorage.removeItem(key);
        console.log(`Removed from session: ${key}`);
      });
    }

    // Clear component state
    setUser(null);
    setSession(null);
    setUserProfile(null);
    setLoading(false);
  };

  useEffect(() => {
    let mounted = true;

    const getInitialSession = async () => {
      try {
        console.log('Getting initial session...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting initial session:', error);
          cleanupAuthState();
          return;
        }
        
        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          
          if (session?.user) {
            console.log('User found in session:', session.user.email);
            try {
              const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();
              
              if (profileError) {
                console.error('Error fetching user profile:', profileError);
              } else if (mounted) {
                setUserProfile(profile);
              }
            } catch (error) {
              console.error('Error fetching user profile:', error);
            }
          }
          
          setLoading(false);
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error);
        if (mounted) {
          cleanupAuthState();
        }
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email || 'No user');
        
        if (!mounted) return;
        
        if (event === 'SIGNED_OUT') {
          console.log('User signed out - cleaning up state');
          cleanupAuthState();
          return;
        }
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user && event !== 'TOKEN_REFRESHED') {
          console.log('Fetching user profile for:', session.user.email);
          try {
            const { data: profile, error } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();
            
            if (error) {
              console.error('Error fetching user profile:', error);
            } else if (mounted) {
              setUserProfile(profile);
            }
          } catch (error) {
            console.error('Error fetching user profile:', error);
          }
        }
        
        if (mounted) {
          setLoading(false);
        }
      }
    );

    getInitialSession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    console.log('Starting comprehensive sign out...');
    setLoading(true);
    
    try {
      // Step 1: Clean up local state first
      cleanupAuthState();
      
      // Step 2: Sign out from Supabase with global scope
      const { error } = await supabase.auth.signOut({ scope: 'global' });
      if (error) {
        console.error('Supabase sign out error:', error);
        // Continue with redirect even if there's an error
      }
      
      console.log('Sign out completed successfully');
      
      // Step 3: Force redirect to auth page
      setTimeout(() => {
        window.location.href = '/auth';
      }, 100);
      
    } catch (error) {
      console.error('Error during sign out:', error);
      // Force redirect even on error
      setTimeout(() => {
        window.location.href = '/auth';
      }, 100);
    }
  };

  const value = {
    user,
    session,
    loading,
    signOut,
    userProfile
  };

  return (
    <AuthContext.Provider value={value}>
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
