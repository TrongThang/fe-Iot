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
  ArrowUpRight,
  Power,
  Settings,
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
import { Card, CardContent } from "@/components/ui/card"
import { LightDetail, SmokeDetectorDetail, TemperatureDetail } from "./deviceDetail"
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

  // Mock data
  const [devices, setDevices] = useState([
    { id: 1, name: "Camera cổng chính", room: spaceName, type: "camera", isOn: true, resolution: "1080p", lastActivity: "1 phút trước", status: "active", group: 1, group_name: "Nhóm 1", house: 1, house_name: "Nhà 1" },
    { id: 2, name: "Camera sảnh lớn", room: spaceName, type: "camera", isOn: true, resolution: "4K", lastActivity: "Đang hoạt động", status: "active", group: 1, group_name: "Nhóm 1", house: 1, house_name: "Nhà 1" },
    { id: 3, name: "Camera hành lang", room: spaceName, type: "camera", isOn: false, resolution: "720p", lastActivity: "15 phút trước", status: "inactive", group: 2, group_name: "Nhóm 2", house: 1, house_name: "Nhà 1" },
    { id: 4, name: "Máy báo khói", room: spaceName, type: "smoke", isOn: true, ppm: 1024, temp: 34, battery: 85, lastActivity: "2 phút trước", status: "active", group: 1, group_name: "Nhóm 1", house: 1, house_name: "Nhà 1" },
    { id: 5, name: "Máy báo khói phụ", room: spaceName, type: "smoke", isOn: false, ppm: 980, temp: 32, battery: 65, lastActivity: "15 phút trước", status: "inactive", group: 1, group_name: "Nhóm 1", house: 1, house_name: "Nhà 1" },
    { id: 6, name: "Đèn bàn", room: spaceName, type: "light", isOn: true, brightness: 50, color: "red", lastActivity: "5 phút trước", status: "active", group: 1, group_name: "Nhóm 1", house: 1, house_name: "Nhà 1" },
    { id: 7, name: "Đèn trần", room: spaceName, type: "light", isOn: true, brightness: 80, color: "white", lastActivity: "1 phút trước", status: "active", group: 2, group_name: "Nhóm 2", house: 1, house_name: "Nhà 1" },
    { id: 8, name: "Cảm biến nhiệt độ", room: spaceName, type: "temperature", isOn: true, temp: 28, humidity: 65, lastActivity: "3 phút trước", status: "active", group: 2, group_name: "Nhóm 2", house: 1, house_name: "Nhà 1" },
  ])

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  const handleDeviceClick = (device) => setSelectedDevice(device)
  const handleBackClick = () => (selectedDevice ? setSelectedDevice(null) : onBack())
  const handleToggle = (deviceId) =>
    setDevices(
      devices.map((device) =>
        device.id === deviceId ? { ...device, isOn: !device.isOn, status: !device.isOn ? "active" : "inactive" } : device,
      ),
    )
  const handleAddDevice = () => alert("Thêm thiết bị mới")
  const handleDeleteDevice = (deviceId) => {
    setDevices(devices.filter((device) => device.id !== deviceId))
    if (selectedDevice?.id === deviceId) setSelectedDevice(null)
  }
  const handleEditDevice = (deviceId) => alert(`Chỉnh sửa thiết bị ID: ${deviceId}`)

  const getDeviceIcon = (type) => {
    const iconProps = { className: "h-5 w-5" }
    return { camera: <Camera {...iconProps} />, light: <Lightbulb {...iconProps} />, smoke: <Flame {...iconProps} />, temperature: <Thermometer {...iconProps} /> }[type] || <Smartphone {...iconProps} />
  }

  const getDeviceColor = (type) => (
    { camera: "from-blue-500 to-blue-600", light: "from-amber-500 to-amber-600", smoke: "from-red-500 to-red-600", temperature: "from-blue-500 to-blue-600" }[type] || "from-slate-500 to-slate-600"
  )
  
  const getDeviceStatusColor = (status, isOn) =>
    !isOn ? "bg-gray-200 text-gray-700" : { active: "bg-green-100 text-green-700 border-green-200", warning: "bg-yellow-100 text-yellow-700 border-yellow-200", error: "bg-red-100 text-red-700 border-red-200" }[status] || "bg-gray-100 text-gray-700 border-gray-200"

  const getSpaceIcon = (type) => ({ living_room: <Home className="h-5 w-5" /> }[type] || <Home className="h-5 w-5" />)

  // Filter devices
  const filteredDevices = devices.filter((device) => {
    const matchesSearch = device.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesGroup = filterOptions.group === 0 || device.group === filterOptions.group
    const matchesHouse = filterOptions.house === 0 || device.house === filterOptions.house
    const matchesStatus = filterOptions.status === "all" || (filterOptions.status === "active" && device.isOn) || (filterOptions.status === "inactive" && !device.isOn)
    return matchesSearch && matchesGroup && matchesHouse && matchesStatus
  })

  // Group devices by type once
  const devicesByType = filteredDevices.reduce((acc, device) => ((acc[device.type] ||= []).push(device), acc), {})

  const activeDevices = devices.filter((device) => device.isOn).length

  // Render CameraControl for camera devices
  if (selectedDevice && selectedDevice.type === "camera") {
    return <CameraControl camera={selectedDevice} onBack={() => setSelectedDevice(null)} onUpdateCamera={(updatedCamera) => { setDevices(devices.map((d) => (d.id === updatedCamera.id ? { ...d, ...updatedCamera } : d))); setSelectedDevice(updatedCamera) }} />
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
                  <div className={`w-10 h-10 bg-gradient-to-br ${getDeviceColor("camera")} rounded-xl flex items-center justify-center shadow-md`}>
                    {getSpaceIcon(spaceType)}
                  </div>
                  <div>
                    <h1 className={cn("font-semibold text-slate-900", selectedDevice ? "text-lg md:text-xl" : "text-xl")}>
                      {spaceName} <span className={cn("ml-2 text-sm font-normal text-slate-500", selectedDevice && "hidden md:inline")}>{devices.length} thiết bị</span>
                    </h1>
                    <div className={cn("flex items-center space-x-2", selectedDevice && "hidden md:flex")}>
                      <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
                        {activeDevices} đang hoạt động
                      </Badge>
                      <span className="text-xs text-slate-500">•</span>
                      <span className="text-xs text-slate-500">Cập nhật 2 phút trước</span>
                    </div>
                  </div>
                </div>
              </div>
              <Button onClick={handleAddDevice} className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="h-4 w-4 mr-2" /> Thêm thiết bị
              </Button>
            </div>
          </header>
    
          <div className="flex flex-col md:flex-row">
            {/* Device List */}
            <div className={cn("bg-white transition-all duration-300 ease-in-out", selectedDevice ? "w-full md:w-1/3 lg:w-1/4 border-r border-slate-200" : "w-full")}>
              <div className="p-4">
                <div className="mb-6 space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                    <Input placeholder="Tìm kiếm thiết bị..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 h-11 border-slate-200" />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {["group", "house", "status"].map((filter) => (
                      <div key={filter} className="relative flex-1 min-w-[150px]">
                        <select
                          className="w-full h-10 pl-3 pr-10 text-sm border border-slate-200 rounded-md appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          value={filterOptions[filter]}
                          onChange={(e) => setFilterOptions({ ...filterOptions, [filter]: filter === "status" ? e.target.value : Number(e.target.value) })}
                        >
                          {filter === "group" && <><option value={0}>Tất cả nhóm</option><option value={1}>Nhóm 1</option><option value={2}>Nhóm 2</option></>}
                          {filter === "house" && <><option value={0}>Tất cả nhà</option><option value={1}>Nhà 1</option><option value={2}>Nhà 2</option></>}
                          {filter === "status" && <><option value="all">Tất cả trạng thái</option><option value="active">Đang hoạt động</option><option value="inactive">Đã tắt</option></>}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                      </div>
                    ))}
                  </div>
                </div>
    
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Loader2 className="h-10 w-10 text-blue-500 animate-spin mb-4" />
                    <p className="text-slate-500">Đang tải danh sách thiết bị...</p>
                  </div>
                ) : filteredDevices.length === 0 ? (
                  <div className="text-center py-12 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                    <Smartphone className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500 mb-2">Không tìm thấy thiết bị nào</p>
                    <p className="text-slate-400 text-sm mb-4">Thử thay đổi bộ lọc hoặc thêm thiết bị mới</p>
                    <Button onClick={handleAddDevice} variant="outline" className="border-slate-200">
                      <Plus className="h-4 w-4 mr-2" /> Thêm thiết bị
                    </Button>
                  </div>
                ) : (
                  <Tabs defaultValue="all" className="w-full">
                    <TabsList className="bg-slate-100 w-full overflow-x-auto">
                      <TabsTrigger value="all" className="bg-gray-100 hover:bg-white data-[state=active]:bg-black data-[state=active]:text-white transition-colors">
                        Tất cả ({filteredDevices.length})
                      </TabsTrigger>
                      {Object.keys(devicesByType).map((type) => (
                        <TabsTrigger key={type} value={type} className="bg-gray-100 hover:bg-white data-[state=active]:bg-black data-[state=active]:text-white transition-colors">
                          {type === "camera" && "Camera"}
                          {type === "light" && "Đèn"}
                          {type === "smoke" && "Báo khói"}
                          {type === "temperature" && "Nhiệt độ"}
                          ({devicesByType[type].length})
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    {/* Thêm TabsContent cho "all" */}
                    <TabsContent value="all" className="mt-4">
                      <DeviceGrid
                        devices={filteredDevices} // Sử dụng filteredDevices cho tab "all"
                        selectedDevice={selectedDevice}
                        onDeviceClick={handleDeviceClick}
                        onToggle={handleToggle}
                        onEdit={handleEditDevice}
                        onDelete={handleDeleteDevice}
                        getDeviceIcon={getDeviceIcon}
                        getDeviceColor={getDeviceColor}
                        getDeviceStatusColor={getDeviceStatusColor}
                        isCompact={!!selectedDevice}
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
                          isCompact={!!selectedDevice}
                        />
                      </TabsContent>
                    ))}
                  </Tabs>
                )}
              </div>
            </div>
    
            {/* Device Detail Panel */}
            {selectedDevice && selectedDevice.type !== "camera" && (
              <div className="bg-white w-full md:w-2/3 lg:w-3/4 min-h-screen md:min-h-0">
                <div className="sticky top-[73px] h-[calc(100vh-73px)] overflow-hidden">
                  <ScrollArea className="h-full">
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-4">
                          <div className={`w-12 h-12 bg-gradient-to-br ${getDeviceColor(selectedDevice.type)} rounded-xl flex items-center justify-center shadow-lg`}>
                            {getDeviceIcon(selectedDevice.type)}
                          </div>
                          <div>
                            <h2 className="text-2xl font-bold text-slate-900">{selectedDevice.name}</h2>
                            <p className="text-slate-500">{selectedDevice.room}</p>
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
                            className="data-[state=checked]:bg-green-500"
                          />
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-100">
                                <MoreHorizontal className="h-5 w-5" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEditDevice(selectedDevice.id)}>
                                <Edit className="h-4 w-4 mr-2" /> Chỉnh sửa
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDeleteDevice(selectedDevice.id)} className="text-red-600">
                                <Trash2 className="h-4 w-4 mr-2" /> Xóa thiết bị
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                      <Separator className="mb-6" />
                      {selectedDevice.type === "light" && <LightDetail device={selectedDevice} />}
                      {selectedDevice.type === "smoke" && <SmokeDetectorDetail device={selectedDevice} />}
                      {selectedDevice.type === "temperature" && <TemperatureDetail device={selectedDevice} />}
                      <Card className="mt-6">
                        <CardContent className="p-6">
                          <h3 className="text-lg font-semibold mb-4">Thông tin thiết bị</h3>
                          <div className="space-y-4">
                            <div className="flex justify-between items-center"><span className="text-slate-600">ID thiết bị</span><span className="font-medium">{selectedDevice.id}</span></div>
                            <div className="flex justify-between items-center"><span className="text-slate-600">Nhóm</span><span className="font-medium">{selectedDevice.group_name}</span></div>
                            <div className="flex justify-between items-center"><span className="text-slate-600">Nhà</span><span className="font-medium">{selectedDevice.house_name}</span></div>
                            <div className="flex justify-between items-center"><span className="text-slate-600">Hoạt động gần đây</span><span className="font-medium">{selectedDevice.lastActivity}</span></div>
                            {selectedDevice.battery && (
                              <div className="flex justify-between items-center">
                                <span className="text-slate-600">Pin</span>
                                <div className="flex items-center gap-2">
                                  <div className="w-20 bg-slate-200 rounded-full h-2">
                                    <div className={`h-2 rounded-full ${selectedDevice.battery > 70 ? "bg-green-500" : selectedDevice.battery > 30 ? "bg-yellow-500" : "bg-red-500"}`} style={{ width: `${selectedDevice.battery}%` }} />
                                  </div>
                                  <span className="font-medium">{selectedDevice.battery}%</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="mt-6">
                        <CardContent className="p-6">
                          <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Lịch sử hoạt động</h3>
                            <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                              Xem tất cả <ArrowUpRight className="ml-1 h-4 w-4" />
                            </Button>
                          </div>
                          <div className="space-y-4">
                            <div className="flex items-start space-x-3"><div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mt-1"><Power className="h-4 w-4 text-green-600" /></div><div className="flex-1"><p className="font-medium">Thiết bị được bật</p><p className="text-sm text-slate-500">2 phút trước</p></div></div>
                            <div className="flex items-start space-x-3"><div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mt-1"><Settings className="h-4 w-4 text-blue-600" /></div><div className="flex-1"><p className="font-medium">Cài đặt được thay đổi</p><p className="text-sm text-slate-500">1 giờ trước</p></div></div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </ScrollArea>
                </div>
              </div>
              )}
          </div>
        </div>
      </div>
    )
}