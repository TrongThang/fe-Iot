"use client"

import React from "react"; // Explicitly import React
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft, Users, UserPlus, Edit,
  Home,
  Briefcase,
  GraduationCap,
  Building,
  Building2,
  Bed,
  Castle,
  TreePine,
  Crown,
  BookOpen,
  Trash,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useNavigate, useParams } from "react-router-dom"
import EditGroupPopup from "./groupPopups/Edit-groups-popup"
import AddMemberPopup from "./groupPopups/Add-member-popup"
import HouseTab from "./house/houseTab"
import Swal from "sweetalert2"
import axiosPrivate from "@/apis/clients/private.client"
import { useAuth } from "@/contexts/AuthContext"

export default function EditGroups() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("members")
  const [searchQuery, setSearchQuery] = useState("")
  const [formData, setFormData] = useState({
    group_name: "",
    group_description: "",
    icon_name: "",
    icon_color: "",
  })
  const [members, setMembers] = useState([])
  const [houses, setHouses] = useState([])
  const navigate = useNavigate()
  const { id } = useParams() // Matches the route parameter :id

  // State for popups and navigation
  const [isAddMemberPopupOpen, setIsAddMemberPopupOpen] = useState(false)
  const [isEditGroupPopupOpen, setIsEditGroupPopupOpen] = useState(false)
  const [isAddHousePopupOpen, setIsAddHousePopupOpen] = useState(false)
  const [selectedHouse, setSelectedHouse] = useState(null)
  const [selectedSpace, setSelectedSpace] = useState(null)
  const [showSpaceList, setShowSpaceList] = useState(false)
  const [showDeviceList, setShowDeviceList] = useState(false)
  const [roleUserCurrent, setRoleUserCurrent] = useState(null)

  // Fetch lấy nhóm theo ID
  const fetchGroupById = async (id) => {
    try {
      const res = await axiosPrivate.get(`http://localhost:7777/api/groups/${id}`)
      if (res.success) {
        const groupData = res.data
        if (groupData) {
          setFormData({
            group_name: groupData.group_name || "",
            group_description: groupData.group_description || "",
            icon_name: groupData.icon_name || "",
            icon_color: groupData.icon_color || "",
          })
        }
        return groupData
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: error.message || "Đã xảy ra lỗi khi lấy thông tin nhóm. Vui lòng thử lại.",
        confirmButtonText: "OK",
        confirmButtonColor: "#d33",
      })
      return null
    }
  }
  // Fetch lấy thành viên nhóm theo ID
  const fetchGroupsUser = async (id) => {
    try {
      const res = await axiosPrivate.get(`http://localhost:7777/api/groups/${id}/members`)
      if (res.success) {
        setMembers(res.data || [])
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: error.message || "Đã xảy ra lỗi khi lấy thông tin thành viên nhóm. Vui lòng thử lại.",
        confirmButtonText: "OK",
        confirmButtonColor: "#d33",
      })
    }
  }

  useEffect(() => {
    if (id) {
      fetchGroupById(id)
      fetchGroupsUser(id)

      setRoleUserCurrent(members.find((member) => member.account_id === user.account_id)?.role)

    } else {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Không tìm thấy ID nhóm trong URL. Vui lòng kiểm tra lại.",
        confirmButtonText: "OK",
        confirmButtonColor: "#d33",
      });
      navigate("/groups");
    }
  }, [id, navigate]);

  const handleDeleteMember = (memberId) => {
    // Implement deletion logic if needed
  }

  const handleEditMember = (memberId) => {
    alert(`Chỉnh sửa thành viên ID: ${memberId}`)
  }

  const handleDeleteHouse = (houseId) => {
    setHouses(houses.filter((h) => h.id !== houseId))
  }

  const handleEditHouse = (houseId) => {
    const house = houses.find((h) => h.id === houseId)
    if (house) {
      setSelectedHouse(house)
      setShowSpaceList(true)
      setShowDeviceList(false)
      setSelectedSpace(null)
    }
  }

  const handleSpaceClick = (space) => {
    setSelectedSpace(space)
    setShowDeviceList(true)
  }

  const handleBackToHouses = () => {
    setShowSpaceList(false)
    setShowDeviceList(false)
    setSelectedHouse(null)
    setSelectedSpace(null)
  }

  const handleBackToSpaces = () => {
    setShowDeviceList(false)
    setSelectedSpace(null)
  }

  const handleLeaveGroup = () => {
    Swal.fire({
      title: "Xác nhận rời nhóm",
      text: "Bạn có chắc muốn rời nhóm? Hành động này không thể hoàn tác!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Rời",
      cancelButtonText: "Hủy",
    }).then((result) => {
      if (result.isConfirmed) {
        // Optional: Add API call to leave group
        alert("Đã rời khỏi nhóm")
        navigate("/groups")
      }
    })
  }

  const handleAddMember = () => {
    setIsAddMemberPopupOpen(true)
  }

  const handleAddHouse = () => {
    setIsAddHousePopupOpen(true)
  }

  const handleEditGroup = () => {
    setIsEditGroupPopupOpen(true)
  }

  const handleSaveHouse = (newHouse) => {
    setHouses([...houses, newHouse])
    setIsAddHousePopupOpen(false)
  }

  const handleSaveMember = (newMember) => {
    setMembers([...members, { ...newMember, id: Date.now(), joinDate: new Date().toLocaleDateString("vi-VN") }])
    setIsAddMemberPopupOpen(false)
  }

  const handleSaveGroup = async (updatedData) => {
    setFormData((prev) => ({ ...prev, ...updatedData }))
    try {
      const res = await axiosPrivate.put(`http://localhost:7777/api/groups/${id}`, {
          group_name: updatedData.group_name,
          group_description: updatedData.group_description,
          icon_name: updatedData.icon_name,
          icon_color: updatedData.icon_color,
        })
      if (res.success) {
        Swal.fire({
          icon: "success",
          title: "Thành công",
          text: "Cập nhật nhóm thành công!",
          confirmButtonText: "OK",
          confirmButtonColor: "#28a745",
        })
        setIsEditGroupPopupOpen(false)
      } else {
        const errorData = res.data
        throw new Error(errorData.message || "Cập nhật nhóm thất bại")
      }
    } catch (error) {
      console.error("Error updating group:", error)
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: error.message || "Đã xảy ra lỗi khi cập nhật nhóm. Vui lòng thử lại.",
        confirmButtonText: "OK",
        confirmButtonColor: "#d33",
      })
    }
  }

  const filteredMembers = members.filter(
    (member) =>
      (member.name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (member.email?.toLowerCase() || "").includes(searchQuery.toLowerCase())
  )

  const getRoleColor = (role) => {
    switch (role) {
      case "Chủ nhóm":
        return "bg-blue-100 text-blue-700 border-blue-200"
      case "Phó nhóm":
        return "bg-purple-100 text-purple-700 border-purple-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  const iconMap = {
    home: Home,
    office: Briefcase,
    school: GraduationCap,
    bank: Building,
    apartment: Building2,
    hotel: Bed,
    villa: Castle,
    wooden: TreePine,
    castle: Crown,
    library: BookOpen,
  }

  const colorMap = {
    "#FF5733": "bg-red-500",
    blue: "bg-blue-500",
    "#FFF00F": "bg-yellow-500",
    "#0000FF": "bg-blue-700",
    "#FF0000": "bg-red-600",
  }

  const getIconComponent = (iconName) => {
    if (!iconName) return Users
    const IconComponent = iconMap[iconName.toLowerCase()] || Users
    return IconComponent
  }

  const getColorClass = (color) => {
    if (!color) return "bg-gray-500"
    if (color.startsWith("bg-")) return color // Nếu là class Tailwind
    if (color.startsWith("#")) return ""      // Nếu là mã hex, sẽ dùng style
    return colorMap[color] || "bg-gray-500"   // Nếu là tên màu
  }

  // Dynamic icon and color for header
  const HeaderIconComponent = getIconComponent(formData.icon_name)
  const headerColorClass = getColorClass(formData.icon_color)

  // Dynamic icon and color for group info card
  const CardIconComponent = getIconComponent(formData.icon_name)
  const cardColorClass = getColorClass(formData.icon_color)

  const getRole = (role) => {
    if (role === "member") return <span className="text-sm font-medium text-white bg-blue-500 px-2 py-0.5 rounded-lg">Thành viên</span>
    if (role === "admin") return <span className="text-sm font-medium text-white bg-green-500 px-2 py-0.5 rounded-lg">Quản trị viên</span>
    if (role === "vice") return <span className="text-sm font-medium text-white bg-yellow-500 px-2 py-0.5 rounded-lg">Phó nhóm</span>
    if (role === "owner") return <span className="text-sm font-medium text-white bg-red-500 px-2 py-0.5 rounded-lg">Chủ nhóm</span>
    return "Thành viên"
}


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="p-2" onClick={() => navigate("/groups")}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center space-x-4">
                <div
                  className={`w-12 h-12 ${headerColorClass} rounded-xl flex items-center justify-center shadow-lg`}
                  style={formData.icon_color && formData.icon_color.startsWith("#") ? { backgroundColor: formData.icon_color } : {}}
                >
                  <HeaderIconComponent className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{formData.group_name}</h1>
                  <p className="text-sm text-gray-600">Chi tiết nhóm và quản lý thành viên</p>
                </div>
                <span className="text-sm text-gray-600">
                  {getRole(roleUserCurrent)}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleLeaveGroup}
                className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
              >
                Rời nhóm
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Group Info Card */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div
                  className={`w-16 h-16 ${cardColorClass} rounded-2xl flex items-center justify-center shadow-lg`}
                  style={formData.icon_color && formData.icon_color.startsWith("#") ? { backgroundColor: formData.icon_color } : {}}
                >
                  <CardIconComponent className="h-8 w-8 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <Input
                      value={formData.group_name}
                      onChange={(e) => setFormData((prev) => ({ ...prev, group_name: e.target.value }))}
                      className="text-xl font-semibold border-0 p-0 h-auto focus-visible:ring-0 bg-transparent"
                      placeholder="Tên nhóm"
                      readOnly
                    />
                  {roleUserCurrent === "owner" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleEditGroup}
                      className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit className="h-4 w-4 text-blue-500" />
                    </Button>
                  )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{formData.group_description}</p>
                  <p className="text-xs text-gray-500 mt-1">Được tạo ngày {new Date().toLocaleDateString("vi-VN")}</p>
                </div>
              </div>
              {/* <div className="flex items-center space-x-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{members.length}</div>
                  <div className="text-sm text-gray-600">Thành viên</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{houses.length}</div>
                  <div className="text-sm text-gray-600">Nhà</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {houses.reduce((total, house) => total + house.devices, 0)}
                  </div>
                  <div className="text-sm text-gray-600">Không gian</div>
                </div>
              </div> */}
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md mb-2">
            <TabsTrigger value="members" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white p-3">
              <Users className="h-4 w-4 mr-2" />
              Thành viên
            </TabsTrigger>
            <TabsTrigger value="houses">
              <Users className="h-4 w-4 mr-2" />
              Nhà
            </TabsTrigger>
          </TabsList>

          <TabsContent value="members" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-blue-500" />
                    <span>Thành viên nhóm</span>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                      {members.length}
                    </Badge>
                  </CardTitle>
                  {(roleUserCurrent === "owner" || roleUserCurrent === "vice") && (
                    <Button onClick={handleAddMember} className="bg-blue-500 hover:bg-blue-600">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Thêm thành viên
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="relative mb-6">
                  <Input
                    placeholder="Tìm kiếm theo tên hoặc email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-12"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredMembers.map((member) => (
                    <Card key={member.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-12 w-12 bg-blue-500">
                              <AvatarFallback className="bg-blue-500 text-white font-semibold">
                                {member.name?.charAt(0) || "U"}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-semibold text-gray-900">{member.full_name || "Unknown"}</p>
                              <p className="text-sm text-gray-500">{member.email || "No email"}</p>
                            </div>
                          </div>
                        {(roleUserCurrent === "owner" || roleUserCurrent === "vice") && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-white">
                              <DropdownMenuItem onClick={() => handleEditMember(member.id)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Chỉnh sửa
                              </DropdownMenuItem>
                              {roleUserCurrent === "owner" && (
                              <DropdownMenuItem
                                onClick={() => handleDeleteMember(member.id)}
                                className="text-red-600 focus:text-red-600"
                              >
                                <Trash className="h-4 w-4 mr-2" />
                                Xóa
                              </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                              )}
                        </div>

                        <div className="space-y-2">
                          <Badge variant="outline" className={getRoleColor(member.role)}>
                            {member.role || "Unknown"}
                          </Badge>
                          <p className="text-xs text-gray-500">Tham gia: {member.joined_at ? new Date(member.joined_at).toLocaleDateString("vi-VN") : "Không rõ"}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {filteredMembers.length === 0 && (
                  <div className="text-center py-12">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Không tìm thấy thành viên nào</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="houses" className="space-y-6">
            <HouseTab
              houses={houses}
              setHouses={setHouses}
              isAddHousePopupOpen={isAddHousePopupOpen}
              setIsAddHousePopupOpen={setIsAddHousePopupOpen}
              handleDeleteHouse={handleDeleteHouse}
              handleEditHouse={handleEditHouse}
              handleSpaceClick={handleSpaceClick}
              handleBackToHouses={handleBackToHouses}
              handleBackToSpaces={handleBackToSpaces}
              handleAddHouse={handleAddHouse}
              handleSaveHouse={handleSaveHouse}
              roleUserCurrent={roleUserCurrent}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Popups */}
      <AddMemberPopup open={isAddMemberPopupOpen} onOpenChange={setIsAddMemberPopupOpen} onSave={handleSaveMember} />
      <EditGroupPopup
        open={isEditGroupPopupOpen}
        onOpenChange={setIsEditGroupPopupOpen}
        onSave={handleSaveGroup}
        formData={formData}
        setFormData={setFormData}
      />
    </div>
  )
}