"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User } from "lucide-react"

export default function AddMemberPopup({ open, onOpenChange, onSave }) {
  const [memberData, setMemberData] = useState({
    email: "",
    role: "",
  })

  const roles = [
    { value: "admin", label: "Chủ nhóm" },
    { value: "moderator", label: "Phó nhóm" },
    { value: "member", label: "Thành viên" },
    { value: "viewer", label: "Người xem" },
  ]

  const handleSave = () => {
    if (!memberData.email.trim() || !memberData.role) {
      alert("Vui lòng nhập đầy đủ thông tin!")
      return
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(memberData.email)) {
      alert("Vui lòng nhập email hợp lệ!")
      return
    }

    const newMember = {
      id: Date.now(),
      name: memberData.email.split("@")[0], // Extract name from email
      email: memberData.email,
      role: roles.find((r) => r.value === memberData.role)?.label || "Thành viên",
      joinDate: new Date().toLocaleDateString("vi-VN"),
      avatar: "",
    }

    onSave(newMember)
    onOpenChange(false)

    // Reset form
    setMemberData({
      email: "",
      role: "",
    })
  }

  const handleCancel = () => {
    onOpenChange(false)
    // Reset form
    setMemberData({
      email: "",
      role: "",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0 rounded-2xl border-0 shadow-2xl">
        <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <User className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Thêm thành viên mới</h2>
            <p className="text-gray-600">Mời thành viên tham gia vào nhóm của bạn</p>
          </div>

          <div className="space-y-6">
            {/* Email Input */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  placeholder="Nhập địa chỉ email"
                  value={memberData.email}
                  onChange={(e) => setMemberData((prev) => ({ ...prev, email: e.target.value }))}
                  className="pl-11 h-12 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-xl text-gray-700 bg-white shadow-sm transition-all duration-200"
                />
              </div>
            </div>

            {/* Role Select */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Vai trò</label>
              <Select
                value={memberData.role}
                onValueChange={(value) => setMemberData((prev) => ({ ...prev, role: value }))}
              >
                <SelectTrigger className="h-12 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-xl bg-white shadow-sm transition-all duration-200">
                  <SelectValue placeholder="Chọn vai trò cho thành viên" className="text-gray-700" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-gray-200 shadow-lg bg-white">
                  {roles.map((role) => (
                    <SelectItem key={role.value} value={role.value} className="rounded-lg bg-white hover:bg-blue-50 transition-colors">
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Buttons */}
            <div className="flex space-x-3 pt-4">
              <Button
                onClick={handleCancel}
                variant="outline"
                className="flex-1 h-12 border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl transition-all duration-200"
              >
                Hủy
              </Button>
              <Button
                onClick={handleSave}
                className="flex-1 h-12 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                disabled={!memberData.email.trim() || !memberData.role}
              >
                Thêm thành viên
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
