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
  Power,
  ArrowUpRight,
  Wifi,
  WifiOff,
  Battery,
  Activity,
  Lock,
  Unlock,
  CheckCircle,
  XCircle,
  Clock,
  Cpu,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Slider } from "@/components/ui/slider"

export default function DeviceDetail({ device, onDeviceUpdate, onEdit, onDelete, onLockToggle, onClose }) {
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
        return <Power {...iconProps} />
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

  const handlePowerToggle = (checked) => {
    const updatedDevice = {
      ...device,
      power_status: checked,
      updated_at: new Date().toISOString(),
    }
    onDeviceUpdate(updatedDevice)
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
                  <DropdownMenuItem onClick={() => onDelete(device.device_id)} className="text-red-600">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Xóa thiết bị
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <Separator className="bg-white/10" />

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
          {device.template_type === "light" && <LightDetail device={device} onDeviceUpdate={onDeviceUpdate} />}
          {device.template_type === "smoke" && <SmokeDetectorDetail device={device} />}
          {device.template_type === "temperature" && <TemperatureDetail device={device} />}

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

              <div className="bg-white/5 rounded-xl p-4">
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

              {device.last_reset_at && (
                <div className="flex items-start space-x-4 p-3 bg-white/5 rounded-xl">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center mt-1">
                    <Clock className="h-5 w-5 text-amber-400" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Thiết bị được reset</p>
                    <p className="text-sm text-blue-200">{new Date(device.last_reset_at).toLocaleString("vi-VN")}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}

// Enhanced Light Detail Component
function LightDetail({ device, onDeviceUpdate }) {
  const [brightness, setBrightness] = useState(device.current_value?.brightness || 0)

  const handleBrightnessChange = (value) => {
    setBrightness(value[0])
    // Update device with new brightness
    const updatedDevice = {
      ...device,
      current_value: {
        ...device.current_value,
        brightness: value[0],
      },
      updated_at: new Date().toISOString(),
    }
    onDeviceUpdate(updatedDevice)
  }

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
            onValueChange={handleBrightnessChange}
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
              className={`h-1.5 rounded-full ${
                battery > 70 ? "bg-emerald-500" : battery > 30 ? "bg-amber-500" : "bg-red-500"
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
