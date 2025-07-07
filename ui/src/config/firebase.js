// Firebase configuration for IoT UI - Shared với SmartNet Solution
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage, isSupported } from 'firebase/messaging';
import { FIREBASE_CONFIG } from './firebase-config';

// Firebase config - Import từ centralized config
const firebaseConfig = {
  apiKey: FIREBASE_CONFIG.API_KEY,
  authDomain: FIREBASE_CONFIG.AUTH_DOMAIN,
  projectId: FIREBASE_CONFIG.PROJECT_ID,
  storageBucket: FIREBASE_CONFIG.STORAGE_BUCKET,
  messagingSenderId: FIREBASE_CONFIG.MESSAGING_SENDER_ID,
  appId: FIREBASE_CONFIG.APP_ID,
  measurementId: FIREBASE_CONFIG.MEASUREMENT_ID
};

// VAPID key cho FCM - Import từ config
const vapidKey = FIREBASE_CONFIG.VAPID_KEY;

let app;
let messaging;

try {
  // Initialize Firebase
  app = initializeApp(firebaseConfig);
  console.log('✅ Firebase initialized successfully');

  // Initialize Firebase Cloud Messaging
  if (typeof window !== 'undefined') {
    isSupported().then(supported => {
      if (supported) {
        messaging = getMessaging(app);
        console.log('✅ Firebase Messaging initialized successfully');
      } else {
        console.warn('❌ Firebase Messaging is not supported in this browser');
      }
    });
  }
} catch (error) {
  console.error('❌ Firebase initialization error:', error);
}

// Get registration token for FCM
export const getFCMToken = async () => {
  if (!messaging) {
    console.warn('❌ Firebase Messaging not initialized');
    return null;
  }

  try {
    const currentToken = await getToken(messaging, { vapidKey });

    if (currentToken) {
      console.log('✅ FCM registration token:', currentToken);
      return currentToken;
    } else {
      console.warn('⚠️ No FCM registration token available. Request permission first.');
      return null;
    }
  } catch (error) {
    console.error('❌ Error getting FCM token:', error);
    return null;
  }
};

// Request notification permission
export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    console.warn('❌ This browser does not support notifications');
    return false;
  }

  try {
    const permission = await Notification.requestPermission();

    if (permission === 'granted') {
      console.log('✅ Notification permission granted');

      // Get FCM token after permission granted
      const token = await getFCMToken();
      return { granted: true, token };
    } else {
      console.warn('⚠️ Notification permission denied');
      return { granted: false, token: null };
    }
  } catch (error) {
    console.error('❌ Error requesting notification permission:', error);
    return { granted: false, token: null };
  }
};

// Listen for foreground messages
export const onMessageListener = () => {
  return new Promise((resolve) => {
    if (!messaging) {
      console.warn('❌ Firebase Messaging not initialized');
      return;
    }

    onMessage(messaging, (payload) => {
      console.log('📱 Foreground message received:', payload);
      resolve(payload);
    });
  });
};

// Check notification permission status
export const getNotificationPermission = () => {
  if (!('Notification' in window)) {
    return 'not-supported';
  }
  return Notification.permission;
};

