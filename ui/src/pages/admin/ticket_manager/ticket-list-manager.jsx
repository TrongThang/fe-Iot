"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    AlertCircle,
    CheckCircle,
    Clock,
    Eye,
    MoreHorizontal,
    Search,
    Filter,
    Plus,
    Download,
    RefreshCw,
} from "lucide-react"
import TicketDetailDialogAdmin from "./ticket-details-manager"

// Mock data based on the database schema
const mockTickets = [
    {
        ticket_id: 1,
        user_id: 101,
        device_serial: "DEV001234",
        ticket_type_id: 1,
        type_name: "Hardware Issue",
        description: "Máy tính không khởi động được",
        status: "open",
        priority: 1,
        created_at: "2024-01-15T09:30:00",
        updated_at: "2024-01-15T09:30:00",
        assigned_to: 201,
        assigned_name: "Nguyễn Văn A",
        resolved_at: null,
        user_name: "Trần Thị B",
    },
    {
        ticket_id: 2,
        user_id: 102,
        device_serial: "DEV005678",
        ticket_type_id: 2,
        type_name: "Software Issue",
        description: "Phần mềm Office không hoạt động",
        status: "in_progress",
        priority: 2,
        created_at: "2024-01-14T14:20:00",
        updated_at: "2024-01-15T10:15:00",
        assigned_to: 202,
        assigned_name: "Lê Văn C",
        resolved_at: null,
        user_name: "Phạm Văn D",
    },
    {
        ticket_id: 3,
        user_id: 103,
        device_serial: "DEV009012",
        ticket_type_id: 1,
        type_name: "Hardware Issue",
        description: "Màn hình bị nhấp nháy",
        status: "resolved",
        priority: 3,
        created_at: "2024-01-13T11:45:00",
        updated_at: "2024-01-14T16:30:00",
        assigned_to: 201,
        assigned_name: "Nguyễn Văn A",
        resolved_at: "2024-01-14T16:30:00",
        user_name: "Hoàng Thị E",
    },
    {
        ticket_id: 4,
        user_id: 104,
        device_serial: "DEV003456",
        ticket_type_id: 3,
        type_name: "Network Issue",
        description: "Không thể kết nối internet",
        status: "open",
        priority: 1,
        created_at: "2024-01-15T08:15:00",
        updated_at: "2024-01-15T08:15:00",
        assigned_to: null,
        assigned_name: null,
        resolved_at: null,
        user_name: "Vũ Văn F",
    },
    {
        ticket_id: 5,
        user_id: 105,
        device_serial: "DEV007890",
        ticket_type_id: 2,
        type_name: "Software Issue",
        description: "Lỗi cập nhật hệ điều hành",
        status: "closed",
        priority: 2,
        created_at: "2024-01-12T13:20:00",
        updated_at: "2024-01-13T09:45:00",
        assigned_to: 202,
        assigned_name: "Lê Văn C",
        resolved_at: "2024-01-13T09:45:00",
        user_name: "Đỗ Thị G",
    },
]

const statusConfig = {
    open: {
        label: "Mở",
        className: "bg-red-100 text-red-800 border-red-200",
        icon: AlertCircle,
    },
    in_progress: {
        label: "Đang xử lý",
        className: "bg-yellow-100 text-yellow-800 border-yellow-200",
        icon: Clock,
    },
    resolved: {
        label: "Đã giải quyết",
        className: "bg-green-100 text-green-800 border-green-200",
        icon: CheckCircle,
    },
    closed: {
        label: "Đã đóng",
        className: "bg-gray-100 text-gray-800 border-gray-200",
        icon: CheckCircle,
    },
};

const priorityConfig = {
    1: {
        label: "Cao",
        className: "bg-red-200 text-red-900 border-red-300",
    },
    2: {
        label: "Trung bình",
        className: "bg-orange-200 text-orange-900 border-orange-300",
    },
    3: {
        label: "Thấp",
        className: "bg-blue-200 text-blue-900 border-blue-300",
    },
};

