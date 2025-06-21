import axios from 'axios'

const authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbXBsb3llZUlkIjoiYWRtaW4iLCJ1c2VybmFtZSI6ImFkbWluIiwicm9sZSI6MSwiaWF0IjoxNzUwMzAwMjY3LCJleHAiOjE3NTAzMjkwNjd9.iPCsl6cd2P__z4mWFX3vgr5dNI2vKhzjL-y-0tjry7g"

const axiosPublic = axios.create({
    baseURL: process.env.SMART_NET_API_URL || "http://localhost:7777/api/", // Địa chỉ API public
    headers: {
        // 'ngrok-skip-browser-warning': 'true',
        'Accept': 'application/json',
        'Content-Type': 'application/json; charset=UTF-8',
        'X-Requested-With': 'XMLHttpRequest',
        // 'Authorization': `Bearer ${localStorage.getItem("authToken")}`,
        'Authorization': `Bearer ${authToken}`,
    },
    // Cho phép xử lý các status code từ 200-499
    validateStatus: function (status) {
        return status >= 200 && status < 500;
    }
})

axiosPublic.interceptors.request.use(
    (config) => {
        // Log thông tin request
        console.log('🚀 Sending Request:', {
            method: config.method.toUpperCase(),
            url: config.url,
            params: config.params,
        });

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Thêm interceptor nếu cần (tùy chọn)
axiosPublic.interceptors.response.use(
    (response) => response.data, // Xử lý khi thành công
    (error) => {
        if (error.response) {
            // Lỗi từ server, có mã status
            console.error(`API error: ${error.response.status}`, error.response.data);
            return Promise.reject(error.response.data)

        } else if (error.request) {
            // Lỗi do không nhận được phản hồi
            console.error("No response received:", error.request);
            return Promise.reject(error.request)

        } else {
            // Lỗi trong quá trình cấu hình request
            console.error("Error in request setup:", error.message);
            return Promise.reject(error.message)
        }
    }
)



export default axiosPublic