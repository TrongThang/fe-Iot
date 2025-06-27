"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    Search, User, Mail, Phone, Trash2, Eye, RefreshCw, Calendar, Shield, Users, Lightbulb, Fan, Thermometer,
    Power, Wifi, Lock, Unlock, CheckCircle, XCircle,
} from "lucide-react"
import { toast } from "sonner"
import axiosPublic from '../../../apis/clients/public.client'
import DeviceDetailsModal from '@/components/common/CustomerSearch/DeviceDetailsModal'

export default function SearchCustomerDevices() {
    const [searchFilters, setSearchFilters] = useState({
        email: "",
        phone: "",
        username: ""
    })
    const [selectedCustomer, setSelectedCustomer] = useState(null)
    const [customerDevices, setCustomerDevices] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)

    // Modal states
    const [selectedDevice, setSelectedDevice] = useState(null)
    const [isDeviceModalOpen, setIsDeviceModalOpen] = useState(false)
    const [isActionLoading, setIsActionLoading] = useState(false)

    const handleSearch = async () => {
        setIsLoading(true)
        setError(null)

        try {
            // Kiểm tra xem có ít nhất một điều kiện tìm kiếm không
            const hasSearchCriteria = Object.values(searchFilters).some(value => value.trim() !== '');

            if (!hasSearchCriteria) {
                setError('Vui lòng nhập ít nhất một điều kiện tìm kiếm');
                setSelectedCustomer(null);
                setCustomerDevices([]);
                setIsLoading(false);
                return;
            }

            // Tạo query params từ searchFilters
            const params = new URLSearchParams()

            // Thêm các tham số tìm kiếm khách hàng
            if (searchFilters.email) params.append('email', searchFilters.email)
            if (searchFilters.phone) params.append('phone', searchFilters.phone)
            if (searchFilters.username) params.append('username', searchFilters.username)

            const response = await axiosPublic.get(`customer-search?${params.toString()}`)

            if (response.success && response.data?.customer) {
                // Format lại dữ liệu khách hàng để phù hợp với giao diện hiện tại
                const customerData = {
                    customer_id: response.data.customer.customer_id,
                    surname: response.data.customer.full_name.split(' ')[0],
                    lastname: response.data.customer.full_name.split(' ').slice(1).join(' '),
                    image: response.data.customer.avatar || "/placeholder.svg?height=64&width=64",
                    phone: response.data.customer.phone,
                    email: response.data.customer.email,
                    email_verified: response.data.customer.email_verified,
                    birthdate: response.data.customer.birthdate,
                    gender: response.data.customer.gender === true,
                    created_at: response.data.customer.created_at,
                    updated_at: response.data.customer.updated_at,
                    deleted_at: response.data.customer.is_deleted ? response.data.customer.updated_at : null,
                    account: {
                        account_id: response.data.account.account_id,
                        username: response.data.account.username,
                        role_id: 2,
                        status: 1,
                        created_at: response.data.account.created_at
                    }
                }

                setSelectedCustomer(customerData)

                // Format lại dữ liệu thiết bị
                const formattedDevices = response.data.devices.map(device => {
                    // Tìm space tương ứng với device
                    const space = response.data.spaces.find(s => s.space_id === device.space_id)
                    const house = space ? response.data.houses.find(h => h.house_id === space.house_id) : null

                    return {
                        device_id: device.device_id,
                        serial_number: device.serial_number,
                        template_id: device.template_id,
                        space_id: device.space_id,
                        account_id: device.account_id,
                        hub_id: device.hub_id,
                        firmware_id: device.firmware_id,
                        name: device.name,
                        power_status: device.power_status,
                        attribute: device.attribute,
                        wifi_ssid: device.wifi_ssid,
                        wifi_password: device.wifi_password,
                        current_value: parseInt(device.current_value),
                        link_status: device.link_status === "linked" ? "linked" : "unlinked",
                        last_reset_at: device.last_reset_at,
                        lock_status: device.lock_status ,
                        created_at: device.created_at,
                        updated_at: device.updated_at,
                        is_deleted: device.is_deleted,
                        space: {
                            space_id: space?.space_id || "unknown",
                            name: space?.space_name || "Unknown Space",
                            house: {
                                house_id: house?.house_id || "unknown",
                                name: house?.house_name || "Unknown House",
                                address: house?.address || "Unknown Address"
                            }
                        }
                    }
                })

                setCustomerDevices(formattedDevices)
            } else {
                setSelectedCustomer(null)
                setCustomerDevices([])
                setError('Không tìm thấy dữ liệu khách hàng')
            }
        } catch (err) {
            console.error('Error fetching data:', err)
            setError(err.message)
            setSelectedCustomer(null)
            setCustomerDevices([])
        } finally {
            setIsLoading(false)
        }
    }

    const handleReset = () => {
        setSearchFilters({
            email: "",
            phone: "",
            username: ""
        })
        setSelectedCustomer(null)
        setCustomerDevices([])
        setError(null)
    }

    const handleViewDeviceDetails = (device) => {
        setSelectedDevice(device)
        setIsDeviceModalOpen(true)
    }

    const handleDeviceAction = async (action, device) => {
        setIsActionLoading(true)
        try {
            let response
            const { device_id, serial_number } = device

            switch (action) {
                case 'lock':
                    response = await axiosPublic.put(`customer-search/devices/${device_id}/${serial_number}/lock`)
                    break
                case 'unlock':
                    response = await axiosPublic.put(`customer-search/devices/${device_id}/${serial_number}/unlock`)
                    break
                case 'delete':
                    response = await axiosPublic.delete(`customer-search/devices/${device_id}/${serial_number}`)
                    break
                default:
                    throw new Error('Invalid action')
            }

            if (response.success) {
                // Update device list
                const updatedDevices = customerDevices.map(d => {
                    if (d.device_id === device_id && d.serial_number === serial_number) {
                        if (action === 'lock') {
                            return { ...d, lock_status: 'locked', locked_at: new Date().toISOString() }
                        } else if (action === 'unlock') {
                            return { ...d, lock_status: 'unlocked', locked_at: null }
                        } else if (action === 'delete') {
                            return { ...d, is_deleted: true }
                        }
                    }
                    return d
                })
                setCustomerDevices(updatedDevices)

                // Update selected device if it's the same
                if (selectedDevice && selectedDevice.device_id === device_id) {
                    const updatedDevice = updatedDevices.find(d => d.device_id === device_id)
                    if (updatedDevice) {
                        setSelectedDevice(updatedDevice)
                    }
                }

                // Show success message
                const actionText = action === 'lock' ? 'khóa' : action === 'unlock' ? 'mở khóa' : 'xóa'
                toast.success(`Thiết bị đã được ${actionText} thành công!`, {
                    description: `${device.name} (${device.serial_number})`,
                    duration: 3000,
                })

                // Close modal if device was deleted
                if (action === 'delete') {
                    setIsDeviceModalOpen(false)
                    setSelectedDevice(null)
                }
            }
        } catch (error) {
            console.error('Error performing device action:', error)
            const errorMessage = error.response?.data?.error?.message || error.message
            toast.error(`Lỗi: ${errorMessage}`, {
                description: "Vui lòng thử lại sau",
                duration: 5000,
            })
        } finally {
            setIsActionLoading(false)
        }
    }

    const getDeviceIcon = (templateId) => {
        if (templateId === '1') return <Lightbulb className="h-5 w-5" />
        if (templateId === '2') return <Fan className="h-5 w-5" />
        if (templateId === '3') return <Thermometer className="h-5 w-5" />
        return <Power className="h-5 w-5" />
    }

    const getDeviceStatusIcon = (device) => {
        if (device.lock_status === 'locked') {
            return <Lock className="h-4 w-4 text-red-500" />
        }
        if (device.link_status === 'linked') {
            return <CheckCircle className="h-4 w-4 text-green-500" />
        }
        return <XCircle className="h-4 w-4 text-gray-400" />
    }

    const getDeviceStatusText = (device) => {
        if (device.lock_status === 'locked') return 'Đã khóa'
        if (device.link_status === 'linked') return 'Đang kết nối'
        return 'Mất kết nối'
    }

    const getDeviceStatusColor = (device) => {
        if (device.lock_status === 'locked') return 'destructive'
        if (device.link_status === 'linked') return 'success'
        return 'secondary'
    }

    // Sửa lại hàm hiển thị trạng thái nguồn
    const getPowerStatusText = (powerStatus) => {
        return powerStatus === true ? "Bật" : "Tắt"
    }

    const getPowerStatusColor = (powerStatus) => {
        return powerStatus === true ? "success" : "secondary"
    }

    // Sửa lại hàm hiển thị trạng thái kết nối
    const getLinkStatusText = (linkStatus) => {
        return linkStatus === 'linked' ? "Đang kết nối" : "Mất kết nối"
    }

    const getLinkStatusColor = (linkStatus) => {
        return linkStatus === 'linked' ? "success" : "secondary"
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
            <div className="max-w-7xl mx-auto p-6">
                {/* Search Section */}
                <div className="mb-8">
                    <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg shadow-black/5">
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold text-slate-900">Tra cứu thiết bị của khách hàng</CardTitle>
                            <CardDescription className="text-slate-600">
                                Tìm kiếm và quản lý các thiết bị của khách hàng
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {/* Search Filters */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Email</label>
                                        <div className="relative group">
                                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4 group-hover:text-blue-500 transition-colors" />
                                            <Input
                                                placeholder="Nhập email..."
                                                value={searchFilters.email}
                                                onChange={(e) => setSearchFilters({ ...searchFilters, email: e.target.value })}
                                                className="pl-10 border-slate-200 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Số điện thoại</label>
                                        <div className="relative group">
                                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4 group-hover:text-blue-500 transition-colors" />
                                            <Input
                                                placeholder="Nhập số điện thoại..."
                                                value={searchFilters.phone}
                                                onChange={(e) => setSearchFilters({ ...searchFilters, phone: e.target.value })}
                                                className="pl-10 border-slate-200 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Username</label>
                                        <div className="relative group">
                                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4 group-hover:text-blue-500 transition-colors" />
                                            <Input
                                                placeholder="Nhập username..."
                                                value={searchFilters.username}
                                                onChange={(e) => setSearchFilters({ ...searchFilters, username: e.target.value })}
                                                className="pl-10 border-slate-200 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Error Message */}
                                {error && (
                                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm flex items-center">
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {error}
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="flex justify-end gap-4 mt-6">
                                    <Button
                                        onClick={handleReset}
                                        variant="outline"
                                        className="px-6 border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all duration-200"
                                        disabled={isLoading}
                                    >
                                        <RefreshCw className="h-4 w-4 mr-2" />
                                        Đặt lại
                                    </Button>
                                    <Button
                                        onClick={handleSearch}
                                        className="px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <>
                                                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                                Đang tải...
                                            </>
                                        ) : (
                                            <>
                                                <Search className="h-4 w-4 mr-2" />
                                                Tìm kiếm
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Customer Information */}
                {selectedCustomer && (
                    <Card className="mb-8 bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg shadow-black/5">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-xl font-semibold text-slate-900">Thông tin khách hàng</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col gap-6">
                                {/* Avatar và thông tin cơ bản */}
                                <div className="flex items-center gap-6 p-4 bg-slate-50/50 rounded-xl">
                                    <Avatar className="h-20 w-20 border-2 border-white shadow-lg">
                                        <AvatarImage src={selectedCustomer.image} />
                                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-500 text-white text-xl">
                                            {selectedCustomer.surname.charAt(0)}{selectedCustomer.lastname.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-lg font-semibold text-slate-900 truncate">
                                            {selectedCustomer.surname} {selectedCustomer.lastname}
                                        </h3>
                                        <p className="text-sm text-slate-500 mt-1">ID: {selectedCustomer.customer_id}</p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <Badge variant={selectedCustomer.email_verified ? "success" : "secondary"} className="text-xs">
                                                {selectedCustomer.email_verified ? "Đã xác thực" : "Chưa xác thực"}
                                            </Badge>
                                            <Badge variant="outline" className="text-xs">
                                                {selectedCustomer.gender ? "Nam" : "Nữ"}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>

                                {/* Thông tin chi tiết */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50/50 hover:bg-slate-100/50 transition-colors">
                                        <div className="p-2.5 rounded-lg bg-blue-50">
                                            <User className="h-5 w-5 text-blue-600" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-slate-500">Username</p>
                                            <p className="text-base font-semibold text-slate-900 truncate">
                                                {selectedCustomer.account?.username || 'Chưa có username'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50/50 hover:bg-slate-100/50 transition-colors">
                                        <div className="p-2.5 rounded-lg bg-green-50">
                                            <Mail className="h-5 w-5 text-green-600" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-slate-500">Email</p>
                                            <p className="text-base font-semibold text-slate-900 truncate">
                                                {selectedCustomer.email || 'Chưa có email'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50/50 hover:bg-slate-100/50 transition-colors">
                                        <div className="p-2.5 rounded-lg bg-purple-50">
                                            <Phone className="h-5 w-5 text-purple-600" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-slate-500">Số điện thoại</p>
                                            <p className="text-base font-semibold text-slate-900 truncate">
                                                {selectedCustomer.phone || 'Chưa có số điện thoại'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50/50 hover:bg-slate-100/50 transition-colors">
                                        <div className="p-2.5 rounded-lg bg-orange-50">
                                            <Calendar className="h-5 w-5 text-orange-600" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-slate-500">Ngày sinh</p>
                                            <p className="text-base font-semibold text-slate-900">
                                                {selectedCustomer.birthdate ?
                                                    new Date(selectedCustomer.birthdate).toLocaleDateString('vi-VN', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    }) :
                                                    'Chưa có thông tin'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50/50 hover:bg-slate-100/50 transition-colors">
                                        <div className="p-2.5 rounded-lg bg-cyan-50">
                                            <Shield className="h-5 w-5 text-cyan-600" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-slate-500">Trạng thái tài khoản</p>
                                            <p className="text-base font-semibold text-slate-900">
                                                {selectedCustomer.account?.status === 1 ? 'Hoạt động' : 'Không hoạt động'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50/50 hover:bg-slate-100/50 transition-colors">
                                        <div className="p-2.5 rounded-lg bg-pink-50">
                                            <Users className="h-5 w-5 text-pink-600" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-slate-500">Ngày tạo</p>
                                            <p className="text-base font-semibold text-slate-900">
                                                {new Date(selectedCustomer.created_at).toLocaleDateString('vi-VN', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Thêm phần này sau phần Customer Information */}
                {selectedCustomer && customerDevices.length === 0 && (
                    <Card className="mb-8 bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg shadow-black/5">
                        <CardContent className="flex flex-col items-center justify-center py-16">
                            <div className="relative">
                                <div className="absolute inset-0 bg-blue-50 rounded-full blur-xl opacity-50"></div>
                                <div className="relative p-6 rounded-full bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100/50 mb-6">
                                    <Power className="h-12 w-12 text-blue-500" />
                                </div>
                            </div>
                            <h3 className="text-xl font-semibold text-slate-900 mb-3">Không tìm thấy thiết bị</h3>
                            <p className="text-slate-500 text-center max-w-md leading-relaxed">
                                Khách hàng này chưa có thiết bị nào được đăng ký. Bạn có thể thêm thiết bị mới hoặc kiểm tra lại thông tin tìm kiếm.
                            </p>
                        </CardContent>
                    </Card>
                )}

                {/* Devices List - Updated Design */}
                {customerDevices.length > 0 && (
                    <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg shadow-black/5">
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <div>
                                    <CardTitle className="text-xl font-semibold text-slate-900">Danh sách thiết bị</CardTitle>
                                    <CardDescription className="text-slate-600">
                                        Tổng số: {customerDevices.filter(d => !d.is_deleted).length} thiết bị
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-slate-50/50">
                                            <TableHead className="font-semibold">Thiết bị</TableHead>
                                            <TableHead className="font-semibold">Vị trí</TableHead>
                                            <TableHead className="font-semibold">Trạng thái</TableHead>
                                            <TableHead className="font-semibold">Ngày tạo</TableHead>
                                            <TableHead className="font-semibold text-right">Thao tác</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {customerDevices.filter(device => !device.is_deleted).map((device) => (
                                            <TableRow key={`${device.device_id}-${device.serial_number}`} className="hover:bg-slate-50/50">
                                                <TableCell>
                                                    <div className="flex items-center space-x-3">
                                                        <div className="p-2 rounded-lg bg-blue-50">
                                                            {getDeviceIcon(device.template_id)}
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-slate-900">{device.name}</p>
                                                            <p className="text-sm text-slate-500">ID: {device.device_id}</p>
                                                            <p className="text-xs text-slate-400">SN: {device.serial_number}</p>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="space-y-1">
                                                        <p className="font-medium text-slate-900">{device.space?.name || 'Chưa có vị trí'}</p>
                                                        <p className="text-sm text-slate-500">{device.space?.house?.name || ''}</p>
                                                        <p className="text-xs text-slate-400">{device.space?.house?.address || ''}</p>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col gap-2">
                                                        {/* Trạng thái khóa */}
                                                        <Badge
                                                            variant="destructive"
                                                            className={`flex items-center gap-1 w-fit border-2 border-black/50 bg-white px-3 py-1 ${device.lock_status === 'locked' ? 'text-red-500' : 'text-green-500'}`}
                                                        >
                                                            <Lock className="h-3 w-3" />
                                                            {device.lock_status === 'locked' ? 'Đã khóa' : 'Mở khóa'}
                                                        </Badge>

                                                        {/* Trạng thái kết nối */}
                                                        <Badge
                                                            variant={device.link_status === 'linked' ? 'success' : 'secondary'}
                                                            className={`flex items-center gap-1 w-fit border-2 border-black/50 bg-white px-3 py-1 ${device.link_status === 'linked' ? 'text-green-500' : 'text-red-500'}`}
                                                        >
                                                            <Wifi className="h-3 w-3" />
                                                            {device.link_status === 'linked' ? 'Đang kết nối' : 'Mất kết nối'}
                                                        </Badge>

                                                        {/* Trạng thái nguồn */}
                                                        <Badge
                                                            variant={device.power_status ? 'success' : 'secondary'}
                                                            className={`flex items-center gap-1 w-fit border-2 border-black/50 bg-white px-3 py-1 ${device.power_status ? 'text-green-500' : 'text-red-500'}`}
                                                        >
                                                            <Power className="h-3 w-3" />
                                                            {device.power_status ? 'Bật' : 'Tắt'}
                                                        </Badge>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-slate-600">
                                                    {new Date(device.created_at).toLocaleDateString('vi-VN')}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button
                                                        onClick={() => handleViewDeviceDetails(device)}
                                                        variant="outline"
                                                        size="sm"
                                                        className="mr-2"
                                                    >
                                                        <Eye className="h-4 w-4 mr-1" />
                                                        Chi tiết
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Device Details Modal Component */}
                <DeviceDetailsModal
                    isOpen={isDeviceModalOpen}
                    onClose={() => setIsDeviceModalOpen(false)}
                    device={selectedDevice}
                    onDeviceAction={handleDeviceAction}
                    isActionLoading={isActionLoading}
                />
            </div>
        </div>
    )
}