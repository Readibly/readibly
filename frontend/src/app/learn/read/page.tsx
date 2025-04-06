'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Volume2, ChevronLeft, ChevronRight, Play, Pause, Settings, X, Minus, Plus } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';

interface Template {
  id: number;
  title: string;
  category: string;
  content: string;
}

const templates: Template[] = [
  {
    id: 1,
    title: "The Little Red Riding Hood",
    category: "fairytale",
    content: "Once upon a time, there was a little girl who lived in a village near the forest. She was known to everyone as Little Red Riding Hood because of the red cloak she always wore. One day, her mother asked her to take some food to her grandmother who was sick and lived in a house in the forest. Little Red Riding Hood was happy to help and set off on her journey."
  },
  {
    id: 2,
    title: "The Three Little Pigs",
    category: "fairytale",
    content: "There were three little pigs who lived with their mother. One day, their mother told them they were old enough to go out into the world and make their own way. The first pig built his house out of straw, the second pig built his house out of sticks, and the third pig built his house out of bricks."
  },
  {
    id: 3,
    title: "Solar System Facts",
    category: "facts",
    content: "The solar system consists of the Sun and the objects that orbit around it. The Sun is a star at the center of our solar system. There are eight planets in our solar system: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune. Earth is the only planet known to support life."
  },
  {
    id: 4,
    title: "Ocean Life",
    category: "facts",
    content: "The ocean covers more than 70 percent of Earth's surface. It is home to countless species of plants and animals. The blue whale is the largest animal on Earth, growing up to 100 feet long. Coral reefs are some of the most diverse ecosystems on the planet."
  },
  {
    id: 5,
    title: "Space Exploration",
    category: "facts",
    content: "Humans first landed on the Moon in 1969. The International Space Station has been continuously occupied for over 20 years. Mars is the most explored planet in our solar system. Space probes have visited all the planets in our solar system."
  }
];

