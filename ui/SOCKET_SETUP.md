# Socket Setup và Cấu hình Real-time cho IoT UI

## Tổng quan

Ứng dụng UI này đã được tích hợp hoàn chỉnh với IoT_HomeConnect_API_v2 thông qua WebSocket để cung cấp:

- **Real-time monitoring**: Giám sát dữ liệu cảm biến trực tiếp
- **Device control**: Điều khiển thiết bị từ xa 
- **Emergency alerts**: Cảnh báo khẩn cấp (cháy, khói, gas)
- **LED effects**: Điều khiển hiệu ứng LED
- **Door control**: Điều khiển cửa thông minh

## Cấu hình môi trường

### 1. Tạo file `.env` trong thư mục `ui/`

```bash
# IoT API Configuration
REACT_APP_API_URL=http://localhost:3000

# Socket Configuration  
REACT_APP_SOCKET_URL=http://localhost:3000

# Development Configuration
REACT_APP_ENV=development

# Debug Settings
REACT_APP_DEBUG_SOCKET=true
REACT_APP_DEBUG_DEVICES=true

# Emergency Settings
REACT_APP_EMERGENCY_PHONE=114
REACT_APP_EMERGENCY_CONTACT=admin@example.com

# Device Connection Settings
REACT_APP_DEVICE_TIMEOUT=5000
REACT_APP_RECONNECT_ATTEMPTS=5
REACT_APP_RECONNECT_DELAY=2000
```

### 2. Cấu hình cho Production

```bash
# Production Configuration
REACT_APP_API_URL=https://your-iot-api.domain.com
REACT_APP_SOCKET_URL=https://your-iot-api.domain.com
REACT_APP_ENV=production
REACT_APP_DEBUG_SOCKET=false
REACT_APP_DEBUG_DEVICES=false
```

## Tính năng Socket đã implement

### 1. Socket Service (`ui/src/lib/socket.js`)

- ✅ Kết nối đến `/client` namespace của IoT API
- ✅ Auto-reconnection với exponential backoff
- ✅ Device-specific event handling
- ✅ Command sending với ESP8266 compatibility
- ✅ LED effects và door control
- ✅ Emergency alert handling

### 2. React Hooks (`ui/src/hooks/useSocket.js`)

- ✅ `useSocket`: Quản lý kết nối chính
- ✅ `useDeviceSocket`: Real-time device monitoring
- ✅ `useDoorSocket`: Điều khiển cửa
- ✅ `useLEDSocket`: Điều khiển LED
- ✅ `useGlobalDeviceNotifications`: Thông báo toàn cục

### 3. Context Management (`ui/src/contexts/SocketContext.js`)

- ✅ Global socket state management
- ✅ User authentication integration
- ✅ Device connection management
- ✅ Emergency alert coordination

### 4. UI Components

- ✅ `RealTimeDeviceControl`: Điều khiển real-time
- ✅ `EmergencyAlertSystem`: Hệ thống cảnh báo
- ✅ Device management integration

## Hướng dẫn sử dụng

### 1. Khởi chạy IoT API

```bash
cd IoT_HomeConnect_API_v2
npm install
npm start
```

API sẽ chạy tại `http://localhost:3000` với Socket.IO

### 2. Khởi chạy UI

```bash
cd ui
npm install
npm start
```

UI sẽ chạy tại `http://localhost:3001`

### 3. Sử dụng Real-time Features

1. **Đăng nhập** vào ứng dụng
2. **Chọn thiết bị** trong Device Management
3. **Bật Real-time** bằng nút "Bật Real-time"
4. **Xem dữ liệu** sensor real-time trong tab "Giám sát"
5. **Điều khiển** thiết bị trong tab "Điều khiển", "LED", "Cửa"

## Socket Events được hỗ trợ

### Client → Server Events

```javascript
// Device connection
socket.emit('start_real_time_device', { serialNumber })
socket.emit('stop_real_time_device', { serialNumber })

// Device commands
socket.emit('command', { action, state, timestamp })
socket.emit('door_command', { action, state, timestamp })

// LED controls
socket.emit('setEffect', { effect, speed, color1, color2 })
socket.emit('applyPreset', { preset, duration })
socket.emit('updateLEDState', { power_status, brightness, color })
```

