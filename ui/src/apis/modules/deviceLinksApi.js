import privateClient from '../clients/private.client';

const deviceLinksApi = {
    /**
     * Tạo liên kết mới giữa các thiết bị
     * @param {Object} linkData - Dữ liệu liên kết
     * @param {string} linkData.input_device_id - ID thiết bị input
     * @param {string} linkData.output_device_id - ID thiết bị output  
     * @param {string} linkData.component_id - ID component
     * @param {string} linkData.value_active - Điều kiện kích hoạt
     * @param {string} linkData.logic_operator - Toán tử logic (AND/OR)
     * @param {string} linkData.output_action - Hành động output (turn_on/turn_off)
     * @param {string} linkData.output_value - Giá trị output (độ sáng, chế độ cảnh báo)
     * @returns {Promise}
     */
    createDeviceLink: async (linkData) => {
        try {
            const response = await privateClient.post('/device-links', linkData);
            return response.data;
        } catch (error) {
            console.error('Error creating device link:', error);
            throw error;
        }
    },

    /**
     * Lấy tất cả device links của user hiện tại
     * @returns {Promise}
     */
    getDeviceLinks: async () => {
        try {
            const response = await privateClient.get('/device-links');
            return response.data;
        } catch (error) {
            console.error('Error fetching device links:', error);
            throw error;
        }
    },

    /**
     * Lấy device links theo output device
     * @param {string} outputDeviceId - ID thiết bị output
     * @returns {Promise}
     */
    getLinksByOutputDevice: async (outputDeviceId) => {
        try {
            const response = await privateClient.get(`/device-links/output/${outputDeviceId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching links by output device:', error);
            throw error;
        }
    },

    /**
     * Cập nhật device link
     * @param {number} linkId - ID liên kết
     * @param {Object} updateData - Dữ liệu cập nhật
     * @param {string} updateData.value_active - Điều kiện kích hoạt mới
     * @param {string} updateData.logic_operator - Toán tử logic mới
     * @param {string} updateData.component_id - ID component mới
     * @param {string} updateData.output_action - Hành động output mới
     * @param {string} updateData.output_value - Giá trị output mới
     * @returns {Promise}
     */
    updateDeviceLink: async (linkId, updateData) => {
        try {
            // Sửa method PUT thành PATCH cho đúng chuẩn BE
            const response = await privateClient.patch(`/device-links/${linkId}`, updateData);
            return response.data;
        } catch (error) {
            console.error('Error updating device link:', error);
            throw error;
        }
    },

    /**
     * Xóa device link
     * @param {number} linkId - ID liên kết
     * @returns {Promise}
     */
    deleteDeviceLink: async (linkId) => {
        try {
            const response = await privateClient.delete(`/device-links/${linkId}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting device link:', error);
            throw error;
        }
    },

    /**
     * Test device link trigger
     * @param {number} linkId - ID liên kết
     * @returns {Promise}
     */
    testDeviceLink: async (linkId) => {
        try {
            const response = await privateClient.post(`/device-links/${linkId}/test`);
            return response.data;
        } catch (error) {
            console.error('Error testing device link:', error);
            throw error;
        }
    },

    /**
     * Lấy predefined output values
     * @returns {Promise}
     */
    getPredefinedOutputValues: async () => {
        try {
            // Sửa endpoint cho đúng chuẩn BE
            const response = await privateClient.get('/device-links/predefined-output-values');
            return response.data;
        } catch (error) {
            console.error('Error fetching predefined output values:', error);
            throw error;
        }
    }
};

export default deviceLinksApi; 