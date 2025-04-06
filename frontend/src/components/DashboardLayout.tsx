'use client';

import { useState } from 'react';
import { Menu, X, BookOpen, Headphones, Brain, LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import DesktopOnly from './DesktopOnly';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <DesktopOnly>
      <div className="min-h-screen bg-gray-50">
        {/* Mobile sidebar toggle */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-lg md:hidden"
        >
          {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {/* Sidebar */}
        <div
          className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } md:translate-x-0 transition-transform duration-200 ease-in-out`}
        >
          <div className="flex flex-col h-full p-4">
            <div className="flex items-center justify-center mb-8">
              <h1 className="text-2xl font-bold text-[#2e31ce]">Readibly</h1>
            </div>

            <nav className="flex-1 space-y-2">
              <Link
                href="/dashboard"
                className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  isActive('/dashboard')
                    ? 'bg-purple-50 text-[#2e31ce]'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <BookOpen className="h-5 w-5" />
                <span>Dashboard</span>
              </Link>

              <Link
                href="/reader"
                className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  isActive('/reader')
                    ? 'bg-purple-50 text-[#2e31ce]'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <BookOpen className="h-5 w-5" />
                <span>PDF Reader</span>
              </Link>

              <Link
                href="/speech-to-text"
                className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  isActive('/speech-to-text')
                    ? 'bg-purple-50 text-[#2e31ce]'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Headphones className="h-5 w-5" />
                <span>Speech to Text</span>
              </Link>

              <Link
                href="/learn"
                className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  isActive('/learn')
                    ? 'bg-purple-50 text-[#2e31ce]'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Brain className="h-5 w-5" />
                <span>Learning Center</span>
              </Link>
            </nav>

            <div className="pt-4 border-t border-gray-200">
              <button
                className="flex items-center space-x-3 p-3 rounded-lg text-gray-600 hover:bg-gray-50 w-full"
                onClick={() => {
                  // Handle logout
                }}
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="md:ml-64">
          <main className="p-6">{children}</main>
        </div>
      </div>
    </DesktopOnly>
  );
} 