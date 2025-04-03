'use client';

import React from 'react';
import PDFReader from '@/lib/PDFReader';

export default function ReaderPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-5 px-16">
          <h1 className="text-3xl font-bold mb-3">PDF Reader</h1>
          <p className="text-sm font-light text-gray-600">Upload your PDF file to extract and read its content</p>
        </div>
        <PDFReader />
      </div>
    </div>
  );
} 