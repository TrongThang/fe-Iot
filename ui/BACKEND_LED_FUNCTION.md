# Backend LED Function - getLEDCapabilities

## 📍 Hàm chính: `getLEDCapabilities`

Đây là hàm trong `IoT_HomeConnect_API_v2/src/controllers/device.controller.ts` (dòng 444-576) để lấy toàn bộ thông tin LED capabilities của thiết bị.

### 🎯 API Endpoint
```
POST /devices/led-capabilities
Content-Type: application/json
Authorization: Bearer <token>

{
  "serial_number": "ESP8266_ABC123"
}
```

### 📊 Response Structure

```json
{
  "success": true,
  "ledCapabilities": {
    "serial_number": "ESP8266_ABC123",
    "supported_effects": [
      "solid", "blink", "breathe", "rainbow", "chase",
      "fade", "strobe", "sparkle", "colorWave", "rainbowMove", 
      "disco", "meteor", "pulse", "twinkle", "fireworks"
    ],
    "supported_presets": [
      "party_mode", "relaxation_mode", "gaming_mode", "alarm_mode",
      "sleep_mode", "wake_up_mode", "focus_mode", "movie_mode",
      "romantic_mode", "celebration_mode", "rainbow_dance",
      "ocean_wave", "meteor_shower", "christmas_mode", "disco_fever"
    ],
    "preset_descriptions": {
      "party_mode": "Ánh sáng disco nhấp nháy nhanh và đầy năng lượng",
      "relaxation_mode": "Ánh sáng tím nhẹ nhàng, nhịp đập chậm",
      "gaming_mode": "Sóng màu rực rỡ, năng động",
      "alarm_mode": "Đèn nháy màu đỏ dồn dập, mạnh mẽ cho tình huống khẩn cấp",
      "sleep_mode": "Ánh sáng ấm áp, nhẹ nhàng như hơi thở",
      "wake_up_mode": "Mô phỏng bình minh dịu nhẹ",
      "focus_mode": "Ánh sáng xanh da trời ổn định, tạo sự tập trung",
      "movie_mode": "Ánh xanh sâu, nhịp thở nhẹ nhàng tạo không gian",
      "romantic_mode": "Ánh hồng nhấp nháy nhẹ nhàng, thường xuyên tạo không gian lãng mạn",
      "celebration_mode": "Pháo hoa vàng rực rỡ, bùng nổ",
      "rainbow_dance": "Cầu vồng chuyển động rực rỡ, siêu nhanh",
      "ocean_wave": "Sóng biển xanh dịu dàng, chảy trôi",
      "meteor_shower": "Mưa sao băng trắng rơi nhanh, đầy kịch tính",
      "christmas_mode": "Sóng màu đỏ-xanh lá lễ hội, năng động",
      "disco_fever": "Đèn disco đa màu rực rỡ, siêu nhanh"
    },
    "parameters": {
      "speed": {
        "min": 50,
        "max": 5000,
        "default": 500,
        "description": "Tốc độ hiệu ứng tính bằng mili giây (giá trị thấp = nhanh hơn)"
      },
      "brightness": {
        "min": 0,
        "max": 100,
        "default": 100,
        "description": "Phần trăm độ sáng của đèn LED"
      },
      "count": {
        "min": 0,
        "max": 100,
        "default": 0,
        "description": "Số lần lặp lại (0 = vô hạn)"
      },
      "duration": {
        "min": 0,
        "max": 60000,
        "default": 0,
        "description": "Thời lượng hiệu ứng tính bằng mili giây (0 = vô hạn)"
      }
    },
    "color_palette": {
      "warm_colors": ["#FF8C69", "#FFE4B5", "#FFDAB9", "#F0E68C"],
      "cool_colors": ["#87CEEB", "#6A5ACD", "#4169E1", "#0077BE"],
      "vibrant_colors": ["#FF0000", "#00FF00", "#0000FF", "#FF00FF", "#FFFF00", "#00FFFF"],
      "festive_colors": ["#FF0000", "#00FF00", "#FFD700", "#FF4500"],
      "romantic_colors": ["#FF69B4", "#FF1493", "#DC143C", "#B22222"]
    },
    "recommended_combinations": [
      {
        "name": "Sắc Hoàng Hôn",
        "effect": "colorWave",
        "speed": 800,
        "color1": "#FF8C69",
        "color2": "#FF4500",
        "brightness": 80
      },
      {
        "name": "Gió Biển",
        "effect": "pulse",
        "speed": 3000,
        "color1": "#0077BE",
        "color2": "#40E0D0",
        "brightness": 70
      },
      {
        "name": "Ánh Sáng Rừng",
        "effect": "twinkle",
        "speed": 600,
        "color1": "#228B22",
        "color2": "#ADFF2F",
        "brightness": 75
      },
      {
        "name": "Sao Thiên Hà",
        "effect": "meteor",
        "speed": 300,
        "color1": "#9370DB",
        "color2": "#4B0082",
        "brightness": 85
      }
    ],
    "performance_notes": {
      "disco": "Sử dụng CPU cao - giảm tốc độ nếu ESP8266 trở nên không ổn định",
      "fireworks": "Hoạt ảnh phức tạp - có thể cần điều chỉnh trên thiết bị chậm hơn",
      "meteor": "Sử dụng nhiều bộ nhớ do tính toán vệt sáng",
      "colorWave": "Hiệu suất mượt mà, phù hợp cho sử dụng liên tục",
      "rainbowMove": "Tốc độ cập nhật cao - đảm bảo nguồn điện ổn định",
      "disco_fever": "Hiệu ứng siêu nhanh - giới hạn thời lượng để tránh quá nhiệt"
    },
    "timestamp": "2024-01-15T10:30:00.000Z"
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## 🎨 Data Highlights

### 1. **15 LED Effects**
- `solid`, `blink`, `breathe`, `rainbow`, `chase`, `fade`, `strobe`, `sparkle`
- `colorWave`, `rainbowMove`, `disco`, `meteor`, `pulse`, `twinkle`, `fireworks`

### 2. **15 LED Presets** 
- Tất cả có description tiếng Việt chi tiết
- Cover đầy đủ scenarios: party, relax, gaming, alarm, sleep, focus, romantic, v.v.

### 3. **5 Color Palettes**
- **warm_colors**: Màu ấm (#FF8C69, #FFE4B5, #FFDAB9, #F0E68C)
- **cool_colors**: Màu lạnh (#87CEEB, #6A5ACD, #4169E1, #0077BE)  
- **vibrant_colors**: Màu sáng (đỏ, xanh lá, xanh dương, tím, vàng, cyan)
- **festive_colors**: Màu lễ hội (đỏ, xanh lá, vàng, cam)
- **romantic_colors**: Màu lãng mạn (hồng, đỏ đậm)

### 4. **4 Recommended Combinations**
- **Sắc Hoàng Hôn**: colorWave cam-đỏ 
- **Gió Biển**: pulse xanh dương-xanh ngọc
- **Ánh Sáng Rừng**: twinkle xanh lá
- **Sao Thiên Hà**: meteor tím-đậm

### 5. **Performance Notes**
- Ghi chú tối ưu cho ESP8266
- Warning về CPU, memory, heat
- Best practices cho continuous use

## 🔧 Frontend Integration

### 1. **LightControl Component**
Sử dụng presets từ backend:

```jsx
const [colorPresets, setColorPresets] = useState({});

