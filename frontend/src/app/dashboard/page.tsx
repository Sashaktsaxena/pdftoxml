"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import { useRouter } from "next/navigation"
import FileUpload from "../components/conversion/FileUpload"
import ConversionResult from "../components/conversion/ConversionResult"
import api from "../lib/api"
import { AppSidebar } from "../components/sidebar/app-sidebar"
import { SidebarProvider, SidebarTrigger, SidebarInset, SidebarRail } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Menu, Upload, Plus } from "lucide-react"

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

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/auth/login")
    } else if (isAuthenticated) {
      fetchConversions()
    }
  }, [isAuthenticated, loading, router])

  // Effect to handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setShowUploadForm(true)
      } else {
        setShowUploadForm(!currentConversion)
      }
    }

    // Initial setup
    handleResize()

    // Add event listener
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [currentConversion])

  const fetchConversions = async () => {
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
  }

  const handleUploadSuccess = async (conversionId: string) => {
    try {
      const response = await api.get(`/conversions/${conversionId}`, {
        headers: {
          "x-auth-token": token as string,
        },
      })
      setCurrentConversion(response.data)
      if (window.innerWidth < 768) {
        setShowUploadForm(false)
      }
      fetchConversions() // Refresh the list
    } catch (err) {
      console.error("Failed to fetch conversion details", err)
    }
  }

  const handleConversionSelect = async (conversionId: string) => {
    try {
      const response = await api.get(`/conversions/${conversionId}`, {
        headers: {
          "x-auth-token": token as string,
        },
      })
      setCurrentConversion(response.data)
      if (window.innerWidth < 768) {
        setShowUploadForm(false)
      }
    } catch (err) {
      console.error("Failed to fetch conversion details", err)
    }
  }

  const toggleUploadForm = () => {
    setShowUploadForm(!showUploadForm)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <SidebarProvider defaultOpen={window.innerWidth >= 1024}>
      <div className="flex min-h-screen bg-[hsl(var(--background))]">
        <AppSidebar
          conversions={conversions}
          onSelect={handleConversionSelect}
          selectedId={currentConversion?._id}
          loading={loadingData}
          username={user?.name || "User"}
        />

        <SidebarInset className="transition-all duration-300 ease-in-out bg-[hsl(var(--background))] w-full">
          <div className="p-3 sm:p-6 w-full">
            <header className="flex justify-between items-center mb-4">
              <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">PDF to XML Converter</h1>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Convert your PDF documents to structured XML format
                </p>
              </div>
              <div className="flex items-center gap-2">
                {!showUploadForm && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="md:hidden flex items-center" 
                    onClick={toggleUploadForm}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    <span className="hidden xs:inline">New</span>
                  </Button>
                )}
                <SidebarTrigger className="md:hidden">
                  <Menu className="h-5 w-5" />
                </SidebarTrigger>
              </div>
            </header>

            <div className="flex flex-col lg:flex-row gap-4">
              {showUploadForm && (
                <div className="w-full lg:w-1/3 xl:w-1/4">
                  <FileUpload onUploadSuccess={handleUploadSuccess} />
                  {window.innerWidth < 768 && currentConversion && (
                    <div className="flex justify-center mt-4">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={toggleUploadForm}
                      >
                        Hide Upload Form
                      </Button>
                    </div>
                  )}
                </div>
              )}

              <div className={`w-full ${showUploadForm ? 'lg:w-2/3 xl:w-3/4' : 'w-full'}`}>
                {currentConversion ? (
                  <ConversionResult conversion={currentConversion} />
                ) : (
                  <div className="flex items-center justify-center h-full min-h-[250px] sm:min-h-[300px] bg-[hsl(var(--card))] rounded-lg border-2 border-dashed border-[hsl(var(--border))]">
                    <div className="text-center p-4 sm:p-6">
                      <h3 className="text-base sm:text-lg font-medium text-[hsl(var(--card-foreground))] mb-2">
                        No conversion selected
                      </h3>
                      <p className="text-xs sm:text-sm text-[hsl(var(--muted-foreground))] mb-4">
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
          </div>
        </SidebarInset>
        <SidebarRail />
      </div>
    </SidebarProvider>
  )
}

export default Dashboard