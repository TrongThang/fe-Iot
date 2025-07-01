"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Home, X } from "lucide-react";
import { toast } from "sonner";
import IconSpacePickerPopup from "../../../icon-picker/icon-space-picker-popup";
import { Textarea } from "@/components/ui/textarea";
import { SPACE_ICON_MAP } from "@/components/common/CustomerSearch/IconMap";
import { COLOR_MAP } from "@/components/common/CustomerSearch/ColorMap";

export default function EditSpacePopup({ open, onOpenChange, onSave, space }) {
    const [spaceData, setSpaceData] = useState({
        name: "",
        description: "",
        icon: {
            iconId: "LIVING",
            component: SPACE_ICON_MAP.LIVING,
            color: COLOR_MAP.BLUE,
            colorId: "BLUE",
            name: "Phòng khách",
        },
    });
    const [showIconPicker, setShowIconPicker] = useState(false);
    const accessToken = localStorage.getItem("authToken");

    useEffect(() => {
        if (space && open) {
            const iconName = space.icon_name?.toUpperCase() || "LIVING";
            const iconComponent = SPACE_ICON_MAP[iconName] || SPACE_ICON_MAP.LIVING;
            const colorKey = Object.keys(COLOR_MAP).find(
                key => COLOR_MAP[key].toLowerCase() === space.icon_color?.toLowerCase()
            ) || "BLUE";
            const colorValue = COLOR_MAP[colorKey] || space.icon_color || COLOR_MAP.BLUE;

            setSpaceData({
                name: space.space_name || space.name || "",
                description: space.space_description || "",
                icon: {
                    iconId: iconName,
                    component: iconComponent,
                    color: colorValue,
                    colorId: colorKey,
                    name: iconList.find(icon => icon.id === iconName)?.name || "Phòng khách",
                },
            });
        }
    }, [space, open]);

    const iconList = [
        { id: "LIVING", component: SPACE_ICON_MAP.LIVING, name: "Phòng khách" },
        { id: "BEDROOM", component: SPACE_ICON_MAP.BEDROOM, name: "Phòng ngủ" },
        { id: "KITCHEN", component: SPACE_ICON_MAP.KITCHEN, name: "Nhà bếp" },
        { id: "BATHROOM", component: SPACE_ICON_MAP.BATHROOM, name: "Phòng tắm" },
        { id: "BALCONY", component: SPACE_ICON_MAP.BALCONY, name: "Ban công" },
        { id: "GARDEN", component: SPACE_ICON_MAP.GARDEN, name: "Vườn" },
        { id: "GARAGE", component: SPACE_ICON_MAP.GARAGE, name: "Nhà để xe" },
        { id: "WORKROOM", component: SPACE_ICON_MAP.WORKROOM, name: "Phòng làm việc" },
        { id: "LOBBY", component: SPACE_ICON_MAP.LOBBY, name: "Sảnh" },
        { id: "STORAGE", component: SPACE_ICON_MAP.STORAGE, name: "Kho" },
        { id: "ENTERTAIN", component: SPACE_ICON_MAP.ENTERTAIN, name: "Phòng giải trí" },
        { id: "ROOFTOP", component: SPACE_ICON_MAP.ROOFTOP, name: "Sân thượng" },
        { id: "HALLWAY", component: SPACE_ICON_MAP.HALLWAY, name: "Hành lang" },
    ];

    const handleSave = async () => {
        try {
            if (!space?.space_id) {
                throw new Error("Space ID is required");
            }
            const requestBody = {
                space_name: spaceData.name,
                space_description: spaceData.description || "",
                icon_name: spaceData.icon.iconId,
                icon_color: spaceData.icon.color,
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

            toast.success("Thành công", {
                description: "Chỉnh sửa không gian thành công!",
                duration: 3000,
            });
        } catch (error) {
            console.error("Lỗi khi chỉnh sửa không gian:", error);
            toast.error("Lỗi", {
                description: error.message || "Đã xảy ra lỗi khi chỉnh sửa không gian. Vui lòng thử lại.",
                duration: 3000,
            });
        }
    };

    const handleIconSelect = (selectedIcon) => {
        setSpaceData((prev) => ({ ...prev, icon: selectedIcon }));
        setShowIconPicker(false);
    };

    const handleCancel = () => {
        setSpaceData({
            name: "",
            description: "",
            icon: {
                iconId: "LIVING",
                component: SPACE_ICON_MAP.LIVING,
                color: COLOR_MAP.BLUE,
                colorId: "BLUE",
                name: "Phòng khách",
            },
        });
        onOpenChange(false);
    };

    const IconComponent = spaceData.icon.component || SPACE_ICON_MAP.LIVING;

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
                                className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg"
                                style={{ backgroundColor: spaceData.icon.color }}
                            >
                                <IconComponent
                                    className={`h-10 w-10 ${spaceData.icon.color === COLOR_MAP.WHITE ? "text-black" : "text-white"}`}
                                />
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
                                    <Home className="h-5 w-5 text-gray-400" />
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
                                    <Home className="h-5 w-5 text-gray-400 group-hover:text-blue-500" />
                                    <span className="text-gray-600 group-hover:text-blue-600">Chọn biểu tượng</span>
                                </div>
                                <div
                                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                                    style={{ backgroundColor: spaceData.icon.color }}
                                >
                                    <IconComponent
                                        className={`h-4 w-4 ${spaceData.icon.color === COLOR_MAP.WHITE ? "text-black" : "text-white"}`}
                                    />
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

            <IconSpacePickerPopup
                open={showIconPicker}
                onOpenChange={setShowIconPicker}
                onSelectIcon={handleIconSelect}
                selectedIcon={spaceData.icon}
            />
        </>
    );
}