"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { useAuth } from "../contexts/AuthContext"
import { useRouter } from "next/navigation"
import FileUpload from "../components/conversion/FileUpload"
import ConversionResult from "../components/conversion/ConversionResult"
import api from "../lib/api"
import { AppSidebar } from "../components/sidebar/app-sidebar"
import { SidebarProvider, SidebarTrigger, SidebarInset, SidebarRail } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Menu, Upload, Plus, ChevronLeft } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Conversion {
  _id: string
  originalFilename: string
  pdfUrl: string
  xmlContent: string
  status: "processing" | "completed" | "failed"
  createdAt: string
}

const Dashboard: React.FC = () => {
  const { isAuthenticated, loading, token, user } = useAuth()
  const router = useRouter()
  const [conversions, setConversions] = useState<Conversion[]>([])
  const [currentConversion, setCurrentConversion] = useState<Conversion | null>(null)
  const [loadingData, setLoadingData] = useState(false)
  const [showUploadForm, setShowUploadForm] = useState(false)
  const [activeTab, setActiveTab] = useState<string>("result")
  const [viewportWidth, setViewportWidth] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 1024)

  // Define handleConversionSelect first before it's used in fetchConversions
  const handleConversionSelect = useCallback(async (conversionId: string) => {
    try {
      const response = await api.get(`/conversions/${conversionId}`, {
        headers: {
          "x-auth-token": token as string,
        },
      })
      setCurrentConversion(response.data)
      
      // For mobile layouts, switch to result tab after selection
      if (viewportWidth < 768) {
        setActiveTab("result")
      }
    } catch (err) {
      console.error("Failed to fetch conversion details", err)
    }
  }, [token, viewportWidth])

  // Now fetchConversions can safely reference handleConversionSelect
  const fetchConversions = useCallback(async () => {
    setLoadingData(true)
    try {
      const response = await api.get("/conversions", {
        headers: {
          "x-auth-token": token as string,
        },
      })
      setConversions(response.data)

      // Set the most recent conversion as current if none is selected
      if (response.data.length > 0 && !currentConversion) {
        const mostRecent = response.data.sort(
          (a: Conversion, b: Conversion) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )[0]
        handleConversionSelect(mostRecent._id)
      }
    } catch (err) {
      console.error("Failed to fetch conversions", err)
    } finally {
      setLoadingData(false)
    }
  }, [token, currentConversion, handleConversionSelect])

  // Check authentication
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/auth/login")
    } else if (isAuthenticated) {
      fetchConversions()
    }
  }, [isAuthenticated, loading, router, fetchConversions])

  // Track viewport size for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setViewportWidth(window.innerWidth)
      
      // Auto adjust layout based on screen size
      if (window.innerWidth >= 1024) {
        setShowUploadForm(true)
        setActiveTab("result")
      } else if (window.innerWidth < 768) {
        setShowUploadForm(!currentConversion)
        setActiveTab(currentConversion ? "result" : "upload")
      }
    }

    // Initial setup
    handleResize()

    // Add event listener
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [currentConversion])

  const handleUploadSuccess = useCallback(async (conversionId: string) => {
    try {
      const response = await api.get(`/conversions/${conversionId}`, {
        headers: {
          "x-auth-token": token as string,
        },
      })
      setCurrentConversion(response.data)
      
      // For mobile layouts, switch to result tab after upload
      if (viewportWidth < 768) {
        setActiveTab("result")
      }
      
      fetchConversions() // Refresh the list
    } catch (err) {
      console.error("Failed to fetch conversion details", err)
    }
  }, [token, viewportWidth, fetchConversions])

  const toggleUploadForm = () => {
    if (viewportWidth < 768) {
      setActiveTab(activeTab === "upload" ? "result" : "upload")
    } else {
      setShowUploadForm(!showUploadForm)
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Mobile view uses tabs for navigation between upload and result
  const renderMobileView = () => (
    <div className="w-full h-full flex flex-col">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex-grow flex flex-col">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="upload">Upload</TabsTrigger>
          <TabsTrigger value="result">Result</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="mt-0 flex-grow">
          <FileUpload onUploadSuccess={handleUploadSuccess} />
        </TabsContent>

        <TabsContent value="result" className="mt-0 flex-grow flex flex-col">
          {currentConversion ? (
            <div className="bg-card rounded-lg border border-border flex-grow">
              <ConversionResult 
                conversion={currentConversion} 
                viewportWidth={viewportWidth}
                isMobile={true}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full min-h-[250px] bg-card rounded-lg border-2 border-dashed border-border">
              <div className="text-center p-4">
                <h3 className="text-base font-medium text-card-foreground mb-2">
                  No conversion selected
                </h3>
                <p className="text-xs text-muted-foreground mb-4">
                  Upload a PDF file or select a previous conversion
                </p>
                <Button variant="outline" onClick={() => setActiveTab("upload")}>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload a PDF
                </Button>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )

  // Tablet view uses a collapsible sidebar with a list view
  const renderTabletView = () => (
    <div className="flex flex-col md:flex-row gap-4 w-full h-full">
      {showUploadForm && (
        <div className="w-full md:w-1/3 lg:w-1/4">
          <FileUpload onUploadSuccess={handleUploadSuccess} />
          <div className="mt-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={toggleUploadForm}
              className="w-full"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Hide Upload Form
            </Button>
          </div>
        </div>
      )}

      <div className={`w-full h-full transition-all duration-300 ${showUploadForm ? 'md:w-2/3 lg:w-3/4' : 'w-full'}`}>
        {!showUploadForm && (
          <div className="mb-4">
            <Button 
              variant="outline" 
              onClick={toggleUploadForm}
            >
              <Plus className="h-4 w-4 mr-2" />
              New Conversion
            </Button>
          </div>
        )}
        
        {currentConversion ? (
          <div className="bg-card rounded-lg border border-border h-full">
            <ConversionResult 
              conversion={currentConversion} 
              viewportWidth={viewportWidth}
              isTablet={true}
              sidebarOpen={showUploadForm}
            />
          </div>
        ) : (
          <div className="flex items-center justify-center h-full min-h-[300px] bg-card rounded-lg border-2 border-dashed border-border">
            <div className="text-center p-6">
              <h3 className="text-lg font-medium text-card-foreground mb-2">
                No conversion selected
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Upload a PDF file or select a previous conversion
              </p>
              <Button variant="outline" onClick={() => setShowUploadForm(true)}>
                <Upload className="h-4 w-4 mr-2" />
                Upload a PDF
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )

  // Desktop view uses a full sidebar with the main content area
  const renderDesktopView = () => (
    <div className="flex flex-col lg:flex-row gap-4 w-full h-full">
      {showUploadForm && (
        <div className="w-full lg:w-1/3 xl:w-1/4">
          <FileUpload onUploadSuccess={handleUploadSuccess} />
        </div>
      )}

      <div className={`w-full h-full transition-all duration-300 ${showUploadForm ? 'lg:w-2/3 xl:w-3/4' : 'w-full'}`}>
        {currentConversion ? (
          <div className="bg-card rounded-lg border border-border h-full">
            <ConversionResult 
              conversion={currentConversion} 
              viewportWidth={viewportWidth}
              isDesktop={true}
              sidebarOpen={showUploadForm}
            />
          </div>
        ) : (
          <div className="flex items-center justify-center h-full min-h-[300px] bg-card rounded-lg border-2 border-dashed border-border">
            <div className="text-center p-6">
              <h3 className="text-lg font-medium text-card-foreground mb-2">
                No conversion selected
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Upload a PDF file or select a previous conversion from the sidebar
              </p>
              <Button variant="outline" onClick={() => {
                if (!showUploadForm) {
                  setShowUploadForm(true)
                } else {
                  document.getElementById("pdf")?.click()
                }
              }}>
                <Upload className="h-4 w-4 mr-2" />
                Upload a PDF
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <SidebarProvider defaultOpen={viewportWidth >= 1024}>
      <div className="flex h-screen bg-background">
        <AppSidebar
          conversions={conversions}
          onSelect={handleConversionSelect}
          selectedId={currentConversion?._id}
          loading={loadingData}
          username={user?.name || "User"}
        />

        <SidebarInset className="transition-all duration-300 ease-in-out bg-background w-full h-full">
          <div className="p-3 sm:p-6 w-full h-full max-h-screen flex flex-col">
            <header className="flex justify-between items-center mb-4 sm:mb-6 flex-shrink-0">
              <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">PDF to XML Converter</h1>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Convert your PDF documents to structured XML format
                </p>
              </div>
              <div className="flex items-center gap-2">
                {viewportWidth >= 768 && !showUploadForm && (
                  <Button 
                    variant="outline" 
                    className="flex items-center" 
                    onClick={toggleUploadForm}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    <span>New</span>
                  </Button>
                )}
                <SidebarTrigger className="md:hidden">
                  <Menu className="h-5 w-5" />
                </SidebarTrigger>
              </div>
            </header>

            <div className="flex-grow overflow-hidden flex flex-col">
              {/* Responsive content based on viewport size */}
              {viewportWidth < 768 ? renderMobileView() : 
              viewportWidth < 1024 ? renderTabletView() : 
              renderDesktopView()}
            </div>
          </div>
        </SidebarInset>
        <SidebarRail />
      </div>
    </SidebarProvider>
  )
}

export default Dashboard