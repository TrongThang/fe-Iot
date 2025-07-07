// Firebase Configuration - Shared với SmartNet Solution
// Sử dụng cùng Firebase project "homeconnect-teamiot"

export const FIREBASE_CONFIG = {
    // VAPID Key (Required for FCM)
    // Get this from Firebase Console > Project Settings > Cloud Messaging > Web Push certificates
    VAPID_KEY: process.env.REACT_APP_FIREBASE_VAPID_KEY || 'your-vapid-key-here',
    
    // Firebase Config - SmartNet Solution Project
    API_KEY: process.env.REACT_APP_FIREBASE_API_KEY || 'AIzaSyDDG_6dS0sQf-ST3ZjzLCOO7JnhbA93Sek',
    AUTH_DOMAIN: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || 'homeconnect-teamiot.firebaseapp.com',
    PROJECT_ID: process.env.REACT_APP_FIREBASE_PROJECT_ID || 'homeconnect-teamiot',
    STORAGE_BUCKET: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || 'homeconnect-teamiot.firebasestorage.app',
    MESSAGING_SENDER_ID: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || '697438598174',
    APP_ID: process.env.REACT_APP_FIREBASE_APP_ID || '1:697438598174:web:0fb3109284f665c5532a0f',
    MEASUREMENT_ID: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || 'G-PVR53BGMC1'
};

// Instructions for setup:
// 1. Tạo file .env trong thư mục ui/
// 2. Thêm VAPID key: REACT_APP_FIREBASE_VAPID_KEY=your-actual-vapid-key
// 3. Restart development server
// 4. VAPID key lấy từ Firebase Console > Project Settings > Cloud Messaging > Web configuration

// Notification channels for IoT alerts
export const NOTIFICATION_CHANNELS = {
    EMERGENCY: {
        id: 'iot_emergency',
        name: 'IoT Emergency Alerts',
        importance: 'max',
        sound: 'emergency_alert',
        vibration: [200, 100, 200, 100, 200, 100, 200]
    },
    DEVICE: {
        id: 'iot_device',
        name: 'IoT Device Notifications', 
        importance: 'high',
        sound: 'default',
        vibration: [200, 100, 200]
    }
};

// Alert types mapping
export const ALERT_TYPES = {
    FIRE: {
        id: 'fire',
        icon: '🔥',
        title: 'CẢNH BÁO CHÁY!',
        channel: 'iot_emergency',
        actions: ['emergency_call', 'view', 'dismiss']
    },
    SMOKE: {
        id: 'smoke', 
        icon: '💨',
        title: 'PHÁT HIỆN KHÓI!',
        channel: 'iot_emergency',
        actions: ['emergency_call', 'view', 'dismiss']
    },
    GAS: {
        id: 'gas',
        icon: '⚠️',
        title: 'RÒ RỈ KHÍ GAS!',
        channel: 'iot_emergency', 
        actions: ['emergency_call', 'view', 'dismiss']
    },
    DEVICE: {
        id: 'device',
        icon: '📱',
        title: 'Thông báo từ thiết bị',
        channel: 'iot_device',
        actions: ['view', 'dismiss']
    }
}; 