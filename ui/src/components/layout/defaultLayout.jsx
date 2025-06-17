import { Navigate, Outlet } from "react-router-dom"
import Topbar from "./partials/Topbar"
import SidebarUser from "./partials/SidebarUser"
import { SidebarProvider, useSidebar } from "./partials/contexts/Sidebar-context"
import { useAuth } from "@/contexts/AuthContext"
import { useEffect } from "react"
import { jwtDecode } from "jwt-decode"

function LayoutContent() {
    const { isOpen } = useSidebar()
    const { isAuthenticated, isTokenExpiringSoon, refreshAccessToken, fetchUserInfo } = useAuth()

    useEffect(() => {
        if (!isAuthenticated) return;

        const interval = setInterval(async () => {
            const token = localStorage.getItem("authToken");
            if (token && isTokenExpiringSoon(token)) {
                console.log("Token sắp hết hạn, đang gọi refresh...");
                await refreshAccessToken();
            }
        }, 30 * 1000);

        return () => clearInterval(interval);
    }, [isAuthenticated]);

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    return (
        <div className="flex min-h-screen">
            <div className="w-full fixed top-0 left-0 z-30">
                <Topbar />
            </div>
            <div className="z-40">
                <SidebarUser />
            </div>
            <div className="flex-1 flex flex-col">
                <main className={`mt-20 flex-1 p-6 transition-all duration-300 ease-in-out ${isOpen ? "ml-[232px]" : "ml-16"}`}>
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export default function DefaultLayout() {
    return (
        <SidebarProvider>
            <LayoutContent />
        </SidebarProvider>
    )
}
