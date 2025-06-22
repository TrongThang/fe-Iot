"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft, Search, Plus, MoreHorizontal, Edit, Trash2, Home, Bed,
  ChefHat,
  Sofa,
  Bath,
  Car,
  Briefcase,
  TreePine,
  Lightbulb,
  Thermometer,
  Wifi,
  AlertTriangle,
  Activity,
  Clock,
  TrendingUp,
  Database,
  ArrowRight
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import AddSpacePopup from "./spacePopups/Add-space-popup"
import EditSpacePopup from "./spacePopups/Edit-space-popup"
import DeviceList from "./device/deviceList"
import Swal from "sweetalert2"

export default function SpaceTab({ houseId, houseName, onBack, onSpaceClick }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isAddSpacePopupOpen, setIsAddSpacePopupOpen] = useState(false);
  const [isEditSpacePopupOpen, setIsEditSpacePopupOpen] = useState(false);
  const [spaceToEdit, setSpaceToEdit] = useState(null);
  const [selectedSpace, setSelectedSpace] = useState(null);
  const [showDeviceList, setShowDeviceList] = useState(false);
  const accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJBQ0NUMTBKVU4yNTAxSlhCV1k5UlBGR1Q0NEU0WUNCUSIsInVzZXJuYW1lIjoidGhhbmhzYW5nMDkxMjEiLCJyb2xlIjoidXNlciIsImlhdCI6MTc0OTk4OTMwNCwiZXhwIjoxNzQ5OTkyOTA0fQ.j6DCx4JInPkd7xXBPaL3XoBgEadKenacoQAlOj3lNrE";

  const fetchSpaces = async (houseId) => {
    try {
      const res = await fetch(`http://localhost:7777/api/spaces/house/${houseId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (res.ok) {
        const dataSpace = await res.json();
        setSpaces(Array.isArray(dataSpace) ? dataSpace : [])
      } else {
        console.error(`Failed to fetch spaces for house ${houseId}: ${res.status} ${res.statusText}`);
        return [];
      }
    } catch (error) {
      console.error(`Error fetching spaces for house ${houseId}:`, error);
      return [];
    }
  };

  // Mock data based on database schema
  const [spaces, setSpaces] = useState([
    {
      space_id: 1,
      house_id: houseId,
      name: "Phòng khách",
      created_at: "2024-01-01T08:00:00Z",
      updated_at: "2024-01-20T14:30:00Z",
      is_deleted: false,
      // Related data from other tables
      devices_count: 8,
      active_devices_count: 6,
      alerts_count: 2,
      recent_alerts: [
        {
          alert_id: 1,
          device_serial: "SMK001-2024-001",
          message: "Phát hiện khói bất thường",
          timestamp: "2024-01-20T14:25:00Z",
          status: "active",
          alert_type_id: 1,
        },
        {
          alert_id: 2,
          device_serial: "TEMP001-2024-003",
          message: "Nhiệt độ cao bất thường",
          timestamp: "2024-01-20T13:15:00Z",
          status: "resolved",
          alert_type_id: 2,
        },
      ],
      hourly_values: {
        latest_hour: "2024-01-20T14:00:00Z",
        avg_temperature: 24.5,
        avg_humidity: 65,
        sample_count: 12,
      },
      icon_name: "sofa", // From houses table for space type
      icon_color: "#3B82F6",
    }
  ])

  // Simulate loading
  useEffect(() => {
    fetchSpaces(houseId)
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  const getSpaceIcon = (iconName) => {
    const iconProps = { className: "h-6 w-6 text-white" }
    switch (iconName) {
      case "sofa":
        return <Sofa {...iconProps} />
      case "bed":
        return <Bed {...iconProps} />
      case "chef-hat":
        return <ChefHat {...iconProps} />
      case "bath":
        return <Bath {...iconProps} />
      case "briefcase":
        return <Briefcase {...iconProps} />
      case "car":
        return <Car {...iconProps} />
      case "tree-pine":
        return <TreePine {...iconProps} />
      default:
        return <Home {...iconProps} />
    }
  }

  const getAlertSeverityColor = (alertsCount) => {
    if (alertsCount === 0) return "text-emerald-500"
    if (alertsCount <= 2) return "text-amber-500"
    return "text-red-500"
  }

  const handleDeleteSpace = async (spaceId) => {
    const result = await Swal.fire({
      title: "Xác nhận xóa",
      text: "Bạn có chắc muốn xóa không gian này? Hành động này không thể hoàn tác!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`http://localhost:7777/api/spaces/${spaceId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (res.ok) {
          setSpaces((prev) => prev.filter((s) => s.space_id !== spaceId));
          Swal.fire({
            icon: "success",
            title: "Thành công",
            text: "Xóa không gian thành công!",
            confirmButtonText: "OK",
            confirmButtonColor: "#28a745",
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Lỗi",
            text: `Xóa không gian thất bại: ${res.status} ${res.statusText}`,
            confirmButtonText: "OK",
            confirmButtonColor: "#dc3545",
          });
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: "Xóa không gian thất bại: " + error.message,
          confirmButtonText: "OK",
          confirmButtonColor: "#dc3545",
        });
      }
    }
  };

  const handleEditSpace = (spaceId) => {
    const space = spaces.find((s) => s.space_id === spaceId);
    if (space) {
      setSpaceToEdit(space);
      setIsEditSpacePopupOpen(true);
    }
  };

  const handleAddSpace = () => {
    setIsAddSpacePopupOpen(true);
  }

  const handleSpaceClick = (space) => {
    setSelectedSpace(space);
    setShowDeviceList(true);
  };

  const handleBackToSpaces = () => {
    setShowDeviceList(false);
    setSelectedSpace(null);
  };

  const handleManageDevices = (space) => {
    console.log("Manage devices for space:", space)
    if (onSpaceClick) {
      onSpaceClick(space)
    }
  }

  const filteredSpaces = spaces.filter(
    (space) =>
      !space.is_deleted &&
      (space.name || "").toLowerCase().includes((searchQuery || "").toLowerCase())
  )

  // Statistics
  const totalDevices = spaces.reduce((sum, space) => sum + space.devices_count, 0)
  const totalActiveDevices = spaces.reduce((sum, space) => sum + space.active_devices_count, 0)
  const totalAlerts = spaces.reduce((sum, space) => sum + space.alerts_count, 0)

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Database className="h-12 w-12 text-blue-500 animate-pulse mx-auto mb-4" />
                <p className="text-slate-600">Đang tải dữ liệu không gian...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (showDeviceList && selectedSpace) {
    return (
      <DeviceList
        spaceId={selectedSpace.space_id}
        houseId={houseId}
        spaceName={selectedSpace.space_name}
        spaceType={selectedSpace.icon_name}
        onBack={handleBackToSpaces}
      />
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={onBack} className="p-2">
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <CardTitle className="flex items-center space-x-2">
                <Home className="h-5 w-5 text-blue-500" />
                <span>{houseName} - Danh sách không gian</span>
                <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                  {filteredSpaces.length}
                </Badge>
              </CardTitle>
            </div>
            <Button onClick={handleAddSpace} className="bg-blue-500 hover:bg-blue-600">
              <Plus className="h-4 w-4 mr-2" />
              Thêm không gian
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Statistics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600 font-medium">Tổng không gian</p>
                  <p className="text-2xl font-bold text-blue-700">{filteredSpaces.length || 0}</p>
                </div>
                <Home className="h-8 w-8 text-blue-500" />
              </div>
            </div>

            <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-xl p-4 border border-emerald-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-emerald-600 font-medium">Thiết bị hoạt động</p>
                  <p className="text-2xl font-bold text-emerald-700">
                    {totalActiveDevices || 0}/{totalDevices || 0}
                  </p>
                </div>
                <Activity className="h-8 w-8 text-emerald-500" />
              </div>
            </div>

            <div className="bg-gradient-to-r from-amber-50 to-amber-100 rounded-xl p-4 border border-amber-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-amber-600 font-medium">Cảnh báo</p>
                  <p className="text-2xl font-bold text-amber-700">{totalAlerts || 0}</p>
                </div>
                <AlertTriangle className={`h-8 w-8 ${getAlertSeverityColor(totalAlerts)}`} />
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-600 font-medium">Dữ liệu theo giờ</p>
                  <p className="text-2xl font-bold text-purple-700">
                    {spaces.reduce((sum, space) => sum + (space.hourly_values?.sample_count || 0), 0)}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-500" />
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Tìm kiếm không gian..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12"
            />
          </div>

          {/* Spaces Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredSpaces.map((space) => (
              <div
                key={space.space_id}
                className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-xl hover:border-blue-300 transition-all duration-300 group relative overflow-hidden cursor-pointer"
                onClick={() => handleSpaceClick(space)}
              >
                {/* Background gradient accent */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

                <div className="relative z-10">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      {/* Space Icon */}
                      <div className="relative">
                        <div
                          className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-200"
                          style={{ backgroundColor: space.icon_color }}
                        >
                          {getSpaceIcon(space.icon_name)}
                        </div>
                        {/* Alert indicator */}
                        {space.alerts_count > 0 && (
                          <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center border-2 border-white">
                            <span className="text-xs font-bold text-white">{space.alerts_count}</span>
                          </div>
                        )}
                      </div>

                      {/* Space Info */}
                      <div>
                        <h3 className="font-semibold text-slate-900 text-lg group-hover:text-blue-700 transition-colors">
                          {space.space_name}
                        </h3>
                        <p className="text-sm">{space.space_description}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="secondary" className="text-xs px-2 py-1 bg-slate-100 text-slate-600">
                            ID: {space.space_id}
                          </Badge>
                          <span className="text-xs text-slate-500">
                            Tạo: {new Date(space.created_at).toLocaleDateString("vi-VN")}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-slate-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreHorizontal className="h-4 w-4 text-slate-600" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 bg-white">
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation()
                            handleEditSpace(space.space_id)
                          }}
                        >
                          <Edit className="h-4 w-4 mr-3" />
                          Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation()
                            handleManageDevices(space)
                          }}
                        >
                          <Lightbulb className="h-4 w-4 mr-3" />
                          Quản lý thiết bị
                        </DropdownMenuItem>
                        <div className="border-t my-1" />
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteSpace(space.space_id)
                          }}
                          className="text-red-600 focus:text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-3" />
                          Xóa không gian
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Device Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-3 bg-slate-50 rounded-xl group-hover:bg-blue-50 transition-colors">
                      <div className="flex items-center justify-center mb-1">
                        <Lightbulb className="h-4 w-4 text-blue-500 mr-1" />
                        <span className="text-lg font-bold text-slate-700 group-hover:text-blue-600">
                          {space.devices_count}
                        </span>
                      </div>
                      <span className="text-xs text-slate-500">Thiết bị</span>
                    </div>

                    <div className="text-center p-3 bg-slate-50 rounded-xl group-hover:bg-emerald-50 transition-colors">
                      <div className="flex items-center justify-center mb-1">
                        <Wifi className="h-4 w-4 text-emerald-500 mr-1" />
                        <span className="text-lg font-bold text-slate-700 group-hover:text-emerald-600">
                          {space.active_devices_count}
                        </span>
                      </div>
                      <span className="text-xs text-slate-500">Hoạt động</span>
                    </div>

                    <div className="text-center p-3 bg-slate-50 rounded-xl group-hover:bg-amber-50 transition-colors">
                      <div className="flex items-center justify-center mb-1">
                        <AlertTriangle className={`h-4 w-4 mr-1 ${getAlertSeverityColor(space.alerts_count)}`} />
                        <span
                          className={`text-lg font-bold group-hover:text-amber-600 ${getAlertSeverityColor(space.alerts_count)}`}
                        >
                          {space.alerts_count}
                        </span>
                      </div>
                      <span className="text-xs text-slate-500">Cảnh báo</span>
                    </div>
                  </div>

                  {/* Environmental Data */}
                  {space.hourly_values && (
                    <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl p-4 mb-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-medium text-slate-700 flex items-center">
                          <Thermometer className="h-4 w-4 mr-2" />
                          Dữ liệu môi trường
                        </h4>
                        <span className="text-xs text-slate-500">
                          {new Date(space.hourly_values.latest_hour).toLocaleTimeString("vi-VN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="text-center">
                          <div className="text-sm font-semibold text-slate-700">
                            {space.hourly_values.avg_temperature}°C
                          </div>
                          <div className="text-xs text-slate-500">Nhiệt độ TB</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-semibold text-slate-700">
                            {space.hourly_values.avg_humidity}%
                          </div>
                          <div className="text-xs text-slate-500">Độ ẩm TB</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-semibold text-slate-700">{space.hourly_values.sample_count}</div>
                          <div className="text-xs text-slate-500">Mẫu dữ liệu</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Recent Alerts */}
                  {space.recent_alerts && space.recent_alerts.length > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
                      <h4 className="text-sm font-medium text-red-700 mb-2 flex items-center">
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        Cảnh báo gần đây
                      </h4>
                      <div className="space-y-2">
                        {space.recent_alerts.slice(0, 2).map((alert) => (
                          <div key={alert.alert_id} className="flex items-start space-x-2">
                            <div
                              className={`w-2 h-2 rounded-full mt-2 ${alert.status === "active" ? "bg-red-500" : "bg-gray-400"
                                }`}
                            />
                            <div className="flex-1">
                              <p className="text-xs text-red-700 font-medium">{alert.message}</p>
                              <p className="text-xs text-red-500">
                                {new Date(alert.timestamp).toLocaleString("vi-VN")} • {alert.device_serial}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-slate-600">
                      <span>Thiết bị hoạt động</span>
                      <span>
                        {space.active_devices_count}/{space.devices_count}
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${space.devices_count > 0 ? (space.active_devices_count / space.devices_count) * 100 : 0}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-3 w-3 text-slate-400" />
                      <span className="text-xs text-slate-500">
                        Cập nhật: {new Date(space.updated_at).toLocaleString("vi-VN")}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                        Click để xem thiết bị
                      </span>
                      <div className="text-slate-400 group-hover:text-blue-500 transition-colors">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="transform group-hover:translate-x-1 transition-transform duration-200"
                        >
                          <path
                            d="M9 18L15 12L9 6"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredSpaces.length === 0 && (
            <div className="text-center py-12">
              <Home className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Không tìm thấy không gian nào trong {houseName}</p>
            </div>
          )}
        </CardContent>
      </Card>
      <AddSpacePopup
        open={isAddSpacePopupOpen}
        onOpenChange={setIsAddSpacePopupOpen}
        onSave={(newSpace) => {
          setSpaces((prev) => [...prev, newSpace]);
          setIsAddSpacePopupOpen(false);
        }}
        houseId={houseId}
      />
      <EditSpacePopup
        open={isEditSpacePopupOpen}
        onOpenChange={setIsEditSpacePopupOpen}
        onSave={(updatedSpace) => {
          setSpaces((prev) => prev.map(s => s.space_id === updatedSpace.space_id ? { ...s, ...updatedSpace } : s));
          setIsEditSpacePopupOpen(false);
        }}
        space={spaceToEdit}
      />
    </div>
  )
}
