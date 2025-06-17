"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
    Smartphone,
    Monitor,
    Tablet,
    Laptop,
    MapPin,
    Clock,
    Shield,
    AlertTriangle,
    LogOut,
    Eye,
    Settings,
    Activity,
    Wifi,
    Globe,
    User,
    Calendar,
    Bell,
} from "lucide-react"

const activeSessions = [
    {
        id: 1,
        device: "iPhone 14 Pro",
        deviceType: "mobile",
        browser: "Safari 16.0",
        os: "iOS 16.4",
        location: "Hồ Chí Minh, Việt Nam",
        ip: "192.168.1.100",
        loginTime: "2024-01-15 09:30:00",
        lastActivity: "2024-01-15 14:25:00",
        status: "active",
        isCurrent: true,
    },
    {
        id: 2,
        device: "MacBook Pro",
        deviceType: "desktop",
        browser: "Chrome 120.0",
        os: "macOS Sonoma",
        location: "Hồ Chí Minh, Việt Nam",
        ip: "192.168.1.101",
        loginTime: "2024-01-15 08:00:00",
        lastActivity: "2024-01-15 14:20:00",
        status: "active",
        isCurrent: false,
    },
    {
        id: 3,
        device: "Samsung Galaxy Tab",
        deviceType: "tablet",
        browser: "Chrome Mobile 120.0",
        os: "Android 13",
        location: "Hà Nội, Việt Nam",
        ip: "203.162.4.191",
        loginTime: "2024-01-14 19:45:00",
        lastActivity: "2024-01-15 12:10:00",
        status: "idle",
        isCurrent: false,
    },
    {
        id: 4,
        device: "Windows PC",
        deviceType: "desktop",
        browser: "Edge 120.0",
        os: "Windows 11",
        location: "Đà Nẵng, Việt Nam",
        ip: "115.78.45.123",
        loginTime: "2024-01-13 16:20:00",
        lastActivity: "2024-01-14 23:55:00",
        status: "inactive",
        isCurrent: false,
    },
]

const activityLogs = [
    {
        id: 1,
        action: "Đăng nhập",
        device: "iPhone 14 Pro",
        location: "Hồ Chí Minh, Việt Nam",
        timestamp: "2024-01-15 09:30:00",
        type: "login",
    },
    {
        id: 2,
        action: "Đăng nhập",
        device: "MacBook Pro",
        location: "Hồ Chí Minh, Việt Nam",
        timestamp: "2024-01-15 08:00:00",
        type: "login",
    },
    {
        id: 3,
        action: "Đăng xuất",
        device: "iPad Air",
        location: "Hồ Chí Minh, Việt Nam",
        timestamp: "2024-01-14 22:30:00",
        type: "logout",
    },
    {
        id: 4,
        action: "Đăng nhập thất bại",
        device: "Unknown Device",
        location: "Hà Nội, Việt Nam",
        timestamp: "2024-01-14 20:15:00",
        type: "failed",
    },
    {
        id: 5,
        action: "Đăng nhập",
        device: "Samsung Galaxy Tab",
        location: "Hà Nội, Việt Nam",
        timestamp: "2024-01-14 19:45:00",
        type: "login",
    },
]

const securityAlerts = [
    {
        id: 1,
        title: "Đăng nhập từ thiết bị mới",
        description: "Có người đăng nhập từ Windows PC tại Đà Nẵng",
        timestamp: "2024-01-13 16:20:00",
        severity: "medium",
        resolved: false,
    },
    {
        id: 2,
        title: "Nhiều lần đăng nhập thất bại",
        description: "5 lần thử đăng nhập thất bại từ IP 203.162.4.200",
        timestamp: "2024-01-14 20:15:00",
        severity: "high",
        resolved: true,
    },
]

