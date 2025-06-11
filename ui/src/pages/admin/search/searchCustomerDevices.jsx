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
    Lightbulb,
    Fan,
    Thermometer,
    Power,
    Wifi,
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
    },
    {
        customer_id: "CUST_002_XYZ_CORP_2024",
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
        account: {
            account_id: "ACC_002_XYZ_2024",
            username: "xyzcorp_admin",
            role_id: 2,
            status: 1,
            created_at: "2023-03-10T09:00:00Z"
        }
    },
    {
        customer_id: "CUST_003_TECH_SOL_2024",
        surname: "Công ty",
        lastname: "Tech Solutions",
        image: "/placeholder.svg?height=64&width=64",
        phone: "+84923456789",
        email: "info@techsolutions.com",
        email_verified: true,
        birthdate: "1988-08-25",
        gender: true,
        created_at: "2023-06-15T11:00:00Z",
        updated_at: "2024-01-05T09:15:00Z",
        deleted_at: null,
        account: {
            account_id: "ACC_003_TECH_2024",
            username: "techsol_admin",
            role_id: 2,
            status: 1,
            created_at: "2023-06-15T11:00:00Z"
        }
    },
    {
        customer_id: "CUST_004_DIGI_INN_2024",
        surname: "Công ty",
        lastname: "Digital Innovation",
        image: "/placeholder.svg?height=64&width=64",
        phone: "+84934567890",
        email: "admin@digitalinnovation.com",
        email_verified: true,
        birthdate: "1992-03-10",
        gender: false,
        created_at: "2023-09-20T14:00:00Z",
        updated_at: "2024-01-04T11:30:00Z",
        deleted_at: null,
        account: {
            account_id: "ACC_004_DIGI_2024",
            username: "digiinn_admin",
            role_id: 2,
            status: 1,
            created_at: "2023-09-20T14:00:00Z"
        }
    }
]

