"use client"
import { useState, useEffect } from "react"
import {
    Activity,
    Thermometer,
    Droplets,
    Lightbulb,
    Shield,
    Wifi,
    Zap,
    Home,
    TrendingDown,
    Power,
    Eye,
    Clock,
    MapPin,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"


export default function IoTDashboard() {
    const [currentTime, setCurrentTime] = useState(new Date())

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000)
        return () => clearInterval(timer)
    }, [])

    // Mock data for IoT devices and sensors
    const systemStats = {
        totalDevices: 27,
        onlineDevices: 24,
        offlineDevices: 3,
        activeSpaces: 8,
        energyUsage: 1.2,
        uptime: 99.9,
    }

    // Space-specific environmental data
    const spaceEnvironmentalData = [
        {
            id: 1,
            name: "Phòng khách",
            icon: Home,
            color: "bg-blue-500",
            temperature: 24.5,
            humidity: 45,
            airQuality: 85,
            lightLevel: 750,
            status: "normal",
            devices: 8,
            active: 6,
        },
        {
            id: 2,
            name: "Phòng ngủ",
            icon: Home,
            color: "bg-purple-500",
            temperature: 22.0,
            humidity: 50,
            airQuality: 90,
            lightLevel: 200,
            status: "normal",
            devices: 5,
            active: 4,
        },
        {
            id: 3,
            name: "Nhà bếp",
            icon: Home,
            color: "bg-orange-500",
            temperature: 26.8,
            humidity: 60,
            airQuality: 75,
            lightLevel: 900,
            status: "warning",
            devices: 6,
            active: 5,
        },
        {
            id: 4,
            name: "Phòng tắm",
            icon: Home,
            color: "bg-cyan-500",
            temperature: 25.2,
            humidity: 70,
            airQuality: 80,
            lightLevel: 400,
            status: "normal",
            devices: 3,
            active: 2,
        },
        {
            id: 5,
            name: "Phòng làm việc",
            icon: Home,
            color: "bg-green-500",
            temperature: 23.5,
            humidity: 42,
            airQuality: 88,
            lightLevel: 850,
            status: "normal",
            devices: 4,
            active: 4,
        },
        {
            id: 6,
            name: "Garage",
            icon: Home,
            color: "bg-gray-500",
            temperature: 18.2,
            humidity: 35,
            airQuality: 70,
            lightLevel: 300,
            status: "normal",
            devices: 2,
            active: 1,
        },
    ]

    const quickActions = [
        { id: 1, name: "Tắt tất cả đèn", icon: Lightbulb, action: "lights_off", color: "bg-yellow-500" },
        { id: 2, name: "Kích hoạt bảo mật", icon: Shield, action: "security_on", color: "bg-red-500" },
        { id: 3, name: "Chế độ tiết kiệm", icon: Zap, action: "eco_mode", color: "bg-green-500" },
        { id: 4, name: "Chế độ nghỉ ngơi", icon: Home, action: "sleep_mode", color: "bg-purple-500" },
    ]

    const recentDevices = [
        {
            id: 1,
            name: "Đèn phòng khách",
            type: "light",
            status: "on",
            location: "Phòng khách",
            lastUpdate: "2 phút trước",
            value: "75%",
        },
        {
            id: 2,
            name: "Máy lạnh phòng ngủ",
            type: "ac",
            status: "on",
            location: "Phòng ngủ",
            lastUpdate: "5 phút trước",
            value: "22°C",
        },
        {
            id: 3,
            name: "Camera an ninh",
            type: "camera",
            status: "on",
            location: "Cửa chính",
            lastUpdate: "1 phút trước",
            value: "HD",
        },
        {
            id: 4,
            name: "Cảm biến chuyển động",
            type: "sensor",
            status: "on",
            location: "Hành lang",
            lastUpdate: "3 phút trước",
            value: "Không phát hiện",
        },
    ]


    const getDeviceIcon = (type) => {
        switch (type) {
            case "light":
                return Lightbulb
            case "ac":
                return Thermometer
            case "camera":
                return Eye
            case "sensor":
                return Activity
            default:
                return Power
        }
    }

    const getStatusColor = (status) => {
        switch (status) {
            case "warning":
                return "text-yellow-600 bg-yellow-100"
            case "error":
                return "text-red-600 bg-red-100"
            case "normal":
                return "text-green-600 bg-green-100"
            default:
                return "text-gray-600 bg-gray-100"
        }
    }
    return (
        <div className="min-h-screen bg-gray-50 px-5 space-y-6 py-5">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">IoT Control Dashboard</h1>
                    <p className="text-gray-600 text-sm">
                        Hệ thống giám sát môi trường theo không gian
                    </p>
                </div>
            </div>

            {/* System Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-100 text-sm font-medium">Tổng thiết bị</p>
                                <p className="text-3xl font-bold">{systemStats.totalDevices}</p>
                                <p className="text-blue-100 text-xs">+2 từ tháng trước</p>
                            </div>
                            <div className="bg-blue-400 rounded-full p-3">
                                <Power className="h-6 w-6" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-green-100 text-sm font-medium">Thiết bị online</p>
                                <p className="text-3xl font-bold">{systemStats.onlineDevices}</p>
                                <p className="text-green-100 text-xs">
                                    {Math.round((systemStats.onlineDevices / systemStats.totalDevices) * 100)}% hoạt động
                                </p>
                            </div>
                            <div className="bg-green-400 rounded-full p-3">
                                <Wifi className="h-6 w-6" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-purple-100 text-sm font-medium">Không gian hoạt động</p>
                                <p className="text-3xl font-bold">{systemStats.activeSpaces}</p>
                                <p className="text-purple-100 text-xs">Tất cả đang hoạt động</p>
                            </div>
                            <div className="bg-purple-400 rounded-full p-3">
                                <Home className="h-6 w-6" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-orange-100 text-sm font-medium">Năng lượng</p>
                                <p className="text-3xl font-bold">{systemStats.energyUsage}kW</p>
                                <p className="text-orange-100 text-xs flex items-center">
                                    <TrendingDown className="h-3 w-3 mr-1" />
                                    -15% hôm nay
                                </p>
                            </div>
                            <div className="bg-orange-400 rounded-full p-3">
                                <Zap className="h-6 w-6" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Space-based Environmental Monitoring */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <MapPin className="h-5 w-5 text-blue-500" />
                        <span>Giám sát môi trường theo không gian</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {spaceEnvironmentalData.map((space) => (
                            <Card key={space.id} className="relative">
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center space-x-2">
                                            <div className={`w-8 h-8 rounded-lg ${space.color} flex items-center justify-center`}>
                                                <space.icon className="h-4 w-4 text-white" />
                                            </div>
                                            <span className="font-semibold">{space.name}</span>
                                        </div>
                                        <Badge className={getStatusColor(space.status)}>
                                            {space.status === "normal" ? "Bình thường" : "Cảnh báo"}
                                        </Badge>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                        <div className="flex items-center space-x-2">
                                            <Thermometer className="h-4 w-4 text-red-500" />
                                            <span>{space.temperature}°C</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Droplets className="h-4 w-4 text-blue-500" />
                                            <span>{space.humidity}%</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Shield className="h-4 w-4 text-green-500" />
                                            <span>AQI {space.airQuality}</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Lightbulb className="h-4 w-4 text-yellow-500" />
                                            <span>{space.lightLevel} lux</span>
                                        </div>
                                    </div>

                                    <div className="mt-3 pt-3 border-t text-xs text-gray-500">
                                        {space.active}/{space.devices} thiết bị hoạt động
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Quick Actions & Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Quick Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <Zap className="h-5 w-5 text-purple-500" />
                            <span>Thao tác nhanh</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {quickActions.map((action) => (
                                <Button
                                    key={action.id}
                                    variant="outline"
                                    className="w-full justify-start h-12 hover:bg-slate-50"
                                    onClick={() => alert(`Thực hiện: ${action.name}`)}
                                >
                                    <div className={`w-8 h-8 rounded-lg ${action.color} flex items-center justify-center mr-3`}>
                                        <action.icon className="h-4 w-4 text-white" />
                                    </div>
                                    <span className="font-medium">{action.name}</span>
                                </Button>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Device Activity */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <Clock className="h-5 w-5 text-blue-500" />
                            <span>Hoạt động gần đây</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentDevices.map((device) => {
                                const DeviceIcon = getDeviceIcon(device.type)
                                return (
                                    <div key={device.id} className="flex items-center justify-between p-3 border rounded-lg">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                                <DeviceIcon className="h-4 w-4 text-blue-600" />
                                            </div>
                                            <div>
                                                <div className="font-medium text-slate-900">{device.name}</div>
                                                <div className="text-sm text-slate-600">{device.location}</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="flex items-center space-x-2">
                                                <Switch checked={device.status === "on"} />
                                                <span className="text-sm font-medium">{device.value}</span>
                                            </div>
                                            <div className="text-xs text-slate-500">{device.lastUpdate}</div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </CardContent>
                </Card>
            </div>

        </div>
    )
}
