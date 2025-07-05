import React, { createContext, useContext, useEffect, useState } from 'react';
import socketService from '@/lib/socket';
import fcmService from '@/services/fcmService';
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
  const [fcmPermission, setFcmPermission] = useState('default');
  const [fcmToken, setFcmToken] = useState(null);

  // Initialize user from localStorage or auth context
  useEffect(() => {
    console.log('🚀 SocketContext initializing...');
    
    // Try to get user info from localStorage or your auth system
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        console.log('👤 User loaded from localStorage:', userData);
        
        // Auto-connect DISABLED - IoT API requires serialNumber + accountId for /client namespace
        // Users will connect per-device when accessing device detail pages
        
        if (userData.account_id || userData.id) {
          const accountId = userData.account_id || userData.id;
          console.log('✅ User authenticated, socket ready but NOT auto-connecting');
          console.log('📋 Use device-specific socket connections when accessing devices');
          
          // Don't auto-connect to avoid continuous connection loop
          // setTimeout(() => {
          //   connectSocket(accountId);
          // }, 1000);
        } else {
          console.log('🚫 No valid account ID found');
        }
      } catch (error) {
        console.error('❌ Error parsing stored user data:', error);
        localStorage.removeItem('user'); // Remove corrupted data
      }
    } else {
      console.log('👤 No stored user found');
    }
    
    setIsInitialized(true);
    console.log('✅ SocketContext initialized');
  }, []);

  // Initialize FCM and get status
  useEffect(() => {
    const initializeFCM = async () => {
      console.log('🔧 Initializing FCM in SocketProvider...');
      
      // Wait for FCM service to initialize
      if (fcmService.isInitialized) {
        const status = fcmService.getStatus();
        setFcmPermission(status.permission);
        setFcmToken(status.token);
        
        console.log('📋 FCM Status:', status);
      }
    };

    if (isInitialized) {
      initializeFCM();
    }
  }, [isInitialized]);

  // Global device notifications hook - prioritize account_id for IoT API
  // Only call hook when user is available to prevent continuous socket calls
  const accountId = user?.account_id || user?.id;
  console.log('🔍 SocketContext accountId:', { accountId, hasUser: !!user });
  
  const {
    isConnected,
    deviceNotifications,
    emergencyAlerts,
    clearNotifications,
    clearEmergencyAlerts,
    dismissNotification,
    dismissEmergencyAlert
  } = useGlobalDeviceNotifications(accountId);

  // Integrate FCM with socket emergency alerts
  useEffect(() => {
    // When new emergency alerts come from socket, also send FCM notification
    emergencyAlerts.forEach(alert => {
      // Check if we haven't sent FCM for this alert yet
      const alertId = `${alert.timestamp}-${alert.type}-${alert.data?.serialNumber}`;
      const sentAlerts = JSON.parse(localStorage.getItem('fcm-sent-alerts') || '[]');
      
      if (!sentAlerts.includes(alertId)) {
        console.log('🚨 Sending FCM notification for socket emergency alert:', alert);
        
        // Send FCM notification
        fcmService.sendEmergencyNotification(alert);
        
        // Mark as sent to avoid duplicates
        sentAlerts.push(alertId);
        localStorage.setItem('fcm-sent-alerts', JSON.stringify(sentAlerts.slice(-50))); // Keep last 50
      }
    });
  }, [emergencyAlerts]);

  // Connection management - DISABLED
  const connectSocket = async (accountId) => {
    console.log('🚫 GLOBAL SOCKET CONNECTION DISABLED');
    console.log('💡 IoT API requires serialNumber + accountId for /client namespace');
    console.log('📋 Use device-specific connections instead');
    console.log('   - connectToDevice(serialNumber, accountId)');
    console.log('   - useDeviceSocket(serialNumber, accountId, options)');
    
    return Promise.reject(new Error('Global socket connection disabled. Use device-specific connections.'));
  };

  const disconnectSocket = () => {
    socketService.disconnect();
  };

  // Device management
  const connectToDevice = (serialNumber, accountId) => {
    return socketService.connectToDevice(serialNumber, accountId || user?.account_id || user?.id);
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

  // FCM Functions
  const requestFCMPermission = async () => {
    console.log('🔔 Requesting FCM permission...');
    const result = await fcmService.requestPermission();
    
    if (result.success) {
      setFcmPermission('granted');
      setFcmToken(result.token);
    } else {
      setFcmPermission('denied');
      setFcmToken(null);
    }
    
    return result;
  };

  const getFCMStatus = () => {
    return {
      permission: fcmPermission,
      token: fcmToken,
      isSupported: fcmService.getStatus().isSupported
    };
  };

  const testFCMNotification = async (type = 'fire') => {
    return await fcmService.testNotification(type);
  };

  // Debug logging when user changes
  useEffect(() => {
    console.log('👤 SocketContext user changed:', { 
      hasUser: !!user, 
      accountId: user?.account_id, 
      id: user?.id 
    });
  }, [user]);

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
    
    // FCM Functions
    fcmPermission,
    fcmToken,
    requestFCMPermission,
    getFCMStatus,
    testFCMNotification,
    
    // Utilities
    getConnectionStatus,
    socketService,
    fcmService
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
}; 