import { useState, useEffect } from 'react';
import deviceApi from '@/apis/modules/deviceApi';
import { createFallbackCapabilities } from '../constants/deviceConstants';
import { deviceValueHelpers } from '../utils/deviceUtils';

export const useDeviceCapabilities = (device) => {
    const [capabilities, setCapabilities] = useState(null);
    const [currentValues, setCurrentValues] = useState({});
    const [loading, setLoading] = useState(true);

    // Helper function to get device ID with fallback
    const getDeviceId = () => deviceValueHelpers.getDeviceId(device);

    const fetchDoorStatus = async () => {
        try {
            console.log("🚪 Fetching door status for serial:", device.serial_number);
            const response = await deviceApi.getDoorStatus(device.serial_number);
            
            if (response && response.door_state) {
                console.log("✅ Door status fetched:", response.door_state);
                setCurrentValues(prev => ({
                    ...prev,
                    door_status: response.door_state.door_state || 'closed',
                    is_moving: response.door_state.is_moving || false,
                    servo_angle: response.door_state.servo_angle || 0
                }));
            }
        } catch (error) {
            console.error("❌ Error fetching door status:", error);
            // Không throw error, chỉ log để không làm crash app
        }
    };

    const fetchDeviceCapabilities = async () => {
        try {
            const deviceId = getDeviceId();
            console.log("🔄 Starting fetchDeviceCapabilities for device:", deviceId);
            setLoading(true);
            
            const response = await deviceApi.getDeviceCapabilities(deviceId, device.serial_number);
            console.log("✅ API Response received:", response);
            
            if (response && response.capabilities && response.capabilities.merged_capabilities) {
                console.log("📋 Using API capabilities:", response.capabilities.merged_capabilities);
                setCapabilities(response.capabilities.merged_capabilities);
            } else {
                console.log("⚠️ No API capabilities found, using fallback for device type:", device.type);
                // Fallback: tạo capabilities mặc định dựa vào device type
                const fallbackCapabilities = createFallbackCapabilities(device);
                console.log("🔧 Fallback capabilities:", fallbackCapabilities);
                setCapabilities(fallbackCapabilities);
            }

            // Initialize current values from device data
            const initialValues = deviceValueHelpers.initializeDeviceValues(device);
            setCurrentValues(initialValues);
            
        } catch (error) {
            console.error("❌ Error fetching capabilities:", error);
            console.log("🔧 Using fallback capabilities due to API error");
            // Tạo capabilities fallback khi có lỗi API
            const fallbackCapabilities = createFallbackCapabilities(device);
            setCapabilities(fallbackCapabilities);
            
            console.log("🔄 Initializing current values from device data");
            const initialValues = deviceValueHelpers.initializeDeviceValues(device);
            setCurrentValues(initialValues);
        } finally {
            console.log("✅ fetchDeviceCapabilities completed");
            setLoading(false);
        }
    };

    useEffect(() => {
        console.log("useDeviceCapabilities useEffect triggered. Device:", device);
        const deviceId = getDeviceId();
        if (device && deviceId) {
            console.log("Device ID found:", deviceId, "- Starting to fetch capabilities");
            
            fetchDeviceCapabilities();
            
            // Fetch door status nếu là door device
            const deviceType = device?.type?.toLowerCase() || device?.template_type?.toLowerCase();
            if (deviceType === 'door' && device.serial_number) {
                fetchDoorStatus();
            }
        } else {
            console.warn("Device missing device_id/id. Device object:", device);
        }
    }, [device]);

    return {
        capabilities,
        currentValues,
        loading,
        setCurrentValues,
        refetchCapabilities: fetchDeviceCapabilities,
        getDeviceId
    };
}; 