'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// Dynamically import PDFReader with no SSR
const PDFReader = dynamic(() => import('@/components/PDFReader'), {
  ssr: false
});

export default function ReaderPage() {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setError(null);
    } else {
      setError('Please select a valid PDF file');
    }
  };

  return (
    <div className="container mx-auto px-4 py-35">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">PDF Reader</h1>
        <div className="flex items-center gap-4">
          <Input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="max-w-xs"
          />
          {file && (
            <Button
              variant="outline"
              onClick={() => setFile(null)}
            >
              Clear File
            </Button>
          )}
        </div>
        {error && (
          <p className="text-red-500 mt-2">{error}</p>
        )}
  
      </div>

      {file && <PDFReader file={file} />}
    </div>
  );
} 