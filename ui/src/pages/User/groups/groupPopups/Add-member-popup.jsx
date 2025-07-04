"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User } from "lucide-react"
import axiosPrivate from "@/apis/clients/private.client"
import { useParams } from "react-router-dom"
import { toast } from "sonner"

export default function AddMemberPopup({ open, onOpenChange, onSave }) {
  const { id } = useParams()
  const [memberData, setMemberData] = useState({
    username: "",
    role: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  // Define roles matching the GroupRole enum based on API response
  const roles = [
    { value: "vice", label: "Phó nhóm" },
    { value: "member", label: "Thành viên" },
  ]

  const handleSave = async () => {
    if (!memberData.username.trim() || !memberData.role) {
      toast.warning("Vui lòng nhập đầy đủ thông tin!")
      return
    }

    // Basic username validation
    const usernameRegex = /^[a-zA-Z0-9_]{3,}$/
    if (!usernameRegex.test(memberData.username)) {
      toast.warning("Vui lòng nhập username hợp lệ (ít nhất 3 ký tự, chỉ chữ cái, số và dấu gạch dưới).")
      return
    }

    // Validate groupId from useParams
    console.log("Raw id from useParams:", id)
    const parsedGroupId = Number(id)
    if (!id || isNaN(parsedGroupId) || parsedGroupId <= 0) {
      toast.error("ID nhóm không hợp lệ hoặc không được cung cấp trong URL!")
      console.error("Invalid groupId:", id, "Parsed:", parsedGroupId)
      return
    }

    setIsLoading(true)
    try {
      const res = await axiosPrivate.post(`http://localhost:7777/api/groups/members`, {
        groupId: parsedGroupId,
        username: memberData.username,
        role: memberData.role,
      })

      if (res) {
        onSave(res.data || res) // Notify parent component
        setMemberData({ username: "", role: "" }) // Reset form
        onOpenChange(false) // Close dialog
        toast.success(`Thành viên ${memberData.username} đã được thêm với vai trò ${memberData.role}!`)
       
      }
    } catch (error) {
      console.error("API Error:", error)
      // Extract error message from API response, fallback to generic message
      const errorMessage = error?.data?.message || error?.response?.data?.message || "Lỗi khi thêm thành viên!"
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    toast.info("Đã hủy thêm thành viên.")
    onOpenChange(false)
    setMemberData({
      username: "",
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
            {/* Username Input */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">Tên người dùng</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  placeholder="Nhập tên người dùng"
                  value={memberData.username}
                  onChange={(e) => setMemberData((prev) => ({ ...prev, username: e.target.value }))}
                  className="pl-11 h-12 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-xl text-gray-700 bg-white shadow-sm transition-all duration-200"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Role Select */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Vai trò</label>
              <Select
                value={memberData.role}
                onValueChange={(value) => setMemberData((prev) => ({ ...prev, role: value }))}
                disabled={isLoading}
              >
                <SelectTrigger className="w-full h-12 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-xl bg-white shadow-sm transition-all duration-200">
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
                disabled={isLoading}
              >
                Hủy
              </Button>
              <Button
                onClick={handleSave}
                className="flex-1 h-12 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                disabled={!memberData.username.trim() || !memberData.role || isLoading}
              >
                {isLoading ? "Đang thêm..." : "Thêm thành viên"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 