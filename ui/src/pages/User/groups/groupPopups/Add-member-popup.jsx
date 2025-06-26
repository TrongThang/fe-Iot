"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User } from "lucide-react"
import { useParams } from "react-router-dom"
import Swal from "sweetalert2" // Import SweetAlert2

export default function AddMemberPopup({ open, onOpenChange, onSave }) {
  const { id } = useParams()
  const [memberData, setMemberData] = useState({
    username: "",
    role: "",
  })
  const [isLoading, setIsLoading] = useState(false) // Add loading state
  const accessToken = localStorage.getItem("authToken")

  // Define roles matching the GroupRole enum based on API response
  const roles = [
    { value: "moderator", label: "Phó nhóm" },
    { value: "member", label: "Thành viên" },
    { value: "viewer", label: "Người xem" },
  ] // Adjusted to match API response

  const handleSave = async () => {
    if (!memberData.username.trim() || !memberData.role) {
      Swal.fire({
        icon: "warning",
        title: "Cảnh báo!",
        text: "Vui lòng nhập đầy đủ thông tin!",
        confirmButtonText: "OK",
        customClass: {
          confirmButton: "bg-blue-500 text-white hover:bg-blue-600",
        },
        didOpen: () => {
          Swal.getConfirmButton().focus() // Ensure the OK button is focused
        },
      }).then((result) => {
        if (result.isConfirmed) {
          // No action needed on dismissal, just return
        }
      })
      return
    }

    // Basic username validation
    const usernameRegex = /^[a-zA-Z0-9_]{3,}$/
    if (!usernameRegex.test(memberData.username)) {
      Swal.fire({
        icon: "warning",
        title: "Cảnh báo!",
        text: "Vui lòng nhập username hợp lệ (ít nhất 3 ký tự, chỉ chữ cái, số và dấu gạch dưới).",
        confirmButtonText: "OK",
        customClass: {
          confirmButton: "bg-blue-500 text-white hover:bg-blue-600",
        },
        didOpen: () => {
          Swal.getConfirmButton().focus() // Ensure the OK button is focused
        },
      }).then((result) => {
        if (result.isConfirmed) {
          // No action needed on dismissal, just return
        }
      })
      return
    }

    // Validate groupId from useParams
    console.log("Raw id from useParams:", id) // Debug the raw id value
    const parsedGroupId = Number(id)
    if (!id || isNaN(parsedGroupId) || parsedGroupId <= 0) {
      Swal.fire({
        icon: "error",
        title: "Lỗi!",
        text: "ID nhóm không hợp lệ hoặc không được cung cấp trong URL!",
        confirmButtonText: "OK",
        customClass: {
          confirmButton: "bg-red-500 text-white hover:bg-red-600",
        },
        didOpen: () => {
          Swal.getConfirmButton().focus() // Ensure the OK button is focused
        },
      }).then((result) => {
        if (result.isConfirmed) {
          // No action needed on dismissal, just return
        }
      })
      console.error("Invalid groupId:", id, "Parsed:", parsedGroupId)
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch(`http://localhost:7777/api/groups/members`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          groupId: parsedGroupId, // Ensure group_id is a number
          username: memberData.username,
          role: memberData.role,
        }),
      })

      const data = await res.json()

      if (res.ok) {
        onOpenChange(false) // ✅ Đóng Dialog TRƯỚC
        setTimeout(() => {
          Swal.fire({
            icon: "success",
            title: "Thành công!",
            text: `Thành viên ${memberData.username} đã được thêm với vai trò ${memberData.role}!`,
            confirmButtonText: "OK",
            customClass: {
              confirmButton: "bg-green-500 text-white hover:bg-green-600",
            },
            didOpen: () => {
              Swal.getConfirmButton().focus()
            },
          }).then((result) => {
            if (result.isConfirmed) {
              onSave(data)
              setMemberData({ username: "", role: "" })
            }
          })
        }, 200) // Đợi một chút để dialog unmount xong
      } else {
        // Handle specific API errors based on message
        const errorMessage = data.message || "Thêm thành viên thất bại!"
        Swal.fire({
          icon: "error",
          title: "Lỗi!",
          text: errorMessage,
          confirmButtonText: "OK",
          customClass: {
            confirmButton: "bg-red-500 text-white hover:bg-red-600",
          },
          didOpen: () => {
            Swal.getConfirmButton().focus() // Ensure the OK button is focused
          },
        }).then((result) => {
          if (result.isConfirmed) {
            // No action needed on dismissal, just return
          }
        })
      }
    } catch (error) {
      console.error("API Error:", error)
      Swal.fire({
        icon: "error",
        title: "Lỗi!",
        text: error.message || "Lỗi khi thêm thành viên do kết nối mạng!",
        confirmButtonText: "OK",
        customClass: {
          confirmButton: "bg-red-500 text-white hover:bg-red-600",
        },
        didOpen: () => {
          Swal.getConfirmButton().focus() // Ensure the OK button is focused
        },
      }).then((result) => {
        if (result.isConfirmed) {
          // No action needed on dismissal, just return
        }
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    Swal.fire({
      icon: "info",
      title: "Hủy bỏ",
      text: "Bạn có chắc muốn hủy thêm thành viên?",
      showCancelButton: true,
      confirmButtonText: "Có",
      cancelButtonText: "Không",
      customClass: {
        confirmButton: "bg-blue-500 text-white hover:bg-blue-600",
        cancelButton: "bg-gray-300 text-gray-700 hover:bg-gray-400",
      },
      didOpen: () => {
        Swal.getConfirmButton().focus() // Ensure the confirm button is focused
      },
    }).then((result) => {
      if (result.isConfirmed) {
        onOpenChange(false)
        setMemberData({
          username: "",
          role: "",
        })
      }
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