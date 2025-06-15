"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Home, MapPin, Palette, X, Briefcase, GraduationCap, Building, Building2, Bed, Castle, TreePine, Crown, BookOpen } from "lucide-react";
import IconPickerPopup from "../../icon-picker/icon-picker-popup";
import Swal from "sweetalert2";

const iconMap = {
  home: Home,
  office: Briefcase,
  school: GraduationCap,
  bank: Building,
  apartment: Building2,
  hotel: Bed,
  villa: Castle,
  wooden: TreePine,
  castle: Crown,
  library: BookOpen,
};

const colorMap = {
  "#FF5733": "bg-red-500",
  blue: "bg-blue-500",
  "#FFF00F": "bg-yellow-500",
  "#0000FF": "bg-blue-700",
  "#FF0000": "bg-red-600",
};

export default function EditHousePopup({ open, onOpenChange, onSave, house, groupId }) {
  const [houseData, setHouseData] = useState({
    name: "",
    address: "",
    icon: { icon: Home, color: "bg-blue-500", name: "home", id: "home", colorId: "blue" },
  });
  const [showIconPicker, setShowIconPicker] = useState(false);
  const accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJBQ0NUMTBKVU4yNTAxSlhCV1k5UlBGR1Q0NEU0WUNCUSIsInVzZXJuYW1lIjoidGhhbmhzYW5nMDkxMjEiLCJyb2xlIjoidXNlciIsImlhdCI6MTc0OTk4OTMwNCwiZXhwIjoxNzQ5OTkyOTA0fQ.j6DCx4JInPkd7xXBPaL3XoBgEadKenacoQAlOj3lNrE";

  useEffect(() => {
    if (house && open) {
      const iconKey = house.icon_name?.toLowerCase() || "home";
      const iconComponent = iconMap[iconKey] || Home;
      const colorClass = colorMap[house.icon_color] || "bg-blue-500";
      setHouseData({
        name: house.name || house.house_name || "",
        address: house.address || "",
        icon: {
          icon: iconComponent,
          color: colorClass,
          name: iconKey,
          id: iconKey,
          colorId: house.icon_color || "blue",
        },
      });
    }
  }, [house, open]);

  const handleSave = async () => {
    try {
      if (!house?.id && !house?.house_id) {
        throw new Error("House ID is required for editing");
      }
      const requestBody = {
        house_name: houseData.name.trim(),
        address: houseData.address.trim(),
        icon_name: houseData.icon.id,
        icon_color: houseData.icon.colorId,
      };

      // Validate required fields
      if (!requestBody.house_name) {
        throw new Error("Tên nhà không được để trống");
      }
      if (!requestBody.address) {
        throw new Error("Địa chỉ nhà không được để trống");
      }

      const houseId = house?.id || house?.house_id;
      const response = await fetch(`http://localhost:7777/api/houses/${houseId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
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

      Swal.fire({
        icon: "success",
        title: "Thành công",
        text: "Chỉnh sửa nhà thành công!",
        confirmButtonText: "OK",
        confirmButtonColor: "#28a745",
      });

      setHouseData({
        name: "",
        address: "",
        icon: { icon: Home, color: "bg-blue-500", name: "home", id: "home", colorId: "blue" },
      });
    } catch (error) {
      console.error("Lỗi khi chỉnh sửa nhà:", error);
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: error.message || "Đã xảy ra lỗi khi chỉnh sửa nhà. Vui lòng thử lại.",
        confirmButtonText: "OK",
        confirmButtonColor: "#d33",
      });
    }
  };

  const handleIconSelect = (selectedIcon) => {
    setHouseData((prev) => ({ ...prev, icon: selectedIcon }));
  };

  const handleCancel = () => {
    setHouseData({
      name: "",
      address: "",
      icon: { icon: Home, color: "bg-blue-500", name: "home", id: "home", colorId: "blue" },
    });
    onOpenChange(false);
  };

  const IconComponent = houseData.icon.icon || Home;

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
                className={`w-20 h-20 rounded-2xl ${houseData.icon.color} flex items-center justify-center shadow-lg`}
              >
                <IconComponent className="h-10 w-10 text-white" />
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
                <div className={`w-8 h-8 rounded-lg ${houseData.icon.color} flex items-center justify-center`}>
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
                disabled={!houseData.name.trim() || !houseData.address.trim() || !houseData.icon || !groupId}
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
        selectedIcon={houseData.icon}
      />
    </>
  );
}