# LED Backend Integration - Tích hợp LED với Backend API

## Tổng quan

Hệ thống điều khiển LED đã được cập nhật để tích hợp hoàn toàn với backend API routes, thay thế hard-coded presets bằng dữ liệu dynamic từ server.

## Backend API Routes

### 1. GET /:serialNumber/led-effects
Lấy danh sách LED effects có sẵn cho thiết bị
```javascript
// Response example
{
  "success": true,
  "effects": [
    { "name": "solid", "description": "Màu đơn sắc", "params": ["color"] },
    { "name": "blink", "description": "Nhấp nháy", "params": ["color1", "speed"] },
    { "name": "breathe", "description": "Hơi thở", "params": ["color1", "speed"] }
  ]
}
```

### 2. POST /:serialNumber/led-preset  
Apply LED preset đã định nghĩa sẵn
```javascript
// Request payload
{
  "serial_number": "ESP8266_ABC123",
  "preset": "party_mode",
  "duration": 30000  // Optional
}
```

### 3. POST /:serialNumber/led-effect
Set custom LED effect với parameters
```javascript
// Request payload
{
  "serial_number": "ESP8266_ABC123", 
  "effect": "rainbow",
  "speed": 500,
  "count": 0,
  "duration": 0,
  "color1": "#FF0000",
  "color2": "#00FF00"
}
```

### 4. POST /:serialNumber/stop-led-effect
Stop hiệu ứng LED hiện tại
```javascript
// Request payload
{} // Empty body
```

### 5. POST /devices/led-capabilities
Lấy đầy đủ LED capabilities và presets
```javascript
// Request payload
{
  "serial_number": "ESP8266_ABC123"
}

// Response example
{
  "success": true,
  "ledCapabilities": {
    "supported_effects": ["solid", "blink", "breathe", "rainbow"],
    "supported_presets": ["party_mode", "relaxation_mode", "gaming_mode"],
    "preset_descriptions": {
      "party_mode": "Ánh sáng disco nhấp nháy nhanh và đầy năng lượng",
      "relaxation_mode": "Ánh sáng tím nhẹ nhàng, nhịp đập chậm"
    },
    "color_palette": {
      "warm_colors": ["#FF8C69", "#FFE4B5"],
      "cool_colors": ["#87CEEB", "#6A5ACD"],
      "vibrant_colors": ["#FF0000", "#00FF00", "#0000FF"]
    },
    "recommended_combinations": [...]
  }
}
```

## Frontend Integration

### LED API Client (`ui/src/apis/modules/ledApi.js`)

```javascript
import ledApi from '../apis/modules/ledApi.js';

// Lấy LED presets từ backend
const presets = await ledApi.getLEDPresets(serialNumber);

// Apply preset qua backend
await ledApi.applyLEDPreset(serialNumber, 'party_mode');

// Set custom effect
await ledApi.setLEDEffect(serialNumber, {
  effect: 'rainbow',
  speed: 500,
  color1: '#FF0000'
});

// Stop effect
await ledApi.stopLEDEffect(serialNumber);
```

### Updated LightControl Component

#### Key Features:
1. **Dynamic Preset Loading**: Load từ backend thay vì hard-code
2. **Serial Number Integration**: Sử dụng `serialNumber` prop để gọi API
3. **Loading States**: Hiển thị loading skeleton khi fetch data
4. **Error Handling**: Fallback khi API thất bại
5. **Icon Mapping**: Map backend preset keys với UI icons

#### Usage:
```jsx
<LightControl
  isOn={currentValues.power_status}
  brightness={currentValues.brightness || 75}
  color={currentValues.color || '#ffffff'}
  colorMode={currentValues.color_mode || 'manual'}
  serialNumber={device?.serial_number} // ← Key prop for backend integration
  onToggle={handlePowerToggle}
  onBrightnessChange={(brightness) => handleControlChange('brightness', brightness)}
  onColorChange={(color) => handleControlChange('color', color)}
  onColorModeChange={(mode) => setCurrentValues(prev => ({...prev, color_mode: mode}))}
  disabled={device?.lock_status === 'locked'}
/>
```

## LED Presets từ Backend

