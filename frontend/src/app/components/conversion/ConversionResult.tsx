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
  viewportWidth?: number
  isMobile?: boolean
  isTablet?: boolean
  
  isDesktop?: boolean
  // Removed isDesktop as it's not used
  sidebarOpen?: boolean
}

const ConversionResult: React.FC<ConversionResultProps> = ({ 
  conversion,
  viewportWidth = 1024,
  isMobile = false,
  isTablet = false,
  // Removed isDesktop parameter
  sidebarOpen = true
}) => {
  const [activeTab, setActiveTab] = useState<string>("xml")
  const [copied, setCopied] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const viewerRef = useRef<HTMLDivElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  
  // Calculate appropriate viewer height based on viewport and device type
  const getViewerHeight = (): string => {
    if (isFullscreen) return "h-screen";
    
    // More responsive height calculation
    if (isMobile) return "h-[calc(100vh-250px)]";
    if (isTablet && !sidebarOpen) return "h-[calc(100vh-220px)]";
    if (isTablet && sidebarOpen) return "h-[calc(100vh-230px)]";
    
    // For desktop, calculate based on viewport height
    return viewportWidth > 1440 ? "h-[600px]" : "h-[calc(100vh-250px)]";
  }

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

  // Processing state UI
  if (conversion.status === "processing") {
    return (
      <Card className={`${isMobile ? "border-0 shadow-none" : ""} h-full flex flex-col`}>
        <CardHeader className={`${isMobile ? "px-3 py-2" : "pb-2"} flex-shrink-0`}>
          <CardTitle className="flex items-center text-base sm:text-lg">
            <span className={`${isMobile ? "text-sm" : ""} truncate max-w-full`}>
              Converting: {conversion.originalFilename}
            </span>
            <Badge variant="outline" className="ml-2 bg-yellow-100 text-yellow-800 whitespace-nowrap flex-shrink-0">
              Processing
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className={`${isMobile ? "px-3 py-2" : ""} flex-grow flex items-center justify-center`}>
          <div className="w-full max-w-md">
            <div className="flex items-center mt-2">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-blue-600 h-2.5 rounded-full w-1/2 animate-pulse"></div>
              </div>
              <span className="ml-2 text-sm text-muted-foreground whitespace-nowrap">Processing...</span>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Failed state UI
  if (conversion.status === "failed") {
    return (
      <Card className={`border-red-200 ${isMobile ? "border-0 shadow-none" : ""} h-full flex flex-col`}>
        <CardHeader className={`border-l-4 border-red-500 rounded-tl ${isMobile ? "px-3 py-2" : ""} flex-shrink-0`}>
          <CardTitle className={isMobile ? "text-base" : "text-lg"}>Conversion Failed</CardTitle>
          <CardDescription className="truncate max-w-full">{conversion.originalFilename}</CardDescription>
        </CardHeader>
        <CardContent className={`${isMobile ? "px-3 py-2" : ""} flex-grow flex items-center`}>
          <p className="text-red-600">
            There was an error converting your PDF. Please try again with a different file.
          </p>
        </CardContent>
      </Card>
    )
  }

  // Completed state UI
  return (
    <Card className={`overflow-hidden ${isMobile ? "border-0 shadow-none" : ""} h-full flex flex-col`}>
      <CardHeader className={`pb-2 ${isMobile ? "px-3 py-2" : ""} flex-shrink-0`}>
        <div className="flex justify-between items-center flex-wrap gap-2">
          <div className={isMobile ? "w-full" : ""}>
            <CardTitle className={`${isMobile ? "text-base" : "text-lg"} truncate max-w-full`}>
              {conversion.originalFilename}
            </CardTitle>
            <CardDescription className={isMobile ? "text-xs flex items-center" : "flex items-center"}>
              Converted successfully
              <Badge variant="outline" className="ml-2 bg-green-100 text-green-800 whitespace-nowrap">
                Completed
              </Badge>
            </CardDescription>
          </div>
          
          {/* Action buttons section */}
          <div className={`flex space-x-1 sm:space-x-2 ${isMobile ? "w-full justify-end mt-2" : ""}`}>
            {/* For mobile, only show essential controls */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size={isMobile ? "sm" : "icon"} 
                    className={isMobile ? "px-2" : ""} onClick={handleCopyToClipboard}>
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    {isMobile && <span className="ml-1 text-xs">Copy</span>}
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
                  <Button variant="outline" size={isMobile ? "sm" : "icon"} 
                    className={isMobile ? "px-2" : ""} onClick={handleDownload}>
                    <Download className="h-4 w-4" />
                    {isMobile && <span className="ml-1 text-xs">Download</span>}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Download XML</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Only show fullscreen and external link on larger screens */}
            {!isMobile && (
              <>
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
              </>
            )}
          </div>
        </div>
      </CardHeader>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex-grow flex flex-col">
        <div className={isMobile ? "px-3" : "px-6"}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="xml">XML Output</TabsTrigger>
            <TabsTrigger value="pdf">PDF Preview</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="xml" className="m-0 flex-grow">
          <div ref={viewerRef} className="relative h-full">
            <div className={`bg-gray-50 p-2 sm:p-4 rounded overflow-auto font-mono text-sm ${getViewerHeight()}`}>
              <pre className="whitespace-pre-wrap text-xs sm:text-sm">{conversion.xmlContent}</pre>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="pdf" className="m-0 flex-grow">
          <div ref={viewerRef} className="relative h-full">
            <div className={`bg-gray-50 overflow-hidden ${getViewerHeight()}`}>
              <iframe ref={iframeRef} src={conversion.pdfUrl} className="w-full h-full border-0" title="PDF Preview" />
            </div>

            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center bg-white rounded-full shadow px-2 py-1">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handlePrevPage} disabled={currentPage === 1}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="mx-2 text-xs sm:text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleNextPage} disabled={currentPage === totalPages}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <CardFooter className={`flex justify-between text-xs text-muted-foreground ${isMobile ? "py-2 px-3" : "pt-4 pb-4 px-6"} flex-shrink-0`}>
        <span className="truncate max-w-[45%]">ID: {conversion._id}</span>
        <span>Created: {new Date(conversion.createdAt).toLocaleString()}</span>
      </CardFooter>
    </Card>
  )
}

export default ConversionResult