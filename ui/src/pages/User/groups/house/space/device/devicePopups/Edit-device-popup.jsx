"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Smartphone, Home, X, User } from "lucide-react"
import Swal from "sweetalert2"
import { useParams } from "react-router-dom"

export default function EditDeviceDialog({ open, onOpenChange, onEdit, device, houseId }) {
    const { id } = useParams();
    const [deviceData, setDeviceData] = useState({
        deviceName: "",
        room: "",
    })

    const [isEditing, setIsEditing] = useState(false)
    const [spaces, setSpaces] = useState([])
    const accessToken = localStorage.getItem('authToken');

    const fetchSpaces = async (currentHouseId) => {
        if (!currentHouseId || !accessToken) {
            console.warn("Không thể fetch spaces: House ID hoặc Access Token không có sẵn.");
            setSpaces([]);
            return [];
        }

        try {
            const res = await fetch(`http://localhost:7777/api/spaces/house/${currentHouseId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            if (res.ok) {
                const dataSpace = await res.json();
                setSpaces(dataSpace ? dataSpace : [])
            } else {
                console.error(`Failed to fetch spaces for house ${currentHouseId}: ${res.status} ${res.statusText}`);
                setSpaces([]);
                return [];
            }
        } catch (error) {
            console.error(`Error fetching spaces for house ${currentHouseId}:`, error);
            setSpaces([]);
            return [];
        }
    }

    const handleSubmit = async () => {
        if (!deviceData.deviceName.trim() || !deviceData.room) {
            Swal.fire({
                icon: "warning",
                title: "Thông tin chưa đầy đủ",
                text: "Vui lòng điền đầy đủ thông tin thiết bị",
                confirmButtonText: "OK",
                confirmButtonColor: "#f59e0b",
            })
            return
        }
        setIsEditing(true)
        try {
            const res = await fetch(`http://localhost:7777/api/devices/${device.device_id}/space`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                    serial_number: deviceData.serial,
                    name: deviceData.deviceName,
                    spaceId: parseInt(deviceData.room),
                    groupId: id
                })
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Failed to update device');
            }

            const data = await res.json();
            console.log("API Response:", data);

            // Sử dụng dữ liệu từ API nếu có đầy đủ, nếu không thì tạo object mới
            const updatedDevice = data && data.data ? data.data : {
                ...device, // Giữ lại tất cả dữ liệu cũ
                name: deviceData.deviceName,
                serial_number: deviceData.serial,
                space_id: parseInt(deviceData.room),
                updated_at: new Date().toISOString()
            };

            console.log("Updated device data:", updatedDevice);

            Swal.fire({
                icon: "success",
                title: "Cập nhật thành công",
                text: `Thiết bị "${deviceData.deviceName}" đã được cập nhật thành công!`,
                confirmButtonText: "OK",
                confirmButtonColor: "#10b981",
            })

            // Close dialog and notify parent with updated device data
            onOpenChange(false);
            if (onEdit) {
                onEdit(updatedDevice);
            }
        } catch (error) {
            console.error("Lỗi khi cập nhật thiết bị:", error)
            Swal.fire({
                icon: "error",
                title: "Cập nhật thất bại",
                text: error.message || "Không thể cập nhật thiết bị. Vui lòng kiểm tra lại thông tin và thử lại.",
                confirmButtonText: "OK",
                confirmButtonColor: "#ef4444",
            })
        } finally {
            setIsEditing(false)
        }
    }

    const handleCancel = () => {
        setDeviceData({
            deviceName: "",
            room: "",
        })
        onOpenChange(false)
    }

    useEffect(() => {
        if (houseId && accessToken) {
            fetchSpaces(houseId);
        } else {
            setSpaces([]);
        }
    }, [houseId, accessToken]);

    useEffect(() => {
        if (device) {
            setDeviceData({
                serial: device.serial_number,
                deviceName: device.name || "",
                room: device.space_id || "",
            })
        }
    }, [device]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] p-0 rounded-2xl shadow-2xl">
                {/* Header */}
                <DialogHeader className="px-6 pt-6 pb-2 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                        <DialogTitle className="text-xl font-semibold text-gray-900">Chỉnh sửa thiết bị</DialogTitle>
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
                <div className="px-6 py-6 space-y-6 bg-gray-50">
                    {/* Device ID */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">ID Thiết bị</label>
                        <div className="relative">
                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                                <User className="h-5 w-5 text-gray-400" />
                            </div>
                            <Input
                                placeholder="Nhập ID thiết bị..."
                                value={deviceData.serial}
                                disabled
                                onChange={(e) => setDeviceData((prev) => ({ ...prev, deviceId: e.target.value }))}
                                className="pl-11 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl bg-white"
                            />
                        </div>
                    </div>

                    {/* Device Name */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Tên thiết bị</label>
                        <div className="relative">
                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                                <Smartphone className="h-5 w-5 text-gray-400" />
                            </div>
                            <Input
                                placeholder="Nhập tên thiết bị..."
                                value={deviceData.deviceName}
                                onChange={(e) => setDeviceData((prev) => ({ ...prev, deviceName: e.target.value }))}
                                className="pl-11 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl bg-white"
                            />
                        </div>
                    </div>

                    {/* Room Selection */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Chọn phòng</label>
                        <div className="relative">
                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
                                <Home className="h-5 w-5 text-gray-400" />
                            </div>
                            <Select
                                value={deviceData.room}
                                onValueChange={(value) => setDeviceData((prev) => ({ ...prev, room: value }))}
                            >
                                <SelectTrigger className="pl-11 h-12 w-full border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl bg-white">
                                    <SelectValue placeholder="Chọn phòng..." />
                                </SelectTrigger>
                                <SelectContent className="bg-white">
                                    {spaces.map((space) => (
                                        <SelectItem key={space.space_id} value={space.space_id}>
                                            {space.space_name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3 pt-4">
                        {/* Update Button */}
                        <Button
                            onClick={handleSubmit}
                            disabled={
                                isEditing || !deviceData.deviceName.trim() || !deviceData.room
                            }
                            className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isEditing ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    <span>Đang cập nhật...</span>
                                </>
                            ) : (
                                <>
                                    <span>Cập nhật</span>
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
