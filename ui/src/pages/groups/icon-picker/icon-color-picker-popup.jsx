"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Home, Briefcase, GraduationCap, Building, Building2, Bed, Castle, TreePine, Crown, BookOpen } from 'lucide-react'

export default function IconColorPickerPopup({ open, onOpenChange, onSelectIcon, selectedIcon }) {
  const [tempSelectedIcon, setTempSelectedIcon] = useState({
    iconId: "home",
    color: "bg-blue-500",
    name: "Nhà"
  })

  const icons = [
    { component: Home, name: "Nhà", id: "home" },
    { component: Briefcase, name: "Cơ quan", id: "office" },
    { component: GraduationCap, name: "Trường", id: "school" },
    { component: Building, name: "Ngân hàng", id: "bank" },
    { component: Building2, name: "Căn hộ", id: "apartment" },
    { component: Bed, name: "Khách sạn", id: "hotel" },
    { component: Castle, name: "Biệt thự", id: "villa" },
    { component: TreePine, name: "Nhà gỗ", id: "wooden" },
    { component: Crown, name: "Lâu đài", id: "castle" },
    { component: BookOpen, name: "Thư viện", id: "library" },
  ]

  const colors = [
    { name: "Đỏ", value: "bg-red-500", id: "red" },
    { name: "Xanh lá", value: "bg-green-500", id: "green" },
    { name: "Xanh dương", value: "bg-blue-500", id: "blue" },
    { name: "Vàng", value: "bg-yellow-500", id: "yellow" },
    { name: "Xanh cyan", value: "bg-cyan-500", id: "cyan" },
  ]

  useEffect(() => {
    if (selectedIcon) {
      setTempSelectedIcon({
        iconId: selectedIcon.iconId || "home",
        color: selectedIcon.color || "bg-blue-500",
        name: selectedIcon.name || "Nhà"
      })
    }
  }, [selectedIcon, open])

  const handleIconSelect = (iconData) => {
    setTempSelectedIcon((prev) => ({
      ...prev,
      iconId: iconData.id,
      name: iconData.name,
    }))
  }

  const handleColorSelect = (colorData) => {
    setTempSelectedIcon((prev) => ({
      ...prev,
      color: colorData.value,
    }))
  }

  const handleConfirm = () => {
    const selectedIconData = icons.find(icon => icon.id === tempSelectedIcon.iconId)
    onSelectIcon({
      iconId: tempSelectedIcon.iconId,
      component: selectedIconData?.component,
      color: tempSelectedIcon.color,
      name: tempSelectedIcon.name,
    })
    onOpenChange(false)
  }

  const handleCancel = () => {
    if (selectedIcon) {
      setTempSelectedIcon({
        iconId: selectedIcon.iconId || "home",
        color: selectedIcon.color || "bg-blue-500",
        name: selectedIcon.name || "Nhà"
      })
    } else {
      setTempSelectedIcon({
        iconId: "home",
        color: "bg-blue-500",
        name: "Nhà"
      })
    }
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0 rounded-2xl">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle className="text-lg font-medium text-left">Chọn biểu tượng:</DialogTitle>
        </DialogHeader>

        <div className="px-6 pb-6">
          {/* Icons Grid */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {icons.map((iconData) => {
              const IconComponent = iconData.component
              const isSelected = tempSelectedIcon.iconId === iconData.id
              return (
                <button
                  key={iconData.id}
                  onClick={() => handleIconSelect(iconData)}
                  className={`flex flex-col items-center p-3 rounded-lg transition-all hover:bg-gray-50 ${
                    isSelected ? "bg-blue-50 border-2 border-blue-500" : "border-2 border-transparent"
                  }`}
                >
                  <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center mb-2">
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-xs text-gray-700 text-center leading-tight">{iconData.name}</span>
                </button>
              )
            })}
          </div>

          {/* Color Selection */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Chọn màu sắc:</h3>
            <div className="flex justify-start space-x-4">
              {colors.map((colorData) => (
                <button
                  key={colorData.id}
                  onClick={() => handleColorSelect(colorData)}
                  className={`w-10 h-10 rounded-full ${colorData.value} border-4 transition-all hover:scale-110 ${
                    tempSelectedIcon.color === colorData.value ? "border-gray-800 shadow-lg" : "border-gray-200"
                  }`}
                  title={colorData.name}
                />
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="flex-1 h-11 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg"
            >
              Hủy
            </Button>
            <Button onClick={handleConfirm} className="flex-1 h-11 bg-blue-500 hover:bg-blue-500 text-white rounded-lg">
              Tạo
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
