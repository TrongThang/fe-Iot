# Frontend Mock Data Guide

## Tổng quan
Frontend mock data cho phép test tính năng Device Links mà không cần backend API. Hệ thống có thể chuyển đổi giữa Mock Mode và API Mode.

## Mock Data Structure

### 📱 **Devices** (7 devices)
1. **Living Room Temperature Sensor** - Có temperature & humidity sensors
2. **Front Door Motion Sensor** - Có motion & light sensors  
3. **Living Room Smart Light** - Có LED strip
4. **Kitchen Smart Switch** - Có relay switch
5. **Security Alarm System** - Có buzzer
6. **Bedroom Temperature Sensor** - Có temperature sensor
7. **Bedroom Smart Light** - Có LED strip

### 🔗 **Device Links** (4 links)
1. **Temperature > 30°C** → Bật Living Room Light
2. **Motion detected** → Bật Living Room Light  
3. **Motion detected** → Bật Security Alarm
4. **Temperature < 15°C** → Bật Kitchen Switch

### 🔧 **Components** (7 components)
- **Input**: Temperature, Humidity, Motion, Light sensors
- **Output**: LED Strip, Relay Switch, Buzzer

## Cách sử dụng

### 1. Bật Mock Mode
```jsx
// Trong DeviceLinksManagerV2.jsx
const [useMockData, setUseMockData] = useState(false);

// Toggle Mock Mode
<button onClick={() => setUseMockData(!useMockData)}>
    {useMockData ? 'Mock Mode' : 'API Mode'}
</button>
```

### 2. Auto-load Mock Data
Khi bật Mock Mode, data sẽ được load tự động:
- ✅ 7 thiết bị với components
- ✅ 4 device links sẵn có
- ✅ UI hiển thị ngay lập tức

### 3. Test các tính năng
- ✅ **Xem danh sách liên kết**: Hiển thị 4 links có sẵn
- ✅ **Tạo liên kết mới**: Chọn từ 2 thiết bị chưa liên kết
- ✅ **Xóa liên kết**: Click nút xóa → cập nhật UI ngay
- ✅ **Component selection**: Chọn component cụ thể

## UI Features

### 🎨 **Visual Indicators**
- **Header badge**: "Mock Mode" khi đang dùng mock data
- **Button color**: Orange cho Mock Mode, Gray cho API Mode
- **Description**: "Đang sử dụng dữ liệu demo"

### 📊 **Statistics** 
Khi có mock data:
- Tổng thiết bị: 7
- Thiết bị input: 3 (có thể tạo thêm links)
- Thiết bị output: 4 (có thể nhận links)
- Liên kết hiện có: 4

### ⚡ **Real-time Updates**
Mock data được cập nhật real-time:
- Tạo link → thêm vào danh sách ngay
- Xóa link → remove khỏi danh sách ngay
- Không cần reload trang

## API Mock Functions

### 📥 **Get Data**
```javascript
import { mockApiResponses } from '../utils/mockData';

// Get devices
const devices = mockApiResponses.getDevices();

// Get device links  
const links = mockApiResponses.getDeviceLinks();
```

### 📤 **Create Link**
```javascript
const linkData = {
    input_device_id: 'DEV_TEMP_002',
    output_device_id: 'DEV_LIGHT_002', 
    component_id: 'COMP_TEMP_001',
    value_active: '>25',
    logic_operator: 'AND'
};

const response = mockApiResponses.createDeviceLink(linkData);
// Returns: { success: true, data: newLink }
```

### 🗑️ **Delete Link**
```javascript
const response = mockApiResponses.deleteDeviceLink(linkId);
// Returns: { success: true, message: "..." }
```

## Testing Scenarios

### ✅ **Scenario 1: Empty State**
1. Bật Mock Mode → Load 7 devices + 4 links
2. UI hiển thị statistics và danh sách links

### ✅ **Scenario 2: Create Link**
1. Click "Tạo liên kết mới"
2. Step 1: Chọn Bedroom Temp + Bedroom Light
3. Step 2: Chọn Temperature component + ">25"
4. Tạo thành công → hiển thị trong danh sách

### ✅ **Scenario 3: Delete Link**
1. Click nút xóa trên link bất kỳ
2. Confirm → link biến mất khỏi danh sách
3. Statistics cập nhật ngay

### ✅ **Scenario 4: Mode Switching**
1. API Mode → Mock Mode: Load mock data
2. Mock Mode → API Mode: Clear data, call real API

## Files Structure

```
ui/src/
├── utils/
│   └── mockData.js              # Mock data definitions
├── components/common/devices/
│   └── DeviceLinksManagerV2.jsx # Main component with mock support
└── MOCK_DATA_GUIDE.md          # This guide
```

## Benefits

### 🚀 **Fast Development**
- Không cần backend running
- Test UI logic independent
- Instant data loading

### 🔄 **Reliable Testing**  
- Consistent test data
- Predictable scenarios
- No network dependencies

### 🎯 **Feature Testing**
- Test all CRUD operations
- Test edge cases
- Test UI states

## Tips

### 💡 **Quick Testing**
1. F5 → Vào Device Links → Tab "Mới"
2. Click "Mock Mode" → Data load ngay
3. Test tạo/xóa links

### 🐛 **Debugging**
- Console.log để xem mock data
- Check `useMockData` state
- Verify component có `flow_type` đúng

### 🔧 **Customize Mock Data**
Edit `ui/src/utils/mockData.js`:
- Thêm devices/components
- Modify existing links
- Change test scenarios

## Notes

- Mock data chỉ tồn tại trong memory
- Refresh page → data reset
- Switch mode → data reload
- Perfect cho demo & development! 