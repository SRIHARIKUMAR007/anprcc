
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

export const useSupabaseConnection = () => {
  const [isConnected, setIsConnected] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      setIsConnected(true);
      console.log('Supabase connection established');
    } else {
      setIsConnected(false);
    }
  }, [user]);

  return { isConnected };
};
