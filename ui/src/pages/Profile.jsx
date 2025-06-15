"use client"

import { useEffect, useRef, useState } from "react"
import { User, CreditCard, Calendar, Phone, Edit, Save, X, Upload, Loader2, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Link } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { formatDate } from "@/utils/format"
import ImageCropper from "@/components/common/ImageCropper"
import { toast } from "sonner"
import axios from "axios"
import { custom } from "zod"

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
            const response = await axios.patch('http://localhost:7777/api/auth/update-profile', { customerData },
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

    const customerFields = [
        {
            key: "surname",
            label: "Họ",
            icon: User,
            value: customerData.surname,
            type: "text",
        },
        {
            key: "lastname",
            label: "Tên",
            icon: User,
            value: customerData.lastname,
            type: "text",
        },
        {
            key: "birthdate",
            label: "Ngày sinh",
            icon: Calendar,
            value: customerData?.birthdate ? formatDate(customerData.birthdate) : "Chưa cập nhật",
            type: "date",
        },
        {
            key: "phone",
            label: "Số điện thoại",
            icon: Phone,
            value: customerData.phone,
            type: "tel",
        },
        {
            key: "email",
            label: "Email",
            icon: Mail,
            value: customerData.email,
            type: "email",
        },
    ]

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="max-w-7xl">
                    <h1 className="text-3xl font-bold text-gray-900">Thông tin khách hàng</h1>
                    <p className="text-gray-600 mt-1 text-sm">Quản lý và cập nhật thông tin cá nhân</p>
                </div>
            </div>

            {/* Main Content */}
            <div className=" px-6 py-2">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
                    {/* Left Side - Profile Image */}
                    <div className="flex flex-col rounded-sm">
                        <Card className="flex-1 shadow-lg border-0">
                            <CardHeader className="bg-blue-500 text-white text-center py-6">
                                <CardTitle className="text-xl font-bold mb-4">Ảnh đại diện</CardTitle>
                            </CardHeader>

                            <CardContent className="flex-1 flex flex-col items-center justify-center p-8 bg-gradient-to-br from-blue-50 to-white">
                                <div className="relative group mb-8">
                                    <div
                                        className="w-48 h-48 rounded-full bg-white shadow-2xl flex items-center justify-center border-8 border-blue-100 cursor-pointer"
                                        onClick={handleAvatarClick}
                                    >
                                        <Avatar className="w-40 h-40">
                                            <AvatarImage
                                                src={
                                                    customerData?.image && customerData.image.trim() !== ""
                                                        ? `${customerData.image}`
                                                        : undefined
                                                }
                                                alt="Customer Avatar"
                                            />
                                            {(!customerData?.image || customerData?.image.trim() === "") && (
                                                <AvatarFallback className="bg-blue-500 text-white text-4xl font-bold">
                                                    {customerData?.fullname?.charAt(0) ?? "?"}
                                                </AvatarFallback>
                                            )}
                                        </Avatar>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="hidden"
                                        />
                                    </div>
                                </div>

                                <div className="text-center mb-8">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                        {customerData?.fullname}
                                    </h2>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Side - Information Details */}
                    <div className="flex flex-col">
                        <Card className="flex-1 shadow-lg border-0">
                            <CardHeader className="bg-blue-500 text-white py-6">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-xl font-bold">Thông tin chi tiết</CardTitle>
                                    <div className="flex items-center space-x-3">
                                        {isEditing ? (
                                            <>
                                                <Button onClick={handleUpdateUser} className="bg-white text-blue-600 hover:bg-blue-50 font-medium"
                                                    disabled={loading}>
                                                    {loading ? (
                                                        <span className="flex items-center justify-center">
                                                            <Loader2 size={18} className="mr-2 animate-spin" />
                                                            Đang cập nhật...
                                                        </span>
                                                    ) : (
                                                        <>
                                                            <Save className="w-4 h-4 mr-2" />
                                                            Lưu
                                                        </>
                                                    )}
                                                </Button>
                                                <Button
                                                    onClick={handleCancel}
                                                    variant="outline"
                                                    className="border-white text-white hover:bg-white/10"
                                                >
                                                    <X className="w-4 h-4 mr-2" />
                                                    Hủy
                                                </Button>
                                            </>
                                        ) : (
                                            <Button
                                                onClick={() => setIsEditing(true)}
                                                className="bg-white text-blue-600 hover:bg-blue-50 font-medium"
                                            >
                                                <Edit className="w-4 h-4 mr-2" />
                                                Cập nhật
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="flex-1 p-8 bg-white">
                                <div className="space-y-8 h-full">
                                    {/* Nhóm Họ và Tên */}
                                    <div className="flex flex-col sm:flex-row sm:gap-4">
                                        {customerFields
                                            .filter((field) => field.key === "surname" || field.key === "lastname")
                                            .map((field) => {
                                                const IconComponent = field.icon;
                                                return (
                                                    <div key={field.key} className="flex-1 space-y-3">
                                                        <Label
                                                            htmlFor={field.key}
                                                            className="flex items-center space-x-3 text-sm font-semibold text-gray-700 uppercase tracking-wide"
                                                        >
                                                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                                                <IconComponent className="w-4 h-4 text-blue-600" />
                                                            </div>
                                                            <span>{field.label}</span>
                                                        </Label>
                                                        {isEditing ? (
                                                            <Input
                                                                id={field.key}
                                                                type={field.type}
                                                                value={customerData[field.key] || ""}
                                                                onChange={(e) => handleInputChange(field.key, e.target.value)}
                                                                className="w-full h-12 border-2 border-gray-200 focus:border-blue-500 rounded-lg text-gray-900 font-medium text-lg"
                                                                placeholder={field.label}
                                                            />
                                                        ) : (
                                                            <div className="w-full h-12 flex items-center px-4 bg-gray-50 rounded-lg border border-gray-200">
                                                                <span className="text-gray-900 font-medium text-lg">
                                                                    {customerData[field.key] || "Chưa cập nhật"}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                    </div>

                                    {/* Các trường còn lại */}
                                    {customerFields
                                        .filter((field) => field.key !== "surname" && field.key !== "lastname")
                                        .map((field) => {
                                            const IconComponent = field.icon;
                                            return (
                                                <div key={field.key} className="space-y-3">
                                                    <Label
                                                        htmlFor={field.key}
                                                        className="flex items-center space-x-3 text-sm font-semibold text-gray-700 uppercase tracking-wide"
                                                    >
                                                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                                            <IconComponent className="w-4 h-4 text-blue-600" />
                                                        </div>
                                                        <span>{field.label}</span>
                                                    </Label>
                                                    {isEditing ? (
                                                        <Input
                                                            id={field.key}
                                                            type={field.type}
                                                            value={
                                                                field.key === "birthdate"
                                                                    ? customerData.birthdate?.slice(0, 10) || ""
                                                                    : customerData[field.key] || ""
                                                            }
                                                            onChange={(e) => handleInputChange(field.key, e.target.value)}
                                                            className="w-full h-12 border-2 border-gray-200 focus:border-blue-500 rounded-lg text-gray-900 font-medium text-lg"
                                                            placeholder={field.label}
                                                        />
                                                    ) : (
                                                        <div className="w-full h-12 flex items-center px-4 bg-gray-50 rounded-lg border border-gray-200">
                                                            <span className="text-gray-900 font-medium text-lg">
                                                                {field.key === "birthdate"
                                                                    ? customerData.birthdate
                                                                        ? formatDate(customerData.birthdate)
                                                                        : "Chưa cập nhật"
                                                                    : customerData[field.key] || "Chưa cập nhật"}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}

                                    {!customerData.email_verified && (
                                        <Button
                                            variant="outline"
                                            className="w-25 border-2 border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white py-3 text-lg font-medium"
                                            onClick={() => setShowEmailModal(true)}
                                        >
                                            Xác thực Email
                                        </Button>
                                    )}

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


                                    {/* Password Change Section */}
                                    <div className="pt-8 border-t border-gray-200">
                                        <div className="space-y-4">
                                            <h3 className="text-lg font-semibold text-gray-900">Bảo mật</h3>
                                            <Link to="/change-password" className="text-blue-600 hover:underline">
                                                <Button
                                                    variant="outline"
                                                    className="w-full border-2 border-blue-500 text-blue-600 hover:bg-blue-50 py-3 text-lg font-medium"
                                                >
                                                    Đổi mật khẩu
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
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
