import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
    X, 
    Volume2, 
    VolumeX,
    CheckCircle,
    AlertTriangle,
    Flame,
    Wind,
    Thermometer
} from "lucide-react";
import { ALERT_LEVELS, ALERT_TYPES } from '../hooks/useFireAlertSocket';
import { cn } from '@/lib/utils';

// Animation variants for different alert levels
const ANIMATION_CONFIG = {
    [ALERT_LEVELS.WARNING]: {
        backdrop: 'bg-black/30',
        cardAnimation: 'animate-in fade-in-0 zoom-in-95 duration-300',
        shake: false,
        autoHide: 10000 // 10 seconds
    },
    [ALERT_LEVELS.DANGER]: {
        backdrop: 'bg-black/50',
        cardAnimation: 'animate-in fade-in-0 zoom-in-95 duration-500',
        shake: true,
        autoHide: 0 // No auto hide
    },
    [ALERT_LEVELS.CRITICAL]: {
        backdrop: 'bg-red-900/70',
        cardAnimation: 'animate-in fade-in-0 zoom-in-95 duration-500',
        shake: true,
        autoHide: 0 // No auto hide
    }
};

const ALERT_COLORS = {
    [ALERT_LEVELS.WARNING]: {
        bg: 'bg-gradient-to-br from-yellow-400 to-orange-500',
        text: 'text-white',
        border: 'border-yellow-300',
        glow: 'shadow-yellow-500/50'
    },
    [ALERT_LEVELS.DANGER]: {
        bg: 'bg-gradient-to-br from-orange-500 to-red-600',
        text: 'text-white',
        border: 'border-orange-400',
        glow: 'shadow-orange-500/50'
    },
    [ALERT_LEVELS.CRITICAL]: {
        bg: 'bg-gradient-to-br from-red-600 to-red-800',
        text: 'text-white',
        border: 'border-red-500',
        glow: 'shadow-red-500/50'
    }
};

const ALERT_ICONS = {
    [ALERT_TYPES.FIRE]: Flame,
    [ALERT_TYPES.SMOKE]: Wind,
    [ALERT_TYPES.GAS]: Wind,
    [ALERT_TYPES.TEMPERATURE]: Thermometer,
    [ALERT_TYPES.EMERGENCY]: AlertTriangle
};

