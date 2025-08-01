"use client";

import React, { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings, Share2 } from "lucide-react";
import deviceApi from '@/apis/modules/deviceApi';

// Import new modular components and hooks
import StatusDisplay from './components/StatusDisplay';
import StatsGrid from './components/StatsGrid';
import ControlRenderer from './components/ControlRenderer';
import DeviceCapabilitiesInfo from './components/DeviceCapabilitiesInfo';
import FireAlertComponent from './components/FireAlertComponent';
import AlertOverlay from './components/AlertOverlay';
import FireDetectorInterface from './components/FireDetectorInterface';
import QuickAlertMute from './components/QuickAlertMute';
import { useDeviceCapabilities } from './hooks/useDeviceCapabilities';
import { useDeviceControls } from './hooks/useDeviceControls';
import { useFireAlertSocket, ALERT_LEVELS } from './hooks/useFireAlertSocket';
import { deviceTypeHelpers } from './constants/deviceConstants';
import { ledUtils } from './utils/deviceUtils';

// Import existing security and sharing components
import DeviceSecurityActions from './DeviceSecurityActions';
import DeviceShareModal from './DeviceShareModal';
import SharedUsersList from './SharedUsersList';
import DoorControl from './DoorControl';
import LightControl from './LightControl';
import { useLEDSocket } from '@/hooks/useSocket';
import { useAuth } from '@/contexts/AuthContext';
import GasMonitoringDetail from './type/GasMonitoringDetail';
import CurrentValueEditor from './CurrentValueEditor';

