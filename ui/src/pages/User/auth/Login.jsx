"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { EyeIcon, EyeOffIcon, User, Lock } from "lucide-react"

export default function Login() {
  const [showPassword, setShowPassword] = useState(false)

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
                src={"/placeholder.svg"}
                alt="Logo"
                className="w-18 h-18 transition-transform group-hover:scale-110 duration-300"
                onError={(e) => {
                  e.target.src =
                    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-agkMcwTe8ZxwcS7v1mZXv08X8E6uC1.png"
                  e.target.onerror = null
                }}
              />
              <div className="absolute -inset-6 bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 rounded-full blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
            </div>
          </div>

          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Chào mừng trở lại!
          </h2>
          <p className="text-gray-700 text-lg leading-relaxed mb-10 font-medium">
            Chào mừng đến với hệ thống CKC F.I.T SmartNet
          </p>

          <div className="space-y-5">
            <div className="bg-white/70 backdrop-blur-md rounded-2xl p-5 border border-indigo-100/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mr-4 shadow-lg"></div>
                <span className="text-gray-800 font-semibold">Quản lý thông minh</span>
              </div>
            </div>
            <div className="bg-white/70 backdrop-blur-md rounded-2xl p-5 border border-purple-100/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mr-4 shadow-lg"></div>
                <span className="text-gray-800 font-semibold">Bảo mật tuyệt đối</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-2xl">
          {/* Enhanced Mobile logo */}
          <div className="md:hidden text-center mb-10">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-100 to-indigo-100 rounded-3xl shadow-xl flex items-center justify-center mb-6 border border-blue-200">
              <img
                src={"/placeholder.svg"}
                alt="Logo"
                className="w-12 h-12"
                onError={(e) => {
                  e.target.src =
                    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-agkMcwTe8ZxwcS7v1mZXv08X8E6uC1.png"
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
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-gray-800 mb-3">Đăng nhập</h2>
                <p className="text-gray-600 text-lg">Vui lòng nhập thông tin đăng nhập của bạn</p>
              </div>

              <form className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-800 block tracking-wide">TÊN ĐĂNG NHẬP</label>
                  <div className="relative group">
                    <div className="flex items-center border-2 border-gray-200 rounded-xl px-3 py-1.5 bg-gray-50/50 focus-within:border-blue-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-500/10 transition-all duration-300 group-hover:border-gray-300 group-hover:shadow-md">
                      <User className="text-gray-500 mr-2 w-4 h-4" />
                      <Input
                        type="text"
                        placeholder="Nhập tên đăng nhập của bạn"
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

                <div className="flex items-center justify-between pt-3">
                  <div className="flex items-center">
                    <input
                      id="remember"
                      type="checkbox"
                      className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded-lg"
                    />
                    <label htmlFor="remember" className="ml-3 text-sm font-medium text-gray-700">
                      Ghi nhớ đăng nhập
                    </label>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-14 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02] text-lg tracking-wide"
                >
                  ĐĂNG NHẬP
                </Button>

                <div className="flex justify-between text-sm pt-6 border-t border-gray-200">
                  <Link
                    to="/forgot-password"
                    className="text-gray-600 hover:text-blue-600 transition-colors font-semibold hover:underline"
                  >
                    Quên mật khẩu?
                  </Link>
                  <Link
                    to="/register"
                    className="text-blue-600 hover:text-blue-700 font-bold transition-colors hover:underline"
                  >
                    Đăng ký ngay →
                  </Link>
                </div>
              </form>
            </div>
          </div>

          <div className="text-center mt-8">
            <p className="text-sm text-gray-600">
              Bằng việc đăng nhập, bạn đồng ý với{" "}
              <Link to="/terms" className="text-blue-600 hover:text-blue-700 font-semibold hover:underline">
                Điều khoản sử dụng
              </Link>{" "}
              của chúng tôi
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
