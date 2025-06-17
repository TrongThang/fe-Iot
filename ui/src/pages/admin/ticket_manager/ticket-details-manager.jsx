"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
    AlertCircle,
    CheckCircle,
    Clock,
    User,
    Monitor,
    MessageSquare,
    Upload,
    Download,
    Edit,
    Save,
    X,
    Camera,
    Calendar,
    MapPin,
    Phone,
    Mail,
    Hash,
    Settings,
    FileText,
    UserCheck,
} from "lucide-react"

// Mock data
const mockTicket = {
    ticket_id: 1,
    user_id: 101,
    user_name: "Trần Thị B",
    user_email: "tran.b@company.com",
    user_phone: "0123456789",
    user_department: "Phòng Kế toán",
    device_serial: "DEV001234",
    device_info: {
        model: "Dell OptiPlex 7090",
        location: "Phòng IT - Tầng 3",
        purchase_date: "2023-05-15",
    },
    ticket_type_id: 1,
    type_name: "Hardware Issue",
    description:
        "Máy tính không khởi động được. Khi nhấn nút nguồn, đèn LED không sáng và không có tiếng quạt chạy. Đã thử cắm nguồn khác nhưng vẫn không hoạt động. Vấn đề xảy ra từ sáng nay khi đến công ty. Tôi đã thử nhiều cách khác nhau như rút dây nguồn, đợi 30 giây rồi cắm lại, kiểm tra các kết nối nhưng đều không có kết quả. Máy tính này rất quan trọng cho công việc hàng ngày của tôi.",
    status: "in_progress",
    priority: 1,
    created_at: "2024-01-15T09:30:00",
    updated_at: "2024-01-15T14:20:00",
    assigned_to: 201,
    assigned_name: "Nguyễn Văn A",
    assigned_email: "nguyen.a@company.com",
    resolved_at: null,
    resolve_solution: null,
    evidence: [
        {
            type: "image",
            url: "/placeholder.svg?height=120&width=160",
            name: "computer_front.jpg",
            uploaded_at: "2024-01-15T09:35:00",
        },
        {
            type: "image",
            url: "/placeholder.svg?height=120&width=160",
            name: "power_button.jpg",
            uploaded_at: "2024-01-15T09:36:00",
        },
        {
            type: "image",
            url: "/placeholder.svg?height=120&width=160",
            name: "back_panel.jpg",
            uploaded_at: "2024-01-15T09:37:00",
        },
        {
            type: "image",
            url: "/placeholder.svg?height=120&width=160",
            name: "power_cable.jpg",
            uploaded_at: "2024-01-15T09:38:00",
        },
    ],
}

const mockComments = [
    {
        id: 1,
        user_name: "Trần Thị B",
        user_role: "user",
        content:
            "Máy tính đột nhiên tắt khi đang làm việc và không thể khởi động lại. Tôi đang rất cần máy này để hoàn thành báo cáo cuối tháng.",
        created_at: "2024-01-15T09:30:00",
        type: "comment",
    },
    {
        id: 2,
        user_name: "System",
        user_role: "system",
        content: "Yêu cầu đã được tạo và chờ xử lý",
        created_at: "2024-01-15T09:30:00",
        type: "status_change",
    },
    {
        id: 3,
        user_name: "Nguyễn Văn A",
        user_role: "admin",
        content: "Đã nhận yêu cầu, sẽ kiểm tra trong 30 phút. Có thể là vấn đề về nguồn điện hoặc mainboard.",
        created_at: "2024-01-15T10:15:00",
        type: "comment",
    },
    {
        id: 4,
        user_name: "System",
        user_role: "system",
        content: "Trạng thái đã được cập nhật từ 'Mở' thành 'Đang xử lý'",
        created_at: "2024-01-15T10:16:00",
        type: "status_change",
    },
    {
        id: 5,
        user_name: "Nguyễn Văn A",
        user_role: "admin",
        content: "Đã kiểm tra tại chỗ. Vấn đề có thể do bộ nguồn bị hỏng. Sẽ thay thế bộ nguồn mới.",
        created_at: "2024-01-15T11:30:00",
        type: "comment",
    },
    {
        id: 6,
        user_name: "Trần Thị B",
        user_role: "user",
        content: "Cảm ơn anh đã hỗ trợ nhanh chóng. Khi nào có thể sửa xong ạ?",
        created_at: "2024-01-15T11:45:00",
        type: "comment",
    },
    {
        id: 7,
        user_name: "Nguyễn Văn A",
        user_role: "admin",
        content: "Dự kiến sẽ hoàn thành trong chiều nay. Tôi sẽ cập nhật khi có tiến triển.",
        created_at: "2024-01-15T12:00:00",
        type: "comment",
    },
]

