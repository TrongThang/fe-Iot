"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Search,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Home,
  Bed,
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
  Users,
  Filter,
  MapPin,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function SpaceList() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [selectedHouseFilter, setSelectedHouseFilter] = useState("all")
  const [selectedGroupFilter, setSelectedGroupFilter] = useState("all")
  const [showFilters, setShowFilters] = useState(false)

  // Mock data for groups
  const [groups] = useState([
    { id: 1, name: "Gia đình", color: "blue" },
    { id: 2, name: "Công ty", color: "green" },
    { id: 3, name: "Nhà nghỉ dưỡng", color: "purple" },
  ])

  // Mock data for houses
  const [houses] = useState([
    { id: 1, name: "Nhà chính", address: "123 Đường ABC, Quận 1, TP.HCM", groupId: 1, groupName: "Gia đình" },
    { id: 2, name: "Nhà phụ", address: "456 Đường XYZ, Quận 2, TP.HCM", groupId: 1, groupName: "Gia đình" },
    { id: 3, name: "Văn phòng", address: "789 Đường DEF, Quận 3, TP.HCM", groupId: 2, groupName: "Công ty" },
    { id: 4, name: "Biệt thự biển", address: "101 Đường GHI, Vũng Tàu", groupId: 3, groupName: "Nhà nghỉ dưỡng" },
  ])

  // Enhanced mock data for spaces with house and group information
  const [spaces, setSpaces] = useState([
    {
      space_id: 1,
      house_id: 1,
      house_name: "Nhà chính",
      house_address: "123 Đường ABC, Quận 1, TP.HCM",
      group_id: 1,
      group_name: "Gia đình",
      name: "Phòng khách",
      created_at: "2024-01-01T08:00:00Z",
      updated_at: "2024-01-20T14:30:00Z",
      is_deleted: false,
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
      ],
      hourly_values: {
        latest_hour: "2024-01-20T14:00:00Z",
        avg_temperature: 24.5,
        avg_humidity: 65,
        sample_count: 12,
      },
      icon_name: "sofa",
      icon_color: "#3B82F6",
    },
    {
      space_id: 2,
      house_id: 1,
      house_name: "Nhà chính",
      house_address: "123 Đường ABC, Quận 1, TP.HCM",
      group_id: 1,
      group_name: "Gia đình",
      name: "Phòng ngủ chính",
      created_at: "2024-01-01T08:30:00Z",
      updated_at: "2024-01-20T16:45:00Z",
      is_deleted: false,
      devices_count: 5,
      active_devices_count: 3,
      alerts_count: 0,
      recent_alerts: [],
      hourly_values: {
        latest_hour: "2024-01-20T14:00:00Z",
        avg_temperature: 22.8,
        avg_humidity: 58,
        sample_count: 8,
      },
      icon_name: "bed",
      icon_color: "#8B5CF6",
    },
    {
      space_id: 3,
      house_id: 2,
      house_name: "Nhà phụ",
      house_address: "456 Đường XYZ, Quận 2, TP.HCM",
      group_id: 1,
      group_name: "Gia đình",
      name: "Nhà bếp",
      created_at: "2024-01-01T09:00:00Z",
      updated_at: "2024-01-20T17:20:00Z",
      is_deleted: false,
      devices_count: 12,
      active_devices_count: 8,
      alerts_count: 1,
      recent_alerts: [
        {
          alert_id: 3,
          device_serial: "GAS001-2024-005",
          message: "Rò rỉ gas nhẹ",
          timestamp: "2024-01-20T12:30:00Z",
          status: "active",
          alert_type_id: 3,
        },
      ],
      hourly_values: {
        latest_hour: "2024-01-20T14:00:00Z",
        avg_temperature: 26.2,
        avg_humidity: 72,
        sample_count: 15,
      },
      icon_name: "chef-hat",
      icon_color: "#F59E0B",
    },
    {
      space_id: 4,
      house_id: 3,
      house_name: "Văn phòng",
      house_address: "789 Đường DEF, Quận 3, TP.HCM",
      group_id: 2,
      group_name: "Công ty",
      name: "Phòng họp",
      created_at: "2024-01-01T09:30:00Z",
      updated_at: "2024-01-20T15:10:00Z",
      is_deleted: false,
      devices_count: 6,
      active_devices_count: 4,
      alerts_count: 0,
      recent_alerts: [],
      hourly_values: {
        latest_hour: "2024-01-20T14:00:00Z",
        avg_temperature: 23.1,
        avg_humidity: 55,
        sample_count: 8,
      },
      icon_name: "briefcase",
      icon_color: "#10B981",
    },
    {
      space_id: 5,
      house_id: 4,
      house_name: "Biệt thự biển",
      house_address: "101 Đường GHI, Vũng Tàu",
      group_id: 3,
      group_name: "Nhà nghỉ dưỡng",
      name: "Phòng khách view biển",
      created_at: "2024-01-02T10:00:00Z",
      updated_at: "2024-01-20T18:00:00Z",
      is_deleted: false,
      devices_count: 10,
      active_devices_count: 7,
      alerts_count: 0,
      recent_alerts: [],
      hourly_values: {
        latest_hour: "2024-01-20T14:00:00Z",
        avg_temperature: 25.5,
        avg_humidity: 70,
        sample_count: 12,
      },
      icon_name: "sofa",
      icon_color: "#8B5CF6",
    },
  ])

  // Simulate loading
  useEffect(() => {
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

  const getGroupColor = (groupId) => {
    const group = groups.find((g) => g.id === groupId)
    if (!group) return "gray"
    return group.color
  }

  const getGroupColorClasses = (color) => {
    switch (color) {
      case "blue":
        return "bg-blue-100 text-blue-700 border-blue-200"
      case "green":
        return "bg-green-100 text-green-700 border-green-200"
      case "purple":
        return "bg-purple-100 text-purple-700 border-purple-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  const handleDeleteSpace = (spaceId) => {
    setSpaces(
      spaces
        .map((space) =>
          space.space_id === spaceId ? { ...space, is_deleted: true, updated_at: new Date().toISOString() } : space,
        )
        .filter((space) => !space.is_deleted),
    )
  }

  const handleEditSpace = (spaceId) => {
    alert(`Chỉnh sửa không gian ID: ${spaceId}`)
  }

  const handleAddSpace = () => {
    alert("Thêm không gian mới")
  }

  const handleSpaceClick = (space) => {
    console.log("Space clicked:", space)
    // Navigate to device list for this space
    alert(`Xem thiết bị trong ${space.name}`)
  }

  const handleManageDevices = (space) => {
    console.log("Manage devices for space:", space)
    alert(`Quản lý thiết bị trong ${space.name}`)
  }

  const handleMoveSpace = (spaceId, newHouseId) => {
    const newHouse = houses.find((h) => h.id === Number.parseInt(newHouseId))
    if (newHouse) {
      setSpaces(
        spaces.map((space) =>
          space.space_id === spaceId
            ? {
                ...space,
                house_id: newHouse.id,
                house_name: newHouse.name,
                house_address: newHouse.address,
                group_id: newHouse.groupId,
                group_name: newHouse.groupName,
                updated_at: new Date().toISOString(),
              }
            : space,
        ),
      )
    }
  }

  const toggleFilters = () => {
    setShowFilters(!showFilters)
  }

  // Filter spaces based on search query, house, and group
  const filteredSpaces = spaces.filter((space) => {
    if (space.is_deleted) return false

    const matchesSearch =
      space.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      space.house_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      space.group_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      space.house_address.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesHouse = selectedHouseFilter === "all" || space.house_id === Number.parseInt(selectedHouseFilter)
    const matchesGroup = selectedGroupFilter === "all" || space.group_id === Number.parseInt(selectedGroupFilter)

    return matchesSearch && matchesHouse && matchesGroup
  })

  // Statistics
  const totalDevices = filteredSpaces.reduce((sum, space) => sum + space.devices_count, 0)
  const totalActiveDevices = filteredSpaces.reduce((sum, space) => sum + space.active_devices_count, 0)
  const totalAlerts = filteredSpaces.reduce((sum, space) => sum + space.alerts_count, 0)

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Home className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Quản lý không gian</h1>
                <p className="text-sm text-gray-600">Tất cả không gian trong hệ thống</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button onClick={handleAddSpace} className="bg-purple-500 hover:bg-purple-600">
                <Plus className="h-4 w-4 mr-2" />
                Thêm không gian
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Home className="h-5 w-5 text-purple-500" />
                <span>Danh sách không gian</span>
                <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                  {filteredSpaces.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Statistics Overview */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-purple-600 font-medium">Tổng không gian</p>
                      <p className="text-2xl font-bold text-purple-700">{filteredSpaces.length}</p>
                    </div>
                    <Home className="h-8 w-8 text-purple-500" />
                  </div>
                </div>

                <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-xl p-4 border border-emerald-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-emerald-600 font-medium">Thiết bị hoạt động</p>
                      <p className="text-2xl font-bold text-emerald-700">
                        {totalActiveDevices}/{totalDevices}
                      </p>
                    </div>
                    <Activity className="h-8 w-8 text-emerald-500" />
                  </div>
                </div>

                <div className="bg-gradient-to-r from-amber-50 to-amber-100 rounded-xl p-4 border border-amber-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-amber-600 font-medium">Cảnh báo</p>
                      <p className="text-2xl font-bold text-amber-700">{totalAlerts}</p>
                    </div>
                    <AlertTriangle className={`h-8 w-8 ${getAlertSeverityColor(totalAlerts)}`} />
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-blue-600 font-medium">Dữ liệu theo giờ</p>
                      <p className="text-2xl font-bold text-blue-700">
                        {filteredSpaces.reduce((sum, space) => sum + (space.hourly_values?.sample_count || 0), 0)}
                      </p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-blue-500" />
                  </div>
                </div>
              </div>

              {/* Search and Filters */}
              <div className="space-y-4">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Tìm kiếm theo tên không gian, nhà, nhóm hoặc địa chỉ..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 h-12"
                    />
                  </div>
                
                </div>
              </div>

              {/* Spaces Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                {filteredSpaces.map((space) => (
                  <div
                    key={space.space_id}
                    className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-xl hover:border-purple-300 transition-all duration-300 group relative overflow-hidden cursor-pointer"
                    onClick={() => handleSpaceClick(space)}
                  >
                    {/* Background gradient accent */}
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

                    <div className="relative z-10">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
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
                          <div className="flex-1">
                            <h3 className="font-semibold text-slate-900 text-lg group-hover:text-purple-700 transition-colors">
                              {space.name}
                            </h3>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge variant="outline" className={getGroupColorClasses(getGroupColor(space.group_id))}>
                                <Users className="h-3 w-3 mr-1" />
                                {space.group_name}
                              </Badge>
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
                          <DropdownMenuContent align="end" className="w-56 bg-white">
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation()
                                handleEditSpace(space.space_id)
                              }}
                            >
                              <Edit className="h-4 w-4 mr-3" />
                              Chỉnh sửa không gian
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

                            <DropdownMenuItem className="flex items-center">
                              <Home className="h-4 w-4 mr-3" />
                              <span className="flex-1">Chuyển nhà</span>
                            </DropdownMenuItem>

                            {houses.map((house) => (
                              <DropdownMenuItem
                                key={house.id}
                                className={`pl-10 ${space.house_id === house.id ? "bg-blue-50 text-blue-600" : ""}`}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleMoveSpace(space.space_id, house.id)
                                }}
                              >
                                {space.house_id === house.id && <span className="absolute left-3">✓</span>}
                                {house.name}
                              </DropdownMenuItem>
                            ))}

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

                      {/* House and Location Info */}
                      <div className="bg-slate-50 rounded-xl p-3 mb-4">
                        <div className="flex items-center space-x-2 mb-1">
                          <Home className="h-4 w-4 text-slate-500" />
                          <span className="font-medium text-slate-700">{space.house_name}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-slate-600">
                          <MapPin className="h-3 w-3" />
                          <span>{space.house_address}</span>
                        </div>
                      </div>

                      {/* Device Stats */}
                      <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="text-center p-3 bg-slate-50 rounded-xl group-hover:bg-purple-50 transition-colors">
                          <div className="flex items-center justify-center mb-1">
                            <Lightbulb className="h-4 w-4 text-purple-500 mr-1" />
                            <span className="text-lg font-bold text-slate-700 group-hover:text-purple-600">
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
                              <div className="text-sm font-semibold text-slate-700">
                                {space.hourly_values.sample_count}
                              </div>
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
                                  className={`w-2 h-2 rounded-full mt-2 ${
                                    alert.status === "active" ? "bg-red-500" : "bg-gray-400"
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
                            className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full transition-all duration-300"
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
                          <div className="text-slate-400 group-hover:text-purple-500 transition-colors">
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
                  <p className="text-gray-500">Không tìm thấy không gian nào</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
