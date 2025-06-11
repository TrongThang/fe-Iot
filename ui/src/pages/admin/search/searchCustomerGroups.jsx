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
    Users,
    Shield,
    Building,
    Home,
    MoreHorizontal,
    Settings,
    Trash2,
    Eye,
    RefreshCw,
    Calendar,
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

const groupsData = [
    {
        group_id: 201,
        group_name: "Nhóm An toàn",
        group_description: "Quản lý các thiết bị an toàn",
        icon_color: "#FF5733",
        icon_name: "shield",
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-07T14:30:00Z",
        is_deleted: false,
        user_groups: [
            {
                user_group_id: 1,
                account_id: "ACC_001_ABC_2024",
                role: "admin",
                joined_at: "2024-01-01T00:00:00Z",
                updated_at: "2024-01-07T14:30:00Z",
                is_deleted: false
            }
        ]
    },
    {
        group_id: 202,
        group_name: "Nhóm Chiếu sáng",
        group_description: "Quản lý hệ thống chiếu sáng",
        icon_color: "#33FF57",
        icon_name: "lightbulb",
        created_at: "2024-01-02T00:00:00Z",
        updated_at: "2024-01-07T14:30:00Z",
        is_deleted: false,
        user_groups: [
            {
                user_group_id: 2,
                account_id: "ACC_001_ABC_2024",
                role: "member",
                joined_at: "2024-01-02T00:00:00Z",
                updated_at: "2024-01-07T14:30:00Z",
                is_deleted: false
            }
        ]
    },
    {
        group_id: 203,
        group_name: "Nhóm Điều hòa",
        group_description: "Quản lý hệ thống điều hòa",
        icon_color: "#3357FF",
        icon_name: "snowflake",
        created_at: "2024-01-03T00:00:00Z",
        updated_at: "2024-01-07T14:30:00Z",
        is_deleted: false,
        user_groups: [
            {
                user_group_id: 3,
                account_id: "ACC_001_ABC_2024",
                role: "viewer",
                joined_at: "2024-01-03T00:00:00Z",
                updated_at: "2024-01-07T14:30:00Z",
                is_deleted: false
            }
        ]
    },
    {
        group_id: 204,
        group_name: "Nhóm Camera",
        group_description: "Quản lý hệ thống camera",
        icon_color: "#FF33F6",
        icon_name: "camera",
        created_at: "2024-01-04T00:00:00Z",
        updated_at: "2024-01-07T14:30:00Z",
        is_deleted: false,
        user_groups: [
            {
                user_group_id: 4,
                account_id: "ACC_001_ABC_2024",
                role: "admin",
                joined_at: "2024-01-04T00:00:00Z",
                updated_at: "2024-01-07T14:30:00Z",
                is_deleted: false
            }
        ]
    },
    {
        group_id: 205,
        group_name: "Nhóm Khóa thông minh",
        group_description: "Quản lý hệ thống khóa thông minh",
        icon_color: "#F6FF33",
        icon_name: "key",
        created_at: "2024-01-05T00:00:00Z",
        updated_at: "2024-01-07T14:30:00Z",
        is_deleted: false,
        user_groups: [
            {
                user_group_id: 5,
                account_id: "ACC_001_ABC_2024",
                role: "member",
                joined_at: "2024-01-05T00:00:00Z",
                updated_at: "2024-01-07T14:30:00Z",
                is_deleted: false
            }
        ]
    },
    {
        group_id: 206,
        group_name: "Nhóm Cảm biến",
        group_description: "Quản lý hệ thống cảm biến",
        icon_color: "#33FFF6",
        icon_name: "activity",
        created_at: "2024-01-06T00:00:00Z",
        updated_at: "2024-01-07T14:30:00Z",
        is_deleted: false,
        user_groups: [
            {
                user_group_id: 6,
                account_id: "ACC_001_ABC_2024",
                role: "viewer",
                joined_at: "2024-01-06T00:00:00Z",
                updated_at: "2024-01-07T14:30:00Z",
                is_deleted: false
            }
        ]
    }
]

