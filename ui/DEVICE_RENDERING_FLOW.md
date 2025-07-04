# Luồng Chạy và Render Thiết Bị - Device Management System

## 📋 Tổng quan Hệ thống

Hệ thống Device Management được thiết kế theo kiến trúc **Dynamic Rendering** với khả năng hiển thị và điều khiển nhiều loại thiết bị IoT khác nhau một cách linh hoạt.

## 🔄 Luồng Chạy Chính (Main Flow)

### 1. **Entry Point - Device Management Page**
```
📁 ui/src/pages/User/devices/deviceManagement.jsx
```

**Chức năng:**
- Hiển thị danh sách tất cả thiết bị
- Tìm kiếm và lọc thiết bị
- Quản lý kết nối Socket real-time
- Điều hướng đến chi tiết thiết bị

**Socket Integration:**
```javascript
// Kết nối Socket cho real-time monitoring
const { 
    user, isConnected, connectSocket, 
    connectToDevice, deviceNotifications, 
    emergencyAlerts 
} = useSocketContext()

// Auto-connect khi user available
useEffect(() => {
    if (user && !isConnected) {
        connectSocket(user.id || user.account_id);
    }
}, [user, isConnected])

// Real-time monitoring cho device được chọn
useEffect(() => {
    if (selectedDevice && enableRealTime) {
        connectToDevice(selectedDevice.serial_number, user.id);
    }
}, [selectedDevice, enableRealTime])
```

### 2. **Device Detail Page**
```
📁 ui/src/pages/User/groups/house/space/device/deviceDetails.jsx
```

**Chức năng:**
- Fetch chi tiết thiết bị từ API
- Merge device data với deviceDetail
- Hiển thị header và thông tin cơ bản
- Delegate rendering chi tiết cho DynamicDeviceDetail

**Data Flow:**
```javascript
// Fetch device capabilities từ API
const fetchDeviceDetail = async () => {
    const response = await axiosPublic.get(`/devices/${device.serial_number}`);
    setDeviceDetail(response.data || null);
}

// Merge device data với API response
const mergedDevice = {
    ...device,
    ...deviceDetail,
    firmware_version: deviceDetail?.capabilities?.runtime?.firmware_version,
    template_type: deviceDetail?.capabilities?.runtime?.deviceType,
    current_value: deviceDetail?.current_value || device?.current_value,
    capabilities: deviceDetail?.capabilities?.merged_capabilities,
    category: deviceDetail?.capabilities?.category || "SAFETY"
}
```

### 3. **Dynamic Device Detail Component** ⭐
```
📁 ui/src/components/common/devices/DynamicDeviceDetail.jsx
```

**Đây là TRÁI TIM của hệ thống rendering!**

**Luồng hoạt động:**

#### 3.1. **Initialization & Capability Detection**
```javascript
useEffect(() => {
    if (device && deviceId) {
        fetchDeviceCapabilities();
        
        // Fetch door status nếu là door device
        const deviceType = device?.type?.toLowerCase();
        if (deviceType === 'door' && device.serial_number) {
            fetchDoorStatus();
        }
    }
}, [device]);
```

#### 3.2. **Fallback Capabilities System**
```javascript
const createFallbackCapabilities = (device) => {
    const deviceType = device.type || device.template_type || "unknown";
    
    switch (deviceType) {
        case "light":
            return {
                category: "LIGHTING",
                capabilities: ["LIGHT_CONTROL", "BRIGHTNESS_CONTROL", "COLOR_CONTROL"],
                controls: {
                    brightness: "slider",
                    color: "color_picker", 
                    power_status: "toggle"
                }
            };
        case "door":
            return {
                category: "DOOR_CONTROL",
                capabilities: ["DOOR_CONTROL", "LOCK_CONTROL"],
                controls: {
                    door_status: "toggle",
                    lock_status: "toggle"
                }
            };
        case "smoke":
            return {
                category: "SAFETY", 
                capabilities: ["GAS_DETECTION", "TEMPERATURE_MONITORING"],
                controls: {
                    gas: "slider",
                    temp: "slider",
                    sensitivity: "slider",
                    alarm_status: "toggle"
                }
            };
    }
}
```

#### 3.3. **Device Type Detection & Specialized Rendering**
```javascript
const renderSpecializedControl = () => {
    const deviceCategory = capabilities?.category?.toLowerCase();
    const deviceType = device?.type?.toLowerCase();
    
    // Door Control
    if (deviceCategory?.includes('door') || deviceType === 'door') {
        return <DoorControl />;
    }
    
    // Light Control  
    if (deviceCategory?.includes('lighting') || deviceType === 'light') {
        return <LightControl />;
    }
    
    return null; // Fallback to standard controls
}
```