### Supported Presets (từ backend):
1. **party_mode** - Tiệc tùng (Music icon)
2. **relaxation_mode** - Thư giãn (TreePine icon)  
3. **gaming_mode** - Gaming (Gamepad icon)
4. **alarm_mode** - Báo động (AlertTriangle icon)
5. **sleep_mode** - Ngủ (BedDouble icon)
6. **wake_up_mode** - Thức dậy (Coffee icon)
7. **focus_mode** - Tập trung (Lightbulb icon)
8. **movie_mode** - Xem phim (Film icon)
9. **romantic_mode** - Lãng mạn (Heart icon)
10. **celebration_mode** - Lễ hội (Gift icon)
11. **rainbow_dance** - Cầu vồng (Sparkles icon)
12. **ocean_wave** - Sóng biển (Waves icon)
13. **meteor_shower** - Sao băng (Star icon)
14. **christmas_mode** - Giáng sinh (TreePine icon)
15. **disco_fever** - Disco (Music icon)

### Preset Structure:
```javascript
{
  key: 'party_mode',
  label: 'Tiệc tùng',
  description: 'Ánh sáng disco nhấp nháy nhanh và đầy năng lượng',
  color: '#FF0080',
  brightness: 90,
  icon: Music, // Lucide React icon
  isSystemDefault: true
}
```

## Flow tích hợp

### 1. Component Mount
```
LightControl loads → Check serialNumber → Fetch LED presets from backend → Display presets
```

### 2. User chọn preset  
```
User clicks preset → Call ledApi.applyLEDPreset() → Backend applies preset → Update local UI state
```

### 3. Error Handling
```
API fails → Show error message → Use fallback presets → Continue working offline
```

### 4. Manual Color Change
```
User picks custom color → Update local state → Send color via onColorChange → No backend call needed
```

## Caching Strategy

- **Cache Duration**: 5 minutes
- **Cache Key**: `presets:${serialNumber}`
- **Cache Invalidation**: Auto refresh every 5 minutes or on error
- **Fallback**: Local presets nếu API không khả dụng

## UI Improvements

### 1. Loading States
- Skeleton loading cho presets
- Spinner indicator khi đang fetch
- Loading text phù hợp

### 2. Error Handling  
- Error banner với thông báo rõ ràng
- Fallback presets khi API thất bại
- Retry logic tự động

### 3. Visual Enhancements
- Serial number badge
- Backend status indicator
- Preset descriptions on hover
- Color preview cho mỗi preset

### 4. Developer Features
- Debug info trong development mode
- Console logging cho troubleshooting
- API call tracking

## Benefits

### 1. **Dynamic Content**
- Presets được load từ backend
- Dễ thêm/sửa presets mà không cần deploy frontend
- Có thể customize presets theo device type

### 2. **Better UX**
- Loading states smooth
- Error handling graceful
- Fallback content luôn available

### 3. **Maintainability**  
- Centralized preset management ở backend
- Consistent icon mapping
- Clear API structure

### 4. **Scalability**
- Support multiple device types
- Extensible preset system
- Device-specific capabilities

## Testing

### 1. API Integration Tests
```javascript
// Test preset loading
const presets = await ledApi.getLEDPresets('ESP8266_TEST123');
expect(presets).toHaveProperty('party_mode');

// Test preset application  
const result = await ledApi.applyLEDPreset('ESP8266_TEST123', 'party_mode');
expect(result.success).toBe(true);
```

### 2. Component Tests
```javascript
// Test loading states
render(<LightControl serialNumber="TEST123" />);
expect(screen.getByText('Đang tải preset từ server...')).toBeInTheDocument();

// Test fallback presets
render(<LightControl serialNumber={null} />);
expect(screen.getByText('Tiệc tùng')).toBeInTheDocument();
```

### 3. Error Handling Tests
```javascript
// Test API error handling
mockLedApi.getLEDPresets.mockRejectedValue(new Error('Network error'));
render(<LightControl serialNumber="TEST123" />);
expect(screen.getByText('Không thể tải preset từ server')).toBeInTheDocument();
```

## Configuration

### Environment Variables
```env
# Backend API endpoint
REACT_APP_API_BASE_URL=http://localhost:3000/api

# Development features
NODE_ENV=development
```

### Production Considerations
- Remove debug logging
- Error reporting integration
- Performance monitoring
- Caching optimization

## Migration từ Hard-coded Presets

### Before (Hard-coded):
```javascript
const colorPresets = {
  warm: { label: 'Ấm áp', color: '#FFB366' },
  cool: { label: 'Mát mẻ', color: '#87CEEB' }
};
```

