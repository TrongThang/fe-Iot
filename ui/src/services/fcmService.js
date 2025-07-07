// FCM Service for handling push notifications in IoT UI
import {
  getFCMToken,
  requestNotificationPermission,
  onMessageListener,
  getNotificationPermission,
  showLocalNotification
} from '@/config/firebase';
import { ALERT_TYPES, NOTIFICATION_CHANNELS } from '@/config/firebase-config';
import Swal from 'sweetalert2';

class FCMService {
  constructor() {
    this.isInitialized = false;
    this.fcmToken = null;
    this.notificationPermission = 'default';
    this.foregroundMessageHandlers = new Set();
    this.emergencyAlertHandlers = new Set();
    
    // Initialize FCM
    this.initialize();
  }

  async initialize() {
    console.log('🔧 Initializing FCM Service...');
    
    try {
      // Check notification support
      if (!('Notification' in window)) {
        console.warn('❌ This browser does not support notifications');
        return false;
      }

      // Check current permission
      this.notificationPermission = getNotificationPermission();
      console.log(`📋 Current notification permission: ${this.notificationPermission}`);

      // Register service worker
      await this.registerServiceWorker();

      // Setup foreground message listener
      this.setupForegroundMessageListener();

      // Setup notification click listener
      this.setupNotificationClickListener();

      // Auto-get FCM token if permission is already granted
      if (this.notificationPermission === 'granted') {
        console.log('🎫 Permission already granted, getting FCM token...');
        try {
          this.fcmToken = await getFCMToken();
          if (this.fcmToken) {
            console.log('✅ FCM Token retrieved successfully:', this.fcmToken);
            
            // Save token to localStorage for persistence
            localStorage.setItem('fcm_token', this.fcmToken);
            localStorage.setItem('fcm_token_timestamp', Date.now().toString());
            
            // Dispatch token ready event
            window.dispatchEvent(new CustomEvent('fcm-token-ready', {
              detail: { token: this.fcmToken }
            }));
          } else {
            console.warn('⚠️ Failed to retrieve FCM token despite granted permission');
          }
        } catch (error) {
          console.error('❌ Error getting FCM token during initialization:', error);
        }
      } else {
        console.log('📋 Permission not granted, FCM token will be retrieved after permission request');
      }

      this.isInitialized = true;
      console.log('✅ FCM Service initialized successfully');
      
      return true;
    } catch (error) {
      console.error('❌ FCM Service initialization failed:', error);
      return false;
    }
  }

