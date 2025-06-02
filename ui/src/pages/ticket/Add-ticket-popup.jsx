"use client"

import { useState } from "react"
import {
  X,
  Upload,
  Trash2,
  AlertTriangle,
  HelpCircle,
  Settings,
  Wifi,
  Lightbulb,
  Flame,
  Thermometer,
  Camera,
  Video,
  FileText,
  Smartphone,
  Plus,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export default function CreateTicketDialog({ onClose, onTicketCreated }) {
  const [formData, setFormData] = useState({
    device_id: "",
    ticket_type_id: "",
    title: "",
    description: "",
    priority: "medium",
  })
  const [attachments, setAttachments] = useState([])
  const [selectedDevice, setSelectedDevice] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Mock user devices
  const userDevices = [
    {
      id: 101,
      name: "Cảm biến khói phòng khách",
      serial: "SMOKE-2024-101",
      type: "smoke_detector",
      location: "Phòng khách",
      status: "online",
    },
    {
      id: 102,
      name: "Đèn thông minh phòng ngủ",
      serial: "LIGHT-2024-102",
      type: "smart_light",
      location: "Phòng ngủ",
      status: "online",
    },
    {
      id: 103,
      name: "Cảm biến nhiệt độ phòng khách",
      serial: "TEMP-2024-103",
      type: "temperature_sensor",
      location: "Phòng khách",
      status: "online",
    },
    {
      id: 104,
      name: "Khóa cửa thông minh",
      serial: "LOCK-2024-104",
      type: "smart_lock",
      location: "Cửa chính",
      status: "offline",
    },
    {
      id: 105,
      name: "Bộ điều khiển trung tâm",
      serial: "HUB-2024-105",
      type: "hub",
      location: "Phòng khách",
      status: "online",
    },
  ]

  const ticketTypes = [
    {
      id: 1,
      name: "Sự cố thiết bị",
      description: "Báo cáo khi thiết bị hoạt động không đúng",
      priority: "high",
      icon: AlertTriangle,
      examples: ["Thiết bị không hoạt động", "Báo động sai", "Hỏng hóc phần cứng"],
    },
    {
      id: 2,
      name: "Lỗi kết nối",
      description: "Báo cáo khi thiết bị không kết nối được",
      priority: "medium",
      icon: Wifi,
      examples: ["Mất kết nối WiFi", "Không kết nối được app", "Kết nối không ổn định"],
    },
    {
      id: 3,
      name: "Dữ liệu không chính xác",
      description: "Báo cáo khi thiết bị hiển thị dữ liệu sai",
      priority: "medium",
      icon: Settings,
      examples: ["Nhiệt độ sai", "Độ ẩm không đúng", "Dữ liệu bị lệch"],
    },
    {
      id: 4,
      name: "Yêu cầu hỗ trợ",
      description: "Yêu cầu hướng dẫn hoặc hỗ trợ sử dụng",
      priority: "low",
      icon: HelpCircle,
      examples: ["Hướng dẫn cài đặt", "Cách sử dụng tính năng", "Tư vấn thiết lập"],
    },
  ]

  const getDeviceIcon = (deviceType) => {
    switch (deviceType) {
      case "smart_light":
        return <Lightbulb className="h-4 w-4 text-amber-500" />
      case "smoke_detector":
        return <Flame className="h-4 w-4 text-red-500" />
      case "temperature_sensor":
        return <Thermometer className="h-4 w-4 text-blue-500" />
      case "hub":
        return <Wifi className="h-4 w-4 text-purple-500" />
      case "smart_lock":
        return <Settings className="h-4 w-4 text-green-500" />
      default:
        return <Smartphone className="h-4 w-4 text-slate-500" />
    }
  }

  const handleDeviceSelect = (device) => {
    setSelectedDevice(device)
    setFormData({ ...formData, device_id: device.id })
  }

  const handleTypeSelect = (typeId) => {
    const selectedType = ticketTypes.find((t) => t.id === typeId)
    setFormData({
      ...formData,
      ticket_type_id: typeId,
      priority: selectedType?.priority || "medium",
    })
  }

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files)
    const newAttachments = files.map((file) => ({
      id: Date.now() + Math.random(),
      file,
      name: file.name,
      size: (file.size / 1024).toFixed(1) + " KB",
      type: file.type.startsWith("image/") ? "image" : file.type.startsWith("video/") ? "video" : "file",
    }))
    setAttachments([...attachments, ...newAttachments])
  }

  const removeAttachment = (id) => {
    setAttachments(attachments.filter((att) => att.id !== id))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const selectedType = ticketTypes.find((t) => t.id === formData.ticket_type_id)

    const newTicket = {
      id: Date.now(),
      title: formData.title,
      description: formData.description,
      status: "open",
      priority: formData.priority,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user_id: 1,
      device: selectedDevice,
      ticket_type: selectedType,
      comments_count: 0,
      attachments_count: attachments.length,
      last_response: null,
    }

    onTicketCreated(newTicket)
    setIsSubmitting(false)
  }

  const isFormValid =
    formData.device_id && formData.ticket_type_id && formData.title.trim() && formData.description.trim()

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white rounded-lg overflow-hidden h-full">
      <ScrollArea className="h-full">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold mb-1">Tạo yêu cầu hỗ trợ mới</h2>
              <p className="text-blue-200 text-sm">Mô tả chi tiết vấn đề để được hỗ trợ nhanh chóng</p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/10 rounded-xl">
              <X className="h-5 w-5" />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Device Selection */}
            <div className="space-y-3">
              <Label className="text-white font-medium">Chọn thiết bị gặp vấn đề *</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {userDevices.map((device) => (
                  <div
                    key={device.id}
                    onClick={() => handleDeviceSelect(device)}
                    className={cn(
                      "p-4 rounded-xl border cursor-pointer transition-all duration-200",
                      selectedDevice?.id === device.id
                        ? "border-blue-500 bg-blue-500/10"
                        : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10",
                    )}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                        {getDeviceIcon(device.type)}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-white">{device.name}</h4>
                        <p className="text-sm text-blue-200">{device.location}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge
                            variant="secondary"
                            className={cn(
                              "text-xs",
                              device.status === "online"
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-red-100 text-red-700",
                            )}
                          >
                            {device.status === "online" ? "Trực tuyến" : "Ngoại tuyến"}
                          </Badge>
                          <span className="text-xs text-slate-400 font-mono">{device.serial}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Ticket Type Selection */}
            <div className="space-y-3">
              <Label className="text-white font-medium">Loại vấn đề *</Label>
              <div className="space-y-3">
                {ticketTypes.map((type) => {
                  const IconComponent = type.icon
                  return (
                    <div
                      key={type.id}
                      onClick={() => handleTypeSelect(type.id)}
                      className={cn(
                        "p-4 rounded-xl border cursor-pointer transition-all duration-200",
                        formData.ticket_type_id === type.id
                          ? "border-blue-500 bg-blue-500/10"
                          : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10",
                      )}
                    >
                      <div className="flex items-start space-x-3">
                        <IconComponent className="h-5 w-5 text-blue-400 mt-1" />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-medium text-white">{type.name}</h4>
                            <Badge
                              variant="secondary"
                              className={cn(
                                "text-xs",
                                type.priority === "high"
                                  ? "bg-red-100 text-red-700"
                                  : type.priority === "medium"
                                    ? "bg-amber-100 text-amber-700"
                                    : "bg-emerald-100 text-emerald-700",
                              )}
                            >
                              {type.priority === "high"
                                ? "Khẩn cấp"
                                : type.priority === "medium"
                                  ? "Quan trọng"
                                  : "Bình thường"}
                            </Badge>
                          </div>
                          <p className="text-sm text-blue-200 mb-2">{type.description}</p>
                          <div className="text-xs text-slate-400">
                            <span className="font-medium">Ví dụ: </span>
                            {type.examples.join(", ")}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Title */}
            <div className="space-y-3">
              <Label className="text-white font-medium">Tiêu đề vấn đề *</Label>
              <input
                type="text"
                placeholder="Ví dụ: Cảm biến khói báo động liên tục"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full h-12 px-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-3">
              <Label className="text-white font-medium">Mô tả chi tiết vấn đề *</Label>
              <Textarea
                placeholder="Hãy mô tả chi tiết vấn đề bạn đang gặp phải:&#10;- Thiết bị hoạt động như thế nào?&#10;- Khi nào xảy ra vấn đề?&#10;- Bạn đã thử làm gì?&#10;- Có thông báo lỗi nào không?"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/50 focus:border-blue-500 min-h-[120px] resize-none"
                required
              />
              <p className="text-xs text-blue-200">
                Mô tả càng chi tiết, kỹ thuật viên càng có thể hỗ trợ bạn nhanh chóng và chính xác hơn.
              </p>
            </div>

            {/* File Attachments */}
            <div className="space-y-3">
              <Label className="text-white font-medium">Đính kèm tài liệu (tùy chọn)</Label>
              <div className="border-2 border-dashed border-white/20 rounded-xl p-6 text-center">
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*,.pdf,.txt,.log"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                  <p className="text-white font-medium mb-1">Nhấn để chọn file</p>
                  <p className="text-sm text-blue-200">Hỗ trợ hình ảnh, video, PDF, TXT (tối đa 10MB mỗi file)</p>
                </label>
              </div>

              {/* Attachment List */}
              {attachments.length > 0 && (
                <div className="space-y-2">
                  {attachments.map((attachment) => (
                    <div key={attachment.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                      <div className="flex items-center space-x-3">
                        {attachment.type === "image" && <Camera className="h-4 w-4 text-blue-400" />}
                        {attachment.type === "video" && <Video className="h-4 w-4 text-purple-400" />}
                        {attachment.type === "file" && <FileText className="h-4 w-4 text-emerald-400" />}
                        <div>
                          <p className="text-sm font-medium text-white">{attachment.name}</p>
                          <p className="text-xs text-blue-200">{attachment.size}</p>
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
              <h4 className="text-blue-300 font-medium mb-2 flex items-center">
                <HelpCircle className="h-4 w-4 mr-2" />
                Mẹo để được hỗ trợ nhanh chóng
              </h4>
              <ul className="text-sm text-blue-200 space-y-1">
                <li>• Mô tả rõ ràng hiện tượng và thời điểm xảy ra</li>
                <li>• Đính kèm ảnh chụp màn hình hoặc video nếu có thể</li>
                <li>• Ghi rõ các bước bạn đã thử để khắc phục</li>
                <li>• Cung cấp thông tin về môi trường sử dụng (WiFi, điện áp...)</li>
              </ul>
            </div>

            {/* Submit Buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-white/10">
              <Button type="button" variant="ghost" onClick={onClose} className="text-white hover:bg-white/10">
                Hủy bỏ
              </Button>
              <Button
                type="submit"
                disabled={!isFormValid || isSubmitting}
                className="bg-blue-600 hover:bg-blue-700 text-white min-w-[120px]"
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
  )
}