export default function UserActivity() {
    const [sessions, setSessions] = useState(activeSessions)
    const [notifications, setNotifications] = useState(true)
    const [twoFactorAuth, setTwoFactorAuth] = useState(true)

    const getDeviceIcon = (deviceType) => {
        switch (deviceType) {
            case "mobile":
                return Smartphone
            case "tablet":
                return Tablet
            case "desktop":
                return Monitor
            case "laptop":
                return Laptop
            default:
                return Monitor
        }
    }

    const getStatusColor = (status) => {
        switch (status) {
            case "active":
                return "bg-green-500"
            case "idle":
                return "bg-yellow-500"
            case "inactive":
                return "bg-gray-400"
            default:
                return "bg-gray-400"
        }
    }

    const getStatusText = (status) => {
        switch (status) {
            case "active":
                return "Đang hoạt động"
            case "idle":
                return "Không hoạt động"
            case "inactive":
                return "Ngừng hoạt động"
            default:
                return "Không xác định"
        }
    }

    const terminateSession = (sessionId) => {
        setSessions(sessions.filter((session) => session.id !== sessionId))
    }

    const terminateAllSessions = () => {
        setSessions(sessions.filter((session) => session.isCurrent))
    }

    const formatDateTime = (dateTime) => {
        return new Date(dateTime).toLocaleString("vi-VN")
    }

    return (
        <div className=" p-6 ">
            <div className="mb-6">
                <h1 className="text-3xl font-bold mb-2">Hoạt động người dùng</h1>
                <p className="text-muted-foreground text-xl">Theo dõi tình trạng đăng nhập trên nhiều thiết bị</p>
            </div>

            <Tabs defaultValue="sessions" className="space-y-6">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="sessions" className="flex items-center gap-2 py-2">
                        <Activity className="w-4 h-4" />
                        Phiên đăng nhập
                    </TabsTrigger>
                    <TabsTrigger value="activity" className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Lịch sử hoạt động
                    </TabsTrigger>
                    <TabsTrigger value="security" className="flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        Cảnh báo bảo mật
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="sessions" className="space-y-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-xl font-semibold">Phiên đăng nhập hiện tại</h2>
                            <p className="text-sm text-muted-foreground">{sessions.length} thiết bị đang đăng nhập</p>
                        </div>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                                    <LogOut className="w-4 h-4 mr-2" />
                                    Đăng xuất tất cả
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="bg-white">
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Đăng xuất tất cả thiết bị?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Hành động này sẽ đăng xuất khỏi tất cả thiết bị trừ thiết bị hiện tại. Bạn sẽ cần đăng nhập lại trên
                                        các thiết bị khác.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Hủy</AlertDialogCancel>
                                    <AlertDialogAction onClick={terminateAllSessions} className="bg-red-600 hover:bg-red-700">
                                        Đăng xuất tất cả
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>

                    <div className="grid gap-4">
                        {sessions.map((session) => {
                            const DeviceIcon = getDeviceIcon(session.deviceType)

                            return (
                                <Card key={session.id} className={session.isCurrent ? "ring-2 ring-blue-500 bg-blue-50/50" : ""}>
                                    <CardContent className="p-6">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-start gap-4">
                                                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-blue-100">
                                                    <DeviceIcon className="w-6 h-6 text-blue-600" />
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2">
                                                        <h3 className="font-semibold">{session.device}</h3>
                                                        {session.isCurrent && (
                                                            <Badge variant="default" className="text-xs">
                                                                Thiết bị hiện tại
                                                            </Badge>
                                                        )}
                                                        <div className="flex items-center gap-1">
                                                            <div className={`w-2 h-2 rounded-full ${getStatusColor(session.status)}`} />
                                                            <span className="text-xs text-muted-foreground">{getStatusText(session.status)}</span>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-1 text-sm text-muted-foreground">
                                                        <div className="flex items-center gap-2">
                                                            <Globe className="w-4 h-4" />
                                                            <span>
                                                                {session.browser} • {session.os}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <MapPin className="w-4 h-4" />
                                                            <span>{session.location}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Wifi className="w-4 h-4" />
                                                            <span>{session.ip}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Clock className="w-4 h-4" />
                                                            <span>Đăng nhập: {formatDateTime(session.loginTime)}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Activity className="w-4 h-4" />
                                                            <span>Hoạt động cuối: {formatDateTime(session.lastActivity)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            {!session.isCurrent && (
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50">
                                                            <LogOut className="w-4 h-4 mr-2" />
                                                            Đăng xuất
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent className="bg-white">
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Đăng xuất thiết bị?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                Bạn có chắc chắn muốn đăng xuất khỏi {session.device}? Thiết bị này sẽ cần đăng nhập lại
                                                                để truy cập tài khoản.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Hủy</AlertDialogCancel>
                                                            <AlertDialogAction
                                                                onClick={() => terminateSession(session.id)}
                                                                className="bg-red-600 hover:bg-red-700"
                                                            >
                                                                Đăng xuất
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>
                </TabsContent>

                <TabsContent value="activity" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Clock className="w-5 h-5" />
                                Lịch sử hoạt động
                            </CardTitle>
                            <CardDescription>Theo dõi các hoạt động đăng nhập/đăng xuất gần đây</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {activityLogs.map((log, index) => (
                                    <div key={log.id}>
                                        <div className="flex items-start gap-4">
                                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100">
                                                {log.type === "login" && <User className="w-4 h-4 text-blue-600" />}
                                                {log.type === "logout" && <LogOut className="w-4 h-4 text-gray-600" />}
                                                {log.type === "failed" && <AlertTriangle className="w-4 h-4 text-red-600" />}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium">{log.action}</span>
                                                    <Badge
                                                        variant={
                                                            log.type === "failed" ? "destructive" : log.type === "logout" ? "secondary" : "default"
                                                        }
                                                        className="text-xs"
                                                    >
                                                        {log.type === "login" && "Thành công"}
                                                        {log.type === "logout" && "Đăng xuất"}
                                                        {log.type === "failed" && "Thất bại"}
                                                    </Badge>
                                                </div>
                                                <div className="text-sm text-muted-foreground mt-1">
                                                    <div>{log.device}</div>
                                                    <div className="flex items-center gap-4 mt-1">
                                                        <span className="flex items-center gap-1">
                                                            <MapPin className="w-3 h-3" />
                                                            {log.location}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Calendar className="w-3 h-3" />
                                                            {formatDateTime(log.timestamp)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {index < activityLogs.length - 1 && <Separator className="mt-4" />}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="security" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Shield className="w-5 h-5" />
                                Cảnh báo bảo mật
                            </CardTitle>
                            <CardDescription>Các cảnh báo và hoạt động đáng ngờ</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {securityAlerts.map((alert, index) => (
                                    <div key={alert.id}>
                                        <div className="flex items-start gap-4">
                                            <div
                                                className={`flex items-center justify-center w-8 h-8 rounded-full ${alert.severity === "high" ? "bg-red-100" : "bg-yellow-100"
                                                    }`}
                                            >
                                                <AlertTriangle
                                                    className={`w-4 h-4 ${alert.severity === "high" ? "text-red-600" : "text-yellow-600"}`}
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium">{alert.title}</span>
                                                    <Badge variant={alert.severity === "high" ? "destructive" : "secondary"} className="text-xs">
                                                        {alert.severity === "high" ? "Cao" : "Trung bình"}
                                                    </Badge>
                                                    {alert.resolved && (
                                                        <Badge variant="outline" className="text-xs text-green-600">
                                                            Đã xử lý
                                                        </Badge>
                                                    )}
                                                </div>
                                                <div className="text-sm text-muted-foreground mt-1">
                                                    <div>{alert.description}</div>
                                                    <div className="flex items-center gap-1 mt-1">
                                                        <Calendar className="w-3 h-3" />
                                                        {formatDateTime(alert.timestamp)}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {index < securityAlerts.length - 1 && <Separator className="mt-4" />}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="settings" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Settings className="w-5 h-5" />
                                Cài đặt bảo mật
                            </CardTitle>
                            <CardDescription>Quản lý các tùy chọn bảo mật cho tài khoản</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <Label className="text-base font-medium">Thông báo đăng nhập</Label>
                                    <p className="text-sm text-muted-foreground">Nhận thông báo khi có đăng nhập từ thiết bị mới</p>
                                </div>
                                <Switch checked={notifications} onCheckedChange={setNotifications} />
                            </div>

                            <Separator />

                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <Label className="text-base font-medium">Xác thực hai yếu tố</Label>
                                    <p className="text-sm text-muted-foreground">Bảo vệ tài khoản bằng xác thực hai yếu tố</p>
                                </div>
                                <Switch checked={twoFactorAuth} onCheckedChange={setTwoFactorAuth} />
                            </div>

                            <Separator />

                            <div className="space-y-3">
                                <Label className="text-base font-medium">Hành động bảo mật</Label>
                                <div className="space-y-2">
                                    <Button variant="outline" className="w-full justify-start">
                                        <Eye className="w-4 h-4 mr-2" />
                                        Xem thiết bị đã lưu
                                    </Button>
                                    <Button variant="outline" className="w-full justify-start">
                                        <Bell className="w-4 h-4 mr-2" />
                                        Cài đặt thông báo
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50"
                                    >
                                        <Shield className="w-4 h-4 mr-2" />
                                        Đổi mật khẩu
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
