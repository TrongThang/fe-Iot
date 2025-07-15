
import { cn } from "@/lib/utils"
import {
    Edit,
    Trash2,
    Loader2,
    Plus,
    Smartphone,
    Wifi,
    WifiOff,
    Users,
    Eye,
    Settings
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
                    ? "grid-cols-1"
                    : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
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
                        isCompact && "flex items-center space-x-4",
                    )}
                >
                    {isCompact ? (
                        <>
                            <div className="flex items-center space-x-3 flex-1">
                                <div
                                    className={`w-12 h-12 bg-gradient-to-br ${getDeviceColor(device.type)} rounded-lg flex items-center justify-center shadow-sm`}
                                >
                                    <img src={device.device_type_parent_image} alt={device.name} className="w-10 h-10" />
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
                                    disabled={device.ownership === "shared" && device.permission_type === 'VIEW'}
                                    onCheckedChange={(checked) => onToggle({ target: { checked } }, device.id)}
                                    onClick={(e) => e.stopPropagation()}
                                    className="data-[state=checked]:bg-green-500"
                                />
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center space-x-3">
                                    <div
                                        className={`w-10 h-10 bg-gradient-to-br ${getDeviceColor(device.type)} rounded-lg flex items-center justify-center shadow-sm`}
                                    >
                                        <img src={device.device_type_parent_image} alt={device.name} className="w-10 h-10 object-cover" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-slate-900">{device.name}</h3>
                                            <p
                                                className="text-sm text-white overflow-hidden badge bg-blue-300 rounded-full px-2 py-1 w-fit"
                                                title={device.device_type_parent_name}
                                            >
                                                {device.device_type_parent_name}
                                            </p>
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
                                        disabled={device.ownership === "shared" && device.permission_type === 'VIEW'}
                                        onCheckedChange={(checked) => onToggle({ target: { checked } }, device.id)}
                                        onClick={(e) => e.stopPropagation()}
                                        className="data-[state=checked]:bg-green-500"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    {device.ownership === "shared" ? (
                                        <div className="flex items-center gap-1">
                                            <Badge variant="outline" className="text-xs px-2 py-0.5 bg-orange-50 text-orange-600 border-orange-200 flex items-center gap-1">
                                                <Users size={10} />
                                                Được chia sẻ
                                            </Badge>
                                            {device.permission_type && (
                                                <Badge variant="outline" className={cn(
                                                    "text-xs px-2 py-0.5 flex items-center gap-1",
                                                    device.permission_type === 'CONTROL' 
                                                        ? "bg-green-50 text-green-600 border-green-200"
                                                        : "bg-blue-50 text-blue-600 border-blue-200"
                                                )}>
                                                    {device.permission_type === 'CONTROL' ? (
                                                        <>
                                                            <Settings size={10} />
                                                            Điều khiển
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Eye size={10} />
                                                            Chỉ xem
                                                        </>
                                                    )}
                                                </Badge>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="text-xs text-slate-500">{device.group_name || 'Thiết bị của tôi'}</div>
                                    )}
                                </div>
                                <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    {/* Chỉ hiển thị nút edit/delete cho thiết bị của mình hoặc shared device có quyền CONTROL */}
                                    {(device.ownership === "mine" || device.permission_type === 'CONTROL') && (
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
                                    )}
                                    
                                    {/* Chỉ hiển thị nút delete cho thiết bị của mình */}
                                    {device.ownership === "mine" && (
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
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            ))}
        </div>
    )
}