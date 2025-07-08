import React, { useState } from "react";
import { Flame, AlertTriangle, Thermometer, Wind, Droplets } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Import fire alert components and hooks
import { useFireAlertSocket, ALERT_LEVELS, ALERT_TYPES } from '../hooks/useFireAlertSocket';
import FireAlertComponent from '../components/FireAlertComponent';
import AlertOverlay from '../components/AlertOverlay';
import ActionDetail from "../ActionDetail";
import RealtimeSensorDisplay from "../RealtimeSensorDisplay";

export default function SmokeDetectorDetail({ device }) {
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [showOverlay, setShowOverlay] = useState(false);

    // Initialize fire alert monitoring
    const {
        currentAlert,
        alertHistory,
        isAlerting,
        alertLevel,
        lastSensorReading,
        isConnected,
        isDeviceConnected,
        sensorData,
        clearAlert,
        acknowledgeAlert,
        testAlert,
        simulateSensorData
    } = useFireAlertSocket(device, {
        enableSound: soundEnabled,
        enableNotifications: true,
        autoConnect: true
    });

    // Use real-time sensor data or fallback to device props
    const currentValues = sensorData || lastSensorReading || {
        gas: device.ppm || device.gas || 0,
        temp: device.temp || 25,
        hum: device.humidity || device.hum || 45,
        ppm: device.ppm || device.gas || 0
    };

    // Get alert level based on current values
    const getStatusColor = (value, type) => {
        switch (type) {
            case 'gas':
                if (value >= 3000) return 'bg-red-500';
                if (value >= 2000) return 'bg-orange-500';
                if (value >= 1000) return 'bg-yellow-500';
                return 'bg-green-500';
            case 'temp':
                if (value >= 60) return 'bg-red-500';
                if (value >= 50) return 'bg-orange-500';
                if (value >= 40) return 'bg-yellow-500';
                return 'bg-green-500';
            case 'hum':
                if (value >= 95) return 'bg-red-500';
                if (value >= 90) return 'bg-orange-500';
                if (value >= 80) return 'bg-yellow-500';
                return 'bg-green-500';
            default:
                return 'bg-gray-500';
        }
    };

    const getStatusText = () => {
        if (!isConnected) return 'Offline';
        if (!isDeviceConnected) return 'Đang kết nối...';
        if (isAlerting) {
            switch (alertLevel) {
                case ALERT_LEVELS.CRITICAL: return 'NGUY HIỂM CAO';
                case ALERT_LEVELS.DANGER: return 'NGUY HIỂM';
                case ALERT_LEVELS.WARNING: return 'Cảnh báo';
                default: return 'Online';
            }
        }
        return 'An toàn';
    };

    const handleToggleSound = () => {
        setSoundEnabled(!soundEnabled);
    };

    const handleShowOverlay = () => {
        if (currentAlert) {
            setShowOverlay(true);
        }
    };

    const handleCloseOverlay = () => {
        setShowOverlay(false);
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
        <div className="space-y-6">
            {/* Fire Alert Component - Show if there's an active alert */}
            {currentAlert && (
                <FireAlertComponent
                    alert={currentAlert}
                    isAlerting={isAlerting}
                    onAcknowledge={handleAcknowledgeAlert}
                    onClear={handleClearAlert}
                    onToggleSound={handleToggleSound}
                    isSoundEnabled={soundEnabled}
                    compact={false}
                />
            )}

            {/* Real-time Sensor Display */}
            <RealtimeSensorDisplay 
                deviceSerial={device.serial_number || device.serialNumber}
                deviceName={device.name || device.device_name}
            />

            {/* Connection Status */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className={cn(
                                "w-3 h-3 rounded-full",
                                isConnected && isDeviceConnected ? "bg-green-500" : "bg-red-500"
                            )} />
                            <span className="text-sm font-medium">
                                Trạng thái kết nối: {isConnected && isDeviceConnected ? 'Đã kết nối' : 'Mất kết nối'}
                            </span>
                        </div>
                        {alertLevel !== ALERT_LEVELS.NORMAL && (
                            <Badge 
                                variant={alertLevel === ALERT_LEVELS.CRITICAL ? "destructive" : "secondary"}
                                className="animate-pulse"
                            >
                                {alertLevel === ALERT_LEVELS.CRITICAL ? 'NGUY HIỂM CAO' :
                                 alertLevel === ALERT_LEVELS.DANGER ? 'NGUY HIỂM' : 'CẢNH BÁO'}
                            </Badge>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Sensor Readings */}
            <div className="space-y-4">
                {/* Gas Level */}
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <Wind className="w-5 h-5 text-gray-600" />
                            <span className="text-gray-700 font-medium">Khí gas:</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className={cn(
                                "text-2xl font-bold",
                                currentValues.gas > 2000 ? "text-red-600" :
                                currentValues.gas > 1000 ? "text-orange-600" :
                                "text-gray-800"
                            )}>
                                {currentValues.gas} PPM
                            </span>
                            <div className={cn(
                                "w-3 h-3 rounded-full",
                                getStatusColor(currentValues.gas, 'gas')
                            )} />
                        </div>
                    </div>
                    <Slider
                        value={[currentValues.gas]}
                        max={4000}
                        step={1}
                        className="w-full"
                        disabled
                    />
                </div>

                {/* Temperature */}
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <Thermometer className="w-5 h-5 text-gray-600" />
                            <span className="text-gray-700 font-medium">Nhiệt độ:</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className={cn(
                                "text-2xl font-bold",
                                currentValues.temp > 50 ? "text-red-600" :
                                currentValues.temp > 40 ? "text-orange-600" :
                                "text-gray-800"
                            )}>
                                {currentValues.temp}°C
                            </span>
                            <div className={cn(
                                "w-3 h-3 rounded-full",
                                getStatusColor(currentValues.temp, 'temp')
                            )} />
                        </div>
                    </div>
                    <Slider
                        value={[currentValues.temp]}
                        max={100}
                        step={1}
                        className="w-full"
                        disabled
                    />
                </div>

                {/* Humidity */}
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <Droplets className="w-5 h-5 text-gray-600" />
                            <span className="text-gray-700 font-medium">Độ ẩm:</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className={cn(
                                "text-2xl font-bold",
                                currentValues.hum > 90 ? "text-red-600" :
                                currentValues.hum > 80 ? "text-orange-600" :
                                "text-gray-800"
                            )}>
                                {currentValues.hum}%
                            </span>
                            <div className={cn(
                                "w-3 h-3 rounded-full",
                                getStatusColor(currentValues.hum, 'hum')
                            )} />
                        </div>
                    </div>
                    <Slider
                        value={[currentValues.hum]}
                        max={100}
                        step={1}
                        className="w-full"
                        disabled
                    />
                </div>
            </div>

            {/* Alert History */}
            {alertHistory.length > 0 && (
                <Card>
                    <CardContent className="p-4">
                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5" />
                            Lịch sử cảnh báo
                        </h3>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
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

            {/* Debug Section */}
            <Card>
                <CardContent className="p-4">
                    <h3 className="text-lg font-semibold mb-3">🔧 Debug Controls</h3>
                    
                    <div className="space-y-3">
                        {/* Connection Status */}
                        <div className="p-3 bg-gray-50 rounded-lg text-sm">
                            <div>Socket: {isConnected ? '✅ Connected' : '❌ Disconnected'}</div>
                            <div>Device: {isDeviceConnected ? '✅ Connected' : '❌ Disconnected'}</div>
                            <div>Real-time Data: {sensorData ? '✅ Receiving' : '❌ No Data'}</div>
                            {sensorData && (
                                <div className="text-xs text-gray-600 mt-1">
                                    Latest: Gas {sensorData.gas || sensorData.ppm || 0} PPM, 
                                    Temp {sensorData.temp || 0}°C, Hum {sensorData.hum || 0}%
                                </div>
                            )}
                        </div>

                        {/* Test Buttons */}
                        <div className="grid grid-cols-2 gap-2">
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => testAlert && testAlert(ALERT_LEVELS.WARNING)}
                                className="text-yellow-600 border-yellow-300"
                            >
                                ⚠️ Test Warning
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => testAlert && testAlert(ALERT_LEVELS.DANGER)}
                                className="text-orange-600 border-orange-300"
                            >
                                🚨 Test Danger
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => testAlert && testAlert(ALERT_LEVELS.CRITICAL)}
                                className="text-red-600 border-red-300"
                            >
                                🔥 Test Critical
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => simulateSensorData && simulateSensorData(2500, 55, 80)}
                                className="text-blue-600 border-blue-300"
                            >
                                📊 Simulate Data
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Action Buttons */}
            <ActionDetail 
                lock={() => {}} 
                disconnect={() => {}} 
                share={() => {}} 
                reset={() => {}} 
                transfer={() => {}} 
                version={() => {}} 
                alert={currentAlert ? handleShowOverlay : undefined}
            />

            {/* Alert Overlay for Critical Alerts */}
            <AlertOverlay
                alert={currentAlert}
                isVisible={showOverlay}
                onClose={handleCloseOverlay}
                onAcknowledge={handleAcknowledgeAlert}
                onToggleSound={handleToggleSound}
                isSoundEnabled={soundEnabled}
                allowOutsideClick={alertLevel !== ALERT_LEVELS.CRITICAL}
            />
        </div>
    );
}