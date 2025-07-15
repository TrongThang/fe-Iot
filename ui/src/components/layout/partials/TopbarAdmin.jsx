"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { useSidebar } from "./contexts/Sidebar-context";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

const TopbarAdmin = () => {
  const { isOpen, toggle } = useSidebar();
  const { employee, logoutEmployee } = useAuth();
  const [notifications, setNotifications] = useState(3);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();
  // Mock notification data (có thể thay bằng API call)
  const notificationItems = [
    {
      id: 1,
      title: "Cảnh báo nhiệt độ",
      message: "Nhiệt độ phòng khách đã vượt quá 28°C",
      time: "2 phút trước",
      type: "warning",
      icon: Thermometer,
    }
  ];

  const handleLogout = async () => {
    try {
      await logoutEmployee(); // Gọi hàm logout từ useAuth
      toast.success("Đăng xuất thành công!");
      navigate("/admin/login");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Đăng xuất thất bại. Vui lòng thử lại.");
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case "warning":
        return "text-orange-600";
      case "success":
        return "text-green-600";
      case "alert":
        return "text-red-600";
      default:
        return "text-blue-600";
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

        {/* Right Side - Notifications, User */}
        <div className="flex items-center gap-2 md:gap-6">
          {/* Notifications */}
          <div className="relative group">
            <button className="p-2 hover:bg-white/10 rounded-lg transition-all duration-200 group-hover:bg-white/10">
              <Bell className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold animate-pulse">
                  {notifications}
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
                {notificationItems.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <div
                      key={item.id}
                      className="flex items-start p-4 gap-3 cursor-pointer hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                    >
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${item.type === "warning"
                          ? "bg-orange-100"
                          : item.type === "success"
                            ? "bg-green-100"
                            : item.type === "alert"
                              ? "bg-red-100"
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
                <a
                  href="/admin/notifications"
                  className="text-blue-600 font-medium hover:text-blue-800 text-sm"
                >
                  Xem tất cả thông báo
                </a>
              </div>
            </div>
          </div>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 hover:bg-white/10 p-2 rounded-lg transition-all duration-200">
                <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center border-2 border-white/30">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="hidden md:flex flex-col items-start">
                  <span className="text-sm font-semibold text-white">{employee?.username}</span>
                  <span className="text-xs text-blue-200">{employee?.role?.name}</span>
                </div>
                <ChevronDown className="w-4 h-4 hidden md:block text-white" />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-72 p-0">
              {/* Header */}
              <div className="flex flex-col items-center p-6 gap-3 border-b bg-gradient-to-br from-blue-50 to-blue-100 rounded-t-xl">
                <div className="h-20 w-20 rounded-full bg-blue-500 flex items-center justify-center border-4 border-white">
                  <User className="w-10 h-10 text-white" />
                </div>
                <div className="text-center">
                  <div className="font-bold text-lg text-gray-800">{employee?.username}</div>
                  <div className="text-sm text-gray-600">{employee?.username}</div>
                  <div className="mt-2 bg-blue-100 text-blue-700 text-xs font-medium px-2.5 py-0.5 rounded-full inline-block">
                    {employee?.role?.name ? (employee.role.name === "admin" ? "Quản trị viên" : employee.role.name) : "Quản trị viên"}
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="p-2 bg-white">

                <DropdownMenuItem asChild>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-red-50 text-red-600 transition-colors w-full"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium text-sm">Đăng xuất</span>
                  </button>
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

export default TopbarAdmin;