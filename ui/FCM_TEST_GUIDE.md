# FCM Test Guide - Hướng dẫn kiểm tra Firebase Cloud Messaging

## 🔧 Tổng quan về cải tiến FCM

FCM service đã được cải tiến để:
- **Tự động lấy token** khi permission đã được cấp
- **Token persistence** với localStorage
- **Token refresh** với expiry check
- **Debug panel** để theo dõi và test

## 🚀 Cách test FCM

### 1. Mở FCM Debug Panel
- Nhấn **Ctrl+F** để mở/đóng FCM Debug Panel
- Panel sẽ hiển thị ở góc phải trên cùng

### 2. Kiểm tra trạng thái FCM
FCM Debug Panel hiển thị:
- **Initialized**: Service đã khởi tạo
- **Has Token**: Có FCM token
- **Permission**: Trạng thái permission (granted/denied/default)
- **Service Worker**: Service worker đã đăng ký
- **Token Age**: Tuổi của token (giờ)

### 3. Request Permission
Nếu permission chưa được cấp:
1. Click button **"Request Permission"**
2. Trình duyệt sẽ hiện popup xin permission
3. Click **"Allow"** để cấp permission
4. FCM token sẽ được tạo tự động

### 4. Test Notifications
Sau khi có permission:
- **Test**: Notification thông thường
- **🔥 Fire**: Cảnh báo cháy (có Swal popup)
- **💨 Smoke**: Cảnh báo khói (có Swal popup)
- **⚠️ Gas**: Cảnh báo rò rỉ gas (có Swal popup)

### 5. Refresh Token
- Click **"Refresh Token"** để lấy token mới
- Token cũ sẽ bị xóa và token mới được tạo

## 📱 Tính năng tự động

### Auto-initialization
- FCM service tự động khởi tạo khi load trang
- Nếu đã có permission, token sẽ được lấy tự động
- Không cần click gì cả!

### Token Persistence
- Token được lưu trong localStorage
- Tuổi thọ token: 24 giờ
- Tự động refresh khi token hết hạn

### Network Monitoring
Khi reload trang, check Network tab:
- **Có permission**: Sẽ có call đến Firebase để lấy token
- **Không permission**: Không có call nào (bình thường)

## 🔍 Debug và troubleshoot

### Kiểm tra Console
```javascript
// Xem trạng thái FCM
console.log('FCM Status:', fcmService.getStatus());

// Xem token hiện tại
console.log('FCM Token:', fcmService.fcmToken);

// Test notification
fcmService.testNotification('fire');
```

### Kiểm tra localStorage
```javascript
// Xem token đã lưu
console.log('Saved Token:', localStorage.getItem('fcm_token'));

// Xem timestamp
console.log('Token Timestamp:', localStorage.getItem('fcm_token_timestamp'));
```

### Xóa dữ liệu FCM
```javascript
// Xóa token và reset
fcmService.clearFCMData();
```

## 🚨 Emergency Notifications

### Swal Integration
Emergency notifications (fire, smoke, gas) sẽ hiển thị:
1. **Swal popup** với các action buttons
2. **Google notification** 
3. **Emergency Alert System card**
4. **Âm thanh cảnh báo** (nếu có)
5. **Rung điện thoại** (mobile)

### Action Buttons trong Swal
- **📞 Gọi cứu hỏa (114)**: Mở dialer
- **👁️ Xem chi tiết**: Navigate đến device
- **✖️ Đóng**: Đóng popup

## 🔄 Workflow testing

### Test 1: Lần đầu sử dụng
1. Load trang → FCM service khởi tạo
2. Ctrl+F → Mở debug panel
3. Permission: "default"
4. Click "Request Permission" → Cấp permission
5. Token được tạo tự động → Lưu vào localStorage
6. Test notification → Thành công

### Test 2: Reload trang (đã có permission)
1. Load trang → FCM service khởi tạo
2. Tự động lấy token từ Firebase (có network call)
3. Ctrl+F → Mở debug panel
4. Permission: "granted", Has Token: ✅
5. Test notification → Thành công

### Test 3: Token persistence
1. Load trang → Check localStorage trước
2. Token < 24h → Dùng token từ localStorage
3. Token > 24h → Refresh token mới
4. Ctrl+F → Xem token age

## 📊 Monitoring

### Network Tab
Khi reload trang và đã có permission:
- **fcmregistrations.googleapis.com**: Call để lấy token
- **firebase-messaging-sw.js**: Load service worker

### Console Logs
```
🔧 Initializing FCM Service...
📋 Current notification permission: granted
🎫 Permission already granted, getting FCM token...
🎫 Fetching new FCM token from Firebase...
✅ FCM Token retrieved and saved: eGF2aW...
✅ FCM Service initialized successfully
```

## 🐛 Troubleshooting

### Vấn đề: Không có network call
- Check permission status
- Nếu permission = "default" → Chưa request
- Nếu permission = "denied" → User từ chối

### Vấn đề: Token không được lưu
- Check localStorage quota
- Check console errors
- Refresh token thủ công

### Vấn đề: Notifications không hiển thị
- Check permission
- Check service worker registration
- Check notification settings của browser

## 🎯 Kết luận

Với các cải tiến này, FCM sẽ:
- **Tự động hoạt động** khi đã có permission
- **Có network call** mỗi khi reload (nếu cần)
- **Persist token** để tránh request không cần thiết
- **Dễ debug** với debug panel

Nhấn **Ctrl+F** để mở debug panel và bắt đầu test! 