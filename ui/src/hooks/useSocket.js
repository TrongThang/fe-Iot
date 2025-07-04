import { useState, useEffect, useCallback, useRef } from 'react';
import socketService from '@/lib/socket';

// Main socket hook for general connection management
export const useSocket = (accountId) => {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const connectionAttemptRef = useRef(false);

  const connect = useCallback(async () => {
    if (!accountId || connectionAttemptRef.current) {
      return;
    }

    connectionAttemptRef.current = true;
    setConnectionError(null);

    try {
      await socketService.connect(accountId);
      setIsConnected(true);
      setRetryCount(0);
    } catch (error) {
      console.error('Socket connection failed:', error);
      setConnectionError(error.message);
      setRetryCount(prev => prev + 1);
    } finally {
      connectionAttemptRef.current = false;
    }
  }, [accountId]);

  const disconnect = useCallback(() => {
    socketService.disconnect();
    setIsConnected(false);
    setConnectionError(null);
    connectionAttemptRef.current = false;
  }, []);

  useEffect(() => {
    if (accountId && !isConnected && !connectionError && retryCount < 3) {
      connect();
    }

    return () => {
      // Cleanup on unmount
      if (connectionAttemptRef.current) {
        disconnect();
      }
    };
  }, [accountId, connect, disconnect, isConnected, connectionError, retryCount]);

  return {
    isConnected,
    connectionError,
    retryCount,
    connect,
    disconnect,
    socketService
  };
};

// Hook for device-specific real-time data
export const useDeviceSocket = (serialNumber, accountId, options = {}) => {
  const { autoConnect = true, enableRealTime = true } = options;
  const [deviceData, setDeviceData] = useState(null);
  const [sensorData, setSensorData] = useState(null);
  const [deviceStatus, setDeviceStatus] = useState(null);
  const [alarmData, setAlarmData] = useState(null);
  const [isDeviceConnected, setIsDeviceConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);

  const { isConnected } = useSocket(accountId);

  // Connect to specific device
  const connectToDevice = useCallback(() => {
    if (isConnected && serialNumber && accountId) {
      const success = socketService.connectToDevice(serialNumber, accountId);
      setIsDeviceConnected(success);
      return success;
    }
    return false;
  }, [isConnected, serialNumber, accountId]);

  // Disconnect from device
  const disconnectFromDevice = useCallback(() => {
    if (serialNumber) {
      socketService.disconnectFromDevice(serialNumber);
      setIsDeviceConnected(false);
    }
  }, [serialNumber]);

  // Setup event listeners
  useEffect(() => {
    if (!isConnected || !serialNumber) return;

    // Device-specific sensor data
    const handleSensorData = (data) => {
      setSensorData(data);
      setLastUpdate(new Date());
    };

    // Device status updates
    const handleDeviceStatus = (data) => {
      setDeviceStatus(data);
      setLastUpdate(new Date());
    };

    // Alarm alerts
    const handleAlarmData = (data) => {
      setAlarmData(data);
      setLastUpdate(new Date());
    };

    // Real-time started confirmation
    const handleRealtimeStarted = (data) => {
      console.log(`🔴 Real-time monitoring started for ${serialNumber}`);
    };

    // Register event listeners
    socketService.on(`device_sensor_data_${serialNumber}`, handleSensorData);
    socketService.on(`device_status_${serialNumber}`, handleDeviceStatus);
    socketService.on(`device_alarm_${serialNumber}`, handleAlarmData);
    socketService.on(`realtime_started_${serialNumber}`, handleRealtimeStarted);

    // Auto-connect if enabled
    if (autoConnect && enableRealTime) {
      connectToDevice();
    }

    // Cleanup event listeners
    return () => {
      socketService.off(`device_sensor_data_${serialNumber}`, handleSensorData);
      socketService.off(`device_status_${serialNumber}`, handleDeviceStatus);
      socketService.off(`device_alarm_${serialNumber}`, handleAlarmData);
      socketService.off(`realtime_started_${serialNumber}`, handleRealtimeStarted);
    };
  }, [isConnected, serialNumber, autoConnect, enableRealTime, connectToDevice]);

  // Send commands to device
  const sendCommand = useCallback((commandData) => {
    return socketService.sendCommand(serialNumber, commandData);
  }, [serialNumber]);

  return {
    // Connection status
    isConnected,
    isDeviceConnected,
    
    // Device data
    deviceData,
    sensorData,
    deviceStatus,
    alarmData,
    lastUpdate,
    
    // Actions
    connectToDevice,
    disconnectFromDevice,
    sendCommand
  };
};

