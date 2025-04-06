from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse
import uvicorn
from services.pdf_parser import PDFParser
from services.text_to_speech import TextToSpeech
import os
import json
import logging
import shutil
import uuid
import PyPDF2
import io
import ssl
from routes import speech_to_text

logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = FastAPI()

# Configure CORS
origins = [
    os.getenv("FRONTEND_URL", "https://localhost:3000"),
    "http://localhost:3000",
    "https://localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
pdf_parser = PDFParser()
tts = TextToSpeech()

# Create uploads directory if it doesn't exist
UPLOAD_DIR = "uploads"
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

# Include routers
app.include_router(speech_to_text.router)

# Get port from environment variable for production
port = int(os.getenv("PORT", 8000))
host = os.getenv("HOST", "0.0.0.0")

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
async def root():
    return {"message": "Welcome to the Readibly API"}

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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", 
                host=host,
                port=port,
                ssl_keyfile=None if os.getenv("ENVIRONMENT") == "production" else "localhost-key.pem",
                ssl_certfile=None if os.getenv("ENVIRONMENT") == "production" else "localhost.pem",
                reload=os.getenv("ENVIRONMENT") != "production") 