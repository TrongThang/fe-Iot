import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    Search, User, Mail, Phone, MoreHorizontal, Settings, Trash2, Eye, RefreshCw, Calendar, Shield, Users, Edit, Key,
    Lock, Unlock, AlertCircle, CheckCircle2, XCircle,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Swal from 'sweetalert2'
import UpdateCustomerForm from '@/components/common/CustomerSearch/UpdateCustomerInfo'
import axiosPublic from "@/apis/clients/public.client"

export default function SearchCustomerInfo() {
    const [searchFilters, setSearchFilters] = useState({
        email: "",
        phone: "",
        username: "",
        customerId: ""
    })
    const [selectedCustomer, setSelectedCustomer] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false)
    const [updateForm, setUpdateForm] = useState({
        surname: '',
        lastname: '',
        email: '',
        phone: '',
        gender: false,
        birthdate: ''
    })

    const handleSearch = async () => {
        setIsLoading(true)
        setError(null)

        try {
            const hasSearchCriteria = Object.values(searchFilters).some(value => value.trim() !== '');

            if (!hasSearchCriteria) {
                setError('Vui lòng nhập ít nhất một điều kiện tìm kiếm');
                setSelectedCustomer(null);
                setIsLoading(false);
                return;
            }

            const params = new URLSearchParams()
            if (searchFilters.email) params.append('email', searchFilters.email)
            if (searchFilters.phone) params.append('phone', searchFilters.phone)
            if (searchFilters.username) params.append('username', searchFilters.username)
            if (searchFilters.customerId) params.append('customerId', searchFilters.customerId)

            const response = await axiosPublic.get(`customer-search?${params.toString()}`)

            if (response.success && response.data?.customer) {
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
                        // status: response.data.account?.status || 1,
                        is_locked: response.data.account?.is_locked,
                        created_at: response.data.account?.created_at || new Date().toISOString()
                    }
                }

                setSelectedCustomer(customerData)
            } else {
                setSelectedCustomer(null)
                setError('Không tìm thấy dữ liệu khách hàng')
            }
        } catch (err) {
            console.error('Error fetching data:', err)
            setError(err.message || 'Có lỗi xảy ra khi tìm kiếm')
            setSelectedCustomer(null)
        } finally {
            setIsLoading(false)
        }
    }

    const handleReset = () => {
        setSearchFilters({
            email: "",
            phone: "",
            username: "",
            customerId: ""
        })
        setSelectedCustomer(null)
        setError(null)
    }

    const handleLockAccount = async () => {
        const result = await Swal.fire({
            title: 'Xác nhận khóa tài khoản?',
            text: "Tài khoản sẽ bị khóa và không thể đăng nhập!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Xác nhận',
            cancelButtonText: 'Hủy'
        });

        if (result.isConfirmed) {
            try {
                const response = await axiosPublic.put(`customer-search/lock/${selectedCustomer.customer_id}`);

                // Kiểm tra cả 2 trường hợp
                if (response.data.success || response.success) {
                    setSelectedCustomer(prev => ({
                        ...prev,
                        account: {
                            ...prev.account,
                            is_locked: true
                        }
                    }));
                    Swal.fire(
                        'Đã khóa!',
                        'Tài khoản đã được khóa thành công.',
                        'success'
                    );
                } else {
                    throw new Error('Khóa tài khoản thất bại');
                }
            } catch (error) {
                console.error('Error locking account:', error);
                Swal.fire(
                    'Lỗi!',
                    error.response?.data?.error?.message || 'Có lỗi xảy ra khi khóa tài khoản.',
                    'error'
                );
            }
        }
    };

    const handleUnlockAccount = async () => {
        const result = await Swal.fire({
            title: 'Xác nhận mở khóa tài khoản?',
            text: "Tài khoản sẽ được mở khóa và có thể đăng nhập lại!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Xác nhận',
            cancelButtonText: 'Hủy'
        });

        if (result.isConfirmed) {
            try {
                const response = await axiosPublic.put(`customer-search/unlock/${selectedCustomer.customer_id}`);

                // Kiểm tra cả 2 trường hợp
                if (response.data.success || response.success) {
                    setSelectedCustomer(prev => ({
                        ...prev,
                        account: {
                            ...prev.account,
                            is_locked: false
                        }
                    }));
                    Swal.fire(
                        'Đã mở khóa!',
                        'Tài khoản đã được mở khóa thành công.',
                        'success'
                    );
                } else {
                    throw new Error('Mở khóa tài khoản thất bại');
                }
            } catch (error) {
                console.error('Error unlocking account:', error);
                Swal.fire(
                    'Lỗi!',
                    error.response?.data?.error?.message || 'Có lỗi xảy ra khi mở khóa tài khoản.',
                    'error'
                );
            }
        }
    };

    const formatDateForInput = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return '';
        return date.toISOString().split('T')[0];
    };

    const handleUpdateCustomer = async () => {
        try {
            const updateData = {
                ...updateForm,
                birthdate: updateForm.birthdate ? new Date(updateForm.birthdate).toISOString() : null
            };

            const response = await axiosPublic.put(
                `customer-search/update/${selectedCustomer.customer_id}`,
                updateData
            );

            if (response.success) {
                setSelectedCustomer(prev => ({
                    ...prev,
                    ...response.data
                }));
                setIsUpdateDialogOpen(false);
                Swal.fire(
                    'Thành công!',
                    'Thông tin khách hàng đã được cập nhật.',
                    'success'
                );
            }
        } catch (error) {
            console.error('Error updating customer:', error);
            Swal.fire(
                'Lỗi!',
                'Có lỗi xảy ra khi cập nhật thông tin.',
                'error'
            );
        }
    };

    const handleDeleteCustomer = async () => {
        const result = await Swal.fire({
            title: 'Xác nhận xóa tài khoản?',
            text: "Tài khoản sẽ bị xóa vĩnh viễn và không thể khôi phục!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Xác nhận xóa',
            cancelButtonText: 'Hủy'
        });

        if (result.isConfirmed) {
            try {
                const response = await axiosPublic.delete(`customer-search/delete/${selectedCustomer.customer_id}`);

                if (response.success) {
                    setSelectedCustomer(null);
                    handleReset();
                    Swal.fire(
                        'Đã xóa!',
                        'Tài khoản đã được xóa thành công.',
                        'success'
                    );
                }
            } catch (error) {
                console.error('Error deleting customer:', error);
                Swal.fire(
                    'Lỗi!',
                    'Có lỗi xảy ra khi xóa tài khoản.',
                    'error'
                );
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
            <div className="max-w-7xl mx-auto p-6">
                {/* Search Section */}
                <div className="mb-8">
                    <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg shadow-black/5">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-2xl font-bold text-slate-900">Tra cứu thông tin khách hàng</CardTitle>
                                    <CardDescription className="text-slate-600 mt-2">
                                        Tìm kiếm và xem thông tin chi tiết của khách hàng
                                    </CardDescription>
                                </div>

                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {/* Search Filters */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                            <Mail className="h-4 w-4 text-blue-500" />
                                            Email
                                        </label>
                                        <Input
                                            placeholder="Nhập email..."
                                            value={searchFilters.email}
                                            onChange={(e) => setSearchFilters({ ...searchFilters, email: e.target.value })}
                                            className="border-slate-200 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                            <Phone className="h-4 w-4 text-purple-500" />
                                            Số điện thoại
                                        </label>
                                        <Input
                                            placeholder="Nhập số điện thoại..."
                                            value={searchFilters.phone}
                                            onChange={(e) => setSearchFilters({ ...searchFilters, phone: e.target.value })}
                                            className="border-slate-200 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                            <User className="h-4 w-4 text-green-500" />
                                            Username
                                        </label>
                                        <Input
                                            placeholder="Nhập username..."
                                            value={searchFilters.username}
                                            onChange={(e) => setSearchFilters({ ...searchFilters, username: e.target.value })}
                                            className="border-slate-200 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                            <Key className="h-4 w-4 text-orange-500" />
                                            Mã khách hàng
                                        </label>
                                        <Input
                                            placeholder="Nhập mã khách hàng..."
                                            value={searchFilters.customerId}
                                            onChange={(e) => setSearchFilters({ ...searchFilters, customerId: e.target.value })}
                                            className="border-slate-200 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                                        />
                                    </div>
                                </div>

                                {/* Error Message */}
                                {error && (
                                    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm flex items-center">
                                        <AlertCircle className="w-5 h-5 mr-2" />
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
                    <Tabs defaultValue="info" className="space-y-6">
                        <TabsList className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg shadow-black/5 p-1 rounded-lg">
                            <TabsTrigger value="info" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600">
                                <User className="h-4 w-4 mr-2" />
                                Thông tin cơ bản
                            </TabsTrigger>
                            <TabsTrigger value="account" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600">
                                <Shield className="h-4 w-4 mr-2" />
                                Tài khoản
                            </TabsTrigger>

                        </TabsList>

                        <TabsContent value="info">
                            <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg shadow-black/5">
                                <CardHeader className="pb-4">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-xl font-semibold text-slate-900">Thông tin chi tiết khách hàng</CardTitle>
                                        <div className="flex items-center gap-2">

                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="hover:bg-slate-100">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-48 bg-white border border-slate-200 shadow-lg rounded-lg">
                                                    <DropdownMenuItem
                                                        className="cursor-pointer hover:bg-slate-100"
                                                        onClick={() => selectedCustomer.account?.is_locked ? handleUnlockAccount() : handleLockAccount()}
                                                    >
                                                        {selectedCustomer.account?.is_locked ? (
                                                            <>
                                                                <Unlock className="h-4 w-4 mr-2" />
                                                                Mở khóa tài khoản
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Lock className="h-4 w-4 mr-2" />
                                                                Khóa tài khoản
                                                            </>
                                                        )}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className="cursor-pointer hover:bg-slate-100"
                                                        onClick={() => {
                                                            const birthdate = selectedCustomer.birthdate
                                                                ? new Date(selectedCustomer.birthdate).toISOString().split('T')[0]
                                                                : '';

                                                            setUpdateForm({
                                                                surname: selectedCustomer.surname || '',
                                                                lastname: selectedCustomer.lastname || '',
                                                                email: selectedCustomer.email || '',
                                                                phone: selectedCustomer.phone || '',
                                                                gender: selectedCustomer.gender || false,
                                                                birthdate: birthdate
                                                            });
                                                            setIsUpdateDialogOpen(true);
                                                        }}
                                                    >
                                                        <Settings className="h-4 w-4 mr-2" />
                                                        Cập nhật thông tin
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className="text-red-600 cursor-pointer hover:bg-slate-100"
                                                        onClick={handleDeleteCustomer}
                                                    >
                                                        <Trash2 className="h-4 w-4 mr-2" />
                                                        Xóa tài khoản
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-col gap-6">
                                        {/* Avatar và thông tin cơ bản */}
                                        <div className="flex items-center gap-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                                            <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                                                <AvatarImage src={selectedCustomer.image} />
                                                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-500 text-white text-2xl">
                                                    {selectedCustomer.surname.charAt(0)}{selectedCustomer.lastname.charAt(0)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-2xl font-bold text-slate-900 truncate">
                                                    {selectedCustomer.surname} {selectedCustomer.lastname}
                                                </h3>
                                                <p className="text-sm text-slate-500 mt-1">ID: {selectedCustomer.customer_id}</p>
                                                <div className="flex items-center gap-2 mt-3">
                                                    <Badge variant={selectedCustomer.email_verified ? "success" : "secondary"} className="text-xs px-3 py-1">
                                                        {selectedCustomer.email_verified ? (
                                                            <CheckCircle2 className="h-3 w-3 mr-1" />
                                                        ) : (
                                                            <XCircle className="h-3 w-3 mr-1" />
                                                        )}
                                                        {selectedCustomer.email_verified ? "Đã xác thực" : "Chưa xác thực"}
                                                    </Badge>
                                                    <Badge variant="outline" className="text-xs px-3 py-1">
                                                        {selectedCustomer.gender ? "Nam" : "Nữ"}
                                                    </Badge>
                                                    <Badge
                                                        variant={selectedCustomer.account?.is_locked ? "destructive" : "success"}
                                                        className={`text-xs px-3 py-1 ${selectedCustomer.account?.is_locked
                                                            ? "bg-red-100 text-red-700 border border-red-200"
                                                            : "bg-green-100 text-green-700 border border-green-200"
                                                            }`}
                                                    >
                                                        {selectedCustomer.account?.is_locked ? (
                                                            <>
                                                                <Lock className="h-3 w-3 mr-1" />
                                                                Bị khóa
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Unlock className="h-3 w-3 mr-1" />
                                                                Hoạt động
                                                            </>
                                                        )}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Thông tin chi tiết */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50/50 hover:bg-slate-100/50 transition-colors border border-slate-200">
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

                                            <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50/50 hover:bg-slate-100/50 transition-colors border border-slate-200">
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

                                            <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50/50 hover:bg-slate-100/50 transition-colors border border-slate-200">
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

                                            <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50/50 hover:bg-slate-100/50 transition-colors border border-slate-200">
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

                                            <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50/50 hover:bg-slate-100/50 transition-colors border border-slate-200">
                                                <div className="p-2.5 rounded-lg bg-cyan-50">
                                                    <Shield className="h-5 w-5 text-cyan-600" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-slate-500">Trạng thái tài khoản</p>
                                                    <p className="text-base font-semibold text-slate-900">
                                                        {selectedCustomer.account?.is_locked ? 'Bị khóa' : 'Hoạt động bình thường'}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50/50 hover:bg-slate-100/50 transition-colors border border-slate-200">
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
                        </TabsContent>

                        <TabsContent value="account">
                            <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg shadow-black/5">
                                <CardHeader>
                                    <CardTitle className="text-xl font-semibold text-slate-900">Thông tin tài khoản</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {/* Account ID */}
                                        <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50/50 hover:bg-slate-100/50 transition-colors border border-slate-200">
                                            <div className="p-2.5 rounded-lg bg-blue-50">
                                                <Key className="h-5 w-5 text-blue-600" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-slate-500">Account ID</p>
                                                <p className="text-base font-semibold text-slate-900 break-all">
                                                    {selectedCustomer.account?.account_id || "Không có"}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Username */}
                                        <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50/50 hover:bg-slate-100/50 transition-colors border border-slate-200">
                                            <div className="p-2.5 rounded-lg bg-green-50">
                                                <User className="h-5 w-5 text-green-600" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-slate-500">Username</p>
                                                <p className="text-base font-semibold text-slate-900 truncate">
                                                    {selectedCustomer.account?.username || "Không có"}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Trạng thái */}
                                        <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50/50 hover:bg-slate-100/50 transition-colors border border-slate-200">
                                            <div className="p-2.5 rounded-lg bg-cyan-50">
                                                <Shield className="h-5 w-5 text-cyan-600" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-slate-500">Trạng thái</p>
                                                <p className="text-base font-semibold text-slate-900">
                                                    {selectedCustomer.account?.is_locked ? (
                                                        <span className="flex items-center gap-1 text-red-600">
                                                            <Lock className="h-4 w-4" /> Không hoạt động
                                                        </span>
                                                    ) : (
                                                        <span className="flex items-center gap-1 text-green-600">
                                                            <Unlock className="h-4 w-4" /> Hoạt động
                                                        </span>
                                                    )}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Ngày tạo */}
                                        <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50/50 hover:bg-slate-100/50 transition-colors border border-slate-200">
                                            <div className="p-2.5 rounded-lg bg-orange-50">
                                                <Calendar className="h-5 w-5 text-orange-600" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-slate-500">Ngày tạo</p>
                                                <p className="text-base font-semibold text-slate-900">
                                                    {selectedCustomer.account?.created_at
                                                        ? new Date(selectedCustomer.account.created_at).toLocaleDateString('vi-VN', {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric'
                                                        })
                                                        : "Không có"}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Ngày cập nhật */}
                                        <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50/50 hover:bg-slate-100/50 transition-colors border border-slate-200">
                                            <div className="p-2.5 rounded-lg bg-indigo-50">
                                                <Edit className="h-5 w-5 text-indigo-600" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-slate-500">Ngày cập nhật</p>
                                                <p className="text-base font-semibold text-slate-900">
                                                    {selectedCustomer.account?.updated_at
                                                        ? new Date(selectedCustomer.account.updated_at).toLocaleDateString('vi-VN', {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric'
                                                        })
                                                        : "Không có"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>


                    </Tabs>
                )}
            </div>

            {/* Form Cập nhật thông tin */}
            <UpdateCustomerForm
                isOpen={isUpdateDialogOpen}
                onClose={() => setIsUpdateDialogOpen(false)}
                updateForm={updateForm}
                setUpdateForm={setUpdateForm}
                onUpdate={handleUpdateCustomer}
            />
        </div>
    )
}
