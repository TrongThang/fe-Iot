import { useState } from "react"
import { Link, Navigate, useNavigate } from "react-router-dom"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { EyeIcon, EyeOffIcon, User, UserCheck, Phone, Mail, Lock, Calendar } from "lucide-react"
import { toast } from "sonner"
import axios from "axios"
import { useAuth } from "@/contexts/AuthContext"
import { jwtDecode } from "jwt-decode"
import axiosPublic from "@/apis/clients/public.client"

export default function Register() {
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [username, setUsername] = useState("")
    const [lastname, setLastname] = useState("")
    const [surname, setSurname] = useState("")
    const [phone, setPhone] = useState("")
    const [email, setEmail] = useState("")
    const [birthdate, setBirthdate] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [terms, setTerms] = useState(false)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    // Hàm xử lý đăng ký
    const handleRegister = async (e) => {
        e.preventDefault()
        setLoading(true)

        // Xác thực đầu vào
        if (!username || !surname || !lastname || !phone || !email || !password || !confirmPassword) {
            toast.error("Vui lòng điền đầy đủ thông tin.")
            setLoading(false)
            return
        }

        if (password !== confirmPassword) {
            toast.error("Mật khẩu xác nhận không khớp.")
            setLoading(false)
            return
        }

        if (!terms) {
            toast.error("Vui lòng đồng ý với Điều khoản sử dụng và Chính sách bảo mật.")
            setLoading(false)
            return
        }

        try {
            const payload = {
                username,
                surname,
                lastname,
                phone,
                email,
                birthdate,
                password
            }
            console.log("payload", payload)

            const response = await axiosPublic.post(`/auth/register`, payload)

            if (response.success === true) {
                toast.success("Đăng ký thành công!")

                navigate("/login")
            }
            else {
                // Xử lý lỗi nếu không phải 200 OK
                const errorMessage = response?.message || "Đăng ký thất bại. Vui lòng thử lại."
                toast.error(errorMessage)
            }
        } catch (error) {
            // Xử lý lỗi
            const errorMessage = error.response?.message || "Đăng ký thất bại. Vui lòng thử lại."
            toast.error(errorMessage)
        } finally {
            setLoading(false)
        }
    }

    const handleChangePhone = async (e) => {
        const value = e.target.value
        if (value.length === 1 && value[0] === " ") return;
        if (value.length > 10) return;
        if (!/^\d*$/.test(value)) return;
        setPhone(value)
    }

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
                        Tham gia với chúng tôi!
                    </h2>
                    <p className="text-gray-700 text-lg leading-relaxed mb-10 font-medium">
                        CKC F.I.T SmartNet - Giải pháp kết nối thông minh
                    </p>

                    <div className="space-y-5">
                        <div className="bg-white/70 backdrop-blur-md rounded-2xl p-5 border border-blue-100/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                            <div className="flex items-center">
                                <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mr-4 shadow-lg"></div>
                                <span className="text-gray-800 font-semibold">Đăng ký nhanh chóng</span>
                            </div>
                        </div>
                        <div className="bg-white/70 backdrop-blur-md rounded-2xl p-5 border border-indigo-100/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                            <div className="flex items-center">
                                <div className="w-4 h-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mr-4 shadow-lg"></div>
                                <span className="text-gray-800 font-semibold">Bảo mật thông tin</span>
                            </div>
                        </div>
                        <div className="bg-white/70 backdrop-blur-md rounded-2xl p-5 border border-purple-100/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                            <div className="flex items-center">
                                <div className="w-4 h-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mr-4 shadow-lg"></div>
                                <span className="text-gray-800 font-semibold">Hỗ trợ 24/7</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full md:w-1/2 flex items-center justify-center p-8">
                <div className="w-full max-w-2xl">
                    <div className="md:hidden text-center mb-8">
                        <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-100 to-indigo-100 rounded-3xl shadow-xl flex items-center justify-center mb-6 border border-blue-200">
                            <img
                                src="img/iot_logo_icon.png"
                                alt="Logo"
                                className="w-12 h-12"
                            />
                        </div>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            CKC F.I.T SmartNet
                        </h1>
                    </div>

                    <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-12 border border-gray-200/50 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 to-transparent rounded-3xl"></div>

                        <div className="relative z-10">
                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-bold text-gray-800 mb-3">Đăng ký</h2>
                                <p className="text-gray-600 text-lg">Tạo tài khoản mới để bắt đầu</p>
                            </div>

                            <form onSubmit={handleRegister} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-800 block tracking-wide">HỌ</label>
                                        <div className="relative group">
                                            <div className="flex items-center border-2 border-gray-200 rounded-xl px-3 py-1.5 bg-gray-50/50 focus-within:border-blue-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-500/10 transition-all duration-300 group-hover:border-gray-300 group-hover:shadow-md">
                                                <User className="text-gray-500 mr-2 w-4 h-4" />
                                                <Input
                                                    type="text"
                                                    placeholder="Họ"
                                                    value={surname}
                                                    onChange={(e) => {
                                                        if (e.target.value.length === 1 && e.target.value[0] === " ") return;
                                                        setSurname(e.target.value)
                                                    }}
                                                    className="border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent placeholder:text-gray-400 text-gray-800 font-medium"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-800 block tracking-wide">TÊN</label>
                                        <div className="relative group">
                                            <div className="flex items-center border-2 border-gray-200 rounded-xl px-3 py-1.5 bg-gray-50/50 focus-within:border-blue-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-500/10 transition-all duration-300 group-hover:border-gray-300 group-hover:shadow-md">
                                                <UserCheck className="text-gray-500 mr-2 w-4 h-4" />
                                                <Input
                                                    type="text"
                                                    placeholder="Tên"
                                                    value={lastname}
                                                    onChange={(e) => {
                                                        if (e.target.value.length === 1 && e.target.value[0] === " ") return;
                                                        setLastname(e.target.value)
                                                    }}
                                                    className="border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent placeholder:text-gray-400 text-gray-800 font-medium"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-800 block tracking-wide">TÊN ĐĂNG NHẬP</label>
                                    <div className="relative group">
                                        <div className="flex items-center border-2 border-gray-200 rounded-xl px-3 py-1.5 bg-gray-50/50 focus-within:border-blue-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-500/10 transition-all duration-300 group-hover:border-gray-300 group-hover:shadow-md">
                                            <User className="text-gray-500 mr-2 w-4 h-4" />
                                            <Input
                                                type="text"
                                                placeholder="Tên đăng nhập"
                                                value={username}
                                                onChange={(e) => setUsername(e.target.value)}
                                                className="border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent placeholder:text-gray-400 text-gray-800 font-medium"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-800 block tracking-wide">SỐ ĐIỆN THOẠI</label>
                                    <div className="relative group">
                                        <div className="flex items-center border-2 border-gray-200 rounded-xl px-3 py-1.5 bg-gray-50/50 focus-within:border-blue-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-500/10 transition-all duration-300 group-hover:border-gray-300 group-hover:shadow-md">
                                            <Phone className="text-gray-500 mr-2 w-4 h-4" />
                                            <Input
                                                type="tel"
                                                placeholder="Số điện thoại của bạn"
                                                value={phone}
                                                onChange={handleChangePhone}
                                                className="border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent placeholder:text-gray-400 text-gray-800 font-medium"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-800 block tracking-wide">EMAIL</label>
                                    <div className="relative group">
                                        <div className="flex items-center border-2 border-gray-200 rounded-xl px-3 py-1.5 bg-gray-50/50 focus-within:border-blue-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-500/10 transition-all duration-300 group-hover:border-gray-300 group-hover:shadow-md">
                                            <Mail className="text-gray-500 mr-2 w-4 h-4" />
                                            <Input
                                                type="email"
                                                placeholder="Email của bạn"
                                                value={email}
                                                onChange={(e) => {
                                                    if (e.target.value.length === 1 && e.target.value[0] === " ") return;
                                                    setEmail(e.target.value)
                                                }}
                                                className="border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent placeholder:text-gray-400 text-gray-800 font-medium"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-800 block tracking-wide">NGÀY SINH</label>
                                    <div className="relative group">
                                        <div className="flex items-center border-2 border-gray-200 rounded-xl px-3 py-1.5 bg-gray-50/50 focus-within:border-blue-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-500/10 transition-all duration-300 group-hover:border-gray-300 group-hover:shadow-md">
                                            <Calendar className="text-gray-500 mr-2 w-4 h-4" />
                                            <Input
                                                type="date"
                                                placeholder="Ngày sinh của bạn"
                                                value={birthdate}
                                                onChange={(e) => setBirthdate(e.target.value)}
                                                className="border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent placeholder:text-gray-400 text-gray-800 font-medium"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-800 block tracking-wide">MẬT KHẨU</label>
                                    <div className="relative group">
                                        <div className="flex items-center border-2 border-gray-200 rounded-xl px-3 py-1.5 bg-gray-50/50 focus-within:border-blue-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-500/10 transition-all duration-300 group-hover:border-gray-300 group-hover:shadow-md">
                                            <Lock className="text-gray-500 mr-2 w-4 h-4" />
                                            <Input
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Mật khẩu"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent placeholder:text-gray-400 text-gray-800 font-medium"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="text-gray-500 hover:text-blue-600 transition-colors ml-2 p-1 rounded-lg hover:bg-blue-50"
                                            >
                                                {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-800 block tracking-wide">XÁC NHẬN MẬT KHẨU</label>
                                    <div className="relative group">
                                        <div className="flex items-center border-2 border-gray-200 rounded-xl px-3 py-1.5 bg-gray-50/50 focus-within:border-blue-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-500/10 transition-all duration-300 group-hover:border-gray-300 group-hover:shadow-md">
                                            <Lock className="text-gray-500 mr-2 w-4 h-4" />
                                            <Input
                                                type={showConfirmPassword ? "text" : "password"}
                                                placeholder="Nhập lại mật khẩu"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                className="border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent placeholder:text-gray-400 text-gray-800 font-medium"
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

                                <div className="flex items-center pt-3">
                                    <input
                                        id="terms"
                                        type="checkbox"
                                        checked={terms}
                                        onChange={(e) => setTerms(e.target.checked)}
                                        className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded-lg"
                                    />
                                    <label htmlFor="terms" className="ml-3 text-sm text-gray-700">
                                        Tôi đồng ý với{" "}
                                        <Link to="/terms" className="text-blue-600 hover:text-blue-700 font-semibold hover:underline">
                                            Điều khoản sử dụng
                                        </Link>{" "}
                                        và{" "}
                                        <Link to="/privacy" className="text-blue-600 hover:text-blue-700 font-semibold hover:underline">
                                            Chính sách bảo mật
                                        </Link>
                                    </label>
                                </div>

                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full h-14 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02] text-lg tracking-wide ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
                                >
                                    {loading ? "Đang đăng ký..." : "TẠO TÀI KHOẢN"}
                                </Button>

                                <div className="text-center pt-6 border-t border-gray-200">
                                    <p className="text-sm text-gray-600">
                                        Đã có tài khoản?{" "}
                                        <Link
                                            to="/login"
                                            className="text-blue-600 hover:text-blue-700 font-bold transition-colors hover:underline"
                                        >
                                            Đăng nhập ngay →
                                        </Link>
                                    </p>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
