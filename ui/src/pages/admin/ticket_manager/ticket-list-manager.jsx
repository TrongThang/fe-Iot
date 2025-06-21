"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
    AlertCircle,
    CheckCircle,
    Clock,
    MoreHorizontal,
    Search,
    List,
    Filter,
    RefreshCw,
} from "lucide-react"
import TicketDetailDialogAdmin from "./ticket-details-manager"
import axiosPublic from "@/apis/clients/public.client"
import { toast } from "sonner"

const statusConfig = {
    rejected: {
        label: "Từ chối",
        className: "bg-red-100 text-red-800 border-red-200",
        icon: AlertCircle,
    },
    pending: {
        label: "Chờ xử lý",
        className: "bg-yellow-100 text-yellow-800 border-yellow-200",
        icon: Clock,
    },
    in_progress: {
        label: "Đang xử lý",
        className: "bg-yellow-400 text-yellow-1000 border-yellow-400",
        icon: Clock,
    },
    resolved: {
        label: "Chấp nhận",
        className: "bg-green-100 text-green-800 border-green-200",
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
    const [loading, setLoading] = useState(false)
    const [tickets, setTickets] = useState([])

    const fetchTicket = async () => {
        setLoading(true)
        try {
            const response = await axiosPublic.get("/tickets")
            if (response?.status_code === 200) {
                setTickets(response?.data?.data)
            } else {
                toast.error("Lỗi", { description: "Không thể tải danh sách ticket" })
            }
        } catch (error) {
            console.error("Error fetching tickets:", error)
            toast.error("Lỗi khi tải danh sách ticket", { description: error.message })
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchTicket();
    }, [])

    const handleRefresh = async () => {
        await fetchTicket()
    }

    const filteredTickets = tickets?.filter((ticket) => {
        const matchesSearch =
            ticket?.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ticket?.device_serial?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ticket?.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ticket?.ticket_id?.toString().includes(searchTerm)

        const matchesStatus = statusFilter === "all" || ticket?.status === statusFilter
        const matchesPriority = priorityFilter === "all" || ticket?.priority.toString() === priorityFilter
        const matchesType = typeFilter === "all" || ticket?.ticket_type_id.toString() === typeFilter

        return matchesSearch && matchesStatus && matchesPriority && matchesType
    })

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString("vi-VN")
    }

    const getStatusBadge = (status) => {
        const config = statusConfig[status];
        const Icon = config?.icon;
    
        if (!config) return "N/A";
    
        return (
            <Badge className={`flex items-center gap-1 ${config.className}`}>
                <Icon className="w-3 h-3" />
                {config.label}
            </Badge>
        );
    }

    const getPriorityBadge = (priority) => {
        const config = priorityConfig[priority];

        if (!config) return "N/A";

        return <Badge className={config?.className}>{config?.label}</Badge>;
    };

    const handleViewTicket = (ticket) => {
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
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRefresh}
                        disabled={loading}
                    >
                        <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                        {loading ? "Làm mới..." : "Làm mới"}
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tổng yêu cầu</CardTitle>
                        <List className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{tickets?.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Từ chối</CardTitle>
                        <AlertCircle className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-500">
                            {tickets?.filter((t) => t.status === "rejected").length}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Chờ xử lý</CardTitle>
                        <Clock className="h-4 w-4 text-yellow-700" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-700">
                            {tickets?.filter((t) => t.status === "pending").length}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Đang xử lý</CardTitle>
                        <Clock className="h-4 w-4 text-yellow-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-400">
                            {tickets?.filter((t) => t.status === "in_progress").length}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Chấp nhận</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-500">
                            {tickets?.filter((t) => t.status === "resolved").length}
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
                                    {
                                        Object.entries(statusConfig).map(([key, value]) => (
                                            <SelectItem key={key} value={key}>
                                                {value.label}
                                            </SelectItem>
                                        ))
                                    }

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
                                    {
                                        Object.entries(priorityConfig).map(([key, value]) => (
                                            <SelectItem key={key} value={key}>
                                                {value.label}
                                            </SelectItem>
                                        ))
                                    }
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
                                    <TableHead>Trạng thái</TableHead>
                                    <TableHead>Độ ưu tiên</TableHead>
                                    <TableHead>Người xử lý</TableHead>
                                    <TableHead>Ngày tạo</TableHead>
                                    <TableHead>Thao tác</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredTickets.map((ticket) => (
                                    <TableRow key={ticket?.ticket_id}>
                                        <TableCell className="font-medium">#{ticket?.ticket_id}</TableCell>
                                        <TableCell>{ticket?.user_name}</TableCell>
                                        <TableCell>
                                            <code className="text-xs bg-muted px-1 py-0.5 rounded">{ticket?.device_serial}</code>
                                        </TableCell>
                                        <TableCell>{getStatusBadge(ticket?.status)}</TableCell>
                                        <TableCell>{getPriorityBadge(ticket?.priority)}</TableCell>
                                        <TableCell>
                                            {ticket?.assigned_name ? (
                                                <span className="text-sm">{ticket?.assigned_name}</span>
                                            ) : (
                                                <span className="text-sm text-muted-foreground">Chưa phân công</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-sm">{formatDate(ticket?.created_at)}</TableCell>
                                        <TableCell>
                                            <Button variant="ghost" className="h-8 w-8 p-0" onClick={() => handleViewTicket(ticket)}>
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
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
                    selectedTicket={selectedTicket}
                    fetchTicket={fetchTicket}
                />
            )}
        </div>
    )
}