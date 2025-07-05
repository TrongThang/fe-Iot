import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, X, Volume2, VolumeX } from 'lucide-react';

const AlertOverlay = ({ 
    alert, 
    isVisible, 
    onClose, 
    onAcknowledge, 
    onToggleSound, 
    isSoundEnabled, 
    allowOutsideClick = true 
}) => {
    if (!isVisible || !alert) return null;

    const getSeverityColor = (level) => {
        switch (level) {
            case 'critical': return 'bg-red-600 text-white';
            case 'danger': return 'bg-orange-600 text-white';
            case 'warning': return 'bg-yellow-600 text-white';
            default: return 'bg-gray-600 text-white';
        }
    };

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={allowOutsideClick ? onClose : undefined}
        >
            <Card 
                className="w-full max-w-md border-4 border-red-500 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <CardContent className="p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <AlertTriangle className="h-8 w-8 text-red-600" />
                            <Badge className={getSeverityColor(alert.level)}>
                                {alert.level?.toUpperCase()}
                            </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={onToggleSound}
                                className="h-8 w-8 p-0"
                            >
                                {isSoundEnabled ? 
                                    <Volume2 className="h-4 w-4" /> : 
                                    <VolumeX className="h-4 w-4" />
                                }
                            </Button>
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={onClose}
                                className="h-8 w-8 p-0"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Alert Message */}
                    <div className="text-center mb-6">
                        <h2 className="text-xl font-bold text-red-700 mb-2">
                            CẢNH BÁO KHẨN CẤP
                        </h2>
                        <p className="text-gray-700 mb-2">
                            {alert.message}
                        </p>
                        <p className="text-sm text-gray-500">
                            {new Date(alert.timestamp).toLocaleString('vi-VN')}
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <Button
                            onClick={() => onAcknowledge(alert.id)}
                            className="flex-1 bg-blue-600 hover:bg-blue-700"
                        >
                            Đã xem
                        </Button>
                        <Button
                            onClick={onClose}
                            variant="outline"
                            className="flex-1"
                        >
                            Đóng
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default AlertOverlay; 