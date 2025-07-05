"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Bell,
  ShieldAlert,
  Volume2,
  Clock,
  History,
  Settings,
  AlertTriangle,
  Phone,
  Mail,
  MessageSquare,
  Shield,
  ShieldCheck,
  ShieldOff,
  Siren,
  Timer,
  Thermometer,
  Droplet,
} from "lucide-react";
import Swal from "sweetalert2";

export default function AlarmControlDialog({ device, onClose, onDeviceUpdate }) {
  const defaultDevice = {
    id: "alarm-001",
    name: "Báo động Phòng khách",
    type: "alarm",
    status: "online",
    armed: false,
    sensitivity: 70,
    volume: 80,
    mode: "home",
    delay: 30,
    notifyMethods: ["app"],
    temperature: 0,
    humidity: 0,
    ppm: 0,
    buzzerOverride: false, // Fixed: Use boolean instead of string
    last_triggered: "",
  };

  const deviceData = device || defaultDevice;

  const [armed, setArmed] = useState(deviceData.armed);
  const [sensitivity, setSensitivity] = useState(deviceData.sensitivity);
  const [volume, setVolume] = useState(deviceData.volume);
  const [temperature, setTemperature] = useState(deviceData.temperature);
  const [humidity, setHumidity] = useState(deviceData.humidity);
  const [ppm, setPpm] = useState(deviceData.ppm);
  const [buzzerOverride, setBuzzerOverride] = useState(deviceData.buzzerOverride);
  const [mode, setMode] = useState(deviceData.mode);
  const [delay, setDelay] = useState(deviceData.delay);
  const [notifyMethods, setNotifyMethods] = useState(deviceData.notifyMethods);
  const [activeTab, setActiveTab] = useState("controls");
  const [testMode, setTestMode] = useState(false);
  const [countdownActive, setCountdownActive] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [emergencyContact, setEmergencyContact] = useState("");
  const [alarmHistory, setAlarmHistory] = useState([
    {
      id: 1,
      timestamp: "2024-01-15T14:30:00Z",
      type: "gas",
      status: "triggered",
      level: 1000, // Fixed: Use number instead of string
      resolved: true,
      resolvedAt: "2024-01-15T14:35:00Z",
    },
  ]);

  useEffect(() => {
    if (device) {
      setArmed(device.armed || false);
      setSensitivity(device.sensitivity || 70);
      setVolume(device.volume || 80);
      setTemperature(device.temperature || 0);
      setHumidity(device.humidity || 0);
      setPpm(device.ppm || 0);
      setBuzzerOverride(device.buzzerOverride || false);
      setMode(device.mode || "home");
      setDelay(device.delay || 30);
      setNotifyMethods(device.notifyMethods || ["app"]);
    }
  }, [device]);

  useEffect(() => {
    let timer;
    if (countdownActive && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else if (countdownActive && countdown === 0) {
      setCountdownActive(false);
      setArmed(true);
      updateDevice({ armed: true });
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [countdownActive, countdown]);

  const handleArmToggle = async (checked) => {
    setArmed(checked);
    if (checked && delay > 0) {
      setCountdown(delay);
      setCountdownActive(true);
    } else {
      setArmed(checked);
      setCountdownActive(false);
      await updateDevice({ armed: checked });
    }
  };

  const handleSensitivityChange = (value) => {
    setSensitivity(value[0]);
    updateDevice({ sensitivity: value[0] });
  };

  const handleVolumeChange = (value) => {
    setVolume(value[0]);
    updateDevice({ volume: value[0] });
  };

  const handleTemperatureChange = (value) => {
    setTemperature(value[0]);
    updateDevice({ temperature: value[0] });
  };

  const handleHumidityChange = (value) => {
    setHumidity(value[0]);
    updateDevice({ humidity: value[0] });
  };

  const handlePpmChange = (value) => {
    setPpm(value[0]);
    updateDevice({ ppm: value[0] });
  };

  const handleBuzzerOverrideChange = (checked) => {
    setBuzzerOverride(checked);
    updateDevice({ buzzerOverride: checked });
  };

  const handleModeChange = (value) => {
    setMode(value);
    updateDevice({ mode: value });
  };

  const handleDelayChange = (value) => {
    const newDelay = parseInt(value);
    setDelay(newDelay);
    updateDevice({ delay: newDelay });
  };

  const handleNotifyMethodToggle = (method) => {
    const updatedMethods = notifyMethods.includes(method)
      ? notifyMethods.filter((m) => m !== method)
      : [...notifyMethods, method];
    setNotifyMethods(updatedMethods);
    updateDevice({ notifyMethods: updatedMethods });
  };

  const handleTestAlarm = () => {
    setTestMode(true);
    setTimeout(() => {
      setTestMode(false);
    }, 3000);
  };

  const handleSaveEmergencyContact = () => {
    Swal.fire({
      icon: "success",
      title: `Đã lưu số liên hệ khẩn cấp: ${emergencyContact}`,
      confirmButtonColor: "#2563eb",
    });
  };

  const updateDevice = async (updates) => {
    const accessToken = localStorage.getItem("authToken");
    if (!accessToken) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Vui lòng đăng nhập để điều khiển thiết bị.",
        confirmButtonColor: "#2563eb",
      });
      return false;
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_SMART_NET_IOT_API_URL}/api/devices/${deviceData.id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            power_status: updates.power ?? deviceData.power,
            current_value: {
              alarm_status: updates.armed ?? deviceData.armed,
              temperature: updates.temperature ?? deviceData.temperature,
              hum: updates.humidity ?? deviceData.humidity,
              gas: updates.ppm ?? deviceData.ppm,
              mode: updates.mode ?? deviceData.mode,
              notifyMethods: updates.notifyMethods ?? deviceData.notifyMethods,
              buzzer_override: updates.buzzerOverride ?? deviceData.buzzerOverride,
            },
            attribute: {
              sensitivity: updates.sensitivity ?? deviceData.sensitivity,
              alarm_volume: updates.volume ?? deviceData.volume,
              delay: updates.delay ?? deviceData.delay,
            },
          }),
        }
      );

      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData?.message || `Không thể cập nhật thiết bị: ${response.status}`);
      }

      onDeviceUpdate({
        ...deviceData,
        ...updates,
        updated_at: new Date().toISOString(),
      });

      return true;
    } catch (error) {
      console.error("Failed to update device:", error);
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: error.message.includes("400")
          ? "Dữ liệu không hợp lệ."
          : error.message.includes("401")
            ? "Phiên đăng nhập hết hạn."
            : "Không thể điều khiển thiết bị. Vui lòng thử lại.",
        confirmButtonColor: "#2563eb",
      });
      return false;
    }
  };

  const getAlarmTypeIcon = (type) => {
    switch (type) {
      case "gas":
        return <Droplet className="h-4 w-4" />; // Replaced Gas with Droplet (assuming Gas icon is unavailable)
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-gray-200 dark:border-gray-700">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <ShieldAlert className="h-5 w-5 text-red-600 dark:text-red-400" />
            <span>Điều khiển {deviceData.name}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-gray-100 dark:bg-gray-800">
              <TabsTrigger value="controls">Điều khiển</TabsTrigger>
              <TabsTrigger value="settings">Cấu hình</TabsTrigger>
              <TabsTrigger value="history">Lịch sử</TabsTrigger>
            </TabsList>

            <TabsContent value="controls" className="space-y-6 py-4">
              <div className="flex flex-col space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {armed ? (
                      <ShieldCheck className="h-5 w-5 text-green-500 dark:text-green-400" />
                    ) : (
                      <ShieldOff className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                    )}
                    <Label htmlFor="armed" className="text-base">
                      Trạng thái bảo vệ
                    </Label>
                  </div>
                  <Switch id="armed" checked={armed || countdownActive} onCheckedChange={handleArmToggle} />
                </div>

                {countdownActive && (
                  <div className="bg-amber-100 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700 rounded-lg p-3 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Timer className="h-5 w-5 text-amber-500 dark:text-amber-400 animate-pulse" />
                      <span className="text-amber-700 dark:text-amber-300">Đang kích hoạt bảo vệ...</span>
                    </div>
                    <span className="font-bold text-amber-700 dark:text-amber-300">{countdown}s</span>
                  </div>
                )}

                {!countdownActive && (
                  <div
                    className={`rounded-lg p-3 flex items-center justify-between ${armed
                        ? "bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-700"
                        : "bg-gray-100 dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700"
                      }`}
                  >
                    <div className="flex items-center space-x-2">
                      {armed ? (
                        <ShieldCheck className="h-5 w-5 text-green-500 dark:text-green-400" />
                      ) : (
                        <ShieldOff className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                      )}
                      <span className={armed ? "text-green-700 dark:text-green-300" : "text-gray-500 dark:text-gray-400"}>
                        {armed ? "Đã kích hoạt" : "Chưa kích hoạt"}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-base flex items-center space-x-2">
                  <Settings className="h-5 w-5 text-blue-500 dark:text-blue-400" />
                  <span>Chế độ bảo vệ</span>
                </Label>
                <Select value={mode} onValueChange={handleModeChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Chọn chế độ" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-slate-800 dark:text-white">
                    <SelectItem value="home">Có người ở nhà</SelectItem>
                    <SelectItem value="away">Vắng nhà</SelectItem>
                    <SelectItem value="night">Ban đêm</SelectItem>
                    <SelectItem value="vacation">Đi du lịch</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {mode === "home"
                    ? "Chỉ giám sát cảm biến khí gas"
                    : mode === "away"
                      ? "Giám sát khí gas và nhiệt độ"
                      : mode === "night"
                        ? "Giám sát khí gas với độ nhạy cao"
                        : "Giám sát toàn diện với độ nhạy tối đa"}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  className="flex flex-col items-center justify-center h-20 space-y-1"
                  onClick={handleTestAlarm}
                >
                  <Siren
                    className={`h-6 w-6 ${testMode ? "text-red-500 dark:text-red-400 animate-pulse" : "text-gray-500 dark:text-gray-400"}`}
                  />
                  <span className="text-xs">{testMode ? "Đang kiểm tra..." : "Kiểm tra báo động"}</span>
                </Button>
                <Button
                  variant="outline"
                  className="flex flex-col items-center justify-center h-20 space-y-1"
                  onClick={() => setActiveTab("settings")}
                >
                  <Settings className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                  <span className="text-xs">Cài đặt nâng cao</span>
                </Button>
              </div>

              {deviceData.last_triggered && (
                <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                    <History className="h-4 w-4" />
                    <span>
                      Kích hoạt lần cuối:{" "}
                      {new Date(deviceData.last_triggered).toLocaleString("vi-VN", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </span>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="settings" className="space-y-6 py-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="sensitivity" className="text-base flex items-center space-x-2">
                    <AlertTriangle className="h-5 w-5 text-amber-500 dark:text-amber-400" />
                    <span>Độ nhạy cảm biến</span>
                  </Label>
                  <span className="text-sm font-medium">{sensitivity}%</span>
                </div>
                <Slider
                  id="sensitivity"
                  value={[sensitivity]}
                  min={0}
                  max={100}
                  step={10}
                  onValueChange={handleSensitivityChange}
                />
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>Thấp</span>
                  <span>Cao</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="volume" className="text-base flex items-center space-x-2">
                    <Volume2 className="h-5 w-5 text-blue-500 dark:text-blue-400" />
                    <span>Âm lượng báo động</span>
                  </Label>
                  <span className="text-sm font-medium">{volume}%</span>
                </div>
                <Slider
                  id="volume"
                  value={[volume]}
                  min={0}
                  max={100}
                  step={10}
                  onValueChange={handleVolumeChange}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="ppm" className="text-base flex items-center space-x-2">
                    <Droplet className="h-5 w-5 text-red-500 dark:text-red-400" />
                    <span>Nồng độ khí gas</span>
                  </Label>
                  <span className="text-sm font-medium">{ppm} ppm</span>
                </div>
                <Slider
                  id="ppm"
                  value={[ppm]}
                  min={0}
                  max={1000}
                  step={10}
                  onValueChange={handlePpmChange}
                  disabled={true}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="temperature" className="text-base flex items-center space-x-2">
                    <Thermometer className="h-5 w-5 text-orange-500 dark:text-orange-400" />
                    <span>Nhiệt độ</span>
                  </Label>
                  <span className="text-sm font-medium">{temperature} °C</span>
                </div>
                <Slider
                  id="temperature"
                  value={[temperature]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={handleTemperatureChange}
                  disabled={true}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="humidity" className="text-base flex items-center space-x-2">
                    <Droplet className="h-5 w-5 text-cyan-500 dark:text-cyan-400" />
                    <span>Độ ẩm</span>
                  </Label>
                  <span className="text-sm font-medium">{humidity}%</span>
                </div>
                <Slider
                  id="humidity"
                  value={[humidity]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={handleHumidityChange}
                  disabled={true}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Bell className="h-5 w-5 text-red-500 dark:text-red-400" />
                  <Label htmlFor="buzzerOverride" className="text-base">
                    Tắt còi báo động
                  </Label>
                </div>
                <Switch
                  id="buzzerOverride"
                  checked={buzzerOverride}
                  onCheckedChange={handleBuzzerOverrideChange}
                />
              </div>

            </TabsContent>

            <TabsContent value="history" className="space-y-4 py-4">
              <Label className="text-base flex items-center space-x-2">
                <History className="h-5 w-5 text-blue-500 dark:text-blue-400" />
                <span>Lịch sử báo động</span>
              </Label>

              <div className="space-y-3">
                {alarmHistory.length > 0 ? (
                  alarmHistory.map((entry) => (
                    <div
                      key={entry.id}
                      className="border rounded-lg p-3 bg-gray-50 dark:bg-gray-800/30 hover:bg-gray-100 dark:hover:bg-gray-700/30 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center space-x-2">
                          {getAlarmTypeIcon(entry.type)}
                          <span className="font-medium">
                            {entry.type === "gas" ? `Phát hiện khí gas (${entry.level} ppm)` : "Sự kiện không xác định"}
                          </span>
                        </div>
                        <Badge
                          variant="outline"
                          className={
                            entry.resolved
                              ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-700"
                              : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-700"
                          }
                        >
                          {entry.resolved ? "Đã xử lý" : "Chưa xử lý"}
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 flex justify-between">
                        <span>
                          {new Date(entry.timestamp).toLocaleString("vi-VN", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </span>
                        {entry.resolved && (
                          <span>
                            Xử lý sau:{" "}
                            {Math.round((new Date(entry.resolvedAt) - new Date(entry.timestamp)) / 1000 / 60)} phút
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <History className="h-10 w-10 text-gray-300 dark:text-gray-500 mx-auto mb-2" />
                    <p className="text-gray-500 dark:text-gray-400">Chưa có lịch sử báo động</p>
                  </div>
                )}
              </div>

              {alarmHistory.length > 0 && (
                <Button
                  variant="outline"
                  className="w-full bg-white dark:bg-gray-800/30 text-gray-900 dark:text-white border-gray-200 dark:border-gray-700"
                >
                  Xem tất cả lịch sử
                </Button>
              )}
            </TabsContent>
          </Tabs>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            className="bg-white dark:bg-gray-800/30 text-gray-900 dark:text-white border-gray-200 dark:border-gray-700"
          >
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}