export default function SearchCustomerGroups() {
    const [searchFilters, setSearchFilters] = useState({
        email: "",
        phone: "",
        name: "",
        customerId: "",
        username: ""
    })
    const [selectedCustomer, setSelectedCustomer] = useState(null)
    const [customerGroups, setCustomerGroups] = useState([])
    const [filterOptions, setFilterOptions] = useState({
        role: "all",
        groupType: "all"
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
            // Lọc nhóm của khách hàng
            let groups = groupsData.filter(g =>
                g.user_groups.some(ug => ug.account_id === customer.account.account_id)
            )

            // Áp dụng các bộ lọc bổ sung
            if (filterOptions.role !== "all") {
                groups = groups.filter(g =>
                    g.user_groups.some(ug => ug.role === filterOptions.role)
                )
            }

            if (filterOptions.groupType !== "all") {
                groups = groups.filter(g => g.group_name.toLowerCase().includes(filterOptions.groupType.toLowerCase()))
            }

            setCustomerGroups(groups)
        } else {
            setSelectedCustomer(null)
            setCustomerGroups([])
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
            role: "all",
            groupType: "all"
        })
        setSelectedCustomer(null)
        setCustomerGroups([])
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
            <div className="max-w-7xl mx-auto p-6">
                {/* Search Section */}
                <div className="mb-8">
                    <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg shadow-black/5">
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold text-slate-900">Tra cứu nhóm của khách hàng</CardTitle>
                            <CardDescription className="text-slate-600">
                                Tìm kiếm và quản lý các nhóm thiết bị của khách hàng
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

                                {/* Group Filters */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-slate-700 mb-2 block">Vai trò trong nhóm</label>
                                        <Select
                                            value={filterOptions.role}
                                            onValueChange={(value) => setFilterOptions({ ...filterOptions, role: value })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Chọn vai trò" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">Tất cả vai trò</SelectItem>
                                                <SelectItem value="admin">Admin</SelectItem>
                                                <SelectItem value="member">Member</SelectItem>
                                                <SelectItem value="viewer">Viewer</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-slate-700 mb-2 block">Loại nhóm</label>
                                        <Select
                                            value={filterOptions.groupType}
                                            onValueChange={(value) => setFilterOptions({ ...filterOptions, groupType: value })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Chọn loại nhóm" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">Tất cả nhóm</SelectItem>
                                                <SelectItem value="an toàn">Nhóm An toàn</SelectItem>
                                                <SelectItem value="chiếu sáng">Nhóm Chiếu sáng</SelectItem>
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
                {/* Groups List */}
                {customerGroups.length > 0 && (
                    <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg shadow-black/5">
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <div>
                                    <CardTitle className="text-xl font-semibold text-slate-900">Danh sách nhóm</CardTitle>
                                    <CardDescription className="text-slate-600">
                                        Tổng số: {customerGroups.length} nhóm
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
                                            <TableHead className="font-semibold">Tên nhóm</TableHead>
                                            <TableHead className="font-semibold">Mô tả</TableHead>
                                            <TableHead className="font-semibold">Vai trò</TableHead>
                                            <TableHead className="font-semibold">Ngày tham gia</TableHead>
                                            <TableHead className="font-semibold">Cập nhật</TableHead>
                                            <TableHead className="font-semibold text-right">Thao tác</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {customerGroups.map((group) => {
                                            const userGroup = group.user_groups.find(ug => ug.account_id === selectedCustomer.account.account_id)
                                            return (
                                                <TableRow key={group.group_id} className="hover:bg-slate-50/50">
                                                    <TableCell className="font-medium">{group.group_id}</TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center space-x-3">
                                                            <div
                                                                className="p-2 rounded-lg"
                                                                style={{ backgroundColor: group.icon_color + '20' }}
                                                            >
                                                                {group.icon_name === 'shield' ? (
                                                                    <Shield className="h-5 w-5" style={{ color: group.icon_color }} />
                                                                ) : (
                                                                    <Users className="h-5 w-5" style={{ color: group.icon_color }} />
                                                                )}
                                                            </div>
                                                            <div>
                                                                <p className="font-medium text-slate-900">{group.group_name}</p>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-slate-600">{group.group_description}</TableCell>
                                                    <TableCell>
                                                        <Badge
                                                            variant={userGroup?.role === 'admin' ? 'default' : 'secondary'}
                                                            className="capitalize"
                                                        >
                                                            {userGroup?.role}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-slate-600">
                                                        {new Date(userGroup?.joined_at).toLocaleDateString('vi-VN')}
                                                    </TableCell>
                                                    <TableCell className="text-slate-600">
                                                        {new Date(userGroup?.updated_at).toLocaleDateString('vi-VN')}
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
                                                                    Rời nhóm
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        })}
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
