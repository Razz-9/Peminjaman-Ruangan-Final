"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type Language = "id" | "en"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const translations = {
  id: {
    // Navigation
    "nav.dashboard": "Beranda",
    "nav.roomInfo": "Info Ruangan",
    "nav.myBookings": "Booking Saya",
    "nav.roomBooking": "Pesan Ruangan",
    "nav.history": "Riwayat",
    "nav.settings": "Pengaturan",
    "nav.adminLogin": "Masuk Admin",
    "nav.adminPanel": "Panel Admin",
    "nav.logout": "Keluar",
    "nav.logoutAdmin": "Keluar Admin",

    // Dashboard
    "dashboard.title": "Beranda",
    "dashboard.subtitle": "Kelola jadwal booking ruangan",
    "dashboard.userSubtitle": "Lihat jadwal booking ruangan",
    "dashboard.today": "Hari Ini",
    "dashboard.approved": "Disetujui",
    "dashboard.active": "Sedang Berlangsung",
    "dashboard.pending": "Menunggu Persetujuan",
    "dashboard.legend": "Keterangan:",
    "dashboard.overview": "Beranda",
    "dashboard.calendar": "Kalender",
    "dashboard.bookings": "Pemesanan",
    "dashboard.rooms": "Ruangan",
    "dashboard.history": "Riwayat",
    "dashboard.settings": "Pengaturan",
    "dashboard.logout": "Keluar",

    // Booking
    "booking.title": "Pesan Ruangan",
    "booking.subtitle": "Booking ruangan sesuai kebutuhan Anda",
    "booking.bookRoom": "Form Booking Ruangan",
    "booking.phone": "No. Telepon",
    "booking.phonePlaceholder": "Masukkan nomor telepon",
    "booking.name": "Nama Lengkap",
    "booking.fullName": "Nama lengkap",
    "booking.namePlaceholder": "Masukkan nama lengkap",
    "booking.unit": "Unit Kerja",
    "booking.unitPlaceholder": "Masukkan unit kerja",
    "booking.selectRoom": "Pilih Ruangan",
    "booking.selectRoomPlaceholder": "Pilih ruangan yang diinginkan",
    "booking.date": "Tanggal Booking",
    "booking.selectDate": "Pilih tanggal booking",
    "booking.startTime": "Waktu Mulai",
    "booking.endTime": "Waktu Selesai",
    "booking.selectStartTime": "Pilih waktu mulai",
    "booking.selectEndTime": "Pilih waktu selesai",
    "booking.timeFormat": "Format: 00:00 - 23:59",
    "booking.submit": "Kirim Booking",
    "booking.reset": "Reset Form",
    "booking.submitting": "Sedang mengirim...",
    "booking.facilities": "Fasilitas Tersedia",
    "booking.roomDescription": "Deskripsi Ruangan",
    "booking.success": "Booking Berhasil Dikirim!",
    "booking.successDesc": "Booking ruangan Anda telah berhasil dikirim. Silakan tunggu konfirmasi dari admin.",
    "booking.bookAnother": "Booking Lagi",
    "booking.viewBookings": "Lihat Booking Saya",
    "booking.weekendNote": "Booking tidak tersedia untuk hari Sabtu dan Minggu",
    "booking.timeNote": "Waktu operasional: 07:00 - 22:30, minimal durasi 30 menit",
    "booking.errorRequired": "Mohon lengkapi semua field yang wajib diisi",
    "booking.errorTimeFormat": "Format waktu harus 00:00 - 23:59 (24 jam)",
    "booking.errorEndTime": "Waktu selesai harus lebih dari waktu mulai",
    "booking.errorMinDuration": "Durasi booking minimal 30 menit",
    "booking.errorPastDate": "Booking hanya bisa dilakukan untuk besok atau hari setelahnya",
    "booking.errorWeekend": "Booking tidak tersedia untuk hari Sabtu dan Minggu",
    "booking.errorSubmit": "Gagal mengirim booking. Silakan coba lagi.",
    "booking.conflictTitle": "Bentrok Waktu",
    "booking.conflictDesc": "Waktu yang dipilih sudah dibooking. Silakan pilih waktu lain.",

    // History
    "history.title": "Booking Saya",
    "history.subtitle": "Riwayat booking ruangan Anda",
    "history.bookingHistory": "Riwayat Booking",
    "history.search": "Cari booking...",
    "history.sortNewest": "Terbaru",
    "history.sortOldest": "Terlama",
    "history.sortName": "Nama A-Z",
    "history.filters": "Filter",
    "history.room": "Ruangan",
    "history.allRooms": "Semua Ruangan",
    "history.status": "Status",
    "history.allStatus": "Semua Status",
    "history.fromDate": "Dari Tanggal",
    "history.toDate": "Sampai Tanggal",
    "history.selectDate": "Pilih tanggal",
    "history.clearFilters": "Hapus Filter",
    "history.nameCol": "Nama",
    "history.unitCol": "Unit Kerja",
    "history.roomCol": "Ruangan",
    "history.timeCol": "Tanggal & Waktu",
    "history.durationCol": "Durasi",
    "history.statusCol": "Status",
    "history.rejectionReason": "Alasan Ditolak:",
    "history.noBookings": "Belum ada booking",
    "history.noBookingsDesc": "Riwayat booking Anda akan muncul di sini",
    "history.adjustFilters": "Coba ubah filter pencarian",
    "history.showing": "Menampilkan",
    "history.of": "dari",
    "history.bookings": "booking",
    "history.filtered": "(terfilter)",

    // Rooms
    "rooms.title": "Info Ruangan",
    "rooms.subtitle": "Informasi ruangan yang tersedia",
    "rooms.search": "Cari ruangan...",
    "rooms.noRooms": "Ruangan tidak ditemukan",
    "rooms.noRoomsDesc": "Coba gunakan kata kunci lain",

    // Status
    "status.approved": "Disetujui",
    "status.pending": "Menunggu",
    "status.rejected": "Ditolak",
    "status.active": "Berlangsung",
    "status.completed": "Selesai",

    // Smart Assistant
    "assistant.title": "Asisten Pintar",
    "assistant.suggestions": "Saran berdasarkan data booking terkini",
    "assistant.weekdayOptimal": "Hari {0} Masih Optimal",
    "assistant.weekdayOptimalDesc": "Hari {0} booking masih sedikit. Waktu terbaik untuk rapat!",
    "assistant.bestTimeSlots": "Slot Waktu Terbaik",
    "assistant.bestTimeSlotsDesc": "Jam {0} tersedia untuk hari kerja. Booking sekarang!",
    "assistant.hiddenGem": "Ruangan Rekomendasi",
    "assistant.hiddenGemDesc": "{0} jarang dipakai dan kemungkinan besar tersedia",
    "assistant.peakInsight": "Info Jam Sibuk",
    "assistant.peakInsightDesc": "Jam {0} adalah jam tersibuk di hari kerja. Coba booking di waktu lain",
    "assistant.planAhead": "Rencana Hari {0}",
    "assistant.planAheadDesc": "Hari {0} masih kosong total. Sempurna untuk rencana rapat!",
    "assistant.weekendReminder": "Libur Akhir Pekan",
    "assistant.weekendReminderDesc": "Booking tidak tersedia akhir pekan. Hari {0} adalah hari kerja berikutnya.",
    "assistant.quickTip24h": "Tips Booking",
    "assistant.quickTip24hDesc": "Pilih waktu dari dropdown (07:00-22:30). Minimal durasi 30 menit.",
    "assistant.bookWeekday": "Booking Hari Kerja",
    "assistant.bookNow": "Booking Sekarang",
    "assistant.viewRoom": "Lihat Ruangan",
    "assistant.planNow": "Buat Rencana",
    "assistant.quickStats": "Statistik Cepat",
    "assistant.totalBookings": "Total Booking",
    "assistant.roomsAvailable": "Ruangan Tersedia",
    "assistant.high": "Penting",
    "assistant.medium": "Sedang",
    "assistant.tip": "Tips",

    // Admin
    "admin.title": "Panel Admin",
    "admin.bookingManagement": "Kelola Booking",
    "admin.allBookings": "Semua Booking",
    "admin.contact": "Kontak",
    "admin.department": "Departemen",
    "admin.duration": "Durasi",
    "admin.actions": "Aksi",

    // Common
    "common.loading": "Memuat...",
    "common.error": "Error",
    "common.success": "Berhasil",
    "common.cancel": "Batal",
    "common.save": "Simpan",
    "common.edit": "Edit",
    "common.delete": "Hapus",
    "common.add": "Tambah",
    "common.search": "Cari",
    "common.filter": "Filter",
    "common.clear": "Hapus",
    "common.close": "Tutup",
    "common.open": "Buka",
    "common.yes": "Ya",
    "common.no": "Tidak",
    "common.required": "Wajib diisi",
    "common.optional": "Opsional",

    // Time
    "time.minutes": "menit",
    "time.hours": "jam",
    "time.min": "mnt",
    "time.hour": "jam",

    // Days
    "day.sunday": "Minggu",
    "day.monday": "Senin",
    "day.tuesday": "Selasa",
    "day.wednesday": "Rabu",
    "day.thursday": "Kamis",
    "day.friday": "Jumat",
    "day.saturday": "Sabtu",

    // Months
    "month.january": "Januari",
    "month.february": "Februari",
    "month.march": "Maret",
    "month.april": "April",
    "month.may": "Mei",
    "month.june": "Juni",
    "month.july": "Juli",
    "month.august": "Agustus",
    "month.september": "September",
    "month.october": "Oktober",
    "month.november": "November",
    "month.december": "Desember",

    // Calendar
    "calendar.title": "Kalender",
    "calendar.today": "Hari Ini",
    "calendar.previousMonth": "Bulan Sebelumnya",
    "calendar.nextMonth": "Bulan Berikutnya",
  },
  en: {
    // Navigation
    "nav.dashboard": "Dashboard",
    "nav.roomInfo": "Room Info",
    "nav.myBookings": "My Bookings",
    "nav.roomBooking": "Book Room",
    "nav.history": "History",
    "nav.settings": "Settings",
    "nav.adminLogin": "Admin Login",
    "nav.adminPanel": "Admin Panel",
    "nav.logout": "Logout",
    "nav.logoutAdmin": "Logout Admin",

    // Dashboard
    "dashboard.title": "Dashboard",
    "dashboard.subtitle": "Manage room booking schedules",
    "dashboard.userSubtitle": "View room booking schedules",
    "dashboard.today": "Today",
    "dashboard.approved": "Approved",
    "dashboard.active": "Active",
    "dashboard.pending": "Pending",
    "dashboard.legend": "Legend:",
    "dashboard.overview": "Overview",
    "dashboard.calendar": "Calendar",
    "dashboard.bookings": "Bookings",
    "dashboard.rooms": "Rooms",
    "dashboard.history": "History",
    "dashboard.settings": "Settings",
    "dashboard.logout": "Logout",

    // Booking
    "booking.title": "Book Room",
    "booking.subtitle": "Book a room for your needs",
    "booking.bookRoom": "Room Booking Form",
    "booking.phone": "Phone Number",
    "booking.phonePlaceholder": "Enter phone number",
    "booking.name": "Full Name",
    "booking.fullName": "Full name",
    "booking.namePlaceholder": "Enter full name",
    "booking.unit": "Work Unit",
    "booking.unitPlaceholder": "Enter work unit",
    "booking.selectRoom": "Select Room",
    "booking.selectRoomPlaceholder": "Choose a room",
    "booking.date": "Booking Date",
    "booking.selectDate": "Select booking date",
    "booking.startTime": "Start Time",
    "booking.endTime": "End Time",
    "booking.selectStartTime": "Select start time",
    "booking.selectEndTime": "Select end time",
    "booking.timeFormat": "Format: 00:00 - 23:59",
    "booking.submit": "Submit Booking",
    "booking.reset": "Reset Form",
    "booking.submitting": "Submitting...",
    "booking.facilities": "Available Facilities",
    "booking.roomDescription": "Room Description",
    "booking.success": "Booking Submitted Successfully!",
    "booking.successDesc": "Your room booking has been submitted successfully. Please wait for admin confirmation.",
    "booking.bookAnother": "Book Another Room",
    "booking.viewBookings": "View My Bookings",
    "booking.weekendNote": "Booking not available on weekends (Saturday & Sunday)",
    "booking.timeNote": "Operating hours: 07:00 - 22:30, minimum 30 minutes duration",
    "booking.errorRequired": "Please fill in all required fields",
    "booking.errorTimeFormat": "Time format must be 00:00 - 23:59 (24-hour)",
    "booking.errorEndTime": "End time must be later than start time",
    "booking.errorMinDuration": "Minimum booking duration is 30 minutes",
    "booking.errorPastDate": "Booking can only be made for tomorrow or later",
    "booking.errorWeekend": "Booking not available on weekends (Saturday & Sunday)",
    "booking.errorSubmit": "Failed to submit booking. Please try again.",
    "booking.conflictTitle": "Time Conflict",
    "booking.conflictDesc": "Selected time is already booked. Please choose another time.",

    // History
    "history.title": "My Bookings",
    "history.subtitle": "Your room booking history",
    "history.bookingHistory": "Booking History",
    "history.search": "Search bookings...",
    "history.sortNewest": "Newest",
    "history.sortOldest": "Oldest",
    "history.sortName": "Name A-Z",
    "history.filters": "Filters",
    "history.room": "Room",
    "history.allRooms": "All Rooms",
    "history.status": "Status",
    "history.allStatus": "All Status",
    "history.fromDate": "From Date",
    "history.toDate": "To Date",
    "history.selectDate": "Select date",
    "history.clearFilters": "Clear Filters",
    "history.nameCol": "Name",
    "history.unitCol": "Work Unit",
    "history.roomCol": "Room",
    "history.timeCol": "Date & Time",
    "history.durationCol": "Duration",
    "history.statusCol": "Status",
    "history.rejectionReason": "Rejection Reason:",
    "history.noBookings": "No bookings found",
    "history.noBookingsDesc": "Your booking history will appear here",
    "history.adjustFilters": "Try adjusting your search filters",
    "history.showing": "Showing",
    "history.of": "of",
    "history.bookings": "bookings",
    "history.filtered": "(filtered)",

    // Rooms
    "rooms.title": "Room Info",
    "rooms.subtitle": "Available room information",
    "rooms.search": "Search rooms...",
    "rooms.noRooms": "No rooms found",
    "rooms.noRoomsDesc": "Try different search terms",

    // Status
    "status.approved": "Approved",
    "status.pending": "Pending",
    "status.rejected": "Rejected",
    "status.active": "Active",
    "status.completed": "Completed",

    // Smart Assistant
    "assistant.title": "Smart Assistant",
    "assistant.suggestions": "Smart suggestions based on current booking data",
    "assistant.weekdayOptimal": "{0} is Optimal",
    "assistant.weekdayOptimalDesc": "{0} has low booking activity. Perfect time for meetings!",
    "assistant.bestTimeSlots": "Best Time Slots",
    "assistant.bestTimeSlotsDesc": "{0} are available for weekdays. Book now!",
    "assistant.hiddenGem": "Recommended Room",
    "assistant.hiddenGemDesc": "{0} is underutilized and likely available",
    "assistant.peakInsight": "Peak Hours Info",
    "assistant.peakInsightDesc": "{0} is the busiest hour on weekdays. Try booking at different times",
    "assistant.planAhead": "Plan for {0}",
    "assistant.planAheadDesc": "{0} is completely free. Perfect for planning meetings!",
    "assistant.weekendReminder": "Weekend Break",
    "assistant.weekendReminderDesc": "Booking unavailable on weekends. {0} is the next weekday.",
    "assistant.quickTip24h": "Booking Tips",
    "assistant.quickTip24hDesc": "Select time from dropdown (07:00-22:30). Minimum 30 minutes duration.",
    "assistant.bookWeekday": "Book Weekday",
    "assistant.bookNow": "Book Now",
    "assistant.viewRoom": "View Room",
    "assistant.planNow": "Make Plan",
    "assistant.quickStats": "Quick Stats",
    "assistant.totalBookings": "Total Bookings",
    "assistant.roomsAvailable": "Rooms Available",
    "assistant.high": "High",
    "assistant.medium": "Medium",
    "assistant.tip": "Tip",

    // Admin
    "admin.title": "Admin Panel",
    "admin.bookingManagement": "Booking Management",
    "admin.allBookings": "All Bookings",
    "admin.contact": "Contact",
    "admin.department": "Department",
    "admin.duration": "Duration",
    "admin.actions": "Actions",

    // Common
    "common.loading": "Loading...",
    "common.error": "Error",
    "common.success": "Success",
    "common.cancel": "Cancel",
    "common.save": "Save",
    "common.edit": "Edit",
    "common.delete": "Delete",
    "common.add": "Add",
    "common.search": "Search",
    "common.filter": "Filter",
    "common.clear": "Clear",
    "common.close": "Close",
    "common.open": "Open",
    "common.yes": "Yes",
    "common.no": "No",
    "common.required": "Required",
    "common.optional": "Optional",

    // Time
    "time.minutes": "minutes",
    "time.hours": "hours",
    "time.min": "min",
    "time.hour": "hr",

    // Days
    "day.sunday": "Sunday",
    "day.monday": "Monday",
    "day.tuesday": "Tuesday",
    "day.wednesday": "Wednesday",
    "day.thursday": "Thursday",
    "day.friday": "Friday",
    "day.saturday": "Saturday",

    // Months
    "month.january": "January",
    "month.february": "February",
    "month.march": "March",
    "month.april": "April",
    "month.may": "May",
    "month.june": "June",
    "month.july": "July",
    "month.august": "August",
    "month.september": "September",
    "month.october": "October",
    "month.november": "November",
    "month.december": "December",

    // Calendar
    "calendar.title": "Calendar",
    "calendar.today": "Today",
    "calendar.previousMonth": "Previous Month",
    "calendar.nextMonth": "Next Month",
  },
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("id")

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage && (savedLanguage === "id" || savedLanguage === "en")) {
      setLanguage(savedLanguage)
    }
  }, [])

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem("language", lang)
  }

  const t = (key: string): string => {
    return translations[language][key as keyof (typeof translations)[typeof language]] || key
  }

  const getMonthName = (monthIndex: number): string => {
    const monthKeys = [
      "month.january",
      "month.february",
      "month.march",
      "month.april",
      "month.may",
      "month.june",
      "month.july",
      "month.august",
      "month.september",
      "month.october",
      "month.november",
      "month.december",
    ]
    return t(monthKeys[monthIndex])
  }

  const getDayName = (dayIndex: number): string => {
    const dayKeys = [
      "day.sunday",
      "day.monday",
      "day.tuesday",
      "day.wednesday",
      "day.thursday",
      "day.friday",
      "day.saturday",
    ]
    return t(dayKeys[dayIndex])
  }

  return (
    <LanguageContext.Provider
      value={
        {
          language,
          setLanguage: handleSetLanguage,
          t,
          getMonthName,
          getDayName,
        } as any
      }
    >
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context as LanguageContextType & {
    getMonthName: (monthIndex: number) => string
    getDayName: (dayIndex: number) => string
  }
}