// Enhanced alert messages for gas and fire detection
const ALERT_MESSAGES = {
  gas: {
    title: '🔥 KHẨN CẤP - RÒ RỈ KHÍ GAS!',
    critical: 'Nồng độ khí gas CỰC KỲ NGUY HIỂM! Thoát khỏi khu vực NGAY và gọi cứu hỏa 114!',
    danger: 'Nồng độ khí gas NGUY HIỂM! Tắt van gas và thoát khỏi khu vực!',
    warning: 'Phát hiện khí gas! Kiểm tra van gas và mở cửa sổ thông gió.',
    actions: [
      '🚨 Thoát khỏi khu vực ngay lập tức',
      '📞 Gọi cứu hỏa 114',
      '🔧 Tắt van gas chính',
      '🪟 Mở cửa sổ thông gió',
      '⚡ KHÔNG bật thiết bị điện',
      '👥 Báo hàng xóm'
    ]
  },
  fire: {
    title: '🔥 KHẨN CẤP - PHÁT HIỆN LỬA!',
    critical: 'CHÁY LỚN! Gọi cứu hỏa 114 và thoát khỏi tòa nhà NGAY!',
    danger: 'Có nguy cơ cháy nghiêm trọng! Chuẩn bị thoát hiểm!',
    warning: 'Phát hiện dấu hiệu cháy! Kiểm tra ngay!',
    actions: [
      '📞 Gọi cứu hỏa 114 NGAY',
      '🏃 Thoát theo lối thoát hiểm',
      '🚫 KHÔNG dùng thang máy',
      '👥 Báo mọi người thoát hiểm',
      '🧯 Dùng bình cứu hỏa nếu an toàn',
      '💨 Dùng khăn ướt che mũi'
    ]
  },
  smoke: {
    title: '💨 CẢNH BÁO - PHÁT HIỆN KHÓI!',
    critical: 'Khói cực dày! Có hỏa hoạn nghiêm trọng! Thoát hiểm ngay!',
    danger: 'Khói dày! Có thể có hỏa hoạn! Chuẩn bị thoát hiểm!',
    warning: 'Phát hiện khói! Tìm nguồn khói và kiểm tra.',
    actions: [
      '🔍 Tìm nguồn khói',
      '🪟 Mở cửa sổ thông gió',
      '🍳 Kiểm tra bếp nấu',
      '⚡ Tắt thiết bị điện',
      '📞 Gọi cứu hỏa nếu cần',
      '👀 Theo dõi tình hình'
    ]
  },
  temperature: {
    title: '🌡️ CẢNH BÁO - NHIỆT ĐỘ CAO!',
    critical: 'Nhiệt độ CỰC CAO! Nguy cơ cháy nổ! Thoát khỏi khu vực!',
    danger: 'Nhiệt độ quá cao! Có nguy cơ cháy! Kiểm tra ngay!',
    warning: 'Nhiệt độ cao bất thường! Kiểm tra thiết bị điện.',
    actions: [
      '⚡ Tắt nguồn điện',
      '🔌 Kiểm tra dây điện',
      '🌡️ Theo dõi nhiệt độ',
      '🧯 Chuẩn bị bình cứu hỏa',
      '📞 Gọi thợ điện nếu cần',
      '👀 Không để không người'
    ]
  }
};

// Emergency contacts
const EMERGENCY_CONTACTS = {
  fire: { number: '114', name: 'Cứu hỏa' },
  police: { number: '113', name: 'Công an' },
  medical: { number: '115', name: 'Cấp cứu' },
  gas: { number: '19001909', name: 'Công ty Gas' }
};

// Get alert severity based on sensor values
const getAlertSeverity = (alertType, value) => {
  switch (alertType) {
    case 'gas':
      if (value >= 1000) return 'critical';
      if (value >= 600) return 'danger';
      return 'warning';
    case 'temperature':
      if (value >= 55) return 'critical';
      if (value >= 45) return 'danger';
      return 'warning';
    case 'smoke':
      if (value >= 800) return 'critical';
      if (value >= 500) return 'danger';
      return 'warning';
    case 'fire':
      return 'critical';
    default:
      return 'warning';
  }
};

// Get alert type from data
const getAlertType = (data) => {
  if (data.alertType?.includes('fire') || data.type?.includes('fire') || data.flame_detected) {
    return 'fire';
  }
  if (data.alertType?.includes('smoke') || data.type?.includes('smoke') || data.smoke_level) {
    return 'smoke';
  }
  if (data.alertType?.includes('gas') || data.type?.includes('gas') || data.gas_level || data.gasValue) {
    return 'gas';
  }
  if (data.alertType?.includes('temp') || data.type?.includes('temp') || data.temperature) {
    return 'temperature';
  }
  return 'fire'; // Default to fire for safety
};

