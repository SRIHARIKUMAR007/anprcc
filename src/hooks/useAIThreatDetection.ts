
import { useState, useEffect, useRef } from 'react';
import { useBackendIntegration } from './useBackendIntegration';
import { useAIRealTimeEngine } from './useAIRealTimeEngine';

interface ThreatLevel {
  level: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  factors: string[];
  timestamp: string;
}

interface SDNResponse {
  action: 'allow' | 'restrict' | 'block' | 'monitor';
  reason: string;
  threatLevel: ThreatLevel;
  networkPath?: string;
}

export const useAIThreatDetection = () => {
  const [threatAssessments, setThreatAssessments] = useState<Map<string, ThreatLevel>>(new Map());
  const [sdnResponses, setSdnResponses] = useState<SDNResponse[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { isBackendConnected, processImage } = useBackendIntegration();
  const { aiGeneratedDetections } = useAIRealTimeEngine();
  const analysisQueueRef = useRef<string[]>([]);

  // AI-powered threat assessment based on detection patterns
  const assessThreat = (plateNumber: string, detectionData: any): ThreatLevel => {
    const factors: string[] = [];
    let riskScore = 0;

    // Check for out-of-state vehicles
    if (!plateNumber.startsWith('TN-')) {
      factors.push('Out-of-state vehicle');
      riskScore += 30;
    }

    // Check for unusual time patterns
    const hour = new Date().getHours();
    if (hour < 5 || hour > 23) {
      factors.push('Unusual time activity');
      riskScore += 25;
    }

    // Check for repeated detections in short time
    const recentDetections = aiGeneratedDetections.filter(d => 
      d.plateNumber === plateNumber && 
      new Date(d.timestamp).getTime() > Date.now() - 300000 // 5 minutes
    );
    
    if (recentDetections.length > 3) {
      factors.push('Multiple rapid detections');
      riskScore += 40;
    }

    // Check for low confidence detections
    if (detectionData.confidence < 85) {
      factors.push('Low recognition confidence');
      riskScore += 20;
    }

    // Check for speed violations
    if (detectionData.speed > 80) {
      factors.push('Speed violation');
      riskScore += 35;
    }

    // Determine threat level
    let level: 'low' | 'medium' | 'high' | 'critical' = 'low';
    if (riskScore > 80) level = 'critical';
    else if (riskScore > 60) level = 'high';
    else if (riskScore > 30) level = 'medium';

    return {
      level,
      confidence: Math.min(95, 70 + (riskScore / 2)),
      factors,
      timestamp: new Date().toISOString()
    };
  };

  // SDN-based response system
  const generateSDNResponse = (plateNumber: string, threatLevel: ThreatLevel): SDNResponse => {
    let action: 'allow' | 'restrict' | 'block' | 'monitor' = 'allow';
    let reason = 'Normal traffic flow';
    let networkPath = 'standard-route';

    switch (threatLevel.level) {
      case 'critical':
        action = 'block';
        reason = 'Critical threat detected - immediate intervention required';
        networkPath = 'security-isolation';
        break;
      case 'high':
        action = 'restrict';
        reason = 'High risk vehicle - enhanced monitoring activated';
        networkPath = 'monitored-route';
        break;
      case 'medium':
        action = 'monitor';
        reason = 'Medium risk - continuous tracking enabled';
        networkPath = 'tracked-route';
        break;
      default:
        action = 'allow';
        networkPath = 'standard-route';
    }

    return {
      action,
      reason,
      threatLevel,
      networkPath
    };
  };

  // Process image with enhanced error handling
  const processImageWithThreatAnalysis = async (imageFile: File, cameraId: string) => {
    setIsAnalyzing(true);
    
    try {
      // Attempt to process with Python backend
      if (isBackendConnected) {
        console.log('Processing image with Python ANPR service...');
        const result = await processImage(imageFile);
        
        if (result.success && result.results.length > 0) {
          // Process each detected plate
          result.results.forEach(detection => {
            if (detection.is_valid && detection.confidence > 80) {
              const threatLevel = assessThreat(detection.plate_number, detection);
              const sdnResponse = generateSDNResponse(detection.plate_number, threatLevel);
              
              setThreatAssessments(prev => new Map(prev.set(detection.plate_number, threatLevel)));
              setSdnResponses(prev => [sdnResponse, ...prev.slice(0, 19)]);
              
              console.log(`Threat assessment for ${detection.plate_number}:`, threatLevel);
              console.log(`SDN response:`, sdnResponse);
            }
          });
          
          return result;
        } else {
          console.warn('Python service returned no valid detections');
          return { success: false, error: 'No valid plates detected', results: [] };
        }
      } else {
        console.error('Python ANPR service not available');
        return { success: false, error: 'ANPR service unavailable', results: [] };
      }
    } catch (error) {
      console.error('Image processing failed:', error);
      return { success: false, error: error.message, results: [] };
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Monitor AI detections for threat patterns
  useEffect(() => {
    aiGeneratedDetections.forEach(detection => {
      if (!threatAssessments.has(detection.plateNumber)) {
        const threatLevel = assessThreat(detection.plateNumber, detection);
        const sdnResponse = generateSDNResponse(detection.plateNumber, threatLevel);
        
        setThreatAssessments(prev => new Map(prev.set(detection.plateNumber, threatLevel)));
        setSdnResponses(prev => [sdnResponse, ...prev.slice(0, 19)]);
      }
    });
  }, [aiGeneratedDetections]);

  const getThreatStats = () => {
    const threats = Array.from(threatAssessments.values());
    return {
      total: threats.length,
      critical: threats.filter(t => t.level === 'critical').length,
      high: threats.filter(t => t.level === 'high').length,
      medium: threats.filter(t => t.level === 'medium').length,
      low: threats.filter(t => t.level === 'low').length,
      avgConfidence: threats.length > 0 
        ? Math.round(threats.reduce((acc, t) => acc + t.confidence, 0) / threats.length)
        : 0
    };
  };

  return {
    threatAssessments,
    sdnResponses,
    isAnalyzing,
    processImageWithThreatAnalysis,
    getThreatStats,
    isBackendConnected
  };
};
