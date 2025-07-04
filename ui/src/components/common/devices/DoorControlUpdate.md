# Door Control API Integration Update

## 🔧 Sự thay đổi lớn trong điều khiển cửa

### ❌ Trước đây (Sai):
- Bấm nút **"Mở/Đóng cửa"** → Chỉ thay đổi UI, không gọi API thật
- Bấm nút **"Bật/Tắt thiết bị"** → Gọi power API và cửa mới thực sự đóng/mở
- **Nhầm lẫn**: Power status ≠ Door status

### ✅ Bây giờ (Đúng):
- Bấm nút **"Mở/Đóng cửa"** → Gọi `POST /door/{serialNumber}/toggle` API
- Bấm nút **"Bật/Tắt thiết bị"** → Gọi device power API (riêng biệt)
- **Rõ ràng**: Door control và Device power là 2 chức năng độc lập

## 🚪 Door API Integration

### API Endpoints mới:
```javascript
// Mở/đóng cửa
POST /door/{serialNumber}/toggle
{
    "power_status": true,  // true = mở, false = đóng
    "force": false,
    "timeout": 5000
}

// Lấy trạng thái cửa
GET /door/{serialNumber}/status
// Response: { door_state: "open"|"closed", is_moving: boolean }
```

### Frontend Changes:

#### 1. deviceApi.js - Thêm Door APIs:
```javascript
toggleDoor: async (serialNumber, power_status, force, timeout) => {
    const response = await publicClient.post(
        `door/${serialNumber}/toggle`, 
        { power_status, force, timeout }
    );
    return response;
},

getDoorStatus: async (serialNumber) => {
    const response = await publicClient.get(`door/${serialNumber}/status`);
    return response;
}
```

#### 2. DynamicDeviceDetail.jsx - Separate Logic:
```javascript
// Door Toggle - sử dụng Door API riêng
onToggle={async (open) => {
    const response = await deviceApi.toggleDoor(device.serial_number, open);
    setCurrentValues(prev => ({
        ...prev,
        door_status: open ? 'open' : 'closed'
    }));
}}

// Door Lock - sử dụng Device Lock API
onLock={async (locked) => {
    if (locked) {
        await deviceApi.lockDevice(deviceId, device.serial_number);
    } else {
        await deviceApi.unlockDevice(deviceId, device.serial_number);
    }
}}
```

#### 3. State Management:
```javascript
// Tách biệt hoàn toàn door_status và power_status
door_status: device.current_value?.door_status || 'closed',  // Trạng thái cửa
power_status: device.power_status,                          // Trạng thái nguồn thiết bị
is_moving: false,                                           // Cửa đang chuyển động
lock_status: device.lock_status === 'locked'                // Trạng thái khóa
```

## 🎯 Kết quả:

### Trước:
- User bấm "Mở cửa" → Không có gì xảy ra thực tế
- User bấm "Bật thiết bị" → Cửa mở (confusing!)

### Sau:
- User bấm "Mở cửa" → Cửa thực sự mở qua Door API ✅
- User bấm "Bật thiết bị" → Device power on (logic) ✅
- User bấm "Khóa cửa" → Cửa bị khóa, không thể điều khiển ✅

## 🔄 Loading States:
- `isLoading={loading || currentValues.is_moving}` 
- Door API có timeout 5s default
- Error handling với state rollback
- Real-time feedback cho user

## 🧪 Testing:
1. Test với DeviceControlDemo component
2. Console logs cho mọi API calls
3. Error recovery khi API fails
4. State consistency check

**Tóm tắt**: Đã fix được bug "bấm đóng mở cửa không hoạt động" bằng cách tích hợp đúng Door API backend! 🎉 