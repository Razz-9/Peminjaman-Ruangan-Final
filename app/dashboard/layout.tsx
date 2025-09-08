"use client"

import type React from "react"
import { useAuth } from "@/contexts/AuthContext"
import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, History, Settings, LogOut, Building2, ClipboardList } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"
import { LanguageToggle } from "@/components/language-toggle"
import { cn } from "@/lib/utils"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isAuthenticated, logout } = useAuth()
  const { t } = useLanguage()
  const router = useRouter()
  const pathname = usePathname()

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
    // Mengubah container utama menjadi flexbox
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <nav className="w-64 bg-white shadow-sm border-r">
        {/* Logo dipindahkan ke sini, di dalam sidebar */}
        <div className="flex h-16 items-center border-b px-6">
          <Link href="/dashboard">
            <img className="h-8 w-auto" src="/images/logo.png" alt="Logo" />
          </Link>
        </div>

        {/* Menu navigasi */}
        <div className="p-4">
          <ul className="space-y-2">
            {navigation.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    pathname === item.href
                      ? "bg-blue-100 text-blue-700 font-semibold"
                      : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                  )}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Wrapper untuk konten utama */}
      <div className="flex flex-1 flex-col">
        {/* Header baru hanya untuk tombol aksi */}
        <header className="flex h-16 items-center justify-end border-b bg-white px-6">
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
        </header>

        {/* Konten Halaman */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}