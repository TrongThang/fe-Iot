"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  Camera,
  Play,
  Pause,
  Square,
  Maximize,
  Settings,
  Wifi,
  WifiOff,
  MoreHorizontal,
  Edit,
  Trash2,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function CameraControl({ camera, onBack, onUpdateCamera }) {
  const [cameraState, setCameraState] = useState({
    ...camera,
    isPlaying: false,
    isRecording: false,
    recordingStartTime: null,
  })
  const [currentTime, setCurrentTime] = useState(new Date())

  // Update current time
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const formatTime = (date) => {
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  const formatDate = (date) => {
    return date.toLocaleDateString("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
  }

  const getRecordingDuration = (startTime) => {
    if (!startTime) return ""
    const duration = Math.floor((Date.now() - startTime) / 1000)
    const minutes = Math.floor(duration / 60)
    const seconds = duration % 60
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }

  const handleTogglePlay = () => {
    const newState = { ...cameraState, isPlaying: !cameraState.isPlaying }
    setCameraState(newState)
    onUpdateCamera(newState)
  }

  const handleToggleRecord = () => {
    const newState = {
      ...cameraState,
      isRecording: !cameraState.isRecording,
      recordingStartTime: !cameraState.isRecording ? Date.now() : null,
    }
    setCameraState(newState)
    onUpdateCamera(newState)
  }

  const handleTogglePower = (checked) => {
    const newState = {
      ...cameraState,
      isOn: checked,
      status: checked ? "active" : "inactive",
      isPlaying: checked ? cameraState.isPlaying : false,
      isRecording: checked ? cameraState.isRecording : false,
      recordingStartTime: checked ? cameraState.recordingStartTime : null,
    }
    setCameraState(newState)
    onUpdateCamera(newState)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
          <div className="px-4 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full hover:bg-slate-100">
                <ArrowLeft className="h-5 w-5" />
              </Button>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
                  <Camera className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-slate-900">{cameraState.name}</h1>
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant={cameraState.isRecording ? "destructive" : cameraState.isOn ? "default" : "secondary"}
                    >
                      {cameraState.isRecording ? "Đang ghi" : cameraState.isOn ? "Trực tuyến" : "Ngoại tuyến"}
                    </Badge>
                    <span className="text-xs text-slate-500">•</span>
                    <span className="text-xs text-slate-500">{cameraState.room}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-100">
                    <MoreHorizontal className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Edit className="h-4 w-4 mr-2" />
                    Chỉnh sửa
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="h-4 w-4 mr-2" />
                    Cài đặt
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Xóa camera
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Camera View */}
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="relative aspect-video bg-gradient-to-br from-slate-100 to-slate-200">
                  {/* Video Area */}
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <div
                        className={`w-24 h-24 mx-auto mb-4 rounded-full flex items-center justify-center ${
                          !cameraState.isOn ? "bg-gray-300" : cameraState.isRecording ? "bg-red-100" : "bg-blue-100"
                        }`}
                      >
                        <Camera
                          className={`w-12 h-12 ${
                            !cameraState.isOn
                              ? "text-gray-500"
                              : cameraState.isRecording
                                ? "text-red-600"
                                : "text-blue-600"
                          }`}
                        />
                      </div>
                      <div className="text-xl font-medium text-slate-900">{cameraState.name}</div>
                      <div className="text-sm text-slate-500">{cameraState.resolution}</div>
                      {!cameraState.isOn && (
                        <div className="text-sm text-red-500 mt-2 flex items-center justify-center gap-2">
                          <WifiOff className="w-4 h-4" />
                          Camera đã tắt
                        </div>
                      )}
                      {cameraState.isOn && (
                        <div className="text-sm text-green-600 mt-2 flex items-center justify-center gap-2">
                          <Wifi className="w-4 h-4" />
                          Kết nối ổn định
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Status Indicators */}
                  <div className="absolute top-4 left-4 flex items-center gap-3">
                    <div
                      className={`w-4 h-4 rounded-full ${
                        cameraState.isOn ? "bg-green-500" : "bg-gray-500"
                      } ${cameraState.isRecording ? "animate-pulse" : ""}`}
                    />
                    {cameraState.isRecording && (
                      <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium animate-pulse">
                        REC {getRecordingDuration(cameraState.recordingStartTime)}
                      </div>
                    )}
                  </div>

                  {/* Live Indicator */}
                  {cameraState.isPlaying && cameraState.isOn && (
                    <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      LIVE
                    </div>
                  )}

                  {/* Fullscreen Button */}
                  <Button
                    size="sm"
                    variant="secondary"
                    className="absolute bottom-4 right-4 bg-white/90 hover:bg-white"
                    disabled={!cameraState.isOn}
                  >
                    <Maximize className="w-4 h-4 text-black" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Camera Controls */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Điều khiển Camera</h3>
                    <Switch checked={cameraState.isOn} onCheckedChange={handleTogglePower} className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-gray-300"/>
                  </div>

                  <Separator className="my-4" />

                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={handleTogglePlay}
                        disabled={!cameraState.isOn}
                      >
                        {cameraState.isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                        {cameraState.isPlaying ? "Tạm dừng" : "Phát"}
                      </Button>
                      <Button
                        variant={cameraState.isRecording ? "destructive" : "outline"}
                        className="flex-1"
                        onClick={handleToggleRecord}
                        disabled={!cameraState.isOn}
                      >
                        <Square className="w-4 h-4 mr-2" />
                        {cameraState.isRecording ? "Dừng ghi" : "Bắt đầu ghi"}
                      </Button>
                    </div>

                    {cameraState.isRecording && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                            <span className="text-sm font-medium text-red-700">Đang ghi hình</span>
                          </div>
                          <div className="text-sm font-mono text-red-700">
                            {getRecordingDuration(cameraState.recordingStartTime)}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Camera Info */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Thông tin Camera</h3>

                  <Separator className="my-4" />

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">ID Camera</span>
                      <span className="font-medium">{cameraState.id}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Độ phân giải</span>
                      <span className="font-medium">{cameraState.resolution}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Nhóm</span>
                      <span className="font-medium">{cameraState.group_name}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Vị trí</span>
                      <span className="font-medium">{cameraState.room}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Trạng thái</span>
                      <Badge
                        variant={cameraState.isRecording ? "destructive" : cameraState.isOn ? "default" : "secondary"}
                      >
                        {cameraState.isRecording ? "Đang ghi" : cameraState.isOn ? "Trực tuyến" : "Ngoại tuyến"}
                      </Badge>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Cập nhật lần cuối</span>
                      <span className="font-medium">{cameraState.lastActivity}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
