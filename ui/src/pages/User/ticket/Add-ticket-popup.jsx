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
  Share2,
  Shield,
  AlertTriangle,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import Swal from "sweetalert2";

export default function CreateTicketDialog({ onClose, onTicketCreated }) {
  const [formData, setFormData] = useState({
    description: "",
    ticket_type_id: null,
    device_serial: "",
  });
  const [attachments, setAttachments] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userDevices, setUserDevices] = useState([]);
  const [ticketTypes, setTicketTypes] = useState([]);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);
  const accessToken = localStorage.getItem("authToken");

  // Fetch user devices
  const fetchDevice = async () => {
    try {
      const response = await fetch("http://localhost:7777/api/devices/account", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        console.log("User Devices:", data);
        setUserDevices(data ? data : []);
      } else {
        throw new Error(`Failed to fetch devices: ${response.status}`);
      }
    } catch (error) {
      console.error("Failed to fetch user devices:", error);
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Không thể tải danh sách thiết bị. Vui lòng thử lại.",
        confirmButtonColor: "#2563eb",
      });
    }
  };

  // Fetch ticket types
  const fetchTicketType = async () => {
    try {
      const response = await fetch("http://localhost:7777/api/ticket-types", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        console.log("Ticket Types Data:", data);
        const activeTypes = (data ? data : []).filter(
          (type) =>
            type.is_active &&
            !type.is_deleted &&
            Number.isInteger(Number(type.ticket_type_id)) &&
            Number(type.ticket_type_id) > 0
        );
        console.log("Filtered Active Types:", activeTypes);
        setTicketTypes(activeTypes);
        if (activeTypes.length === 0) {
          Swal.fire({
            icon: "warning",
            title: "Không có loại yêu cầu",
            text: "Hiện không có loại yêu cầu nào khả dụng. Vui lòng liên hệ quản trị viên.",
            confirmButtonColor: "#2563eb",
          });
        }
      } else {
        throw new Error(`Failed to fetch ticket types: ${response.status}`);
      }
    } catch (error) {
      console.error("Failed to fetch ticket types:", error);
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Không thể tải danh sách loại yêu cầu. Vui lòng thử lại.",
        confirmButtonColor: "#2563eb",
      });
    }
  };

  useEffect(() => {
    if (accessToken) {
      fetchDevice();
      fetchTicketType();
    } else {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Vui lòng đăng nhập để tạo yêu cầu.",
        confirmButtonColor: "#2563eb",
      });
      onClose();
    }
  }, [accessToken, onClose]);

  const getDeviceIcon = (category) => {
    switch (category?.toLowerCase()) {
      case "safety":
        return <Flame className="h-4 w-4 text-red-500" />;
      case "lighting":
        return <Lightbulb className="h-4 w-4 text-amber-500" />;
      case "temperature":
        return <Thermometer className="h-4 w-4 text-blue-500" />;
      case "hub":
        return <Wifi className="h-4 w-4 text-purple-500" />;
      case "lock":
        return <Settings className="h-4 w-4 text-green-500" />;
      default:
        return <Smartphone className="h-4 w-4 text-slate-500" />;
    }
  };

  const getTicketTypeIcon = (typeName) => {
    switch (typeName.toLowerCase()) {
      case "nhượng quyền thiết bị":
        return <Share2 className="h-5 w-5 text-blue-400 mt-1" />;
      case "bảo hành":
        return <Shield className="h-5 w-5 text-green-400 mt-1" />;
      case "mất thiết bị":
        return <AlertTriangle className="h-5 w-5 text-red-400 mt-1" />;
      case "chia sẻ quyền":
        return <Package className="h-5 w-5 text-purple-400 mt-1" />;
      default:
        return <HelpCircle className="h-5 w-5 text-blue-400 mt-1" />;
    }
  };

  const getTicketTypeDescription = (typeName) => {
    switch (typeName.toLowerCase()) {
      case "nhượng quyền thiết bị":
        return "Yêu cầu chuyển giao quyền sở hữu thiết bị cho người dùng khác.";
      case "bảo hành":
        return "Yêu cầu hỗ trợ sửa chữa hoặc thay thế thiết bị theo chính sách bảo hành.";
      case "mất thiết bị":
        return "Báo cáo thiết bị bị mất hoặc không thể truy cập.";
      case "chia sẻ quyền":
        return "Yêu cầu cấp quyền sử dụng thiết bị cho người dùng khác.";
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
      setFormData({ ...formData, ticket_type_id: parsedTypeId });
      setErrors({ ...errors, ticket_type_id: null });
    } else {
      console.error("Invalid ticket_type_id:", typeId);
      setErrors({ ...errors, ticket_type_id: "Loại yêu cầu không hợp lệ." });
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
      Swal.fire({
        icon: "warning",
        title: "File không hợp lệ",
        text: "Chỉ hỗ trợ JPG, PNG, MP4, WebM, PDF, TXT, hoặc LOG (tối đa 10MB mỗi file).",
        confirmButtonColor: "#2563eb",
      });
    }

    const newAttachments = validFiles.map((file) => ({
      id: Date.now() + Math.random(),
      file, // The File object
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
    if (!formData.description.trim()) {
      newErrors.description = "Vui lòng nhập mô tả vấn đề.";
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
      // Prepare the evidence object
      const evidence = {
        images: attachments
          .filter((att) => att.type === "image" || att.type === "video")
          .map((att) => att.name),
        logs: attachments
          .filter((att) => att.type === "file")
          .map((att) => att.name),
      };
      console.log("Evidence object:", evidence);

      let response;
      if (attachments.length > 0) {
        // Use FormData for requests with attachments
        const formDataToSend = {
          description: formData.description,
          ticket_type_id: Number(formData.ticket_type_id),
          device_serial: formData.device_serial,
          evidence: evidence,
        }

        response = await fetch("http://localhost:7777/api/tickets", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formDataToSend),
        });
      } else {
        // Use JSON for requests without attachments
        const body = {
          description: formData.description,
          ticket_type_id: Number(formData.ticket_type_id),
          device_serial: formData.device_serial,
          evidence,
        };
        console.log("JSON Body to send:", body);

        response = await fetch("http://localhost:7777/api/tickets", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });
      }

      const responseData = await response.json();
      if (!response.ok) {
        console.error("API Error Response:", responseData);
        throw new Error(
          responseData.message || `Không thể tạo yêu cầu: ${response.status}`
        );
      }

      const newTicket = {
        ticket_id: responseData.data?.ticket_id || `TEMP-${Date.now()}`,
        device_serial: formData.device_serial,
        description: formData.description,
        status: responseData.data?.status || "pending",
        ticket_type_id: Number(formData.ticket_type_id),
        created_at: responseData.data?.created_at || new Date().toISOString(),
        updated_at: responseData.data?.updated_at || new Date().toISOString(),
        evidence: responseData.data?.evidence || { images: [], logs: [] },
      };

      Swal.fire({
        icon: "success",
        title: "Thành công",
        text: `Yêu cầu hỗ trợ đã được tạo (ID: ${newTicket.ticket_id}).`,
        confirmButtonColor: "#2563eb",
        timer: 1500,
        timerProgressBar: true,
      });

      onTicketCreated(newTicket);
      onClose();
    } catch (error) {
      console.error("Failed to create ticket:", error);
      let errorMessage = "Không thể tạo yêu cầu. Vui lòng thử lại.";
      if (error.message.includes("400")) {
        errorMessage = "Dữ liệu không hợp lệ. Vui lòng kiểm tra lại thông tin.";
      } else if (error.message.includes("401")) {
        errorMessage = "Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.";
      } else if (error.message.includes("403")) {
        errorMessage = "Bạn không có quyền tạo yêu cầu này.";
      }
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: errorMessage,
        confirmButtonColor: "#2563eb",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Rest of the JSX remains the same
  // [Your existing JSX code here]
  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white rounded-lg overflow-hidden max-h-screen flex flex-col">
      <ScrollArea className="flex-1 overflow-auto">
        <div className="p-6 sm:p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-1">
                Tạo yêu cầu hỗ trợ mới
              </h2>
              <p className="text-blue-200 text-sm sm:text-base">
                Mô tả chi tiết vấn đề để được hỗ trợ nhanh chóng
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-white hover:bg-white/10 rounded-xl"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Device Selection */}
            <div className="space-y-2">
              <Label className="text-white font-medium text-sm sm:text-base">
                Chọn thiết bị gặp vấn đề *
              </Label>
              {errors.device_serial && (
                <p className="text-red-400 text-xs">{errors.device_serial}</p>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-64 overflow-y-auto pr-2">
                {userDevices.length === 0 && (
                  <p className="text-blue-200 text-sm">Không có thiết bị nào.</p>
                )}
                {userDevices.map((device) => (
                  <div
                    key={device.device_id}
                    onClick={() => handleDeviceSelect(device)}
                    className={cn(
                      "p-4 rounded-xl border cursor-pointer transition-all duration-200",
                      formData.device_serial === device.serial_number
                        ? "border-blue-500 bg-blue-500/10"
                        : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
                    )}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                        {getDeviceIcon(device.capabilities?.base?.category)}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-white text-sm sm:text-base">
                          {device.name || "Unknown Device"}
                        </h4>
                        <p className="text-xs text-blue-200">
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
                          <span className="text-xs text-slate-400 font-mono">
                            {device.serial_number}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Ticket Type Selection */}
            <div className="space-y-2">
              <Label className="text-white font-medium text-sm sm:text-base">
                Loại vấn đề *
              </Label>
              {errors.ticket_type_id && (
                <p className="text-red-400 text-xs">{errors.ticket_type_id}</p>
              )}
              <div className="space-y-3">
                {ticketTypes.length === 0 && (
                  <p className="text-blue-200 text-sm">
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
                        ? "border-blue-500 bg-blue-500/10"
                        : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
                    )}
                  >
                    <div className="flex items-start space-x-3">
                      {getTicketTypeIcon(type.type_name)}
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-medium text-white text-sm sm:text-base">
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
                        <p className="text-xs sm:text-sm text-blue-200">
                          {getTicketTypeDescription(type.type_name)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label className="text-white font-medium text-sm sm:text-base">
                Mô tả chi tiết vấn đề *
              </Label>
              {errors.description && (
                <p className="text-red-400 text-xs">{errors.description}</p>
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
                className="bg-white/5 border-white/10 text-white placeholder:text-white/50 focus:border-blue-500 min-h-[120px] resize-none text-sm sm:text-base"
                required
              />
              <p className="text-xs text-blue-200">
                Mô tả càng chi tiết, kỹ thuật viên càng có thể hỗ trợ bạn nhanh chóng và chính xác hơn.
              </p>
            </div>

            {/* File Attachments */}
            <div className="space-y-2">
              <Label className="text-white font-medium text-sm sm:text-base">
                Đính kèm tài liệu (tùy chọn)
              </Label>
              <div className="border-2 border-dashed border-white/20 rounded-xl p-6 text-center">
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
                  <Upload className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                  <p className="text-white font-medium mb-1 text-sm sm:text-base">
                    Nhấn để chọn file
                  </p>
                  <p className="text-xs sm:text-sm text-blue-200">
                    Hỗ trợ hình ảnh, video, PDF, TXT (tối đa 10MB mỗi file)
                  </p>
                </label>
              </div>

              {/* Attachment List */}
              {attachments.length > 0 && (
                <div className="space-y-2 mt-3">
                  {attachments.map((attachment) => (
                    <div
                      key={attachment.id}
                      className="flex items-center justify-between p-3 bg-white/5 rounded-xl"
                    >
                      <div className="flex items-center space-x-3">
                        {attachment.type === "image" && (
                          <Camera className="h-4 w-4 text-blue-400" />
                        )}
                        {attachment.type === "video" && (
                          <Video className="h-4 w-4 text-purple-400" />
                        )}
                        {attachment.type === "file" && (
                          <FileText className="h-4 w-4 text-emerald-400" />
                        )}
                        <div>
                          <p className="text-sm font-medium text-white">
                            {attachment.name}
                          </p>
                          <p className="text-xs text-blue-200">
                            {attachment.size}
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAttachment(attachment.id)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Tips */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
              <h4 className="text-blue-300 font-medium mb-2 flex items-center text-sm sm:text-base">
                <HelpCircle className="h-4 w-4 mr-2" />
                Mẹo để được hỗ trợ nhanh chóng
              </h4>
              <ul className="text-xs sm:text-sm text-blue-200 space-y-1">
                <li>• Mô tả rõ ràng hiện tượng và thời điểm xảy ra</li>
                <li>• Đính kèm ảnh chụp màn hình hoặc video nếu có thể</li>
                <li>• Ghi rõ các bước bạn đã thử để khắc phục</li>
                <li>• Cung cấp thông tin về môi trường sử dụng (WiFi, điện áp...)</li>
              </ul>
            </div>

            {/* Submit Buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-white/10">
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                className="text-white hover:bg-white/10 text-sm sm:text-base"
              >
                Hủy bỏ
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || ticketTypes.length === 0}
                className="bg-blue-600 hover:bg-blue-700 text-white min-w-[120px] text-sm sm:text-base disabled:bg-gray-600"
              >
                {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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