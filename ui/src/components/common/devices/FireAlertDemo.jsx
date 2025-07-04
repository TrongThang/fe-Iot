import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { 
    Flame, 
    Play, 
    Square, 
    RotateCcw,
    AlertTriangle,
    Volume2,
    VolumeX
} from "lucide-react";

// Import fire alert components
import { useFireAlertSocket, ALERT_LEVELS, ALERT_TYPES } from './hooks/useFireAlertSocket';
import FireAlertComponent from './components/FireAlertComponent';
import AlertOverlay from './components/AlertOverlay';

const FireAlertDemo = () => {
    const [mockSensorData, setMockSensorData] = useState({
        gas: 500,
        temp: 25,
        hum: 45
    });
    const [isSimulating, setIsSimulating] = useState(false);
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [showOverlay, setShowOverlay] = useState(false);

    // Mock device for testing
    const mockDevice = {
        id: 'demo-fire-detector',
        serial_number: 'FIRE-DEMO-001',
        name: 'Demo Fire Detector',
        type: 'smoke',
        account_id: 'demo-user'
    };

    // Initialize fire alert system
    const {
        currentAlert,
        alertHistory,
        isAlerting,
        alertLevel,
        clearAlert,
        acknowledgeAlert,
        getAlertLevel,
        getAlertType
    } = useFireAlertSocket(mockDevice, {
        enableSound: soundEnabled,
        enableNotifications: true,
        autoConnect: false // Manual control for demo
    });

    // Simulate sensor readings
    const simulateAlert = (level) => {
        let newSensorData;
        
        switch (level) {
            case ALERT_LEVELS.WARNING:
                newSensorData = {
                    gas: Math.random() > 0.5 ? 1200 : 500, // Gas warning
                    temp: Math.random() > 0.5 ? 42 : 25,  // Temp warning
                    hum: 60
                };
                break;
            case ALERT_LEVELS.DANGER:
                newSensorData = {
                    gas: Math.random() > 0.5 ? 2500 : 1500, // Gas danger
                    temp: Math.random() > 0.5 ? 52 : 35,    // Temp danger
                    hum: 70
                };
                break;
            case ALERT_LEVELS.CRITICAL:
                newSensorData = {
                    gas: Math.random() > 0.5 ? 3500 : 2800, // Gas critical
                    temp: Math.random() > 0.5 ? 62 : 45,    // Temp critical
                    hum: 85
                };
                break;
            default:
                newSensorData = {
                    gas: 400,
                    temp: 22,
                    hum: 45
                };
        }
        
        setMockSensorData(newSensorData);
        
        // Manually trigger alert check (in real app this would come from socket)
        const alertLvl = getAlertLevel(newSensorData);
        const alertType = getAlertType(newSensorData);
        
        console.log('Demo: Simulated alert', { level: alertLvl, type: alertType, data: newSensorData });
    };

    const startRandomSimulation = () => {
        setIsSimulating(true);
        
        const interval = setInterval(() => {
            const randomLevel = Math.random();
            if (randomLevel > 0.8) {
                simulateAlert(ALERT_LEVELS.CRITICAL);
            } else if (randomLevel > 0.6) {
                simulateAlert(ALERT_LEVELS.DANGER);
            } else if (randomLevel > 0.4) {
                simulateAlert(ALERT_LEVELS.WARNING);
            } else {
                simulateAlert(ALERT_LEVELS.NORMAL);
            }
        }, 3000);

        // Stop after 30 seconds
        setTimeout(() => {
            clearInterval(interval);
            setIsSimulating(false);
            simulateAlert(ALERT_LEVELS.NORMAL);
        }, 30000);
    };

    const stopSimulation = () => {
        setIsSimulating(false);
        simulateAlert(ALERT_LEVELS.NORMAL);
    };

    const resetDemo = () => {
        clearAlert();
        setShowOverlay(false);
        simulateAlert(ALERT_LEVELS.NORMAL);
    };

    const handleToggleSound = () => {
        setSoundEnabled(!soundEnabled);
    };

    const handleShowOverlay = () => {
        if (currentAlert) {
            setShowOverlay(true);
        }
    };

    const handleAcknowledgeAlert = (alertId) => {
        acknowledgeAlert(alertId);
        setShowOverlay(false);
    };

    const handleClearAlert = (alertId) => {
        clearAlert(alertId);
        setShowOverlay(false);
    };

    const currentAlertLvl = getAlertLevel(mockSensorData);
    const currentAlertType = getAlertType(mockSensorData);

    return (
        <div className="space-y-6 p-6 max-w-4xl mx-auto">
            <Card>
                <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <Flame className="w-8 h-8 text-red-500" />
                        <div>
                            <h1 className="text-2xl font-bold">Fire Alert System Demo</h1>
                            <p className="text-gray-600">Test the fire detection and alert system</p>
                        </div>
                    </div>

                    {/* Control Panel */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        {/* Manual Sensor Controls */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Sensor Controls</h3>
                            
                            <div className="space-y-3">
                                <div>
                                    <label className="text-sm font-medium">Gas Level: {mockSensorData.gas} PPM</label>
                                    <Slider
                                        value={[mockSensorData.gas]}
                                        max={4000}
                                        step={10}
                                        onValueChange={(value) => 
                                            setMockSensorData(prev => ({ ...prev, gas: value[0] }))
                                        }
                                        className="mt-2"
                                    />
                                </div>
                                
                                <div>
                                    <label className="text-sm font-medium">Temperature: {mockSensorData.temp}°C</label>
                                    <Slider
                                        value={[mockSensorData.temp]}
                                        max={100}
                                        step={1}
                                        onValueChange={(value) => 
                                            setMockSensorData(prev => ({ ...prev, temp: value[0] }))
                                        }
                                        className="mt-2"
                                    />
                                </div>
                                
                                <div>
                                    <label className="text-sm font-medium">Humidity: {mockSensorData.hum}%</label>
                                    <Slider
                                        value={[mockSensorData.hum]}
                                        max={100}
                                        step={1}
                                        onValueChange={(value) => 
                                            setMockSensorData(prev => ({ ...prev, hum: value[0] }))
                                        }
                                        className="mt-2"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Quick Test Buttons */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Quick Tests</h3>
                            
                            <div className="grid grid-cols-2 gap-3">
                                <Button 
                                    onClick={() => simulateAlert(ALERT_LEVELS.WARNING)}
                                    variant="outline"
                                    className="text-yellow-600 border-yellow-300"
                                >
                                    Warning Alert
                                </Button>
                                
                                <Button 
                                    onClick={() => simulateAlert(ALERT_LEVELS.DANGER)}
                                    variant="outline"
                                    className="text-orange-600 border-orange-300"
                                >
                                    Danger Alert
                                </Button>
                                
                                <Button 
                                    onClick={() => simulateAlert(ALERT_LEVELS.CRITICAL)}
                                    variant="outline"
                                    className="text-red-600 border-red-300"
                                >
                                    Critical Alert
                                </Button>
                                
                                <Button 
                                    onClick={() => simulateAlert(ALERT_LEVELS.NORMAL)}
                                    variant="outline"
                                    className="text-green-600 border-green-300"
                                >
                                    Normal State
                                </Button>
                            </div>
                            
                            <div className="flex gap-3 mt-4">
                                {!isSimulating ? (
                                    <Button onClick={startRandomSimulation} className="flex-1">
                                        <Play className="w-4 h-4 mr-2" />
                                        Start Simulation
                                    </Button>
                                ) : (
                                    <Button onClick={stopSimulation} variant="destructive" className="flex-1">
                                        <Square className="w-4 h-4 mr-2" />
                                        Stop Simulation
                                    </Button>
                                )}
                                
                                <Button onClick={resetDemo} variant="outline">
                                    <RotateCcw className="w-4 h-4 mr-2" />
                                    Reset
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Status Display */}
                    <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">Current Status:</span>
                            <div className="flex items-center gap-2">
                                <Badge variant={
                                    currentAlertLvl === ALERT_LEVELS.CRITICAL ? "destructive" :
                                    currentAlertLvl === ALERT_LEVELS.DANGER ? "secondary" :
                                    currentAlertLvl === ALERT_LEVELS.WARNING ? "outline" : "default"
                                }>
                                    {currentAlertLvl.toUpperCase()}
                                </Badge>
                                {currentAlertType && (
                                    <Badge variant="outline">{currentAlertType.toUpperCase()}</Badge>
                                )}
                            </div>
                        </div>
                        
                        <div className="text-sm text-gray-600">
                            Gas: {mockSensorData.gas} PPM | Temp: {mockSensorData.temp}°C | Humidity: {mockSensorData.hum}%
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="flex gap-3 mt-4">
                        <Button onClick={handleToggleSound} variant="outline" size="sm">
                            {soundEnabled ? <VolumeX className="w-4 h-4 mr-2" /> : <Volume2 className="w-4 h-4 mr-2" />}
                            {soundEnabled ? 'Disable Sound' : 'Enable Sound'}
                        </Button>
                        
                        {currentAlert && (
                            <Button onClick={handleShowOverlay} variant="outline" size="sm">
                                <AlertTriangle className="w-4 h-4 mr-2" />
                                Show Overlay
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Fire Alert Component */}
            {currentAlert && (
                <FireAlertComponent
                    alert={currentAlert}
                    isAlerting={isAlerting}
                    onAcknowledge={handleAcknowledgeAlert}
                    onClear={handleClearAlert}
                    onToggleSound={handleToggleSound}
                    isSoundEnabled={soundEnabled}
                />
            )}

            {/* Alert History */}
            {alertHistory.length > 0 && (
                <Card>
                    <CardContent className="p-6">
                        <h3 className="text-lg font-semibold mb-4">Alert History</h3>
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                            {alertHistory.map((alert) => (
                                <FireAlertComponent
                                    key={alert.id}
                                    alert={alert}
                                    compact={true}
                                    onClear={handleClearAlert}
                                />
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Alert Overlay */}
            <AlertOverlay
                alert={currentAlert}
                isVisible={showOverlay}
                onClose={() => setShowOverlay(false)}
                onAcknowledge={handleAcknowledgeAlert}
                onToggleSound={handleToggleSound}
                isSoundEnabled={soundEnabled}
                allowOutsideClick={true}
            />

            {/* Instructions */}
            <Card>
                <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-3">How to Test</h3>
                    <ol className="list-decimal list-inside space-y-2 text-sm">
                        <li>Use the sensor controls to manually adjust gas, temperature, and humidity levels</li>
                        <li>Or use the quick test buttons to trigger specific alert levels</li>
                        <li>Start the simulation to see random alerts over time</li>
                        <li>Test sound notifications (make sure browser allows audio)</li>
                        <li>Try acknowledging and clearing alerts</li>
                        <li>Test the full-screen overlay for critical alerts</li>
                    </ol>
                    
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-800">
                            <strong>Alert Thresholds:</strong><br/>
                            Warning: Gas ≥1000 PPM or Temp ≥40°C<br/>
                            Danger: Gas ≥2000 PPM or Temp ≥50°C<br/>
                            Critical: Gas ≥3000 PPM or Temp ≥60°C
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default FireAlertDemo; 