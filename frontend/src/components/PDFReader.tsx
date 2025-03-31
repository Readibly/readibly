import React, { useState, useEffect, useRef } from 'react';
import { api, PDFContent } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import Script from 'next/script';

interface PDFReaderProps {
  file: File;
}

declare global {
  interface Window {
    webgazer: any;
  }
}

function PDFReader({ file }: PDFReaderProps) {
  const [pdfContent, setPdfContent] = useState<PDFContent | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isEyeTracking, setIsEyeTracking] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [highlightedWord, setHighlightedWord] = useState<string | null>(null);
  const [gazePoint, setGazePoint] = useState<{ x: number; y: number } | null>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const gazePointRef = useRef<HTMLDivElement>(null);
  const [webcamError, setWebcamError] = useState<string | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [calibrationPoints, setCalibrationPoints] = useState<{ x: number; y: number }[]>([]);
  const calibrationRef = useRef<HTMLDivElement>(null);
  const [showWebcamPreview, setShowWebcamPreview] = useState(false);
  const [isFaceDetected, setIsFaceDetected] = useState(false);
  const webcamPreviewRef = useRef<HTMLVideoElement>(null);
  const [hoveredWord, setHoveredWord] = useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  useEffect(() => {
    loadPDF();
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (window.webgazer) {
        window.webgazer.end();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [file]);

  useEffect(() => {
    if (window.webgazer && isEyeTracking) {
      // Configure WebGazer with better settings
      window.webgazer
        .setRegression('ridge')
        .setTracker('TFFacemesh')
        .setGazeListener((data: any) => {
          if (data) {
            const smoothedX = data.x * window.innerWidth;
            const smoothedY = data.y * window.innerHeight;
            setGazePoint({ x: smoothedX, y: smoothedY });
            
            if (wsRef.current?.readyState === WebSocket.OPEN) {
              try {
                const message = JSON.stringify({
                  type: 'gaze',
                  x: data.x,
                  y: data.y
                });
                wsRef.current.send(message);
              } catch (error) {
                console.error('Error sending gaze data:', error);
                handleWebSocketError();
              }
            }
          }
        })
        .begin()
        .then(() => {
          console.log('WebGazer initialized successfully');
          setWebcamError(null);
          setShowWebcamPreview(true);
          startCalibration();
        })
        .catch((error: Error) => {
          console.error('WebGazer initialization error:', error);
          setWebcamError('Failed to access webcam. Please make sure your webcam is connected and you have granted permission.');
          setIsEyeTracking(false);
        });

      // Add face detection listener with better error handling
      window.webgazer.setFaceListener((face: any) => {
        console.log('Face detection status:', !!face);
        if (face) {
          console.log('Face detected with landmarks:', face);
        }
        setIsFaceDetected(!!face);
      });

      // Add additional face detection settings
      window.webgazer.setFaceDetectionMode('fast');
      window.webgazer.setFaceDetectionSensitivity(0.5);
    }
  }, [isEyeTracking]);

  const handleWebSocketError = () => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    
    // Attempt to reconnect after 3 seconds
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    reconnectTimeoutRef.current = setTimeout(() => {
      if (isEyeTracking) {
        setupWebSocket();
      }
    }, 3000);
  };

  const setupWebSocket = () => {
    try {
      if (wsRef.current) {
        wsRef.current.close();
      }

      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const ws = new WebSocket(`${protocol}//${window.location.hostname}:8000/ws/eye-tracking`);
      
      ws.onopen = () => {
        console.log('WebSocket connection established');
        setError(null);
        if (isEyeTracking) {
          ws.send('start');
        }
      };
      
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('Received WebSocket message:', data);
          
          if (data.status === 'started') {
            setIsEyeTracking(true);
          } else if (data.status === 'stopped') {
            setIsEyeTracking(false);
          } else if (data.word) {
            setHighlightedWord(data.word);
          } else if (data.error) {
            console.error('WebSocket error:', data.error);
            setError(data.error);
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setError('Failed to connect to eye tracking service. Attempting to reconnect...');
        handleWebSocketError();
      };

      ws.onclose = () => {
        console.log('WebSocket connection closed');
        handleWebSocketError();
      };

      wsRef.current = ws;
    } catch (error) {
      console.error('Error setting up WebSocket:', error);
      setError('Failed to initialize eye tracking service');
      handleWebSocketError();
    }
  };

  const startCalibration = () => {
    setIsCalibrating(true);
    const points = [
      { x: 0.1, y: 0.1 }, // Top left
      { x: 0.5, y: 0.1 }, // Top center
      { x: 0.9, y: 0.1 }, // Top right
      { x: 0.1, y: 0.5 }, // Middle left
      { x: 0.5, y: 0.5 }, // Center
      { x: 0.9, y: 0.5 }, // Middle right
      { x: 0.1, y: 0.9 }, // Bottom left
      { x: 0.5, y: 0.9 }, // Bottom center
      { x: 0.9, y: 0.9 }, // Bottom right
    ];
    setCalibrationPoints(points);
    window.webgazer.showVideoPreview(true);
  };

  const handleCalibrationPoint = (point: { x: number; y: number }) => {
    window.webgazer.addCalibrationPoint(point.x, point.y);
    setCalibrationPoints(prev => prev.filter(p => p !== point));
    
    if (calibrationPoints.length === 1) {
      // Last point calibrated
      window.webgazer.showVideoPreview(false);
      setIsCalibrating(false);
      window.webgazer.begin();
    }
  };

  const handleEyeTracking = async () => {
    try {
      if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
        setupWebSocket();
      }

      if (isEyeTracking) {
        window.webgazer?.end();
        wsRef.current?.send('stop');
        setShowWebcamPreview(false);
      } else {
        try {
          // Request webcam access with specific constraints
          const stream = await navigator.mediaDevices.getUserMedia({
            video: {
              width: { ideal: 1280 },
              height: { ideal: 720 },
              facingMode: "user"
            }
          });
          
          // Show webcam preview immediately
          setShowWebcamPreview(true);
          
          // Set up webcam preview first
          if (webcamPreviewRef.current) {
            webcamPreviewRef.current.srcObject = stream;
            await webcamPreviewRef.current.play();
          }
          
          // Create a video element for WebGazer
          const videoElement = document.createElement('video');
          videoElement.srcObject = stream;
          videoElement.width = 640;
          videoElement.height = 480;
          videoElement.autoplay = true;
          videoElement.playsInline = true;
          videoElement.muted = true;
          
          // Initialize WebGazer with the video element
          window.webgazer?.setVideoElement(videoElement);
          window.webgazer?.begin();
          wsRef.current?.send('start');
        } catch (error) {
          console.error('Webcam access error:', error);
          setWebcamError('Failed to access webcam. Please make sure your webcam is connected and you have granted permission.');
        }
      }
      setError(null);
    } catch (error) {
      console.error('Error toggling eye tracking:', error);
      setError('Failed to toggle eye tracking');
    }
  };

  const loadPDF = async () => {
    try {
      console.log('Starting to load PDF:', file.name);
      const content = await api.uploadPDF(file);
      console.log('PDF content received:', content);
      
      if (!content || !content.content || Object.keys(content.content).length === 0) {
        throw new Error('No content found in PDF');
      }
      
      setPdfContent(content);
      setError(null);
    } catch (error) {
      console.error('Error loading PDF:', error);
      setError(error instanceof Error ? error.message : 'Failed to load PDF file');
    }
  };

  const handleTextToSpeech = async () => {
    if (!pdfContent?.content?.[currentPage]) return;

    try {
      const audioPath = await api.convertToSpeech(pdfContent.content[currentPage]);
      if (audioRef.current) {
        audioRef.current.src = audioPath;
        audioRef.current.play();
        setIsPlaying(true);
      }
      setError(null);
    } catch (error) {
      setError('Failed to convert text to speech');
    }
  };

  const getWordPositions = () => {
    if (!textRef.current || !pdfContent?.content?.[currentPage]) return null;

    const text = pdfContent.content[currentPage];
    const words = text.split(/\s+/);
    const positions: { word: string; position: { x: number; y: number } }[] = [];

    const textElement = textRef.current;
    const rect = textElement.getBoundingClientRect();
    const lines = textElement.innerText.split('\n');
    let currentY = 0;

    lines.forEach((line, lineIndex) => {
      const lineWords = line.split(/\s+/);
      let currentX = 0;

      lineWords.forEach((word) => {
        const wordWidth = word.length * 8; // Approximate width based on character count
        positions.push({
          word,
          position: {
            x: currentX / rect.width,
            y: currentY / rect.height
          }
        });
        currentX += wordWidth + 8; // Add space between words
      });

      currentY += 24; // Approximate line height
    });

    return positions;
  };

  useEffect(() => {
    if (pdfContent?.content?.[currentPage] && textRef.current) {
      const positions = getWordPositions();
      if (positions) {
        api.setTextData({
          text: positions.map(p => p.word),
          positions: positions.map(p => p.position)
        });
      }
    }
  }, [pdfContent, currentPage]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert('Please upload a PDF file');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:8000/upload-pdf', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      setPdfUrl(`http://localhost:8000/pdf/${data.filename}`);
      setShowWebcamPreview(true);
      handleEyeTracking();
    } catch (error) {
      console.error('Error uploading PDF:', error);
      alert('Failed to upload PDF. Please try again.');
    }
  };

  if (!pdfContent) {
    return <div>Loading PDF...</div>;
  }

  const currentPageContent = pdfContent.content[currentPage];
  if (!currentPageContent) {
    return <div>No content available for this page.</div>;
  }

  return (
    <div className="container mx-auto p-4 relative min-h-screen pb-24">
      <Script 
        src="https://webgazer.cs.brown.edu/webgazer.js" 
        strategy="beforeInteractive"
        onError={(e) => {
          console.error('Failed to load WebGazer.js:', e);
          setError('Failed to load eye tracking library');
        }}
      />
      
      <Card className="p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-4">
            <Button
              onClick={handleEyeTracking}
              variant={isEyeTracking ? 'destructive' : 'default'}
            >
              {isEyeTracking ? 'Stop Eye Tracking' : 'Start Eye Tracking'}
            </Button>
            <Button onClick={handleTextToSpeech}>
              {isPlaying ? 'Stop Reading' : 'Read Aloud'}
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <span>Page {currentPage} of {pdfContent.total_pages}</span>
            <Slider
              value={[currentPage]}
              min={1}
              max={pdfContent.total_pages}
              step={1}
              onValueChange={(value) => setCurrentPage(value[0])}
              className="w-[200px]"
            />
          </div>
        </div>

        {error && (
          <p className="text-red-500 mb-4">{error}</p>
        )}

        <div
          ref={textRef}
          className="prose max-w-none relative"
          style={{
            fontFamily: 'OpenDyslexic, sans-serif',
            fontSize: '1.2rem',
            lineHeight: '1.8',
          }}
        >
          {currentPageContent.split(/\s+/).map((word, index) => (
            <span
              key={index}
              className={`inline-block transition-colors duration-200 ${
                highlightedWord === word 
                  ? 'bg-yellow-200 text-black font-semibold shadow-sm' 
                  : 'hover:bg-gray-100'
              }`}
              onMouseEnter={() => setHoveredWord(word)}
              onMouseLeave={() => setHoveredWord(null)}
            >
              {word}{' '}
            </span>
          ))}
        </div>

        {/* Webcam Preview */}
        {showWebcamPreview && (
          <div className="fixed bottom-24 right-4 z-50 bg-white rounded-lg shadow-lg p-2">
            <div className="relative">
              <video
                ref={webcamPreviewRef}
                autoPlay
                playsInline
                muted
                className="w-48 h-36 object-cover rounded-lg"
                style={{ 
                  transform: 'scaleX(-1)', // Mirror the video
                  backgroundColor: '#000' // Add black background
                }}
              />
              <div className={`absolute top-2 right-2 w-3 h-3 rounded-full ${
                isFaceDetected ? 'bg-green-500 animate-pulse' : 'bg-red-500'
              }`} />
              <div className="absolute bottom-2 left-2 text-xs text-white bg-black bg-opacity-50 px-2 py-1 rounded">
                {isFaceDetected ? 'Face Detected' : 'No Face Detected'}
              </div>
              <div className="absolute top-2 left-2 text-xs text-white bg-black bg-opacity-50 px-2 py-1 rounded">
                Preview
              </div>
            </div>
          </div>
        )}

        {/* Calibration Overlay */}
        {isCalibrating && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg max-w-md w-full">
              <h3 className="text-lg font-semibold mb-4">Calibrate Eye Tracking</h3>
              <p className="text-sm text-gray-600 mb-4">
                {isFaceDetected 
                  ? 'Face detected! Look at each point as it appears.'
                  : 'Please position your face in the webcam preview before continuing.'}
              </p>
              <div className="grid grid-cols-3 gap-4">
                {calibrationPoints.map((point, index) => (
                  <button
                    key={index}
                    className={`w-12 h-12 rounded-full text-white transition-colors ${
                      isFaceDetected ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-400 cursor-not-allowed'
                    }`}
                    onClick={() => isFaceDetected && handleCalibrationPoint(point)}
                    disabled={!isFaceDetected}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Gaze Point Overlay */}
        {gazePoint && (
          <div
            ref={gazePointRef}
            className="fixed w-6 h-6 bg-red-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-50"
            style={{
              left: `${gazePoint.x}px`,
              top: `${gazePoint.y}px`,
              transition: 'all 0.1s ease-out',
              opacity: 0.8,
              boxShadow: '0 0 10px rgba(239, 68, 68, 0.5)',
            }}
          >
            <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-75"></div>
          </div>
        )}

        <audio
          ref={audioRef}
          onEnded={() => setIsPlaying(false)}
          onPause={() => setIsPlaying(false)}
        />
      </Card>

      {/* Fixed Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${
                  isEyeTracking ? 'bg-green-500 animate-pulse' : 'bg-red-500'
                }`}></div>
                <span className="text-sm text-gray-600">
                  {isEyeTracking ? 'Eye Tracking Active' : 'Eye Tracking Inactive'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${
                  isFaceDetected ? 'bg-green-500 animate-pulse' : 'bg-red-500'
                }`}></div>
                <span className="text-sm text-gray-600">
                  {isFaceDetected ? 'Face Detected' : 'No Face Detected'}
                </span>
              </div>
              {webcamError && (
                <div className="text-sm text-red-500">
                  {webcamError}
                </div>
              )}
              {hoveredWord && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Hovered Word:</span>
                  <span className="text-lg font-semibold text-purple-600 bg-purple-50 px-3 py-1 rounded-full" style={{ fontFamily: 'OpenDyslexic, sans-serif' }}>
                    {hoveredWord}
                  </span>
                </div>
              )}
              {highlightedWord && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Current Word:</span>
                  <span className="text-lg font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full" style={{ fontFamily: 'OpenDyslexic, sans-serif' }}>
                    {highlightedWord}
                  </span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600" style={{ fontFamily: 'OpenDyslexic, sans-serif' }}>
                Page {currentPage} of {pdfContent.total_pages}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PDFReader; 