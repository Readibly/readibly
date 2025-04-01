'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, List } from 'lucide-react';

// Import the templates from a shared location (you might want to move this to a separate file)
const templates = [
  {
    id: 1,
    title: "The Little Red Riding Hood",
    category: "fairytale",
    description: "A classic fairy tale about a young girl's encounter with a wolf.",
    content: "Once upon a time, there was a little girl who lived in a village near the forest. She was known to everyone as Little Red Riding Hood because of the red cloak she always wore. One day, her mother asked her to take some food to her grandmother who was sick and lived in a house in the forest. Little Red Riding Hood was happy to help and set off on her journey."
  },
  // ... other templates ...
];

export default function LearnTextPage() {
  const params = useParams();
  const router = useRouter();
  const templateId = Number(params.id);
  const template = templates.find(t => t.id === templateId);

  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [words, setWords] = useState<string[]>([]);
  const [speechSynthesis, setSpeechSynthesis] = useState<SpeechSynthesis | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [clickedWords, setClickedWords] = useState<Set<string>>(new Set());
  const [showPageSelector, setShowPageSelector] = useState(false);

  useEffect(() => {
    if (template) {
      setWords(template.content.split(' '));
    }

    // Initialize speech synthesis
    if (typeof window !== 'undefined') {
      const synthesis = window.speechSynthesis;
      setSpeechSynthesis(synthesis);

      const loadVoices = () => {
        const availableVoices = synthesis.getVoices();
        setVoices(availableVoices);
      };

      loadVoices();
      synthesis.onvoiceschanged = loadVoices;

      return () => {
        synthesis.cancel();
        synthesis.onvoiceschanged = null;
      };
    }
  }, [template]);

  const speakWord = (word: string) => {
    if (!speechSynthesis) return;

    try {
      speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(word);
      
      utterance.rate = 0.8;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      const englishVoice = voices.find(voice => 
        voice.lang.includes('en') && voice.name.includes('Google')
      ) || voices.find(voice => voice.lang.includes('en')) || voices[0];
      
      if (englishVoice) {
        utterance.voice = englishVoice;
      }

      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event);
      };

      speechSynthesis.speak(utterance);
    } catch (err) {
      console.error('Error in speech synthesis:', err);
    }
  };

  const handleWordClick = (word: string) => {
    speakWord(word);
    setClickedWords(prev => {
      const newSet = new Set(prev);
      newSet.add(word);
      return newSet;
    });
    
    setTimeout(() => {
      setClickedWords(prev => {
        const newSet = new Set(prev);
        newSet.delete(word);
        return newSet;
      });
    }, 1000);
  };

  const navigateToWord = (index: number) => {
    setCurrentWordIndex(index);
    setShowPageSelector(false);
  };

  if (!template) {
    return <div>Template not found</div>;
  }

  return (
    <div className="min-h-screen bg-[#FDFCF4]">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">{template.title}</h1>
            <p className="text-sm text-gray-600">{template.description}</p>
          </div>
          <button
            onClick={() => router.push('/learn')}
            className="text-violet-500 hover:text-violet-600 flex items-center gap-2"
          >
            <ChevronLeft size={20} />
            Back to Templates
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 min-h-[60vh] flex flex-col items-center justify-center relative">
          <div className="text-center">
            <span
              className={`text-4xl font-['OpenDyslexic'] cursor-pointer select-none transition-all duration-200
                ${clickedWords.has(words[currentWordIndex]) 
                  ? 'bg-violet-100 text-[#2a2de0] scale-110 shadow-md' 
                  : 'hover:bg-gray-100'
                }`}
              onDoubleClick={() => handleWordClick(words[currentWordIndex])}
              title="Double click to hear pronunciation"
            >
              {words[currentWordIndex]}
            </span>
          </div>

          <div className="absolute bottom-8 left-0 right-0 flex justify-center items-center gap-4">
            <button
              onClick={() => setCurrentWordIndex(prev => Math.max(0, prev - 1))}
              disabled={currentWordIndex === 0}
              className="p-2 rounded-full bg-violet-50 text-violet-500 hover:bg-violet-100 disabled:opacity-50"
            >
              <ChevronLeft size={24} />
            </button>

            <button
              onClick={() => setShowPageSelector(!showPageSelector)}
              className="p-2 rounded-full bg-violet-50 text-violet-500 hover:bg-violet-100"
            >
              <List size={24} />
            </button>

            <button
              onClick={() => setCurrentWordIndex(prev => Math.min(words.length - 1, prev + 1))}
              disabled={currentWordIndex === words.length - 1}
              className="p-2 rounded-full bg-violet-50 text-violet-500 hover:bg-violet-100 disabled:opacity-50"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          {showPageSelector && (
            <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg p-4 max-h-60 overflow-y-auto">
              <div className="grid grid-cols-5 gap-2">
                {words.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => navigateToWord(index)}
                    className={`p-2 rounded ${
                      index === currentWordIndex
                        ? 'bg-violet-500 text-white'
                        : 'bg-violet-50 text-violet-500 hover:bg-violet-100'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 text-center text-sm text-gray-600">
          Word {currentWordIndex + 1} of {words.length}
        </div>
      </div>
    </div>
  );
} 