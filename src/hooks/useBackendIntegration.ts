
import { useBackendConnection } from './useBackendConnection';
import { useImageProcessor } from './useImageProcessor';
import { useDetectionLogger } from './useDetectionLogger';

export interface ANPRProcessingResult {
  success: boolean;
  plates_detected: number;
  results: Array<{
    plate_number: string;
    confidence: number;
    is_valid: boolean;
    bbox: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
    raw_text: string;
  }>;
  processing_time?: number;
  error?: string;
}

export interface CameraStreamData {
  camera_id: string;
  frame_data: string;
  timestamp: string;
}

export const useBackendIntegration = () => {
  const {
    isBackendConnected,
    connectionStatus,
    serviceMetrics,
    updateMetrics
  } = useBackendConnection();

  const {
    isProcessing,
    processImage,
    batchProcessImages
  } = useImageProcessor(isBackendConnected, updateMetrics);

  const { logDetection } = useDetectionLogger();

  return {
    isBackendConnected,
    connectionStatus,
    isProcessing,
    serviceMetrics,
    processImage,
    batchProcessImages,
    logDetection,
  };
};
