"use client"

import { useState, useEffect } from "react"
import {
    ChevronLeft,
    Settings,
    Edit,
    Trash2,
    ChevronDown,
    Flame,
    Search,
    Plus,
    MoreHorizontal,
    Home,
    Lightbulb,
    Thermometer,
    Power,
    SlidersHorizontal,
    ArrowUpRight,
    Smartphone,
    Loader2,
    Wifi,
    WifiOff,
    Battery,
    Activity,
    Grid3X3,
    List,
    Lock,
    Unlock,
    CheckCircle,
    XCircle,
    Clock,
    Cpu,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Slider } from "@/components/ui/slider"

export default function DeviceList({ spaceId, spaceName, spaceType, onBack }) {
    const [selectedDevice, setSelectedDevice] = useState(null)
    const [searchQuery, setSearchQuery] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    const [viewMode, setViewMode] = useState("grid")
    const [filterOptions, setFilterOptions] = useState({
        group_id: 0,
        link_status: "all",
        power_status: "all",
        lock_status: "all",
    })

    // Mock data based on database schema
    const [devices, setDevices] = useState([
        {
            device_id: 1,
            serial_number: "SMK001-2024-001",
            template_id: 1,
            template_name: "Smoke Detector Pro",
            template_type: "smoke",
            space_id: spaceId,
            account_id: 1,
            group_id: 1,
            group_name: "Nhóm An toàn",
            hub_id: "HUB001-2024-001",
            firmware_id: 1,
            firmware_version: "v2.1.3",
            name: "Máy báo khói phòng khách",
            power_status: true,
            attribute: {
                sensitivity: "high",
                alarm_volume: 85,
                test_interval: 30,
            },
            wifi_ssid: "SmartHome_5G",
            current_value: {
                ppm: 1024,
                temperature: 34,
                battery: 85,
                signal_strength: 95,
            },
            link_status: "linked",
            last_reset_at: "2024-01-15T10:30:00Z",
            lock_status: "unlocked",
            locked_at: null,
            created_at: "2024-01-01T08:00:00Z",
            updated_at: "2024-01-20T14:30:00Z",
            is_deleted: false,
            lastActivity: "2 phút trước",
        },
        {
            device_id: 2,
            serial_number: "LED001-2024-002",
            template_id: 2,
            template_name: "Smart LED Bulb",
            template_type: "light",
            space_id: spaceId,
            account_id: 1,
            group_id: 2,
            group_name: "Nhóm Chiếu sáng",
            hub_id: "HUB001-2024-001",
            firmware_id: 2,
            firmware_version: "v1.8.5",
            name: "Đèn LED thông minh",
            power_status: true,
            attribute: {
                max_brightness: 100,
                color_temperature_range: [2700, 6500],
                dimming_speed: "medium",
            },
            wifi_ssid: "SmartHome_5G",
            current_value: {
                brightness: 75,
                color_temperature: 4000,
                color: "#FFB800",
                power_consumption: 12.5,
                signal_strength: 92,
            },
            link_status: "linked",
            last_reset_at: "2024-01-10T09:15:00Z",
            lock_status: "unlocked",
            locked_at: null,
            created_at: "2024-01-02T10:00:00Z",
            updated_at: "2024-01-20T16:45:00Z",
            is_deleted: false,
            lastActivity: "5 phút trước",
        },
        {
            device_id: 3,
            serial_number: "TEMP001-2024-003",
            template_id: 3,
            template_name: "Temperature & Humidity Sensor",
            template_type: "temperature",
            space_id: spaceId,
            account_id: 1,
            group_id: 3,
            group_name: "Nhóm Môi trường",
            hub_id: "HUB001-2024-001",
            firmware_id: 3,
            firmware_version: "v1.5.2",
            name: "Cảm biến nhiệt độ & độ ẩm",
            power_status: true,
            attribute: {
                measurement_interval: 60,
                accuracy: "±0.5°C",
                operating_range: [-10, 60],
            },
            wifi_ssid: "SmartHome_5G",
            current_value: {
                temperature: 28,
                humidity: 65,
                heat_index: 29.2,
                signal_strength: 90,
            },
            link_status: "linked",
            last_reset_at: "2024-01-12T11:20:00Z",
            lock_status: "unlocked",
            locked_at: null,
            created_at: "2024-01-03T12:00:00Z",
            updated_at: "2024-01-20T17:00:00Z",
            is_deleted: false,
            lastActivity: "3 phút trước",
        },
        {
            device_id: 4,
            serial_number: "LED002-2024-004",
            template_id: 2,
            template_name: "Smart LED Bulb",
            template_type: "light",
            space_id: spaceId,
            account_id: 1,
            group_id: 2,
            group_name: "Nhóm Chiếu sáng",
            hub_id: null, // Không kết nối hub
            firmware_id: 2,
            firmware_version: "v1.8.5",
            name: "Đèn bàn làm việc",
            power_status: false,
            attribute: {
                max_brightness: 100,
                color_temperature_range: [2700, 6500],
                dimming_speed: "fast",
            },
            wifi_ssid: null,
            current_value: {
                brightness: 0,
                color_temperature: 3000,
                color: "#FFFFFF",
                power_consumption: 0,
                signal_strength: 0,
            },
            link_status: "unlinked",
            last_reset_at: null,
            lock_status: "locked",
            locked_at: "2024-01-18T14:30:00Z",
            created_at: "2024-01-04T14:00:00Z",
            updated_at: "2024-01-18T14:30:00Z",
            is_deleted: false,
            lastActivity: "30 phút trước",
        },
        {
            device_id: 5,
            serial_number: "SMK002-2024-005",
            template_id: 1,
            template_name: "Smoke Detector Pro",
            template_type: "smoke",
            space_id: null, // Chưa gán không gian
            account_id: 1,
            group_id: null, // Không thuộc nhóm
            group_name: null,
            hub_id: "HUB001-2024-001",
            firmware_id: 1,
            firmware_version: "v2.0.1", // Firmware cũ hơn
            name: "Cảm biến khói dự phòng",
            power_status: false,
            attribute: {
                sensitivity: "medium",
                alarm_volume: 75,
                test_interval: 30,
            },
            wifi_ssid: "SmartHome_5G",
            current_value: {
                ppm: 980,
                temperature: 32,
                battery: 45, // Pin thấp
                signal_strength: 78,
            },
            link_status: "linked",
            last_reset_at: "2024-01-05T08:45:00Z",
            lock_status: "unlocked",
            locked_at: null,
            created_at: "2024-01-05T16:00:00Z",
            updated_at: "2024-01-19T09:15:00Z",
            is_deleted: false,
            lastActivity: "15 phút trước",
        },
    ])

    // Simulate loading data
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false)
        }, 1500)

        return () => clearTimeout(timer)
    }, [])

    const handleDeviceClick = (device) => {
        setSelectedDevice(device)
    }

    const handleBackClick = () => {
        if (selectedDevice) {
            setSelectedDevice(null)
        } else {
            onBack()
        }
    }

    const handleToggle = (e, deviceId) => {
        e.stopPropagation()
        setDevices(
            devices.map((device) =>
                device.device_id === deviceId
                    ? {
                        ...device,
                        power_status: !device.power_status,
                        updated_at: new Date().toISOString(),
                    }
                    : device,
            ),
        )
    }

    const handleLockToggle = (deviceId) => {
        setDevices(
            devices.map((device) =>
                device.device_id === deviceId
                    ? {
                        ...device,
                        lock_status: device.lock_status === "locked" ? "unlocked" : "locked",
                        locked_at: device.lock_status === "unlocked" ? new Date().toISOString() : null,
                        updated_at: new Date().toISOString(),
                    }
                    : device,
            ),
        )
    }

    const handleAddDevice = () => {
        alert("Thêm thiết bị mới")
    }

    const handleDeleteDevice = (deviceId) => {
        setDevices(devices.filter((device) => device.device_id !== deviceId))
        if (selectedDevice?.device_id === deviceId) {
            setSelectedDevice(null)
        }
    }

    const handleEditDevice = (deviceId) => {
        alert(`Chỉnh sửa thiết bị ID: ${deviceId}`)
    }

    const getDeviceIcon = (templateType, powerStatus = true) => {
        const iconProps = { className: `h-5 w-5 ${powerStatus ? "text-white" : "text-white/70"}` }
        switch (templateType) {
            case "light":
                return <Lightbulb {...iconProps} />
            case "smoke":
                return <Flame {...iconProps} />
            case "temperature":
                return <Thermometer {...iconProps} />
            default:
                return <Smartphone {...iconProps} />
        }
    }

    const getDeviceColor = (templateType, powerStatus = true) => {
        const opacity = powerStatus ? "" : "/50"
        switch (templateType) {
            case "light":
                return `from-amber-500${opacity} to-orange-500${opacity}`
            case "smoke":
                return `from-red-500${opacity} to-pink-500${opacity}`
            case "temperature":
                return `from-blue-500${opacity} to-cyan-500${opacity}`
            default:
                return `from-slate-500${opacity} to-gray-500${opacity}`
        }
    }

    const getStatusColor = (linkStatus, powerStatus, lockStatus) => {
        if (lockStatus === "locked") return "bg-red-50 text-red-700 border-red-200"
        if (linkStatus === "unlinked") return "bg-gray-50 text-gray-600 border-gray-200"
        if (!powerStatus) return "bg-gray-100 text-gray-600 border-gray-200"
        return "bg-emerald-50 text-emerald-700 border-emerald-200"
    }

    const getStatusText = (linkStatus, powerStatus, lockStatus) => {
        if (lockStatus === "locked") return "Đã khóa"
        if (linkStatus === "unlinked") return "Chưa liên kết"
        if (!powerStatus) return "Đã tắt"
        return "Hoạt động"
    }

    const getSpaceIcon = (type) => {
        const iconProps = { className: "h-5 w-5 text-white" }
        switch (type) {
            case "living_room":
                return <Home {...iconProps} />
            default:
                return <Home {...iconProps} />
        }
    }

    // Filter and search devices
    const filteredDevices = devices.filter((device) => {
        const matchesSearch =
            device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            device.serial_number.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesGroup = filterOptions.group_id === 0 || device.group_id === filterOptions.group_id

        const matchesLinkStatus = filterOptions.link_status === "all" || device.link_status === filterOptions.link_status

        const matchesPowerStatus =
            filterOptions.power_status === "all" ||
            (filterOptions.power_status === "on" && device.power_status) ||
            (filterOptions.power_status === "off" && !device.power_status)

        const matchesLockStatus = filterOptions.lock_status === "all" || device.lock_status === filterOptions.lock_status

        return matchesSearch && matchesGroup && matchesLinkStatus && matchesPowerStatus && matchesLockStatus
    })

    // Group devices by template type
    const devicesByType = filteredDevices.reduce((acc, device) => {
        if (!acc[device.template_type]) {
            acc[device.template_type] = []
        }
        acc[device.template_type].push(device)
        return acc
    }, {})

    // Statistics
    const activeDevices = devices.filter((device) => device.power_status && device.link_status === "linked").length
    const totalDevices = devices.length
    const unlinkedDevices = devices.filter((device) => device.link_status === "unlinked").length
    const lockedDevices = devices.filter((device) => device.lock_status === "locked").length

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
            <div className="max-w-7xl mx-auto">
                {/* Enhanced Header */}
                <header className="bg-white/80 backdrop-blur-xl border-b border-white/20 sticky top-0 z-10 shadow-lg shadow-black/5">
                    <div className="px-6 py-5">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-4">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={handleBackClick}
                                    className="rounded-full hover:bg-blue-50 transition-colors duration-200"
                                >
                                    <ChevronLeft className="h-5 w-5" />
                                </Button>

                                <div className="flex items-center space-x-4">
                                    <div className="relative">
                                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                                            {getSpaceIcon(spaceType)}
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
                                            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                                        </div>
                                    </div>

                                    <div>
                                        <h1 className="text-2xl font-bold text-slate-900 mb-1">{spaceName}</h1>
                                        <div className="flex items-center space-x-3">
                                            <Badge
                                                variant="secondary"
                                                className="bg-emerald-100 text-emerald-700 border-emerald-200 font-medium"
                                            >
                                                <Activity className="h-3 w-3 mr-1" />
                                                {activeDevices}/{totalDevices} hoạt động
                                            </Badge>
                                            {unlinkedDevices > 0 && (
                                                <Badge variant="secondary" className="bg-amber-100 text-amber-700 border-amber-200 font-medium">
                                                    <WifiOff className="h-3 w-3 mr-1" />
                                                    {unlinkedDevices} chưa liên kết
                                                </Badge>
                                            )}
                                            {lockedDevices > 0 && (
                                                <Badge variant="secondary" className="bg-red-100 text-red-700 border-red-200 font-medium">
                                                    <Lock className="h-3 w-3 mr-1" />
                                                    {lockedDevices} đã khóa
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="hidden md:flex items-center space-x-2 border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
                                >
                                    <SlidersHorizontal className="h-4 w-4" />
                                    <span>Tự động hóa</span>
                                </Button>

                                <Button
                                    onClick={handleAddDevice}
                                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    <span>Thêm thiết bị</span>
                                </Button>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="flex flex-col lg:flex-row min-h-[calc(100vh-120px)]">
                    {/* Enhanced Device List */}
                    <div
                        className={cn(
                            "bg-white/60 backdrop-blur-sm p-6 w-full transition-all duration-500 ease-in-out",
                            selectedDevice ? "lg:w-1/2 xl:w-2/5" : "lg:w-full",
                        )}
                    >
                        {/* Enhanced Search and Filters */}
                        <div className="mb-8 space-y-6">
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="relative flex-1">
                                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                                    <Input
                                        placeholder="Tìm kiếm theo tên hoặc serial..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-12 h-12 border-slate-200 bg-white/80 backdrop-blur-sm focus:bg-white transition-colors"
                                    />
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Button
                                        variant={viewMode === "grid" ? "default" : "outline"}
                                        size="icon"
                                        onClick={() => setViewMode("grid")}
                                        className="h-12 w-12"
                                    >
                                        <Grid3X3 className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant={viewMode === "list" ? "default" : "outline"}
                                        size="icon"
                                        onClick={() => setViewMode("list")}
                                        className="h-12 w-12"
                                    >
                                        <List className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-3">
                                <div className="relative min-w-[160px]">
                                    <select
                                        className="w-full h-11 pl-4 pr-10 text-sm border border-slate-200 rounded-xl appearance-none bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        value={filterOptions.group_id}
                                        onChange={(e) => setFilterOptions({ ...filterOptions, group_id: Number(e.target.value) })}
                                    >
                                        <option value={0}>Tất cả nhóm</option>
                                        <option value={1}>Nhóm An toàn</option>
                                        <option value={2}>Nhóm Chiếu sáng</option>
                                        <option value={3}>Nhóm Môi trường</option>
                                    </select>
                                    <ChevronDown
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none"
                                        size={16}
                                    />
                                </div>

                                <div className="relative min-w-[160px]">
                                    <select
                                        className="w-full h-11 pl-4 pr-10 text-sm border border-slate-200 rounded-xl appearance-none bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        value={filterOptions.link_status}
                                        onChange={(e) => setFilterOptions({ ...filterOptions, link_status: e.target.value })}
                                    >
                                        <option value="all">Tất cả kết nối</option>
                                        <option value="linked">Đã liên kết</option>
                                        <option value="unlinked">Chưa liên kết</option>
                                    </select>
                                    <ChevronDown
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none"
                                        size={16}
                                    />
                                </div>

                                <div className="relative min-w-[160px]">
                                    <select
                                        className="w-full h-11 pl-4 pr-10 text-sm border border-slate-200 rounded-xl appearance-none bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        value={filterOptions.power_status}
                                        onChange={(e) => setFilterOptions({ ...filterOptions, power_status: e.target.value })}
                                    >
                                        <option value="all">Tất cả nguồn</option>
                                        <option value="on">Đang bật</option>
                                        <option value="off">Đã tắt</option>
                                    </select>
                                    <ChevronDown
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none"
                                        size={16}
                                    />
                                </div>

                                <div className="relative min-w-[160px]">
                                    <select
                                        className="w-full h-11 pl-4 pr-10 text-sm border border-slate-200 rounded-xl appearance-none bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        value={filterOptions.lock_status}
                                        onChange={(e) => setFilterOptions({ ...filterOptions, lock_status: e.target.value })}
                                    >
                                        <option value="all">Tất cả khóa</option>
                                        <option value="unlocked">Đã mở khóa</option>
                                        <option value="locked">Đã khóa</option>
                                    </select>
                                    <ChevronDown
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none"
                                        size={16}
                                    />
                                </div>
                            </div>
                        </div>

                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-20">
                                <div className="relative">
                                    <Loader2 className="h-12 w-12 text-blue-500 animate-spin mb-6" />
                                    <div className="absolute inset-0 h-12 w-12 border-4 border-blue-200 rounded-full animate-pulse"></div>
                                </div>
                                <p className="text-slate-600 text-lg font-medium">Đang tải danh sách thiết bị...</p>
                                <p className="text-slate-400 text-sm mt-2">Vui lòng chờ trong giây lát</p>
                            </div>
                        ) : (
                            <>
                                {/* Enhanced Tabs */}
                                <Tabs defaultValue="all" className="mb-8">
                                    <TabsList className="bg-slate-100/80 backdrop-blur-sm p-1 rounded-xl">
                                        <TabsTrigger
                                            value="all"
                                            className=" rounded-lg px-4 py-2 transition-all"
                                        >
                                            Tất cả ({filteredDevices.length})
                                        </TabsTrigger>
                                        {Object.keys(devicesByType).map((type) => (
                                            <TabsTrigger
                                                key={type}
                                                value={type}
                                                className=" rounded-lg px-4 py-2 transition-all"
                                            >
                                                {type === "light" && " Đèn"}
                                                {type === "smoke" && " Báo khói"}
                                                {type === "temperature" && "Nhiệt độ"}
                                                {type !== "light" && type !== "smoke" && type !== "temperature" && type}(
                                                {devicesByType[type].length})
                                            </TabsTrigger>
                                        ))}
                                    </TabsList>

                                    <TabsContent value="all" className="mt-6">
                                        <DeviceGrid
                                            devices={filteredDevices}
                                            selectedDevice={selectedDevice}
                                            onDeviceClick={handleDeviceClick}
                                            onToggle={handleToggle}
                                            onLockToggle={handleLockToggle}
                                            onEdit={handleEditDevice}
                                            onDelete={handleDeleteDevice}
                                            getDeviceIcon={getDeviceIcon}
                                            getDeviceColor={getDeviceColor}
                                            getStatusColor={getStatusColor}
                                            getStatusText={getStatusText}
                                            viewMode={viewMode}
                                        />
                                    </TabsContent>

                                    {Object.keys(devicesByType).map((type) => (
                                        <TabsContent key={type} value={type} className="mt-6">
                                            <DeviceGrid
                                                devices={devicesByType[type]}
                                                selectedDevice={selectedDevice}
                                                onDeviceClick={handleDeviceClick}
                                                onToggle={handleToggle}
                                                onLockToggle={handleLockToggle}
                                                onEdit={handleEditDevice}
                                                onDelete={handleDeleteDevice}
                                                getDeviceIcon={getDeviceIcon}
                                                getDeviceColor={getDeviceColor}
                                                getStatusColor={getStatusColor}
                                                getStatusText={getStatusText}
                                                viewMode={viewMode}
                                            />
                                        </TabsContent>
                                    ))}
                                </Tabs>

                                {filteredDevices.length === 0 && (
                                    <div className="text-center py-16 bg-white/40 backdrop-blur-sm rounded-2xl border border-dashed border-slate-300">
                                        <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                            <Smartphone className="h-10 w-10 text-slate-400" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-slate-700 mb-2">Không tìm thấy thiết bị nào</h3>
                                        <p className="text-slate-500 mb-6">Thử thay đổi bộ lọc hoặc thêm thiết bị mới</p>
                                        <Button onClick={handleAddDevice} variant="outline" className="border-slate-300 hover:bg-slate-50">
                                            <Plus className="h-4 w-4 mr-2" />
                                            Thêm thiết bị
                                        </Button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    {/* Enhanced Device Detail Panel */}
                    {selectedDevice && (
                        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-8 w-full lg:w-1/2 xl:w-3/5 transition-all duration-500 ease-in-out shadow-2xl">
                            <ScrollArea className="h-[calc(100vh-140px)]">
                                <div className="max-w-2xl mx-auto">
                                    {/* Device Header */}
                                    <div className="flex items-center justify-between mb-8">
                                        <div className="flex items-center space-x-4">
                                            <div
                                                className={`w-16 h-16 bg-gradient-to-br ${getDeviceColor(selectedDevice.template_type, selectedDevice.power_status)} rounded-2xl flex items-center justify-center shadow-xl`}
                                            >
                                                {getDeviceIcon(selectedDevice.template_type, selectedDevice.power_status)}
                                            </div>
                                            <div>
                                                <h2 className="text-2xl font-bold mb-1">{selectedDevice.name}</h2>
                                                <div className="flex items-center space-x-3">
                                                    <p className="text-blue-200 font-mono text-sm">{selectedDevice.serial_number}</p>
                                                    {selectedDevice.group_name && (
                                                        <Badge variant="secondary" className="bg-white/10 text-white border-white/20">
                                                            {selectedDevice.group_name}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-3">
                                            <Switch
                                                checked={selectedDevice.power_status}
                                                onCheckedChange={(checked) => {
                                                    setDevices(
                                                        devices.map((device) =>
                                                            device.device_id === selectedDevice.device_id
                                                                ? {
                                                                    ...device,
                                                                    power_status: checked,
                                                                    updated_at: new Date().toISOString(),
                                                                }
                                                                : device,
                                                        ),
                                                    )
                                                    setSelectedDevice({ ...selectedDevice, power_status: checked })
                                                }}
                                                disabled={selectedDevice.link_status === "unlinked" || selectedDevice.lock_status === "locked"}
                                                className="data-[state=checked]:bg-emerald-500"
                                            />
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 rounded-xl">
                                                        <MoreHorizontal className="h-5 w-5" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="bg-white">
                                                    <DropdownMenuItem onClick={() => handleEditDevice(selectedDevice.device_id)}>
                                                        <Edit className="h-4 w-4 mr-2" />
                                                        Chỉnh sửa
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleLockToggle(selectedDevice.device_id)}>
                                                        {selectedDevice.lock_status === "locked" ? (
                                                            <>
                                                                <Unlock className="h-4 w-4 mr-2" />
                                                                Mở khóa
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Lock className="h-4 w-4 mr-2" />
                                                                Khóa thiết bị
                                                            </>
                                                        )}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => handleDeleteDevice(selectedDevice.device_id)}
                                                        className="text-red-600"
                                                    >
                                                        <Trash2 className="h-4 w-4 mr-2" />
                                                        Xóa thiết bị
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </div>

                                    <Separator className="bg-white/10 my-8" />

                                    {/* Device Status Overview */}
                                    <div className="grid grid-cols-2 gap-4 mb-8">
                                        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                                            <div className="flex items-center justify-between">
                                                <span className="text-blue-200 text-sm">Trạng thái kết nối</span>
                                                <div className="flex items-center space-x-2">
                                                    {selectedDevice.link_status === "linked" ? (
                                                        <CheckCircle className="h-4 w-4 text-emerald-400" />
                                                    ) : (
                                                        <XCircle className="h-4 w-4 text-red-400" />
                                                    )}
                                                    <span className="text-sm font-medium">
                                                        {selectedDevice.link_status === "linked" ? "Đã liên kết" : "Chưa liên kết"}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                                            <div className="flex items-center justify-between">
                                                <span className="text-blue-200 text-sm">Trạng thái khóa</span>
                                                <div className="flex items-center space-x-2">
                                                    {selectedDevice.lock_status === "unlocked" ? (
                                                        <Unlock className="h-4 w-4 text-emerald-400" />
                                                    ) : (
                                                        <Lock className="h-4 w-4 text-red-400" />
                                                    )}
                                                    <span className="text-sm font-medium">
                                                        {selectedDevice.lock_status === "unlocked" ? "Đã mở" : "Đã khóa"}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Device Type Specific Controls */}
                                    {selectedDevice.template_type === "light" && <LightDetail device={selectedDevice} />}
                                    {selectedDevice.template_type === "smoke" && <SmokeDetectorDetail device={selectedDevice} />}
                                    {selectedDevice.template_type === "temperature" && <TemperatureDetail device={selectedDevice} />}

                                    {/* Enhanced Device Info */}
                                    <div className="mt-8 bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                                        <h3 className="text-xl font-semibold mb-6 flex items-center">
                                            <Settings className="h-5 w-5 mr-2" />
                                            Thông tin thiết bị
                                        </h3>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-white/5 rounded-xl p-4">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-blue-200 text-sm">Device ID</span>
                                                    <span className="font-mono text-sm">{selectedDevice.device_id}</span>
                                                </div>
                                            </div>

                                            <div className="bg-white/5 rounded-xl p-4">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-blue-200 text-sm">Template</span>
                                                    <span className="text-sm">{selectedDevice.template_name}</span>
                                                </div>
                                            </div>

                                            <div className="bg-white/5 rounded-xl p-4">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-blue-200 text-sm">Firmware</span>
                                                    <span className="text-sm font-mono">{selectedDevice.firmware_version}</span>
                                                </div>
                                            </div>

                                            <div className="bg-white/5 rounded-xl p-4">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-blue-200 text-sm">WiFi</span>
                                                    <div className="flex items-center space-x-2">
                                                        {selectedDevice.wifi_ssid ? (
                                                            <>
                                                                <Wifi className="h-4 w-4 text-emerald-400" />
                                                                <span className="text-sm">{selectedDevice.wifi_ssid}</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <WifiOff className="h-4 w-4 text-red-400" />
                                                                <span className="text-sm">Chưa kết nối</span>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {selectedDevice.hub_id && (
                                                <div className="bg-white/5 rounded-xl p-4">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-blue-200 text-sm">Hub</span>
                                                        <span className="text-sm font-mono">{selectedDevice.hub_id}</span>
                                                    </div>
                                                </div>
                                            )}

                                            <div className="bg-white/5 rounded-xl p-4">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-blue-200 text-sm">Cập nhật</span>
                                                    <span className="text-sm">{selectedDevice.lastActivity}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Device Attributes */}
                                    {selectedDevice.attribute && (
                                        <div className="mt-6 bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                                            <h3 className="text-xl font-semibold mb-6 flex items-center">
                                                <Cpu className="h-5 w-5 mr-2" />
                                                Cấu hình thiết bị
                                            </h3>
                                            <div className="space-y-3">
                                                {Object.entries(selectedDevice.attribute).map(([key, value]) => (
                                                    <div key={key} className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                                                        <span className="text-blue-200 text-sm capitalize">{key.replace(/_/g, " ")}</span>
                                                        <span className="text-sm font-medium">
                                                            {Array.isArray(value) ? value.join(" - ") : String(value)}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Enhanced Device History */}
                                    <div className="mt-6 bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                                        <div className="flex justify-between items-center mb-6">
                                            <h3 className="text-xl font-semibold flex items-center">
                                                <Activity className="h-5 w-5 mr-2" />
                                                Lịch sử hoạt động
                                            </h3>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-blue-300 hover:text-white hover:bg-white/10 rounded-xl"
                                            >
                                                Xem tất cả
                                                <ArrowUpRight className="ml-1 h-4 w-4" />
                                            </Button>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex items-start space-x-4 p-3 bg-white/5 rounded-xl">
                                                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center mt-1">
                                                    <Power className="h-5 w-5 text-emerald-400" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-medium">Thiết bị được bật</p>
                                                    <p className="text-sm text-blue-200">2 phút trước</p>
                                                </div>
                                            </div>

                                            <div className="flex items-start space-x-4 p-3 bg-white/5 rounded-xl">
                                                <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center mt-1">
                                                    <Settings className="h-5 w-5 text-blue-400" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-medium">Cài đặt được thay đổi</p>
                                                    <p className="text-sm text-blue-200">1 giờ trước</p>
                                                </div>
                                            </div>

                                            {selectedDevice.last_reset_at && (
                                                <div className="flex items-start space-x-4 p-3 bg-white/5 rounded-xl">
                                                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center mt-1">
                                                        <Clock className="h-5 w-5 text-amber-400" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="font-medium">Thiết bị được reset</p>
                                                        <p className="text-sm text-blue-200">
                                                            {new Date(selectedDevice.last_reset_at).toLocaleString("vi-VN")}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </ScrollArea>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

// Enhanced Device Grid Component
function DeviceGrid({
    devices,
    selectedDevice,
    onDeviceClick,
    onToggle,
    onLockToggle,
    onEdit,
    onDelete,
    getDeviceIcon,
    getDeviceColor,
    getStatusColor,
    getStatusText,
    viewMode = "grid",
}) {
    if (viewMode === "list") {
        return (
            <div className="space-y-3">
                {devices.map((device) => (
                    <div
                        key={device.device_id}
                        onClick={() => onDeviceClick(device)}
                        className={cn(
                            "bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl p-4 cursor-pointer hover:shadow-lg hover:border-blue-300 transition-all duration-300 group",
                            selectedDevice?.device_id === device.device_id && "ring-2 ring-blue-500 shadow-lg bg-blue-50/50",
                        )}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div
                                    className={`w-12 h-12 bg-gradient-to-br ${getDeviceColor(device.template_type, device.power_status)} rounded-xl flex items-center justify-center shadow-lg`}
                                >
                                    {getDeviceIcon(device.template_type, device.power_status)}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-900">{device.name}</h3>
                                    <div className="flex items-center space-x-2 mt-1">
                                        <Badge
                                            variant="outline"
                                            className={cn(
                                                "text-xs px-2 py-1",
                                                getStatusColor(device.link_status, device.power_status, device.lock_status),
                                            )}
                                        >
                                            {getStatusText(device.link_status, device.power_status, device.lock_status)}
                                        </Badge>
                                        <span className="text-xs text-slate-500 font-mono">{device.serial_number}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3">
                                <div className="text-right">
                                    <div className="text-sm text-slate-600">
                                        <span className="font-medium">{device.template_name}</span>
                                        <div className="text-xs text-slate-500">{device.firmware_version}</div>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2">
                                    {device.lock_status === "locked" && (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-red-500 hover:bg-red-50"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                onLockToggle(device.device_id)
                                            }}
                                        >
                                            <Lock className="h-4 w-4" />
                                        </Button>
                                    )}

                                    <Switch
                                        checked={device.power_status}
                                        onCheckedChange={(checked) => onToggle({ target: { checked } }, device.device_id)}
                                        onClick={(e) => e.stopPropagation()}
                                        disabled={device.link_status === "unlinked" || device.lock_status === "locked"}
                                        className="data-[state=checked]:bg-emerald-500"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {devices.map((device) => (
                <div
                    key={device.device_id}
                    onClick={() => onDeviceClick(device)}
                    className={cn(
                        "bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl p-6 cursor-pointer hover:shadow-xl hover:border-blue-300 hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden",
                        selectedDevice?.device_id === device.device_id &&
                        "ring-2 ring-blue-500 shadow-xl bg-blue-50/50 -translate-y-1",
                    )}
                >
                    {/* Background gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <div className="relative z-10">
                        {/* Header */}
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center space-x-3">
                                <div
                                    className={`w-12 h-12 bg-gradient-to-br ${getDeviceColor(device.template_type, device.power_status)} rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300`}
                                >
                                    {getDeviceIcon(device.template_type, device.power_status)}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">
                                        {device.name}
                                    </h3>
                                    <p className="text-xs text-slate-500 font-mono">{device.serial_number}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                {device.lock_status === "locked" && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-red-500 hover:bg-red-50"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            onLockToggle(device.device_id)
                                        }}
                                    >
                                        <Lock className="h-4 w-4" />
                                    </Button>
                                )}
                                <Switch
                                    checked={device.power_status}
                                    onCheckedChange={(checked) => onToggle({ target: { checked } }, device.device_id)}
                                    onClick={(e) => e.stopPropagation()}
                                    disabled={device.link_status === "unlinked" || device.lock_status === "locked"}
                                    className="data-[state=checked]:bg-emerald-500"
                                />
                            </div>
                        </div>

                        {/* Status */}
                        <div className="flex items-center justify-between mb-4">
                            <Badge
                                variant="outline"
                                className={cn(
                                    "text-xs px-3 py-1",
                                    getStatusColor(device.link_status, device.power_status, device.lock_status),
                                )}
                            >
                                {getStatusText(device.link_status, device.power_status, device.lock_status)}
                            </Badge>
                            <span className="text-xs text-slate-500">{device.lastActivity}</span>
                        </div>

                        {/* Device Specific Info */}
                        <div className="bg-slate-50/80 backdrop-blur-sm rounded-xl p-4 mb-4">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-slate-600">Template</span>
                                <span className="text-sm font-medium">{device.template_name}</span>
                            </div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-slate-600">Firmware</span>
                                <span className="text-sm font-mono">{device.firmware_version}</span>
                            </div>
                            {device.group_name && (
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-slate-600">Nhóm</span>
                                    <span className="text-sm font-medium">{device.group_name}</span>
                                </div>
                            )}
                        </div>

                        {/* Connection Status */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                {device.link_status === "linked" ? (
                                    <>
                                        <Wifi className="h-4 w-4 text-emerald-500" />
                                        <span className="text-xs text-slate-600">Đã kết nối</span>
                                    </>
                                ) : (
                                    <>
                                        <WifiOff className="h-4 w-4 text-red-500" />
                                        <span className="text-xs text-slate-600">Chưa kết nối</span>
                                    </>
                                )}
                            </div>

                            <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 rounded-lg hover:bg-slate-100"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        onEdit(device.device_id)
                                    }}
                                >
                                    <Edit size={14} className="text-slate-600" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 rounded-lg hover:bg-red-50 hover:text-red-600"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        onDelete(device.device_id)
                                    }}
                                >
                                    <Trash2 size={14} className="text-slate-600 hover:text-red-600" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

// Enhanced Light Detail Component
function LightDetail({ device }) {
    const [brightness, setBrightness] = useState(device.current_value?.brightness || 0)

    return (
        <div className="space-y-8">
            <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-2xl p-8 text-center border border-amber-500/20">
                <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20 mb-6 relative">
                    <div className="text-4xl font-bold">{brightness}%</div>
                    <div className="absolute inset-0 rounded-full border-4 border-amber-500/30 animate-pulse"></div>
                </div>
                <p className="text-blue-200 text-lg">Độ sáng hiện tại</p>
            </div>

            <div className="space-y-6">
                <div>
                    <label className="text-sm font-medium text-blue-200 mb-3 block">Điều chỉnh độ sáng</label>
                    <Slider
                        value={[brightness]}
                        onValueChange={(value) => setBrightness(value[0])}
                        max={device.attribute?.max_brightness || 100}
                        step={1}
                        className="w-full"
                        disabled={!device.power_status || device.link_status === "unlinked"}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
                        <div className="flex items-center justify-center space-x-2 mb-2">
                            <div
                                className="w-4 h-4 rounded-full border border-white/30"
                                style={{ backgroundColor: device.current_value?.color || "#FFFFFF" }}
                            />
                            <div className="text-lg font-semibold">
                                {device.current_value?.color_temperature ? `${device.current_value.color_temperature}K` : "Trắng"}
                            </div>
                        </div>
                        <p className="text-sm text-blue-200">Nhiệt độ màu</p>
                    </div>

                    <div className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
                        <div className="text-lg font-semibold mb-1">
                            {device.current_value?.power_consumption ? `${device.current_value.power_consumption}W` : "0W"}
                        </div>
                        <p className="text-sm text-blue-200">Công suất</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

// Enhanced Smoke Detector Detail Component
function SmokeDetectorDetail({ device }) {
    const ppm = device.current_value?.ppm || 0
    const temperature = device.current_value?.temperature || 0
    const battery = device.current_value?.battery || 0

    return (
        <div className="space-y-8">
            <div className="bg-gradient-to-br from-red-500/10 to-pink-500/10 rounded-2xl p-8 text-center border border-red-500/20">
                <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-red-500/20 to-pink-500/20 mb-6 relative">
                    <div className="text-4xl font-bold">{ppm}</div>
                    {ppm > 1000 && <div className="absolute inset-0 rounded-full border-4 border-red-500/50 animate-pulse"></div>}
                </div>
                <p className="text-blue-200 text-lg">PPM hiện tại</p>
                {ppm > 1000 && <p className="text-red-400 text-sm mt-2">⚠️ Mức độ cao - Cần kiểm tra</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-xl p-6 text-center border border-white/10">
                    <div className="flex items-center justify-center mb-2">
                        <Thermometer className="h-5 w-5 text-blue-400 mr-2" />
                        <div className="text-2xl font-semibold">{temperature}°C</div>
                    </div>
                    <p className="text-sm text-blue-200">Nhiệt độ</p>
                </div>

                <div className="bg-white/5 rounded-xl p-6 text-center border border-white/10">
                    <div className="flex items-center justify-center mb-2">
                        <Battery className="h-5 w-5 text-emerald-400 mr-2" />
                        <div className="text-2xl font-semibold">{battery}%</div>
                    </div>
                    <p className="text-sm text-blue-200">Pin</p>
                    <div className="w-full bg-white/10 rounded-full h-1.5 mt-2">
                        <div
                            className={`h-1.5 rounded-full ${battery > 70 ? "bg-emerald-500" : battery > 30 ? "bg-amber-500" : "bg-red-500"
                                }`}
                            style={{ width: `${battery}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Device Attributes */}
            {device.attribute && (
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <h4 className="text-sm font-medium text-blue-200 mb-3">Cấu hình cảm biến</h4>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-xs text-blue-200">Độ nhạy</span>
                            <span className="text-xs font-medium">{device.attribute.sensitivity}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-xs text-blue-200">Âm lượng báo động</span>
                            <span className="text-xs font-medium">{device.attribute.alarm_volume}%</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-xs text-blue-200">Chu kỳ kiểm tra</span>
                            <span className="text-xs font-medium">{device.attribute.test_interval} ngày</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

// Enhanced Temperature Detail Component
function TemperatureDetail({ device }) {
    const temperature = device.current_value?.temperature || 0
    const humidity = device.current_value?.humidity || 0
    const heatIndex = device.current_value?.heat_index || 0

    return (
        <div className="space-y-8">
            <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-2xl p-8 text-center border border-blue-500/20">
                <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 mb-6">
                    <div className="text-4xl font-bold">{temperature}°C</div>
                </div>
                <p className="text-blue-200 text-lg">Nhiệt độ hiện tại</p>
            </div>

            <div className="grid grid-cols-3 gap-4">
                <div className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
                    <div className="text-xl font-semibold mb-1">{humidity}%</div>
                    <p className="text-sm text-blue-200">Độ ẩm</p>
                </div>

                <div className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
                    <div className="text-xl font-semibold mb-1">{heatIndex}°C</div>
                    <p className="text-sm text-blue-200">Chỉ số nhiệt</p>
                </div>

                <div className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
                    <div className="text-xl font-semibold mb-1">Bình thường</div>
                    <p className="text-sm text-blue-200">Trạng thái</p>
                </div>
            </div>

            {/* Device Attributes */}
            {device.attribute && (
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <h4 className="text-sm font-medium text-blue-200 mb-3">Cấu hình cảm biến</h4>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-xs text-blue-200">Chu kỳ đo</span>
                            <span className="text-xs font-medium">{device.attribute.measurement_interval}s</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-xs text-blue-200">Độ chính xác</span>
                            <span className="text-xs font-medium">{device.attribute.accuracy}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-xs text-blue-200">Phạm vi hoạt động</span>
                            <span className="text-xs font-medium">{device.attribute.operating_range?.join("°C - ")}°C</span>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <h3 className="text-lg font-medium mb-6 flex items-center">
                    <Activity className="h-5 w-5 mr-2" />
                    Biểu đồ nhiệt độ 24h
                </h3>
                <div className="h-48 flex items-end space-x-2">
                    {[28, 27, 29, 30, 32, 31, 29, 28, 27, 28, 29, 28].map((temp, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center">
                            <div
                                className="w-full bg-gradient-to-t from-blue-500/30 to-cyan-500/30 rounded-t-sm transition-all duration-300 hover:from-blue-500/50 hover:to-cyan-500/50"
                                style={{ height: `${(temp - 20) * 8}%` }}
                            />
                            <span className="text-xs mt-2 text-blue-200">{i * 2}h</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
