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

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://localhost:3000"],  # Frontend URLs
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

@app.websocket("/ws/eye-tracking")
async def websocket_endpoint(websocket: WebSocket):
    try:
        await websocket.accept()
        active_connections.append(websocket)
        logger.info("New WebSocket connection established")
        
        while True:
            try:
                data = await websocket.receive_text()
                logger.info(f"Raw WebSocket message received: {data}")
                
                # Try to parse as JSON, if fails treat as string
                try:
                    message = json.loads(data)
                except json.JSONDecodeError:
                    message = data
                
                logger.info(f"Processed WebSocket message: {message}")
                
                if message == "start":
                    try:
                        eye_tracker.start_tracking()
                        logger.info("Eye tracking started")
                        await websocket.send_json({
                            "status": "started",
                            "message": "Eye tracking started successfully"
                        })
                    except Exception as e:
                        logger.error(f"Error starting eye tracking: {str(e)}")
                        await websocket.send_json({
                            "status": "error",
                            "message": f"Failed to start eye tracking: {str(e)}"
                        })
                elif message == "stop":
                    try:
                        eye_tracker.stop_tracking()
                        logger.info("Eye tracking stopped")
                        await websocket.send_json({
                            "status": "stopped",
                            "message": "Eye tracking stopped successfully"
                        })
                    except Exception as e:
                        logger.error(f"Error stopping eye tracking: {str(e)}")
                        await websocket.send_json({
                            "status": "error",
                            "message": f"Failed to stop eye tracking: {str(e)}"
                        })
                elif isinstance(message, dict) and message.get("type") == "gaze":
                    try:
                        x = message.get("x", 0)
                        y = message.get("y", 0)
                        current_word = eye_tracker.update_gaze_position(x, y)
                        if current_word:
                            await websocket.send_json({
                                "word": current_word
                            })
                    except Exception as e:
                        logger.error(f"Error processing gaze data: {str(e)}")
                else:
                    logger.warning(f"Unknown WebSocket message: {message}")
                    await websocket.send_json({
                        "status": "error",
                        "message": "Unknown message received"
                    })
                    
            except WebSocketDisconnect:
                logger.info("WebSocket connection closed")
                break
            except Exception as e:
                logger.error(f"Error processing WebSocket message: {str(e)}")
                await websocket.send_json({
                    "status": "error",
                    "message": str(e)
                })
                
    except Exception as e:
        logger.error(f"WebSocket connection error: {str(e)}")
    finally:
        if websocket in active_connections:
            active_connections.remove(websocket)
            logger.info("WebSocket connection removed from active connections")

@app.post("/api/upload-pdf")
async def upload_pdf(file: UploadFile = File(...)):
    try:
        logger.info(f"Received PDF upload request for file: {file.filename}")
        
        # Create temp directory if it doesn't exist
        temp_dir = "temp"
        os.makedirs(temp_dir, exist_ok=True)
        
        # Save the uploaded file temporarily
        file_path = os.path.join(temp_dir, file.filename)
        logger.info(f"Saving file to: {file_path}")
        
        with open(file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
            logger.info(f"File saved successfully, size: {len(content)} bytes")
        
        # Parse PDF
        logger.info("Starting PDF parsing")
        text_content = pdf_parser.parse_pdf(file_path)
        logger.info(f"PDF parsed successfully: {text_content}")
        
        # Clean up temporary file
        os.remove(file_path)
        logger.info("Temporary file removed")
        
        return JSONResponse({
            "status": "success",
            "content": text_content
        })
    except Exception as e:
        logger.error(f"Error processing PDF: {str(e)}")
        if os.path.exists(file_path):
            os.remove(file_path)
            logger.info("Cleaned up temporary file after error")
        return JSONResponse(
            status_code=500,
            content={"detail": str(e)}
        )

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
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True) 