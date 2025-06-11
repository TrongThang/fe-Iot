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
    User,
    Mail,
    Phone,
    Building,
    Home,
    MapPin,
    MoreHorizontal,
    Settings,
    Trash2,
    Eye,
    RefreshCw,
    Calendar,
    Shield,
    Users,
    DoorOpen,
    Layers,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock data theo schema Prisma
const customersData = [
    {
        customer_id: "CUST_001_ABC_TECH_2024",
        surname: "Công ty TNHH",
        lastname: "ABC Technology",
        image: "/placeholder.svg?height=64&width=64",
        phone: "+84901234567",
        email: "admin@abctech.com",
        email_verified: true,
        birthdate: "1990-01-15",
        gender: true,
        created_at: "2023-01-15T10:00:00Z",
        updated_at: "2024-01-07T14:30:00Z",
        deleted_at: null,
        account: {
            account_id: "ACC_001_ABC_2024",
            username: "abctech_admin",
            role_id: 2,
            status: 1,
            created_at: "2023-01-15T10:00:00Z"
        }
    }
]

const spacesData = [
    {
        space_id: 1001,
        house_id: 101,
        space_name: "Tầng 1",
        space_description: "Khu vực tiếp tân",
        icon_name: "floor",
        icon_color: "#10B981",
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-07T14:30:00Z",
        is_deleted: false,
        house: {
            house_name: "Trụ sở chính",
            address: "123 Đường ABC, Quận 1, TP.HCM",
            icon_name: "building",
            icon_color: "#4F46E5"
        },
        devices: [
            {
                device_id: "DEV_001",
                device_name: "Đèn LED 1",
                device_type: "light",
                power: true,
                link: true
            },
            {
                device_id: "DEV_002",
                device_name: "Quạt 1",
                device_type: "fan",
                power: false,
                link: true
            }
        ]
    },
    {
        space_id: 1002,
        house_id: 101,
        space_name: "Tầng 2",
        space_description: "Khu vực văn phòng",
        icon_name: "floor",
        icon_color: "#10B981",
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-07T14:30:00Z",
        is_deleted: false,
        house: {
            house_name: "Trụ sở chính",
            address: "123 Đường ABC, Quận 1, TP.HCM",
            icon_name: "building",
            icon_color: "#4F46E5"
        },
        devices: [
            {
                device_id: "DEV_003",
                device_name: "Điều hòa 1",
                device_type: "ac",
                power: true,
                link: true
            }
        ]
    }
]

