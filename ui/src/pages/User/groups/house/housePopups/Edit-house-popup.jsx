"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Home, MapPin, Palette, X } from "lucide-react";
import IconHousePickerPopup from "../../icon-picker/icon-house-picker-popup";
import { toast } from "sonner";
import { HOUSE_ICON_MAP } from "@/components/common/CustomerSearch/IconMap";
import { COLOR_MAP } from "@/components/common/CustomerSearch/ColorMap";

export default function EditHousePopup({ open, onOpenChange, onSave, house, groupId }) {
  const [houseData, setHouseData] = useState({
    name: "",
    address: "",
    icon: {
      iconId: "HOME",
      component: HOUSE_ICON_MAP.HOME,
      color: COLOR_MAP.BLUE,
      colorId: "BLUE",
      name: "Nhà",
    },
  });
  const [showIconPicker, setShowIconPicker] = useState(false);

  useEffect(() => {
    if (house && open) {
      const iconKey = house.icon_name?.toUpperCase() || "HOME";
      const iconComponent = HOUSE_ICON_MAP[iconKey] || HOUSE_ICON_MAP.HOME;
      const colorId = house.icon_color_id || "BLUE";
      setHouseData({
        name: house.name || house.house_name || "",
        address: house.address || "",
        icon: {
          iconId: iconKey,
          component: iconComponent,
          color: house.icon_color || COLOR_MAP.BLUE,
          colorId: colorId,
          name: iconKey.charAt(0).toUpperCase() + iconKey.slice(1).toLowerCase(),
        },
      });
    }
  }, [house, open]);

  const handleSave = async () => {
    try {
      const houseId = house?.id || house?.house_id;
      if (!houseId) {
        throw new Error("House ID is required for editing");
      }
      if (!groupId || isNaN(Number(groupId))) {
        throw new Error("Group ID is invalid");
      }
      const requestBody = {
        house_name: houseData.name,
        address: houseData.address || "",
        icon_name: houseData.icon.iconId,
        icon_color: houseData.icon.color,
      };

      // Validate required fields
      if (!requestBody.house_name) {
        throw new Error("Tên nhà không được để trống");
      }
      if (!requestBody.address) {
        throw new Error("Địa chỉ nhà không được để trống");
      }

      const response = await fetch(`http://localhost:7777/api/houses/${houseId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Chỉnh sửa nhà thất bại");
      }

      const updatedHouse = await response.json();
      onSave(updatedHouse);
      onOpenChange(false);


      // Reset form after save
      setHouseData({
        name: "",
        address: "",
        icon: {
          iconId: "HOME",
          component: HOUSE_ICON_MAP.HOME,
          color: COLOR_MAP.BLUE,
          colorId: "BLUE",
          name: "Nhà",
        },
      });
    } catch (error) {
      console.error("Lỗi khi chỉnh sửa nhà:", error);
      toast.error(error.message || "Đã xảy ra lỗi khi chỉnh sửa nhà. Vui lòng thử lại.");
    }
  };

  const handleIconSelect = (selectedIcon) => {
    setHouseData((prev) => ({ ...prev, icon: selectedIcon }));
    setShowIconPicker(false);
  };

  const handleCancel = () => {
    // Restore original house data instead of resetting
    const iconKey = house?.icon_name?.toUpperCase() || "HOME";
    const iconComponent = HOUSE_ICON_MAP[iconKey] || HOUSE_ICON_MAP.HOME;
    const colorId = house?.icon_color_id || "BLUE";
    setHouseData({
      name: house?.name || house?.house_name || "",
      address: house?.address || "",
      icon: {
        iconId: iconKey,
        component: iconComponent,
        color: house?.icon_color || COLOR_MAP.BLUE,
        colorId: colorId,
        name: iconKey.charAt(0).toUpperCase() + iconKey.slice(1).toLowerCase(),
      },
    });
    onOpenChange(false);
    toast.info("Đã hủy chỉnh sửa nhà.");
  };

  const IconComponent = houseData.icon.component || Home;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px] p-0 rounded-2xl shadow-2xl">
          <DialogHeader className="px-6 pt-6 pb-2 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl font-semibold text-gray-900">Chỉnh sửa nhà</DialogTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancel}
                className="h-8 w-8 p-0 rounded-full hover:bg-gray-100"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <DialogDescription className="sr-only">
              Chỉnh sửa thông tin nhà của bạn
            </DialogDescription>
          </DialogHeader>

          <div className="px-6 py-6 space-y-6">
            <div className="flex justify-center">
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg"
                style={{ backgroundColor: houseData.icon.color }}
              >
                <IconComponent
                  className={`h-10 w-10 ${houseData.icon.color === COLOR_MAP.WHITE ? "text-black" : "text-white"}`}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Tên nhà</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <Home className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  placeholder="Nhập tên nhà..."
                  value={houseData.name}
                  onChange={(e) => setHouseData((prev) => ({ ...prev, name: e.target.value }))}
                  className="pl-11 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Địa chỉ nhà</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  placeholder="Nhập địa chỉ nhà..."
                  value={houseData.address}
                  onChange={(e) => setHouseData((prev) => ({ ...prev, address: e.target.value }))}
                  className="pl-11 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Biểu tượng nhà</label>
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
                  style={{ backgroundColor: houseData.icon.color }}
                >
                  <IconComponent
                    className={`h-4 w-4 ${houseData.icon.color === COLOR_MAP.WHITE ? "text-black" : "text-white"}`}
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
                disabled={!houseData.name.trim() || !houseData.address.trim() || !houseData.icon}
              >
                Lưu thay đổi
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <IconHousePickerPopup
        open={showIconPicker}
        onOpenChange={setShowIconPicker}
        onSelectIcon={handleIconSelect}
        selectedIcon={houseData.icon}
      />
    </>
  );
}