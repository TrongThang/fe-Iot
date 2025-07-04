import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
    Flame, 
    Shield, 
    Volume2, 
    VolumeX, 
    Bell, 
    BellOff,
    Thermometer,
    Wind,
    Activity,
    AlertTriangle,
    CheckCircle,
    Clock,
    Settings
} from "lucide-react";

const FireDetectorInterface = ({ 
    device, 
    currentAlert, 
    isAlerting,
    alertLevel,
    sensorData,
    lastUpdate,
    isConnected,
    isDeviceConnected,
    onAcknowledgeAlert,
    onClearAlert,
    onToggleSound,
    isSoundEnabled,
    onToggleNotifications,
    isNotificationsEnabled = true
}) => {
    const [muteUntil, setMuteUntil] = useState(null);
    const [autoMuteTimer, setAutoMuteTimer] = useState(null);

    // Auto-unmute after specified time
    useEffect(() => {
        if (muteUntil) {
            const timer = setTimeout(() => {
                setMuteUntil(null);
                if (onToggleSound && !isSoundEnabled) {
                    onToggleSound();
                }
            }, muteUntil - Date.now());

            setAutoMuteTimer(timer);
            return () => clearTimeout(timer);
        }
    }, [muteUntil, onToggleSound, isSoundEnabled]);

    // Temporary mute functions
    const handleMuteFor = (minutes) => {
        const muteTime = Date.now() + (minutes * 60 * 1000);
        setMuteUntil(muteTime);
        if (onToggleSound && isSoundEnabled) {
            onToggleSound();
        }
    };

    const handleUnmute = () => {
        setMuteUntil(null);
        if (autoMuteTimer) {
            clearTimeout(autoMuteTimer);
            setAutoMuteTimer(null);
        }
        if (onToggleSound && !isSoundEnabled) {
            onToggleSound();
        }
    };

    // Get status color and icon based on alert level and connection
    const getStatusInfo = () => {
        if (!isConnected || !isDeviceConnected) {
            return {
                color: 'gray',
                bgColor: 'bg-gray-100',
                borderColor: 'border-gray-300',
                icon: <Shield className="w-6 h-6 text-gray-500" />,
                status: 'Không kết nối',
                description: 'Thiết bị đang offline'
            };
        }

        if (currentAlert) {
            switch(alertLevel) {
                case 'critical':
                    return {
                        color: 'red',
                        bgColor: 'bg-red-50',
                        borderColor: 'border-red-500',
                        icon: <Flame className="w-6 h-6 text-red-600 animate-pulse" />,
                        status: 'KHẨN CẤP',
                        description: 'Phát hiện nguy hiểm nghiêm trọng!'
                    };
                case 'danger':
                    return {
                        color: 'orange',
                        bgColor: 'bg-orange-50',
                        borderColor: 'border-orange-500',
                        icon: <AlertTriangle className="w-6 h-6 text-orange-600" />,
                        status: 'CẢNH BÁO',
                        description: 'Mức độ nguy hiểm cao'
                    };
                case 'warning':
                    return {
                        color: 'yellow',
                        bgColor: 'bg-yellow-50',
                        borderColor: 'border-yellow-500',
                        icon: <AlertTriangle className="w-6 h-6 text-yellow-600" />,
                        status: 'CẢNH BÁO',
                        description: 'Phát hiện bất thường'
                    };
                default:
                    return {
                        color: 'green',
                        bgColor: 'bg-green-50',
                        borderColor: 'border-green-500',
                        icon: <CheckCircle className="w-6 h-6 text-green-600" />,
                        status: 'Bình thường',
                        description: 'Hệ thống hoạt động tốt'
                    };
            }
        }

        return {
            color: 'green',
            bgColor: 'bg-green-50',
            borderColor: 'border-green-500',
            icon: <CheckCircle className="w-6 h-6 text-green-600" />,
            status: 'Bình thường',
            description: 'Hệ thống hoạt động tốt'
        };
    };

    const statusInfo = getStatusInfo();

    return (
        <div className="space-y-4">
            {/* Main Status Card */}
            <Card className={`${statusInfo.bgColor} ${statusInfo.borderColor} border-2`}>
                <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            {statusInfo.icon}
                            <div>
                                <h3 className="text-xl font-bold">{device?.name || 'Thiết bị báo cháy'}</h3>
                                <p className="text-sm text-gray-600">Serial: {device?.serial_number}</p>
                            </div>
                        </div>
                        
                        <div className="text-right">
                            <Badge 
                                variant={statusInfo.color === 'red' ? 'destructive' : 
                                        statusInfo.color === 'orange' ? 'secondary' : 
                                        statusInfo.color === 'yellow' ? 'outline' : 'default'}
                                className="text-lg px-3 py-1"
                            >
                                {statusInfo.status}
                            </Badge>
                            <p className="text-sm text-gray-600 mt-1">{statusInfo.description}</p>
                        </div>
                    </div>

                    {/* Connection Status */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                            <span className="text-sm">Socket: {isConnected ? 'Kết nối' : 'Mất kết nối'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${isDeviceConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                            <span className="text-sm">Thiết bị: {isDeviceConnected ? 'Online' : 'Offline'}</span>
                        </div>
                    </div>

                    {/* Sensor Readings */}
                    {sensorData && (
                        <div className="grid grid-cols-3 gap-4 mb-4 p-3 bg-white/50 rounded-lg">
                            <div className="text-center">
                                <Wind className="w-5 h-5 mx-auto mb-1 text-blue-600" />
                                <div className="text-sm text-gray-600">Khí gas</div>
                                <div className="font-semibold">{sensorData.gas || sensorData.ppm || 0} PPM</div>
                            </div>
                            <div className="text-center">
                                <Thermometer className="w-5 h-5 mx-auto mb-1 text-red-600" />
                                <div className="text-sm text-gray-600">Nhiệt độ</div>
                                <div className="font-semibold">{sensorData.temp || 0}°C</div>
                            </div>
                            <div className="text-center">
                                <Activity className="w-5 h-5 mx-auto mb-1 text-green-600" />
                                <div className="text-sm text-gray-600">Độ ẩm</div>
                                <div className="font-semibold">{sensorData.hum || 0}%</div>
                            </div>
                        </div>
                    )}

                    {/* Last Update */}
                    {lastUpdate && (
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Clock className="w-4 h-4" />
                            Cập nhật lần cuối: {new Date(lastUpdate).toLocaleString('vi-VN')}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Alert Control Panel */}
            {currentAlert && (
                <Card className="border-red-200 bg-red-50">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <AlertTriangle className="w-5 h-5 text-red-600" />
                            <h3 className="text-lg font-semibold text-red-800">Quản lý thông báo</h3>
                        </div>

                        {/* Alert Details */}
                        <div className="mb-4 p-3 bg-white rounded-lg">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <div className="font-medium">Loại cảnh báo: {currentAlert.type}</div>
                                    <div className="text-sm text-gray-600">
                                        Thời gian: {new Date(currentAlert.timestamp).toLocaleString('vi-VN')}
                                    </div>
                                </div>
                                <Badge variant="destructive">{currentAlert.level}</Badge>
                            </div>
                            
                            {currentAlert.data && (
                                <div className="text-sm text-gray-700">
                                    Giá trị phát hiện: 
                                    {currentAlert.data.gas && ` Khí gas: ${currentAlert.data.gas} PPM`}
                                    {currentAlert.data.temp && ` Nhiệt độ: ${currentAlert.data.temp}°C`}
                                </div>
                            )}
                        </div>

                        {/* Sound and Notification Controls */}
                        <div className="space-y-4">
                            {/* Sound Control */}
                            <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                                <div className="flex items-center gap-3">
                                    {isSoundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                                    <div>
                                        <div className="font-medium">Âm thanh cảnh báo</div>
                                        <div className="text-sm text-gray-600">
                                            {muteUntil ? 
                                                `Tắt tiếng đến ${new Date(muteUntil).toLocaleTimeString('vi-VN')}` : 
                                                (isSoundEnabled ? 'Đang bật' : 'Đã tắt')
                                            }
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-2">
                                    {muteUntil ? (
                                        <Button onClick={handleUnmute} size="sm" variant="outline">
                                            Bỏ tắt tiếng
                                        </Button>
                                    ) : (
                                        <>
                                            <Switch 
                                                checked={isSoundEnabled}
                                                onCheckedChange={onToggleSound}
                                            />
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Temporary Mute Options */}
                            {isSoundEnabled && !muteUntil && (
                                <div className="flex items-center gap-2 p-3 bg-white rounded-lg">
                                    <span className="text-sm font-medium">Tắt tiếng tạm thời:</span>
                                    <Button onClick={() => handleMuteFor(5)} size="sm" variant="outline">
                                        5 phút
                                    </Button>
                                    <Button onClick={() => handleMuteFor(15)} size="sm" variant="outline">
                                        15 phút
                                    </Button>
                                    <Button onClick={() => handleMuteFor(30)} size="sm" variant="outline">
                                        30 phút
                                    </Button>
                                </div>
                            )}

                            {/* Notification Control */}
                            <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                                <div className="flex items-center gap-3">
                                    {isNotificationsEnabled ? <Bell className="w-5 h-5" /> : <BellOff className="w-5 h-5" />}
                                    <div>
                                        <div className="font-medium">Thông báo trình duyệt</div>
                                        <div className="text-sm text-gray-600">
                                            {isNotificationsEnabled ? 'Đang bật' : 'Đã tắt'}
                                        </div>
                                    </div>
                                </div>
                                
                                <Switch 
                                    checked={isNotificationsEnabled}
                                    onCheckedChange={onToggleNotifications}
                                />
                            </div>

                            {/* Alert Actions */}
                            <div className="flex gap-3 pt-2">
                                <Button 
                                    onClick={() => onAcknowledgeAlert(currentAlert.id)}
                                    className="flex-1"
                                    variant="outline"
                                >
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Xác nhận đã biết
                                </Button>
                                <Button 
                                    onClick={() => onClearAlert(currentAlert.id)}
                                    className="flex-1"
                                    variant="destructive"
                                >
                                    <Settings className="w-4 h-4 mr-2" />
                                    Xóa cảnh báo
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Device Settings */}
            <Card>
                <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Settings className="w-5 h-5" />
                        Cài đặt thiết bị
                    </h3>
                    
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                                <div className="font-medium">Chế độ hoạt động</div>
                                <div className="text-sm text-gray-600">Tự động phát hiện 24/7</div>
                            </div>
                            <Badge variant="outline">ACTIVE</Badge>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                                <div className="font-medium">Độ nhạy cảnh báo</div>
                                <div className="text-sm text-gray-600">
                                    Cảnh báo: ≥1000 PPM | Nguy hiểm: ≥2000 PPM | Khẩn cấp: ≥3000 PPM
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                                <div className="font-medium">Kết nối thiết bị</div>
                                <div className="text-sm text-gray-600">
                                    {isConnected && isDeviceConnected ? 'Kết nối ổn định' : 'Kiểm tra kết nối'}
                                </div>
                            </div>
                            <div className={`w-3 h-3 rounded-full ${isConnected && isDeviceConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default FireDetectorInterface; 