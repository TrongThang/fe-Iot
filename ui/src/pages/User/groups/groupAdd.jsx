"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Users, FileText, Palette, X } from "lucide-react"
import IconPickerPopup from "./icon-picker/icon-picker-popup"

export default function AddGroupPopupImproved({ open, onOpenChange, onSave }) {
  const [groupData, setGroupData] = useState({
    name: "",
    description: "",
    icon: { icon: Users, color: "bg-blue-500", name: "Nhóm", id: "group" },
  })

  const [showIconPicker, setShowIconPicker] = useState(false)

  const handleSave = () => {
    if (!groupData.name.trim()) {
      alert("Vui lòng nhập tên nhóm!")
      return
    }

    const newGroup = {
      ...groupData,
      id: Date.now(),
      createdAt: new Date().toISOString(),
    }

    onSave(newGroup)
    onOpenChange(false)

    // Reset form
    setGroupData({
      name: "",
      description: "",
      icon: { icon: Users, color: "bg-blue-500", name: "Nhóm", id: "group" },
    })
  }

  const handleIconSelect = (selectedIcon) => {
    setGroupData((prev) => ({ ...prev, icon: selectedIcon }))
  }

  const IconComponent = groupData.icon.icon

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px] p-0 rounded-2xl shadow-2xl" >
          {/* Header */}
          <DialogHeader className="px-6 pt-6 pb-2 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl font-semibold text-gray-900">Tạo nhóm mới</DialogTitle>
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
            <div className="flex justify-center">
              <div
                className={`w-20 h-20 rounded-2xl ${groupData.icon.color} flex items-center justify-center shadow-lg`}
              >
                <IconComponent className="h-10 w-10 text-white" />
              </div>
            </div>

            {/* Group Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Tên nhóm</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <Users className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  placeholder="Nhập tên nhóm..."
                  value={groupData.name}
                  onChange={(e) => setGroupData((prev) => ({ ...prev, name: e.target.value }))}
                  className="pl-11 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl"
                />
              </div>
            </div>

            {/* Group Description */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Mô tả nhóm</label>
              <div className="relative">
                <div className="absolute left-3 top-4">
                  <FileText className="h-5 w-5 text-gray-400" />
                </div>
                <Textarea
                  placeholder="Mô tả về nhóm của bạn..."
                  value={groupData.description}
                  onChange={(e) => setGroupData((prev) => ({ ...prev, description: e.target.value }))}
                  className="pl-11 min-h-[100px] border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl resize-none"
                />
              </div>
            </div>

            {/* Icon Picker Button */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Biểu tượng nhóm</label>
              <Button
                variant="outline"
                onClick={() => setShowIconPicker(true)}
                className="w-full h-12 border-gray-200 hover:border-blue-500 hover:bg-blue-50 rounded-xl flex items-center justify-between group"
              >
                <div className="flex items-center space-x-3">
                  <Palette className="h-5 w-5 text-gray-400 group-hover:text-blue-500" />
                  <span className="text-gray-600 group-hover:text-blue-600">Chọn biểu tượng</span>
                </div>
                <div className={`w-8 h-8 rounded-lg ${groupData.icon.color} flex items-center justify-center`}>
                  <IconComponent className="h-4 w-4 text-white" />
                </div>
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
                disabled={!groupData.name.trim()}
              >
                Tạo nhóm
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Icon Picker Popup */}
      <IconPickerPopup
        open={showIconPicker}
        onOpenChange={setShowIconPicker}
        onSelectIcon={handleIconSelect}
        selectedIcon={groupData.icon}
      />
    </>
  )
}
