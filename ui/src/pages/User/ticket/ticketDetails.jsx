"use client"

import { useState } from "react"
import {
  X,
  MessageSquare,
  Paperclip,
  Send,
  Star,
  CheckCircle,
  FileText,
  Video,
  Camera,
  Clock,
  User,
  Settings,
  Copy,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

export default function TicketDetailDialog({
  ticket,
  onClose,
  getStatusIcon,
  getStatusColor,
  getStatusText,
  getPriorityColor,
  getPriorityText,
  getDeviceIcon,
  getTimeAgo,
  formatDate,
}) {
  const [newComment, setNewComment] = useState("")
  const [selectedRating, setSelectedRating] = useState(ticket.rating || 0)
  const [comments, setComments] = useState([
    {
      id: 1,
      author: "Nguyễn Văn Kỹ Thuật",
      author_type: "technician",
      content:
        "Chào bạn! Tôi đã nhận được yêu cầu hỗ trợ của bạn. Tôi sẽ kiểm tra thiết bị trong vòng 2 giờ tới và phản hồi lại.",
      created_at: "2024-05-30T09:15:00Z",
      attachments: [],
    },
    {
      id: 2,
      author: "Bạn",
      author_type: "customer",
      content: "Cảm ơn anh. Thiết bị vẫn đang báo sai liên tục. Tôi đã tắt tạm thời để tránh tiếng ồn.",
      created_at: "2024-05-30T09:45:00Z",
      attachments: [],
    },
  ])

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment = {
        id: comments.length + 1,
        author: "Bạn",
        author_type: "customer",
        content: newComment,
        created_at: new Date().toISOString(),
        attachments: [],
      }
      setComments([...comments, comment])
      setNewComment("")
    }
  }

  const handleRating = (rating) => {
    setSelectedRating(rating)
  }

  const renderStars = (interactive = false) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => interactive && handleRating(star)}
            disabled={!interactive}
            className={cn(
              "transition-colors",
              interactive ? "hover:text-yellow-500 cursor-pointer" : "cursor-default",
              star <= selectedRating ? "text-yellow-500" : "text-slate-300",
            )}
          >
            <Star className="h-5 w-5 fill-current" />
          </button>
        ))}
      </div>
    )
  }

  const getFileIcon = (type) => {
    switch (type) {
      case "pdf":
        return <FileText className="h-4 w-4 text-red-500" />
      case "image":
        return <Camera className="h-4 w-4 text-blue-500" />
      case "video":
        return <Video className="h-4 w-4 text-purple-500" />
      default:
        return <Paperclip className="h-4 w-4 text-slate-500" />
    }
  }

  const copyTicketId = () => {
    navigator.clipboard.writeText(`#${ticket.id}`)
  }

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white rounded-lg overflow-hidden h-full">
      <ScrollArea className="h-full">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">{getStatusIcon(ticket.status)}</div>
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <h2 className="text-xl font-bold">
                    #{ticket.id} - {ticket.title}
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={copyTicketId}
                    className="text-blue-300 hover:text-white hover:bg-white/10 h-auto p-1"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-blue-200 text-sm">Tạo lúc {formatDate(ticket.created_at)}</p>
              </div>
            </div>

            <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/10 rounded-xl">
              <X className="h-5 w-5" />
            </Button>
          </div>

          <Separator className="bg-white/10" />

          {/* Status and Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <div className="flex items-center justify-between">
                <span className="text-blue-200 text-sm">Trạng thái</span>
                <Badge variant="outline" className={cn("text-xs px-3 py-1", getStatusColor(ticket.status))}>
                  {getStatusText(ticket.status)}
                </Badge>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <div className="flex items-center justify-between">
                <span className="text-blue-200 text-sm">Mức độ</span>
                <Badge variant="outline" className={cn("text-xs px-3 py-1", getPriorityColor(ticket.priority))}>
                  {getPriorityText(ticket.priority)}
                </Badge>
              </div>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-blue-200">Tiến độ xử lý</span>
              <span className="text-white font-medium">
                {ticket.status === "open" && "Chờ tiếp nhận"}
                {ticket.status === "in_progress" && "Đang xử lý"}
                {ticket.status === "pending" && "Chờ phản hồi từ bạn"}
                {ticket.status === "resolved" && "Đã hoàn thành"}
                {ticket.status === "closed" && "Đã đóng"}
              </span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <div
                className={cn(
                  "h-2 rounded-full transition-all duration-500",
                  ticket.status === "open" && "bg-blue-500 w-1/4",
                  ticket.status === "in_progress" && "bg-amber-500 w-1/2",
                  ticket.status === "pending" && "bg-orange-500 w-3/4",
                  (ticket.status === "resolved" || ticket.status === "closed") && "bg-emerald-500 w-full",
                )}
              />
            </div>
          </div>

          {/* Problem Description */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <MessageSquare className="h-5 w-5 mr-2" />
              Mô tả vấn đề
            </h3>
            <div className="bg-white/5 rounded-xl p-4">
              <p className="text-white leading-relaxed">{ticket.description}</p>
            </div>
          </div>

          {/* Device Information */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              Thông tin thiết bị
            </h3>
            <div className="bg-white/5 rounded-xl p-4">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                  {getDeviceIcon(ticket.device.type)}
                </div>
                <div>
                  <h4 className="font-semibold text-white">{ticket.device.name}</h4>
                  <p className="text-sm text-blue-200">Vị trí: {ticket.device.location}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-blue-200 text-sm">Mã thiết bị</span>
                  <p className="font-mono text-sm">{ticket.device.serial}</p>
                </div>
                <div>
                  <span className="text-blue-200 text-sm">Loại thiết bị</span>
                  <p className="text-sm capitalize">{ticket.device.type.replace("_", " ")}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Resolution */}
          {ticket.resolution && (
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <CheckCircle className="h-5 w-5 mr-2 text-emerald-400" />
                Giải pháp đã thực hiện
              </h3>
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
                <p className="text-white leading-relaxed">{ticket.resolution}</p>
              </div>
            </div>
          )}

          {/* Rating Section */}
          {ticket.status === "resolved" && (
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Star className="h-5 w-5 mr-2 text-yellow-400" />
                Đánh giá dịch vụ
              </h3>
              <div className="bg-white/5 rounded-xl p-4">
                <p className="text-blue-200 text-sm mb-3">
                  {ticket.rating ? "Cảm ơn bạn đã đánh giá!" : "Hãy đánh giá chất lượng dịch vụ hỗ trợ:"}
                </p>
                <div className="flex items-center space-x-4">
                  {renderStars(!ticket.rating)}
                  {selectedRating > 0 && (
                    <span className="text-sm text-yellow-400">
                      {selectedRating === 1 && "Rất không hài lòng"}
                      {selectedRating === 2 && "Không hài lòng"}
                      {selectedRating === 3 && "Bình thường"}
                      {selectedRating === 4 && "Hài lòng"}
                      {selectedRating === 5 && "Rất hài lòng"}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Timeline */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Lịch sử xử lý
            </h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center mt-1">
                  <MessageSquare className="h-4 w-4 text-blue-400" />
                </div>
                <div>
                  <p className="font-medium">Yêu cầu được tạo</p>
                  <p className="text-sm text-blue-200">{formatDate(ticket.created_at)}</p>
                </div>
              </div>

              {ticket.status !== "open" && (
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-amber-500/20 rounded-lg flex items-center justify-center mt-1">
                    <User className="h-4 w-4 text-amber-400" />
                  </div>
                  <div>
                    <p className="font-medium">Được tiếp nhận xử lý</p>
                    <p className="text-sm text-blue-200">Kỹ thuật viên đã bắt đầu xử lý</p>
                  </div>
                </div>
              )}

              {(ticket.status === "resolved" || ticket.status === "closed") && (
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center mt-1">
                    <CheckCircle className="h-4 w-4 text-emerald-400" />
                  </div>
                  <div>
                    <p className="font-medium">Đã giải quyết</p>
                    <p className="text-sm text-blue-200">{formatDate(ticket.updated_at)}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Comments Section */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <MessageSquare className="h-5 w-5 mr-2" />
              Trao đổi với kỹ thuật viên ({comments.length})
            </h3>

            <div className="space-y-4 mb-6">
              {comments.map((comment) => (
                <div key={comment.id} className="bg-white/5 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div
                        className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold",
                          comment.author_type === "technician"
                            ? "bg-blue-500/20 text-blue-400"
                            : "bg-emerald-500/20 text-emerald-400",
                        )}
                      >
                        {comment.author.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium text-lg">{comment.author}</span>
                      <Badge
                        variant="secondary"
                        className={cn(
                          "text-xs",
                          comment.author_type === "technician"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-emerald-100 text-emerald-700",
                        )}
                      >
                        {comment.author_type === "technician" ? "Kỹ thuật viên" : "Bạn"}
                      </Badge>
                    </div>
                    <span className="text-xs text-blue-200">{getTimeAgo(comment.created_at)}</span>
                  </div>
                  <p className="text-white leading-relaxed mb-3 text-lg">{comment.content}</p>
                  {comment.attachments.length > 0 && (
                    <div className="space-y-2">
                      {comment.attachments.map((attachment, index) => (
                        <div key={index} className="flex items-center space-x-2 text-sm">
                          {getFileIcon(attachment.type)}
                          <span>{attachment.name}</span>
                          <span className="text-blue-200">({attachment.size})</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Add Comment - Only if not closed */}
            {ticket.status !== "closed" && (
              <div className="space-y-3">
                <Textarea
                  placeholder="Nhập tin nhắn của bạn..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/50 focus:border-blue-500 resize-none"
                  rows={3}
                />
                <div className="flex items-center justify-between">
                  <Button variant="ghost" size="sm" className="text-blue-300 hover:text-white hover:bg-white/10">
                    <Paperclip className="h-4 w-4 mr-2" />
                    Đính kèm file
                  </Button>
                  <Button
                    onClick={handleAddComment}
                    disabled={!newComment.trim()}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Gửi tin nhắn
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
