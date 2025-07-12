"use client"

import { useState, useEffect } from "react"
import {
  Users,
  Package,
  HelpCircle,
  ChevronDown,
  LayoutDashboard,
  Gauge,
  Lightbulb,
  Thermometer,
  Settings,
  Clock,
  HomeIcon as House,
  LayoutGrid,
} from "lucide-react"
import { useSidebar } from "./contexts/Sidebar-context"
import logo from "@/assets/img/icon-smarthomesolutions.jpg"
import '@/assets/css/globals.css'
import { Link } from "react-router-dom"

const SidebarUser = () => {
  const { isOpen } = useSidebar()
  const [isOverviewOpen, setIsOverviewOpen] = useState(true)
  const [isManagementOpen, setIsManagementOpen] = useState(true)
  const [isAutomationOpen, setIsAutomationOpen] = useState(false)

  // Function to determine the initial active item based on the current URL
  const getInitialActiveItem = () => {
    const path = window.location.pathname
    if (path === "/") return "dashboard"
    if (path === "/notifications") return "notifications"
    if (path === "/ticket") return "ticket"
    if (path === "/groups") return "groups"
    if (path === "/schedules") return "schedules"
    if (path === "/scenes") return "scenes"
    if (path === "/alerts") return "alerts"
    if (path === "/settings") return "settings"
    if (path === "/help") return "help"
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
              to="/"
              onClick={() => handleItemClick("dashboard")}
              className={`flex items-center gap-3 transition-colors ${activeItem === "dashboard" ? " text-white font-medium" : "text-blue-200 hover:bg-blue-800/40"
                } ${!isOpen && "justify-center"}`}
              title={!isOpen ? "Dashboard" : ""}
            >
              <img src={logo || "/placeholder.svg"} alt="" className="rounded-lg" height={50} width={150} />
            </Link>
          </div>
          {isOpen && (
            <div className="overflow-hidden">
              <h2 className="font-bold text-lg text-white">HomeConnect</h2>
              <p className="text-xs text-blue-300 whitespace-nowrap">
                a product by <br></br>
                smartNet Solutions
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar Content with Custom Scrollbar */}
      <div className={`py-4 h-[calc(100vh-250px)] overflow-y-auto custom-scrollbar ${isOpen ? "px-3" : "px-2"}`}>
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
                to="/"
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
                to="/devices"
                onClick={() => handleItemClick("devices")}
                className={`flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-colors ${activeItem === "devices" ? "bg-blue-600 text-white font-medium" : "text-blue-200 hover:bg-blue-800/40"
                  } ${!isOpen && "justify-center"}`}
                title={!isOpen ? "Thiết bị" : ""}
              >
                <Lightbulb className="w-4 h-4 flex-shrink-0" />
                {isOpen && <span>Thiết bị</span>}
              </Link>
              <Link
                to="/groups"
                onClick={() => handleItemClick("groups")}
                className={`flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-colors ${activeItem === "groups" ? "bg-blue-600 text-white font-medium" : "text-blue-200 hover:bg-blue-800/40"
                  } ${!isOpen && "justify-center"}`}
                title={!isOpen ? "Nhóm" : ""}
              >
                <Users className="w-4 h-4 flex-shrink-0" />
                {isOpen && <span>Nhóm</span>}
              </Link>
              <Link
                to="/notifications"
                onClick={() => handleItemClick("notifications")}
                className={`flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-colors ${activeItem === "notifications"
                    ? "bg-blue-600 text-white font-medium"
                    : "text-blue-200 hover:bg-blue-800/40"
                  } ${!isOpen && "justify-center"}`}
                title={!isOpen ? "Thông báo" : ""}
              >
                <Package className="w-4 h-4 flex-shrink-0" />
                {isOpen && <span>Thông báo</span>}
              </Link>
              <Link
                to="/ticket"
                onClick={() => handleItemClick("ticket")}
                className={`flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-colors ${activeItem === "ticket" ? "bg-blue-600 text-white font-medium" : "text-blue-200 hover:bg-blue-800/40"
                  } ${!isOpen && "justify-center"}`}
                title={!isOpen ? "Yêu Cầu" : ""}
              >
                <Lightbulb className="w-4 h-4 flex-shrink-0" />
                {isOpen && <span>Yêu Cầu</span>}
              </Link>
            </div>
          )}
        </div>

      </div>

      {/* Sidebar Footer */}
      <div className={`absolute bottom-0 left-0 right-0 border-t border-blue-800/50 p-4 ${!isOpen && "px-2"}`}>
        <div className="space-y-3">
          <Link
            to="/settings"
            onClick={() => handleItemClick("settings")}
            className={`flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg text-blue-200 hover:bg-blue-800/40 transition-colors ${!isOpen && "justify-center"}`}
            title={!isOpen ? "Cài đặt" : ""}
          >
            <Settings className="w-4 h-4 flex-shrink-0" />
            {isOpen && <span>Cài đặt</span>}
          </Link>
        </div>
      </div>


    </aside>
  )
}

export default SidebarUser
