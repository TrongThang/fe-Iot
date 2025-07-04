import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Flame, Play, Square } from "lucide-react";

// Import fire alert system
import { useFireAlertSocket, ALERT_LEVELS, ALERT_TYPES } from './hooks/useFireAlertSocket';
import FireAlertComponent from './components/FireAlertComponent';
import AlertOverlay from './components/AlertOverlay';
import FireDetectorInterface from './components/FireDetectorInterface';
import QuickAlertMute from './components/QuickAlertMute';

const TestFireAlert = () => {
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [showOverlay, setShowOverlay] = useState(false);

    // Mock device for testing
    const mockDevice = {
        id: 'test-fire-001',
        serial_number: 'TEST-FIRE-001',
        name: 'Test Fire Detector',
        type: 'smoke',
        account_id: 'test-user'
    };

    // Initialize fire alert system
    const {
        currentAlert,
        alertHistory,
        isAlerting,
        alertLevel,
        isConnected,
        isDeviceConnected,
        sensorData,
        clearAlert,
        acknowledgeAlert,
        testAlert,
        simulateSensorData
    } = useFireAlertSocket(mockDevice, {
        enableSound: soundEnabled,
        enableNotifications: notificationsEnabled,
        autoConnect: true
    });

    const handleToggleSound = () => {
        setSoundEnabled(!soundEnabled);
    };

    const handleToggleNotifications = () => {
        setNotificationsEnabled(!notificationsEnabled);
    };

    const handleAcknowledgeAlert = (alertId) => {
        acknowledgeAlert(alertId);
        setShowOverlay(false);
    };

    const handleClearAlert = (alertId) => {
        clearAlert(alertId);
        setShowOverlay(false);
    };

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            <Card>
                <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <Flame className="w-8 h-8 text-red-500" />
                        <div>
                            <h1 className="text-2xl font-bold">🚨 Test Fire Alert System</h1>
                            <p className="text-gray-600">Quick test for fire detection alerts</p>
                        </div>
                    </div>

                    {/* Connection Status */}
                    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                        <h3 className="font-semibold mb-2">Connection Status</h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center gap-2">
                                <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                                Socket: {isConnected ? 'Connected' : 'Disconnected'}
                            </div>
                            <div className="flex items-center gap-2">
                                <div className={`w-3 h-3 rounded-full ${isDeviceConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                                Device: {isDeviceConnected ? 'Connected' : 'Disconnected'}
                            </div>
                            <div className="flex items-center gap-2">
                                <div className={`w-3 h-3 rounded-full ${sensorData ? 'bg-green-500' : 'bg-gray-400'}`} />
                                Sensor Data: {sensorData ? 'Receiving' : 'No Data'}
                            </div>
                            <div className="flex items-center gap-2">
                                <div className={`w-3 h-3 rounded-full ${currentAlert ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`} />
                                Alert Status: {currentAlert ? 'ALERTING' : 'Normal'}
                            </div>
                        </div>
                        {sensorData && (
                            <div className="mt-2 text-xs text-gray-600">
                                Last Reading: Gas {sensorData.gas || sensorData.ppm || 0} PPM, 
                                Temp {sensorData.temp || 0}°C, Hum {sensorData.hum || 0}%
                            </div>
                        )}
                    </div>

                    {/* Test Controls */}
                    <div className="space-y-4">
                        <h3 className="font-semibold">🧪 Test Controls</h3>
                        
                        {/* Manual Alert Tests */}
                        <div>
                            <h4 className="text-sm font-medium mb-2">Manual Alert Tests:</h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                <Button
                                    onClick={() => testAlert(ALERT_LEVELS.WARNING, ALERT_TYPES.GAS)}
                                    variant="outline"
                                    size="sm"
                                    className="text-yellow-600 border-yellow-300"
                                >
                                    ⚠️ Warning
                                </Button>
                                <Button
                                    onClick={() => testAlert(ALERT_LEVELS.DANGER, ALERT_TYPES.FIRE)}
                                    variant="outline"
                                    size="sm"
                                    className="text-orange-600 border-orange-300"
                                >
                                    🚨 Danger
                                </Button>
                                <Button
                                    onClick={() => testAlert(ALERT_LEVELS.CRITICAL, ALERT_TYPES.SMOKE)}
                                    variant="outline"
                                    size="sm"
                                    className="text-red-600 border-red-300"
                                >
                                    🔥 Critical
                                </Button>
                                <Button
                                    onClick={() => clearAlert()}
                                    variant="outline"
                                    size="sm"
                                    className="text-green-600 border-green-300"
                                >
                                    ✅ Clear
                                </Button>
                            </div>
                        </div>

                        {/* Sensor Simulation */}
                        <div>
                            <h4 className="text-sm font-medium mb-2">Sensor Data Simulation:</h4>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                <Button
                                    onClick={() => simulateSensorData(1200, 42, 60)}
                                    variant="outline"
                                    size="sm"
                                    className="text-yellow-600"
                                >
                                    Gas Warning
                                </Button>
                                <Button
                                    onClick={() => simulateSensorData(2500, 55, 70)}
                                    variant="outline"
                                    size="sm"
                                    className="text-orange-600"
                                >
                                    High Temperature
                                </Button>
                                <Button
                                    onClick={() => simulateSensorData(3500, 65, 85)}
                                    variant="outline"
                                    size="sm"
                                    className="text-red-600"
                                >
                                    Critical Levels
                                </Button>
                            </div>
                        </div>

                        {/* Sound Control */}
                        <div className="flex items-center gap-3">
                            <Button
                                onClick={handleToggleSound}
                                variant="outline"
                                size="sm"
                            >
                                {soundEnabled ? '🔊 Sound ON' : '🔇 Sound OFF'}
                            </Button>
                            
                            {currentAlert && (
                                <Button
                                    onClick={() => setShowOverlay(true)}
                                    variant="outline"
                                    size="sm"
                                >
                                    🖥️ Show Overlay
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Current Status */}
                    {(currentAlert || isAlerting) && (
                        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <div className="flex items-center justify-between">
                                <span className="font-medium text-red-800">🚨 ACTIVE ALERT</span>
                                <Badge variant="destructive">{alertLevel?.toUpperCase()}</Badge>
                            </div>
                            {currentAlert && (
                                <div className="mt-2 text-sm text-red-700">
                                    Type: {currentAlert.type} | Device: {currentAlert.deviceName}
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Quick Alert Mute */}
            {currentAlert && (
                <QuickAlertMute
                    currentAlert={currentAlert}
                    isSoundEnabled={soundEnabled}
                    onToggleSound={handleToggleSound}
                />
            )}

            {/* Fire Detector Interface */}
            <FireDetectorInterface
                device={mockDevice}
                currentAlert={currentAlert}
                isAlerting={isAlerting}
                alertLevel={alertLevel}
                sensorData={sensorData}
                lastUpdate={new Date()}
                isConnected={isConnected}
                isDeviceConnected={isDeviceConnected}
                onAcknowledgeAlert={handleAcknowledgeAlert}
                onClearAlert={handleClearAlert}
                onToggleSound={handleToggleSound}
                isSoundEnabled={soundEnabled}
                onToggleNotifications={handleToggleNotifications}
                isNotificationsEnabled={notificationsEnabled}
            />

            {/* Original Fire Alert Component */}
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
                        <h3 className="text-lg font-semibold mb-4">📝 Alert History</h3>
                        <div className="space-y-2">
                            {alertHistory.slice(0, 5).map((alert) => (
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

            {/* Instructions */}
            <Card>
                <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-3">📋 How to Test</h3>
                    <ol className="list-decimal list-inside space-y-2 text-sm">
                        <li>Check the connection status above</li>
                        <li>Use <strong>"Manual Alert Tests"</strong> to trigger different alert levels instantly</li>
                        <li>Use <strong>"Sensor Data Simulation"</strong> to simulate realistic sensor readings</li>
                        <li>Test sound notifications and overlay display</li>
                        <li>Practice acknowledging and clearing alerts</li>
                        <li>Check console logs for detailed debugging info</li>
                    </ol>
                    
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-800">
                            <strong>💡 Debug Tip:</strong> Open browser console (F12) to see detailed logs from the fire alert system.
                        </p>
                    </div>
                </CardContent>
            </Card>

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
        </div>
    );
};

export default TestFireAlert; 