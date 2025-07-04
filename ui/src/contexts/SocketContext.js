import React, { createContext, useContext, useEffect, useState } from 'react';
import socketService from '@/lib/socket';
import { useGlobalDeviceNotifications } from '@/hooks/useSocket';

const SocketContext = createContext();

export const useSocketContext = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocketContext must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize user from localStorage or auth context
  useEffect(() => {
    // Try to get user info from localStorage or your auth system
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
      }
    }
    setIsInitialized(true);
  }, []);

  // Global device notifications hook
  const {
    isConnected,
    deviceNotifications,
    emergencyAlerts,
    clearNotifications,
    clearEmergencyAlerts,
    dismissNotification,
    dismissEmergencyAlert
  } = useGlobalDeviceNotifications(user?.id || user?.account_id);

  // Connection management
  const connectSocket = async (accountId) => {
    try {
      await socketService.connect(accountId);
      return true;
    } catch (error) {
      console.error('Failed to connect socket:', error);
      return false;
    }
  };

  const disconnectSocket = () => {
    socketService.disconnect();
  };

  // Device management
  const connectToDevice = (serialNumber, accountId) => {
    return socketService.connectToDevice(serialNumber, accountId || user?.id || user?.account_id);
  };

  const disconnectFromDevice = (serialNumber) => {
    return socketService.disconnectFromDevice(serialNumber);
  };

  // Send commands to devices
  const sendDeviceCommand = (serialNumber, commandData) => {
    return socketService.sendCommand(serialNumber, commandData);
  };

  const sendDoorCommand = (serialNumber, action, state = {}) => {
    return socketService.sendDoorCommand(serialNumber, action, state);
  };

  // LED controls
  const setLEDEffect = (serialNumber, effectData) => {
    return socketService.setLEDEffect(serialNumber, effectData);
  };

  const applyLEDPreset = (serialNumber, presetData) => {
    return socketService.applyLEDPreset(serialNumber, presetData);
  };

  const updateLEDState = (serialNumber, stateData) => {
    return socketService.updateLEDState(serialNumber, stateData);
  };

  // Get connection status
  const getConnectionStatus = () => {
    return socketService.getConnectionStatus();
  };

  const value = {
    // User management
    user,
    setUser,
    isInitialized,

    // Connection status
    isConnected,
    
    // Connection management
    connectSocket,
    disconnectSocket,
    
    // Device management
    connectToDevice,
    disconnectFromDevice,
    
    // Command sending
    sendDeviceCommand,
    sendDoorCommand,
    setLEDEffect,
    applyLEDPreset,
    updateLEDState,
    
    // Notifications
    deviceNotifications,
    emergencyAlerts,
    clearNotifications,
    clearEmergencyAlerts,
    dismissNotification,
    dismissEmergencyAlert,
    
    // Utilities
    getConnectionStatus,
    socketService
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
}; 