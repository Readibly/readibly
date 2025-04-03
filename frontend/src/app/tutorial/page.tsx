'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

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

  useEffect(() => {
    // Trigger entrance animation after component mounts
    setIsLoaded(true);
  }, []);

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setDirection(1);
      setCurrentStep(currentStep + 1);
    } else {
      router.push('/reader');
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
    <motion.div 
      className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="max-w-3xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate={isLoaded ? "visible" : "hidden"}
      >
        <motion.div 
          className="relative h-[400px] overflow-hidden"
          variants={itemVariants}
        >
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={currentStep}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
              className="absolute w-full"
            >
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-[#2e31ce] mb-3">{steps[currentStep].title}</h2>
                <p className="text-base text-gray-600">{steps[currentStep].description}</p>
              </div>

              <div className="relative w-full h-[300px] rounded-lg overflow-hidden bg-gray-100">
                <Image
                  src={steps[currentStep].image}
                  alt={steps[currentStep].title}
                  fill
                  className="object-contain"
                />
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        <motion.div 
          className="flex justify-between items-center mt-6"
          variants={itemVariants}
        >
          <Button
            onClick={previousStep}
            disabled={currentStep === 0}
            className="bg-gray-200 text-gray-800 hover:bg-gray-300"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>

          <div className="flex gap-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === currentStep ? 'bg-[#2e31ce]' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          <Button
            onClick={nextStep}
            className="bg-[#2e31ce] text-white hover:bg-[#373ad3]"
          >
            {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
} 