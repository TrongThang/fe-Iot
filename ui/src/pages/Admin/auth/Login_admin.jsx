"use client"

import { useState } from "react"
import { Navigate, useNavigate } from "react-router-dom"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { EyeIcon, EyeOffIcon, User, Lock } from "lucide-react"
import { toast } from "sonner"
import { useAuth } from "@/contexts/AuthContext"
import axiosPublic from "@/apis/clients/public.client"


export default function LoginAdmin() {
    const [showPassword, setShowPassword] = useState(false)
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const { isAuthenticated, setIsAuthenticated, setUser, fetchEmployeeInfo } = useAuth()

    const navigate = useNavigate()
    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = { username, password };
            const response = await axiosPublic.post(`/auth/employee/login`, payload)

            // Parse the JSON response
            const { accessToken, refreshToken, employeeId } = response;

            if (response.code === "INVALID_CREDENTIALS") {
                toast.error("Tên đăng nhập hoặc mật khẩu không đúng. Vui lòng thử lại.")
                return
            }

            localStorage.setItem("employeeToken", accessToken);
            localStorage.setItem("employeeRefreshToken", refreshToken);
            localStorage.setItem("employeeId", employeeId);

            await fetchEmployeeInfo(accessToken)
            setIsAuthenticated(true);

            navigate("/admin/tickets");
            toast.success("Đăng nhập thành công!");
        } catch (error) {
            const errorMessage = error.message || "Đăng nhập thất bại. Vui lòng thử lại.";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
            <div className="w-full flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-10 border border-gray-200/50 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 to-transparent rounded-3xl"></div>

                        <div className="relative z-10">
                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-bold text-gray-800 mb-2">Đăng nhập Admin</h2>
                                <p className="text-gray-600 text-base">Vui lòng nhập thông tin đăng nhập admin</p>
                            </div>

                            <form onSubmit={handleLogin} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-800 block tracking-wide">TÊN ĐĂNG NHẬP</label>
                                    <div className="relative group">
                                        <div className="flex items-center border-2 border-gray-200 rounded-xl px-3 py-1.5 bg-gray-50/50 focus-within:border-blue-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-500/10 transition-all duration-300 group-hover:border-gray-300 group-hover:shadow-md">
                                            <User className="text-gray-500 mr-2 w-4 h-4" />
                                            <Input
                                                type="text"
                                                placeholder="Nhập tên đăng nhập của bạn"
                                                value={username}
                                                onChange={(e) => setUsername(e.target.value)}
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
                                                placeholder="Nhập mật khẩu của bạn"
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

                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
                                >
                                    {loading ? "Đang đăng nhập..." : "ĐĂNG NHẬP"}
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}