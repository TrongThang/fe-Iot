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
  Home,
  Lightbulb,
  Thermometer,
  Loader2,
  Wifi,
  WifiOff,
  Activity,
  Grid3X3,
  List,
  Lock,
  Bell,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import DeviceDetail from "./deviceDetails"
import DeviceLockStatus from "@/components/common/devices/DeviceLockStatus"
import deviceApi from "@/apis/modules/deviceApi"

import EditDeviceDialog from "./devicePopups/Edit-device-popup"
import { useParams } from "react-router-dom"
import Swal from "sweetalert2"
import DeviceConnectionDialog from "./devicePopups/Link-device-popup"

export default function DeviceList({ spaceId, houseId, spaceName, spaceType, onBack }) {
  const { id } = useParams()
  const [selectedDevice, setSelectedDevice] = useState(null)
  const [devices, setDevices] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [viewMode, setViewMode] = useState("grid")
  const [isAddDevicePopupOpen, setIsAddDevicePopupOpen] = useState(false)
  const [isEditDevicePopupOpen, setIsEditDevicePopupOpen] = useState(false)
  const [deviceToEdit, setDeviceToEdit] = useState(null)
  const accessToken = localStorage.getItem('authToken');
  const [filterOptions, setFilterOptions] = useState({
    group_id: 0,
    link_status: "all",
    power_status: "all",
    lock_status: "all",
  })

  const fetchDevice = async (spaceId, groupId) => {
    try {
      const res = await fetch(`https://iothomeconnectapiv2-production.up.railway.app/api/devices/space/${spaceId}?groupId=${groupId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        }
      });
      if (res.ok) {
        const dataDevice = await res.json();
        setDevices(dataDevice ? dataDevice : [])
      } else {
        console.error(`Failed to fetch devices for space ${spaceId}: ${res.status} ${res.statusText}`);
        return [];
      }
    } catch (error) {
      console.error(`Error fetching devices for space ${spaceId}:`, error);
      return [];
    }
  }

  const fetchFirmware = async (firmwareId) => {
    try {
      const res = await fetch(`https://iothomeconnectapiv2-production.up.railway.app/api/firmwares/details/${firmwareId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        }
      });
      if (res.ok) {
        const data = await res.json();
        setSelectedDevice((prev) => ({
          ...prev,
          firmware_version: data.version,
          firmware_id: data.firmware_id,
        }));
      } else {
        console.error(`Failed to fetch firmware ${firmwareId}: ${res.status} ${res.statusText}`);
      }
    } catch (error) {
      console.error(`Error fetching firmware ${firmwareId}:`, error);
    }
  }
  // Simulate loading data  
  useEffect(() => {
    if (spaceId && id) {
      fetchDevice(spaceId, id)
    }
    if (selectedDevice?.firmware_id) {
      fetchFirmware(selectedDevice.firmware_id)
    }
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

  const handleToggle = (checked, deviceId) => {
    setDevices(
      devices.map((device) =>
        device.device_id === deviceId
          ? {
            ...device,
            power_status: checked,
            updated_at: new Date().toISOString(),
          }
          : device
      )
    )
    if (selectedDevice?.device_id === deviceId) {
      setSelectedDevice({ ...selectedDevice, power_status: checked })
    }
  }

  const handleLockToggle = async (deviceId) => {
    const device = devices.find(d => d.device_id === deviceId);
    if (!device) return;

    const isLocked = device.lock_status === "locked";
    const newLockStatus = isLocked ? "unlocked" : "locked";

    try {
      // Call real API
      if (isLocked) {
        await deviceApi.unlockDevice(deviceId, device.serial_number);
      } else {
        await deviceApi.lockDevice(deviceId, device.serial_number);
      }

      // Update local state after successful API call
      setDevices(
        devices.map((dev) =>
          dev.device_id === deviceId
            ? {
              ...dev,
              lock_status: newLockStatus,
              locked_at: !isLocked ? new Date().toISOString() : null,
              updated_at: new Date().toISOString(),
            }
            : dev
        )
      );

      if (selectedDevice?.device_id === deviceId) {
        setSelectedDevice({
          ...selectedDevice,
          lock_status: newLockStatus,
          locked_at: !isLocked ? new Date().toISOString() : null,
        });
      }

      // Show success message
      Swal.fire({
        icon: "success",
        title: isLocked ? "Mở khóa thành công" : "Khóa thành công",
        text: `Thiết bị đã được ${isLocked ? 'mở khóa' : 'khóa'} thành công!`,
        confirmButtonText: "OK",
        confirmButtonColor: "#10b981",
        timer: 2000,
        timerProgressBar: true
      });

    } catch (error) {
      console.error('Failed to toggle device lock:', error);
      Swal.fire({
        icon: "error",
        title: "Thao tác thất bại",
        text: error.response?.data?.message || `Không thể ${isLocked ? 'mở khóa' : 'khóa'} thiết bị. Vui lòng thử lại.`,
        confirmButtonText: "OK",
        confirmButtonColor: "#ef4444",
      });
    }
  }

  const handleAddDevice = () => {
    setIsAddDevicePopupOpen(true);
  }

  const handleDeviceConnect = (connectedDevice) => {
    setDevices(prev => [...prev, connectedDevice]);
    setIsAddDevicePopupOpen(false);
  }

  const handleDeleteDevice = async (deviceId) => {
    const result = await Swal.fire({
      title: "Bạn có chắc chắn muốn xóa?",
      text: "Hành động này không thể hoàn tác!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Có, xóa nó!",
      cancelButtonText: "Hủy",
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`https://iothomeconnectapiv2-production.up.railway.app/api/devices/${deviceId}?groupId=${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (res.ok) {
          Swal.fire({
            icon: "success",
            title: "Xóa thành công",
            text: "Thiết bị đã được xóa thành công!",
            confirmButtonText: "OK",
            confirmButtonColor: "#10b981",
          });
          setDevices(devices.filter((device) => device.device_id !== deviceId));
          if (selectedDevice?.device_id === deviceId) {
            setSelectedDevice(null);
          }
        } else {
          const errorData = await res.json();
          throw new Error(errorData.message || 'Failed to delete device');
        }
      } catch (error) {
        console.error("Lỗi khi xóa thiết bị:", error);
        Swal.fire({
          icon: "error",
          title: "Xóa thất bại",
          text: error.message || "Không thể xóa thiết bị. Vui lòng thử lại.",
          confirmButtonText: "OK",
          confirmButtonColor: "#ef4444",
        });
      }
    }
  }

  const handleEditDevice = (deviceId) => {
    const device = devices.find(d => d.device_id === deviceId);
    if (device) {
      setDeviceToEdit(device);
      setIsEditDevicePopupOpen(true);
    }
  }

  const handleDeviceEdit = (updatedDevice) => {
    // Cập nhật UI ngay lập tức với dữ liệu mới
    setDevices(prev => prev.map(device =>
      device.device_id === updatedDevice.device_id ? updatedDevice : device
    ));

    if (selectedDevice?.device_id === updatedDevice.device_id) {
      setSelectedDevice(updatedDevice);
    }

    setIsEditDevicePopupOpen(false);
  }

  const getDeviceIcon = (device) => {
    const iconProps = { className: `h-5 w-5 ${device.power_status ? "text-white" : "text-white/70"}` }
    const templateType = device.device_templates?.type || 'default'
    switch (templateType) {
      case "light":
        return <Lightbulb {...iconProps} />
      case "smoke":
        return <Flame {...iconProps} />
      case "temperature":
        return <Thermometer {...iconProps} />
      case "alarm":
        return <Bell {...iconProps} />
      default:
        return <Bell {...iconProps} />
    }
  }

  const getDeviceColor = (device) => {
    const templateType = device.device_templates?.type || 'default'
    switch (templateType) {
      case "light":
        return "from-blue-500 to-blue-600"
      case "smoke":
        return "from-red-500 to-red-600"
      case "temperature":
        return "from-orange-500 to-orange-600"
      case "alarm":
        return "from-yellow-500 to-yellow-600"
      default:
        return "from-gray-500 to-gray-600"
    }
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
    // Thêm kiểm tra 'device' và 'device.name' để đảm bảo chúng không phải là undefined
    const deviceName = device?.name || ""; // Sử dụng optional chaining và giá trị mặc định là chuỗi rỗng
    const deviceSerialNumber = device?.serial_number || ""; // Tương tự cho serial_number

    const matchesSearch =
      deviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deviceSerialNumber.toLowerCase().includes(searchQuery.toLowerCase())

    // Đảm bảo 'device' không phải là undefined trước khi truy cập các thuộc tính khác
    if (!device) return false;

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
    const type = device.device_templates?.type || 'default'
    if (!acc[type]) {
      acc[type] = []
    }
    acc[type].push(device)
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
                  onClick={handleAddDevice}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  <span>Liên kết thiết bị</span>
                </Button>
              </div>
            </div>
          </div>
        </header>

        <div className="flex flex-col lg:flex-row min-h-[calc(100vh-120px)]">
          {/* Enhanced Device List */}
          <div className="bg-white/60 backdrop-blur-sm p-6 w-full transition-all duration-500 ease-in-out">
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
                    <TabsTrigger value="all" className="rounded-lg px-4 py-4 transition-all">
                      Tất cả ({filteredDevices.length})
                    </TabsTrigger>
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
                        viewMode={viewMode}
                      />
                    </TabsContent>
                  ))}
                </Tabs>

                {filteredDevices.length === 0 && (
                  <div className="text-center py-16 bg-white/40 backdrop-blur-sm rounded-2xl border border-dashed border-slate-300">
                    <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <Bell className="h-10 w-10 text-slate-400" />
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

          {/* Device Detail Modal */}
          <Dialog open={!!selectedDevice} onOpenChange={(open) => !open && setSelectedDevice(null)}>
            <DialogContent className="max-w-4xl h-[90vh] p-0 overflow-hidden">
              <DialogHeader className="sr-only">
                <DialogTitle>Chi tiết thiết bị</DialogTitle>
              </DialogHeader>
              {selectedDevice && (
                <DeviceDetail
                  device={selectedDevice}
                  onDeviceUpdate={(updatedDevice) => {
                    setDevices(devices.map((d) => (d.device_id === updatedDevice.device_id ? updatedDevice : d)))
                    setSelectedDevice(updatedDevice)
                  }}

                  houseId={houseId}
                  onEdit={handleDeviceEdit}
                  onDelete={handleDeleteDevice}
                  onLockToggle={handleLockToggle}
                  onClose={() => setSelectedDevice(null)}
                />
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Add Device Popup */}
      <DeviceConnectionDialog
        open={isAddDevicePopupOpen}
        spaceId={spaceId}
        houseId={houseId}
        onOpenChange={setIsAddDevicePopupOpen}
        onConnect={handleDeviceConnect}
      />

      {/* Edit Device Popup */}
      <EditDeviceDialog
        open={isEditDevicePopupOpen}
        device={deviceToEdit}
        houseId={houseId}
        onOpenChange={setIsEditDevicePopupOpen}
        onEdit={handleDeviceEdit}
      />
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
              selectedDevice?.device_id === device.device_id && "ring-2 ring-blue-500 shadow-lg bg-blue-50/50"
            )}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div
                  className={`w-12 h-12 bg-gradient-to-br ${getDeviceColor(device)} rounded-xl flex items-center justify-center shadow-lg`}
                >
                  {getDeviceIcon(device)}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">{device.name}</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <DeviceLockStatus device={device} size="xs" />
                    {device.link_status === "unlinked" && (
                      <Badge variant="outline" className="text-xs px-2 py-1 bg-amber-50 text-amber-700 border-amber-200">
                        Chưa liên kết
                      </Badge>
                    )}
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
                    onCheckedChange={(checked) => onToggle(checked, device.device_id)}
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
            "ring-2 ring-blue-500 shadow-xl bg-blue-50/50 -translate-y-1"
          )}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-3">
                <div
                  className={`w-12 h-12 bg-gradient-to-br ${getDeviceColor(device)} rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300`}
                >
                  {getDeviceIcon(device)}
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
                  onCheckedChange={(checked) => onToggle(checked, device.device_id)}
                  onClick={(e) => e.stopPropagation()}
                  disabled={device.link_status === "unlinked" || device.lock_status === "locked"}
                  className="data-[state=checked]:bg-emerald-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <DeviceLockStatus device={device} size="sm" />
                {device.link_status === "unlinked" && (
                  <Badge variant="outline" className="text-xs px-2 py-1 bg-amber-50 text-amber-700 border-amber-200">
                    Chưa liên kết
                  </Badge>
                )}
              </div>
              <span className="text-xs text-slate-500">{device.lastActivity}</span>
            </div>

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