### After (Backend Integration):
```javascript
const [colorPresets, setColorPresets] = useState({});

useEffect(() => {
  const loadPresets = async () => {
    const presets = await ledApi.getLEDPresets(serialNumber);
    setColorPresets(presets);
  };
  loadPresets();
}, [serialNumber]);
```

## Troubleshooting

### Common Issues:

1. **Presets không load**
   - Check serialNumber prop
   - Verify backend API endpoint
   - Check network connectivity

2. **Preset application fails**  
   - Verify device is online
   - Check device capabilities
   - Validate preset parameters

3. **UI không update**
   - Check onColorChange callbacks
   - Verify state management
   - Check React keys uniqueness

### Debug Commands:
```javascript
// Check loaded presets
console.log(Object.keys(colorPresets));

// Test API directly
ledApi.getLEDPresets('YOUR_SERIAL_NUMBER').then(console.log);

// Check cache
console.log(ledApi.cache);
```

## 🔧 Backend Routes

### LED Capabilities Route
```bash
POST /api/devices/:serialNumber/led-capabilities
```

**Request Body:**
```json
{
  "serial_number": "SERL12JUN2501LED24RGB001"
}
```

**Response:**
```json
{
  "success": true,
  "ledCapabilities": {
    "serial_number": "SERL12JUN2501LED24RGB001",
    "supported_effects": ["solid", "blink", "breathe", "rainbow", ...],
    "supported_presets": ["party_mode", "relaxation_mode", "gaming_mode", ...],
    "preset_descriptions": {
      "party_mode": "Ánh sáng disco nhấp nháy nhanh và đầy năng lượng",
      ...
    },
    "color_palette": {...},
    "recommended_combinations": [...],
    "performance_notes": {...}
  }
}
```

### Other LED Routes
```bash
POST /api/devices/:serialNumber/led-preset      # Apply preset
POST /api/devices/:serialNumber/led-effect      # Apply effect  
POST /api/devices/:serialNumber/stop-led-effect # Stop effect
GET  /api/devices/:serialNumber/led-effects     # Get effects
```

## 🧪 Testing Manual Mode Fix

### Issue Fixed
- **Problem**: Không thể quay về manual mode sau khi chọn preset
- **Root Cause**: selectedPreset state không sync với colorMode prop
- **Solution**: Thêm useEffect để sync selectedPreset với colorMode

### Test Steps

1. **Test Manual Mode Toggle:**
   ```javascript
   // Trong console browser
   // 1. Chọn một preset (ví dụ: party_mode)
   console.log('Current mode:', selectedPreset); // Should show 'party_mode'
   
   // 2. Click vào button "Tùy chỉnh" (manual)
   // 3. Kiểm tra custom color picker có xuất hiện không
   // 4. Thử thay đổi màu sắc
   ```

2. **Test Preset Loading:**
   ```javascript
   // Kiểm tra trong Network tab
   // Phải thấy request đến: /devices/{serialNumber}/led-capabilities
   // NOT: /devices/{serialNumber}/capabilities
   ```

3. **Test Color Mode Sync:**
   ```javascript
   // Test trong component parent (DynamicDeviceDetail)
   // Khi onColorModeChange được gọi với 'manual'
   // selectedPreset trong LightControl phải update thành 'manual'
   ```

4. **Test API Integration:**
   ```bash
   # Test backend route mới
   curl -X POST http://localhost:3001/api/devices/SERL12JUN2501LED24RGB001/led-capabilities \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -d '{"serial_number": "SERL12JUN2501LED24RGB001"}'
   ```

## 🐛 Debug Tips

### Console Logs to Watch
```javascript
// LightControl component
🔄 LightControl: Syncing selectedPreset with colorMode prop: manual
🎨 LightControl: Preset change to manual
🎨 LightControl: Custom color change to #ff0000 (sẽ gửi lên API)

// LEDApi logs  
🔍 Fetching LED capabilities for device: SERL12JUN2501LED24RGB001
✅ Loaded 15 LED presets from backend
📡 Applying LED preset "party_mode" via backend API
```

### Common Issues
1. **Custom color picker không hiện:** Kiểm tra `selectedPreset === 'manual'`
2. **API 404 error:** Đảm bảo backend route `/led-capabilities` đã được thêm
3. **Preset không load:** Kiểm tra serialNumber prop có đúng không
4. **State không sync:** Kiểm tra useEffect [colorMode] dependency 