const AlertOverlay = ({ 
    alert, 
    isVisible = false,
    onClose, 
    onAcknowledge,
    onToggleSound,
    isSoundEnabled = true,
    allowOutsideClick = false 
}) => {
    const [isShowing, setIsShowing] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const overlayRef = useRef(null);
    const autoHideTimeoutRef = useRef(null);

    // Handle visibility changes
    useEffect(() => {
        if (isVisible && alert) {
            setIsShowing(true);
            setIsAnimating(true);
            
            // Auto-hide for warning alerts only
            const config = ANIMATION_CONFIG[alert.level] || ANIMATION_CONFIG[ALERT_LEVELS.WARNING];
            if (config.autoHide > 0) {
                autoHideTimeoutRef.current = setTimeout(() => {
                    handleClose();
                }, config.autoHide);
            }
        } else {
            handleClose();
        }

        return () => {
            if (autoHideTimeoutRef.current) {
                clearTimeout(autoHideTimeoutRef.current);
            }
        };
    }, [isVisible, alert]);

    const handleClose = () => {
        if (autoHideTimeoutRef.current) {
            clearTimeout(autoHideTimeoutRef.current);
            autoHideTimeoutRef.current = null;
        }
        
        setIsAnimating(false);
        setTimeout(() => {
            setIsShowing(false);
            if (onClose) onClose();
        }, 300);
    };

    const handleOverlayClick = (e) => {
        // Only allow closing if clicking on the overlay itself (not the card)
        // and allowOutsideClick is true or alert level is WARNING
        if (e.target === overlayRef.current && 
            (allowOutsideClick || alert?.level === ALERT_LEVELS.WARNING)) {
            handleClose();
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Escape' && 
            (allowOutsideClick || alert?.level === ALERT_LEVELS.WARNING)) {
            handleClose();
        }
    };

    useEffect(() => {
        if (isShowing) {
            document.addEventListener('keydown', handleKeyDown);
            // Prevent body scroll
            document.body.style.overflow = 'hidden';
        } else {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'unset';
        };
    }, [isShowing]);

    if (!isShowing || !alert) {
        return null;
    }

    const config = ANIMATION_CONFIG[alert.level] || ANIMATION_CONFIG[ALERT_LEVELS.WARNING];
    const colors = ALERT_COLORS[alert.level] || ALERT_COLORS[ALERT_LEVELS.WARNING];
    const IconComponent = ALERT_ICONS[alert.type] || AlertTriangle;

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

    const alertContent = (
        <div 
            ref={overlayRef}
            className={cn(
                "fixed inset-0 z-50 flex items-center justify-center p-4",
                config.backdrop,
                isAnimating ? "animate-in fade-in-0 duration-300" : "animate-out fade-out-0 duration-300"
            )}
            onClick={handleOverlayClick}
        >
            <Card className={cn(
                "w-full max-w-2xl border-4 shadow-2xl",
                colors.border,
                colors.glow,
                config.cardAnimation,
                config.shake && "animate-pulse",
                !isAnimating && "animate-out zoom-out-95 fade-out-0 duration-300"
            )}>
                <CardContent className={cn("p-0", colors.bg)}>
                    {/* Header Section */}
                    <div className="p-6 pb-4">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-4">
                                <div className={cn(
                                    "p-4 rounded-full bg-white/20 backdrop-blur-sm",
                                    config.shake && "animate-bounce"
                                )}>
                                    <IconComponent className="w-12 h-12 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold text-white mb-1">
                                        🚨 CẢNH BÁO KHẨN CẤP
                                    </h1>
                                    <p className="text-white/90 text-lg">
                                        {alert.type === ALERT_TYPES.FIRE && 'Phát hiện cháy'}
                                        {alert.type === ALERT_TYPES.GAS && 'Rò rỉ khí gas'}
                                        {alert.type === ALERT_TYPES.SMOKE && 'Phát hiện khói'}
                                        {alert.type === ALERT_TYPES.TEMPERATURE && 'Nhiệt độ cao'}
                                        {alert.type === ALERT_TYPES.EMERGENCY && 'Tình huống khẩn cấp'}
                                    </p>
                                </div>
                            </div>
                            
                            {/* Close button - only for warning alerts or when allowed */}
                            {(alert.level === ALERT_LEVELS.WARNING || allowOutsideClick) && onClose && (
                                <Button
                                    onClick={handleClose}
                                    variant="ghost"
                                    size="sm"
                                    className="text-white hover:bg-white/20 h-10 w-10 p-0"
                                >
                                    <X className="w-6 h-6" />
                                </Button>
                            )}
                        </div>

                        {/* Device Info */}
                        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 mb-4">
                            <div className="grid grid-cols-2 gap-4 text-white">
                                <div>
                                    <div className="text-sm opacity-90">Thiết bị</div>
                                    <div className="font-semibold text-lg">{alert.deviceName}</div>
                                </div>
                                <div>
                                    <div className="text-sm opacity-90">Thời gian</div>
                                    <div className="font-semibold text-lg">{formatTimestamp(alert.timestamp)}</div>
                                </div>
                            </div>
                        </div>

                        {/* Sensor Readings */}
                        {sensorValues && (
                            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 mb-4">
                                <h3 className="text-white font-semibold mb-3 text-lg">Giá trị cảm biến hiện tại:</h3>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="text-center">
                                        <div className="text-white/90 text-sm mb-1">Khí gas</div>
                                        <div className={cn(
                                            "text-2xl font-bold",
                                            sensorValues.gas > 2000 ? "text-red-200" :
                                            sensorValues.gas > 1000 ? "text-yellow-200" :
                                            "text-white"
                                        )}>
                                            {sensorValues.gas}
                                        </div>
                                        <div className="text-white/70 text-sm">PPM</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-white/90 text-sm mb-1">Nhiệt độ</div>
                                        <div className={cn(
                                            "text-2xl font-bold",
                                            sensorValues.temperature > 50 ? "text-red-200" :
                                            sensorValues.temperature > 40 ? "text-yellow-200" :
                                            "text-white"
                                        )}>
                                            {sensorValues.temperature}
                                        </div>
                                        <div className="text-white/70 text-sm">°C</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-white/90 text-sm mb-1">Độ ẩm</div>
                                        <div className={cn(
                                            "text-2xl font-bold",
                                            sensorValues.humidity > 90 ? "text-red-200" :
                                            sensorValues.humidity > 80 ? "text-yellow-200" :
                                            "text-white"
                                        )}>
                                            {sensorValues.humidity}
                                        </div>
                                        <div className="text-white/70 text-sm">%</div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Critical Alert Warning */}
                        {alert.level === ALERT_LEVELS.CRITICAL && (
                            <div className="bg-red-800/50 backdrop-blur-sm rounded-lg p-4 mb-4 border border-red-400">
                                <div className="flex items-center gap-3">
                                    <div className="w-4 h-4 bg-red-400 rounded-full animate-ping" />
                                    <span className="text-white font-bold text-lg">
                                        CẤP ĐỘ NGUY HIỂM CAO - Sơ tán ngay lập tức!
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="p-6 pt-0">
                        <div className="flex flex-wrap gap-3 justify-center">
                            {!alert.acknowledged && onAcknowledge && (
                                <Button
                                    onClick={() => onAcknowledge(alert.id)}
                                    size="lg"
                                    className="bg-white text-gray-900 hover:bg-gray-100 font-semibold px-8"
                                >
                                    <CheckCircle className="w-5 h-5 mr-2" />
                                    Xác nhận đã nhận
                                </Button>
                            )}
                            
                            {onToggleSound && (
                                <Button
                                    onClick={onToggleSound}
                                    size="lg"
                                    variant="outline"
                                    className="border-white text-white hover:bg-white/20 font-semibold px-8"
                                >
                                    {isSoundEnabled ? (
                                        <>
                                            <VolumeX className="w-5 h-5 mr-2" />
                                            Tắt âm thanh
                                        </>
                                    ) : (
                                        <>
                                            <Volume2 className="w-5 h-5 mr-2" />
                                            Bật âm thanh
                                        </>
                                    )}
                                </Button>
                            )}

                            {/* Only show close for non-critical alerts */}
                            {alert.level !== ALERT_LEVELS.CRITICAL && onClose && (
                                <Button
                                    onClick={handleClose}
                                    size="lg"
                                    variant="outline"
                                    className="border-white text-white hover:bg-white/20 font-semibold px-8"
                                >
                                    <X className="w-5 h-5 mr-2" />
                                    Đóng
                                </Button>
                            )}
                        </div>

                        {/* Instructions */}
                        <div className="mt-4 text-center">
                            <p className="text-white/80 text-sm">
                                {alert.level === ALERT_LEVELS.CRITICAL 
                                    ? "Để đảm bảo an toàn, vui lòng xác nhận đã nhận cảnh báo và thực hiện các biện pháp an toàn."
                                    : "Kiểm tra thiết bị và môi trường xung quanh để đảm bảo an toàn."
                                }
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );

    // Render to portal for overlay
    return createPortal(alertContent, document.body);
};

export default AlertOverlay; 