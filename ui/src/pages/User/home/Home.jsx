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
    ChevronDown,
    ChevronUp,
    Maximize2,
    Minimize2,
    BarChart3,
    Settings,
    Bell,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import axiosPrivate from "@/apis/clients/private.client"
import StatisticsChart from "@/components/common/StatisticsChart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function IoTDashboard() {
    const [currentTime, setCurrentTime] = useState(new Date())
    const [systemStats, setSystemStats] = useState({
        totalDevices: 0,
        onlineDevices: 0,
        activeSpaces: 0,
        energyUsage: 0,
    })
    const [spaceEnvironmentalData, setSpaceEnvironmentalData] = useState([])
    const [devices, setDevices] = useState([])
    const [isEnvironmentalExpanded, setIsEnvironmentalExpanded] = useState(true)
    const [expandedSpaces, setExpandedSpaces] = useState({})
    const [selectedSpaceForStats, setSelectedSpaceForStats] = useState('')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            setError(null)
            try {
                console.log('Fetching data...')
                const [cardResponse, statisticResponse, devicesResponse] = await Promise.all([
                    axiosPrivate.get('statistic/card'),
                    axiosPrivate.get('statistic'),
                    axiosPrivate.get('devices/account')
                ])

                console.log('Card response:', cardResponse)
                console.log('Statistic response:', statisticResponse)
                console.log('Devices response:', devicesResponse)

                if (cardResponse.success) {
                    setSystemStats(cardResponse.data)
                }
                if (statisticResponse.success) {
                    setSpaceEnvironmentalData(statisticResponse.data || [])
                    if (statisticResponse.data && statisticResponse.data.length > 0) {
                        setSelectedSpaceForStats(statisticResponse.data[0].space_id.toString())
                    }
                }
                if (devicesResponse.success) {
                    setDevices(devicesResponse.data || [])
                    console.log('Devices set:', devicesResponse.data)
                }
            } catch (error) {
                console.error('Error fetching data:', error)
                setError('Không thể tải dữ liệu. Vui lòng thử lại sau.')
            } finally {
                setLoading(false)
            }
        }
        fetchData()

        const timeInterval = setInterval(() => {
            setCurrentTime(new Date())
        }, 60000)

        return () => clearInterval(timeInterval)
    }, [])

    const getStatusColor = (status) => {
        switch (status) {
            case "warning":
                return "text-amber-600 bg-amber-50 border-amber-200"
            case "error":
                return "text-red-600 bg-red-50 border-red-200"
            case "normal":
                return "text-emerald-600 bg-emerald-50 border-emerald-200"
            default:
                return "text-slate-600 bg-slate-50 border-slate-200"
        }
    }

    const getSpaceIcon = (spaceName) => {
        const name = spaceName?.toLowerCase() || ''
        if (name.includes('phòng ngủ') || name.includes('bedroom')) return Home
        if (name.includes('nhà bếp') || name.includes('kitchen')) return Home
        if (name.includes('phòng tắm') || name.includes('bathroom')) return Home
        if (name.includes('phòng khách') || name.includes('living')) return Home
        if (name.includes('garage') || name.includes('ga-ra')) return Home
        return Home
    }

    const getSpaceColor = (index) => {
        const colors = [
            'bg-blue-500', 'bg-purple-500', 'bg-emerald-500',
            'bg-orange-500', 'bg-cyan-500', 'bg-pink-500',
            'bg-indigo-500', 'bg-teal-500', 'bg-red-500'
        ]
        return colors[index % colors.length]
    }

    const calculateStatus = (space) => {
        const temp = space.avg_temperature || 0
        const humidity = space.avg_humidity || 0
        const gas = space.avg_gas || 0

        if (temp > 30 || humidity > 80 || gas > 100) return "warning"
        if (temp > 35 || humidity > 90 || gas > 200) return "error"
        return "normal"
    }

    const toggleSpaceExpansion = (spaceId) => {
        setExpandedSpaces(prev => ({
            ...prev,
            [spaceId]: !prev[spaceId]
        }))
    }

    const formatTime = (date) => {
        return date.toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        })
    }

    const getSelectedSpace = () => {
        return spaceEnvironmentalData.find(space => space.space_id.toString() === selectedSpaceForStats)
    }

    if (loading) return <div className="text-center py-10">Đang tải dữ liệu...</div>
    if (error) return <div className="text-center py-10 text-red-600">{error}</div>

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            {/* Header Section */}
            <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
                <div className="px-6 py-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">IoT Control Center</h1>
                        <p className="text-slate-600 text-sm">
                            Hệ thống giám sát và điều khiển thông minh • {formatTime(currentTime)}
                        </p>
                    </div>
                </div>
            </div>

            <div className="px-6 py-6 space-y-6">
                {/* System Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-blue-100 text-sm font-medium">Tổng thiết bị</p>
                                    <p className="text-3xl font-bold">{systemStats.totalDevices || 0}</p>
                                </div>
                                <div className="bg-blue-400/30 rounded-xl p-3">
                                    <Power className="h-6 w-6" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-0 shadow-lg">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-emerald-100 text-sm font-medium">Thiết bị online</p>
                                    <p className="text-3xl font-bold">{systemStats.onlineDevices || 0}</p>
                                    <p className="text-emerald-100 text-xs">
                                        {systemStats.totalDevices > 0
                                            ? Math.round((systemStats.onlineDevices / systemStats.totalDevices) * 100)
                                            : 0}% hoạt động
                                    </p>
                                </div>
                                <div className="bg-emerald-400/30 rounded-xl p-3">
                                    <Wifi className="h-6 w-6" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-purple-100 text-sm font-medium">Không gian</p>
                                    <p className="text-3xl font-bold">{spaceEnvironmentalData.length || 0}</p>
                                    <p className="text-purple-100 text-xs">Đang giám sát</p>
                                </div>
                                <div className="bg-purple-400/30 rounded-xl p-3">
                                    <Home className="h-6 w-6" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0 shadow-lg">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-orange-100 text-sm font-medium">Năng lượng</p>
                                    <p className="text-3xl font-bold">{systemStats.energyUsage || 0}kW</p>
                                    <p className="text-orange-100 text-xs flex items-center">
                                        <TrendingDown className="h-3 w-3 mr-1" />
                                        -15% hôm nay
                                    </p>
                                </div>
                                <div className="bg-orange-400/30 rounded-xl p-3">
                                    <Zap className="h-6 w-6" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Statistics Chart Section */}
                <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h2 className="text-xl font-semibold text-slate-900">Biểu đồ thống kê</h2>
                            <p className="text-sm text-slate-600">Thống kê dữ liệu cảm biến theo không gian và thiết bị</p>
                        </div>
                        {spaceEnvironmentalData.length > 0 && (
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-slate-600 whitespace-nowrap">Chọn không gian:</span>
                                <Select value={selectedSpaceForStats} onValueChange={setSelectedSpaceForStats}>
                                    <SelectTrigger className="w-64">
                                        <SelectValue placeholder="Chọn không gian để xem thống kê" />
                                    </SelectTrigger>
                                    <SelectContent className="max-h-60 overflow-y-auto bg-white">
                                        {spaceEnvironmentalData.map(space => (
                                            <SelectItem
                                                key={space.space_id}
                                                value={space.space_id.toString()}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-3 h-3 rounded-full ${getSpaceColor(spaceEnvironmentalData.indexOf(space))}`}></div>
                                                    <div className="flex flex-col">
                                                        <span className="font-medium">{space.space_name}</span>
                                                        <span className="text-xs text-slate-500">
                                                            {space.total_devices} thiết bị • {space.active_devices} hoạt động
                                                        </span>
                                                    </div>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                    </div>

                    <StatisticsChart
                        spaceId={selectedSpaceForStats}
                        spaceData={getSelectedSpace()}
                        devices={devices}
                    />
                </div>

                {/* Space-based Environmental Monitoring */}
                <Card className="border-0 shadow-sm">
                    <CardHeader className="bg-slate-50/50">
                        <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center space-x-2">
                                <MapPin className="h-5 w-5 text-blue-500" />
                                <span>Giám sát môi trường theo không gian</span>
                                <Badge variant="secondary" className="ml-2">
                                    {spaceEnvironmentalData.length} không gian
                                </Badge>
                            </CardTitle>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setIsEnvironmentalExpanded(!isEnvironmentalExpanded)}
                                className="hover:bg-slate-100"
                            >
                                {isEnvironmentalExpanded ? (
                                    <>
                                        <Minimize2 className="h-4 w-4 mr-2" />
                                        Thu gọn
                                    </>
                                ) : (
                                    <>
                                        <Maximize2 className="h-4 w-4 mr-2" />
                                        Mở rộng
                                    </>
                                )}
                            </Button>
                        </div>
                    </CardHeader>

                    <div className={`transition-all duration-300 ease-in-out ${isEnvironmentalExpanded ? 'max-h-none opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                        <CardContent className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {spaceEnvironmentalData.map((space, index) => {
                                    const SpaceIcon = getSpaceIcon(space.space_name)
                                    const spaceColor = getSpaceColor(index)
                                    const status = calculateStatus(space)

                                    return (
                                        <Card key={space.space_id} className="hover:shadow-md transition-shadow shadow-sm border-slate-300 border-2">
                                            <CardContent className="p-4">
                                                <div className="flex items-center justify-between mb-3">
                                                    <div className="flex items-center space-x-3">
                                                        <div className={`w-10 h-10 rounded-xl ${spaceColor} flex items-center justify-center shadow-sm`}>
                                                            <SpaceIcon className="h-5 w-5 text-white" />
                                                        </div>
                                                        <div>
                                                            <span className="font-semibold text-slate-900">{space.space_name}</span>
                                                            <p className="text-xs text-slate-500">
                                                                {space.total_devices !== 0 ? `${space.active_devices}/${space.total_devices} thiết bị` : "Không có thiết bị"}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Badge className={`${getStatusColor(status)} text-xs`}>
                                                            {status === "normal" ? "Bình thường" :
                                                                status === "warning" ? "Cảnh báo" : "Nguy hiểm"}
                                                        </Badge>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-3 text-sm">
                                                    <div className="flex items-center space-x-2 p-2 bg-red-50 rounded-lg">
                                                        <Thermometer className="h-4 w-4 text-red-500" />
                                                        <span className="font-medium">{space.avg_temperature || 0}°C</span>
                                                    </div>
                                                    <div className="flex items-center space-x-2 p-2 bg-blue-50 rounded-lg">
                                                        <Droplets className="h-4 w-4 text-blue-500" />
                                                        <span className="font-medium">{space.avg_humidity || 0}%</span>
                                                    </div>
                                                </div>

                                                <div className="transition-all duration-300 ease-in-out max-h-40 opacity-100 mt-3">
                                                    <div className="grid grid-cols-2 gap-3 text-sm pt-3 border-t border-slate-100">
                                                        <div className="flex items-center space-x-2 p-2 bg-emerald-50 rounded-lg">
                                                            <Shield className="h-4 w-4 text-emerald-500" />
                                                            <div>
                                                                <p className="text-xs text-slate-500">Chất lượng không khí</p>
                                                                <span className="font-medium">AQI {space.avg_gas || 0}</span>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center space-x-2 p-2 bg-amber-50 rounded-lg">
                                                            <Lightbulb className="h-4 w-4 text-amber-500" />
                                                            <div>
                                                                <p className="text-xs text-slate-500">Năng lượng</p>
                                                                <span className="font-medium">{space.avg_power || 0}kW</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="mt-3 pt-3 border-t border-slate-100">
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-xs text-slate-500">Trạng thái thiết bị</span>
                                                            <div className="flex items-center gap-1">
                                                                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                                                                <span className="text-xs text-slate-600">
                                                                    {space.active_devices} hoạt động
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="mt-2 bg-slate-100 rounded-full h-2">
                                                            <div
                                                                className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                                                                style={{
                                                                    width: `${space.total_devices > 0 ? (space.active_devices / space.total_devices) * 100 : 0}%`
                                                                }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )
                                })}
                            </div>
                        </CardContent>
                    </div>
                </Card>
            </div>
        </div>
    )
}