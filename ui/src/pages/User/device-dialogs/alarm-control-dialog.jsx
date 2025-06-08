"use client"

import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Bell,
  ShieldAlert,
  Volume2,
  Clock,
  History,
  Settings,
  AlertTriangle,
  Phone,
  Mail,
  MessageSquare,
  Shield,
  ShieldCheck,
  ShieldOff,
  Siren,
  Timer,
} from "lucide-react"

export default function AlarmControlDialog({ 
  device,
  onClose,
  onDeviceUpdate,
}) {
  // Default device if not provided
  const defaultDevice = {
    id: "alarm-001",
    name: "Báo động Phòng khách",
    type: "alarm",
    status: "online",
    armed: false,
    sensitivity: 70,
    volume: 80,
    mode: "home",
    delay: 30, // seconds
    notifyMethods: ["app", "sms"],
    lastTriggered: "2024-01-15T14:30:00Z",
  }

  const deviceData = device || defaultDevice

  // State for device controls
  const [armed, setArmed] = useState(deviceData.armed)
  const [sensitivity, setSensitivity] = useState(deviceData.sensitivity)
  const [volume, setVolume] = useState(deviceData.volume)
  const [mode, setMode] = useState(deviceData.mode)
  const [delay, setDelay] = useState(deviceData.delay)
  const [notifyMethods, setNotifyMethods] = useState(deviceData.notifyMethods)
  const [activeTab, setActiveTab] = useState("controls")
  const [testMode, setTestMode] = useState(false)
  const [countdownActive, setCountdownActive] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [emergencyContact, setEmergencyContact] = useState("")
  const [alarmHistory, setAlarmHistory] = useState([
    {
      id: 1,
      timestamp: "2024-01-15T14:30:00Z",
      type: "motion",
      status: "triggered",
      resolved: true,
      resolvedAt: "2024-01-15T14:35:00Z",
    },
    {
      id: 2,
      timestamp: "2024-01-10T03:15:00Z",
      type: "door",
      status: "triggered",
      resolved: true,
      resolvedAt: "2024-01-10T03:20:00Z",
    },
    {
      id: 3,
      timestamp: "2023-12-25T22:45:00Z",
      type: "window",
      status: "triggered",
      resolved: true,
      resolvedAt: "2023-12-25T22:50:00Z",
    },
  ])

  // Update local state when device changes
  useEffect(() => {
    if (device) {
      setArmed(device.armed)
      setSensitivity(device.sensitivity)
      setVolume(device.volume)
      setMode(device.mode)
      setDelay(device.delay)
      setNotifyMethods(device.notifyMethods)
    }
  }, [device])

  // Countdown effect
  useEffect(() => {
    let timer
    if (countdownActive && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1)
      }, 1000)
    } else if (countdownActive && countdown === 0) {
      setCountdownActive(false)
      setArmed(true)
      onDeviceUpdate({ armed: true }) // Propagate arm state to parent
      console.log("Alarm armed after countdown")
    }
    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [countdownActive, countdown, onDeviceUpdate])

  // Handle arm/disarm
  const handleArmToggle = (checked) => {
    if (checked) {
      if (delay > 0) {
        setCountdown(delay)
        setCountdownActive(true)
      } else {
        setArmed(true)
        onDeviceUpdate({ armed: true }) // Propagate arm state to parent
        console.log("Arming alarm immediately")
      }
    } else {
      setArmed(false)
      setCountdownActive(false)
      onDeviceUpdate({ armed: false }) // Propagate disarm state to parent
      console.log("Disarming alarm")
    }
  }

  // Handle sensitivity change
  const handleSensitivityChange = (value) => {
    setSensitivity(value[0])
    onDeviceUpdate({ sensitivity: value[0] }) // Propagate sensitivity to parent
    console.log(`Setting sensitivity to ${value[0]}%`)
  }

  // Handle volume change
  const handleVolumeChange = (value) => {
    setVolume(value[0])
    onDeviceUpdate({ volume: value[0] }) // Propagate volume to parent
    console.log(`Setting volume to ${value[0]}%`)
  }

  // Handle mode change
  const handleModeChange = (value) => {
    setMode(value)
    onDeviceUpdate({ mode: value }) // Propagate mode to parent
    console.log(`Setting mode to ${value}`)
  }

  // Handle delay change
  const handleDelayChange = (value) => {
    setDelay(Number.parseInt(value))
    onDeviceUpdate({ delay: Number.parseInt(value) }) // Propagate delay to parent
    console.log(`Setting delay to ${value} seconds`)
  }

  // Handle notification method toggle
  const handleNotifyMethodToggle = (method) => {
    const updatedMethods = notifyMethods.includes(method)
      ? notifyMethods.filter((m) => m !== method)
      : [...notifyMethods, method]
    setNotifyMethods(updatedMethods)
    onDeviceUpdate({ notifyMethods: updatedMethods }) // Propagate notifyMethods to parent
    console.log(`Updated notification methods: ${updatedMethods}`)
  }

  // Handle test alarm
  const handleTestAlarm = () => {
    setTestMode(true)
    console.log("Testing alarm")
    setTimeout(() => {
      setTestMode(false)
    }, 3000)
  }

  // Handle emergency contact save
  const handleSaveEmergencyContact = () => {
    // Here you would save the emergency contact (not propagated to device state)
    console.log(`Saving emergency contact: ${emergencyContact}`)
    alert(`Đã lưu số liên hệ khẩn cấp: ${emergencyContact}`)
  }

  // Get alarm type icon
  const getAlarmTypeIcon = (type) => {
    switch (type) {
      case "motion":
        return <AlertTriangle className="h-4 w-4" />
      case "door":
        return <Shield className="h-4 w-4" />
      case "window":
        return <Shield className="h-4 w-4" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}> {/* Use onClose for state management */}
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <ShieldAlert className="h-5 w-5 text-red-500" />
            <span>Điều khiển {deviceData.name}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="controls">Điều khiển</TabsTrigger>
              <TabsTrigger value="settings">Cài đặt</TabsTrigger>
              <TabsTrigger value="history">Lịch sử</TabsTrigger>
            </TabsList>

            <TabsContent value="controls" className="space-y-6 py-4">
              {/* Arm/Disarm Control */}
              <div className="flex flex-col space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {armed ? (
                      <ShieldCheck className="h-5 w-5 text-green-500" />
                    ) : (
                      <ShieldOff className="h-5 w-5 text-gray-400" />
                    )}
                    <Label htmlFor="armed" className="text-base">
                      Trạng thái bảo vệ
                    </Label>
                  </div>
                  <Switch id="armed" checked={armed || countdownActive} onCheckedChange={handleArmToggle} />
                </div>

                {/* Countdown display */}
                {countdownActive && (
                  <div className="bg-amber-50 border border-amber-200 rounded-md p-3 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Timer className="h-5 w-5 text-amber-500 animate-pulse" />
                      <span className="text-amber-700">Đang kích hoạt bảo vệ...</span>
                    </div>
                    <span className="font-bold text-amber-700">{countdown}s</span>
                  </div>
                )}

                {/* Status display */}
                {!countdownActive && (
                  <div
                    className={`rounded-md p-3 flex items-center justify-between ${armed ? "bg-green-50 border border-green-200" : "bg-gray-50 border border-gray-200"
                      }`}
                  >
                    <div className="flex items-center space-x-2">
                      {armed ? (
                        <ShieldCheck className="h-5 w-5 text-green-500" />
                      ) : (
                        <ShieldOff className="h-5 w-5 text-gray-400" />
                      )}
                      <span className={armed ? "text-green-700" : "text-gray-500"}>
                        {armed ? "Đã kích hoạt bảo vệ" : "Chưa kích hoạt bảo vệ"}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Mode Selection */}
              <div className="space-y-2">
                <Label className="text-base flex items-center space-x-2">
                  <Settings className="h-5 w-5 text-blue-500" />
                  <span>Chế độ bảo vệ</span>
                </Label>
                <Select value={mode} onValueChange={handleModeChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Chọn chế độ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="home">Có người ở nhà</SelectItem>
                    <SelectItem value="away">Vắng nhà</SelectItem>
                    <SelectItem value="night">Ban đêm</SelectItem>
                    <SelectItem value="vacation">Đi du lịch</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500 mt-1">
                  {mode === "home"
                    ? "Chỉ giám sát cửa ra vào và cửa sổ"
                    : mode === "away"
                      ? "Giám sát toàn bộ cảm biến trong nhà"
                      : mode === "night"
                        ? "Giám sát cửa ra vào, cửa sổ và khu vực chung"
                        : "Giám sát toàn bộ và tăng độ nhạy"}
                </p>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <Button
                  variant="outline"
                  className="flex flex-col items-center justify-center h-20 space-y-1"
                  onClick={handleTestAlarm}
                >
                  <Siren className={`h-6 w-6 ${testMode ? "text-red-500 animate-pulse" : "text-gray-500"}`} />
                  <span className="text-xs">{testMode ? "Đang kiểm tra..." : "Kiểm tra báo động"}</span>
                </Button>

                <Button
                  variant="outline"
                  className="flex flex-col items-center justify-center h-20 space-y-1"
                  onClick={() => setActiveTab("settings")}
                >
                  <Settings className="h-6 w-6 text-gray-500" />
                  <span className="text-xs">Cài đặt nâng cao</span>
                </Button>
              </div>

              {/* Last Triggered */}
              {deviceData.lastTriggered && (
                <div className="pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <History className="h-4 w-4" />
                    <span>
                      Kích hoạt gần nhất:{" "}
                      {new Date(deviceData.lastTriggered).toLocaleString("vi-VN", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </span>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="settings" className="space-y-6 py-4">
              {/* Sensitivity Control */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="sensitivity" className="text-base flex items-center space-x-2">
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                    <span>Độ nhạy cảm biến</span>
                  </Label>
                  <span className="text-sm font-medium">{sensitivity}%</span>
                </div>
                <Slider
                  id="sensitivity"
                  value={[sensitivity]}
                  min={10}
                  max={100}
                  step={10}
                  onValueChange={handleSensitivityChange}
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Thấp</span>
                  <span>Cao</span>
                </div>
              </div>

              {/* Volume Control */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="volume" className="text-base flex items-center space-x-2">
                    <Volume2 className="h-5 w-5 text-purple-500" />
                    <span>Âm lượng báo động</span>
                  </Label>
                  <span className="text-sm font-medium">{volume}%</span>
                </div>
                <Slider id="volume" value={[volume]} min={0} max={100} step={10} onValueChange={handleVolumeChange} />
              </div>

              {/* Entry Delay */}
              <div className="space-y-2">
                <Label className="text-base flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-blue-500" />
                  <span>Thời gian trễ kích hoạt</span>
                </Label>
                <Select value={delay.toString()} onValueChange={handleDelayChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Chọn thời gian trễ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Không có trễ</SelectItem>
                    <SelectItem value="15">15 giây</SelectItem>
                    <SelectItem value="30">30 giây</SelectItem>
                    <SelectItem value="45">45 giây</SelectItem>
                    <SelectItem value="60">60 giây</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500 mt-1">
                  Thời gian trễ giúp bạn có thể ra/vào nhà mà không kích hoạt báo động ngay lập tức
                </p>
              </div>

              {/* Notification Methods */}
              <div className="space-y-3">
                <Label className="text-base flex items-center space-x-2">
                  <Bell className="h-5 w-5 text-red-500" />
                  <span>Phương thức thông báo</span>
                </Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="notify-app"
                      checked={notifyMethods.includes("app")}
                      onCheckedChange={() => handleNotifyMethodToggle("app")}
                    />
                    <Label htmlFor="notify-app" className="flex items-center space-x-2">
                      <MessageSquare className="h-4 w-4 text-blue-500" />
                      <span>Thông báo ứng dụng</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="notify-sms"
                      checked={notifyMethods.includes("sms")}
                      onCheckedChange={() => handleNotifyMethodToggle("sms")}
                    />
                    <Label htmlFor="notify-sms" className="flex items-center space-x-2">
                      <MessageSquare className="h-4 w-4 text-green-500" />
                      <span>Tin nhắn SMS</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="notify-email"
                      checked={notifyMethods.includes("email")}
                      onCheckedChange={() => handleNotifyMethodToggle("email")}
                    />
                    <Label htmlFor="notify-email" className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-amber-500" />
                      <span>Email</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="notify-call"
                      checked={notifyMethods.includes("call")}
                      onCheckedChange={() => handleNotifyMethodToggle("call")}
                    />
                    <Label htmlFor="notify-call" className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-red-500" />
                      <span>Cuộc gọi tự động</span>
                    </Label>
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="space-y-2 pt-2 border-t border-gray-100">
                <Label className="text-base flex items-center space-x-2">
                  <Phone className="h-5 w-5 text-red-500" />
                  <span>Liên hệ khẩn cấp</span>
                </Label>
                <div className="flex space-x-2">
                  <Input
                    placeholder="Nhập số điện thoại"
                    value={emergencyContact}
                    onChange={(e) => setEmergencyContact(e.target.value)}
                  />
                  <Button onClick={handleSaveEmergencyContact}>Lưu</Button>
                </div>
                <p className="text-xs text-gray-500">Số điện thoại sẽ được gọi khi báo động kích hoạt</p>
              </div>
            </TabsContent>

            <TabsContent value="history" className="space-y-4 py-4">
              <Label className="text-base flex items-center space-x-2">
                <History className="h-5 w-5 text-blue-500" />
                <span>Lịch sử báo động</span>
              </Label>

              <div className="space-y-3">
                {alarmHistory.length > 0 ? (
                  alarmHistory.map((event) => (
                    <div
                      key={event.id}
                      className="border rounded-md p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center space-x-2">
                          {getAlarmTypeIcon(event.type)}
                          <span className="font-medium">
                            {event.type === "motion"
                              ? "Phát hiện chuyển động"
                              : event.type === "door"
                                ? "Cửa ra vào mở"
                                : "Cửa sổ mở"}
                          </span>
                        </div>
                        <Badge
                          variant={event.resolved ? "outline" : "destructive"}
                          className={
                            event.resolved ? "bg-green-100 text-green-700 border-green-200" : "bg-red-100 text-red-700"
                          }
                        >
                          {event.resolved ? "Đã xử lý" : "Chưa xử lý"}
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-500 flex justify-between">
                        <span>
                          {new Date(event.timestamp).toLocaleString("vi-VN", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </span>
                        {event.resolved && (
                          <span>
                            Xử lý sau:{" "}
                            {Math.round((new Date(event.resolvedAt) - new Date(event.timestamp)) / 1000 / 60)} phút
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <History className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500">Chưa có lịch sử báo động</p>
                  </div>
                )}
              </div>

              {alarmHistory.length > 0 && (
                <Button variant="outline" className="w-full">
                  Xem tất cả lịch sử
                </Button>
              )}
            </TabsContent>
          </Tabs>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}