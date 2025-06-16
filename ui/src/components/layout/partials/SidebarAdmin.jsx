"use client"

import { useState, useEffect } from "react"
import {
  Users,
  HelpCircle,
  ChevronDown,
  LayoutDashboard,
  Home,
  Thermometer,
  Settings,
  Clock,
} from "lucide-react"
import { useSidebar } from "./contexts/Sidebar-context"
import { Link } from "react-router-dom"

const SidebarAdmin = () => {
  const { isOpen } = useSidebar()
  const [isOverviewOpen, setIsOverviewOpen] = useState(true)
  const [isManagementOpen, setIsManagementOpen] = useState(true)
  const [isAutomationOpen, setIsAutomationOpen] = useState(false)

  // Function to determine the initial active item based on the current URL
  const getInitialActiveItem = () => {
    const path = window.location.pathname
    if (path === "/admin") return "dashboard"
    if (path === "/admin/tickets") return "tickets"
    if (path === "/admin/customers") return "customers"
    if (path === "/admin/search-device") return "search-device"
    if (path === "/admin/search-group") return "search-group"
    if (path === "/admin/search-customer-groups") return "search-customer-groups"
    if (path === "/admin/search-customer-houses") return "search-customer-houses"
    if (path === "/admin/search-customer-spaces") return "search-customer-spaces"
    if (path === "/admin/search-customer-devices") return "search-customer-devices"
    if (path === "/admin/search-customer-info") return "search-customer-info"

    return "dashboard" // Default to dashboard
  }

  const [activeItem, setActiveItem] = useState(getInitialActiveItem())

  // Update activeItem when the location changes (e.g., after navigation)
  useEffect(() => {
    const handlePopState = () => {
      setActiveItem(getInitialActiveItem())
    }
    window.addEventListener("popstate", handlePopState)
    return () => window.removeEventListener("popstate", handlePopState)
  }, [])

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
            <Link
              to="/admin"
              onClick={() => handleItemClick("dashboard")}
              className={`flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-colors ${activeItem === "dashboard"
                ? "bg-blue-600 text-white font-medium"
                : "text-blue-200 hover:bg-blue-800/40"
                } ${!isOpen && "justify-center"}`}
              title={!isOpen ? "Dashboard" : ""}
            >
              <Home className="w-6 h-6 text-white" />
            </Link>
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
              <Link
                to="/admin"
                onClick={() => handleItemClick("dashboard")}
                className={`flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-colors ${activeItem === "dashboard"
                  ? "bg-blue-600 text-white font-medium"
                  : "text-blue-200 hover:bg-blue-800/40"
                  } ${!isOpen && "justify-center"}`}
                title={!isOpen ? "Dashboard" : ""}
              >
                <LayoutDashboard className="w-4 h-4 flex-shrink-0" />
                {isOpen && <span>Dashboard</span>}
              </Link>
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
              <Link
                to="/admin/customers"
                onClick={() => handleItemClick("customers")}
                className={`flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-colors ${activeItem === "customers"
                  ? "bg-blue-600 text-white font-medium"
                  : "text-blue-200 hover:bg-blue-800/40"
                  } ${!isOpen && "justify-center"}`}
                title={!isOpen ? "Khách hàng" : ""}
              >
                <Users className="w-4 h-4 flex-shrink-0" />
                {isOpen && <span>Khách hàng</span>}
              </Link>
              <Link
                to="/admin/tickets"
                onClick={() => handleItemClick("tickets")}
                className={`flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-colors ${activeItem === "tickets"
                  ? "bg-blue-600 text-white font-medium"
                  : "text-blue-200 hover:bg-blue-800/40"
                  } ${!isOpen && "justify-center"}`}
                title={!isOpen ? "Yêu cầu" : ""}
              >
                <Users className="w-4 h-4 flex-shrink-0" />
                {isOpen && <span>Yêu Cầu</span>}
              </Link>
              <Link
                to="/admin/search-device"
                onClick={() => handleItemClick("search-device")}
                className={`flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-colors ${activeItem === "search-device"
                  ? "bg-blue-600 text-white font-medium"
                  : "text-blue-200 hover:bg-blue-800/40"
                  } ${!isOpen && "justify-center"}`}
                title={!isOpen ? "Tra Cứu Thiết Bị" : ""}
              >
                <Users className="w-4 h-4 flex-shrink-0" />
                {isOpen && <span>Tra Cứu Thiết Bị Của Khách Hàng</span>}
              </Link>
              <Link
                to="/admin/search-group"
                onClick={() => handleItemClick("search-group")}
                className={`flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-colors ${activeItem === "search-group"
                  ? "bg-blue-600 text-white font-medium"
                  : "text-blue-200 hover:bg-blue-800/40"
                  } ${!isOpen && "justify-center"}`}
                title={!isOpen ? "Tra   Cứu Nhóm" : ""}
              >
                <Users className="w-4 h-4 flex-shrink-0" />
                {isOpen && <span>Tra Cứu Nhóm Của Khách Hàng</span>}
              </Link>
              <Link
                to="/admin/search-customer-groups"
                onClick={() => handleItemClick("search-customer-groups")}
                className={`flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-colors ${activeItem === "search-customer-groups"
                  ? "bg-blue-600 text-white font-medium"
                  : "text-blue-200 hover:bg-blue-800/40"
                  } ${!isOpen && "justify-center"}`}
                title={!isOpen ? "Tra Cứu Nhóm Của Khách Hàng" : ""}
              >
                <Users className="w-4 h-4 flex-shrink-0" />
                {isOpen && <span>Tra Cứu Nhóm Của Khách Hàng</span>}
              </Link>
              <Link
                to="/admin/search-customer-houses"
                onClick={() => handleItemClick("search-customer-houses")}
                className={`flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-colors ${activeItem === "search-customer-houses"
                  ? "bg-blue-600 text-white font-medium"
                  : "text-blue-200 hover:bg-blue-800/40"
                  } ${!isOpen && "justify-center"}`}
                title={!isOpen ? "Tra Cứu Nhà Của Khách Hàng" : ""}
              >
                <Users className="w-4 h-4 flex-shrink-0" />
                {isOpen && <span>Tra Cứu Nhà Của Khách Hàng</span>}
              </Link>
              <Link
                to="/admin/search-customer-spaces"
                onClick={() => handleItemClick("search-customer-spaces")}
                className={`flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-colors ${activeItem === "search-customer-spaces"
                  ? "bg-blue-600 text-white font-medium"
                  : "text-blue-200 hover:bg-blue-800/40"
                  } ${!isOpen && "justify-center"}`}
                title={!isOpen ? "Tra Cứu Không Gian Của Khách Hàng" : ""}
              >
                <Users className="w-4 h-4 flex-shrink-0" />
                {isOpen && <span>Tra Cứu Không Gian Của Khách Hàng</span>}
              </Link>
              <Link
                to="/admin/search-customer-devices"
                onClick={() => handleItemClick("search-customer-devices")}
                className={`flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-colors ${activeItem === "search-customer-devices"
                  ? "bg-blue-600 text-white font-medium"
                  : "text-blue-200 hover:bg-blue-800/40"
                  } ${!isOpen && "justify-center"}`}
                title={!isOpen ? "Tra Cứu Thiết Bị Của Khách Hàng" : ""}
              >
                <Users className="w-4 h-4 flex-shrink-0" />
                {isOpen && <span>Tra Cứu Thiết Bị Của Khách Hàng</span>}
              </Link>
              <Link
                to="/admin/search-customer-info"
                onClick={() => handleItemClick("search-customer-info")}
                className={`flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-colors ${activeItem === "search-customer-info"
                  ? "bg-blue-600 text-white font-medium"
                  : "text-blue-200 hover:bg-blue-800/40"
                  } ${!isOpen && "justify-center"}`}
                title={!isOpen ? "Tra Cứu Thông Tin Của Khách Hàng" : ""}
              >
                <Users className="w-4 h-4 flex-shrink-0" />
                {isOpen && <span>Tra Cứu Thông Tin Của Khách Hàng</span>}
              </Link>
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
              <Link
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
              </Link>
              <Link
                href="/scenes"
                onClick={() => handleItemClick("scenes")}
                className={`flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-colors ${activeItem === "scenes"
                  ? "bg-blue-600 text-white font-medium"
                  : "text-blue-200 hover:bg-blue-800/40"
                  } ${!isOpen && "justify-center"}`}
                title={!isOpen ? "Cảnh" : ""}
              >
                <Thermometer className="w-4 h-4 flex-shrink-0" />
                {isOpen && <span>Cảnh</span>}
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar Footer */}
      <div className={`absolute bottom-0 left-0 right-0 border-t border-blue-800/50 p-4 ${!isOpen && "px-2"}`}>
        <div className="space-y-3">
          <Link
            href="/settings"
            onClick={() => handleItemClick("settings")}
            className={`flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg text-blue-200 hover:bg-blue-800/40 transition-colors ${!isOpen && "justify-center"}`}
            title={!isOpen ? "Cài đặt" : ""}
          >
            <Settings className="w-4 h-4 flex-shrink-0" />
            {isOpen && <span>Cài đặt</span>}
          </Link>
          <Link
            href="/help"
            onClick={() => handleItemClick("help")}
            className={`flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg text-blue-200 hover:bg-blue-800/40 transition-colors ${!isOpen && "justify-center"}`}
            title={!isOpen ? "Trợ giúp" : ""}
          >
            <HelpCircle className="w-4 h-4 flex-shrink-0" />
            {isOpen && <span>Trợ giúp</span>}
          </Link>
        </div>
      </div>
    </aside>
  )
}

export default SidebarAdmin