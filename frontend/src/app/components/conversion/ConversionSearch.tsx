"use client"

import type React from "react"
import { useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useSidebar } from "@/components/ui/sidebar"

interface ConversionSearchProps {
  onSearch: (searchTerm: string) => void
}

const ConversionSearch: React.FC<ConversionSearchProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("")
  const { state } = useSidebar()
  const isCollapsed = state === "collapsed"

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)
    onSearch(value)
  }

  return (
    <div className="px-2 py-2">
      <div className="relative">
        <Search
          className={`${isCollapsed ? "mx-auto" : "absolute left-2 top-1/2 -translate-y-1/2"} h-4 w-4 text-muted-foreground`}
        />
        <Input
          type="text"
          placeholder="Search conversions..."
          value={searchTerm}
          onChange={handleChange}
          className={`${isCollapsed ? "opacity-0 w-0 p-0 m-0" : "pl-8 h-8 text-sm"} transition-all duration-200`}
        />
      </div>
    </div>
  )
}

export default ConversionSearch

