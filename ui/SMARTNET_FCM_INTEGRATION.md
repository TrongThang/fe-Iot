# SmartNet FCM Integration Summary

## Tổng quan
UI IoT đã được cấu hình để sử dụng cùng Firebase project với SmartNet Solution (`homeconnect-teamiot`) để đồng bộ hóa FCM notifications.

## Thay đổi đã thực hiện

### 1. Firebase Configuration
- ✅ Cập nhật `ui/src/config/firebase.js` sử dụng project `homeconnect-teamiot`
- ✅ Tạo `ui/src/config/firebase-config.js` tương tự SmartNet Solution
- ✅ Cập nhật Firebase SDK từ 10.17.0 lên 11.10.0 (compatible với SmartNet)

### 2. Service Worker
- ✅ Cập nhật `ui/public/firebase-messaging-sw.js` với SmartNet config
- ✅ Sử dụng Firebase 11.x scripts thay vì 10.x
- ✅ Background message handling cho IoT emergency alerts

### 3. FCM Service Enhancement
- ✅ Import `ALERT_TYPES` và `NOTIFICATION_CHANNELS` từ firebase-config
- ✅ Cập nhật emergency notification logic sử dụng centralized config
- ✅ Dynamic notification channels (EMERGENCY vs DEVICE)
- ✅ Configurable notification actions based on alert type

### 4. Configuration Management
- ✅ Centralized Firebase config trong `firebase-config.js`
- ✅ Environment variables cho VAPID key override
- ✅ Alert types và notification channels configuration
- ✅ Shared config structure với SmartNet Solution

## Firebase Project Details

**Project**: `homeconnect-teamiot` (SmartNet Solution)
```javascript
{
  "apiKey": "AIzaSyDDG_6dS0sQf-ST3ZjzLCOO7JnhbA93Sek",
  "authDomain": "homeconnect-teamiot.firebaseapp.com",
  "projectId": "homeconnect-teamiot",
  "storageBucket": "homeconnect-teamiot.firebasestorage.app",
  "messagingSenderId": "697438598174",
  "appId": "1:697438598174:web:0fb3109284f665c5532a0f",
  "measurementId": "G-PVR53BGMC1"
}
```

## Enhanced Features

### Alert Types Configuration
```javascript
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
  }
};
```

### Notification Channels
```javascript
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
```

## Setup Requirements

### 1. Environment Variables
Chỉ cần thêm VAPID key vào `.env`:
```bash
REACT_APP_FIREBASE_VAPID_KEY=your-vapid-key-from-firebase-console
```

### 2. VAPID Key Setup
1. Truy cập [Firebase Console](https://console.firebase.google.com/)
2. Chọn project **homeconnect-teamiot**
3. Project Settings > Cloud Messaging > Web configuration
4. Copy VAPID key (hoặc generate nếu chưa có)
5. Thêm vào `.env` file

### 3. Dependencies
Firebase 11.x đã được cấu hình trong `package.json`:
```json
"firebase": "^11.10.0"
```

## Benefits of SmartNet Integration

### ✅ Shared Infrastructure
- Sử dụng chung Firebase project giảm cost và complexity
- Centralized FCM management cho cả 2 systems
- Consistent notification experience

### ✅ Enhanced Configuration
- Type-safe alert configurations
- Configurable notification channels
- Dynamic action buttons based on alert type
- Shared VAPID key management

### ✅ Future Scalability
- Easy to extend alert types
- Shared analytics and monitoring
- Cross-platform notification capabilities
- Unified user experience

## Testing

### FCM Token Test
```javascript
const { fcmToken } = useSocketContext();
console.log('FCM Token:', fcmToken);
```

### Emergency Alert Test
```javascript
const { testFCMNotification } = useSocketContext();
await testFCMNotification('fire');  // Test fire alert
await testFCMNotification('smoke'); // Test smoke alert
await testFCMNotification('gas');   // Test gas alert
```

### Socket Integration Test
Emergency socket events sẽ tự động trigger FCM notifications với config từ `ALERT_TYPES`.

## Migration Notes

### From Standalone Firebase Project
- ❌ Không cần tạo Firebase project mới
- ❌ Không cần setup riêng biệt
- ✅ Sử dụng infrastructure có sẵn của SmartNet

### From Old FCM Implementation
- ✅ Config được centralized và type-safe
- ✅ Enhanced alert types và channels
- ✅ Better notification actions và UX
- ✅ Consistent với SmartNet Solution patterns

## Troubleshooting

### 1. FCM Not Working
- Kiểm tra VAPID key trong `.env`
- Verify project ID: `homeconnect-teamiot`
- Check browser console for Firebase errors

### 2. Notifications Not Showing
- Kiểm tra notification permission
- Test với `testFCMNotification()` methods
- Verify service worker registration

### 3. Configuration Issues
- Check `firebase-config.js` imports
- Verify `ALERT_TYPES` và `NOTIFICATION_CHANNELS` available
- Check environment variables loading

## Conclusion

UI IoT hiện đã được tích hợp hoàn toàn với SmartNet Solution Firebase infrastructure, cung cấp:
- ✅ Unified FCM notifications
- ✅ Centralized configuration management  
- ✅ Enhanced emergency alert capabilities
- ✅ Consistent user experience across platforms
- ✅ Reduced infrastructure complexity và cost

System sẵn sàng cho production deployment với cùng Firebase project `homeconnect-teamiot`. 