### Server → Client Events

```javascript
// Real-time data
socket.on('sensorData', (data) => { /* temperature, humidity, gas */ })
socket.on('deviceStatus', (data) => { /* device state */ })
socket.on('alarmAlert', (data) => { /* emergency alerts */ })

// Device responses
socket.on('command_response', (data) => { /* command results */ })
socket.on('door_status', (data) => { /* door state */ })
socket.on('led_state_updated', (data) => { /* LED state */ })

// Emergency alerts
socket.on('emergency_alert', (data) => { /* critical alerts */ })
socket.on('fire_alert', (data) => { /* fire detection */ })
socket.on('smoke_alert', (data) => { /* smoke detection */ })
```

## Device Types được hỗ trợ

### 1. ESP8266 Fire Alarm
- Real-time sensor data (temperature, gas, smoke)
- Emergency alert broadcasting
- Test alarm functionality
- Reset alarm commands

### 2. ESP8266 LED Controller
- 15+ hiệu ứng LED: solid, blink, rainbow, disco, v.v.
- 15+ preset modes: party_mode, relaxation_mode, v.v.
- Color control và brightness adjustment
- ESP8266 memory optimization

### 3. ESP-01 Door Controller
- Door open/close commands
- Lock/unlock functionality  
- Status monitoring
- ESP-01 compatibility với memory constraints

### 4. ESP Socket Hub
- Multi-device gateway
- Command forwarding
- Device bridging

## Troubleshooting

### 1. Socket không kết nối được

```bash
# Kiểm tra API có chạy không
curl http://localhost:3000/health

# Kiểm tra Socket.IO endpoint
curl http://localhost:3000/socket.io/
```

### 2. Device không nhận được commands

- Kiểm tra device có online không trong IoT API logs
- Verify serialNumber đúng
- Check device permissions trong database

### 3. Real-time data không cập nhật

- Bật Debug mode: `REACT_APP_DEBUG_SOCKET=true`
- Xem Console logs cho socket events
- Kiểm tra device có emit sensorData không

### 4. Emergency alerts không hoạt động

- Kiểm tra audio permissions trong browser
- Verify alert events trong IoT API logs
- Check EmergencyAlertSystem component mounting

## Performance Notes

### ESP8266 Optimizations
- Command payload size limited (1KB)
- Auto-speed optimization for disco effects
- Memory-intensive preset duration limits
- Simplified command structure

### ESP-01 Compatibility
- Enhanced error handling
- Longer connection timeouts
- Simplified event structure
- Memory constraint considerations

## Security Considerations

- Socket connections require accountId authentication
- Device access validation through database
- Command authorization per user permissions
- Emergency alert rate limiting

## Development Tips

### Debug Socket Connection

```javascript
// Enable debug logging
localStorage.setItem('debug', 'socket.io-client:*');

// Monitor socket events
socketService.on('*', (event, data) => {
  console.log('Socket event:', event, data);
});
```

### Test Emergency Alerts

```javascript
// Simulate fire alert
socketService.emit('test_alarm', { 
  type: 'fire',
  severity: 'critical' 
});
```

### LED Effect Testing

```javascript
// Test LED effects
socketService.setLEDEffect('DEVICE_001', {
  effect: 'disco',
  speed: 200,
  color1: '#FF0000',
  color2: '#00FF00'
});
```

## API Compatibility

Tương thích với IoT_HomeConnect_API_v2:
- Socket.IO v4.8.1
- Namespace: `/client` và `/device`
- Engine.IO v3 support cho ESP8266
- JSON payload structure
- Error handling protocols

## Contributing

Khi thêm tính năng socket mới:

1. Update `socketService` với new events
2. Create corresponding React hooks
3. Add UI components nếu cần
4. Update documentation
5. Test với real ESP devices

---

**Lưu ý**: Đảm bảo IoT_HomeConnect_API_v2 đang chạy và có devices đăng ký trước khi test real-time features. 