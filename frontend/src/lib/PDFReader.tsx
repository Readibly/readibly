'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/services/api';

const PDFReader = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [parsedText, setParsedText] = useState<string>('');
    const [words, setWords] = useState<string[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [paragraphs, setParagraphs] = useState<string[]>([]);
    const [fontSize, setFontSize] = useState(18);
    const [lineHeight, setLineHeight] = useState(1.8);
    const [speaking, setSpeaking] = useState(false);
    const [speechSynthesis, setSpeechSynthesis] = useState<SpeechSynthesis | null>(null);
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
    const [clickedWords, setClickedWords] = useState<Set<string>>(new Set());

    useEffect(() => {
        // Initialize speech synthesis
        if (typeof window !== 'undefined') {
            const synthesis = window.speechSynthesis;
            setSpeechSynthesis(synthesis);

            // Load voices
            const loadVoices = () => {
                const availableVoices = synthesis.getVoices();
                setVoices(availableVoices);
            };

            // Load voices immediately if available
            loadVoices();

            // Load voices when they become available
            synthesis.onvoiceschanged = loadVoices;

            // Clean up on unmount
            return () => {
                synthesis.cancel();
                synthesis.onvoiceschanged = null;
            };
        }
    }, []);

    const speakWord = (word: string) => {
        if (!speechSynthesis) return;

        try {
            // Cancel any ongoing speech
            speechSynthesis.cancel();

            // Create utterance
            const utterance = new SpeechSynthesisUtterance(word);
            
            // Configure voice settings
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

            // Handle speech events
            utterance.onstart = () => setSpeaking(true);
            utterance.onend = () => setSpeaking(false);
            utterance.onerror = (event) => {
                console.error('Speech synthesis error:', event);
                setSpeaking(false);
            };

            // Start speaking
            speechSynthesis.speak(utterance);
        } catch (err) {
            console.error('Error in speech synthesis:', err);
            setSpeaking(false);
        }
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            setIsLoading(true);
            setError(null);

            if (file.type !== 'application/pdf') {
                throw new Error('Please upload a PDF file');
            }

            const result = await api.uploadPDF(file);
            setParsedText(result.text);
            setWords(result.words);
            setTotalPages(result.pageCount);
            
            // Process text for dyslexia-friendly reading
            const processedText = result.text
                .replace(/\n+/g, ' ') // Replace multiple newlines with single space
                .replace(/\s+/g, ' ') // Replace multiple spaces with single space
                .split(/(?<=[.!?])\s+/) // Split on sentence endings
                .map(sentence => sentence.trim())
                .filter(sentence => sentence.length > 0);

            // Create shorter, more digestible paragraphs
            const groupedParagraphs: string[] = [];
            let currentParagraph: string[] = [];
            
            processedText.forEach((sentence, index) => {
                currentParagraph.push(sentence);
                // Create shorter paragraphs (2-3 sentences) for better readability
                if (currentParagraph.length >= 2 || index === processedText.length - 1) {
                    groupedParagraphs.push(currentParagraph.join(' '));
                    currentParagraph = [];
                }
            });

            setParagraphs(groupedParagraphs);

        } catch (err) {
            console.error('Upload error:', err);
            setError(err instanceof Error ? err.message : 'Failed to upload PDF');
        } finally {
            setIsLoading(false);
        }
    };

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const adjustFontSize = (delta: number) => {
        setFontSize(prev => Math.max(16, Math.min(24, prev + delta)));
    };

    const adjustLineHeight = (delta: number) => {
        setLineHeight(prev => Math.max(1.5, Math.min(2.2, prev + delta)));
    };

    const handleWordClick = (word: string) => {
        speakWord(word);
        setClickedWords(prev => {
            const newSet = new Set(prev);
            newSet.add(word);
            return newSet;
        });
        
        // Remove the highlight after 1 second
        setTimeout(() => {
            setClickedWords(prev => {
                const newSet = new Set(prev);
                newSet.delete(word);
                return newSet;
            });
        }, 1000);
    };

    return (
        <div className="w-full max-w-6xl mx-auto p-4">
            <div className="mb-4">
                <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileUpload}
                    className="block w-full text-sm text-gray-500 font-extralight
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-md file:border-0
                        file:text-sm file:font-semibold
                        file:bg-violet-50 file:text-[#2e31ce]
                        hover:file:bg-violet-100"
                    disabled={isLoading}
                />
            </div>

            {isLoading && (
                <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                    <p className="mt-2">Processing PDF...</p>
                </div>
            )}

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Error: </strong>
                    <span className="block sm:inline">{error}</span>
                </div>
            )}

            {parsedText && (
                <div className="mt-6">
                    <div className="bg-white shadow-[0px_0px_10px_rgba(0,0,0,0.2)] rounded-lg p-6">
                        <div className="flex flex-col gap-4 mb-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold">Parsed Content</h3>
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="px-3 py-1 text-base bg-violet-50 text-[#2e31ce] rounded-md disabled:opacity-50"
                                    >
                                        Previous
                                    </button>
                                    <span className="text-sm text-gray-600">
                                        Page {currentPage} of {totalPages}
                                    </span>
                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className="px-3 py-1 text-base bg-violet-50 text-[#2e31ce] rounded-md disabled:opacity-50"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => adjustFontSize(-1)}
                                        className="px-2 py-1 text-sm bg-violet-50 text-[#2e31ce] rounded"
                                    >
                                        A-
                                    </button>
                                    <span className="text-sm">Font Size</span>
                                    <button
                                        onClick={() => adjustFontSize(1)}
                                        className="px-2 py-1 text-sm bg-violet-50 text-[#2e31ce] rounded"
                                    >
                                        A+
                                    </button>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => adjustLineHeight(-0.1)}
                                        className="px-2 py-1 text-sm bg-violet-50 text-[#2e31ce] rounded"
                                    >
                                        L-
                                    </button>
                                    <span className="text-sm">Line Height</span>
                                    <button
                                        onClick={() => adjustLineHeight(0.1)}
                                        className="px-2 py-1 text-sm bg-violet-50 text-[#2e31ce] rounded"
                                    >
                                        L+
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        <div 
                            className="prose max-w-none"
                            style={{
                                fontSize: `${fontSize}px`,
                                lineHeight: lineHeight,
                            }}
                        >
                            {paragraphs.map((paragraph, index) => (
                                <p 
                                    key={index}
                                    className="mb-8 text-gray-800 font-['OpenDyslexic']"
                                    style={{
                                        textAlign: 'justify',
                                        width: '100%',
                                        maxWidth: '100%',
                                        margin: '0 auto 2rem',
                                        padding: '0 1rem',
                                    }}
                                >
                                    {paragraph.split(' ').map((word, wordIndex) => (
                                        <span
                                            key={wordIndex}
                                            className={`inline-block cursor-pointer rounded px-1 transition-all duration-200 select-none
                                                ${clickedWords.has(word) 
                                                    ? 'bg-violet-100 text-[#2a2de0] scale-110 shadow-md' 
                                                    : 'hover:bg-gray-100'
                                                }`}
                                            onDoubleClick={() => handleWordClick(word)}
                                            title="Double click to hear pronunciation"
                                        >
                                            {word}{' '}
                                        </span>
                                    ))}
                                </p>
                            ))}
                        </div>
                    </div>
                    
                    <div className="mt-6 bg-white shadow-[0px_0px_10px_rgba(0,0,0,0.2)] rounded-lg p-6">
                        <h3 className="text-lg font-semibold mb-4">Word Analysis</h3>
                        <div className="flex flex-wrap gap-2">
                            {words.map((word, index) => (
                                <button 
                                    key={index}
                                    onClick={() => speakWord(word)}
                                    disabled={speaking}
                                    className={`inline-block px-3 py-1 rounded-full text-sm transition-colors
                                        ${speaking 
                                            ? 'bg-violet-100 text-[#2a2de0] cursor-wait' 
                                            : 'bg-violet-50 text-[#7678ed] hover:bg-violet-100'
                                        }`}
                                >
                                    {word}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PDFReader; 