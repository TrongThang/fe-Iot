"use client";

import { useState, useEffect } from "react";
import {
  Ticket, Search, Plus, Clock, CheckCircle, XCircle, AlertTriangle, Settings,
  MessageSquare, Paperclip, Calendar, ChevronDown, RefreshCw, Smartphone, ArrowUpDown,
  Eye, Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import CreateTicketDialog from "./Add-ticket-popup";
import TicketDetailDialog from "./ticketDetails";
import { toast } from "sonner";

export default function TicketList() {
  const [tickets, setTickets] = useState([]);
  const [ticketTypes, setTicketTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [error, setError] = useState(null);
  const [filterOptions, setFilterOptions] = useState({
    status: "all",
    date_range: "all",
  });
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("desc");

  const accessToken = localStorage.getItem("authToken");

  // Fetch tickets
  const fetchTickets = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`${process.env.REACT_APP_SMART_NET_IOT_API_URL}/api/tickets/user`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (res.status === 200) {
        const data = await res.json();
        setTickets(data.data?.data || []);
      } else {
        throw new Error(`Failed to fetch tickets: ${res.status}`);
      }
    } catch (error) {
      setError(error.message);
      toast.error(error.message || "Không thể tải danh sách yêu cầu. Vui lòng thử lại.", {
        duration: 5000,
      });
    }
  };

  // Fetch ticket types
  const fetchTicketTypes = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_SMART_NET_IOT_API_URL}/api/ticket-types`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (res.status === 200) {
        const data = await res.json();
        setTicketTypes(data.data?.data || []);
      } else {
        throw new Error(`Failed to fetch ticket types: ${res.status}`);
      }
    } catch (error) {
      setError(error.message);
      toast.error(error.message || "Không thể tải loại yêu cầu. Vui lòng thử lại.", {
        duration: 5000,
      });
    }
  };

  // Fetch data on mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        await Promise.all([fetchTickets(), fetchTicketTypes()]);
      } catch (err) {
        setError("Không thể tải dữ liệu. Vui lòng thử lại.");
        toast.error("Không thể tải dữ liệu. Vui lòng thử lại.", {
          duration: 5000,
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (accessToken) {
      loadData();
    } else {
      setError("Vui lòng đăng nhập để xem yêu cầu hỗ trợ.");
      setIsLoading(false);
      toast.warning("Vui lòng đăng nhập để xem yêu cầu hỗ trợ.", {
        duration: 5000,
      });
    }
  }, [accessToken]);

  // Handle ticket creation
  const handleTicketCreated = (newTicket) => {
    setTickets([newTicket, ...tickets]);
    setShowCreateDialog(false);
    toast.success("Yêu cầu hỗ trợ đã được tạo.", {
      duration: 1500,
      progress: true,
    });
  };

  // Handle ticket deletion
  const handleTicketDeleted = async (ticketId) => {
    const result = await toast.custom((t) => (
      <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-red-600 mb-2">Xác nhận xóa</h3>
        <p className="text-sm text-gray-600 mb-4">Bạn có chắc muốn xóa yêu cầu hỗ trợ này? Hành động này không thể hoàn tác.</p>
        <div className="flex justify-end space-x-2">
          <Button
            variant="outline"
            onClick={() => toast.dismiss(t)}
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            Hủy
          </Button>
          <Button
            variant="destructive"
            onClick={async () => {
              toast.dismiss(t);
              try {
                const response = await fetch(
                  `https://iothomeconnectapiv2-production.up.railway.app/api/tickets/${ticketId}/cancel`,
                  {
                    method: "PUT",
                    headers: {
                      Authorization: `Bearer ${accessToken}`,
                    },
                  }
                );

                if (!response.ok) {
                  const errorData = await response.json();
                  throw new Error(errorData.message || "Failed to delete ticket");
                }

                setTickets((prevTickets) => prevTickets.filter((ticket) => ticket.ticket_id !== ticketId));

                toast.success("Yêu cầu hỗ trợ đã được xóa.", {
                  duration: 1500,
                  progress: true,
                });
              } catch (error) {
                console.error("Failed to delete ticket:", error);
                toast.error(error.message || "Không thể xóa yêu cầu. Vui lòng thử lại.", {
                  duration: 5000,
                });
              }
            }}
          >
            Xóa
          </Button>
        </div>
      </div>
    ), {
      duration: Infinity,
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_SMART_NET_IOT_API_URL}/api/tickets/${ticketId}/cancel`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to delete ticket");
        }

        setTickets((prevTickets) => prevTickets.filter((ticket) => ticket.ticket_id !== ticketId));

        Swal.fire({
          icon: "success",
          title: "Thành công",
          text: "Yêu cầu hỗ trợ đã được xóa.",
          confirmButtonColor: "#2563eb",
          timer: 1500,
          timerProgressBar: true,
        });
      } catch (error) {
        console.error("Failed to delete ticket:", error);
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: error.message || "Không thể xóa yêu cầu. Vui lòng thử lại.",
          confirmButtonColor: "#2563eb",
        });
      }
    }
  };

  // Filter and sort tickets
  const filteredTickets = tickets
    .filter((ticket) => {
      const matchesSearch =
        (ticket.ticket_id?.toString().toLowerCase() ?? "").includes(searchQuery.toLowerCase()) ||
        (ticket.description?.toLowerCase() ?? "").includes(searchQuery.toLowerCase()) ||
        (ticket.device_serial?.toLowerCase() ?? "").includes(searchQuery.toLowerCase());

      const matchesStatus =
        filterOptions.status === "all" || ticket.status === filterOptions.status;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      const key = sortBy === "priority" ? "priority" : sortBy;
      const valueA = sortBy === "priority" ? (a.priority || 0) : a[sortBy] || "";
      const valueB = sortBy === "priority" ? (b.priority || 0) : b[sortBy] || "";
      if (sortOrder === "asc") {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });

  // Group tickets by status
  const ticketsByStatus = filteredTickets.reduce((acc, ticket) => {
    if (!acc[ticket.status]) {
      acc[ticket.status] = [];
    }
    acc[ticket.status].push(ticket);
    return acc;
  }, {});

  // Statistics
  const totalTickets = tickets.length;
  const openTickets = tickets.filter((t) => ["pending", "in_progress", "approved"].includes(t.status)).length;
  const resolvedTickets = tickets.filter((t) => t.status === "resolved").length;

  // Helpers
  const getDeviceIcon = () => {
    return <Smartphone className="h-4 w-4 text-slate-500" />;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-blue-500" />;
      case "in_progress":
        return <RefreshCw className="h-4 w-4 text-amber-500" />;
      case "approved":
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case "resolved":
        return <CheckCircle className="h-4 w-4 text-emerald-500" />;
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-slate-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "in_progress":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "approved":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "resolved":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "rejected":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "Chờ xử lý";
      case "in_progress":
        return "Đang xử lý";
      case "approved":
        return "Đã phê duyệt";
      case "resolved":
        return "Đã giải quyết";
      case "rejected":
        return "Bị từ chối";
      case "cancelled":
        return "Đã hủy";
      default:
        return "Không xác định";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 1:
        return "bg-red-100 text-red-700 border-red-200";
      case 2:
        return "bg-amber-100 text-amber-700 border-amber-200";
      case 3:
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const getPriorityText = (priority) => {
    switch (priority) {
      case 1:
        return "Khẩn cấp";
      case 2:
        return "Quan trọng";
      case 3:
        return "Bình thường";
      default:
        return "Không xác định";
    }
  };
  
  const getTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));

    if (diffInMinutes < 1) return "Vừa xong";
    if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} giờ trước`;
    return `${Math.floor(diffInMinutes / 1440)} ngày trước`;
  };

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
                    <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 border-emerald-200 font-medium">
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
          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}

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
                      setSortBy("created_at");
                      setSortOrder("desc");
                    }}
                  >
                    Mới nhất
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setSortBy("created_at");
                      setSortOrder("asc");
                    }}
                  >
                    Cũ nhất
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setSortBy("priority");
                      setSortOrder("asc");
                    }}
                  >
                    Ưu tiên cao nhất
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setSortBy("updated_at");
                      setSortOrder("desc");
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
                  <option value="pending">Chờ xử lý</option>
                  <option value="in_progress">Đang xử lý</option>
                  <option value="approved">Đã phê duyệt</option>
                  <option value="resolved">Đã giải quyết</option>
                  <option value="rejected">Bị từ chối</option>
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
                  onTicketDelete={handleTicketDeleted}
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
                    onTicketDelete={handleTicketDeleted}
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
              onTicketDeleted={handleTicketDeleted}
              getStatusIcon={getStatusIcon}
              getStatusColor={getStatusColor}
              getStatusText={getStatusText}
              getPriorityColor={getPriorityColor}
              getPriorityText={getPriorityText}
              getDeviceIcon={getDeviceIcon}
              getTimeAgo={getTimeAgo}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function TicketListContent({
  tickets,
  onTicketClick,
  onTicketDelete,
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
          key={ticket.ticket_id}
          onClick={() => onTicketClick(ticket)}
          className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl p-4 sm:p-6 cursor-pointer hover:shadow-lg hover:border-blue-300 transition-all duration-300 group"
        >
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
            <div className="flex items-start space-x-4 flex-1">
              <div className="flex-shrink-0 mt-1">{getStatusIcon(ticket.status)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <h3 className="font-semibold text-lg text-slate-900 group-hover:text-blue-700 transition-colors">
                    #{ticket.ticket_id} - {ticket.ticket_type_name}
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
                    {getDeviceIcon()}
                    <span>{ticket.device_serial}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{getTimeAgo(ticket.created_at)}</span>
                  </div>
                </div>
                <div className="mb-3">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                    <span>Tiến độ xử lý</span>
                    <span>
                      {ticket.status === "pending" && "0%"}
                      {ticket.status === "in_progress" && "50%"}
                      {ticket.status === "approved" && "75%"}
                      {ticket.status === "resolved" && "100%"}
                      {ticket.status === "rejected" && "0%"}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-1.5">
                    <div
                      className={cn(
                        "h-1.5 rounded-full transition-all duration-300",
                        ticket.status === "pending" && "bg-blue-500 w-[5%]",
                        ticket.status === "in_progress" && "bg-amber-500 w-1/2",
                        ticket.status === "approved" && "bg-orange-500 w-3/4",
                        ticket.status === "resolved" && "bg-emerald-500 w-full",
                        ticket.status === "rejected" && "bg-red-500 w-[5%]"
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
            </div>
            <div className="flex items-center space-x-3 text-xs text-muted-foreground">
              <Button
                variant="ghost"
                size="sm"
                className="text-blue-600 hover:text-blue-700 h-auto p-1"
                aria-label={`Xem chi tiết ticket ${ticket.ticket_id}`}
              >
                <Eye className="h-4 w-4" />
              </Button>
              {["pending", "in_progress", "approved"].includes(ticket.status) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent card click
                    onTicketDelete(ticket.ticket_id);
                  }}
                  className="text-red-600 hover:text-red-700 h-auto p-1"
                  aria-label={`Xóa ticket ${ticket.ticket_id}`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function TicketListSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl p-6">
          <div className="flex items-start space-x-4">
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
          <div className="flex items-center justify-between mt-4">
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
  );
}