export default function SearchCustomerSpaces() {
    const [searchFilters, setSearchFilters] = useState({
        email: "",
        phone: "",
        name: "",
        customerId: "",
        username: ""
    })
    const [selectedCustomer, setSelectedCustomer] = useState(null)
    const [customerSpaces, setCustomerSpaces] = useState([])
    const [filterOptions, setFilterOptions] = useState({
        spaceType: "all",
        houseType: "all"
    })

    const handleSearch = () => {
        const customer = customersData.find((c) => {
            const emailMatch = !searchFilters.email || c.email.toLowerCase().includes(searchFilters.email.toLowerCase())
            const phoneMatch = !searchFilters.phone || c.phone.toLowerCase().includes(searchFilters.phone.toLowerCase())
            const nameMatch = !searchFilters.name ||
                (c.surname + " " + c.lastname).toLowerCase().includes(searchFilters.name.toLowerCase())
            const idMatch = !searchFilters.customerId || c.customer_id.toLowerCase().includes(searchFilters.customerId.toLowerCase())
            const usernameMatch = !searchFilters.username ||
                c.account?.username.toLowerCase().includes(searchFilters.username.toLowerCase())

            return emailMatch && phoneMatch && nameMatch && idMatch && usernameMatch
        })

        if (customer) {
            setSelectedCustomer(customer)
            // Lọc không gian của khách hàng
            let spaces = spacesData

            // Áp dụng các bộ lọc bổ sung
            if (filterOptions.spaceType !== "all") {
                spaces = spaces.filter(s => s.icon_name === filterOptions.spaceType)
            }

            if (filterOptions.houseType !== "all") {
                spaces = spaces.filter(s => s.house.icon_name === filterOptions.houseType)
            }

            setCustomerSpaces(spaces)
        } else {
            setSelectedCustomer(null)
            setCustomerSpaces([])
        }
    }

    const handleReset = () => {
        setSearchFilters({
            email: "",
            phone: "",
            name: "",
            customerId: "",
            username: ""
        })
        setFilterOptions({
            spaceType: "all",
            houseType: "all"
        })
        setSelectedCustomer(null)
        setCustomerSpaces([])
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
            <div className="max-w-7xl mx-auto p-6">
                {/* Search Section */}
                <div className="mb-8">
                    <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg shadow-black/5">
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold text-slate-900">Tra cứu không gian của khách hàng</CardTitle>
                            <CardDescription className="text-slate-600">
                                Tìm kiếm và quản lý các không gian của khách hàng
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {/* Search Filters */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Email</label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                                            <Input
                                                placeholder="Nhập email..."
                                                value={searchFilters.email}
                                                onChange={(e) => setSearchFilters({ ...searchFilters, email: e.target.value })}
                                                className="pl-10"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Số điện thoại</label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                                            <Input
                                                placeholder="Nhập số điện thoại..."
                                                value={searchFilters.phone}
                                                onChange={(e) => setSearchFilters({ ...searchFilters, phone: e.target.value })}
                                                className="pl-10"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Tên khách hàng</label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                                            <Input
                                                placeholder="Nhập tên khách hàng..."
                                                value={searchFilters.name}
                                                onChange={(e) => setSearchFilters({ ...searchFilters, name: e.target.value })}
                                                className="pl-10"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Mã khách hàng</label>
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                                            <Input
                                                placeholder="Nhập mã khách hàng..."
                                                value={searchFilters.customerId}
                                                onChange={(e) => setSearchFilters({ ...searchFilters, customerId: e.target.value })}
                                                className="pl-10"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Username</label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                                            <Input
                                                placeholder="Nhập username..."
                                                value={searchFilters.username}
                                                onChange={(e) => setSearchFilters({ ...searchFilters, username: e.target.value })}
                                                className="pl-10"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Space Filters */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-slate-700 mb-2 block">Loại không gian</label>
                                        <Select
                                            value={filterOptions.spaceType}
                                            onValueChange={(value) => setFilterOptions({ ...filterOptions, spaceType: value })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Chọn loại không gian" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">Tất cả loại</SelectItem>
                                                <SelectItem value="floor">Tầng</SelectItem>
                                                <SelectItem value="room">Phòng</SelectItem>
                                                <SelectItem value="area">Khu vực</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-slate-700 mb-2 block">Loại nhà</label>
                                        <Select
                                            value={filterOptions.houseType}
                                            onValueChange={(value) => setFilterOptions({ ...filterOptions, houseType: value })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Chọn loại nhà" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">Tất cả loại</SelectItem>
                                                <SelectItem value="building">Tòa nhà</SelectItem>
                                                <SelectItem value="home">Nhà riêng</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex justify-end gap-4">
                                    <Button
                                        onClick={handleReset}
                                        variant="outline"
                                        className="px-6"
                                    >
                                        <RefreshCw className="h-4 w-4 mr-2" />
                                        Đặt lại
                                    </Button>
                                    <Button
                                        onClick={handleSearch}
                                        className="px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                                    >
                                        <Search className="h-4 w-4 mr-2" />
                                        Tìm kiếm
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                
                {/* Customer Information */}
                {selectedCustomer && (
                    <Card className="mb-8 bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg shadow-black/5">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-xl font-semibold text-slate-900">Thông tin khách hàng</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col md:flex-row gap-6">
                                {/* Avatar và thông tin cơ bản */}
                                <div className="flex items-center gap-4">
                                    <Avatar className="h-16 w-16 border-2 border-white shadow-lg">
                                        <AvatarImage src={selectedCustomer.image} />
                                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-500 text-white text-lg">
                                            {selectedCustomer.surname.charAt(0)}{selectedCustomer.lastname.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h3 className="text-base font-semibold text-slate-900">
                                            {selectedCustomer.surname} {selectedCustomer.lastname}
                                        </h3>
                                        <p className="text-xs text-slate-500">ID: {selectedCustomer.customer_id}</p>
                                    </div>
                                </div>

                                {/* Thông tin chi tiết */}
                                <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-4">
                                    <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50/50">
                                        <div className="p-2 rounded-lg bg-blue-50">
                                            <User className="h-4 w-4 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500">Username</p>
                                            <p className="text-sm font-medium text-slate-900">{selectedCustomer.account?.username}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50/50">
                                        <div className="p-2 rounded-lg bg-green-50">
                                            <Mail className="h-4 w-4 text-green-600" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500">Email</p>
                                            <p className="text-sm font-medium text-slate-900">{selectedCustomer.email}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50/50">
                                        <div className="p-2 rounded-lg bg-purple-50">
                                            <Phone className="h-4 w-4 text-purple-600" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500">Số điện thoại</p>
                                            <p className="text-sm font-medium text-slate-900">{selectedCustomer.phone}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50/50">
                                        <div className="p-2 rounded-lg bg-orange-50">
                                            <Calendar className="h-4 w-4 text-orange-600" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500">Ngày sinh</p>
                                            <p className="text-sm font-medium text-slate-900">
                                                {new Date(selectedCustomer.birthdate).toLocaleDateString('vi-VN')}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50/50">
                                        <div className="p-2 rounded-lg bg-cyan-50">
                                            <Shield className="h-4 w-4 text-cyan-600" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500">Trạng thái email</p>
                                            <Badge variant={selectedCustomer.email_verified ? "success" : "secondary"} className="text-xs">
                                                {selectedCustomer.email_verified ? "Đã xác thực" : "Chưa xác thực"}
                                            </Badge>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50/50">
                                        <div className="p-2 rounded-lg bg-pink-50">
                                            <Users className="h-4 w-4 text-pink-600" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500">Giới tính</p>
                                            <p className="text-sm font-medium text-slate-900">
                                                {selectedCustomer.gender ? "Nam" : "Nữ"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Spaces List */}
                {customerSpaces.length > 0 && (
                    <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg shadow-black/5">
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <div>
                                    <CardTitle className="text-xl font-semibold text-slate-900">Danh sách không gian</CardTitle>
                                    <CardDescription className="text-slate-600">
                                        Tổng số: {customerSpaces.length} không gian
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-slate-50/50">
                                            <TableHead className="font-semibold">Tên không gian</TableHead>
                                            <TableHead className="font-semibold">Thuộc nhà</TableHead>
                                            <TableHead className="font-semibold">Thiết bị</TableHead>
                                            <TableHead className="font-semibold">Ngày tạo</TableHead>
                                            <TableHead className="font-semibold text-right">Thao tác</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {customerSpaces.map((space) => (
                                            <TableRow key={space.space_id} className="hover:bg-slate-50/50">
                                                <TableCell>
                                                    <div className="flex items-center space-x-3">
                                                        <div
                                                            className="p-2 rounded-lg"
                                                            style={{ backgroundColor: space.icon_color + '20' }}
                                                        >
                                                            <DoorOpen className="h-5 w-5" style={{ color: space.icon_color }} />
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-slate-900">{space.space_name}</p>
                                                            <p className="text-sm text-slate-500">{space.space_description}</p>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center space-x-3">
                                                        <div
                                                            className="p-2 rounded-lg"
                                                            style={{ backgroundColor: space.house.icon_color + '20' }}
                                                        >
                                                            {space.house.icon_name === 'building' ? (
                                                                <Building className="h-5 w-5" style={{ color: space.house.icon_color }} />
                                                            ) : (
                                                                <Home className="h-5 w-5" style={{ color: space.house.icon_color }} />
                                                            )}
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-slate-900">{space.house.house_name}</p>
                                                            <p className="text-sm text-slate-500">{space.house.address}</p>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="space-y-1">
                                                        {space.devices.map((device) => (
                                                            <Badge
                                                                key={device.device_id}
                                                                variant={device.power ? "success" : "secondary"}
                                                                className="mr-2"
                                                            >
                                                                {device.device_name}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-slate-600">
                                                    {new Date(space.created_at).toLocaleDateString('vi-VN')}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="hover:bg-slate-100">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-48">
                                                            <DropdownMenuItem className="cursor-pointer">
                                                                <Eye className="h-4 w-4 mr-2" />
                                                                Xem chi tiết
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="cursor-pointer">
                                                                <Settings className="h-4 w-4 mr-2" />
                                                                Cài đặt
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="text-red-600 cursor-pointer">
                                                                <Trash2 className="h-4 w-4 mr-2" />
                                                                Xóa không gian
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}
