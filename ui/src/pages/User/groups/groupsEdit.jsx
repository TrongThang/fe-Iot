"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ArrowLeft, Users, UserPlus, Edit, Trash, Home } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useNavigate, useParams } from "react-router-dom"
import EditGroupPopup from "./groupPopups/Edit-groups-popup"
import AddMemberPopup from "./groupPopups/Add-member-popup"
import HouseTab from "./house/houseTab"
import { toast } from "sonner"
import EditMemberPopup from "./groupPopups/Edit-member-popup"
import { GROUP_ICON_MAP } from "@/components/common/CustomerSearch/IconMap"
import { COLOR_MAP } from "@/components/common/CustomerSearch/ColorMap"
import axiosPrivate from "@/apis/clients/private.client"

export default function EditGroups() {
  const [activeTab, setActiveTab] = useState("members")
  const [searchQuery, setSearchQuery] = useState("")
  const [formData, setFormData] = useState({
    group_name: "",
    group_description: "",
    icon: {
      iconId: "COMPANY",
      component: GROUP_ICON_MAP.COMPANY,
      color: COLOR_MAP.BLUE,
      colorId: "BLUE",
      name: "Công ty",
    },
  })
  const [members, setMembers] = useState([])
  const [houses, setHouses] = useState([])
  const navigate = useNavigate()
  const { id } = useParams()
  const [isAddMemberPopupOpen, setIsAddMemberPopupOpen] = useState(false)
  const [isEditGroupPopupOpen, setIsEditGroupPopupOpen] = useState(false)
  const [isAddHousePopupOpen, setIsAddHousePopupOpen] = useState(false)
  const [isEditMemberPopupOpen, setIsEditMemberPopupOpen] = useState(false)
  const [selectedMember, setSelectedMember] = useState(null)
  const [roleUserCurrent, setRoleUserCurrent] = useState(null)

  const fetchGroupById = async (id) => {
    try {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        throw new Error("Không tìm thấy token xác thực. Vui lòng đăng nhập lại.");
      }

      const res = await fetch(`${process.env.REACT_APP_SMART_NET_IOT_API_URL}/groups/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      })
      if (res.ok) {
        const groupData = await res.json()
        if (groupData) {
          setFormData({
            group_id: groupData.group_id,
            group_name: groupData.group_name || "",
            group_description: groupData.group_description || "",
            icon: {
              iconId: groupData.icon_name?.toUpperCase() || "COMPANY",
              component: GROUP_ICON_MAP[groupData.icon_name?.toUpperCase()] || GROUP_ICON_MAP.COMPANY,
              color: groupData.icon_color || COLOR_MAP.BLUE,
              colorId: groupData.icon_color_id || "BLUE",
              name: groupData.icon_name
                ? groupData.icon_name.charAt(0).toUpperCase() + groupData.icon_name.slice(1).toLowerCase()
                : "Công ty",
            },
          })
        }
        return groupData
      } else {
        throw new Error("Lấy thông tin nhóm thất bại")
      }
    } catch (error) {
      toast.error(error.message || "Đã xảy ra lỗi khi lấy thông tin nhóm. Vui lòng thử lại.")
      return null
    }
  }

  const fetchGroupsUser = async (id) => {
    try {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        throw new Error("Không tìm thấy token xác thực. Vui lòng đăng nhập lại.");
      }

      const res = await fetch(`${process.env.REACT_APP_SMART_NET_IOT_API_URL}/groups/${id}/members`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      })
      if (res.ok) {
        const membersData = await res.json()
        setMembers(membersData?.data || [])
        console.log("Members data:", membersData?.data || "No data");
      } else {
        throw new Error("Lấy thông tin thành viên nhóm thất bại")
      }
    } catch (error) {
      toast.error(error.message || "Đã xảy ra lỗi khi lấy thông tin thành viên nhóm. Vui lòng thử lại.")
    }
  }

  const fetchRoleUserGroups = async (id) => {
    try {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        throw new Error("Không tìm thấy token xác thực. Vui lòng đăng nhập lại.");
      }

      const res = await fetch(`${process.env.REACT_APP_SMART_NET_IOT_API_URL}/groups/role/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      })
      if (res.ok) {
        const groupsData = await res.json()
        setRoleUserCurrent(groupsData?.role || null)
        console.log("Role data:", groupsData || "No data");
      }
    } catch (error) {
      toast.error(error.message || "Đã xảy ra lỗi khi lấy thông tin nhóm")
    }
  }

  useEffect(() => {
    if (id) {
      fetchGroupById(id)
      fetchGroupsUser(id)
      fetchRoleUserGroups(id)
    } else {
      toast.error("Không tìm thấy ID nhóm trong URL. Vui lòng kiểm tra lại.")
      navigate("/groups")
    }
  }, [id, navigate])

  const handleDeleteMember = async (memberId) => {
    const confirmed = await new Promise((resolve) => {
      toast.warning(
        "Bạn có chắc muốn xóa thành viên này? Hành động này không thể hoàn tác!",
        {
          action: { label: "Xóa", onClick: () => resolve(true) },
          cancel: { label: "Hủy", onClick: () => resolve(false) },
          duration: 10000,
        }
      );
    });

    if (confirmed) {
      try {
        // Tìm thành viên cần xóa trong danh sách members
        const memberToDelete = members.find((m) => m.user_group_id === memberId);

        if (!memberToDelete || !memberToDelete.account_id) {
          throw new Error("Không tìm thấy thông tin thành viên để xóa.");
        }
        const res = await fetch(`${process.env.REACT_APP_SMART_NET_IOT_API_URL}/groups/${id}/members`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
          body: JSON.stringify({ accountId: memberToDelete.account_id }),
        });

        if (res.ok) {
          // Cập nhật danh sách members sau khi xóa
          setMembers(members.filter((m) => m.user_group_id !== memberId));
          toast.success("Xóa thành viên thành công!");
        } else {
          const errorData = await res.json();
          throw new Error(errorData.message || "Xóa thành viên thất bại");
        }
      } catch (error) {
        toast.error(error.message || "Đã xảy ra lỗi khi xóa thành viên. Vui lòng thử lại.");
      }
    }
  };

  const handleEditMember = (memberId) => {
    const memberToEdit = members.find((m) => m.account_id === memberId)
    if (memberToEdit) {
      setSelectedMember(memberToEdit)
      setIsEditMemberPopupOpen(true)
    }
  }

  const handleSaveMember = (updatedMember) => {
    setMembers(members.map((m) => (m.id === updatedMember.id ? updatedMember : m)))
    setIsEditMemberPopupOpen(false)
    setSelectedMember(null)
  }

  const handleLeaveGroup = async () => {
    const confirmed = await new Promise((resolve) => {
      toast.warning(
        "Bạn có chắc muốn rời nhóm? Hành động này không thể hoàn tác!",
        {
          action: { label: "Rời", onClick: () => resolve(true) },
          cancel: { label: "Hủy", onClick: () => resolve(false) },
          duration: 10000,
        }
      )
    })

    if (confirmed) {
      try {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
          throw new Error("Không tìm thấy token xác thực. Vui lòng đăng nhập lại.");
        }

        const res = await fetch(`${process.env.REACT_APP_SMART_NET_IOT_API_URL}/groups/${id}/leave`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        })
        if (res.ok) {
          toast.success("Đã rời khỏi nhóm!")
          navigate("/groups")
        } else {
          const errorData = await res.json()
          throw new Error(errorData.message || "Rời nhóm thất bại")
        }
      } catch (error) {
        toast.error(error.message || "Đã xảy ra lỗi khi rời nhóm. Vui lòng thử lại.")
      }
    }
  }

  const handleAddMember = () => {
    setIsAddMemberPopupOpen(true)
  }

  const handleEditGroup = () => {
    setIsEditGroupPopupOpen(true)
  }

  const handleSaveGroup = async (updatedData) => {
    const updatedFormData = {
      ...formData,
      group_name: updatedData.group_name,
      group_description: updatedData.group_description,
      icon: {
        iconId: updatedData.icon_name,
        component: GROUP_ICON_MAP[updatedData.icon_name] || GROUP_ICON_MAP.COMPANY,
        color: updatedData.icon_color,
        colorId: updatedData.icon_color_id,
        name: updatedData.icon_name.charAt(0).toUpperCase() + updatedData.icon_name.slice(1).toLowerCase(),
      },
    }
    setFormData(updatedFormData)

    try {
      const res = await axiosPrivate.put(`${process.env.REACT_APP_SMART_NET_IOT_API_URL}/groups/${id}`, {
        group_name: updatedData.group_name,
        group_description: updatedData.group_description,
        icon_name: updatedData.icon_name,
        icon_color: updatedData.icon_color,
        icon_color_id: updatedData.icon_color_id,
      })
      if (res) {
        toast.success("Cập nhật nhóm thành công!")
        setIsEditGroupPopupOpen(false)
      } else {
        throw new Error("Cập nhật nhóm thất bại")
      }
    } catch (error) {
      console.error("Error updating group:", error)
      toast.error(error.message || "Đã xảy ra lỗi khi cập nhật nhóm. Vui lòng thử lại.")
    }
  }

  const filteredMembers = members.filter(
    (member) =>
      (member.full_name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
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

  const getRole = (role) => {
    if (role === "member") return <span className="text-sm font-medium text-white bg-blue-500 px-2 py-0.5 rounded-lg">Thành viên</span>
    if (role === "vice") return <span className="text-sm font-medium text-white bg-yellow-500 px-2 py-0.5 rounded-lg">Phó nhóm</span>
    if (role === "owner") return <span className="text-sm font-medium text-white bg-red-500 px-2 py-0.5 rounded-lg">Chủ nhóm</span>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="p-2" onClick={() => navigate("/groups")}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center space-x-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
                  style={{ backgroundColor: formData.icon.color }}
                >
                  <formData.icon.component
                    className={`h-8 w-8 ${formData.icon.color === COLOR_MAP.WHITE ? "text-black" : "text-white"}`}
                  />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{formData.group_name}</h1>
                  <p className="text-sm text-gray-600">Chi tiết nhóm và quản lý thành viên</p>
                </div>
                <span className="text-sm text-gray-600">{getRole(roleUserCurrent)}</span>
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

      <div className="max-w-7xl mx-auto px-6 py-8">
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg"
                  style={{ backgroundColor: formData.icon.color }}
                >
                  <formData.icon.component
                    className={`h-8 w-8 ${formData.icon.color === COLOR_MAP.WHITE ? "text-black" : "text-white"}`}
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <Input
                      value={formData.group_name}
                      onChange={(e) => setFormData((prev) => ({ ...prev, group_name: e.target.value }))}
                      className="text-xl font-semibold border-0 p-0 h-auto focus-visible:ring-0 bg-transparent"
                      placeholder="Tên nhóm"
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
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md mb-2">
            <TabsTrigger value="members" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white p-3">
              <Users className="h-4 w-4 mr-2" />
              Thành viên
            </TabsTrigger>
            <TabsTrigger value="houses" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white p-3">
              <Home className="h-4 w-4 mr-2" />
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
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700">{members.length}</Badge>
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
                    placeholder="Tìm kiếm theo tên..."
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
                                {member.full_name?.charAt(0) || "U"}
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
                                <>
                                  <DropdownMenuItem onClick={() => handleEditMember(member.account_id)}>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Chỉnh sửa
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleDeleteMember(member.user_group_id)}
                                    className="text-red-600 focus:text-red-600"
                                  >
                                    <Trash className="h-4 w-4 mr-2" />
                                    Xóa
                                  </DropdownMenuItem>
                                </>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Badge variant="outline" className={getRoleColor(member.role)}>
                            {member.role || "Unknown"}
                          </Badge>
                          <p className="text-xs text-gray-500">
                            Tham gia: {member.joined_at ? new Date(member.joined_at).toLocaleDateString("vi-VN") : "Không rõ"}
                          </p>
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
              roleUserCurrent={roleUserCurrent}
              activeTab={activeTab}
            />
          </TabsContent>
        </Tabs>
      </div>

      <AddMemberPopup open={isAddMemberPopupOpen} onOpenChange={setIsAddMemberPopupOpen} onSave={handleSaveMember} />
      <EditGroupPopup
        open={isEditGroupPopupOpen}
        onOpenChange={setIsEditGroupPopupOpen}
        onSave={handleSaveGroup}
        formData={formData}
        setFormData={setFormData}
      />
      <EditMemberPopup
        open={isEditMemberPopupOpen}
        onOpenChange={setIsEditMemberPopupOpen}
        onSave={handleSaveMember}
        member={selectedMember}
      />
    </div>
  )
}