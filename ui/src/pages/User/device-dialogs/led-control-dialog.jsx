"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Clock,
  Power,
  Zap,
  Palette,
  Timer,
  Save,
  Lightbulb,
  Sparkles,
  Gauge,
} from "lucide-react"

export default function LedControlDialog({
  device,
  onClose,
  onDeviceUpdate,
}) {
  // Default device if not provided (fallback only if device is undefined)
  const defaultDevice = {
    id: "led-001",
    name: "Đèn LED Phòng khách",
    type: "led",
    status: "online",
    power: true,
    brightness: 80,
    color: "#FF9900",
    mode: "solid",
    temperature: 3200, // Kelvin
    supportedFeatures: {
      color: true,
      temperature: true,
      effects: true,
    },
  }

  const deviceData = device || defaultDevice

  // State for device controls
  const [power, setPower] = useState(deviceData.power)
  const [brightness, setBrightness] = useState(deviceData.brightness)
  const [color, setColor] = useState(deviceData.color)
  const [mode, setMode] = useState(deviceData.mode)
  const [temperature, setTemperature] = useState(deviceData.temperature)
  const [activeTab, setActiveTab] = useState("controls")
  const [timerMinutes, setTimerMinutes] = useState(0)
  const [timerActive, setTimerActive] = useState(false)
  const [presets, setPresets] = useState([
    { id: 1, name: "Đọc sách", brightness: 100, color: "#FFFFFF", temperature: 4000 },
    { id: 2, name: "Xem phim", brightness: 40, color: "#FF9900", temperature: 2700 },
    { id: 3, name: "Ngủ", brightness: 10, color: "#FF5500", temperature: 2000 },
  ])

  // Effects
  const effects = [
    { id: "solid", name: "Sáng đều" },
    { id: "breathing", name: "Nhịp thở" },
    { id: "rainbow", name: "Cầu vồng" },
    { id: "flash", name: "Nhấp nháy" },
    { id: "candle", name: "Ánh nến" },
  ]

  // Update local state when device changes
  useEffect(() => {
    if (device) {
      setPower(device.power)
      setBrightness(device.brightness)
      setColor(device.color)
      setMode(device.mode)
      setTemperature(device.temperature)
    }
  }, [device])

  // Handle power toggle
  const handlePowerToggle = (checked) => {
    setPower(checked)
    onDeviceUpdate({ power: checked })
    console.log(`Turning ${checked ? "on" : "off"} the LED`)
  }

  // Handle brightness change
  const handleBrightnessChange = (value) => {
    setBrightness(value[0])
    onDeviceUpdate({ brightness: value[0] })
    console.log(`Setting brightness to ${value[0]}%`)
  }

  // Handle color change
  const handleColorChange = (e) => {
    setColor(e.target.value)
    onDeviceUpdate({ color: e.target.value })
    console.log(`Setting color to ${e.target.value}`)
  }

  // Handle mode change
  const handleModeChange = (value) => {
    setMode(value)
    onDeviceUpdate({ mode: value })
    console.log(`Setting mode to ${value}`)
  }

  // Handle temperature change
  const handleTemperatureChange = (value) => {
    setTemperature(value[0])
    onDeviceUpdate({ temperature: value[0] })
    console.log(`Setting temperature to ${value[0]}K`)
  }

  // Handle timer set
  const handleSetTimer = () => {
    setTimerActive(true)
    console.log(`Setting timer for ${timerMinutes} minutes`)
  }

  // Handle timer cancel
  const handleCancelTimer = () => {
    setTimerActive(false)
    console.log("Cancelling timer")
  }

  // Handle preset selection
  const handleSelectPreset = (preset) => {
    setBrightness(preset.brightness)
    setColor(preset.color)
    setTemperature(preset.temperature)
    onDeviceUpdate({
      brightness: preset.brightness,
      color: preset.color,
      temperature: preset.temperature,
    })
    console.log(`Applying preset: ${preset.name}`)
  }

  // Handle save preset
  const handleSavePreset = () => {
    const newPreset = {
      id: Date.now(),
      name: `Preset ${presets.length + 1}`,
      brightness,
      color,
      temperature,
    }
    setPresets([...presets, newPreset])
    console.log("Saving new preset", newPreset)
  }

  // Convert temperature to color name
  const getTemperatureName = (temp) => {
    if (temp <= 2700) return "Ấm áp"
    if (temp <= 3500) return "Trung tính"
    if (temp <= 4500) return "Tự nhiên"
    if (temp <= 5500) return "Mát mẻ"
    return "Trắng lạnh"
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Lightbulb className="h-5 w-5 text-amber-500" />
            <span>Điều khiển {deviceData.name}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="controls">Điều khiển</TabsTrigger>
            </TabsList>

            <TabsContent value="controls" className="space-y-6 py-4">
              {/* Power Control */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Power className={`h-5 w-5 ${power ? "text-green-500" : "text-gray-400"}`} />
                  <Label htmlFor="power" className="text-base">
                    Nguồn
                  </Label>
                </div>
                <Switch id="power" checked={power} onCheckedChange={handlePowerToggle} />
              </div>

              {/* Brightness Control */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Zap className="h-5 w-5 text-amber-500" />
                    <Label htmlFor="brightness" className="text-base">
                      Độ sáng
                    </Label>
                  </div>
                  <span className="text-sm font-medium">{brightness}%</span>
                </div>
                <Slider
                  id="brightness"
                  disabled={!power}
                  value={[brightness]}
                  min={1}
                  max={100}
                  step={1}
                  onValueChange={handleBrightnessChange}
                  className={!power ? "opacity-50" : ""}
                />
              </div>

              {/* Color Control */}
              {deviceData.supportedFeatures.color && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Palette className="h-5 w-5 text-purple-500" />
                      <Label htmlFor="color" className="text-base">
                        Màu sắc
                      </Label>
                    </div>
                    <div
                      className="w-6 h-6 rounded-full border border-gray-300"
                      style={{ backgroundColor: color }}
                    ></div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      id="color"
                      value={color}
                      onChange={handleColorChange}
                      disabled={!power}
                      className="w-full h-10 rounded-md cursor-pointer"
                    />
                  </div>
                </div>
              )}

              {/* Temperature Control */}
              {deviceData.supportedFeatures.temperature && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Gauge className="h-5 w-5 text-blue-500" />
                      <Label htmlFor="temperature" className="text-base">
                        Nhiệt độ màu
                      </Label>
                    </div>
                    <span className="text-sm font-medium">{getTemperatureName(temperature)}</span>
                  </div>
                  <Slider
                    id="temperature"
                    disabled={!power}
                    value={[temperature]}
                    min={2000}
                    max={6500}
                    step={100}
                    onValueChange={handleTemperatureChange}
                    className={!power ? "opacity-50" : ""}
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Ấm áp</span>
                    <span>Trung tính</span>
                    <span>Trắng lạnh</span>
                  </div>
                </div>
              )}

              {/* Timer Control */}
              <div className="space-y-2 pt-2 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Timer className="h-5 w-5 text-gray-500" />
                    <Label className="text-base">Hẹn giờ tắt</Label>
                  </div>
                  {timerActive ? (
                    <Button variant="outline" size="sm" onClick={handleCancelTimer}>
                      Hủy
                    </Button>
                  ) : null}
                </div>

                {timerActive ? (
                  <div className="flex items-center justify-center p-2 bg-amber-50 rounded-md border border-amber-200">
                    <Clock className="h-4 w-4 text-amber-500 mr-2" />
                    <span className="text-sm text-amber-700">
                      Đèn sẽ tắt sau <span className="font-bold">{timerMinutes}</span> phút
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Select
                      value={timerMinutes.toString()}
                      onValueChange={(value) => setTimerMinutes(parseInt(value))}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Chọn thời gian" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="15">15 phút</SelectItem>
                        <SelectItem value="30">30 phút</SelectItem>
                        <SelectItem value="45">45 phút</SelectItem>
                        <SelectItem value="60">1 giờ</SelectItem>
                        <SelectItem value="120">2 giờ</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button onClick={handleSetTimer} disabled={timerMinutes === 0 || !power}>
                      Đặt
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>


          </Tabs>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}