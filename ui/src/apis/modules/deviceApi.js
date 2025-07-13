// import privateClient from './clients/private.client';
import publicClient from '../clients/public.client';

// 📝 Endpoints based on your Postman collection
const deviceEndpoints = {
    capabilities: (serialNumber) => `devices/${serialNumber}/capabilities`,
    bulkUpdate: (serialNumber) => `devices/${serialNumber}/state/bulk`,     // POST - for bulk updates
    toggle: (serialNumber) => `devices/${serialNumber}/toggle`,            // PUT - for power toggle
    deviceDetail: (serialNumber) => `devices/${serialNumber}`,
    deviceList: 'devices/account',
    deviceListWithComponents: 'devices/account/with-components',            // GET - get devices with components
    searchUser: 'customer-search',                                  // GET - search users for sharing
    createTicket: 'tickets',                                        // POST - create share permission ticket
    getSharedUsers: (serialNumber) => `permissions/get-shared-users/${serialNumber}`,
    lockDevice: (deviceId, serialNumber) => `customer-search/devices/${deviceId}/${serialNumber}/lock`,    // PUT - lock device
    unlockDevice: (deviceId, serialNumber) => `customer-search/devices/${deviceId}/${serialNumber}/unlock`, // PUT - unlock device
    
    // Door control endpoints (dựa theo IoT_HomeConnect_API_v2)
    toggleDoor: (serialNumber) => `doors/${serialNumber}/toggle`,                                            // POST - toggle door open/close
    getDoorStatus: (serialNumber) => `doors/${serialNumber}/status`,                                         // GET - get door status
    
    // Current value endpoints
    updateCurrentValue: (serialNumber) => `devices/${serialNumber}/current-value`,                          // PUT - update device current_value
    
    // Components endpoints
    getDeviceComponents: (deviceId) => `devices/${deviceId}/components`,                                     // GET - get device components
};

