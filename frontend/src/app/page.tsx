"use client"
import { useAuth } from "./contexts/AuthContext"
import Link from "next/link"
import { ArrowRight, FileText, Lock, History, LayoutGrid } from "lucide-react"
import { Button } from "@/components/ui/button"
import Footer from "./components/ui/footer"


export default function Home() {
  const { isAuthenticated } = useAuth()

  return (
    <div className="flex flex-col min-h-screen">


      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-b from-blue-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
            <div className="text-center md:text-left md:flex md:items-center md:justify-between">
              <div className="md:max-w-2xl h-140">
                <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block text-blue-600">PDF to XML</span>
                  <span className="block">Conversion Made Simple</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                  Transform your PDF documents into structured XML format with our powerful, easy-to-use conversion
                  tool. Perfect for developers, data analysts, and content managers.
                </p>
                <div className="mt-8 sm:flex sm:justify-center md:justify-start">
                  {isAuthenticated ? (
                    <div className="rounded-md shadow">
                      <Button asChild size="lg" className="w-full sm:w-auto">
                        <Link href="/dashboard" className="flex items-center">
                          Go to Dashboard
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4 sm:space-y-0 sm:inline-grid sm:grid-cols-2 sm:gap-8">
                      <Button asChild variant="outline" size="lg">
                        <Link href="/components/auth/login">Login</Link>
                      </Button>
                      <Button asChild size="lg">
                        <Link href="/components/auth/register">Register</Link>
                      </Button>
                    </div>
                  )}
                </div>

              </div>
              {/* <div className="hidden md:block md:ml-10 md:mt-0 mt-10">
                <img
                  src="/placeholder.svg?height=350&width=350"
                  alt="PDF to XML Conversion"
                  className="w-full max-w-md"
                />
              </div> */}
            </div>
          </div>

          {/* Wave Divider */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-auto">
              <path
                fill="#ffffff"
                fillOpacity="1"
                d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,149.3C960,160,1056,160,1152,138.7C1248,117,1344,75,1392,53.3L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
              ></path>
            </svg>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Powerful Features</h2>
              <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
                Everything you need to convert and manage your PDF documents
              </p>
            </div>

            <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-100">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">PDF to XML Conversion</h3>
                <p className="text-gray-500">
                  Convert your PDF documents to structured XML format with our powerful conversion engine.
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-100">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  <LayoutGrid className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Structure Preservation</h3>
                <p className="text-gray-500">
                  Maintain document structure with options for basic or advanced conversion.
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-100">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  <History className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Conversion History</h3>
                <p className="text-gray-500">
                  Access your previous conversions anytime from your personalized dashboard.
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-100">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  <Lock className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure Storage</h3>
                <p className="text-gray-500">Your documents are securely stored and accessible only to you.</p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">How It Works</h2>
              <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
                Convert your PDFs to XML in three simple steps
              </p>
            </div>

            <div className="mt-16 grid gap-8 md:grid-cols-3">
              <div className="relative">
                <div className="absolute top-0 left-1/2 -ml-0.5 h-full w-0.5 bg-gray-200 hidden md:block"></div>
                <div className="relative bg-white rounded-xl shadow-md p-6 z-10">
                  <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center mb-4 font-bold">
                    1
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Your PDF</h3>
                  <p className="text-gray-500">Select and upload the PDF document you want to convert to XML.</p>
                </div>
              </div>

              <div className="relative">
                <div className="absolute top-0 left-1/2 -ml-0.5 h-full w-0.5 bg-gray-200 hidden md:block"></div>
                <div className="relative bg-white rounded-xl shadow-md p-6 z-10">
                  <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center mb-4 font-bold">
                    2
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Choose Structure Level</h3>
                  <p className="text-gray-500">Select basic or advanced structure preservation based on your needs.</p>
                </div>
              </div>

              <div className="relative">
                <div className="relative bg-white rounded-xl shadow-md p-6 z-10">
                  <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center mb-4 font-bold">
                    3
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Download XML Result</h3>
                  <p className="text-gray-500">Get your structured XML file ready for use in your applications.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-blue-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">Ready to Convert Your PDFs?</h2>
            <p className="mt-4 max-w-2xl text-xl text-blue-100 mx-auto">
              Join thousands of users who trust our service for their PDF to XML conversion needs.
            </p>

          </div>
          <div className="mt-8">
              {isAuthenticated ? (
                <Button asChild size="lg" variant="secondary">
                  <Link href="/dashboard">Go to Dashboard</Link>
                </Button>
              ) : (
                <Button asChild size="lg" variant="secondary">
                  <Link href="/auth/register">Get Started for Free</Link>
                </Button>
              )}
            </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

