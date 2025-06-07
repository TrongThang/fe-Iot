"use client"

import { useState, useEffect } from "react"
import { Bell, Calendar, ChevronDown, LogOut, Settings, User, Search, Menu, X, Thermometer, Lightbulb, Shield, Wifi, WifiOff, PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { useSidebar } from "./contexts/Sidebar-context"
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";
const TopbarAdmin = () => {
    const { isOpen, toggle } = useSidebar()
    const [notifications, setNotifications] = useState(3)
    const [isOnline, setIsOnline] = useState(true)
    const [currentTime, setCurrentTime] = useState(new Date())
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isSearchOpen, setIsSearchOpen] = useState(false)

    // Update time every second
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date())
        }, 1000)
        return () => clearInterval(timer)
    }, [])

    // Mock IoT status data
    const iotStatus = {
        temperature: "24°C",
        connectedDevices: 12,
        activeDevices: 8,
        securityStatus: "Bảo mật",
    }

    // Notification data for SmartHome
    const notificationItems = [
        {
            id: 1,
            title: "Cảnh báo nhiệt độ",
            message: "Nhiệt độ phòng khách đã vượt quá 28°C",
            time: "2 phút trước",
            type: "warning",
            icon: Thermometer,
        },
        {
            id: 2,
            title: "Thiết bị kết nối",
            message: "Đèn LED phòng ngủ đã được kết nối",
            time: "5 phút trước",
            type: "success",
            icon: Lightbulb,
        },
        {
            id: 3,
            title: "Bảo mật",
            message: "Phát hiện chuyển động tại cửa chính",
            time: "10 phút trước",
            type: "alert",
            icon: Shield,
        },
    ]

    // User data
    const username = "Nguyễn Văn A"
    const email = "nguyenvana@smarthome.com"
    const role = "Quản trị viên"

    const time = currentTime.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    })
    const date = currentTime.toLocaleDateString("vi-VN", {
        weekday: "long",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    })

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen)
    }

    const toggleSearch = () => {
        setIsSearchOpen(!isSearchOpen)
    }

    const getNotificationColor = (type) => {
        switch (type) {
            case "warning":
                return "text-orange-600"
            case "success":
                return "text-green-600"
            case "alert":
                return "text-red-600"
            default:
                return "text-blue-600"
        }
    }

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

                {/* Center - IoT Status */}
                <div className="hidden lg:flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2 backdrop-blur-sm">
                        {isOnline ? <Wifi className="w-4 h-4 text-green-400" /> : <WifiOff className="w-4 h-4 text-red-400" />}
                        <span className="text-sm text-white font-medium">
                            {iotStatus.connectedDevices}/{iotStatus.activeDevices} thiết bị
                        </span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2 backdrop-blur-sm">
                        <Thermometer className="w-4 h-4 text-blue-300" />
                        <span className="text-sm text-white font-medium">{iotStatus.temperature}</span>
                    </div>
                    <div className="bg-green-500/20 text-green-300 border border-green-400/30 rounded-lg px-3 py-1 text-sm">
                        {iotStatus.securityStatus}
                    </div>
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
                                    const IconComponent = item.icon
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
                                    )
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
                                <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center border-2 border-white/30">
                                    <User className="w-4 h-4 text-white" />
                                </div>
                                <div className="hidden md:flex flex-col items-start">
                                    <span className="text-sm font-semibold text-white">{username}</span>
                                    <span className="text-xs text-blue-200">{role}</span>
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
                                    <div className="font-bold text-lg text-gray-800">{username}</div>
                                    <div className="text-sm text-gray-600">{email}</div>
                                    <div className="mt-2 bg-blue-100 text-blue-700 text-xs font-medium px-2.5 py-0.5 rounded-full inline-block">
                                        {role}
                                    </div>
                                </div>
                            </div>

                            {/* Menu Items */}
                            <div className="p-2 bg-white">
                                <DropdownMenuItem asChild>
                                    <a
                                        href="/profile"
                                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 transition-colors w-full"
                                    >
                                        <User className="w-5 h-5 text-blue-600" />
                                        <span className="font-medium text-gray-700 text-sm">Hồ sơ của tôi</span>
                                    </a>
                                </DropdownMenuItem>

                                <DropdownMenuItem asChild>
                                    <a
                                        href="/calendar"
                                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 transition-colors w-full"
                                    >
                                        <Calendar className="w-5 h-5 text-blue-600" />
                                        <span className="font-medium text-gray-700 text-sm">Lịch điều khiển</span>
                                    </a>
                                </DropdownMenuItem>

                                <DropdownMenuItem asChild>
                                    <a
                                        href="/settings"
                                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 transition-colors w-full"
                                    >
                                        <Settings className="w-5 h-5 text-blue-600" />
                                        <span className="font-medium text-gray-700 text-sm">Cài đặt hệ thống</span>
                                    </a>
                                </DropdownMenuItem>

                                <div className="h-px bg-gray-200 my-2"></div>

                                <DropdownMenuItem asChild>
                                    <a
                                        href="/logout"
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
    )
}

export default TopbarAdmin
