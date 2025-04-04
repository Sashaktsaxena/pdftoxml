// app/components/conversion/FileUpload.tsx
'use client';

import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../lib/api';
import { useRouter } from 'next/navigation';

interface FileUploadProps {
  onUploadSuccess: (conversionId: string) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onUploadSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [structureLevel, setStructureLevel] = useState<'basic' | 'advanced'>('basic');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);
  const { token } = useAuth();
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Validate file type
      if (selectedFile.type !== 'application/pdf') {
        setError('Please select a PDF file');
        setFile(null);
        return;
      }
      
      setFile(selectedFile);
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please select a file');
      return;
    }
    
    setLoading(true);
    setProgress(10);
    setError('');
    
    try {
      const formData = new FormData();
      formData.append('pdf', file);
      formData.append('structureLevel', structureLevel);
      
      // Debug logs to verify FormData content
      console.log("File being uploaded:", file.name, file.size, file.type);
      console.log("Structure level:", structureLevel);
      
      // This is a better way to check FormData contents
      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }
      
      const response = await api.post('/conversions', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'x-auth-token': token as string
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setProgress(percentCompleted);
          }
        }
      });
      
      onUploadSuccess(response.data._id);
    } catch (err: any) {
      console.error("Upload error:", err);
      setError(err.response?.data?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-8 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Upload PDF for Conversion</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 mb-4 rounded">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">PDF File</label>
          <input
            type="file"
            onChange={handleFileChange}
            className="w-full px-3 py-2 border border-gray-300 rounded"
            accept="application/pdf"
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Structure Level</label>
          <select
            value={structureLevel}
            onChange={(e) => setStructureLevel(e.target.value as 'basic' | 'advanced')}
            className="w-full px-3 py-2 border border-gray-300 rounded"
          >
            <option value="basic">Basic (Text only)</option>
            <option value="advanced">Advanced (Preserve structure)</option>
          </select>
        </div>
        
        {loading && (
          <div className="mb-4">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {progress < 100 ? 'Uploading...' : 'Processing...'}
            </p>
          </div>
        )}
        
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          disabled={loading || !file}
        >
          {loading ? 'Converting...' : 'Convert to XML'}
        </button>
      </form>
    </div>
  );
};

export default FileUpload;