"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Users, Edit3 } from "lucide-react"

export default function EditGroupPopup({ open, onOpenChange, groupData, onSave }) {
  const [formData, setFormData] = useState({
    name: groupData?.name || "",
    description: groupData?.description || "",
  })

  const handleSave = () => {
    if (!formData.name.trim()) {
      alert("Vui lòng nhập tên nhóm!")
      return
    }

    onSave(formData)
    onOpenChange(false)
  }

  const handleCancel = () => {
    // Reset form to original data
    setFormData({
      name: groupData?.name || "",
      description: groupData?.description || "",
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg p-0 rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-50 to-white p-6 border-b">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg">
              <Edit3 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Chỉnh sửa nhóm</h2>
              <p className="text-sm text-gray-600">Cập nhật thông tin và mô tả nhóm</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="p-6 space-y-6">
          {/* Group Name */}
          <div className="space-y-2">
            <Label htmlFor="groupName" className="text-sm font-medium text-gray-700">
              Tên nhóm <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <Users className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                id="groupName"
                placeholder="Nhập tên nhóm..."
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                className="pl-11 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl text-gray-700 shadow-sm"
              />
            </div>
          </div>

          {/* Group Description */}
          <div className="space-y-2">
            <Label htmlFor="groupDescription" className="text-sm font-medium text-gray-700">
              Mô tả nhóm
            </Label>
            <Textarea
              id="groupDescription"
              placeholder="Nhập mô tả về nhóm, mục đích sử dụng..."
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              className="min-h-[100px] border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl text-gray-700 shadow-sm resize-none"
            />
            <p className="text-xs text-gray-500">Mô tả sẽ giúp các thành viên hiểu rõ hơn về mục đích của nhóm</p>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="px-6 py-2 border-gray-200 text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
          >
            Hủy
          </Button>
          <Button
            onClick={handleSave}
            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            disabled={!formData.name.trim()}
          >
            Lưu thay đổi
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
