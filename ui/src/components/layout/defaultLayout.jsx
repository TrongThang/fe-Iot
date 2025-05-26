import { Outlet } from "react-router-dom";
import Topbar from "./partials/Topbar";
import SidebarUser from "./partials/SidebarUser";

export default function DefaultLayout() {
    return (
        <div className="flex min-h-screen">
            <div className="w-full fixed top-0 left-0">
                <Topbar />
            </div>
            <div>
                <SidebarUser />
            </div>
            <div className="flex-1 flex flex-col">
                {/* chỉnh sửa giao diện bên trong */}
                <main className="mt-20 flex-1 p-6"
                    style={{
                        marginLeft: "200px"
                    }}
                >
                    <Outlet />
                </main>
            </div>
        </div>
    );
};