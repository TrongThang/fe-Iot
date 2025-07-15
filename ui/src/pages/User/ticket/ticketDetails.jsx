"use client";

import { useState, useEffect } from "react";
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
  Copy,
  Smartphone,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

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
}) {
  const [newComment, setNewComment] = useState("");
  const [selectedRating, setSelectedRating] = useState(ticket?.rating || 0);
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchComments = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `${process.env.REACT_APP_SMART_NET_IOT_API_URL}/api/tickets/${ticket?.ticket_id}/comments`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setComments(data.data?.comments || []);
        } else {
        }
      } catch (error) {
        console.error("Failed to fetch comments:", error);
        toast.error("Không thể tải bình luận. Vui lòng thử lại.", {
          duration: 5000,
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (ticket?.ticket_id) {
      fetchComments();
    } else {
      setIsLoading(false);
    }
  }, [ticket?.ticket_id]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    const result = await toast.custom((t) => (
      <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-blue-600 mb-2">Xác nhận</h3>
        <p className="text-sm text-gray-600 mb-4">Bạn có chắc muốn gửi bình luận này?</p>
        <div className="flex justify-end space-x-2">
          <Button
            variant="outline"
            onClick={() => toast.dismiss(t)}
            className="bg-red-600 text-white hover:bg-red-700"
          >
            Hủy
          </Button>
          <Button
            variant="default"
            onClick={async () => {
              toast.dismiss(t);
              const comment = {
                id: comments.length + 1,
                author: "Bạn",
                author_type: "customer",
                content: newComment,
                created_at: new Date().toISOString(),
                attachments: [],
              };
              setComments([...comments, comment]);
              setNewComment("");
              toast.success("Bình luận đã được gửi.", {
                duration: 1500,
                progress: true,
              });
            }}
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            Gửi
          </Button>
        </div>
      </div>
    ), {
      duration: Infinity,
    });

    if (result) {
    }
  };

  const handleRating = (rating) => {
    setSelectedRating(rating);
    toast.success(`Bạn đã đánh giá ${rating} sao.`, {
      duration: 1500,
      progress: true,
    });
  };

  const renderStars = (interactive = false) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => interactive && handleRating(star)}
            disabled={!interactive}
            className={cn(
              "transition-colors duration-200",
              interactive ? "hover:text-yellow-400 cursor-pointer" : "cursor-default",
              star <= selectedRating ? "text-yellow-400" : "text-gray-300"
            )}
            aria-label={interactive ? `Đánh giá ${star} sao` : `Đã đánh giá ${star} sao`}
          >
            <Star className="h-6 w-6 fill-current" />
          </button>
        ))}
      </div>
    );
  };

  const getFileIcon = (type) => {
    switch (type) {
      case "pdf":
        return <FileText className="h-4 w-4 text-red-600" />;
      case "image":
        return <Camera className="h-4 w-4 text-blue-600" />;
      case "video":
        return <Video className="h-4 w-4 text-purple-600" />;
      default:
        return <Paperclip className="h-4 w-4 text-gray-500" />;
    }
  };

  const copyTicketId = () => {
    navigator.clipboard.writeText(`#${ticket?.ticket_id || "N/A"}`);
    toast.success("Đã sao chép mã ticket vào clipboard.", {
      duration: 1500,
      progress: true,
    });
  };

  if (!ticket || isLoading) {
    return (
      <div className="bg-white rounded-lg overflow-hidden max-h-screen">
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-1/2 bg-gray-200" />
            <Skeleton className="h-8 w-8 rounded-full bg-gray-200" />
          </div>
          <Separator className="bg-gray-200" />
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-12 bg-gray-200 rounded-xl" />
            <Skeleton className="h-12 bg-gray-200 rounded-xl" />
          </div>
          <Skeleton className="h-16 bg-gray-200 rounded-xl" />
          <Skeleton className="h-32 bg-gray-200 rounded-2xl" />
          <Skeleton className="h-32 bg-gray-200 rounded-2xl" />
          <Skeleton className="h-48 bg-gray-200 rounded-2xl" />
        </div>
      </div>
    );
  }

  const deviceIcon = ticket.device?.type ? getDeviceIcon(ticket.device.type) : <Smartphone className="h-6 w-6 text-gray-500" />;

  return (
    <div className="bg-white rounded-lg overflow-hidden max-h-screen flex flex-col">
      <div className="sticky top-0 z-10 bg-white/90 p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">{getStatusIcon(ticket.status)}</div>
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <h2 className="text-2xl font-bold text-gray-900">
                  #{ticket.ticket_id} - {ticket.ticket_type_name}
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyTicketId}
                  className="text-blue-600 hover:text-blue-700 hover:bg-gray-100 h-auto p-2 transition-all duration-200"
                  aria-label="Sao chép mã ticket"
                >
                  <Copy className="h-5 w-5" />
                </Button>
              </div>
              <p className="text-gray-600 text-sm">Tạo lúc: {getTimeAgo(ticket.created_at)}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-gray-900 hover:bg-gray-100 rounded-full p-2 transition-all duration-200"
            aria-label="Đóng dialog"
          >
            <X className="h-6 w-6" />
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1 overflow-auto">
        <div className="p-6 space-y-8">
          <Separator className="bg-gray-200" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 hover:border-blue-500 transition-all duration-200">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 font-medium text-sm">Trạng thái</span>
                <Badge variant="outline" className={cn("text-sm font-semibold px-4 py-1.5", getStatusColor(ticket.status))}>
                  {getStatusText(ticket.status)}
                </Badge>
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 hover:border-blue-500 transition-all duration-200">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 font-medium text-sm">Mức độ</span>
                <Badge variant="outline" className={cn("text-sm font-semibold px-4 py-1.5", getPriorityColor(ticket.priority))}>
                  {getPriorityText(ticket.priority)}
                </Badge>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 hover:border-blue-500 transition-all duration-200">
            <div className="flex items-center justify-between text-sm mb-3">
              <span className="text-gray-600 font-medium">Tiến độ xử lý</span>
              <span className="text-gray-900 font-semibold">
                {ticket.status === "pending" && "Chờ xử lý"}
                {ticket.status === "in_progress" && "Đang xử lý"}
                {ticket.status === "approved" && "Đã duyệt"}
                {ticket.status === "resolved" && "Đã hoàn thành"}
                {ticket.status === "rejected" && "Bị từ chối"}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={cn(
                  "h-3 rounded-full transition-all duration-500",
                  ticket.status === "pending" && "bg-blue-600 w-1/4",
                  ticket.status === "in_progress" && "bg-amber-600 w-1/2",
                  ticket.status === "approved" && "bg-orange-600 w-3/4",
                  ticket.status === "resolved" && "bg-emerald-600 w-full",
                  ticket.status === "rejected" && "bg-red-600 w-[5%]"
                )}
              />
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 hover:border-blue-500 transition-all duration-200">
            <h3 className="text-xl font-semibold mb-4 flex items-center text-gray-900">
              <MessageSquare className="h-6 w-6 mr-2 text-blue-600" />
              Mô tả vấn đề
            </h3>
            <div className="bg-white rounded-xl p-5">
              <p className="text-gray-900 text-lg leading-relaxed">{ticket.description || "Không có mô tả."}</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 hover:border-blue-500 transition-all duration-200">
            <h3 className="text-xl font-semibold mb-4 flex items-center text-gray-900">
              <Settings className="h-6 w-6 mr-2 text-blue-600" />
              Thông tin thiết bị
            </h3>
            <div className="bg-white rounded-xl p-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-600 font-medium text-lg">Mã thiết bị</span>
                  <p className="font-mono text-base text-gray-900">{ticket.device_serial || "N/A"}</p>
                </div>
              </div>
            </div>
          </div>

          {ticket.resolution && (
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 hover:border-blue-500 transition-all duration-200">
              <h3 className="text-xl font-semibold mb-4 flex items-center text-gray-900">
                <CheckCircle className="h-6 w-6 mr-2 text-emerald-600" />
                Giải pháp đã thực hiện
              </h3>
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5">
                <p className="text-gray-900 text-lg leading-relaxed">{ticket.resolution}</p>
              </div>
            </div>
          )}

          {ticket.status === "resolved" && (
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 hover:border-blue-500 transition-all duration-200">
              <h3 className="text-xl font-semibold mb-4 flex items-center text-gray-900">
                <Star className="h-6 w-6 mr-2 text-yellow-600" />
                Đánh giá dịch vụ
              </h3>
              <div className="bg-white rounded-xl p-5">
                <p className="text-gray-600 text-base mb-4">
                  {ticket.rating ? "Cảm ơn bạn đã đánh giá!" : "Hãy đánh giá chất lượng dịch vụ hỗ trợ:"}
                </p>
                <div className="flex items-center space-x-4">
                  {renderStars(!ticket.rating)}
                  {selectedRating > 0 && (
                    <span className="text-base text-yellow-600 font-medium">
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

          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 hover:border-blue-500 transition-all duration-200">
            <h3 className="text-xl font-semibold mb-4 flex items-center text-gray-900">
              <MessageSquare className="h-6 w-6 mr-2 text-blue-600" />
              Trao đổi với kỹ thuật viên ({comments.length})
            </h3>
            <div className="space-y-4 mb-6">
              {isLoading ? (
                <>
                  <Skeleton className="h-24 bg-gray-200 rounded-xl" />
                  <Skeleton className="h-24 bg-gray-200 rounded-xl" />
                </>
              ) : comments.length === 0 ? (
                <p className="text-gray-600 text-center">Chưa có bình luận nào.</p>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="bg-white rounded-xl p-5 hover:bg-gray-50 transition-all duration-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div
                          className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold",
                            comment.author_type === "technician"
                              ? "bg-blue-100 text-blue-600"
                              : "bg-emerald-100 text-emerald-600"
                          )}
                        >
                          {comment.author.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-semibold text-lg text-gray-900">{comment.author}</span>
                        <Badge
                          variant="secondary"
                          className={cn(
                            "text-xs font-semibold",
                            comment.author_type === "technician"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-emerald-100 text-emerald-700"
                          )}
                        >
                          {comment.author_type === "technician" ? "Kỹ thuật viên" : "Bạn"}
                        </Badge>
                      </div>
                      <span className="text-sm text-gray-600">{getTimeAgo(comment.created_at)}</span>
                    </div>
                    <p className="text-gray-900 text-lg leading-relaxed mb-4">{comment.content}</p>
                    {comment.attachments.length > 0 && (
                      <div className="space-y-2">
                        {comment.attachments.map((attachment, index) => (
                          <div key={index} className="flex items-center space-x-2 text-sm">
                            {getFileIcon(attachment.type)}
                            <a
                              href={attachment.url || "#"}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-700 transition-colors duration-200"
                            >
                              {attachment.name}
                            </a>
                            <span className="text-gray-600">({attachment.size})</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}