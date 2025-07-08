"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
    Search,
    Filter,
    Eye,
    Download,
    Phone,
    Mail,
    Calendar,
    User,
    Users,
    Smartphone,
    Shield,
    Clock,
    MapPin,
    Settings,
    Share2,
    UserCheck,
    AlertCircle,
    CheckCircle,
    XCircle,
    Edit,
    Trash2,
    Plus,
    FileText,
    History,
} from "lucide-react"

export default function CustomerShare() {
    const [searchType, setSearchType] = useState("customer")
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [permissionFilter, setPermissionFilter] = useState("all")
    const [dateFrom, setDateFrom] = useState("")
    const [dateTo, setDateTo] = useState("")
    const [selectedRecord, setSelectedRecord] = useState(null)
    const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)

    // Mock data cho chia sẻ quyền
    const sharingRecords = [
        {
            sharing_id: "SH2024001",
            owner_id: 1001,
            owner_name: "Nguyễn Văn Anh",
            owner_phone: "0901234567",
            owner_email: "nguyenvananh@email.com",
            owner_address: "123 Đường ABC, Quận 1, TP.HCM",

            device_id: 1,
            device_name: "Philips Hue Smart Light",
            device_serial: "SN001234567890",
            device_type: "Smart Light",

            shared_with_id: 2001,
            shared_with_name: "Trần Thị Bình",
            shared_with_phone: "0987654321",
            shared_with_email: "tranthibinh@email.com",
            shared_with_address: "456 Đường XYZ, Quận 3, TP.HCM",

            permission_level: "view_control",
            permission_details: {
                can_view: true, // Có thể xem trạng thái đèn (bật/tắt, độ sáng)
                can_control: true, // Có thể điều khiển đèn (bật/tắt, thay đổi độ sáng)
                can_share: false, // Không thể chia sẻ lại quyền
                can_delete: false, // Không thể xóa thiết bị
            },

            shared_date: "2024-01-15T10:30:00",
            expires_date: "2024-07-15T10:30:00",
            status: "active",
            notes: "Chia sẻ quyền điều khiển đèn thông minh cho thành viên gia đình",

            created_by: "CSKH001",
            created_by_name: "Lê Văn Cường",
            last_accessed: "2024-01-20T14:30:00",
            access_count: 45,
        },
        {
            sharing_id: "SH2024002",
            owner_id: 1002,
            owner_name: "Phạm Văn Đức",
            owner_phone: "0912345678",
            owner_email: "phamvanduc@email.com",
            owner_address: "789 Đường DEF, Quận 7, TP.HCM",

            device_id: 2,
            device_name: "TP-Link Smart Plug",
            device_serial: "SN001234567891",
            device_type: "Smart Plug",

            shared_with_id: 2002,
            shared_with_name: "Hoàng Thị Ế",
            shared_with_phone: "0976543210",
            shared_with_email: "hoangthie@email.com",
            shared_with_address: "321 Đường GHI, Quận 2, TP.HCM",

            permission_level: "view_only",
            permission_details: {
                can_view: true, // Có thể xem trạng thái ổ cắm (bật/tắt)
                can_control: false, // Không thể điều khiển ổ cắm
                can_share: false, // Không thể chia sẻ lại quyền
                can_delete: false, // Không thể xóa thiết bị
            },

            shared_date: "2024-01-14T09:15:00",
            expires_date: "2024-04-14T09:15:00",
            status: "active",
            notes: "Chia sẻ quyền xem trạng thái ổ cắm cho đồng nghiệp",

            created_by: "CSKH002",
            created_by_name: "Nguyễn Thị Phương",
            last_accessed: "2024-01-19T16:45:00",
            access_count: 12,
        },
        {
            sharing_id: "SH2024003",
            owner_id: 1003,
            owner_name: "Vũ Văn Giang",
            owner_phone: "0923456789",
            owner_email: "vuvangiang@email.com",
            owner_address: "654 Đường JKL, Quận 5, TP.HCM",

            device_id: 3,
            device_name: "Arlo Security Camera",
            device_serial: "SN001234567892",
            device_type: "Security Camera",

            shared_with_id: 2003,
            shared_with_name: "Đặng Thị Hoa",
            shared_with_phone: "0965432109",
            shared_with_email: "dangthihoa@email.com",
            shared_with_address: "987 Đường MNO, Quận 6, TP.HCM",

            permission_level: "full_access",
            permission_details: {
                can_view: true, // Có thể xem hình ảnh từ camera
                can_control: true, // Có thể điều khiển camera (xoay, bật/tắt)
                can_share: true, // Có thể chia sẻ quyền với người khác
                can_delete: true, // Có thể xóa thiết bị khỏi hệ thống
            },

            shared_date: "2024-01-10T14:20:00",
            expires_date: null,
            status: "expired",
            notes: "Quyền quản trị đầy đủ camera - đã hết hạn",

            created_by: "CSKH001",
            created_by_name: "Lê Văn Cường",
            last_accessed: "2024-01-12T10:15:00",
            access_count: 8,
        },
        {
            sharing_id: "SH2024004",
            owner_id: 1001,
            owner_name: "Nguyễn Văn Anh",
            owner_phone: "0901234567",
            owner_email: "nguyenvananh@email.com",
            owner_address: "123 Đường ABC, Quận 1, TP.HCM",

            device_id: 4,
            device_name: "Yale Smart Lock",
            device_serial: "SN001234567893",
            device_type: "Smart Lock",

            shared_with_id: 2004,
            shared_with_name: "Lý Thị Kim",
            shared_with_phone: "0954321098",
            shared_with_email: "lythikim@email.com",
            shared_with_address: "258 Đường STU, Quận 8, TP.HCM",

            permission_level: "view_control",
            permission_details: {
                can_view: true, // Có thể xem trạng thái khóa (mở/khóa)
                can_control: true, // Có thể điều khiển khóa (mở/khóa từ xa)
                can_share: false, // Không thể chia sẻ lại quyền
                can_delete: false, // Không thể xóa thiết bị
            },

            shared_date: "2024-01-12T11:00:00",
            expires_date: "2024-06-12T11:00:00",
            status: "suspended",
            notes: "Tạm dừng quyền điều khiển khóa thông minh do vi phạm chính sách sử dụng",

            created_by: "CSKH003",
            created_by_name: "Trần Văn Long",
            last_accessed: "2024-01-18T09:30:00",
            access_count: 23,
        },
    ];
    const getStatusBadge = (status) => {
        switch (status) {
            case "active":
                return (
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Hoạt động
                    </Badge>
                )
            case "expired":
                return (
                    <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
                        <XCircle className="w-3 h-3 mr-1" />
                        Hết hạn
                    </Badge>
                )
            case "suspended":
                return (
                    <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Tạm dừng
                    </Badge>
                )
            default:
                return <Badge variant="secondary">{status}</Badge>
        }
    }

    const getPermissionBadge = (level) => {
        switch (level) {
            case "view_only":
                return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Chỉ xem</Badge>
            case "view_control":
                return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Xem & Điều khiển</Badge>
            case "full_access":
                return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">Toàn quyền</Badge>
            default:
                return <Badge variant="secondary">{level}</Badge>
        }
    }

    const getDeviceIcon = (type) => {
        switch (type.toLowerCase()) {
            case "smartphone":
                return <Smartphone className="w-4 h-4" />
            case "tablet":
                return <Smartphone className="w-4 h-4" />
            case "laptop":
                return <Settings className="w-4 h-4" />
            default:
                return <Smartphone className="w-4 h-4" />
        }
    }

    const filteredRecords = sharingRecords.filter((record) => {
        const matchesSearch =
            searchType === "customer"
                ? record.owner_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                record.owner_phone.includes(searchTerm) ||
                record.owner_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                record.shared_with_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                record.shared_with_phone.includes(searchTerm)
                : record.device_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                record.device_serial.toLowerCase().includes(searchTerm.toLowerCase()) ||
                record.device_id.toString().includes(searchTerm)

        const matchesStatus = statusFilter === "all" || record.status === statusFilter
        const matchesPermission = permissionFilter === "all" || record.permission_level === permissionFilter

        const matchesDate =
            (!dateFrom || new Date(record.shared_date) >= new Date(dateFrom)) &&
            (!dateTo || new Date(record.shared_date) <= new Date(dateTo))

        return matchesSearch && matchesStatus && matchesPermission && matchesDate
    })

    const openDetailDialog = (record) => {
        setSelectedRecord(record)
        setIsDetailDialogOpen(true)
    }

    const closeDetailDialog = () => {
        setIsDetailDialogOpen(false)
        setSelectedRecord(null)
    }

    const DetailDialog = ({ record, isOpen, onClose }) => (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-6xl max-h-[95vh] overflow-hidden flex flex-col">
                <DialogHeader className="border-b pb-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Share2 className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <DialogTitle className="text-xl font-bold">Chi tiết chia sẻ quyền</DialogTitle>
                                <p className="text-sm text-gray-600 mt-1">
                                    Mã chia sẻ: <span className="font-mono font-semibold">{record.sharing_id}</span>
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {getStatusBadge(record.status)}
                            {getPermissionBadge(record.permission_level)}
                        </div>
                    </div>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto">
                    <Tabs defaultValue="overview" className="w-full">
                        <TabsList className="grid w-full grid-cols-4 mb-6">
                            <TabsTrigger value="overview" className="flex items-center gap-2">
                                <Eye className="w-4 h-4" />
                                Tổng quan
                            </TabsTrigger>
                            <TabsTrigger value="users" className="flex items-center gap-2">
                                <Users className="w-4 h-4" />
                                Người dùng
                            </TabsTrigger>
                            <TabsTrigger value="permissions" className="flex items-center gap-2">
                                <Shield className="w-4 h-4" />
                                Quyền hạn
                            </TabsTrigger>
                            <TabsTrigger value="activity" className="flex items-center gap-2">
                                <History className="w-4 h-4" />
                                Hoạt động
                            </TabsTrigger>
                        </TabsList>

                        {/* Tab Tổng quan */}
                        <TabsContent value="overview" className="space-y-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Thông tin chia sẻ */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <FileText className="w-5 h-5 text-blue-600" />
                                            Thông tin chia sẻ
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="p-3 bg-gray-50 rounded-lg">
                                                <p className="text-sm text-gray-600">Mã chia sẻ</p>
                                                <code className="font-mono font-bold text-blue-800">{record.sharing_id}</code>
                                            </div>
                                            <div className="p-3 bg-gray-50 rounded-lg">
                                                <p className="text-sm text-gray-600">Trạng thái</p>
                                                {getStatusBadge(record.status)}
                                            </div>
                                            <div className="p-3 bg-gray-50 rounded-lg">
                                                <p className="text-sm text-gray-600">Ngày chia sẻ</p>
                                                <p className="font-semibold">{new Date(record.shared_date).toLocaleDateString("vi-VN")}</p>
                                            </div>
                                            <div className="p-3 bg-gray-50 rounded-lg">
                                                <p className="text-sm text-gray-600">Ngày hết hạn</p>
                                                <p className="font-semibold">
                                                    {record.expires_date
                                                        ? new Date(record.expires_date).toLocaleDateString("vi-VN")
                                                        : "Không giới hạn"}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                            <h4 className="font-semibold text-blue-900 mb-2">Ghi chú</h4>
                                            <p className="text-blue-800">{record.notes}</p>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Thông tin thiết bị */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            {getDeviceIcon(record.device_type)}
                                            Thiết bị được chia sẻ
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="text-center mb-4">
                                            <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                                                {getDeviceIcon(record.device_type)}
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-900">{record.device_name}</h3>
                                            <p className="text-gray-600">{record.device_type}</p>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                <span className="font-medium text-gray-700">Device ID:</span>
                                                <span className="font-bold">{record.device_id}</span>
                                            </div>
                                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                <span className="font-medium text-gray-700">Serial Number:</span>
                                                <code className="font-mono text-sm bg-blue-100 px-2 py-1 rounded">{record.device_serial}</code>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>

                        {/* Tab Người dùng */}
                        <TabsContent value="users" className="space-y-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Chủ sở hữu */}
                                <Card className="border-2 border-blue-200">
                                    <CardHeader className="bg-blue-50">
                                        <CardTitle className="text-lg flex items-center gap-2 text-blue-800">
                                            <User className="w-5 h-5" />
                                            Chủ sở hữu thiết bị
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-6 space-y-4">
                                        <div className="text-center mb-4">
                                            <Avatar className="w-16 h-16 mx-auto mb-3">
                                                <AvatarFallback className="bg-blue-100 text-blue-600 text-lg font-bold">
                                                    {record.owner_name.charAt(0)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <h3 className="text-xl font-bold text-gray-900">{record.owner_name}</h3>
                                            <p className="text-sm text-gray-600">ID: {record.owner_id}</p>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                                <Phone className="w-4 h-4 text-gray-500" />
                                                <div>
                                                    <p className="text-sm text-gray-600">Số điện thoại</p>
                                                    <p className="font-semibold">{record.owner_phone}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                                <Mail className="w-4 h-4 text-gray-500" />
                                                <div>
                                                    <p className="text-sm text-gray-600">Email</p>
                                                    <p className="font-semibold">{record.owner_email}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                                <MapPin className="w-4 h-4 text-gray-500 mt-1" />
                                                <div>
                                                    <p className="text-sm text-gray-600">Địa chỉ</p>
                                                    <p className="font-semibold">{record.owner_address}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Người được chia sẻ */}
                                <Card className="border-2 border-green-200">
                                    <CardHeader className="bg-green-50">
                                        <CardTitle className="text-lg flex items-center gap-2 text-green-800">
                                            <UserCheck className="w-5 h-5" />
                                            Người được chia sẻ
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-6 space-y-4">
                                        <div className="text-center mb-4">
                                            <Avatar className="w-16 h-16 mx-auto mb-3">
                                                <AvatarFallback className="bg-green-100 text-green-600 text-lg font-bold">
                                                    {record.shared_with_name.charAt(0)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <h3 className="text-xl font-bold text-gray-900">{record.shared_with_name}</h3>
                                            <p className="text-sm text-gray-600">ID: {record.shared_with_id}</p>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                                <Phone className="w-4 h-4 text-gray-500" />
                                                <div>
                                                    <p className="text-sm text-gray-600">Số điện thoại</p>
                                                    <p className="font-semibold">{record.shared_with_phone}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                                <Mail className="w-4 h-4 text-gray-500" />
                                                <div>
                                                    <p className="text-sm text-gray-600">Email</p>
                                                    <p className="font-semibold">{record.shared_with_email}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                                <MapPin className="w-4 h-4 text-gray-500 mt-1" />
                                                <div>
                                                    <p className="text-sm text-gray-600">Địa chỉ</p>
                                                    <p className="font-semibold">{record.shared_with_address}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>

                        {/* Tab Quyền hạn */}
                        <TabsContent value="permissions" className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Shield className="w-5 h-5" />
                                        Chi tiết quyền hạn
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <h4 className="font-semibold text-gray-900 mb-4">Mức quyền hiện tại</h4>
                                            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                                                {getPermissionBadge(record.permission_level)}
                                                <p className="text-sm text-purple-700 mt-2">
                                                    {record.permission_level === "view_only" && "Chỉ có thể xem thông tin thiết bị"}
                                                    {record.permission_level === "view_control" && "Có thể xem và điều khiển thiết bị"}
                                                    {record.permission_level === "full_access" && "Có toàn quyền quản lý thiết bị"}
                                                </p>
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="font-semibold text-gray-900 mb-4">Quyền chi tiết</h4>
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                    <div className="flex items-center gap-2">
                                                        <Eye className="w-4 h-4 text-gray-500" />
                                                        <span>Xem thông tin</span>
                                                    </div>
                                                    {record.permission_details.can_view ? (
                                                        <CheckCircle className="w-5 h-5 text-green-500" />
                                                    ) : (
                                                        <XCircle className="w-5 h-5 text-red-500" />
                                                    )}
                                                </div>

                                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                    <div className="flex items-center gap-2">
                                                        <Settings className="w-4 h-4 text-gray-500" />
                                                        <span>Điều khiển thiết bị</span>
                                                    </div>
                                                    {record.permission_details.can_control ? (
                                                        <CheckCircle className="w-5 h-5 text-green-500" />
                                                    ) : (
                                                        <XCircle className="w-5 h-5 text-red-500" />
                                                    )}
                                                </div>

                                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                    <div className="flex items-center gap-2">
                                                        <Share2 className="w-4 h-4 text-gray-500" />
                                                        <span>Chia sẻ cho người khác</span>
                                                    </div>
                                                    {record.permission_details.can_share ? (
                                                        <CheckCircle className="w-5 h-5 text-green-500" />
                                                    ) : (
                                                        <XCircle className="w-5 h-5 text-red-500" />
                                                    )}
                                                </div>

                                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                    <div className="flex items-center gap-2">
                                                        <Trash2 className="w-4 h-4 text-gray-500" />
                                                        <span>Xóa thiết bị</span>
                                                    </div>
                                                    {record.permission_details.can_delete ? (
                                                        <CheckCircle className="w-5 h-5 text-green-500" />
                                                    ) : (
                                                        <XCircle className="w-5 h-5 text-red-500" />
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Tab Hoạt động */}
                        <TabsContent value="activity" className="space-y-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Clock className="w-5 h-5" />
                                            Thống kê truy cập
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="p-4 bg-blue-50 rounded-lg text-center">
                                                <p className="text-2xl font-bold text-blue-600">{record.access_count}</p>
                                                <p className="text-sm text-blue-700">Lần truy cập</p>
                                            </div>
                                            <div className="p-4 bg-green-50 rounded-lg text-center">
                                                <p className="text-2xl font-bold text-green-600">
                                                    {Math.floor((new Date() - new Date(record.shared_date)) / (1000 * 60 * 60 * 24))}
                                                </p>
                                                <p className="text-sm text-green-700">Ngày hoạt động</p>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="p-3 bg-gray-50 rounded-lg">
                                                <p className="text-sm text-gray-600">Lần truy cập cuối</p>
                                                <p className="font-semibold">{new Date(record.last_accessed).toLocaleString("vi-VN")}</p>
                                            </div>
                                            <div className="p-3 bg-gray-50 rounded-lg">
                                                <p className="text-sm text-gray-600">Tạo bởi</p>
                                                <p className="font-semibold">
                                                    {record.created_by_name} ({record.created_by})
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <History className="w-5 h-5" />
                                            Lịch sử hoạt động
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            <div className="flex items-start gap-3 p-3 border-l-4 border-blue-500 bg-blue-50 rounded-r-lg">
                                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                                                <div>
                                                    <p className="font-medium">Chia sẻ quyền được tạo</p>
                                                    <p className="text-sm text-gray-600">
                                                        {new Date(record.shared_date).toLocaleString("vi-VN")}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-3 p-3 border-l-4 border-green-500 bg-green-50 rounded-r-lg">
                                                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                                                <div>
                                                    <p className="font-medium">Lần truy cập đầu tiên</p>
                                                    <p className="text-sm text-gray-600">
                                                        {new Date(record.shared_date).toLocaleString("vi-VN")}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-3 p-3 border-l-4 border-purple-500 bg-purple-50 rounded-r-lg">
                                                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                                                <div>
                                                    <p className="font-medium">Truy cập gần nhất</p>
                                                    <p className="text-sm text-gray-600">
                                                        {new Date(record.last_accessed).toLocaleString("vi-VN")}
                                                    </p>
                                                </div>
                                            </div>

                                            {record.status === "expired" && (
                                                <div className="flex items-start gap-3 p-3 border-l-4 border-red-500 bg-red-50 rounded-r-lg">
                                                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                                                    <div>
                                                        <p className="font-medium">Quyền hết hạn</p>
                                                        <p className="text-sm text-gray-600">
                                                            {record.expires_date && new Date(record.expires_date).toLocaleString("vi-VN")}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Footer Actions */}
                <div className="border-t pt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        Cập nhật lần cuối: {new Date(record.last_accessed).toLocaleString("vi-VN")}
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={onClose}>
                            Đóng
                        </Button>
                        <Button variant="outline">
                            <Edit className="w-4 h-4 mr-2" />
                            Chỉnh sửa
                        </Button>
                        <Button>
                            <Download className="w-4 h-4 mr-2" />
                            Xuất báo cáo
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )

    return (
        <div className="min-h-screen  p-6">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Tra cứu chia sẻ quyền thiết bị</h1>
                        <p className="text-gray-600 mt-1 text-lg">Quản lý và tra cứu danh sách chia sẻ quyền của khách hàng - CSKH</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline">
                            <Download className="w-4 h-4 mr-2" />
                            Xuất Excel
                        </Button>
                    </div>
                </div>

                {/* Search and Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Filter className="w-5 h-5" />
                            Bộ lọc tìm kiếm
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                            <div>
                                <Label htmlFor="searchType" className="pb-3">Loại tìm kiếm</Label>
                                <Select value={searchType} onValueChange={setSearchType}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="customer">Theo khách hàng</SelectItem>
                                        <SelectItem value="device">Theo thiết bị</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="lg:col-span-2">
                                <Label htmlFor="search" className="pb-3">
                                    {searchType === "customer" ? "Tìm kiếm khách hàng" : "Tìm kiếm thiết bị"}
                                </Label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="search"
                                        placeholder={
                                            searchType === "customer" ? "Tên, SĐT, email khách hàng..." : "Tên thiết bị, serial, ID..."
                                        }
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="status" className="pb-3">Trạng thái</Label>
                                <Select value={statusFilter} onValueChange={setStatusFilter}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Chọn trạng thái" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white">
                                        <SelectItem value="all">Tất cả</SelectItem>
                                        <SelectItem value="active">Hoạt động</SelectItem>
                                        <SelectItem value="expired">Hết hạn</SelectItem>
                                        <SelectItem value="suspended">Tạm dừng</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label htmlFor="permission" className="pb-3">Mức quyền</Label>
                                <Select value={permissionFilter} onValueChange={setPermissionFilter}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Chọn quyền" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white">
                                        <SelectItem value="all">Tất cả</SelectItem>
                                        <SelectItem value="view_only">Chỉ xem</SelectItem>
                                        <SelectItem value="view_control">Xem & Điều khiển</SelectItem>
                                        <SelectItem value="full_access">Toàn quyền</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <Share2 className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Tổng chia sẻ</p>
                                    <p className="text-2xl font-bold text-blue-600">{sharingRecords.length}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Đang hoạt động</p>
                                    <p className="text-2xl font-bold text-green-600">
                                        {sharingRecords.filter((r) => r.status === "active").length}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-red-100 rounded-lg">
                                    <XCircle className="w-5 h-5 text-red-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Hết hạn</p>
                                    <p className="text-2xl font-bold text-red-600">
                                        {sharingRecords.filter((r) => r.status === "expired").length}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-yellow-100 rounded-lg">
                                    <AlertCircle className="w-5 h-5 text-yellow-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Tạm dừng</p>
                                    <p className="text-2xl font-bold text-yellow-600">
                                        {sharingRecords.filter((r) => r.status === "suspended").length}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Results Summary */}
                <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">
                        Tìm thấy <span className="font-semibold">{filteredRecords.length}</span> kết quả / {sharingRecords.length}{" "}
                        tổng chia sẻ
                    </p>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        Cập nhật lần cuối: {new Date().toLocaleString("vi-VN")}
                    </div>
                </div>

                {/* Sharing Records Table */}
                <Card>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Mã chia sẻ</TableHead>
                                        <TableHead>Chủ sở hữu</TableHead>
                                        <TableHead>Thiết bị</TableHead>
                                        <TableHead>Người được chia sẻ</TableHead>
                                        <TableHead>Mức quyền</TableHead>
                                        <TableHead>Ngày chia sẻ</TableHead>
                                        <TableHead>Trạng thái</TableHead>
                                        <TableHead>Thao tác</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredRecords.map((record) => (
                                        <TableRow key={record.sharing_id}>
                                            <TableCell className="font-medium">
                                                <code className="text-xs bg-blue-100 px-2 py-1 rounded">{record.sharing_id}</code>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Avatar className="w-8 h-8">
                                                        <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
                                                            {record.owner_name.charAt(0)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="font-medium">{record.owner_name}</p>
                                                        <p className="text-xs text-gray-500">{record.owner_phone}</p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    {getDeviceIcon(record.device_type)}
                                                    <div>
                                                        <p className="font-medium">{record.device_name}</p>
                                                        <p className="text-xs text-gray-500">{record.device_serial}</p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Avatar className="w-8 h-8">
                                                        <AvatarFallback className="bg-green-100 text-green-600 text-xs">
                                                            {record.shared_with_name.charAt(0)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="font-medium">{record.shared_with_name}</p>
                                                        <p className="text-xs text-gray-500">{record.shared_with_phone}</p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>{getPermissionBadge(record.permission_level)}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-4 h-4 text-gray-400" />
                                                    <span className="text-sm">{new Date(record.shared_date).toLocaleDateString("vi-VN")}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>{getStatusBadge(record.status)}</TableCell>
                                            <TableCell>
                                                <div className="flex gap-1">
                                                    <Button variant="outline" size="sm" onClick={() => openDetailDialog(record)}>
                                                        <Eye className="w-4 h-4 mr-1" />
                                                        Chi tiết
                                                    </Button>
                                                    <Button variant="outline" size="sm">
                                                        <Edit className="w-3 h-3 mr-1" />
                                                        Sửa
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {selectedRecord && (
                <DetailDialog record={selectedRecord} isOpen={isDetailDialogOpen} onClose={closeDetailDialog} />
            )}
        </div>
    )
}
