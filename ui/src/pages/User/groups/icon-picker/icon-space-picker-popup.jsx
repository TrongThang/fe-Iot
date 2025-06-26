"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SPACE_ICON_MAP } from "@/components/common/CustomerSearch/IconMap";
import { COLOR_MAP } from "@/components/common/CustomerSearch/ColorMap";

export default function IconSpacePickerPopup({ open, onOpenChange, onSelectIcon, selectedIcon }) {
  const [tempSelectedIcon, setTempSelectedIcon] = useState({
    iconId: "LIVING",
    component: SPACE_ICON_MAP.LIVING,
    color: COLOR_MAP.BLUE,
    colorId: "BLUE",
    name: "Phòng khách",
  });

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

  const colorList = [
    { id: "BLUE", value: COLOR_MAP.BLUE, name: "Xanh dương" },
    { id: "RED", value: COLOR_MAP.RED, name: "Đỏ" },
    { id: "GREEN", value: COLOR_MAP.GREEN, name: "Xanh lá" },
    { id: "YELLOW", value: COLOR_MAP.YELLOW, name: "Vàng" },
    { id: "CYAN", value: COLOR_MAP.CYAN, name: "Xanh cyan" },
    { id: "GRAY", value: COLOR_MAP.GRAY, name: "Xám" },
    { id: "CUSTOM_BLUE", value: COLOR_MAP.CUSTOM_BLUE, name: "Xanh tùy chỉnh" },
  ];

  useEffect(() => {
    if (selectedIcon && open) {
      setTempSelectedIcon({
        iconId: selectedIcon.iconId || "LIVING",
        component: SPACE_ICON_MAP[selectedIcon.iconId] || SPACE_ICON_MAP.LIVING,
        color: selectedIcon.color || COLOR_MAP.BLUE,
        colorId: selectedIcon.colorId || "BLUE",
        name: selectedIcon.name || "Phòng khách",
      });
    }
  }, [selectedIcon, open]);

  const handleIconSelect = (iconData) => {
    setTempSelectedIcon((prev) => ({
      ...prev,
      iconId: iconData.id,
      component: iconData.component,
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
    onSelectIcon(tempSelectedIcon);
    onOpenChange(false);
  };

  const handleCancel = () => {
    setTempSelectedIcon({
      iconId: selectedIcon?.iconId || "LIVING",
      component: selectedIcon?.component || SPACE_ICON_MAP.LIVING,
      color: selectedIcon?.color || COLOR_MAP.BLUE,
      colorId: selectedIcon?.colorId || "BLUE",
      name: selectedIcon?.name || "Phòng khách",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-0 rounded-2xl">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle className="text-lg font-medium text-left">Chọn biểu tượng không gian:</DialogTitle>
        </DialogHeader>

        <div className="px-6 pb-6">
          {/* Icons Grid */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {iconList.map((iconData) => {
              const IconComponent = iconData.component || "";
              const isSelected = tempSelectedIcon.iconId === iconData.id;
              return (
                <button
                  key={iconData.id}
                  onClick={() => handleIconSelect(iconData)}
                  className={`flex flex-col items-center p-3 rounded-lg transition-all hover:bg-gray-50 ${isSelected ? "bg-blue-50 border-2 border-blue-500" : "border-2 border-transparent"}`}
                >
                  <div
                    className="w-12 h-7 rounded-lg flex items-center justify-center mb-2"
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

          {/* Color Selection */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Chọn màu sắc:</h3>
            <div className="flex justify-start space-x-4">
              {colorList.map((colorData) => (
                <button
                  key={colorData.id}
                  onClick={() => handleColorSelect(colorData)}
                  className={`w-10 h-10 rounded-full border-4 transition-all hover:scale-110 ${tempSelectedIcon.color === colorData.value ? "border-gray-800 shadow-lg" : "border-gray-200"}`}
                  style={{ backgroundColor: colorData.value }}
                  title={colorData.name}
                />
              ))}
            </div>
          </div>

          {/* Action Buttons */}
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
              Xác nhận
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}