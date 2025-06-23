"use client"

import { useState, useEffect } from "react"
import {
  ChevronLeft,
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
  Smartphone,
  Loader2,
  Camera,
  Wifi,
  WifiOff,
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
import CameraControl from "./cameraControl"
import DeviceGrid from "./deviceGrid"

export default function DeviceManagement({
  spaceId = "1",
  spaceName = "Phòng khách",
  spaceType = "living_room",
  onBack = () => {},
}) {
  const [selectedDevice, setSelectedDevice] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [filterOptions, setFilterOptions] = useState({
    group: 0,
    house: 0,
    status: "all",
  })

  // Mock data - Thêm camera vào danh sách devices
  const [devices, setDevices] = useState([
    // Camera devices
    {
      id: 1,
      name: "Camera cổng chính",
      room: spaceName,
      type: "camera",
      isOn: true,
      resolution: "1080p",
      lastActivity: "1 phút trước",
      status: "active",
      group: 1,
      group_name: "Nhóm 1",
      house: 1,
      house_name: "Nhà 1",
    },
    {
      id: 2,
      name: "Camera sảnh lớn",
      room: spaceName,
      type: "camera",
      isOn: true,
      resolution: "4K",
      lastActivity: "Đang hoạt động",
      status: "active",
      group: 1,
      group_name: "Nhóm 1",
      house: 1,
      house_name: "Nhà 1",
    },
    {
      id: 3,
      name: "Camera hành lang",
      room: spaceName,
      type: "camera",
      isOn: false,
      resolution: "720p",
      lastActivity: "15 phút trước",
      status: "inactive",
      group: 2,
      group_name: "Nhóm 2",
      house: 1,
      house_name: "Nhà 1",
    },
    // Other devices
    {
      id: 4,
      name: "Máy báo khói",
      room: spaceName,
      type: "smoke",
      isOn: true,
      ppm: 1024,
      temp: 34,
      battery: 85,
      lastActivity: "2 phút trước",
      status: "active",
      group: 1,
      group_name: "Nhóm 1",
      house: 1,
      house_name: "Nhà 1",
    },
    {
      id: 5,
      name: "Máy báo khói phụ",
      room: spaceName,
      type: "smoke",
      isOn: false,
      ppm: 980,
      temp: 32,
      battery: 65,
      lastActivity: "15 phút trước",
      status: "inactive",
      group: 1,
      group_name: "Nhóm 1",
      house: 1,
      house_name: "Nhà 1",
    },
    {
      id: 6,
      name: "Đèn bàn",
      room: spaceName,
      type: "light",
      isOn: true,
      brightness: 50,
      color: "red",
      lastActivity: "5 phút trước",
      status: "active",
      group: 1,
      group_name: "Nhóm 1",
      house: 1,
      house_name: "Nhà 1",
    },
    {
      id: 7,
      name: "Đèn trần",
      room: spaceName,
      type: "light",
      isOn: true,
      brightness: 80,
      color: "white",
      lastActivity: "1 phút trước",
      status: "active",
      group: 2,
      group_name: "Nhóm 2",
      house: 1,
      house_name: "Nhà 1",
    },
    {
      id: 8,
      name: "Cảm biến nhiệt độ",
      room: spaceName,
      type: "temperature",
      isOn: true,
      temp: 28,
      humidity: 65,
      lastActivity: "3 phút trước",
      status: "active",
      group: 2,
      group_name: "Nhóm 2",
      house: 1,
      house_name: "Nhà 1",
    },
  ])

  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

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
        device.id === deviceId
          ? { ...device, isOn: !device.isOn, status: !device.isOn ? "active" : "inactive" }
          : device,
      ),
    )
  }

  const handleAddDevice = () => {
    alert("Thêm thiết bị mới")
  }

  const handleDeleteDevice = (deviceId) => {
    setDevices(devices.filter((device) => device.id !== deviceId))
    if (selectedDevice?.id === deviceId) {
      setSelectedDevice(null)
    }
  }

  const handleEditDevice = (deviceId) => {
    alert(`Chỉnh sửa thiết bị ID: ${deviceId}`)
  }

  const getDeviceIcon = (type) => {
    const iconProps = { className: "h-5 w-5" }
    switch (type) {
      case "camera":
        return <Camera {...iconProps} />
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

  const getDeviceColor = (type) => {
    switch (type) {
      case "camera":
        return "from-blue-500 to-blue-600"
      case "light":
        return "from-amber-500 to-amber-600"
      case "smoke":
        return "from-red-500 to-red-600"
      case "temperature":
        return "from-blue-500 to-blue-600"
      default:
        return "from-slate-500 to-slate-600"
    }
  }

  const getDeviceStatusColor = (status, isOn) => {
    if (!isOn) return "bg-gray-200 text-gray-700"
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700 border-green-200"
      case "warning":
        return "bg-yellow-100 text-yellow-700 border-yellow-200"
      case "error":
        return "bg-red-100 text-red-700 border-red-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  const getSpaceIcon = (type) => {
    const iconProps = { className: "h-5 w-5" }
    switch (type) {
      case "living_room":
        return <Home {...iconProps} />
      default:
        return <Home {...iconProps} />
    }
  }

  // Filter and search devices
  const filteredDevices = devices.filter((device) => {
    const matchesSearch = device.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesGroup = filterOptions.group === 0 || device.group === filterOptions.group
    const matchesHouse = filterOptions.house === 0 || device.house === filterOptions.house
    const matchesStatus =
      filterOptions.status === "all" ||
      (filterOptions.status === "active" && device.isOn) ||
      (filterOptions.status === "inactive" && !device.isOn)

    return matchesSearch && matchesGroup && matchesHouse && matchesStatus
  })

  // Group devices by type
  const devicesByType = filteredDevices.reduce((acc, device) => {
    if (!acc[device.type]) {
      acc[device.type] = []
    }
    acc[device.type].push(device)
    return acc
  }, {})

  const activeDevices = devices.filter((device) => device.isOn).length

  // Nếu device được chọn là camera, hiển thị CameraControl component
  if (selectedDevice && selectedDevice.type === "camera") {
    return (
      <CameraControl
        camera={selectedDevice}
        onBack={() => setSelectedDevice(null)}
        onUpdateCamera={(updatedCamera) => {
          setDevices(devices.map((d) => (d.id === updatedCamera.id ? { ...d, ...updatedCamera } : d)))
          setSelectedDevice(updatedCamera)
        }}
      />
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
          <div className="px-4 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" onClick={handleBackClick} className="rounded-full hover:bg-slate-100">
                <ChevronLeft className="h-5 w-5" />
              </Button>

              <div className="flex items-center space-x-3">
                <div
                  className={`w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md`}
                >
                  {getSpaceIcon(spaceType)}
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-slate-900">
                    {spaceName}
                    <span className="ml-2 text-sm font-normal text-slate-500">{devices.length} thiết bị</span>
                  </h1>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
                      {activeDevices} đang hoạt động
                    </Badge>
                    <span className="text-xs text-slate-500">•</span>
                    <span className="text-xs text-slate-500">Cập nhật 2 phút trước</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button onClick={handleAddDevice} className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                <span>Thêm thiết bị</span>
              </Button>
            </div>
          </div>
        </header>

        <div className="flex flex-col md:flex-row">
          {/* Device List */}
          <div
            className={cn(
              "bg-white p-4 w-full transition-all duration-300 ease-in-out",
              selectedDevice ? "md:w-1/2 lg:w-2/5" : "md:w-full",
            )}
          >
            {/* Search and Filters */}
            <div className="mb-6 space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input
                  placeholder="Tìm kiếm thiết bị..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-11 border-slate-200"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <div className="relative flex-1 min-w-[150px]">
                  <select
                    className="w-full h-10 pl-3 pr-10 text-sm border border-slate-200 rounded-md appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={filterOptions.group}
                    onChange={(e) => setFilterOptions({ ...filterOptions, group: Number(e.target.value) })}
                  >
                    <option value={0}>Tất cả nhóm</option>
                    <option value={1}>Nhóm 1</option>
                    <option value={2}>Nhóm 2</option>
                  </select>
                  <ChevronDown
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none"
                    size={16}
                  />
                </div>

                <div className="relative flex-1 min-w-[150px]">
                  <select
                    className="w-full h-10 pl-3 pr-10 text-sm border border-slate-200 rounded-md appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={filterOptions.house}
                    onChange={(e) => setFilterOptions({ ...filterOptions, house: Number(e.target.value) })}
                  >
                    <option value={0}>Tất cả nhà</option>
                    <option value={1}>Nhà 1</option>
                    <option value={2}>Nhà 2</option>
                  </select>
                  <ChevronDown
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none"
                    size={16}
                  />
                </div>

                <div className="relative flex-1 min-w-[150px]">
                  <select
                    className="w-full h-10 pl-3 pr-10 text-sm border border-slate-200 rounded-md appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={filterOptions.status}
                    onChange={(e) => setFilterOptions({ ...filterOptions, status: e.target.value })}
                  >
                    <option value="all">Tất cả trạng thái</option>
                    <option value="active">Đang hoạt động</option>
                    <option value="inactive">Đã tắt</option>
                  </select>
                  <ChevronDown
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none"
                    size={16}
                  />
                </div>
              </div>
            </div>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-10 w-10 text-blue-500 animate-spin mb-4" />
                <p className="text-slate-500">Đang tải danh sách thiết bị...</p>
              </div>
            ) : (
              <>
                {/* Tabs for device types */}
                <Tabs defaultValue="all" className="mb-6">
                  <TabsList className="bg-slate-100">
                    <TabsTrigger value="all" className="data-[state=active]:bg-white">
                      Tất cả ({filteredDevices.length})
                    </TabsTrigger>
                    {Object.keys(devicesByType).map((type) => (
                      <TabsTrigger key={type} value={type} className="data-[state=active]:bg-white">
                        {type === "camera" && "Camera"}
                        {type === "light" && "Đèn"}
                        {type === "smoke" && "Báo khói"}
                        {type === "temperature" && "Nhiệt độ"}
                        {type !== "camera" && type !== "light" && type !== "smoke" && type !== "temperature" && type}(
                        {devicesByType[type].length})
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  <TabsContent value="all" className="mt-4">
                    <DeviceGrid
                      devices={filteredDevices}
                      selectedDevice={selectedDevice}
                      onDeviceClick={handleDeviceClick}
                      onToggle={handleToggle}
                      onEdit={handleEditDevice}
                      onDelete={handleDeleteDevice}
                      getDeviceIcon={getDeviceIcon}
                      getDeviceColor={getDeviceColor}
                      getDeviceStatusColor={getDeviceStatusColor}
                    />
                  </TabsContent>

                  {Object.keys(devicesByType).map((type) => (
                    <TabsContent key={type} value={type} className="mt-4">
                      <DeviceGrid
                        devices={devicesByType[type]}
                        selectedDevice={selectedDevice}
                        onDeviceClick={handleDeviceClick}
                        onToggle={handleToggle}
                        onEdit={handleEditDevice}
                        onDelete={handleDeleteDevice}
                        getDeviceIcon={getDeviceIcon}
                        getDeviceColor={getDeviceColor}
                        getDeviceStatusColor={getDeviceStatusColor}
                      />
                    </TabsContent>
                  ))}
                </Tabs>

                {filteredDevices.length === 0 && (
                  <div className="text-center py-12 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                    <Smartphone className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500 mb-2">Không tìm thấy thiết bị nào</p>
                    <p className="text-slate-400 text-sm mb-4">Thử thay đổi bộ lọc hoặc thêm thiết bị mới</p>
                    <Button onClick={handleAddDevice} variant="outline" className="border-slate-200">
                      <Plus className="h-4 w-4 mr-2" />
                      Thêm thiết bị
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Device Detail - Chỉ hiển thị cho non-camera devices */}
          {selectedDevice && selectedDevice.type !== "camera" && (
            <div
              className={`bg-[#213148] text-white p-6 w-full md:w-1/2 lg:w-3/5 transition-all duration-300 ease-in-out ${selectedDevice ? "opacity-100" : "opacity-0"}`}
            >
              <ScrollArea className="h-[calc(100vh-120px)]">
                <div className="max-w-2xl mx-auto">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-12 h-12 bg-gradient-to-br ${getDeviceColor(selectedDevice.type)} rounded-xl flex items-center justify-center`}
                      >
                        {getDeviceIcon(selectedDevice.type)}
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold">{selectedDevice.name}</h2>
                        <p className="text-blue-200">{selectedDevice.room}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Switch
                        checked={selectedDevice.isOn}
                        onCheckedChange={(checked) => {
                          setDevices(
                            devices.map((device) =>
                              device.id === selectedDevice.id
                                ? { ...device, isOn: checked, status: checked ? "active" : "inactive" }
                                : device,
                            ),
                          )
                          setSelectedDevice({ ...selectedDevice, isOn: checked })
                        }}
                      />
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 rounded-full">
                            <MoreHorizontal className="h-5 w-5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditDevice(selectedDevice.id)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Chỉnh sửa
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteDevice(selectedDevice.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Xóa thiết bị
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  <Separator className="bg-white/10 my-6" />

                  {/* Device Type Specific Details */}
                  <div className="text-center py-8">
                    <p>Chi tiết thiết bị {selectedDevice.type}</p>
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

