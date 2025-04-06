'use client';

import DashboardLayout from '@/components/DashboardLayout';
import PDFReader from '@/lib/PDFReader';

export default function ReaderPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">PDF Reader</h1>
            <p className="text-gray-600 mt-2">Upload and read your PDF documents with AI assistance</p>
          </div>
        </div>

        {/* PDF Reader Component */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <PDFReader />
        </div>
      </div>
    </DashboardLayout>
  );
} 