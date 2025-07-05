# Hướng dẫn cấu hình FCM cho UI IoT

## Tổng quan
UI IoT đã được cấu hình để sử dụng cùng Firebase project với SmartNet Solution (`homeconnect-teamiot`). Hướng dẫn này sẽ giúp bạn setup VAPID key và enable FCM notifications cho thông báo báo cháy/khí gas.

## Bước 1: Firebase Project Setup (Đã có sẵn)

✅ **Đã sử dụng Firebase project của SmartNet Solution:**
- Project ID: `homeconnect-teamiot`
- Config đã được set trong `ui/src/config/firebase-config.js`
- Service Worker đã được cấu hình với Firebase 11.x

## Bước 2: Cấu hình VAPID Key

Tạo file `.env` trong thư mục `ui/` với nội dung:

```bash
# VAPID Key for FCM (Required)
REACT_APP_FIREBASE_VAPID_KEY=your-vapid-key-here

# IoT API Configuration  
REACT_APP_API_URL=http://localhost:3000
REACT_APP_SOCKET_URL=http://localhost:3000

# Optional: Override Firebase config (nếu cần)
# REACT_APP_FIREBASE_API_KEY=AIzaSyDDG_6dS0sQf-ST3ZjzLCOO7JnhbA93Sek
# REACT_APP_FIREBASE_PROJECT_ID=homeconnect-teamiot
```

**Lưu ý**: Firebase config đã được set sẵn trong `firebase-config.js` sử dụng project `homeconnect-teamiot` của SmartNet Solution.

## Bước 3: Lấy VAPID Key

