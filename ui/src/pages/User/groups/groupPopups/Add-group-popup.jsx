"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Users, FileText, Palette, X } from "lucide-react";
import IconPickerPopup from "../icon-picker/icon-picker-popup";
import { toast } from "sonner";
import { GROUP_ICON_MAP } from "@/components/common/CustomerSearch/IconMap";
import { COLOR_MAP } from "@/components/common/CustomerSearch/ColorMap";

export default function AddGroupPopup({ open, onOpenChange, onSave }) {
  const [groupData, setGroupData] = useState({
    name: "",
    description: "",
    icon: {
      iconId: "COMPANY",
      component: GROUP_ICON_MAP.COMPANY,
      color: COLOR_MAP.BLUE,
      colorId: "BLUE",
      name: "Công ty",
    },
  });
  const [showIconPicker, setShowIconPicker] = useState(false);


  const handleSave = async () => {
    try {

      if (groupData.name.length > 255) {
        toast.error("Tên nhóm không được vượt quá 255 ký tự.");
        return;
      }
      if (groupData.description.length > 255) {
        toast.error("Mô tả nhóm không được vượt quá 255 ký tự.");
        return;
      }
      const response = await fetch("http://localhost:7777/api/groups", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify({
          group_name: groupData.name,
          group_description: groupData.description,
          icon_name: groupData.icon.iconId,
          icon_color: groupData.icon.color,
          icon_color_id: groupData.icon.colorId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Tạo nhóm thất bại");
      }

      const newGroup = await response.json();
      onSave(newGroup);
      onOpenChange(false);


      // Reset form
      setGroupData({
        name: "",
        description: "",
        icon: {
          iconId: "COMPANY",
          component: GROUP_ICON_MAP.COMPANY,
          color: COLOR_MAP.BLUE,
          colorId: "BLUE",
          name: "Công ty",
        },
      });
    } catch (error) {
      console.error("Lỗi khi tạo nhóm:", error);
      toast.error(error.message || "Đã xảy ra lỗi khi tạo nhóm. Vui lòng thử lại.");
    }
  };

  const handleIconSelect = (selectedIcon) => {
    setGroupData((prev) => ({ ...prev, icon: selectedIcon }));
    setShowIconPicker(false);
  };

  const handleCancel = () => {
    setGroupData({
      name: "",
      description: "",
      icon: {
        iconId: "COMPANY",
        component: GROUP_ICON_MAP.COMPANY,
        color: COLOR_MAP.BLUE,
        colorId: "BLUE",
        name: "Công ty",
      },
    });
    onOpenChange(false);
    toast.info("Đã hủy tạo nhóm.");
  };

  const IconComponent = groupData.icon.component || Users;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px] p-0 rounded-2xl shadow-2xl">
          {/* Header */}
          <DialogHeader className="px-6 pt-6 pb-2 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl font-semibold text-gray-900">Tạo nhóm mới</DialogTitle>
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

          {/* Content */}
          <div className="px-6 py-6 space-y-6">
            {/* Icon Preview */}
            <div className="flex justify-center">
              <div
                className="w-20 h-10 rounded-2xl flex items-center justify-center shadow-lg"
                style={{ backgroundColor: groupData.icon.color }}
              >
                <IconComponent
                  className={`h-10 w-10 ${groupData.icon.color === COLOR_MAP.WHITE ? "text-black" : "text-white"}`}
                />
              </div>
            </div>

            {/* Group Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Tên nhóm</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <Users className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  placeholder="Nhập tên nhóm..."
                  value={groupData.name}
                  onChange={(e) => setGroupData((prev) => ({ ...prev, name: e.target.value }))}
                  className="pl-11 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl"
                />
              </div>
            </div>

            {/* Group Description */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Mô tả nhóm</label>
              <div className="relative">
                <div className="absolute left-3 top-4">
                  <FileText className="h-5 w-5 text-gray-400" />
                </div>
                <Textarea
                  placeholder="Mô tả về nhóm của bạn..."
                  value={groupData.description}
                  onChange={(e) => setGroupData((prev) => ({ ...prev, description: e.target.value }))}
                  className="pl-11 min-h-[100px] border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl resize-none"
                />
              </div>
            </div>

            {/* Icon Picker Button */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Biểu tượng nhóm</label>
              <Button
                variant="outline"
                onClick={() => setShowIconPicker(true)}
                className="w-full h-12 border-gray-200 hover:border-blue-500 hover:bg-blue-50 rounded-xl flex items-center justify-between group"
              >
                <div className="flex items-center space-x-3">
                  <Palette className="h-5 w-5 text-gray-400 group-hover:text-blue-500" />
                  <span className="text-gray-600 group-hover:text-blue-600">Chọn biểu tượng</span>
                </div>
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: groupData.icon.color }}
                >
                  <IconComponent
                    className={`h-4 w-4 ${groupData.icon.color === COLOR_MAP.WHITE ? "text-black" : "text-white"}`}
                  />
                </div>
              </Button>
            </div>

            {/* Action Buttons */}
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
                disabled={!groupData.name.trim()}
              >
                Tạo nhóm
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Icon Picker Popup */}
      <IconPickerPopup
        open={showIconPicker}
        onOpenChange={setShowIconPicker}
        onSelectIcon={handleIconSelect}
        selectedIcon={groupData.icon}
      />
    </>
  );
}