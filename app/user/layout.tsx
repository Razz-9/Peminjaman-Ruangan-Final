"use client"

import type React from "react"
import { useState } from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Calendar, History, Home, Building, LogIn, LogOut, AlertCircle } from 'lucide-react'
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"
import { useLanguage } from "@/contexts/LanguageContext"
import { useToast } from "@/hooks/use-toast"
import { SmartBookingAssistant } from "@/components/smart-booking-assistant"
import { LanguageToggle } from "@/components/language-toggle"

function UserSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, login, logout, isAuthenticated } = useAuth()
  const { t } = useLanguage()
  const { toast } = useToast()

  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [loginError, setLoginError] = useState("")

  const menuItems = [
    { title: t("nav.dashboard"), url: "/user", icon: Home },
    { title: t("nav.roomInfo"), url: "/user/rooms", icon: Building },
    { title: t("nav.myBookings"), url: "/user/history", icon: History },
    { title: t("nav.roomBooking"), url: "/user/booking", icon: Calendar },
  ]

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setLoginError("")

    try {
      const success = await login(credentials.username, credentials.password)

      if (success) {
        toast({
          title: `${t("common.success")} ✅`,
          description: "Selamat datang Admin! Mengarahkan ke panel admin...",
        })
        setIsLoginOpen(false)
        setCredentials({ username: "", password: "" })
        router.push("/dashboard")
      } else {
        setLoginError("Username atau password salah. Silakan coba lagi.")
        toast({
          title: `${t("common.error")} ❌`,
          description: "Username atau password salah. Silakan coba lagi.",
          variant: "destructive",
        })
        setCredentials((prev) => ({ ...prev, password: "" }))
      }
    } catch (error) {
      const errorMsg = "Terjadi kesalahan saat login. Silakan coba lagi."
      setLoginError(errorMsg)
      toast({
        title: `${t("common.error")} ⚠️`,
        description: errorMsg,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully",
    })
  }

  const handleModalClose = (open: boolean) => {
    setIsLoginOpen(open)
    if (!open) {
      setLoginError("")
      setCredentials({ username: "", password: "" })
    }
  }

  return (
    <Sidebar className="border-r border-gray-200 bg-white">
      <SidebarHeader className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-center flex-1">
            <img src="/images/logo.png" alt="PELNI Logo" className="h-8 w-auto" />
          </div>
          <LanguageToggle />
        </div>
      </SidebarHeader>
      <SidebarContent className="bg-white">
        <SidebarMenu className="space-y-1 p-4">
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.url}
                className={`
                  text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-all duration-200
                  data-[active=true]:bg-blue-100 data-[active=true]:text-blue-700 data-[active=true]:font-medium
                `}
              >
                <Link href={item.url} className="flex items-center gap-3 p-3">
                  <item.icon className="w-5 h-5" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}

          {/* Admin Access Section */}
          <SidebarMenuItem className="mt-8 pt-4 border-t border-gray-200">
            {isAuthenticated ? (
              <>
                <SidebarMenuButton
                  asChild
                  className="text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-all duration-200 mb-2"
                >
                  <Link href="/dashboard" className="flex items-center gap-3 p-3">
                    <Building className="w-5 h-5" />
                    <span>{t("nav.adminPanel")}</span>
                  </Link>
                </SidebarMenuButton>
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  className="w-full justify-start text-gray-700 hover:bg-red-50 hover:text-red-700 rounded-lg transition-all duration-200 p-3"
                >
                  <LogOut className="w-5 h-5 mr-3" />
                  <span>{t("nav.logoutAdmin")}</span>
                </Button>
              </>
            ) : (
              <Button
                onClick={() => setIsLoginOpen(true)}
                variant="ghost"
                className="w-full justify-start text-gray-700 hover:bg-green-50 hover:text-green-700 rounded-lg transition-all duration-200 p-3"
              >
                <LogIn className="w-5 h-5 mr-3" />
                <span>{t("nav.adminLogin")}</span>
              </Button>
            )}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>

      {/* Login Modal */}
      <Dialog open={isLoginOpen} onOpenChange={handleModalClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-semibold text-gray-900">
              {t("nav.adminLogin")}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleLogin} className="space-y-4 mt-4">
            {loginError && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                <p className="text-sm text-red-700">{loginError}</p>
              </div>
            )}

            <div>
              <Label htmlFor="modal-username" className="text-gray-700 font-medium">
                Username
              </Label>
              <Input
                id="modal-username"
                value={credentials.username}
                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                required
                disabled={isLoading}
                className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter admin username"
              />
            </div>

            <div>
              <Label htmlFor="modal-password" className="text-gray-700 font-medium">
                Password
              </Label>
              <Input
                id="modal-password"
                type="password"
                value={credentials.password}
                onChange={(e) => {
                  setCredentials({ ...credentials, password: e.target.value })
                  if (loginError) setLoginError("")
                }}
                required
                disabled={isLoading}
                className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter admin password"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white" disabled={isLoading}>
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {t("common.loading")}
                  </div>
                ) : (
                  "Login"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleModalClose(false)}
                disabled={isLoading}
                className="flex-1 border-gray-300 hover:bg-gray-50 bg-transparent"
              >
                {t("common.cancel")}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </Sidebar>
  )
}

export default function UserLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gray-50">
        <UserSidebar />
        <main className="flex-1">
          <div className="p-6">{children}</div>
          <SmartBookingAssistant />
        </main>
      </div>
    </SidebarProvider>
  )
}
