"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Shield } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import { useData } from "@/contexts/DataContext"
import { useAuth } from "@/contexts/AuthContext"
import { useLanguage } from "@/contexts/LanguageContext"
import { format } from "date-fns"
import Link from "next/link"

// Dynamic room colors based on room ID
const getRoomColor = (roomId: string, rooms: any[]) => {
  const roomIndex = rooms.findIndex((room) => room.id === roomId)
  const colors = [
    "bg-blue-100 text-blue-800 border-blue-200", // Room 1
    "bg-green-100 text-green-800 border-green-200", // Room 2
    "bg-purple-100 text-purple-800 border-purple-200", // Room 3
    "bg-orange-100 text-orange-800 border-orange-200", // Room 4
    "bg-pink-100 text-pink-800 border-pink-200", // Room 5
    "bg-indigo-100 text-indigo-800 border-indigo-200", // Room 6
    "bg-yellow-100 text-yellow-800 border-yellow-200", // Room 7
    "bg-red-100 text-red-800 border-red-200", // Room 8
  ]
  return colors[roomIndex % colors.length] || "bg-gray-100 text-gray-800 border-gray-200"
}

export default function UserDashboard() {
  // Set to current date (2025)
  const [currentDate, setCurrentDate] = useState(new Date())
  const { bookings, rooms, getRoomById } = useData()
  const { isAuthenticated } = useAuth()
  const { t, getMonthName, getDayName } = useLanguage()

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const firstDayOfMonth = new Date(year, month, 1)
  const lastDayOfMonth = new Date(year, month + 1, 0)
  const firstDayWeekday = firstDayOfMonth.getDay()
  const daysInMonth = lastDayOfMonth.getDate()

  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1))
  }

  const getBookingsForDate = (day: number) => {
    const dateStr = format(new Date(year, month, day), "yyyy-MM-dd")
    return bookings.filter(
      (booking) => booking.bookingDate === dateStr && (booking.status === "approved" || booking.status === "active"),
    )
  }

  const renderCalendarDays = () => {
    const days = []

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDayWeekday; i++) {
      days.push(<div key={`empty-${i}`} className="p-3 min-h-[100px]"></div>)
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayBookings = getBookingsForDate(day)
      const hasEvents = dayBookings.length > 0
      const isToday = new Date().getDate() === day && 
                     new Date().getMonth() === month && 
                     new Date().getFullYear() === year

      days.push(
        <div key={day} className={`p-3 min-h-[100px] border border-gray-200 bg-white hover:bg-gray-50 transition-colors ${isToday ? 'bg-blue-50 border-blue-300' : ''}`}>
          <div className={`font-medium mb-2 ${isToday ? 'text-blue-700 font-bold' : 'text-gray-900'}`}>
            {day}
            {isToday && <span className="ml-1 text-xs bg-blue-600 text-white px-1 rounded">{t("dashboard.today")}</span>}
          </div>
          {hasEvents && (
            <div className="space-y-1">
              {dayBookings.slice(0, 2).map((booking, index) => {
                const room = getRoomById(booking.roomId)
                const colorClass = getRoomColor(booking.roomId, rooms)
                return (
                  <div
                    key={index}
                    className={`text-xs px-2 py-1 rounded-md font-medium border ${colorClass}`}
                    title={`${room?.name} - ${booking.startTime}-${booking.endTime}`}
                  >
                    {booking.startTime}-{booking.endTime}
                    <div className="text-xs opacity-75 truncate">{room?.name}</div>
                  </div>
                )
              })}
              {dayBookings.length > 2 && <div className="text-xs text-gray-500">+{dayBookings.length - 2} lainnya</div>}
            </div>
          )}
        </div>,
      )
    }

    return days
  }

  // Generate day names array
  const dayNames = Array.from({ length: 7 }, (_, i) => getDayName(i))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t("dashboard.title")}</h1>
          <p className="text-gray-600 mt-1">{t("dashboard.userSubtitle")}</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {isAuthenticated && (
            <Link href="/dashboard">
              <Button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg">
                <Shield className="w-4 h-4 mr-2" />
                {t("nav.adminPanel")}
              </Button>
            </Link>
          )}
          {rooms.map((room, index) => {
            const colorClass = getRoomColor(room.id, rooms)
            return (
              <Badge key={room.id} variant="outline" className={colorClass}>
                {room.name}
              </Badge>
            )
          })}
        </div>
      </div>

      <Card className="shadow-sm border border-gray-200">
        <CardHeader className="border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-semibold text-gray-900">
              {getMonthName(month)} {year}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={previousMonth} className="hover:bg-gray-50 bg-transparent">
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setCurrentDate(new Date())}
                className="hover:bg-gray-50 bg-transparent text-sm px-3"
              >
                {t("dashboard.today")}
              </Button>
              <Button variant="outline" size="sm" onClick={nextMonth} className="hover:bg-gray-50 bg-transparent">
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid grid-cols-7 gap-0">
            {/* Day headers */}
            {dayNames.map((day) => (
              <div
                key={day}
                className="p-4 bg-gray-50 border-b border-gray-200 font-semibold text-center text-gray-700"
              >
                {day}
              </div>
            ))}

            {/* Calendar days */}
            {renderCalendarDays()}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
