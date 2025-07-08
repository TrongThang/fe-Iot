"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User } from "lucide-react"
import { useParams } from "react-router-dom"
import { toast } from "sonner"
import { debounce } from "lodash"

// Define roles matching the backend GroupRole enum
const roles = [
  { value: "vice", label: "Phó nhóm" },
  { value: "member", label: "Thành viên" },
]

export default function EditMemberPopup({ open, onOpenChange, onSave, member }) {
  const { id: groupId } = useParams()
  const [memberData, setMemberData] = useState({ role: "", username: "" })
  const [isLoading, setIsLoading] = useState(false)

  // Set initial member data when the component mounts or member prop changes
  useEffect(() => {
    if (member) {
      console.log("Editing member:", member.username, "Role:", member.role)
      setMemberData({
        role: member.role || "",
        username: member.username || "",
      })
    }
  }, [member])

  // Debounced save handler to prevent rapid clicks
  const handleSave = useCallback(
    debounce(async () => {
      if (!memberData.role) {
        toast.warning("Vui lòng chọn vai trò!")
        return
      }

      const parsedGroupId = Number(groupId)
      if (!groupId || isNaN(parsedGroupId) || parsedGroupId <= 0) {
        toast.error("ID nhóm không hợp lệ hoặc không được cung cấp trong URL!")
        console.error("Invalid groupId:", groupId, "Parsed:", parsedGroupId)
        return
      }

      // Kiểm tra nếu vai trò là "owner"
      if (member.role === "owner") {
        toast.error("Không thể thay đổi vai trò của chủ nhóm!")
        return
      }

      setIsLoading(true)
      try {
        const authToken = localStorage.getItem('authToken')
        if (!authToken) {
          throw new Error("Không tìm thấy token xác thực. Vui lòng đăng nhập lại.")
        }

        const res = await fetch(`${process.env.REACT_APP_SMART_NET_IOT_API_URL}/groups/${parsedGroupId}/members/role`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            accountId: member.account_id,
            role: memberData.role,
          }),
        })

        const data = await res.json()

        if (res.ok) {
          onSave({ ...member, role: memberData.role, updated_at: new Date().toISOString() })
          toast.success(`Cập nhật vai trò thành viên ${member.username} thành công!`)
          onOpenChange(false)
          window.location.reload()
        } else {
          let errorMessage = data.message || "Cập nhật vai trò thành viên thất bại!"
          if (data.code === "FORBIDDEN") {
            errorMessage = data.message === "Cannot change role to owner"
              ? "Không thể thay đổi vai trò thành chủ nhóm!"
              : "Không thể thay đổi vai trò của chủ nhóm!"
          } else if (data.code === "NOT_FOUND") {
            errorMessage = "Thành viên không thuộc nhóm này!"
          }
          toast.error(errorMessage)
        }
      } catch (error) {
        console.error("API Error:", error)
        toast.error(error.message || "Lỗi khi cập nhật thành viên do kết nối mạng!")
      } finally {
        setIsLoading(false)
      }
    }, 300),
    [groupId, member, memberData.role, onSave, onOpenChange]
  )

  const handleCancel = () => {
    toast.info("Đã hủy chỉnh sửa vai trò.")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0 rounded-2xl border-0 shadow-2xl" aria-labelledby="edit-member-dialog">
        <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <User className="h-8 w-8 text-white" aria-hidden="true" />
            </div>
            <h2 id="edit-member-dialog" className="text-2xl font-bold text-gray-900">Chỉnh sửa thành viên</h2>
            <p className="text-gray-600">Cập nhật vai trò thành viên trong nhóm</p>
          </div>

          <div className="space-y-6">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">Tên người dùng</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <User className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <Input
                  placeholder="Nhập tên người dùng"
                  value={memberData.username || ""}
                  className="pl-11 h-12 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-xl text-gray-700 bg-white shadow-sm transition-all duration-200"
                  disabled={true}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Vai trò</label>
              <Select
                value={memberData.role}
                onValueChange={(value) => setMemberData((prev) => ({ ...prev, role: value }))}
                disabled={isLoading || member?.role === "owner"}
              >
                <SelectTrigger className="w-full h-12 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-xl bg-white shadow-sm transition-all duration-200">
                  <SelectValue placeholder="Chọn vai trò cho thành viên" className="text-gray-700" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-gray-200 shadow-lg bg-white">
                  {roles.map((role) => (
                    <SelectItem
                      key={role.value}
                      value={role.value}
                      className="rounded-lg bg-white hover:bg-blue-50 transition-colors"
                    >
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

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
                disabled={!memberData.role || isLoading || member?.role === "owner"}
              >
                {isLoading ? "Đang cập nhật..." : "Lưu thay đổi"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}