// Enhanced emergency action dialog for gas and fire alerts
const showEmergencyActionDialog = (data) => {
  console.log('🚨 Enhanced emergency action dialog:', data);

  const alertType = getAlertType(data);
  const alertValue = data.gas_level || data.gasValue || data.temperature || data.smoke_level || 0;
  const severity = getAlertSeverity(alertType, alertValue);
  const alertInfo = ALERT_MESSAGES[alertType];

  if (!alertInfo) {
    console.error('Unknown alert type:', alertType);
    return;
  }

  // Get appropriate message based on severity
  const message = alertInfo[severity] || alertInfo.warning;
  
  // Enhanced data for UI
  const enhancedData = {
    ...data,
    alertType,
    severity,
    title: alertInfo.title,
    message,
    actions: alertInfo.actions,
    deviceName: data.deviceName || data.deviceSerial || data.serialNumber || 'Thiết bị không xác định',
    sensorValue: alertValue,
    emergencyContacts: EMERGENCY_CONTACTS
  };

  // Dispatch enhanced event for UI
  window.dispatchEvent(new CustomEvent('emergency-notification-action', {
    detail: enhancedData
  }));

  // For critical alerts, immediately suggest emergency call
  if (severity === 'critical') {
    console.log('🚨 CRITICAL EMERGENCY - Auto-suggesting emergency call');
    
    setTimeout(() => {
      const emergencyContact = alertType === 'gas' ? EMERGENCY_CONTACTS.gas : EMERGENCY_CONTACTS.fire;
      
      /* eslint-disable no-alert */
      const callEmergency = window.confirm(
        `${alertInfo.title}\n\n${message}\n\nTình huống CỰC KỲ NGUY HIỂM!\n\nBạn có muốn gọi ${emergencyContact.name} (${emergencyContact.number}) NGAY không?`
      );
      /* eslint-enable no-alert */

      if (callEmergency) {
        window.open(`tel:${emergencyContact.number}`, '_self');
      } else {
        // Show action selection
        showActionSelection(enhancedData);
      }
    }, 1000);
  } else {
    // For non-critical, show action selection after brief delay
    setTimeout(() => {
      showActionSelection(enhancedData);
    }, 500);
  }
};

// Show action selection for alerts
const showActionSelection = (data) => {
  const actionList = data.actions.map((action, index) => `${index + 1}. ${action}`).join('\n');
  
  /* eslint-disable no-alert */
  const userResponse = window.prompt(
    `${data.title}\n\n${data.message}\n\n` +
    `📱 Thiết bị: ${data.deviceName}\n` +
    `📊 Giá trị: ${data.sensorValue}\n` +
    `⏰ Thời gian: ${new Date().toLocaleString('vi-VN')}\n\n` +
    `💡 HÀNH ĐỘNG KHUYẾN NGHỊ:\n${actionList}\n\n` +
    `Nhập số (1-${data.actions.length}) để chọn hành động, hoặc 'call' để gọi khẩn cấp:`
  );
  /* eslint-enable no-alert */

  if (userResponse) {
    if (userResponse.toLowerCase() === 'call') {
      const emergencyContact = data.alertType === 'gas' ? 
        EMERGENCY_CONTACTS.gas : EMERGENCY_CONTACTS.fire;
      window.open(`tel:${emergencyContact.number}`, '_self');
    } else {
      const actionIndex = parseInt(userResponse) - 1;
      if (actionIndex >= 0 && actionIndex < data.actions.length) {
        /* eslint-disable no-alert */
        alert(
          `✅ Hành động được chọn:\n"${data.actions[actionIndex]}"\n\n` +
          `⚠️ Hãy thực hiện ngay để đảm bảo an toàn!\n\n` +
          `🆘 Nếu tình hình nghiêm trọng, hãy gọi cứu hỏa 114 ngay!`
        );
        /* eslint-enable no-alert */
        
        // Dispatch action selected event
        window.dispatchEvent(new CustomEvent('emergency-action-selected', {
          detail: {
            ...data,
            selectedAction: data.actions[actionIndex],
            actionIndex,
            timestamp: new Date().toISOString()
          }
        }));
      }
    }
  }
};

