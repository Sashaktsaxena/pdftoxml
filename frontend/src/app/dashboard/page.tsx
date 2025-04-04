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
import { Menu } from "lucide-react"

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

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/auth/login")
    } else if (isAuthenticated) {
      fetchConversions()
    }
  }, [isAuthenticated, loading, router])

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
    } catch (err) {
      console.error("Failed to fetch conversion details", err)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <SidebarProvider defaultOpen={false}>
      <div className="flex min-h-screen bg-[hsl(var(--background))]">
        <AppSidebar
          conversions={conversions}
          onSelect={handleConversionSelect}
          selectedId={currentConversion?._id}
          loading={loadingData}
          username={user?.name || "User"}
        />

        <SidebarInset className="transition-all duration-300 ease-in-out bg-[hsl(var(--background))]">
          <div className="p-6 w-full">
            <header className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-3xl font-bold">PDF to XML Converter</h1>
                <p className="text-muted-foreground">Convert your PDF documents to structured XML format</p>
              </div>
              <SidebarTrigger className="md:hidden">
                <Menu className="h-6 w-6" />
              </SidebarTrigger>
            </header>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
  <div className="md:col-span-1">
    <FileUpload onUploadSuccess={handleUploadSuccess} />
  </div>

  <div className="md:col-span-1 lg:col-span-2">
    {currentConversion ? (
      <ConversionResult conversion={currentConversion} />
    ) : (
      <div className="flex items-center justify-center h-full min-h-[300px] bg-[hsl(var(--card))] rounded-lg border-2 border-dashed border-[hsl(var(--border))]">
        <div className="text-center p-6">
          <h3 className="text-lg font-medium text-[hsl(var(--card-foreground))] mb-2">No conversion selected</h3>
          <p className="text-sm text-[hsl(var(--muted-foreground))] mb-4">
            Upload a PDF file or select a previous conversion from the sidebar
          </p>
          <Button variant="outline" onClick={() => document.getElementById("pdf")?.click()}>
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

