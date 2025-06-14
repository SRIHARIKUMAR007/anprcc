
# ANPR Python Service

This is a Python-based Automatic Number Plate Recognition (ANPR) service that processes images to detect and extract license plate information.

## Features

- Image preprocessing (noise reduction, contrast enhancement, sharpening)
- License plate detection using Haar Cascades and edge detection
- OCR text extraction using Tesseract
- Plate validation and formatting
- Batch processing support
- RESTful API interface

## Setup

1. Install Python dependencies:
```bash
pip install -r requirements.txt
```

2. Install Tesseract OCR:
- **Ubuntu/Debian**: `sudo apt-get install tesseract-ocr`
- **macOS**: `brew install tesseract`
- **Windows**: Download from [GitHub releases](https://github.com/UB-Mannheim/tesseract/wiki)

3. Run the service:
```bash
python main.py
```

The service will start on `http://localhost:5000`

## API Endpoints

### POST /process-image
Process a single image for license plate recognition.

**Request:**
```json
{
  "image": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ..."
}
```

**Response:**
```json
{
  "success": true,
  "plates_detected": 1,
  "results": [
    {
      "plate_number": "DL-01-AB-1234",
      "confidence": 95,
      "is_valid": true,
      "bbox": {"x": 100, "y": 50, "width": 200, "height": 60},
      "raw_text": "DL01AB1234"
    }
  ]
}
```

### POST /batch-process
Process multiple images in batch.

### GET /health
Health check endpoint.

## Integration with Frontend

The frontend can send images to this service for processing and receive plate recognition results.