const mockStaff = [
    { id: 201, name: "Nguyễn Văn A", email: "nguyen.a@company.com" },
    { id: 202, name: "Lê Văn C", email: "le.c@company.com" },
    { id: 203, name: "Phạm Thị D", email: "pham.d@company.com" },
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

export default function TicketDetailDialogAdmin({ open, onOpenChange, ticketId }) {
    const [ticket, setTicket] = useState(mockTicket)
    const [comments, setComments] = useState(mockComments)
    const [newComment, setNewComment] = useState("")
    const [isEditing, setIsEditing] = useState(false)
    const [editForm, setEditForm] = useState({
        status: ticket.status,
        priority: ticket.priority,
        assigned_to: ticket.assigned_to,
        resolve_solution: ticket.resolve_solution || "",
    })

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString("vi-VN")
    }

    const formatDateShort = (dateString) => {
        return new Date(dateString).toLocaleDateString("vi-VN")
    }

    const getStatusBadge = (status) => {
        const config = statusConfig[status]
        const Icon = config.icon
        return (
            <Badge className={`flex items-center gap-1 ${config.className}`}>
                <Icon className="w-3 h-3" />
                {config.label}
            </Badge>
        )
    }

    const getPriorityBadge = (priority) => {
        const config = priorityConfig[priority]
        return <Badge className={config.className}>{config.label}</Badge>
    }

    const handleSaveChanges = () => {
        setTicket((prev) => ({
            ...prev,
            ...editForm,
            updated_at: new Date().toISOString(),
            assigned_name: mockStaff.find((s) => s.id === editForm.assigned_to)?.name || prev.assigned_name,
        }))

        const newSystemComment = {
            id: comments.length + 1,
            user_name: "System",
            user_role: "system",
            content: "Thông tin yêu cầu đã được cập nhật",
            created_at: new Date().toISOString(),
            type: "status_change",
        }
        setComments((prev) => [...prev, newSystemComment])
        setIsEditing(false)
    }

    const handleAddComment = () => {
        if (!newComment.trim()) return

        const comment = {
            id: comments.length + 1,
            user_name: "Admin User",
            user_role: "admin",
            content: newComment,
            created_at: new Date().toISOString(),
            type: "comment",
        }
        setComments((prev) => [...prev, comment])
        setNewComment("")
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-7xl h-[90vh] p-0 gap-0 flex flex-col">
                {/* Fixed Header */}
                <DialogHeader className="px-6 py-4 border-b bg-muted/30 flex-shrink-0">
                    <div className="flex items-start justify-between">
                        <div className="space-y-2">
                            <div className="flex items-center gap-3">
                                <DialogTitle className="text-xl font-semibold">Yêu cầu #{ticket.ticket_id}</DialogTitle>
                                {getStatusBadge(ticket.status)}
                                {getPriorityBadge(ticket.priority)}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                    <User className="w-4 h-4" />
                                    {ticket.user_name}
                                </div>
                                <div className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    {formatDateShort(ticket.created_at)}
                                </div>
                                <div className="flex items-center gap-1">
                                    <FileText className="w-4 h-4" />
                                    {ticket.type_name}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant={isEditing ? "destructive" : "default"}
                                size="sm"
                                onClick={() => setIsEditing(!isEditing)}
                            >
                                {isEditing ? <X className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                                {isEditing ? "Hủy" : "Sửa"}
                            </Button>
                        </div>
                    </div>
                </DialogHeader>

                {/* Main Content - Scrollable */}
                <div className="flex flex-1 min-h-0">
                    {/* Sidebar - Scrollable */}
                    <div className="w-80 border-r bg-muted/20 flex-shrink-0">
                        <ScrollArea className="h-full">
                            <div className="p-4 space-y-4">
                                {/* User Info */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-sm flex items-center gap-2">
                                            <User className="w-4 h-4" />
                                            Người yêu cầu
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="w-10 h-10">
                                                <AvatarFallback className="bg-primary/10 text-primary font-medium">
                                                    {ticket.user_name.charAt(0)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-sm truncate">{ticket.user_name}</p>
                                                <p className="text-xs text-muted-foreground truncate">{ticket.user_department}</p>
                                            </div>
                                        </div>
                                        <div className="space-y-2 text-xs">
                                            <div className="flex items-center gap-2">
                                                <Mail className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                                                <span className="truncate">{ticket.user_email}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Phone className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                                                <span>{ticket.user_phone}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Hash className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                                                <span>ID: {ticket.user_id}</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Device Info */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-sm flex items-center gap-2">
                                            <Monitor className="w-4 h-4" />
                                            Thiết bị
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2 text-xs">
                                        <div className="space-y-2">
                                            <div>
                                                <span className="text-muted-foreground">Serial:</span>
                                                <code className="ml-2 bg-muted px-1.5 py-0.5 rounded text-xs font-mono">
                                                    {ticket.device_serial}
                                                </code>
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground">Model:</span>
                                                <span className="ml-2">{ticket.device_info.model}</span>
                                            </div>
                                            <div className="flex items-start gap-2">
                                                <MapPin className="w-3 h-3 text-muted-foreground mt-0.5 flex-shrink-0" />
                                                <span className="flex-1">{ticket.device_info.location}</span>
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground">Mua:</span>
                                                <span className="ml-2">{formatDateShort(ticket.device_info.purchase_date)}</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Management */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-sm flex items-center gap-2">
                                            <Settings className="w-4 h-4" />
                                            Quản lý
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {isEditing ? (
                                            <div className="space-y-3">
                                                <div className="space-y-1.5">
                                                    <Label className="text-xs">Trạng thái</Label>
                                                    <Select
                                                        value={editForm.status}
                                                        onValueChange={(value) => setEditForm((prev) => ({ ...prev, status: value }))}
                                                    >
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent className="bg-white">
                                                            <SelectItem value="open">Mở</SelectItem>
                                                            <SelectItem value="in_progress">Đang xử lý</SelectItem>
                                                            <SelectItem value="resolved">Đã giải quyết</SelectItem>
                                                            <SelectItem value="closed">Đã đóng</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>

                                                <div className="space-y-1.5">
                                                    <Label className="text-xs">Độ ưu tiên</Label>
                                                    <Select
                                                        value={editForm.priority.toString()}
                                                        onValueChange={(value) =>
                                                            setEditForm((prev) => ({ ...prev, priority: Number.parseInt(value) }))
                                                        }
                                                    >
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent className="bg-white">
                                                            <SelectItem value="1">Cao</SelectItem>
                                                            <SelectItem value="2">Trung bình</SelectItem>
                                                            <SelectItem value="3">Thấp</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>

                                                <div className="space-y-1.5">
                                                    <Label className="text-xs">Phân công</Label>
                                                    <Select
                                                        value={editForm.assigned_to?.toString() || ""}
                                                        onValueChange={(value) =>
                                                            setEditForm((prev) => ({ ...prev, assigned_to: Number.parseInt(value) }))
                                                        }
                                                    >
                                                        <SelectTrigger className="h-8 w-full">
                                                            <SelectValue placeholder="Chọn nhân viên" />
                                                        </SelectTrigger>
                                                        <SelectContent className="bg-white">
                                                            {mockStaff.map((staff) => (
                                                                <SelectItem key={staff.id} value={staff.id.toString()}>
                                                                    {staff.name}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>

                                                <Button onClick={handleSaveChanges} size="sm" className="w-full">
                                                    <Save className="w-4 h-4 mr-2" />
                                                    Lưu thay đổi
                                                </Button>
                                            </div>
                                        ) : (
                                            <div className="space-y-3">
                                                <div className="space-y-2 text-xs">
                                                    <div className="flex items-center gap-2">
                                                        <UserCheck className="w-3 h-3 text-muted-foreground" />
                                                        <span className="text-muted-foreground">Người xử lý:</span>
                                                    </div>
                                                    <p className="text-sm font-medium ml-5">{ticket.assigned_name || "Chưa phân công"}</p>
                                                    {ticket.resolved_at && (
                                                        <>
                                                            <div className="flex items-center gap-2 mt-3">
                                                                <CheckCircle className="w-3 h-3 text-muted-foreground" />
                                                                <span className="text-muted-foreground">Giải quyết:</span>
                                                            </div>
                                                            <p className="text-sm ml-5">{formatDate(ticket.resolved_at)}</p>
                                                        </>
                                                    )}
                                                </div>
                                                <Separator />
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>
                        </ScrollArea>
                    </div>

                    {/* Main Content - Scrollable */}
                    <div className="flex-1 flex flex-col min-w-0">
                        <ScrollArea className="flex-1">
                            <div className="p-6 space-y-6">
                                {/* Description */}
                                <div className="space-y-3">
                                    <h3 className="font-medium flex items-center gap-2">
                                        <FileText className="w-4 h-4" />
                                        Mô tả chi tiết
                                    </h3>
                                    <div className="bg-muted/50 rounded-lg p-4">
                                        <p className="text-sm leading-relaxed">{ticket.description}</p>
                                    </div>
                                </div>

                                {/* Solution */}
                                {isEditing && (editForm.status === "resolved" || editForm.status === "closed") && (
                                    <div className="space-y-3">
                                        <h3 className="font-medium flex items-center gap-2">
                                            <CheckCircle className="w-4 h-4" />
                                            Giải pháp
                                        </h3>
                                        <Textarea
                                            placeholder="Mô tả giải pháp đã áp dụng..."
                                            value={editForm.resolve_solution}
                                            onChange={(e) => setEditForm((prev) => ({ ...prev, resolve_solution: e.target.value }))}
                                            rows={4}
                                            className="resize-none"
                                        />
                                    </div>
                                )}

                                {ticket.resolve_solution && !isEditing && (
                                    <div className="space-y-3">
                                        <h3 className="font-medium flex items-center gap-2">
                                            <CheckCircle className="w-4 h-4" />
                                            Giải pháp
                                        </h3>
                                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                            <p className="text-sm leading-relaxed">{ticket.resolve_solution}</p>
                                        </div>
                                    </div>
                                )}

                                {/* Evidence */}
                                {ticket.evidence && ticket.evidence.length > 0 && (
                                    <div className="space-y-3">
                                        <h3 className="font-medium flex items-center gap-2">
                                            <Camera className="w-4 h-4" />
                                            Hình ảnh minh chứng ({ticket.evidence.length})
                                        </h3>
                                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                                            {ticket.evidence.map((item, index) => (
                                                <div key={index} className="group relative">
                                                    <img
                                                        src={item.url || "/placeholder.svg"}
                                                        alt={item.name}
                                                        className="w-full h-24 object-cover rounded-lg border group-hover:opacity-80 transition-opacity cursor-pointer"
                                                    />
                                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 rounded-lg transition-colors" />
                                                    <p className="text-xs text-muted-foreground mt-1 truncate">{item.name}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Comments */}
                                {/* <div className="space-y-3">
                                    <h3 className="font-medium flex items-center gap-2">
                                        <MessageSquare className="w-4 h-4" />
                                        Bình luận & Lịch sử ({comments.length})
                                    </h3>
                                    <div className="space-y-3">
                                        {comments.map((comment) => (
                                            <div key={comment.id} className="flex gap-3 p-3 rounded-lg bg-muted/30">
                                                <Avatar className="w-7 h-7 flex-shrink-0">
                                                    <AvatarFallback className="text-xs">
                                                        {comment.user_role === "system" ? "S" : comment.user_role === "admin" ? "A" : "U"}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1 space-y-1 min-w-0">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <span className="font-medium text-sm">{comment.user_name}</span>
                                                        <Badge variant="outline" className="text-xs px-1.5 py-0">
                                                            {comment.user_role === "system"
                                                                ? "Hệ thống"
                                                                : comment.user_role === "admin"
                                                                    ? "Admin"
                                                                    : "User"}
                                                        </Badge>
                                                        <span className="text-xs text-muted-foreground">{formatDate(comment.created_at)}</span>
                                                    </div>
                                                    <p
                                                        className={`text-sm leading-relaxed ${comment.type === "status_change" ? "text-muted-foreground italic" : ""}`}
                                                    >
                                                        {comment.content}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div> */}
                            </div>
                        </ScrollArea>

                        {/* <div className="border-t p-4 bg-muted/20 flex-shrink-0">
                            <div className="space-y-3">
                                <Label className="text-sm font-medium">Thêm bình luận</Label>
                                <Textarea
                                    placeholder="Nhập bình luận của bạn..."
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    rows={2}
                                    className="resize-none"
                                />
                                <div className="flex justify-between items-center">
                                    <Button variant="outline" size="sm">
                                        <Upload className="w-4 h-4 mr-2" />
                                        Đính kèm
                                    </Button>
                                    <Button onClick={handleAddComment} disabled={!newComment.trim()} size="sm">
                                        <MessageSquare className="w-4 h-4 mr-2" />
                                        Gửi bình luận
                                    </Button>
                                </div>
                            </div>
                        </div> */}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}