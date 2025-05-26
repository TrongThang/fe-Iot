"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { EyeIcon, EyeOffIcon } from "lucide-react"

export default function Register() {
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    return (
        <div className="flex min-h-screen">
            {/* Left side - Blue background with logo */}
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
                    <p className="text-sm text-gray-600">CKC F.I.T SmartNet giải pháp kết nối thông minh</p>
                </div>
            </div>

            {/* Right side - Registration form */}
            <div className="w-full md:w-1/2 flex items-center justify-center p-6">
                <div className="w-full max-w-md">
                    <h2 className="text-xl font-bold mb-6">Đăng ký</h2>
                    <form className="space-y-3">
                        <div className="flex items-center border rounded-md px-3 py-2">
                            <span className="text-gray-500 mr-2">👤</span>
                            <Input
                                type="text"
                                placeholder="Username"
                                className="border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                            />
                        </div>

                        <div className="flex items-center border rounded-md px-3 py-2">
                            <span className="text-gray-500 mr-2">👨</span>
                            <Input
                                type="text"
                                placeholder="Họ và Tên"
                                className="border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                            />
                        </div>

                        <div className="flex items-center border rounded-md px-3 py-2">
                            <span className="text-gray-500 mr-2">📞</span>
                            <Input
                                type="tel"
                                placeholder="Số điện thoại"
                                className="border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                            />
                        </div>

                        <div className="flex items-center border rounded-md px-3 py-2">
                            <span className="text-gray-500 mr-2">📍</span>
                            <Input
                                type="text"
                                placeholder="Địa chỉ"
                                className="border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                            />
                        </div>

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

                        <div className="flex items-center border rounded-md px-3 py-2">
                            <span className="text-gray-500 mr-2">🔒</span>
                            <Input
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Nhập lại password"
                                className="border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="text-gray-500"
                            >
                                {showConfirmPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                            </button>
                        </div>

                        <div className="border rounded-md px-3 py-2">
                            <select className="w-full bg-transparent outline-none">
                                <option value="" disabled selected>
                                    Chọn đơn vị
                                </option>
                                <option value="unit1">Đơn vị 1</option>
                                <option value="unit2">Đơn vị 2</option>
                                <option value="unit3">Đơn vị 3</option>
                            </select>
                        </div>

                        <Button type="submit" className="w-full mt-2">
                            Đăng ký
                        </Button>

                        <div className="flex justify-end text-sm mt-2">
                            <Link to="/login" className="text-blue-600 hover:underline">
                                Đăng nhập
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
