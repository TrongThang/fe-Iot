
import { cn } from "@/lib/utils"
import {
    Edit,
    Trash2,
    Wifi,
    WifiOff,
} from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function DeviceGrid({
    devices,
    selectedDevice,
    onDeviceClick,
    onToggle,
    onEdit,
    onDelete,
    getDeviceIcon,
    getDeviceColor,
    getDeviceStatusColor,
    isCompact = false,
}) {
    return (
        <div
            className={cn(
                "grid gap-4",
                isCompact
                    ? "grid-cols-1" // Single column khi compact
                    : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3", // Normal grid
            )}
        >
            {devices.map((device) => (
                <div
                    key={device.id}
                    onClick={() => onDeviceClick(device)}
                    className={cn(
                        "bg-white border border-slate-200 rounded-xl p-4 cursor-pointer hover:shadow-md hover:border-blue-300 transition-all duration-200 relative group",
                        selectedDevice?.id === device.id && "ring-2 ring-blue-500 shadow-md",
                        isCompact && "flex items-center space-x-4", // Horizontal layout khi compact
                    )}
                >
                    {isCompact ? (
                        // Compact horizontal layout
                        <>
                            <div className="flex items-center space-x-3 flex-1">
                                <div
                                    className={`w-12 h-12 bg-gradient-to-br ${getDeviceColor(device.type)} rounded-lg flex items-center justify-center shadow-sm`}
                                >
                                    {getDeviceIcon(device.type)}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-medium text-slate-900">{device.name}</h3>
                                    <p className="text-sm text-slate-500">{device.room}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Badge
                                            variant="outline"
                                            className={cn("text-xs px-2 py-1", getDeviceStatusColor(device.status, device?.power_status))}
                                        >
                                            {device?.power_status ? "Hoạt động" : "Tắt"}
                                        </Badge>
                                        <span className="text-xs text-slate-400">{device.lastActivity}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                {device.type === "camera" && (
                                    <div className="flex items-center gap-1">
                                        {device?.power_status ? (
                                            <Wifi className="w-4 h-4 text-green-500" />
                                        ) : (
                                            <WifiOff className="w-4 h-4 text-gray-400" />
                                        )}
                                    </div>
                                )}
                                <Switch
                                    checked={device?.power_status}
                                    onCheckedChange={(checked) => onToggle(device.id)}
                                    onClick={(e) => e.stopPropagation()}
                                    className="data-[state=checked]:bg-green-500"
                                />
                            </div>
                        </>
                    ) : (
                        // Normal card layout (giữ nguyên code cũ)
                        <>
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center space-x-3">
                                    <div
                                        className={`w-10 h-10 bg-gradient-to-br ${getDeviceColor(device.type)} rounded-lg flex items-center justify-center shadow-sm`}
                                    >
                                        {getDeviceIcon(device.type)}
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-slate-900">{device.name}</h3>
                                        <p className="text-xs text-slate-500">{device.room}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {device.type === "camera" && (
                                        <div className="flex items-center gap-1">
                                            {device?.power_status ? (
                                                <Wifi className="w-3 h-3 text-green-500" />
                                            ) : (
                                                <WifiOff className="w-3 h-3 text-gray-400" />
                                            )}
                                        </div>
                                    )}
                                    <Switch
                                        checked={device?.power_status}
                                        onCheckedChange={() => onToggle(device.id)}
                                        onClick={(e) => e.stopPropagation()}
                                        className="data-[state=checked]:bg-green-500"
                                    />
                                </div>
                            </div>

                            {/* Device Status */}
                            <div className="flex items-center justify-between mb-3">
                                <Badge
                                    variant="outline"
                                    className={cn("text-xs px-2 py-1", getDeviceStatusColor(device.status, device?.power_status))}
                                >
                                    {device?.power_status ? "Đang hoạt động" : "Đã tắt"}
                                </Badge>
                                <span className="text-xs text-slate-500">{device.lastActivity}</span>
                            </div>

                            {/* Device Type Specific Info */}
                            <div className="bg-slate-50 rounded-lg p-3 mb-3">
                                {device.type === "camera" && (
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-slate-600">Độ phân giải</span>
                                        <span className="text-sm font-medium">{device.resolution}</span>
                                    </div>
                                )}

                                {device.type === "light" && (
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-slate-600">Độ sáng</span>
                                        <div className="flex items-center">
                                            <div className="w-16 bg-slate-200 rounded-full h-1.5 mr-2">
                                                <div
                                                    className="bg-amber-500 h-1.5 rounded-full"
                                                    style={{ width: `${device.brightness}%`, opacity: device?.power_status ? 1 : 0.5 }}
                                                />
                                            </div>
                                            <span className="text-sm font-medium">{device.brightness}%</span>
                                        </div>
                                    </div>
                                )}

                                {device.type === "smoke" && (
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-slate-600">PPM</span>
                                        <span className={`text-sm font-medium ${device.ppm > 1000 ? "text-red-600" : "text-slate-700"}`}>
                                            {device.ppm}
                                        </span>
                                    </div>
                                )}

                                {device.type === "temperature" && (
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-slate-600">Nhiệt độ</span>
                                        <span className={`text-sm font-medium ${device.temp > 30 ? "text-red-600" : "text-slate-700"}`}>
                                            {device.temp}°C
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex justify-between items-center">
                                <div className="text-xs text-slate-500">{device.group_name}</div>
                                <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 rounded-lg hover:bg-slate-100"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            onEdit(device.id)
                                        }}
                                    >
                                        <Edit size={14} className="text-slate-600" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 rounded-lg hover:bg-red-50 hover:text-red-600"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            onDelete(device.id)
                                        }}
                                    >
                                        <Trash2 size={14} className="text-slate-600 hover:text-red-600" />
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            ))}
        </div>
    )
}