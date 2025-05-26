import { useState } from "react"
import { Link } from "react-router-dom"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { EyeIcon, EyeOffIcon } from "lucide-react"

export default function LoginForm() {
    const [showPassword, setShowPassword] = useState(false)

    return (
        <div className="w-full max-w-md">
            <h2 className="text-xl font-bold mb-6">Đăng nhập</h2>
            <form className="space-y-4">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="text-gray-500">👤</span>
                        <Input type="text" placeholder="Username" />
                    </div>
                </div>
                <div>
                    <div className="flex items-center gap-2">
                        <span className="text-gray-500">🔒</span>
                        <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
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
                    <Link to="#" className="text-gray-600 hover:underline">
                        Quên mật khẩu?
                    </Link>
                    <Link to="/register" className="text-blue-600 hover:underline">
                        Đăng ký
                    </Link>
                </div>
            </form>
        </div>
    )
}