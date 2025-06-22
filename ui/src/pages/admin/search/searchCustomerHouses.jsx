"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    Search,
    User,
    Mail,
    Phone,
    Building,
    Home,
    MapPin,
    MoreHorizontal,
    Settings,
    Trash2,
    Eye,
    RefreshCw,
    Calendar,
    Shield,
    Users,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import axiosPublic from '../../../apis/clients/public.client'
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { HOUSE_ICON_MAP } from "@/components/common/CustomerSearch/IconMap"
import { COLOR_MAP } from "@/components/common/CustomerSearch/ColorMap"
import React from "react"

export default function SearchCustomerHouses() {
    const [searchFilters, setSearchFilters] = useState({
        email: "",
        phone: "",
        username: ""
    })
    const [selectedCustomer, setSelectedCustomer] = useState(null)
    const [customerHouses, setCustomerHouses] = useState([])

    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)

    const handleSearch = async () => {
        setIsLoading(true)
        setError(null)

        try {
            // Kiểm tra xem có ít nhất một điều kiện tìm kiếm không
            const hasSearchCriteria = Object.values(searchFilters).some(value => value.trim() !== '');

            if (!hasSearchCriteria) {
                setError('Vui lòng nhập ít nhất một điều kiện tìm kiếm');
                setSelectedCustomer(null);
                setCustomerHouses([]);
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
                const fullName = response.data.customer.full_name || '';
                const fullNameParts = fullName.split(' ');
                const surname = fullNameParts[0] || '';
                const lastname = fullNameParts.slice(1).join(' ') || '';

                const customerData = {
                    customer_id: response.data.customer.customer_id || '',
                    surname: surname,
                    lastname: lastname,
                    image: response.data.customer.avatar || "/placeholder.svg?height=64&width=64",
                    phone: response.data.customer.phone || '',
                    email: response.data.customer.email || '',
                    email_verified: response.data.customer.email_verified || false,
                    birthdate: response.data.customer.birthdate || new Date().toISOString(),
                    gender: response.data.customer.gender === true,
                    created_at: response.data.customer.created_at || new Date().toISOString(),
                    updated_at: response.data.customer.updated_at || new Date().toISOString(),
                    deleted_at: response.data.customer.is_deleted ? response.data.customer.updated_at : null,
                    account: {
                        account_id: response.data.account?.account_id || '',
                        username: response.data.account?.username || '',
                        role_id: 2,
                        status: 1,
                        created_at: response.data.account?.created_at || new Date().toISOString()
                    }
                }

                setSelectedCustomer(customerData)

                // Format lại dữ liệu nhà
                const formattedHouses = (response.data.houses || []).map(house => {
                    if (!house) return null;

                    return {
                        house_id: house.house_id || '',
                        group_id: house.group_id || '',
                        house_name: house.house_name || '',
                        address: house.address || 'Chưa có địa chỉ',
                        icon_name: house.icon_name || 'home',
                        icon_color: house.icon_color || `home`,
                        created_at: house.created_at || new Date().toISOString(),
                        updated_at: house.updated_at || new Date().toISOString(),
                        is_deleted: house.is_deleted || false,
                        spaces: house.spaces || []
                    }
                }).filter(Boolean);

                setCustomerHouses(formattedHouses)
            } else {
                setSelectedCustomer(null)
                setCustomerHouses([])
                setError('Không tìm thấy dữ liệu khách hàng')
            }
        } catch (err) {
            console.error('Error fetching data:', err)
            setError(err.message || 'Có lỗi xảy ra khi tìm kiếm')
            setSelectedCustomer(null)
            setCustomerHouses([])
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
        setCustomerHouses([])
        setError(null)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
            <div className="max-w-7xl mx-auto p-6">
                {/* Search Section */}
                <div className="mb-8">
                    <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg shadow-black/5">
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold text-slate-900">Tra cứu nhà của khách hàng</CardTitle>
                            <CardDescription className="text-slate-600">
                                Tìm kiếm và quản lý các nhà của khách hàng
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


                {/* Houses List */}
                {selectedCustomer && customerHouses.length === 0 && (
                    <Card className="mb-8 bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg shadow-black/5">
                        <CardContent className="flex flex-col items-center justify-center py-16">
                            <div className="relative">
                                <div className="absolute inset-0 bg-emerald-50 rounded-full blur-xl opacity-50"></div>
                                <div className="relative p-6 rounded-full bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100/50 mb-6">
                                    <Home className="h-12 w-12 text-emerald-500" />
                                </div>
                            </div>
                            <h3 className="text-xl font-semibold text-slate-900 mb-3">Không tìm thấy nhà</h3>
                            <p className="text-slate-500 text-center max-w-md leading-relaxed">
                                Khách hàng này chưa có nhà nào được đăng ký. Bạn có thể thêm nhà mới hoặc kiểm tra lại thông tin tìm kiếm.
                            </p>
                        </CardContent>
                    </Card>
                )}

                {customerHouses.length > 0 && (
                    <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg shadow-black/5">
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <div>
                                    <CardTitle className="text-xl font-semibold text-slate-900">Danh sách nhà</CardTitle>
                                    <CardDescription className="text-slate-600">
                                        Tổng số: {customerHouses.length} nhà
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-slate-50/50">
                                            <TableHead className="font-semibold">ID</TableHead>
                                            <TableHead className="font-semibold">Tên nhà</TableHead>
                                            <TableHead className="font-semibold">Địa chỉ</TableHead>
                                            <TableHead className="font-semibold">Không gian</TableHead>
                                            <TableHead className="font-semibold">Ngày tạo</TableHead>
                                            <TableHead className="font-semibold">Cập nhật</TableHead>
                                            <TableHead className="font-semibold text-right">Thao tác</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {customerHouses.map((house) => (
                                            <TableRow key={house.house_id} className="hover:bg-slate-50/50">
                                                <TableCell className="font-medium">{house.house_id}</TableCell>
                                                <TableCell>
                                                    <div className="flex items-center space-x-3">

                                                        <div
                                                            className="p-2 rounded-lg"
                                                            style={{
                                                                backgroundColor: "#E3F2FD"
                                                            }}
                                                        >
                                                            {(() => {
                                                                const HouseIcon = HOUSE_ICON_MAP[house.icon_name] || HOUSE_ICON_MAP.HOUSE;
                                                                return (
                                                                    <HouseIcon
                                                                        style={{ width: 24, height: 24 }}
                                                                        fill={COLOR_MAP[house.icon_color] || "#2196F3"}
                                                                    />
                                                                );
                                                            })()}
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-slate-900">{house.house_name}</p>
                                                            <p className="text-xs text-slate-500">ID: {house.house_id}</p>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2 text-slate-600">
                                                        <MapPin className="h-4 w-4" />
                                                        <span>{house.address || 'Chưa có địa chỉ'}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="space-y-1">
                                                        {house.spaces && house.spaces.length > 0 ? (
                                                            house.spaces.map((space) => (
                                                                <Badge
                                                                    key={space.space_id}
                                                                    variant="outline"
                                                                    className="mr-2"
                                                                >
                                                                    {space.space_name}
                                                                </Badge>
                                                            ))
                                                        ) : (
                                                            <span className="text-sm text-slate-500">Chưa có không gian</span>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-slate-600">
                                                    {new Date(house.created_at).toLocaleDateString('vi-VN', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </TableCell>
                                                <TableCell className="text-slate-600">
                                                    {new Date(house.updated_at).toLocaleDateString('vi-VN', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="hover:bg-slate-100">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-48 bg-white border border-slate-200 shadow-lg rounded-lg">
                                                            <DropdownMenuItem className="cursor-pointer hover:bg-slate-100">
                                                                <Eye className="h-4 w-4 mr-2" />
                                                                Xem chi tiết
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="cursor-pointer hover:bg-slate-100">
                                                                <Settings className="h-4 w-4 mr-2" />
                                                                Cài đặt
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="text-red-600 cursor-pointer hover:bg-slate-100">
                                                                <Trash2 className="h-4 w-4 mr-2" />
                                                                Xóa nhà
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}