// Enhanced local notification with better gas/fire alert handling
export const showLocalNotification = (title, options = {}) => {
  if (!('Notification' in window)) {
    console.warn('❌ This browser does not support notifications');
    return;
  }

  if (Notification.permission === 'granted') {
    // Detect alert type and enhance notification
    const alertType = getAlertType(options.data || {});
    const alertValue = options.data?.gas_level || options.data?.gasValue || options.data?.temperature || options.data?.smoke_level || 0;
    const severity = getAlertSeverity(alertType, alertValue);
    const alertInfo = ALERT_MESSAGES[alertType];

    // Enhanced title and body for gas/fire alerts
    let enhancedTitle = title;
    let enhancedBody = options.body;

    if (alertInfo && (options.data?.isEmergency || options.data?.alertType)) {
      enhancedTitle = alertInfo.title;
      enhancedBody = alertInfo[severity] || alertInfo.warning;
      
      // Add device info to body
      if (options.data?.deviceName || options.data?.serialNumber) {
        enhancedBody += `\n\n📱 Thiết bị: ${options.data.deviceName || options.data.serialNumber}`;
      }
      
      // Add sensor value to body
      if (alertValue > 0) {
        const unit = alertType === 'gas' ? 'ppm' : alertType === 'temperature' ? '°C' : '';
        enhancedBody += `\n📊 Giá trị: ${alertValue}${unit}`;
      }
    }

    // Enhanced notification options
    const supportedOptions = {
      body: enhancedBody,
      icon: options.icon || '/img/iot_logo_icon.png',
      badge: options.badge || '/img/iot_logo_icon.png',
      tag: options.tag || `iot-${alertType}-alert`,
      image: options.image,
      data: {
        ...options.data,
        alertType,
        severity,
        enhancedTitle,
        enhancedBody,
        timestamp: new Date().toISOString()
      },
      silent: options.silent || false,
      requireInteraction: severity === 'critical', // Keep critical alerts visible
    };

    const notification = new Notification(enhancedTitle, supportedOptions);

    // Enhanced click handler
    notification.onclick = () => {
      console.log('🔔 Enhanced notification clicked:', alertType, severity);

      // Focus window
      if (window.focus) {
        window.focus();
      }

      // Close notification
      notification.close();

      // Handle emergency alerts with enhanced dialog
      if (options.data?.isEmergency || options.data?.alertType || alertType !== 'fire') {
        console.log(`📱 Emergency alert clicked: ${alertType} (${severity})`);

        // Show enhanced emergency dialog
        setTimeout(() => {
          showEmergencyActionDialog(supportedOptions.data);
        }, 100);

        // Dispatch enhanced emergency event
        window.dispatchEvent(new CustomEvent('emergency-notification-clicked', {
          detail: {
            ...supportedOptions.data,
            clickedAt: new Date().toISOString()
          }
        }));
      } else {
        // Regular notification click
        window.dispatchEvent(new CustomEvent('notification-clicked', {
          detail: {
            ...supportedOptions.data,
            clickedAt: new Date().toISOString()
          }
        }));
      }
    };

    // Enhanced auto-close timing based on severity
    let autoCloseTime;
    switch (severity) {
      case 'critical':
        autoCloseTime = 30000; // 30 seconds for critical
        break;
      case 'danger':
        autoCloseTime = 20000; // 20 seconds for danger
        break;
      default:
        autoCloseTime = 10000; // 10 seconds for warning
    }

    setTimeout(() => {
      notification.close();
    }, autoCloseTime);

    // For critical alerts, also play a sound and show browser alert
    if (severity === 'critical') {
      // Try to play emergency sound
      try {
        const audio = new Audio('/sounds/emergency-alert.wav');
        audio.volume = 0.5;
        audio.play().catch(e => console.warn('Cannot play emergency sound:', e));
      } catch (e) {
        console.warn('Emergency sound not available');
      }

      // Show additional browser alert for critical situations
      setTimeout(() => {
        if (document.hidden) { // Only if user is not actively viewing the page
          /* eslint-disable no-alert */
          alert(`${enhancedTitle}\n\n${enhancedBody}\n\n⚠️ TÌNH HUỐNG KHẨN CẤP - Vui lòng xử lý ngay!`);
          /* eslint-enable no-alert */
        }
      }, 2000);
    }

    return notification;
  } else {
    console.warn('⚠️ Notification permission not granted');
    return null;
  }
};

// Export enhanced constants for use by other components
export { ALERT_MESSAGES, EMERGENCY_CONTACTS, getAlertType, getAlertSeverity };

export { app, messaging };
export default firebaseConfig; 