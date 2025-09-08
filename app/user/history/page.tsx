"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Search, ChevronLeft, ChevronRight, AlertCircle, CalendarIcon, Filter, X } from 'lucide-react'
import { useData } from "@/contexts/DataContext"
import { useLanguage } from "@/contexts/LanguageContext"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

export default function UserHistory() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("newest")
  const [selectedRoom, setSelectedRoom] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [dateFrom, setDateFrom] = useState<Date>()
  const [dateTo, setDateTo] = useState<Date>()
  const [showFilters, setShowFilters] = useState(false)
  
  const { bookings, getRoomById, rooms } = useData()
  const { t } = useLanguage()

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

  const filteredBookings = bookings
    .filter((booking) => {
      // Search filter
      const matchesSearch = 
        booking.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.unitKerja.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getRoomById(booking.roomId)?.name.toLowerCase().includes(searchTerm.toLowerCase())

      // Room filter
      const matchesRoom = selectedRoom === "all" || booking.roomId === selectedRoom

      // Status filter
      const matchesStatus = selectedStatus === "all" || booking.status === selectedStatus

      // Date range filter
      const bookingDate = new Date(booking.bookingDate)
      const matchesDateFrom = !dateFrom || bookingDate >= dateFrom
      const matchesDateTo = !dateTo || bookingDate <= dateTo

      return matchesSearch && matchesRoom && matchesStatus && matchesDateFrom && matchesDateTo
    })
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

  const clearFilters = () => {
    setSelectedRoom("all")
    setSelectedStatus("all")
    setDateFrom(undefined)
    setDateTo(undefined)
    setSearchTerm("")
  }

  const activeFiltersCount = [
    selectedRoom !== "all",
    selectedStatus !== "all",
    dateFrom,
    dateTo,
    searchTerm
  ].filter(Boolean).length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{t("history.title")}</h1>
        <p className="text-gray-600 mt-1">{t("history.subtitle")}</p>
      </div>

      <Card className="shadow-sm border border-gray-200">
        <CardHeader className="border-b border-gray-200 bg-white">
          <CardTitle className="text-xl font-semibold text-gray-900">{t("history.bookingHistory")}</CardTitle>
          
          {/* Search and Basic Filters */}
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

            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                "border-gray-300 hover:bg-gray-50 bg-transparent",
                activeFiltersCount > 0 && "border-blue-500 bg-blue-50 text-blue-700"
              )}
            >
              <Filter className="w-4 h-4 mr-2" />
              {t("history.filters")}
              {activeFiltersCount > 0 && (
                <span className="ml-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </Button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Room Filter */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">{t("history.room")}</label>
                  <Select value={selectedRoom} onValueChange={setSelectedRoom}>
                    <SelectTrigger className="border-gray-300">
                      <SelectValue placeholder={t("history.allRooms")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t("history.allRooms")}</SelectItem>
                      {rooms.map((room) => (
                        <SelectItem key={room.id} value={room.id}>
                          {room.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Status Filter */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">{t("history.status")}</label>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="border-gray-300">
                      <SelectValue placeholder={t("history.allStatus")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t("history.allStatus")}</SelectItem>
                      <SelectItem value="pending">{t("status.pending")}</SelectItem>
                      <SelectItem value="approved">{t("status.approved")}</SelectItem>
                      <SelectItem value="rejected">{t("status.rejected")}</SelectItem>
                      <SelectItem value="active">{t("status.active")}</SelectItem>
                      <SelectItem value="completed">{t("status.completed")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Date From */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">{t("history.fromDate")}</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal border-gray-300",
                          !dateFrom && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateFrom ? format(dateFrom, "PPP") : t("history.selectDate")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={dateFrom}
                        onSelect={setDateFrom}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Date To */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">{t("history.toDate")}</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal border-gray-300",
                          !dateTo && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateTo ? format(dateTo, "PPP") : t("history.selectDate")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={dateTo}
                        onSelect={setDateTo}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* Clear Filters */}
              {activeFiltersCount > 0 && (
                <div className="mt-4 flex justify-end">
                  <Button
                    variant="ghost"
                    onClick={clearFilters}
                    className="text-gray-600 hover:text-gray-800"
                  >
                    <X className="w-4 h-4 mr-2" />
                    {t("history.clearFilters")}
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardHeader>
        
        <CardContent className="p-0">
          {filteredBookings.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">{t("history.noBookings")}</p>
              <p className="text-gray-400 text-sm mt-2">
                {activeFiltersCount > 0 ? t("history.adjustFilters") : t("history.noBookingsDesc")}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold text-gray-700">{t("history.nameCol")}</TableHead>
                  <TableHead className="font-semibold text-gray-700">{t("history.unitCol")}</TableHead>
                  <TableHead className="font-semibold text-gray-700">{t("history.roomCol")}</TableHead>
                  <TableHead className="font-semibold text-gray-700">{t("history.timeCol")}</TableHead>
                  <TableHead className="font-semibold text-gray-700">{t("history.durationCol")}</TableHead>
                  <TableHead className="font-semibold text-gray-700">{t("history.statusCol")}</TableHead>
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
                      <TableCell>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                          {booking.unitKerja}
                        </span>
                      </TableCell>
                      <TableCell className="text-gray-700">{room?.name || "Unknown Room"}</TableCell>
                      <TableCell>
                        <div>
                          <div className="text-gray-900">{format(bookingDate, "EEEE, dd MMMM yyyy")}</div>
                          <div className="text-sm text-gray-500">
                            ({booking.startTime} - {booking.endTime})
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-700">{duration}</TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          {getStatusBadge(booking.status)}
                          {booking.status === "rejected" && booking.rejectionReason && (
                            <div className="flex items-start gap-2 p-2 bg-red-50 border border-red-200 rounded-md">
                              <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                              <div>
                                <p className="text-xs font-medium text-red-800">{t("history.rejectionReason")}</p>
                                <p className="text-xs text-red-700 mt-1">{booking.rejectionReason}</p>
                              </div>
                            </div>
                          )}
                        </div>
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
                {t("history.showing")} {filteredBookings.length} {t("history.of")} {bookings.length} {t("history.bookings")}
                {activeFiltersCount > 0 && ` ${t("history.filtered")}`}
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
    </div>
  )
}