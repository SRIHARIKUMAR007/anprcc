
import { useState, useEffect } from 'react';
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

  // Enhanced connection monitoring
  useEffect(() => {
    const checkConnections = async () => {
      const backendStatus = backendIntegration.isBackendConnected;
      const dbStatus = supabaseData.isConnected;
      const prev = connectionHealth; // Move this declaration before usage

      setConnectionHealth(prevState => ({
        backend: backendStatus,
        database: dbStatus,
        lastCheck: new Date(),
        retryCount: (!backendStatus || !dbStatus) ? prevState.retryCount + 1 : 0
      }));

      // Show connection status notifications
      if (!backendStatus && prev.retryCount === 0) {
        toast.info("Python ANPR service offline - using mock data");
      }
      if (!dbStatus && prev.retryCount === 0) {
        toast.warning("Database connection issue - some features may be limited");
      }
      if (backendStatus && dbStatus && prev.retryCount > 0) {
        toast.success("All systems connected successfully");
      }
    };

    const interval = setInterval(checkConnections, 10000); // Check every 10 seconds
    checkConnections(); // Initial check

    return () => clearInterval(interval);
  }, [backendIntegration.isBackendConnected, supabaseData.isConnected, connectionHealth]);

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
