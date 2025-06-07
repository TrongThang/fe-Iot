"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Search,
  Wifi,
  WifiOff,
  Smartphone,
  Monitor,
  Thermometer,
  Camera,
  Lightbulb,
  MoreHorizontal,
  Settings,
  Power,
  Trash2,
  Eye,
  RefreshCw,
  User,
  Mail,
  Phone,
  Calendar,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Mock data theo schema thực tế
const customersData = [
  {
    id: "CUST_001_ABC_TECH_2024",
    surname: "Công ty TNHH",
    lastname: "ABC Technology",
    image: "/placeholder.svg?height=64&width=64",
    phone: "+84901234567",
    email: "admin@abctech.com",
    email_verified: true,
    birthdate: "1990-01-15",
    gender: true, // true = male, false = female
    created_at: "2023-01-15T10:00:00Z",
    updated_at: "2024-01-07T14:30:00Z",
    deleted_at: null,
  },
  {
    id: "CUST_002_XYZ_CORP_2024",
    surname: "Tập đoàn",
    lastname: "XYZ Corporation",
    image: "/placeholder.svg?height=64&width=64",
    phone: "+84987654321",
    email: "contact@xyzcorp.com",
    email_verified: true,
    birthdate: "1985-05-20",
    gender: false,
    created_at: "2023-03-10T09:00:00Z",
    updated_at: "2024-01-06T16:45:00Z",
    deleted_at: null,
  },
]

const devicesData = [
  {
    device_id: 1,
    serial_number: "SN001234567",
    template_id: 1,
    space_id: 101,
    account_id: 1001,
    group_id: 201,
    hub_id: "HUB_001",
    firmware_id: 301,
    name: "Cảm biến nhiệt độ - Phòng A1",
    power_status: true,
    attribute: {
      type: "Temperature Sensor",
      location: "Tầng 1 - Phòng A1",
      customer_id: "CUST_001_ABC_TECH_2024",
    },
    wifi_ssid: "IoT_Network_A1",
    wifi_password: "********",
    current_value: { temperature: 25.5, humidity: 60 },
    link_status: "connected",
    last_reset_at: "2024-01-06T08:30:00Z",
    lock_status: "unlocked",
    locked_at: null,
    created_at: "2023-12-01T10:00:00Z",
    updated_at: "2024-01-07T14:30:25Z",
    is_deleted: false,
  },
  {
    device_id: 2,
    serial_number: "SN001234568",
    template_id: 2,
    space_id: 102,
    account_id: 1001,
    group_id: 202,
    hub_id: "HUB_002",
    firmware_id: 302,
    name: "Camera an ninh - Cổng chính",
    power_status: true,
    attribute: {
      type: "Security Camera",
      location: "Cổng chính",
      customer_id: "CUST_001_ABC_TECH_2024",
    },
    wifi_ssid: "IoT_Network_Main",
    wifi_password: "********",
    current_value: { recording: true, motion_detected: false },
    link_status: "connected",
    last_reset_at: "2024-01-05T15:20:00Z",
    lock_status: "unlocked",
    locked_at: null,
    created_at: "2023-12-01T10:00:00Z",
    updated_at: "2024-01-07T14:29:45Z",
    is_deleted: false,
  },
  {
    device_id: 3,
    serial_number: "SN001234569",
    template_id: 3,
    space_id: 103,
    account_id: 1001,
    group_id: 203,
    hub_id: "HUB_003",
    firmware_id: 303,
    name: "Đèn thông minh - Hành lang",
    power_status: false,
    attribute: {
      type: "Smart Light",
      location: "Tầng 2 - Hành lang",
      customer_id: "CUST_001_ABC_TECH_2024",
    },
    wifi_ssid: "IoT_Network_Floor2",
    wifi_password: "********",
    current_value: { brightness: 0, color: "#000000" },
    link_status: "disconnected",
    last_reset_at: "2024-01-07T10:15:00Z",
    lock_status: "unlocked",
    locked_at: null,
    created_at: "2023-12-01T10:00:00Z",
    updated_at: "2024-01-07T12:15:30Z",
    is_deleted: false,
  },
  {
    device_id: 4,
    serial_number: "SN002234570",
    template_id: 2,
    space_id: 201,
    account_id: 1002,
    group_id: 301,
    hub_id: "HUB_004",
    firmware_id: 302,
    name: "Camera giám sát - Khu vực A",
    power_status: true,
    attribute: {
      type: "Security Camera",
      location: "Khu vực A - Tầng 1",
      customer_id: "CUST_002_XYZ_CORP_2024",
    },
    wifi_ssid: "XYZ_IoT_Network",
    wifi_password: "********",
    current_value: { recording: true, motion_detected: true },
    link_status: "connected",
    last_reset_at: "2024-01-06T12:00:00Z",
    lock_status: "unlocked",
    locked_at: null,
    created_at: "2023-12-15T14:00:00Z",
    updated_at: "2024-01-07T15:00:00Z",
    is_deleted: false,
  },
]

