"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Home, MapPin, Palette, X } from "lucide-react"
import IconColorPickerPopup from "../icon-picker/icon-color-picker-popup"

export default function AddHousePopup({ open, onOpenChange, onSave }) {
  const [houseData, setHouseData] = useState({
    name: "",
    address: "",
    icon: null,
  })

  const [showIconPicker, setShowIconPicker] = useState(false)

  const handleSave = () => {
    if (!houseData.name.trim()) {
      alert("Vui lòng nhập tên nhà!")
      return
    }
    if (!houseData.address.trim()) {
      alert("Vui lòng nhập địa chỉ nhà!")
      return
    }
    if (!houseData.icon) {
      alert("Vui lòng chọn biểu tượng!")
      return
    }

    const newHouse = {
      id: Date.now(),
      name: houseData.name,
      address: houseData.address,
      icon: houseData.icon,
      devices: 0,
      status: "Hoạt động",
      createdDate: new Date().toLocaleDateString("vi-VN"),
    }

    onSave(newHouse)
    onOpenChange(false)

    // Reset form
    setHouseData({
      name: "",
      address: "",
      icon: null,
    })
  }

  const handleIconSelect = (selectedIcon) => {
    setHouseData((prev) => ({ ...prev, icon: selectedIcon }))
  }

  const renderIconPreview = () => {
    if (!houseData.icon || !houseData.icon.component) {
      return (
        <div className="w-20 h-20 rounded-2xl bg-gray-200 flex items-center justify-center shadow-lg">
          <Home className="h-10 w-10 text-gray-400" />
        </div>
      )
    }

    const IconComponent = houseData.icon.component
    return (
      <div className={`w-20 h-20 rounded-2xl ${houseData.icon.color} flex items-center justify-center shadow-lg`}>
        <IconComponent className="h-10 w-10 text-white" />
      </div>
    )
  }

  const renderSelectedIcon = () => {
    if (!houseData.icon || !houseData.icon.component) {
      return (
        <div className="w-8 h-8 rounded-lg bg-gray-200 flex items-center justify-center">
          <Home className="h-4 w-4 text-gray-400" />
        </div>
      )
    }

    const IconComponent = houseData.icon.component
    return (
      <div className={`w-8 h-8 rounded-lg ${houseData.icon.color} flex items-center justify-center`}>
        <IconComponent className="h-4 w-4 text-white" />
      </div>
    )
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px] p-0 rounded-2xl shadow-2xl">
          {/* Header */}
          <DialogHeader className="px-6 pt-6 pb-2 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl font-semibold text-gray-900">Thêm nhà mới</DialogTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onOpenChange(false)}
                className="h-8 w-8 p-0 rounded-full hover:bg-gray-100"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          {/* Content */}
          <div className="px-6 py-6 space-y-6">
            {/* Icon Preview */}
            <div className="flex justify-center">{renderIconPreview()}</div>

            {/* House Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Tên nhà</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <Home className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  placeholder="Nhập tên nhà..."
                  value={houseData.name}
                  onChange={(e) => setHouseData((prev) => ({ ...prev, name: e.target.value }))}
                  className="pl-11 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl"
                />
              </div>
            </div>

            {/* House Address */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Địa chỉ nhà</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  placeholder="Nhập địa chỉ nhà..."
                  value={houseData.address}
                  onChange={(e) => setHouseData((prev) => ({ ...prev, address: e.target.value }))}
                  className="pl-11 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl"
                />
              </div>
            </div>

            {/* Icon Picker Button */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Biểu tượng nhà</label>
              <Button
                variant="outline"
                onClick={() => setShowIconPicker(true)}
                className="w-full h-12 border-gray-200 hover:border-blue-500 hover:bg-blue-50 rounded-xl flex items-center justify-between group"
              >
                <div className="flex items-center space-x-3">
                  <Palette className="h-5 w-5 text-gray-400 group-hover:text-blue-500" />
                  <span className="text-gray-600 group-hover:text-blue-600">Chọn biểu tượng</span>
                </div>
                {renderSelectedIcon()}
              </Button>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1 h-12 border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl"
              >
                Hủy
              </Button>
              <Button
                onClick={handleSave}
                className="flex-1 h-12 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all"
                disabled={!houseData.name.trim() || !houseData.address.trim() || !houseData.icon}
              >
                Thêm nhà
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Icon Color Picker Popup */}
      <IconColorPickerPopup
        open={showIconPicker}
        onOpenChange={setShowIconPicker}
        onSelectIcon={handleIconSelect}
        selectedIcon={houseData.icon}
      />
    </>
  )
}
