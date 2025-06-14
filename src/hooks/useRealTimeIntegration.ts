
import { useState, useEffect, useRef } from 'react';
import { useSupabaseBackend } from './useSupabaseBackend';
import { useSupabaseRealTimeData } from './useSupabaseRealTimeData';

interface LiveDetectionData {
  camera_id: string;
  detection_count: number;
  last_detection: string | null;
  processing_queue: number;
  accuracy_rate: number;
}

export const useRealTimeIntegration = () => {
  const { isConnected, processImage } = useSupabaseBackend();
  const { detections, addDetection, systemStats, cameras } = useSupabaseRealTimeData();
  const [liveData, setLiveData] = useState<LiveDetectionData[]>([]);
  const [isLiveMode, setIsLiveMode] = useState(true);
  const processingQueueRef = useRef<Array<{ camera_id: string; timestamp: string }>>([]);

  // Simulate live camera feeds and real-time processing
  useEffect(() => {
    if (!isLiveMode) return;

    const interval = setInterval(() => {
      // Simulate camera feeds generating detections
      const activeCameras = cameras.filter(cam => cam.status === 'active');
      
      activeCameras.forEach(async (camera) => {
        // Random chance of detection per camera
        if (Math.random() > 0.85) {
          const mockDetection = {
            plate_number: generateRealisticPlate(),
            camera_id: camera.camera_id,
            confidence: Math.floor(85 + Math.random() * 15),
            location: camera.location,
            status: Math.random() > 0.9 ? 'flagged' : 'cleared' as 'cleared' | 'flagged' | 'processing'
          };

          // Add to processing queue
          processingQueueRef.current.push({
            camera_id: camera.camera_id,
            timestamp: new Date().toISOString()
          });

          // Process and add detection
          const success = await addDetection(mockDetection);
          if (success) {
            // Remove from processing queue
            processingQueueRef.current = processingQueueRef.current.filter(
              item => item.camera_id !== camera.camera_id
            );
          }
        }
      });

      // Update live data statistics
      setLiveData(activeCameras.map(camera => {
        const cameraDetections = detections.filter(d => d.camera_id === camera.camera_id);
        const recentDetections = cameraDetections.filter(d => 
          new Date(d.timestamp).getTime() > Date.now() - 60000 // Last minute
        );
        
        return {
          camera_id: camera.camera_id,
          detection_count: recentDetections.length,
          last_detection: cameraDetections[0]?.timestamp || null,
          processing_queue: processingQueueRef.current.filter(p => p.camera_id === camera.camera_id).length,
          accuracy_rate: Math.floor(88 + Math.random() * 12)
        };
      }));

    }, 2000); // Update every 2 seconds for real-time feel

    return () => clearInterval(interval);
  }, [isLiveMode, cameras, detections, addDetection]);

  const generateRealisticPlate = () => {
    const states = ['DL', 'MH', 'UP', 'GJ', 'KA', 'TN', 'AP', 'WB', 'HR', 'PB'];
    const state = states[Math.floor(Math.random() * states.length)];
    const numbers = String(Math.floor(10 + Math.random() * 89)).padStart(2, '0');
    const letters = String.fromCharCode(65 + Math.floor(Math.random() * 26)) + 
                   String.fromCharCode(65 + Math.floor(Math.random() * 26));
    const digits = String(Math.floor(1000 + Math.random() * 9000));
    return `${state}-${numbers}-${letters}-${digits}`;
  };

  const toggleLiveMode = () => {
    setIsLiveMode(!isLiveMode);
  };

  const getSystemMetrics = () => {
    const totalDetections = detections.length;
    const flaggedDetections = detections.filter(d => d.status === 'flagged').length;
    const avgConfidence = totalDetections > 0 
      ? Math.round(detections.reduce((acc, d) => acc + d.confidence, 0) / totalDetections)
      : 0;
    
    return {
      totalDetections,
      flaggedDetections,
      avgConfidence,
      activeCameras: cameras.filter(c => c.status === 'active').length,
      totalCameras: cameras.length,
      processingQueue: processingQueueRef.current.length,
      systemUptime: '99.8%'
    };
  };

  return {
    liveData,
    isLiveMode,
    toggleLiveMode,
    getSystemMetrics,
    detections,
    cameras,
    systemStats,
    isBackendConnected: isConnected
  };
};
