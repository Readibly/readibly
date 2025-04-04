from fastapi import FastAPI, UploadFile, File, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse
import uvicorn
from services.pdf_parser import PDFParser
from services.eye_tracker import EyeTracker
from services.text_to_speech import TextToSpeech
import os
import json
import logging
import asyncio
import shutil
import uuid
import PyPDF2
import io
import ssl
import base64
import cv2
import numpy as np

logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = FastAPI()

# Update CORS configuration untuk HTTPS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://localhost:3000"],  # Sesuaikan dengan URL frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
pdf_parser = PDFParser()
eye_tracker = EyeTracker()
tts = TextToSpeech()

# Store active WebSocket connections
active_connections = []

# Create uploads directory if it doesn't exist
UPLOAD_DIR = "uploads"
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

@app.on_event("startup")
async def startup_event():
    global eye_tracker
    eye_tracker = EyeTracker()

@app.on_event("shutdown")
async def shutdown_event():
    global eye_tracker
    if eye_tracker:
        eye_tracker.release()

@app.websocket("/ws/eye-tracking")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    
    try:
        while True:
            # Read frame from webcam
            ret, frame = eye_tracker.cap.read()
            if not ret:
                continue
            
            # Get gaze point and blink status
            x, y, is_double_blink = eye_tracker.get_gaze_point(frame)
            
            # Send data to client
            await websocket.send_json({
                "x": x,
                "y": y,
                "isDoubleBlink": is_double_blink
            })
            
            # Small delay to prevent overwhelming the connection
            await asyncio.sleep(0.033)  # ~30 FPS
            
    except Exception as e:
        print(f"WebSocket error: {e}")
    finally:
        await websocket.close()

@app.post("/calibrate")
async def calibrate(points: list):
    global eye_tracker
    if not eye_tracker:
        return {"success": False, "error": "Eye tracker not initialized"}
    
    success = eye_tracker.calibrate(points)
    return {"success": success}

@app.post("/upload-pdf")
async def upload_pdf(file: UploadFile = File(...)):
    logger.info(f"Received file upload request: {file.filename}")
    
    try:
        # Validate file type
        if not file.filename.endswith('.pdf'):
            logger.warning(f"Invalid file type received: {file.filename}")
            raise HTTPException(status_code=400, detail="File must be a PDF")
        
        # Read file content
        content = await file.read()
        logger.info(f"Successfully read file, size: {len(content)} bytes")
        
        # Process PDF
        pdf_file = io.BytesIO(content)
        try:
            pdf_reader = PyPDF2.PdfReader(pdf_file)
            logger.info(f"Successfully created PDF reader object with {len(pdf_reader.pages)} pages")
        except Exception as e:
            logger.error(f"Failed to create PDF reader: {str(e)}")
            raise HTTPException(status_code=400, detail="Invalid PDF file")
        
        text_content = ""
        
        # Extract text from all pages
        for page_num in range(len(pdf_reader.pages)):
            try:
                page = pdf_reader.pages[page_num]
                text_content += page.extract_text() + "\n"
                logger.info(f"Successfully extracted text from page {page_num + 1}")
            except Exception as e:
                logger.error(f"Error extracting text from page {page_num + 1}: {str(e)}")
                continue
        
        # Prepare response
        response_data = {
            "status": "success",
            "text": text_content,
            "words": text_content.split(),
            "pageCount": len(pdf_reader.pages)
        }
        
        logger.info("Successfully processed PDF")
        return JSONResponse(content=response_data)
        
    except Exception as e:
        logger.error(f"Error processing upload: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.get("/pdf/{filename}")
async def get_pdf(filename: str):
    file_path = os.path.join(UPLOAD_DIR, filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(file_path, media_type="application/pdf")

@app.get("/")
async def read_root():
    return {"message": "Welcome to Readibly API"}

@app.post("/api/start-eye-tracking")
async def start_eye_tracking():
    try:
        eye_tracker.start_tracking()
        return JSONResponse({"status": "success"})
    except Exception as e:
        logger.error(f"Error starting eye tracking: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/stop-eye-tracking")
async def stop_eye_tracking():
    try:
        eye_tracker.stop_tracking()
        return JSONResponse({"status": "success"})
    except Exception as e:
        logger.error(f"Error stopping eye tracking: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/text-to-speech")
async def text_to_speech(text: str):
    try:
        audio_path = tts.convert_to_speech(text)
        return JSONResponse({
            "status": "success",
            "audio_path": audio_path
        })
    except Exception as e:
        logger.error(f"Error converting text to speech: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/set-text-data")
async def set_text_data(data: dict):
    try:
        eye_tracker.set_text_data(data["text"], data["positions"])
        return JSONResponse({"status": "success"})
    except Exception as e:
        logger.error(f"Error setting text data: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    # Konfigurasi SSL context
    ssl_context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
    try:
        # Generate self-signed certificate jika belum ada
        from OpenSSL import crypto
        from datetime import datetime, timedelta

        # Generate key
        key = crypto.PKey()
        key.generate_key(crypto.TYPE_RSA, 2048)

        # Generate certificate
        cert = crypto.X509()
        cert.get_subject().CN = "localhost"
        cert.set_serial_number(1000)
        cert.gmtime_adj_notBefore(0)
        cert.gmtime_adj_notAfter(365*24*60*60)  # Valid for one year
        cert.set_issuer(cert.get_subject())
        cert.set_pubkey(key)
        cert.sign(key, 'sha256')

        # Write certificate and private key to files
        with open("server.crt", "wb") as f:
            f.write(crypto.dump_certificate(crypto.FILETYPE_PEM, cert))
        with open("server.key", "wb") as f:
            f.write(crypto.dump_privatekey(crypto.FILETYPE_PEM, key))

        # Load certificate and key
        ssl_context.load_cert_chain("server.crt", "server.key")
        
        logger.info("SSL certificate generated and loaded successfully")
    except Exception as e:
        logger.error(f"Failed to setup SSL: {str(e)}")
        raise

    # Jalankan server dengan SSL
    uvicorn.run(
        "main:app", 
        host="0.0.0.0", 
        port=8000, 
        ssl_keyfile="server.key",
        ssl_certfile="server.crt",
        reload=True,
        log_level="debug"
    ) 