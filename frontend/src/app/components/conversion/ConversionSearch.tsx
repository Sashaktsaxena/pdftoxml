"use client"

import React, { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

interface ConversionSearchProps {
  onSearch: (searchTerm: string) => void
}

const ConversionSearch: React.FC<ConversionSearchProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)
    onSearch(value)
  }

  return (
    <div className="px-2 py-2">
      <div className="relative">
        <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search conversions..."
          value={searchTerm}
          onChange={handleChange}
          className="pl-8 h-8 text-sm"
        />
      </div>
    </div>
  )
}

export default ConversionSearch