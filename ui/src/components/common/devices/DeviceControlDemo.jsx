import React, { useState } from 'react';
import { Card, CardContent } from '../../ui/card';
import { Badge } from '../../ui/badge';
import DoorControl from './DoorControl';
import LightControl from './LightControl';

const DeviceControlDemo = () => {
    // Door control state
    const [doorState, setDoorState] = useState({
        isOpen: false,
        isLocked: false,
        isOnline: true,
        isMoving: false
    });

    // Light control state
    const [lightState, setLightState] = useState({
        isOn: false,
        brightness: 75,
        color: '#ffffff',
        colorMode: 'manual'
    });

    const handleDoorToggle = (isOpen) => {
        console.log('🚪 Demo: Door toggle to', isOpen ? 'OPEN' : 'CLOSED');
        setDoorState(prev => ({ ...prev, isMoving: true }));
        
        // Simulate API delay
        setTimeout(() => {
            setDoorState(prev => ({ ...prev, isOpen, isMoving: false }));
            console.log('✅ Demo: Door state updated');
        }, 1000);
    };

    const handleDoorLock = (isLocked) => {
        console.log('🔒 Demo: Door lock to', isLocked ? 'LOCKED' : 'UNLOCKED');
        setDoorState(prev => ({ ...prev, isLocked }));
    };

    const handleLightToggle = (isOn) => {
        console.log('💡 Demo: Light toggle to', isOn ? 'ON' : 'OFF');
        setLightState(prev => ({ ...prev, isOn }));
    };

    const handleBrightnessChange = (brightness) => {
        console.log('🔆 Demo: Brightness change to', brightness + '%');
        setLightState(prev => ({ ...prev, brightness }));
    };

    const handleColorChange = (color) => {
        console.log('🎨 Demo: Color change to', color);
        setLightState(prev => ({ ...prev, color }));
    };

    const handleColorModeChange = (mode) => {
        console.log('🎨 Demo: Color mode change to', mode);
        setLightState(prev => ({ ...prev, colorMode: mode }));
    };

    return (
        <div className="p-6 space-y-8 max-w-2xl mx-auto">
            <div className="text-center">
                <h1 className="text-3xl font-bold mb-2">Device Control Demo</h1>
                <p className="text-slate-600">Test các component điều khiển thiết bị IoT</p>
            </div>

            {/* Current State Display */}
            <Card>
                <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Debug Info</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <h4 className="font-medium mb-2">Door State:</h4>
                            <div className="space-y-1">
                                <Badge variant={doorState.isOpen ? "default" : "secondary"}>
                                    {doorState.isOpen ? 'Open' : 'Closed'}
                                </Badge>
                                <Badge variant={doorState.isLocked ? "destructive" : "outline"}>
                                    {doorState.isLocked ? 'Locked' : 'Unlocked'}
                                </Badge>
                                {doorState.isMoving && <Badge variant="outline">Moving</Badge>}
                            </div>
                        </div>
                        <div>
                            <h4 className="font-medium mb-2">Light State:</h4>
                            <div className="space-y-1">
                                <Badge variant={lightState.isOn ? "default" : "secondary"}>
                                    {lightState.isOn ? 'ON' : 'OFF'}
                                </Badge>
                                <Badge variant="outline">
                                    {lightState.brightness}% Brightness
                                </Badge>
                                <Badge variant="outline" style={{ backgroundColor: lightState.color + '40' }}>
                                    {lightState.color}
                                </Badge>
                                <Badge variant="outline">
                                    {lightState.colorMode} mode
                                </Badge>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Door Control Demo */}
            <div>
                <h2 className="text-xl font-semibold mb-4">🚪 Door Control</h2>
                <DoorControl 
                    isOpen={doorState.isOpen}
                    isLocked={doorState.isLocked}
                    isOnline={doorState.isOnline}
                    isLoading={doorState.isMoving}
                    onToggle={handleDoorToggle}
                    onLock={handleDoorLock}
                />
            </div>

            {/* Light Control Demo */}
            <div>
                <h2 className="text-xl font-semibold mb-4">💡 Light Control</h2>
                <LightControl 
                    isOn={lightState.isOn}
                    brightness={lightState.brightness}
                    color={lightState.color}
                    colorMode={lightState.colorMode}
                    onToggle={handleLightToggle}
                    onBrightnessChange={handleBrightnessChange}
                    onColorChange={handleColorChange}
                    onColorModeChange={handleColorModeChange}
                />
            </div>

            {/* Quick Actions Panel */}
            <Card>
                <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Quick Test Actions</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h4 className="font-medium mb-2">Door Tests:</h4>
                            <div className="space-y-2">
                                <button 
                                    className="w-full px-3 py-2 text-sm bg-blue-100 hover:bg-blue-200 rounded"
                                    onClick={() => handleDoorToggle(!doorState.isOpen)}
                                >
                                    Toggle Door
                                </button>
                                <button 
                                    className="w-full px-3 py-2 text-sm bg-red-100 hover:bg-red-200 rounded"
                                    onClick={() => handleDoorLock(!doorState.isLocked)}
                                >
                                    Toggle Lock
                                </button>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-medium mb-2">Light Tests:</h4>
                            <div className="space-y-2">
                                <button 
                                    className="w-full px-3 py-2 text-sm bg-yellow-100 hover:bg-yellow-200 rounded"
                                    onClick={() => handleLightToggle(!lightState.isOn)}
                                >
                                    Toggle Light
                                </button>
                                <button 
                                    className="w-full px-3 py-2 text-sm bg-green-100 hover:bg-green-200 rounded"
                                    onClick={() => handleBrightnessChange(Math.floor(Math.random() * 100))}
                                >
                                    Random Brightness
                                </button>
                                <button 
                                    className="w-full px-3 py-2 text-sm bg-purple-100 hover:bg-purple-200 rounded"
                                    onClick={() => {
                                        const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
                                        const randomColor = colors[Math.floor(Math.random() * colors.length)];
                                        handleColorChange(randomColor);
                                    }}
                                >
                                    Random Color
                                </button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Console Log Helper */}
            <Card>
                <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Debug Console</h3>
                    <p className="text-sm text-slate-600">
                        Mở Developer Console (F12) để xem log chi tiết của các tương tác.
                        <br />
                        Tất cả các thay đổi sẽ được log với emoji prefix cho dễ theo dõi.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
};

export default DeviceControlDemo; 