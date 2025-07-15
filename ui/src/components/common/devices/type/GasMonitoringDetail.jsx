import React, { useState } from "react";
import { Zap, Thermometer, Wind, Droplets, Settings, AlertTriangle, Flame } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

import RealtimeSensorDisplay from "../RealtimeSensorDisplay";
import { useSocketContext } from "@/contexts/SocketContext";
import socketService from "@/lib/socket";

export default function GasMonitoringDetail({ device, sensorType = 'gas' }) {
    // Dynamic labels based on sensor type - MUST BE FIRST
    const labels = sensorType === 'smoke' ? {
        title: 'Cảm biến báo khói & cháy',
        gasLabel: 'Khói',
        gasUnit: 'PPM',
        statusPrefix: 'KHÓI'
    } : {
        title: 'Cảm biến môi trường',
        gasLabel: 'Khí Gas',
        gasUnit: 'PPM', 
        statusPrefix: 'GAS'
    };

    console.log('🌬️ GasMonitoringDetail component rendered for device:', device?.name, {
        deviceType: device?.type,
        sensorType,
        serialNumber: device?.serial_number,
        deviceId: device?.id || device?.device_id,
        thresholds: sensorType === 'smoke' ? 'Fire/Smoke Detection' : 'Gas/Environmental Monitoring',
        expectedInterface: labels.title
    });
    
    const { isConnected, sendDeviceCommand } = useSocketContext();
    const [isMonitoring, setIsMonitoring] = useState(device.power_status || true);
    
    // Dynamic thresholds based on sensor type
    const defaultThresholds = sensorType === 'smoke' ? {
        gas: 1000,  // PPM for smoke detectors (higher threshold)
        ppm: 1000,  // Same as gas for smoke
        temp: 45,   // Higher temp threshold for fire detection
        humidity: 85,
        sensitivity: 75
    } : {
        gas: 300,   // PPM for gas sensors (lower threshold)
        ppm: 300,   
        temp: 35,   // Normal room temp threshold
        humidity: 80,
        sensitivity: 50
    };
    
    const [gasThreshold, setGasThreshold] = useState(device.gas_threshold || defaultThresholds.gas);
    const [sensitivity, setSensitivity] = useState(device.sensitivity || defaultThresholds.sensitivity);
    const [humidityThreshold, setHumidityThreshold] = useState(device.humidity_threshold || defaultThresholds.humidity);
    const [tempThreshold, setTempThreshold] = useState(device.temp_threshold || defaultThresholds.temp);
    const [alarmEnabled, setAlarmEnabled] = useState(device.alarm_enabled || true);

    // Current sensor values (will be updated via real-time)
    const [currentValues, setCurrentValues] = useState({
        gas: device.gas || device.ppm || 0,
        ppm: device.ppm || device.gas || 0, // For smoke detectors, ppm might be the main value
        temperature: device.temp || device.temperature || 25,
        humidity: device.humidity || device.hum || 45,
        smoke_level: device.smoke_level || 0
    });

    const deviceSerial = device.serial_number || device.serialNumber;

    // Status calculation - dynamic based on sensor type
    const getGasStatus = (value) => {
        const thresholdMultipliers = sensorType === 'smoke' ? {
            critical: 2,   // Smoke detection is more critical
            danger: 1.5,
            warning: 1
        } : {
            critical: 3,   // Gas detection has more gradual levels
            danger: 2,
            warning: 1
        };
        
        if (value >= gasThreshold * thresholdMultipliers.critical) {
            return { 
                status: 'critical', 
                color: 'red', 
                text: sensorType === 'smoke' ? 'CHÁY!' : 'CỰC NGUY HIỂM' 
            };
        }
        if (value >= gasThreshold * thresholdMultipliers.danger) {
            return { 
                status: 'danger', 
                color: 'orange', 
                text: sensorType === 'smoke' ? 'NGUY HIỂM CHÁY' : 'NGUY HIỂM' 
            };
        }
        if (value >= gasThreshold * thresholdMultipliers.warning) {
            return { 
                status: 'warning', 
                color: 'yellow', 
                text: sensorType === 'smoke' ? 'PHÁT HIỆN KHÓI' : 'CẢNH BÁO GAS' 
            };
        }
        return { 
            status: 'safe', 
            color: 'green', 
            text: sensorType === 'smoke' ? 'SẠCH' : 'AN TOÀN' 
        };
    };

    const getTempStatus = (value) => {
        if (value >= tempThreshold + 20) return { status: 'critical', color: 'red', text: 'QUÁ NÓNG' };
        if (value >= tempThreshold + 10) return { status: 'danger', color: 'orange', text: 'NÓNG' };
        if (value >= tempThreshold) return { status: 'warning', color: 'yellow', text: 'ẤM' };
        return { status: 'normal', color: 'blue', text: 'BÌNH THƯỜNG' };
    };

    const getHumidityStatus = (value) => {
        if (value >= humidityThreshold + 15) return { status: 'high', color: 'blue', text: 'RẤT ẨM' };
        if (value >= humidityThreshold) return { status: 'warning', color: 'yellow', text: 'ẨM' };
        return { status: 'normal', color: 'green', text: 'BÌNH THƯỜNG' };
    };

    // Calculate current statuses - use ppm for smoke detectors, gas for gas sensors
    const gasValue = sensorType === 'smoke' ? (currentValues.ppm || currentValues.gas) : currentValues.gas;
    const gasStatus = getGasStatus(gasValue);
    
    console.log('📊 Gas value calculation:', {
        sensorType,
        currentValues,
        gasValue,
        gasStatus,
        threshold: gasThreshold
    });
    const tempStatus = getTempStatus(currentValues.temperature);
    const humidityStatus = getHumidityStatus(currentValues.humidity);

    // Send settings to device - theo IoT API format
    const updateDeviceSettings = () => {
        if (!isConnected || !deviceSerial) {
            console.error('❌ Không thể gửi lệnh: Socket chưa kết nối hoặc thiếu serial number');
            return;
        }

        // Theo IoT API, sử dụng update_config event
        const config = {
            gas_threshold: gasThreshold,
            sensitivity: sensitivity,
            humidity_threshold: humidityThreshold,
            temp_threshold: tempThreshold,
            alarm_enabled: alarmEnabled,
            monitoring_enabled: isMonitoring
        };

        console.log('📤 Sending gas monitoring config to IoT API:', config);

        // Sử dụng socketService trực tiếp để gửi update_config
        if (socketService && socketService.clientSocket) {
            socketService.clientSocket.emit('update_config', config);
        }
    };

    // Toggle monitoring
    const toggleMonitoring = () => {
        const newState = !isMonitoring;
        setIsMonitoring(newState);

        if (isConnected && deviceSerial) {
            // Gửi generic command với action toggle_monitoring
            const command = {
                action: 'toggle_monitoring',
                state: { enabled: newState },
                timestamp: new Date().toISOString()
            };

            console.log('📤 Sending toggle monitoring command:', command);
            sendDeviceCommand(deviceSerial, command);
        }
    };

    // Reset to defaults
    const resetToDefaults = () => {
        setGasThreshold(300);
        setSensitivity(50);
        setHumidityThreshold(80);
        setTempThreshold(35);
        setAlarmEnabled(true);
    };

    return (
        <div className="space-y-6">
            {/* Alert if dangerous levels */}
            {(gasStatus.status !== 'safe' || tempStatus.status === 'critical') && (
                <Alert className={cn(
                    "border-2",
                    gasStatus.status === 'critical' || tempStatus.status === 'critical'
                        ? "border-red-500 bg-red-50"
                        : "border-orange-500 bg-orange-50"
                )}>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription className="font-medium">
                        {gasStatus.status === 'critical' ? 
                            `🔥 KHẨN CẤP! ${labels.statusPrefix} cực kỳ nguy hiểm!` :
                            gasStatus.status === 'danger' ? 
                                `⚠️ NGUY HIỂM! ${labels.statusPrefix} cao!` :
                                gasStatus.status === 'warning' ? 
                                    `⚠️ CẢNH BÁO! Phát hiện ${labels.gasLabel.toLowerCase()}!` :
                                    tempStatus.status === 'critical' ? 
                                        '🌡️ KHẨN CẤP! Nhiệt độ quá cao!' : ''}
                    </AlertDescription>
                </Alert>
            )}

            {/* Connection Status Debug */}
            <Card className={cn(
                "border-2",
                isConnected ? "border-green-200 bg-green-50" : "border-orange-200 bg-orange-50"
            )}>
                <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className={cn(
                                "w-3 h-3 rounded-full",
                                isConnected ? "bg-green-500 animate-pulse" : "bg-orange-500"
                            )}></div>
                            <div>
                                <h3 className="font-medium text-slate-900">Kết nối Real-time</h3>
                                <p className="text-sm text-slate-600">Serial: {deviceSerial || 'N/A'}</p>
                                <p className="text-xs text-slate-500">Type: {device?.type || 'N/A'}</p>
                                <p className="text-xs text-slate-500">Sensor: {labels.title}</p>
                            </div>
                        </div>
                        <Badge className={cn(
                            isConnected 
                                ? "bg-green-100 text-green-700 border-green-200"
                                : "bg-orange-100 text-orange-700 border-orange-200"
                        )}>
                            {isConnected ? 'Đang kết nối' : 'Mất kết nối'}
                        </Badge>
                    </div>
                </CardContent>
            </Card>

            {/* Real-time Sensor Display */}
            <RealtimeSensorDisplay
                deviceSerial={deviceSerial}
                deviceName={device.name || device.device_name || labels.title}
            />

            {/* Current Readings */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Gas/Smoke Level */}
                <Card className={cn(
                    "border-2",
                    gasStatus.color === 'red' ? "border-red-500 bg-red-50" :
                        gasStatus.color === 'orange' ? "border-orange-500 bg-orange-50" :
                            gasStatus.color === 'yellow' ? "border-yellow-500 bg-yellow-50" :
                                "border-green-500 bg-green-50"
                )}>
                    <CardContent className="p-4 text-center">
                        {sensorType === 'smoke' ? (
                            <Flame className={`w-8 h-8 mx-auto mb-2 text-${gasStatus.color}-600`} />
                        ) : (
                            <Zap className={`w-8 h-8 mx-auto mb-2 text-${gasStatus.color}-600`} />
                        )}
                        <div className="text-2xl font-bold">{gasValue}</div>
                        <div className="text-sm text-gray-600">{labels.gasUnit}</div>
                        <Badge
                            variant={gasStatus.status === 'safe' ? 'default' : 'destructive'}
                            className="mt-1 text-xs"
                        >
                            {gasStatus.text}
                        </Badge>
                    </CardContent>
                </Card>

                {/* Temperature */}
                <Card className={cn(
                    "border-2",
                    tempStatus.color === 'red' ? "border-red-500 bg-red-50" :
                        tempStatus.color === 'orange' ? "border-orange-500 bg-orange-50" :
                            tempStatus.color === 'yellow' ? "border-yellow-500 bg-yellow-50" :
                                "border-blue-500 bg-blue-50"
                )}>
                    <CardContent className="p-4 text-center">
                        <Thermometer className={`w-8 h-8 mx-auto mb-2 text-${tempStatus.color}-600`} />
                        <div className="text-2xl font-bold">{currentValues.temperature}</div>
                        <div className="text-sm text-gray-600">°C</div>
                        <Badge variant="outline" className="mt-1 text-xs">
                            {tempStatus.text}
                        </Badge>
                    </CardContent>
                </Card>

                {/* Humidity */}
                <Card className={cn(
                    "border-2",
                    humidityStatus.color === 'blue' ? "border-blue-500 bg-blue-50" :
                        humidityStatus.color === 'yellow' ? "border-yellow-500 bg-yellow-50" :
                            "border-green-500 bg-green-50"
                )}>
                    <CardContent className="p-4 text-center">
                        <Droplets className={`w-8 h-8 mx-auto mb-2 text-${humidityStatus.color}-600`} />
                        <div className="text-2xl font-bold">{currentValues.humidity}</div>
                        <div className="text-sm text-gray-600">%</div>
                        <Badge variant="outline" className="mt-1 text-xs">
                            {humidityStatus.text}
                        </Badge>
                    </CardContent>
                </Card>

                {/* Smoke Level (if available) */}
                {currentValues.smoke_level !== undefined && (
                    <Card>
                        <CardContent className="p-4 text-center">
                            <Wind className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                            <div className="text-2xl font-bold">{currentValues.smoke_level}</div>
                            <div className="text-sm text-gray-600">Khói</div>
                            <Badge variant="outline" className="mt-1 text-xs">
                                {currentValues.smoke_level > 500 ? 'DÀY' : currentValues.smoke_level > 200 ? 'VỪA' : 'SẠCH'}
                            </Badge>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Settings Controls */}
            {/* <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Settings className="h-5 w-5" />
                        Cài Đặt Giám Sát
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <Label className="text-sm font-medium">Ngưỡng Cảnh Báo Khí Gas</Label>
                            <span className="text-sm font-bold text-orange-600">{gasThreshold} PPM</span>
                        </div>
                        <Slider
                            value={[gasThreshold]}
                            onValueChange={(value) => setGasThreshold(value[0])}
                            max={2000}
                            min={100}
                            step={50}
                            className="w-full"
                        />
                        <div className="text-xs text-gray-500">
                            Khuyến nghị: 300-500 PPM cho môi trường gia đình
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <Label className="text-sm font-medium">Độ Nhạy Cảm Biến</Label>
                            <span className="text-sm font-bold text-blue-600">{sensitivity}%</span>
                        </div>
                        <Slider
                            value={[sensitivity]}
                            onValueChange={(value) => setSensitivity(value[0])}
                            max={100}
                            min={10}
                            step={5}
                            className="w-full"
                        />
                        <div className="text-xs text-gray-500">
                            Cao hơn = phát hiện nhanh hơn, thấp hơn = ít báo động nhầm
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <Label className="text-sm font-medium">Ngưỡng Cảnh Báo Độ Ẩm</Label>
                            <span className="text-sm font-bold text-blue-600">{humidityThreshold}%</span>
                        </div>
                        <Slider
                            value={[humidityThreshold]}
                            onValueChange={(value) => setHumidityThreshold(value[0])}
                            max={95}
                            min={60}
                            step={5}
                            className="w-full"
                        />
                        <div className="text-xs text-gray-500">
                            Độ ẩm cao có thể ảnh hưởng đến độ chính xác cảm biến
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <Label className="text-sm font-medium">Ngưỡng Cảnh Báo Nhiệt Độ</Label>
                            <span className="text-sm font-bold text-red-600">{tempThreshold}°C</span>
                        </div>
                        <Slider
                            value={[tempThreshold]}
                            onValueChange={(value) => setTempThreshold(value[0])}
                            max={60}
                            min={25}
                            step={1}
                            className="w-full"
                        />
                        <div className="text-xs text-gray-500">
                            Nhiệt độ cao có thể là dấu hiệu nguy hiểm
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <Label className="text-sm font-medium">Báo Động Âm Thanh</Label>
                            <div className="text-xs text-gray-500">Kích hoạt âm thanh cảnh báo</div>
                        </div>
                        <Switch
                            checked={alarmEnabled}
                            onCheckedChange={setAlarmEnabled}
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button
                            onClick={updateDeviceSettings}
                            className="flex-1"
                            disabled={!isConnected}
                        >
                            <Settings className="w-4 h-4 mr-2" />
                            Lưu Cài Đặt
                        </Button>
                        <Button
                            onClick={resetToDefaults}
                            variant="outline"
                            className="flex-1"
                        >
                            Khôi Phục Mặc Định
                        </Button>
                    </div>
                </CardContent>
            </Card> */}
            {/* Socket Debug Panel */}
            {/* <SocketDebugPanel 
                deviceSerial={deviceSerial}
            /> */}
        </div>
    );
} 