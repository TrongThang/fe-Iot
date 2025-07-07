"use client"

import { useEffect, useRef, useState } from "react"
import { User, Mail, Calendar, Edit3, Save, X, Camera, Shield, Loader2, Phone, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Link } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { formatDate } from "@/utils/format"
import ImageCropper from "@/components/common/ImageCropper"
import { toast } from "sonner"
import axios from "axios"

export default function Profile() {
    const [isEditing, setIsEditing] = useState(false)
    const { user } = useAuth();
    const { sendOtp, verifyOtp, verifyEmail, fetchUserInfo } = useAuth();
    const [loading, setLoading] = useState(false);
    const [showEmailModal, setShowEmailModal] = useState(false);
    const [emailStep, setEmailStep] = useState("input"); // input, otp
    const [otpCooldown, setOtpCooldown] = useState(0);
    const [lastOtpSentAt, setLastOtpSentAt] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0);
    const [tempImage, setTempImage] = useState(null)
    const [showCropModal, setShowCropModal] = useState(false)
    const [originalImage, setOriginalImage] = useState(null);
    const fileInputRef = useRef(null);
    const [emailForm, setEmailForm] = useState({
        otp: ""
    });
    const [customerData, setCustomerData] = useState({
        username: "",
        fullname: "",
        birthdate: "",
        phone: "",
        email: "",
        email_verified: false,
        image: "",
    })

    useEffect(() => {
        const calculateCooldown = () => {
            if (lastOtpSentAt) {
                const elapsedSeconds = Math.floor((Date.now() - lastOtpSentAt) / 1000);
                const remainingTime = Math.max(60 - elapsedSeconds, 0);
                setOtpCooldown(remainingTime);
            }
        };

        calculateCooldown();
        const timer = setInterval(calculateCooldown, 1000);
        return () => clearInterval(timer);
    }, [lastOtpSentAt]);

    useEffect(() => {
        setCustomerData(user);
    }, [user, refreshKey])

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleCropComplete = (croppedImage) => {
        if (croppedImage === null) {
            // Trường hợp hủy
            setCustomerData(prev => ({ ...prev, image: originalImage }));
            setTempImage(null);
            setIsEditing(false)
            toast.info("Đã hủy chọn ảnh");
        } else {
            // Trường hợp xác nhận cắt ảnh
            setCustomerData(prev => ({ ...prev, image: croppedImage }));
            setIsEditing(true)
        }
        setShowCropModal(false);
    };

    const handleInputChange = (field, value) => {
        setCustomerData((prev) => ({
            ...prev,
            [field]: value,
        }))
    }

    const handleUpdateUser = async () => {
        try {
            setLoading(true)
            const token = localStorage.getItem('authToken');
            delete customerData.username;
            delete customerData.fullname;
            const updatedData = {
                ...customerData,
                birthdate: (customerData?.birthdate).slice(0, 10)
            };
            console.log("dung lượng ảnh", updatedData.image.size)
            console.log("updatedata", updatedData)
            const response = await axios.patch('http://localhost:7777/api/auth/update-profile', updatedData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    }
                }
            );
            if (response.data.success) {
                setIsEditing(false)
                toast.success("Cập nhật thông tin thành công");
                await fetchUserInfo(token);
                await setRefreshKey(prev => prev + 1);
            } else {
                return {
                    success: false,
                    message: response.data.message || 'Cập nhật thông tin thất bại'
                };
            }
        } catch (error) {
            console.error('Update User error:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật thông tin'
            };
        } finally {
            setLoading(false)
        }
    }

    const handleCancel = () => {
        setCustomerData(user);
        setIsEditing(false);
    }

    const handleSendOtp = async (e) => {
        e.preventDefault();
        if (otpCooldown > 0) {
            toast.info(`Vui lòng chờ ${otpCooldown} giây trước khi gửi lại OTP`);
            return;
        }

        setLoading(true);
        try {
            const result = await sendOtp(customerData.email);
            if (result.success) {
                toast.success("Mã OTP đã được gửi đến email của bạn");
                setLastOtpSentAt(Date.now());
                setOtpCooldown(60);
                setEmailStep("otp");
            } else {
                toast.error("Gửi OTP thất bại", { description: result.message });
            }
        } catch (error) {
            toast.error("Lỗi", { description: "Có lỗi xảy ra khi gửi OTP" });
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const result = await verifyOtp(customerData.email, emailForm.otp);

            const token = localStorage.getItem('authToken');

            if (result.success) {
                toast.success("Xác thực email thành công");
                setShowEmailModal(false);
                setEmailStep("input");
                await verifyEmail(customerData.email);
                await fetchUserInfo(token);
                setRefreshKey(prev => prev + 1);
            } else {
                toast.error("Xác thực OTP thất bại", { description: result.message });
            }
        } catch (error) {
            toast.error("Lỗi", { description: "Có lỗi xảy ra khi xác thực OTP" });
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        setEmailStep("input");
        setEmailForm(prev => ({ ...prev, otp: "" }));
    };

    const handleImageChange = (e) => {
        setIsEditing(true);
        const file = e.target.files[0];
        if (!file) return;

        setOriginalImage(customerData.image); // Lưu ảnh ban đầu
        const reader = new FileReader();
        reader.onloadend = () => {
            setTempImage(reader.result);
            setShowCropModal(true);
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            {/* Header */}
            <div className="bg-white/80 backdrop-blur-sm border-b border-white/20 shadow-sm">
                <div className="px-6 py-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
                                Hồ sơ cá nhân
                            </h1>
                            <p className="text-slate-600 mt-2 text-lg">Quản lý thông tin tài khoản của bạn</p>
                        </div>
                        <div className="flex items-center space-x-3">
                            {isEditing ? (
                                <>
                                    <Button
                                        onClick={handleUpdateUser}
                                        className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <span className="flex items-center justify-center">
                                                <Loader2 size={18} className="mr-2 animate-spin" />
                                                Đang cập nhật...
                                            </span>
                                        ) : (
                                            <>
                                                <Save className="w-4 h-4 mr-2" />
                                                Lưu thay đổi
                                            </>
                                        )}
                                    </Button>
                                    <Button
                                        onClick={handleCancel}
                                        variant="outline"
                                        className="border-slate-300 text-slate-700 hover:bg-slate-50"
                                    >
                                        <X className="w-4 h-4 mr-2" />
                                        Hủy
                                    </Button>
                                </>
                            ) : (
                                <Button
                                    onClick={() => setIsEditing(true)}
                                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg"
                                >
                                    <Edit3 className="w-4 h-4 mr-2" />
                                    Chỉnh sửa
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Profile Card */}
                    <div className="lg:col-span-1">
                        <Card className="bg-white/70 backdrop-blur-sm border-white/20 shadow-xl">
                            <CardContent className="p-8">
                                <div className="text-center">
                                    {/* Avatar */}
                                    <div className="relative inline-block mb-6">
                                        <div className="relative">
                                            <Avatar className="w-32 h-32 border-4 border-white shadow-2xl">
                                                <AvatarImage
                                                    src={
                                                        customerData?.image && customerData.image.trim() !== ""
                                                            ? `${customerData.image}`
                                                            : undefined
                                                    }
                                                    alt="Profile"
                                                />
                                                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-2xl font-bold">
                                                    {customerData?.fullname?.charAt(0) ?? "?"}
                                                </AvatarFallback>
                                            </Avatar>
                                            <button
                                                className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                                                onClick={handleAvatarClick}
                                            >
                                                <Camera className="w-5 h-5" />
                                            </button>
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                className="hidden"
                                            />
                                        </div>
                                    </div>

                                    {/* Name & Email */}
                                    <div className="space-y-3">
                                        <h2 className="text-2xl font-bold text-slate-900">
                                            {customerData?.fullname}
                                        </h2>
                                        <div className="flex items-center justify-center space-x-2">
                                            <User className="w-4 h-4 text-slate-500" />
                                            <span className="text-slate-600">{customerData?.username}</span>
                                        </div>
                                        <div className="flex items-center justify-center space-x-2">
                                            <Mail className="w-4 h-4 text-slate-500" />
                                            <span className="text-slate-600 break-words max-w-[300px] text-center">{customerData.email}</span>
                                        </div>

                                        {/* Email Verification Badge */}
                                        <div className="flex justify-center">
                                            {customerData.email_verified ? (
                                                <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100">
                                                    <CheckCircle className="w-3 h-3 mr-1" />
                                                    Email đã xác thực
                                                </Badge>
                                            ) : (
                                                <Badge variant="destructive" className="bg-red-100 text-red-700 border-red-200">
                                                    <AlertCircle className="w-3 h-3 mr-1" />
                                                    Chưa xác thực
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Information Cards */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Personal Information */}
                        <Card className="bg-white/70 backdrop-blur-sm border-white/20 shadow-xl">
                            <CardContent className="p-8">
                                <div className="flex items-center space-x-3 mb-6">
                                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                                        <User className="w-5 h-5 text-white" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-slate-900">Thông tin cá nhân</h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Surname */}
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium text-slate-700">Họ</Label>
                                        {isEditing ? (
                                            <Input
                                                value={customerData.surname || ""}
                                                onChange={(e) => handleInputChange("surname", e.target.value)}
                                                className="bg-white/50 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                                            />
                                        ) : (
                                            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-sm">
                                                <span className="text-slate-900">{customerData.surname || "Chưa cập nhật"}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Lastname */}
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium text-slate-700">Tên</Label>
                                        {isEditing ? (
                                            <Input
                                                value={customerData.lastname || ""}
                                                onChange={(e) => handleInputChange("lastname", e.target.value)}
                                                className="bg-white/50 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                                            />
                                        ) : (
                                            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-sm">
                                                <span className="text-slate-900">{customerData.lastname || "Chưa cập nhật"}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Email */}
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium text-slate-700">Email</Label>
                                        {isEditing ? (
                                            <Input
                                                type="email"
                                                value={customerData.email || ""}
                                                onChange={(e) => handleInputChange("email", e.target.value)}
                                                className="bg-white/50 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                                                disabled
                                            />
                                        ) : (
                                            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-sm">
                                                <span className="text-slate-900">{customerData.email || "Chưa cập nhật"}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Phone */}
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium text-slate-700">Số điện thoại</Label>
                                        {isEditing ? (
                                            <Input
                                                type="tel"
                                                value={customerData.phone || ""}
                                                onChange={(e) => handleInputChange("phone", e.target.value)}
                                                className="bg-white/50 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                                            />
                                        ) : (
                                            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-sm">
                                                <span className="text-slate-900">{customerData.phone || "Chưa cập nhật"}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Birthdate */}
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium text-slate-700">Ngày sinh</Label>
                                        {isEditing ? (
                                            <Input
                                                type="date"
                                                value={customerData.birthdate?.slice(0, 10) || ""}
                                                onChange={(e) => handleInputChange("birthdate", e.target.value)}
                                                className="bg-white/50 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                                            />
                                        ) : (
                                            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-sm">
                                                <span className="text-slate-900">
                                                    {customerData.birthdate ? formatDate(customerData.birthdate) : "Chưa cập nhật"}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Security & Actions */}
                        <div className="">
                            {/* Security */}
                            <Card className="bg-white/70 backdrop-blur-sm border-white/20 shadow-xl">
                                <CardContent className="p-6">
                                    <div className="flex items-center space-x-3 mb-4">
                                        <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                                            <Shield className="w-5 h-5 text-white" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-slate-900">Bảo mật</h3>
                                    </div>

                                    <div className="space-y-3">
                                        <Link to="/change-password">
                                            <Button
                                                variant="outline"
                                                className="w-full justify-start border-red-200 text-red-700 hover:bg-red-50"
                                            >
                                                Đổi mật khẩu
                                            </Button>
                                        </Link>
                                        {!customerData.email_verified && (
                                            <Button
                                                variant="outline"
                                                className="w-full justify-start border-orange-200 text-orange-700 hover:bg-orange-50"
                                                onClick={() => setShowEmailModal(true)}
                                            >
                                                Xác thực email
                                            </Button>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal thay đổi email */}
            {showEmailModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold">Xác thực email</h3>
                            <button
                                className="text-gray-500 hover:text-gray-700"
                                onClick={() => {
                                    setShowEmailModal(false);
                                    setEmailStep("input");
                                    setEmailForm({ otp: "" });
                                }}
                            >
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {emailStep === "input" && (
                            <form onSubmit={handleSendOtp} className="space-y-4">
                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={loading || otpCooldown > 0}
                                >
                                    {loading ? (
                                        <span className="flex items-center justify-center">
                                            <Loader2 size={18} className="mr-2 animate-spin" />
                                            Đang xử lý...
                                        </span>
                                    ) : otpCooldown > 0 ? (
                                        `Gửi lại sau ${otpCooldown}s`
                                    ) : (
                                        "Gửi mã xác thực"
                                    )}
                                </Button>
                            </form>
                        )}

                        {emailStep === "otp" && (
                            <form onSubmit={handleVerifyOtp} className="space-y-4">
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                        <Mail size={18} />
                                    </div>
                                    <Input
                                        type="text"
                                        required
                                        className="w-full pl-10"
                                        placeholder="Nhập mã OTP"
                                        value={emailForm.otp}
                                        onChange={(e) => setEmailForm(prev => ({ ...prev, otp: e.target.value }))}
                                    />
                                </div>
                                <div className="flex gap-3">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="w-full"
                                        onClick={handleBack}
                                        disabled={loading}
                                    >
                                        Quay lại
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="w-full"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <span className="flex items-center justify-center">
                                                <Loader2 size={18} className="mr-2 animate-spin" />
                                                Đang xử lý...
                                            </span>
                                        ) : (
                                            "Xác thực OTP"
                                        )}
                                    </Button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}

            {/* Modal cắt ảnh */}
            {showCropModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full mx-4">
                        <div className="p-6">
                            <ImageCropper
                                image={tempImage}
                                onCropComplete={handleCropComplete}
                                aspectRatio={5 / 5}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}