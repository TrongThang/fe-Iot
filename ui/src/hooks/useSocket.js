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
      console.log('🚫 Socket connect skipped:', { accountId: !!accountId, attempting: connectionAttemptRef.current });
      return;
    }

    console.log('🔌 Socket connecting for account:', accountId);
    connectionAttemptRef.current = true;
    setConnectionError(null);

    try {
      await socketService.connect(accountId);
      setIsConnected(true);
      setRetryCount(0);
      console.log('✅ Socket connected successfully');
    } catch (error) {
      console.error('❌ Socket connection failed:', error);
      setConnectionError(error.message);
      setRetryCount(prev => prev + 1);
    } finally {
      connectionAttemptRef.current = false;
    }
  }, [accountId]);

  const disconnect = useCallback(() => {
    console.log('🔌 Socket disconnecting...');
    socketService.disconnect();
    setIsConnected(false);
    setConnectionError(null);
    connectionAttemptRef.current = false;
  }, []);

  useEffect(() => {
    // DISABLED: No auto-connect for global socket
    // IoT API requires serialNumber + accountId for /client namespace
    // Only device-specific connections are allowed
    
    if (!accountId) {
      console.log('🚫 No accountId provided, skipping socket connection');
      return;
    }

    console.log('🔄 useSocket effect called but auto-connect DISABLED for global socket');
    console.log('📋 Use device-specific socket hooks (useDeviceSocket, useDoorSocket, useLEDSocket) instead');

    // Don't auto-connect to avoid continuous connection attempts
    // if (!isConnected && !connectionError && retryCount < 3 && !connectionAttemptRef.current) {
    //   console.log('🔄 Attempting socket connection...', { retryCount, accountId });
    //   connect();
    // }

    return () => {
      // Cleanup on unmount
      if (connectionAttemptRef.current) {
        disconnect();
      }
    };
  }, [accountId, disconnect]);

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
  const { autoConnect = true, enableRealTime = true } = options; // CHANGED: autoConnect = true by default
  const [deviceData, setDeviceData] = useState(null);
  const [sensorData, setSensorData] = useState(null);
  const [deviceStatus, setDeviceStatus] = useState(null);
  const [alarmData, setAlarmData] = useState(null);
  const [isDeviceConnected, setIsDeviceConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);

  // Don't use global socket connection - create device-specific connection
  const [isConnected, setIsConnected] = useState(false);
  
  console.log('🔌 useDeviceSocket called with serialNumber:', serialNumber, 'accountId:', accountId, 'options:', options);

  // Connect to specific device - create device-specific connection
  const connectToDevice = useCallback(async () => {
    if (serialNumber && accountId) {
      console.log('🔄 Connecting to device:', serialNumber, 'for account:', accountId);
      
      try {
        // Create device-specific socket connection
        const success = await socketService.connectToDevice(serialNumber, accountId);
        setIsDeviceConnected(success);
        setIsConnected(success);
        
        console.log('✅ Device connection result:', success);
        return success;
      } catch (error) {
        console.error('❌ Device connection error:', error);
        setIsDeviceConnected(false);
        setIsConnected(false);
        return false;
      }
    }
    console.log('🚫 Missing serialNumber or accountId');
    return false;
  }, [serialNumber, accountId]);

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
    if (autoConnect && enableRealTime && serialNumber && accountId) {
      console.log(`🔄 Auto-connecting to device ${serialNumber} with account ${accountId}`);
      connectToDevice();
    }

    // Cleanup event listeners
    return () => {
      socketService.off(`device_sensor_data_${serialNumber}`, handleSensorData);
      socketService.off(`device_status_${serialNumber}`, handleDeviceStatus);
      socketService.off(`device_alarm_${serialNumber}`, handleAlarmData);
      socketService.off(`realtime_started_${serialNumber}`, handleRealtimeStarted);
    };
  }, [isConnected, serialNumber, accountId, autoConnect, enableRealTime, connectToDevice]);

  // Send commands to device
  const sendCommand = useCallback((commandData) => {
    return socketService.sendCommand(serialNumber, commandData);
  }, [serialNumber]);

  return {
    // Connection status
    isConnected,
    isDeviceConnected,
    connectionStatus: isDeviceConnected ? 'connected' : 'disconnected',
    error: null,
    
    // Device data
    deviceData,
    sensorData,
    deviceStatus,
    alarmData,
    lastUpdate,
    
    // Actions
    connectToDevice,
    disconnectFromDevice,
    sendCommand,
    reconnect: connectToDevice
  };
};

