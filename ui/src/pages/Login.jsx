"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { EyeIcon, EyeOffIcon } from "lucide-react"

export default function Login() {
    const [showPassword, setShowPassword] = useState(false)

    return (
        <div className="flex min-h-screen">
            <div className="hidden md:flex md:w-1/2 bg-[#e6eef2] flex-col items-center justify-center p-6">
                <div className="max-w-[200px] mx-auto text-center">
                    <img
                        src={"/placeholder.svg"}
                        alt="Logo"
                        className="w-24 h-24 mx-auto mb-4"
                        onError={(e) => {
                            e.target.src =
                                "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-agkMcwTe8ZxwcS7v1mZXv08X8E6uC1.png"
                            e.target.onerror = null
                        }}
                    />
                    <h2 className="text-xl font-medium mb-1">Welcome</h2>
                    <p className="text-sm text-gray-600">Chào mừng đến với hệ thống CKC F.I.T SmartNet</p>
                </div>
            </div>

            {/* Right side - Login form */}
            <div className="w-full md:w-1/2 flex items-center justify-center p-6">
                <div className="w-full max-w-md">
                    <h2 className="text-xl font-bold mb-6">Đăng nhập</h2>
                    <form className="space-y-4">
                        <div className="space-y-2">
                            <div className="flex items-center border rounded-md px-3 py-2">
                                <span className="text-gray-500 mr-2">👤</span>
                                <Input
                                    type="text"
                                    placeholder="Username"
                                    className="border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center border rounded-md px-3 py-2">
                                <span className="text-gray-500 mr-2">🔒</span>
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Password"
                                    className="border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-gray-500">
                                    {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                                </button>
                            </div>
                        </div>
                        <Button type="submit" className="w-full">
                            Đăng nhập
                        </Button>
                        <div className="flex justify-between text-sm mt-4">
                            <Link to="/forgot-password" className="text-gray-600 hover:underline">
                                Quên mật khẩu?
                            </Link>
                            <Link to="/register" className="text-blue-600 hover:underline">
                                Đăng ký
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
