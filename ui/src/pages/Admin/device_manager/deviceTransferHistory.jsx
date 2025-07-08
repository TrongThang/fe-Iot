"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Search,
    Download,
    Filter,
    Eye,
    Calendar,
    Smartphone,
    User,
    ArrowRight,
    FileText,
    Clock,
    CheckCircle,
    XCircle,
    Phone,
    Mail,
    MapPin,
    Hash,
    Settings,
} from "lucide-react"

export default function DeviceTransferHistory() {
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [transferTypeFilter, setTransferTypeFilter] = useState("all")
    const [dateFrom, setDateFrom] = useState("")
    const [dateTo, setDateTo] = useState("")
    const [staffFilter, setStaffFilter] = useState("all")
    const [selectedRecord, setSelectedRecord] = useState(null)

    // Mock data với thông tin chi tiết
    const transferRecords = [
        {
            transfer_id: "TN2024001",
            device_id: "SH001",
            device_name: "Philips Hue White Ambiance",
            device_serial: "SH001234567890",
            device_type: "SmartLight",
            template_id: "SH1",
            previous_owner_id: 1001,
            previous_owner_name: "Nguyễn Văn Anh",
            previous_owner_phone: "0901234567",
            previous_owner_email: "nguyenvananh@email.com",
            previous_owner_address: "123 Đường ABC, Quận 1, TP.HCM",
            previous_account_id: 2001,
            new_owner_id: 1002,
            new_owner_name: "Trần Thị Bình",
            new_owner_phone: "0987654321",
            new_owner_email: "tranthibinh@email.com",
            new_owner_address: "456 Đường XYZ, Quận 3, TP.HCM",
            new_account_id: 2002,
            transfer_date: "2024-01-15",
            transfer_type: "sale",
            status: "completed",
            reason: "Bán lại thiết bị do nâng cấp hệ thống",
            notes: "Đèn đã được reset và kiểm tra hoạt động tốt",
            staff_id: "NV001",
            staff_name: "Lê Văn Cường",
            approved_by: "QL001 - Phạm Thị Dung",
            approved_at: "2024-01-15T10:30:00",
            completed_at: "2024-01-15T14:45:00",
            device_condition: "Tốt",
            warranty_status: "Còn bảo hành 8 tháng",
            firmware_version: "Zigbee 3.0",
            last_sync: "2024-01-15T14:30:00",
            documents: ["hop_dong_chuyen_nhuong.pdf", "giay_to_tuy_than.pdf", "bao_hanh.pdf"],
            created_at: "2024-01-14T09:00:00",
            updated_at: "2024-01-15T14:45:00",
        },
        {
            transfer_id: "TN2024002",
            device_id: "SH002",
            device_name: "Google Nest Audio",
            device_serial: "SH001234567891",
            device_type: "SmartSpeaker",
            template_id: "SH2",
            previous_owner_id: 1003,
            previous_owner_name: "Phạm Văn Đức",
            previous_owner_phone: "0912345678",
            previous_owner_email: "phamvanduc@email.com",
            previous_owner_address: "789 Đường DEF, Quận 7, TP.HCM",
            previous_account_id: 2003,
            new_owner_id: 1004,
            new_owner_name: "Hoàng Thị Ế",
            new_owner_phone: "0976543210",
            new_owner_email: "hoangthie@email.com",
            new_owner_address: "321 Đường GHI, Quận 2, TP.HCM",
            new_account_id: 2004,
            transfer_date: "2024-01-14",
            transfer_type: "gift",
            status: "pending",
            reason: "Tặng quà sinh nhật",
            notes: "Đang chờ xác nhận từ người nhận",
            staff_id: "NV002",
            staff_name: "Nguyễn Thị Phương",
            approved_by: null,
            approved_at: null,
            completed_at: null,
            device_condition: "Rất tốt",
            warranty_status: "Còn bảo hành 14 tháng",
            firmware_version: "Google Home 1.56",
            last_sync: "2024-01-14T16:20:00",
            documents: ["giay_to_tang_qua.pdf", "cmnd_nguoi_tang.pdf"],
            created_at: "2024-01-14T08:30:00",
            updated_at: "2024-01-14T16:20:00",
        },
        {
            transfer_id: "TN2024003",
            device_id: "SH003",
            device_name: "Arlo Pro 4 Camera",
            device_serial: "SH001234567892",
            device_type: "SmartCamera",
            template_id: "SH3",
            previous_owner_id: 1005,
            previous_owner_name: "Vũ Văn Giang",
            previous_owner_phone: "0923456789",
            previous_owner_email: "vuvangiang@email.com",
            previous_owner_address: "654 Đường JKL, Quận 5, TP.HCM",
            previous_account_id: 2005,
            new_owner_id: 1006,
            new_owner_name: "Đặng Thị Hoa",
            new_owner_phone: "0965432109",
            new_owner_email: "dangthihoa@email.com",
            new_owner_address: "987 Đường MNO, Quận 6, TP.HCM",
            new_account_id: 2006,
            transfer_date: "2024-01-13",
            transfer_type: "company_transfer",
            status: "approved",
            reason: "Chuyển thiết bị công ty cho nhân viên mới",
            notes: "Camera được cấp cho bộ phận an ninh",
            staff_id: "NV003",
            staff_name: "Trần Văn Long",
            approved_by: "QL002 - Lê Thị Mai",
            approved_at: "2024-01-13T11:15:00",
            completed_at: null,
            device_condition: "Tốt",
            warranty_status: "Còn bảo hành 6 tháng",
            firmware_version: "Arlo 1.090.0",
            last_sync: "2024-01-13T15:45:00",
            documents: ["quyet_dinh_cap_phat.pdf", "bien_ban_ban_giao.pdf"],
            created_at: "2024-01-12T14:00:00",
            updated_at: "2024-01-13T15:45:00",
        },
        {
            transfer_id: "TN2024004",
            device_id: "SH004",
            device_name: "TP-Link Kasa Smart Plug",
            device_serial: "SH001234567893",
            device_type: "SmartPlug",
            template_id: "SH4",
            previous_owner_id: 1007,
            previous_owner_name: "Bùi Văn Inh",
            previous_owner_phone: "0934567890",
            previous_owner_email: "buivaninh@email.com",
            previous_owner_address: "147 Đường PQR, Quận 4, TP.HCM",
            previous_account_id: 2007,
            new_owner_id: 1008,
            new_owner_name: "Lý Thị Kim",
            new_owner_phone: "0954321098",
            new_owner_email: "lythikim@email.com",
            new_owner_address: "258 Đường STU, Quận 8, TP.HCM",
            new_account_id: 2008,
            transfer_date: "2024-01-12",
            transfer_type: "warranty_replacement",
            status: "rejected",
            reason: "Thay thế bảo hành do lỗi kết nối",
            notes: "Từ chối do không đủ điều kiện bảo hành",
            staff_id: "NV004",
            staff_name: "Hoàng Văn Nam",
            approved_by: "QL001 - Phạm Thị Dung",
            approved_at: "2024-01-12T16:00:00",
            completed_at: null,
            device_condition: "Có lỗi",
            warranty_status: "Hết bảo hành",
            firmware_version: "Kasa 1.2.3",
            last_sync: "2024-01-12T10:30:00",
            documents: ["don_bao_hanh.pdf", "bien_ban_kiem_tra.pdf"],
            created_at: "2024-01-11T09:30:00",
            updated_at: "2024-01-12T16:00:00",
        },
    ];

    const getStatusBadge = (status) => {
        switch (status) {
            case "completed":
                return (
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Hoàn thành
                    </Badge>
                )
            case "approved":
                return (
                    <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Đã duyệt
                    </Badge>
                )
            case "pending":
                return (
                    <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                        <Clock className="w-3 h-3 mr-1" />
                        Chờ duyệt
                    </Badge>
                )
            case "rejected":
                return (
                    <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
                        <XCircle className="w-3 h-3 mr-1" />
                        Từ chối
                    </Badge>
                )
            case "cancelled":
                return (
                    <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
                        <XCircle className="w-3 h-3 mr-1" />
                        Đã hủy
                    </Badge>
                )
            default:
                return <Badge variant="secondary">{status}</Badge>
        }
    }

    const getTransferTypeBadge = (type) => {
        const types = {
            sale: { label: "Bán", color: "bg-purple-100 text-purple-800" },
            gift: { label: "Tặng", color: "bg-pink-100 text-pink-800" },
            inheritance: { label: "Thừa kế", color: "bg-orange-100 text-orange-800" },
            company_transfer: { label: "Chuyển công ty", color: "bg-indigo-100 text-indigo-800" },
            warranty_replacement: { label: "Thay thế BH", color: "bg-cyan-100 text-cyan-800" },
        }
        const typeInfo = types[type] || { label: type, color: "bg-gray-100 text-gray-800" }
        return <Badge className={`${typeInfo.color} hover:${typeInfo.color}`}>{typeInfo.label}</Badge>
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

    const filteredRecords = transferRecords.filter((record) => {
        const matchesSearch =
            record.device_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            record.device_serial.toLowerCase().includes(searchTerm.toLowerCase()) ||
            record.transfer_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            record.previous_owner_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            record.new_owner_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            record.previous_owner_phone.includes(searchTerm) ||
            record.new_owner_phone.includes(searchTerm)

        const matchesStatus = statusFilter === "all" || record.status === statusFilter
        const matchesType = transferTypeFilter === "all" || record.transfer_type === transferTypeFilter
        const matchesStaff = staffFilter === "all" || record.staff_id === staffFilter

        const matchesDate =
            (!dateFrom || new Date(record.transfer_date) >= new Date(dateFrom)) &&
            (!dateTo || new Date(record.transfer_date) <= new Date(dateTo))

        return matchesSearch && matchesStatus && matchesType && matchesStaff && matchesDate
    })

    const DetailModal = ({ record }) => (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" onClick={() => setSelectedRecord(record)}>
                    <Eye className="w-4 h-4 mr-1" />
                    Chi tiết
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        Chi tiết giao dịch chuyển nhượng - {record.transfer_id}
                    </DialogTitle>
                </DialogHeader>

                <Tabs defaultValue="general" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="general">Thông tin chung</TabsTrigger>
                        <TabsTrigger value="owners">Chủ sở hữu</TabsTrigger>
                        <TabsTrigger value="device">Thiết bị</TabsTrigger>
                        <TabsTrigger value="process">Quy trình</TabsTrigger>
                    </TabsList>

                    <TabsContent value="general" className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Thông tin giao dịch</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="font-medium">Mã giao dịch:</span>
                                        <span>{record.transfer_id}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="font-medium">Ngày chuyển:</span>
                                        <span>{new Date(record.transfer_date).toLocaleDateString("vi-VN")}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="font-medium">Loại giao dịch:</span>
                                        {getTransferTypeBadge(record.transfer_type)}
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="font-medium">Trạng thái:</span>
                                        {getStatusBadge(record.status)}
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="font-medium">Lý do:</span>
                                        <span className="text-right max-w-xs">{record.reason}</span>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Xử lý bởi</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="font-medium">Nhân viên:</span>
                                        <span>
                                            {record.staff_name} ({record.staff_id})
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="font-medium">Người duyệt:</span>
                                        <span>{record.approved_by || "Chưa duyệt"}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="font-medium">Thời gian duyệt:</span>
                                        <span>
                                            {record.approved_at ? new Date(record.approved_at).toLocaleString("vi-VN") : "Chưa duyệt"}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="font-medium">Hoàn thành:</span>
                                        <span>
                                            {record.completed_at ? new Date(record.completed_at).toLocaleString("vi-VN") : "Chưa hoàn thành"}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Ghi chú</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-700">{record.notes}</p>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="owners" className="space-y-4">
                        <div className="grid grid-cols-2 gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <User className="w-5 h-5" />
                                        Chủ sở hữu cũ
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <User className="w-4 h-4 text-gray-400" />
                                        <span className="font-medium">{record.previous_owner_name}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Phone className="w-4 h-4 text-gray-400" />
                                        <span>{record.previous_owner_phone}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Mail className="w-4 h-4 text-gray-400" />
                                        <span>{record.previous_owner_email}</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                                        <span className="text-sm">{record.previous_owner_address}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Hash className="w-4 h-4 text-gray-400" />
                                        <span>Account ID: {record.previous_account_id}</span>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <ArrowRight className="w-5 h-5 text-blue-500" />
                                        Chủ sở hữu mới
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <User className="w-4 h-4 text-gray-400" />
                                        <span className="font-medium">{record.new_owner_name}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Phone className="w-4 h-4 text-gray-400" />
                                        <span>{record.new_owner_phone}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Mail className="w-4 h-4 text-gray-400" />
                                        <span>{record.new_owner_email}</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                                        <span className="text-sm">{record.new_owner_address}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Hash className="w-4 h-4 text-gray-400" />
                                        <span>Account ID: {record.new_account_id}</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="device" className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        {getDeviceIcon(record.device_type)}
                                        Thông tin thiết bị
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="font-medium">Tên thiết bị:</span>
                                        <span>{record.device_name}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="font-medium">Serial Number:</span>
                                        <code className="text-xs bg-gray-100 px-2 py-1 rounded">{record.device_serial}</code>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="font-medium">Device ID:</span>
                                        <span>{record.device_id}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="font-medium">Template ID:</span>
                                        <span>{record.template_id}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="font-medium">Loại thiết bị:</span>
                                        <span>{record.device_type}</span>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Tình trạng thiết bị</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="font-medium">Tình trạng:</span>
                                        <span>{record.device_condition}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="font-medium">Bảo hành:</span>
                                        <span>{record.warranty_status}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="font-medium">Firmware:</span>
                                        <span>{record.firmware_version}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="font-medium">Đồng bộ cuối:</span>
                                        <span>{new Date(record.last_sync).toLocaleString("vi-VN")}</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Tài liệu đính kèm</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    {record.documents.map((doc, index) => (
                                        <Badge key={index} variant="outline" className="cursor-pointer hover:bg-gray-100">
                                            <FileText className="w-3 h-3 mr-1" />
                                            {doc}
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="process" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Timeline xử lý</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                            <FileText className="w-4 h-4 text-white" />
                                        </div>
                                        <div>
                                            <p className="font-medium">Tạo yêu cầu chuyển nhượng</p>
                                            <p className="text-sm text-gray-600">
                                                {new Date(record.created_at).toLocaleString("vi-VN")} - {record.staff_name}
                                            </p>
                                        </div>
                                    </div>

                                    {record.approved_at && (
                                        <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                                            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                                <CheckCircle className="w-4 h-4 text-white" />
                                            </div>
                                            <div>
                                                <p className="font-medium">Phê duyệt yêu cầu</p>
                                                <p className="text-sm text-gray-600">
                                                    {new Date(record.approved_at).toLocaleString("vi-VN")} - {record.approved_by}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {record.completed_at && (
                                        <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                                            <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                                                <CheckCircle className="w-4 h-4 text-white" />
                                            </div>
                                            <div>
                                                <p className="font-medium">Hoàn thành chuyển nhượng</p>
                                                <p className="text-sm text-gray-600">{new Date(record.completed_at).toLocaleString("vi-VN")}</p>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                        <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center">
                                            <Clock className="w-4 h-4 text-white" />
                                        </div>
                                        <div>
                                            <p className="font-medium">Cập nhật cuối</p>
                                            <p className="text-sm text-gray-600">{new Date(record.updated_at).toLocaleString("vi-VN")}</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    )

    return (
        <div className="min-h-screen p-6">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Lịch sử chuyển nhượng thiết bị</h1>
                        <p className="text-gray-600 mt-1 text-lg">Tra cứu và quản lý lịch sử chuyển nhượng thiết bị - CSKH</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline">
                            <Download className="w-4 h-4 mr-2" />
                            Xuất báo cáo Excel
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
                            <div className="lg:col-span-2">
                                <Label htmlFor="search" className="mb-3">Tìm kiếm tổng hợp</Label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="search"
                                        placeholder="Mã GD, tên thiết bị, serial, tên chủ sở hữu, SĐT..."
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
                                        <SelectItem value="pending">Chờ duyệt</SelectItem>
                                        <SelectItem value="approved">Đã duyệt</SelectItem>
                                        <SelectItem value="completed">Hoàn thành</SelectItem>
                                        <SelectItem value="rejected">Từ chối</SelectItem>
                                        <SelectItem value="cancelled">Đã hủy</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Statistics Dashboard */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <FileText className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Tổng giao dịch</p>
                                    <p className="text-2xl font-bold text-blue-600">{transferRecords.length}</p>
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
                                    <p className="text-sm text-gray-600">Hoàn thành</p>
                                    <p className="text-2xl font-bold text-green-600">
                                        {transferRecords.filter((r) => r.status === "completed").length}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-yellow-100 rounded-lg">
                                    <Clock className="w-5 h-5 text-yellow-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Chờ duyệt</p>
                                    <p className="text-2xl font-bold text-yellow-600">
                                        {transferRecords.filter((r) => r.status === "pending").length}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-100 rounded-lg">
                                    <ArrowRight className="w-5 h-5 text-purple-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Đã duyệt</p>
                                    <p className="text-2xl font-bold text-purple-600">
                                        {transferRecords.filter((r) => r.status === "approved").length}
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
                                    <p className="text-sm text-gray-600">Từ chối</p>
                                    <p className="text-2xl font-bold text-red-600">
                                        {transferRecords.filter((r) => r.status === "rejected").length}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Results Summary */}
                <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">
                        Tìm thấy <span className="font-semibold">{filteredRecords.length}</span> kết quả / {transferRecords.length}{" "}
                        tổng giao dịch
                    </p>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        Cập nhật lần cuối: {new Date().toLocaleString("vi-VN")}
                    </div>
                </div>

                {/* Transfer History Table */}
                <Card>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Mã GD</TableHead>
                                        <TableHead>Thiết bị</TableHead>
                                        <TableHead>Chủ cũ</TableHead>
                                        <TableHead>Chủ mới</TableHead>
                                        <TableHead>Loại GD</TableHead>
                                        <TableHead>Ngày chuyển</TableHead>
                                        <TableHead>Trạng thái</TableHead>
                                        <TableHead>NV xử lý</TableHead>
                                        <TableHead>Thao tác</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredRecords.map((record) => (
                                        <TableRow key={record.transfer_id}>
                                            <TableCell className="font-medium">
                                                <code className="text-xs bg-blue-100 px-2 py-1 rounded">{record.transfer_id}</code>
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
                                                    <User className="w-4 h-4 text-gray-400" />
                                                    <div>
                                                        <p className="font-medium">{record.previous_owner_name}</p>
                                                        <p className="text-xs text-gray-500">{record.previous_owner_phone}</p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <ArrowRight className="w-4 h-4 text-blue-500" />
                                                    <div>
                                                        <p className="font-medium">{record.new_owner_name}</p>
                                                        <p className="text-xs text-gray-500">{record.new_owner_phone}</p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>{getTransferTypeBadge(record.transfer_type)}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-4 h-4 text-gray-400" />
                                                    <span className="text-sm">{new Date(record.transfer_date).toLocaleDateString("vi-VN")}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>{getStatusBadge(record.status)}</TableCell>
                                            <TableCell>
                                                <div>
                                                    <p className="font-medium text-sm">{record.staff_name}</p>
                                                    <p className="text-xs text-gray-500">{record.staff_id}</p>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex gap-1">
                                                    <DetailModal record={record} />
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
        </div>
    )
}
