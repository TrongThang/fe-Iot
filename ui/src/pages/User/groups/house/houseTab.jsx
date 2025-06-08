"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Home, Search, Plus, Trash2, Edit, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import DeviceList from "./space/device/deviceList"
import AddHousePopup from "./housePopups/Add-house-popup"
import SpaceTab from "./space/spaceTab"


export default function HouseTab() {
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedHouse, setSelectedHouse] = useState(null)
    const [selectedSpace, setSelectedSpace] = useState(null)
    const [showSpaceList, setShowSpaceList] = useState(false)
    const [showDeviceList, setShowDeviceList] = useState(false)
    const [isAddHousePopupOpen, setIsAddHousePopupOpen] = useState(false)

    // Mock data for houses
    const [houses, setHouses] = useState([
        { id: 1, name: "Nhà chính", address: "123 Đường ABC, Quận 1, TP.HCM", devices: 4, status: "Hoạt động" },
        { id: 2, name: "Nhà phụ", address: "456 Đường XYZ, Quận 2, TP.HCM", devices: 2, status: "Hoạt động" },
        { id: 3, name: "Văn phòng", address: "789 Đường DEF, Quận 3, TP.HCM", devices: 2, status: "Bảo trì" },
    ])

    const handleDeleteHouse = (houseId) => {
        setHouses(houses.filter((h) => h.id !== houseId))
    }

    const handleEditHouse = (houseId) => {
        const house = houses.find((h) => h.id === houseId)
        if (house) {
            setSelectedHouse(house)
            setShowSpaceList(true)
            setShowDeviceList(false)
            setSelectedSpace(null)
        }
    }

    const handleSpaceClick = (space) => {
        setSelectedSpace(space)
        setShowDeviceList(true)
    }

    const handleBackToHouses = () => {
        setShowSpaceList(false)
        setShowDeviceList(false)
        setSelectedHouse(null)
        setSelectedSpace(null)
    }

    const handleBackToSpaces = () => {
        setShowDeviceList(false)
        setSelectedSpace(null)
    }

    const handleAddHouse = () => {
        setIsAddHousePopupOpen(true)
    }

    const handleSaveHouse = (newHouse) => {
        setHouses([...houses, newHouse])
        setIsAddHousePopupOpen(false)
    }

    const filteredHouses = houses.filter(
        (house) =>
            house.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            house.address.toLowerCase().includes(searchQuery.toLowerCase()),
    )

    return (
        <div className="space-y-6">
            {showDeviceList && selectedSpace ? (
                <DeviceList
                    spaceId={selectedSpace.id}
                    spaceName={selectedSpace.name}
                    spaceType={selectedSpace.type}
                    onBack={handleBackToSpaces}
                />
            ) : showSpaceList && selectedHouse ? (
                <SpaceTab
                    houseId={selectedHouse.id}
                    houseName={selectedHouse.name}
                    onBack={handleBackToHouses}
                    onSpaceClick={handleSpaceClick}
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
                            <Button onClick={handleAddHouse} className="bg-blue-500 hover:bg-blue-600">
                                <Plus className="h-4 w-4 mr-2" />
                                Thêm nhà
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {/* Search */}
                        <div className="relative mb-6">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                                placeholder="Tìm kiếm theo tên hoặc địa chỉ..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 h-12"
                            />
                        </div>

                        {/* Houses List */}
                        <div className="space-y-4 max-w-1xl">
                            {filteredHouses.map((house) => (
                                <div
                                    key={house.id}
                                    className="bg-white border border-slate-200 rounded-xl p-6 flex items-center justify-between cursor-pointer hover:shadow-lg hover:border-blue-300 transition-all duration-200 group relative overflow-hidden"
                                    onClick={() => handleEditHouse(house.id)}
                                >
                                    {/* Background gradient accent */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

                                    <div className="flex items-center space-x-6 relative z-10">
                                        {/* House Icon with gradient background */}
                                        <div className="relative">
                                            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-200">
                                                <Home className="h-7 w-7 text-white" />
                                            </div>
                                        </div>

                                        {/* House Information */}
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
                                                    <span className="font-medium text-blue-600">{house.devices}</span>
                                                    <span className="ml-1">không gian</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right side actions */}
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
                                                            e.stopPropagation()
                                                            handleEditHouse(house.id)
                                                        }}
                                                        className="flex items-center"
                                                    >
                                                        <Edit className="h-4 w-4 mr-3" />
                                                        Xem không gian
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            alert("Chỉnh sửa thông tin nhà")
                                                        }}
                                                        className="flex items-center"
                                                    >
                                                        <svg className="h-4 w-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                                                            e.stopPropagation()
                                                            handleDeleteHouse(house.id)
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
                                </div>
                            ))}
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
            <AddHousePopup open={isAddHousePopupOpen} onOpenChange={setIsAddHousePopupOpen} onSave={handleSaveHouse} />
        </div>
    )
}