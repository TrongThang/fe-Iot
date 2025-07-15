import React, { useState, useEffect, useRef } from 'react';
import {
    Thermometer,
    Zap,
    Wind,
    Droplets,
    Flame,
    Activity,
    AlertTriangle,
    CheckCircle,
    XCircle,
    TrendingUp,
    TrendingDown
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useSocketContext } from '@/contexts/SocketContext';
import { useAuth } from '@/contexts/AuthContext';
import socketService from '@/lib/socket';

const RealtimeSensorDisplay = ({ deviceSerial, deviceName }) => {
    const { user } = useSocketContext(); // Removed isConnected (global socket disabled)
    const { isAuthenticated } = useAuth();
    const [sensorData, setSensorData] = useState({
        temperature: null,
        gas: null,
        smoke_level: null,
        humidity: null,
        flame_detected: null,
        battery_level: null,
        lastUpdate: null
    });
    const [alerts, setAlerts] = useState({ gas: null, air: null, temperature: null, fire: null });
    const [isRealtimeConnected, setIsRealtimeConnected] = useState(false);
    const [dataHistory, setDataHistory] = useState({
        temperature: [],
        gas: [],
        smoke_level: []
    });
    const maxHistoryPoints = 20;

    // Debug: Log current sensor data whenever it changes
    useEffect(() => {
        console.log('🔍 Current sensor data state:', sensorData);
    }, [sensorData]);

    useEffect(() => {
        console.log('🔄 RealtimeSensorDisplay useEffect called with:', {
            isAuthenticated,
            deviceSerial,
            hasUser: !!user,
            userId: user?.id,
            accountId: user?.account_id
        });

        // Early return if not authenticated or missing required data
        if (!isAuthenticated || !deviceSerial || !user) {
            console.log('🚫 Skipping real-time setup:', {
                isAuthenticated,
                hasDeviceSerial: !!deviceSerial,
                hasUser: !!user
            });
            return;
        }

        console.log(`🔌 Setting up real-time monitoring for device: ${deviceSerial}`);

        // Connect to device using socketService với account_id (theo IoT API)
        const accountId = user.account_id || user.id;
        console.log(`👤 Using account ID: ${accountId} for device: ${deviceSerial}`);

        const connectDevice = async () => {
            try {
                console.log(`🔌 Attempting to connect to device: ${deviceSerial} with account: ${accountId}`);
                const success = await socketService.connectToDevice(deviceSerial, accountId);
                console.log('🔌 Device connection result:', success);
                setIsRealtimeConnected(success);
                
                if (success) {
                    console.log(`✅ Successfully connected to device ${deviceSerial}, setting up listeners...`);
                } else {
                    console.log(`❌ Failed to connect to device ${deviceSerial}`);
                }
            } catch (error) {
                console.error('❌ Failed to connect to device:', error);
                setIsRealtimeConnected(false);
            }
        };

        connectDevice();

        // Listen for real-time sensor data - theo IoT API structure
        const handleSensorData = (data) => {
            console.log('📊 Real-time sensor data received:', data);
            console.log('📊 Data type:', typeof data);
            console.log('📊 Data keys:', Object.keys(data));

            // IoT API sends data in different formats
            let newData = {};

            // Check if data has the expected sensor fields directly
            if (data.serialNumber && (data.gas !== undefined || data.temperature !== undefined || data.humidity !== undefined)) {
                // Direct IoT API format: {serialNumber, gas, temperature, humidity, flame_detected, smoke_level, timestamp}
                console.log('✅ Using direct IoT API format');
                newData = data;
            } else if (data.data && data.data.val) {
                // ESP8266 format
                console.log('✅ Using ESP8266 format');
                newData = data.data.val;
            } else if (data.temperature !== undefined || data.gas !== undefined) {
                // Direct sensor data without serialNumber
                console.log('✅ Using direct sensor data format');
                newData = data;
            } else {
                console.log('⚠️ Unknown sensor data format:', data);
                console.log('⚠️ Available fields:', Object.keys(data));
                return;
            }

            setSensorData(prev => {
                const updatedSensorData = {
                    ...prev,
                    temperature: newData.temperature !== undefined ? newData.temperature : prev.temperature,
                    gas: newData.gas !== undefined ? newData.gas : (newData.gasValue !== undefined ? newData.gasValue : prev.gas),
                    humidity: newData.humidity !== undefined ? newData.humidity : (newData.hum !== undefined ? newData.hum : prev.humidity),
                    smoke_level: newData.smoke_level !== undefined ? newData.smoke_level : prev.smoke_level,
                    flame_detected: newData.flame_detected !== undefined ? newData.flame_detected : prev.flame_detected,
                    battery_level: newData.battery_level !== undefined ? newData.battery_level : prev.battery_level,
                    lastUpdate: new Date().toISOString()
                };

                console.log('🔄 Updating sensor data:', updatedSensorData);
                console.log('🔄 Previous data:', prev);

                return updatedSensorData;
            });

            // Update history for charts
            setDataHistory(prev => {
                const newHistory = { ...prev };

                if (newData.temperature !== undefined) {
                    newHistory.temperature = [...prev.temperature, {
                        value: newData.temperature,
                        timestamp: Date.now()
                    }].slice(-maxHistoryPoints);
                }

                const gasValue = newData.gas !== undefined ? newData.gas : newData.gasValue;
                if (gasValue !== undefined) {
                    newHistory.gas = [...prev.gas, {
                        value: gasValue,
                        timestamp: Date.now()
                    }].slice(-maxHistoryPoints);
                }

                if (newData.smoke_level !== undefined) {
                    newHistory.smoke_level = [...prev.smoke_level, {
                        value: newData.smoke_level,
                        timestamp: Date.now()
                    }].slice(-maxHistoryPoints);
                }

                return newHistory;
            });

            // Check for alerts
            const finalGasValue = newData.gas !== undefined ? newData.gas : newData.gasValue;
            checkSensorAlerts({
                gas: finalGasValue,
                temperature: newData.temperature,
                smoke_level: newData.smoke_level,
                flame_detected: newData.flame_detected
            });
        };

        // Handle IoT API alarm alerts
        const handleAlarmAlert = (alertData) => {
            console.log('🚨 Alarm alert received from IoT API:', alertData);

            // IoT API alarm format: { serialNumber, alarmActive, temperature, gasValue, severity, alarm_type }
            if (alertData.serialNumber === deviceSerial && alertData.alarmActive) {
                // UPDATE SENSOR DATA from alert
                setSensorData(prev => ({
                    ...prev,
                    temperature: alertData.temperature !== undefined ? alertData.temperature : prev.temperature,
                    gas: alertData.gasValue !== undefined ? alertData.gasValue : (alertData.gas !== undefined ? alertData.gas : prev.gas),
                    humidity: alertData.humidity !== undefined ? alertData.humidity : prev.humidity,
                    smoke_level: alertData.smoke_level !== undefined ? alertData.smoke_level : prev.smoke_level,
                    flame_detected: alertData.flame_detected !== undefined ? alertData.flame_detected : prev.flame_detected,
                    lastUpdate: new Date().toISOString()
                }));

                const newAlert = {
                    id: Date.now(),
                    type: alertData.alarm_type || 'alarm',
                    severity: alertData.severity || 'critical',
                    message: getAlertMessage(alertData),
                    data: alertData,
                    timestamp: new Date().toISOString()
                };

                // Set alert
                setAlerts(prev => ({ ...prev, [alertData.alarm_type || 'alarm']: newAlert }));

                // Auto-dismiss after 30 seconds for non-critical alerts
                if (alertData.severity !== 'critical') {
                    setTimeout(() => {
                        setAlerts(prev => ({ ...prev, [alertData.alarm_type || 'alarm']: null }));
                    }, 30000);
                }
            }
        };

        const handleEmergencyAlert = (alertData) => {
            console.log('🚨 Emergency alert received:', alertData);

            if (alertData.serialNumber === deviceSerial || !alertData.serialNumber) {
                // UPDATE SENSOR DATA from emergency alert
                const alertSensorData = alertData.data || alertData;
                setSensorData(prev => ({
                    ...prev,
                    temperature: alertSensorData.temperature !== undefined ? alertSensorData.temperature : prev.temperature,
                    gas: alertSensorData.gasValue !== undefined ? alertSensorData.gasValue : 
                         (alertSensorData.gas !== undefined ? alertSensorData.gas : prev.gas),
                    humidity: alertSensorData.humidity !== undefined ? alertSensorData.humidity : prev.humidity,
                    smoke_level: alertSensorData.smoke_level !== undefined ? alertSensorData.smoke_level : prev.smoke_level,
                    flame_detected: alertSensorData.flame_detected !== undefined ? alertSensorData.flame_detected : 
                                  (alertData.type === 'fire' ? true : prev.flame_detected),
                    lastUpdate: new Date().toISOString()
                }));

                const newAlert = {
                    id: Date.now(),
                    type: alertData.type || 'emergency',
                    severity: alertData.severity || 'critical',
                    message: alertData.message || getAlertMessage(alertSensorData),
                    data: alertSensorData,
                    timestamp: new Date().toISOString()
                };

                // Set emergency alert
                setAlerts(prev => ({ ...prev, [alertData.type || 'emergency']: newAlert }));

                console.log('🚨 Emergency alert set:', newAlert);
                console.log('📊 Updated sensor data from emergency alert');
            }
        };

        const handleFireAlert = (alertData) => {
            console.log('🔥 Fire alert received:', alertData);
            handleEmergencyAlert({ ...alertData, type: 'fire', severity: 'critical' });
        };

        const handleSmokeAlert = (alertData) => {
            console.log('💨 Smoke alert received:', alertData);
            handleEmergencyAlert({ ...alertData, type: 'smoke', severity: 'danger' });
        };

        // Register event listeners - theo IoT API events
        // Listen for both global and device-specific events
        socketService.on('sensorData', handleSensorData);
        socketService.on('deviceStatus', handleSensorData);
        socketService.on('esp8266_status', handleSensorData);
        socketService.on('realtime_device_value', handleSensorData); // IoT API sends this event
        socketService.on(`device_sensor_data_${deviceSerial}`, handleSensorData);
        socketService.on(`device_status_${deviceSerial}`, handleSensorData);
        socketService.on(`esp8266_status_${deviceSerial}`, handleSensorData);
        socketService.on('alarmAlert', handleAlarmAlert);
        socketService.on('emergency_alert', handleEmergencyAlert);
        socketService.on('fire_alert', handleFireAlert);
        socketService.on('smoke_alert', handleSmokeAlert);

        console.log('✅ Event listeners registered for device:', deviceSerial);
        console.log('✅ Registered events:', [
            'sensorData',
            'deviceStatus',
            'esp8266_status',
            'realtime_device_value',
            `device_sensor_data_${deviceSerial}`,
            `device_status_${deviceSerial}`,
            `esp8266_status_${deviceSerial}`
        ]);

        // Connection status listeners
        socketService.on('realtime_started', (data) => {
            if (data.serialNumber === deviceSerial) {
                console.log('✅ Real-time monitoring started:', data);
                setIsRealtimeConnected(true);
            }
        });

        socketService.on('realtime_stopped', (data) => {
            if (data.serialNumber === deviceSerial) {
                console.log('⏹️ Real-time monitoring stopped:', data);
                setIsRealtimeConnected(false);
            }
        });

        // Cleanup on unmount
        return () => {
            console.log(`🔌 Cleaning up real-time monitoring for device: ${deviceSerial}`);

            socketService.disconnectFromDevice(deviceSerial);

            socketService.off('sensorData', handleSensorData);
            socketService.off('deviceStatus', handleSensorData);
            socketService.off('esp8266_status', handleSensorData);
            socketService.off('realtime_device_value', handleSensorData);
            socketService.off(`device_sensor_data_${deviceSerial}`, handleSensorData);
            socketService.off(`device_status_${deviceSerial}`, handleSensorData);
            socketService.off(`esp8266_status_${deviceSerial}`, handleSensorData);
            socketService.off('alarmAlert', handleAlarmAlert);
            socketService.off('emergency_alert', handleEmergencyAlert);
            socketService.off('fire_alert', handleFireAlert);
            socketService.off('smoke_alert', handleSmokeAlert);
            socketService.off('realtime_started');
            socketService.off('realtime_stopped');

            setIsRealtimeConnected(false);
        };
    }, [isAuthenticated, deviceSerial, user]);

    // Generate alert message based on IoT API data
    const getAlertMessage = (data) => {
        if (data.flame_detected) {
            return '🔥 PHÁT HIỆN LỬA! Gọi cứu hỏa 114 ngay!';
        }

        const gasValue = data.gasValue || data.gas;
        if (gasValue >= 1000) {
            return `🔥 KHẨN CẤP! Nồng độ khí gas cực kỳ nguy hiểm: ${gasValue} ppm`;
        } else if (gasValue >= 600) {
            return `⚠️ NGUY HIỂM! Nồng độ khí gas cao: ${gasValue} ppm`;
        } else if (gasValue >= 300) {
            return `⚠️ CẢNH BÁO! Phát hiện khí gas: ${gasValue} ppm`;
        }

        if (data.temperature >= 55) {
            return `🌡️ KHẨN CẤP! Nhiệt độ cực cao: ${data.temperature}°C`;
        } else if (data.temperature >= 45) {
            return `🌡️ NGUY HIỂM! Nhiệt độ quá cao: ${data.temperature}°C`;
        } else if (data.temperature >= 35) {
            return `🌡️ CẢNH BÁO! Nhiệt độ cao: ${data.temperature}°C`;
        }

        return 'Cảnh báo từ thiết bị cảm biến';
    };

    // Check for sensor alerts based on thresholds
    const checkSensorAlerts = (data) => {
        const newAlerts = { ...alerts };

        // Gas
        if (data.gas !== undefined) {
            if (data.gas >= 1000) {
                newAlerts.gas = {
                    severity: 'critical',
                    message: `🔥 KHẨN CẤP! Nồng độ khí gas cực kỳ nguy hiểm: ${data.gas} ppm`,
                    timestamp: new Date().toISOString()
                };
            } else if (data.gas >= 600) {
                newAlerts.gas = {
                    severity: 'danger',
                    message: `⚠️ NGUY HIỂM! Nồng độ khí gas cao: ${data.gas} ppm`,
                    timestamp: new Date().toISOString()
                };
            } else if (data.gas >= 300) {
                newAlerts.gas = {
                    severity: 'warning',
                    message: `⚠️ CẢNH BÁO! Phát hiện khí gas: ${data.gas} ppm`,
                    timestamp: new Date().toISOString()
                };
            } else {
                newAlerts.gas = null;
            }
        }

        // Chất lượng không khí (smoke_level)
        if (data.smoke_level !== undefined) {
            if (data.smoke_level >= 800) {
                newAlerts.air = {
                    severity: 'critical',
                    message: `💨 KHẨN CẤP! Chất lượng không khí rất xấu: ${data.smoke_level}`,
                    timestamp: new Date().toISOString()
                };
            } else if (data.smoke_level >= 500) {
                newAlerts.air = {
                    severity: 'danger',
                    message: `💨 NGUY HIỂM! Chất lượng không khí xấu: ${data.smoke_level}`,
                    timestamp: new Date().toISOString()
                };
            } else if (data.smoke_level >= 200) {
                newAlerts.air = {
                    severity: 'warning',
                    message: `💨 CẢNH BÁO! Chất lượng không khí kém: ${data.smoke_level}`,
                    timestamp: new Date().toISOString()
                };
            } else {
                newAlerts.air = null;
            }
        }

        // Temperature
        if (data.temperature !== undefined) {
            if (data.temperature >= 55) {
                newAlerts.temperature = {
                    severity: 'critical',
                    message: `🌡️ KHẨN CẤP! Nhiệt độ cực cao: ${data.temperature}°C`,
                    timestamp: new Date().toISOString()
                };
            } else if (data.temperature >= 45) {
                newAlerts.temperature = {
                    severity: 'danger',
                    message: `🌡️ NGUY HIỂM! Nhiệt độ quá cao: ${data.temperature}°C`,
                    timestamp: new Date().toISOString()
                };
            } else if (data.temperature >= 35) {
                newAlerts.temperature = {
                    severity: 'warning',
                    message: `🌡️ CẢNH BÁO! Nhiệt độ cao: ${data.temperature}°C`,
                    timestamp: new Date().toISOString()
                };
            } else {
                newAlerts.temperature = null;
            }
        }

        // Fire
        if (data.flame_detected === true) {
            newAlerts.fire = {
                severity: 'critical',
                message: `🔥 CHÁY LỚN! Phát hiện lửa! Gọi cứu hỏa 114 ngay!`,
                timestamp: new Date().toISOString()
            };
        } else {
            newAlerts.fire = null;
        }

        setAlerts(newAlerts);
    };

    // Get sensor status
    const getSensorStatus = (type, value) => {
        if (value === null || value === undefined) {
            return { status: 'unknown', color: 'gray', icon: XCircle };
        }

        switch (type) {
            case 'gas':
                if (value >= 1000) return { status: 'critical', color: 'red', icon: AlertTriangle };
                if (value >= 600) return { status: 'danger', color: 'orange', icon: AlertTriangle };
                if (value >= 300) return { status: 'warning', color: 'yellow', icon: AlertTriangle };
                return { status: 'safe', color: 'green', icon: CheckCircle };

            case 'temperature':
                if (value >= 55) return { status: 'critical', color: 'red', icon: AlertTriangle };
                if (value >= 45) return { status: 'danger', color: 'orange', icon: AlertTriangle };
                if (value >= 35) return { status: 'warning', color: 'yellow', icon: AlertTriangle };
                return { status: 'normal', color: 'green', icon: CheckCircle };

            case 'smoke':
                if (value >= 800) return { status: 'critical', color: 'red', icon: AlertTriangle };
                if (value >= 500) return { status: 'danger', color: 'orange', icon: AlertTriangle };
                if (value >= 200) return { status: 'warning', color: 'yellow', icon: AlertTriangle };
                return { status: 'clear', color: 'green', icon: CheckCircle };

            default:
                return { status: 'unknown', color: 'gray', icon: Activity };
        }
    };

    // Get trend direction
    const getTrend = (type) => {
        const history = dataHistory[type];
        if (history.length < 2) return null;

        const recent = history.slice(-3);
        const avg1 = recent.slice(0, Math.ceil(recent.length / 2)).reduce((sum, item) => sum + item.value, 0) / Math.ceil(recent.length / 2);
        const avg2 = recent.slice(Math.ceil(recent.length / 2)).reduce((sum, item) => sum + item.value, 0) / Math.floor(recent.length / 2);

        if (avg2 > avg1 + 1) return 'up';
        if (avg2 < avg1 - 1) return 'down';
        return 'stable';
    };

    return (
        <div className="space-y-4">
            {/* Connection Status */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="flex items-center text-lg">
                        <Activity className={`h-5 w-5 mr-2 ${isRealtimeConnected ? 'text-green-500' : 'text-red-500'}`} />
                        Giám sát Real-time: {deviceName || deviceSerial}
                    </CardTitle>
                    <Badge variant={isRealtimeConnected ? 'default' : 'destructive'} className="w-fit">
                        {isRealtimeConnected ? '🟢 Đang kết nối' : '🔴 Mất kết nối'}
                    </Badge>
                </CardHeader>
            </Card>

            {/* Active Alerts */}
            {Object.entries(alerts).map(([type, alert]) => alert && (
                <Alert key={type} className={`${alert.severity === 'critical' ? 'bg-red-100 border-red-500 text-red-800' : alert.severity === 'danger' ? 'bg-orange-100 border-orange-500 text-orange-800' : 'bg-yellow-100 border-yellow-500 text-yellow-800'} relative`}>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription className="font-medium pr-8">
                        {alert.message}
                        <div className="text-xs mt-1 opacity-80">
                            {new Date(alert.timestamp).toLocaleTimeString('vi-VN')}
                        </div>
                    </AlertDescription>
                    <button
                        onClick={() => setAlerts(a => ({ ...a, [type]: null }))}
                        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                    >
                        ×
                    </button>
                </Alert>
            ))}

            {/* Sensor Data Display */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Gas Sensor */}
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="flex items-center text-sm">
                            <Zap className="h-4 w-4 mr-2 text-orange-500" />
                            Khí Gas
                            {getTrend('gas') && (
                                getTrend('gas') === 'up' ?
                                    <TrendingUp className="h-3 w-3 ml-1 text-red-500" /> :
                                    getTrend('gas') === 'down' ?
                                        <TrendingDown className="h-3 w-3 ml-1 text-green-500" /> : null
                            )}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-2xl font-bold">
                                    {sensorData.gas !== null ? `${sensorData.gas}` : '--'}
                                </div>
                                <div className="text-xs text-gray-400 mt-1">
                                    Debug: {JSON.stringify(sensorData.gas)}
                                </div>
                                <div className="text-sm text-gray-500">ppm</div>
                            </div>
                            <div className="flex items-center">
                                {(() => {
                                    const status = getSensorStatus('gas', sensorData.gas);
                                    const Icon = status.icon;
                                    return <Icon className={`h-6 w-6 text-${status.color}-500`} />;
                                })()}
                            </div>
                        </div>
                        <Badge variant="outline" className="mt-2 text-xs">
                            {(() => {
                                const status = getSensorStatus('gas', sensorData.gas);
                                const statusText = {
                                    safe: '✅ An toàn',
                                    warning: '⚠️ Cảnh báo',
                                    danger: '🚨 Nguy hiểm',
                                    critical: '🔥 Cực nguy hiểm',
                                    unknown: '❓ Không xác định'
                                };
                                return statusText[status.status] || 'Không xác định';
                            })()}
                        </Badge>
                    </CardContent>
                </Card>

                {/* Temperature Sensor */}
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="flex items-center text-sm">
                            <Thermometer className="h-4 w-4 mr-2 text-red-500" />
                            Nhiệt độ
                            {getTrend('temperature') && (
                                getTrend('temperature') === 'up' ?
                                    <TrendingUp className="h-3 w-3 ml-1 text-red-500" /> :
                                    getTrend('temperature') === 'down' ?
                                        <TrendingDown className="h-3 w-3 ml-1 text-blue-500" /> : null
                            )}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-2xl font-bold">
                                    {sensorData.temperature !== null ? `${sensorData.temperature}` : '--'}
                                </div>
                                <div className="text-xs text-gray-400 mt-1">
                                    Debug: {JSON.stringify(sensorData.temperature)}
                                </div>
                                <div className="text-sm text-gray-500">°C</div>
                            </div>
                            <div className="flex items-center">
                                {(() => {
                                    const status = getSensorStatus('temperature', sensorData.temperature);
                                    const Icon = status.icon;
                                    return <Icon className={`h-6 w-6 text-${status.color}-500`} />;
                                })()}
                            </div>
                        </div>
                        <Badge variant="outline" className="mt-2 text-xs">
                            {(() => {
                                const status = getSensorStatus('temperature', sensorData.temperature);
                                const statusText = {
                                    normal: '✅ Bình thường',
                                    warning: '⚠️ Cao',
                                    danger: '🚨 Quá cao',
                                    critical: '🔥 Cực cao',
                                    unknown: '❓ Không xác định'
                                };
                                return statusText[status.status] || 'Không xác định';
                            })()}
                        </Badge>
                    </CardContent>
                </Card>

                {/* Smoke Sensor */}
                {sensorData.smoke_level !== null && (
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center text-sm">
                                <Wind className="h-4 w-4 mr-2 text-gray-500" />
                                Chất lượng không khí
                                {getTrend('smoke_level') && (
                                    getTrend('smoke_level') === 'up' ?
                                        <TrendingUp className="h-3 w-3 ml-1 text-red-500" /> :
                                        getTrend('smoke_level') === 'down' ?
                                            <TrendingDown className="h-3 w-3 ml-1 text-green-500" /> : null
                                )}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-2xl font-bold">
                                        {sensorData.smoke_level !== null ? `${sensorData.smoke_level}` : '--'}
                                    </div>
                                    <div className="text-sm text-gray-500">level</div>
                                </div>
                                <div className="flex items-center">
                                    {(() => {
                                        const status = getSensorStatus('smoke', sensorData.smoke_level);
                                        const Icon = status.icon;
                                        return <Icon className={`h-6 w-6 text-${status.color}-500`} />;
                                    })()}
                                </div>
                            </div>
                            <Badge variant="outline" className="mt-2 text-xs">
                                {(() => {
                                    const status = getSensorStatus('smoke', sensorData.smoke_level);
                                    const statusText = {
                                        clear: '✅ Tốt',
                                        warning: '⚠️ Kém',
                                        danger: '🚨 Xấu',
                                        critical: '🔥 Rất xấu',
                                        unknown: '❓ Không xác định'
                                    };
                                    return statusText[status.status] || 'Không xác định';
                                })()}
                            </Badge>
                        </CardContent>
                    </Card>
                )}

                {/* Humidity Sensor */}
                {sensorData.humidity !== null && (
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center text-sm">
                                <Droplets className="h-4 w-4 mr-2 text-blue-500" />
                                Độ ẩm
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-2xl font-bold">
                                        {sensorData.humidity !== null ? `${sensorData.humidity}` : '--'}
                                    </div>
                                    <div className="text-sm text-gray-500">%</div>
                                </div>
                                <div className="flex items-center">
                                    <CheckCircle className="h-6 w-6 text-blue-500" />
                                </div>
                            </div>
                            <Badge variant="outline" className="mt-2 text-xs">
                                ✅ Bình thường
                            </Badge>
                        </CardContent>
                    </Card>
                )}

                {/* Fire Detection */}
                {sensorData.flame_detected !== null && (
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center text-sm">
                                <Flame className="h-4 w-4 mr-2 text-red-600" />
                                Phát hiện lửa
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-xl font-bold">
                                        {sensorData.flame_detected ? '🔥 CÓ' : '✅ KHÔNG'}
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    {sensorData.flame_detected ?
                                        <AlertTriangle className="h-6 w-6 text-red-600" /> :
                                        <CheckCircle className="h-6 w-6 text-green-500" />
                                    }
                                </div>
                            </div>
                            <Badge
                                variant={sensorData.flame_detected ? 'destructive' : 'outline'}
                                className="mt-2 text-xs"
                            >
                                {sensorData.flame_detected ? '🔥 PHÁT HIỆN LỬA!' : '✅ An toàn'}
                            </Badge>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Last Update */}
            {sensorData.lastUpdate && (
                <Card>
                    <CardContent className="pt-4">
                        <div className="text-sm text-gray-500 text-center">
                            📅 Cập nhật lần cuối: {new Date(sensorData.lastUpdate).toLocaleString('vi-VN')}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default RealtimeSensorDisplay; 