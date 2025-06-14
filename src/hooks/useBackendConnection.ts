
import { useState, useEffect } from 'react';
import { 
  checkBackendHealth, 
  updateConnectionMetrics, 
  ConnectionMetrics, 
  ConnectionStatus 
} from '@/utils/backendConnection';

export const useBackendConnection = () => {
  const [isBackendConnected, setIsBackendConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('connecting');
  const [serviceMetrics, setServiceMetrics] = useState<ConnectionMetrics>({
    responseTime: 0,
    errorRate: 0,
    successfulRequests: 0,
    failedRequests: 0
  });

  // Enhanced connection checking with health endpoint
  useEffect(() => {
    const checkConnection = async () => {
      try {
        setConnectionStatus('connecting');
        const isConnected = await checkBackendHealth();
        
        setIsBackendConnected(isConnected);
        setConnectionStatus(isConnected ? 'connected' : 'disconnected');
        
        // Update metrics
        setServiceMetrics(prev => updateConnectionMetrics(prev, isConnected));
      } catch (error) {
        setIsBackendConnected(false);
        setConnectionStatus('disconnected');
        setServiceMetrics(prev => updateConnectionMetrics(prev, false));
      }
    };

    checkConnection();
    const interval = setInterval(checkConnection, 15000); // Check every 15 seconds
    return () => clearInterval(interval);
  }, []);

  const updateMetrics = (success: boolean, responseTime?: number) => {
    setServiceMetrics(prev => updateConnectionMetrics(prev, success, responseTime));
  };

  return {
    isBackendConnected,
    connectionStatus,
    serviceMetrics,
    updateMetrics
  };
};