## 🎨 Các Loại Render Thiết Bị

### 1. **ESP8266 Fire Alarm (Smoke Detector)**

**Capabilities:**
- `GAS_DETECTION` - Phát hiện khí gas
- `TEMPERATURE_MONITORING` - Giám sát nhiệt độ  
- `SMOKE_DETECTION` - Phát hiện khói
- `ALARM_CONTROL` - Điều khiển báo động

**Controls:**
- `gas` (slider): 0-2000 PPM
- `temp` (slider): 0-50°C
- `smoke_level` (slider): 0-100
- `sensitivity` (slider): 0-100%
- `alarm_status` (toggle): Bật/tắt báo động

**Visual Elements:**
- Icon: 🔥 `Flame`
- Color: `from-red-500 to-pink-500`
- Emergency alerts với âm thanh
- Real-time sensor readings

### 2. **ESP8266 LED Controller (Smart Light)**

**Component:** `LightControl.jsx`

**Capabilities:**
- `LIGHT_CONTROL` - Điều khiển bật/tắt
- `BRIGHTNESS_CONTROL` - Điều chỉnh độ sáng
- `COLOR_CONTROL` - Thay đổi màu sắc

**Controls:**
- `power_status` (toggle): Bật/tắt đèn
- `brightness` (slider): 1-100%
- `color` (color_picker): HEX color picker
- `color_mode` (preset): Chế độ màu có sẵn

**Color Presets:**
```javascript
const colorPresets = {
    manual: { label: 'Tùy chỉnh', color: color },
    warm: { label: 'Ấm áp', color: '#FFB366' },
    cool: { label: 'Mát mẻ', color: '#87CEEB' },
    night: { label: 'Đêm', color: '#4169E1' },
    sunrise: { label: 'Bình minh', color: '#FFA500' },
    focus: { label: 'Tập trung', color: '#FFFFFF' },
    party: { label: 'Tiệc tùng', color: '#FF1493' }
}
```

**Visual Elements:**
- Bulb visualization với light rays
- Color hue slider với gradient background
- Quick color buttons
- Real-time brightness feedback

### 3. **ESP-01 Door Controller**

**Component:** `DoorControl.jsx`

**Capabilities:**
- `DOOR_CONTROL` - Mở/đóng cửa
- `LOCK_CONTROL` - Khóa/mở khóa

**Controls:**
- `door_status` (toggle): Mở/đóng cửa
- `lock_status` (toggle): Khóa/mở khóa
- `motion_detected` (readonly): Phát hiện chuyển động

**ESP-01 Optimizations:**
- Batched commands để tiết kiệm memory
- Simplified JSON payload
- Retry logic cho unstable connections

**Visual Elements:**
- 3D door animation với rotation effects
- Lock indicator
- Motion lines khi đang hoạt động
- Status badges

### 4. **Security Camera**

**Component:** `CameraControl.jsx`

**Capabilities:**
- `VIDEO_STREAMING` - Live video stream
- `MOTION_DETECTION` - Phát hiện chuyển động
- `RECORDING_CONTROL` - Điều khiển ghi hình

**Controls:**
- `recording` (toggle): Bật/tắt ghi hình
- `motion_alert` (toggle): Cảnh báo chuyển động
- `night_mode` (toggle): Chế độ ban đêm

**Visual Elements:**
- Live video stream
- Recording indicator
- Motion detection zones
- Storage usage display

### 5. **Environmental Sensor**

**Capabilities:**
- `TEMPERATURE_MONITORING`
- `HUMIDITY_MONITORING` 
- `PRESSURE_MONITORING`
- `LIGHT_MONITORING`
- `BATTERY_MONITORING`

**Controls:**
- `temp` (readonly): Nhiệt độ hiện tại
- `humidity` (readonly): Độ ẩm
- `pressure` (readonly): Áp suất
- `light_level` (readonly): Độ sáng môi trường
- `battery` (readonly): Mức pin

**Visual Elements:**
- Multi-sensor dashboard
- Battery indicator
- Trend charts (if implemented)

### 6. **ESP Socket Hub (Gateway)**

**Capabilities:**
- `GATEWAY_CONTROL` - Điều khiển gateway
- `DEVICE_MANAGEMENT` - Quản lý thiết bị con
- `NETWORK_MONITORING` - Giám sát mạng

**Controls:**
- `connected_devices` (readonly): Số thiết bị đã kết nối
- `network_status` (readonly): Trạng thái mạng
- `load` (readonly): Tải hệ thống

**Visual Elements:**
- Connected devices grid
- Network topology diagram
- System load indicators

