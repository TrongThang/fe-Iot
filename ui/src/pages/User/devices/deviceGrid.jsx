
import { cn } from "@/lib/utils"
import {
    Edit,
    Trash2,
    Loader2,
    Plus,
    Smartphone,
    Wifi,
    WifiOff,
} from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function DeviceGrid({
    devices,
    isLoading,
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
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-10 w-10 text-blue-500 animate-spin mb-4" />
                <p className="text-slate-500">Đang tải danh sách thiết bị...</p>
            </div>
        )
    }

    if (!devices.length) {
        return (
            <div className="text-center py-12 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                <Smartphone className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500 mb-2">Không tìm thấy thiết bị nào</p>
                <p className="text-slate-400 text-sm mb-4">Thử thay đổi bộ lọc hoặc thêm thiết bị mới</p>
                <Button onClick={() => { }} variant="outline" className="border-slate-200 bg-transparent">
                    <Plus className="h-4 w-4 mr-2" />
                    Thêm thiết bị
                </Button>
            </div>
        )
    }

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
                    onClick={() => {
                        console.log("Device clicked:", device);
                        onDeviceClick(device);
                    }}
                    className={cn(
                        "bg-white border border-slate-200 rounded-xl p-4 cursor-pointer hover:shadow-md hover:border-blue-300 transition-all duration-200 relative group",
                        selectedDevice?.id === device.id && "ring-2 ring-blue-500 shadow-md border-blue-300",
                        isCompact && "flex items-center space-x-4", // Horizontal layout khi compact
                    )}
                >
                    {isCompact ? (
                        <>
                            <div className="flex items-center space-x-3 flex-1">
                                <div
                                    className={`w-12 h-12 bg-gradient-to-br ${getDeviceColor(device.type)} rounded-lg flex items-center justify-center shadow-sm`}
                                >
                                    {getDeviceIcon(device.type)}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-medium text-slate-900">{device.name}</h3>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                {device.type === "camera" && (
                                    <div className="flex items-center gap-1">
                                        {device.power_status ? (
                                            <Wifi className="w-4 h-4 text-green-500" />
                                        ) : (
                                            <WifiOff className="w-4 h-4 text-gray-400" />
                                        )}
                                    </div>
                                )}
                                <Switch
                                    checked={device.power_status}
                                    onCheckedChange={(checked) => onToggle({ target: { checked } }, device.id)}
                                    onClick={(e) => e.stopPropagation()}
                                    className="data-[state=checked]:bg-green-500"
                                />
                            </div>
                        </>
                    ) : (
                        // ... (giữ nguyên phần layout normal như code cũ của bạn)
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
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {device.type === "camera" && (
                                        <div className="flex items-center gap-1">
                                            {device.power_status ? (
                                                <Wifi className="w-3 h-3 text-green-500" />
                                            ) : (
                                                <WifiOff className="w-3 h-3 text-gray-400" />
                                            )}
                                        </div>
                                    )}
                                    <Switch
                                        checked={device.power_status}
                                        onCheckedChange={(checked) => onToggle({ target: { checked } }, device.id)}
                                        onClick={(e) => e.stopPropagation()}
                                        className="data-[state=checked]:bg-green-500"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <div className="text-xs text-slate-500">{device.group_name}</div>
                                    {device.ownership === "shared" && (
                                        <Badge variant="outline" className="text-xs px-1 py-0.5 bg-blue-50 text-blue-600 border-blue-200">
                                            {device.owner}
                                        </Badge>
                                    )}
                                </div>
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