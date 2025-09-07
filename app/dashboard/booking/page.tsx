"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useData } from "@/contexts/DataContext"
import { useToast } from "@/hooks/use-toast"

export default function RoomBooking() {
  const [selectedRoom, setSelectedRoom] = useState("")
  const [bookingDate, setBookingDate] = useState<Date>()
  const [formData, setFormData] = useState({
    phone: "",
    name: "",
    unit: "",
    startTime: "",
    endTime: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { rooms, addBooking, getRoomById } = useData()
  const { toast } = useToast()
  const selectedRoomData = getRoomById(selectedRoom)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validate form
      if (!selectedRoom || !bookingDate) {
        toast({
          title: "Error",
          description: "Please fill in all required fields",
          variant: "destructive",
        })
        return
      }

      // Check if end time is after start time
      if (formData.startTime >= formData.endTime) {
        toast({
          title: "Error",
          description: "End time must be after start time",
          variant: "destructive",
        })
        return
      }

      // Add booking
      addBooking({
        roomId: selectedRoom,
        name: formData.name,
        phone: formData.phone,
        unitKerja: formData.unit,
        bookingDate: format(bookingDate, "yyyy-MM-dd"),
        startTime: formData.startTime,
        endTime: formData.endTime,
        status: "pending",
      })

      toast({
        title: "Success",
        description: "Room booking submitted successfully! Waiting for approval.",
      })

      // Reset form
      setFormData({
        phone: "",
        name: "",
        unit: "",
        startTime: "",
        endTime: "",
      })
      setSelectedRoom("")
      setBookingDate(undefined)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit booking. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Room Booking</h1>
        <p className="text-gray-600 mt-1">Pesan ruangan untuk kebutuhan Anda</p>
      </div>

      <Card className="shadow-sm border border-gray-200">
        <CardHeader className="border-b border-gray-200 bg-white">
          <CardTitle className="text-xl font-semibold text-gray-900">Book a Room</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <Label htmlFor="phone" className="text-gray-700 font-medium">
                    No. Telp *
                  </Label>
                  <Input
                    id="phone"
                    placeholder="Phone number"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                    disabled={isSubmitting}
                    className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <Label htmlFor="name" className="text-gray-700 font-medium">
                    Nama *
                  </Label>
                  <Input
                    id="name"
                    placeholder="Nama lengkap"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    disabled={isSubmitting}
                    className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <Label htmlFor="unit" className="text-gray-700 font-medium">
                    Unit Kerja *
                  </Label>
                  <Input
                    id="unit"
                    placeholder="Unit kerja"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    required
                    disabled={isSubmitting}
                    className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <Label htmlFor="room" className="text-gray-700 font-medium">
                    Pilih Ruangan *
                  </Label>
                  <Select value={selectedRoom} onValueChange={setSelectedRoom} required disabled={isSubmitting}>
                    <SelectTrigger className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                      <SelectValue placeholder="Pilih ruangan" />
                    </SelectTrigger>
                    <SelectContent>
                      {rooms.map((room) => (
                        <SelectItem key={room.id} value={room.id}>
                          {room.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-gray-700 font-medium">Tanggal *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal mt-1 border-gray-300 focus:border-blue-500",
                          !bookingDate && "text-muted-foreground",
                        )}
                        disabled={isSubmitting}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {bookingDate ? format(bookingDate, "PPP") : "Pilih tanggal"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={bookingDate}
                        onSelect={setBookingDate}
                        initialFocus
                        disabled={(date) => date < new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startTime" className="text-gray-700 font-medium">
                      Jam Mulai *
                    </Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={formData.startTime}
                      onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                      required
                      disabled={isSubmitting}
                      className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <Label htmlFor="endTime" className="text-gray-700 font-medium">
                      Jam Sampai Dengan *
                    </Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={formData.endTime}
                      onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                      required
                      disabled={isSubmitting}
                      className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {selectedRoomData && (
                <div className="space-y-4">
                  <Card className="shadow-sm border border-gray-200">
                    <CardContent className="p-4">
                      <img
                        src={selectedRoomData.image || "/placeholder.svg"}
                        alt={selectedRoomData.name}
                        className="w-full h-48 object-cover rounded-lg mb-4"
                      />
                      <h3 className="font-semibold text-lg text-gray-900 mb-3">{selectedRoomData.name}</h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                            {selectedRoomData.capacity}
                          </span>
                          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                            {selectedRoomData.floor}
                          </span>
                        </div>

                        <div>
                          <p className="font-medium text-gray-900 mb-1">Fasilitas</p>
                          <p className="text-gray-600 text-sm mb-2">{selectedRoomData.amenities.join(", ")}</p>
                        </div>

                        <div>
                          <p className="font-medium text-gray-900 mb-1">Deskripsi Ruangan</p>
                          <p className="text-gray-600 text-sm leading-relaxed">{selectedRoomData.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>

            <div className="flex gap-4 pt-6 border-t border-gray-200">
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Submitting...
                  </div>
                ) : (
                  "Submit Booking"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="px-6 py-2 rounded-lg border-gray-300 hover:bg-gray-50 bg-transparent"
                disabled={isSubmitting}
                onClick={() => {
                  setFormData({
                    phone: "",
                    name: "",
                    unit: "",
                    startTime: "",
                    endTime: "",
                  })
                  setSelectedRoom("")
                  setBookingDate(undefined)
                }}
              >
                Reset
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
