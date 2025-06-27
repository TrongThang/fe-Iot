"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Users } from "lucide-react";
import { HOUSE_ICON_MAP } from "@/components/common/CustomerSearch/IconMap";
import { COLOR_MAP } from "@/components/common/CustomerSearch/ColorMap";

export default function IconHousePickerPopup({ open, onOpenChange, onSelectIcon, selectedIcon }) {
  const [tempSelectedIcon, setTempSelectedIcon] = useState({
    iconId: "HOUSE",
    component: HOUSE_ICON_MAP.HOUSE,
    color: COLOR_MAP.BLUE,
    colorId: "BLUE",
    name: "Nhà",
  });

  const iconList = [
    { id: "HOUSE", component: HOUSE_ICON_MAP.HOUSE, name: "Nhà" },
    { id: "APARTMENT", component: HOUSE_ICON_MAP.APARTMENT, name: "Căn hộ" },
    { id: "VILLA", component: HOUSE_ICON_MAP.VILLA, name: "Biệt thự" },
    { id: "OFFICE", component: HOUSE_ICON_MAP.OFFICE, name: "Cơ quan" },
    { id: "FACTORY", component: HOUSE_ICON_MAP.FACTORY, name: "Nhà máy" },
    { id: "HOTEL", component: HOUSE_ICON_MAP.HOTEL, name: "Khách sạn" },
    { id: "STORE", component: HOUSE_ICON_MAP.STORE, name: "Cửa hàng" },
    { id: "SCHOOL", component: HOUSE_ICON_MAP.SCHOOL, name: "Trường học" },
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
        iconId: selectedIcon.iconId || "HOUSE",
        component: HOUSE_ICON_MAP[selectedIcon.iconId] || HOUSE_ICON_MAP.HOUSE,
        color: selectedIcon.color || COLOR_MAP.BLUE,
        colorId: selectedIcon.colorId || "BLUE",
        name: selectedIcon.name || "Nhà",
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
      iconId: selectedIcon?.iconId || "HOUSE",
      component: selectedIcon?.component || HOUSE_ICON_MAP.HOUSE,
      color: selectedIcon?.color || COLOR_MAP.BLUE,
      colorId: selectedIcon?.colorId || "BLUE",
      name: selectedIcon?.name || "Nhà",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0 rounded-2xl">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle className="text-lg font-medium text-left">Chọn biểu tượng:</DialogTitle>
        </DialogHeader>

        <div className="px-6 pb-6">
          {/* Icons Grid */}
          <div className="grid grid-cols-3 gap-4 mb-6">
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

          {/* Color Selection */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Chọn màu sắc:</h3>
            <div className="flex justify-start space-x-4">
              {colorList.map((colorData) => (
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

