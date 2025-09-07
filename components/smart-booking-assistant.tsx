"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Brain, TrendingUp, Calendar, Lightbulb, BarChart3, ArrowRight } from "lucide-react"
import { useData } from "@/contexts/DataContext"
import { useLanguage } from "@/contexts/LanguageContext"
import { format, addDays, isWeekend } from "date-fns"

interface Suggestion {
  id: string
  type: "optimal" | "timeSlot" | "room" | "peak" | "planning" | "weekend" | "tip"
  priority: "high" | "medium" | "tip"
  title: string
  description: string
  action?: {
    label: string
    href?: string
    onClick?: () => void
  }
}

export function SmartBookingAssistant() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(true)
  const { bookings, rooms } = useData()
  const { t, getDayName } = useLanguage()

  useEffect(() => {
    const analyzeSuggestions = () => {
      setIsAnalyzing(true)

      // Simulate analysis delay
      setTimeout(() => {
        const newSuggestions: Suggestion[] = []
        const today = new Date()

        // Check if today is weekend
        if (isWeekend(today)) {
          const nextWeekday = getNextWeekday(today)
          newSuggestions.push({
            id: "weekend",
            type: "weekend",
            priority: "high",
            title: t("assistant.weekendReminder"),
            description: t("assistant.weekendReminderDesc").replace("{0}", getDayName(nextWeekday.getDay())),
            action: {
              label: t("assistant.bookWeekday"),
              href: "/user/booking",
            },
          })
        } else {
          // Analyze weekday patterns (skip weekends)
          const weekdayBookings = bookings.filter((booking) => {
            const bookingDate = new Date(booking.bookingDate)
            return !isWeekend(bookingDate) && booking.status !== "rejected"
          })

          // Tomorrow analysis (only if tomorrow is weekday)
          const tomorrow = addDays(today, 1)
          if (!isWeekend(tomorrow)) {
            const tomorrowStr = format(tomorrow, "yyyy-MM-dd")
            const tomorrowBookings = weekdayBookings.filter((b) => b.bookingDate === tomorrowStr)

            if (tomorrowBookings.length < 3) {
              newSuggestions.push({
                id: "tomorrow-optimal",
                type: "optimal",
                priority: "high",
                title: t("assistant.weekdayOptimal").replace("{0}", getDayName(tomorrow.getDay())),
                description: t("assistant.weekdayOptimalDesc").replace("{0}", getDayName(tomorrow.getDay())),
                action: {
                  label: t("assistant.bookNow"),
                  href: "/user/booking",
                },
              })
            }
          }

          // Best time slots analysis (weekdays only)
          const timeSlotAnalysis = analyzeTimeSlots(weekdayBookings)
          if (timeSlotAnalysis.length > 0) {
            newSuggestions.push({
              id: "best-times",
              type: "timeSlot",
              priority: "medium",
              title: t("assistant.bestTimeSlots"),
              description: t("assistant.bestTimeSlotsDesc").replace("{0}", timeSlotAnalysis.join(", ")),
              action: {
                label: t("assistant.bookNow"),
                href: "/user/booking",
              },
            })
          }

          // Room utilization analysis
          const underutilizedRoom = findUnderutilizedRoom(weekdayBookings, rooms)
          if (underutilizedRoom) {
            newSuggestions.push({
              id: "hidden-gem",
              type: "room",
              priority: "medium",
              title: t("assistant.hiddenGem"),
              description: t("assistant.hiddenGemDesc").replace("{0}", underutilizedRoom.name),
              action: {
                label: t("assistant.viewRoom"),
                href: "/user/rooms",
              },
            })
          }

          // Peak hours insight (weekdays only)
          const peakHour = findPeakHour(weekdayBookings)
          if (peakHour) {
            newSuggestions.push({
              id: "peak-insight",
              type: "peak",
              priority: "medium",
              title: t("assistant.peakInsight"),
              description: t("assistant.peakInsightDesc").replace("{0}", peakHour),
              action: {
                label: t("assistant.bookNow"),
                href: "/user/booking",
              },
            })
          }

          // Planning ahead (find empty weekdays)
          const emptyWeekday = findEmptyWeekday(weekdayBookings)
          if (emptyWeekday) {
            newSuggestions.push({
              id: "plan-ahead",
              type: "planning",
              priority: "medium",
              title: t("assistant.planAhead").replace("{0}", getDayName(emptyWeekday.getDay())),
              description: t("assistant.planAheadDesc").replace("{0}", getDayName(emptyWeekday.getDay())),
              action: {
                label: t("assistant.planNow"),
                href: "/user/booking",
              },
            })
          }
        }

        // Always add booking tip
        newSuggestions.push({
          id: "booking-tip",
          type: "tip",
          priority: "tip",
          title: t("assistant.quickTip24h"),
          description: t("assistant.quickTip24hDesc"),
          action: {
            label: t("assistant.bookNow"),
            href: "/user/booking",
          },
        })

        setSuggestions(newSuggestions)
        setIsAnalyzing(false)
      }, 1000)
    }

    analyzeSuggestions()
  }, [bookings, rooms, t, getDayName])

  const getNextWeekday = (date: Date): Date => {
    let nextDay = addDays(date, 1)
    while (isWeekend(nextDay)) {
      nextDay = addDays(nextDay, 1)
    }
    return nextDay
  }

  const analyzeTimeSlots = (weekdayBookings: any[]): string[] => {
    const timeSlots = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"]
    const availableSlots = timeSlots.filter((slot) => {
      const bookingsAtTime = weekdayBookings.filter((booking) => booking.startTime <= slot && booking.endTime > slot)
      return bookingsAtTime.length < 2
    })
    return availableSlots.slice(0, 3)
  }

  const findUnderutilizedRoom = (weekdayBookings: any[], rooms: any[]) => {
    const roomUsage = rooms.map((room) => ({
      ...room,
      bookingCount: weekdayBookings.filter((b) => b.roomId === room.id).length,
    }))

    const sortedByUsage = roomUsage.sort((a, b) => a.bookingCount - b.bookingCount)
    return sortedByUsage[0]?.bookingCount < 5 ? sortedByUsage[0] : null
  }

  const findPeakHour = (weekdayBookings: any[]): string | null => {
    const hourCounts: Record<string, number> = {}

    weekdayBookings.forEach((booking) => {
      const hour = booking.startTime.split(":")[0] + ":00"
      hourCounts[hour] = (hourCounts[hour] || 0) + 1
    })

    const sortedHours = Object.entries(hourCounts).sort(([, a], [, b]) => b - a)
    return sortedHours.length > 0 && sortedHours[0][1] > 3 ? sortedHours[0][0] : null
  }

  const findEmptyWeekday = (weekdayBookings: any[]): Date | null => {
    const today = new Date()
    for (let i = 2; i <= 7; i++) {
      const checkDate = addDays(today, i)
      if (!isWeekend(checkDate)) {
        const dateStr = format(checkDate, "yyyy-MM-dd")
        const dayBookings = weekdayBookings.filter((b) => b.bookingDate === dateStr)
        if (dayBookings.length === 0) {
          return checkDate
        }
      }
    }
    return null
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high":
        return <TrendingUp className="h-4 w-4" />
      case "medium":
        return <BarChart3 className="h-4 w-4" />
      case "tip":
        return <Lightbulb className="h-4 w-4" />
      default:
        return <Brain className="h-4 w-4" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "tip":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <Card className="h-fit">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Brain className="h-5 w-5 text-blue-600" />
          {t("assistant.title")}
        </CardTitle>
        <p className="text-sm text-gray-600">{t("assistant.suggestions")}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {isAnalyzing ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-sm text-gray-600">Menganalisis data...</span>
          </div>
        ) : (
          <>
            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-xs text-gray-600">{t("assistant.totalBookings")}</div>
                <div className="text-lg font-semibold">{bookings.length}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-xs text-gray-600">{t("assistant.roomsAvailable")}</div>
                <div className="text-lg font-semibold">{rooms.filter((r) => r.isActive).length}</div>
              </div>
            </div>

            {/* Suggestions */}
            <div className="space-y-3">
              {suggestions.map((suggestion) => (
                <div key={suggestion.id} className="border rounded-lg p-3 hover:shadow-sm transition-shadow">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className={getPriorityColor(suggestion.priority)}>
                          {getPriorityIcon(suggestion.priority)}
                          <span className="ml-1 text-xs">
                            {suggestion.priority === "high"
                              ? t("assistant.high")
                              : suggestion.priority === "medium"
                                ? t("assistant.medium")
                                : t("assistant.tip")}
                          </span>
                        </Badge>
                      </div>
                      <h4 className="font-medium text-sm mb-1">{suggestion.title}</h4>
                      <p className="text-xs text-gray-600 mb-2">{suggestion.description}</p>
                      {suggestion.action && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs h-7 bg-transparent"
                          onClick={() => {
                            if (suggestion.action?.href) {
                              window.location.href = suggestion.action.href
                            }
                            suggestion.action?.onClick?.()
                          }}
                        >
                          {suggestion.action.label}
                          <ArrowRight className="ml-1 h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {suggestions.length === 0 && (
              <div className="text-center py-6">
                <Calendar className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-600">Belum ada saran tersedia</p>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
