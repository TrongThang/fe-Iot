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
    Users,
    User,
    Eye,
    Settings,
    UserPlus,
    UserMinus,
    MoreHorizontal,
    Mail,
    Phone,
    Calendar,
    Crown,
    UserCheck,
    Clock,
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
        gender: true,
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

// Mock data cho groups và user_groups
const groupsData = [
    {
        group_id: "GRP_001",
        name: "Smart Home Management",
        description: "Quản lý thiết bị nhà thông minh",
        created_at: "2023-12-01T10:00:00Z",
        updated_at: "2024-01-07T14:30:00Z",
        is_deleted: false,
        member_count: 15,
        admin_count: 2,
    },
    {
        group_id: "GRP_002",
        name: "Security Monitoring",
        description: "Giám sát an ninh và bảo mật",
        created_at: "2023-12-05T11:00:00Z",
        updated_at: "2024-01-06T16:20:00Z",
        is_deleted: false,
        member_count: 8,
        admin_count: 1,
    },
    {
        group_id: "GRP_003",
        name: "Environmental Control",
        description: "Kiểm soát môi trường và năng lượng",
        created_at: "2023-12-10T09:30:00Z",
        updated_at: "2024-01-05T12:15:00Z",
        is_deleted: false,
        member_count: 12,
        admin_count: 3,
    },
    {
        group_id: "GRP_004",
        name: "Industrial IoT",
        description: "Quản lý IoT công nghiệp",
        created_at: "2023-12-15T14:00:00Z",
        updated_at: "2024-01-04T10:45:00Z",
        is_deleted: false,
        member_count: 25,
        admin_count: 4,
    },
]

const userGroupsData = [
    {
        user_group_id: "UG_001",
        account_id: "ACC_001",
        group_id: "GRP_001",
        customer_id: "CUST_001_ABC_TECH_2024",
        role: "admin",
        joined_at: "2023-12-01T10:30:00Z",
        updated_at: "2024-01-07T14:30:00Z",
        is_deleted: false,
    },
    {
        user_group_id: "UG_002",
        account_id: "ACC_001",
        group_id: "GRP_002",
        customer_id: "CUST_001_ABC_TECH_2024",
        role: "member",
        joined_at: "2023-12-05T11:15:00Z",
        updated_at: "2024-01-06T16:20:00Z",
        is_deleted: false,
    },
    {
        user_group_id: "UG_003",
        account_id: "ACC_001",
        group_id: "GRP_003",
        customer_id: "CUST_001_ABC_TECH_2024",
        role: "viewer",
        joined_at: "2023-12-10T10:00:00Z",
        updated_at: "2024-01-05T12:15:00Z",
        is_deleted: false,
    },
    {
        user_group_id: "UG_004",
        account_id: "ACC_002",
        group_id: "GRP_004",
        customer_id: "CUST_002_XYZ_CORP_2024",
        role: "admin",
        joined_at: "2023-12-15T14:30:00Z",
        updated_at: "2024-01-04T10:45:00Z",
        is_deleted: false,
    },
]

const getRoleIcon = (role) => {
    switch (role) {
        case "admin":
            return <Crown className="h-4 w-4" />
        case "member":
            return <User className="h-4 w-4" />
        case "viewer":
            return <Eye className="h-4 w-4" />
        default:
            return <User className="h-4 w-4" />
    }
}

const getRoleBadge = (role) => {
    switch (role) {
        case "admin":
            return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Admin</Badge>
        case "member":
            return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Member</Badge>
        case "viewer":
            return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Viewer</Badge>
        default:
            return <Badge variant="secondary">Unknown</Badge>
    }
}