const devicesData = [
    {
        device_id: "DEV_001",
        serial_number: "SN001ABC123",
        template_id: "TPL_001",
        space_id: "SPC_001",
        account_id: "ACC_001_ABC_2024",
        group_id: "GRP_001",
        hub_id: "HUB_001",
        firmware_id: "FW_001",
        device_type_id: "DT_001",
        name: "Smart Light Living Room",
        power_status: true,
        attribute: { brightness: 80, color: "#FFFFFF" },
        wifi_ssid: "ABC_Tech_WiFi",
        wifi_password: "********",
        current_value: 75,
        link_status: true,
        last_reset_at: "2024-01-01T00:00:00Z",
        lock_status: false,
        created_at: "2023-12-01T10:00:00Z",
        updated_at: "2024-01-07T14:30:00Z",
        is_deleted: false,
        space: {
            space_id: "SPC_001",
            name: "Living Room",
            house: {
                house_id: "HSE_001",
                name: "ABC Tech Office"
            }
        }
    },
    {
        device_id: "DEV_002",
        serial_number: "SN002ABC456",
        template_id: "TPL_002",
        space_id: "SPC_002",
        account_id: "ACC_001_ABC_2024",
        group_id: "GRP_001",
        hub_id: "HUB_001",
        firmware_id: "FW_002",
        device_type_id: "DT_002",
        name: "Smart AC Office",
        power_status: true,
        attribute: { temperature: 25, mode: "cool" },
        wifi_ssid: "ABC_Tech_WiFi",
        wifi_password: "********",
        current_value: 25,
        link_status: true,
        last_reset_at: "2024-01-01T00:00:00Z",
        lock_status: false,
        created_at: "2023-12-01T10:00:00Z",
        updated_at: "2024-01-07T14:30:00Z",
        is_deleted: false,
        space: {
            space_id: "SPC_002",
            name: "Office Room",
            house: {
                house_id: "HSE_001",
                name: "ABC Tech Office"
            }
        }
    },
    {
        device_id: "DEV_003",
        serial_number: "SN003XYZ789",
        template_id: "TPL_001",
        space_id: "SPC_003",
        account_id: "ACC_002_XYZ_2024",
        group_id: "GRP_002",
        hub_id: "HUB_002",
        firmware_id: "FW_001",
        device_type_id: "DT_003",
        name: "Smart Light Meeting Room",
        power_status: false,
        attribute: { brightness: 0, color: "#FFFFFF" },
        wifi_ssid: "XYZ_Corp_WiFi",
        wifi_password: "********",
        current_value: 0,
        link_status: true,
        last_reset_at: "2024-01-01T00:00:00Z",
        lock_status: false,
        created_at: "2023-12-05T11:00:00Z",
        updated_at: "2024-01-06T16:20:00Z",
        is_deleted: false,
        space: {
            space_id: "SPC_003",
            name: "Meeting Room",
            house: {
                house_id: "HSE_002",
                name: "XYZ Corp Building"
            }
        }
    },
    {
        device_id: "DEV_004",
        serial_number: "SN004XYZ012",
        template_id: "TPL_003",
        space_id: "SPC_004",
        account_id: "ACC_002_XYZ_2024",
        group_id: "GRP_002",
        hub_id: "HUB_002",
        firmware_id: "FW_003",
        device_type_id: "DT_004",
        name: "Security Camera Entrance",
        power_status: true,
        attribute: { resolution: "1080p", night_vision: true },
        wifi_ssid: "XYZ_Corp_WiFi",
        wifi_password: "********",
        current_value: 100,
        link_status: true,
        last_reset_at: "2024-01-01T00:00:00Z",
        lock_status: true,
        created_at: "2023-12-05T11:00:00Z",
        updated_at: "2024-01-06T16:20:00Z",
        is_deleted: false,
        space: {
            space_id: "SPC_004",
            name: "Entrance",
            house: {
                house_id: "HSE_002",
                name: "XYZ Corp Building"
            }
        }
    },
    {
        device_id: "DEV_005",
        serial_number: "SN005TECH345",
        template_id: "TPL_004",
        space_id: "SPC_005",
        account_id: "ACC_003_TECH_2024",
        group_id: "GRP_003",
        hub_id: "HUB_003",
        firmware_id: "FW_004",
        device_type_id: "DT_005",
        name: "Smart Door Lock",
        power_status: true,
        attribute: { battery: 85, status: "locked" },
        wifi_ssid: "Tech_Sol_WiFi",
        wifi_password: "********",
        current_value: 85,
        link_status: true,
        last_reset_at: "2024-01-01T00:00:00Z",
        lock_status: true,
        created_at: "2023-12-10T09:30:00Z",
        updated_at: "2024-01-05T12:15:00Z",
        is_deleted: false,
        space: {
            space_id: "SPC_005",
            name: "Main Entrance",
            house: {
                house_id: "HSE_003",
                name: "Tech Solutions HQ"
            }
        }
    },
    {
        device_id: "DEV_006",
        serial_number: "SN006TECH678",
        template_id: "TPL_005",
        space_id: "SPC_006",
        account_id: "ACC_003_TECH_2024",
        group_id: "GRP_003",
        hub_id: "HUB_003",
        firmware_id: "FW_005",
        device_type_id: "DT_006",
        name: "Smart Thermostat",
        power_status: true,
        attribute: { temperature: 23, humidity: 45 },
        wifi_ssid: "Tech_Sol_WiFi",
        wifi_password: "********",
        current_value: 23,
        link_status: true,
        last_reset_at: "2024-01-01T00:00:00Z",
        lock_status: false,
        created_at: "2023-12-10T09:30:00Z",
        updated_at: "2024-01-05T12:15:00Z",
        is_deleted: false,
        space: {
            space_id: "SPC_006",
            name: "Server Room",
            house: {
                house_id: "HSE_003",
                name: "Tech Solutions HQ"
            }
        }
    }
]

