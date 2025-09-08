"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Search, ChevronLeft, ChevronRight } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useData } from "@/contexts/DataContext"
import { useLanguage } from "@/contexts/LanguageContext"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"

const statusOptions = [
  { value: "pending", labelKey: "status.pending" },
  { value: "approved", labelKey: "status.approved" },
  { value: "rejected", labelKey: "status.rejected" },
  { value: "active", labelKey: "status.active" },
  { value: "completed", labelKey: "status.completed" },
]

export default function AdminHistory() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("newest")
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState<any>(null)
  const [rejectionReason, setRejectionReason] = useState("")
  const { bookings, getRoomById, updateBookingStatus } = useData()
  const { t } = useLanguage()
  const { toast } = useToast()

  const getStatusBadge = (status: string) => {
    const statusText = t(`status.${status}`)
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">{statusText}</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">{statusText}</Badge>
      case "rejected":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">{statusText}</Badge>
      case "active":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">{statusText}</Badge>
      case "completed":
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">{statusText}</Badge>
      default:
        return <Badge variant="secondary">{statusText}</Badge>
    }
  }

  const handleStatusChange = (bookingId: string, newStatus: string) => {
    if (newStatus === "rejected") {
      const booking = bookings.find((b) => b.id === bookingId)
      setSelectedBooking(booking)
      setRejectDialogOpen(true)
    } else {
      updateBookingStatus(bookingId, newStatus as any)
      toast({
        title: "Status Diperbarui",
        description: `Status booking telah diubah menjadi ${t(`status.${newStatus}`)}`,
      })
    }
  }

  const handleRejectBooking = () => {
    if (selectedBooking && rejectionReason.trim()) {
      updateBookingStatus(selectedBooking.id, "rejected", rejectionReason)
      toast({
        title: "Booking Ditolak",
        description: "Booking telah ditolak dengan alasan yang diberikan",
      })
      setRejectDialogOpen(false)
      setRejectionReason("")
      setSelectedBooking(null)
    } else {
      toast({
        title: t("common.error"),
        description: "Mohon berikan alasan penolakan",
        variant: "destructive",
      })
    }
  }

  const filteredBookings = bookings
    .filter(
      (booking) =>
        booking.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.unitKerja.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getRoomById(booking.roomId)?.name.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      } else if (sortBy === "oldest") {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      } else if (sortBy === "name") {
        return a.name.localeCompare(b.name)
      }
      return 0
    })

  const calculateDuration = (startTime: string, endTime: string): string => {
    if (!startTime || !endTime) {
      return "-";
    }
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return "-";
    }

    const diffMs = end.getTime() - start.getTime();
    
    if (diffMs < 0) {
        return "Invalid";
    }

    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (diffHours === 0 && diffMinutes === 0) {
      return "0 mnt";
    }
    
    if (diffHours === 0) {
      return `${diffMinutes} ${t("time.min")}`;
    } else if (diffMinutes === 0) {
      return `${diffHours} ${t("time.hour")}`;
    } else {
      return `${diffHours} ${t("time.hour")} ${diffMinutes} ${t("time.min")}`;
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{t("admin.bookingManagement")}</h1>
        <p className="text-gray-600 mt-1">Kelola semua booking ruangan dan statusnya</p>
      </div>

      <Card className="shadow-sm border border-gray-200">
        <CardHeader className="border-b border-gray-200 bg-white">
          <CardTitle className="text-xl font-semibold text-gray-900">{t("admin.allBookings")}</CardTitle>
          <div className="flex items-center gap-4 mt-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder={t("history.search")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">{t("history.sortNewest")}</SelectItem>
                <SelectItem value="oldest">{t("history.sortOldest")}</SelectItem>
                <SelectItem value="name">{t("history.sortName")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {filteredBookings.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">{t("history.noBookings")}</p>
              <p className="text-gray-400 text-sm mt-2">Riwayat booking akan muncul di sini</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold text-gray-700">{t("history.nameCol")}</TableHead>
                  <TableHead className="font-semibold text-gray-700">{t("admin.contact")}</TableHead>
                  <TableHead className="font-semibold text-gray-700">{t("admin.department")}</TableHead>
                  <TableHead className="font-semibold text-gray-700">{t("history.roomCol")}</TableHead>
                  <TableHead className="font-semibold text-gray-700">{t("history.timeCol")}</TableHead>
                  <TableHead className="font-semibold text-gray-700">{t("admin.duration")}</TableHead>
                  <TableHead className="font-semibold text-gray-700">{t("history.statusCol")}</TableHead>
                  <TableHead className="font-semibold text-gray-700">{t("admin.actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBookings.map((booking) => {
                  const room = getRoomById(booking.roomId)
                  const bookingDate = new Date(booking.bookingDate)
                  const duration = calculateDuration(booking.startTime, booking.endTime)

                  return (
                    <TableRow key={booking.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium text-gray-900">{booking.name}</TableCell>
                      <TableCell className="text-gray-700">{booking.phone}</TableCell>
                      <TableCell>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                          {booking.unitKerja}
                        </span>
                      </TableCell>
                      <TableCell className="text-gray-700">{room?.name || "Unknown Room"}</TableCell>
                      <TableCell>
                        <div>
                          <div className="text-gray-900">{format(bookingDate, "dd MMM yyyy")}</div>
                          <div className="text-sm text-gray-500">
                            ({booking.startTime} - {booking.endTime})
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-700">{duration}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {getStatusBadge(booking.status)}
                          {booking.status === "rejected" && booking.rejectionReason && (
                            <div className="text-xs text-red-600 max-w-xs">Alasan: {booking.rejectionReason}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Select value={booking.status} onValueChange={(value) => handleStatusChange(booking.id, value)}>
                          <SelectTrigger className="w-32 h-8 text-xs border-gray-300">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {statusOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {t(option.labelKey)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}

          {filteredBookings.length > 0 && (
            <div className="flex items-center justify-between p-4 bg-gray-50 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                {t("history.showing")} {filteredBookings.length} booking{filteredBookings.length !== 1 ? "s" : ""}
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="border-gray-300 hover:bg-gray-100 bg-transparent">
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" className="border-gray-300 hover:bg-gray-100 bg-transparent">
                  1
                </Button>
                <Button variant="outline" size="sm" className="border-gray-300 hover:bg-gray-100 bg-transparent">
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Rejection Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-900">Tolak Booking</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {selectedBooking && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900">{selectedBooking.name}</h4>
                <p className="text-sm text-gray-600">
                  {getRoomById(selectedBooking.roomId)?.name} - {selectedBooking.bookingDate}
                </p>
                <p className="text-sm text-gray-600">
                  {selectedBooking.startTime} - {selectedBooking.endTime}
                </p>
              </div>
            )}

            <div>
              <Label htmlFor="rejectionReason" className="text-gray-700 font-medium">
                Alasan Penolakan *
              </Label>
              <Textarea
                id="rejectionReason"
                placeholder="Berikan alasan yang jelas mengapa booking ini ditolak..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                rows={4}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleRejectBooking}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                disabled={!rejectionReason.trim()}
              >
                Tolak Booking
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setRejectDialogOpen(false)
                  setRejectionReason("")
                  setSelectedBooking(null)
                }}
                className="flex-1 border-gray-300 hover:bg-gray-50 bg-transparent"
              >
                {t("common.cancel")}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}