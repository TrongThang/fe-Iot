import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Lightbulb, Flame, Thermometer, Palette, Zap, AlertTriangle, Droplets, Wind } from "lucide-react"

// Light Detail Component
export function LightDetail({ device }) {
  return (
    <div className="space-y-6">
      {/* Light Status */}
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <div
              className={`w-24 h-24 mx-auto mb-4 rounded-full flex items-center justify-center ${
                device.isOn ? "bg-amber-100" : "bg-gray-100"
              }`}
            >
              <Lightbulb className={`w-12 h-12 ${device.isOn ? "text-amber-500" : "text-gray-400"}`} />
            </div>
            <h3 className="text-2xl font-bold mb-2">{device.brightness}%</h3>
            <p className="text-slate-600">Độ sáng hiện tại</p>
          </div>
        </CardContent>
      </Card>

      {/* Light Controls */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Điều khiển đèn</h3>

          <div className="space-y-6">
            {/* Brightness Control */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-medium">Độ sáng</span>
                <span className="text-sm text-slate-500">{device.brightness}%</span>
              </div>
              <Slider value={[device.brightness]} max={100} step={1} className="w-full" disabled={!device.isOn} />
            </div>

            {/* Color Control */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-medium">Màu sắc</span>
                <Badge variant="outline" className="capitalize">
                  {device.color}
                </Badge>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={device.color === "white" ? "default" : "outline"}
                  size="sm"
                  className="flex-1"
                  disabled={!device.isOn}
                >
                  Trắng
                </Button>
                <Button
                  variant={device.color === "warm" ? "default" : "outline"}
                  size="sm"
                  className="flex-1"
                  disabled={!device.isOn}
                >
                  Ấm
                </Button>
                <Button
                  variant={device.color === "cool" ? "default" : "outline"}
                  size="sm"
                  className="flex-1"
                  disabled={!device.isOn}
                >
                  Lạnh
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Light Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Zap className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <div className="text-lg font-semibold">12W</div>
            <p className="text-sm text-slate-600">Công suất</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Palette className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <div className="text-lg font-semibold capitalize">{device.color}</div>
            <p className="text-sm text-slate-600">Màu hiện tại</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Smoke Detector Detail Component
export function SmokeDetectorDetail({ device }) {
  const isWarning = device.ppm > 1000
  const tempWarning = device.temp > 35

  return (
    <div className="space-y-6">
      {/* Smoke Status */}
      <Card className={isWarning ? "border-red-200 bg-red-50" : ""}>
        <CardContent className="p-6">
          <div className="text-center">
            <div
              className={`w-24 h-24 mx-auto mb-4 rounded-full flex items-center justify-center ${
                isWarning ? "bg-red-100" : device.isOn ? "bg-green-100" : "bg-gray-100"
              }`}
            >
              <Flame
                className={`w-12 h-12 ${isWarning ? "text-red-500" : device.isOn ? "text-green-500" : "text-gray-400"}`}
              />
            </div>
            <h3 className="text-2xl font-bold mb-2">{device.ppm} PPM</h3>
            <p className="text-slate-600">Nồng độ khói</p>
            {isWarning && (
              <Badge variant="destructive" className="mt-2">
                <AlertTriangle className="w-3 h-3 mr-1" />
                Cảnh báo
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Environmental Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card className={tempWarning ? "border-orange-200 bg-orange-50" : ""}>
          <CardContent className="p-4 text-center">
            <Thermometer className={`w-8 h-8 mx-auto mb-2 ${tempWarning ? "text-orange-500" : "text-blue-500"}`} />
            <div className="text-lg font-semibold">{device.temp}°C</div>
            <p className="text-sm text-slate-600">Nhiệt độ</p>
            {tempWarning && (
              <Badge variant="outline" className="mt-1 text-orange-600 border-orange-300">
                Cao
              </Badge>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="w-8 h-8 mx-auto mb-2 rounded-full bg-green-100 flex items-center justify-center">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            </div>
            <div className="text-lg font-semibold">Bình thường</div>
            <p className="text-sm text-slate-600">Trạng thái</p>
          </CardContent>
        </Card>
      </div>

      {/* Safety Information */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Thông tin an toàn</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Ngưỡng cảnh báo</span>
              <span className="font-medium">1000 PPM</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Kiểm tra cuối</span>
              <span className="font-medium">15 ngày trước</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Thời hạn pin</span>
              <span className="font-medium">8 tháng</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Temperature Detail Component
export function TemperatureDetail({ device }) {
  const tempStatus = device.temp > 30 ? "hot" : device.temp < 20 ? "cold" : "normal"
  const humidityStatus = device.humidity > 70 ? "high" : device.humidity < 40 ? "low" : "normal"

  return (
    <div className="space-y-6">
      {/* Temperature Display */}
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <div
              className={`w-24 h-24 mx-auto mb-4 rounded-full flex items-center justify-center ${
                tempStatus === "hot" ? "bg-red-100" : tempStatus === "cold" ? "bg-blue-100" : "bg-green-100"
              }`}
            >
              <Thermometer
                className={`w-12 h-12 ${
                  tempStatus === "hot" ? "text-red-500" : tempStatus === "cold" ? "text-blue-500" : "text-green-500"
                }`}
              />
            </div>
            <h3 className="text-3xl font-bold mb-2">{device.temp}°C</h3>
            <p className="text-slate-600">Nhiệt độ hiện tại</p>
            <Badge
              variant={tempStatus === "normal" ? "default" : "outline"}
              className={`mt-2 ${
                tempStatus === "hot"
                  ? "text-red-600 border-red-300"
                  : tempStatus === "cold"
                    ? "text-blue-600 border-blue-300"
                    : ""
              }`}
            >
              {tempStatus === "hot" ? "Nóng" : tempStatus === "cold" ? "Lạnh" : "Bình thường"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Environmental Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Droplets
              className={`w-8 h-8 mx-auto mb-2 ${
                humidityStatus === "high"
                  ? "text-blue-600"
                  : humidityStatus === "low"
                    ? "text-orange-500"
                    : "text-green-500"
              }`}
            />
            <div className="text-lg font-semibold">{device.humidity}%</div>
            <p className="text-sm text-slate-600">Độ ẩm</p>
            <Badge
              variant="outline"
              className={`mt-1 text-xs ${
                humidityStatus === "high"
                  ? "text-blue-600 border-blue-300"
                  : humidityStatus === "low"
                    ? "text-orange-600 border-orange-300"
                    : "text-green-600 border-green-300"
              }`}
            >
              {humidityStatus === "high" ? "Cao" : humidityStatus === "low" ? "Thấp" : "Tốt"}
            </Badge>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Wind className="w-8 h-8 text-gray-500 mx-auto mb-2" />
            <div className="text-lg font-semibold">Tốt</div>
            <p className="text-sm text-slate-600">Chất lượng không khí</p>
          </CardContent>
        </Card>
      </div>

      {/* Temperature Chart Placeholder */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Biểu đồ nhiệt độ 24h</h3>
          <div className="h-32 bg-gradient-to-r from-blue-100 to-red-100 rounded-lg flex items-center justify-center">
            <p className="text-slate-500">Biểu đồ nhiệt độ theo thời gian</p>
          </div>
        </CardContent>
      </Card>

      {/* Comfort Level */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Mức độ thoải mái</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Nhiệt độ lý tưởng</span>
              <span className="font-medium">22-26°C</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Độ ẩm lý tưởng</span>
              <span className="font-medium">40-60%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Đánh giá tổng thể</span>
              <Badge variant={tempStatus === "normal" && humidityStatus === "normal" ? "default" : "outline"}>
                {tempStatus === "normal" && humidityStatus === "normal" ? "Thoải mái" : "Cần điều chỉnh"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
