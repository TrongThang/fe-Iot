"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Users } from "lucide-react";
import { GROUP_ICON_MAP } from "@/components/common/CustomerSearch/IconMap";
import { COLOR_MAP } from "@/components/common/CustomerSearch/ColorMap";

export default function IconPickerPopup({ open, onOpenChange, onSelectIcon, selectedIcon }) {
  const [tempSelectedIcon, setTempSelectedIcon] = useState({
    iconId: "GROUP",
    color: COLOR_MAP.BLUE,
    name: "Nhóm",
  });

  const groupIcons = [
    { component: GROUP_ICON_MAP.GOVERNMENT, name: "Chính phủ", id: "GOVERNMENT" },
    { component: GROUP_ICON_MAP.SCHOOL_GROUP, name: "Nhóm trường", id: "SCHOOL_GROUP" },
    { component: GROUP_ICON_MAP.ORGANIZATION, name: "Tổ chức", id: "ORGANIZATION" },
    { component: GROUP_ICON_MAP.PERSONAL, name: "Cá nhân", id: "PERSONAL" },
    { component: GROUP_ICON_MAP.FAMILY, name: "Gia đình", id: "FAMILY" },
    { component: GROUP_ICON_MAP.COMPANY, name: "Công ty", id: "COMPANY" },
  ];

  const colors = [
    { name: "Đỏ", value: COLOR_MAP.RED, id: "RED" },
    { name: "Xanh lá", value: COLOR_MAP.GREEN, id: "GREEN" },
    { name: "Xanh dương", value: COLOR_MAP.BLUE, id: "BLUE" },
    { name: "Vàng", value: COLOR_MAP.YELLOW, id: "YELLOW" },
    { name: "Xanh cyan", value: COLOR_MAP.CYAN, id: "CYAN" },
    { name: "Magenta", value: COLOR_MAP.MAGENTA, id: "MAGENTA" },
    { name: "Xám", value: COLOR_MAP.GRAY, id: "GRAY" },
    // { name: "Đen", value: COLOR_MAP.BLACK, id: "BLACK" },
    { name: "Trắng", value: COLOR_MAP.WHITE, id: "WHITE" },
    { name: "Xanh tùy chỉnh", value: COLOR_MAP.CUSTOM_BLUE, id: "CUSTOM_BLUE" },
  ];

  useEffect(() => {
    if (selectedIcon) {
      setTempSelectedIcon({
        iconId: selectedIcon.iconId || "GROUP",
        color: selectedIcon.color || COLOR_MAP.BLUE,
        name: selectedIcon.name || "Nhóm",
      });
    }
  }, [selectedIcon, open]);

  const handleIconSelect = (iconData) => {
    setTempSelectedIcon((prev) => ({
      ...prev,
      iconId: iconData.id,
      name: iconData.name,
    }));
  };

  const handleColorSelect = (colorData) => {
    setTempSelectedIcon((prev) => ({
      ...prev,
      color: colorData.value,
      colorId: colorData.id,
    }));
  };

  const handleConfirm = () => {
    const selectedIconData = groupIcons.find((icon) => icon.id === tempSelectedIcon.iconId);
    onSelectIcon({
      iconId: tempSelectedIcon.iconId,
      component: selectedIconData?.component,
      color: tempSelectedIcon.color,
      colorId: tempSelectedIcon.colorId || tempSelectedIcon.color,
      name: tempSelectedIcon.name,
    });
    onOpenChange(false);
  };

  const handleCancel = () => {
    if (selectedIcon) {
      setTempSelectedIcon({
        iconId: selectedIcon.iconId || "GROUP",
        color: selectedIcon.color || COLOR_MAP.BLUE,
        name: selectedIcon.name || "Nhóm",
      });
    } else {
      setTempSelectedIcon({
        iconId: "GROUP",
        color: COLOR_MAP.BLUE,
        name: "Nhóm",
      });
    }
    onOpenChange(false);
  };

  const renderIconSection = (title, iconList) => (
    <div className="mb-6">
      <h3 className="text-sm font-medium text-gray-700 mb-3">{title}</h3>
      <div className="grid grid-cols-3 gap-4">
        {iconList.map((iconData) => {
          const IconComponent = iconData.component || Users;
          const isSelected = tempSelectedIcon.iconId === iconData.id;
          return (
            <button
              key={iconData.id}
              onClick={() => handleIconSelect(iconData)}
              className={`flex flex-col items-center p-3 rounded-lg transition-all hover:bg-gray-50 ${isSelected ? "bg-blue-50 border-2 border-blue-500" : "border-2 border-transparent"
                }`}
            >
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center mb-2"
                style={{ backgroundColor: tempSelectedIcon.color }}
              >
                <IconComponent
                  className={`h-6 w-6 ${tempSelectedIcon.color === COLOR_MAP.WHITE ? "text-black" : "text-white"}`}
                />
              </div>
              <span className="text-xs text-gray-700 text-center leading-tight">{iconData.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-0 rounded-2xl">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle className="text-lg font-medium text-left">Chọn biểu tượng:</DialogTitle>
        </DialogHeader>

        <div className="px-6 pb-6">
          {renderIconSection("Nhóm", groupIcons)}

          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Chọn màu sắc:</h3>
            <div className="flex justify-start space-x-4">
              {colors.map((colorData) => (
                <button
                  key={colorData.id}
                  onClick={() => handleColorSelect(colorData)}
                  className={`w-10 h-10 rounded-full border-4 transition-all hover:scale-110 ${tempSelectedIcon.color === colorData.value ? "border-gray-800 shadow-lg" : "border-gray-200"
                    }`}
                  style={{ backgroundColor: colorData.value }}
                  title={colorData.name}
                />
              ))}
            </div>
          </div>

          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="flex-1 h-11 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg"
            >
              Hủy
            </Button>
            <Button
              onClick={handleConfirm}
              className="flex-1 h-11 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
            >
              Tạo
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}