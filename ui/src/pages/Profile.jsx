"use client"

import { useState } from "react"
import { User, CreditCard, Calendar, Phone, MapPin, Plus, Edit, Save, X, Camera, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Link } from "react-router-dom"

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false)
  const [customerData, setCustomerData] = useState({
    username: "nguyenvana",
    fullName: "Nguyễn Văn A",
    dateOfBirth: "15/01/1990",
    phoneNumber: "0123456789",
    address: "123 Đường ABC, Quận 1, TP.HCM",
  })

  const handleInputChange = (field, value) => {
    setCustomerData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSave = () => {
    setIsEditing(false)
    console.log("Saving customer data:", customerData)
  }

  const handleCancel = () => {
    setIsEditing(false)
  }

  const customerFields = [
    {
      key: "username",
      label: "Username",
      icon: User,
      value: customerData.username,
      type: "text",
    },
    {
      key: "fullName",
      label: "Họ tên",
      icon: CreditCard,
      value: customerData.fullName,
      type: "text",
    },
    {
      key: "dateOfBirth",
      label: "Ngày sinh",
      icon: Calendar,
      value: customerData.dateOfBirth,
      type: "text",
    },
    {
      key: "phoneNumber",
      label: "Số điện thoại",
      icon: Phone,
      value: customerData.phoneNumber,
      type: "tel",
    },
    {
      key: "address",
      label: "Địa chỉ",
      icon: MapPin,
      value: customerData.address,
      type: "text",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl">
          <h1 className="text-3xl font-bold text-gray-900">Thông tin khách hàng</h1>
          <p className="text-gray-600 mt-1 text-sm">Quản lý và cập nhật thông tin cá nhân</p>
        </div>
      </div>

      {/* Main Content */}
      <div className=" px-6 py-2">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
          {/* Left Side - Profile Image */}
          <div className="flex flex-col rounded-sm">
            <Card className="flex-1 shadow-lg border-0">
              <CardHeader className="bg-blue-500 text-white text-center py-6">
                <CardTitle className="text-xl font-bold mb-4">Ảnh đại diện</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col items-center justify-center p-8 bg-gradient-to-br from-blue-50 to-white">
                <div className="relative group mb-8">
                  <div className="w-48 h-48 rounded-full bg-white shadow-2xl flex items-center justify-center border-8 border-blue-100">
                    <Avatar className="w-40 h-40">
                      <AvatarImage src="/placeholder.svg?height=160&width=160" alt="Customer Avatar" />
                      <AvatarFallback className="bg-blue-500 text-white text-4xl font-bold">
                        {customerData.fullName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </div>

                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{customerData.fullName}</h2>
                  <p className="text-gray-600 text-lg">@{customerData.username}</p>
                </div>

                <div className="w-full space-y-4">
                  <Button
                    variant="outline"
                    className="w-full border-2 border-blue-500 text-blue-600 hover:bg-blue-50 py-3 text-lg font-medium"
                  >
                    <Upload className="w-5 h-5 mr-2" />
                    Tải ảnh lên
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Side - Information Details */}
          <div className="flex flex-col">
            <Card className="flex-1 shadow-lg border-0">
              <CardHeader className="bg-blue-500 text-white py-6">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-bold">Thông tin chi tiết</CardTitle>
                  <div className="flex items-center space-x-3">
                    {isEditing ? (
                      <>
                        <Button onClick={handleSave} className="bg-white text-blue-600 hover:bg-blue-50 font-medium">
                          <Save className="w-4 h-4 mr-2" />
                          Lưu
                        </Button>
                        <Button
                          onClick={handleCancel}
                          variant="outline"
                          className="border-white text-white hover:bg-white/10"
                        >
                          <X className="w-4 h-4 mr-2" />
                          Hủy
                        </Button>
                      </>
                    ) : (
                      <Button
                        onClick={() => setIsEditing(true)}
                        className="bg-white text-blue-600 hover:bg-blue-50 font-medium"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Cập nhật
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 p-8 bg-white">
                <div className="space-y-8 h-full">
                  {customerFields.map((field, index) => {
                    const IconComponent = field.icon
                    return (
                      <div key={field.key} className="space-y-3">
                        <Label
                          htmlFor={field.key}
                          className="flex items-center space-x-3 text-sm font-semibold text-gray-700 uppercase tracking-wide"
                        >
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <IconComponent className="w-4 h-4 text-blue-600" />
                          </div>
                          <span>{field.label}</span>
                        </Label>
                        {isEditing ? (
                          <Input
                            id={field.key}
                            type={field.type}
                            value={field.value}
                            onChange={(e) => handleInputChange(field.key, e.target.value)}
                            className="w-full h-12 border-2 border-gray-200 focus:border-blue-500 rounded-lg text-gray-900 font-medium text-lg"
                            placeholder={field.label}
                          />
                        ) : (
                          <div className="w-full h-12 flex items-center px-4 bg-gray-50 rounded-lg border border-gray-200">
                            <span className="text-gray-900 font-medium text-lg">{field.value}</span>
                          </div>
                        )}
                      </div>
                    )
                  })}

                  {/* Password Change Section */}
                  <div className="pt-8 border-t border-gray-200">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">Bảo mật</h3>
                      <Link to="/change-password" className="text-blue-600 hover:underline">
                        <Button
                          variant="outline"
                          className="w-full border-2 border-blue-500 text-blue-600 hover:bg-blue-50 py-3 text-lg font-medium"
                        >
                          Đổi mật khẩu
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