export default function SearchCustomerDevices() {
    const [searchFilters, setSearchFilters] = useState({
        email: "",
        phone: "",
        name: "",
        customerId: "",
        username: ""
    })
    const [selectedCustomer, setSelectedCustomer] = useState(null)
    const [customerDevices, setCustomerDevices] = useState([])
    const [filterOptions, setFilterOptions] = useState({
        deviceType: "all",
        status: "all"
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
            // Lọc thiết bị của khách hàng
            let devices = devicesData

            // Áp dụng các bộ lọc bổ sung
            if (filterOptions.deviceType !== "all") {
                devices = devices.filter(d => {
                    switch (filterOptions.deviceType) {
                        case 'light':
                            return d.device_type_id === "DT_001" || d.device_type_id === "DT_003";
                        case 'fan':
                            return d.device_type_id === "DT_002";
                        case 'ac':
                            return d.device_type_id === "DT_002";
                        default:
                            return true;
                    }
                })
            }

            if (filterOptions.status !== "all") {
                if (filterOptions.status === "power") {
                    devices = devices.filter(d => d.power_status)
                } else if (filterOptions.status === "link") {
                    devices = devices.filter(d => d.link_status === "linked")
                }
            }

            setCustomerDevices(devices)
        } else {
            setSelectedCustomer(null)
            setCustomerDevices([])
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
            deviceType: "all",
            status: "all"
        })
        setSelectedCustomer(null)
        setCustomerDevices([])
    }

    const getDeviceIcon = (type) => {
        switch (type) {
            case 'light':
                return <Lightbulb className="h-5 w-5" />
            case 'fan':
                return <Fan className="h-5 w-5" />
            case 'ac':
                return <Thermometer className="h-5 w-5" />
            default:
                return <Power className="h-5 w-5" />
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
            <div className="max-w-7xl mx-auto p-6">
                {/* Search Section */}
                <div className="mb-8">
                    <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg shadow-black/5">
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold text-slate-900">Tra cứu thiết bị của khách hàng</CardTitle>
                            <CardDescription className="text-slate-600">
                                Tìm kiếm và quản lý các thiết bị của khách hàng
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

                                {/* Device Filters */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-slate-700 mb-2 block">Loại thiết bị</label>
                                        <Select
                                            value={filterOptions.deviceType}
                                            onValueChange={(value) => setFilterOptions({ ...filterOptions, deviceType: value })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Chọn loại thiết bị" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">Tất cả loại</SelectItem>
                                                <SelectItem value="light">Đèn</SelectItem>
                                                <SelectItem value="fan">Quạt</SelectItem>
                                                <SelectItem value="ac">Điều hòa</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-slate-700 mb-2 block">Trạng thái</label>
                                        <Select
                                            value={filterOptions.status}
                                            onValueChange={(value) => setFilterOptions({ ...filterOptions, status: value })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Chọn trạng thái" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                                                <SelectItem value="power">Đang bật</SelectItem>
                                                <SelectItem value="link">Đang kết nối</SelectItem>
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

                {/* Devices List */}
                {customerDevices.length > 0 && (
                    <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg shadow-black/5">
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <div>
                                    <CardTitle className="text-xl font-semibold text-slate-900">Danh sách thiết bị</CardTitle>
                                    <CardDescription className="text-slate-600">
                                        Tổng số: {customerDevices.length} thiết bị
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-slate-50/50">
                                            <TableHead className="font-semibold">ID</TableHead>
                                            <TableHead className="font-semibold">Serial</TableHead>
                                            <TableHead className="font-semibold">Tên thiết bị</TableHead>
                                            <TableHead className="font-semibold">Template</TableHead>
                                            <TableHead className="font-semibold">Vị trí</TableHead>
                                            <TableHead className="font-semibold">Trạng thái</TableHead>
                                            <TableHead className="font-semibold">Ngày tạo</TableHead>
                                            <TableHead className="font-semibold text-right">Thao tác</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {customerDevices.map((device) => (
                                            <TableRow key={device.device_id} className="hover:bg-slate-50/50">
                                                <TableCell className="font-medium">{device.device_id}</TableCell>
                                                <TableCell>{device.serial_number}</TableCell>
                                                <TableCell>
                                                    <div className="flex items-center space-x-3">
                                                        <div className="p-2 rounded-lg bg-blue-50">
                                                            {getDeviceIcon(device.device_type_id)}
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-slate-900">{device.name}</p>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">
                                                        {device.template_id}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="space-y-1">
                                                        <p className="font-medium text-slate-900">{device.space.name}</p>
                                                        <p className="text-sm text-slate-500">{device.space.house.name}</p>
                                                        <p className="text-xs text-slate-400">{device.space.house.address}</p>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex gap-2">
                                                        <Badge
                                                            variant={device.power_status ? "success" : "secondary"}
                                                            className="flex items-center gap-1"
                                                        >
                                                            <Power className="h-3 w-3" />
                                                            {device.power_status ? "Đang bật" : "Đang tắt"}
                                                        </Badge>
                                                        <Badge
                                                            variant={device.link_status === "linked" ? "success" : "secondary"}
                                                            className="flex items-center gap-1"
                                                        >
                                                            <Wifi className="h-3 w-3" />
                                                            {device.link_status === "linked" ? "Đang kết nối" : "Mất kết nối"}
                                                        </Badge>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-slate-600">
                                                    {new Date(device.created_at).toLocaleDateString('vi-VN')}
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
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}
