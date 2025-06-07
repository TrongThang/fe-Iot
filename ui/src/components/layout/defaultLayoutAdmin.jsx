import { Outlet } from "react-router-dom"
import { SidebarProvider, useSidebar } from "./partials/contexts/Sidebar-context"
import TopbarAdmin from "./partials/TopbarAdmin"
import SidebarAdmin from "./partials/SidebarAdmin"

function LayoutContent() {
    const { isOpen } = useSidebar()

    return (
        <div className="flex min-h-screen">
            <div className="w-full fixed top-0 left-0 z-30">
                <TopbarAdmin />
            </div>
            <div className="z-40">
                <SidebarAdmin />
            </div>
            <div className="flex-1 flex flex-col">
                <main className={`mt-20 flex-1 p-6 transition-all duration-300 ease-in-out ${isOpen ? "ml-[232px]" : "ml-16"}`}>
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export default function DefaultLayoutAdmin() {
    return (
        <SidebarProvider>
            <LayoutContent />
        </SidebarProvider>
    )
}
