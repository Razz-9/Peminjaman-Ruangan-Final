"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Edit, Trash2, Upload, X } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { useData } from "@/contexts/DataContext"
import { useToast } from "@/hooks/use-toast"

const amenitiesList = [
  "TV",
  "Proyektor",
  "Meja",
  "Wi-Fi",
  "Mic",
  "Speakers",
  "Coffee maker",
  "Refrigerator",
  "Air conditioner",
  "TV Cable",
]

const accessibilityFeatures = ["Lift", "Pencahayaan Baik"]

export default function RoomInformation() {
  const { rooms, addRoom, updateRoom, deleteRoom } = useData()
  const { toast } = useToast()

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingRoom, setEditingRoom] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: "",
    capacity: "",
    floor: "",
    description: "",
    amenities: [] as string[],
    accessibility: [] as string[],
    image: "",
  })
  const [imagePreview, setImagePreview] = useState<string>("")
  const [isUploading, setIsUploading] = useState(false)

  const handleAddRoom = () => {
    setFormData({
      name: "",
      capacity: "",
      floor: "",
      description: "",
      amenities: [],
      accessibility: [],
      image: "",
    })
    setImagePreview("")
    setEditingRoom(null)
    setIsAddDialogOpen(true)
  }

  const handleEditRoom = (room: any) => {
    setFormData({
      name: room.name,
      capacity: room.capacity,
      floor: room.floor,
      description: room.description,
      amenities: room.amenities || [],
      accessibility: [],
      image: room.image || "",
    })
    setImagePreview(room.image || "")
    setEditingRoom(room)
    setIsAddDialogOpen(true)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setIsUploading(true)

      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Error",
          description: "Please select a valid image file",
          variant: "destructive",
        })
        setIsUploading(false)
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Error",
          description: "Image size should be less than 5MB",
          variant: "destructive",
        })
        setIsUploading(false)
        return
      }

      const reader = new FileReader()
      reader.onload = (event) => {
        const imageDataUrl = event.target?.result as string
        setFormData({ ...formData, image: imageDataUrl })
        setImagePreview(imageDataUrl)
        setIsUploading(false)
        toast({
          title: "Success",
          description: "Image uploaded successfully",
        })
      }
      reader.onerror = () => {
        toast({
          title: "Error",
          description: "Failed to upload image",
          variant: "destructive",
        })
        setIsUploading(false)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setFormData({ ...formData, image: "" })
    setImagePreview("")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const roomData = {
      name: formData.name,
      capacity: formData.capacity,
      floor: formData.floor,
      description: formData.description,
      amenities: formData.amenities,
      image: formData.image || "/placeholder.svg?height=200&width=300",
      isActive: true,
    }

    if (editingRoom) {
      updateRoom(editingRoom.id, roomData)
      toast({
        title: "Success",
        description: "Room updated successfully",
      })
    } else {
      addRoom(roomData)
      toast({
        title: "Success",
        description: "Room added successfully",
      })
    }

    setIsAddDialogOpen(false)
    setEditingRoom(null)
  }

  const handleDeleteRoom = (id: string) => {
    if (confirm("Are you sure you want to delete this room?")) {
      deleteRoom(id)
      toast({
        title: "Success",
        description: "Room deleted successfully",
      })
    }
  }

  const toggleAmenity = (amenity: string) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }))
  }

  const toggleAccessibility = (feature: string) => {
    setFormData((prev) => ({
      ...prev,
      accessibility: prev.accessibility.includes(feature)
        ? prev.accessibility.filter((a) => a !== feature)
        : [...prev.accessibility, feature],
    }))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Room Information</h1>
          <p className="text-gray-600 mt-1">Kelola informasi ruangan</p>
        </div>
        <Button onClick={handleAddRoom} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
          <Plus className="w-4 h-4 mr-2" />
          Add Room
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map((room) => (
          <Card
            key={room.id}
            className="overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="relative">
              <img src={room.image || "/placeholder.svg"} alt={room.name} className="w-full h-48 object-cover" />
              <div className="absolute top-3 right-3 flex gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  className="bg-white/90 hover:bg-white text-gray-700 rounded-full w-8 h-8 p-0"
                  onClick={() => handleEditRoom(room)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  className="bg-red-500/90 hover:bg-red-600 text-white rounded-full w-8 h-8 p-0"
                  onClick={() => handleDeleteRoom(room.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
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
                  <p className="font-medium text-gray-900 text-sm mb-1">Fasilitas</p>
                  <p className="text-gray-600 text-sm mb-2">{room.amenities?.join(", ") || "No amenities"}</p>
                </div>

                <div>
                  <p className="font-medium text-gray-900 text-sm mb-1">Deskripsi Ruangan</p>
                  <p className="text-gray-600 text-xs leading-relaxed line-clamp-3">{room.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-900">
              {editingRoom ? "Edit Room" : "Add New Room"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label className="text-gray-700 font-medium">Room Picture</Label>
              <div className="mt-2">
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview || "/placeholder.svg"}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg border border-gray-300"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2 rounded-full w-8 h-8 p-0"
                      onClick={removeImage}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600 mb-2">Click to upload image</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                      disabled={isUploading}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="border-gray-300 hover:bg-gray-50 bg-transparent"
                      onClick={() => document.getElementById("image-upload")?.click()}
                      disabled={isUploading}
                    >
                      {isUploading ? "Uploading..." : "Choose Image"}
                    </Button>
                    <p className="text-xs text-gray-500 mt-2">Max size: 5MB. Formats: JPG, PNG, GIF</p>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Room Details</h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="roomName" className="text-gray-700 font-medium">
                    Nama Ruangan*
                  </Label>
                  <Input
                    id="roomName"
                    placeholder="room number"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <Label htmlFor="roomFloor" className="text-gray-700 font-medium">
                    Lantai Ruangan*
                  </Label>
                  <Input
                    id="roomFloor"
                    placeholder="room floor number"
                    value={formData.floor}
                    onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                    required
                    className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="roomCapacity" className="text-gray-700 font-medium">
                  Kapasitas Ruangan*
                </Label>
                <Input
                  id="roomCapacity"
                  placeholder="2-4 guests"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                  required
                  className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <Label htmlFor="roomDescription" className="text-gray-700 font-medium">
                  Room description*
                </Label>
                <Textarea
                  id="roomDescription"
                  placeholder="room description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Amenities</h3>
              <div className="grid grid-cols-2 gap-4">
                {amenitiesList.map((amenity) => (
                  <div key={amenity} className="flex items-center space-x-2">
                    <Checkbox
                      id={amenity}
                      checked={formData.amenities.includes(amenity)}
                      onCheckedChange={() => toggleAmenity(amenity)}
                    />
                    <Label htmlFor={amenity} className="text-gray-700">
                      {amenity}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Accessibility Features</h3>
              <div className="grid grid-cols-2 gap-4">
                {accessibilityFeatures.map((feature) => (
                  <div key={feature} className="flex items-center space-x-2">
                    <Checkbox
                      id={feature}
                      checked={formData.accessibility.includes(feature)}
                      onCheckedChange={() => toggleAccessibility(feature)}
                    />
                    <Label htmlFor={feature} className="text-gray-700">
                      {feature}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-4 pt-6 border-t border-gray-200">
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg">
                Save Changes
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
                className="px-6 py-2 rounded-lg border-gray-300 hover:bg-gray-50"
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
