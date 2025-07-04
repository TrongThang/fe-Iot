import React, { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
    AlertTriangle, 
    Flame, 
    Volume2, 
    VolumeX, 
    Wind, 
    Thermometer,
    X,
    CheckCircle,
    Bell,
    BellOff 
} from "lucide-react";
import { ALERT_LEVELS, ALERT_TYPES } from '../hooks/useFireAlertSocket';
import { cn } from '@/lib/utils';

// Alert level configurations
const ALERT_CONFIG = {
    [ALERT_LEVELS.WARNING]: {
        bgColor: 'bg-yellow-50 border-yellow-300',
        textColor: 'text-yellow-800',
        iconColor: 'text-yellow-600',
        pulseColor: 'bg-yellow-500',
        severity: 'Cảnh báo',
        priority: 1
    },
    [ALERT_LEVELS.DANGER]: {
        bgColor: 'bg-orange-50 border-orange-400',
        textColor: 'text-orange-900',
        iconColor: 'text-orange-600',
        pulseColor: 'bg-orange-500',
        severity: 'Nguy hiểm',
        priority: 2
    },
    [ALERT_LEVELS.CRITICAL]: {
        bgColor: 'bg-red-50 border-red-500',
        textColor: 'text-red-900',
        iconColor: 'text-red-600',
        pulseColor: 'bg-red-500',
        severity: 'Cực kỳ nguy hiểm',
        priority: 3
    }
};

// Alert type configurations
const TYPE_CONFIG = {
    [ALERT_TYPES.FIRE]: {
        icon: Flame,
        title: 'Cảnh báo cháy',
        description: 'Phát hiện nhiệt độ cao bất thường'
    },
    [ALERT_TYPES.SMOKE]: {
        icon: Wind,
        title: 'Cảnh báo khói',
        description: 'Phát hiện khói hoặc mức khí gas cao'
    },
    [ALERT_TYPES.GAS]: {
        icon: Wind,
        title: 'Cảnh báo khí gas',
        description: 'Nồng độ khí gas vượt ngưỡng an toàn'
    },
    [ALERT_TYPES.TEMPERATURE]: {
        icon: Thermometer,
        title: 'Cảnh báo nhiệt độ',
        description: 'Nhiệt độ vượt ngưỡng cho phép'
    },
    [ALERT_TYPES.EMERGENCY]: {
        icon: AlertTriangle,
        title: 'Cảnh báo khẩn cấp',
        description: 'Tình huống khẩn cấp từ thiết bị'
    }
};

