'use client';

import React, { useEffect, useState, useRef } from 'react';

interface EyeTrackerProps {
  onGazePoint?: (x: number, y: number) => void;
  onDoubleBlink?: () => void;
  isEnabled: boolean;
  onWordNavigation?: (direction: 'next' | 'prev') => void;
}

// Add WebGazer type to window
declare global {
  interface Window {
    webgazer: {
      setGazeListener: (callback: (data: GazeData) => void) => void;
      begin: () => void;
      end: () => void;
      setVideoElement: (element: HTMLVideoElement) => void;
      setDebugElement: (element: HTMLDivElement) => void;
      showCalibration: (show: boolean) => void;
      showVideo: (show: boolean) => void;
    };
  }
}

interface GazeData {
  x: number;
  y: number;
  blink?: boolean;
}

const EyeTrackerJS: React.FC<EyeTrackerProps> = ({ 
  onDoubleBlink, 
  isEnabled,
  onWordNavigation 
}) => {
  const [isCalibrated, setIsCalibrated] = useState(false);
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [showVideo, setShowVideo] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const debugRef = useRef<HTMLDivElement>(null);
  const webgazerRef = useRef<typeof window.webgazer | null>(null);
  const scriptLoadedRef = useRef<boolean>(false);
  const initAttemptsRef = useRef<number>(0);
  const lastBlinkTime = useRef<number>(0);
  const blinkCount = useRef<number>(0);
  const lastGazeX = useRef<number>(0);
  const gazeBuffer = useRef<number[]>([]);
  const GAZE_BUFFER_SIZE = 10;
  const HORIZONTAL_THRESHOLD = 50;

  // Handle eye tracking enable/disable
  useEffect(() => {
    if (isEnabled) {
      // When enabled, show video and initialize
      setShowVideo(true);
      if (webgazerRef.current) {
        webgazerRef.current.showVideo(true);
      }
    } else {
      // When disabled, hide video and cleanup
      setShowVideo(false);
      if (webgazerRef.current) {
        // Stop video stream
        if (videoRef.current) {
          const stream = videoRef.current.srcObject as MediaStream;
          if (stream) {
            stream.getTracks().forEach(track => track.stop());
            videoRef.current.srcObject = null;
          }
        }
        // Cleanup WebGazer
        webgazerRef.current.showVideo(false);
        webgazerRef.current.end();
        webgazerRef.current = null;
      }
      setIsCalibrated(false);
      setIsCalibrating(false);
      scriptLoadedRef.current = false;
    }
  }, [isEnabled]);

  // Initialize WebGazer.js
  useEffect(() => {
    if (isEnabled && !scriptLoadedRef.current) {
      console.log('Loading WebGazer.js...');
      
      // Check if script is already loaded
      if (document.querySelector('script[src="https://webgazer.cs.brown.edu/webgazer.js"]')) {
        console.log('WebGazer.js script already loaded');
        scriptLoadedRef.current = true;
        initWebGazer();
        return;
      }
      
      // Load WebGazer.js script
      const script = document.createElement('script');
      script.src = 'https://webgazer.cs.brown.edu/webgazer.js';
      script.async = true;
      script.onload = () => {
        console.log('WebGazer.js loaded');
        scriptLoadedRef.current = true;
        setTimeout(initWebGazer, 1000);
      };
      document.head.appendChild(script);
      
      return () => {
        if (webgazerRef.current) {
          // Stop video stream
          if (videoRef.current) {
            const stream = videoRef.current.srcObject as MediaStream;
            if (stream) {
              stream.getTracks().forEach(track => track.stop());
              videoRef.current.srcObject = null;
            }
          }
          webgazerRef.current.end();
          webgazerRef.current = null;
        }
      };
    }
  }, [isEnabled]);

  // Initialize WebGazer
  const initWebGazer = () => {
    if (typeof window !== 'undefined' && window.webgazer) {
      console.log('Initializing WebGazer...');
      webgazerRef.current = window.webgazer;
      
      const checkWebGazerReady = () => {
        if (webgazerRef.current && typeof webgazerRef.current.setGazeListener === 'function') {
          console.log('WebGazer is ready');
          
          // Set up WebGazer with word navigation
          webgazerRef.current.setGazeListener((data: GazeData) => {
            if (!data) return;
            
            // Add x position to buffer
            gazeBuffer.current.push(data.x);
            if (gazeBuffer.current.length > GAZE_BUFFER_SIZE) {
              gazeBuffer.current.shift();
            }

            // Calculate average x position
            const avgX = gazeBuffer.current.reduce((sum, x) => sum + x, 0) / gazeBuffer.current.length;
            
            // Check for significant horizontal movement
            const horizontalMovement = avgX - lastGazeX.current;
            
            if (Math.abs(horizontalMovement) > HORIZONTAL_THRESHOLD) {
              if (horizontalMovement > 0) {
                // Looking right - next word
                onWordNavigation?.('next');
              } else {
                // Looking left - previous word
                onWordNavigation?.('prev');
              }
              lastGazeX.current = avgX;
            }

            // Handle blinks for text-to-speech
            if (data.blink) {
              const currentTime = Date.now();
              if (currentTime - lastBlinkTime.current < 500) {
                blinkCount.current++;
                if (blinkCount.current === 2) {
                  onDoubleBlink?.();
                  blinkCount.current = 0;
                }
              }
              lastBlinkTime.current = currentTime;
            } else {
              blinkCount.current = 0;
            }
          });

          // Start tracking
          webgazerRef.current.begin();
          
          if (videoRef.current) {
            webgazerRef.current.setVideoElement(videoRef.current);
          }
          
          if (debugRef.current) {
            webgazerRef.current.setDebugElement(debugRef.current);
          }
          
          console.log('WebGazer initialized');
        } else {
          console.log('WebGazer not ready yet, retrying...');
          initAttemptsRef.current++;
          if (initAttemptsRef.current < 10) {
            setTimeout(checkWebGazerReady, 500);
          }
        }
      };
      
      checkWebGazerReady();
    }
  };

  // Start calibration
  const startCalibration = () => {
    if (!webgazerRef.current) return;
    
    setIsCalibrating(true);
    webgazerRef.current.showCalibration(true);
    
    setTimeout(() => {
      webgazerRef.current?.showCalibration(false);
      setIsCalibrated(true);
      setIsCalibrating(false);
    }, 15000);
  };

  // Toggle video visibility
  const toggleVideo = () => {
    const newShowVideo = !showVideo;
    setShowVideo(newShowVideo);
    if (webgazerRef.current) {
      webgazerRef.current.showVideo(newShowVideo);
    }
  };

  return (
    <>
      {/* Debug info */}
      {isEnabled && (
        <div 
          ref={debugRef}
          className="fixed top-4 left-4 z-50 bg-black bg-opacity-70 text-white p-2 rounded text-xs"
        />
      )}
      
      {/* Controls */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
        {isEnabled && (
          <>
            <button
              onClick={toggleVideo}
              className="px-4 py-2 bg-[#2e31ce] text-white rounded-lg hover:bg-violet-600"
            >
              {showVideo ? 'Hide Camera' : 'Show Camera'}
            </button>
            {!isCalibrated && (
              <button
                onClick={startCalibration}
                disabled={isCalibrating}
                className="px-4 py-2 bg-[#2e31ce] text-white rounded-lg hover:bg-violet-600 disabled:opacity-50"
              >
                {isCalibrating ? 'Calibrating...' : 'Calibrate Eye Tracker'}
              </button>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default EyeTrackerJS; 