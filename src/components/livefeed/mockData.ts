
import { LiveFeedCamera } from "@/types/camera";

export const mockCameras: LiveFeedCamera[] = [
  {
    id: "CAM-01",
    location: "Main Entrance - GST Road",
    status: "active",
    vehicles: 12,
    fps: 30,
    resolution: "1920x1080",
    coordinates: { lat: 13.0827, lng: 80.2707 },
    direction: "North-South"
  },
  {
    id: "CAM-02",
    location: "Parking Lot A - Anna Salai",
    status: "active",
    vehicles: 8,
    fps: 25,
    resolution: "1280x720",
    coordinates: { lat: 13.0878, lng: 80.2785 },
    direction: "East-West"
  },
  {
    id: "CAM-03",
    location: "Highway Junction - ECR",
    status: "maintenance",
    vehicles: 0,
    fps: 0,
    resolution: "1920x1080",
    coordinates: { lat: 13.0658, lng: 80.2841 },
    direction: "Bidirectional"
  },
  {
    id: "CAM-04",
    location: "Toll Plaza - OMR",
    status: "active",
    vehicles: 15,
    fps: 30,
    resolution: "1920x1080",
    coordinates: { lat: 13.0544, lng: 80.2454 },
    direction: "Multi-directional"
  },
  {
    id: "CAM-05",
    location: "Airport Road - Inner Ring",
    status: "active",
    vehicles: 9,
    fps: 30,
    resolution: "1280x720",
    coordinates: { lat: 13.0067, lng: 80.2206 },
    direction: "North-South"
  },
  {
    id: "CAM-06",
    location: "IT Corridor - Rajiv Gandhi Salai",
    status: "inactive",
    vehicles: 0,
    fps: 0,
    resolution: "1920x1080",
    coordinates: { lat: 12.9716, lng: 80.2431 },
    direction: "East-West"
  },
  {
    id: "CAM-07",
    location: "Loading Dock - Porur Bypass",
    status: "active",
    vehicles: 6,
    fps: 25,
    resolution: "1280x720",
    coordinates: { lat: 13.0389, lng: 80.1565 },
    direction: "Bidirectional"
  },
  {
    id: "CAM-08",
    location: "Service Road - Mount Road",
    status: "active",
    vehicles: 11,
    fps: 30,
    resolution: "1920x1080",
    coordinates: { lat: 13.0732, lng: 80.2609 },
    direction: "Multi-directional"
  }
];

export const processingSteps = [
  "Initialization",
  "Image Capture",
  "Preprocessing",
  "Region Detection",
  "Character Recognition",
  "Validation",
  "Database Storage",
  "Alert Processing"
];
