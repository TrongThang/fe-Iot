import React, { useState } from 'react';
import { Button } from '../../ui/button';
import { Card, CardContent } from '../../ui/card';
import { 
    DoorOpen, 
    DoorClosed, 
    Lock,
    Unlock,
    RotateCcw,
    Loader2
} from 'lucide-react';
import { Switch } from '../../ui/switch';

const DoorControl = ({ 
    isOpen = false, 
    isLocked = false,
    isLoading = false,
    onToggle = () => {},
    onLock = () => {},
    disabled = false 
}) => {
    const [isAnimating, setIsAnimating] = useState(false);

    const handleToggle = async () => {
        if (disabled || isLoading) return;
        
        setIsAnimating(true);
        try {
            await onToggle(!isOpen);
        } finally {
            setTimeout(() => setIsAnimating(false), 600);
        }
    };

    const handleLock = async () => {
        if (disabled || isLoading) return;
        
        try {
            await onLock(!isLocked);
        } catch (error) {
            console.error('Failed to toggle lock:', error);
        }
    };

    return (
        <Card className="overflow-hidden">
            <CardContent className="p-6">
                <div className="space-y-6">
                    {/* Door Visual Representation */}
                    <div className="relative">
                        <div className="text-center mb-4">
                            <h3 className="text-lg font-semibold mb-2">Cửa ra vào</h3>
                            <p className="text-sm text-slate-600">
                                Trạng thái: <span className={`font-medium ${isOpen ? 'text-green-600' : 'text-blue-600'}`}>
                                    {isOpen ? 'Đang mở' : 'Đã đóng'}
                                </span>
                            </p>
                        </div>

                        {/* Door Animation Container */}
                        <div className="relative w-full h-48 mx-auto mb-6 flex items-center justify-center">
                            {/* Door Frame */}
                            <div className="relative w-32 h-40 border-4 border-slate-400 rounded-lg bg-slate-100">
                                {/* Door */}
                                <div 
                                    className={`absolute inset-1 rounded-md transition-all duration-600 ease-in-out transform ${
                                        isOpen 
                                            ? 'bg-green-500 shadow-lg rotate-y-180 scale-105' 
                                            : 'bg-blue-500 shadow-md'
                                    } ${isAnimating ? 'animate-pulse' : ''}`}
                                    style={{
                                        transformStyle: 'preserve-3d',
                                        transform: isOpen ? 'rotateY(-25deg) translateX(8px)' : 'rotateY(0deg)',
                                    }}
                                >
                                    {/* Door Handle */}
                                    <div 
                                        className={`absolute w-2 h-2 rounded-full top-1/2 transform -translate-y-1/2 transition-all duration-600 ${
                                            isOpen ? 'right-2 bg-white' : 'right-3 bg-yellow-400'
                                        }`}
                                    />
                                    
                                    {/* Door Panels */}
                                    <div className="absolute inset-2 border border-white/30 rounded-sm"></div>
                                    <div className="absolute inset-4 border border-white/20 rounded-sm"></div>
                                </div>

                                {/* Lock Indicator */}
                                {isLocked && (
                                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                        <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                                            <Lock className="w-3 h-3 text-white" />
                                        </div>
                                    </div>
                                )}

                                {/* Status Indicator */}
                                <div className={`absolute -bottom-3 left-1/2 transform -translate-x-1/2 px-2 py-1 rounded-full text-xs font-medium ${
                                    isOpen 
                                        ? 'bg-green-100 text-green-700' 
                                        : 'bg-blue-100 text-blue-700'
                                }`}>
                                    {isOpen ? 'MỞ' : 'ĐÓNG'}
                                </div>
                            </div>

                            {/* Motion Lines */}
                            {isAnimating && (
                                <div className="absolute inset-0 pointer-events-none">
                                    <div className="absolute top-1/2 left-8 w-4 h-0.5 bg-slate-300 animate-ping"></div>
                                    <div className="absolute top-1/2 left-12 w-6 h-0.5 bg-slate-300 animate-ping delay-100"></div>
                                    <div className="absolute top-1/2 left-16 w-4 h-0.5 bg-slate-300 animate-ping delay-200"></div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Control Section */}
                    <div className="space-y-4">
                        {/* Main Toggle */}
                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                            <div className="flex items-center space-x-3">
                                {isOpen ? (
                                    <DoorOpen className="w-6 h-6 text-green-600" />
                                ) : (
                                    <DoorClosed className="w-6 h-6 text-blue-600" />
                                )}
                                <div>
                                    <p className="font-medium">
                                        {isOpen ? 'Mở cửa' : 'Đóng cửa'}
                                    </p>
                                    <p className="text-sm text-slate-600">
                                        {isOpen ? 'Nhấn để đóng cửa' : 'Nhấn để mở cửa'}
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex items-center space-x-3">
                                {isLoading && (
                                    <Loader2 className="w-4 h-4 animate-spin text-slate-500" />
                                )}
                                <Switch
                                    checked={isOpen}
                                    onCheckedChange={handleToggle}
                                    disabled={disabled || isLoading || isLocked}
                                    className="data-[state=checked]:bg-green-500"
                                />
                            </div>
                        </div>

                        {/* Lock Control */}
                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                            <div className="flex items-center space-x-3">
                                {isLocked ? (
                                    <Lock className="w-6 h-6 text-red-600" />
                                ) : (
                                    <Unlock className="w-6 h-6 text-green-600" />
                                )}
                                <div>
                                    <p className="font-medium">
                                        {isLocked ? 'Đã khóa' : 'Chưa khóa'}
                                    </p>
                                    <p className="text-sm text-slate-600">
                                        {isLocked ? 'Cửa bị khóa, không thể mở' : 'Cửa có thể điều khiển'}
                                    </p>
                                </div>
                            </div>
                            
                            <Switch
                                checked={isLocked}
                                onCheckedChange={handleLock}
                                disabled={disabled || isLoading}
                                className="data-[state=checked]:bg-red-500"
                            />
                        </div>

                        {/* Quick Actions */}
                        <div className="grid grid-cols-2 gap-3">
                            <Button
                                variant="outline"
                                onClick={() => handleToggle(!isOpen)}
                                disabled={disabled || isLoading || isLocked}
                                className="h-12 flex-col space-y-1"
                            >
                                {isOpen ? (
                                    <DoorClosed className="w-5 h-5" />
                                ) : (
                                    <DoorOpen className="w-5 h-5" />
                                )}
                                <span className="text-xs">
                                    {isOpen ? 'Đóng cửa' : 'Mở cửa'}
                                </span>
                            </Button>

                            <Button
                                variant="outline"
                                onClick={handleLock}
                                disabled={disabled || isLoading}
                                className="h-12 flex-col space-y-1"
                            >
                                {isLocked ? (
                                    <Unlock className="w-5 h-5" />
                                ) : (
                                    <Lock className="w-5 h-5" />
                                )}
                                <span className="text-xs">
                                    {isLocked ? 'Mở khóa' : 'Khóa cửa'}
                                </span>
                            </Button>
                        </div>

                        {/* Status Information */}
                        <div className="pt-4 border-t border-slate-200">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-slate-600">Trạng thái:</span>
                                    <span className={`font-medium ${isOpen ? 'text-green-600' : 'text-blue-600'}`}>
                                        {isOpen ? 'Mở' : 'Đóng'}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-600">Khóa:</span>
                                    <span className={`font-medium ${isLocked ? 'text-red-600' : 'text-green-600'}`}>
                                        {isLocked ? 'Có' : 'Không'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default DoorControl; 