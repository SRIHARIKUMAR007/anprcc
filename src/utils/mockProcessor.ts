
import { ANPRProcessingResult } from './imageProcessing';

const mockPlates = [
  'DL-01-AB-1234', 'MH-12-CD-5678', 'UP-16-EF-9012', 
  'GJ-05-GH-3456', 'KA-09-IJ-7890', 'TN-33-LM-2468',
  'TN-01-BC-4567', 'TN-22-XY-8901', 'AP-07-PQ-2345'
];

export const generateMockProcessingResult = async (): Promise<ANPRProcessingResult> => {
  // Enhanced mock processing with realistic delays and error simulation
  console.log('Using enhanced mock processing...');
  await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
  
  // Simulate occasional processing errors
  if (Math.random() < 0.05) { // 5% error rate
    throw new Error('Mock processing error - image quality too low');
  }
  
  const plateCount = Math.random() > 0.7 ? 2 : Math.random() > 0.3 ? 1 : 0;
  const results = [];
  
  for (let i = 0; i < plateCount; i++) {
    const randomPlate = mockPlates[Math.floor(Math.random() * mockPlates.length)];
    const confidence = 75 + Math.random() * 25;
    
    results.push({
      plate_number: randomPlate,
      confidence: Math.round(confidence * 10) / 10,
      is_valid: confidence > 85,
      bbox: {
        x: Math.random() * 200,
        y: Math.random() * 100,
        width: 150 + Math.random() * 50,
        height: 30 + Math.random() * 20,
      },
      raw_text: randomPlate.replace(/-/g, '')
    });
  }

  return {
    success: plateCount > 0,
    plates_detected: results.length,
    results,
    processing_time: 1.2 + Math.random() * 0.8,
    error: plateCount === 0 ? 'No license plates detected in image' : undefined
  };
};
