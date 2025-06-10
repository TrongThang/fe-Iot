"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Activity,
    Users,
    Smartphone,
    Wifi,
    WifiOff,
    TrendingUp,
    AlertTriangle,
    CheckCircle,
    Clock,
    Zap,
    Shield,
    Globe,
    Server,
    Database,
    Bell,
    Download,
    RefreshCw,
    BarChart3,
    PieChart,
    LineChart,
    MapPin,
    Thermometer,
    Lightbulb,
    Camera,
    Router,
    Battery,
    Signal,
} from "lucide-react"

export default function DashboardAdmin() {
    const [timeRange, setTimeRange] = useState("24h")
    const [refreshing, setRefreshing] = useState(false)

    // Mock data cho dashboard
    const dashboardStats = {
        totalDevices: 15847,
        activeDevices: 14203,
        offlineDevices: 1644,
        totalUsers: 8934,
        activeUsers: 6721,
        dataTransfer: "2.4TB",
        alerts: 23,
        systemHealth: 98.7,
    }

    const devicesByType = [
        { type: "Smart Lights", count: 4521, percentage: 28.5, icon: Lightbulb, color: "bg-yellow-500" },
        { type: "Sensors", count: 3892, percentage: 24.6, icon: Thermometer, color: "bg-blue-500" },
        { type: "Cameras", count: 2834, percentage: 17.9, icon: Camera, color: "bg-purple-500" },
        { type: "Routers", count: 2156, percentage: 13.6, icon: Router, color: "bg-green-500" },
        { type: "Smart Plugs", count: 1789, percentage: 11.3, icon: Zap, color: "bg-orange-500" },
        { type: "Others", count: 655, percentage: 4.1, icon: Smartphone, color: "bg-gray-500" },
    ]

    const recentAlerts = [
        {
            id: 1,
            type: "critical",
            message: "Sensor nhiệt độ SN001 ngừng hoạt động",
            time: "5 phút trước",
            location: "Tầng 3 - Phòng A301",
        },
        {
            id: 2,
            type: "warning",
            message: "Băng thông vượt ngưỡng 80%",
            time: "12 phút trước",
            location: "Data Center",
        },
        {
            id: 3,
            type: "info",
            message: "Cập nhật firmware thành công cho 150 thiết bị",
            time: "1 giờ trước",
            location: "Toàn hệ thống",
        },
        {
            id: 4,
            type: "warning",
            message: "Pin yếu trên 5 thiết bị cảm biến",
            time: "2 giờ trước",
            location: "Khu vực B",
        },
    ]

    const topLocations = [
        { name: "TP. Hồ Chí Minh", devices: 4521, users: 2834, status: "healthy" },
        { name: "Hà Nội", devices: 3892, users: 2156, status: "healthy" },
        { name: "Đà Nẵng", devices: 2156, users: 1432, status: "warning" },
        { name: "Cần Thơ", devices: 1789, users: 987, status: "healthy" },
        { name: "Hải Phòng", devices: 1234, users: 765, status: "critical" },
    ]

    const performanceMetrics = [
        { label: "CPU Usage", value: 67, unit: "%", status: "normal", icon: Server },
        { label: "Memory", value: 82, unit: "%", status: "warning", icon: Database },
        { label: "Network", value: 45, unit: "Mbps", status: "normal", icon: Wifi },
        { label: "Storage", value: 34, unit: "%", status: "normal", icon: Database },
    ]

    const getAlertIcon = (type) => {
        switch (type) {
            case "critical":
                return <AlertTriangle className="w-4 h-4 text-red-500" />
            case "warning":
                return <Clock className="w-4 h-4 text-yellow-500" />
            case "info":
                return <CheckCircle className="w-4 h-4 text-blue-500" />
            default:
                return <Bell className="w-4 h-4 text-gray-500" />
        }
    }

    const getStatusColor = (status) => {
        switch (status) {
            case "healthy":
                return "bg-green-100 text-green-800"
            case "warning":
                return "bg-yellow-100 text-yellow-800"
            case "critical":
                return "bg-red-100 text-red-800"
            default:
                return "bg-gray-100 text-gray-800"
        }
    }

    const handleRefresh = () => {
        setRefreshing(true)
        setTimeout(() => setRefreshing(false), 2000)
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                        <p className="text-gray-600 mt-1 text-lg">Tổng quan hệ thống IoT và thiết bị kết nối</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Select value={timeRange} onValueChange={setTimeRange}>
                            <SelectTrigger className="w-32">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-white">
                                <SelectItem value="1h">1 giờ</SelectItem>
                                <SelectItem value="24h">24 giờ</SelectItem>
                                <SelectItem value="7d">7 ngày</SelectItem>
                                <SelectItem value="30d">30 ngày</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button variant="outline" onClick={handleRefresh} disabled={refreshing}>
                            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
                            Làm mới
                        </Button>
                        <Button>
                            <Download className="w-4 h-4 mr-2" />
                            Xuất báo cáo
                        </Button>
                    </div>
                </div>

                {/* Main Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card className="border-l-4 border-l-blue-500">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Tổng thiết bị</p>
                                    <p className="text-3xl font-bold text-gray-900">{dashboardStats.totalDevices.toLocaleString()}</p>
                                    <div className="flex items-center mt-2">
                                        <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                                        <span className="text-sm text-green-600">+12% so với tháng trước</span>
                                    </div>
                                </div>
                                <div className="p-3 bg-blue-100 rounded-full">
                                    <Smartphone className="w-8 h-8 text-blue-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-green-500">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Thiết bị hoạt động</p>
                                    <p className="text-3xl font-bold text-gray-900">{dashboardStats.activeDevices.toLocaleString()}</p>
                                    <div className="flex items-center mt-2">
                                        <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                                        <span className="text-sm text-green-600">
                                            {((dashboardStats.activeDevices / dashboardStats.totalDevices) * 100).toFixed(1)}% uptime
                                        </span>
                                    </div>
                                </div>
                                <div className="p-3 bg-green-100 rounded-full">
                                    <Wifi className="w-8 h-8 text-green-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-purple-500">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Người dùng hoạt động</p>
                                    <p className="text-3xl font-bold text-gray-900">{dashboardStats.activeUsers.toLocaleString()}</p>
                                    <div className="flex items-center mt-2">
                                        <TrendingUp className="w-4 h-4 text-purple-500 mr-1" />
                                        <span className="text-sm text-purple-600">+8% so với tuần trước</span>
                                    </div>
                                </div>
                                <div className="p-3 bg-purple-100 rounded-full">
                                    <Users className="w-8 h-8 text-purple-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-orange-500">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Cảnh báo</p>
                                    <p className="text-3xl font-bold text-gray-900">{dashboardStats.alerts}</p>
                                    <div className="flex items-center mt-2">
                                        <AlertTriangle className="w-4 h-4 text-orange-500 mr-1" />
                                        <span className="text-sm text-orange-600">5 cảnh báo quan trọng</span>
                                    </div>
                                </div>
                                <div className="p-3 bg-orange-100 rounded-full">
                                    <Bell className="w-8 h-8 text-orange-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts and Analytics */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Device Distribution */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <PieChart className="w-5 h-5" />
                                Phân bố thiết bị theo loại
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {devicesByType.map((device, index) => {
                                    const IconComponent = device.icon
                                    return (
                                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 ${device.color} rounded-lg`}>
                                                    <IconComponent className="w-5 h-5 text-white" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{device.type}</p>
                                                    <p className="text-sm text-gray-600">{device.count.toLocaleString()} thiết bị</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-gray-900">{device.percentage}%</p>
                                                <div className="w-20 h-2 bg-gray-200 rounded-full mt-1">
                                                    <div
                                                        className={`h-2 ${device.color} rounded-full`}
                                                        style={{ width: `${device.percentage}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </CardContent>
                    </Card>

                    {/* System Performance */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Activity className="w-5 h-5" />
                                Hiệu suất hệ thống
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {performanceMetrics.map((metric, index) => {
                                const IconComponent = metric.icon
                                return (
                                    <div key={index} className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <IconComponent className="w-4 h-4 text-gray-500" />
                                                <span className="text-sm font-medium">{metric.label}</span>
                                            </div>
                                            <span className="text-sm font-bold">
                                                {metric.value}
                                                {metric.unit}
                                            </span>
                                        </div>
                                        <div className="w-full h-2 bg-gray-200 rounded-full">
                                            <div
                                                className={`h-2 rounded-full ${metric.status === "warning"
                                                    ? "bg-yellow-500"
                                                    : metric.status === "critical"
                                                        ? "bg-red-500"
                                                        : "bg-green-500"
                                                    }`}
                                                style={{ width: `${metric.value}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                )
                            })}

                            <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                                <div className="flex items-center gap-2 mb-2">
                                    <Shield className="w-5 h-5 text-green-600" />
                                    <span className="font-semibold text-green-800">System Health</span>
                                </div>
                                <p className="text-2xl font-bold text-green-900">{dashboardStats.systemHealth}%</p>
                                <p className="text-sm text-green-700">Hệ thống hoạt động ổn định</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Detailed Analytics */}
                <Tabs defaultValue="locations" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="locations" className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            Khu vực
                        </TabsTrigger>
                        <TabsTrigger value="alerts" className="flex items-center gap-2">
                            <Bell className="w-4 h-4" />
                            Cảnh báo
                        </TabsTrigger>
                        <TabsTrigger value="analytics" className="flex items-center gap-2">
                            <BarChart3 className="w-4 h-4" />
                            Phân tích
                        </TabsTrigger>
                        <TabsTrigger value="network" className="flex items-center gap-2">
                            <Globe className="w-4 h-4" />
                            Mạng
                        </TabsTrigger>
                    </TabsList>

                    {/* Locations Tab */}
                    <TabsContent value="locations">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <MapPin className="w-5 h-5" />
                                    Thống kê theo khu vực
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b">
                                                <th className="text-left py-3 px-4 font-semibold">Khu vực</th>
                                                <th className="text-left py-3 px-4 font-semibold">Thiết bị</th>
                                                <th className="text-left py-3 px-4 font-semibold">Người dùng</th>
                                                <th className="text-left py-3 px-4 font-semibold">Trạng thái</th>
                                                <th className="text-left py-3 px-4 font-semibold">Hoạt động</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {topLocations.map((location, index) => (
                                                <tr key={index} className="border-b hover:bg-gray-50">
                                                    <td className="py-3 px-4">
                                                        <div className="flex items-center gap-2">
                                                            <MapPin className="w-4 h-4 text-gray-400" />
                                                            <span className="font-medium">{location.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="py-3 px-4">{location.devices.toLocaleString()}</td>
                                                    <td className="py-3 px-4">{location.users.toLocaleString()}</td>
                                                    <td className="py-3 px-4">
                                                        <Badge className={getStatusColor(location.status)}>
                                                            {location.status === "healthy"
                                                                ? "Bình thường"
                                                                : location.status === "warning"
                                                                    ? "Cảnh báo"
                                                                    : "Nghiêm trọng"}
                                                        </Badge>
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                                            <span className="text-sm text-gray-600">Hoạt động</span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Alerts Tab */}
                    <TabsContent value="alerts">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Bell className="w-5 h-5" />
                                    Cảnh báo gần đây
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {recentAlerts.map((alert) => (
                                        <div
                                            key={alert.id}
                                            className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                                        >
                                            <div className="mt-1">{getAlertIcon(alert.type)}</div>
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-900">{alert.message}</p>
                                                <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                                                    <div className="flex items-center gap-1">
                                                        <Clock className="w-3 h-3" />
                                                        {alert.time}
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <MapPin className="w-3 h-3" />
                                                        {alert.location}
                                                    </div>
                                                </div>
                                            </div>
                                            <Button variant="outline" size="sm">
                                                Xử lý
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Analytics Tab */}
                    <TabsContent value="analytics">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <LineChart className="w-5 h-5" />
                                        Lưu lượng dữ liệu
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600">Tổng dữ liệu hôm nay</span>
                                            <span className="font-bold text-2xl">{dashboardStats.dataTransfer}</span>
                                        </div>
                                        <div className="h-32 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                                            <p className="text-gray-600">Biểu đồ lưu lượng dữ liệu theo thời gian</p>
                                        </div>
                                        <div className="grid grid-cols-3 gap-4 text-center">
                                            <div>
                                                <p className="text-sm text-gray-600">Upload</p>
                                                <p className="font-bold text-green-600">1.2TB</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Download</p>
                                                <p className="font-bold text-blue-600">0.8TB</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Sync</p>
                                                <p className="font-bold text-purple-600">0.4TB</p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Battery className="w-5 h-5" />
                                        Tình trạng pin thiết bị
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                                            <div className="flex items-center gap-2">
                                                <Battery className="w-5 h-5 text-green-600" />
                                                <span className="font-medium">Pin tốt (80-100%)</span>
                                            </div>
                                            <span className="font-bold text-green-600">12,456</span>
                                        </div>
                                        <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                                            <div className="flex items-center gap-2">
                                                <Battery className="w-5 h-5 text-yellow-600" />
                                                <span className="font-medium">Pin trung bình (50-79%)</span>
                                            </div>
                                            <span className="font-bold text-yellow-600">2,891</span>
                                        </div>
                                        <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                                            <div className="flex items-center gap-2">
                                                <Battery className="w-5 h-5 text-red-600" />
                                                <span className="font-medium">Pin yếu (&lt;50%)</span>
                                            </div>
                                            <span className="font-bold text-red-600">500</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* Network Tab */}
                    <TabsContent value="network">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Signal className="w-5 h-5" />
                                        Chất lượng tín hiệu
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm">Tín hiệu mạnh</span>
                                            <span className="font-bold text-green-600">85%</span>
                                        </div>
                                        <div className="w-full h-2 bg-gray-200 rounded-full">
                                            <div className="h-2 bg-green-500 rounded-full" style={{ width: "85%" }}></div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm">Tín hiệu trung bình</span>
                                            <span className="font-bold text-yellow-600">12%</span>
                                        </div>
                                        <div className="w-full h-2 bg-gray-200 rounded-full">
                                            <div className="h-2 bg-yellow-500 rounded-full" style={{ width: "12%" }}></div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm">Tín hiệu yếu</span>
                                            <span className="font-bold text-red-600">3%</span>
                                        </div>
                                        <div className="w-full h-2 bg-gray-200 rounded-full">
                                            <div className="h-2 bg-red-500 rounded-full" style={{ width: "3%" }}></div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Wifi className="w-5 h-5" />
                                        Kết nối mạng
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                                            <div className="flex items-center gap-2">
                                                <Wifi className="w-5 h-5 text-green-600" />
                                                <span>WiFi</span>
                                            </div>
                                            <span className="font-bold">11,234</span>
                                        </div>
                                        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                                            <div className="flex items-center gap-2">
                                                <Signal className="w-5 h-5 text-blue-600" />
                                                <span>4G/5G</span>
                                            </div>
                                            <span className="font-bold">2,891</span>
                                        </div>
                                        <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                                            <div className="flex items-center gap-2">
                                                <Globe className="w-5 h-5 text-purple-600" />
                                                <span>Ethernet</span>
                                            </div>
                                            <span className="font-bold">1,078</span>
                                        </div>
                                        <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                                            <div className="flex items-center gap-2">
                                                <WifiOff className="w-5 h-5 text-red-600" />
                                                <span>Offline</span>
                                            </div>
                                            <span className="font-bold">644</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Server className="w-5 h-5" />
                                        Server Status
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                                            <div>
                                                <p className="font-medium">API Server</p>
                                                <p className="text-sm text-gray-600">Response: 45ms</p>
                                            </div>
                                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                        </div>
                                        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                                            <div>
                                                <p className="font-medium">Database</p>
                                                <p className="text-sm text-gray-600">Query: 12ms</p>
                                            </div>
                                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                        </div>
                                        <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                                            <div>
                                                <p className="font-medium">File Storage</p>
                                                <p className="text-sm text-gray-600">Load: 78%</p>
                                            </div>
                                            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                        </div>
                                        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                                            <div>
                                                <p className="font-medium">CDN</p>
                                                <p className="text-sm text-gray-600">Global: 99.9%</p>
                                            </div>
                                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}
