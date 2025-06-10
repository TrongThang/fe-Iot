"use client"

import { useState } from "react"
import {
  Settings,
  Edit,
  Trash2,
  MoreHorizontal,
  Lightbulb,
  Thermometer,
  Flame,
  Bell,
  ArrowUpRight,
  Wifi,
  WifiOff,
  Activity,
  Lock,
  Unlock,
  CheckCircle,
  XCircle,
  Clock,
  Cpu,
  Settings2,
  Share,
  Share2,
  List,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import LedControlDialog from "@/pages/User/device-dialogs/led-control-dialog"
import AlarmControlDialog from "@/pages/User/device-dialogs/alarm-control-dialog"
import DeviceSharingDialog from "@/pages/User/share/shareDeviceDialog"
import { useNavigate } from "react-router-dom"

export default function DeviceDetail({ device, onDeviceUpdate, onEdit, onDelete, onLockToggle }) {
  const [isControlDialogOpen, setIsControlDialogOpen] = useState(false)
  const [isSharingDialogOpen, setIsSharingDialogOpen] = useState(false)
  const navigate = useNavigate()
  // Map device data to match LedControlDialog and AlarmControlDialog expectations
  const mappedDevice = {
    ...device,
    id: device.device_id,
    type: device.template_type,
    status: device.link_status === "linked" ? "online" : "offline",
    power: device.power_status,
    brightness: device.current_value?.brightness || 0,
    color: device.current_value?.color || "#FFFFFF",
    temperature: device.current_value?.color_temperature || 3200,
    mode: device.current_value?.mode || "solid",
    armed: device.current_value?.armed || false,
    sensitivity: device.attribute?.sensitivity || 70,
    volume: device.attribute?.alarm_volume || 80,
    delay: device.attribute?.delay || 30,
    notifyMethods: device.current_value?.notifyMethods || ["app"],
    supportedFeatures: {
      color: device.template_type === "light",
      temperature: device.template_type === "light",
      effects: device.template_type === "light",
    },
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
      case "alarm":
        return <Bell {...iconProps} />
      default:
        return <Bell {...iconProps} />
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
      case "alarm":
        return `from-purple-500${opacity} to-indigo-500${opacity}`
      default:
        return `from-slate-500${opacity} to-gray-500${opacity}`
    }
  }


  const hanleViewSharingList = () => {
    navigate("/share/device-sharing-list")
  }

  const handlePowerToggle = (checked) => {
    const updatedDevice = {
      ...device,
      power_status: checked,
      updated_at: new Date().toISOString(),
    }
    onDeviceUpdate(updatedDevice)
  }

  const handleControlDialogUpdate = (updatedData) => {
    const updatedDevice = {
      ...device,
      power_status: updatedData.power,
      current_value: {
        ...device.current_value,
        brightness: updatedData.brightness,
        color: updatedData.color,
        color_temperature: updatedData.temperature,
        mode: updatedData.mode,
        armed: updatedData.armed,
        notifyMethods: updatedData.notifyMethods,
      },
      attribute: {
        ...device.attribute,
        sensitivity: updatedData.sensitivity,
        alarm_volume: updatedData.volume,
        delay: updatedData.delay,
      },
      updated_at: new Date().toISOString(),
    }
    onDeviceUpdate(updatedDevice)
    setIsControlDialogOpen(false)
  }

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white rounded-lg overflow-hidden h-full">
      <ScrollArea className="h-full">
        <div className="p-6 space-y-6">
          {/* Device Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div
                className={`w-16 h-16 bg-gradient-to-br ${getDeviceColor(device.template_type, device.power_status)} rounded-2xl flex items-center justify-center shadow-xl`}
              >
                {getDeviceIcon(device.template_type, device.power_status)}
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-1">{device.name}</h2>
                <div className="flex items-center space-x-3">
                  <p className="text-blue-200 font-mono text-sm">{device.serial_number}</p>
                  {device.group_name && (
                    <Badge variant="secondary" className="bg-white/10 text-white border-white/20">
                      {device.group_name}
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Switch
                checked={device.power_status}
                onCheckedChange={handlePowerToggle}
                disabled={device.link_status === "unlinked" || device.lock_status === "locked"}
                className="data-[state=checked]:bg-emerald-500"
              />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 rounded-xl">
                    <MoreHorizontal className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white">
                  <DropdownMenuItem onClick={() => onEdit(device.device_id)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Chỉnh sửa
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onLockToggle(device.device_id)}>
                    {device.lock_status === "locked" ? (
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
                  <DropdownMenuItem onClick={() => hanleViewSharingList()}>
                    <List className="h-4 w-4 mr-2" />
                    Danh sách chia sẽ
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setIsSharingDialogOpen(true)}>
                    <Share2 className="h-4 w-4 mr-2" />
                    Chia sẻ thiết b ị
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDelete(device.device_id)} className="text-red-600">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Xóa thiết bị
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <Separator className="bg-white/10" />

          {/* Control Button */}
          {(device.template_type === "light" || device.template_type === "alarm") && (
            <div className="flex justify-end">
              <Button
                onClick={() => setIsControlDialogOpen(true)}
                className="bg-blue-600 hover:bg-blue-700"
                disabled={device.link_status === "unlinked" || device.lock_status === "locked"}
              >
                <Settings2 className="h-4 w-4 mr-2" />
                Điều khiển
              </Button>
            </div>
          )}

          {/* Device Status Overview */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <div className="flex items-center justify-between">
                <span className="text-blue-200 text-sm">Trạng thái kết nối</span>
                <div className="flex items-center space-x-2">
                  {device.link_status === "linked" ? (
                    <CheckCircle className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-400" />
                  )}
                  <span className="text-sm font-medium">
                    {device.link_status === "linked" ? "Đã liên kết" : "Chưa liên kết"}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <div className="flex items-center justify-between">
                <span className="text-blue-200 text-sm">Trạng thái khóa</span>
                <div className="flex items-center space-x-2">
                  {device.lock_status === "unlocked" ? (
                    <Unlock className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <Lock className="h-4 w-4 text-red-400" />
                  )}
                  <span className="text-sm font-medium">{device.lock_status === "unlocked" ? "Đã mở" : "Đã khóa"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Device Type Specific Controls */}
          {/* {device.template_type === "light" && <LightDetail device={device} onDeviceUpdate={onDeviceUpdate} />} */}
          {device.template_type === "smoke" && <SmokeDetectorDetail device={device} />}
          {device.template_type === "temperature" && <TemperatureDetail device={device} />}
          {device.template_type === "alarm" && <AlarmDetail device={device} />}

          {/* Enhanced Device Info */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <h3 className="text-xl font-semibold mb-6 flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              Thông tin thiết bị
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <span className="text-blue-200 text-sm">Device ID</span>
                  <span className="font-mono text-sm">{device.device_id}</span>
                </div>
              </div>

              <div className="bg-white/5 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <span className="text-blue-200 text-sm">Template</span>
                  <span className="text-sm">{device.template_name}</span>
                </div>
              </div>

              <div className="bg-white/5 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <span className="text-blue-200 text-sm">Firmware</span>
                  <span className="text-sm font-mono">{device.firmware_version}</span>
                </div>
              </div>

              <div className="bg-white/5 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <span className="text-blue-200 text-sm">WiFi</span>
                  <div className="flex items-center space-x-2">
                    {device.wifi_ssid ? (
                      <>
                        <Wifi className="h-4 w-4 text-emerald-400" />
                        <span className="text-sm">{device.wifi_ssid}</span>
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

              {device.hub_id && (
                <div className="bg-white/5 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-blue-200 text-sm">Hub</span>
                    <span className="text-sm font-mono">{device.hub_id}</span>
                  </div>
                </div>
              )}

              <div className="bg/white/5 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <span className="text-blue-200 text-sm">Cập nhật</span>
                  <span className="text-sm">{device.lastActivity}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Device Attributes */}
          {device.attribute && (
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <h3 className="text-xl font-semibold mb-6 flex items-center">
                <Cpu className="h-5 w-5 mr-2" />
                Cấu hình thiết bị
              </h3>
              <div className="space-y-3">
                {Object.entries(device.attribute).map(([key, value]) => (
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
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold flex items-center">
                <Activity className="h-5 w-5 mr-2" />
                Lịch sử hoạt động
              </h3>
              <Button variant="ghost" size="sm" className="text-blue-300 hover:text-white hover:bg-white/10 rounded-xl">
                Xem tất cả
                <ArrowUpRight className="ml-1 h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-4 p-3 bg-white/5 rounded-xl">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center mt-1">
                  <Bell className="h-5 w-5 text-emerald-400" />
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

              {device.last_reset_at && (
                <div className="flex items-start space-x-4 p-3 bg-white/5 rounded-xl">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center mt-1">
                    <Clock className="h-5 w-5 text-amber-400" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Thiết bị được reset</p>
                    <p className="text-sm text-blue-200">{new Date(device.last_reset_at).toLocaleString()}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </ScrollArea>

      {/* Control Dialog */}
      <Dialog open={isControlDialogOpen} onOpenChange={setIsControlDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          {device.template_type === "light" && (
            <LedControlDialog
              device={mappedDevice}
              onClose={() => setIsControlDialogOpen(false)}
              onDeviceUpdate={handleControlDialogUpdate}
            />
          )}
          {device.template_type === "alarm" && (
            <AlarmControlDialog
              device={mappedDevice}
              onClose={() => setIsControlDialogOpen(false)}
              onDeviceUpdate={handleControlDialogUpdate}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isSharingDialogOpen} onOpenChange={setIsSharingDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DeviceSharingDialog deviceId={device.device_id} onClose={() => setIsSharingDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Subcomponents
// function LightDetail({ device, onDeviceUpdate }) {
//   const handleBrightnessChange = (value) => {
//     const updatedDevice = {
//       ...device,
//       current_value: {
//         ...device.current_value,
//         brightness: value[0],
//       },
//       updated_at: new Date().toISOString(),
//     }
//     onDeviceUpdate(updatedDevice)
//   }

//   return (
//     <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
//       <h3 className="text-xl font-semibold mb-6 flex items-center">
//         <Lightbulb className="h-5 w-5 mr-2" />
//         Điều khiển đèn
//       </h3>
//       <div className="space-y-4">
//         <div>
//           <label className="text-blue-200 text-sm">Độ sáng</label>
//           <Slider
//             value={[device.current_value?.brightness || 0]}
//             onValueChange={handleBrightnessChange}
//             max={100}
//             step={1}
//             className="mt-2"
//             disabled={device.link_status === "unlinked" || device.lock_status === "locked"}
//           />
//         </div>
//       </div>
//     </div>
//   )
// }

function SmokeDetectorDetail({ device }) {
  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
      <h3 className="text-xl font-semibold mb-6 flex items-center">
        <Flame className="h-5 w-5 mr-2" />
        Thông tin báo khói
      </h3>
      <div className="space-y-3">
        <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
          <span className="text-blue-200 text-sm">Nồng độ khói</span>
          <span className="text-sm font-medium">{device.current_value?.ppm} ppm</span>
        </div>
        <div className="flex justify-between items-center p-3 bg/white/5 rounded-xl">
          <span className="text-blue-200 text-sm">Nhiệt độ</span>
          <span className="text-sm font-medium">{device.current_value?.temperature}°C</span>
        </div>
        <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
          <span className="text-blue-200 text-sm">Pin</span>
          <span className="text-sm font-medium">{device.current_value?.battery}%</span>
        </div>
      </div>
    </div>
  )
}

function TemperatureDetail({ device }) {
  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
      <h3 className="text-xl font-semibold mb-6 flex items-center">
        <Thermometer className="h-5 w-5 mr-2" />
        Thông tin nhiệt độ
      </h3>
      <div className="space-y-3">
        <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
          <span className="text-blue-200 text-sm">Nhiệt độ</span>
          <span className="text-sm font-medium">{device.current_value?.temperature}°C</span>
        </div>
        <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
          <span className="text-blue-200 text-sm">Độ ẩm</span>
          <span className="text-sm font-medium">{device.current_value?.humidity}%</span>
        </div>
        <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
          <span className="text-blue-200 text-sm">Chỉ số nhiệt</span>
          <span className="text-sm font-medium">{device.current_value?.heat_index}°C</span>
        </div>
      </div>
    </div>
  )
}

function AlarmDetail({ device }) {
  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
      <h3 className="text-xl font-semibold mb-6 flex items-center">
        <Bell className="h-5 w-5 mr-2" />
        Thông tin báo động
      </h3>
      <div className="space-y-3">
        <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
          <span className="text-blue-200 text-sm">Trạng thái kích hoạt</span>
          <span className="text-sm font-medium">{device.current_value?.armed ? "Đã kích hoạt" : "Chưa kích hoạt"}</span>
        </div>
        <div className="flex justify-between items-center p-3 bg/white/5 rounded-xl">
          <span className="text-blue-200 text-sm">Chế độ</span>
          <span className="text-sm font-medium">{device.current_value?.mode}</span>
        </div>
        <div className="flex justify-between items-center p-3 bg/white/5 rounded-xl">
          <span className="text-blue-200 text-sm">Phương thức thông báo</span>
          <span className="text-sm font-medium">{device.current_value?.notifyMethods?.join(", ")}</span>
        </div>
      </div>
    </div>
  )
}