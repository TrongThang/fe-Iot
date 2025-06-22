import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Lightbulb, Fan, Thermometer, Power, Lock, Unlock, Trash2, Link } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import axiosPublic from "@/apis/clients/public.client"

const getDeviceIcon = (templateId) => {
    if (templateId === '1') return <Lightbulb className="h-5 w-5" />
    if (templateId === '2') return <Fan className="h-5 w-5" />
    if (templateId === '3') return <Thermometer className="h-5 w-5" />
    return <Power className="h-5 w-5" />
}

export default function DeviceDetailsModal({
    isOpen,
    onClose,
    device,
    onDeviceAction,
    isActionLoading,
    onSuccess
}) {
    const [loading, setLoading] = useState(false)

    const handleUnlinkDevice = async () => {
        if (!device) return

        setLoading(true)
        try {
            const response = await axiosPublic.put(
                `/customer-search/devices/${device.device_id}/${device.serial_number}/unlink`
            )

            if (response.data.success) {
                toast.success('Hủy liên kết thiết bị thành công')
                onSuccess && onSuccess()
                onClose()
            }
        } catch (error) {
            console.error('Error unlinking device:', error)
            const message = error.response?.data?.error?.message || 'Lỗi khi hủy liên kết thiết bị'
            toast.error(message)
        } finally {
            setLoading(false)
        }
    }

    if (!device) return null

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold flex items-center justify-between">
                        <span>Chi tiết thiết bị</span>
                        {device.link_status === 'linked' && (
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={handleUnlinkDevice}
                                disabled={loading}
                                className="ml-2"
                            >
                                <Link className="h-4 w-4 mr-1" />
                                {loading ? 'Đang xử lý...' : 'Hủy liên kết'}
                            </Button>
                        )}
                    </DialogTitle>
                    <DialogDescription>
                        Thông tin chi tiết và quản lý thiết bị
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Device Header */}
                    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
                        <div className="p-3 rounded-lg bg-blue-50">
                            {getDeviceIcon(device.template_id)}
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-slate-900">{device.name}</h3>
                            <p className="text-sm text-slate-500">ID: {device.device_id}</p>
                            <p className="text-xs text-slate-400">Serial: {device.serial_number}</p>
                        </div>
                    </div>

                    {/* Device Information Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium">Thông tin cơ bản</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-sm text-slate-500">Template ID:</span>
                                    <span className="text-sm font-medium">{device.template_id}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-slate-500">Trạng thái khóa:</span>
                                    <Badge variant={device.lock_status === 'locked' ? 'text-red-500' : 'text-green-500'}>
                                        {device.lock_status === 'locked' ? 'Đã khóa' : 'Chưa khóa'}
                                    </Badge>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-slate-500">Kết nối:</span>
                                    <Badge variant={device.link_status === 'linked' ? 'success' : 'secondary'}>
                                        {device.link_status === 'linked' ? 'Đang kết nối' : 'Mất kết nối'}
                                    </Badge>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-slate-500">Nguồn:</span>
                                    <Badge variant={device.power_status === true ? 'success' : 'secondary'}>
                                        {device.power_status === true ? 'Bật' : 'Tắt'}
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium">Vị trí</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-sm text-slate-500">Không gian:</span>
                                    <span className="text-sm font-medium">{device.space?.name || 'Chưa có'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-slate-500">Nhà:</span>
                                    <span className="text-sm font-medium">{device.space?.house?.name || 'Chưa có'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-slate-500">Địa chỉ:</span>
                                    <span className="text-sm font-medium">{device.space?.house?.address || 'Chưa có'}</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4 border-t">
                        {device.lock_status === 'locked' ? (
                            <Button
                                onClick={() => onDeviceAction('unlock', device)}
                                disabled={isActionLoading}
                                variant="outline"
                                className="flex-1"
                            >
                                <Unlock className="h-4 w-4 mr-2" />
                                Mở khóa thiết bị
                            </Button>
                        ) : (
                            <Button
                                onClick={() => onDeviceAction('lock', device)}
                                disabled={isActionLoading}
                                variant="outline"
                                className="flex-1"
                            >
                                <Lock className="h-4 w-4 mr-2" />
                                Khóa thiết bị
                            </Button>
                        )}

                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    variant="destructive"
                                    className="flex-1"
                                    disabled={isActionLoading}
                                >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Xóa thiết bị
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Xác nhận xóa thiết bị</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Bạn có chắc chắn muốn xóa thiết bị "{device.name}"?
                                        Hành động này không thể hoàn tác.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Hủy</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={() => onDeviceAction('delete', device)}
                                        className="bg-red-600 hover:bg-red-700"
                                    >
                                        Xóa
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
