"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

export function CustomerForm({ open, onOpenChange, customer, onSave }) {
  const [formData, setFormData] = useState({
    surname: "",
    lastname: "",
    image: "",
    phone: "",
    email: "",
    email_verified: false,
    birthdate: "",
    gender: true,
  })

  useEffect(() => {
    if (customer) {
      setFormData({
        surname: customer.surname,
        lastname: customer.lastname,
        image: customer.image,
        phone: customer.phone,
        email: customer.email,
        email_verified: customer.email_verified,
        birthdate: customer.birthdate,
        gender: customer.gender,
      })
    } else {
      setFormData({
        surname: "",
        lastname: "",
        image: "/placeholder.svg?height=40&width=40",
        phone: "",
        email: "",
        email_verified: false,
        birthdate: "",
        gender: true,
      })
    }
  }, [customer, open])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{customer ? "Chỉnh sửa khách hàng" : "Thêm khách hàng mới"}</DialogTitle>
          <DialogDescription>
            {customer ? "Cập nhật thông tin khách hàng trong hệ thống." : "Thêm khách hàng mới vào hệ thống quản lý."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="surname">Họ</Label>
                <Input
                  id="surname"
                  value={formData.surname}
                  onChange={(e) => handleInputChange("surname", e.target.value)}
                  placeholder="Nguyễn"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lastname">Tên</Label>
                <Input
                  id="lastname"
                  value={formData.lastname}
                  onChange={(e) => handleInputChange("lastname", e.target.value)}
                  placeholder="Văn An"
                  required
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="nguyen.van.an@email.com"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="phone">Số điện thoại</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="+84901234567"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="birthdate">Ngày sinh</Label>
                <Input
                  id="birthdate"
                  type="date"
                  value={formData.birthdate}
                  onChange={(e) => handleInputChange("birthdate", e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="gender">Giới tính</Label>
                <Select
                  value={formData.gender ? "male" : "female"}
                  onValueChange={(value) => handleInputChange("gender", value === "male")}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Nam</SelectItem>
                    <SelectItem value="female">Nữ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="image">URL Ảnh đại diện</Label>
              <Input
                id="image"
                value={formData.image}
                onChange={(e) => handleInputChange("image", e.target.value)}
                placeholder="https://example.com/avatar.jpg"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="email_verified"
                checked={formData.email_verified}
                onCheckedChange={(checked) => handleInputChange("email_verified", checked)}
              />
              <Label htmlFor="email_verified">Email đã được xác thực</Label>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button type="submit">{customer ? "Cập nhật" : "Thêm mới"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
