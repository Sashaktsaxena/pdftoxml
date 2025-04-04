'use client';

import React from 'react';
import RegisterForm from '../RegisterForm';
import Link from 'next/link';

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/">
            <h1 className="text-3xl font-bold text-blue-600">PDF to XML Converter</h1>
          </Link>
          <p className="mt-2 text-gray-600">Create a new account</p>
        </div>
        
        <div className="bg-white p-8 rounded-lg shadow-md">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}