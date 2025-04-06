import { motion } from 'framer-motion';
import { Laptop } from 'lucide-react';

export default function MobileMessage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center"
      >
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-purple-100 rounded-full">
            <Laptop className="h-8 w-8 text-[#2e31ce]" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Desktop Only
        </h1>
        <p className="text-gray-600 mb-6">
          Readibly can only be used on desktop devices. Please switch to a desktop computer to access the full experience.
        </p>
      </motion.div>
    </div>
  );
} 