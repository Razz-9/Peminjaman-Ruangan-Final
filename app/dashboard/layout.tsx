"use client"

import type React from "react"

import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Calendar, Home, History, Settings, LogOut, Building2, ClipboardList } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"
import { LanguageToggle } from "@/components/language-toggle"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isAuthenticated, logout } = useAuth()
  const { t } = useLanguage()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/admin/login")
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) {
    return null
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const navigation = [
    { name: t("dashboard.overview"), href: "/dashboard", icon: Home },
    { name: t("dashboard.bookings"), href: "/dashboard/booking", icon: ClipboardList },
    { name: t("dashboard.rooms"), href: "/dashboard/rooms", icon: Building2 },
    { name: t("dashboard.history"), href: "/dashboard/history", icon: History },
    { name: t("dashboard.settings"), href: "/dashboard/settings", icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/dashboard">
                <img className="h-8 w-auto" src="/images/logo.png" alt="Logo" />
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <LanguageToggle />
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center gap-2 bg-transparent"
              >
                <LogOut className="h-4 w-4" />
                {t("dashboard.logout")}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <nav className="w-64 bg-white shadow-sm min-h-screen">
          <div className="p-4">
            <ul className="space-y-2">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-gray-900 transition-colors"
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}