// Hook for door control
export const useDoorSocket = (serialNumber, accountId, options = {}) => {
  const { autoConnect = true } = options;
  const [doorStatus, setDoorStatus] = useState(null);
  const [doorCommandResponse, setDoorCommandResponse] = useState(null);
  const [lastDoorUpdate, setLastDoorUpdate] = useState(null);

  const { isConnected } = useSocket(accountId);

  // Setup door-specific event listeners
  useEffect(() => {
    if (!isConnected || !serialNumber) return;

    // Door status updates
    const handleDoorStatus = (data) => {
      setDoorStatus(data);
      setLastDoorUpdate(new Date());
    };

    // Door command responses
    const handleDoorCommandResponse = (data) => {
      setDoorCommandResponse(data);
      setLastDoorUpdate(new Date());
    };

    // Register event listeners
    socketService.on(`door_status_${serialNumber}`, handleDoorStatus);
    socketService.on(`door_command_response_${serialNumber}`, handleDoorCommandResponse);

    // Auto-connect if enabled
    if (autoConnect) {
      socketService.connectToDevice(serialNumber, accountId);
    }

    // Cleanup
    return () => {
      socketService.off(`door_status_${serialNumber}`, handleDoorStatus);
      socketService.off(`door_command_response_${serialNumber}`, handleDoorCommandResponse);
    };
  }, [isConnected, serialNumber, accountId, autoConnect]);

  // Door control commands
  const toggleDoor = useCallback((state = {}) => {
    return socketService.sendDoorCommand(serialNumber, 'toggle', state);
  }, [serialNumber]);

  const openDoor = useCallback((state = {}) => {
    return socketService.sendDoorCommand(serialNumber, 'open', state);
  }, [serialNumber]);

  const closeDoor = useCallback((state = {}) => {
    return socketService.sendDoorCommand(serialNumber, 'close', state);
  }, [serialNumber]);

  const lockDoor = useCallback((state = {}) => {
    return socketService.sendDoorCommand(serialNumber, 'lock', state);
  }, [serialNumber]);

  const unlockDoor = useCallback((state = {}) => {
    return socketService.sendDoorCommand(serialNumber, 'unlock', state);
  }, [serialNumber]);

  return {
    // Connection status
    isConnected,
    
    // Door data
    doorStatus,
    doorCommandResponse,
    lastDoorUpdate,
    
    // Door controls
    toggleDoor,
    openDoor,
    closeDoor,
    lockDoor,
    unlockDoor
  };
};

