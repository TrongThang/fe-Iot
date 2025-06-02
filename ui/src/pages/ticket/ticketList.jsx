"use client"

import { useState, useEffect } from "react"
import {
  Ticket,
  Search,
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Settings,
  MessageSquare,
  Paperclip,
  Calendar,
  ChevronDown,
  RefreshCw,
  Lightbulb,
  Flame,
  Thermometer,
  Smartphone,
  Wifi,
  Eye,
  ArrowUpDown,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import CreateTicketDialog from "./Add-ticket-popup"
import TicketDetailDialog from "./ticketDetails"

export default function TicketList() {
  const [tickets, setTickets] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [filterOptions, setFilterOptions] = useState({
    status: "all",
    device_type: "all",
    date_range: "all",
  })
  const [sortBy, setSortBy] = useState("created_at")
  const [sortOrder, setSortOrder] = useState("desc")

  // Giả lập fetch dữ liệu từ API
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        // Giả lập API call
        await new Promise((resolve) => setTimeout(resolve, 1500))

        // Mock data
        const mockTickets = [
          {
            id: 1,
            title: "Cảm biến khói báo động liên tục",
            description: "Cảm biến khói trong phòng khách báo động liên tục dù không có khói.",
            status: "open",
            priority: "high",
            created_at: "2024-05-30T08:30:00Z",
            updated_at: "2024-05-30T08:30:00Z",
            user_id: 1,
            device: {
              id: 101,
              name: "Cảm biến khói phòng khách",
              serial: "SMOKE-2024-101",
              type: "smoke_detector",
              location: "Phòng khách",
            },
            ticket_type: {
              id: 1,
              name: "Sự cố thiết bị",
              description: "Báo cáo khi thiết bị hoạt động không đúng",
            },
            comments_count: 2,
            attachments_count: 1,
            last_response: "2024-05-30T09:15:00Z",
          },
          {
            id: 2,
            title: "Đèn thông minh không phản hồi",
            description: "Đèn thông minh phòng ngủ không phản hồi lệnh từ ứng dụng.",
            status: "in_progress",
            priority: "medium",
            created_at: "2024-05-29T14:20:00Z",
            updated_at: "2024-05-29T16:45:00Z",
            user_id: 1,
            device: {
              id: 102,
              name: "Đèn thông minh phòng ngủ",
              serial: "LIGHT-2024-102",
              type: "smart_light",
              location: "Phòng ngủ",
            },
            ticket_type: {
              id: 2,
              name: "Lỗi kết nối",
              description: "Báo cáo khi thiết bị không kết nối được",
            },
            comments_count: 3,
            attachments_count: 0,
            last_response: "2024-05-29T16:45:00Z",
          },
          {
            id: 3,
            title: "Nhiệt độ hiển thị không chính xác",
            description: "Cảm biến nhiệt độ hiển thị 35°C trong khi nhiệt độ thực tế khoảng 28°C.",
            status: "resolved",
            priority: "low",
            created_at: "2024-05-28T10:10:00Z",
            updated_at: "2024-05-28T15:30:00Z",
            user_id: 1,
            device: {
              id: 103,
              name: "Cảm biến nhiệt độ phòng khách",
              serial: "TEMP-2024-103",
              type: "temperature_sensor",
              location: "Phòng khách",
            },
            ticket_type: {
              id: 3,
              name: "Dữ liệu không chính xác",
              description: "Báo cáo khi thiết bị hiển thị dữ liệu không chính xác",
            },
            comments_count: 4,
            attachments_count: 2,
            last_response: "2024-05-28T15:30:00Z",
            resolution: "Đã hiệu chỉnh lại cảm biến và cập nhật firmware mới.",
          },
          {
            id: 4,
            title: "Khóa cửa thông minh không nhận dấu vân tay",
            description: "Khóa cửa thông minh không nhận dấu vân tay đã đăng ký.",
            status: "pending",
            priority: "high",
            created_at: "2024-05-27T09:00:00Z",
            updated_at: "2024-05-27T11:20:00Z",
            user_id: 1,
            device: {
              id: 104,
              name: "Khóa cửa thông minh",
              serial: "LOCK-2024-104",
              type: "smart_lock",
              location: "Cửa chính",
            },
            ticket_type: {
              id: 1,
              name: "Sự cố thiết bị",
              description: "Báo cáo khi thiết bị hoạt động không đúng",
            },
            comments_count: 2,
            attachments_count: 1,
            last_response: "2024-05-27T11:20:00Z",
          },
          {
            id: 5,
            title: "Cần hướng dẫn cài đặt lịch tự động",
            description: "Tôi cần hướng dẫn cách cài đặt lịch tự động cho hệ thống đèn trong nhà.",
            status: "closed",
            priority: "low",
            created_at: "2024-05-26T16:15:00Z",
            updated_at: "2024-05-26T17:30:00Z",
            user_id: 1,
            device: {
              id: 105,
              name: "Bộ điều khiển trung tâm",
              serial: "HUB-2024-105",
              type: "hub",
              location: "Phòng khách",
            },
            ticket_type: {
              id: 4,
              name: "Yêu cầu hỗ trợ",
              description: "Yêu cầu hướng dẫn hoặc hỗ trợ sử dụng",
            },
            comments_count: 3,
            attachments_count: 0,
            last_response: "2024-05-26T17:30:00Z",
            resolution: "Đã hướng dẫn khách hàng cài đặt lịch tự động qua video call.",
          },
        ]

        setTickets(mockTickets)
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTickets()
  }, [])

  // Xử lý tạo ticket mới
  const handleTicketCreated = (newTicket) => {
    setTickets([newTicket, ...tickets])
    setShowCreateDialog(false)
  }

  // Xử lý filter và sort
  const filteredTickets = tickets
    .filter((ticket) => {
      const matchesSearch =
        ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.device.serial.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus = filterOptions.status === "all" || ticket.status === filterOptions.status
      const matchesDeviceType = filterOptions.device_type === "all" || ticket.device.type === filterOptions.device_type

      return matchesSearch && matchesStatus && matchesDeviceType
    })
    .sort((a, b) => {
      // Xử lý sắp xếp
      if (sortOrder === "asc") {
        return a[sortBy] > b[sortBy] ? 1 : -1
      } else {
        return a[sortBy] < b[sortBy] ? 1 : -1
      }
    })

  // Nhóm tickets theo trạng thái
  const ticketsByStatus = filteredTickets.reduce((acc, ticket) => {
    if (!acc[ticket.status]) {
      acc[ticket.status] = []
    }
    acc[ticket.status].push(ticket)
    return acc
  }, {})

  // Thống kê
  const totalTickets = tickets.length
  const openTickets = tickets.filter((t) => ["open", "in_progress", "pending"].includes(t.status)).length
  const resolvedTickets = tickets.filter((t) => t.status === "resolved").length

  // Helpers
  const getDeviceIcon = (type) => {
    switch (type) {
      case "smart_light":
        return <Lightbulb className="h-4 w-4 text-amber-500" />
      case "smoke_detector":
        return <Flame className="h-4 w-4 text-red-500" />
      case "temperature_sensor":
        return <Thermometer className="h-4 w-4 text-blue-500" />
      case "hub":
        return <Wifi className="h-4 w-4 text-purple-500" />
      case "smart_lock":
        return <Settings className="h-4 w-4 text-green-500" />
      default:
        return <Smartphone className="h-4 w-4 text-slate-500" />
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "open":
        return <Clock className="h-4 w-4 text-blue-500" />
      case "in_progress":
        return <RefreshCw className="h-4 w-4 text-amber-500" />
      case "pending":
        return <AlertTriangle className="h-4 w-4 text-orange-500" />
      case "resolved":
        return <CheckCircle className="h-4 w-4 text-emerald-500" />
      case "closed":
        return <XCircle className="h-4 w-4 text-slate-500" />
      default:
        return <Clock className="h-4 w-4 text-slate-500" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "open":
        return "bg-blue-100 text-blue-700 border-blue-200"
      case "in_progress":
        return "bg-amber-100 text-amber-700 border-amber-200"
      case "pending":
        return "bg-orange-100 text-orange-700 border-orange-200"
      case "resolved":
        return "bg-emerald-100 text-emerald-700 border-emerald-200"
      case "closed":
        return "bg-slate-100 text-slate-700 border-slate-200"
      default:
        return "bg-slate-100 text-slate-700 border-slate-200"
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case "open":
        return "Chờ xử lý"
      case "in_progress":
        return "Đang xử lý"
      case "pending":
        return "Chờ phản hồi"
      case "resolved":
        return "Đã giải quyết"
      case "closed":
        return "Đã đóng"
      default:
        return "Không xác định"
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-700 border-red-200"
      case "medium":
        return "bg-amber-100 text-amber-700 border-amber-200"
      case "low":
        return "bg-emerald-100 text-emerald-700 border-emerald-200"
      default:
        return "bg-slate-100 text-slate-700 border-slate-200"
    }
  }

  const getPriorityText = (priority) => {
    switch (priority) {
      case "high":
        return "Khẩn cấp"
      case "medium":
        return "Quan trọng"
      case "low":
        return "Bình thường"
      default:
        return "Không xác định"
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const getTimeAgo = (dateString) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffInMinutes = Math.floor((now - date) / (1000 * 60))

    if (diffInMinutes < 1) return "Vừa xong"
    if (diffInMinutes < 60) return `${diffInMinutes} phút trước`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} giờ trước`
    return `${Math.floor(diffInMinutes / 1440)} ngày trước`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-xl border-b border-white/20 sticky top-0 z-10 shadow-lg shadow-black/5">
          <div className="px-4 sm:px-6 py-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Ticket className="h-6 w-6 text-white" />
                  </div>
                  {openTickets > 0 && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-white">{openTickets}</span>
                    </div>
                  )}
                </div>

                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1">Yêu cầu hỗ trợ của tôi</h1>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200 font-medium">
                      <Ticket className="h-3 w-3 mr-1" />
                      {totalTickets} tổng cộng
                    </Badge>
                    <Badge variant="secondary" className="bg-amber-100 text-amber-700 border-amber-200 font-medium">
                      <RefreshCw className="h-3 w-3 mr-1" />
                      {openTickets} đang xử lý
                    </Badge>
                    <Badge
                      variant="secondary"
                      className="bg-emerald-100 text-emerald-700 border-emerald-200 font-medium"
                    >
                      <CheckCircle className="h-3 w-3 mr-1" />
                      {resolvedTickets} đã giải quyết
                    </Badge>
                  </div>
                </div>
              </div>

              <Button
                onClick={() => setShowCreateDialog(true)}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Plus className="h-4 w-4 mr-2" />
                Tạo yêu cầu mới
              </Button>
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-6">
          {/* Search and Filters */}
          <div className="mb-6 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                <Input
                  placeholder="Tìm kiếm yêu cầu hỗ trợ..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 border-slate-200 bg-white/80 backdrop-blur-sm focus:bg-white transition-colors"
                />
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="h-12 px-4 border-slate-200">
                    <ArrowUpDown className="h-4 w-4 mr-2" />
                    Sắp xếp
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => {
                      setSortBy("created_at")
                      setSortOrder("desc")
                    }}
                  >
                    Mới nhất
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setSortBy("created_at")
                      setSortOrder("asc")
                    }}
                  >
                    Cũ nhất
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setSortBy("priority")
                      setSortOrder("asc")
                    }}
                  >
                    Ưu tiên cao nhất
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setSortBy("updated_at")
                      setSortOrder("desc")
                    }}
                  >
                    Cập nhật gần đây
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="relative min-w-[160px]">
                <select
                  className="w-full h-11 pl-4 pr-10 text-sm border border-slate-200 rounded-xl appearance-none bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  value={filterOptions.status}
                  onChange={(e) => setFilterOptions({ ...filterOptions, status: e.target.value })}
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="open">Chờ xử lý</option>
                  <option value="in_progress">Đang xử lý</option>
                  <option value="pending">Chờ phản hồi</option>
                  <option value="resolved">Đã giải quyết</option>
                  <option value="closed">Đã đóng</option>
                </select>
                <ChevronDown
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none"
                  size={16}
                />
              </div>

              <div className="relative min-w-[160px]">
                <select
                  className="w-full h-11 pl-4 pr-10 text-sm border border-slate-200 rounded-xl appearance-none bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  value={filterOptions.device_type}
                  onChange={(e) => setFilterOptions({ ...filterOptions, device_type: e.target.value })}
                >
                  <option value="all">Tất cả thiết bị</option>
                  <option value="smart_light">Đèn thông minh</option>
                  <option value="smoke_detector">Cảm biến khói</option>
                  <option value="temperature_sensor">Cảm biến nhiệt độ</option>
                  <option value="smart_lock">Khóa thông minh</option>
                  <option value="hub">Bộ điều khiển</option>
                </select>
                <ChevronDown
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none"
                  size={16}
                />
              </div>
            </div>
          </div>

          {/* Tickets Tabs */}
          <Tabs defaultValue="all" className="mb-8">
            <TabsList className="bg-slate-100/80 backdrop-blur-sm p-1 rounded-xl overflow-x-auto flex whitespace-nowrap">
              <TabsTrigger value="all" className="rounded-lg px-4 py-2 transition-all">
                Tất cả ({filteredTickets.length})
              </TabsTrigger>
              {Object.keys(ticketsByStatus).map((status) => (
                <TabsTrigger key={status} value={status} className="rounded-lg px-4 py-2 transition-all">
                  {getStatusText(status)} ({ticketsByStatus[status].length})
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="all" className="mt-6">
              {isLoading ? (
                <TicketListSkeleton />
              ) : (
                <TicketListContent
                  tickets={filteredTickets}
                  onTicketClick={(ticket) => setSelectedTicket(ticket)}
                  getStatusIcon={getStatusIcon}
                  getStatusColor={getStatusColor}
                  getStatusText={getStatusText}
                  getPriorityColor={getPriorityColor}
                  getPriorityText={getPriorityText}
                  getDeviceIcon={getDeviceIcon}
                  getTimeAgo={getTimeAgo}
                />
              )}
            </TabsContent>

            {Object.keys(ticketsByStatus).map((status) => (
              <TabsContent key={status} value={status} className="mt-6">
                {isLoading ? (
                  <TicketListSkeleton />
                ) : (
                  <TicketListContent
                    tickets={ticketsByStatus[status]}
                    onTicketClick={(ticket) => setSelectedTicket(ticket)}
                    getStatusIcon={getStatusIcon}
                    getStatusColor={getStatusColor}
                    getStatusText={getStatusText}
                    getPriorityColor={getPriorityColor}
                    getPriorityText={getPriorityText}
                    getDeviceIcon={getDeviceIcon}
                    getTimeAgo={getTimeAgo}
                  />
                )}
              </TabsContent>
            ))}
          </Tabs>

          {!isLoading && filteredTickets.length === 0 && (
            <div className="text-center py-16 bg-white/40 backdrop-blur-sm rounded-2xl border border-dashed border-slate-300">
              <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Ticket className="h-10 w-10 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-700 mb-2">Chưa có yêu cầu hỗ trợ nào</h3>
              <p className="text-slate-500 mb-6">Tạo yêu cầu hỗ trợ đầu tiên khi bạn gặp vấn đề với thiết bị</p>
              <Button onClick={() => setShowCreateDialog(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Tạo yêu cầu đầu tiên
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Create Ticket Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-3xl h-[90vh] p-0 overflow-hidden">
          <DialogHeader className="sr-only">
            <DialogTitle>Tạo yêu cầu hỗ trợ mới</DialogTitle>
          </DialogHeader>
          <CreateTicketDialog onClose={() => setShowCreateDialog(false)} onTicketCreated={handleTicketCreated} />
        </DialogContent>
      </Dialog>

      {/* Ticket Detail Dialog */}
      <Dialog open={!!selectedTicket} onOpenChange={(open) => !open && setSelectedTicket(null)}>
        <DialogContent className="max-w-4xl h-[90vh] p-0 overflow-hidden">
          <DialogHeader className="sr-only">
            <DialogTitle>Chi tiết yêu cầu hỗ trợ</DialogTitle>
          </DialogHeader>
          {selectedTicket && (
            <TicketDetailDialog
              ticket={selectedTicket}
              onClose={() => setSelectedTicket(null)}
              getStatusIcon={getStatusIcon}
              getStatusColor={getStatusColor}
              getStatusText={getStatusText}
              getPriorityColor={getPriorityColor}
              getPriorityText={getPriorityText}
              getDeviceIcon={getDeviceIcon}
              getTimeAgo={getTimeAgo}
              formatDate={formatDate}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Ticket List Content Component
function TicketListContent({
  tickets,
  onTicketClick,
  getStatusIcon,
  getStatusColor,
  getStatusText,
  getPriorityColor,
  getPriorityText,
  getDeviceIcon,
  getTimeAgo,
}) {
  return (
    <div className="space-y-4">
      {tickets.map((ticket) => (
        <div
          key={ticket.id}
          onClick={() => onTicketClick(ticket)}
          className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl p-4 sm:p-6 cursor-pointer hover:shadow-lg hover:border-blue-300 transition-all duration-300 group"
        >
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
            <div className="flex items-start space-x-4 flex-1">
              <div className="flex-shrink-0 mt-1">{getStatusIcon(ticket.status)}</div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <h3 className="font-semibold text-lg text-slate-900 group-hover:text-blue-700 transition-colors">
                    #{ticket.id} - {ticket.title}
                  </h3>
                  <Badge variant="outline" className={cn("text-xs px-2 py-1", getStatusColor(ticket.status))}>
                    {getStatusText(ticket.status)}
                  </Badge>
                  <Badge variant="outline" className={cn("text-xs px-2 py-1", getPriorityColor(ticket.priority))}>
                    {getPriorityText(ticket.priority)}
                  </Badge>
                </div>

                <p className="text-slate-700 mb-3 text-lg leading-relaxed line-clamp-2">{ticket.description}</p>

                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 mb-3">
                  <div className="flex items-center space-x-1">
                    {getDeviceIcon(ticket.device.type)}
                    <span>{ticket.device.name}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{getTimeAgo(ticket.created_at)}</span>
                  </div>
                  {ticket.last_response && (
                    <div className="flex items-center space-x-1">
                      <MessageSquare className="h-4 w-4" />
                      <span>Phản hồi {getTimeAgo(ticket.last_response)}</span>
                    </div>
                  )}
                </div>

                {/* Progress indicator */}
                <div className="mb-3">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                    <span>Tiến độ xử lý</span>
                    <span>
                      {ticket.status === "open" && "0%"}
                      {ticket.status === "in_progress" && "50%"}
                      {ticket.status === "pending" && "75%"}
                      {(ticket.status === "resolved" || ticket.status === "closed") && "100%"}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-1.5">
                    <div
                      className={cn(
                        "h-1.5 rounded-full transition-all duration-300",
                        ticket.status === "open" && "bg-blue-500 w-[5%]",
                        ticket.status === "in_progress" && "bg-amber-500 w-1/2",
                        ticket.status === "pending" && "bg-orange-500 w-3/4",
                        (ticket.status === "resolved" || ticket.status === "closed") && "bg-emerald-500 w-full",
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <div className="bg-slate-50/80 backdrop-blur-sm rounded-lg px-3 py-1 text-xs">
                <span className="text-slate-600">Thiết bị: </span>
                <span className="font-mono">{ticket.device.serial}</span>
              </div>

              <div className="bg-slate-50/80 backdrop-blur-sm rounded-lg px-3 py-1 text-xs">
                <span className="text-slate-600">Vị trí: </span>
                <span className="font-medium">{ticket.device.location}</span>
              </div>
            </div>

            <div className="flex items-center space-x-3 text-xs text-slate-500">
              {ticket.comments_count > 0 && (
                <div className="flex items-center space-x-1">
                  <MessageSquare className="h-3 w-3" />
                  <span>{ticket.comments_count}</span>
                </div>
              )}
              {ticket.attachments_count > 0 && (
                <div className="flex items-center space-x-1">
                  <Paperclip className="h-3 w-3" />
                  <span>{ticket.attachments_count}</span>
                </div>
              )}
              <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 h-auto p-1">
                <Eye className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// Skeleton loader for ticket list
function TicketListSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl p-6">
          <div className="flex items-start space-x-4 mb-4">
            <Skeleton className="h-5 w-5 rounded-full" />
            <div className="flex-1 space-y-3">
              <div className="flex items-center space-x-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-5 w-20" />
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <div className="flex items-center space-x-4">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-2 w-full" />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-6 w-24" />
            </div>
            <div className="flex items-center space-x-2">
              <Skeleton className="h-4 w-4 rounded-full" />
              <Skeleton className="h-4 w-4 rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
