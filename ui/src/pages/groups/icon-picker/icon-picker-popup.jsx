"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Home,
  Briefcase,
  GraduationCap,
  Building,
  Building2,
  Bed,
  Castle,
  TreePine,
  Crown,
  BookOpen,
} from "lucide-react"

export default function IconPickerPopup({ open, onOpenChange, onSelectIcon, selectedIcon }) {
  const [tempSelectedIcon, setTempSelectedIcon] = useState(
    selectedIcon || { icon: Home, color: "bg-blue-500", name: "Nhà" },
  )

  const icons = [
    { icon: Home, name: "Nhà", id: "home" },
    { icon: Briefcase, name: "Cơ quan", id: "office" },
    { icon: GraduationCap, name: "Trường", id: "school" },
    { icon: Building, name: "Ngân hàng", id: "bank" },
    { icon: Building2, name: "Căn hộ", id: "apartment" },
    { icon: Bed, name: "Khách sạn", id: "hotel" },
    { icon: Castle, name: "Biệt thự", id: "villa" },
    { icon: TreePine, name: "Nhà gỗ", id: "wooden" },
    { icon: Crown, name: "Lâu đài", id: "castle" },
    { icon: BookOpen, name: "Thư viện", id: "library" },
  ]

  const colors = [
    { name: "Đỏ", value: "bg-red-500", id: "red" },
    { name: "Xanh lá", value: "bg-green-500", id: "green" },
    { name: "Xanh dương", value: "bg-blue-500", id: "blue" },
    { name: "Vàng", value: "bg-yellow-500", id: "yellow" },
    { name: "Xanh cyan", value: "bg-cyan-500", id: "cyan" },
  ]

  const handleIconSelect = (iconData) => {
    setTempSelectedIcon((prev) => ({ ...prev, icon: iconData.icon, name: iconData.name, id: iconData.id }))
  }

  const handleColorSelect = (colorData) => {
    setTempSelectedIcon((prev) => ({ ...prev, color: colorData.value, colorId: colorData.id }))
  }

  const handleConfirm = () => {
    onSelectIcon(tempSelectedIcon)
    onOpenChange(false)
  }

  const handleCancel = () => {
    setTempSelectedIcon(selectedIcon || { icon: Home, color: "bg-blue-500", name: "Nhà" })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0 rounded-2xl" >
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle className="text-lg font-medium text-center">Chọn biểu tượng:</DialogTitle>
        </DialogHeader>

        <div className="px-6 pb-6">
          {/* Icons Grid */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {icons.map((iconData) => {
              const IconComponent = iconData.icon
              const isSelected = tempSelectedIcon.id === iconData.id
              return (
                <button
                  key={iconData.id}
                  onClick={() => handleIconSelect(iconData)}
                  className={`flex flex-col items-center p-3 rounded-lg transition-colors ${
                    isSelected ? "bg-gray-100 border-2 border-blue-500" : "hover:bg-gray-50"
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-lg ${tempSelectedIcon.color} flex items-center justify-center mb-2`}
                  >
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-xs text-gray-700 text-center">{iconData.name}</span>
                </button>
              )
            })}
          </div>

          {/* Colors */}
          <div className="flex justify-center space-x-3 mb-6">
            {colors.map((colorData) => (
              <button
                key={colorData.id}
                onClick={() => handleColorSelect(colorData)}
                className={`w-8 h-8 rounded-full ${colorData.value} border-2 ${
                  tempSelectedIcon.color === colorData.value ? "border-gray-800" : "border-gray-300"
                } hover:scale-110 transition-transform`}
                title={colorData.name}
              />
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="flex-1 h-11 border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Hủy
            </Button>
            <Button onClick={handleConfirm} className="flex-1 h-11 bg-red-500 hover:bg-red-600 text-white">
              Tạo
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
