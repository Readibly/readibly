"use client"

import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  const handleServicesClick = () => {
    setIsServicesOpen(!isServicesOpen);
    setIsAboutOpen(false);
  };

  const handleAboutClick = () => {
    setIsAboutOpen(!isAboutOpen);
    setIsServicesOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-xl font-bold text-[#2e31ce]">
              Readibly
            </Link>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="flex items-center space-x-8">
            <div className="relative">
                <Link href="/" className='text-black hover:text-gray-700'>
                  Home
                </Link>
              </div>
              <div className="relative">
                <button
                  onClick={handleServicesClick}
                  className='inline-flex items-center text-m font-medium text-black hover:text-gray-700'
                >
                  Services
                  <ChevronDown className="ml-1 h-4 w-4" />
                </button>
                {isServicesOpen && (
                  <div className="absolute left-0 mt-2 w-48 rounded-lg shadow-[0px_0px_10px_rgba(0,0,0,0.1)] bg-white">
                    <div className="py-1" role="menu">
                      <Link
                        href="/"
                        className="block px-6 py-2 text-sm font-medium text-black hover:text-gray-700"
                        onClick={() => setIsServicesOpen(false)}
                      >
                        Nanti yak
                      </Link>
                    </div>
                  </div>
                )}
              </div>
              <div className="relative">
                <button
                  onClick={handleAboutClick}
                  className="inline-flex items-center text-m font-medium text-black hover:text-gray-700"
                >
                  About
                  <ChevronDown className="ml-1 h-4 w-4" />
                </button>
                {isAboutOpen && (
                  <div className="absolute left-0 mt-2 w-48 rounded-lg shadow-[0px_0px_10px_rgba(0,0,0,0.1)] bg-white">
                    <div className="py-1" role="menu">
                      <Link
                        href="/reader"
                        className="block px-6 py-2 text-sm font-medium"
                        role="menuitem"
                        onClick={() => setIsAboutOpen(false)}
                      >
                        Ini juga nanti yak
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex-shrink-0 w-[100px]"></div>
        </div>
      </div>
    </nav>
  );
}