"use client"

import { useState, useRef, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Mail, ArrowLeft, Shield, Clock, CheckCircle, Lock, EyeIcon, EyeOffIcon, Loader2 } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { toast } from "sonner"

export default function PasswordRecovery() {
    // Step management
    const [currentStep, setCurrentStep] = useState(1) // 1: Email, 2: OTP, 3: Password, 4: Success

    // Email step
    const [email, setEmail] = useState("")

    // OTP step
    const [otp, setOtp] = useState(["", "", "", "", "", ""])
    const [timeLeft, setTimeLeft] = useState(0)
    const [canResend, setCanResend] = useState(false)
    const inputRefs = useRef([])

    // Password step
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [loading, setLoading] = useState(false);
    const { sendOtp, verifyEmail, verifyOtp, recoveryPassword } = useAuth();

    const navigate = useNavigate()

    // Timer for OTP
    useEffect(() => {
        if ((currentStep === 2 || currentStep === 1 ) && timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
            return () => clearTimeout(timer)
        } else if (timeLeft === 0) {
            setCanResend(true)
        }
    }, [timeLeft, currentStep])

    // Email submission
    const handleSendOtp = async (e) => {
        e.preventDefault();
        if (timeLeft > 0) {
            toast.info(`Vui lòng chờ ${timeLeft} giây trước khi gửi lại OTP`);
            return;
        }

        setLoading(true);
        try {
            const result = await sendOtp(email);
            if (result.success) {
                toast.success("Mã OTP đã được gửi đến email của bạn");
                setCurrentStep(2)
                setTimeLeft(60)
                setCanResend(false)
            } else {
                toast.error("Gửi OTP thất bại", { description: result.message });
            }
        } catch (error) {
            toast.error("Lỗi", { description: "Có lỗi xảy ra khi gửi OTP" });
        } finally {
            setLoading(false);
        }
    };

    // OTP handling
    const handleOtpChange = (index, value) => {
        if (value.length <= 1 && /^\d*$/.test(value)) {
            const newOtp = [...otp]
            newOtp[index] = value
            setOtp(newOtp)

            // Auto focus next input
            if (value && index < 5) {
                inputRefs.current[index + 1]?.focus()
            }
        }
    }

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const otpCode = otp.join("")
            if (otpCode.length === 6) {
                const result = await verifyOtp(email, otpCode);
    
                if (result.success) {
                    toast.success("Xác thực thành công");
                    setCurrentStep(3)
                    await verifyEmail(email);
                } else {
                    toast.error("Xác thực OTP thất bại", { description: result.message });
                }
            }
        } catch (error) {
            toast.error("Lỗi", { description: "Có lỗi xảy ra khi xác thực OTP" });
        } finally {
            setLoading(false);
        }
    };

    const handleOtpKeyDown = (index, e) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus()
        }
    }

    const handleOtpResend = () => {
        setTimeLeft(60)
        setCanResend(false)
        setOtp(["", "", "", "", "", ""])
        inputRefs.current[0]?.focus()
    }

    // Password submission
    const handleRecoveryPasswordSubmit = async (e) => {
        e.preventDefault()
        setLoading(true);
        try {
                if (newPassword !== confirmPassword) {
                    toast.warning("Chú ý", {description: "Mật khẩu không khớp!"})
                    return
                }
                const result = await recoveryPassword(email, newPassword);
    
                if (result.success) {
                    toast.success("Đổi mật khẩu thành công");
                    setCurrentStep(4)

                    setTimeout(() => {
                        navigate("/login")
                    }, 3000)
                } else {
                    toast.error("Xác thực OTP thất bại", { description: result.message });
                }
        } catch (error) {
            toast.error("Lỗi", { description: "Có lỗi xảy ra khi xác thực OTP" });
        } finally {
            setLoading(false);
        }
    }

    // Get step-specific content
    const getStepContent = () => {
        switch (currentStep) {
            case 1:
                return {
                    icon: <Shield className="w-8 h-8 text-blue-600" />,
                    title: "Quên mật khẩu?",
                    subtitle: "Nhập email của bạn để nhận mã đặt lại mật khẩu",
                    leftTitle: "Khôi phục mật khẩu!",
                    leftSubtitle: "Đừng lo lắng, chúng tôi sẽ giúp bạn lấy lại quyền truy cập",
                    features: ["Bảo mật cao", "Xử lý nhanh chóng", "Hỗ trợ 24/7"],
                }
            case 2:
                return {
                    icon: <Shield className="w-8 h-8 text-blue-600" />,
                    title: "Xác thực OTP",
                    subtitle: "Nhập mã gồm 6 chữ số được gửi cho bạn!",
                    leftTitle: "Xác thực bảo mật!",
                    leftSubtitle: "Bảo vệ tài khoản của bạn với mã xác thực",
                    features: ["Bảo mật 2 lớp", "Xác thực nhanh", "An toàn tuyệt đối"],
                }
            case 3:
                return {
                    icon: <Lock className="w-8 h-8 text-blue-600" />,
                    title: "Đổi mật khẩu",
                    subtitle: "Nhập mật khẩu để thay đổi mật khẩu.",
                    leftTitle: "Đặt lại mật khẩu!",
                    leftSubtitle: "Tạo mật khẩu mới cho tài khoản của bạn",
                    features: ["Mật khẩu mạnh", "Bảo mật cao", "An toàn tuyệt đối"],
                }
            case 4:
                return {
                    icon: <CheckCircle className="w-8 h-8 text-green-600" />,
                    title: "Đổi mật khẩu thành công!",
                    subtitle: "Mật khẩu của bạn đã được cập nhật. Đang chuyển hướng về trang đăng nhập...",
                    leftTitle: "Thành công!",
                    leftSubtitle: "Mật khẩu đã được cập nhật thành công",
                    features: ["Hoàn tất", "Bảo mật", "Sẵn sàng"],
                }
            default:
                return getStepContent(1)
        }
    }

    const stepContent = getStepContent()

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
            <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex-col items-center justify-center p-8 relative overflow-hidden">
                {/* Enhanced decorative elements */}
                <div className="absolute top-10 left-10 w-24 h-24 bg-blue-200/40 rounded-full blur-2xl animate-pulse"></div>
                <div className="absolute bottom-20 right-16 w-36 h-36 bg-indigo-200/30 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
                <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-purple-200/25 rounded-full blur-xl animate-pulse animation-delay-2000"></div>

                <div className="max-w-sm mx-auto text-center relative z-10">
                    <div className="mb-10">
                        <div className="w-36 h-36 mx-auto bg-white rounded-full shadow-2xl flex items-center justify-center border-4 border-blue-100 relative group">
                            <img
                                src="img/iot_logo_icon.png"
                                alt="Logo"
                                className="w-18 h-18 transition-transform group-hover:scale-110 duration-300 rounded-full"
                            />
                            <div className="absolute -inset-6 bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 rounded-full blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
                        </div>
                    </div>

                    <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
                        {stepContent.leftTitle}
                    </h2>
                    <p className="text-gray-700 text-lg leading-relaxed mb-10 font-medium">{stepContent.leftSubtitle}</p>

                    <div className="space-y-5">
                        {stepContent.features.map((feature, index) => (
                            <div
                                key={index}
                                className="bg-white/70 backdrop-blur-md rounded-2xl p-5 border border-blue-100/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                            >
                                <div className="flex items-center">
                                    <div
                                        className={`w-4 h-4 bg-gradient-to-r ${index === 0
                                            ? "from-blue-500 to-indigo-500"
                                            : index === 1
                                                ? "from-indigo-500 to-purple-500"
                                                : "from-purple-500 to-blue-500"
                                            } rounded-full mr-4 shadow-lg`}
                                    ></div>
                                    <span className="text-gray-800 font-semibold">{feature}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right side - Forms */}
            <div className="w-full md:w-1/2 flex items-center justify-center p-8">
                <div className="w-full max-w-2xl">
                    {/* Enhanced Mobile logo */}
                    <div className="md:hidden text-center mb-10">
                        <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-100 to-indigo-100 rounded-3xl shadow-xl flex items-center justify-center mb-6 border border-blue-200">
                            <img
                                src="img/iot_logo_icon.png"
                                alt="Logo"
                                className="w-12 h-12"
                                onError={(e) => {
                                    e.target.src =
                                        "img/iot_logo_icon.png"
                                    e.target.onerror = null
                                }}
                            />
                        </div>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            CKC F.I.T SmartNet
                        </h1>
                    </div>

                    <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-12 border border-gray-200/50 relative overflow-hidden">
                        {/* Subtle background pattern */}
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 to-transparent rounded-3xl"></div>

                        <div className="relative z-10">
                            {/* Step 1: Email */}
                            {currentStep === 1 && (
                                <>
                                    <div className="text-center mb-8">
                                        <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                                            {stepContent.icon}
                                        </div>
                                        <h2 className="text-3xl font-bold text-gray-800 mb-3">{stepContent.title}</h2>
                                        <p className="text-gray-600 text-lg">{stepContent.subtitle}</p>
                                    </div>

                                    <form onSubmit={handleSendOtp} className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-800 block tracking-wide">EMAIL</label>
                                            <div className="relative group">
                                                <div className="flex items-center border-2 border-gray-200 rounded-xl px-3 py-1.5 bg-gray-50/50 focus-within:border-blue-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-500/10 transition-all duration-300 group-hover:border-gray-300 group-hover:shadow-md">
                                                    <Mail className="text-gray-500 mr-2 w-4 h-4" />
                                                    <Input
                                                        type="email"
                                                        placeholder="Nhập địa chỉ email của bạn"
                                                        value={email}
                                                        onChange={(e) => setEmail(e.target.value)}
                                                        className="border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent placeholder:text-gray-400 text-gray-800 font-medium"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <Button
                                            type="submit"
                                            className="w-full h-14 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02] text-lg tracking-wide"
                                            disabled={loading || timeLeft > 0}
                                        >
                                            {loading ? (
                                                <span className="flex items-center justify-center">
                                                    <Loader2 size={18} className="mr-2 animate-spin" />
                                                    Đang gửi mã...
                                                </span>
                                            ) : timeLeft > 0 ? (
                                                `Gửi lại sau ${timeLeft}s`
                                            ) : (
                                                "GỬI MÃ XÁC NHẬN"
                                            )}
                                        </Button>

                                        <div className="text-center pt-4">
                                            <Link
                                                to="/login"
                                                className="inline-flex items-center text-gray-600 hover:text-blue-600 transition-colors font-medium text-sm"
                                            >
                                                <ArrowLeft className="w-4 h-4 mr-2" />
                                                Quay lại đăng nhập
                                            </Link>
                                        </div>
                                    </form>
                                </>
                            )}

                            {/* Step 2: OTP */}
                            {currentStep === 2 && (
                                <>
                                    <div className="text-center mb-8">
                                        <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                                            {stepContent.icon}
                                        </div>
                                        <h2 className="text-3xl font-bold text-gray-800 mb-3">{stepContent.title}</h2>
                                        <p className="text-gray-600 text-lg">{stepContent.subtitle}</p>
                                    </div>

                                    {/* OTP Input Fields */}
                                    <div className="flex justify-center gap-3 mb-8">
                                        {otp.map((digit, index) => (
                                            <input
                                                key={index}
                                                ref={(el) => (inputRefs.current[index] = el)}
                                                type="text"
                                                maxLength={1}
                                                value={digit}
                                                onChange={(e) => handleOtpChange(index, e.target.value)}
                                                onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                                className="w-14 h-14 text-center text-2xl font-bold border-2 border-gray-200 rounded-xl bg-gray-50/50 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all duration-300 hover:border-gray-300 hover:shadow-sm"
                                            />
                                        ))}
                                    </div>

                                    {/* Timer and Resend */}
                                    <div className="text-center mb-8">
                                        {!canResend ? (
                                            <div className="flex items-center justify-center text-gray-600">
                                                <Clock className="w-4 h-4 mr-2" />
                                                <span className="text-sm">Gửi lại mã sau {timeLeft}s</span>
                                            </div>
                                        ) : (
                                            <p className="text-sm text-gray-600">Không nhận được mã?</p>
                                        )}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                        <Button
                                            onClick={handleOtpResend}
                                            disabled={!canResend}
                                            variant="outline"
                                            className="h-12 border-2 border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Gửi lại
                                        </Button>
                                        <Button
                                            onClick={handleVerifyOtp}
                                            disabled={otp.join("").length !== 6}
                                            className="h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                        >
                                            Xong
                                        </Button>
                                    </div>

                                    <div className="text-center">
                                        <button
                                            onClick={() => setCurrentStep(1)}
                                            className="inline-flex items-center text-gray-600 hover:text-blue-600 transition-colors font-medium text-sm"
                                        >
                                            <ArrowLeft className="w-4 h-4 mr-2" />
                                            Quay lại
                                        </button>
                                    </div>
                                </>
                            )}

                            {/* Step 3: Password Reset */}
                            {currentStep === 3 && (
                                <>
                                    <div className="text-center mb-8">
                                        <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                                            {stepContent.icon}
                                        </div>
                                        <h2 className="text-3xl font-bold text-gray-800 mb-3">{stepContent.title}</h2>
                                        <p className="text-gray-600 text-lg">{stepContent.subtitle}</p>
                                    </div>

                                    <form onSubmit={handleRecoveryPasswordSubmit} className="space-y-6">
                                        <div className="space-y-2">
                                            <div className="relative group">
                                                <div className="flex items-center border-2 border-gray-200 rounded-xl px-3 py-1.5 bg-gray-50/50 focus-within:border-blue-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-500/10 transition-all duration-300 group-hover:border-gray-300 group-hover:shadow-md">
                                                    <Lock className="text-gray-500 mr-2 w-4 h-4" />
                                                    <Input
                                                        type={showNewPassword ? "text" : "password"}
                                                        placeholder="Nhập password"
                                                        value={newPassword}
                                                        onChange={(e) => setNewPassword(e.target.value)}
                                                        className="border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent placeholder:text-gray-400 text-gray-800 font-medium"
                                                        required
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                                        className="text-gray-500 hover:text-blue-600 transition-colors ml-2 p-1 rounded-lg hover:bg-blue-50"
                                                    >
                                                        {showNewPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="relative group">
                                                <div className="flex items-center border-2 border-gray-200 rounded-xl px-3 py-1.5 bg-gray-50/50 focus-within:border-blue-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-500/10 transition-all duration-300 group-hover:border-gray-300 group-hover:shadow-md">
                                                    <Lock className="text-gray-500 mr-2 w-4 h-4" />
                                                    <Input
                                                        type={showConfirmPassword ? "text" : "password"}
                                                        placeholder="Nhập lại password"
                                                        value={confirmPassword}
                                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                                        className="border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent placeholder:text-gray-400 text-gray-800 font-medium"
                                                        required
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                        className="text-gray-500 hover:text-blue-600 transition-colors ml-2 p-1 rounded-lg hover:bg-blue-50"
                                                    >
                                                        {showConfirmPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        <Button
                                            type="submit"
                                            className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 text-lg"
                                        >
                                            Tiếp tục
                                        </Button>

                                        <div className="text-center">
                                            <button
                                                type="button"
                                                onClick={() => setCurrentStep(2)}
                                                className="inline-flex items-center text-gray-600 hover:text-blue-600 transition-colors font-medium text-sm"
                                            >
                                                <ArrowLeft className="w-4 h-4 mr-2" />
                                                Quay lại
                                            </button>
                                        </div>
                                    </form>
                                </>
                            )}

                            {/* Step 4: Success */}
                            {currentStep === 4 && (
                                <div className="text-center">
                                    <div className="w-16 h-16 mx-auto bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                                        {stepContent.icon}
                                    </div>
                                    <h2 className="text-3xl font-bold text-gray-800 mb-3">{stepContent.title}</h2>
                                    <p className="text-gray-600 text-lg mb-6">{stepContent.subtitle}</p>

                                    <div className="flex justify-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
