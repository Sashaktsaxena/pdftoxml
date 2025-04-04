// app/dashboard/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import FileUpload from '../components/conversion/FileUpload';
import ConversionResult from '../components/conversion/ConversionResult';
import ConversionsList from '../components/conversion/ConversionsList';
import api from '../lib/api';

interface Conversion {
  _id: string;
  originalFilename: string;
  pdfUrl: string;
  xmlContent: string;
  status: 'processing' | 'completed' | 'failed';
  createdAt: string;
}

const Dashboard: React.FC = () => {
  const { isAuthenticated, loading, token } = useAuth();
  const router = useRouter();
  const [conversions, setConversions] = useState<Conversion[]>([]);
  const [currentConversion, setCurrentConversion] = useState<Conversion | null>(null);
  const [loadingData, setLoadingData] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth/login');
    } else if (isAuthenticated) {
      fetchConversions();
    }
  }, [isAuthenticated, loading, router]);

  const fetchConversions = async () => {
    setLoadingData(true);
    try {
      const response = await api.get('/conversions', {
        headers: {
          'x-auth-token': token as string
        }
      });
      setConversions(response.data);
    }  catch (err) {
        console.error('Failed to fetch conversions', err);
      } finally {
        setLoadingData(false);
      }
    };
  
    const handleUploadSuccess = async (conversionId: string) => {
      try {
        const response = await api.get(`/conversions/${conversionId}`, {
          headers: {
            'x-auth-token': token as string
          }
        });
        setCurrentConversion(response.data);
        fetchConversions(); // Refresh the list
      } catch (err) {
        console.error('Failed to fetch conversion details', err);
      }
    };
  
    const handleConversionSelect = async (conversionId: string) => {
      try {
        const response = await api.get(`/conversions/${conversionId}`, {
          headers: {
            'x-auth-token': token as string
          }
        });
        setCurrentConversion(response.data);
      } catch (err) {
        console.error('Failed to fetch conversion details', err);
      }
    };
  
    if (loading) {
      return <div className="text-center py-12">Loading...</div>;
    }
  
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h1 className="text-3xl font-bold mb-6">PDF to XML Converter</h1>
          
          <FileUpload onUploadSuccess={handleUploadSuccess} />
          
          {currentConversion && (
            <ConversionResult conversion={currentConversion} />
          )}
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">Your Conversions</h2>
          <ConversionsList 
            conversions={conversions} 
            loading={loadingData}
            onSelect={handleConversionSelect}
            selectedId={currentConversion?._id}
          />
        </div>
      </div>
    );
  };
  
  export default Dashboard;