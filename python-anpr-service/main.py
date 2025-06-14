
import cv2
import numpy as np
import pytesseract
import requests
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
import base64
from io import BytesIO
from PIL import Image
import re
import logging

app = Flask(__name__)
CORS(app)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ANPRProcessor:
    def __init__(self):
        # Configure Tesseract path if needed (adjust for your system)
        # pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
        
        # Load cascade classifier for license plate detection
        self.plate_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_russian_plate_number.xml')
        
    def preprocess_image(self, image):
        """Apply image preprocessing for better OCR results"""
        # Convert to grayscale
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        
        # Apply noise reduction
        denoised = cv2.medianBlur(gray, 5)
        
        # Enhance contrast using CLAHE
        clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8,8))
        enhanced = clahe.apply(denoised)
        
        # Apply sharpening kernel
        kernel = np.array([[-1,-1,-1], [-1,9,-1], [-1,-1,-1]])
        sharpened = cv2.filter2D(enhanced, -1, kernel)
        
        return sharpened
    
    def detect_plates(self, image):
        """Detect license plate regions in the image"""
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        
        # Try multiple cascade classifiers and edge detection
        plates = []
        
        # Method 1: Haar Cascade
        detected_plates = self.plate_cascade.detectMultiScale(
            gray, scaleFactor=1.1, minNeighbors=5, minSize=(100, 30)
        )
        
        for (x, y, w, h) in detected_plates:
            plates.append((x, y, w, h))
        
        # Method 2: Edge detection and contour finding
        edges = cv2.Canny(gray, 100, 200)
        contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        
        for contour in contours:
            x, y, w, h = cv2.boundingRect(contour)
            aspect_ratio = w / h
            area = cv2.contourArea(contour)
            
            # Filter based on typical license plate dimensions
            if 2 < aspect_ratio < 6 and 1000 < area < 50000:
                plates.append((x, y, w, h))
        
        return plates
    
    def extract_text(self, plate_image):
        """Extract text from license plate using OCR"""
        # Preprocess the plate image
        processed = self.preprocess_image(plate_image)
        
        # Apply additional morphological operations
        kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (3, 3))
        processed = cv2.morphologyEx(processed, cv2.MORPH_CLOSE, kernel)
        
        # Use Tesseract with specific configuration for license plates
        custom_config = r'--oem 3 --psm 8 -c tessedit_char_whitelist=ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
        
        try:
            text = pytesseract.image_to_string(processed, config=custom_config)
            # Clean the extracted text
            text = re.sub(r'[^A-Z0-9]', '', text.upper())
            return text
        except Exception as e:
            logger.error(f"OCR extraction failed: {e}")
            return ""
    
    def validate_plate(self, text):
        """Validate if extracted text follows license plate patterns"""
        # Indian license plate patterns
        patterns = [
            r'^[A-Z]{2}[0-9]{2}[A-Z]{2}[0-9]{4}$',  # DL01AB1234
            r'^[A-Z]{2}[0-9]{2}[A-Z]{1}[0-9]{4}$',   # DL01A1234
            r'^[A-Z]{2}[0-9]{2}[0-9]{4}$',           # DL011234
        ]
        
        for pattern in patterns:
            if re.match(pattern, text):
                return True, self.format_plate(text)
        
        return False, text
    
    def format_plate(self, text):
        """Format license plate text for consistency"""
        if len(text) >= 10:
            # DL01AB1234 format
            return f"{text[:2]}-{text[2:4]}-{text[4:6]}-{text[6:]}"
        elif len(text) >= 9:
            # DL01A1234 format
            return f"{text[:2]}-{text[2:4]}-{text[4:5]}-{text[5:]}"
        elif len(text) >= 8:
            # DL011234 format
            return f"{text[:2]}-{text[2:4]}-{text[4:]}"
        return text
    
    def process_image(self, image_data):
        """Main processing pipeline"""
        try:
            # Decode base64 image
            image_bytes = base64.b64decode(image_data.split(',')[1])
            image = Image.open(BytesIO(image_bytes))
            image_cv = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)
            
            # Detect license plates
            plates = self.detect_plates(image_cv)
            
            results = []
            for i, (x, y, w, h) in enumerate(plates):
                # Extract plate region
                plate_roi = image_cv[y:y+h, x:x+w]
                
                # Extract text
                text = self.extract_text(plate_roi)
                
                if text:
                    is_valid, formatted_text = self.validate_plate(text)
                    confidence = len(text) * 10  # Simple confidence calculation
                    
                    results.append({
                        'plate_number': formatted_text,
                        'confidence': min(confidence, 100),
                        'is_valid': is_valid,
                        'bbox': {'x': int(x), 'y': int(y), 'width': int(w), 'height': int(h)},
                        'raw_text': text
                    })
            
            return {
                'success': True,
                'plates_detected': len(results),
                'results': results
            }
            
        except Exception as e:
            logger.error(f"Image processing failed: {e}")
            return {
                'success': False,
                'error': str(e),
                'plates_detected': 0,
                'results': []
            }

# Initialize ANPR processor
anpr_processor = ANPRProcessor()

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'service': 'ANPR Processor'})

@app.route('/process-image', methods=['POST'])
def process_image():
    """Process uploaded image for license plate recognition"""
    try:
        data = request.get_json()
        
        if 'image' not in data:
            return jsonify({'error': 'No image data provided'}), 400
        
        # Process the image
        result = anpr_processor.process_image(data['image'])
        
        # Log processing result
        logger.info(f"Processed image: {result['plates_detected']} plates detected")
        
        return jsonify(result)
    
    except Exception as e:
        logger.error(f"API error: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/batch-process', methods=['POST'])
def batch_process():
    """Process multiple images in batch"""
    try:
        data = request.get_json()
        images = data.get('images', [])
        
        results = []
        for i, image_data in enumerate(images):
            result = anpr_processor.process_image(image_data)
            result['image_index'] = i
            results.append(result)
        
        return jsonify({
            'success': True,
            'total_images': len(images),
            'results': results
        })
    
    except Exception as e:
        logger.error(f"Batch processing error: {e}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
