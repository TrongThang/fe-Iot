import { useEffect, useState } from "react"
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
    Camera,
    Calendar,
    MapPin,
    Phone,
    Mail,
    Hash,
    Settings,
    FileText,
    UserCheck,
    Loader,
    Loader2,
    X,
} from "lucide-react"
import axiosPublic from "@/apis/clients/public.client"
import Swal from "sweetalert2"
import { toast } from "sonner"

const mockStaff = [
    { id: 201, name: "Nguyễn Văn A", email: "nguyen.a@company.com" },
    { id: 202, name: "Lê Văn C", email: "le.c@company.com" },
    { id: 203, name: "Phạm Thị D", email: "pham.d@company.com" },
]

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

export default function TicketDetailDialogAdmin({ open, onOpenChange, selectedTicket, fetchTicket }) {
    const [ticket, setTicket] = useState(selectedTicket)
    const [isEditing, setIsEditing] = useState(false)
    const [loading, setLoading] = useState(false)
    const [editForm, setEditForm] = useState({
        status: ticket.status,
        priority: ticket.priority,
        assigned_to: ticket.assigned_to,
        resolve_solution: ticket.resolve_solution || "",
    })

    const fetchTicketById = async () => {
        try {
            const response = await axiosPublic.get(`/tickets/detail/${ticket?.ticket_id}`)
            if (response?.status_code === 200) {
                setTicket(response?.data?.data[0])
            }
        } catch (error) {
            console.error("Error fetching tickets:", error)
            throw (error)
        }
    }

    useEffect(() => {
        fetchTicketById();
    }, [selectedTicket])


    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString("vi-VN")
    }

    const formatDateShort = (dateString) => {
        return new Date(dateString).toLocaleDateString("vi-VN")
    }

    const getStatusBadge = (status) => {
        const config = statusConfig[status]
        const Icon = config?.icon
        return (
            <Badge className={`flex items-center gap-1 ${config?.className}`}>
                <Icon className="w-3 h-3" />
                {config?.label}
            </Badge>
        )
    }

    const getPriorityBadge = (priority) => {
        const config = priorityConfig[priority]
        return <Badge className={config?.className}>{config?.label}</Badge>
    }

    const handleStatusChange = async (status) => {
        setLoading(true)
        try{
            const updatedForm = { ...editForm, status };
            console.log("updateform", updatedForm)
            const response = await axiosPublic.put(`/tickets/${ticket?.ticket_id}/status`, updatedForm)
            console.log("res", response)

            if(response?.status_code === 200) {
                toast.success("Thành công", {description: "Cập nhật trạng thái thành công"})
                setIsEditing(false)
                fetchTicket();
                fetchTicketById();
                setEditForm((prev) => ({ ...prev, status: response.data.status}))
            }
            else{
                toast.error("Cập nhật thất bại", {description: response?.message})
            }
        }catch (error) {
            console.log("Error update status ticket:", error)
            throw(error)
        }finally {
            setLoading(false)
        }
    }

    const handleConfirm = async (ticketId) => {
        setLoading(true)
        try{
            const response = await axiosPublic.put(`/tickets/${ticket?.ticket_id}/confirm`)
            if(response.status_code === 200) {
                toast.success("Thành công", {description: "Duyệt yêu cầu thành công"})
                setIsEditing(false)
                await fetchTicket()
                await fetchTicketById()
                setEditForm((prev) => ({ ...prev, status: response.data.status }))
            }
            else{
                toast.error("Lỗi", {description: `${response.message}`})
            }
        }catch (error) {
            console.log("Error update status ticket:", error)
            toast.error("Lỗi khi duyệt yêu cầu. Vui lòng thử lại", {description: `${error.message}`})
            throw(error)
        }finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-7xl h-[90vh] p-0 gap-0 flex flex-col">
                {/* Fixed Header */}
                <DialogHeader className="px-6 py-4 border-b bg-muted/30 flex-shrink-0">
                    <div className="flex items-start justify-between">
                        <div className="space-y-2">
                            <div className="flex items-center gap-3">
                                <DialogTitle className="text-xl font-semibold">Yêu cầu #{ticket?.ticket_id}</DialogTitle>
                                {getStatusBadge(ticket?.status)}
                                {getPriorityBadge(ticket?.priority)}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                    <User className="w-4 h-4" />
                                    {ticket?.user_name}
                                </div>
                                <div className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    {formatDateShort(ticket?.created_at)}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {ticket?.status === "pending" 
                            ? (
                                <Button
                                    variant="default"
                                    size="sm"
                                    onClick={() => handleConfirm(ticket.ticket_id)}
                                    disable={loading}
                                    >
                                    {loading ? (
                                        <span className="flex items-center justify-center">
                                            <Loader2 size={18} className="mr-2 animate-spin" />
                                        </span>
                                    ) : ("Duyệt")}
                                </Button>
                            ) 
                            : ticket?.status === "in_progress" ? (
                                <>
                                    <Button
                                    variant="success"
                                    size="sm"
                                    onClick={() => {handleStatusChange("resolved")}}
                                    >
                                    Chấp nhận
                                    </Button>
                                    <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => {handleStatusChange("rejected")}}
                                    >
                                    Từ chối
                                    </Button>
                                </>
                            ) : (
                                <X onClick={() => onOpenChange(false)} className="cursor-pointer" />
                            )}
                            
                        </div>
                    </div>
                </DialogHeader>

                {/* Main Content - Scrollable */}
                <div className="flex flex-1 min-h-0 border-t-2 border-gray-500">
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
                                                    {ticket?.user_name?.charAt(0)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-sm truncate">{ticket?.user_name}</p>
                                                <p className="text-xs text-muted-foreground truncate">{ticket?.user_department}</p>
                                            </div>
                                        </div>
                                        <div className="space-y-2 text-xs">
                                            <div className="flex items-center gap-2">
                                                <Mail className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                                                <span className="truncate">{ticket?.user_email}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Phone className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                                                <span>{ticket?.user_phone}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Hash className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                                                <span>ID: {ticket?.user_id}</span>
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
                                                    {ticket?.device_serial}
                                                </code>
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground">Model:</span>
                                                <span className="ml-2">{ticket?.template_name}</span>
                                            </div>
                                            <div className="flex items-start gap-2">
                                                <MapPin className="w-3 h-3 text-muted-foreground mt-0.5 flex-shrink-0" />
                                                <span className="flex-1">{ticket?.space_name} - {ticket?.house_name} - {ticket?.group_name}</span>
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground">Mua:</span>
                                                <span className="ml-2">{formatDateShort(ticket?.device_info?.purchase_date)}</span>
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
                                            <div className="space-y-3">
                                                <div className="space-y-2 text-xs">
                                                    <div className="flex items-center gap-2">
                                                        <UserCheck className="w-3 h-3 text-muted-foreground" />
                                                        <span className="text-muted-foreground">Người xử lý:</span>
                                                    </div>
                                                    <p className="text-sm font-medium ml-5">{ticket?.assigned_name || "Chưa phân công"}</p>
                                                    {ticket?.resolved_at && (
                                                        <>
                                                            <div className="flex items-center gap-2 mt-3">
                                                                <CheckCircle className="w-3 h-3 text-muted-foreground" />
                                                                <span className="text-muted-foreground">Giải quyết:</span>
                                                            </div>
                                                            <p className="text-sm ml-5">{formatDate(ticket?.resolved_at)}</p>
                                                        </>
                                                    )}
                                                </div>
                                                <Separator />
                                            </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </ScrollArea>
                    </div>

                    {/* Main Content - Scrollable */}
                    <div className="flex-1 flex flex-col min-w-0">
                        <ScrollArea className="flex-1 scroll-y max-h-full border-l-2 border-gray-500">
                            <div className="p-6 space-y-6">
                                {/* Description */}
                                <div className="space-y-3">
                                    <h3 className="font-medium flex items-center gap-2">
                                        <FileText className="w-4 h-4" />
                                        Mô tả chi tiết
                                    </h3>
                                    <div className="bg-muted/50 rounded-lg p-4">
                                        <p className="text-sm leading-relaxed">{ticket?.description}</p>
                                    </div>
                                </div>

                                {/* Solution */}
                                {(editForm?.status === "in_progress" || editForm?.status === "rejected" || editForm?.status === "resolved") && (
                                    <div className="space-y-3">
                                        <h3 className="font-medium flex items-center gap-2">
                                            <CheckCircle className="w-4 h-4" />
                                            Giải pháp
                                        </h3>
                                        <Textarea
                                            placeholder="Mô tả giải pháp đã áp dụng..."
                                            value={editForm?.resolve_solution}
                                            onChange={(e) => setEditForm((prev) => ({ ...prev, resolve_solution: e.target.value }))}
                                            rows={4}
                                            className="resize-none"
                                            disabled={editForm?.status === "rejected" || editForm?.status === "resolved"}
                                        />
                                    </div>
                                )}
                                {/* Evidence */}
                                {ticket?.evidence && ticket?.evidence?.length > 0 && (
                                    <div className="space-y-3">
                                        <h3 className="font-medium flex items-center gap-2">
                                            <Camera className="w-4 h-4" />
                                            Hình ảnh minh chứng ({ticket?.evidence?.length})
                                        </h3>
                                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                                            {ticket?.evidence?.map((item, index) => (
                                                <div key={index} className="group relative">
                                                    <img
                                                        src={item?.url || "/placeholder.svg"}
                                                        alt={item?.name}
                                                        className="w-full h-24 object-cover rounded-lg border group-hover:opacity-80 transition-opacity cursor-pointer"
                                                    />
                                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 rounded-lg transition-colors" />
                                                    <p className="text-xs text-muted-foreground mt-1 truncate">{item.name}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </ScrollArea>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}