export default function AdminTicketsDashboard() {
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [priorityFilter, setPriorityFilter] = useState("all")
    const [typeFilter, setTypeFilter] = useState("all")
    const [selectedTicket, setSelectedTicket] = useState(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    const filteredTickets = mockTickets.filter((ticket) => {
        const matchesSearch =
            ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ticket.device_serial.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ticket.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ticket.ticket_id.toString().includes(searchTerm)

        const matchesStatus = statusFilter === "all" || ticket.status === statusFilter
        const matchesPriority = priorityFilter === "all" || ticket.priority.toString() === priorityFilter
        const matchesType = typeFilter === "all" || ticket.ticket_type_id.toString() === typeFilter

        return matchesSearch && matchesStatus && matchesPriority && matchesType
    })

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString("vi-VN")
    }

    const getStatusBadge = (status) => {
        const config = statusConfig[status];
        const Icon = config.icon;
        return (
            <Badge className={`flex items-center gap-1 ${config.className}`}>
                <Icon className="w-3 h-3" />
                {config.label}
            </Badge>
        );
    };

    const getPriorityBadge = (priority) => {
        const config = priorityConfig[priority];
        return <Badge className={config.className}>{config.label}</Badge>;
    };

    const handleViewTicket = (ticketId) => {
        const ticket = mockTickets.find((t) => t.ticket_id === ticketId)
        if (ticket) {
            setSelectedTicket(ticket)
            setIsDialogOpen(true)
        }
    }

    return (
        <div className="container mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Quản lý yêu cầu hỗ trợ</h1>
                    <p className="text-muted-foreground text-lg">Danh sách tất cả các yêu cầu hỗ trợ từ người dùng</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Làm mới
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tổng yêu cầu</CardTitle>
                        <AlertCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{mockTickets.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Đang mở</CardTitle>
                        <AlertCircle className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-500">
                            {mockTickets.filter((t) => t.status === "open").length}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Đang xử lý</CardTitle>
                        <Clock className="h-4 w-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-500">
                            {mockTickets.filter((t) => t.status === "in_progress").length}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Đã giải quyết</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-500">
                            {mockTickets.filter((t) => t.status === "resolved" || t.status === "closed").length}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Filter className="w-5 h-5" />
                        Bộ lọc và tìm kiếm
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="search">Tìm kiếm</Label>
                            <div className="relative">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="search"
                                    placeholder="ID, mô tả, thiết bị..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-8"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Trạng thái</Label>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-full">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-white">
                                    <SelectItem value="all">Tất cả</SelectItem>
                                    <SelectItem value="open">Mở</SelectItem>
                                    <SelectItem value="in_progress">Đang xử lý</SelectItem>
                                    <SelectItem value="resolved">Đã giải quyết</SelectItem>
                                    <SelectItem value="closed">Đã đóng</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Độ ưu tiên</Label>
                            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                                <SelectTrigger className="w-full">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-white">
                                    <SelectItem value="all">Tất cả</SelectItem>
                                    <SelectItem value="1">Cao</SelectItem>
                                    <SelectItem value="2">Trung bình</SelectItem>
                                    <SelectItem value="3">Thấp</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Tickets Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Danh sách yêu cầu ({filteredTickets.length})</CardTitle>
                    <CardDescription>Quản lý và theo dõi tất cả các yêu cầu hỗ trợ</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[80px]">ID</TableHead>
                                    <TableHead>Người dùng</TableHead>
                                    <TableHead>Thiết bị</TableHead>
                                    <TableHead>Mô tả</TableHead>
                                    <TableHead>Trạng thái</TableHead>
                                    <TableHead>Độ ưu tiên</TableHead>
                                    <TableHead>Người xử lý</TableHead>
                                    <TableHead>Ngày tạo</TableHead>
                                    <TableHead>Thao tác</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredTickets.map((ticket) => (
                                    <TableRow key={ticket.ticket_id}>
                                        <TableCell className="font-medium">#{ticket.ticket_id}</TableCell>
                                        <TableCell>{ticket.user_name}</TableCell>
                                        <TableCell>
                                            <code className="text-xs bg-muted px-1 py-0.5 rounded">{ticket.device_serial}</code>
                                        </TableCell>
                                        <TableCell className="max-w-[200px] truncate" title={ticket.description}>
                                            {ticket.description}
                                        </TableCell>
                                        <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                                        <TableCell>{getPriorityBadge(ticket.priority)}</TableCell>
                                        <TableCell>
                                            {ticket.assigned_name ? (
                                                <span className="text-sm">{ticket.assigned_name}</span>
                                            ) : (
                                                <span className="text-sm text-muted-foreground">Chưa phân công</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-sm">{formatDate(ticket.created_at)}</TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="bg-white">
                                                    <DropdownMenuItem onClick={() => handleViewTicket(ticket.ticket_id)}>
                                                        Xem chi tiết
                                                    </DropdownMenuItem>
                                                    {/* <DropdownMenuSeparator />` */}
                                                    {/* <DropdownMenuItem>Phân công</DropdownMenuItem>
                                                    <DropdownMenuItem>Cập nhật trạng thái</DropdownMenuItem>
                                                    <DropdownMenuItem>Thêm ghi chú</DropdownMenuItem> */}
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
            {/* Ticket Detail Dialog */}
            {selectedTicket && (
                <TicketDetailDialogAdmin
                    open={isDialogOpen}
                    onOpenChange={(open) => {
                        setIsDialogOpen(open)
                        if (!open) setSelectedTicket(null)
                    }}
                    ticket={selectedTicket} // Đổi tên prop từ ticketId thành ticket
                />
            )}
        </div>
    )
}