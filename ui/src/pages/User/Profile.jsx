"use client"

import { useState } from "react"
import { User, Mail, Calendar, Edit3, Save, X, Camera, Shield, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Link } from "react-router-dom"

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false)
  const [customerData, setCustomerData] = useState({
    id: "CUST001",
    surname: "Nguyễn",
    lastname: "Văn A",
    image: "/placeholder.svg?height=200&width=200",
    phone: "0123456789",
    email: "nguyenvana@email.com",
    email_verified: true,
    birthdate: "1990-01-15",
    gender: true,
    address: "123 Đường ABC, Quận 1, TP.HCM",
    created_at: "2023-01-15T10:30:00",
    updated_at: "2024-12-05T14:20:00",
  })

  const handleInputChange = (field, value) => {
    setCustomerData((prev) => ({
      ...prev,
      [field]: value,
      updated_at: new Date().toISOString(),
    }))
  }

  const handleSave = () => {
    setIsEditing(false)
    console.log("Saving customer data:", customerData)
  }

  const handleCancel = () => {
    setIsEditing(false)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-white/20 shadow-sm">
        <div className="px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
                Hồ sơ cá nhân
              </h1>
              <p className="text-slate-600 mt-2 text-lg">Quản lý thông tin tài khoản của bạn</p>
            </div>
            <div className="flex items-center space-x-3">
              {isEditing ? (
                <>
                  <Button
                    onClick={handleSave}
                    className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Lưu thay đổi
                  </Button>
                  <Button
                    onClick={handleCancel}
                    variant="outline"
                    className="border-slate-300 text-slate-700 hover:bg-slate-50"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Hủy
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => setIsEditing(true)}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg"
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  Chỉnh sửa
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className=" px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <Card className="bg-white/70 backdrop-blur-sm border-white/20 shadow-xl">
              <CardContent className="p-8">
                <div className="text-center">
                  {/* Avatar */}
                  <div className="relative inline-block mb-6">
                    <div className="relative">
                      <Avatar className="w-32 h-32 border-4 border-white shadow-2xl">
                        <AvatarImage src={customerData.image || "/placeholder.svg"} alt="Profile" />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-2xl font-bold">
                          {customerData.surname.charAt(0)}
                          {customerData.lastname.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105">
                        <Camera className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Name & Email */}
                  <div className="space-y-3">
                    <h2 className="text-2xl font-bold text-slate-900">
                      {customerData.surname} {customerData.lastname}
                    </h2>
                    <div className="flex items-center justify-center space-x-2">
                      <Mail className="w-4 h-4 text-slate-500" />
                      <span className="text-slate-600">{customerData.email}</span>
                    </div>

                    {/* Email Verification Badge */}
                    <div className="flex justify-center">
                      {customerData.email_verified ? (
                        <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Email đã xác thực
                        </Badge>
                      ) : (
                        <Badge variant="destructive" className="bg-red-100 text-red-700 border-red-200">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          Chưa xác thực
                        </Badge>
                      )}
                    </div>
                  </div>

                </div>
              </CardContent>
            </Card>
          </div>

          {/* Information Cards */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <Card className="bg-white/70 backdrop-blur-sm border-white/20 shadow-xl">
              <CardContent className="p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900">Thông tin cá nhân</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Surname */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-700">Họ</Label>
                    {isEditing ? (
                      <Input
                        value={customerData.surname}
                        onChange={(e) => handleInputChange("surname", e.target.value)}
                        className="bg-white/50 border-slate-200 focus:border-blue-500 focus:ring-blue-500 "
                      />
                    ) : (
                      <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-sm">
                        <span className="text-slate-900">{customerData.surname}</span>
                      </div>
                    )}
                  </div>

                  {/* Lastname */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-700">Tên</Label>
                    {isEditing ? (
                      <Input
                        value={customerData.lastname}
                        onChange={(e) => handleInputChange("lastname", e.target.value)}
                        className="bg-white/50 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                    ) : (
                      <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-sm">
                        <span className="text-slate-900">{customerData.lastname}</span>
                      </div>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-700">Email</Label>
                    {isEditing ? (
                      <Input
                        type="email"
                        value={customerData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className="bg-white/50 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                        disabled
                      />
                    ) : (
                      <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-sm">
                        <span className="text-slate-900">{customerData.email}</span>
                      </div>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-700">Số điện thoại</Label>
                    {isEditing ? (
                      <Input
                        type="tel"
                        value={customerData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        className="bg-white/50 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                    ) : (
                      <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-sm">
                        <span className="text-slate-900">{customerData.phone}</span>
                      </div>
                    )}
                  </div>

                  {/* Birthdate */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-700">Ngày sinh</Label>
                    {isEditing ? (
                      <Input
                        type="date"
                        value={customerData.birthdate}
                        onChange={(e) => handleInputChange("birthdate", e.target.value)}
                        className="bg-white/50 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                    ) : (
                      <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-sm">
                        <span className="text-slate-900">{formatDate(customerData.birthdate)}</span>
                      </div>
                    )}
                  </div>

                  {/* Gender */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-700">Giới tính</Label>
                    {isEditing ? (
                      <Select
                        value={customerData.gender ? "male" : "female"}
                        onValueChange={(value) => handleInputChange("gender", value === "male")}
                      >
                        <SelectTrigger className="bg-white/50 border-slate-200 focus:border-blue-500 w-full focus:ring-blue-500">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          <SelectItem value="male">Nam</SelectItem>
                          <SelectItem value="female">Nữ</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-sm">
                        <span className="text-slate-900">{customerData.gender ? "Nam" : "Nữ"}</span>
                      </div>
                    )}
                  </div>

                  {/* Address */}
                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-sm font-medium text-slate-700">Địa chỉ</Label>
                    {isEditing ? (
                      <Input
                        value={customerData.address}
                        onChange={(e) => handleInputChange("address", e.target.value)}
                        className="bg-white/50 border-slate-200 focus:border-blue-500 focus:ring-blue-500 "
                        placeholder="Nhập địa chỉ của bạn"
                      />
                    ) : (
                      <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-sm">
                        <span className="text-slate-900">{customerData.address}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security & Actions */}
            <div className="">
              {/* Security */}
              <Card className="bg-white/70 backdrop-blur-sm border-white/20 shadow-xl">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                      <Shield className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900">Bảo mật</h3>
                  </div>

                  <div className="space-y-3">
                    <Link to="/change-password">
                      <Button
                        variant="outline"
                        className="w-full justify-start border-red-200 text-red-700 hover:bg-red-50"
                      >
                        Đổi mật khẩu
                      </Button>
                    </Link>
                    {!customerData.email_verified && (
                      <Button
                        variant="outline"
                        className="w-full justify-start border-orange-200 text-orange-700 hover:bg-orange-50"
                      >
                        Xác thực email
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
