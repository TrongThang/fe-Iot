# Test Fire Alerts System - User Guide

## Tổng quan

Hệ thống test fire alerts được tạo để kiểm tra FCM notifications khi có cảnh báo cháy/khí gas từ thiết bị IoT ESP8266. Hệ thống bao gồm:

1. **Test Service** - Simulate IoT device connections và events
2. **Test UI Component** - Interface để trigger test alerts
3. **Test API Endpoints** - Server-side test endpoints
4. **FCM Integration** - Test push notifications

## Cấu trúc hệ thống

### Frontend (UI)

```
ui/
├── src/
│   ├── services/
│   │   └── testFireAlerts.js       # Test service chính
│   ├── components/common/
│   │   └── TestFireAlerts.jsx      # UI component 
│   └── pages/User/
│       └── TestFireAlertsPage.jsx  # Test page
```

### Backend (IoT API)

```
IoT_HomeConnect_API_v2/
├── src/
│   ├── controllers/
│   │   └── test.controller.ts      # Test controller
│   └── routes/
│       └── test.routes.ts          # Test routes
```

## Cách sử dụng

### 1. Khởi động hệ thống

**Backend:**
```bash
cd IoT_HomeConnect_API_v2
npm start
# Server chạy trên http://localhost:3000
```

**Frontend:**
```bash
cd ui
npm start 
# UI chạy trên http://localhost:3001
```

### 2. Truy cập Test UI

Mở trình duyệt và truy cập: `http://localhost:3001/test-fire-alerts`

### 3. Setup FCM (Nếu chưa có)

1. Click **"Setup FCM"** trong UI
2. Allow notification permission khi browser hỏi
3. Kiểm tra FCM token được tạo thành công

### 4. Connect Test Device

1. Nhập API URL (mặc định: `http://localhost:3000`)
2. Nhập Serial Number (mặc định: `TEST_ESP8266_001`)  
3. Click **"Connect Test Device"**
4. Đợi connection status hiển thị ✅ Connected

### 5. Test Fire Alerts

#### Test cơ bản:
- **🔥 Fire Alarm** - Trigger cảnh báo cháy
- **💨 Smoke Detection** - Trigger phát hiện khói
- **⚠️ Gas Leak** - Trigger rò rỉ khí gas

#### Test scenarios có sẵn:
- **KITCHEN_FIRE** - Cháy bếp (nhiệt độ cao)
- **BEDROOM_SMOKE** - Khói phòng ngủ
- **GAS_LEAK_LAUNDRY** - Rò gas phòng giặt
- **GENERAL_EMERGENCY** - Báo động chung

#### Test nâng cao:
- **🚨 Emergency Sequence** - Test chuỗi cảnh báo (smoke → gas → fire)
- **🏓 Test Ping** - Test kết nối với server

## Socket Events được test

### 1. alarm_trigger
```javascript
// Cảnh báo khẩn cấp (fire/gas)
{
  serialNumber: 'TEST_ESP8266_001',
  temperature: 95.5,
  smoke_level: 75,
  gas_level: 0,
  severity: 'critical',
  alarm_type: 'fire',
  location: 'Kitchen',
  sensor_id: 'FIRE_SENSOR_01',
  timestamp: '2024-01-15T10:30:00.000Z'
}
```

### 2. fire_detected
```javascript
// Phát hiện lửa cụ thể
{
  serialNumber: 'TEST_ESP8266_001',
  temperature: 90.2,
  flame_detected: true,
  sensor_value: 950,
  location: 'Kitchen',
  confidence: 95,
  timestamp: '2024-01-15T10:30:00.000Z'
}
```

### 3. smoke_detected
```javascript
// Phát hiện khói
{
  serialNumber: 'TEST_ESP8266_001',
  smoke_level: 85,
  air_quality: 'poor',
  visibility: 'low',
  location: 'Bedroom',
  sensor_type: 'optical',
  timestamp: '2024-01-15T10:30:00.000Z'
}
```

## FCM Notifications Test

### Client-side (Socket → FCM)
Khi test socket events, FCM service sẽ tự động:
1. Listen socket events: `emergency_alert`, `fire_alert`, `smoke_alert`
2. Convert thành local notifications
3. Trigger push notifications nếu app không focus

### Server-side FCM Test (Optional)
Sử dụng API endpoints để test FCM trực tiếp:

```bash
# Test fire alert từ server
curl -X POST http://localhost:3000/api/test/fire-alert \
  -H "Content-Type: application/json" \
  -d '{
    "serialNumber": "TEST_ESP8266_001",
    "alertType": "fire",
    "severity": "critical",
    "location": "Kitchen",
    "temperature": 95.5
  }'

# Test FCM notification trực tiếp
curl -X POST http://localhost:3000/api/test/fcm-notification \
  -H "Content-Type: application/json" \
  -d '{
    "accountId": 1,
    "title": "TEST: Fire Alert",
    "message": "Test fire alarm notification",
    "alertType": "fire"
  }'
```

