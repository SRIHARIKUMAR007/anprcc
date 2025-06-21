
/**
 * Authentication utilities for handling cleanup and state management
 * Specifically designed to work properly with Vercel deployments
 */

export const cleanupAuthState = () => {
  console.log('Starting comprehensive auth state cleanup...');
  
  try {
    // Clear all Supabase auth keys from localStorage
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith('supabase.auth.') || key.includes('sb-'))) {
        keysToRemove.push(key);
      }
    }
    
    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
      console.log(`Removed localStorage key: ${key}`);
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
        console.log(`Removed sessionStorage key: ${key}`);
      });
    }

    console.log('Auth state cleanup completed');
    return true;
  } catch (error) {
    console.error('Error during auth state cleanup:', error);
    return false;
  }
};

export const forceRedirectToAuth = () => {
  console.log('Forcing redirect to auth page...');
  
  // Clean up first
  cleanupAuthState();
  
  // Use setTimeout to ensure cleanup completes
  setTimeout(() => {
    if (typeof window !== 'undefined') {
      window.location.href = '/auth';
    }
  }, 100);
};

export const forceRedirectToHome = () => {
  console.log('Forcing redirect to home page...');
  
  // Use setTimeout to ensure state updates complete
  setTimeout(() => {
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  }, 100);
};

export const isAuthPage = () => {
  if (typeof window === 'undefined') return false;
  return window.location.pathname === '/auth';
};

export const isHomePage = () => {
  if (typeof window === 'undefined') return false;
  return window.location.pathname === '/';
};

export const logCurrentState = () => {
  console.log('Current auth state check:', {
    currentPath: typeof window !== 'undefined' ? window.location.pathname : 'unknown',
    hasLocalStorage: typeof localStorage !== 'undefined',
    authKeysCount: typeof localStorage !== 'undefined' ? 
      Object.keys(localStorage).filter(key => key.startsWith('supabase.auth.') || key.includes('sb-')).length : 0
  });
};