// Hook for door control
export const useDoorSocket = (serialNumber, accountId, options = {}) => {
  const { autoConnect = false } = options; // CHANGED: autoConnect = false by default
  const [doorStatus, setDoorStatus] = useState(null);
  const [doorCommandResponse, setDoorCommandResponse] = useState(null);
  const [lastDoorUpdate, setLastDoorUpdate] = useState(null);

  // Don't use global socket connection - avoid continuous connections
  const [isConnected, setIsConnected] = useState(false);

  // Setup door-specific event listeners
  useEffect(() => {
    if (!serialNumber || !accountId) return;

    console.log('🚪 Setting up door socket for:', serialNumber, 'with account:', accountId);

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

    // Auto-connect if enabled - create device-specific connection
    if (autoConnect) {
      console.log('🔄 Auto-connecting door socket for:', serialNumber);
      socketService.connectToDevice(serialNumber, accountId).then(success => {
        setIsConnected(success);
        console.log('🚪 Door socket connection result:', success);
      }).catch(error => {
        console.error('❌ Door socket connection failed:', error);
        setIsConnected(false);
      });
    }

    // Cleanup
    return () => {
      socketService.off(`door_status_${serialNumber}`, handleDoorStatus);
      socketService.off(`door_command_response_${serialNumber}`, handleDoorCommandResponse);
    };
  }, [serialNumber, accountId, autoConnect]);

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
  const { autoConnect = false } = options; // CHANGED: autoConnect = false by default
  const [ledCapabilities, setLedCapabilities] = useState(null);
  const [ledStatus, setLedStatus] = useState(null);
  const [effectStatus, setEffectStatus] = useState(null);
  const [lastLedUpdate, setLastLedUpdate] = useState(null);

  // Don't use global socket connection - avoid continuous connections
  const [isConnected, setIsConnected] = useState(false);

  console.log(`[useLEDSocket] Hook initialized for ${serialNumber}`, {
    isConnected,
    autoConnect,
    ledCapabilities: !!ledCapabilities
  });

  // Setup LED-specific event listeners
  useEffect(() => {
    if (!serialNumber || !accountId) {
      console.log(`[useLEDSocket] Not ready: serialNumber=${serialNumber}, accountId=${accountId}`);
      return;
    }

    console.log(`[useLEDSocket] Setting up event listeners for ${serialNumber} with account ${accountId}`);

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

    // Auto-connect and get capabilities - create device-specific connection
    if (autoConnect) {
      console.log(`[useLEDSocket] Auto-connecting to device ${serialNumber}`);
      socketService.connectToDevice(serialNumber, accountId).then(success => {
        setIsConnected(success);
        console.log(`[useLEDSocket] LED socket connection result:`, success);
        
        if (success) {
          // Request LED capabilities after a short delay to ensure connection is established
          setTimeout(() => {
            console.log(`[useLEDSocket] Requesting LED capabilities for ${serialNumber}`);
            socketService.getLEDCapabilities(serialNumber);
          }, 1000);
        }
      }).catch(error => {
        console.error(`[useLEDSocket] LED socket connection failed:`, error);
        setIsConnected(false);
      });
    }

    // Cleanup
    return () => {
      console.log(`[useLEDSocket] Cleaning up event listeners for ${serialNumber}`);
      socketService.off('led_capabilities', handleLedCapabilities);
      socketService.off(`led_capabilities_${serialNumber}`, handleLedCapabilities);
      socketService.off(`led_state_updated_${serialNumber}`, handleLedStateUpdated);
      socketService.off(`led_effect_set_${serialNumber}`, handleLedEffectSet);
    };
  }, [serialNumber, accountId, autoConnect]);

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

  console.log('🔔 useGlobalDeviceNotifications called with accountId:', accountId);

  // Don't use useSocket for global notifications to avoid continuous connections
  // IoT API requires serialNumber + accountId for /client namespace
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    console.log('🔔 useGlobalDeviceNotifications effect - accountId:', accountId);
    
    // Early return if no accountId - don't try to connect for global notifications
    if (!accountId) {
      console.log('🚫 Skipping global notifications setup - no accountId');
      return;
    }

    // For now, don't auto-connect for global notifications
    // Global notifications will be handled per-device connections
    console.log('📋 Global notifications available but no auto-connect');
    setIsConnected(false);

    // Skip event listeners setup for now - no global connection
    // Global notifications will be handled per-device when user accesses device pages
    
    // Global device connection events - DISABLED for now
    // const handleGlobalDeviceConnect = (data) => { ... };
    // Emergency alerts - DISABLED for now  
    // const handleEmergencyAlert = (data) => { ... };

    console.log('📋 Global notifications ready but no event listeners setup (avoiding continuous connections)');

    // No cleanup needed since no event listeners registered
    return () => {
      console.log('📋 Global notifications cleanup - no listeners to remove');
    };
  }, [accountId]);

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

 