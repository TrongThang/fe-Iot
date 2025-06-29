"use client"

import { useState, useEffect } from "react"
import {
	ChevronLeft,
	Edit,
	Trash2,
	ChevronDown,
	Flame,
	Search,
	Plus,
	MoreHorizontal,
	Home,
	Lightbulb,
	Thermometer,
	Smartphone,
	Loader2,
	Camera,
	Wifi,
	WifiOff,
	ArrowUpRight,
	Power,
	Settings,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import CameraControl from "./cameraControl"
import { Card, CardContent } from "@/components/ui/card"
import DeviceGrid from "./deviceGrid"
import { LightDetail, SmokeDetectorDetail, TemperatureDetail } from "./deviceDetail"
import axiosPublic from "@/apis/clients/public.client"

export default function DeviceManagement({
	spaceId = "1",
	spaceName = "Phòng khách",
	spaceType = "living_room",
	onBack = () => { },
}) {
	const [selectedDevice, setSelectedDevice] = useState(null)
	const [searchQuery, setSearchQuery] = useState("")
	const [isLoading, setIsLoading] = useState(true)
	const [filterOptions, setFilterOptions] = useState({
		group: 0,
		house: 0,
		status: "all",
	})

	const [devices, setDevices] = useState([])

	const fetchDevice = async () => {
		const response = await axiosPublic.get("devices/space/4")
		console.log("response:", response)
		if (response.status_code === 200) {
			setDevices(response.data)
		}
	}

	useEffect(() => {
		fetchDevice()
	}, [])

	// const [devices, setDevices] = useState([
	// 	{
	// 		id: 1,
	// 		name: "Camera cổng chính",
	// 		room: spaceName,
	// 		type: "camera",
	// 		power_status: true,
	// 		status: "active",
	// 		group: 1,
	// 		group_name: "Nhóm 1",
	// 		house: 1,
	// 		house_name: "Nhà 1",
	// 		ownership: "mine",
	// 		owner: "Tôi"
	// 	},
	// 	{ id: 2, name: "Camera sảnh lớn", room: spaceName, type: "camera", power_status: true, resolution: "4K", lastActivity: "Đang hoạt động", status: "active", group: 1, group_name: "Nhóm 1", house: 1, house_name: "Nhà 1", ownership: "shared", owner: "Nguyễn Văn A" },
	// 	{ id: 3, name: "Camera hành lang", room: spaceName, type: "camera", power_status: false, resolution: "720p", lastActivity: "15 phút trước", status: "inactive", group: 2, group_name: "Nhóm 2", house: 1, house_name: "Nhà 1", ownership: "mine", owner: "Tôi" },
	// 	{ id: 4, name: "Máy báo khói", room: spaceName, type: "smoke", power_status: true, ppm: 1024, temp: 34, battery: 85, lastActivity: "2 phút trước", status: "active", group: 1, group_name: "Nhóm 1", house: 1, house_name: "Nhà 1", ownership: "mine", owner: "Tôi" },
	// 	{ id: 5, name: "Máy báo khói phụ", room: spaceName, type: "smoke", power_status: false, ppm: 980, temp: 32, battery: 65, lastActivity: "15 phút trước", status: "inactive", group: 1, group_name: "Nhóm 1", house: 1, house_name: "Nhà 1", ownership: "shared", owner: "Trần Thị B" },
	// 	{ id: 6, name: "Đèn bàn", room: spaceName, type: "light", power_status: true, brightness: 50, color: "red", lastActivity: "5 phút trước", status: "active", group: 1, group_name: "Nhóm 1", house: 1, house_name: "Nhà 1", ownership: "mine", owner: "Tôi" },
	// 	{ id: 7, name: "Đèn trần", room: spaceName, type: "light", power_status: true, brightness: 80, color: "white", lastActivity: "1 phút trước", status: "active", group: 2, group_name: "Nhóm 2", house: 1, house_name: "Nhà 1", ownership: "shared", owner: "Lê Văn C" },
	// 	{ id: 8, name: "Cảm biến nhiệt độ", room: spaceName, type: "temperature", power_status: true, temp: 28, humidity: 65, lastActivity: "3 phút trước", status: "active", group: 2, group_name: "Nhóm 2", house: 1, house_name: "Nhà 1", ownership: "mine", owner: "Tôi" },
	// ])

	useEffect(() => {
		const timer = setTimeout(() => {
			setIsLoading(false)
		}, 1000)
		return () => clearTimeout(timer)
	}, [])

	const handleDeviceClick = (device) => {
		setSelectedDevice(device)
	}

	const handleBackClick = () => {
		if (selectedDevice) {
			setSelectedDevice(null)
		} else {
			onBack()
		}
	}

	const handleToggle = (e, deviceId) => {
		setDevices(
			devices.map((device) =>
				device.id === deviceId
					? { ...device, power_status: !device.power_status, status: !device.power_status ? "active" : "inactive" }
					: device,
			),
		)
	}

	const handleAddDevice = () => {
		alert("Thêm thiết bị mới")
	}

	const handleDeleteDevice = (deviceId) => {
		setDevices(devices.filter((device) => device.id !== deviceId))
		if (selectedDevice?.id === deviceId) {
			setSelectedDevice(null)
		}
	}

	const handleEditDevice = (deviceId) => {
		alert(`Chỉnh sửa thiết bị ID: ${deviceId}`)
	}

	const getDeviceIcon = (type) => {
		const iconProps = { className: "h-5 w-5" }
		switch (type) {
			case "camera":
				return <Camera {...iconProps} />
			case "light":
				return <Lightbulb {...iconProps} />
			case "smoke":
				return <Flame {...iconProps} />
			case "temperature":
				return <Thermometer {...iconProps} />
			default:
				return <Smartphone {...iconProps} />
		}
	}

	const getDeviceColor = (type) => {
		switch (type) {
			case "camera":
				return "from-blue-500 to-blue-600"
			case "light":
				return "from-amber-500 to-amber-600"
			case "smoke":
				return "from-red-500 to-red-600"
			case "temperature":
				return "from-blue-500 to-blue-600"
			default:
				return "from-slate-500 to-slate-600"
		}
	}

	const getDeviceStatusColor = (status, power_status) => {
		if (!power_status) return "bg-gray-200 text-gray-700"
		switch (status) {
			case "active":
				return "bg-green-100 text-green-700 border-green-200"
			case "warning":
				return "bg-yellow-100 text-yellow-700 border-yellow-200"
			case "error":
				return "bg-red-100 text-red-700 border-red-200"
			default:
				return "bg-gray-100 text-gray-700 border-gray-200"
		}
	}

	const getSpaceIcon = (type) => {
		const iconProps = { className: "h-5 w-5" }
		switch (type) {
			case "living_room":
				return <Home {...iconProps} />
			default:
				return <Home {...iconProps} />
		}
	}

	const filteredDevices = devices.filter((device) => {
		const matchesSearch = device.name.toLowerCase().includes(searchQuery.toLowerCase())
		const matchesGroup = filterOptions.group === 0 || device.group === filterOptions.group
		const matchesHouse = filterOptions.house === 0 || device.house === filterOptions.house
		const matchesStatus =
			filterOptions.status === "all" ||
			(filterOptions.status === "active" && device.power_status) ||
			(filterOptions.status === "inactive" && !device.power_status)

		return matchesSearch && matchesGroup && matchesHouse && matchesStatus
	})

	const devicesByOwnership = filteredDevices.reduce((acc, device) => {
		if (!acc[device.ownership]) {
			acc[device.ownership] = []
		}
		acc[device.ownership].push(device)
		return acc
	}, {})

	const myDevices = devicesByOwnership.mine || []
	const sharedDevices = devicesByOwnership.shared || []

	const activeDevices = devices.filter((device) => device.power_status).length

	if (selectedDevice && selectedDevice.type === "camera") {
		return (
			<CameraControl
				camera={selectedDevice}
				onBack={() => setSelectedDevice(null)}
				onUpdateCamera={(updatedCamera) => {
					setDevices(devices.map((d) => (d.id === updatedCamera.id ? { ...d, ...updatedCamera } : d)))
					setSelectedDevice(updatedCamera)
				}}
			/>
		)
	}

	return (
		<div className="min-h-screen bg-slate-50">
			<div className="max-w-7xl mx-auto">
				<header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
					<div className="px-4 py-4 flex justify-between items-center">
						<div className="flex items-center space-x-4">
							<Button variant="ghost" size="icon" onClick={handleBackClick} className="rounded-full hover:bg-slate-100">
								<ChevronLeft className="h-5 w-5" />
							</Button>

							<div className="flex items-center space-x-3">
								<div
									className={`w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md`}
								>
									{getSpaceIcon(spaceType)}
								</div>
								<div>
									<h1
										className={cn(
											"font-semibold text-slate-900",
											selectedDevice && selectedDevice.type !== "camera" ? "text-lg md:text-xl" : "text-xl",
										)}
									>
										{spaceName}
										<span
											className={cn(
												"ml-2 text-sm font-normal text-slate-500",
												selectedDevice && selectedDevice.type !== "camera" && "hidden md:inline",
											)}
										>
											{devices.length} thiết bị
										</span>
									</h1>
									<div
										className={cn(
											"flex items-center space-x-2",
											selectedDevice && selectedDevice.type !== "camera" && "hidden md:flex",
										)}
									>
										<Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
											{activeDevices} đang hoạt động
										</Badge>
									</div>
								</div>
							</div>
						</div>

						<div className="flex items-center space-x-2">
							<Button onClick={handleAddDevice} className="bg-blue-600 hover:bg-blue-700 text-white">
								<Plus className="h-4 w-4 mr-2" />
								<span>Thêm thiết bị</span>
							</Button>
						</div>
					</div>
				</header>

				<div className="flex flex-col md:flex-row">
					<div
						className={cn(
							"bg-white transition-all duration-300 ease-in-out",
							selectedDevice && selectedDevice.type !== "camera"
								? "w-full md:w-1/2 lg:w-2/5 border-r border-slate-200"
								: "w-full",
						)}
					>
						<div className="p-4">
							<div className="mb-6 space-y-4">
								<div className="relative">
									<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
									<Input
										placeholder="Tìm kiếm thiết bị..."
										value={searchQuery}
										onChange={(e) => setSearchQuery(e.target.value)}
										className="pl-10 h-11 border-slate-200"
									/>
								</div>

								<div
									className={cn(
										"flex flex-wrap gap-2",
										selectedDevice && selectedDevice.type !== "camera" && "hidden md:flex",
									)}
								>
									<div className="relative flex-1 min-w-[150px]">
										<select
											className="w-full h-10 pl-3 pr-10 text-sm border border-slate-200 rounded-md appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
											value={filterOptions.group}
											onChange={(e) => setFilterOptions({ ...filterOptions, group: Number(e.target.value) })}
										>
											<option value={0}>Tất cả nhóm</option>
											<option value={1}>Nhóm 1</option>
											<option value={2}>Nhóm 2</option>
										</select>
										<ChevronDown
											className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none"
											size={16}
										/>
									</div>

									<div className="relative flex-1 min-w-[150px]">
										<select
											className="w-full h-10 pl-3 pr-10 text-sm border border-slate-200 rounded-md appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
											value={filterOptions.house}
											onChange={(e) => setFilterOptions({ ...filterOptions, house: Number(e.target.value) })}
										>
											<option value={0}>Tất cả nhà</option>
											<option value={1}>Nhà 1</option>
											<option value={2}>Nhà 2</option>
										</select>
										<ChevronDown
											className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none"
											size={16}
										/>
									</div>

									<div className="relative flex-1 min-w-[150px]">
										<select
											className="w-full h-10 pl-3 pr-10 text-sm border border-slate-200 rounded-md appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
											value={filterOptions.status}
											onChange={(e) => setFilterOptions({ ...filterOptions, status: e.target.value })}
										>
											<option value="all">Tất cả trạng thái</option>
											<option value="active">Đang hoạt động</option>
											<option value="inactive">Đã tắt</option>
										</select>
										<ChevronDown
											className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none"
											size={16}
										/>
									</div>
								</div>
							</div>

							<div className={cn("mb-6", selectedDevice && selectedDevice.type !== "camera" && "hidden lg:block")}>
								<Tabs defaultValue="all" className="mb-6">
									<TabsList className="bg-slate-100">
										<TabsTrigger value="all" className="bg-gray-100 hover:bg-white data-[state=active]:bg-blue-500 data-[state=active]:text-white transition-colors">
											Tất cả ({filteredDevices.length})
										</TabsTrigger>
										<TabsTrigger value="mine" className="bg-gray-100 hover:bg-white data-[state=active]:bg-blue-500 data-[state=active]:text-white transition-colors">
											Của tôi ({myDevices.length})
										</TabsTrigger>
										<TabsTrigger value="shared" className="bg-gray-100 hover:bg-white data-[state=active]:bg-blue-500 data-[state=active]:text-white transition-colors">
											Được chia sẻ ({sharedDevices.length})
										</TabsTrigger>
									</TabsList>

									<TabsContent value="all" className="mt-4">
										<DeviceGrid
											devices={filteredDevices}
											isLoading={isLoading}
											selectedDevice={selectedDevice}
											onDeviceClick={handleDeviceClick}
											onToggle={handleToggle}
											onEdit={handleEditDevice}
											onDelete={handleDeleteDevice}
											getDeviceIcon={getDeviceIcon}
											getDeviceColor={getDeviceColor}
											getDeviceStatusColor={getDeviceStatusColor}
											isCompact={selectedDevice && selectedDevice.type !== "camera"}
										/>
									</TabsContent>

									<TabsContent value="mine" className="mt-4">
										<DeviceGrid
											devices={myDevices}
											isLoading={isLoading}
											selectedDevice={selectedDevice}
											onDeviceClick={handleDeviceClick}
											onToggle={handleToggle}
											onEdit={handleEditDevice}
											onDelete={handleDeleteDevice}
											getDeviceIcon={getDeviceIcon}
											getDeviceColor={getDeviceColor}
											getDeviceStatusColor={getDeviceStatusColor}
											isCompact={selectedDevice && selectedDevice.type !== "camera"}
										/>
									</TabsContent>

									<TabsContent value="shared" className="mt-4">
										<DeviceGrid
											devices={sharedDevices}
											isLoading={isLoading}
											selectedDevice={selectedDevice}
											onDeviceClick={handleDeviceClick}
											onToggle={handleToggle}
											onEdit={handleEditDevice}
											onDelete={handleDeleteDevice}
											getDeviceIcon={getDeviceIcon}
											getDeviceColor={getDeviceColor}
											getDeviceStatusColor={getDeviceStatusColor}
											isCompact={selectedDevice && selectedDevice.type !== "camera"}
										/>
									</TabsContent>
								</Tabs>
							</div>
						</div>
					</div>

					{selectedDevice && selectedDevice.type !== "camera" && (
						<div className="bg-white w-full md:w-1/2 lg:w-3/5 min-h-screen md:min-h-0">
							<div className="sticky top-[73px] h-[calc(100vh-73px)] overflow-hidden">
								<ScrollArea className="h-full">
									<div className="p-6">
										<div className="flex items-center justify-between mb-6">
											<div className="flex items-center space-x-4">
												<div
													className={`w-12 h-12 bg-gradient-to-br ${getDeviceColor(selectedDevice.type)} rounded-xl flex items-center justify-center shadow-lg`}
												>
													{getDeviceIcon(selectedDevice.type)}
												</div>
												<div>
													<h2 className="text-2xl font-bold text-slate-900">{selectedDevice.name}</h2>
													<p className="text-slate-500">{selectedDevice.room}</p>
												</div>
											</div>

											<div className="flex items-center space-x-3">
												<Switch
													checked={selectedDevice.power_status}
													onCheckedChange={(checked) => {
														setDevices(
															devices.map((device) =>
																device.id === selectedDevice.id
																	? { ...device, power_status: checked, status: checked ? "active" : "inactive" }
																	: device,
															),
														)
														setSelectedDevice({ ...selectedDevice, power_status: checked })
													}}
													className="data-[state=checked]:bg-green-500"
												/>
												<DropdownMenu>
													<DropdownMenuTrigger asChild>
														<Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-100">
															<MoreHorizontal className="h-5 w-5" />
														</Button>
													</DropdownMenuTrigger>
													<DropdownMenuContent align="end">
														<DropdownMenuItem onClick={() => handleEditDevice(selectedDevice.id)}>
															<Edit className="h-4 w-4 mr-2" />
															Chỉnh sửa
														</DropdownMenuItem>
														<DropdownMenuItem
															onClick={() => handleDeleteDevice(selectedDevice.id)}
															className="text-red-600"
														>
															<Trash2 className="h-4 w-4 mr-2" />
															Xóa thiết bị
														</DropdownMenuItem>
													</DropdownMenuContent>
												</DropdownMenu>
											</div>
										</div>

										<Separator className="mb-6" />

										{selectedDevice.type === "light" && <LightDetail device={selectedDevice} />}
										{selectedDevice.type === "smoke" && <SmokeDetectorDetail device={selectedDevice} />}
										{selectedDevice.type === "temperature" && <TemperatureDetail device={selectedDevice} />}

										<Card className="mt-6">
											<CardContent className="p-6">
												<h3 className="text-lg font-semibold mb-4">Thông tin thiết bị</h3>
												<div className="space-y-4">
													<div className="flex justify-between items-center">
														<span className="text-slate-600">ID thiết bị</span>
														<span className="font-medium">{selectedDevice.id}</span>
													</div>
													<div className="flex justify-between items-center">
														<span className="text-slate-600">Chủ sở hữu</span>
														<div className="flex items-center gap-2">
															<span className="font-medium">{selectedDevice.owner}</span>
															{selectedDevice.ownership === "shared" && (
																<Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
																	Được chia sẻ
																</Badge>
															)}
														</div>
													</div>
												</div>
											</CardContent>
										</Card>
									</div>
								</ScrollArea>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}