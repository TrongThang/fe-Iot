import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
    Volume2, 
    VolumeX, 
    Clock,
    AlertTriangle 
} from "lucide-react";

const QuickAlertMute = ({ 
    currentAlert,
    isSoundEnabled,
    onToggleSound,
    onMuteFor,
    className = ""
}) => {
    const [muteUntil, setMuteUntil] = useState(null);

    // Handle temporary mute
    const handleQuickMute = (minutes) => {
        const muteTime = Date.now() + (minutes * 60 * 1000);
        setMuteUntil(muteTime);
        
        if (onMuteFor) {
            onMuteFor(minutes);
        } else if (onToggleSound && isSoundEnabled) {
            onToggleSound();
            
            // Auto unmute after time
            setTimeout(() => {
                setMuteUntil(null);
                onToggleSound();
            }, minutes * 60 * 1000);
        }
    };

    const handleUnmute = () => {
        setMuteUntil(null);
        if (onToggleSound && !isSoundEnabled) {
            onToggleSound();
        }
    };

    // Don't show if no active alert
    if (!currentAlert) {
        return null;
    }

    const getAlertColor = () => {
        switch(currentAlert.level) {
            case 'critical': return 'text-red-600 border-red-500 bg-red-50';
            case 'danger': return 'text-orange-600 border-orange-500 bg-orange-50';
            case 'warning': return 'text-yellow-600 border-yellow-500 bg-yellow-50';
            default: return 'text-gray-600 border-gray-500 bg-gray-50';
        }
    };

    return (
        <div className={`flex items-center gap-2 p-3 rounded-lg border-2 ${getAlertColor()} ${className}`}>
            <AlertTriangle className="w-5 h-5 animate-pulse" />
            
            <div className="flex-1">
                <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">🚨 Cảnh báo {currentAlert.type}</span>
                    <Badge variant="destructive" className="text-xs">
                        {currentAlert.level}
                    </Badge>
                </div>
                <div className="text-xs opacity-75">
                    {muteUntil ? 
                        `Tắt tiếng đến ${new Date(muteUntil).toLocaleTimeString('vi-VN')}` :
                        (isSoundEnabled ? 'Âm thanh đang bật' : 'Đã tắt tiếng')
                    }
                </div>
            </div>

            <div className="flex items-center gap-1">
                {muteUntil ? (
                    <Button 
                        onClick={handleUnmute}
                        size="sm" 
                        variant="outline"
                        className="text-xs h-8"
                    >
                        <Volume2 className="w-3 h-3 mr-1" />
                        Bật lại
                    </Button>
                ) : (
                    <>
                        {/* Quick mute buttons */}
                        <Button 
                            onClick={() => handleQuickMute(5)}
                            size="sm" 
                            variant="outline"
                            className="text-xs h-8 px-2"
                            title="Tắt tiếng 5 phút"
                        >
                            <VolumeX className="w-3 h-3 mr-1" />
                            5p
                        </Button>
                        
                        <Button 
                            onClick={() => handleQuickMute(15)}
                            size="sm" 
                            variant="outline"
                            className="text-xs h-8 px-2"
                            title="Tắt tiếng 15 phút"
                        >
                            <Clock className="w-3 h-3 mr-1" />
                            15p
                        </Button>

                        {/* Toggle sound */}
                        <Button 
                            onClick={onToggleSound}
                            size="sm" 
                            variant={isSoundEnabled ? "destructive" : "secondary"}
                            className="text-xs h-8"
                        >
                            {isSoundEnabled ? 
                                <><VolumeX className="w-3 h-3 mr-1" />Tắt</> : 
                                <><Volume2 className="w-3 h-3 mr-1" />Bật</>
                            }
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
};

export default QuickAlertMute; 