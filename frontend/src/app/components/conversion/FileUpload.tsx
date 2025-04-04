"use client"

import type React from "react"
import { useState } from "react"
import { useAuth } from "../../contexts/AuthContext"
import api from "../../lib/api"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Upload } from "lucide-react"

interface FileUploadProps {
  onUploadSuccess: (conversionId: string) => void
}

const FileUpload: React.FC<FileUploadProps> = ({ onUploadSuccess }) => {
  const [file, setFile] = useState<File | null>(null)
  const [structureLevel, setStructureLevel] = useState<"basic" | "advanced">("basic")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [progress, setProgress] = useState(0)
  const { token } = useAuth()
  const router = useRouter()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]

      // Validate file type
      if (selectedFile.type !== "application/pdf") {
        setError("Please select a PDF file")
        setFile(null)
        return
      }

      setFile(selectedFile)
      setError("")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!file) {
      setError("Please select a file")
      return
    }

    setLoading(true)
    setProgress(10)
    setError("")

    try {
      const formData = new FormData()
      formData.append("pdf", file)
      formData.append("structureLevel", structureLevel)

      const response = await api.post("/conversions", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "x-auth-token": token as string,
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
            setProgress(percentCompleted)
          }
        },
      })

      onUploadSuccess(response.data._id)
    } catch (err: any) {
      console.error("Upload error:", err)
      setError(err.response?.data?.message || "Upload failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] border-[hsl(var(--border))]">
      <CardHeader className="px-4 py-4 sm:px-6 sm:py-6">
        <CardTitle className="text-lg sm:text-xl text-[hsl(var(--card-foreground))]">
          Upload PDF for Conversion
        </CardTitle>
        <CardDescription className="text-sm text-[hsl(var(--muted-foreground))]">
          Convert your PDF documents to structured XML format
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6">
        {error && (
          <Alert variant="destructive" className="mb-4 border-[hsl(var(--destructive))]">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="pdf" className="text-[hsl(var(--foreground))]">
                PDF File
              </Label>
              <div className="flex items-center gap-2">
                <div className="relative w-full">
                  <Input
                    id="pdf"
                    type="file"
                    onChange={handleFileChange}
                    accept="application/pdf"
                    className="cursor-pointer bg-[hsl(var(--background))] border-[hsl(var(--input))] text-sm w-full"
                  />
                </div>
              </div>
              {file && (
                <p className="text-xs sm:text-sm text-[hsl(var(--muted-foreground))] break-words">
                  Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="structure-level" className="text-[hsl(var(--foreground))]">
                Structure Level
              </Label>
              <Select
                value={structureLevel}
                onValueChange={(value) => setStructureLevel(value as "basic" | "advanced")}
              >
                <SelectTrigger id="structure-level" className="border-[hsl(var(--input))]">
                  <SelectValue placeholder="Select structure level" />
                </SelectTrigger>
                <SelectContent className="bg-[hsl(var(--popover))] text-[hsl(var(--popover-foreground))]">
                  <SelectItem value="basic">Basic (Text only)</SelectItem>
                  <SelectItem value="advanced">Advanced (Preserve structure)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-[hsl(var(--muted-foreground))]">
                Advanced mode preserves document structure including tables and formatting
              </p>
            </div>

            {loading && (
              <div className="space-y-2">
                <div className="h-2 w-full bg-[hsl(var(--secondary))] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[hsl(var(--primary))] transition-all duration-300 ease-in-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-xs text-center text-[hsl(var(--muted-foreground))]">
                  {progress < 100 ? `Uploading: ${progress}%` : "Processing document..."}
                </p>
              </div>
            )}
          </div>

          <Button
            type="submit"
            className="w-full mt-4 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]"
            disabled={loading || !file}
          >
            {loading ? (
              <>Processing...</>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                <span>Convert to XML</span>
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

export default FileUpload

