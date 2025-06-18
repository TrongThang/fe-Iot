import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import axiosPublic from '@/apis/clients/public.client';
import { toast } from 'sonner';
// import axiosIOTPublic from '@/apis/clients/iot.private.client';
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [employee, setEmployee] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
    const [authInitialized, setAuthInitialized] = useState(false);

    const fetchUserInfo = async (token) => {
        try {
            // const response = await axiosPublic.get('auth/getme', {
            const response = await axios.get('http://localhost:7777/api/auth/getMe', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.success) {
                setUser(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching user info:', error);
        }
    };

    const fetchEmployeeInfo = async (token) => {
        try {
            const response = await axiosPublic.get('auth/getme-employee', {
                headers: {
                    Authorization: `BEARER ${token}`,
                },
            });

            if (response.status_code === 200) {
                console.log('response Employee', response)
                setEmployee(response.data);
            }
        } catch (error) {
            console.error('Error fetching employee info:', error);
        }
    }

    // Hàm khởi tạo authentication
    const initializeAuth = async () => {
        setLoading(true);

        try {
            // Kiểm tra user token
            const token = localStorage.getItem('authToken');
            if (token) {
                try {
                    const decoded = jwtDecode(token);
                    if (decoded.exp * 1000 > Date.now()) {
                        setIsAuthenticated(true);
                        await fetchUserInfo(token);
                    } else {
                        localStorage.removeItem('authToken');
                    }
                } catch (error) {
                    console.error('Error decoding user token:', error);
                    localStorage.removeItem('authToken');
                }
            }

            // Kiểm tra employee token
            const employeeToken = localStorage.getItem('employeeToken');
            if (employeeToken) {
                try {
                    const decoded = jwtDecode(employeeToken);
                    if (decoded.exp * 1000 > Date.now()) {
                        setIsAdminAuthenticated(true);
                        await fetchEmployeeInfo(employeeToken);
                    } else {
                        localStorage.removeItem('employeeToken');
                    }
                } catch (error) {
                    console.error('Error decoding employee token:', error);
                    localStorage.removeItem('employeeToken');
                }
            }
        } catch (error) {
            console.error('Error initializing auth:', error);
        } finally {
            setLoading(false);
            setAuthInitialized(true); // Đánh dấu đã khởi tạo xong
        }
    };

    useEffect(() => {
        initializeAuth();
    }, []);

    const login = async (username, password) => {
        try {
            const response = await axiosPublic.post('auth/login', {
                username,
                password
            });

            if (response.status === 200) {
                console.log('THành công')
                const token = response.accessToken;
                localStorage.setItem('authToken', token);

                const decoded = jwtDecode(token);

                setUser(decoded);
                setIsAuthenticated(true);
                return { success: true };
            } else {
                console.log('Thất bại')
                return {
                    success: false,
                    message: response?.message || response?.errors[0]?.message || 'Đăng nhập thất bại'
                };
            }
        } catch (error) {
            console.error('Login error:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Có lỗi xảy ra khi đăng nhập'
            };
        }
    };

    const loginEmployee = async (username, password) => {
        try {
            const response = await axiosPublic.post('auth/login-employee', {
                username,
                password,
            });
            if (response.data.accessToken) {
                const token = response.data.accessToken;
                localStorage.setItem('employeeToken', token);

                setIsAdminAuthenticated(true);
                fetchEmployeeInfo(token);
                return { success: true };
            } else {
                return {
                    success: false,
                    message: response.data?.message || response.data?.errors[0]?.message || 'Đăng nhập thất bại'
                };
            }
        } catch (error) {
            console.error('Login error:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Có lỗi xảy ra khi đăng nhập'
            };
        }
    };
    const register = async (userData) => {
        try {
            const response = await axiosPublic("auth/register", userData);

            if (response.data.errorCode === 0) {
                return { success: true };
            } else {
                return {
                    success: false,
                    message: response.data.message || 'Đăng ký thất bại'
                };
            }
        } catch (error) {
            console.error('Register error:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Có lỗi xảy ra khi đăng ký'
            };
        }
    };

    const logout = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const deviceMap = JSON.parse(localStorage.getItem("deviceMap") || "{}");
            const deviceUuid = user?.username ? deviceMap[user?.username] : null;
    
            const response = await axios.post("http://localhost:7777/api/auth/logout", {
                userDeviceId: deviceUuid
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            });
    
            if (response.data.success) {
                localStorage.removeItem('authToken');
    
                // Xóa deviceUuid của user hiện tại khỏi deviceMap
                // if (user?.username && deviceMap[user.username]) {
                //     delete deviceMap[user.username];
                //     localStorage.setItem("deviceMap", JSON.stringify(deviceMap));
                // }
    
                const refreshToken = localStorage.getItem('refreshToken');
                if (refreshToken) localStorage.removeItem('refreshToken');
    
                setUser(null);
                setIsAuthenticated(false);
    
                return response.data;
            }
        } catch (error) {
            console.error('Logout error:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Có lỗi xảy ra khi đăng xuất'
            };
        }
    };
    

    const sendOtp = async (email) => {
        try {
            const response = await axios.post('http://localhost:7777/api/notifications/otp', { email });

            console.log("res",response)
            if (response.data.success) {
                return response.data;
            } else {
                return {
                    success: false,
                    message: response.data.message || 'Gửi OTP thất bại'
                };
            }
        } catch (error) {
            console.error('Send OTP error:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Có lỗi xảy ra khi gửi OTP'
            };
        }
    };

    const verifyOtp = async (email, otp) => {
        try {
            // const response = await axiosPublic.post('auth/verify-otp', { email, otp });
            const response = await axios.post('http://localhost:7777/api/notifications/otp/verify', { email, otp });
            if (response.data.success) {
                return { success: true };
            } else {
                return {
                    success: false,
                    message: response.data.message || 'Xác thực OTP thất bại'
                };
            }
        } catch (error) {
            console.error('Verify OTP error:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Có lỗi xảy ra khi xác thực OTP'
            };
        }
    };

    const verifyEmail = async (email) => {
        try {
            const response = await axios.post('http://localhost:7777/api/auth/verify-email', { email });
            if (response.data.success) {
                return { success: true };
            } else {
                return {
                    success: false,
                    message: response.data.message || 'Xác thực OTP thất bại'
                };
            }
        } catch (error) {
            console.error('Verify OTP error:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Có lỗi xảy ra khi xác thực OTP'
            };
        }
    };

    const isTokenExpiringSoon = (token) => {
        const decoded = jwtDecode(token);
        const now = Date.now() / 1000;
        return decoded.exp - now < 60;
    }

    const refreshAccessToken = async () => {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) return;
    
        try {
            const response = await axios.post('http://localhost:7777/api/auth/refresh', {
                refreshToken,
            });
    
            const { accessToken } = response.data;
            localStorage.setItem('authToken', accessToken);
    
            const decoded = jwtDecode(accessToken);
            setUser(decoded);
            setIsAuthenticated(true);
    
            return accessToken;
        } catch (err) {
            console.error("Refresh token failed", err);
            setIsAuthenticated(false);
            setUser(null);
            localStorage.removeItem("authToken");
            localStorage.removeItem("refreshToken");
            toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        }
    };

    // const changePassword = async (email, newPassword, confirmPassword) => {
    //     if (newPassword !== confirmPassword) {
    //         return {
    //             success: false,
    //             message: 'Mật khẩu mới và xác nhận mật khẩu không khớp'
    //         };
    //     }

    //     try {
    //         // const response = await axiosIOTPublic.patch('auth/account/changed-password', { email, newPassword, confirmPassword });
    //         if (response.data.status_code === 200) {
    //             return { success: true };
    //         } else {
    //             return {
    //                 success: false,
    //                 message: response.data.message || 'Đổi mật khẩu thất bại'
    //             };
    //         }
    //     } catch (error) {
    //         console.error('Change password error:', error);
    //         return {
    //             success: false,
    //             message: error.response?.data?.message || 'Có lỗi xảy ra khi đổi mật khẩu'
    //         };
    //     }
    // };

    const verifyOtpForChangeEmail = async (email, otp) => {
        try {
            const response = await axiosPublic.post('auth/verify-otp-change-email', { account_id: user.account_id, email, otp });
            if (response.status_code === 200 || response.success) {
                return { success: true };
            } else {
                return {
                    success: false,
                    message: response.data.message || 'Xác thực OTP thất bại'
                };
            }
        } catch (error) {
            console.error('Verify OTP for change email error:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Có lỗi xảy ra khi xác thực OTP'
            };
        }
    }


    const recoveryPassword = async (email, newPassword) => {
        try {
            const response = await axios.post('http://localhost:7777/api/auth/recovery-password', { email, newPassword });
            if (response.data.success) {
                return { success: true };
            } else {
                return {
                    success: false,
                    message: response.data.message || 'Đổi mật khẩu thất bại'
                };
            }
        } catch (error) {
            console.error('Recovery password error:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Có lỗi xảy ra khi xác thực OTP'
            };
        }
    };

    const changePassword = async (currentPassword, newPassword) => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.post('http://localhost:7777/api/auth/change-password', { currentPassword, newPassword },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    }
                }
            );
            if (response.data.success) {
                return { success: true };
            } else {
                return {
                    success: false,
                    message: response.data.message || 'Đổi mật khẩu thất bại'
                };
            }
        } catch (error) {
            console.error('Recovery password error:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Có lỗi xảy ra khi xác thực OTP'
            };
        }
    };

    const value = {
        user,
        employee,
        isAuthenticated,
        isAdminAuthenticated,
        loading,
        login,
        loginEmployee,
        register,
        logout,
        sendOtp,
        verifyOtp,
        verifyEmail,
        recoveryPassword,
        changePassword,
        setUser,
        setIsAuthenticated,
        fetchUserInfo,
        isTokenExpiringSoon,
        refreshAccessToken,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};