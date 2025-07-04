import { useState, useEffect, useCallback } from 'react';
import deviceApi from '@/apis/modules/deviceApi';

export const useDeviceControls = (device, currentValues, setCurrentValues) => {
    const [updateTimeout, setUpdateTimeout] = useState(null);

    // Helper function to get device ID with fallback
    const getDeviceId = () => device?.device_id || device?.id;

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (updateTimeout) {
                clearTimeout(updateTimeout);
            }
        };
    }, [updateTimeout]);

    // Helper function để bulk update nhiều controls cùng lúc
    const bulkUpdateControls = useCallback(async (updatesArray) => {
        try {
            const serialNumber = device?.serial_number;
            console.log(`📦 Bulk update: ${updatesArray.length} controls (Serial: ${serialNumber})`);
            
            const response = await deviceApi.bulkUpdateDeviceControls(serialNumber, updatesArray, serialNumber);
            console.log("✅ Bulk update successful:", response);
            return response;
        } catch (error) {
            console.error("❌ Bulk update failed:", error);
            throw error;
        }
    }, [device?.serial_number]);

    const handleControlChange = useCallback((controlKey, value) => {
        try {
            const deviceId = getDeviceId();
            const serialNumber = device?.serial_number;
            console.log(`🎛️ Control change: ${controlKey} → ${value} (Device: ${deviceId}, Serial: ${serialNumber})`);
            
            // Update local state immediately for better UX
            const newValues = { ...currentValues, [controlKey]: value };
            setCurrentValues(newValues);

            // Clear previous timeout
            if (updateTimeout) {
                clearTimeout(updateTimeout);
                console.log("🕐 Cleared previous API timeout");
            }

            // Debounce API calls only - don't update parent component immediately
            const newTimeout = setTimeout(async () => {
                try {
                    console.log(`📡 Sending API update for ${controlKey}: ${value}`);
                    // Try to send update to backend (non-blocking) - pass deviceId
                    const response = await deviceApi.updateDeviceControl(serialNumber, {
                        [controlKey]: value
                    }, deviceId); // Pass deviceId for proper endpoint
                    console.log(`✅ API update successful for ${controlKey}:`, response);
                } catch (apiError) {
                    console.error(`❌ API update failed for ${controlKey}:`, apiError);
                    // Revert local state on API error
                    setCurrentValues(prev => ({
                        ...prev,
                        [controlKey]: currentValues[controlKey] // Revert to previous value
                    }));
                    
                    // Show error feedback to user
                    console.warn(`🔄 Reverted ${controlKey} due to API error`);
                }
            }, 300); // Reduced debounce to 300ms for better responsiveness

            setUpdateTimeout(newTimeout);

        } catch (error) {
            console.error("❌ Error in handleControlChange:", error);
            // Revert local state on error
            setCurrentValues(currentValues);
        }
    }, [device, currentValues, setCurrentValues, updateTimeout]);

    const handlePowerToggle = useCallback((checked) => {
        try {
            const deviceId = getDeviceId();
            const serialNumber = device?.serial_number;
            console.log(`🔌 Power toggle: ${checked} (Device: ${deviceId}, Serial: ${serialNumber})`);
            
            // Update local state only
            const newValues = { ...currentValues, power_status: checked };
            setCurrentValues(newValues);

            // Send to API using toggle endpoint
            setTimeout(async () => {
                try {
                    console.log(`📡 Sending power toggle API update: ${checked}`);
                    const response = await deviceApi.toggleDevicePower(deviceId, checked, serialNumber);
                    console.log("✅ Power status API update successful:", response);
                } catch (apiError) {
                    console.error("❌ Power status API update failed:", apiError);
                    // Revert state on error
                    setCurrentValues(prev => ({
                        ...prev,
                        power_status: !checked
                    }));
                }
            }, 100);

        } catch (error) {
            console.error("❌ Error in handlePowerToggle:", error);
            // Revert state on error
            setCurrentValues(prev => ({
                ...prev,
                power_status: !checked
            }));
        }
    }, [device, currentValues, setCurrentValues]);

    // Security update handler
    const handleSecurityUpdate = useCallback(async (action, data) => {
        try {
            const deviceId = getDeviceId();
            console.log(`🔒 Security update: ${action}`, data);
            
            // Update local device state if needed
            if (data.lock_status) {
                // Could update parent component state here if needed
                console.log(`Device ${deviceId} lock status updated to: ${data.lock_status}`);
            }
            
            console.log(`✅ Security ${action} completed`);
            return { success: true };
        } catch (error) {
            console.error(`❌ Security ${action} failed:`, error);
            throw error;
        }
    }, [device]);

    // Door control handlers
    const handleDoorToggle = useCallback(async (open) => {
        try {
            console.log(`🚪 Door toggle request: ${open ? 'OPEN' : 'CLOSE'}`);
            
            // Sử dụng Door API riêng biệt
            const response = await deviceApi.toggleDoor(device.serial_number, open);
            
            // Update local state với kết quả từ API
            setCurrentValues(prev => ({
                ...prev,
                door_status: open ? 'open' : 'closed'
            }));
            
            console.log(`✅ Door ${open ? 'opened' : 'closed'} successfully:`, response);
            return response;
        } catch (error) {
            console.error('❌ Failed to control door:', error);
            // Revert state on error
            setCurrentValues(prev => ({
                ...prev,
                door_status: !open ? 'open' : 'closed'
            }));
            throw error;
        }
    }, [device?.serial_number, setCurrentValues]);

    const handleDoorLock = useCallback(async (locked) => {
        try {
            console.log(`🔒 Door lock request: ${locked ? 'LOCK' : 'UNLOCK'}`);
            
            // Sử dụng device lock API có sẵn
            const deviceId = getDeviceId();
            if (locked) {
                await deviceApi.lockDevice(deviceId, device.serial_number);
            } else {
                await deviceApi.unlockDevice(deviceId, device.serial_number);
            }
            
            // Update local state
            setCurrentValues(prev => ({
                ...prev,
                lock_status: locked
            }));
            
            console.log(`✅ Door ${locked ? 'locked' : 'unlocked'} successfully`);
            return { success: true };
        } catch (error) {
            console.error('❌ Failed to control door lock:', error);
            // Revert state on error
            setCurrentValues(prev => ({
                ...prev,
                lock_status: !locked
            }));
            throw error;
        }
    }, [device, setCurrentValues]);

    return {
        handleControlChange,
        handlePowerToggle,
        handleSecurityUpdate,
        handleDoorToggle,
        handleDoorLock,
        bulkUpdateControls
    };
}; 