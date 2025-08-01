"use client";

import { useState, useEffect } from "react";
import {
  X,
  Eye,
  EyeOff,
  Trash2,
  Clock,
  User,
  Settings,
  AlertTriangle,
  CheckCircle,
  Info,
  Copy,
  ExternalLink,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export default function NotificationDetail({
  notification,
  onClose,
  onMarkAsRead,
  onMarkAsUnread,
  onDelete,
  getNotificationIcon,
  getDeviceIcon,
  getPriorityColor,
  getCategoryColor,
  getTimeAgo,
}) {
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const getTypeDescription = (type) => {
    switch (type) {
      case "device_alert":
        return "Cảnh báo nghiêm trọng từ thiết bị yêu cầu xử lý ngay lập tức";
      case "device_warning":
        return "Cảnh báo từ thiết bị cần được chú ý";
      case "device_status":
        return "Thông báo trạng thái hoạt động của thiết bị";
      case "device_offline":
        return "Thiết bị mất kết nối với hệ thống";
      case "device_maintenance":
        return "Thông báo bảo trì và bảo dưỡng thiết bị";
      case "system_update":
        return "Cập nhật hệ thống và firmware";
      case "system_info":
        return "Thông tin chung về hệ thống";
      case "security_alert":
        return "Cảnh báo bảo mật hệ thống";
      default:
        return "Thông báo chung";
    }
  };

  const getActionSuggestions = (type, deviceInfo) => {
    switch (type) {
      case "device_alert":
        return ["Kiểm tra thiết bị ngay lập tức", "Liên hệ kỹ thuật viên nếu cần", "Tạm thời tắt thiết bị nếu an toàn"];
      case "device_warning":
        return ["Theo dõi thiết bị trong 24h tới", "Kiểm tra cài đặt thiết bị", "Lên lịch bảo trì định kỳ"];
      case "device_offline":
        return ["Kiểm tra kết nối WiFi", "Khởi động lại thiết bị", "Kiểm tra router và modem"];
      case "device_maintenance":
        return ["Thay pin nếu cần", "Vệ sinh thiết bị", "Cập nhật firmware"];
      case "security_alert":
        return ["Thay đổi mật khẩu ngay", "Kiểm tra log đăng nhập", "Bật xác thực 2 yếu tố"];
      default:
        return ["Xem chi tiết thông báo", "Đánh dấu đã xử lý"];
    }
  };

  if (!notification) {
    return (
      <div className="bg-white rounded-lg h-full flex items-center justify-center">
        <p className="text-red-600">Không tìm thấy thông báo.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg overflow-hidden h-full">
      <ScrollArea className="h-full">
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">{getNotificationIcon(notification.type, notification.priority)}</div>
              <div>
                <h2 className="text-xl font-bold mb-1 text-gray-900">Chi tiết thông báo</h2>
                <p className="text-gray-600 text-sm">ID: {notification.id}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-gray-900 hover:bg-gray-100 rounded-xl">
                    <MoreHorizontal className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white text-gray-900 border-gray-200">
                  {notification.is_read ? (
                    <DropdownMenuItem onClick={() => onMarkAsUnread(notification.id)}>
                      <EyeOff className="h-4 w-4 mr-2" />
                      Đánh dấu chưa đọc
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem onClick={() => onMarkAsRead(notification.id)}>
                      <Eye className="h-4 w-4 mr-2" />
                      Đánh dấu đã đọc
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={() => copyToClipboard(notification.text)}>
                    <Copy className="h-4 w-4 mr-2" />
                    Sao chép nội dung
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDelete(notification.id)} className="text-red-600">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Xóa thông báo
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-900 hover:bg-gray-100 rounded-xl">
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <Separator className="bg-gray-200" />

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 text-sm">Mức độ ưu tiên</span>
                <Badge variant="outline" className={cn("text-xs px-3 py-1", getPriorityColor(notification.priority))}>
                  {notification.priority === "high" && "Cao"}
                  {notification.priority === "medium" && "Trung bình"}
                  {notification.priority === "low" && "Thấp"}
                </Badge>
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 text-sm">Danh mục</span>
                <Badge variant="secondary" className={cn("text-xs px-3 py-1", getCategoryColor(notification.category))}>
                  {notification.category === "safety" && "An toàn"}
                  {notification.category === "security" && "Bảo mật"}
                  {notification.category === "environment" && "Môi trường"}
                  {notification.category === "automation" && "Tự động"}
                  {notification.category === "maintenance" && "Bảo trì"}
                  {notification.category === "connectivity" && "Kết nối"}
                  {notification.category === "system" && "Hệ thống"}
                </Badge>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
            <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-900">
              <Info className="h-5 w-5 mr-2" />
              Nội dung thông báo
            </h3>
            <div className="bg-white rounded-xl p-4 mb-4">
              <p className="text-gray-900 leading-relaxed text-base">{notification.text}</p>
            </div>
            <div className="text-sm text-gray-600">
              <p className="mb-2">
                <strong>Loại thông báo:</strong> {getTypeDescription(notification.type)}
              </p>
              <p>
                <strong>Trạng thái:</strong>{" "}
                <span className={notification.is_read ? "text-emerald-600" : "text-amber-600"}>
                  {notification.is_read ? "Đã đọc" : "Chưa đọc"}
                </span>
              </p>
            </div>
          </div>

          {notification.device_info && (
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-900">
                <Settings className="h-5 w-5 mr-2" />
                Thông tin thiết bị
              </h3>
              <div className="bg-white rounded-xl p-4">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                    {getDeviceIcon(notification.device_info.device_type)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-lg">{notification.device_info.device_name}</h4>
                    <p className="text-sm text-gray-600 font-mono">{notification.device_info.serial_number}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-gray-600 text-sm">Device ID</span>
                    <p className="font-mono text-sm">{notification.device_info.device_id || "N/A"}</p>
                  </div>
                  <div>
                    <span className="text-gray-600 text-sm">Loại thiết bị</span>
                    <p className="text-sm capitalize">{notification.device_info.device_type}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="mt-4 border-gray-200 text-gray-900 hover:bg-gray-100">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Xem chi tiết thiết bị
                </Button>
              </div>
            </div>
          )}

          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
            <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-900">
              <User className="h-5 w-5 mr-2" />
              Thông tin tài khoản
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-xl p-4">
                <span className="text-gray-600 text-sm">Account ID</span>
                <p className="font-mono text-sm">{notification.account_id}</p>
              </div>
              <div className="bg-white rounded-xl p-4">
                <span className="text-gray-600 text-sm">Vai trò</span>
                <p className="text-sm">
                  {notification.role_id === 1 && "Admin"}
                  {notification.role_id === 2 && "User"}
                  {notification.role_id === 3 && "Guest"}
                  {notification.role_id === null && "System"}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
            <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-900">
              <Clock className="h-5 w-5 mr-2" />
              Thời gian
            </h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mt-1">
                  <Clock className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-lg text-gray-900">Thông báo được tạo</p>
                  <p className="text-sm text-gray-600">
                    {new Date(notification.created_at).toLocaleString("vi-VN")} ({getTimeAgo(notification.created_at)})
                  </p>
                </div>
              </div>
              {notification.updated_at && notification.updated_at !== notification.created_at && (
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center mt-1">
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Cập nhật lần cuối</p>
                    <p className="text-sm text-gray-600">
                      {new Date(notification.updated_at).toLocaleString("vi-VN")} ({getTimeAgo(notification.updated_at)})
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}