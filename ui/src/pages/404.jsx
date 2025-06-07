"use client"

import { Button } from "@/components/ui/button"
import { Home } from "lucide-react"
import { Link } from "react-router-dom"

export default function NotFoundPage() {
    return (
        <div className="flex items-center justify-center mt-20">
            <div className="text-center text-white">
                <h1 className="text-8xl font-bold mb-4 text-black">404</h1>
                <h2 className="text-2xl font-semibold mb-4 text-black">Trang không tìm thấy</h2>
                <p className="text-black mb-8 ">Trang bạn đang tìm kiếm không tồn tại.</p>
                <Button asChild className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg">
                    <Link href="/">
                        <Home className="w-4 h-4 mr-2" />
                        Về trang chủ
                    </Link>
                </Button>
            </div>
        </div>
    )
}
