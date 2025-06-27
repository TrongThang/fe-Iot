"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Smartphone, Home, QrCode, Link, X, User } from "lucide-react"
import Swal from "sweetalert2"
import QRScannerDialog from "./QR-scanner"
import { useParams } from "react-router-dom"

export default function DeviceConnectionDialog({ open, onOpenChange, onConnect, houseId, spaceId }) {
    const { id } = useParams();
    const [deviceData, setDeviceData] = useState({
        deviceId: "",
        deviceName: "",
        room: spaceId || "", // Initialize with spaceId if provided
    })
    const [isConnecting, setIsConnecting] = useState(false)
    const [isQRScannerOpen, setIsQRScannerOpen] = useState(false)
    const [spaces, setSpaces] = useState([])
    const [spaceName, setSpaceName] = useState("") // State for space name
    const accessToken = localStorage.getItem('authToken');

    // Fetch all spaces for a house (used when spaceId is undefined)
    const fetchSpaces = async (currentHouseId) => {
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

    // Fetch specific space details for spaceId (used when spaceId is defined)
    const fetchSpace = async (spaceId) => {
        try {
            const res = await fetch(`http://localhost:7777/api/spaces/${spaceId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            if (res.ok) {
                const dataSpace = await res.json();
                setSpaceName(dataSpace?.space_name || "Unknown Space");
            } else {
                console.error(`Failed to fetch space ${spaceId}: ${res.status} ${res.statusText}`);
                setSpaceName("Unknown Space");
            }
        } catch (error) {
            console.error(`Error fetching space ${spaceId}:`, error);
            setSpaceName("Unknown Space");
        }
    }

    const handleSubmit = async () => {
        if (!deviceData.deviceId.trim() || !deviceData.deviceName.trim() || !deviceData.room) {
            Swal.fire({
                icon: "warning",
                title: "Thông tin chưa đầy đủ",
                text: "Vui lòng điền đầy đủ thông tin thiết bị",
                confirmButtonText: "OK",
                confirmButtonColor: "#f59e0b",
            })
            return
        }

        setIsConnecting(true)

        try {
            const res = await fetch("http://localhost:7777/api/devices/link", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                    serial_number: deviceData.deviceId,
                    name: deviceData.deviceName,
                    spaceId: parseInt(deviceData.room),
                    groupId: id
                })
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Failed to link device');
            }

            const data = await res.json();

            Swal.fire({
                icon: "success",
                title: "Kết nối thành công",
                text: `Thiết bị "${deviceData.deviceName}" đã được kết nối thành công!`,
                confirmButtonText: "OK",
                confirmButtonColor: "#10b981",
            })

            // Reset form
            setDeviceData({
                deviceId: "",
                deviceName: "",
                room: spaceId || "",
            })

            // Close dialog and notify parent
            onOpenChange(false);
            if (onConnect) {
                onConnect(data);
            }
        } catch (error) {
            console.error("Lỗi khi kết nối thiết bị:", error)
            Swal.fire({
                icon: "error",
                title: "Kết nối thất bại",
                text: error.message || "Không thể kết nối thiết bị. Vui lòng kiểm tra lại thông tin và thử lại.",
                confirmButtonText: "OK",
                confirmButtonColor: "#ef4444",
            })
        } finally {
            setIsConnecting(false)
        }
    }

    const handleScanQR = () => {
        setIsQRScannerOpen(true);
    }

    const handleQRScanResult = (scannedData) => {
        setDeviceData(prev => ({
            ...prev,
            deviceId: scannedData
        }));
        setIsQRScannerOpen(false);
    }

    const handleCancel = () => {
        setDeviceData({
            deviceId: "",
            deviceName: "",
            room: spaceId || "",
        })
        onOpenChange(false)
    }

    useEffect(() => {
        if (spaceId && accessToken) {
            fetchSpace(spaceId); // Fetch space name for spaceId
            setDeviceData(prev => ({ ...prev, room: spaceId })); // Set room to spaceId
        } else if (houseId && accessToken) {
            fetchSpaces(houseId); // Fetch all spaces if no spaceId
        } else {
            setSpaces([]);
            setSpaceName("");
        }
    }, [houseId, spaceId, accessToken]);

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-[600px] p-0 rounded-2xl shadow-2xl">
                    {/* Header */}
                    <DialogHeader className="px-6 pt-6 pb-2 border-b border-gray-100">
                        <div className="flex items-center justify-between">
                            <DialogTitle className="text-xl font-semibold text-gray-900">Liên kết thiết bị</DialogTitle>
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
                                    value={deviceData.deviceId}
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
                            <label className="text-sm font-medium text-gray-700">Phòng</label>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
                                    <Home className="h-5 w-5 text-gray-400" />
                                </div>
                                {spaceId ? (
                                    <Select
                                        value={deviceData.room}
                                        disabled
                                    >
                                        <SelectTrigger className="pl-11 h-12 w-full border-gray-200 bg-gray-100 text-gray-700 rounded-xl cursor-not-allowed">
                                            <SelectValue>{spaceName || "Loading..."}</SelectValue>
                                        </SelectTrigger>
                                    </Select>
                                ) : (
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
                                )}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-3 pt-4">
                            {/* QR Code Button */}
                            <Button
                                onClick={handleScanQR}
                                className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center space-x-2"
                            >
                                <QrCode className="h-5 w-5" />
                                <span>Quét mã QR</span>
                            </Button>

                            {/* Connect Button */}
                            <Button
                                onClick={handleSubmit}
                                disabled={
                                    isConnecting || !deviceData.deviceId.trim() || !deviceData.deviceName.trim() || !deviceData.room
                                }
                                className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isConnecting ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        <span>Đang kết nối...</span>
                                    </>
                                ) : (
                                    <>
                                        <Link className="h-5 w-5" />
                                        <span>Liên kết</span>
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* QR Scanner Dialog */}
            <QRScannerDialog
                open={isQRScannerOpen}
                onOpenChange={setIsQRScannerOpen}
                onScanResult={handleQRScanResult}
            />
        </>
    )
}