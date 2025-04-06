'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { BookOpen, Headphones, Brain, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function DashboardPage() {
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
        >
          <h1 className="text-3xl font-bold">Welcome to Readibly</h1>
          <p className="text-gray-600 mt-2">Choose a service to get started</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <Link href="/reader">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <BookOpen className="h-6 w-6 text-[#2e31ce]" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">PDF Reader</h2>
                  <p className="text-gray-600 text-sm">Read and extract text from PDFs</p>
                </div>
              </div>
            </motion.div>
          </Link>

          <Link href="/speech-to-text">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Headphones className="h-6 w-6 text-[#2e31ce]" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Speech to Text</h2>
                  <p className="text-gray-600 text-sm">Convert speech to text in real-time</p>
                </div>
              </div>
            </motion.div>
          </Link>

          <Link href="/learn">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Brain className="h-6 w-6 text-[#2e31ce]" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Learning Center</h2>
                  <p className="text-gray-600 text-sm">Learn with interactive templates</p>
                </div>
              </div>
            </motion.div>
          </Link>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
} 