1. Truy cập [Firebase Console](https://console.firebase.google.com/)
2. Chọn project **homeconnect-teamiot** (SmartNet Solution project)
3. Vào **Project Settings** > **Cloud Messaging**
4. Trong tab **Web configuration**, copy VAPID key đã có hoặc generate mới
5. Thêm key vào file `.env`:
   ```bash
   REACT_APP_FIREBASE_VAPID_KEY=your-actual-vapid-key-from-firebase
   ```

**Lưu ý**: Nếu SmartNet Solution đã có VAPID key, bạn có thể sử dụng chung key đó.

## Bước 4: Service Worker Setup (Đã hoàn thành)

✅ **Service Worker đã được cấu hình sẵn:**
- File `public/firebase-messaging-sw.js` đã có SmartNet Solution config
- Sử dụng Firebase 11.x compatible scripts
- Background message handling cho IoT emergency alerts

**Config hiện tại:**
```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-auth-domain",
  projectId: "your-project-Id",
  storageBucket: "your-storage-bucket",
  messagingSenderId: "your-message-sender-id",
  appId: "1:your-message-sender-id:web:1aaaa",
  measurementId: "your-measurement-id"
};
```

## Bước 5: Cài đặt Dependencies

```bash
cd ui
npm install firebase
npm start
```

## Bước 6: Sử dụng FCM trong Components

### Import FCMNotificationSetup component:

```jsx
import FCMNotificationSetup from '@/components/common/FCMNotificationSetup';

// Trong component của bạn
function MyPage() {
  return (
    <div>
      {/* Full setup UI */}
      <FCMNotificationSetup showTestButtons={true} />
      
      {/* Hoặc compact mode */}
      <FCMNotificationSetup compact={true} />
    </div>
  );
}
```

### Sử dụng FCM trong SocketContext:

```jsx
import { useSocketContext } from '@/contexts/SocketContext';

function MyComponent() {
  const { 
    fcmPermission, 
    fcmToken, 
    requestFCMPermission, 
    testFCMNotification 
  } = useSocketContext();

  const handleSetupFCM = async () => {
    if (fcmPermission !== 'granted') {
      const result = await requestFCMPermission();
      console.log('FCM setup result:', result);
    }
  };

  const testAlert = async () => {
    await testFCMNotification('fire');
  };

  return (
    <div>
      <button onClick={handleSetupFCM}>Setup FCM</button>
      <button onClick={testAlert}>Test Fire Alert</button>
    </div>
  );
}
```

## Tính năng đã implement

### ✅ FCM Configuration
- Firebase SDK integration
- Service Worker cho background notifications
- VAPID key support

### ✅ Socket Integration
- Tự động chuyển socket emergency alerts thành FCM notifications
- Hỗ trợ `emergency_alert`, `fire_alert`, `smoke_alert`
- Avoid duplicate notifications

### ✅ UI Components
- `FCMNotificationSetup`: Full setup UI với test buttons
- Compact mode cho navigation/header
- Permission request flow
- Test notification functionality

### ✅ Notification Types
- **Fire Alert**: 🔥 Cảnh báo cháy
- **Smoke Alert**: 💨 Phát hiện khói  
- **Gas Alert**: ⚠️ Rò rỉ khí gas
- **Emergency Call**: 📞 Gọi cứu hỏa (114)

### ✅ Background Features
- Notifications khi app đóng
- Custom notification actions
- Emergency vibration patterns
- Auto-focus app khi click notification

## Testing

### 1. Test Permission Request
```jsx
const { requestFCMPermission } = useSocketContext();
const result = await requestFCMPermission();
```

### 2. Test Notifications
```jsx
const { testFCMNotification } = useSocketContext();

// Test fire alert
await testFCMNotification('fire');

// Test smoke alert
await testFCMNotification('smoke');

// Test gas alert
await testFCMNotification('gas');
```

### 3. Test Socket Integration
Khi có socket emergency alert, FCM notification sẽ tự động được gửi.

## Troubleshooting

### 1. FCM không khởi tạo được
```
❌ Firebase Messaging is not supported in this browser
```
**Giải pháp**: Sử dụng Chrome, Firefox, hoặc Safari

### 2. Không nhận được notifications
```
⚠️ No FCM registration token available
```
**Giải pháp**: 
- Kiểm tra notification permission
- Kiểm tra VAPID key
- Kiểm tra Firebase configuration

### 3. Service Worker lỗi
```
❌ Service Worker registration failed
```
**Giải pháp**:
- Kiểm tra `public/firebase-messaging-sw.js` tồn tại
- Kiểm tra Firebase config trong service worker
- Clear browser cache

### 4. Notifications không hiển thị khi app mở
Đây là behavior bình thường. Khi app đang focus, FCM sẽ:
- Gọi `onMessage` callback
- Hiển thị local notification thay vì browser notification
- Trigger emergency alert UI

## Production Deployment

### 1. Environment Variables
Cập nhật `.env.production`:
```bash
REACT_APP_FIREBASE_API_KEY=prod-api-key
REACT_APP_FIREBASE_PROJECT_ID=prod-project-id
REACT_APP_API_URL=https://your-iot-api.domain.com
REACT_APP_SOCKET_URL=https://your-iot-api.domain.com
```

### 2. Service Worker
Đảm bảo service worker được serve đúng từ domain root.

### 3. HTTPS Required
FCM chỉ hoạt động trên HTTPS (except localhost).

## Integration với Server (Optional)

Nếu muốn server gửi FCM trực tiếp thay vì chỉ socket:

### 1. Gửi FCM token lên server
```jsx
const { fcmToken } = useSocketContext();

// Gửi token lên server khi login
if (fcmToken) {
  await fetch('/api/users/fcm-token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: fcmToken })
  });
}
```

### 2. Server lưu token và gửi FCM
Server có thể lưu FCM token và gửi notifications trực tiếp thay vì qua socket.

## Log Messages

Khi hoạt động bình thường, bạn sẽ thấy:

```
✅ Firebase initialized successfully
✅ Firebase Messaging initialized successfully  
🔧 Initializing FCM Service...
✅ FCM Service initialized successfully
✅ Service Worker registered
📋 Current notification permission: granted
🎫 FCM Token: eJzVFomu...
🚨 Sending FCM notification for socket emergency alert
📱 Foreground FCM message received
🚨 Emergency alert received in foreground
```

Hệ thống FCM đã được cấu hình hoàn chỉnh để nhận thông báo báo cháy/khí gas từ socket alerts và chuyển thành push notifications. 