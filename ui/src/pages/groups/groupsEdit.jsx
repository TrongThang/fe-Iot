"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Users, UserPlus, Edit } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

import AddMemberPopup from "./groupPopups/Add-member-popup"
import EditGroupPopup from "./groupPopups/Edit-groups-popup"
import HouseList from "./house/houseTab"
import HouseTab from "./house/houseTab"

export default function EditGroups() {
  const [activeTab, setActiveTab] = useState("members")
  const [searchQuery, setSearchQuery] = useState("")
  const [groupName, setGroupName] = useState("Family Group")
  const [groupDescription, setGroupDescription] = useState("Nhóm gia đình để quản lý các thiết bị thông minh trong nhà")

  // State for popups
  const [isAddMemberPopupOpen, setIsAddMemberPopupOpen] = useState(false)
  const [isEditGroupPopupOpen, setIsEditGroupPopupOpen] = useState(false)
  const [isAddHousePopupOpen, setIsAddHousePopupOpen] = useState(false)

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

  const handleSaveHouse = (newHouse) => {
    setHouses([...houses, newHouse])
    setIsAddHousePopupOpen(false)
  }

  const handleSaveMember = (newMember) => {
    setMembers([...members, { ...newMember, id: Date.now(), joinDate: new Date().toLocaleDateString("vi-VN") }])
    setIsAddMemberPopupOpen(false)
  }

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
                  <Button onClick={handleAddMember} className="bg-blue-500 hover:bg-blue-600">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Thêm thành viên
                  </Button>
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
                                <Edit className="h-4 w-4" />
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
                                <Edit className="h-4 w-4 mr-2" />
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
            <HouseTab
              houses={houses}
              setHouses={setHouses}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedHouse={selectedHouse}
              setSelectedHouse={setSelectedHouse}
              selectedSpace={selectedSpace}
              setSelectedSpace={setSelectedSpace}
              showSpaceList={showSpaceList}
              setShowSpaceList={setShowSpaceList}
              showDeviceList={showDeviceList}
              setShowDeviceList={setShowDeviceList}
              isAddHousePopupOpen={isAddHousePopupOpen}
              setIsAddHousePopupOpen={setIsAddHousePopupOpen}
              handleDeleteHouse={handleDeleteHouse}
              handleEditHouse={handleEditHouse}
              handleSpaceClick={handleSpaceClick}
              handleBackToHouses={handleBackToHouses}
              handleBackToSpaces={handleBackToSpaces}
              handleAddHouse={handleAddHouse}
              handleSaveHouse={handleSaveHouse}
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
        groupName={groupName}
        groupDescription={groupDescription}
      />
    </div>
  )
}