"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Clock } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"

interface TimePickerProps {
  value?: string
  onChange: (time: string) => void
  placeholder?: string
  disabled?: boolean
}

export function TimePicker({ value, onChange, placeholder, disabled }: TimePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedHour, setSelectedHour] = useState(7)
  const [selectedMinute, setSelectedMinute] = useState(0)
  const { t } = useLanguage()

  // Generate hours from 07 to 22
  const hours = Array.from({ length: 16 }, (_, i) => i + 7)
  const minutes = Array.from({ length: 60 }, (_, i) => i)

  useEffect(() => {
    if (value) {
      const [hour, minute] = value.split(":").map(Number)
      setSelectedHour(hour)
      setSelectedMinute(minute)
    }
  }, [value])

  const handleSelect = () => {
    const timeString = `${selectedHour.toString().padStart(2, "0")}:${selectedMinute.toString().padStart(2, "0")}`
    onChange(timeString)
    setIsOpen(false)
  }

  const formatDisplayTime = () => {
    if (value) {
      return value
    }
    return `${selectedHour.toString().padStart(2, "0")}:${selectedMinute.toString().padStart(2, "0")}`
  }

  return (
    <div className="relative">
      <Button
        type="button"
        variant="outline"
        className="w-full justify-start text-left font-normal bg-transparent"
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
      >
        <Clock className="mr-2 h-4 w-4" />
        {value || placeholder || "Pilih waktu"}
      </Button>

      {isOpen && (
        <Card className="absolute top-full left-0 right-0 z-50 mt-1 shadow-lg">
          <CardContent className="p-4">
            <div className="flex gap-4 mb-4">
              {/* Hours Column */}
              <div className="flex-1">
                <div className="text-sm font-medium mb-2 text-center">Jam</div>
                <div className="max-h-32 overflow-y-auto border rounded">
                  {hours.map((hour) => (
                    <button
                      key={hour}
                      type="button"
                      className={`w-full px-3 py-2 text-center hover:bg-gray-100 ${
                        selectedHour === hour ? "bg-blue-500 text-white" : "text-gray-700"
                      }`}
                      onClick={() => setSelectedHour(hour)}
                    >
                      {hour.toString().padStart(2, "0")}
                    </button>
                  ))}
                </div>
              </div>

              {/* Minutes Column */}
              <div className="flex-1">
                <div className="text-sm font-medium mb-2 text-center">Menit</div>
                <div className="max-h-32 overflow-y-auto border rounded">
                  {minutes.map((minute) => (
                    <button
                      key={minute}
                      type="button"
                      className={`w-full px-3 py-2 text-center hover:bg-gray-100 ${
                        selectedMinute === minute ? "bg-blue-500 text-white" : "text-gray-700"
                      }`}
                      onClick={() => setSelectedMinute(minute)}
                    >
                      {minute.toString().padStart(2, "0")}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Selected Time Display */}
            <div className="text-center mb-4 p-2 bg-gray-50 rounded">
              <div className="text-lg font-mono">{formatDisplayTime()}</div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1 bg-transparent"
                onClick={() => setIsOpen(false)}
              >
                {t("common.cancel")}
              </Button>
              <Button type="button" className="flex-1" onClick={handleSelect}>
                Pilih
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
