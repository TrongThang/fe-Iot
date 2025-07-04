"use client";

import {
  Users, Plus, Edit, Trash2, Search, Calendar, Grid, List,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GROUP_ICON_MAP } from "@/components/common/CustomerSearch/IconMap";
import { COLOR_MAP } from "@/components/common/CustomerSearch/ColorMap";
import { toast } from "sonner";
import AddGroupPopup from "./groupPopups/Add-group-popup";

export default function GroupsManagement() {
  const [viewMode, setViewMode] = useState("grid");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [groups, setGroups] = useState([]);
  const [groupMembers, setGroupMembers] = useState({});
  const [searchQuery, setSearchQuery] = useState(""); // New state for search query
  const navigate = useNavigate();

  const iconMap = { ...GROUP_ICON_MAP };

  const getColorClass = (color) => {
    if (!color) return COLOR_MAP.GRAY;
    if (color.startsWith("#")) return color;
    return COLOR_MAP[color.toUpperCase()] || COLOR_MAP.GRAY;
  };

  const getIconComponent = (iconName) => {
    if (!iconName) return Users;
    return iconMap[iconName.toUpperCase()] || Users;
  };

  const fetchGroupsUser = async (groupId) => {
    try {
      const res = await fetch(`http://localhost:7777/api/groups/${groupId}/members`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      if (res.ok) {
        const membersData = await res.json();
        setGroupMembers((prev) => ({
          ...prev,
          [groupId]: membersData?.data?.length || 0,
        }));
      } else {
        throw new Error("Lấy thông tin thành viên nhóm thất bại");
      }
    } catch (error) {
      toast.error(error.message || "Đã xảy ra lỗi khi lấy thông tin thành viên nhóm.");
    }
  };

  const fetchAllGroupsData = async () => {
    try {
      const res = await fetch(`http://localhost:7777/api/groups/my-groups`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      if (res.ok) {
        const dataGroups = await res.json();
        let groupsData = [];
        if (Array.isArray(dataGroups?.data)) {
          groupsData = dataGroups?.data;
        } else if (dataGroups?.data && typeof dataGroups?.data === "object") {
          groupsData = [dataGroups?.data];
        }
        setGroups(groupsData);
        if (groupsData.length > 0) {
          const fetchPromises = groupsData.map((group) => fetchGroupsUser(group.group_id));
          await Promise.all(fetchPromises);
        }
      } else {
        throw new Error("Lấy danh sách nhóm thất bại");
      }
    } catch (error) {
      console.error("Error refreshing data:", error);
      toast.error(error.message || "Đã xảy ra lỗi khi lấy danh sách nhóm.");
    }
  };

  const handleSaveGroup = (newGroup) => {
    setGroups((prev) => [...prev, {
      ...newGroup,
      icon_name: newGroup.icon_name.toUpperCase(),
      icon_color: newGroup.icon_color,
    }]);
    fetchGroupsUser(newGroup.group_id);
    toast.success("Thêm nhóm thành công!");
  };

  const handleEdit = (group) => {
    navigate(`/EditGroup/${group.group_id}`);
  };

  const handleDelete = async (group) => {
    const confirmed = await new Promise((resolve) => {
      toast.warning(
        `Bạn có chắc muốn xóa nhóm "${group.group_name}"? Hành động này không thể hoàn tác!`,
        {
          action: {
            label: "Xóa",
            onClick: () => resolve(true),
          },
          cancel: {
            label: "Hủy",
            onClick: () => resolve(false),
          },
          duration: 10000,
        }
      );
    });

    if (confirmed) {
      try {
        const res = await fetch(`http://localhost:7777/api/groups/${group.group_id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        });
        if (res.ok) {
          setGroups((prev) => prev.filter((g) => g.group_id !== group.group_id));
          setGroupMembers((prev) => {
            const newMembers = { ...prev };
            delete newMembers[group.group_id];
            return newMembers;
          });
          toast.success("Xóa nhóm thành công!");
        } else {
          const errorData = await res.json();
          throw new Error(errorData.message || "Xóa nhóm thất bại");
        }
      } catch (error) {
        console.error("Error deleting group:", error);
        toast.error(error.message || "Đã xảy ra lỗi khi xóa nhóm.");
      }
    }
  };

  useEffect(() => {
    fetchAllGroupsData();
  }, []);

  // Filter groups based on search query
  const filteredGroups = groups.filter(
    (group) =>
      (group.group_name ?? "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="bg-white shadow-sm border-b">
        <div className="px-6 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Danh sách nhóm</h1>
              <p className="text-gray-600 text-sm">Quản lý và theo dõi các nhóm trong hệ thống</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="px-3 py-1">
                Tổng cộng: {filteredGroups.length} nhóm
              </Badge>
              <Button
                onClick={() => setShowAddDialog(true)}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg"
              >
                <Plus className="h-4 w-4 mr-2" />
                Tạo nhóm mới
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-6">
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Tìm kiếm theo tên nhóm hoặc mô tả..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex gap-3">
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

        {filteredGroups.length === 0 ? (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Không tìm thấy nhóm nào phù hợp với từ khóa</p>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGroups.map((group) => {
              const IconComponent = getIconComponent(group.icon_name);
              return (
                <Card
                  key={group.group_id}
                  className="group hover:shadow-xl transition-all duration-300 border-0 shadow-md hover:-translate-y-1"
                >
                  <CardContent className="p-0">
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
                          className="w-14 h-14 rounded-xl flex items-center justify-center shadow-lg"
                          style={{ backgroundColor: getColorClass(group.icon_color) }}
                        >
                          <IconComponent
                            className={`h-7 w-7 ${group.icon_color === COLOR_MAP.WHITE ? "text-black" : "text-white"}`}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 truncate">{group.group_name}</h3>
                          <p className="text-sm text-gray-600 truncate">{group.description || "Không có mô tả"}</p>
                        </div>
                      </div>
                    </div>
                    <div className="px-6 pb-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-gray-700">Thành viên</span>
                        <span className="text-sm text-white bg-gray-500 px-2 py-0.5 rounded-lg">
                          {groupMembers[group.group_id] || 0} người
                        </span>
                      </div>
                    </div>
                    <div className="px-6 pb-4 space-y-2">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-2" />
                        Tạo ngày: {group.created_at ? new Date(group.created_at).toLocaleDateString("vi-VN") : "Không rõ"}
                      </div>
                    </div>
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
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="w-[50px] font-semibold">STT</TableHead>
                  <TableHead className="font-semibold">Tên nhóm</TableHead>
                  <TableHead className="font-semibold">Mô tả</TableHead>
                  <TableHead className="font-semibold">Thành viên</TableHead>
                  <TableHead className="w-[150px] font-semibold">Ngày tạo</TableHead>
                  <TableHead className="w-[120px] font-semibold text-center">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredGroups.map((group) => {
                  const IconComponent = getIconComponent(group.icon_name);
                  return (
                    <TableRow key={group.group_id} className="hover:bg-gray-50">
                      <TableCell className="font-medium text-center">{group.group_id}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: getColorClass(group.icon_color) }}
                          >
                            <IconComponent
                              className={`h-5 w-5 ${group.icon_color === COLOR_MAP.WHITE ? "text-black" : "text-white"}`}
                            />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 text-left">{group.group_name}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-600">{group.description || "Không có mô tả"}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <div className="flex -space-x-1">
                            {[...Array(Math.min(groupMembers[group.group_id] || 0, 3))].map((_, i) => (
                              <Avatar key={i} className="w-6 h-6 border-2 border-white">
                                <AvatarFallback className="text-xs bg-gray-200">
                                  {String.fromCharCode(65 + i)}
                                </AvatarFallback>
                              </Avatar>
                            ))}
                          </div>
                          <span className="text-sm text-gray-600">
                            {groupMembers[group.group_id] || 0} người
                          </span>
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
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
      <AddGroupPopup
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onSave={handleSaveGroup}
      />
    </div>
  );
}