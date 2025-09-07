"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search } from 'lucide-react'
import { useData } from "@/contexts/DataContext"
import { useLanguage } from "@/contexts/LanguageContext"

export default function UserRooms() {
  const [searchTerm, setSearchTerm] = useState("")
  const { rooms } = useData()
  const { t } = useLanguage()

  const filteredRooms = rooms.filter(
    (room) =>
      room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.floor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.amenities.some((amenity) => amenity.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t("rooms.title")}</h1>
          <p className="text-gray-600 mt-1">{t("rooms.subtitle")}</p>
        </div>
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder={t("rooms.search")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRooms.map((room) => (
          <Card
            key={room.id}
            className="overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="relative">
              <img src={room.image || "/placeholder.svg"} alt={room.name} className="w-full h-48 object-cover" />
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg text-gray-900 mb-3">{room.name}</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    {room.capacity}
                  </span>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    {room.floor}
                  </span>
                </div>

                <div>
                  <p className="font-medium text-gray-900 text-sm mb-1">{t("booking.facilities")}</p>
                  <p className="text-gray-600 text-sm mb-2">{room.amenities.join(", ")}</p>
                </div>

                <div>
                  <p className="font-medium text-gray-900 text-sm mb-1">{t("booking.roomDescription")}</p>
                  <p className="text-gray-600 text-xs leading-relaxed line-clamp-3">{room.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredRooms.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">{t("rooms.noRooms")}</p>
          <p className="text-gray-400 text-sm mt-2">{t("rooms.noRoomsDesc")}</p>
        </div>
      )}
    </div>
  )
}
