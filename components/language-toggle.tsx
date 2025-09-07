"use client"

import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/LanguageContext"
import { Globe } from 'lucide-react'

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage()

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setLanguage(language === "id" ? "en" : "id")}
      className="text-gray-600 hover:text-gray-800 hover:bg-gray-100"
    >
      <Globe className="w-4 h-4 mr-2" />
      {language === "id" ? "EN" : "ID"}
    </Button>
  )
}
