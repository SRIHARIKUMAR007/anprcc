
import { useState, useEffect, useRef, useCallback } from 'react';
import { useSupabaseBackend } from './useSupabaseBackend';
import { useSupabaseRealTimeData } from './useSupabaseRealTimeData';

interface LiveDetectionData {
  camera_id: string;
  detection_count: number;
  last_detection: string | null;
  processing_queue: number;
  accuracy_rate: number;
  performance_metrics: {
    fps: number;
    latency: number;
    cpu_usage: number;
    memory_usage: number;
  };
}

interface CameraPerformanceCache {
  [cameraId: string]: {
    lastUpdate: number;
    detections: number;
    avgAccuracy: number;
    performanceScore: number;
  };
}

export const useRealTimeIntegration = () => {
  const { isConnected, processImage } = useSupabaseBackend();
  const { detections, addDetection, systemStats, cameras } = useSupabaseRealTimeData();
  const [liveData, setLiveData] = useState<LiveDetectionData[]>([]);
  const [isLiveMode, setIsLiveMode] = useState(true);
  const [performanceOptimized, setPerformanceOptimized] = useState(true);
  const processingQueueRef = useRef<Array<{ camera_id: string; timestamp: string }>>([]);
  const performanceCacheRef = useRef<CameraPerformanceCache>({});
  const detectionIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Optimized plate generation with camera-specific patterns
  const generateOptimizedPlate = useCallback((cameraId: string) => {
    const cameraPatterns = {
      'CAM-01': ['TN-01', 'TN-09', 'TN-33', 'TN-45'],
      'CAM-02': ['KA-05', 'KA-09', 'AP-16', 'TS-08'],
      'CAM-03': ['TN-67', 'TN-72', 'MH-12', 'KL-07'],
      'CAM-04': ['DL-01', 'UP-16', 'HR-26', 'PB-03'],
      'CAM-05': ['TN-38', 'TN-55', 'WB-19', 'OR-07'],
      'CAM-06': ['GJ-15', 'RJ-27', 'MP-09', 'CG-04'],
      'CAM-07': ['TN-02', 'BR-01', 'JH-05', 'UK-07'],
      'CAM-08': ['AS-01', 'ML-05', 'MN-01', 'TR-08']
    };
    
    const patterns = cameraPatterns[cameraId as keyof typeof cameraPatterns] || cameraPatterns['CAM-01'];
    const selectedPattern = patterns[Math.floor(Math.random() * patterns.length)];
    const letters = String.fromCharCode(65 + Math.floor(Math.random() * 26)) + 
                   String.fromCharCode(65 + Math.floor(Math.random() * 26));
    const digits = String(Math.floor(1000 + Math.random() * 9000));
    return `${selectedPattern} ${letters} ${digits}`;
  }, []);

  // Performance-optimized detection simulation
  const simulateOptimizedDetection = useCallback(async (camera: any) => {
    const cameraCache = performanceCacheRef.current[camera.camera_id] || {
      lastUpdate: 0,
      detections: 0,
      avgAccuracy: 90,
      performanceScore: 95
    };

    // Throttle based on camera performance
    const now = Date.now();
    const timeSinceLastUpdate = now - cameraCache.lastUpdate;
    const minInterval = cameraCache.performanceScore > 90 ? 2000 : 3000;

    if (timeSinceLastUpdate < minInterval) return false;

    try {
      // Camera-specific detection probability based on location and performance
      const detectionProbabilities = {
        'CAM-01': 0.15, // High traffic area
        'CAM-02': 0.08, // Medium traffic
        'CAM-03': 0.18, // Very high traffic (toll plaza)
        'CAM-04': 0.06, // Low traffic
        'CAM-05': 0.12, // Medium-high traffic
        'CAM-06': 0.10, // Medium traffic
        'CAM-07': 0.07, // Medium-low traffic
        'CAM-08': 0.14  // High traffic (highway)
      };

      const probability = detectionProbabilities[camera.camera_id as keyof typeof detectionProbabilities] || 0.10;
      
      if (Math.random() > probability) return false;

      // Generate realistic confidence based on camera performance
      const baseConfidence = cameraCache.performanceScore > 90 ? 92 : 85;
      const confidence = Math.floor(baseConfidence + Math.random() * (100 - baseConfidence));

      // Determine status based on various factors
      let status: 'cleared' | 'flagged' | 'processing' = 'cleared';
      const statusRand = Math.random();
      
      if (statusRand > 0.95) status = 'flagged';
      else if (statusRand > 0.85) status = 'processing';

      const mockDetection = {
        plate_number: generateOptimizedPlate(camera.camera_id),
        camera_id: camera.camera_id,
        confidence,
        location: camera.location,
        status
      };

      // Add to processing queue with performance tracking
      processingQueueRef.current.push({
        camera_id: camera.camera_id,
        timestamp: new Date().toISOString()
      });

      // Update performance cache
      performanceCacheRef.current[camera.camera_id] = {
        lastUpdate: now,
        detections: cameraCache.detections + 1,
        avgAccuracy: (cameraCache.avgAccuracy + confidence) / 2,
        performanceScore: Math.min(100, cameraCache.performanceScore + (confidence > 90 ? 1 : -0.5))
      };

      const success = await addDetection(mockDetection);
      
      if (success) {
        // Remove from processing queue
        processingQueueRef.current = processingQueueRef.current.filter(
          item => item.camera_id !== camera.camera_id || 
                 new Date(item.timestamp).getTime() < now - 5000
        );
        return true;
      }
    } catch (error) {
      console.error(`Detection error for ${camera.camera_id}:`, error);
      // Reduce performance score on error
      if (performanceCacheRef.current[camera.camera_id]) {
        performanceCacheRef.current[camera.camera_id].performanceScore *= 0.95;
      }
    }
    
    return false;
  }, [addDetection, generateOptimizedPlate]);

  // Enhanced real-time simulation with performance optimization
  useEffect(() => {
    if (!isLiveMode || !performanceOptimized) return;
    
    const processDetections = async () => {
      const activeCameras = cameras.filter(cam => cam.status === 'active');
      
      // Process cameras in batches to avoid overwhelming the system
      const batchSize = 3;
      for (let i = 0; i < activeCameras.length; i += batchSize) {
        const batch = activeCameras.slice(i, i + batchSize);
        
        await Promise.all(
          batch.map(camera => simulateOptimizedDetection(camera))
        );
        
        // Small delay between batches for performance
        if (i + batchSize < activeCameras.length) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }

      // Update live data with enhanced metrics
      setLiveData(activeCameras.map(camera => {
        const cameraDetections = detections.filter(d => d.camera_id === camera.camera_id);
        const recentDetections = cameraDetections.filter(d => 
          new Date(d.timestamp).getTime() > Date.now() - 60000
        );
        
        const cacheData = performanceCacheRef.current[camera.camera_id] || {
          avgAccuracy: 90,
          performanceScore: 95
        };
        
        return {
          camera_id: camera.camera_id,
          detection_count: recentDetections.length,
          last_detection: cameraDetections[0]?.timestamp || null,
          processing_queue: processingQueueRef.current.filter(p => p.camera_id === camera.camera_id).length,
          accuracy_rate: cacheData.avgAccuracy,
          performance_metrics: {
            fps: cacheData.performanceScore > 90 ? 30 : 25,
            latency: cacheData.performanceScore > 90 ? 12 : 18,
            cpu_usage: 40 + (Math.random() * 20),
            memory_usage: 50 + (Math.random() * 25)
          }
        };
      }));
    };

    // Optimized interval timing
    const intervalTime = activeCameras.length > 6 ? 3000 : 2500;
    detectionIntervalRef.current = setInterval(processDetections, intervalTime);

    return () => {
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
      }
    };
  }, [isLiveMode, performanceOptimized, cameras, detections, simulateOptimizedDetection]);

  const toggleLiveMode = useCallback(() => {
    setIsLiveMode(!isLiveMode);
  }, [isLiveMode]);

  const togglePerformanceMode = useCallback(() => {
    setPerformanceOptimized(!performanceOptimized);
  }, [performanceOptimized]);

  const getEnhancedSystemMetrics = useCallback(() => {
    const totalDetections = detections.length;
    const flaggedDetections = detections.filter(d => d.status === 'flagged').length;
    const avgConfidence = totalDetections > 0 
      ? Math.round(detections.reduce((acc, d) => acc + d.confidence, 0) / totalDetections)
      : 0;
    
    const activeCameras = cameras.filter(c => c.status === 'active').length;
    const totalCameras = cameras.length;
    
    // Calculate overall system performance
    const overallPerformance = Object.values(performanceCacheRef.current)
      .reduce((acc, cache, _, arr) => acc + cache.performanceScore / arr.length, 0);
    
    return {
      totalDetections,
      flaggedDetections,
      avgConfidence,
      activeCameras,
      totalCameras,
      processingQueue: processingQueueRef.current.length,
      systemUptime: '99.8%',
      overallPerformance: Math.round(overallPerformance),
      networkHealth: Math.round(95 + Math.random() * 5),
      detectionRate: Math.round(totalDetections / Math.max(1, activeCameras) * 10) / 10
    };
  }, [detections, cameras]);

  const getCameraPerformance = useCallback((cameraId: string) => {
    return performanceCacheRef.current[cameraId] || {
      lastUpdate: 0,
      detections: 0,
      avgAccuracy: 90,
      performanceScore: 95
    };
  }, []);

  const resetPerformanceCache = useCallback(() => {
    performanceCacheRef.current = {};
  }, []);

  return {
    liveData,
    isLiveMode,
    performanceOptimized,
    toggleLiveMode,
    togglePerformanceMode,
    getEnhancedSystemMetrics,
    getCameraPerformance,
    resetPerformanceCache,
    detections,
    cameras,
    systemStats,
    isBackendConnected: isConnected
  };
};
