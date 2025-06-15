"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Home, Palette, X, FileText } from "lucide-react";
import Swal from "sweetalert2";
import IconPickerPopup from "../../../icon-picker/icon-picker-popup";
import { Textarea } from "@/components/ui/textarea";

export default function EditSpacePopup({ open, onOpenChange, onSave, space }) {
    const [spaceData, setSpaceData] = useState({
        name: "",
        description: "",
        icon: { icon: Home, color: "bg-blue-500", name: "home", id: "home", colorId: "blue" },
    });
    const [showIconPicker, setShowIconPicker] = useState(false);
    const accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJBQ0NUMTBKVU4yNTAxSlhCV1k5UlBGR1Q0NEU0WUNCUSIsInVzZXJuYW1lIjoidGhhbmhzYW5nMDkxMjEiLCJyb2xlIjoidXNlciIsImlhdCI6MTc0OTkxMTQ2MywiZXhwIjoxNzQ5OTE1MDYzfQ.7fzhlZtn8m1YaO-43fKuyXAOUQqK5Qeue5Z4mqqfsvA";

    useEffect(() => {
        if (space && open) {
            setSpaceData({
                name: space.space_name || space.name || "",
                description: space.space_description || "",
                icon: {
                    icon: Home, // Nếu muốn map icon nâng cao thì bổ sung logic ở đây
                    color: "bg-blue-500",
                    name: space.icon_name || "home",
                    id: space.icon_name || "home",
                    colorId: space.icon_color || "blue",
                },
            });
        }
    }, [space, open]);

    const handleSave = async () => {
        try {
            if (!space?.space_id) {
                throw new Error("Space ID is required");
            }
            const requestBody = {
                space_name: spaceData.name,
                space_description: spaceData.description || "",
                icon_name: spaceData.icon.id,
                icon_color: spaceData.icon.colorId,
            };

            const response = await fetch(`http://localhost:7777/api/spaces/${space.space_id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Chỉnh sửa không gian thất bại");
            }

            const updatedSpace = await response.json();
            onSave(updatedSpace);
            onOpenChange(false);

            Swal.fire({
                icon: "success",
                title: "Thành công",
                text: "Chỉnh sửa không gian thành công!",
                confirmButtonText: "OK",
                confirmButtonColor: "#28a745",
            });
        } catch (error) {
            console.error("Lỗi khi chỉnh sửa không gian:", error);
            Swal.fire({
                icon: "error",
                title: "Lỗi",
                text: error.message || "Đã xảy ra lỗi khi chỉnh sửa không gian. Vui lòng thử lại.",
                confirmButtonText: "OK",
                confirmButtonColor: "#d33",
            });
        }
    };

    const handleIconSelect = (selectedIcon) => {
        setSpaceData((prev) => ({ ...prev, icon: selectedIcon }));
    };

    const handleCancel = () => {
        setSpaceData({
            name: "",
            description: "",
            icon: { icon: Home, color: "bg-blue-500", name: "home", id: "home", colorId: "blue" },
        });
        onOpenChange(false);
    };

    const IconComponent = spaceData.icon.icon || Home;

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-[600px] p-0 rounded-2xl shadow-2xl">
                    <DialogHeader className="px-6 pt-6 pb-2 border-b border-gray-100">
                        <div className="flex items-center justify-between">
                            <DialogTitle className="text-xl font-semibold text-gray-900">Chỉnh sửa không gian</DialogTitle>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleCancel}
                                className="h-8 w-8 p-0 rounded-full hover:bg-gray-100"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    </DialogHeader>

                    <div className="px-6 py-6 space-y-6">
                        <div className="flex justify-center">
                            <div
                                className={`w-20 h-20 rounded-2xl ${spaceData.icon.color} flex items-center justify-center shadow-lg`}
                            >
                                <IconComponent className="h-10 w-10 text-white" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Tên không gian</label>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                                    <Home className="h-5 w-5 text-gray-400" />
                                </div>
                                <Input
                                    placeholder="Nhập tên không gian..."
                                    value={spaceData.name}
                                    onChange={(e) => setSpaceData((prev) => ({ ...prev, name: e.target.value }))}
                                    className="pl-11 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Mô tả không gian</label>
                            <div className="relative">
                                <div className="absolute left-3 top-4">
                                    <FileText className="h-5 w-5 text-gray-400" />
                                </div>
                                <Textarea
                                    placeholder="Mô tả về không gian..."
                                    value={spaceData.description}
                                    onChange={(e) => setSpaceData((prev) => ({ ...prev, description: e.target.value }))}
                                    className="pl-11 min-h-[100px] border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl resize-none"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Biểu tượng không gian</label>
                            <Button
                                variant="outline"
                                onClick={() => setShowIconPicker(true)}
                                className="w-full h-12 border-gray-200 hover:border-blue-500 hover:bg-blue-50 rounded-xl flex items-center justify-between group"
                            >
                                <div className="flex items-center space-x-3">
                                    <Palette className="h-5 w-5 text-gray-400 group-hover:text-blue-500" />
                                    <span className="text-gray-600 group-hover:text-blue-600">Chọn biểu tượng</span>
                                </div>
                                <div className={`w-8 h-8 rounded-lg ${spaceData.icon.color} flex items-center justify-center`}>
                                    <IconComponent className="h-4 w-4 text-white" />
                                </div>
                            </Button>
                        </div>

                        <div className="flex space-x-3 pt-4">
                            <Button
                                variant="outline"
                                onClick={handleCancel}
                                className="flex-1 h-12 border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl"
                            >
                                Hủy
                            </Button>
                            <Button
                                onClick={handleSave}
                                className="flex-1 h-12 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all"
                                disabled={!spaceData.name.trim() || !spaceData.icon}
                            >
                                Lưu thay đổi
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <IconPickerPopup
                open={showIconPicker}
                onOpenChange={setShowIconPicker}
                onSelectIcon={handleIconSelect}
                selectedIcon={spaceData.icon}
            />
        </>
    );
}
