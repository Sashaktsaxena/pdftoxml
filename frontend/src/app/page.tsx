// app/page.tsx
'use client';

import React from 'react';
import { useAuth } from './contexts/AuthContext';
import Link from 'next/link';

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
          <span className="text-blue-600">PDF to XML</span> Converter
        </h1>
        <p className="mt-3 text-xl text-gray-500 sm:mt-5">
          Transform your PDF documents into structured XML format
        </p>
        <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center">
          {isAuthenticated ? (
            <Link href="/dashboard">
              <div className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10">
                Go to Dashboard
              </div>
            </Link>
          ) : (
            <div className="space-y-4 sm:space-y-0 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5">
              <Link href="components/auth/login">
                <div className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10 shadow">
                  Login
                </div>
              </Link>
              <Link href="components/auth/register">
                <div className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10 shadow">
                  Register
                </div>
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="mt-16 max-w-2xl">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Features</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              PDF to XML Conversion
            </h3>
            <p className="text-gray-500">
              Convert your PDF documents to structured XML format with our powerful conversion engine.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Structure Preservation
            </h3>
            <p className="text-gray-500">
              Maintain document structure with options for basic or advanced conversion.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Conversion History
            </h3>
            <p className="text-gray-500">
              Access your previous conversions anytime from your personalized dashboard.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Secure Storage
            </h3>
            <p className="text-gray-500">
              Your documents are securely stored and accessible only to you.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}