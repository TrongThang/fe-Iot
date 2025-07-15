"use client";

import { useState, useRef, useEffect } from "react";
import {
  X,
  Upload,
  Trash2,
  HelpCircle,
  Settings,
  Wifi,
  Lightbulb,
  Flame,
  Thermometer,
  Smartphone,
  Plus,
  Camera,
  Video,
  FileText,
  Shield,
  AlertTriangle,
  Share2,
  UserMinus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import DeviceShareModal from "@/components/common/devices/DeviceShareModal";
import SharedUsersList from "@/components/common/devices/SharedUsersList";

export default function CreateTicketDialog({ onClose, onTicketCreated }) {
  const [formData, setFormData] = useState({
    description: "",
    ticket_type_id: null,
    serial_number: "",
    assigned_to: "", // Thêm trường assigned_to
    permission_type: "", // Thêm trường permission_type cho chia sẻ
  });
  const [refreshSharedUsers, setRefreshSharedUsers] = useState(0);
  const [attachments, setAttachments] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userDevices, setUserDevices] = useState([]);
  const [ticketTypes, setTicketTypes] = useState([]);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);
  const accessToken = localStorage.getItem("authToken");
  const userId = localStorage.getItem("user"); // Giả định userId được lưu trong localStorage


  const fetchDevice = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_SMART_NET_IOT_API_URL}devices/account`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        console.log("User Devices:", data);
        setUserDevices(Array.isArray(data) ? data : []);
      } else {
        throw new Error(`Failed to fetch devices: ${response.status}`);
      }
    } catch (error) {
      console.error("Failed to fetch user devices:", error);
      toast.error("Không thể tải danh sách thiết bị. Vui lòng thử lại.", {
        duration: 5000,
      });
    }
  };

  const fetchTicketType = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_SMART_NET_IOT_API_URL}ticket-types`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200) {
        const data = await response.json();
        console.log("Ticket Types Data:", data);
        const activeTypes = (Array.isArray(data) ? data : []).filter(
          (type) =>
            type.is_active &&
            !type.is_deleted &&
            Number.isInteger(Number(type.ticket_type_id)) &&
            Number(type.ticket_type_id) > 0
        );
        console.log("Filtered Active Types:", activeTypes);
        setTicketTypes(activeTypes);
        if (activeTypes.length === 0) {
          toast.warning("Hiện không có loại yêu cầu nào khả dụng. Vui lòng liên hệ quản trị viên.", {
            duration: 5000,
          });
        }
      } else {
        throw new Error(`Failed to fetch ticket types: ${response.status}`);
      }
    } catch (error) {
      console.error("Failed to fetch ticket types:", error);
      toast.error("Không thể tải danh sách loại yêu cầu. Vui lòng thử lại.", {
        duration: 5000,
      });
    }
  };

  useEffect(() => {
    if (accessToken && userId) {
      fetchDevice();
      fetchTicketType();
    } else {
      toast.error("Vui lòng đăng nhập để tạo yêu cầu.", {
        duration: 5000,
      });
      onClose();
    }
  }, [accessToken, userId, onClose]);

  const getDeviceIcon = (category) => {
    switch (category?.toLowerCase()) {
      case "safety":
        return <Flame className="h-4 w-4 text-red-600" />;
      case "lighting":
        return <Lightbulb className="h-4 w-4 text-amber-600" />;
      case "temperature":
        return <Thermometer className="h-4 w-4 text-blue-600" />;
      case "hub":
        return <Wifi className="h-4 w-4 text-purple-600" />;
      case "lock":
        return <Settings className="h-4 w-4 text-green-600" />;
      default:
        return <Smartphone className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTicketTypeIcon = (typeName) => {
    switch (typeName.toLowerCase()) {
      case "bảo hành":
        return <Shield className="h-5 w-5 text-green-600 mt-1" />;
      case "mất thiết bị":
        return <AlertTriangle className="h-5 w-5 text-red-600 mt-1" />;
      case "nhượng quyền":
        return <UserMinus className="h-5 w-5 text-purple-600 mt-1" />;
      case "chia sẻ quyền":
        return <Share2 className="h-5 w-5 text-blue-600 mt-1" />;
      default:
        return <HelpCircle className="h-5 w-5 text-blue-600 mt-1" />;
    }
  };

  const getTicketTypeDescription = (typeName) => {
    switch (typeName.toLowerCase()) {
      case "bảo hành":
        return "Yêu cầu hỗ trợ sửa chữa hoặc thay thế thiết bị theo chính sách bảo hành.";
      case "mất thiết bị":
        return "Báo cáo thiết bị bị mất hoặc không thể truy cập.";
      case "nhượng quyền":
        return "Yêu cầu chuyển giao quyền sở hữu thiết bị cho người dùng khác.";
      case "chia sẻ quyền":
        return "Chia sẻ quyền xem hoặc điều khiển thiết bị với người dùng khác.";
      default:
        return "Mô tả vấn đề khác liên quan đến thiết bị.";
    }
  };

  const handleDeviceSelect = (device) => {
    setFormData({ ...formData, device_serial: device.serial_number });
    setErrors({ ...errors, device_serial: null });
  };

  const handleTypeSelect = (typeId) => {
    const parsedTypeId = Number(typeId);
    if (!isNaN(parsedTypeId) && parsedTypeId > 0) {
      console.log("Selected ticket_type_id:", parsedTypeId);
      setFormData({
        ...formData,
        ticket_type_id: parsedTypeId,
        assigned_to: "", // Reset assigned_to khi thay đổi ticket type
        permission_type: "", // Reset permission_type khi thay đổi ticket type
      });
      setErrors({ ...errors, ticket_type_id: null, assigned_to: null });
    } else {
      console.error("Invalid ticket_type_id:", typeId);
      setErrors({ ...errors, ticket_type_id: "Loại yêu cầu không hợp lệ." });
    }
  };

  const handleShareDevice = async (device, selectedUser, permissionLevel) => {
    try {
      console.log(`📤 Share permission request sent for device ${device.serial_number}:`, {
        user: selectedUser,
        permission: permissionLevel,
      });

      const response = await fetch("https://iothomeconnectapiv2-production.up.railway.app/api/tickets", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          device_serial: FormData?.serial_number,
          ticket_type_id: 4, // SHARE_PERMISSION t
          description: permissionLevel,
          assigned_to: selectedUser.account_id,
          permission_type: permissionLevel,
        }),
      });
      console.log("Share Device Response:", response);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to share device: ${response.status}`);
      }

      setRefreshSharedUsers((prev) => prev + 1);
      toast.success(`Yêu cầu chia sẻ quyền ${permissionLevel} đã được gửi đến ${selectedUser.name}`, {
        duration: 5000,
      });

      return { success: true };
    } catch (error) {
      console.error("❌ Failed to handle share device callback:", error);
      toast.error(error.message || "Không thể chia sẻ thiết bị. Vui lòng thử lại.", {
        duration: 5000,
      });
      throw error;
    }
  };

  const handleFranchiseDevice = async (device, selectedUser) => {
    try {
      console.log(`📤 Franchise request sent for device ${device.serial_number}:`, {
        user: selectedUser,
      });

      const response = await fetch("https://iothomeconnectapiv2-production.up.railway.app/api/tickets", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          device_serial: formData?.serial_number,
          ticket_type_id: 3, // FRANCHISE
          description: formData.description,
          assigned_to: selectedUser?.account_id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to franchise device: ${response.status}`);
      }

      toast.success(`Yêu cầu nhượng quyền thiết bị đã được gửi đến ${selectedUser.name}`, {
        duration: 5000,
      });

      return { success: true };
    } catch (error) {
      console.error("❌ Failed to handle franchise device callback:", error);
      toast.error(error.message || "Không thể nhượng quyền thiết bị. Vui lòng thử lại.", {
        duration: 5000,
      });
      throw error;
    }
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    const maxSize = 10 * 1024 * 1024; // 10MB
    const validFiles = files.filter((file) => {
      const isValidType = [
        "image/jpeg",
        "image/png",
        "video/mp4",
        "video/webm",
        "application/pdf",
        "text/plain",
        "text/x-log",
      ].includes(file.type);
      const isValidSize = file.size <= maxSize;
      return isValidType && isValidSize;
    });

    if (validFiles.length !== files.length) {
      toast.warning("Chỉ hỗ trợ JPG, PNG, MP4, WebM, PDF, TXT, hoặc LOG (tối đa 10MB mỗi file).", {
        duration: 5000,
      });
    }

    const newAttachments = validFiles.map((file) => ({
      id: Date.now() + Math.random(),
      file,
      name: file.name,
      size: (file.size / 1024).toFixed(1) + " KB",
      type: file.type.startsWith("image/")
        ? "image"
        : file.type.startsWith("video/")
          ? "video"
          : "file",
    }));
    setAttachments([...attachments, ...newAttachments]);
  };

  const removeAttachment = (id) => {
    setAttachments(attachments.filter((att) => att.id !== id));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.device_serial) {
      newErrors.device_serial = "Vui lòng chọn thiết bị.";
    }
    if (!formData.ticket_type_id || isNaN(formData.ticket_type_id)) {
      newErrors.ticket_type_id = "Vui lòng chọn loại vấn đề hợp lệ.";
    }
    if (!formData.description.trim() && formData.ticket_type_id !== 4) {
      newErrors.description = "Vui lòng nhập mô tả vấn đề.";
    }
    if ((formData.ticket_type_id === 3 || formData.ticket_type_id === 4) && !formData.assigned_to) {
      newErrors.assigned_to = "Vui lòng nhập ID người nhận.";
    }
    if (formData.ticket_type_id === 4 && !["VIEW", "CONTROL"].includes(formData.permission_type)) {
      newErrors.permission_type = "Vui lòng chọn quyền chia sẻ (VIEW hoặc CONTROL).";
    }

    setErrors(newErrors);
    console.log("Validation Errors:", newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setIsSubmitting(true);

    try {
      const evidence = {
        images: attachments
          .filter((att) => att.type === "image" || att.type === "video")
          .map((att) => att.name),
        logs: attachments
          .filter((att) => att.type === "file")
          .map((att) => att.name),
      };
      console.log("Evidence object:", evidence);

      const body = {
        user_id: userId,
        device_serial: formData.serial_number,
        ticket_type_id: Number(formData.ticket_type_id),
        description: formData.ticket_type_id === 4 ? formData.permission_type : formData.description,
        evidence,
        assigned_to: formData.assigned_to || undefined,
        permission_type: formData.ticket_type_id === 4 ? formData.permission_type : undefined,
      };
      console.log("JSON Body to send:", body);

      const response = await fetch(`${process.env.REACT_APP_SMART_NET_IOT_API_URL}tickets`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const responseData = await response.json();
      if (!response.ok) {
        console.error("API Error Response:", responseData);
        throw new Error(
          responseData.message || `Không thể tạo yêu cầu: ${response.status}`
        );
      }

      const newTicket = {
        ticket_id: responseData.data?.ticket_id || `TEMP-${Date.now()}`,
        device_serial: formData.serial_number,
        description: formData.description,
        status: responseData.data?.status || "pending",
        ticket_type_id: Number(formData.ticket_type_id),
        created_at: responseData.data?.created_at || new Date().toISOString(),
        updated_at: responseData.data?.updated_at || new Date().toISOString(),
        evidence: responseData.data?.evidence || { images: [], logs: [] },
        assigned_to: formData.assigned_to,
      };

      toast.success(`Yêu cầu hỗ trợ đã được tạo (ID: ${newTicket.ticket_id}).`, {
        duration: 1500,
        progress: true,
      });

      onTicketCreated(newTicket);
      onClose();
    } catch (error) {
      console.error("Failed to create ticket:", error);
      let errorMessage = "Không thể tạo yêu cầu. Vui lòng thử lại.";
      if (error.message.includes("Không tìm thấy tài khoản")) {
        errorMessage = "Tài khoản không tồn tại.";
      } else if (error.message.includes("Không tìm thấy thiết bị")) {
        errorMessage = "Thiết bị không tồn tại.";
      } else if (error.message.includes("Không tìm thấy loại vấn đề")) {
        errorMessage = "Loại yêu cầu không hợp lệ.";
      } else if (error.message.includes("Đã có yêu cầu nhượng quyền")) {
        errorMessage = "Đã có yêu cầu nhượng quyền cho thiết bị này.";
      } else if (error.message.includes("Bạn không thể nhượng quyền thiết bị cho chính mình")) {
        errorMessage = "Không thể nhượng quyền cho chính bạn.";
      } else if (error.message.includes("Bạn không có quyền chia sẻ thiết bị")) {
        errorMessage = "Bạn không có quyền chia sẻ thiết bị.";
      } else if (error.message.includes("Người được chia sẻ quyền phải là người ngoài nhóm")) {
        errorMessage = "Người nhận phải là người ngoài nhóm.";
      } else if (error.message.includes("Quyền chia sẻ không hợp lệ")) {
        errorMessage = "Quyền chia sẻ không hợp lệ (VIEW hoặc CONTROL).";
      } else if (error.message.includes("Tài khoản đã bị khóa")) {
        errorMessage = "Tài khoản người nhận đã bị khóa.";
      } else if (error.message.includes("Thiết bị đã bị khóa")) {
        errorMessage = "Thiết bị đã bị khóa.";
      } else if (error.message.includes("Bạn không phải là chủ sở hữu thiết bị")) {
        errorMessage = "Bạn không phải là chủ sở hữu thiết bị.";
      }
      toast.error(errorMessage, {
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden max-h-screen flex flex-col">
      <ScrollArea className="flex-1 overflow-auto">
        <div className="p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-1 text-gray-900">
                Tạo yêu cầu hỗ trợ mới
              </h2>
              <p className="text-gray-600 text-sm sm:text-base">
                Mô tả chi tiết vấn đề để được hỗ trợ nhanh chóng
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-gray-900 hover:bg-gray-100 rounded-xl"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label className="text-gray-900 font-medium text-sm sm:text-base">
                Chọn thiết bị gặp vấn đề *
              </Label>
              {errors.device_serial && (
                <p className="text-red-600 text-xs">{errors.device_serial}</p>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-64 overflow-y-auto pr-2">
                {userDevices.length === 0 && (
                  <p className="text-gray-600 text-sm">Không có thiết bị nào.</p>
                )}
                {userDevices.map((device) => (
                  <div
                    key={device.device_id}
                    onClick={() => handleDeviceSelect(device)}
                    className={cn(
                      "p-4 rounded-xl border cursor-pointer transition-all duration-200",
                      formData.device_serial === device.serial_number
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                    )}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                        {getDeviceIcon(device.capabilities?.base?.category)}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 text-sm sm:text-base">
                          {device.name || "Unknown Device"}
                        </h4>
                        <p className="text-xs text-gray-600">
                          Vị trí: {device.space_id || "Không xác định"}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          {device.status && (
                            <Badge
                              variant="secondary"
                              className={cn(
                                "text-xs",
                                device.status === "online"
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-red-100 text-red-700"
                              )}
                            >
                              {device.status === "online"
                                ? "Trực tuyến"
                                : "Ngoại tuyến"}
                            </Badge>
                          )}
                          <span className="text-xs text-gray-500 font-mono">
                            {device.serial_number}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-900 font-medium text-sm sm:text-base">
                Loại vấn đề *
              </Label>
              {errors.ticket_type_id && (
                <p className="text-red-600 text-xs">{errors.ticket_type_id}</p>
              )}
              <div className="space-y-3">
                {ticketTypes.length === 0 && (
                  <p className="text-gray-600 text-sm">
                    Không có loại yêu cầu nào khả dụng. Vui lòng liên hệ quản trị viên.
                  </p>
                )}
                {ticketTypes.map((type) => (
                  <div
                    key={type.ticket_type_id}
                    onClick={() => handleTypeSelect(type.ticket_type_id)}
                    className={cn(
                      "p-4 rounded-xl border cursor-pointer transition-all duration-200",
                      formData.ticket_type_id === type.ticket_type_id
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                    )}
                  >
                    <div className="flex items-start space-x-3">
                      {getTicketTypeIcon(type.type_name)}
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-medium text-gray-900 text-sm sm:text-base">
                            {type.type_name}
                          </h4>
                          <Badge
                            variant="secondary"
                            className={cn(
                              "text-xs",
                              type.priority === 1
                                ? "bg-red-100 text-red-700"
                                : type.priority === 2
                                  ? "bg-amber-100 text-amber-700"
                                  : "bg-emerald-100 text-emerald-700"
                            )}
                          >
                            {type.priority === 1
                              ? "Khẩn cấp"
                              : type.priority === 2
                                ? "Quan trọng"
                                : "Bình thường"}
                          </Badge>
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600">
                          {getTicketTypeDescription(type.type_name)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-900 font-medium text-sm sm:text-base">
                Mô tả chi tiết vấn đề {formData.ticket_type_id !== 4 && "*"}
              </Label>
              {errors.description && (
                <p className="text-red-600 text-xs">{errors.description}</p>
              )}
              <Textarea
                placeholder="Hãy mô tả chi tiết vấn đề bạn đang gặp phải:
- Thiết bị hoạt động như thế nào?
- Khi nào xảy ra vấn đề?
- Bạn đã thử làm gì?
- Có thông báo lỗi nào không?"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-blue-600 min-h-[120px] resize-none text-sm sm:text-base"
                required={formData.ticket_type_id !== 4}
              />
              <p className="text-xs text-gray-600">
                Mô tả càng chi tiết, kỹ thuật viên càng có thể hỗ trợ bạn nhanh chóng và chính xác hơn.
              </p>
            </div>

            {formData.ticket_type_id === 4 && (
              <div className="space-y-2">
                <Label className="text-gray-900 font-medium text-sm sm:text-base">
                  Quyền chia sẻ *
                </Label>
                {errors.permission_type && (
                  <p className="text-red-600 text-xs">{errors.permission_type}</p>
                )}
                <select
                  value={formData.permission_type}
                  onChange={(e) =>
                    setFormData({ ...formData, permission_type: e.target.value })
                  }
                  className="w-full p-2 border rounded text-sm text-gray-900 focus:border-blue-600"
                >
                  <option value="">Chọn quyền</option>
                  <option value="VIEW">Chỉ xem</option>
                  <option value="CONTROL">Điều khiển</option>
                </select>
              </div>
            )}

            <div className="space-y-2">
              <Label className="text-gray-900 font-medium text-sm sm:text-base">
                Đính kèm tài liệu (tùy chọn)
              </Label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*,.pdf,.txt,.log"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                  ref={fileInputRef}
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-gray-900 font-medium mb-1 text-sm sm:text-base">
                    Nhấn để chọn file
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Hỗ trợ hình ảnh, video, PDF, TXT (tối đa 10MB mỗi file)
                  </p>
                </label>
              </div>

              {attachments.length > 0 && (
                <div className="space-y-2 mt-3">
                  {attachments.map((attachment) => (
                    <div
                      key={attachment.id}
                      className="flex items-center justify-between p-3 bg-white rounded-xl"
                    >
                      <div className="flex items-center space-x-3">
                        {attachment.type === "image" && (
                          <Camera className="h-4 w-4 text-blue-600" />
                        )}
                        {attachment.type === "video" && (
                          <Video className="h-4 w-4 text-purple-600" />
                        )}
                        {attachment.type === "file" && (
                          <FileText className="h-4 w-4 text-emerald-600" />
                        )}
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {attachment.name}
                          </p>
                          <p className="text-xs text-gray-600">
                            {attachment.size}
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAttachment(attachment.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-100"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {(formData.ticket_type_id === 3 || formData.ticket_type_id === 4) && (
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold flex items-center">
                      {formData.ticket_type_id === 3 ? (
                        <UserMinus className="w-5 h-5 mr-2" />
                      ) : (
                        <Share2 className="w-5 h-5 mr-2" />
                      )}
                      {formData.ticket_type_id === 3 ? "Chia sẻ thiết bị" : "Nhượng quyền thiết bị"}
                    </h3>
                  </div>
                  <div className="space-y-4">
                    <p className="text-sm text-slate-600">
                      {formData.ticket_type_id === 3
                        ? "Chia sẻ quyền xem hoặc điều khiển thiết bị với người dùng khác."
                        : "Nhượng quyền thiết bị cho người dùng khác để chuyển giao quyền sở hữu."}
                    </p>
                    <DeviceShareModal
                      device={userDevices}
                      onShareDevice={formData.ticket_type_id === 3 ? handleFranchiseDevice : handleShareDevice}
                    />
                    {formData.ticket_type_id === 4 && formData.serial_number && (
                      <SharedUsersList
                        deviceSerial={formData.serial_number}
                        refreshTrigger={refreshSharedUsers}
                      />
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <h4 className="text-blue-700 font-medium mb-2 flex items-center text-sm sm:text-base">
                <HelpCircle className="h-4 w-4 mr-2" />
                Mẹo để được hỗ trợ nhanh chóng
              </h4>
              <ul className="text-xs sm:text-sm text-gray-600 space-y-1">
                <li>• Mô tả rõ ràng hiện tượng và thời điểm xảy ra</li>
                <li>• Đính kèm ảnh chụp màn hình hoặc video nếu có thể</li>
                <li>• Ghi rõ các bước bạn đã thử để khắc phục</li>
                <li>• Cung cấp thông tin về môi trường sử dụng (WiFi, điện áp...)</li>
              </ul>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                className="text-gray-900 hover:bg-gray-100 text-sm sm:text-base"
              >
                Hủy bỏ
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || ticketTypes.length === 0}
                className="bg-blue-600 hover:bg-blue-700 text-white min-w-[120px] text-sm sm:text-base disabled:bg-gray-400"
              >
                {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-gray-300 border-t-white rounded-full animate-spin" />
                    <span>Đang gửi...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Plus className="h-4 w-4" />
                    <span>Tạo yêu cầu</span>
                  </div>
                )}
              </Button>
            </div>
          </form>
        </div>
      </ScrollArea>
    </div>
  );
}