'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import AnimatedSection from '@/components/AnimatedSection';

const steps = [
  {
    title: "Upload your PDF file",
    description: "Start by uploading your PDF document that you want to read.",
    image: "/img/tutorial/upload-pdf.png"
  },
  {
    title: "Parsed Content with OpenDyslexic Font",
    description: "The website will automatically parse your PDF content and display it in the OpenDyslexic font for better readability.",
    image: "/img/tutorial/parsed-content.png"
  },
  {
    title: "Text-to-Speech Feature",
    description: "Hover over any word and double-click to hear the text-to-speech pronunciation.",
    image: "/img/tutorial/text-to-speech.png"
  }
];

export default function TutorialPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const router = useRouter();
  const totalSteps = steps.length;

  useEffect(() => {
    // Trigger entrance animation after component mounts
    setIsLoaded(true);
  }, []);

  const nextStep = () => {
    if (currentStep < totalSteps - 1) {
      setDirection(1);
      setCurrentStep(currentStep + 1);
    } else {
      router.push('/dashboard');
    }
  };

  const previousStep = () => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep(currentStep - 1);
    }
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <AnimatedSection>
          <div className="max-w-3xl mx-auto">
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-4">Welcome to Readibly</h1>
              <p className="text-gray-600">Let's walk you through the basics</p>
            </div>

            <div className="space-y-8">
              {currentStep === 0 && (
                <div>
                  <h2 className="text-2xl font-semibold mb-4">Step 1: PDF Reader</h2>
                  <p className="text-gray-600 mb-4">
                    Our PDF Reader helps you extract and read text from PDF documents with ease.
                    You can upload any PDF file and our AI will help you read it.
                  </p>
                </div>
              )}

              {currentStep === 1 && (
                <div>
                  <h2 className="text-2xl font-semibold mb-4">Step 2: Speech to Text</h2>
                  <p className="text-gray-600 mb-4">
                    Convert your speech to text in real-time. Perfect for taking notes or
                    transcribing meetings and lectures.
                  </p>
                </div>
              )}

              {currentStep === 2 && (
                <div>
                  <h2 className="text-2xl font-semibold mb-4">Step 3: Learning Center</h2>
                  <p className="text-gray-600 mb-4">
                    Access our learning templates and improve your reading skills with
                    interactive exercises and AI-powered feedback.
                  </p>
                </div>
              )}

              <div className="flex justify-between items-center">
                <Button
                  onClick={previousStep}
                  disabled={currentStep === 0}
                  className="bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  Previous
                </Button>

                {currentStep === totalSteps - 1 ? (
                  <Link href="/dashboard">
                    <Button className="bg-[#2e31ce] text-white hover:bg-[#373ad3]">
                      Continue to Dashboard
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                ) : (
                  <Button
                    onClick={nextStep}
                    className="bg-[#2e31ce] text-white hover:bg-[#373ad3]"
                  >
                    Next
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
} 