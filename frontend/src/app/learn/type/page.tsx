'use client';

import { useState, useEffect, useRef } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowLeft, RefreshCw } from 'lucide-react';
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
    title: "Basic Typing Practice",
    category: "beginner",
    content: "The quick brown fox jumps over the lazy dog. This sentence contains all the letters in the English alphabet."
  },
  {
    id: 2,
    title: "Common Words",
    category: "intermediate",
    content: "Practice typing common words and phrases. This will help improve your typing speed and accuracy."
  },
  {
    id: 3,
    title: "Advanced Sentences",
    category: "advanced",
    content: "The ability to type quickly and accurately is an essential skill in today's digital world. Regular practice can significantly improve your typing speed."
  }
];

export default function TypeLearnPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const templateId = searchParams.get('template');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [input, setInput] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [errors, setErrors] = useState<number[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (templateId) {
      const template = templates.find(t => t.id === parseInt(templateId));
      if (template) {
        setSelectedTemplate(template);
      } else {
        router.push('/learn/templates-type');
      }
    } else {
      router.push('/learn/templates-type');
    }
  }, [templateId, router]);

  if (!selectedTemplate) {
    return null; // Return null while redirecting
  }

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template);
    setInput('');
    setStartTime(null);
    setEndTime(null);
    setErrors([]);
    setCurrentIndex(0);
    setIsComplete(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!startTime) {
      setStartTime(Date.now());
    }

    const value = e.target.value;
    setInput(value);

    // Check for errors
    const newErrors = [...errors];
    if (value.length > 0) {
      if (value[value.length - 1] !== selectedTemplate?.content[value.length - 1]) {
        newErrors.push(value.length - 1);
      } else {
        const index = newErrors.indexOf(value.length - 1);
        if (index > -1) {
          newErrors.splice(index, 1);
        }
      }
    }
    setErrors(newErrors);
    setCurrentIndex(value.length);

    // Check if typing is complete
    if (value.length === selectedTemplate?.content.length) {
      setEndTime(Date.now());
      setIsComplete(true);
    }
  };

  const calculateWPM = () => {
    if (!startTime || !endTime || !selectedTemplate) return 0;
    const minutes = (endTime - startTime) / 60000;
    const words = selectedTemplate.content.split(' ').length;
    return Math.round(words / minutes);
  };

  const calculateAccuracy = () => {
    if (!selectedTemplate) return 0;
    const totalChars = selectedTemplate.content.length;
    const correctChars = totalChars - errors.length;
    return Math.round((correctChars / totalChars) * 100);
  };

  const resetPractice = () => {
    setInput('');
    setStartTime(null);
    setEndTime(null);
    setErrors([]);
    setCurrentIndex(0);
    setIsComplete(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

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
            <Link href="/learn/templates-type" className="flex items-center text-gray-600 hover:text-gray-900 mb-2">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Templates
            </Link>
            <h1 className="text-3xl font-bold">Typing Practice</h1>
            <p className="text-gray-600 mt-2">Practice typing with the selected template</p>
          </div>
        </motion.div>

        {!selectedTemplate ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {templates.map((template) => (
              <motion.div
                key={template.id}
                whileHover={{ scale: 1.02 }}
                onClick={() => handleTemplateSelect(template)}
                className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
              >
                <h2 className="text-xl font-semibold mb-2">{template.title}</h2>
                <p className="text-sm text-gray-600 capitalize mb-4">{template.category}</p>
                <p className="text-sm text-gray-500 line-clamp-3">{template.content}</p>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">{selectedTemplate.title}</h2>
                <Button
                  onClick={resetPractice}
                  className="bg-purple-50 text-[#2e31ce] hover:bg-purple-100"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Restart
                </Button>
              </div>

              <div className="mb-6">
                <div className="p-4 bg-gray-50 rounded-lg font-mono text-lg">
                  {selectedTemplate.content.split('').map((char, index) => (
                    <span
                      key={index}
                      className={`
                        ${index < currentIndex ? 'text-gray-400' : 'text-gray-900'}
                        ${errors.includes(index) ? 'text-red-500' : ''}
                        ${index === currentIndex ? 'bg-yellow-100' : ''}
                      `}
                    >
                      {char}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500"
                  placeholder="Start typing..."
                  disabled={isComplete}
                />
              </div>

              {isComplete && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-purple-50 p-4 rounded-lg"
                >
                  <h3 className="text-lg font-semibold mb-2">Results</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Typing Speed</p>
                      <p className="text-2xl font-bold text-[#2e31ce]">{calculateWPM()} WPM</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Accuracy</p>
                      <p className="text-2xl font-bold text-[#2e31ce]">{calculateAccuracy()}%</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </motion.div>
    </DashboardLayout>
  );
} 