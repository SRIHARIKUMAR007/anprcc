
import { useState, useEffect, useRef } from 'react';
import { useSupabaseRealTimeData } from './useSupabaseRealTimeData';
import { useSupabaseBackend } from './useSupabaseBackend';
import { toast } from 'sonner';

export const useEnhancedBackendIntegration = () => {
  const [connectionHealth, setConnectionHealth] = useState({
    backend: false,
    database: false,
    lastCheck: new Date(),
    retryCount: 0
  });

  const supabaseData = useSupabaseRealTimeData();
  const supabaseBackend = useSupabaseBackend();
  const toastShownRef = useRef({
    dbOffline: false,
    allConnected: false
  });

  // Enhanced connection monitoring using Supabase as primary backend
  useEffect(() => {
    const checkConnections = async () => {
      const dbStatus = supabaseData.isConnected && supabaseBackend.isConnected;
      
      setConnectionHealth(prevState => {
        const newRetryCount = !dbStatus ? prevState.retryCount + 1 : 0;
        
        // Show connection status notifications
        if (!dbStatus && !toastShownRef.current.dbOffline) {
          toast.info("Using Lovable/Supabase backend for ANPR processing");
          toastShownRef.current.dbOffline = true;
          toastShownRef.current.allConnected = false;
        }
        
        if (dbStatus && prevState.retryCount > 0 && !toastShownRef.current.allConnected) {
          toast.success("Supabase backend connected successfully");
          toastShownRef.current.dbOffline = false;
          toastShownRef.current.allConnected = true;
        }

        // Reset toast flags when status changes
        if (dbStatus) {
          toastShownRef.current.dbOffline = false;
        }

        return {
          backend: true, // Always true since we're using Supabase
          database: dbStatus,
          lastCheck: new Date(),
          retryCount: newRetryCount
        };
      });
    };

    const interval = setInterval(checkConnections, 10000); // Check every 10 seconds
    checkConnections(); // Initial check

    return () => clearInterval(interval);
  }, [supabaseData.isConnected, supabaseBackend.isConnected]);

  const processImageWithRetry = async (imageFile: File, maxRetries = 3) => {
    let lastError;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const result = await supabaseBackend.processImage(imageFile);
        if (result.success) {
          toast.success(`Image processed successfully (attempt ${attempt})`);
          return result;
        }
        throw new Error(result.error || 'Processing failed');
      } catch (error) {
        lastError = error;
        if (attempt < maxRetries) {
          toast.info(`Processing failed, retrying... (${attempt}/${maxRetries})`);
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt)); // Exponential backoff
        }
      }
    }
    
    toast.error(`Image processing failed after ${maxRetries} attempts`);
    throw lastError;
  };

  return {
    // Backend integration (now using Supabase)
    isBackendConnected: true, // Always true since we're using Supabase
    isProcessing: supabaseBackend.isProcessing,
    processImage: supabaseBackend.processImage,
    logDetection: supabaseBackend.logDetection,
    processImageWithRetry,
    
    // Supabase real-time data
    ...supabaseData,
    
    // Connection health
    connectionHealth,
    isFullyConnected: connectionHealth.backend && connectionHealth.database
  };
};