const FireAlertComponent = ({ 
    alert, 
    isAlerting,
    onAcknowledge, 
    onClear, 
    onToggleSound,
    isSoundEnabled = true,
    compact = false 
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isFlashing, setIsFlashing] = useState(false);
    console.log('alert', alert);
    // Show/hide animation
    useEffect(() => {
        if (alert) {
            setIsVisible(true);
            // Start flashing for danger/critical alerts
            if (alert.level === ALERT_LEVELS.DANGER || alert.level === ALERT_LEVELS.CRITICAL) {
                setIsFlashing(true);
            }
        } else {
            setIsVisible(false);
            setIsFlashing(false);
        }
    }, [alert]);

    if (!alert || !isVisible) {
        return null;
    }

    const config = ALERT_CONFIG[alert.level] || ALERT_CONFIG[ALERT_LEVELS.WARNING];
    const typeConfig = TYPE_CONFIG[alert.type] || TYPE_CONFIG[ALERT_TYPES.EMERGENCY];
    const IconComponent = typeConfig.icon;

    const formatTimestamp = (timestamp) => {
        return new Date(timestamp).toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    const getSensorValues = () => {
        if (!alert.data) return null;
        
        const { gas, temp, hum, ppm } = alert.data;
        return {
            gas: gas || ppm || 0,
            temperature: temp || 0,
            humidity: hum || 0
        };
    };

    const sensorValues = getSensorValues();

    if (compact) {
        // Compact version for small spaces
        return (
            <div className={cn(
                "flex items-center gap-2 p-2 rounded-lg border",
                config.bgColor,
                isFlashing && "animate-pulse"
            )}>
                <IconComponent className={cn("w-5 h-5", config.iconColor)} />
                <div className="flex-1">
                    <div className={cn("text-sm font-medium", config.textColor)}>
                        {typeConfig.title}
                    </div>
                    <div className="text-xs text-gray-600">
                        {alert.deviceName} - {formatTimestamp(alert.timestamp)}
                    </div>
                </div>
                <Badge variant="outline" className={cn("text-xs", config.textColor)}>
                    {config.severity}
                </Badge>
                {onClear && (
                    <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => onClear(alert.id)}
                        className="h-6 w-6 p-0"
                    >
                        <X className="w-3 h-3" />
                    </Button>
                )}
            </div>
        );
    }

    // Full version
    return (
        <Card className={cn(
            "border-2 transition-all duration-300",
            config.bgColor,
            isFlashing && "animate-pulse",
            "shadow-lg"
        )}>
            <CardContent className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className={cn(
                            "p-3 rounded-full",
                            config.iconColor,
                            isFlashing && "animate-bounce"
                        )}>
                            <IconComponent className="w-8 h-8" />
                        </div>
                        <div>
                            <h3 className={cn("text-xl font-bold", config.textColor)}>
                                {typeConfig.title}
                            </h3>
                            <p className="text-gray-600 text-sm">
                                {typeConfig.description}
                            </p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <Badge 
                            variant="outline" 
                            className={cn("text-sm font-semibold", config.textColor)}
                        >
                            {config.severity}
                        </Badge>
                        {alert.acknowledged && (
                            <Badge variant="outline" className="text-green-700 bg-green-50">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Đã xác nhận
                            </Badge>
                        )}
                    </div>
                </div>

                {/* Device Info */}
                <div className="mb-4 p-3 bg-white/50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">Thiết bị:</span>
                        <span className="text-sm">{alert.deviceName}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">Thời gian:</span>
                        <span className="text-sm">{formatTimestamp(alert.timestamp)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="font-medium">Nguồn:</span>
                        <span className="text-sm capitalize">{alert.source}</span>
                    </div>
                </div>

                {/* Sensor Readings */}
                {sensorValues && (
                    <div className="mb-4 p-3 bg-white/50 rounded-lg">
                        <h4 className="font-medium mb-2">Giá trị cảm biến:</h4>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                            <div className="text-center">
                                <div className="font-semibold">Khí gas</div>
                                <div className={cn(
                                    "text-lg",
                                    sensorValues.gas > 2000 ? "text-red-600 font-bold" :
                                    sensorValues.gas > 1000 ? "text-orange-600 font-semibold" :
                                    "text-gray-600"
                                )}>
                                    {sensorValues.gas} PPM
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="font-semibold">Nhiệt độ</div>
                                <div className={cn(
                                    "text-lg",
                                    sensorValues.temperature > 50 ? "text-red-600 font-bold" :
                                    sensorValues.temperature > 40 ? "text-orange-600 font-semibold" :
                                    "text-gray-600"
                                )}>
                                    {sensorValues.temperature}°C
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="font-semibold">Độ ẩm</div>
                                <div className={cn(
                                    "text-lg",
                                    sensorValues.humidity > 90 ? "text-red-600 font-bold" :
                                    sensorValues.humidity > 80 ? "text-orange-600 font-semibold" :
                                    "text-gray-600"
                                )}>
                                    {sensorValues.humidity}%
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                    {!alert.acknowledged && onAcknowledge && (
                        <Button
                            onClick={() => onAcknowledge(alert.id)}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Xác nhận
                        </Button>
                    )}
                    
                    {onClear && (
                        <Button
                            onClick={() => onClear(alert.id)}
                            variant="outline"
                        >
                            <X className="w-4 h-4 mr-2" />
                            Tắt cảnh báo
                        </Button>
                    )}

                    {onToggleSound && (
                        <Button
                            onClick={onToggleSound}
                            variant="outline"
                            className="flex items-center gap-2"
                        >
                            {isSoundEnabled ? (
                                <>
                                    <VolumeX className="w-4 h-4" />
                                    Tắt âm thanh
                                </>
                            ) : (
                                <>
                                    <Volume2 className="w-4 h-4" />
                                    Bật âm thanh
                                </>
                            )}
                        </Button>
                    )}
                </div>

                {/* Flashing indicator for critical alerts */}
                {alert.level === ALERT_LEVELS.CRITICAL && (
                    <div className="mt-4 flex items-center gap-2 text-red-600">
                        <div className={cn(
                            "w-3 h-3 rounded-full animate-ping",
                            config.pulseColor
                        )} />
                        <span className="text-sm font-medium">
                            CẢNH BÁO CẤP ĐỘ CAO - Cần xử lý ngay lập tức!
                        </span>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default FireAlertComponent; 