export default function SearchGroups() {
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedCustomer, setSelectedCustomer] = useState(null)
    const [customerGroups, setCustomerGroups] = useState([])

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
            // Lấy nhóm của khách hàng
            const userGroups = userGroupsData.filter((ug) => ug.customer_id === customer.id)
            const groupsWithDetails = userGroups.map((ug) => {
                const groupInfo = groupsData.find((g) => g.group_id === ug.group_id)
                return {
                    ...ug,
                    ...groupInfo,
                }
            })
            setCustomerGroups(groupsWithDetails)
        } else {
            setSelectedCustomer(null)
            setCustomerGroups([])
        }
    }

    // Tính toán thống kê
    const totalGroups = customerGroups.length
    const adminGroups = customerGroups.filter((g) => g.role === "admin").length
    const memberGroups = customerGroups.filter((g) => g.role === "member").length
    const viewerGroups = customerGroups.filter((g) => g.role === "viewer").length

    return (
        <div className="min-h-screen">
            <div className="max-w-7xl mx-auto">
                {/* Search Section */}
                <div className="mb-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Tra cứu nhóm khách hàng</CardTitle>
                            <CardDescription>Nhập email để tìm kiếm nhóm</CardDescription>
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
                                                const userGroups = userGroupsData.filter((ug) => ug.customer_id === customer.id)
                                                const groupsWithDetails = userGroups.map((ug) => {
                                                    const groupInfo = groupsData.find((g) => g.group_id === ug.group_id)
                                                    return {
                                                        ...ug,
                                                        ...groupInfo,
                                                    }
                                                })
                                                setCustomerGroups(groupsWithDetails)
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
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                                                <span className="font-medium">Tổng nhóm:</span> {totalGroups}
                                            </p>
                                            <p>
                                                <span className="font-medium text-red-600">Admin:</span> {adminGroups}
                                            </p>
                                            <p>
                                                <span className="font-medium text-blue-600">Member:</span> {memberGroups}
                                            </p>
                                            <p>
                                                <span className="font-medium text-gray-600">Viewer:</span> {viewerGroups}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Groups List */}
                {selectedCustomer && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <span>Danh sách nhóm của {selectedCustomer.lastname}</span>
                                <Badge variant="outline">{customerGroups.length} nhóm</Badge>
                            </CardTitle>
                            <CardDescription>Quản lý và theo dõi các nhóm mà khách hàng tham gia</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {customerGroups.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Nhóm</TableHead>
                                                <TableHead>Vai trò</TableHead>
                                                <TableHead>Thành viên</TableHead>
                                                <TableHead>Ngày tham gia</TableHead>
                                                <TableHead>Cập nhật</TableHead>
                                                <TableHead>Trạng thái</TableHead>
                                                <TableHead className="text-right">Thao tác</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {customerGroups.map((group) => (
                                                <TableRow key={group.user_group_id}>
                                                    <TableCell>
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex-shrink-0">
                                                                <Users className="h-4 w-4 text-blue-500" />
                                                            </div>
                                                            <div>
                                                                <div className="font-medium">{group.name}</div>
                                                                <div className="text-sm text-gray-500">
                                                                    ID: {group.group_id} | {group.description}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            {getRoleIcon(group.role)}
                                                            {getRoleBadge(group.role)}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div>
                                                            <div className="text-sm font-medium">{group.member_count} thành viên</div>
                                                            <div className="text-xs text-gray-500">{group.admin_count} admin</div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-1">
                                                            <Calendar className="h-3 w-3 text-gray-400" />
                                                            <span className="text-sm">{new Date(group.joined_at).toLocaleDateString("vi-VN")}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-1">
                                                            <Clock className="h-3 w-3 text-gray-400" />
                                                            <span className="text-sm">{new Date(group.updated_at).toLocaleDateString("vi-VN")}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                                            <span className="text-sm">Hoạt động</span>
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
                                                                    Xem chi tiết nhóm
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem>
                                                                    <Users className="h-4 w-4 mr-2" />
                                                                    Danh sách thành viên
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem>
                                                                    <Settings className="h-4 w-4 mr-2" />
                                                                    Cài đặt nhóm
                                                                </DropdownMenuItem>
                                                                {group.role === "admin" && (
                                                                    <>
                                                                        <DropdownMenuItem>
                                                                            <UserPlus className="h-4 w-4 mr-2" />
                                                                            Thêm thành viên
                                                                        </DropdownMenuItem>
                                                                        <DropdownMenuItem>
                                                                            <UserCheck className="h-4 w-4 mr-2" />
                                                                            Quản lý quyền
                                                                        </DropdownMenuItem>
                                                                    </>
                                                                )}
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
                                    <p className="text-gray-500">Khách hàng này chưa tham gia nhóm nào.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* No customer selected */}
                {!selectedCustomer && (
                    <Card>
                        <CardContent className="text-center py-12">
                            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa chọn khách hàng</h3>
                            <p className="text-gray-500 text-lg">Vui lòng tìm kiếm và chọn khách hàng để xem danh sách nhóm</p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}