export default function ReadLearnPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const templateId = searchParams.get('template');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [wordByWordMode, setWordByWordMode] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [autoPlayInterval, setAutoPlayInterval] = useState<NodeJS.Timeout | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [fontSize, setFontSize] = useState(18);
  const [letterSpacing, setLetterSpacing] = useState(0.1);
  const [fontSizeInput, setFontSizeInput] = useState('18');
  const [letterSpacingInput, setLetterSpacingInput] = useState('0.1');
  const [clickedWords, setClickedWords] = useState<Set<string>>(new Set());

  const words = selectedTemplate ? selectedTemplate.content.split(' ') : [];

  useEffect(() => {
    if (templateId) {
      const template = templates.find(t => t.id === parseInt(templateId));
      if (template) {
        setSelectedTemplate(template);
      } else {
        router.push('/learn/templates');
      }
    } else {
      router.push('/learn/templates');
    }
  }, [templateId, router]);

  useEffect(() => {
    return () => {
      if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
      }
    };
  }, [autoPlayInterval]);

  const speakText = async (text: string) => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.8;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    const voices = window.speechSynthesis.getVoices();
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

    utterance.onboundary = (event) => {
      if (event.name === 'word') {
        setCurrentWordIndex(prev => prev + 1);
      }
    };

    window.speechSynthesis.speak(utterance);
  };

  const handleWordClick = (word: string) => {
    if (isSpeaking) return;
    speakWord(word);
  };

  const speakWord = (word: string) => {
    if (isSpeaking) return;

    setIsSpeaking(true);
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-US';
    utterance.rate = 0.8;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find(voice => 
      voice.lang.includes('en') && voice.name.includes('Google')
    ) || voices.find(voice => voice.lang.includes('en')) || voices[0];
    
    if (englishVoice) {
      utterance.voice = englishVoice;
    }

    utterance.onend = () => {
      setIsSpeaking(false);
      setClickedWords(prev => {
        const newSet = new Set(prev);
        newSet.delete(word);
        return newSet;
      });
    };

    setClickedWords(prev => {
      const newSet = new Set(prev);
      newSet.add(word);
      return newSet;
    });
    window.speechSynthesis.speak(utterance);
  };

  const startWordByWord = () => {
    setWordByWordMode(true);
    setCurrentWordIndex(0);
    speakText(words[0]);
  };

  const navigateWord = (direction: 'next' | 'prev') => {
    if (!wordByWordMode) return;

    const newIndex = direction === 'next' 
      ? Math.min(currentWordIndex + 1, words.length - 1)
      : Math.max(currentWordIndex - 1, 0);

    setCurrentWordIndex(newIndex);
    // Remove automatic speaking when navigating
  };

  const toggleAutoPlay = () => {
    if (isAutoPlaying) {
      setIsAutoPlaying(false);
      if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
        setAutoPlayInterval(null);
      }
    } else {
      setIsAutoPlaying(true);
      const interval = setInterval(() => {
        if (currentWordIndex < words.length - 1) {
          setCurrentWordIndex(prev => prev + 1);
          // Remove automatic speaking in auto-play
        } else {
          setIsAutoPlaying(false);
          clearInterval(interval);
        }
      }, 2000);
      setAutoPlayInterval(interval);
    }
  };

  const handleFontSizeInput = (value: string) => {
    setFontSizeInput(value);
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue >= 14 && numValue <= 40) {
      setFontSize(numValue);
    }
  };

  const handleLetterSpacingInput = (value: string) => {
    setLetterSpacingInput(value);
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 0 && numValue <= 0.5) {
      setLetterSpacing(numValue);
    }
  };

  const adjustFontSize = (delta: number) => {
    const newSize = Math.max(14, Math.min(40, fontSize + delta));
    setFontSize(newSize);
    setFontSizeInput(newSize.toString());
  };

  const adjustLetterSpacing = (delta: number) => {
    const newSpacing = Math.max(0, Math.min(0.5, letterSpacing + delta * 0.1));
    setLetterSpacing(newSpacing);
    setLetterSpacingInput(newSpacing.toFixed(2));
  };

  const renderContent = () => {
    if (!selectedTemplate) return null;

    if (wordByWordMode) {
      return (
        <div className="flex flex-col items-center space-y-6">
          <div 
            className="text-3xl font-bold text-center p-8 bg-gray-50 rounded-lg w-full cursor-pointer hover:bg-gray-100 transition-colors"
            style={{ 
              fontFamily: 'OpenDyslexic, sans-serif',
              fontSize: `${fontSize}px`,
              letterSpacing: `${letterSpacing}em`
            }}
            onClick={() => handleWordClick(words[currentWordIndex])}
          >
            {words[currentWordIndex]}
          </div>
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => navigateWord('prev')}
              disabled={currentWordIndex === 0}
              className="bg-purple-50 text-[#2e31ce] hover:bg-purple-100 disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              onClick={toggleAutoPlay}
              className="bg-purple-50 text-[#2e31ce] hover:bg-purple-100"
            >
              {isAutoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
            <Button
              onClick={() => navigateWord('next')}
              disabled={currentWordIndex === words.length - 1}
              className="bg-purple-50 text-[#2e31ce] hover:bg-purple-100 disabled:opacity-50"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          <div className="text-sm text-gray-500">
            Word {currentWordIndex + 1} of {words.length}
          </div>
          <div className="text-sm text-gray-500">
            Click the word to hear it spoken
          </div>
        </div>
      );
    }

    return selectedTemplate.content.split(' ').map((word, index) => (
      <span
        key={index}
        className={`inline-block cursor-pointer rounded px-1 transition-all duration-200 select-none
          ${clickedWords.has(word) 
            ? 'bg-purple-100 text-[#2e31ce] scale-110 shadow-sm' 
            : 'hover:bg-gray-50'
          }`}
        onClick={() => handleWordClick(word)}
        style={{ 
          fontFamily: 'OpenDyslexic, sans-serif',
          transition: 'all 0.2s ease-in-out',
          fontSize: `${fontSize}px`,
          letterSpacing: `${letterSpacing}em`
        }}
      >
        {word}{' '}
      </span>
    ));
  };

  if (!selectedTemplate) {
    return null; // Return null while redirecting
  }

  return (
    <DashboardLayout>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex justify-between items-center"
        >
          <div>
            <Link href="/learn/templates-read" className="flex items-center text-gray-600 hover:text-gray-900 mb-2">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Templates
            </Link>
            <h1 className="text-3xl font-bold">Reading Practice</h1>
            <p className="text-gray-600 mt-2">Practice reading with the selected template</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="space-y-6"
        >
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">{selectedTemplate.title}</h2>
              <div className="flex items-center gap-2">
                {!wordByWordMode && (
                  <>
                    <Button
                      onClick={startWordByWord}
                      className="bg-purple-50 text-[#2e31ce] hover:bg-purple-100"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Read Word by Word
                    </Button>
                    <Button
                      onClick={() => speakText(selectedTemplate.content)}
                      className={`flex items-center space-x-2 ${
                        isSpeaking 
                          ? 'bg-red-500 hover:bg-red-600 text-white' 
                          : 'bg-purple-50 text-[#2e31ce] hover:bg-purple-100'
                      }`}
                    >
                      <Volume2 className="w-4 h-4" />
                      <span>{isSpeaking ? 'Stop Reading' : 'Read Aloud'}</span>
                    </Button>
                    <Button
                      onClick={() => setShowSettings(true)}
                      className="bg-purple-50 text-[#2e31ce] hover:bg-purple-100"
                    >
                      <Settings className="w-4 h-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>

            <div className="p-6 bg-gray-50 rounded-lg">
              <div className="text-gray-800 leading-relaxed text-lg">
                {renderContent()}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Settings Modal */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-20 right-4 bg-white rounded-lg shadow-lg p-4 w-72 border border-gray-200 z-50"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Reading Settings</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSettings(false)}
                  className="hover:bg-gray-100"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-medium text-gray-700">Font Size</h3>
                    <span className="text-xs text-gray-500">14px - 40px</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => adjustFontSize(-2)}
                      className="border-gray-200"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <input
                      type="number"
                      value={fontSizeInput}
                      onChange={(e) => handleFontSizeInput(e.target.value)}
                      className="w-16 text-center border border-gray-200 rounded-md px-2 py-1 text-sm"
                      min="14"
                      max="40"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => adjustFontSize(2)}
                      className="border-gray-200"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-medium text-gray-700">Letter Spacing</h3>
                    <span className="text-xs text-gray-500">0em - 0.5em</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => adjustLetterSpacing(-0.1)}
                      className="border-gray-200"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <input
                      type="number"
                      value={letterSpacingInput}
                      onChange={(e) => handleLetterSpacingInput(e.target.value)}
                      step="0.01"
                      className="w-16 text-center border border-gray-200 rounded-md px-2 py-1 text-sm"
                      min="0"
                      max="0.5"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => adjustLetterSpacing(0.1)}
                      className="border-gray-200"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </DashboardLayout>
  );
} 