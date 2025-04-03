'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

const ServiceCard = ({ title, description, route, index }: { title: string; description: string; route: string; index: number }) => {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        delay: 0.2 + (index * 0.1),
        ease: "easeOut"
      }}
      className="bg-white rounded-lg shadow-[0px_0px_10px_rgba(0,0,0,0.1)] p-6 cursor-pointer w-full max-w-sm 
                 transform transition-all duration-300 ease-in-out
                 hover:scale-105 hover:shadow-[0px_0px_10px_rgba(0,0,0,0.2)]
                 active:scale-95 text-center"
      onClick={() => router.push(route)}
    >
      <h3 className="text-2xl font-bold mb-3 text-[#2e31ce]">{title}</h3>
      <p className="font-light text-[#1e1e1e]">{description}</p>
    </motion.div>
  );
};

export default function OptionsPage() {
  const services = [
    {
      title: "Reader",
      description: "Helps you to parse text and make it more readable.",
      route: "/tutorial"
    },
    {
      title: "Learn",
      description: "Enhance your learning experience with interactive educational content.",
      route: "/learn"
    }
  ];

  return (
    <motion.div 
      className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <h1 className="text-6xl font-bold text-gray-900 mb-4">What do you want to do?</h1>
          <p className="text-xl text-gray-600">Select the service that best suits your needs</p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-w-4xl mx-auto justify-items-center">
          {services.map((service, index) => (
            <ServiceCard
              key={index}
              index={index}
              title={service.title}
              description={service.description}
              route={service.route}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
} 