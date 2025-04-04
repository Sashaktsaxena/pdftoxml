// app/components/conversion/ConversionResult.tsx
'use client';

import React, { useState } from 'react';

interface ConversionResultProps {
  conversion: {
    _id: string;
    originalFilename: string;
    pdfUrl: string;
    xmlContent: string;
    status: string;
    createdAt: string;
  };
}

const ConversionResult: React.FC<ConversionResultProps> = ({ conversion }) => {
  const [activeTab, setActiveTab] = useState<'xml' | 'preview'>('xml');
  const [copied, setCopied] = useState(false);

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(conversion.xmlContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([conversion.xmlContent], { type: 'text/xml' });
    element.href = URL.createObjectURL(file);
    element.download = conversion.originalFilename.replace(/\.pdf$/i, '.xml');
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (conversion.status === 'processing') {
    return (
      <div className="p-6 bg-white rounded shadow">
        <h3 className="text-lg font-medium mb-2">
          Converting: {conversion.originalFilename}
        </h3>
        <div className="flex items-center mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-blue-600 h-2.5 rounded-full w-1/2 animate-pulse"></div>
          </div>
          <span className="ml-2">Processing...</span>
        </div>
      </div>
    );
  }

  if (conversion.status === 'failed') {
    return (
      <div className="p-6 bg-white rounded shadow border-l-4 border-red-500">
        <h3 className="text-lg font-medium mb-2">
          Conversion Failed: {conversion.originalFilename}
        </h3>
        <p className="text-red-600">
          There was an error converting your PDF. Please try again with a different file.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">
          {conversion.originalFilename}
        </h3>
        <div className="flex space-x-2">
          <button
            onClick={handleCopyToClipboard}
            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm"
          >
            {copied ? 'Copied!' : 'Copy XML'}
          </button>
          <button
            onClick={handleDownload}
            className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm"
          >
            Download XML
          </button>
        </div>
      </div>

      <div className="border-b border-gray-200 mb-4">
        <nav className="flex">
          <button
            className={`mr-4 py-2 px-1 ${
              activeTab === 'xml'
                ? 'border-b-2 border-blue-500 font-medium text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('xml')}
          >
            XML Output
          </button>
          <button
            className={`py-2 px-1 ${
              activeTab === 'preview'
                ? 'border-b-2 border-blue-500 font-medium text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('preview')}
          >
            PDF Preview
          </button>
        </nav>
      </div>

      {activeTab === 'xml' ? (
        <div className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
          <pre className="text-sm font-mono whitespace-pre-wrap">{conversion.xmlContent}</pre>
        </div>
      ) : (
        <div className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
          <iframe
            src={conversion.pdfUrl}
            className="w-full h-96 border-0"
            title="PDF Preview"
          />
        </div>
      )}
    </div>
  );
};

export default ConversionResult;