
import { useState, useEffect, useRef } from 'react';
import { useBackendIntegration } from './useBackendIntegration';
import { useSupabaseRealTimeData } from './useSupabaseRealTimeData';
import { toast } from 'sonner';

export const useEnhancedBackendIntegration = () => {
  const [connectionHealth, setConnectionHealth] = useState({
    backend: false,
    database: false,
    lastCheck: new Date(),
    retryCount: 0
  });

  const backendIntegration = useBackendIntegration();
  const supabaseData = useSupabaseRealTimeData();
  const toastShownRef = useRef({
    backendOffline: false,
    dbOffline: false,
    allConnected: false
  });

  // Enhanced connection monitoring
  useEffect(() => {
    const checkConnections = async () => {
      const backendStatus = backendIntegration.isBackendConnected;
      const dbStatus = supabaseData.isConnected;

      setConnectionHealth(prevState => {
        const newRetryCount = (!backendStatus || !dbStatus) ? prevState.retryCount + 1 : 0;
        
        // Show connection status notifications (only once per status change)
        if (!backendStatus && !toastShownRef.current.backendOffline) {
          toast.info("Python ANPR service offline - using mock data");
          toastShownRef.current.backendOffline = true;
          toastShownRef.current.allConnected = false;
        }
        
        if (!dbStatus && !toastShownRef.current.dbOffline) {
          toast.warning("Database connection issue - some features may be limited");
          toastShownRef.current.dbOffline = true;
          toastShownRef.current.allConnected = false;
        }
        
        if (backendStatus && dbStatus && prevState.retryCount > 0 && !toastShownRef.current.allConnected) {
          toast.success("All systems connected successfully");
          toastShownRef.current.backendOffline = false;
          toastShownRef.current.dbOffline = false;
          toastShownRef.current.allConnected = true;
        }

        // Reset toast flags when status changes
        if (backendStatus) {
          toastShownRef.current.backendOffline = false;
        }
        if (dbStatus) {
          toastShownRef.current.dbOffline = false;
        }

        return {
          backend: backendStatus,
          database: dbStatus,
          lastCheck: new Date(),
          retryCount: newRetryCount
        };
      });
    };

    const interval = setInterval(checkConnections, 10000); // Check every 10 seconds
    checkConnections(); // Initial check

    return () => clearInterval(interval);
  }, [backendIntegration.isBackendConnected, supabaseData.isConnected]);

  const processImageWithRetry = async (imageFile: File, maxRetries = 3) => {
    let lastError;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const result = await backendIntegration.processImage(imageFile);
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
    ...backendIntegration,
    ...supabaseData,
    connectionHealth,
    processImageWithRetry,
    isFullyConnected: connectionHealth.backend && connectionHealth.database
  };
};
