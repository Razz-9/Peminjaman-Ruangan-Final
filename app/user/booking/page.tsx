"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, CheckCircle, MapPin, Users, Wifi, Monitor, Coffee } from "lucide-react"
import { format } from "date-fns"
import { useData } from "@/contexts/DataContext"
import { useLanguage } from "@/contexts/LanguageContext"
import { TimePicker } from "@/components/time-picker"

export default function BookingPage() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    unitKerja: "",
    roomId: "",
    bookingDate: "",
    startTime: "",
    endTime: "",
    notes: "",
  })
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const { rooms, addBooking, getBookingsByDate } = useData()
  const { t } = useLanguage()

  const selectedRoom = rooms.find((room) => room.id === formData.roomId)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) newErrors.name = t("booking.errorRequired")
    if (!formData.phone.trim()) newErrors.phone = t("booking.errorRequired")
    if (!formData.unitKerja.trim()) newErrors.unitKerja = t("booking.errorRequired")
    if (!formData.roomId) newErrors.roomId = t("booking.errorRequired")
    if (!formData.bookingDate) newErrors.bookingDate = t("booking.errorRequired")
    if (!formData.startTime) newErrors.startTime = t("booking.errorRequired")
    if (!formData.endTime) newErrors.endTime = t("booking.errorRequired")

    // Validate date (not past, not weekend)
    if (formData.bookingDate) {
      const bookingDate = new Date(formData.bookingDate)
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      if (bookingDate < today) {
        newErrors.bookingDate = t("booking.errorPastDate")
      }

      const dayOfWeek = bookingDate.getDay()
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        newErrors.bookingDate = t("booking.errorWeekend")
      }
    }

    // Validate time format and logic
    if (formData.startTime && formData.endTime) {
      const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/
      if (!timeRegex.test(formData.startTime)) {
        newErrors.startTime = t("booking.errorTimeFormat")
      }
      if (!timeRegex.test(formData.endTime)) {
        newErrors.endTime = t("booking.errorTimeFormat")
      }

      if (timeRegex.test(formData.startTime) && timeRegex.test(formData.endTime)) {
        const [startHour, startMin] = formData.startTime.split(":").map(Number)
        const [endHour, endMin] = formData.endTime.split(":").map(Number)
        const startMinutes = startHour * 60 + startMin
        const endMinutes = endHour * 60 + endMin

        if (endMinutes <= startMinutes) {
          newErrors.endTime = t("booking.errorEndTime")
        } else if (endMinutes - startMinutes < 30) {
          newErrors.endTime = t("booking.errorMinDuration")
        }
      }
    }

    // Check for time conflicts
    if (formData.bookingDate && formData.startTime && formData.endTime && !newErrors.startTime && !newErrors.endTime) {
      const existingBookings = getBookingsByDate(formData.bookingDate)
      const roomBookings = existingBookings.filter(
        (booking) =>
          booking.roomId === formData.roomId &&
          (booking.status === "approved" || booking.status === "active" || booking.status === "pending"),
      )

      const [newStartHour, newStartMin] = formData.startTime.split(":").map(Number)
      const [newEndHour, newEndMin] = formData.endTime.split(":").map(Number)
      const newStartMinutes = newStartHour * 60 + newStartMin
      const newEndMinutes = newEndHour * 60 + newEndMin

      const hasConflict = roomBookings.some((booking) => {
        const [existingStartHour, existingStartMin] = booking.startTime.split(":").map(Number)
        const [existingEndHour, existingEndMin] = booking.endTime.split(":").map(Number)
        const existingStartMinutes = existingStartHour * 60 + existingStartMin
        const existingEndMinutes = existingEndHour * 60 + existingEndMin

        return newStartMinutes < existingEndMinutes && newEndMinutes > existingStartMinutes
      })

      if (hasConflict) {
        newErrors.startTime = t("booking.conflictDesc")
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    try {
      await addBooking({
        ...formData,
        status: "pending",
      })
      setShowSuccess(true)
      handleReset(); // Membersihkan form setelah berhasil
    } catch (error) {
      setErrors({ submit: t("booking.errorSubmit") })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReset = () => {
    setFormData({
      name: "",
      phone: "",
      unitKerja: "",
      roomId: "",
      bookingDate: "",
      startTime: "",
      endTime: "",
      notes: "",
    })
    setSelectedDate(undefined)
    setErrors({})
  }

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date)
    if (date) {
      setFormData({ ...formData, bookingDate: format(date, "yyyy-MM-dd") })
    }
  }

  const isWeekend = (date: Date) => {
    const day = date.getDay()
    return day === 0 || day === 6
  }

  const isPastDate = (date: Date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date < today
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">{t("booking.success")}</h2>
              <p className="text-gray-600 mb-6">{t("booking.successDesc")}</p>
              <div className="space-y-3">
                <Button onClick={() => setShowSuccess(false)} className="w-full">
                  {t("booking.bookAnother")}
                </Button>
                <Button variant="outline" onClick={() => (window.location.href = "/user/history")} className="w-full">
                  {t("booking.viewBookings")}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{t("booking.title")}</h1>
        <p className="text-gray-600 mt-1">{t("booking.subtitle")}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("booking.bookRoom")}</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Perubahan utama: Menggunakan grid untuk layout 2 kolom */}
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Kolom Kiri: Form */}
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">{t("booking.name")} *</Label>
                  <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder={t("booking.namePlaceholder")} className={errors.name ? "border-red-500" : ""} />
                  {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">{t("booking.phone")} *</Label>
                  <Input id="phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder={t("booking.phonePlaceholder")} className={errors.phone ? "border-red-500" : ""} />
                  {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="unitKerja">{t("booking.unit")} *</Label>
                <Input id="unitKerja" value={formData.unitKerja} onChange={(e) => setFormData({ ...formData, unitKerja: e.target.value })} placeholder={t("booking.unitPlaceholder")} className={errors.unitKerja ? "border-red-500" : ""} />
                {errors.unitKerja && <p className="text-sm text-red-500">{errors.unitKerja}</p>}
              </div>

              <div className="space-y-2">
                <Label>{t("booking.selectRoom")} *</Label>
                <Select value={formData.roomId} onValueChange={(value) => setFormData({ ...formData, roomId: value })}>
                  <SelectTrigger className={errors.roomId ? "border-red-500" : ""}>
                    <SelectValue placeholder={t("booking.selectRoomPlaceholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    {rooms.filter((room) => room.isActive).map((room) => (
                      <SelectItem key={room.id} value={room.id}>{room.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.roomId && <p className="text-sm text-red-500">{errors.roomId}</p>}
              </div>

              <div className="space-y-2">
                <Label>{t("booking.date")} *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={`w-full justify-start text-left font-normal ${errors.bookingDate ? "border-red-500" : ""}`}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, "PPP") : t("booking.selectDate")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={selectedDate} onSelect={handleDateSelect} disabled={(date) => isPastDate(date) || isWeekend(date)} initialFocus />
                  </PopoverContent>
                </Popover>
                {errors.bookingDate && <p className="text-sm text-red-500">{errors.bookingDate}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t("booking.startTime")} *</Label>
                  <TimePicker value={formData.startTime} onChange={(time) => setFormData({ ...formData, startTime: time })} placeholder={t("booking.selectStartTime")} />
                  {errors.startTime && <p className="text-sm text-red-500">{errors.startTime}</p>}
                </div>
                <div className="space-y-2">
                  <Label>{t("booking.endTime")} *</Label>
                  <TimePicker value={formData.endTime} onChange={(time) => setFormData({ ...formData, endTime: time })} placeholder={t("booking.selectEndTime")} />
                  {errors.endTime && <p className="text-sm text-red-500">{errors.endTime}</p>}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes">Catatan (Opsional)</Label>
                <Textarea id="notes" value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} placeholder="Tambahkan catatan untuk booking ini..." rows={3} />
              </div>
              
              {errors.submit && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600">{errors.submit}</p>
                </div>
              )}

              <div className="flex gap-4 pt-4 border-t">
                <Button type="submit" disabled={isSubmitting} className="flex-1">
                  {isSubmitting ? t("booking.submitting") : t("booking.submit")}
                </Button>
                <Button type="button" variant="outline" onClick={handleReset}>
                  {t("booking.reset")}
                </Button>
              </div>
            </div>

            {/* Kolom Kanan: Detail Ruangan */}
            <div className="space-y-4">
              {selectedRoom && (
                <Card className="shadow-sm border border-gray-200 sticky top-6">
                  <CardContent className="p-4">
                    <img src={selectedRoom.image || "/placeholder.svg"} alt={selectedRoom.name} className="w-full h-48 object-cover rounded-lg mb-4" />
                    <h3 className="font-semibold text-lg text-gray-900 mb-3">{selectedRoom.name}</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium flex items-center gap-1"><Users className="h-4 w-4" />{selectedRoom.capacity}</span>
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium flex items-center gap-1"><MapPin className="h-4 w-4" />{selectedRoom.floor}</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 mb-1">{t("booking.facilities")}</p>
                        <p className="text-gray-600 text-sm mb-2">{selectedRoom.amenities.join(", ")}</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 mb-1">{t("booking.roomDescription")}</p>
                        <p className="text-gray-600 text-sm leading-relaxed">{selectedRoom.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}