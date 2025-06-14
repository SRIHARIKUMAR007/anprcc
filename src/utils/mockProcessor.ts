
// Mock processor for demonstration purposes
interface MockProcessingResult {
  success: boolean;
  plates_detected: number;
  processing_time: number;
  results: Array<{
    plate_number: string;
    confidence: number;
    is_valid: boolean;
  }>;
}

export const processMockImage = async (imageFile: File): Promise<MockProcessingResult> => {
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

  const mockPlates = [
    'TN-01-AB-1234', 'TN-09-CD-5678', 'KA-05-EF-9012',
    'AP-07-GH-3456', 'MH-12-IJ-7890', 'DL-01-KL-2468'
  ];

  const platesDetected = Math.floor(Math.random() * 3) + 1;
  const results = [];

  for (let i = 0; i < platesDetected; i++) {
    const plateNumber = mockPlates[Math.floor(Math.random() * mockPlates.length)];
    const confidence = 75 + Math.random() * 25;
    
    results.push({
      plate_number: plateNumber,
      confidence: Math.round(confidence * 10) / 10,
      is_valid: confidence > 85
    });
  }

  return {
    success: true,
    plates_detected: platesDetected,
    processing_time: 1.2 + Math.random() * 2.8,
    results
  };
};

export const generateMockDetection = () => {
  const states = ['TN', 'KA', 'AP', 'MH', 'DL', 'UP', 'GJ', 'WB'];
  const state = states[Math.floor(Math.random() * states.length)];
  const district = String(Math.floor(1 + Math.random() * 99)).padStart(2, '0');
  const letters = String.fromCharCode(65 + Math.floor(Math.random() * 26)) + 
                 String.fromCharCode(65 + Math.floor(Math.random() * 26));
  const numbers = String(Math.floor(1000 + Math.random() * 9000));
  
  return `${state}-${district}-${letters}-${numbers}`;
};