export default function DynamicDeviceDetail({ device }) {
    const [refreshSharedUsers, setRefreshSharedUsers] = useState(0);
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [showAlertOverlay, setShowAlertOverlay] = useState(false);

    // Auth context để lấy user ID - prioritize account_id for IoT API
    const { user } = useAuth();
    const accountId = user?.account_id || user?.id || user?.userId;

    // Use custom hooks for capabilities and controls
    const {
        capabilities,
        currentValues,
        loading,
        setCurrentValues,
    } = useDeviceCapabilities(device);

    const {
        handleControlChange,
        handlePowerToggle,
        handleSecurityUpdate,
        handleDoorToggle,
        handleDoorLock
    } = useDeviceControls(device, currentValues, setCurrentValues);

    // Check if device is smoke/fire detector
    const isFireDetector = device?.type === 'smoke' ||
        device?.type?.toLowerCase().includes('smoke') ||
        device?.type?.toLowerCase().includes('fire') ||
        device?.template_type?.toLowerCase().includes('smoke') ||
        device?.template_type?.toLowerCase().includes('fire') ||
        capabilities?.capabilities?.includes('SMOKE_DETECTION') ||
        capabilities?.capabilities?.includes('FIRE_DETECTION');

    // Check if device is gas monitoring sensor - ENHANCED criteria
    const isGasMonitoring = !isFireDetector && ( // Explicitly exclude fire detectors first
        device?.type === 'gas-sensor' ||
        (device?.type?.toLowerCase().includes('gas') && !device?.type?.toLowerCase().includes('smoke')) ||
        (device?.template_type?.toLowerCase().includes('gas') && !device?.type?.toLowerCase().includes('smoke')) ||
        (device?.name?.toLowerCase().includes('môi trường') && !device?.name?.toLowerCase().includes('báo')) ||
        (device?.device_type_name?.toLowerCase().includes('môi trường')) ||
        (device?.device_type_parent_name?.toLowerCase().includes('môi trường')) ||
        capabilities?.category?.toLowerCase().includes('environmental') ||
        capabilities?.capabilities?.includes('GAS_DETECTION') ||
        capabilities?.capabilities?.includes('AIR_QUALITY'));

    // Debug logs for device type analysis
    console.log('🔍 Device type analysis for:', device?.name, {
        deviceType: device?.type,
        templateType: device?.template_type,
        deviceTypeName: device?.device_type_name,
        deviceTypeParentName: device?.device_type_parent_name,
        deviceTypeId: device?.device_type_id,
        isFireDetector,
        isGasMonitoring,
        capabilities: capabilities?.capabilities,
        category: capabilities?.category,
        serialNumber: device?.serial_number,
        renderDecision: isFireDetector ? 'FireDetectorInterface' :
            isGasMonitoring ? 'GasMonitoringDetail' :
                'StatusDisplay + StatsGrid'
    });

    // Additional gas monitoring debug
    if (device?.name?.toLowerCase().includes('môi trường')) {
        console.log('🌬️ Environmental device detected:', {
            name: device.name,
            hasEnvironmentalInName: device?.name?.toLowerCase().includes('môi trường'),
            hasGasInCapabilities: capabilities?.capabilities?.includes('GAS_DETECTION'),
            hasAirQualityInCapabilities: capabilities?.capabilities?.includes('AIR_QUALITY'),
            categoryIsEnvironmental: capabilities?.category?.toLowerCase().includes('environmental'),
            finalIsGasMonitoring: isGasMonitoring
        });

        if (!isGasMonitoring) {
            console.warn('⚠️ WARNING: Environmental device not classified as gas monitoring device!');
            console.warn('This device should probably render GasMonitoringDetail instead of StatusDisplay');
        }
    }

    // Fire Alert Socket - only for fire/smoke detectors with valid data
    const canConnectFireSocket = isFireDetector && device && device.serial_number && accountId;
    const {
        currentAlert: fireAlert,
        alertHistory: fireAlertHistory,
        isAlerting: isFireAlerting,
        alertLevel: fireAlertLevel,
        clearAlert: clearFireAlert,
        acknowledgeAlert: acknowledgeFireAlert,
        testAlert,
        simulateSensorData,
        isConnected: fireSocketConnected,
        isDeviceConnected: fireDeviceConnected,
        sensorData: fireSensorData
    } = useFireAlertSocket(canConnectFireSocket ? device : null, {
        enableSound: soundEnabled,
        enableNotifications: notificationsEnabled,
        autoConnect: canConnectFireSocket
    });

    // LED Socket hook để lấy LED modes từ socket - only with valid data
    const canConnectLEDSocket = device?.serial_number && accountId &&
        (deviceTypeHelpers.isLEDDevice(device) ||
            capabilities?.capabilities?.includes('LIGHT_CONTROL'));
    const {
        ledCapabilities,
        isConnected: isLEDConnected,
        applyPreset: socketApplyPreset,
        setEffect: socketSetEffect
    } = useLEDSocket(
        canConnectLEDSocket ? device?.serial_number : null,
        canConnectLEDSocket ? accountId : null,
        {
            autoConnect: canConnectLEDSocket
        }
    );

    // Chuẩn hóa danh sách preset từ socket (ledCapabilities)
    const ledModes = useMemo(() => {
        return ledUtils.processLEDModes(ledCapabilities, device?.serial_number);
    }, [ledCapabilities, device?.serial_number]);

    // Share device handler
    const handleShareDevice = async (device, selectedUser, permissionLevel) => {
        try {
            console.log(`📤 Share permission request sent for device ${device.serial_number}:`, {
                user: selectedUser,
                permission: permissionLevel
            });

            // Refresh shared users list to potentially show pending requests
            setRefreshSharedUsers(prev => prev + 1);

            // Show success message (you can implement toast notification here)
            console.log(`✅ Yêu cầu chia sẻ quyền ${permissionLevel} đã được gửi đến ${selectedUser.name}`);

            return { success: true };
        } catch (error) {
            console.error('❌ Failed to handle share device callback:', error);
            throw error;
        }
    };

    // Remove shared user handler
    const handleRemoveSharedUser = async (deviceId, userId) => {
        try {
            console.log(`🗑️ Removing user ${userId} from device ${deviceId}`);

            // Mock API call - replace with real implementation
            await new Promise(resolve => setTimeout(resolve, 1000));

            console.log('✅ User removed successfully');
            setRefreshSharedUsers(prev => prev + 1);
            return { success: true };
        } catch (error) {
            console.error('❌ Failed to remove user:', error);
            throw error;
        }
    };

    // Fire Alert handlers
    const handleToggleSound = () => {
        setSoundEnabled(!soundEnabled);
    };

    const handleToggleNotifications = () => {
        setNotificationsEnabled(!notificationsEnabled);
    };

    const handleCloseAlertOverlay = () => {
        setShowAlertOverlay(false);
    };

    const handleAcknowledgeFireAlert = (alertId) => {
        acknowledgeFireAlert(alertId);
        setShowAlertOverlay(false);
    };

    const handleClearFireAlert = (alertId) => {
        clearFireAlert(alertId);
        setShowAlertOverlay(false);
    };

    // Render specialized device controls
    const renderSpecializedControl = () => {
        // Door Control    

        if (deviceTypeHelpers.isDoorDevice(device, capabilities)) {
            return (
                <DoorControl
                    isOpen={currentValues.door_status === 'open'}
                    isLocked={device?.lock_status === 'locked' || currentValues.lock_status}
                    isLoading={loading || currentValues.is_moving}
                    onToggle={async (open) => {
                        try {
                            await handleDoorToggle(open);
                        } catch (error) {
                            console.error('Failed to control door:', error);
                        }
                    }}
                    onLock={async (locked) => {
                        try {
                            await handleDoorLock(locked);
                        } catch (error) {
                            console.error('Failed to control door lock:', error);
                        }
                    }}
                />
            );
        }

        // Light Control
        if (deviceTypeHelpers.isLightDevice(device, capabilities)) {


            return (
                <LightControl
                    serialNumber={device.serial_number}
                    isOn={currentValues.power_status}
                    brightness={currentValues.brightness || 75}
                    color={currentValues.color || '#ffffff'}
                    colorMode={currentValues.color_mode || 'manual'}
                    ledModes={ledModes}
                    onToggle={async (on) => {
                        try {
                            handlePowerToggle(on);
                        } catch (error) {
                            console.error('Failed to toggle light:', error);
                        }
                    }}
                    onBrightnessChange={(brightness) => {
                        handleControlChange('brightness', brightness);
                    }}
                    onColorChange={(color) => {
                        handleControlChange('color', color);
                    }}
                    onColorModeChange={(mode) => {
                        setCurrentValues(prev => ({
                            ...prev,
                            color_mode: mode
                        }));
                        console.log(`🎨 Color mode changed locally to: ${mode} (not sent to API)`);
                    }}
                    disabled={device?.lock_status === 'locked'}
                />
            );
        }

        return null;
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <Card>
                    <CardContent className="p-6 text-center">
                        <div className="animate-pulse">
                            <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!capabilities) {
        return (
            <div className="space-y-6">
                <Card>
                    <CardContent className="p-6 text-center">
                        <p className="text-slate-600">Không thể tải thông tin thiết bị</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Quick Alert Mute - Show when there's an active fire alert */}
            {fireAlert && (
                <QuickAlertMute
                    currentAlert={fireAlert}
                    isSoundEnabled={soundEnabled}
                    onToggleSound={handleToggleSound}
                    className="sticky top-4 z-10"
                />
            )}

            {/* Specialized Device Interfaces - Render based on device type */}
            {(isFireDetector || isGasMonitoring) ? (
                // Gas/Smoke Monitoring Interface - Show comprehensive sensor data for both gas and smoke detectors
                <GasMonitoringDetail
                    device={device}
                    sensorType={isFireDetector ? 'smoke' : 'gas'}
                />
            ) : (
                // Default Status Display for other devices
                <>
                    {/* <StatusDisplay
                        device={device}
                        capabilities={capabilities}
                        currentValues={currentValues}
                    /> */}
                    {/* <StatsGrid
                        device={device}
                        capabilities={capabilities}
                        currentValues={currentValues}
                    /> */}
                </>
            )}

            {renderSpecializedControl()}

            {/* Standard Controls - only show if no specialized control is rendered */}
            {!renderSpecializedControl() && capabilities.controls && Object.keys(capabilities.controls).length > 0 && (
                <Card>
                    <CardContent className="p-6">
                        <h3 className="text-lg font-semibold mb-4 flex items-center">
                            <Settings className="w-5 h-5 mr-2" />
                            Điều khiển thiết bị
                        </h3>
                        <div className="space-y-6">
                            {Object.entries(capabilities.controls).map(([key, type]) => (
                                <ControlRenderer
                                    key={key}
                                    controlKey={key}
                                    controlType={type}
                                    value={currentValues[key] || 0}
                                    onControlChange={handleControlChange}
                                    onPowerToggle={handlePowerToggle}
                                />
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Device Security Actions */}
            <DeviceSecurityActions
                device={device}
                onSecurityUpdate={handleSecurityUpdate}
            />

            {/* Device Sharing Section */}
            <Card>
                <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold flex items-center">
                            <Share2 className="w-5 h-5 mr-2" />
                            Chia sẻ thiết bị
                        </h3>
                    </div>
                    <div className="space-y-4">
                        <p className="text-sm text-slate-600">
                            Chia sẻ thiết bị với người dùng khác để họ có thể xem hoặc điều khiển thiết bị.
                        </p>
                        <DeviceShareModal
                            device={device}
                            onShareDevice={handleShareDevice}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Shared Users List */}
            <SharedUsersList
                device={device}
                onRemoveSharedUser={handleRemoveSharedUser}
                refreshSharedUsers={refreshSharedUsers}
            />

            {/* Capabilities Info */}
            <DeviceCapabilitiesInfo
                device={device}
                capabilities={capabilities}
            />

            {/* Current Value Editor */}
            <CurrentValueEditor
                device={device}
                currentValue={device?.current_value}
                onCurrentValueChange={(updatedCurrentValue) => {
                    console.log('🔄 Current value updated:', updatedCurrentValue);
                    // Update device object to reflect changes
                    if (device) {
                        device.current_value = updatedCurrentValue;
                    }
                }}
            />

            {/* Fire Alert Debug Section - Only show for fire detectors */}
            {isFireDetector && (
                <Card>
                    <CardContent className="p-6 ">
                        <h3 className="text-lg font-semibold mb-4 flex items-center">
                            <Settings className="w-5 h-5 mr-2" />
                            Fire Alert Debug
                        </h3>

                        <div className="space-y-4">
                            {/* Connection Status */}
                            <div className="p-3 bg-gray-50 rounded-lg ">
                                <div className="text-sm">
                                    <div>Socket Connected: {fireSocketConnected ? '✅' : '❌'}</div>
                                    <div>Device Connected: {fireDeviceConnected ? '✅' : '❌'}</div>
                                    <div>Has Sensor Data: {fireSensorData ? '✅' : '❌'}</div>
                                    <div>Current Alert: {fireAlert ? '🚨' : '✅'}</div>
                                </div>
                                {fireSensorData && (
                                    <div className="mt-2 text-xs text-gray-600">
                                        Gas: {fireSensorData.gas || fireSensorData.ppm || 0} PPM |
                                        Temp: {fireSensorData.temp || 0}°C |
                                        Hum: {fireSensorData.hum || 0}%
                                    </div>
                                )}
                            </div>

                            {/* Test Buttons */}
                            <div className="flex flex-wrap gap-2">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => testAlert && testAlert(ALERT_LEVELS.WARNING)}
                                    className="text-yellow-600"
                                >
                                    Test Warning
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => testAlert && testAlert(ALERT_LEVELS.DANGER)}
                                    className="text-orange-600"
                                >
                                    Test Danger
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => testAlert && testAlert(ALERT_LEVELS.CRITICAL)}
                                    className="text-red-600"
                                >
                                    Test Critical
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => simulateSensorData && simulateSensorData(2500, 55, 70)}
                                    className="text-blue-600"
                                >
                                    Simulate High Gas
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => clearFireAlert && clearFireAlert()}
                                    className="text-green-600"
                                >
                                    Clear All Alerts
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Fire Alert Overlay for Critical Alerts */}
            {isFireDetector && (
                <AlertOverlay
                    alert={fireAlert}
                    isVisible={showAlertOverlay}
                    onClose={handleCloseAlertOverlay}
                    onAcknowledge={handleAcknowledgeFireAlert}
                    onToggleSound={handleToggleSound}
                    isSoundEnabled={soundEnabled}
                    allowOutsideClick={fireAlertLevel !== ALERT_LEVELS.CRITICAL}
                />
            )}

        </div>
    );
} 