## ⚙️ Control Types & Rendering

### 1. **Slider Control**
```javascript
case "slider":
    return (
        <div className="space-y-3">
            <div className="flex justify-between items-center">
                <span className="text-sm font-medium">{label}</span>
                <span className="text-sm text-slate-500">{value}{unit}</span>
            </div>
            <Slider
                value={[Number(value)]}
                max={controlKey === "temp" ? 50 : controlKey === "gas" ? 2000 : 100}
                min={0}
                step={1}
                onValueChange={(newValue) => handleControlChange(controlKey, newValue[0])}
            />
        </div>
    );
```

### 2. **Toggle Control**
```javascript
case "toggle":
    return (
        <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
            <span className="text-sm font-medium">{label}</span>
            <Switch
                checked={Boolean(value)}
                onCheckedChange={(checked) => {
                    if (controlKey === 'power_status') {
                        handlePowerToggle(checked);
                    } else {
                        handleControlChange(controlKey, checked);
                    }
                }}
            />
        </div>
    );
```

### 3. **Color Picker Control**
```javascript
case "color_picker":
    return (
        <div className="space-y-4">
            {/* Color Hue Slider */}
            <div className="relative h-8 flex items-center">
                <div className="absolute inset-0 h-4 rounded-lg"
                     style={{ background: 'linear-gradient(to right, #ff0000 0%, #ff8000 8.33%, ...)' }}
                />
                <input
                    type="range"
                    min={0} max={360} step={1}
                    value={currentHue}
                    onChange={(e) => {
                        const newHue = parseInt(e.target.value);
                        const colorValue = getColorFromHue(newHue);
                        handleControlChange(controlKey, colorValue);
                    }}
                />
            </div>
        </div>
    );
```

## 🔌 Real-time Socket Integration

### Socket Events Handling:
```javascript
// Device sensor data
socket.on('device:sensor_data', (data) => {
    setCurrentValues(prev => ({
        ...prev,
        ...data.sensor_readings
    }));
});

// Emergency alerts
socket.on('device:emergency_alert', (alert) => {
    // Show emergency notification
    // Play alert sound
    // Update UI with warning state
});

// Device commands
socket.on('device:command_response', (response) => {
    // Handle command acknowledgment
    // Update UI state based on response
});
```

## 🎯 API Integration Pattern

### Control Updates:
```javascript
const handleControlChange = (controlKey, value) => {
    // 1. Update local state immediately (optimistic update)
    setCurrentValues({ ...currentValues, [controlKey]: value });
    
    // 2. Debounce API calls
    setTimeout(async () => {
        try {
            await deviceApi.updateDeviceControl(serialNumber, {
                [controlKey]: value
            }, deviceId);
        } catch (error) {
            // Revert local state on API error
            setCurrentValues(prev => ({
                ...prev,
                [controlKey]: currentValues[controlKey]
            }));
        }
    }, 300);
};
```

### Bulk Updates:
```javascript
const bulkUpdateControls = async (updatesArray) => {
    try {
        const response = await deviceApi.bulkUpdateDeviceControls(
            serialNumber, 
            updatesArray, 
            serialNumber
        );
        return response;
    } catch (error) {
        console.error("Bulk update failed:", error);
        throw error;
    }
};
```

## 🔄 State Management Flow

### 1. **Device State Initialization:**
```
Device List → Device Selection → Fetch Detail → Merge Capabilities → Initialize Values
```

### 2. **Real-time Updates:**
```
Socket Event → Update Local State → Trigger Re-render → Update UI
```

### 3. **User Interactions:**
```
User Input → Optimistic Update → API Call → Success/Error Handling → State Reconciliation
```

## 🛡️ Error Handling & Fallbacks

### 1. **API Failures:**
- Fallback capabilities system
- Local state reversion
- User notification

### 2. **Socket Disconnections:**
- Auto-reconnection with exponential backoff
- Connection status indicators
- Graceful degradation

### 3. **Device Unresponsive:**
- Timeout handling
- Retry mechanisms
- Status indicators

## 📊 Performance Optimizations

### 1. **Debounced Updates:**
- 300ms debounce cho slider controls
- Batch multiple rapid changes

### 2. **Optimistic UI:**
- Immediate local state updates
- Revert on API failures

### 3. **Memoization:**
- React.memo cho expensive components
- useMemo cho computed values

### 4. **Socket Optimizations:**
- Room-based subscriptions
- Selective event listening
- Connection pooling

Hệ thống này cho phép mở rộng dễ dàng với các loại thiết bị mới bằng cách thêm capabilities mới và implement các component control tương ứng! 