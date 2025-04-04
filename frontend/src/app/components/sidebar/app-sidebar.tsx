"use client"
import { useRef, useState, useEffect } from "react"
import { FileText, Home, Settings, User } from "lucide-react"
import Link from "next/link"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useIsMobile } from "@/hooks/use-mobile"
import ConversionSearch from "../conversion/ConversionSearch"

interface Conversion {
  _id: string
  originalFilename: string
  status: string
  createdAt: string
}

interface AppSidebarProps {
  conversions: Conversion[]
  onSelect: (id: string) => void
  selectedId?: string
  loading?: boolean
  username?: string
}

// The hover trigger area that appears on the left edge of the screen
const SidebarTriggerArea = () => {
  const { setOpen } = useSidebar()
  const isMobile = useIsMobile()

  if (isMobile) return null

  return (
    <div
      className="fixed top-0 left-0 w-2 h-full z-30 hover:bg-blue-100 transition-colors"
      onMouseEnter={() => setOpen(true)}
      aria-hidden="true"
    />
  )
}

export function AppSidebar({ conversions, onSelect, selectedId, loading, username = "User" }: AppSidebarProps) {
  const sidebarRef = useRef<HTMLDivElement>(null)
  const { open, setOpen, state } = useSidebar()
  const isMobile = useIsMobile()
  const [filteredConversions, setFilteredConversions] = useState<Conversion[]>(conversions)
  const isCollapsed = state === "collapsed"

  // Handle mouse events for desktop
  const handleMouseEnter = () => {
    if (!isMobile) setOpen(true)
  }

  const handleMouseLeave = () => {
    if (!isMobile) setOpen(false)
  }

  // Handle search
  const handleSearch = (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setFilteredConversions(conversions)
    } else {
      const filtered = conversions.filter((conversion) =>
        conversion.originalFilename.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredConversions(filtered)
    }
  }

  // Update filtered conversions when the original list changes
  useEffect(() => {
    setFilteredConversions(conversions)
  }, [conversions])

  return (
    <>
      <SidebarTriggerArea />
      <div ref={sidebarRef} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className="h-full">
        <Sidebar
          collapsible={isMobile ? "offcanvas" : "icon"}
          variant="sidebar"
          className="bg-[hsl(var(--sidebar-background))]"
        >
          <SidebarHeader>
            <div className="flex items-center gap-2 px-2 py-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback>{username.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className={`flex flex-col ${isCollapsed ? "opacity-0 w-0" : ""} transition-all duration-200`}>
                <span className="text-sm font-medium truncate">{username}</span>
              </div>
            </div>
          </SidebarHeader>
          <SidebarSeparator />
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel className={isCollapsed ? "sr-only" : ""}>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Home">
                      <Link href="/">
                        <Home className="h-4 w-4" />
                        <span>Home</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Dashboard">
                      <Link href="/dashboard">
                        <Settings className="h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Profile">
                      <Link href="/profile">
                        <User className="h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            <SidebarSeparator />
            <SidebarGroup>
              <SidebarGroupLabel className={isCollapsed ? "sr-only" : ""}>Recent Conversions</SidebarGroupLabel>
              <ConversionSearch onSearch={handleSearch} />
              <SidebarGroupContent>
                <SidebarMenu>
                  {loading ? (
                    Array(3)
                      .fill(0)
                      .map((_, i) => (
                        <SidebarMenuItem key={i}>
                          <div className="animate-pulse p-2">
                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                            <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                          </div>
                        </SidebarMenuItem>
                      ))
                  ) : filteredConversions.length === 0 ? (
                    <SidebarMenuItem>
                      <div className={`p-2 text-sm text-muted-foreground ${isCollapsed ? "hidden" : ""}`}>
                        {conversions.length === 0 ? "No conversions yet" : "No matching conversions"}
                      </div>
                    </SidebarMenuItem>
                  ) : (
                    filteredConversions.map((conversion) => (
                      <SidebarMenuItem key={conversion._id}>
                        <SidebarMenuButton
                          isActive={selectedId === conversion._id}
                          onClick={() => onSelect(conversion._id)}
                          tooltip={conversion.originalFilename}
                        >
                          <FileText className="h-4 w-4 flex-shrink-0" />
                          <span className="truncate">{conversion.originalFilename}</span>
                          {!isCollapsed && (
                            <SidebarMenuBadge
                              className={`${
                                conversion.status === "completed"
                                  ? "bg-green-100 text-green-800"
                                  : conversion.status === "processing"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                              } text-xs whitespace-nowrap`}
                            >
                              {conversion.status}
                            </SidebarMenuBadge>
                          )}
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))
                  )}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>{/* Footer content if needed */}</SidebarFooter>
        </Sidebar>
      </div>
    </>
  )
}

