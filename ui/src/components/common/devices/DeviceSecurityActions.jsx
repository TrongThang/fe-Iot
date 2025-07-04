import React, { useState } from 'react';
import { Card, CardContent } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Switch } from '../../ui/switch';
import { 
    Lock, 
    Unlock, 
    Shield, 
    AlertTriangle,
    Clock,
    User
} from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "../../ui/alert-dialog";
import { Alert, AlertDescription } from "../../ui/alert";
import deviceApi from '../../../apis/modules/deviceApi';

const DeviceSecurityActions = ({ device, onSecurityUpdate }) => {
    const [isLocked, setIsLocked] = useState(device?.lock_status === 'locked' || false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Auto-clear messages after 5 seconds
    React.useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => setSuccessMessage(''), 5000);
            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    React.useEffect(() => {
        if (error) {
            const timer = setTimeout(() => setError(''), 5000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    const handleLockToggle = async (locked) => {
        setIsUpdating(true);
        setError('');
        setSuccessMessage('');
        
        try {
            const deviceId = device?.device_id || device?.id;
            const serialNumber = device?.serial_number;
            
            if (!deviceId || !serialNumber) {
                throw new Error('Thiếu thông tin thiết bị');
            }

            if (locked) {
                await deviceApi.lockDevice(deviceId, serialNumber);
                setSuccessMessage('Thiết bị đã được khóa thành công');
            } else {
                await deviceApi.unlockDevice(deviceId, serialNumber);
                setSuccessMessage('Thiết bị đã được mở khóa thành công');
            }
            
            setIsLocked(locked);
            
            // Call parent callback if provided
            await onSecurityUpdate?.('lock', { 
                is_locked: locked, 
                lock_status: locked ? 'locked' : 'unlocked' 
            });
            
        } catch (error) {
            console.error('Failed to update device lock status:', error);
            setError(error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật trạng thái khóa thiết bị');
        } finally {
            setIsUpdating(false);
        }
    };

    const handleEmergencyLock = async () => {
        setIsUpdating(true);
        setError('');
        setSuccessMessage('');
        
        try {
            const deviceId = device?.device_id || device?.id;
            const serialNumber = device?.serial_number;
            
            if (!deviceId || !serialNumber) {
                throw new Error('Thiếu thông tin thiết bị');
            }

            await deviceApi.lockDevice(deviceId, serialNumber);
            setIsLocked(true);
            setSuccessMessage('Khóa khẩn cấp đã được kích hoạt');
            
            await onSecurityUpdate?.('emergency_lock', { 
                is_locked: true, 
                lock_status: 'locked',
                emergency: true 
            });
            
        } catch (error) {
            console.error('Failed to activate emergency lock:', error);
            setError(error.response?.data?.message || 'Có lỗi xảy ra khi kích hoạt khóa khẩn cấp');
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <Card>
            <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold flex items-center">
                        <Shield className="w-5 h-5 mr-2" />
                        Bảo mật thiết bị
                    </h3>
                    <Badge variant={isLocked ? "destructive" : "secondary"}>
                        {isLocked ? "Đã khoá" : "Mở khoá"}
                    </Badge>
                </div>

                <div className="space-y-4">
                    {/* Success Message */}
                    {successMessage && (
                        <Alert className="border-green-200 bg-green-50">
                            <AlertDescription className="text-green-800">
                                {successMessage}
                            </AlertDescription>
                        </Alert>
                    )}

                    {/* Error Message */}
                    {error && (
                        <Alert variant="destructive">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {/* Device Lock Status */}
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                            {isLocked ? (
                                <Lock className="w-5 h-5 text-red-500" />
                            ) : (
                                <Unlock className="w-5 h-5 text-green-500" />
                            )}
                            <div>
                                <p className="font-medium">
                                    {isLocked ? "Thiết bị đã bị khoá" : "Thiết bị đang hoạt động"}
                                </p>
                                <p className="text-sm text-slate-600">
                                    {isLocked 
                                        ? "Tất cả điều khiển đã bị vô hiệu hoá" 
                                        : "Thiết bị có thể được điều khiển bình thường"
                                    }
                                </p>
                            </div>
                        </div>
                        <Switch
                            checked={isLocked}
                            onCheckedChange={handleLockToggle}
                            disabled={isUpdating}
                        />
                    </div>

                    {/* Security Info */}
                    <div className="grid grid-cols-1 gap-3">
                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center space-x-2">
                                <User className="w-4 h-4 text-slate-500" />
                                <span className="text-slate-600">Chủ sở hữu:</span>
                            </div>
                            <span className="font-medium">{device?.owner_name || "Bạn"}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center space-x-2">
                                <Clock className="w-4 h-4 text-slate-500" />
                                <span className="text-slate-600">Cập nhật cuối:</span>
                            </div>
                            <span className="font-medium">
                                {device?.updated_at ? 
                                    new Date(device.updated_at).toLocaleString('vi-VN') : 
                                    device?.locked_at ?
                                    new Date(device.locked_at).toLocaleString('vi-VN') :
                                    "Chưa rõ"
                                }
                            </span>
                        </div>
                        {device?.serial_number && (
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center space-x-2">
                                    <Shield className="w-4 h-4 text-slate-500" />
                                    <span className="text-slate-600">Serial:</span>
                                </div>
                                <span className="font-mono text-xs">{device.serial_number}</span>
                            </div>
                        )}
                    </div>

                    {/* Emergency Lock */}
                    <div className="pt-4 border-t border-slate-200">
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button 
                                    variant="destructive" 
                                    className="w-full"
                                    disabled={isLocked || isUpdating}
                                >
                                    <AlertTriangle className="w-4 h-4 mr-2" />
                                    Khoá khẩn cấp
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle className="flex items-center">
                                        <AlertTriangle className="w-5 h-5 mr-2 text-red-500" />
                                        Xác nhận khoá khẩn cấp
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Khóa khẩn cấp sẽ ngay lập tức vô hiệu hóa tất cả chức năng của thiết bị. 
                                        <br /><br />
                                        <strong>Khi nào nên sử dụng:</strong>
                                        <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                                            <li>Thiết bị hoạt động bất thường</li>
                                            <li>Phát hiện truy cập trái phép</li>
                                            <li>Tình huống khẩn cấp về an toàn</li>
                                        </ul>
                                        <br />
                                        <strong>Lưu ý:</strong> Sau khi khóa, bạn có thể mở khóa lại thông qua giao diện này.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Huỷ bỏ</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={handleEmergencyLock}
                                        className="bg-red-600 hover:bg-red-700"
                                    >
                                        Khoá ngay
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>

                    {/* Lock History */}
                    {device?.lock_history && device.lock_history.length > 0 && (
                        <div className="pt-4 border-t border-slate-200">
                            <h4 className="text-sm font-medium mb-2">Lịch sử khoá</h4>
                            <div className="space-y-2 max-h-32 overflow-y-auto">
                                {device.lock_history.slice(0, 3).map((entry, index) => (
                                    <div key={index} className="flex justify-between items-center text-xs p-2 bg-slate-50 rounded">
                                        <span>{entry.action === 'lock' ? 'Đã khoá' : 'Đã mở khoá'}</span>
                                        <span className="text-slate-500">
                                            {new Date(entry.timestamp).toLocaleString('vi-VN')}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default DeviceSecurityActions; 