// Hook for LED control
export const useLEDSocket = (serialNumber, accountId, options = {}) => {
  const { autoConnect = true } = options;
  const [ledCapabilities, setLedCapabilities] = useState(null);
  const [ledStatus, setLedStatus] = useState(null);
  const [effectStatus, setEffectStatus] = useState(null);
  const [lastLedUpdate, setLastLedUpdate] = useState(null);

  const { isConnected } = useSocket(accountId);

  console.log(`[useLEDSocket] Hook initialized for ${serialNumber}`, {
    isConnected,
    autoConnect,
    ledCapabilities: !!ledCapabilities
  });

  // Setup LED-specific event listeners
  useEffect(() => {
    if (!isConnected || !serialNumber) {
      console.log(`[useLEDSocket] Not ready: isConnected=${isConnected}, serialNumber=${serialNumber}`);
      return;
    }

    console.log(`[useLEDSocket] Setting up event listeners for ${serialNumber}`);

    // LED capabilities response
    const handleLedCapabilities = (data) => {
      console.log(`[useLEDSocket] 🎨 LED capabilities received for ${serialNumber}:`, data);
      setLedCapabilities(data);
      setLastLedUpdate(new Date());
    };

    // LED state updates
    const handleLedStateUpdated = (data) => {
      console.log(`[useLEDSocket] 💡 LED state updated for ${serialNumber}:`, data);
      setLedStatus(data);
      setLastLedUpdate(new Date());
    };

    // LED effect updates
    const handleLedEffectSet = (data) => {
      console.log(`[useLEDSocket] 🌟 LED effect set for ${serialNumber}:`, data);
      setEffectStatus(data);
      setLastLedUpdate(new Date());
    };

    // Register event listeners - try both general and device-specific events
    socketService.on('led_capabilities', handleLedCapabilities);
    socketService.on(`led_capabilities_${serialNumber}`, handleLedCapabilities);
    socketService.on(`led_state_updated_${serialNumber}`, handleLedStateUpdated);
    socketService.on(`led_effect_set_${serialNumber}`, handleLedEffectSet);

    // Auto-connect and get capabilities
    if (autoConnect) {
      console.log(`[useLEDSocket] Auto-connecting to device ${serialNumber}`);
      const connected = socketService.connectToDevice(serialNumber, accountId);
      
      if (connected) {
        // Request LED capabilities after a short delay to ensure connection is established
        setTimeout(() => {
          console.log(`[useLEDSocket] Requesting LED capabilities for ${serialNumber}`);
          socketService.getLEDCapabilities(serialNumber);
        }, 1000);
      }
    }

    // Cleanup
    return () => {
      console.log(`[useLEDSocket] Cleaning up event listeners for ${serialNumber}`);
      socketService.off('led_capabilities', handleLedCapabilities);
      socketService.off(`led_capabilities_${serialNumber}`, handleLedCapabilities);
      socketService.off(`led_state_updated_${serialNumber}`, handleLedStateUpdated);
      socketService.off(`led_effect_set_${serialNumber}`, handleLedEffectSet);
    };
  }, [isConnected, serialNumber, accountId, autoConnect]);

  // LED control functions với logging
  const setEffect = useCallback((effectData) => {
    console.log(`[useLEDSocket] Setting LED effect for ${serialNumber}:`, effectData);
    return socketService.setLEDEffect(serialNumber, effectData);
  }, [serialNumber]);

  const applyPreset = useCallback((presetData) => {
    console.log(`[useLEDSocket] Applying LED preset for ${serialNumber}:`, presetData);
    return socketService.applyLEDPreset(serialNumber, presetData);
  }, [serialNumber]);

  const updateState = useCallback((stateData) => {
    console.log(`[useLEDSocket] Updating LED state for ${serialNumber}:`, stateData);
    return socketService.updateLEDState(serialNumber, stateData);
  }, [serialNumber]);

  const getCapabilities = useCallback(() => {
    console.log(`[useLEDSocket] Manually requesting LED capabilities for ${serialNumber}`);
    return socketService.getLEDCapabilities(serialNumber);
  }, [serialNumber]);

  const turnOn = useCallback((brightness = 100) => {
    console.log(`[useLEDSocket] Turning ON LED for ${serialNumber} with brightness ${brightness}`);
    return updateState({ power_status: true, brightness });
  }, [updateState]);

  const turnOff = useCallback(() => {
    console.log(`[useLEDSocket] Turning OFF LED for ${serialNumber}`);
    return updateState({ power_status: false });
  }, [updateState]);

  const setBrightness = useCallback((brightness) => {
    console.log(`[useLEDSocket] Setting brightness to ${brightness} for ${serialNumber}`);
    return updateState({ brightness });
  }, [updateState]);

  const setColor = useCallback((color) => {
    console.log(`[useLEDSocket] Setting color to ${color} for ${serialNumber}`);
    return updateState({ color });
  }, [updateState]);

  // Debug logging khi state thay đổi
  useEffect(() => {
    if (ledCapabilities) {
      console.log(`[useLEDSocket] ✅ LED capabilities updated for ${serialNumber}:`, {
        supported_presets: ledCapabilities?.supported_presets?.length || 0,
        supported_effects: ledCapabilities?.supported_effects?.length || 0,
        hasDescriptions: !!ledCapabilities?.preset_descriptions,
        data: ledCapabilities
      });
    }
  }, [ledCapabilities, serialNumber]);

  return {
    // Connection status
    isConnected,
    
    // LED data
    ledCapabilities,
    ledStatus,
    effectStatus,
    lastLedUpdate,
    
    // LED controls
    setEffect,
    applyPreset,
    updateState,
    getCapabilities,
    turnOn,
    turnOff,
    setBrightness,
    setColor
  };
};

