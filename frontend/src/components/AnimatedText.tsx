"use client";

import { useState, useEffect } from "react";

interface AnimatedTextProps {
  className?: string;
}

export default function AnimatedText({ className = "" }: AnimatedTextProps) {
  const [displayText, setDisplayText] = useState("");
  const words = ["Read Smarter", "Learn Faster", "Life Easier"];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    let currentText = "";
    const word = words[currentIndex];
    
    // Typing animation
    const typingInterval = setInterval(() => {
      if (currentText.length < word.length) {
        currentText += word[currentText.length];
        setDisplayText(currentText);
      } else {
        clearInterval(typingInterval);
        
        // Wait before starting to delete
        setTimeout(() => {
          const deletingInterval = setInterval(() => {
            if (currentText.length > 0) {
              currentText = currentText.slice(0, -1);
              setDisplayText(currentText);
            } else {
              clearInterval(deletingInterval);
              // Move to next word
              setCurrentIndex((prev) => (prev + 1) % words.length);
            }
          }, 30);
        }, 2000);
      }
    }, 50);

    return () => {
      clearInterval(typingInterval);
    };
  }, [currentIndex]);

  return (
    <span className={`relative inline-block ${className}`}>
      <span className="relative z-10">{displayText}</span>
      <span className="absolute inset-[-4px] bg-[#eaeafa] transform"></span>
    </span>
  );
} 