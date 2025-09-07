"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface Room {
  id: string
  name: string
  capacity: string
  floor: string
  amenities: string[]
  description: string
  image: string
  isActive: boolean
}

interface Booking {
  id: string
  roomId: string
  name: string
  phone: string
  unitKerja: string
  bookingDate: string
  startTime: string
  endTime: string
  status: "pending" | "approved" | "rejected" | "active" | "completed"
  notes?: string
  rejectionReason?: string
  createdAt: string
}

interface DataContextType {
  rooms: Room[]
  bookings: Booking[]
  loading: boolean
  addRoom: (room: Omit<Room, "id" | "isActive">) => Promise<void>
  updateRoom: (id: string, room: Partial<Room>) => Promise<void>
  deleteRoom: (id: string) => Promise<void>
  addBooking: (booking: Omit<Booking, "id" | "createdAt">) => Promise<void>
  updateBookingStatus: (id: string, status: Booking["status"], rejectionReason?: string) => Promise<void>
  getBookingsByDate: (date: string) => Booking[]
  getRoomById: (id: string) => Room | undefined
  refreshData: () => Promise<void>
}

const DataContext = createContext<DataContextType | undefined>(undefined)

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [rooms, setRooms] = useState<Room[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  const fetchRooms = async () => {
    try {
      const response = await fetch("/api/rooms")
      if (response.ok) {
        const data = await response.json()
        setRooms(data)
      }
    } catch (error) {
      console.error("Error fetching rooms:", error)
    }
  }

  const fetchBookings = async () => {
    try {
      const response = await fetch("/api/bookings")
      if (response.ok) {
        const data = await response.json()
        setBookings(data)
      }
    } catch (error) {
      console.error("Error fetching bookings:", error)
    }
  }

  const refreshData = async () => {
    setLoading(true)
    await Promise.all([fetchRooms(), fetchBookings()])
    setLoading(false)
  }

  useEffect(() => {
    refreshData()
  }, [])

  const addRoom = async (room: Omit<Room, "id" | "isActive">) => {
    try {
      const response = await fetch("/api/rooms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(room),
      })

      if (response.ok) {
        const newRoom = await response.json()
        setRooms((prev) => [...prev, newRoom])
      } else {
        throw new Error("Failed to add room")
      }
    } catch (error) {
      console.error("Error adding room:", error)
      throw error
    }
  }

  const updateRoom = async (id: string, updatedRoom: Partial<Room>) => {
    try {
      const response = await fetch(`/api/rooms/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedRoom),
      })

      if (response.ok) {
        const room = await response.json()
        setRooms((prev) => prev.map((r) => (r.id === id ? room : r)))
      } else {
        throw new Error("Failed to update room")
      }
    } catch (error) {
      console.error("Error updating room:", error)
      throw error
    }
  }

  const deleteRoom = async (id: string) => {
    try {
      const response = await fetch(`/api/rooms/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setRooms((prev) => prev.filter((room) => room.id !== id))
      } else {
        throw new Error("Failed to delete room")
      }
    } catch (error) {
      console.error("Error deleting room:", error)
      throw error
    }
  }

  const addBooking = async (booking: Omit<Booking, "id" | "createdAt">) => {
    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(booking),
      })

      if (response.ok) {
        const newBooking = await response.json()
        setBookings((prev) => [...prev, newBooking])
      } else {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to add booking")
      }
    } catch (error) {
      console.error("Error adding booking:", error)
      throw error
    }
  }

  const updateBookingStatus = async (id: string, status: Booking["status"], rejectionReason?: string) => {
    try {
      const response = await fetch(`/api/bookings/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status, rejectionReason }),
      })

      if (response.ok) {
        const updatedBooking = await response.json()
        setBookings((prev) => prev.map((b) => (b.id === id ? updatedBooking : b)))
      } else {
        throw new Error("Failed to update booking status")
      }
    } catch (error) {
      console.error("Error updating booking status:", error)
      throw error
    }
  }

  const getBookingsByDate = (date: string) => {
    return bookings.filter((booking) => booking.bookingDate === date)
  }

  const getRoomById = (id: string) => {
    return rooms.find((room) => room.id === id)
  }

  const value = {
    rooms,
    bookings,
    loading,
    addRoom,
    updateRoom,
    deleteRoom,
    addBooking,
    updateBookingStatus,
    getBookingsByDate,
    getRoomById,
    refreshData,
  }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export function useData() {
  const context = useContext(DataContext)
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider")
  }
  return context
}