export const deviceApi = {
    // Lấy capabilities của device
    getDeviceCapabilities: async (deviceId, serialNumber) => {
        try {
            console.log('API Call: getDeviceCapabilities with deviceId:', deviceId);
            const response = await publicClient.post(deviceEndpoints.capabilities(deviceId), {
                serial_number: serialNumber
            });
            console.log('API Response - getDeviceCapabilities:', response);
            return response;
        } catch (error) {
            console.error('Error in getDeviceCapabilities:', error);
            throw error;
        }
    },

    // Cập nhật control của device (bulk update)
    updateDeviceControl: async (serialNumber, controlData, deviceId = null) => {
        try {
            // Format data for bulk update API
            const bulkData = {
                serial_number: serialNumber,
                updates: [controlData] // Convert single control to array format
            };
            
            const response = await publicClient.post(deviceEndpoints.bulkUpdate(serialNumber), bulkData);
            console.log('API Response - updateDeviceControl:', response);
            return response;
        } catch (error) {
            console.error('Error in updateDeviceControl:', error);
            throw error;
        }
    },

    // Bulk update nhiều controls cùng lúc
    bulkUpdateDeviceControls: async (serialNumber, controlsArray) => {
        try {
            
            const bulkData = {
                serial_number: serialNumber,
                updates: controlsArray
            };
            
            const response = await publicClient.post(deviceEndpoints.bulkUpdate(serialNumber), bulkData);
            return response;
        } catch (error) {
            console.error('Error in bulkUpdateDeviceControls:', error);
            throw error;
        }
    },

    // Lấy chi tiết device
    getDeviceDetail: async (deviceId) => {
        try {
            console.log('API Call: getDeviceDetail with deviceId:', deviceId);
            const response = await publicClient.get(deviceEndpoints.deviceDetail(deviceId));
            console.log('API Response - getDeviceDetail:', response);
            return response;
        } catch (error) {
            console.error('Error in getDeviceDetail:', error);
            throw error;
        }
    },

    // Lấy danh sách devices
    getDeviceList: async (params = {}) => {
        try {
            console.log('API Call: getDeviceList with params:', params);
            const response = await publicClient.get(deviceEndpoints.deviceList, { params });
            console.log('API Response - getDeviceList:', response);
            return response;
        } catch (error) {
            console.error('Error in getDeviceList:', error);
            throw error;
        }
    },

    // Lấy danh sách devices kèm components
    getDevicesWithComponents: async (params = {}) => {
        try {
            console.log('API Call: getDevicesWithComponents with params:', params);
            const response = await publicClient.get(deviceEndpoints.deviceListWithComponents, { params });
            console.log('API Response - getDevicesWithComponents:', response);
            return response;
        } catch (error) {
            console.error('Error in getDevicesWithComponents:', error);
            throw error;
        }
    },

    // Toggle device power status
    toggleDevicePower: async (deviceId, powerStatus, serialNumber) => {
        try {
            console.log('API Call: toggleDevicePower with deviceId:', deviceId, 'powerStatus:', powerStatus);
            
            // Format data for toggle API
            const toggleData = {
                power_status: powerStatus,
                serial_number: serialNumber
            };
            
            const response = await publicClient.put(deviceEndpoints.toggle(deviceId), toggleData);
            
            return response;
        } catch (error) {
            console.error('Error in toggleDevicePower:', error);
            throw error;
        }
    },

    getSharedUsers: async (serialNumber) => {
        const response = await publicClient.get(deviceEndpoints.getSharedUsers(serialNumber));
        return response;
    },

    // Search users for device sharing
    searchUser: async (searchParams) => {
        try {
            console.log('API Call: searchUser with params:', searchParams);
            const response = await publicClient.get(deviceEndpoints.searchUser, { params: searchParams });
            console.log('API Response - searchUser:', response);
            return response;
        } catch (error) {
            console.error('Error in searchUser:', error);
            throw error;
        }
    },

    // Create share permission ticket  
    createSharePermissionTicket: async (ticketData) => {
        try {
            console.log('API Call: createSharePermissionTicket with data:', ticketData);
            const response = await publicClient.post(deviceEndpoints.createTicket, ticketData);
            console.log('API Response - createSharePermissionTicket:', response);
            return response;
        } catch (error) {
            console.error('Error in createSharePermissionTicket:', error);
            throw error;
        }
    },

    // Lock device
    lockDevice: async (deviceId, serialNumber) => {
        try {
            console.log('API Call: lockDevice with deviceId:', deviceId, 'serialNumber:', serialNumber);
            const response = await publicClient.put(deviceEndpoints.lockDevice(deviceId, serialNumber));
            console.log('API Response - lockDevice:', response);
            return response;
        } catch (error) {
            console.error('Error in lockDevice:', error);
            throw error;
        }
    },

    // Unlock device
    unlockDevice: async (deviceId, serialNumber) => {
        try {
            console.log('API Call: unlockDevice with deviceId:', deviceId, 'serialNumber:', serialNumber);
            const response = await publicClient.put(deviceEndpoints.unlockDevice(deviceId, serialNumber));
            console.log('API Response - unlockDevice:', response);
            return response;
        } catch (error) {
            console.error('Error in unlockDevice:', error);
            throw error;
        }
    },

    // Door control APIs (dựa theo IoT_HomeConnect_API_v2)
    
    // Toggle door open/close
    toggleDoor: async (serialNumber, power_status = true, force = false, timeout = 5000) => {
        try {
            console.log('API Call: toggleDoor with serialNumber:', serialNumber, 'power_status:', power_status);
            
            const doorData = {
                power_status,
                force,
                timeout
            };
            
            const response = await publicClient.post(deviceEndpoints.toggleDoor(serialNumber), doorData);
            console.log('API Response - toggleDoor:', response);
            return response;
        } catch (error) {
            console.error('Error in toggleDoor:', error);
            throw error;
        }
    },

    // Get door status
    getDoorStatus: async (serialNumber) => {
        try {
            console.log('API Call: getDoorStatus with serialNumber:', serialNumber);
            const response = await publicClient.get(deviceEndpoints.getDoorStatus(serialNumber));
            console.log('API Response - getDoorStatus:', response);
            return response;
        } catch (error) {
            console.error('Error in getDoorStatus:', error);
            throw error;
        }
    },

    // Update device current_value
    updateDeviceCurrentValue: async (serialNumber, currentValue) => {
        try {
            console.log('API Call: updateDeviceCurrentValue with serialNumber:', serialNumber, 'currentValue:', currentValue);
            
            const updateData = {
                current_value: currentValue
            };
            
            const response = await publicClient.put(deviceEndpoints.updateCurrentValue(serialNumber), updateData);
            console.log('API Response - updateDeviceCurrentValue:', response);
            return response;
        } catch (error) {
            console.error('Error in updateDeviceCurrentValue:', error);
            throw error;
        }
    },

    // Get device components
    getDeviceComponents: async (deviceId) => {
        try {
            console.log('API Call: getDeviceComponents with deviceId:', deviceId);
            const response = await publicClient.get(deviceEndpoints.getDeviceComponents(deviceId));
            console.log('API Response - getDeviceComponents:', response);
            return response;
        } catch (error) {
            console.error('Error in getDeviceComponents:', error);
            throw error;
        }
    }
};

export default deviceApi; 