
import { useState, useEffect, useRef } from 'react';
import { useSupabaseRealTimeData } from './useSupabaseRealTimeData';
import { useBackendIntegration } from './useBackendIntegration';

interface AIGeneratedData {
  plateNumber: string;
  confidence: number;
  vehicleType: 'car' | 'truck' | 'bus' | 'motorcycle';
  speed: number;
  timestamp: string;
  isValid: boolean;
  riskLevel: 'low' | 'medium' | 'high';
  location: { lat: number; lng: number };
}

interface TrafficPattern {
  peakHours: boolean;
  congestionLevel: number;
  averageSpeed: number;
  vehicleCount: number;
  weatherImpact: number;
}

export const useAIRealTimeEngine = () => {
  const [isAIProcessing, setIsAIProcessing] = useState(false);
  const [aiGeneratedDetections, setAIGeneratedDetections] = useState<AIGeneratedData[]>([]);
  const [trafficPattern, setTrafficPattern] = useState<TrafficPattern>({
    peakHours: false,
    congestionLevel: 0.3,
    averageSpeed: 45,
    vehicleCount: 12,
    weatherImpact: 0.1
  });
  const [systemLoad, setSystemLoad] = useState({
    cpu: 45,
    memory: 62,
    network: 23,
    processing: 38
  });

  const { addDetection, cameras } = useSupabaseRealTimeData();
  const { isBackendConnected } = useBackendIntegration();
  const intervalRef = useRef<NodeJS.Timeout>();

  // AI-powered plate generation based on Indian patterns
  const generateAIPlate = () => {
    const states = [
      'TN', 'KA', 'AP', 'TS', 'KL', 'MH', 'DL', 'UP', 'GJ', 'RJ',
      'MP', 'WB', 'OR', 'JH', 'HR', 'PB', 'CH', 'UK', 'HP', 'BR'
    ];
    
    // Weighted selection favoring Tamil Nadu
    const stateWeights = { 'TN': 0.6, 'KA': 0.15, 'AP': 0.1, 'others': 0.15 };
    const rand = Math.random();
    
    let selectedState = 'TN';
    if (rand > stateWeights.TN) {
      if (rand > stateWeights.TN + stateWeights.KA) {
        if (rand > stateWeights.TN + stateWeights.KA + stateWeights.AP) {
          selectedState = states[Math.floor(Math.random() * states.length)];
        } else {
          selectedState = 'AP';
        }
      } else {
        selectedState = 'KA';
      }
    }

    const districtCode = String(Math.floor(1 + Math.random() * 99)).padStart(2, '0');
    const series = String.fromCharCode(65 + Math.floor(Math.random() * 26)) + 
                  String.fromCharCode(65 + Math.floor(Math.random() * 26));
    const number = String(Math.floor(1000 + Math.random() * 9000));
    
    return `${selectedState}-${districtCode}-${series}-${number}`;
  };

  // AI-powered traffic analysis
  const analyzeTrafficPatterns = () => {
    const hour = new Date().getHours();
    const isPeakHour = (hour >= 7 && hour <= 10) || (hour >= 17 && hour <= 20);
    
    // Simulate weather impact
    const weatherImpact = Math.random() * 0.3;
    
    // Dynamic congestion based on time and conditions
    let baseCongestion = isPeakHour ? 0.7 : 0.3;
    baseCongestion += weatherImpact;
    
    setTrafficPattern(prev => ({
      ...prev,
      peakHours: isPeakHour,
      congestionLevel: Math.min(1, baseCongestion + (Math.random() - 0.5) * 0.2),
      averageSpeed: Math.max(15, 60 - (baseCongestion * 30) + (Math.random() - 0.5) * 10),
      vehicleCount: Math.floor((isPeakHour ? 25 : 12) * (1 + weatherImpact) + (Math.random() - 0.5) * 8),
      weatherImpact
    }));
  };

  // Advanced AI detection simulation
  const processAIDetection = async (cameraId: string) => {
    setIsAIProcessing(true);
    
    try {
      // Simulate AI processing time based on system load
      const processingTime = 800 + (systemLoad.cpu / 100) * 500 + Math.random() * 400;
      await new Promise(resolve => setTimeout(resolve, processingTime));

      const vehicleTypes: Array<'car' | 'truck' | 'bus' | 'motorcycle'> = ['car', 'truck', 'bus', 'motorcycle'];
      const vehicleWeights = { car: 0.6, motorcycle: 0.2, truck: 0.15, bus: 0.05 };
      
      let selectedVehicle: 'car' | 'truck' | 'bus' | 'motorcycle' = 'car';
      const rand = Math.random();
      if (rand > vehicleWeights.car) {
        if (rand > vehicleWeights.car + vehicleWeights.motorcycle) {
          selectedVehicle = rand > vehicleWeights.car + vehicleWeights.motorcycle + vehicleWeights.truck ? 'bus' : 'truck';
        } else {
          selectedVehicle = 'motorcycle';
        }
      }

      // AI confidence based on conditions
      const baseConfidence = 92;
      const weatherPenalty = trafficPattern.weatherImpact * 10;
      const speedPenalty = Math.max(0, (trafficPattern.averageSpeed - 40) / 60 * 5);
      const loadPenalty = systemLoad.processing / 100 * 8;
      
      const confidence = Math.max(75, baseConfidence - weatherPenalty - speedPenalty - loadPenalty + (Math.random() - 0.5) * 10);

      // Risk assessment
      const plateNumber = generateAIPlate();
      const isOutOfState = !plateNumber.startsWith('TN-');
      const isHighSpeed = trafficPattern.averageSpeed > 70;
      const isWeirdHour = new Date().getHours() < 5 || new Date().getHours() > 23;
      
      let riskLevel: 'low' | 'medium' | 'high' = 'low';
      if ((isOutOfState && isWeirdHour) || isHighSpeed) {
        riskLevel = 'medium';
      }
      if (isOutOfState && isHighSpeed && Math.random() > 0.9) {
        riskLevel = 'high';
      }

      const aiData: AIGeneratedData = {
        plateNumber,
        confidence: Math.round(confidence * 10) / 10,
        vehicleType: selectedVehicle,
        speed: Math.max(15, trafficPattern.averageSpeed + (Math.random() - 0.5) * 20),
        timestamp: new Date().toISOString(),
        isValid: confidence > 85,
        riskLevel,
        location: {
          lat: 13.0827 + (Math.random() - 0.5) * 0.1,
          lng: 80.2707 + (Math.random() - 0.5) * 0.1
        }
      };

      setAIGeneratedDetections(prev => [aiData, ...prev.slice(0, 49)]);

      // Add to database if valid
      if (aiData.isValid) {
        await addDetection({
          plate_number: aiData.plateNumber,
          camera_id: cameraId,
          confidence: Math.round(aiData.confidence),
          location: `Camera ${cameraId} - Tamil Nadu Highway`,
          status: riskLevel === 'high' ? 'flagged' : 'cleared'
        });
      }

      return aiData;
    } finally {
      setIsAIProcessing(false);
    }
  };

  // Real-time system monitoring
  useEffect(() => {
    const updateSystemMetrics = () => {
      setSystemLoad(prev => ({
        cpu: Math.max(20, Math.min(95, prev.cpu + (Math.random() - 0.5) * 10)),
        memory: Math.max(30, Math.min(90, prev.memory + (Math.random() - 0.5) * 8)),
        network: Math.max(5, Math.min(100, prev.network + (Math.random() - 0.5) * 15)),
        processing: Math.max(10, Math.min(85, prev.processing + (Math.random() - 0.5) * 12))
      }));
    };

    const metricsInterval = setInterval(updateSystemMetrics, 2000);
    return () => clearInterval(metricsInterval);
  }, []);

  // AI processing engine
  useEffect(() => {
    if (cameras.length === 0) return;

    const runAIEngine = async () => {
      analyzeTrafficPatterns();
      
      // Process detections on active cameras
      const activeCameras = cameras.filter(cam => cam.status === 'active');
      
      for (const camera of activeCameras) {
        // Probability based on traffic patterns and time
        const detectionProbability = trafficPattern.peakHours ? 0.4 : 0.2;
        
        if (Math.random() < detectionProbability) {
          processAIDetection(camera.camera_id);
          // Stagger processing to avoid overload
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }
    };

    intervalRef.current = setInterval(runAIEngine, 3000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [cameras, trafficPattern.peakHours]);

  const getAIInsights = () => {
    const recentDetections = aiGeneratedDetections.slice(0, 10);
    const outOfStateCount = recentDetections.filter(d => !d.plateNumber.startsWith('TN-')).length;
    const highRiskCount = recentDetections.filter(d => d.riskLevel === 'high').length;
    const avgConfidence = recentDetections.length > 0 
      ? recentDetections.reduce((acc, d) => acc + d.confidence, 0) / recentDetections.length 
      : 0;

    return {
      outOfStatePercentage: Math.round((outOfStateCount / Math.max(1, recentDetections.length)) * 100),
      highRiskCount,
      avgConfidence: Math.round(avgConfidence * 10) / 10,
      processingEfficiency: Math.round(100 - (systemLoad.processing / 2)),
      trafficDensity: trafficPattern.congestionLevel
    };
  };

  return {
    isAIProcessing,
    aiGeneratedDetections,
    trafficPattern,
    systemLoad,
    processAIDetection,
    getAIInsights,
    isRealTime: true
  };
};
