"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

const bookingEvents = {
  10: [{ time: "10:00-1:00", room: "Lambelu Lt.1 TI" }],
  11: [{ time: "10:00-1:00", room: "Leuser Lt.1" }],
  13: [
    { time: "10:00-11:00", room: "Lambelu Lt.1 TI" },
    { time: "10:00-11:00", room: "Awu Lt.3" },
  ],
  15: [{ time: "14:00-15:00", room: "Lambelu Lt.1 TI" }],
  17: [{ time: "10:00-13:00", room: "Leuser Lt.1" }],
  24: [
    { time: "10:00-11:00", room: "Lambelu Lt.1 TI" },
    { time: "10:00-11:00", room: "Awu Lt.3" },
  ],
  27: [{ time: "10:00-11", room: "Lambelu Lt.1 TI" }],
  28: [{ time: "10:00-11:00", room: "Leuser Lt.1" }],
}

export default function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 4)) // May 2025

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

  const renderCalendarDays = () => {
    const days = []

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDayWeekday; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>)
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const events = bookingEvents[day as keyof typeof bookingEvents] || []
      const hasEvents = events.length > 0

      days.push(
        <div key={day} className="p-2 min-h-[80px] border border-gray-200 relative">
          <div className="font-medium text-sm mb-1">{day}</div>
          {hasEvents && (
            <div className="space-y-1">
              {events.map((event, index) => (
                <div key={index} className="text-xs bg-blue-100 text-blue-800 px-1 py-0.5 rounded">
                  {event.time}
                </div>
              ))}
            </div>
          )}
        </div>,
      )
    }

    return days
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Calendar</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Badge variant="outline">Lambelu Lt.1 TI</Badge>
            <Badge variant="outline">Leuser Lt.1 Pengamanan</Badge>
            <Badge variant="outline">Awu Lt.3</Badge>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              {monthNames[month]} {year}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={previousMonth}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={nextMonth}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-0 border border-gray-200">
            {/* Day headers */}
            {dayNames.map((day) => (
              <div key={day} className="p-3 bg-gray-50 border-b border-gray-200 font-medium text-center">
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
