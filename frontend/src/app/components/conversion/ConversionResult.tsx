"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { ChevronLeft, ChevronRight, Copy, Download, ExternalLink, Maximize, Minimize, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface ConversionResultProps {
  conversion: {
    _id: string
    originalFilename: string
    pdfUrl: string
    xmlContent: string
    status: string
    createdAt: string
  }
}

const ConversionResult: React.FC<ConversionResultProps> = ({ conversion }) => {
  const [activeTab, setActiveTab] = useState<string>("xml")
  const [copied, setCopied] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const viewerRef = useRef<HTMLDivElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  // Function to handle fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      viewerRef.current?.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  // Listen for fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
    }
  }, [])

  // Simulate getting total pages from PDF
  useEffect(() => {
    // In a real implementation, you would get this from the PDF.js library
    setTotalPages(Math.floor(Math.random() * 5) + 1)
  }, [conversion.pdfUrl])

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(conversion.xmlContent)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const element = document.createElement("a")
    const file = new Blob([conversion.xmlContent], { type: "text/xml" })
    element.href = URL.createObjectURL(file)
    element.download = conversion.originalFilename.replace(/\.pdf$/i, ".xml")
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  if (conversion.status === "processing") {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <span>Converting: {conversion.originalFilename}</span>
            <Badge variant="outline" className="ml-2 bg-yellow-100 text-yellow-800">
              Processing
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-blue-600 h-2.5 rounded-full w-1/2 animate-pulse"></div>
            </div>
            <span className="ml-2 text-sm text-muted-foreground">Processing...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (conversion.status === "failed") {
    return (
      <Card className="border-red-200">
        <CardHeader className="border-l-4 border-red-500 rounded-tl">
          <CardTitle>Conversion Failed</CardTitle>
          <CardDescription>{conversion.originalFilename}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-red-600">
            There was an error converting your PDF. Please try again with a different file.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>{conversion.originalFilename}</CardTitle>
            <CardDescription>
              Converted successfully
              <Badge variant="outline" className="ml-2 bg-green-100 text-green-800">
                Completed
              </Badge>
            </CardDescription>
          </div>
          <div className="flex space-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={handleCopyToClipboard}>
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{copied ? "Copied!" : "Copy XML"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={handleDownload}>
                    <Download className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Download XML</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={toggleFullscreen}>
                    {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isFullscreen ? "Exit Fullscreen" : "Fullscreen"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" asChild>
                    <a href={conversion.pdfUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Open in New Tab</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </CardHeader>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="px-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="xml">XML Output</TabsTrigger>
            <TabsTrigger value="pdf">PDF Preview</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="xml" className="m-0">
          <div ref={viewerRef} className="relative">
            <div className="bg-gray-50 p-4 rounded overflow-auto h-[500px] font-mono text-sm">
              <pre className="whitespace-pre-wrap">{conversion.xmlContent}</pre>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="pdf" className="m-0">
          <div ref={viewerRef} className="relative">
            <div className="bg-gray-50 h-[500px] overflow-hidden">
              <iframe ref={iframeRef} src={conversion.pdfUrl} className="w-full h-full border-0" title="PDF Preview" />
            </div>

            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center bg-white rounded-full shadow px-2 py-1">
              <Button variant="ghost" size="icon" onClick={handlePrevPage} disabled={currentPage === 1}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="mx-2 text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <Button variant="ghost" size="icon" onClick={handleNextPage} disabled={currentPage === totalPages}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <CardFooter className="flex justify-between pt-4 pb-4 px-6 text-xs text-muted-foreground">
        <span>ID: {conversion._id}</span>
        <span>Created: {new Date(conversion.createdAt).toLocaleString()}</span>
      </CardFooter>
    </Card>
  )
}

export default ConversionResult