## Kiểm tra kết quả

### 1. Test Results UI
- Tất cả test actions được hiển thị real-time trong **📊 Test Results**
- Mỗi result shows: icon, type, timestamp, và raw data
- Click **Clear** để xóa results

### 2. Browser Console  
```javascript
// FCM messages
🔧 Initializing FCM Service...
✅ FCM Service initialized successfully
🚨 Sending FCM notification for socket emergency alert
📱 Foreground FCM message received

// Socket events
🔥 Simulating FIRE DETECTED: {...}
💨 Simulating SMOKE DETECTED: {...}
⚠️ Simulating GAS LEAK: {...}
```

### 3. Browser Notifications
- **Foreground**: Local notification popup với custom actions
- **Background**: Browser push notification với "View Details" action

### 4. Network Tab
- Kiểm tra socket connections: `ws://localhost:3000/socket.io/`
- Kiểm tra API calls nếu dùng server-side test

## Troubleshooting

### ❌ Connection Failed
**Nguyên nhân**: IoT API server không chạy hoặc wrong URL
**Giải pháp**: 
- Kiểm tra server status: `http://localhost:3000/health`
- Verify API URL trong test UI

### ❌ FCM Permission Denied
**Nguyên nhân**: User từ chối notification permission
**Giải pháp**:
- Reset browser permissions cho localhost
- Reload page và click "Setup FCM" lại

### ❌ No Notifications Received
**Nguyên nhân**: FCM service chưa initialized hoặc wrong VAPID key
**Giải pháp**:
- Check browser console cho FCM errors
- Verify VAPID key trong `.env` file
- Test với simple `testFCMNotification()` method

### ❌ Socket Events Not Working
**Nguyên nhân**: Socket connection issues hoặc namespace mismatch
**Giải pháp**:
- Check test device connection status
- Verify namespace `/device` và `/client` trong API
- Test ping/pong để verify connection

## Predefined Test Scenarios

### KITCHEN_FIRE
```javascript
{
  type: 'fire_alarm',
  data: {
    temperature: 120,
    smoke_level: 90,
    location: 'Kitchen',
    severity: 'critical',
    alarm_type: 'fire'
  }
}
```

### BEDROOM_SMOKE
```javascript
{
  type: 'smoke_detected',
  data: {
    smoke_level: 75,
    location: 'Bedroom',
    air_quality: 'poor',
    visibility: 'low'
  }
}
```

### GAS_LEAK_LAUNDRY
```javascript
{
  type: 'gas_leak',
  data: {
    gas_level: 55,
    gas_type: 'LPG',
    location: 'Laundry Room',
    concentration: 'dangerous'
  }
}
```

### GENERAL_EMERGENCY
```javascript
{
  type: 'alarm_alert',
  data: {
    severity: 'high',
    alarm_type: 'emergency',
    location: 'Basement',
    alarmActive: true
  }
}
```

## Best Practices

### 1. Test Sequence
1. Setup FCM first
2. Connect test device
3. Test individual alerts trước
4. Test emergency sequence cuối
5. Check results sau mỗi test

### 2. Development Workflow
1. Start backend server
2. Start frontend UI
3. Open test page
4. Keep browser console open for debugging
5. Test FCM permissions trong incognito window

### 3. Production Testing
1. Sử dụng real Firebase project VAPID key
2. Test trên HTTPS domain
3. Test cross-browser compatibility
4. Verify notification actions work correctly

## API Reference

### Test Service Methods

```javascript
import testFireAlertsService from '@/services/testFireAlerts';

// Connect as test device
await testFireAlertsService.connectAsTestDevice(apiUrl, serialNumber);

// Trigger alerts
testFireAlertsService.triggerFireAlarm(data);
testFireAlertsService.triggerSmokeDetected(data);
testFireAlertsService.triggerGasLeak(data);
testFireAlertsService.triggerAlarmAlert(data);

// Test sequence
await testFireAlertsService.testEmergencySequence(options);

// Utils
testFireAlertsService.getConnectionStatus();
testFireAlertsService.disconnect();
```

### Socket Context Integration

```javascript
import { useSocketContext } from '@/contexts/SocketContext';

const { 
  fcmPermission, 
  fcmToken, 
  requestFCMPermission,
  testFCMNotification 
} = useSocketContext();

// Test FCM
await testFCMNotification('fire');  // fire, smoke, gas
```

## Kết luận

Test Fire Alerts System cung cấp một cách comprehensive để test toàn bộ flow:
**ESP8266 Device** → **Socket Events** → **FCM Notifications** → **User Experience**

System giúp developers và testers verify rằng emergency alerts hoạt động đúng trong mọi scenario mà không cần hardware ESP8266 thực tế. 