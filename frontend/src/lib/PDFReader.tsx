'use client';

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from '@/services/api';
import EyeTrackerJS from '@/components/EyeTrackerJS';
import { Button } from '@/components/ui/button';
import { Upload, Eye, Settings, Plus, Minus, ChevronLeft, ChevronRight, X } from 'lucide-react';

const PDFReader = () => {
    const [parsedText, setParsedText] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [fontSize, setFontSize] = useState(18);
    const [letterSpacing, setLetterSpacing] = useState(0.1);
    const [isEyeTrackingEnabled, setIsEyeTrackingEnabled] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [clickedWords, setClickedWords] = useState<Set<string>>(new Set());
    const [pages, setPages] = useState<string[][]>([]);
    const [speaking, setSpeaking] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [fontSizeInput, setFontSizeInput] = useState('18');
    const [letterSpacingInput, setLetterSpacingInput] = useState('0.1');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        }
    };

    const contentVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { 
            opacity: 1, 
            x: 0,
            transition: {
                duration: 0.3,
                ease: "easeOut"
            }
        }
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsLoading(true);
        setError(null);

        try {
            const result = await api.uploadPDF(file);
            setParsedText(result.text);
            setTotalPages(result.pageCount);
            
            // Process text for pages and paragraphs
            const pageTexts = result.text.split(/\f|\n\f|\n\n/).filter(text => text.trim().length > 0);
            const processedPages = pageTexts.map(pageText => {
                // Process each page's text into paragraphs
                return pageText
                .replace(/\n+/g, ' ')
                .replace(/\s+/g, ' ')
                .split(/(?<=[.!?])\s+/)
                .map(sentence => sentence.trim())
                .filter(sentence => sentence.length > 0);
            });
            
            // Ensure we have the correct number of pages
            if (processedPages.length !== result.pageCount) {
                // If we don't have enough pages, split the text evenly
                if (processedPages.length < result.pageCount) {
                    const wordsPerPage = Math.ceil(processedPages.flat().length / result.pageCount);
                    const allWords = processedPages.flat();
                    const newPages: string[][] = [];
                    
                    for (let i = 0; i < result.pageCount; i++) {
                        const start = i * wordsPerPage;
                        const end = Math.min(start + wordsPerPage, allWords.length);
                        newPages.push(allWords.slice(start, end));
                    }
                    
                    setPages(newPages);
                } else {
                    // If we have too many pages, combine them
                    const wordsPerPage = Math.ceil(processedPages.flat().length / result.pageCount);
                    const allWords = processedPages.flat();
                    const newPages: string[][] = [];
                    
                    for (let i = 0; i < result.pageCount; i++) {
                        const start = i * wordsPerPage;
                        const end = Math.min(start + wordsPerPage, allWords.length);
                        newPages.push(allWords.slice(start, end));
                    }
                    
                    setPages(newPages);
                }
            } else {
                setPages(processedPages);
            }
            
            setCurrentPage(1);
        } catch (error) {
            console.error('Upload error:', error);
            setError(error instanceof Error ? error.message : 'Failed to parse PDF. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
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

    const handleWordClick = (word: string) => {
        if (speaking) return;
        speakWord(word);
    };

    const speakWord = (word: string) => {
        if (speaking) return;

        setSpeaking(true);
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
            setSpeaking(false);
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

    const handleWordHover = (word: string | null) => {
        setClickedWords(prev => {
            const newSet = new Set(prev);
            if (word) {
                newSet.add(word);
            } else {
                newSet.clear();
            }
            return newSet;
        });
    };

    const handleDoubleBlink = () => {
        if (speaking) return;
        const currentWord = clickedWords.size > 0 ? Array.from(clickedWords)[0] : null;
        if (currentWord) {
            speakWord(currentWord);
        }
    };

    return (
        <motion.div
            className="w-full"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            <div className="border-b border-gray-100 p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf"
                    onChange={handleFileUpload}
                            className="hidden"
                            id="pdf-upload"
                        />
                        <label
                            htmlFor="pdf-upload"
                            className="flex items-center gap-2 px-4 py-2 bg-purple-50 text-[#2e31ce] rounded-lg cursor-pointer hover:bg-purple-100 transition-colors"
                        >
                            <Upload className="h-4 w-4" />
                            <span className="text-sm font-medium">Upload PDF</span>
                        </label>
                        <Button
                            variant="outline"
                    onClick={() => setIsEyeTrackingEnabled(!isEyeTrackingEnabled)}
                            className={`border-gray-200 ${isEyeTrackingEnabled ? 'bg-purple-50 text-[#2e31ce] border-[#2e31ce]' : ''}`}
                        >
                            <Eye className="h-4 w-4 mr-2" />
                            {isEyeTrackingEnabled ? 'Eye Tracking On' : 'Enable Eye Tracking'}
                        </Button>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="border-gray-200"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <span className="text-sm text-gray-600">
                                Page {currentPage} of {totalPages}
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="border-gray-200"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                        <Button
                            variant="outline"
                            onClick={() => setShowSettings(!showSettings)}
                            className="border-gray-200"
                        >
                            <Settings className="h-4 w-4 mr-2" />
                            Settings
                        </Button>
                    </div>
                </div>
            </div>

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

            <AnimatePresence mode="wait">
                {isLoading && (
                    <motion.div
                        key="loading"
                        className="flex flex-col items-center justify-center py-12"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <div className="animate-spin rounded-full h-10 w-10 border-4 border-[#2e31ce] border-t-transparent"></div>
                        <p className="mt-4 text-gray-600">Processing your PDF...</p>
                    </motion.div>
                )}

                {error && (
                    <motion.div
                        key="error"
                        className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg m-4"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                    >
                        <p className="font-medium">Error: {error}</p>
                    </motion.div>
                )}

                {!parsedText && !isLoading && !error && (
                    <motion.div
                        key="empty"
                        className="flex flex-col items-center justify-center py-16 px-8 text-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <div className="bg-purple-50 p-4 rounded-full mb-4">
                            <Upload className="h-8 w-8 text-[#2e31ce]" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No PDF loaded yet</h3>
                        <p className="text-gray-600 max-w-md">
                            Upload a PDF file to start reading. We support all standard PDF documents.
                        </p>
                    </motion.div>
                )}

                {parsedText && (
                    <motion.div
                        key="content"
                        variants={contentVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        className="p-6"
                    >
                        <div 
                            className="bg-white rounded-lg p-6 font-['OpenDyslexic']"
                                style={{
                                    fontSize: `${fontSize}px`,
                                letterSpacing: `${letterSpacing}em`,
                                }}
                            >
                            {pages[currentPage - 1]?.map((paragraph, index) => (
                                    <p 
                                        key={index}
                                    className="mb-8 text-gray-800"
                                        style={{
                                            textAlign: 'justify',
                                            width: '100%',
                                            maxWidth: '100%',
                                            margin: '0 auto 2rem',
                                            padding: '0 1rem',
                                        fontSize: 'inherit',
                                        }}
                                    >
                                        {paragraph.split(' ').map((word, wordIndex) => (
                                            <span
                                                key={wordIndex}
                                                className={`inline-block cursor-pointer rounded px-1 transition-all duration-200 select-none
                                                    ${clickedWords.has(word) 
                                                    ? 'bg-purple-100 text-[#2e31ce] scale-110 shadow-sm' 
                                                    : 'hover:bg-gray-50'
                                                    }`}
                                            style={{
                                                fontSize: 'inherit',
                                            }}
                                                onDoubleClick={() => handleWordClick(word)}
                                                title="Double click to hear pronunciation"
                                            >
                                                {word}{' '}
                                            </span>
                                        ))}
                                    </p>
                                ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <EyeTrackerJS
                isEnabled={isEyeTrackingEnabled}
                onGazePoint={(x, y) => {
                    const element = document.elementFromPoint(x, y);
                    if (element) {
                        const wordSpan = element.closest('span');
                        if (wordSpan && wordSpan.textContent) {
                            handleWordHover(wordSpan.textContent.trim());
                        } else {
                            handleWordHover(null);
                        }
                    }
                }}
                onDoubleBlink={handleDoubleBlink}
            />
        </motion.div>
    );
};

export default PDFReader; 