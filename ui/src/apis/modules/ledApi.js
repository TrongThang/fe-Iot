import publicClient from '@/apis/clients/public.client';

/**
 * LED API Client - Chỉ xử lý actions, modes nhận từ socket
 */
class LEDApi {

    /**
     * Apply LED preset - sử dụng route backend
     * POST /:serialNumber/led-preset
     */
    async applyLEDPreset(serialNumber, preset, duration) {
        try {
            console.log(`🎨 Applying LED preset "${preset}" to device: ${serialNumber}`);
            const payload = {
                serial_number: serialNumber,
                preset,
                ...(duration && { duration })
            };
            
            const response = await publicClient.post(`/devices/${serialNumber}/led-preset`, payload);
            
            if (response.data?.success) {
                console.log(`✅ LED preset "${preset}" applied successfully`);
                return response.data;
            }
            
            throw new Error('Failed to apply LED preset');
        } catch (error) {
            console.error(`❌ Error applying LED preset "${preset}":`, error);
            throw error;
        }
    }

    /**
     * Set LED effect - sử dụng route backend  
     * POST /:serialNumber/led-effect
     */
    async setLEDEffect(serialNumber, effectParams) {
        try {
            console.log(`🎨 Setting LED effect for device: ${serialNumber}`, effectParams);
            const payload = {
                serial_number: serialNumber,
                ...effectParams
            };
            
            const response = await publicClient.post(`/devices/${serialNumber}/led-effect`, payload);
            
            if (response.data?.success) {
                console.log(`✅ LED effect applied successfully`);
                return response.data;
            }
            
            throw new Error('Failed to set LED effect');
        } catch (error) {
            console.error(`❌ Error setting LED effect:`, error);
            throw error;
        }
    }

    /**
     * Stop LED effect - sử dụng route backend
     * POST /:serialNumber/stop-led-effect  
     */
    async stopLEDEffect(serialNumber) {
        try {
            console.log(`⏹️ Stopping LED effect for device: ${serialNumber}`);
            const response = await publicClient.post(`/devices/${serialNumber}/stop-led-effect`, {});
            
            if (response.data?.success) {
                console.log(`✅ LED effect stopped successfully`);
                return response.data;
            }
            
            throw new Error('Failed to stop LED effect');
        } catch (error) {
            console.error(`❌ Error stopping LED effect:`, error);
            throw error;
        }
    }
}

// Export singleton instance
const ledApi = new LEDApi();
export default ledApi; 