// Hook for global device notifications
export const useGlobalDeviceNotifications = (accountId) => {
  const [deviceNotifications, setDeviceNotifications] = useState([]);
  const [emergencyAlerts, setEmergencyAlerts] = useState([]);

  const { isConnected } = useSocket(accountId);

  useEffect(() => {
    if (!isConnected) return;

    // Global device connection events
    const handleGlobalDeviceConnect = (data) => {
      setDeviceNotifications(prev => [...prev, {
        id: Date.now(),
        type: 'connect',
        data,
        timestamp: new Date()
      }]);
    };

    const handleGlobalDeviceDisconnect = (data) => {
      setDeviceNotifications(prev => [...prev, {
        id: Date.now(),
        type: 'disconnect',
        data,
        timestamp: new Date()
      }]);
    };

    // Emergency alerts
    const handleEmergencyAlert = (data) => {
      setEmergencyAlerts(prev => [...prev, {
        id: Date.now(),
        type: 'emergency',
        data,
        timestamp: new Date()
      }]);
    };

    const handleFireAlert = (data) => {
      setEmergencyAlerts(prev => [...prev, {
        id: Date.now(),
        type: 'fire',
        data,
        timestamp: new Date()
      }]);
    };

    const handleSmokeAlert = (data) => {
      setEmergencyAlerts(prev => [...prev, {
        id: Date.now(),
        type: 'smoke',
        data,
        timestamp: new Date()
      }]);
    };

    // Register global event listeners
    socketService.on('global_device_connect', handleGlobalDeviceConnect);
    socketService.on('global_device_disconnect', handleGlobalDeviceDisconnect);
    socketService.on('emergency_alert', handleEmergencyAlert);
    socketService.on('fire_alert', handleFireAlert);
    socketService.on('smoke_alert', handleSmokeAlert);

    // Cleanup
    return () => {
      socketService.off('global_device_connect', handleGlobalDeviceConnect);
      socketService.off('global_device_disconnect', handleGlobalDeviceDisconnect);
      socketService.off('emergency_alert', handleEmergencyAlert);
      socketService.off('fire_alert', handleFireAlert);
      socketService.off('smoke_alert', handleSmokeAlert);
    };
  }, [isConnected]);

  // Clear notifications
  const clearNotifications = useCallback(() => {
    setDeviceNotifications([]);
  }, []);

  const clearEmergencyAlerts = useCallback(() => {
    setEmergencyAlerts([]);
  }, []);

  const dismissNotification = useCallback((id) => {
    setDeviceNotifications(prev => prev.filter(notif => notif.id !== id));
  }, []);

  const dismissEmergencyAlert = useCallback((id) => {
    setEmergencyAlerts(prev => prev.filter(alert => alert.id !== id));
  }, []);

  return {
    isConnected,
    deviceNotifications,
    emergencyAlerts,
    clearNotifications,
    clearEmergencyAlerts,
    dismissNotification,
    dismissEmergencyAlert
  };
}; 