useEffect(() => {
  const loadPresets = async () => {
    const capabilities = await ledApi.getLEDCapabilities(serialNumber);
    const presets = await ledApi.getLEDPresets(serialNumber);
    setColorPresets(presets);
  };
  loadPresets();
}, [serialNumber]);
```

### 2. **LEDCapabilitiesPanel Component**
Hiển thị đầy đủ thông tin từ backend:

```jsx
<LEDCapabilitiesPanel 
  serialNumber={device.serial_number}
  onApplyPreset={async (preset) => {
    await ledApi.applyLEDPreset(serialNumber, preset);
  }}
  onApplyEffect={async (effect) => {
    await ledApi.setLEDEffect(serialNumber, effect);
  }}
/>
```

### 3. **API Client Usage**

```javascript
import ledApi from '../apis/modules/ledApi.js';

// Lấy full capabilities
const capabilities = await ledApi.getLEDCapabilities(serialNumber);

// Lấy chỉ presets (processed)
const presets = await ledApi.getLEDPresets(serialNumber);

// Apply preset  
await ledApi.applyLEDPreset(serialNumber, 'party_mode');

// Apply custom effect
await ledApi.setLEDEffect(serialNumber, {
  effect: 'rainbow',
  speed: 500,
  color1: '#FF0000'
});
```

## 🐛 Known Issues & Fixes

### 1. Typo trong backend
```typescript
// Backend có typo:
'gaming_Mode': 'Sóng màu rực rỡ, năng động'
// Should be: 'gaming_mode'
```

**Frontend fix:**
```javascript
// Handle typo trong frontend
let description = capabilities.preset_descriptions[presetKey];
if (!description && presetKey === 'gaming_mode') {
    description = capabilities.preset_descriptions['gaming_Mode'];
}
```

### 2. Authentication Required
Function yêu cầu authentication:
```javascript
const accountId = req.user?.userId || req.user?.employeeId;
if (!accountId) throwError(ErrorCodes.UNAUTHORIZED, 'User not authenticated');
```

**Frontend fix:** Sử dụng đúng client với authentication
```javascript
import publicClient from '@/apis/clients/public.client'; // ✅ Correct
// Thay vì privateClient
```

## 🚀 Benefits của hệ thống mới

### 1. **Centralized Data**
- Tất cả LED info ở một endpoint
- Không cần hard-code ở frontend
- Easy maintenance và updates

### 2. **Rich Content**
- 15 presets với description tiếng Việt
- Color palettes organized by category  
- Performance optimization notes
- Technical parameters với min/max values

### 3. **Device-Specific**
- Có thể customize per device type
- Serial number tracking
- Timestamp cho caching

### 4. **Developer-Friendly**
- Clear structure với type definitions
- Comprehensive documentation
- Error handling guidelines

## 🎯 Usage Recommendations

### 1. **Presets for Quick Actions**
```jsx
// Dành cho user thông thường
<LightControl serialNumber={serialNumber} />
```

### 2. **Full Panel for Advanced Users**  
```jsx
// Dành cho power users
<LEDCapabilitiesPanel serialNumber={serialNumber} />
```

### 3. **Color Palette Integration**
```jsx
// Integrate color palettes vào color picker
const colorPalette = capabilities.color_palette.warm_colors;
```

### 4. **Performance Monitoring**
```javascript
// Log performance notes cho debugging
console.log('Performance notes:', capabilities.performance_notes);
```

## 📝 Testing

### Manual Testing:
```bash
# Test API directly
curl -X POST http://localhost:3000/api/devices/led-capabilities \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"serial_number": "ESP8266_TEST123"}'
```

### Frontend Testing:
```javascript
// Test trong browser console
const caps = await ledApi.getLEDCapabilities('ESP8266_TEST123');
console.log('Presets:', caps.supported_presets);
console.log('Effects:', caps.supported_effects);
console.log('Colors:', caps.color_palette);
```

Hàm `getLEDCapabilities` là core function cung cấp toàn bộ thông tin LED capabilities từ backend, giúp frontend có thể build rich UI experience mà không cần hard-code data! 🎨✨ 