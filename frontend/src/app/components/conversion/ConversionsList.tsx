// app/components/conversion/ConversionsList.tsx
'use client';

import React from 'react';
import { formatDistanceToNow } from 'date-fns';

interface ConversionsListProps {
  conversions: Array<{
    _id: string;
    originalFilename: string;
    status: string;
    createdAt: string;
  }>;
  loading: boolean;
  onSelect: (id: string) => void;
  selectedId?: string;
}

const ConversionsList: React.FC<ConversionsListProps> = ({
  conversions,
  loading,
  onSelect,
  selectedId
}) => {
  if (loading) {
    return (
      <div className="bg-white rounded shadow p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
        </div>
      </div>
    );
  }

  if (conversions.length === 0) {
    return (
      <div className="bg-white rounded shadow p-6 text-center">
        <p className="text-gray-500">No conversions yet</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded shadow overflow-hidden">
      <ul className="divide-y divide-gray-200">
        {conversions.map((conversion) => (
          <li 
            key={conversion._id}
            className={`cursor-pointer hover:bg-gray-50 ${
              selectedId === conversion._id ? 'bg-blue-50' : ''
            }`}
            onClick={() => onSelect(conversion._id)}
          >
            <div className="px-4 py-4 flex items-start">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {conversion.originalFilename}
                </p>
                <p className="text-sm text-gray-500">
                  {formatDistanceToNow(new Date(conversion.createdAt))} ago
                </p>
              </div>
              <div>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    conversion.status === 'completed'
                      ? 'bg-green-100 text-green-800'
                      : conversion.status === 'processing'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {conversion.status}
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ConversionsList;