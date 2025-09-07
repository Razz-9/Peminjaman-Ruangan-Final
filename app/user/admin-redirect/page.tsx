"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, ArrowLeft } from "lucide-react"

export default function AdminRedirect() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/dashboard")
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    )
  }

  if (isAuthenticated) {
    return null // Will redirect to dashboard
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md">
        <Card className="shadow-lg border border-gray-200">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Admin Access Required</h2>
            <p className="text-gray-600 mb-6">You need to login as an administrator to access the admin panel.</p>
            <div className="space-y-3">
              <Button
                onClick={() => router.push("/admin/login")}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                Go to Admin Login
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push("/user")}
                className="w-full border-gray-300 hover:bg-gray-50 bg-transparent"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to User Area
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
