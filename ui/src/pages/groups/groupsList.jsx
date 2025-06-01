"use client"

import { Users, Plus, Edit, Trash2, Search, Filter, MoreVertical, Calendar, MapPin, Grid, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import AddGroups from "./groupAdd"

export default function GroupsManagement() {
    const [viewMode, setViewMode] = useState("grid")
    const [showAddDialog, setShowAddDialog] = useState(false)
    const [agroups, setGroups] = useState([])
    const navigate = useNavigate()


    const handleSaveGroup = (newGroup) => {
        setGroups((prev) => [...prev, newGroup])
        console.log("New group created:", newGroup)
    }
    const groups = Array(9)
        .fill(null)
        .map((_, i) => ({
            id: i + 1,
            name: `Family ${String.fromCharCode(65 + (i % 3))}`,
            memberCount: Math.floor(Math.random() * 8) + 2,
            type: ["Work", "Personal", "Project"][i % 3],
            status: ["Hoạt động", "Tạm dừng", "Không hoạt động"][i % 3],
            created: "15/12/2024",
            location: ["Hà Nội", "TP.HCM", "Đà Nẵng"][i % 3],
            color: ["bg-blue-500", "bg-green-500", "bg-purple-500", "bg-orange-500", "bg-pink-500"][i % 5],
        }))

    const handleEdit = (group) => {
        // Navigate to edit page or open edit dialog
        navigate("/EditGroup")
    }

    const handleDelete = (group) => {
        alert(`Đã xóa nhóm: ${group.name}`)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className=" px-6 py-6">
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
            <div className=" px-6 py-6">
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
                        {groups.map((group) => (
                            <Card
                                key={group.id}
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
                                            <div className={`w-14 h-14 ${group.color} rounded-xl flex items-center justify-center shadow-lg`}>
                                                <Users className="h-7 w-7 text-white" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-lg font-semibold text-gray-900 truncate">{group.name}</h3>
                                                <div className="flex items-center space-x-2 mt-1">
                                                    <Badge variant="secondary" className="text-xs">
                                                        {group.type}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Members Section */}
                                    <div className="px-6 pb-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-sm font-medium text-gray-700">Thành viên</span>
                                            <span className="text-sm text-white bg-gray-500 px-2 py-0.5 rounded-lg">
                                                {group.memberCount} người
                                            </span>
                                        </div>
                                    </div>

                                    {/* Info Section */}
                                    <div className="px-6 pb-4 space-y-2">
                                        <div className="flex items-center text-sm text-gray-500">
                                            <MapPin className="h-4 w-4 mr-2" />
                                            {group.location}
                                        </div>
                                        <div className="flex items-center text-sm text-gray-500">
                                            <Calendar className="h-4 w-4 mr-2" />
                                            Tạo ngày {group.created}
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
                                                <Edit className="h-3 w-3 mr-2" />
                                                Chỉnh sửa
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
                        ))}
                    </div>
                ) : (
                    /* Table View */
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-50">
                                    <TableHead className="w-[50px] font-semibold">STT</TableHead>
                                    <TableHead className="font-semibold">Tên nhóm</TableHead>
                                    <TableHead className="font-semibold">Thành viên</TableHead>
                                    <TableHead className="font-semibold">Địa điểm</TableHead>
                                    <TableHead className="w-[150px] font-semibold">Ngày tạo</TableHead>
                                    <TableHead className="w-[120px] font-semibold text-center">Hành động</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {groups.map((group) => (
                                    <TableRow key={group.id} className="hover:bg-gray-50">
                                        <TableCell className="font-medium text-center">{group.id}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center space-x-3">
                                                <div className={`w-10 h-10 ${group.color} rounded-lg flex items-center justify-center`}>
                                                    <Users className="h-5 w-5 text-white" />
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900">{group.name}</div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center space-x-2">
                                                <div className="flex -space-x-1">
                                                    {[...Array(Math.min(group.memberCount, 3))].map((_, i) => (
                                                        <Avatar key={i} className="w-6 h-6 border-2 border-white">
                                                            <AvatarFallback className="text-xs bg-gray-200">
                                                                {String.fromCharCode(65 + i)}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                    ))}
                                                </div>
                                                <span className="text-sm text-gray-600">{group.memberCount} người</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center text-sm text-gray-600">
                                                <MapPin className="h-4 w-4 mr-1" />
                                                {group.location}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center text-sm text-gray-600">
                                                <Calendar className="h-4 w-4 mr-1" />
                                                {group.created}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center space-x-1 ">
                                                <Button variant="ghost" size="sm" onClick={() => handleEdit(group)}>
                                                    <Edit className="h-4 w-4" />
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
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </div>
            <AddGroups open={showAddDialog} onOpenChange={setShowAddDialog} onSave={handleSaveGroup} />
        </div>
    )
}
