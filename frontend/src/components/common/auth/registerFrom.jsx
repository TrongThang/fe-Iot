"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { Input } from "../../../components/ui/input"
import { Button } from "@/components/ui/button"
import { EyeIcon, EyeOffIcon } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function RegisterForm() {
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    return (
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
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="text-gray-500">
                        {showConfirmPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                    </button>
                </div>

                <Select>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Chọn đơn vị" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="unit1">Đơn vị 1</SelectItem>
                        <SelectItem value="unit2">Đơn vị 2</SelectItem>
                        <SelectItem value="unit3">Đơn vị 3</SelectItem>
                    </SelectContent>
                </Select>

                <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white mt-2">
                    Đăng ký
                </Button>

                <div className="flex justify-end text-sm mt-2">
                    <Link href="#" className="text-blue-600 hover:underline">
                        Đăng nhập
                    </Link>
                </div>
            </form>
        </div>
    )
}
