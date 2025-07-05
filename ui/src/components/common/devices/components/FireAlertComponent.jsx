import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Volume2, VolumeX, X } from 'lucide-react';

const FireAlertComponent = ({ 
    alert, 
    isAlerting, 
    onAcknowledge, 
    onClear, 
    onToggleSound, 
    isSoundEnabled, 
    compact = false 
}) => {
    if (!alert) return null;

    const getSeverityColor = (level) => {
        switch (level) {
            case 'critical': return 'bg-red-100 border-red-500 text-red-800';
            case 'danger': return 'bg-orange-100 border-orange-500 text-orange-800';
            case 'warning': return 'bg-yellow-100 border-yellow-500 text-yellow-800';
            default: return 'bg-gray-100 border-gray-500 text-gray-800';
        }
    };

    if (compact) {
        return (
            <div className={`p-2 rounded-lg border-2 ${getSeverityColor(alert.level)}`}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        <span className="text-sm font-medium">{alert.message}</span>
                    </div>
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onClear(alert.id)}
                        className="h-6 w-6 p-0"
                    >
                        <X className="h-3 w-3" />
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <Card className={`border-2 ${getSeverityColor(alert.level)}`}>
            <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5" />
                        <Badge variant="destructive" className="uppercase">
                            {alert.level}
                        </Badge>
                    </div>
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
                </div>
                
                <div className="space-y-2">
                    <p className="font-medium">{alert.message}</p>
                    <p className="text-sm opacity-80">
                        {new Date(alert.timestamp).toLocaleString('vi-VN')}
                    </p>
                </div>

                <div className="flex gap-2 mt-3">
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onAcknowledge(alert.id)}
                        className="flex-1"
                    >
                        Đã xem
                    </Button>
                    <Button
                        size="sm"
                        variant="default"
                        onClick={() => onClear(alert.id)}
                        className="flex-1"
                    >
                        Xóa
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default FireAlertComponent; 