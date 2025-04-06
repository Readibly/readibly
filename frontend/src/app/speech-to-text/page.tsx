'use client';

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Mic, Square, Download, Trash2, Volume2 } from "lucide-react";
import DashboardLayout from '@/components/DashboardLayout';
import { motion } from "framer-motion";

export default function SpeechToTextPage() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [hoveredWord, setHoveredWord] = useState<string | null>(null);
  const [lastClickTime, setLastClickTime] = useState(0);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    // Check if browser supports speech recognition
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError("Your browser doesn't support speech recognition");
    }

    // Initialize speech synthesis voices
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
    };

    // Load voices immediately if available
    loadVoices();

    // Load voices when they become available
    window.speechSynthesis.onvoiceschanged = loadVoices;

    // Clean up on unmount
    return () => {
      window.speechSynthesis.cancel();
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          channelCount: 1,
          sampleRate: 16000,
          sampleSize: 16,
        } 
      });
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        await sendAudioToServer(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      setError('Error accessing microphone. Please ensure you have granted microphone permissions.');
      console.error('Error starting recording:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const sendAudioToServer = async (audioBlob: Blob) => {
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');

      const response = await fetch('https://localhost:8000/speech-to-text', {
        method: 'POST',
        body: formData,
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.detail || `HTTP error! status: ${response.status}`;
        
        if (errorMessage.includes("FFmpeg is not installed")) {
          setError(
            "FFmpeg is not installed on the server. Please contact the administrator to install FFmpeg:\n" +
            "Windows: Download from https://ffmpeg.org/download.html\n" +
            "Linux: sudo apt-get install ffmpeg\n" +
            "macOS: brew install ffmpeg"
          );
        } else {
          setError(errorMessage);
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      setTranscript(data.text);
    } catch (err) {
      console.error('Error sending audio to server:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to process audio. Please try again.';
      if (!errorMessage.includes("FFmpeg is not installed")) {
        setError(errorMessage);
      }
    }
  };

  const downloadTranscript = () => {
    const blob = new Blob([transcript], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transcript.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const clearTranscript = () => {
    setTranscript("");
    setError("");
  };

  const speakText = async (text: string) => {
    try {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.8; // Slightly slower rate for clarity
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      // Select English voice
      const englishVoice = voices.find(voice => 
        voice.lang.includes('en') && voice.name.includes('Google')
      ) || voices.find(voice => voice.lang.includes('en')) || voices[0];
      
      if (englishVoice) {
        utterance.voice = englishVoice;
      }

      utterance.onstart = () => {
        setIsSpeaking(true);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
      };

      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        setError('Failed to play audio. Please try again.');
      };

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.error('Error in text-to-speech:', err);
      setError('Failed to convert text to speech. Please try again.');
    }
  };

  const handleWordClick = (word: string) => {
    const currentTime = new Date().getTime();
    if (currentTime - lastClickTime < 300) { // Double click within 300ms
      speakText(word);
    }
    setLastClickTime(currentTime);
  };

  const renderTranscript = () => {
    if (!transcript) return null;

    return transcript.split(' ').map((word, index) => (
      <span
        key={index}
        className={`inline-block cursor-pointer rounded px-1 transition-all duration-200 select-none
          ${hoveredWord === word 
            ? 'bg-violet-100 text-[#2a2de0] scale-110 shadow-md' 
            : 'hover:bg-gray-100'
          }`}
        onMouseEnter={() => setHoveredWord(word)}
        onMouseLeave={() => setHoveredWord(null)}
        onClick={() => handleWordClick(word)}
        style={{ 
          fontFamily: 'OpenDyslexic, sans-serif',
          transition: 'all 0.2s ease-in-out'
        }}
      >
        {word}{' '}
      </span>
    ));
  };

  return (
    <DashboardLayout>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Speech to Text</h1>
            <p className="text-gray-600 mt-2">Convert your speech into text with high accuracy</p>
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
        >
          <div className="flex justify-center mb-6">
            <Button
              onClick={isRecording ? stopRecording : startRecording}
              className={`flex items-center space-x-2 ${
                isRecording 
                  ? 'bg-red-500 hover:bg-red-600 text-white' 
                  : 'bg-purple-50 text-[#2e31ce] rounded-lg cursor-pointer hover:bg-purple-100 transition-colors'
              }`}
            >
              {isRecording ? (
                <>
                  <Square className="w-4 h-4" />
                  <span>Stop Recording</span>
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4" />
                  <span>Start Recording</span>
                </>
              )}
            </Button>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6"
            >
              <p className="font-medium text-sm">{error}</p>
            </motion.div>
          )}

          {transcript ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Transcript</h2>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => speakText(transcript)}
                    className="bg-[#2e31ce] hover:bg-[#373ad3] text-white"
                  >
                    <Volume2 className="w-4 h-4 mr-2" />
                    Speak All
                  </Button>
                  <Button
                    onClick={downloadTranscript}
                    className="bg-[#2e31ce] hover:bg-[#373ad3] text-white"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                  <Button
                    onClick={clearTranscript}
                    className="bg-[#2e31ce] hover:bg-[#373ad3] text-white"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear
                  </Button>
                </div>
              </div>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="p-6 bg-gray-50 rounded-lg font-['OpenDyslexic']"
              >
                <div className="text-gray-800 leading-relaxed">
                  {renderTranscript()}
                </div>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col items-center justify-center py-16 text-center"
            >
              <div className="bg-purple-50 p-4 rounded-full mb-4">
                <Mic className="h-8 w-8 text-[#2e31ce]" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No recording yet</h3>
              <p className="text-gray-600 max-w-md">
                Click the &quot;Start Recording&quot; button to begin converting your speech to text.
              </p>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
} 