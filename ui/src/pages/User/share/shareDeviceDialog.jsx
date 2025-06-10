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
import { Smartphone, Mail } from "lucide-react"

export default function DeviceSharingDialog({ deviceId, onClose }) {
  const [email, setEmail] = useState("")
  const [controlLevel, setControlLevel] = useState("")

  const handleSendRequest = () => {
    console.log("Sending request:", { deviceId, email, controlLevel })
    // Simulate sending request (replace with actual API call)
    alert(`Yêu cầu chia sẻ thiết bị ${deviceId} với quyền ${controlLevel} đã được gửi đến ${email}`)
    onClose() // Close dialog after sending
  }

  // Set deviceId as read-only if passed as prop
  useEffect(() => {
    // No need to set state for deviceId since it's passed as a prop
  }, [deviceId])

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Chia sẻ thiết bị</DialogTitle>
      </DialogHeader>

      <div className="space-y-4 pt-2">
        {/* ID thiết bị (read-only) */}
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

        {/* Email */}
        <div className="relative">
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
            <Mail className="w-5 h-5 text-blue-400" />
          </div>
          <Input
            type="email"
            placeholder="Email tài khoản"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-12 h-12 text-base"
          />
        </div>

        {/* Quyền */}
        <Select value={controlLevel} onValueChange={setControlLevel}>
          <SelectTrigger className="h-12 w-full text-sm">
            <SelectValue placeholder="Chọn quyền điều khiển" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="view">Chỉ xem</SelectItem>
            <SelectItem value="control">Điều khiển cơ bản</SelectItem>
            <SelectItem value="full">Toàn quyền</SelectItem>
          </SelectContent>
        </Select>

        {/* Gửi */}
        <div className="pt-2">
          <Button
            onClick={handleSendRequest}
            className="w-full"
            disabled={!email || !controlLevel}
          >
            Gửi yêu cầu
          </Button>
        </div>
      </div>
    </DialogContent>
  )
}