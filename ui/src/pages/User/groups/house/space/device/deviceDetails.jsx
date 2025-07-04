"use client";

import { useState, useEffect } from "react";
import {
  Settings,
  Edit,
  Trash2,
  MoreHorizontal,
  Lightbulb,
  Thermometer,
  Flame,
  Bell,
  ArrowUpRight,
  Wifi,
  WifiOff,
  Activity,
  Lock,
  Unlock,
  CheckCircle,
  XCircle,
  Clock,
  Cpu,
  Settings2,
  Share2,
  List,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import LedControlDialog from "@/pages/User/device-dialogs/led-control-dialog";
import AlarmControlDialog from "@/pages/User/device-dialogs/alarm-control-dialog";
import DynamicDeviceDetail from "@/components/common/devices/DynamicDeviceDetail";
import { useNavigate } from "react-router-dom";
import DeviceSharingDialog from "@/pages/User/share/shareDeviceDialog";
import Swal from "sweetalert2";
import axiosPublic from "@/apis/clients/public.client";

export default function DeviceDetail({ device, onDeviceUpdate, onEdit, onDelete, onLockToggle }) {
  const [isControlDialogOpen, setIsControlDialogOpen] = useState(false);
  const [isSharingDialogOpen, setIsSharingDialogOpen] = useState(false);
  const [deviceDetail, setDeviceDetail] = useState(null);
  const accessToken = localStorage.getItem("authToken");
  const navigate = useNavigate();

  useEffect(() => {
    if (device?.serial_number) {
      fetchDeviceDetail();
    }
  }, [device?.serial_number]);

  const fetchDeviceDetail = async () => {
    try {
      const response = await axiosPublic.get(`/devices/${device.serial_number}`);
      setDeviceDetail(response.data || null);
    } catch (error) {
      console.error("Error fetching device detail:", error);
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Không thể tải thông tin thiết bị. Vui lòng thử lại.",
        confirmButtonColor: "#2563eb",
      });
    }
  };

  // Merge device and deviceDetail
  const mergedDevice = {
    ...device,
    ...deviceDetail,
    firmware_version: deviceDetail?.capabilities?.runtime?.firmware_version || device?.firmware_version || "N/A",
    template_type:
      deviceDetail?.capabilities?.runtime?.deviceType === "FIRE_ALARM_SENSOR" ? "smoke" : device?.template_type || "smoke",
    current_value: deviceDetail?.current_value || device?.current_value || {},
    attribute: deviceDetail?.attribute || device?.attribute || {},
    capabilities: deviceDetail?.capabilities?.merged_capabilities || device?.capabilities || {},
    category: deviceDetail?.capabilities?.category || device?.category || "SAFETY",
  };

  // Map device data for dialogs
  const mappedDevice = {
    ...mergedDevice,
    id: mergedDevice?.device_id,
    type: mergedDevice?.template_type,
    status: mergedDevice?.link_status === "linked" ? "online" : "offline",
    power: mergedDevice?.power_status,
    brightness: mergedDevice?.current_value?.brightness || 0,
    color: mergedDevice?.current_value?.color || "#FFFFFF",
    temperature: mergedDevice?.current_value?.temp || 0,
    mode: mergedDevice?.current_value?.mode || "home",
    armed: mergedDevice?.current_value?.alarm_status || false,
    sensitivity: mergedDevice?.attribute?.sensitivity || 70,
    volume: mergedDevice?.attribute?.alarm_volume || 80,
    delay: mergedDevice?.attribute?.delay || 30,
    notifyMethods: mergedDevice?.current_value?.notifyMethods || ["app"],
    ppm: mergedDevice?.current_value?.gas || 0,
    humidity: mergedDevice?.current_value?.hum || 0,
    battery: mergedDevice?.current_value?.battery || 100,
    buzzer_override: mergedDevice?.current_value?.buzzer_override || false,
    supportedFeatures: {
      color: mergedDevice?.template_type === "light",
      temperature: mergedDevice?.template_type === "light" || mergedDevice?.template_type === "smoke",
      effects: mergedDevice?.template_type === "light",
      gas: mergedDevice?.template_type === "smoke",
      humidity: mergedDevice?.template_type === "smoke",
    },
  };

  const getDeviceIcon = (templateType, powerStatus = true) => {
    const iconProps = { className: `h-5 w-5 ${powerStatus ? "text-white" : "text-white/70"}` };
    switch (templateType) {
      case "light":
        return <Lightbulb {...iconProps} />;
      case "smoke":
        return <Flame {...iconProps} />;
      case "temperature":
        return <Thermometer {...iconProps} />;
      case "alarm":
        return <Bell {...iconProps} />;
      default:
        return <Bell {...iconProps} />;
    }
  };

  const getDeviceColor = (templateType, powerStatus = true) => {
    const opacity = powerStatus ? "" : "/50";
    switch (templateType) {
      case "light":
        return `from-amber-500${opacity} to-orange-500${opacity}`;
      case "smoke":
        return `from-red-500${opacity} to-pink-500${opacity}`;
      case "temperature":
        return `from-blue-500${opacity} to-cyan-500${opacity}`;
      case "alarm":
        return `from-purple-500${opacity} to-indigo-500${opacity}`;
      default:
        return `from-slate-500${opacity} to-gray-500${opacity}`;
    }
  };

  const handleViewSharingList = () => {
    navigate("/share/device-sharing-list");
  };

  const handlePowerToggle = (checked) => {
    const updatedDevice = {
      ...mergedDevice,
      power_status: checked,
      updated_at: new Date().toISOString(),
    };
    onDeviceUpdate(updatedDevice);
  };

  const handleControlDialogUpdate = (updatedData) => {
    const updatedDevice = {
      ...mergedDevice,
      power_status: updatedData.power,
      current_value: {
        ...mergedDevice.current_value,
        brightness: updatedData.brightness,
        color: updatedData.color,
        temp: updatedData.temperature,
        mode: updatedData.mode,
        alarm_status: updatedData.armed,
        notifyMethods: updatedData.notifyMethods,
        gas: updatedData.ppm,
        hum: updatedData.humidity,
        battery: updatedData.battery,
        buzzer_override: updatedData.buzzer_override,
      },
      attribute: {
        ...mergedDevice.attribute,
        sensitivity: updatedData.sensitivity,
        alarm_volume: updatedData.volume,
        delay: updatedData.delay,
      },
      updated_at: new Date().toISOString(),
    };
    onDeviceUpdate(updatedDevice);
    setIsControlDialogOpen(false);
  };

  if (!device) {
    return (
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white rounded-lg overflow-hidden h-full p-6">
        <p className="text-red-400">Không tìm thấy thông tin thiết bị.</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white rounded-lg overflow-hidden h-full">
      <ScrollArea className="h-full">
        <div className="p-6 space-y-6">
          {/* Device Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div
                className={`w-16 h-16 bg-gradient-to-br ${getDeviceColor(mergedDevice.template_type, mergedDevice.power_status)} rounded-2xl flex items-center justify-center shadow-xl`}
              >
                {getDeviceIcon(mergedDevice.template_type, mergedDevice.power_status)}
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-1">{mergedDevice.name || "Thiết bị không tên"}</h2>
                <div className="flex items-center space-x-3">
                  <p className="text-blue-200 font-mono text-sm">{mergedDevice.serial_number || "N/A"}</p>
                  {mergedDevice.group_name && (
                    <Badge variant="secondary" className="bg-white/10 text-white border-white/20">
                      {mergedDevice.group_name}
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Switch
                checked={mergedDevice.power_status}
                onCheckedChange={handlePowerToggle}
                disabled={mergedDevice.link_status === "unlinked" || mergedDevice.lock_status === "locked"}
                className="data-[state=checked]:bg-emerald-500"
              />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 rounded-xl">
                    <MoreHorizontal className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-slate-800 text-white border-white/20">
                  <DropdownMenuItem onClick={() => onEdit(mergedDevice.device_id)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Chỉnh sửa
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onLockToggle(mergedDevice.device_id)}>
                    {mergedDevice.lock_status === "locked" ? (
                      <>
                        <Unlock className="h-4 w-4 mr-2" />
                        Mở khóa
                      </>
                    ) : (
                      <>
                        <Lock className="h-4 w-4 mr-2" />
                        Khóa thiết bị
                      </>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleViewSharingList}>
                    <List className="h-4 w-4 mr-2" />
                    Danh sách chia sẻ
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setIsSharingDialogOpen(true)}>
                    <Share2 className="h-4 w-4 mr-2" />
                    Chia sẻ thiết bị
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDelete(mergedDevice.device_id)} className="text-red-400">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Xóa thiết bị
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <Separator className="bg-white/10" />

          {/* Control Button */}
          {mergedDevice.category === "SAFETY" && (
            <div className="flex justify-end">
              <Button
                onClick={() => setIsControlDialogOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 rounded-xl"
                disabled={mergedDevice.link_status === "unlinked" || mergedDevice.lock_status === "locked"}
              >
                <Settings2 className="h-4 w-4 mr-2" />
                Điều khiển
              </Button>
            </div>
          )}

          {/* Device Status Overview */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
              <div className="flex items-center space-x justify-between">
                <span className="text-blue-200 text-sm">Trạng thái kết nối</span>
                <div className="flex items-center space-x-2">
                  {mergedDevice.link_status === "linked" ? (
                    <CheckCircle className="text-emerald-400 h-4 w-4" />
                  ) : (
                    <XCircle className="text-red-400 h-4 w-4" />
                  )}
                  <span className="font-medium text-sm">{mergedDevice?.link_status === "linked" ? "Đã liên kết" : "Chưa liên kết"}</span>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
              <div className="flex items-center justify-between">
                <span className="text-blue-200 text-sm">Trạng thái khóa</span>
                <div className="flex items-center space-x-2">
                  {mergedDevice.lock_status === "unlocked" ? (
                    <Unlock className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <Lock className="h-4 w-4 text-red-400" />
                  )}
                  <span className="text-sm font-medium">{mergedDevice.lock_status === "unlocked" ? "Đã mở" : "Đã khóa"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Replace the static device type components with dynamic component */}
          <DynamicDeviceDetail 
            device={mergedDevice} 
            onDeviceUpdate={onDeviceUpdate}
          />

          {/* Enhanced Device Info */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <h3 className="text-xl font-semibold mb-6 flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              Thông tin thiết bị
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-blue-200 text-sm">Device ID</span>
                  <span className="font-mono text-sm">{mergedDevice.device_id || "N/A"}</span>
                </div>
              </div>

              <div className="bg-white/5 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-blue-200 text-sm">Template</span>
                  <span className="text-sm">{mergedDevice.device_template_name || "N/A"}</span>
                </div>
              </div>

              <div className="bg-white/5 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-blue-200 text-sm">Firmware</span>
                  <span className="text-sm font-mono">{mergedDevice.firmware_version}</span>
                </div>
              </div>

              <div className="bg-white/5 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-blue-200 text-sm">Wi-Fi</span>
                  <div className="flex items-center space-x-2">
                    {mergedDevice.wifi_ssid ? (
                      <>
                        <Wifi className="h-4 w-4 text-emerald-400" />
                        <span className="text-sm">{mergedDevice.wifi_ssid}</span>
                      </>
                    ) : (
                      <>
                        <WifiOff className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">Chưa kết nối</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {mergedDevice.hub_id && (
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-blue-200 text-sm">Hub</span>
                    <span className="text-sm font-mono">{mergedDevice.hub_id}</span>
                  </div>
                </div>
              )}

              <div className="bg-white/5 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-blue-200 text-sm">Cập nhật cuối</span>
                  <span className="text-sm">{mergedDevice.updated_at ? new Date(mergedDevice.updated_at).toLocaleString() : "N/A"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Device Attributes */}
          {(mergedDevice.attribute || mergedDevice.capabilities.controls) && (
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <h3 className="text-xl font-semibold mb-6 flex items-center">
                <Cpu className="h-5 w-5 mr-2" />
                Cấu hình thiết bị
              </h3>
              <div className="space-y-3">
                {mergedDevice.capabilities.controls &&
                  Object.entries(mergedDevice.capabilities.controls).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                      <span className="text-blue-200 text-sm capitalize">{key.replace(/_/g, " ")}</span>
                      <span className="text-sm font-medium">{value === "slider" ? "Điều chỉnh" : value === "toggle" ? "Bật/Tắt" : String(value)}</span>
                    </div>
                  ))}
                {mergedDevice.attribute &&
                  Object.entries(mergedDevice.attribute).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                      <span className="text-blue-200 text-sm capitalize">{key.replace(/_/g, " ")}</span>
                      <span className="text-sm font-medium">{Array.isArray(value) ? value.join(", ") : String(value)}</span>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Enhanced Device History */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold flex items-center">
                <Activity className="h-5 w-5 mr-2" />
                Lịch sử hoạt động
              </h3>
              <Button variant="ghost" size="sm" className="text-blue-300 hover:text-white hover:bg-blue-600/10 rounded-xl">
                Xem tất cả
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-4 p-3 bg-white/5 rounded-xl">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center mt-1">
                  <Bell className="h-5 w-5 text-emerald-400" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Thiết bị được bật</p>
                  <p className="text-sm text-blue-200">2 phút trước</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-3 bg-white/5 rounded-xl">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center mt-1">
                  <Settings className="h-5 w-5 text-blue-400" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Cài đặt được thay đổi</p>
                  <p className="text-sm text-blue-200">1 giờ trước</p>
                </div>
              </div>

              {mergedDevice.last_reset_at && (
                <div className="flex items-start space-x-4 p-3 bg-white/5 rounded-xl">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center mt-1">
                    <Clock className="h-5 w-5 text-amber-400" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Thiết bị được reset</p>
                    <p className="text-sm text-blue-200">{new Date(mergedDevice.last_reset_at).toLocaleString()}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </ScrollArea>

      {/* Control Dialog */}
      <Dialog open={isControlDialogOpen} onOpenChange={setIsControlDialogOpen}>
        <DialogContent className="sm:max-w-md bg-slate-900 text-white border-gray-700" style={{ borderRadius: "12px" }}>
          {mergedDevice.category === "LIGHTING" && (
            <LedControlDialog
              device={mappedDevice}
              onClose={() => setIsControlDialogOpen(false)}
              onDeviceUpdate={handleControlDialogUpdate}
            />
          )}
          {mergedDevice.category === "SAFETY" && (
            <AlarmControlDialog
              device={mappedDevice}
              onClose={() => setIsControlDialogOpen(false)}
              onDeviceUpdate={handleControlDialogUpdate}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isSharingDialogOpen} onOpenChange={setIsSharingDialogOpen}>
        <DialogContent className="sm:max-w-lg bg-slate-900 text-white border-gray-700" style={{ borderRadius: "12px" }}>
          <DeviceSharingDialog deviceId={mergedDevice.device_id} device={device.serial_number} onClose={() => setIsSharingDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Subcomponents
function SmokeDetectorDetail({ device }) {
  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
      <h3 className="text-xl font-semibold mb-6 flex items-center">
        <Flame className="h-5 w-5 mr-2" />
        Thông tin báo khói
      </h3>
      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
          <span className="text-blue-200 text-sm">Nồng độ khói</span>
          <span className="text-sm font-medium">{device.current_value?.gas || 0} ppm</span>
        </div>
        <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
          <span className="text-blue-200 text-sm">Nhiệt độ</span>
          <span className="text-sm font-medium">{device.current_value?.temp || 0} °C</span>
        </div>
        <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
          <span className="text-blue-200 text-sm">Độ ẩm</span>
          <span className="text-sm font-medium">{device.current_value?.hum || 0} %</span>
        </div>
        <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
          <span className="text-blue-200 text-sm">Pin</span>
          <span className="text-sm font-medium">{device.current_value?.battery || 100} %</span>
        </div>
      </div>
    </div>
  );
}

function TemperatureDetail({ device }) {
  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
      <h3 className="text-xl font-semibold mb-6 flex items-center">
        <Thermometer className="h-5 w-5 mr-2" />
        Thông tin nhiệt độ
      </h3>
      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
          <span className="text-blue-200 text-sm">Nhiệt độ</span>
          <span className="text-sm font-medium">{device.current_value?.temperature || 0} °C</span>
        </div>
        <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
          <span className="text-blue-200 text-sm">Độ ẩm</span>
          <span className="text-sm font-medium">{device.current_value?.humidity || 0} %</span>
        </div>
        <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
          <span className="text-blue-200 text-sm">Chỉ số nhiệt</span>
          <span className="text-sm font-medium">{device.current_value?.heat_index || "N/A"} °C</span>
        </div>
      </div>
    </div>
  );
}

function AlarmDetail({ device }) {
  return (
    <div className="bg-white/5 rounded-2xl backdrop-blur-sm p-3 bg-white/10 border border-white">
      <h3 className="text-xl font-semibold mb-3 flex items-center">
        <Bell className="h-5 w-5 mr-2" />
        Thông tin báo động
      </h3>
      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
          <span className="text-blue-200 text-sm">Trạng thái kích hoạt</span>
          <span className="text-sm font-medium">{device.current_value?.alarm_status || false ? "Đã kích hoạt" : "Chưa kích hoạt"} </span>
        </div>
        <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
          <span className="text-blue-200 text-sm font-medium">Chế độ</span>
          <span className="text-sm font-medium">{device.current_value?.mode || "N/A"} </span>
        </div>
        <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
          <span className="text-blue-200 text-sm">Phương thức thông báo</span>
          <span
            className="text-sm font-medium">
            {device.current_value?.notifyMethods?.join(", ") || "Không có"}
          </span>
        </div>
      </div>
    </div>
  );
}