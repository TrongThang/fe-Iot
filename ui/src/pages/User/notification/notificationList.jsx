"use client";

import { useState, useEffect } from "react";
import {
  Bell,
  BellRing,
  Search,
  MoreHorizontal,
  AlertTriangle,
  Info,
  CheckCircle,
  Clock,
  Trash2,
  Eye,
  EyeOff,
  ChevronDown,
  Shield,
  Settings,
  Wifi,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import axiosPrivate from "@/apis/clients/private.client";
import NotificationDetail from "./notificationDetails";

export default function NotificationList() {
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOptions, setFilterOptions] = useState({
    type: "all",
    is_read: "all",
    role_id: "all",
  });
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [notificationIdToDelete, setNotificationIdToDelete] = useState(null);
  const accessToken = localStorage.getItem("authToken");
  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    if (!accessToken) {
      toast.error("Vui lòng đăng nhập để xem thông báo.");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const res = await fetch(`https://iothomeconnectapiv2-production.up.railway.app/api/notifications/user`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        const notificationData = Array.isArray(data) ? data : [data];
        const enhancedNotifications = notificationData.map((notif) => ({
          ...notif,
          priority: determinePriority(notif.type),
          category: determineCategory(notif.type),
        }));
        setNotifications(enhancedNotifications);
      } else {
        throw new Error("Không thể tải thông báo");
      }
    } catch (error) {
      toast.error(error.message || "Đã xảy ra lỗi khi tải thông báo. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  const determinePriority = (type) => {
    switch (type) {
      case "system_info":
        return "low";
      case "device_alert":
      case "security_alert":
        return "high";
      default:
        return "medium";
    }
  };

  const determineCategory = (type) => {
    switch (type) {
      case "system_info":
      case "system":
      case "system_update":
        return "system";
      case "device_alert":
      case "device_warning":
        return "safety";
      case "device_offline":
        return "connectivity";
      case "device_alert":
        return "alert";
      case "security_alert":
        return "security";
      default:
        return "system";
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [accessToken]);

  const handleNotificationClick = (notification) => {
    setSelectedNotification(notification);
    if (!notification.is_read) {
      markAsRead(notification.id);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const res = await axiosPrivate.put(`/notifications/${notificationId}`, {
        is_read: true,
      });
      if (res) {
        setNotifications(
          notifications.map((notif) =>
            notif.id === notificationId ? { ...notif, is_read: true, updated_at: new Date().toISOString() } : notif,
          ),
        );
      } else {
        throw new Error("Không thể cập nhật trạng thái thông báo");
      }
    } catch (error) {
      toast.error(error.message || "Đã xảy ra lỗi khi đánh dấu đã đọc. Vui lòng thử lại.");
    }
  };

  const markAsUnread = async (notificationId) => {
    try {
      const res = await axiosPrivate.put(`/notifications/${notificationId}`, {
        is_read: false,
      });
      if (res) {
        setNotifications(
          notifications.map((notif) =>
            notif.id === notificationId ? { ...notif, is_read: false, updated_at: new Date().toISOString() } : notif,
          ),
        );
      } else {
        throw new Error("Không thể cập nhật trạng thái thông báo");
      }
    } catch (error) {
      toast.error(error.message || "Đã xảy ra lỗi khi đánh dấu chưa đọc. Vui lòng thử lại.");
    }
  };

  const deleteNotification = (notificationId) => {
    setNotificationIdToDelete(notificationId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteNotification = async () => {
    try {
      const res = await axiosPrivate.delete(`/notifications/${notificationIdToDelete}`);
      if (res) {
        setNotifications(
          notifications.map((notif) =>
            notif.id === notificationIdToDelete ? { ...notif, deleted_at: new Date().toISOString() } : notif,
          ),
        );
        toast.success("Thông báo đã được xóa.");
      } else {
        throw new Error("Không thể xóa thông báo");
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
      toast.error(error.message || "Đã xảy ra lỗi khi xóa thông báo. Vui lòng thử lại.");
    } finally {
      setIsDeleteDialogOpen(false);
      setNotificationIdToDelete(null);
    }
  };

  const markAllAsRead = () => {
    setNotifications(
      notifications.map((notif) => ({
        ...notif,
        is_read: true,
        updated_at: new Date().toISOString(),
      })),
    );
  };

  const getNotificationIcon = (type, priority) => {
    const iconProps = { className: "h-5 w-5" };
    switch (type) {
      case "device_alert":
        return <AlertTriangle {...iconProps} className="h-5 w-5 text-red-500" />;
      case "device_warning":
        return <AlertTriangle {...iconProps} className="h-5 w-5 text-amber-500" />;
      case "device_status":
        return <CheckCircle {...iconProps} className="h-5 w-5 text-emerald-500" />;
      case "device_offline":
        return <Wifi {...iconProps} className="h-5 w-5 text-red-500" />;
      case "device_alert":
        return <Settings {...iconProps} className="h-5 w-5 text-blue-500" />;
      case "system_update":
        return <Info {...iconProps} className="h-5 w-5 text-blue-500" />;
      case "system_info":
        return <Info {...iconProps} className="h-5 w-5 text-slate-500" />;
      case "security_alert":
        return <Shield {...iconProps} className="h-5 w-5 text-red-600" />;
      default:
        return <Bell {...iconProps} className="h-5 w-5 text-slate-500" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-700 border-red-200";
      case "medium":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "low":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case "safety":
        return "bg-red-50 text-red-600";
      case "security":
        return "bg-purple-50 text-purple-600";
      case "environment":
        return "bg-blue-50 text-blue-600";
      case "automation":
        return "bg-emerald-50 text-emerald-600";
      case "alert":
        return "bg-amber-50 text-amber-600";
      case "ticket":
        return "bg-orange-50 text-orange-600";
      case "system":
        return "bg-slate-50 text-slate-600";
      default:
        return "bg-slate-50 text-slate-600";
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

  const filteredNotifications = notifications
    .filter((notif) => !notif.deleted_at)
    .filter((notif) => {
      const matchesSearch = notif.text.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = filterOptions.type === "all" || notif.type === filterOptions.type;
      const matchesRead =
        filterOptions.is_read === "all" ||
        (filterOptions.is_read === "read" && notif.is_read) ||
        (filterOptions.is_read === "unread" && !notif.is_read);
      const matchesRole =
        filterOptions.role_id === "all" || notif.role_id === null || notif.role_id.toString() === filterOptions.role_id;
      return matchesSearch && matchesType && matchesRead && matchesRole;
    });

  const notificationsByCategory = filteredNotifications.reduce((acc, notif) => {
    if (!acc[notif.category]) acc[notif.category] = [];
    acc[notif.category].push(notif);
    return acc;
  }, {});

  const unreadCount = notifications.filter((notif) => !notif.is_read && !notif.deleted_at).length;
  const todayCount = notifications.filter((notif) => {
    const today = new Date().toDateString();
    const notifDate = new Date(notif.created_at).toDateString();
    return today === notifDate && !notif.deleted_at;
  }).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <div className="max-w-6xl mx-auto">
        <header className="bg-white/80 backdrop-blur-xl border-b border-white/20 sticky top-0 z-10 shadow-lg shadow-black/5">
          <div className="px-6 py-5">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Bell className="h-6 w-6 text-white" />
                  </div>
                  {unreadCount > 0 && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-white">{unreadCount}</span>
                    </div>
                  )}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 mb-1">Thông báo thiết bị</h1>
                  <div className="flex items-center space-x-3">
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200 font-medium">
                      <BellRing className="h-3 w-3 mr-1" />
                      {unreadCount} chưa đọc
                    </Badge>
                    <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 border-emerald-200 font-medium">
                      <Clock className="h-3 w-3 mr-1" />
                      {todayCount} hôm nay
                    </Badge>
                  </div>
                </div>
              </div>
              {/* <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={markAllAsRead}
                  className="border-slate-200 text-slate-700 hover:bg-slate-50"
                  disabled={unreadCount === 0}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Đánh dấu tất cả đã đọc
                </Button>
              </div> */}
            </div>
          </div>
        </header>

        <div className="p-6">
          <div className="mb-8 space-y-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                <Input
                  placeholder="Tìm kiếm thông báo..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 border-slate-200 bg-white/80 backdrop-blur-sm focus:bg-white transition-colors"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <div className="relative min-w-[160px]">
                <select
                  className="w-full h-11 pl-4 pr-10 text-sm border border-slate-200 rounded-xl appearance-none bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  value={filterOptions.type}
                  onChange={(e) => setFilterOptions({ ...filterOptions, type: e.target.value })}
                >
                  <option value="all">Tất cả loại</option>
                  <option value="device_alert">System</option>
                  <option value="device_warning">Ticket</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
              </div>
              <div className="relative min-w-[160px]">
                <select
                  className="w-full h-11 pl-4 pr-10 text-sm border border-slate-200 rounded-xl appearance-none bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  value={filterOptions.is_read}
                  onChange={(e) => setFilterOptions({ ...filterOptions, is_read: e.target.value })}
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="unread">Chưa đọc</option>
                  <option value="read">Đã đọc</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
              </div>
            </div>
          </div>

          <Tabs defaultValue="all" className="mb-8">
            <TabsContent value="all" className="mt-6">
              <NotificationGrid
                notifications={filteredNotifications}
                onNotificationClick={handleNotificationClick}
                onMarkAsRead={markAsRead}
                onMarkAsUnread={markAsUnread}
                onDelete={deleteNotification}
                getNotificationIcon={getNotificationIcon}
                getPriorityColor={getPriorityColor}
                getCategoryColor={getCategoryColor}
                getTimeAgo={getTimeAgo}
              />
            </TabsContent>
            {Object.keys(notificationsByCategory).map((category) => (
              <TabsContent key={category} value={category} className="mt-6">
                <NotificationGrid
                  notifications={notificationsByCategory[category]}
                  onNotificationClick={handleNotificationClick}
                  onMarkAsRead={markAsRead}
                  onMarkAsUnread={markAsUnread}
                  onDelete={deleteNotification}
                  getNotificationIcon={getNotificationIcon}
                  getPriorityColor={getPriorityColor}
                  getCategoryColor={getCategoryColor}
                  getTimeAgo={getTimeAgo}
                />
              </TabsContent>
            ))}
          </Tabs>
          {filteredNotifications.length === 0 && !isLoading && (
            <div className="text-center py-16 bg-white/40 backdrop-blur-sm rounded-2xl border border-dashed border-slate-300">
              <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Bell className="h-10 w-10 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-700 mb-2">Không có thông báo nào</h3>
              <p className="text-slate-500">Thử thay đổi bộ lọc để xem thêm thông báo</p>
            </div>
          )}
          {isLoading && (
            <div className="text-center py-16 bg-white/40 backdrop-blur-sm rounded-2xl border border-dashed border-slate-300">
              <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Bell className="h-10 w-10 text-slate-400 animate-pulse" />
              </div>
              <h3 className="text-lg font-semibold text-slate-700 mb-2">Đang tải thông báo...</h3>
            </div>
          )}
        </div>

        <Dialog open={!!selectedNotification} onOpenChange={(open) => !open && setSelectedNotification(null)}>
          <DialogContent className="max-w-4xl h-[90vh] p-0 overflow-hidden">
            <DialogHeader className="sr-only">
              <DialogTitle>Chi tiết thông báo</DialogTitle>
            </DialogHeader>
            {selectedNotification && (
              <NotificationDetail
                notification={selectedNotification}
                onClose={() => setSelectedNotification(null)}
                onMarkAsRead={markAsRead}
                onMarkAsUnread={markAsUnread}
                onDelete={deleteNotification}
                getNotificationIcon={getNotificationIcon}
                getPriorityColor={getPriorityColor}
                getCategoryColor={getCategoryColor}
                getTimeAgo={getTimeAgo}
              />
            )}
          </DialogContent>
        </Dialog>
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Xác nhận xóa</DialogTitle>
              <DialogDescription>
                Bạn có chắc chắn muốn xóa thông báo này không?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(false)}
                style={{ backgroundColor: "#3085d6", color: "white" }}
              >
                Hủy
              </Button>
              <Button
                variant="destructive"
                onClick={confirmDeleteNotification}
                style={{ backgroundColor: "#d33", color: "white" }}
              >
                Xóa
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

function NotificationGrid({
  notifications,
  onNotificationClick,
  onMarkAsRead,
  onMarkAsUnread,
  onDelete,
  getNotificationIcon,
  getPriorityColor,
  getCategoryColor,
  getTimeAgo,
}) {
  return (
    <div className="space-y-3">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          onClick={() => onNotificationClick(notification)}
          className={cn(
            "bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl p-6 cursor-pointer hover:shadow-lg hover:border-blue-300 transition-all duration-300 group relative",
            !notification.is_read && "bg-blue-50/50 border-blue-200 shadow-md",
          )}
        >
          {!notification.is_read && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-blue-500 rounded-full"></div>
          )}
          <div className={cn("flex items-start space-x-4", !notification.is_read && "ml-4")}>
            <div className="flex-shrink-0 mt-1">{getNotificationIcon(notification.type, notification.priority)}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2 mb-1">
                  <Badge variant="secondary" className={cn("text-xs px-2 py-1", getCategoryColor(notification.type || "system"))}>
                    {notification.type === "safety" && "An toàn"}
                    {notification.type === "security" && "Bảo mật"}
                    {notification.type === "environment" && "Môi trường"}
                    {notification.type === "automation" && "Tự động"}
                    {notification.type === "alert" && "Thông báo"}
                    {notification.type === "ticket" && "Yêu Cầu"}
                    {notification.type === "system" && "Hệ thống"}
                  </Badge>
                  <span className="text-xs text-slate-500">{getTimeAgo(notification.created_at)}</span>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {notification.is_read ? (
                      <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onMarkAsUnread(notification.id); }}>
                        <EyeOff className="h-4 w-4 mr-2" />
                        Đánh dấu chưa đọc
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onMarkAsRead(notification.id); }}>
                        <Eye className="h-4 w-4 mr-2" />
                        Đánh dấu đã đọc
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      onClick={(e) => { e.stopPropagation(); onDelete(notification.id); }}
                      className="text-red-600"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Xóa thông báo
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <p className={cn("text-slate-700 mb-3 leading-relaxed", !notification.is_read && "font-medium text-slate-900")}>
                {notification.text}
              </p>
              <div className="flex items-center justify-between mt-3 text-xs text-slate-500">
                <span>Account: {notification.account_id}</span>
                {notification.role_id !== null && (
                  <span>Role: {notification.role_id === 1 ? "Admin" : notification.role_id === 2 ? "User" : "Guest"}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}