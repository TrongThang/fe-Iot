"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Home,
  Search,
  Plus,
  Trash2,
  Edit,
  MoreHorizontal,
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import SpaceTab from "./space/spaceTab";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import AddHousePopup from "./housePopups/Add-house-popup";
import EditHousePopup from "./housePopups/Edit-house-popup";
import axiosPrivate from "@/apis/clients/private.client";
import { HOUSE_ICON_MAP } from "@/components/common/CustomerSearch/IconMap";
import { COLOR_MAP } from "@/components/common/CustomerSearch/ColorMap";

export default function HouseTab({ roleUserCurrent }) {
  const { id } = useParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedHouse, setSelectedHouse] = useState(null);
  const [showSpaceList, setShowSpaceList] = useState(false);
  const [isAddHousePopupOpen, setIsAddHousePopupOpen] = useState(false);
  const [isEditHousePopupOpen, setIsEditHousePopupOpen] = useState(false);
  const [houseToEdit, setHouseToEdit] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddingHouse, setIsAddingHouse] = useState(false);
  const [houses, setHouses] = useState([]);

  const fetchSpaces = async (houseId) => {
    try {
      const res = await fetch(`http://localhost:7777/api/spaces/house/${houseId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      if (res.ok) {
        const dataSpace = await res.json();
        return Array.isArray(dataSpace) ? dataSpace : [];
      } else {
        console.error(`Failed to fetch spaces for house ${houseId}: ${res.status} ${res.statusText}`);
        return [];
      }
    } catch (error) {
      console.error(`Error fetching spaces for house ${houseId}:`, error);
      toast.error(error.message || "Đã xảy ra lỗi khi lấy danh sách không gian. Vui lòng thử lại.");
      return [];
    }
  };

  const fetchHouses = async (groupId) => {
    setIsLoading(true);
    try {
      const res = await axiosPrivate.get(`http://localhost:7777/api/houses/group/${groupId}`);
      const dataHouse = res ? res : []; // Fixed: Access res.data
      const normalizedHouses = Array.isArray(dataHouse)
        ? dataHouse.map((house) => ({
          id: house.house_id ?? Date.now(),
          group_id: house.group_id ?? "",
          name: house.house_name ?? "Unnamed House",
          address: house.address ?? "",
          icon_name: house.icon_name ?? "HOUSE",
          icon_color: house.icon_color ?? COLOR_MAP.BLUE,
          icon_color_id: house.icon_color_id ?? "BLUE",
          space: 0,
        }))
        : [];

      const housesWithSpaces = await Promise.all(
        normalizedHouses.map(async (house) => {
          const spaces = await fetchSpaces(house.id);
          return { ...house, space: spaces.length };
        })
      );

      setHouses(housesWithSpaces || []);
    } catch (error) {
      console.error("Error fetching houses:", error);
      toast.error(error.message || "Đã xảy ra lỗi khi lấy danh sách nhà. Vui lòng thử lại.");
      setHouses([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchHouses(id);
    }
  }, [id]);

  const handleDeleteHouse = async (houseId) => {
    const confirmed = await new Promise((resolve) => {
      toast.warning(
        "Bạn có chắc muốn xóa ngôi nhà này? Hành động này không thể hoàn tác!",
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
        const res = await fetch(`http://localhost:7777/api/houses/${houseId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        });
        if (res.ok) {
          setHouses(houses.filter((h) => h.id !== houseId));
          toast.success("Xóa nhà thành công!");
        } else {
          throw new Error(`Xóa nhà thất bại: ${res.status} ${res.statusText}`);
        }
      } catch (error) {
        toast.error(error.message || "Đã xảy ra lỗi khi xóa nhà. Vui lòng thử lại.");
      }
    }
  };

  const handleEditHouse = (houseId) => {
    const house = houses.find((h) => h.id === houseId);
    if (house) {
      setSelectedHouse(house);
      setShowSpaceList(true);
    }
  };

  const handleEditHouseDetails = (houseId) => {
    const house = houses.find((h) => h.id === houseId);
    if (house) {
      setHouseToEdit(house);
      setIsEditHousePopupOpen(true);
    }
  };

  const handleBackToHouses = () => {
    setShowSpaceList(false);
    setSelectedHouse(null);
  };

  const handleAddHouse = () => {
    setIsAddHousePopupOpen(true);
  };

  const handleSaveHouse = (newHouse) => {
    setIsAddingHouse(true);
    try {
      const normalizedHouse = {
        id: newHouse.house_id ?? Date.now(),
        group_id: newHouse.group_id ?? id,
        name: newHouse.house_name ?? "Unnamed House",
        address: newHouse.address ?? "",
        icon_name: newHouse.icon_name?.toUpperCase() ?? "HOUSE",
        icon_color: newHouse.icon_color ?? COLOR_MAP.BLUE,
        icon_color_id: newHouse.icon_color_id ?? "BLUE",
        space: 0,
      };
      setHouses((prevHouses) => [...prevHouses, normalizedHouse]);
      setIsAddingHouse(false);
      toast.success("Thêm nhà thành công!");
    } catch (error) {
      console.error("Error adding house to state:", error);
      setIsAddingHouse(false);
      toast.error(error.message || "Đã xảy ra lỗi khi thêm nhà. Vui lòng thử lại.");
    }
  };

  const handleUpdateHouse = (updatedHouse) => {
    setHouses((prevHouses) =>
      prevHouses.map((h) =>
        h.id === updatedHouse.house_id
          ? {
            ...h,
            name: updatedHouse.house_name,
            address: updatedHouse.address,
            icon_name: updatedHouse.icon_name?.toUpperCase(),
            icon_color: updatedHouse.icon_color,
            icon_color_id: updatedHouse.icon_color_id,
            group_id: updatedHouse.group_id,
          }
          : h
      )
    );
    toast.success("Thành công!", {
      description: "Chỉnh sửa nhà thành công!",
      duration: 3000,
    });
  };

  const filteredHouses = houses.filter(
    (house) =>
      (house.name ?? "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (house.address ?? "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getIconComponent = (iconName) => {
    if (!iconName) return Home;
    return HOUSE_ICON_MAP[iconName.toUpperCase()] || Home;
  };

  return (
    <div className="space-y-6">
      {showSpaceList && selectedHouse ? (
        <SpaceTab
          houseId={selectedHouse.id}
          houseName={selectedHouse.name}
          onBack={handleBackToHouses}
        />
      ) : (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Home className="h-5 w-5 text-blue-500" />
                <span>Danh sách nhà</span>
                <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                  {houses.length}
                </Badge>
              </CardTitle>
              {roleUserCurrent === "owner" && (
                <Button
                  onClick={handleAddHouse}
                  className="bg-blue-500 hover:bg-blue-600"
                  disabled={isAddingHouse}
                >
                  {isAddingHouse ? (
                    "Đang thêm..."
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Thêm nhà
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Tìm kiếm theo tên hoặc địa chỉ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12"
              />
            </div>
            <div className="space-y-4 max-w-1xl">
              {filteredHouses.map((house) => {
                const IconComponent = getIconComponent(house.icon_name);
                return (
                  <div
                    key={house.id}
                    className="bg-white border border-slate-200 rounded-xl p-6 flex items-center justify-between cursor-pointer hover:shadow-lg hover:border-blue-300 transition-all duration-200 group relative overflow-hidden"
                    onClick={() => handleEditHouse(house.id)}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    <div className="flex items-center space-x-6 relative z-10">
                      <div className="relative">
                        <div
                          className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-200"
                          style={{ backgroundColor: house.icon_color || COLOR_MAP.BLUE }}
                        >
                          <IconComponent
                            className={`h-7 w-7 ${house.icon_color === COLOR_MAP.WHITE ? "text-black" : "text-white"}`}
                          />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-slate-900 text-lg group-hover:text-blue-700 transition-colors">
                            {house.name}
                          </h3>
                        </div>
                        <p className="text-sm text-slate-600 mb-2 flex items-center">
                          <svg
                            className="w-4 h-4 mr-2 text-slate-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                          {house.address}
                        </p>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center text-sm text-slate-600">
                            <svg
                              className="w-4 h-4 mr-2 text-blue-500"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                              />
                            </svg>
                            <span className="font-medium text-blue-600">{house.space}</span>
                            <span className="ml-1">không gian</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    {roleUserCurrent === "owner" && (
                      <div className="flex items-center space-x-3 relative z-10">
                        <div className="flex items-center space-x-2">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-9 w-9 p-0 hover:bg-slate-100 rounded-lg transition-colors"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <MoreHorizontal className="h-5 w-5 text-slate-600" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 bg-white">
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditHouse(house.id);
                                }}
                                className="flex items-center"
                              >
                                <Edit className="h-4 w-4 mr-3" />
                                Xem không gian
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditHouseDetails(house.id);
                                }}
                                className="flex items-center"
                              >
                                <svg
                                  className="h-4 w-4 mr-3"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                  />
                                </svg>
                                Chỉnh sửa nhà
                              </DropdownMenuItem>
                              <div className="border-t my-1" />
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteHouse(house.id);
                                }}
                                className="text-red-600 focus:text-red-600 flex items-center"
                              >
                                <Trash2 className="h-4 w-4 mr-3" />
                                Xóa nhà
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
              {filteredHouses.length === 0 && (
                <div className="text-center py-12">
                  <Home className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Không tìm thấy nhà nào</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
      <AddHousePopup
        houses={houses}
        open={isAddHousePopupOpen}
        onOpenChange={setIsAddHousePopupOpen}
        onSave={handleSaveHouse}
        groupId={id}
      />
      <EditHousePopup
        open={isEditHousePopupOpen}
        onOpenChange={setIsEditHousePopupOpen}
        onSave={handleUpdateHouse}
        house={houseToEdit}
        groupId={id}
      />
    </div>
  );
}