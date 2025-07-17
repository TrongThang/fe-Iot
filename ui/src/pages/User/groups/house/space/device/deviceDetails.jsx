"use client";

import { useState, useEffect } from "react";
import {
  Settings,
  Edit,
  Trash2,
  MoreHorizontal,
  Lamp, // Changed from Lightbulb
  Thermometer,
  AlertTriangle, // Changed from Flame
  Siren, // Changed from Bell
  ArrowUpRight,
  Wifi,
  WifiOff,
  Activity,
  Lock,
  Unlock,
  CheckCircle,
  XCircle,
  Clock,
  Cpu, // Changed default icon
  Settings2,
  Share2,
  List,
  DoorOpen,
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
import DeviceSharingDialog from "@/pages/User/share/shareDeviceDialog";
import Swal from "sweetalert2";
import axiosPublic from "@/apis/clients/public.client";
import EditDeviceDialog from "./devicePopups/Edit-device-popup";

// Device type mapping function (adapted from DeviceManagement)
const getDeviceTypeFromCategory = (deviceTypeId, deviceTypeName, deviceTypeParentName, capabilities) => {
  const categoryMapping = {
    // Electronics & Camera
    1: 'camera',
    18: 'camera',
    // LED categories
    9: 'light',
    11: 'led-rgb',
    12: 'led-white',
    13: 'led-single',
    // Sensor categories
    14: 'sensor',
    15: 'smoke',
    25: 'sensor',
    // Door categories
    19: 'door',
    20: 'door-roller',
    21: 'door-sliding',
    22: 'door-swing',
    // Hub categories
    23: 'hub',
    24: 'hub-door',
    // Controllers
    26: 'controller',
    // Security
    27: 'security',
  };

  let baseType = categoryMapping[deviceTypeId] || 'device';

  if (!baseType || baseType === 'device') {
    const lowerName = (deviceTypeName || deviceTypeParentName || '').toLowerCase();
    if (lowerName.includes('cảm biến')) {
      if (lowerName.includes('khói') || lowerName.includes('cháy') || lowerName.includes('báo cháy')) {
        baseType = 'smoke';
      } else if (lowerName.includes('nhiệt độ')) {
        baseType = 'temperature';
      } else if (
        lowerName.includes('môi trường') ||
        lowerName.includes('gas') ||
        lowerName.includes('khí') ||
        lowerName.includes('chất lượng không khí') ||
        lowerName.includes('air quality')
      ) {
        baseType = 'gas-sensor';
      } else {
        baseType = 'sensor';
      }
    } else if (lowerName.includes('camera')) {
      baseType = 'camera';
    } else if (lowerName.includes('đèn') || lowerName.includes('led')) {
      if (lowerName.includes('rgb')) {
        baseType = 'led-rgb';
      } else if (lowerName.includes('white') || lowerName.includes('trắng')) {
        baseType = 'led-white';
      } else {
        baseType = 'light';
      }
    } else if (lowerName.includes('cửa')) {
      if (lowerName.includes('cuốn')) {
        baseType = 'door-roller';
      } else if (lowerName.includes('trượt')) {
        baseType = 'door-sliding';
      } else if (lowerName.includes('cánh')) {
        baseType = 'door-swing';
      } else {
        baseType = 'door';
      }
    } else if (lowerName.includes('hub')) {
      baseType = 'hub';
    } else if (lowerName.includes('bơm')) {
      baseType = 'pump';
    }
  }

  if (capabilities) {
    try {
      const caps = typeof capabilities === 'string' ? JSON.parse(capabilities) : capabilities;
      if (caps.pump_control || caps.water_flow) {
        baseType = baseType === 'device' ? 'pump' : baseType + '-pump';
      }
      if (caps.rgb_control) {
        baseType = baseType.includes('led') ? 'led-rgb' : baseType;
      }
      if (caps.temperature_sensor) {
        baseType = baseType === 'sensor' ? 'temperature' : baseType;
      }
      if (caps.smoke_detection || caps.fire_detection) {
        baseType = baseType === 'sensor' ? 'smoke' : baseType;
      }
      if (caps.gas_detection || caps.air_quality) {
        baseType = baseType === 'sensor' ? 'gas-sensor' : baseType;
      }
      if (caps.door_control) {
        baseType = baseType === 'device' ? 'door' : baseType;
      }
    } catch (error) {
      console.warn('Error parsing capabilities:', error);
    }
  }

  console.log('✅ DeviceDetail type mapping:', {
    deviceTypeId,
    deviceTypeName,
    deviceTypeParentName,
    finalType: baseType,
    hasCapabilities: !!capabilities,
  });

  return baseType;
};

export default function DeviceDetail({ device, onDeviceUpdate, onDelete, houseId, onClose }) {
  const [isControlDialogOpen, setIsControlDialogOpen] = useState(false);
  const [isSharingDialogOpen, setIsSharingDialogOpen] = useState(false);
  const [deviceDetail, setDeviceDetail] = useState(null);
  const [isEditDevicePopupOpen, setIsEditDevicePopupOpen] = useState(false);
  const [deviceToEdit, setDeviceToEdit] = useState(null);
  const [isLoadingFirmware, setIsLoadingFirmware] = useState(false);

  useEffect(() => {
    if (device?.serial_number) {
      fetchDeviceDetail();
    }
  }, [device?.serial_number]);

  useEffect(() => {
    if (device?.firmware_id && !deviceDetail?.firmware_version) {
      fetchFirmware(device.firmware_id);
    }
  }, [device?.firmware_id, deviceDetail?.firmware_version]);

  const fetchDeviceDetail = async () => {
    try {
      const response = await axiosPublic.get(`/devices/${device.serial_number}`);
      setDeviceDetail((prev) => ({
        ...prev,
        ...response.data,
      }));
    } catch (error) {
      console.error("Error fetching device detail:", error);
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: `Không thể tải thông tin thiết bị. Chi tiết: ${error.message || "Lỗi không xác định"}`,
        confirmButtonColor: "#2563eb",
      });
    }
  };

  const fetchFirmware = async (firmwareId) => {
    try {
      setIsLoadingFirmware(true);
      const response = await axiosPublic.get(`/firmwares/detail/${firmwareId}`);
      console.log("firmware response:", response.data);
      if (response.data) {
        setDeviceDetail((prev) => ({
          ...prev,
          firmware_version: response.data.version || prev?.firmware_version || "N/A",
        }));
      }
    } catch (error) {
      console.error("Error fetching firmware:", error);
      setDeviceDetail((prev) => ({
        ...prev,
        firmware_version: prev?.firmware_version || "N/A",
      }));
    } finally {
      setIsLoadingFirmware(false);
    }
  };

  // Determine device type using getDeviceTypeFromCategory
  const deviceType = device?.type || getDeviceTypeFromCategory(
    deviceDetail?.device_type_id || device?.device_type_id,
    deviceDetail?.device_type_name || device?.device_type_name,
    deviceDetail?.device_type_parent_name || device?.device_type_parent_name,
    deviceDetail?.capabilities?.merged_capabilities || device?.capabilities || device?.device_base_capabilities
  );

  const mergedDevice = {
    ...device,
    ...deviceDetail,
    type: deviceType, // Use computed type
    template_type: deviceType, // Align template_type with type
    firmware_version: deviceDetail?.firmware_version || device?.version || "N/A",
    current_value: deviceDetail?.current_value || device?.current_value || {},
    attribute: deviceDetail?.attribute || device?.attribute || {},
    capabilities: deviceDetail?.capabilities?.merged_capabilities || device?.capabilities || {},
    category: deviceDetail?.capabilities?.category || device?.category || (deviceType.includes('door') ? "DOOR" : "DEVICE"),
  };

  const mappedDevice = {
    ...mergedDevice,
    id: mergedDevice?.device_id,
    type: mergedDevice?.type, // Use computed type
    template_type: mergedDevice?.type, // Ensure consistency
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
    door_status: mergedDevice?.current_value?.door_status || "closed", // Add door_status
    lock_status: mergedDevice?.lock_status || mergedDevice?.current_value?.lock_status || "unlocked", // Add lock_status
    supportedFeatures: {
      color: mergedDevice?.type === "light" || mergedDevice?.type === "led-rgb",
      temperature: mergedDevice?.type === "light" || mergedDevice?.type === "smoke" || mergedDevice?.type === "temperature",
      effects: mergedDevice?.type === "light" || mergedDevice?.type === "led-rgb",
      gas: mergedDevice?.type === "smoke" || mergedDevice?.type === "gas-sensor",
      humidity: mergedDevice?.type === "smoke" || mergedDevice?.type === "gas-sensor",
      door_control: mergedDevice?.type.includes("door") || mergedDevice?.capabilities?.door_control, // Add door_control
    },
  };

  const getDeviceIcon = (type, powerStatus = true) => {
    const iconProps = { className: `h-5 w-5 ${powerStatus ? "text-black" : "text-gray-500"}` };
    switch (type) {
      case "light":
      case "led-rgb":
      case "led-white":
      case "led-single":
        return <Lamp {...iconProps} />; // Changed from Lightbulb
      case "smoke":
        return <AlertTriangle {...iconProps} />; // Changed from Flame
      case "temperature":
        return <Thermometer {...iconProps} />;
      case "alarm":
        return <Siren {...iconProps} />; // Changed from Bell
      case "door":
      case "door-roller":
      case "door-sliding":
      case "door-swing":
        return <DoorOpen {...iconProps} />;
      default:
        return <Cpu {...iconProps} />; // Changed from Settings
    }
  };

  const getDeviceColor = (type, powerStatus = true) => {
    const opacity = powerStatus ? "" : "/50";
    switch (type) {
      case "light":
      case "led-rgb":
      case "led-white":
      case "led-single":
        return `from-amber-500${opacity} to-orange-500${opacity}`;
      case "smoke":
        return `from-red-500${opacity} to-pink-500${opacity}`;
      case "temperature":
        return `from-blue-500${opacity} to-cyan-500${opacity}`;
      case "alarm":
        return `from-purple-500${opacity} to-indigo-500${opacity}`;
      case "door":
      case "door-roller":
      case "door-sliding":
      case "door-swing":
        return `from-green-500${opacity} to-green-600${opacity}`;
      default:
        return `from-gray-500${opacity} to-gray-500${opacity}`;
    }
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
        door_status: updatedData.door_status || mergedDevice.current_value.door_status, // Preserve door_status
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

  const handleDeviceEdit = (updatedDevice) => {
    onDeviceUpdate(updatedDevice);
    setIsEditDevicePopupOpen(false);
    if (onClose) onClose();
  };

  const handleEditClick = () => {
    console.log("Opening EditDevicePopup for device:", mergedDevice);
    setDeviceToEdit(mergedDevice);
    setIsEditDevicePopupOpen(true);
  };

  const handleDeleteClick = () => {
    onDelete(mergedDevice.device_id);
  };

  if (!device) {
    return (
      <div className="bg-white rounded-lg overflow-hidden h-full p-6">
        <p className="text-red-600">Không tìm thấy thông tin thiết bị.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg overflow-hidden h-full">
      <ScrollArea className="h-full">
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div
                className={`w-16 h-16 bg-gradient-to-br ${getDeviceColor(mergedDevice.type, mergedDevice.power_status)} rounded-2xl flex items-center justify-center shadow-xl`}
              >
                {getDeviceIcon(mergedDevice.type, mergedDevice.power_status)}
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-1 text-gray-900">{mergedDevice.name || "Thiết bị không tên"}</h2>
                <div className="flex items-center space-x-3">
                  <p className="text-gray-600 font-mono text-sm">{mergedDevice.serial_number || "N/A"}</p>
                  {mergedDevice.group_name && (
                    <Badge variant="secondary" className="bg-gray-100 text-gray-800 border-gray-200">
                      {mergedDevice.group_name}
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {/* <Switch
                checked={mergedDevice.power_status}
                onCheckedChange={handlePowerToggle}
                disabled={mergedDevice.link_status === "unlinked" || mergedDevice.lock_status === "locked"}
                className="data-[state=checked]:bg-emerald-600"
              /> */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-gray-900 hover:bg-gray-100 rounded-xl">
                    <MoreHorizontal className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white text-gray-900 border-gray-200">
                  <DropdownMenuItem onClick={handleEditClick}>
                    <Edit className="h-4 w-4 mr-2" />
                    Chỉnh sửa
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleDeleteClick} className="text-red-600">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Gỡ thiết bị
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <Separator className="bg-gray-200" />
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 text-sm">Trạng thái kết nối</span>
                <div className="flex items-center space-x-2">
                  {mergedDevice.link_status === "linked" ? (
                    <CheckCircle className="text-emerald-600 h-4 w-4" />
                  ) : (
                    <XCircle className="text-red-600 h-4 w-4" />
                  )}
                  <span className="font-medium text-sm">{mergedDevice?.link_status === "linked" ? "Đã liên kết" : "Chưa liên kết"}</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 text-sm">Trạng thái khóa</span>
                <div className="flex items-center space-x-2">
                  {mergedDevice.lock_status === "unlocked" ? (
                    <Unlock className="h-4 w-4 text-emerald-600" />
                  ) : (
                    <Lock className="h-4 w-4 text-red-600" />
                  )}
                  <span className="text-sm font-medium">{mergedDevice.lock_status === "unlocked" ? "Đã mở" : "Đã khóa"}</span>
                </div>
              </div>
            </div>
          </div>

          <DynamicDeviceDetail
            device={mappedDevice}
            onDeviceUpdate={onDeviceUpdate} // Pass onDeviceUpdate to DynamicDeviceDetail
          />

          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
            <h3 className="text-xl font-semibold mb-6 flex items-center text-gray-900">
              <Settings className="h-5 w-5 mr-2" />
              Thông tin thiết bị
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-sm">Device ID</span>
                  <span className="font-mono text-sm">{mergedDevice.device_id || "N/A"}</span>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-sm">Template</span>
                  <span className="text-sm">{mergedDevice.device_template_name || mergedDevice.type || "N/A"}</span>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-sm">Firmware</span>
                  <span className="text-sm font-mono">
                    {isLoadingFirmware ? "Đang tải..." : mergedDevice.firmware_version}
                  </span>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-sm">Wi-Fi</span>
                  <div className="flex items-center space-x-2">
                    {mergedDevice.wifi_ssid ? (
                      <>
                        <Wifi className="h-4 w-4 text-emerald-600" />
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
                <div className="bg-white rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 text-sm">Hub</span>
                    <span className="text-sm font-mono">{mergedDevice.hub_id}</span>
                  </div>
                </div>
              )}

              <div className="bg-white rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-sm">Cập nhật cuối</span>
                  <span className="text-sm">{mergedDevice.updated_at ? new Date(mergedDevice.updated_at).toLocaleString() : "N/A"}</span>
                </div>
              </div>
            </div>
          </div>

          {(mergedDevice.attribute || mergedDevice.capabilities.controls) && (
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <h3 className="text-xl font-semibold mb-6 flex items-center text-gray-900">
                <Cpu className="h-5 w-5 mr-2" />
                Cấu hình thiết bị
              </h3>
              <div className="space-y-3">
                {mergedDevice.capabilities.controls &&
                  Object.entries(mergedDevice.capabilities.controls).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-3 bg-white rounded-xl">
                      <span className="text-gray-600 text-sm capitalize">{key.replace(/_/g, " ")}</span>
                      <span className="text-sm font-medium">{value === "slider" ? "Điều chỉnh" : value === "toggle" ? "Bật/Tắt" : String(value)}</span>
                    </div>
                  ))}
                {mergedDevice.attribute &&
                  Object.entries(mergedDevice.attribute).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-3 bg-white rounded-xl">
                      <span className="text-gray-600 text-sm capitalize">{key.replace(/_/g, " ")}</span>
                      <span className="text-sm font-medium">{Array.isArray(value) ? value.join(", ") : String(value)}</span>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <Dialog open={isControlDialogOpen} onOpenChange={setIsControlDialogOpen}>
        <DialogContent className="sm:max-w-md bg-white text-gray-900 border-gray-200" style={{ borderRadius: "12px" }}>
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
          {/* Removed DoorControlDialog to rely on DynamicDeviceDetail's DoorControl */}
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDevicePopupOpen} onOpenChange={setIsEditDevicePopupOpen}>
        <DialogContent className="sm:max-w-md bg-white text-gray-900 border-gray-200 rounded-2xl p-6">
          {deviceToEdit && (
            <EditDeviceDialog
              device={deviceToEdit}
              houseId={houseId}
              onOpenChange={setIsEditDevicePopupOpen}
              onEdit={handleDeviceEdit}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isSharingDialogOpen} onOpenChange={setIsSharingDialogOpen}>
        <DialogContent className="sm:max-w-lg bg-white text-gray-900 border-gray-200" style={{ borderRadius: "12px" }}>
          <DeviceSharingDialog deviceId={mergedDevice.device_id} device={device.serial_number} onClose={() => setIsSharingDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}