  async registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
        console.log('✅ Service Worker registered:', registration);
        return registration;
      } catch (error) {
        console.error('❌ Service Worker registration failed:', error);
        throw error;
      }
    }
  }

  async requestPermission() {
    console.log('🔔 Requesting notification permission...');
    
    try {
      const result = await requestNotificationPermission();
      
      if (result.granted) {
        this.notificationPermission = 'granted';
        this.fcmToken = result.token;
        
        console.log('✅ Notification permission granted');
        console.log('🎫 FCM Token:', this.fcmToken);
        
        return {
          success: true,
          token: this.fcmToken,
          permission: 'granted'
        };
      } else {
        this.notificationPermission = 'denied';
        console.warn('⚠️ Notification permission denied');
        
        return {
          success: false,
          token: null,
          permission: 'denied'
        };
      }
    } catch (error) {
      console.error('❌ Error requesting notification permission:', error);
      return {
        success: false,
        error: error.message,
        permission: 'error'
      };
    }
  }

  async getFCMToken(forceRefresh = false) {
    // Return cached token if available and not forcing refresh
    if (this.fcmToken && !forceRefresh) {
      console.log('🎫 Using cached FCM token');
      return this.fcmToken;
    }

    // Check localStorage for persisted token
    if (!forceRefresh) {
      const savedToken = localStorage.getItem('fcm_token');
      const savedTimestamp = localStorage.getItem('fcm_token_timestamp');
      
      if (savedToken && savedTimestamp) {
        const tokenAge = Date.now() - parseInt(savedTimestamp);
        const maxAge = 24 * 60 * 60 * 1000; // 24 hours
        
        if (tokenAge < maxAge) {
          console.log('🎫 Using persisted FCM token from localStorage');
          this.fcmToken = savedToken;
          return this.fcmToken;
        } else {
          console.log('🎫 Persisted FCM token expired, refreshing...');
        }
      }
    }

    if (this.notificationPermission !== 'granted') {
      console.warn('⚠️ Cannot get FCM token without notification permission');
      return null;
    }

    try {
      console.log('🎫 Fetching new FCM token from Firebase...');
      this.fcmToken = await getFCMToken();
      
      if (this.fcmToken) {
        // Save to localStorage for persistence
        localStorage.setItem('fcm_token', this.fcmToken);
        localStorage.setItem('fcm_token_timestamp', Date.now().toString());
        
        console.log('✅ FCM Token retrieved and saved:', this.fcmToken);
        
        // Dispatch token ready event
        window.dispatchEvent(new CustomEvent('fcm-token-ready', {
          detail: { token: this.fcmToken }
        }));
      }
      
      return this.fcmToken;
    } catch (error) {
      console.error('❌ Error getting FCM token:', error);
      return null;
    }
  }

  setupForegroundMessageListener() {
    onMessageListener().then((payload) => {
      console.log('📱 Foreground FCM message received:', payload);
      
      // Handle emergency alerts in foreground
      this.handleForegroundMessage(payload);
      
      // Notify registered handlers
      this.foregroundMessageHandlers.forEach(handler => {
        try {
          handler(payload);
        } catch (error) {
          console.error('❌ Error in foreground message handler:', error);
        }
      });
    }).catch(error => {
      console.error('❌ Error setting up foreground message listener:', error);
    });
  }

  setupNotificationClickListener() {
    // Listen for service worker messages (notification clicks)
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        console.log('📬 Service Worker message received:', event.data);
        
        if (event.data.type === 'NOTIFICATION_CLICK') {
          this.handleNotificationClick(event.data.data);
        }
      });
    }
  }

  handleForegroundMessage(payload) {
    const { notification, data } = payload;
    
    // Check if it's an emergency alert
    const isEmergency = data?.severity === 'critical' || 
                        data?.alertType === '1' || 
                        data?.alertType === '2';
    
    if (isEmergency) {
      console.log('🚨 Emergency alert received in foreground:', payload);
      
      // Show high-priority local notification for emergency
      const title = '🚨 CẢNH BÁO KHẨN CẤP!';
      const options = {
        body: notification?.body || 'Phát hiện tình huống khẩn cấp từ thiết bị IoT',
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: 'emergency-alert',
        silent: false,
        data: {
          ...data,
          isEmergency: true,
          timestamp: new Date().toISOString()
        }
        // Note: requireInteraction and vibrate are not supported in local notifications
      };
      
      showLocalNotification(title, options);
      
      // Notify emergency alert handlers
      this.emergencyAlertHandlers.forEach(handler => {
        try {
          handler(payload);
        } catch (error) {
          console.error('❌ Error in emergency alert handler:', error);
        }
      });
    } else {
      // Regular notification
      const title = notification?.title || '🚨 Cảnh báo từ thiết bị';
      const options = {
        body: notification?.body || 'Thiết bị IoT có thông báo mới',
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: 'device-alert',
        data: data
      };
      
      showLocalNotification(title, options);
    }
  }

  handleNotificationClick(data) {
    console.log('🖱️ Notification clicked, data:', data);
    
    // Handle different notification actions
    if (data?.deviceSerial) {
      // Navigate to device page (implement based on your routing)
      console.log(`📱 Opening device page for: ${data.deviceSerial}`);
      
      // You can emit a custom event here for your app to handle
      window.dispatchEvent(new CustomEvent('fcm-notification-click', {
        detail: data
      }));
    }
  }

  // Show emergency Swal alert
  showEmergencySwal(alertData) {
    const { type, data } = alertData;
    
    let title = '🚨 CẢNH BÁO KHẨN CẤP!';
    let text = 'Phát hiện tình huống khẩn cấp từ thiết bị IoT';
    let icon = 'error';
    let confirmButtonColor = '#d33';
    
    switch (type) {
      case 'fire':
        title = '🔥 CẢNH BÁO CHÁY!';
        text = `Phát hiện cháy tại thiết bị ${data.serialNumber || 'Unknown'}`;
        if (data.temperature) {
          text += `\n🌡️ Nhiệt độ: ${data.temperature}°C`;
        }
        if (data.location) {
          text += `\n📍 Vị trí: ${data.location}`;
        }
        confirmButtonColor = '#ff4444';
        break;
        
      case 'smoke':
        title = '💨 CẢNH BÁO KHÓI!';
        text = `Phát hiện khói tại thiết bị ${data.serialNumber || 'Unknown'}`;
        if (data.smoke_level) {
          text += `\n📊 Mức độ khói: ${data.smoke_level}%`;
        }
        if (data.location) {
          text += `\n📍 Vị trí: ${data.location}`;
        }
        confirmButtonColor = '#888888';
        break;
        
      case 'gas':
      case 'emergency':
        title = '⚠️ CẢNH BÁO KHÍ GAS!';
        text = `Rò rỉ khí gas tại thiết bị ${data.serialNumber || 'Unknown'}`;
        if (data.gas_level) {
          text += `\n🔍 Nồng độ: ${data.gas_level} PPM`;
        }
        if (data.gas_type) {
          text += `\n⛽ Loại khí: ${data.gas_type}`;
        }
        if (data.location) {
          text += `\n📍 Vị trí: ${data.location}`;
        }
        confirmButtonColor = '#ff8800';
        break;
        
      default:
        if (data.message) {
          text = data.message;
        }
        if (data.serialNumber) {
          text += `\n📱 Thiết bị: ${data.serialNumber}`;
        }
        break;
    }

         // Show Swal with emergency actions
     const popupClass = type === 'fire' ? 'emergency-alert-popup fire-alert-popup' :
                       type === 'smoke' ? 'emergency-alert-popup smoke-alert-popup' :
                       type === 'gas' || type === 'emergency' ? 'emergency-alert-popup gas-alert-popup' :
                       'emergency-alert-popup';

     Swal.fire({
       title,
       text,
       icon,
       showCancelButton: true,
       showDenyButton: true,
       confirmButtonColor,
       cancelButtonColor: '#3085d6',
       denyButtonColor: '#28a745',
       confirmButtonText: '📞 Gọi cứu hỏa (114)',
       cancelButtonText: '👁️ Xem chi tiết',
       denyButtonText: '✖️ Đóng',
       allowEscapeKey: false,
       allowOutsideClick: false,
       timer: 30000, // Auto close after 30 seconds
       timerProgressBar: true,
       customClass: {
         popup: popupClass,
         title: 'emergency-alert-title',
         content: 'emergency-alert-content'
       },
      didOpen: () => {
        // Play emergency sound if available
        const audio = new Audio('/sounds/emergency-alert.mp3');
        audio.play().catch(() => {
          console.log('Emergency sound not available');
        });
        
        // Add vibration for mobile devices
        if (navigator.vibrate) {
          navigator.vibrate([200, 100, 200, 100, 200, 100, 200]);
        }
      }
    }).then((result) => {
      if (result.isConfirmed) {
        // Call emergency services
        window.open('tel:114', '_self');
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // View device details
        console.log('📱 Opening device details for:', data.serialNumber);
        
        // Dispatch event for navigation
        window.dispatchEvent(new CustomEvent('navigate-to-device', {
          detail: { deviceSerial: data.serialNumber }
        }));
      }
      // For deny (close), do nothing
    });
  }

  // Convert socket emergency alerts to FCM notifications
  sendEmergencyNotification(alertData) {
    console.log('🚨 Creating emergency notification from socket:', alertData);
    
    const { type, data } = alertData;
    
    // Show Swal alert first for immediate attention
    this.showEmergencySwal(alertData);
    
    // Get alert configuration from ALERT_TYPES
    let alertConfig = ALERT_TYPES.DEVICE; // Default
    let title = '🚨 CẢNH BÁO KHẨN CẤP!';
    let body = 'Phát hiện tình huống khẩn cấp';
    
    switch (type) {
      case 'fire':
        alertConfig = ALERT_TYPES.FIRE;
        title = alertConfig.title;
        body = `Phát hiện cháy tại thiết bị ${data.serialNumber || 'Unknown'}`;
        if (data.temperature) {
          body += `. Nhiệt độ: ${data.temperature}°C`;
        }
        break;
        
      case 'smoke':
        alertConfig = ALERT_TYPES.SMOKE;
        title = alertConfig.title;
        body = `Phát hiện khói tại thiết bị ${data.serialNumber || 'Unknown'}`;
        if (data.smoke_level) {
          body += `. Mức độ: ${data.smoke_level}%`;
        }
        break;
        
      case 'gas':
      case 'emergency':
        alertConfig = ALERT_TYPES.GAS;
        title = alertConfig.title;
        body = `Rò rỉ khí gas tại thiết bị ${data.serialNumber || 'Unknown'}`;
        if (data.gas_level) {
          body += `. Nồng độ: ${data.gas_level} PPM`;
        }
        break;
        
      default:
        if (data.message) {
          body = data.message;
        }
        if (data.serialNumber) {
          body += ` (${data.serialNumber})`;
        }
        break;
    }
    
    // Get notification channel configuration
    const isEmergency = ['fire', 'smoke', 'gas'].includes(type);
    const channel = isEmergency ? NOTIFICATION_CHANNELS.EMERGENCY : NOTIFICATION_CHANNELS.DEVICE;
    
    // Local notifications don't support actions - only basic options
    const localNotificationOptions = {
      body,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: alertConfig.channel,
      silent: false,
      data: {
        ...data,
        alertType: type,
        alertConfig: alertConfig.id,
        isEmergency: isEmergency,
        timestamp: new Date().toISOString(),
        deviceSerial: data.serialNumber,
        channel: channel.id,
        // Store action information for click handling
        availableActions: alertConfig.actions
      }
      // Note: vibrate, requireInteraction, actions are NOT supported in browser Notification API
      // These work only in service worker notifications (background notifications)
    };
    
    return showLocalNotification(title, localNotificationOptions);
  }

  // Register handlers for FCM events
  onForegroundMessage(handler) {
    this.foregroundMessageHandlers.add(handler);
    
    // Return unsubscribe function
    return () => {
      this.foregroundMessageHandlers.delete(handler);
    };
  }

  onEmergencyAlert(handler) {
    this.emergencyAlertHandlers.add(handler);
    
    // Return unsubscribe function  
    return () => {
      this.emergencyAlertHandlers.delete(handler);
    };
  }

  // Test FCM functionality
  async testNotification(type = 'test') {
    console.log(`🧪 Testing ${type} notification...`);
    
    if (this.notificationPermission !== 'granted') {
      console.warn('⚠️ Cannot test notification without permission');
      return false;
    }
    
    const testData = {
      type: 'emergency',
      data: {
        serialNumber: 'TEST_DEVICE_001',
        message: 'Test thông báo báo cháy từ FCM',
        temperature: 45,
        gas_level: 800,
        severity: 'critical',
        location: 'Phòng khách',
        timestamp: new Date().toISOString()
      }
    };
    
    switch (type) {
      case 'fire':
        testData.type = 'fire';
        testData.data.message = 'Test cảnh báo cháy';
        break;
        
      case 'smoke':
        testData.type = 'smoke';
        testData.data.message = 'Test phát hiện khói';
        testData.data.smoke_level = 75;
        break;
        
      case 'gas':
        testData.type = 'emergency';
        testData.data.message = 'Test rò rỉ khí gas';
        break;
    }
    
    this.sendEmergencyNotification(testData);
    return true;
  }

  // Refresh FCM token
  async refreshToken() {
    console.log('🔄 Refreshing FCM token...');
    
    // Clear current token
    this.fcmToken = null;
    localStorage.removeItem('fcm_token');
    localStorage.removeItem('fcm_token_timestamp');
    
    // Get new token
    return await this.getFCMToken(true);
  }

  // Clear FCM data
  clearFCMData() {
    console.log('🧹 Clearing FCM data...');
    
    this.fcmToken = null;
    localStorage.removeItem('fcm_token');
    localStorage.removeItem('fcm_token_timestamp');
    
    // Dispatch cleared event
    window.dispatchEvent(new CustomEvent('fcm-token-cleared'));
  }

  // Get service status
  getStatus() {
    const savedToken = localStorage.getItem('fcm_token');
    const savedTimestamp = localStorage.getItem('fcm_token_timestamp');
    
    let tokenAge = null;
    if (savedTimestamp) {
      tokenAge = Date.now() - parseInt(savedTimestamp);
    }
    
    return {
      isInitialized: this.isInitialized,
      hasToken: !!this.fcmToken,
      hasSavedToken: !!savedToken,
      permission: this.notificationPermission,
      token: this.fcmToken,
      savedToken: savedToken,
      tokenAge: tokenAge,
      tokenAgeHours: tokenAge ? Math.round(tokenAge / (60 * 60 * 1000)) : null,
      isSupported: 'Notification' in window && 'serviceWorker' in navigator,
      serviceWorkerRegistered: 'serviceWorker' in navigator && navigator.serviceWorker.controller,
      foregroundHandlers: this.foregroundMessageHandlers.size,
      emergencyHandlers: this.emergencyAlertHandlers.size
    };
  }
}

// Create singleton instance
const fcmService = new FCMService();

export default fcmService; 