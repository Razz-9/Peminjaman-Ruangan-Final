"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import { useData } from "@/contexts/DataContext"
import { useLanguage } from "@/contexts/LanguageContext"
import { format } from "date-fns"

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

export default function Dashboard() {
  // Set to current date (2025)
  const [currentDate, setCurrentDate] = useState(new Date())
  const { bookings, rooms, getRoomById } = useData()
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
      (booking) =>
        booking.bookingDate === dateStr &&
        (booking.status === "approved" || booking.status === "active" || booking.status === "pending"),
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "ring-2 ring-green-400"
      case "active":
        return "ring-2 ring-blue-400"
      case "pending":
        return "ring-2 ring-yellow-400"
      default:
        return ""
    }
  }

  const renderCalendarDays = () => {
    const days = []

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDayWeekday; i++) {
      days.push(<div key={`empty-${i}`} className="p-3 min-h-[120px]"></div>)
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayBookings = getBookingsForDate(day)
      const hasEvents = dayBookings.length > 0
      const isToday = new Date().getDate() === day && 
                     new Date().getMonth() === month && 
                     new Date().getFullYear() === year

      days.push(
        <div key={day} className={`p-3 min-h-[120px] border border-gray-200 bg-white hover:bg-gray-50 transition-colors ${isToday ? 'bg-blue-50 border-blue-300' : ''}`}>
          <div className={`font-medium mb-2 ${isToday ? 'text-blue-700 font-bold' : 'text-gray-900'}`}>
            {day}
            {isToday && <span className="ml-1 text-xs bg-blue-600 text-white px-1 rounded">{t("dashboard.today")}</span>}
          </div>
          {hasEvents && (
            <div className="space-y-1">
              {dayBookings.slice(0, 3).map((booking, index) => {
                const room = getRoomById(booking.roomId)
                const colorClass = getRoomColor(booking.roomId, rooms)
                const statusRing = getStatusColor(booking.status)
                return (
                  <div
                    key={index}
                    className={`text-xs px-2 py-1 rounded-md font-medium border ${colorClass} ${statusRing} relative`}
                    title={`${room?.name} - ${booking.name} (${t(`status.${booking.status}`)})`}
                  >
                    <div className="truncate">
                      {booking.startTime}-{booking.endTime}
                    </div>
                    <div className="text-xs opacity-75 truncate">{room?.name}</div>
                    <div className="text-xs opacity-60 truncate">{booking.name}</div>
                  </div>
                )
              })}
              {dayBookings.length > 3 && (
                <div className="text-xs text-gray-500 font-medium">+{dayBookings.length - 3} lainnya</div>
              )}
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
          <p className="text-gray-600 mt-1">{t("dashboard.subtitle")}</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
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

      {/* Legend */}
      <Card className="shadow-sm border border-gray-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-6 flex-wrap">
            <span className="text-sm font-medium text-gray-700">{t("dashboard.legend")}</span>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded border-2 border-green-400 bg-green-100"></div>
              <span className="text-sm text-gray-700">{t("dashboard.approved")}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded border-2 border-blue-400 bg-blue-100"></div>
              <span className="text-sm text-gray-700">{t("dashboard.active")}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded border-2 border-yellow-400 bg-yellow-100"></div>
              <span className="text-sm text-gray-700">{t("dashboard.pending")}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-blue-50 border-2 border-blue-300"></div>
              <span className="text-sm text-gray-700">{t("dashboard.today")}</span>
            </div>
          </div>
        </CardContent>
      </Card>

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
