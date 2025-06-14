
export const mockCameras = [
  { 
    id: "CAM-01", 
    location: "Chennai - GST Road Junction", 
    status: "active", 
    vehicles: 8, 
    fps: 30, 
    resolution: "4K (3840x2160)",
    coordinates: { lat: 13.0827, lng: 80.2707 },
    direction: "North-South"
  },
  { 
    id: "CAM-02", 
    location: "Coimbatore - Salem Highway", 
    status: "active", 
    vehicles: 12, 
    fps: 30, 
    resolution: "1920x1080",
    coordinates: { lat: 11.0168, lng: 76.9558 },
    direction: "East-West"
  },
  { 
    id: "CAM-03", 
    location: "Madurai - Trichy Road", 
    status: "maintenance", 
    vehicles: 0, 
    fps: 0, 
    resolution: "offline",
    coordinates: { lat: 9.9252, lng: 78.1198 },
    direction: "N/A"
  },
  { 
    id: "CAM-04", 
    location: "Salem - Bangalore Highway Toll", 
    status: "active", 
    vehicles: 15, 
    fps: 25, 
    resolution: "1920x1080",
    coordinates: { lat: 11.6643, lng: 78.1460 },
    direction: "Bidirectional"
  },
  { 
    id: "CAM-05", 
    location: "Tiruchirappalli - Main Junction", 
    status: "active", 
    vehicles: 6, 
    fps: 30, 
    resolution: "2K (2560x1440)",
    coordinates: { lat: 10.7905, lng: 78.7047 },
    direction: "Multi-directional"
  },
  { 
    id: "CAM-06", 
    location: "Tirunelveli - Highway Entry", 
    status: "active", 
    vehicles: 4, 
    fps: 30, 
    resolution: "1920x1080",
    coordinates: { lat: 8.7139, lng: 77.7567 },
    direction: "North-South"
  }
];

export const processingSteps = [
  "Capturing Frame",
  "Preprocessing Image", 
  "Detecting Plate Region",
  "Character Segmentation",
  "OCR Recognition",
  "Database Validation",
  "Alerting System Check",
  "Validation Complete"
];

export const generateRealisticPlate = () => {
  const tnPlates = [
    "TN-01-AB-1234", "TN-09-CD-5678", "TN-33-EF-9012", 
    "TN-45-GH-3456", "TN-67-IJ-7890", "TN-72-KL-2468",
    "TN-38-MN-1357", "TN-55-PQ-8642", "TN-02-RS-9753"
  ];
  const otherStates = ["KA-09-UV-4567", "AP-16-WX-8901", "KL-07-YZ-2345"];
  
  const allPlates = [...tnPlates, ...otherStates];
  return allPlates[Math.floor(Math.random() * allPlates.length)];
};
