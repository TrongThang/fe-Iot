"use client";

import { useState, useEffect } from "react";
import {
  Bell,
  Calendar,
  ChevronDown,
  LogOut,
  Settings,
  User,
  Search,
  Menu,
  X,
  Thermometer,
  Lightbulb,
  Shield,
  Wifi,
  WifiOff,
  PanelLeftClose,
  PanelLeftOpen,
  AlertTriangle,
  CheckCircle,
  Info,
} from "lucide-react";
import { useSidebar } from "./contexts/Sidebar-context";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import axiosPrivate from "@/apis/clients/private.client";

const Topbar = () => {
  const { isOpen, toggle } = useSidebar();
  const [notifications, setNotifications] = useState([]);
  const [isOnline, setIsOnline] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("authToken");

  useEffect(() => {
    fetchNotifications();
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchNotifications = async () => {
    if (!accessToken) {
      toast.error("Vui lòng đăng nhập để xem thông báo.");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const res = await fetch(`http://localhost:7777/api/notifications/user`, {
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
          id: notif.id,
          title: notif.type === "ticket" ? "Ticket mới" : "Thông báo hệ thống",
          message: notif.text,
          time: getTimeAgo(notif.created_at),
          type: notif.type,
          is_read: notif.is_read,
          icon: getNotificationIcon(notif.type),
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

  const getTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    if (diffInMinutes < 1) return "Vừa xong";
    if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} giờ trước`;
    return `${Math.floor(diffInMinutes / 1440)} ngày trước`;
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "system":
        return Info;
      case "ticket":
        return AlertTriangle;
      default:
        return Bell;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case "ticket":
        return "text-orange-600";
      case "system":
        return "text-blue-600";
      default:
        return "text-blue-600";
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const res = await axiosPrivate.put(`/notifications/${notificationId}`, {
        is_read: true,
      });
      if (res) {
        setNotifications((prev) =>
          prev.map((notif) =>
            notif.id === notificationId ? { ...notif, is_read: true } : notif
          )
        );
        toast.success("Đã đánh dấu thông báo là đã đọc!");
      } else {
        throw new Error("Không thể cập nhật trạng thái thông báo");
      }
    } catch (error) {
      toast.error(error.message || "Đã xảy ra lỗi khi đánh dấu đã đọc. Vui lòng thử lại.");
    }
  };

  const time = currentTime.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const date = currentTime.toLocaleDateString("vi-VN", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Đã đăng xuất!");
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      const errorMessage = error.response?.data?.message || "Đăng xuất thất bại. Vui lòng thử lại.";
      toast.error(errorMessage);
    }
  };

  return (
    <header
      className={`fixed top-0 right-0 h-24 z-40 bg-gradient-to-b from-blue-900 to-blue-950 shadow-lg transition-all duration-300 ${isOpen ? "left-[232px]" : "left-16"
        }`}
    >
      <div className="flex items-center justify-between h-full px-4 md:px-8">
        {/* Left Side - Sidebar Toggle & Search */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggle}
            className="p-2 rounded-lg text-white hover:bg-blue-800/50 transition-colors"
            title={isOpen ? "Thu gọn sidebar" : "Mở rộng sidebar"}
          >
            {isOpen ? <PanelLeftClose className="w-6 h-6" /> : <PanelLeftOpen className="w-6 h-6" />}
          </button>
          <button
            onClick={toggleMobileMenu}
            className="lg:hidden p-2 rounded-lg text-white hover:bg-blue-800/50 transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <button
            onClick={toggleSearch}
            className="md:hidden p-2 rounded-lg text-white hover:bg-blue-800/50 transition-colors"
          >
            <Search className="w-5 h-5" />
          </button>
        </div>

        {/* Right Side - Time, Notifications, User */}
        <div className="flex items-center gap-2 md:gap-6">
          {/* Time Display */}
          <div className="hidden md:block text-right">
            <div className="font-bold text-xl text-white font-mono">{time}</div>
            <div className="text-xs text-blue-200 capitalize">{date}</div>
          </div>

          {/* Notifications */}
          <div className="relative group">
            <button className="p-2 hover:bg-white/10 rounded-lg transition-all duration-200 group-hover:bg-white/10">
              <Bell className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
              {notifications.filter((n) => !n.is_read).length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold animate-pulse">
                  {notifications.filter((n) => !n.is_read).length > 99
                    ? "99+"
                    : notifications.filter((n) => !n.is_read).length}
                </span>
              )}
            </button>

            {/* Dropdown Content */}
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border-0 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-right scale-95 group-hover:scale-100">
              <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-xl">
                <h3 className="font-bold text-lg text-gray-800">Thông báo SmartHome</h3>
                <p className="text-sm text-gray-600">Cập nhật từ hệ thống IoT</p>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <div
                      key={item.id}
                      onClick={() => markAsRead(item.id)}
                      className={`flex items-start p-4 gap-3 cursor-pointer hover:bg-gray-50 border-b border-gray-100 last:border-b-0 ${item.is_read ? "opacity-50" : ""}`}
                    >
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${item.type === "ticket"
                          ? "bg-orange-100"
                          : item.type === "system"
                            ? "bg-blue-100"
                            : "bg-blue-100"
                          }`}
                      >
                        <IconComponent className={`w-5 h-5 ${getNotificationColor(item.type)}`} />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-800 text-lg">{item.title}</div>
                        <div className="text-sm text-gray-600 mt-1">{item.message}</div>
                        <div className="text-xs text-gray-400 mt-2">{item.time}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="p-3 text-center border-t">
                <Link to="/notifications" className="text-blue-600 font-medium hover:text-blue-800 text-sm">
                  Xem tất cả thông báo
                </Link>
              </div>
            </div>
          </div>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 hover:bg-white/10 p-2 rounded-lg transition-all duration-200">
                <div className="h-8 w-8 rounded-full bg-white/20 flex justify-center items-center border-2 border-white/30">
                  <Avatar>
                    <AvatarImage
                      src={
                        user?.image && user?.image.trim() !== ""
                          ? `${user?.image}`
                          : undefined
                      }
                      alt="Customer Avatar"
                      className="h-7 w-7 rounded-full"
                    />
                    {(!user?.image || user?.image.trim() === "") && (
                      <User className="w-4 h-4 text-white" />
                    )}
                  </Avatar>
                </div>
                <div className="hidden md:flex flex-col items-start">
                  <span className="text-sm font-semibold text-white">{user?.username}</span>
                  <span className="text-xs text-blue-200">{user?.role || ""}</span>
                </div>
                <ChevronDown className="w-4 h-4 hidden md:block text-white" />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-72 p-0">
              {/* Header */}
              <div className="flex flex-col items-center p-6 gap-3 border-b bg-gradient-to-br from-blue-50 to-blue-100 rounded-t-xl">
                <div className="h-20 w-20 rounded-full bg-blue-500 flex items-center justify-center border-4 border-gray-300">
                  <Avatar>
                    <AvatarImage
                      src={
                        user?.image && user?.image.trim() !== ""
                          ? `${user?.image}`
                          : undefined
                      }
                      alt="Customer Avatar"
                      className="h-19 w-19 rounded-full"
                    />
                    {(!user?.image || user?.image.trim() === "") && (
                      <User className="w-10 h-10 text-white" />
                    )}
                  </Avatar>
                </div>
                <div className="text-center">
                  <div className="font-bold text-lg text-gray-800">{user?.username}</div>
                  <div className="text-sm text-gray-600">{user?.email}</div>
                  <div className="mt-2 bg-blue-100 text-blue-700 text-xs font-medium px-2.5 py-0.5 rounded-full inline-block">
                    {user?.role || ""}
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="p-2 bg-white">
                <DropdownMenuItem asChild>
                  <Link
                    to="/profile"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 transition-colors w-full"
                  >
                    <User className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-gray-700 text-sm">Hồ sơ của tôi</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link
                    to="/calendar"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 transition-colors w-full"
                  >
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-gray-700 text-sm">Lịch điều khiển</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link
                    to="/settings"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 transition-colors w-full"
                  >
                    <Settings className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-gray-700 text-sm">Cài đặt hệ thống</span>
                  </Link>
                </DropdownMenuItem>

                <div className="h-px bg-gray-200 my-2"></div>

                <DropdownMenuItem asChild>
                  <a
                    onClick={handleLogout}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-red-50 text-red-600 transition-colors w-full"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium text-sm">Đăng xuất</span>
                  </a>
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {isSearchOpen && (
        <div className="md:hidden px-4 py-3 bg-blue-800">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-blue-300" />
            <input
              type="text"
              placeholder="Tìm kiếm thiết bị..."
              className="w-full bg-blue-700 border-none rounded-lg py-2 pl-10 pr-4 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              autoFocus
            />
            <button
              onClick={toggleSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-300"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Topbar;