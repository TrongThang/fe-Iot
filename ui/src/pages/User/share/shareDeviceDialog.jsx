"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Smartphone, User } from "lucide-react"
import Swal from "sweetalert2"

export default function DeviceSharingDialog({ deviceId, device, onClose }) {
  const [username, setUsername] = useState("") // Changed from email to username
  const [controlLevel, setControlLevel] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [user, setUser] = useState({ account_id: "" }) // Changed to object with default value
  const [cooldown, setCooldown] = useState(0) // Track cooldown in seconds
  const [isProcessing, setIsProcessing] = useState(false) // Flag to prevent multiple submissions
  const accessToken = localStorage.getItem("authToken");

  // Map controlLevel to PermissionType expected by the API
  const permissionMap = {
    view: "VIEW",
    control: "CONTROL",
    full: "FULL_CONTROL", // Assuming FULL_CONTROL is a valid PermissionType; adjust if needed
  }

  const fetchUserInfo = async () => {
    try {
      const response = await fetch('http://localhost:7777/api/auth/getMe', {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      if (data.success && data.data?.account_id) {
        setUser(data.data);
      } else {
        setError("Không thể tải thông tin người dùng.");
      }
    } catch (error) {
      console.error('Error fetching user info:', error);
      setError("Lỗi khi tải thông tin người dùng.");
    }
  };

  const handleSendRequest = async () => {
    if (cooldown > 0 || isProcessing) return; // Prevent sending if cooldown or processing is active

    setIsProcessing(true);
    setIsLoading(true);
    setError("");

    // Validate inputs
    if (!username.trim() || !controlLevel) {
      setError("Vui lòng nhập username và chọn quyền điều khiển.");
      setIsLoading(false);
      setIsProcessing(false);
      return;
    }

    // Validate username format
    const usernameRegex = /^[a-zA-Z0-9_]{3,}$/;
    if (!usernameRegex.test(username)) {
      setError("Vui lòng nhập username hợp lệ (ít nhất 3 ký tự, chỉ chữ cái, số và dấu gạch dưới).");
      setIsLoading(false);
      setIsProcessing(false);
      return;
    }

    // Ensure user.account_id is available
    if (!user.account_id) {
      setError("Thông tin người dùng không hợp lệ. Vui lòng thử lại.");
      setIsLoading(false);
      setIsProcessing(false);
      return;
    }

    try {
      const payload = {
        user_id: user.account_id,
        device_serial: device.device_serial,
        ticket_type_id: 2, // Assuming TICKET_TYPE.SHARE_PERMISSION = 2; replace with actual ID
        description: permissionMap[controlLevel],
        assigned_to: username,
        permission_type: permissionMap[controlLevel],
      };

      const response = await fetch("https://iothomeconnectapiv2-production.up.railway.app/api/tickets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Thành công!',
          text: `Yêu cầu chia sẻ thiết bị ${deviceId} với quyền ${controlLevel} đã được gửi đến ${username}`,
          confirmButtonText: 'OK',
          allowOutsideClick: false, // Prevent closing by clicking outside
          allowEscapeKey: false, // Prevent closing with escape key
        }).then((result) => {
          if (result.isConfirmed) {
            onClose(); // Close dialog
            setUsername("");
            setControlLevel("");
            setCooldown(60); // Start 60-second cooldown
          }
          setIsProcessing(false); // Reset processing flag
        });
      } else {
        throw new Error(data.message || "Gửi yêu cầu thất bại.");
      }
    } catch (err) {
      setError(err.message || "Đã xảy ra lỗi khi gửi yêu cầu.");
      setIsProcessing(false); // Reset processing flag on error
    } finally {
      setIsLoading(false);
    }
  };

  // Manage cooldown timer
  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer); // Cleanup interval on unmount or cooldown change
  }, [cooldown]);

  useEffect(() => {
    fetchUserInfo();
    console.log("sadads", deviceId);
  }, [deviceId]);

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Chia sẻ thiết bị</DialogTitle>
      </DialogHeader>

      <div className="space-y-4 pt-2">
        {error && <div className="text-red-500 text-sm text-center">{error}</div>}

        <div className="relative">
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
            <Smartphone className="w-5 h-5 text-blue-400" />
          </div>
          <Input
            type="text"
            placeholder="ID thiết bị"
            value={deviceId || ""}
            readOnly
            className="pl-12 h-12 text-base bg-gray-100 cursor-not-allowed"
          />
        </div>

        <div className="relative">
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
            <User className="w-5 h-5 text-blue-400" />
          </div>
          <Input
            type="text"
            placeholder="Username tài khoản"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="pl-12 h-12 text-base"
            disabled={isLoading}
          />
        </div>

        <Select
          value={controlLevel}
          onValueChange={setControlLevel}
          disabled={isLoading}
        >
          <SelectTrigger className="h-20 w-full text-sm">
            <SelectValue placeholder="Chọn quyền điều khiển" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="view">Chỉ xem</SelectItem>
            <SelectItem value="control">Điều khiển cơ bản</SelectItem>
            <SelectItem value="full">Toàn quyền</SelectItem>
          </SelectContent>
        </Select>

        <div className="pt-2">
          <Button
            onClick={handleSendRequest}
            className="w-full"
            disabled={!username || !controlLevel || isLoading || cooldown > 0 || isProcessing} // Disable during processing
          >
            {isLoading ? "Đang gửi..." : cooldown > 0 ? `Chờ ${cooldown}s` : "Gửi yêu cầu"}
          </Button>
        </div>
      </div>
    </DialogContent>
  )
}