"use client"

import {
    Users, Plus, Edit, Trash2, Search, Calendar, Grid, List, Home, Briefcase, GraduationCap, Building,
    Building2,
    Bed,
    Castle,
    TreePine,
    Crown,
    BookOpen,
    Eye,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Swal from "sweetalert2"
import AddGroups from "./groupPopups/Add-group-popup"
import axiosPrivate from "@/apis/clients/private.client"

export default function GroupsManagement() {
    const [viewMode, setViewMode] = useState("grid")
    const [showAddDialog, setShowAddDialog] = useState(false)
    const [groups, setGroups] = useState([])
    const [groupMembers, setGroupMembers] = useState({}) // Object to map group_id to member count
    const navigate = useNavigate()

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

    const fetchGroups = async () => {
        try {
            const res = await axiosPrivate.get(`http://localhost:7777/api/groups/my-groups`)
            
            if (res.success) {
                const dataGroups = res.data
                console.log(dataGroups)
                console.log(typeof dataGroups)
                if (Array.isArray(dataGroups)) {
                    setGroups(dataGroups)
                } else if (dataGroups && typeof dataGroups === "object") {
                    setGroups([dataGroups])
                } else {
                    setGroups([])
                }
            }
        } catch (error) {
            console.error("Error fetching groups:", error)
        }
    }

    const fetchGroupsUser = async (groupId) => {
        try {
            const res = await axiosPrivate.get(`http://localhost:7777/api/groups/${groupId}/members`)
            if (res.status === 200) {
                const membersData = res.data
                console.log(`Fetched members for group ${groupId}:`, membersData)
                setGroupMembers((prev) => ({
                    ...prev,
                    [groupId]: membersData?.length || 0
                }))
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
        const fetchAllGroupsData = async () => {
            await fetchGroups()
            if (groups.length > 0) {
                const fetchPromises = groups.map((group) => fetchGroupsUser(group.group_id))
                await Promise.all(fetchPromises)
            }
        }
        fetchAllGroupsData()
    }, []) // Re-run when groups changes

    const handleSaveGroup = (newGroup) => {
        setGroups((prev) => [...prev, newGroup])
        fetchGroupsUser(newGroup.group_id) // Fetch members for the new group
        console.log("New group created:", newGroup)
    }

    const handleEdit = (group) => {
        navigate(`/EditGroup/${group.group_id}`)
    }

    const handleDelete = async (group) => {
        const result = await Swal.fire({
            title: "Xác nhận xóa",
            text: `Bạn có chắc muốn xóa nhóm "${group.group_name}"? Hành động này không thể hoàn tác!`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Xóa",
            cancelButtonText: "Hủy",
        })

        if (result.isConfirmed) {
            try {
                const res = await axiosPrivate.delete(`http://localhost:7777/api/groups/${group.group_id}`)

                if (res.status === 200) {
                    setGroups((prev) => prev.filter((g) => g.group_id !== group.group_id))
                    setGroupMembers((prev) => {
                        const newMembers = { ...prev }
                        delete newMembers[group.group_id]
                        return newMembers
                    })
                    Swal.fire({
                        icon: "success",
                        title: "Thành công",
                        text: "Xóa nhóm thành công!",
                        confirmButtonText: "OK",
                        confirmButtonColor: "#28a745",
                    })
                    console.log("Group deleted successfully")
                } else {
                    const errorData = res.data
                    throw new Error(errorData.message || "Xóa nhóm thất bại")
                }
            } catch (error) {
                console.error("Error deleting group:", error)
                Swal.fire({
                    icon: "error",
                    title: "Lỗi",
                    text: error.message || "Đã xảy ra lỗi khi xóa nhóm. Vui lòng thử lại.",
                    confirmButtonText: "OK",
                    confirmButtonColor: "#d33",
                })
            }
        }
    }

    const getIconComponent = (iconName) => {
        if (!iconName) return Users
        return iconMap[iconName.toLowerCase()] || Users
    }

    const getColorClass = (color) => {
        if (!color) return "bg-gray-500"
        if (color.startsWith("bg-")) return color // Trường hợp là class Tailwind
        if (color.startsWith("#")) return ""      // Trường hợp là mã hex, sẽ dùng style
        return colorMap[color] || "bg-gray-500"   // Trường hợp là tên màu
    }

    const getRole = (role) => {
        if (role === "member") return <span className="text-sm font-medium text-white bg-blue-500 px-2 py-0.5 rounded-lg">Thành viên</span>
        if (role === "admin") return <span className="text-sm font-medium text-white bg-green-500 px-2 py-0.5 rounded-lg">Quản trị viên</span>
        if (role === "vice") return <span className="text-sm font-medium text-white bg-yellow-500 px-2 py-0.5 rounded-lg">Phó nhóm</span>
        if (role === "owner") return <span className="text-sm font-medium text-white bg-red-500 px-2 py-0.5 rounded-lg">Chủ nhóm</span>
        return "Thành viên"
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="px-6 py-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Danh sách nhóm</h1>
                            <p className="text-gray-600 text-sm">Quản lý và theo dõi các nhóm trong hệ thống</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Badge variant="outline" className="px-3 py-1">
                                Tổng cộng: {groups.length} nhóm
                            </Badge>
                            <Button onClick={() => setShowAddDialog(true)} className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg">
                                <Plus className="h-4 w-4 mr-2" />
                                Tạo nhóm mới
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="px-6 py-6">
                <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                <Input
                                    placeholder="Tìm kiếm theo tên nhóm, thành viên..."
                                    className="pl-12 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                        <div className="flex gap-3">
                            {/* View Toggle */}
                            <div className="flex border rounded-lg overflow-hidden">
                                <Button
                                    variant={viewMode === "grid" ? "default" : "ghost"}
                                    size="sm"
                                    className="rounded-none h-12 px-4"
                                    onClick={() => setViewMode("grid")}
                                >
                                    <Grid className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant={viewMode === "table" ? "default" : "ghost"}
                                    size="sm"
                                    className="rounded-none h-12 px-4"
                                    onClick={() => setViewMode("table")}
                                >
                                    <List className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content based on view mode */}
                {viewMode === "grid" ? (
                    /* Grid View */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {groups.map((group) => {
                            const IconComponent = getIconComponent(group.icon_name)
                            return (
                                <Card
                                    key={group.group_id}
                                    className="group hover:shadow-xl transition-all duration-300 border-0 shadow-md hover:-translate-y-1"
                                >
                                    <CardContent className="p-0">
                                        {/* Card Header */}
                                        <div className="relative p-6 pb-4">
                                            <div className="absolute top-4 right-4">
                                                <DropdownMenu>
                                                    <DropdownMenuContent align="end" className="w-48">
                                                        <DropdownMenuItem onClick={() => handleEdit(group)}>
                                                            <Edit className="h-4 w-4 mr-2" />
                                                            Chỉnh sửa
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => handleDelete(group)}
                                                            className="text-red-600 focus:text-red-600"
                                                        >
                                                            <Trash2 className="h-4 w-4 mr-2" />
                                                            Xóa
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>

                                            <div className="flex items-start space-x-4">
                                                <div
                                                    className={`w-14 h-14 rounded-xl flex items-center justify-center shadow-lg ${getColorClass(group.icon_color)}`}
                                                    style={group.icon_color && group.icon_color.startsWith("#") ? { backgroundColor: group.icon_color } : {}}
                                                >
                                                    <IconComponent className="h-7 w-7 text-white" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-lg font-semibold text-gray-900 truncate">{group.group_name}</h3>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Members Section */}
                                        <div className="px-6 pb-4">
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="text-sm font-medium text-gray-700">
                                                    {getRole(group.role)}
                                                </span>
                                                <span className="text-sm text-white bg-gray-500 px-2 py-0.5 rounded-lg">
                                                    {groupMembers[group.group_id] || 0} người
                                                </span>
                                            </div>
                                        </div>

                                        {/* Info Section */}
                                        <div className="px-6 pb-4 space-y-2">
                                            <div className="flex items-center text-sm text-gray-500">
                                                <Calendar className="h-4 w-4 mr-2" />
                                                Tạo ngày: {group.created_at ? new Date(group.created_at).toLocaleDateString("vi-VN") : "Không rõ"}
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="border-t bg-gray-50 px-6 py-4">
                                            <div className="flex space-x-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="flex-1 h-9 hover:opacity-50"
                                                    onClick={() => handleEdit(group)}
                                                >
                                                    <Eye className="h-3 w-3 mr-2" />
                                                    Xem
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="flex-1 h-9 text-red-600 hover:text-red-700 hover:border-red-300"
                                                    onClick={() => handleDelete(group)}
                                                >
                                                    <Trash2 className="h-3 w-3 mr-2" />
                                                    Xóa
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>
                ) : (
                    /* Table View */
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-50">
                                    <TableHead className="w-[50px] font-semibold">STT</TableHead>
                                    <TableHead className="font-semibold">Tên nhóm</TableHead>
                                    <TableHead className="font-semibold">Vai trò</TableHead>
                                    <TableHead className="w-[150px] font-semibold">Ngày tạo</TableHead>
                                    <TableHead className="w-[120px] font-semibold text-center">Hành động</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {Array.isArray(groups) && groups.length > 0 ? (
                                    groups.map((group) => {
                                        const IconComponent = getIconComponent(group.icon_name)
                                        return (
                                            <TableRow key={group.group_id} className="hover:bg-gray-50">
                                                <TableCell className="font-medium text-center">{group.group_id}</TableCell>
                                                <TableCell>
                                                    <div className="flex items-center space-x-3">
                                                        <div
                                                            className={`w-10 h-10 rounded-lg flex items-center justify-center ${getColorClass(group.icon_color)}`}
                                                            style={group.icon_color && group.icon_color.startsWith("#") ? { backgroundColor: group.icon_color } : {}}
                                                        >
                                                            <IconComponent className="h-5 w-5 text-white" />
                                                        </div>
                                                        <div>
                                                            <div className="font-medium text-gray-900 text-left">{group.group_name}</div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center space-x-2">
                                                        {getRole(group.role)}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center text-sm text-gray-600">
                                                        <Calendar className="h-4 w-4 mr-1" />
                                                        {group.created_at ? new Date(group.created_at).toLocaleDateString("vi-VN") : "Không rõ"}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center space-x-1">
                                                        <Button variant="ghost" size="sm" onClick={() => handleEdit(group)}>
                                                            <Eye className="h-4 w-4 text-green -500" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="text-red-600 hover:text-red-700"
                                                            onClick={() => handleDelete(group)}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan="6" className="text-center text-gray-500 py-4">
                                            Không có nhóm nào
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </div>
            <AddGroups open={showAddDialog}
                onOpenChange={setShowAddDialog}
                onSave={handleSaveGroup} />
        </div>
    )
}