const getDeviceIcon = (type) => {
  switch (type) {
    case "Temperature Sensor":
      return <Thermometer className="h-4 w-4" />
    case "Security Camera":
      return <Camera className="h-4 w-4" />
    case "Smart Light":
      return <Lightbulb className="h-4 w-4" />
    case "Display Monitor":
      return <Monitor className="h-4 w-4" />
    case "Motion Sensor":
      return <Smartphone className="h-4 w-4" />
    default:
      return <Monitor className="h-4 w-4" />
  }
}

const getStatusBadge = (device) => {
  if (!device.power_status) {
    return <Badge variant="destructive">Tắt nguồn</Badge>
  }

  switch (device.link_status) {
    case "connected":
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Kết nối</Badge>
    case "disconnected":
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Mất kết nối</Badge>
    case "maintenance":
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Bảo trì</Badge>
    default:
      return <Badge variant="secondary">Không xác định</Badge>
  }
}

export default function SearchDevice() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [customerDevices, setCustomerDevices] = useState([])

  // Tìm kiếm khách hàng
  const handleSearch = () => {
    const customer = customersData.find(
      (c) =>
        c.lastname.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.id.toLowerCase().includes(searchQuery.toLowerCase()),
    )

    if (customer) {
      setSelectedCustomer(customer)
      // Lấy thiết bị của khách hàng
      const devices = devicesData.filter((d) => d.attribute?.customer_id === customer.id)
      setCustomerDevices(devices)
    } else {
      setSelectedCustomer(null)
      setCustomerDevices([])
    }
  }

  // Tính toán thống kê
  const totalDevices = customerDevices.length
  const activeDevices = customerDevices.filter((d) => d.power_status && d.link_status === "connected").length

  return (
    <div className="min-h-screen ">

      <div className="max-w-7xl mx-auto   ">
        {/* Search Section */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Tra cứu thông tin khách hàng</CardTitle>
              <CardDescription>Nhập email để tìm kiếm</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Tìm kiếm khách hàng..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  />
                </div>
                <Button onClick={handleSearch} className="h-12 w-32">
                  <Search className="h-4 w-4 mr-2" />
                  Tìm kiếm
                </Button>
              </div>

              {/* Gợi ý tìm kiếm */}
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">Gợi ý tìm kiếm:</p>
                <div className="flex gap-2 flex-wrap">
                  {customersData.map((customer) => (
                    <Button
                      key={customer.id}
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSearchQuery(customer.lastname)
                        setSelectedCustomer(customer)
                        const devices = devicesData.filter((d) => d.attribute?.customer_id === customer.id)
                        setCustomerDevices(devices)
                      }}
                    >
                      {customer.lastname}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Customer Info */}
        {selectedCustomer && (
          <div className="mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={selectedCustomer.image || "/placeholder.svg"} />
                    <AvatarFallback>{selectedCustomer.lastname.charAt(0)}</AvatarFallback>
                  </Avatar>
                  Thông tin khách hàng
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ">
                  <div>
                    <div className="space-y-1 text-sm">
                      <p>
                        <span className="font-medium">Mã KH:</span> {selectedCustomer.id}
                      </p>
                      <p>
                        <span className="font-medium">Tên:</span> {selectedCustomer.surname} {selectedCustomer.lastname}
                      </p>
                      <p className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        <span className="font-medium">Email:</span> {selectedCustomer.email}
                        {selectedCustomer.email_verified && (
                          <Badge variant="outline" className="text-xs">
                            Đã xác thực
                          </Badge>
                        )}
                      </p>
                      <p className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        <span className="font-medium">SĐT:</span> {selectedCustomer.phone}
                      </p>
                    </div>
                  </div>
                  <div>
                    <div className="space-y-1 text-sm">
                      <p>
                        <span className="font-medium">Ngày sinh:</span>{" "}
                        {new Date(selectedCustomer.birthdate).toLocaleDateString("vi-VN")}
                      </p>
                      <p>
                        <span className="font-medium">Giới tính:</span> {selectedCustomer.gender ? "Nam" : "Nữ"}
                      </p>
                      <p>
                        <span className="font-medium">Ngày tạo:</span>{" "}
                        {new Date(selectedCustomer.created_at).toLocaleDateString("vi-VN")}
                      </p>
                    </div>
                  </div>
                  <div>
                    <div className="space-y-1 text-sm">
                      <p>
                        <span className="font-medium">Tổng thiết bị:</span> {totalDevices}
                      </p>
                      <p>
                        <span className="font-medium text-green-600">Đang hoạt động:</span> {activeDevices}
                      </p>
                      <p>
                        <span className="font-medium text-red-600">Ngoại tuyến:</span> {totalDevices - activeDevices}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        {/* Devices List */}
        {selectedCustomer && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Danh sách thiết bị của {selectedCustomer.lastname}</span>
                <Badge variant="outline">{customerDevices.length} thiết bị</Badge>
              </CardTitle>
              <CardDescription>Quản lý và theo dõi trạng thái các thiết bị IoT của khách hàng</CardDescription>
            </CardHeader>
            <CardContent>
              {customerDevices.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Thiết bị</TableHead>
                        <TableHead>Loại</TableHead>
                        <TableHead>Trạng thái</TableHead>
                        <TableHead>Vị trí & Hub</TableHead>
                        <TableHead>Thời gian</TableHead>
                        <TableHead>Nguồn</TableHead>
                        <TableHead>Kết nối</TableHead>
                        <TableHead className="text-right">Thao tác</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {customerDevices.map((device) => (
                        <TableRow key={device.device_id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="flex-shrink-0">{getDeviceIcon(device.attribute?.type || "Unknown")}</div>
                              <div>
                                <div className="font-medium">{device.name}</div>
                                <div className="text-sm text-gray-500">
                                  ID: {device.device_id} | SN: {device.serial_number}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm">{device.attribute?.type || "N/A"}</span>
                          </TableCell>
                          <TableCell>{getStatusBadge(device)}</TableCell>
                          <TableCell>
                            <div>
                              <div className="text-sm">{device.attribute?.location || "N/A"}</div>
                              <div className="text-xs text-gray-500">Hub: {device.hub_id}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="text-sm">{new Date(device.updated_at).toLocaleString("vi-VN")}</div>
                              <div className="text-xs text-gray-500">
                                Reset: {new Date(device.last_reset_at).toLocaleString("vi-VN")}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div
                                className={`w-2 h-2 rounded-full ${device.power_status ? "bg-green-500" : "bg-red-500"
                                  }`}
                              ></div>
                              <span className="text-sm">{device.power_status ? "Bật" : "Tắt"}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {device.link_status === "connected" ? (
                                <Wifi className="h-4 w-4 text-green-500" />
                              ) : (
                                <WifiOff className="h-4 w-4 text-red-500" />
                              )}
                              <span className="text-sm">{device.wifi_ssid}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="bg-white">
                                <DropdownMenuItem>
                                  <Eye className="h-4 w-4 mr-2" />
                                  Xem chi tiết
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Settings className="h-4 w-4 mr-2" />
                                  Cấu hình
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Power className="h-4 w-4 mr-2" />
                                  {device.power_status ? "Tắt nguồn" : "Bật nguồn"}
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <RefreshCw className="h-4 w-4 mr-2" />
                                  Reset thiết bị
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600">
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Xóa thiết bị
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">Khách hàng này chưa có thiết bị nào.</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* No customer selected */}
        {!selectedCustomer && (
          <Card>
            <CardContent className="text-center py-12">
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa chọn khách hàng</h3>
              <p className="text-gray-500 text-lg">Vui lòng tìm kiếm và chọn khách hàng để xem danh sách thiết bị</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
