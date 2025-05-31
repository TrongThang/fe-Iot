"use client"

import { useState, useEffect } from "react"
import {
  Users,
  Package,
  HelpCircle,
  ChevronDown,
  LayoutDashboard,
  UserCog,
  Home,
  Gauge,
  Lightbulb,
  Thermometer,
  Bell,
  Settings,
  Clock,
} from "lucide-react"
import { useSidebar } from "./contexts/Sidebar-context"

const SidebarUser = () => {
  const { isOpen } = useSidebar()
  const [isOverviewOpen, setIsOverviewOpen] = useState(true)
  const [isManagementOpen, setIsManagementOpen] = useState(true)
  const [isAutomationOpen, setIsAutomationOpen] = useState(false)

  // Function to determine the initial active item based on the current URL
  const getInitialActiveItem = () => {
    const path = window.location.pathname;
    if (path === "/") return "dashboard";
    if (path === "/stats") return "stats";
    if (path === "/devices") return "devices";
    if (path === "/groups") return "groups";
    if (path === "/spaces") return "spaces";
    if (path === "/profile") return "profile";
    if (path === "/schedules") return "schedules";
    if (path === "/scenes") return "scenes";
    if (path === "/alerts") return "alerts";
    if (path === "/settings") return "settings";
    if (path === "/help") return "help";
    return "dashboard"; // Default to dashboard
  };

  const [activeItem, setActiveItem] = useState(getInitialActiveItem());

  // Update activeItem when the location changes (e.g., after navigation)
  useEffect(() => {
    const handlePopState = () => {
      setActiveItem(getInitialActiveItem());
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const toggleOverview = () => setIsOverviewOpen(!isOverviewOpen)
  const toggleManagement = () => setIsManagementOpen(!isManagementOpen)
  const toggleAutomation = () => setIsAutomationOpen(!isAutomationOpen)

  const handleItemClick = (item) => {
    setActiveItem(item)
  }

  return (
    <aside
      className={`fixed left-0 top-0 z-50 h-screen bg-gradient-to-b from-blue-900 to-blue-950 text-white shadow-xl transition-all duration-300 ${isOpen ? "w-[232px]" : "w-16"}`}
    >
      {/* Sidebar Header */}
      <div className={`px-6 flex items-center justify-center py-6 ${!isOpen && "px-3"}`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <Home className="w-6 h-6 text-white" />
          </div>
          {isOpen && (
            <div className="overflow-hidden">
              <h2 className="font-bold text-lg text-white">SmartNet Solutions</h2>
              <p className="text-xs text-blue-300 whitespace-nowrap">IoT Control Center</p>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar Content */}
      <div className={`py-4 h-[calc(100vh-140px)] overflow-y-auto ${isOpen ? "px-3" : "px-2"}`}>
        {/* Overview Section */}
        <div className="mb-4">
          {isOpen ? (
            <button
              onClick={toggleOverview}
              className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-blue-100 rounded-lg hover:bg-blue-800/30 transition-colors"
            >
              <span className="text-sm font-semibold uppercase tracking-wider">Tổng Quan</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${isOverviewOpen ? "rotate-180" : ""}`}
              />
            </button>
          ) : (
            <div className="h-px bg-blue-800/50 mx-2 mb-2"></div>
          )}

          {(isOverviewOpen || !isOpen) && (
            <div className={`space-y-1 ${isOpen ? "mt-2 pl-2" : ""}`}>
              <a
                href="/"
                onClick={() => handleItemClick("dashboard")}
                className={`flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-colors ${activeItem === "dashboard"
                  ? "bg-blue-600 text-white font-medium"
                  : "text-blue-200 hover:bg-blue-800/40"
                  } ${!isOpen && "justify-center"}`}
                title={!isOpen ? "Dashboard" : ""}
              >
                <LayoutDashboard className="w-4 h-4 flex-shrink-0" />
                {isOpen && <span>Dashboard</span>}
              </a>
              <a
                href="/stats"
                onClick={() => handleItemClick("stats")}
                className={`flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-colors ${activeItem === "stats" ? "bg-blue-600 text-white font-medium" : "text-blue-200 hover:bg-blue-800/40"
                  } ${!isOpen && "justify-center"}`}
                title={!isOpen ? "Thống kê" : ""}
              >
                <Gauge className="w-4 h-4 flex-shrink-0" />
                {isOpen && <span>Thống kê</span>}
              </a>
            </div>
          )}
        </div>

        {/* Management Section */}
        <div className="mb-4">
          {isOpen ? (
            <button
              onClick={toggleManagement}
              className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-blue-100 rounded-lg hover:bg-blue-800/30 transition-colors"
            >
              <span className="text-sm font-semibold uppercase tracking-wider">Quản Lý</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${isManagementOpen ? "rotate-180" : ""}`}
              />
            </button>
          ) : (
            <div className="h-px bg-blue-800/50 mx-2 mb-2"></div>
          )}

          {(isManagementOpen || !isOpen) && (
            <div className={`space-y-1 ${isOpen ? "mt-2 pl-2" : ""}`}>
              <a
                href="/devices"
                onClick={() => handleItemClick("devices")}
                className={`flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-colors ${activeItem === "devices" ? "bg-blue-600 text-white font-medium" : "text-blue-200 hover:bg-blue-800/40"
                  } ${!isOpen && "justify-center"}`}
                title={!isOpen ? "Thiết bị" : ""}
              >
                <Lightbulb className="w-4 h-4 flex-shrink-0" />
                {isOpen && <span>Thiết bị</span>}
              </a>
              <a
                href="/groups"
                onClick={() => handleItemClick("groups")}
                className={`flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-colors ${activeItem === "groups" ? "bg-blue-600 text-white font-medium" : "text-blue-200 hover:bg-blue-800/40"
                  } ${!isOpen && "justify-center"}`}
                title={!isOpen ? "Nhóm" : ""}
              >
                <Users className="w-4 h-4 flex-shrink-0" />
                {isOpen && <span>Nhóm</span>}
              </a>
              <a
                href="/spaces"
                onClick={() => handleItemClick("spaces")}
                className={`flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-colors ${activeItem === "spaces" ? "bg-blue-600 text-white font-medium" : "text-blue-200 hover:bg-blue-800/40"
                  } ${!isOpen && "justify-center"}`}
                title={!isOpen ? "Không gian" : ""}
              >
                <Package className="w-4 h-4 flex-shrink-0" />
                {isOpen && <span>Không gian</span>}
              </a>
              <a
                href="/profile"
                onClick={() => handleItemClick("profile")}
                className={`flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-colors ${activeItem === "profile" ? "bg-blue-600 text-white font-medium" : "text-blue-200 hover:bg-blue-800/40"
                  } ${!isOpen && "justify-center"}`}
                title={!isOpen ? "Tài khoản" : ""}
              >
                <UserCog className="w-4 h-4 flex-shrink-0" />
                {isOpen && <span>Tài khoản</span>}
              </a>
            </div>
          )}
        </div>

        {/* Automation Section */}
        <div className="mb-4">
          {isOpen ? (
            <button
              onClick={toggleAutomation}
              className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-blue-100 rounded-lg hover:bg-blue-800/30 transition-colors"
            >
              <span className="text-sm font-semibold uppercase tracking-wider">Tự động hóa</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${isAutomationOpen ? "rotate-180" : ""}`}
              />
            </button>
          ) : (
            <div className="h-px bg-blue-800/50 mx-2 mb-2"></div>
          )}

          {(isAutomationOpen || !isOpen) && (
            <div className={`space-y-1 ${isOpen ? "mt-2 pl-2" : ""}`}>
              <a
                href="/schedules"
                onClick={() => handleItemClick("schedules")}
                className={`flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-colors ${activeItem === "schedules"
                  ? "bg-blue-600 text-white font-medium"
                  : "text-blue-200 hover:bg-blue-800/40"
                  } ${!isOpen && "justify-center"}`}
                title={!isOpen ? "Lịch trình" : ""}
              >
                <Clock className="w-4 h-4 flex-shrink-0" />
                {isOpen && <span>Lịch trình</span>}
              </a>
              <a
                href="/scenes"
                onClick={() => handleItemClick("scenes")}
                className={`flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-colors ${activeItem === "scenes" ? "bg-blue-600 text-white font-medium" : "text-blue-200 hover:bg-blue-800/40"
                  } ${!isOpen && "justify-center"}`}
                title={!isOpen ? "Cảnh" : ""}
              >
                <Thermometer className="w-4 h-4 flex-shrink-0" />
                {isOpen && <span>Cảnh</span>}
              </a>
              <a
                href="/alerts"
                onClick={() => handleItemClick("alerts")}
                className={`flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-colors ${activeItem === "alerts" ? "bg-blue-600 text-white font-medium" : "text-blue-200 hover:bg-blue-800/40"
                  } ${!isOpen && "justify-center"}`}
                title={!isOpen ? "Cảnh báo" : ""}
              >
                <Bell className="w-4 h-4 flex-shrink-0" />
                {isOpen && <span>Cảnh báo</span>}
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar Footer */}
      <div className={`absolute bottom-0 left-0 right-0 border-t border-blue-800/50 p-4 ${!isOpen && "px-2"}`}>
        <div className="space-y-3">
          <a
            href="/settings"
            className={`flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg text-blue-200 hover:bg-blue-800/40 transition-colors ${!isOpen && "justify-center"}`}
            title={!isOpen ? "Cài đặt" : ""}
          >
            <Settings className="w-4 h-4 flex-shrink-0" />
            {isOpen && <span>Cài đặt</span>}
          </a>
          <a
            href="/help"
            className={`flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg text-blue-200 hover:bg-blue-800/40 transition-colors ${!isOpen && "justify-center"}`}
            title={!isOpen ? "Trợ giúp" : ""}
          >
            <HelpCircle className="w-4 h-4 flex-shrink-0" />
            {isOpen && <span>Trợ giúp</span>}
          </a>
        </div>
      </div>
    </aside>
  )
}

export default SidebarUser