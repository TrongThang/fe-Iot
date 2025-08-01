"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { X, Home } from "lucide-react";
import { toast } from "sonner";
import IconSpacePickerPopup from "../../../icon-picker/icon-space-picker-popup";
import { Textarea } from "@/components/ui/textarea";
import { SPACE_ICON_MAP } from "@/components/common/CustomerSearch/IconMap";
import { COLOR_MAP } from "@/components/common/CustomerSearch/ColorMap";

export default function AddSpacePopup({ open, onOpenChange, onSave, houseId }) {
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

    const handleSave = async () => {
        try {
            if (!houseId) {
                throw new Error("House ID is required");
            }
            if (spaceData.name.length > 255) {
                toast.error("Tên không gian không được vượt quá 255 ký tự.");
                return;
            }
            if (spaceData.description.length > 255) {
                toast.error("Mô tả không gian không được vượt quá 255 ký tự.");
                return;
            }
            const requestBody = {
                houseId: Number(houseId),
                space_name: spaceData.name,
                space_description: spaceData.description || "",
                icon_name: spaceData.icon.iconId,
                icon_color: spaceData.icon.color,
            };

            const response = await fetch("https://iothomeconnectapiv2-production.up.railway.app/api/spaces", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Thêm không gian thất bại");
            }

            const newSpace = await response.json();
            onSave(newSpace);
            onOpenChange(false);

            toast.success("Thành công", {
                description: "Thêm không gian thành công!",
                duration: 3000,
            });

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
        } catch (error) {
            console.error("Lỗi khi thêm không gian:", error);
            toast.error("Lỗi", {
                description: error.message || "Đã xảy ra lỗi khi thêm không gian. Vui lòng thử lại.",
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
                            <DialogTitle className="text-xl font-semibold text-gray-900">Thêm không gian mới</DialogTitle>
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
                                disabled={!spaceData.name.trim() || !spaceData.icon || !houseId}
                            >
                                Thêm không gian
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