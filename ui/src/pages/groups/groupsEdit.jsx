"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Users, Search, Plus, Trash2, Edit, Home, MoreHorizontal, UserPlus } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

import SpaceList from "./house/space/spaceList"
import DeviceList from "./house/space/device/deviceList"
import AddMemberPopup from "./groupPopups/Add-member-popup"
import EditGroupPopup from "./groupPopups/Edit-groups-popup"
import AddHousePopup from "./groupPopups/Add-house-popup" // Updated import

export default function EditGroups() {
  const [activeTab, setActiveTab] = useState("members")
  const [searchQuery, setSearchQuery] = useState("")
  const [groupName, setGroupName] = useState("Family Group")
  const [groupDescription, setGroupDescription] = useState("Nhóm gia đình để quản lý các thiết bị thông minh trong nhà")

  // State for popups
  const [isAddHousePopupOpen, setIsAddHousePopupOpen] = useState(false)
  const [isAddMemberPopupOpen, setIsAddMemberPopupOpen] = useState(false)
  const [isEditGroupPopupOpen, setIsEditGroupPopupOpen] = useState(false)

  // Navigation states
  const [selectedHouse, setSelectedHouse] = useState(null)
  const [selectedSpace, setSelectedSpace] = useState(null)
  const [showSpaceList, setShowSpaceList] = useState(false)
  const [showDeviceList, setShowDeviceList] = useState(false)

  // Mock data for members
  const [members, setMembers] = useState([
    {
      id: 1,
      name: "Nguyễn Văn A",
      role: "Chủ nhóm",
      email: "nguyenvana@email.com",
      joinDate: "15/12/2024",
      avatar: "",
    },
    { id: 2, name: "Trần Thị B", role: "Phó nhóm", email: "tranthib@email.com", joinDate: "16/12/2024", avatar: "" },
    { id: 3, name: "Lê Văn C", role: "Thành viên", email: "levanc@email.com", joinDate: "17/12/2024", avatar: "" },
    { id: 4, name: "Phạm Thị D", role: "Thành viên", email: "phamthid@email.com", joinDate: "18/12/2024", avatar: "" },
  ])

  // Mock data for houses with space counts
  const [houses, setHouses] = useState([
    { id: 1, name: "Nhà chính", address: "123 Đường ABC, Quận 1, TP.HCM", devices: 4, status: "Hoạt động" },
    { id: 2, name: "Nhà phụ", address: "456 Đường XYZ, Quận 2, TP.HCM", devices: 2, status: "Hoạt động" },
    { id: 3, name: "Văn phòng", address: "789 Đường DEF, Quận 3, TP.HCM", devices: 2, status: "Bảo trì" },
  ])

  const handleDeleteMember = (memberId) => {
    setMembers(members.filter((m) => m.id !== memberId))
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
    alert("Đã rời khỏi nhóm")
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

  // Handler for adding a new house from the popup
  const handleSaveHouse = (newHouse) => {
    setHouses([...houses, newHouse])
    setIsAddHousePopupOpen(false)
  }

  // Handler for adding a new member from the popup (placeholder)
  const handleSaveMember = (newMember) => {
    setMembers([...members, { ...newMember, id: Date.now(), joinDate: new Date().toLocaleDateString("vi-VN") }])
    setIsAddMemberPopupOpen(false)
  }

  // Handler for editing group from the popup (placeholder)
  const handleSaveGroup = (updatedGroup) => {
    setGroupName(updatedGroup.name)
    setGroupDescription(updatedGroup.description)
    setIsEditGroupPopupOpen(false)
  }

  const filteredMembers = members.filter(
    (member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const filteredHouses = houses.filter(
    (house) =>
      house.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      house.address.toLowerCase().includes(searchQuery.toLowerCase()),
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

  const getStatusColor = (status) => {
    switch (status) {
      case "Hoạt động":
        return "bg-green-100 text-green-700 border-green-200"
      case "Bảo trì":
        return "bg-yellow-100 text-yellow-700 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="p-2">
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{groupName}</h1>
                  <p className="text-sm text-gray-600">Chi tiết nhóm và quản lý thành viên</p>
                </div>
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
                <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <Input
                      value={groupName}
                      onChange={(e) => setGroupName(e.target.value)}
                      className="text-xl font-semibold border-0 p-0 h-auto focus-visible:ring-0 bg-transparent"
                      placeholder="Tên nhóm"
                      readOnly
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleEditGroup}
                      className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit className="h-4 w-4 text-blue-500" />
                    </Button>
                  </div>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{groupDescription}</p>
                  <p className="text-xs text-gray-500 mt-1">Được tạo ngày 15/12/2024</p>
                </div>
              </div>
              <div className="flex items-center space-x-6">
                <div className="text-center ">
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
              </div>
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
              <Home className="h-4 w-4 mr-2" />
              Nhà
            </TabsTrigger>
          </TabsList>

          <TabsContent value="members" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2 ">
                    <Users className="h-5 w-5 text-blue-500" />
                    <span>Thành viên nhóm</span>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                      {members.length}
                    </Badge>
                  </CardTitle>
                  <Button onClick={handleAddMember} className="bg-blue-500 hover:bg-blue-600">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Thêm thành viên
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* Search */}
                <div className="relative mb-6">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Tìm kiếm theo tên hoặc email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-12"
                  />
                </div>

                {/* Members Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredMembers.map((member) => (
                    <Card key={member.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-12 w-12 bg-blue-500">
                              <AvatarFallback className="bg-blue-500 text-white font-semibold">
                                {member.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-semibold text-gray-900">{member.name}</p>
                              <p className="text-sm text-gray-500">{member.email}</p>
                            </div>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-white">
                              <DropdownMenuItem onClick={() => handleEditMember(member.id)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Chỉnh sửa
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDeleteMember(member.id)}
                                className="text-red-600 focus:text-red-600"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Xóa
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        <div className="space-y-2">
                          <Badge variant="outline" className={getRoleColor(member.role)}>
                            {member.role}
                          </Badge>
                          <p className="text-xs text-gray-500">Tham gia: {member.joinDate}</p>
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
            {showDeviceList && selectedSpace ? (
              <DeviceList
                spaceId={selectedSpace.id}
                spaceName={selectedSpace.name}
                spaceType={selectedSpace.type}
                onBack={handleBackToSpaces}
              />
            ) : showSpaceList && selectedHouse ? (
              <SpaceList
                houseId={selectedHouse.id}
                houseName={selectedHouse.name}
                onBack={handleBackToHouses}
                onSpaceClick={handleSpaceClick}
              />
            ) : (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                      <Home className="h-5 w-5 text-blue-500" />
                      <span>Danh sách nhà</span>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                        {houses.length}
                      </Badge>
                    </CardTitle>
                    <Button onClick={handleAddHouse} className="bg-blue-500 hover:bg-blue-600">
                      <Plus className="h-4 w-4 mr-2" />
                      Thêm nhà
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Search */}
                  <div className="relative mb-6">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Tìm kiếm theo tên hoặc địa chỉ..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 h-12"
                    />
                  </div>

                  {/* Houses List */}
                  <div className="space-y-4 max-w-1xl">
                    {filteredHouses.map((house, index) => (
                      <div
                        key={house.id}
                        className="bg-white border border-slate-200 rounded-xl p-6 flex items-center justify-between cursor-pointer hover:shadow-lg hover:border-blue-300 transition-all duration-200 group relative overflow-hidden"
                        onClick={() => handleEditHouse(house.id)}
                      >
                        {/* Background gradient accent */}
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

                        <div className="flex items-center space-x-6 relative z-10">
                          {/* House Icon with gradient background */}
                          <div className="relative">
                            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-200">
                              <Home className="h-7 w-7 text-white" />
                            </div>
                          </div>

                          {/* House Information */}
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="font-semibold text-slate-900 text-lg group-hover:text-blue-700 transition-colors">
                                {house.name}
                              </h3>
                            </div>

                            <p className="text-sm text-slate-600 mb-2 flex items-center">
                              <svg
                                className="w-4 h-4 mr-2 text-slate-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                              </svg>
                              {house.address}
                            </p>

                            <div className="flex items-center space-x-4">
                              <div className="flex items-center text-sm text-slate-600">
                                <svg
                                  className="w-4 h-4 mr-2 text-blue-500"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                  />
                                </svg>
                                <span className="font-medium text-blue-600">{house.devices}</span>
                                <span className="ml-1">không gian</span>
                              </div>

                              <Badge variant="outline" className={getStatusColor(house.status)}>
                                {house.status}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        {/* Right side actions */}
                        <div className="flex items-center space-x-3 relative z-10">
                          {/* Actions */}
                          <div className="flex items-center space-x-2">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-9 w-9 p-0 hover:bg-slate-100 rounded-lg transition-colors"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <MoreHorizontal className="h-5 w-5 text-slate-600" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48 bg-white">
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleEditHouse(house.id)
                                  }}
                                  className="flex items-center"
                                >
                                  <Edit className="h-4 w-4 mr-3" />
                                  Xem không gian
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    alert("Chỉnh sửa thông tin nhà")
                                  }}
                                  className="flex items-center"
                                >
                                  <svg className="h-4 w-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                    />
                                  </svg>
                                  Chỉnh sửa nhà
                                </DropdownMenuItem>
                                <div className="border-t my-1" />
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleDeleteHouse(house.id)
                                  }}
                                  className="text-red-600 focus:text-red-600 flex items-center"
                                >
                                  <Trash2 className="h-4 w-4 mr-3" />
                                  Xóa nhà
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {filteredHouses.length === 0 && (
                    <div className="text-center py-12">
                      <Home className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">Không tìm thấy nhà nào</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Popups */}
      <AddHousePopup open={isAddHousePopupOpen} onOpenChange={setIsAddHousePopupOpen} onSave={handleSaveHouse} />
      <AddMemberPopup open={isAddMemberPopupOpen} onOpenChange={setIsAddMemberPopupOpen} onSave={handleSaveMember} />
      <EditGroupPopup
        open={isEditGroupPopupOpen}
        onOpenChange={setIsEditGroupPopupOpen}
        onSave={handleSaveGroup}
        groupName={groupName}
        groupDescription={groupDescription}
      />
    </div>
  )
}