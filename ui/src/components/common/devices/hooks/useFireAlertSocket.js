import { useState, useEffect, useCallback, useRef } from 'react';
import { useDeviceSocket, useGlobalDeviceNotifications } from '@/hooks/useSocket';

// Threshold values for fire/gas detection
const ALERT_THRESHOLDS = {
    gas: {
        warning: 1000,    // PPM
        danger: 2000,     // PPM
        critical: 3000    // PPM
    },
    temperature: {
        warning: 40,      // Celsius
        danger: 50,       // Celsius
        critical: 60      // Celsius
    },
    humidity: {
        warning: 80,      // Percent
        danger: 90,       // Percent
        critical: 95      // Percent
    }
};

// Alert severity levels
export const ALERT_LEVELS = {
    NORMAL: 'normal',
    WARNING: 'warning',
    DANGER: 'danger',
    CRITICAL: 'critical'
};

// Alert types
export const ALERT_TYPES = {
    GAS: 'gas',
    FIRE: 'fire',
    SMOKE: 'smoke',
    TEMPERATURE: 'temperature'
};

export const useFireAlertSocket = (device, options = {}) => {
    const { 
        enableSound = true, 
        enableNotifications = true,
        autoConnect = true,
        thresholds = ALERT_THRESHOLDS 
    } = options;

    // Alert states
    const [currentAlert, setCurrentAlert] = useState(null);
    const [alertHistory, setAlertHistory] = useState([]);
    const [isAlerting, setIsAlerting] = useState(false);
    const [alertLevel, setAlertLevel] = useState(ALERT_LEVELS.NORMAL);
    const [lastSensorReading, setLastSensorReading] = useState(null);
    
    // Sound management
    const audioRef = useRef(null);
    const soundTimeoutRef = useRef(null);
    
    // Device connection - ensure we have valid data before connecting
    const serialNumber = device?.serial_number;
    const accountId = device?.account_id || device?.user_id;
    const hasValidConnectionData = device && serialNumber && accountId;

    console.log(`[FireAlertSocket] Hook initialized:`, {
        device: !!device,
        serialNumber,
        accountId,
        hasValidConnectionData,
        autoConnect,
        enableSound
    });

    // Use device-specific socket for real-time sensor data (only with valid data)
    const {
        isConnected,
        isDeviceConnected,
        sensorData,
        deviceStatus,
        alarmData,
        lastUpdate
    } = useDeviceSocket(
        hasValidConnectionData ? serialNumber : null, 
        hasValidConnectionData ? accountId : null, 
        { 
            autoConnect: autoConnect && hasValidConnectionData,
            enableRealTime: true 
        }
    );

    // Use global notifications for emergency alerts (only with valid account)
    const {
        emergencyAlerts,
        dismissEmergencyAlert
    } = useGlobalDeviceNotifications(hasValidConnectionData ? accountId : null);

    // Debug logging for connection status
    useEffect(() => {
        console.log(`[FireAlertSocket] Connection status:`, {
            device: !!device,
            serialNumber,
            isConnected,
            isDeviceConnected,
            hasSensorData: !!sensorData,
            hasAlarmData: !!alarmData
        });
    }, [device, serialNumber, isConnected, isDeviceConnected, sensorData, alarmData]);

    // Initialize alarm sound
    useEffect(() => {
        if (enableSound && !audioRef.current) {
            audioRef.current = new Audio('/sounds/fire-alarm.mp3'); // You'll need to add this file
            audioRef.current.loop = true;
            audioRef.current.volume = 0.8;
        }

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
            if (soundTimeoutRef.current) {
                clearTimeout(soundTimeoutRef.current);
            }
        };
    }, [enableSound]);

    // Function to determine alert level based on sensor readings
    const getAlertLevel = useCallback((sensorReading) => {
        if (!sensorReading) return ALERT_LEVELS.NORMAL;

        const { gas, temp, hum, ppm } = sensorReading;
        const gasLevel = gas || ppm || 0;
        const temperature = temp || 0;
        const humidity = hum || 0;

        // Check critical levels first
        if (gasLevel >= thresholds.gas.critical || 
            temperature >= thresholds.temperature.critical ||
            humidity >= thresholds.humidity.critical) {
            return ALERT_LEVELS.CRITICAL;
        }

        // Check danger levels
        if (gasLevel >= thresholds.gas.danger || 
            temperature >= thresholds.temperature.danger ||
            humidity >= thresholds.humidity.danger) {
            return ALERT_LEVELS.DANGER;
        }

        // Check warning levels
        if (gasLevel >= thresholds.gas.warning || 
            temperature >= thresholds.temperature.warning ||
            humidity >= thresholds.humidity.warning) {
            return ALERT_LEVELS.WARNING;
        }

        return ALERT_LEVELS.NORMAL;
    }, [thresholds]);

    // Function to determine alert type based on readings
    const getAlertType = useCallback((sensorReading) => {
        if (!sensorReading) return null;

        const { gas, temp, hum, ppm } = sensorReading;
        const gasLevel = gas || ppm || 0;
        const temperature = temp || 0;

        // Priority: Gas > Temperature > General
        if (gasLevel >= thresholds.gas.warning) {
            return ALERT_TYPES.GAS;
        }

        if (temperature >= thresholds.temperature.danger) {
            return ALERT_TYPES.FIRE;
        }

        if (temperature >= thresholds.temperature.warning || 
            gasLevel >= thresholds.gas.warning) {
            return ALERT_TYPES.SMOKE;
        }

        return null;
    }, [thresholds]);

    // Helper function to check if alert should be upgraded
    const shouldUpgradeAlert = useCallback((currentLevel, newLevel) => {
        const levelPriority = {
            [ALERT_LEVELS.NORMAL]: 0,
            [ALERT_LEVELS.WARNING]: 1,
            [ALERT_LEVELS.DANGER]: 2,
            [ALERT_LEVELS.CRITICAL]: 3
        };
        return levelPriority[newLevel] > levelPriority[currentLevel];
    }, []);

    // Function to create alert object
    const createAlert = useCallback((type, level, data, source = 'sensor') => {
        return {
            id: Date.now() + Math.random(),
            type,
            level,
            data,
            source,
            deviceId: device?.id,
            serialNumber,
            deviceName: device?.name || 'Unknown Device',
            timestamp: new Date(),
            acknowledged: false
        };
    }, [device, serialNumber]);

    // Function to trigger alert
    const triggerAlert = useCallback((alert) => {
        console.log(`🚨 FIRE ALERT TRIGGERED:`, alert);
        
        setCurrentAlert(alert);
        setIsAlerting(true);
        setAlertLevel(alert.level);
        
        // Add to history
        setAlertHistory(prev => [alert, ...prev.slice(0, 9)]); // Keep last 10

        // Play sound for danger/critical alerts
        if (enableSound && audioRef.current && 
            (alert.level === ALERT_LEVELS.DANGER || alert.level === ALERT_LEVELS.CRITICAL)) {
            
            audioRef.current.play().catch(error => {
                console.warn('Could not play alert sound:', error);
            });

            // Auto-stop sound after 30 seconds for danger, 60 seconds for critical
            const timeout = alert.level === ALERT_LEVELS.CRITICAL ? 60000 : 30000;
            soundTimeoutRef.current = setTimeout(() => {
                if (audioRef.current) {
                    audioRef.current.pause();
                }
            }, timeout);
        }

        // Browser notification
        if (enableNotifications && 'Notification' in window && Notification.permission === 'granted') {
            new Notification(`🚨 ${alert.type.toUpperCase()} ALERT`, {
                body: `${alert.deviceName}: ${alert.level.toUpperCase()} level detected`,
                icon: '/icons/fire-alert.png',
                tag: `fire-alert-${alert.id}`,
                requireInteraction: alert.level === ALERT_LEVELS.CRITICAL
            });
        }
    }, [enableSound, enableNotifications]);

    // Function to clear alert
    const clearAlert = useCallback((alertId = null) => {
        if (alertId && currentAlert?.id !== alertId) return;

        console.log(`✅ Clearing fire alert:`, alertId || 'current');
        
        setCurrentAlert(null);
        setIsAlerting(false);
        setAlertLevel(ALERT_LEVELS.NORMAL);

        // Stop sound
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }

        if (soundTimeoutRef.current) {
            clearTimeout(soundTimeoutRef.current);
            soundTimeoutRef.current = null;
        }
    }, [currentAlert]);

    // Function to acknowledge alert  
    const acknowledgeAlert = useCallback((alertId = null) => {
        const targetId = alertId || currentAlert?.id;
        if (!targetId) return;

        console.log(`✋ Acknowledging fire alert:`, targetId);

        // Update current alert
        if (currentAlert?.id === targetId) {
            setCurrentAlert(prev => prev ? { ...prev, acknowledged: true } : null);
        }

        // Update history
        setAlertHistory(prev => 
            prev.map(alert => 
                alert.id === targetId 
                    ? { ...alert, acknowledged: true }
                    : alert
            )
        );

        // Stop sound but keep visual alert
        if (audioRef.current) {
            audioRef.current.pause();
        }
    }, [currentAlert]);

    // Monitor sensor data for alerts
    useEffect(() => {
        if (!sensorData) {
            console.log(`[FireAlertSocket] No sensor data for ${serialNumber}`);
            return;
        }

        console.log(`[FireAlertSocket] 🔍 Checking sensor data for alerts:`, {
            serialNumber,
            sensorData,
            currentAlert: !!currentAlert
        });
        
        setLastSensorReading(sensorData);

        const level = getAlertLevel(sensorData);
        const type = getAlertType(sensorData);

        console.log(`[FireAlertSocket] Alert evaluation:`, {
            level,
            type,
            hasCurrentAlert: !!currentAlert,
            thresholds
        });

        // Only trigger alert if level is warning or above and we don't have a current alert of same or higher level
        if (level !== ALERT_LEVELS.NORMAL && type) {
            if (!currentAlert || (currentAlert && shouldUpgradeAlert(currentAlert.level, level))) {
                const alert = createAlert(type, level, sensorData, 'sensor');
                console.log(`[FireAlertSocket] 🚨 TRIGGERING ALERT:`, alert);
                triggerAlert(alert);
            } else {
                console.log(`[FireAlertSocket] Alert already exists, not triggering new one`);
            }
        }
        // Clear alert if readings return to normal
        else if (level === ALERT_LEVELS.NORMAL && currentAlert) {
            console.log(`[FireAlertSocket] ✅ Readings normal, clearing alert`);
            clearAlert();
        }

    }, [sensorData, getAlertLevel, getAlertType, currentAlert, createAlert, triggerAlert, clearAlert, serialNumber, thresholds]);

    // Monitor device-specific alarm data
    useEffect(() => {
        if (!alarmData) return;

        console.log(`🚨 Device alarm received:`, alarmData);

        // Create alert from device alarm
        const alert = createAlert(
            alarmData.type || ALERT_TYPES.EMERGENCY,
            alarmData.level || ALERT_LEVELS.DANGER,
            alarmData,
            'device'
        );

        triggerAlert(alert);
    }, [alarmData, createAlert, triggerAlert]);

    // Monitor global emergency alerts for this device
    useEffect(() => {
        const relevantAlerts = emergencyAlerts.filter(alert => 
            alert.data?.serialNumber === serialNumber ||
            alert.data?.deviceId === device?.id ||
            alert.type === 'fire' || alert.type === 'smoke'
        );

        relevantAlerts.forEach(globalAlert => {
            if (!alertHistory.some(h => h.id === globalAlert.id)) {
                const alert = createAlert(
                    globalAlert.type,
                    ALERT_LEVELS.CRITICAL,
                    globalAlert.data,
                    'global'
                );

                triggerAlert(alert);
            }
        });
    }, [emergencyAlerts, serialNumber, device?.id, alertHistory, createAlert, triggerAlert]);

    // Request notification permission on mount
    useEffect(() => {
        if (enableNotifications && 'Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }, [enableNotifications]);

    // Manual test functions for debugging
    const testAlert = useCallback((level = ALERT_LEVELS.WARNING, type = ALERT_TYPES.GAS) => {
        const testData = {
            gas: level === ALERT_LEVELS.CRITICAL ? 3500 : level === ALERT_LEVELS.DANGER ? 2500 : 1200,
            temp: level === ALERT_LEVELS.CRITICAL ? 65 : level === ALERT_LEVELS.DANGER ? 55 : 42,
            hum: 70
        };
        
        const alert = createAlert(type, level, testData, 'manual_test');
        console.log(`[FireAlertSocket] 🧪 MANUAL TEST ALERT:`, alert);
        triggerAlert(alert);
    }, [createAlert, triggerAlert]);

    const simulateSensorData = useCallback((gasLevel, tempLevel, humLevel) => {
        const testSensorData = {
            gas: gasLevel || 500,
            temp: tempLevel || 25,
            hum: humLevel || 45,
            ppm: gasLevel || 500
        };
        
        console.log(`[FireAlertSocket] 🔬 SIMULATING SENSOR DATA:`, testSensorData);
        
        // Manually trigger sensor data processing
        const level = getAlertLevel(testSensorData);
        const type = getAlertType(testSensorData);
        
        if (level !== ALERT_LEVELS.NORMAL && type) {
            const alert = createAlert(type, level, testSensorData, 'simulation');
            triggerAlert(alert);
        }
    }, [getAlertLevel, getAlertType, createAlert, triggerAlert]);

    return {
        // Connection status
        isConnected,
        isDeviceConnected,

        // Alert states
        currentAlert,
        alertHistory,
        isAlerting,
        alertLevel,
        lastSensorReading,

        // Sensor data
        sensorData,
        deviceStatus,
        lastUpdate,

        // Alert controls
        clearAlert,
        acknowledgeAlert,
        dismissEmergencyAlert,

        // Utility functions
        getAlertLevel,
        getAlertType,

        // Debug/Test functions
        testAlert,
        simulateSensorData,

        // Constants
        ALERT_LEVELS,
        ALERT_TYPES,
        ALERT_THRESHOLDS: thresholds
    };
}; 