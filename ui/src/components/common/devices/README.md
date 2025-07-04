# IoT Device Control Components

Bộ components chuyên biệt để điều khiển các thiết bị IoT với giao diện trực quan và hiệu ứng đẹp mắt.

## Components

### 1. DoorControl.jsx

Component điều khiển cửa với animation 3D và visual feedback trực quan.

#### Features:
- ✅ Animation 3D khi mở/đóng cửa
- ✅ Hiển thị trạng thái khóa với indicator
- ✅ Switch controls và quick action buttons  
- ✅ Loading states và disabled states
- ✅ Motion lines animation khi thao tác
- ✅ Visual status indicators

#### Props:
```jsx
<DoorControl
  isOpen={boolean}          // Trạng thái cửa mở/đóng
  isLocked={boolean}        // Trạng thái khóa
  isLoading={boolean}       // Đang xử lý API
  onToggle={async (open) => {}}  // Callback khi toggle cửa
  onLock={async (locked) => {}}  // Callback khi toggle khóa
  disabled={boolean}        // Vô hiệu hóa controls
/>
```

#### Example:
```jsx
import DoorControl from './DoorControl';

function MyComponent() {
  const [doorOpen, setDoorOpen] = useState(false);
  const [doorLocked, setDoorLocked] = useState(false);

  return (
    <DoorControl
      isOpen={doorOpen}
      isLocked={doorLocked}
      onToggle={async (open) => {
        // API call
        await deviceApi.setDoorStatus(deviceId, open ? 'open' : 'closed');
        setDoorOpen(open);
      }}
      onLock={async (locked) => {
        // API call
        await deviceApi.setDoorLock(deviceId, locked);
        setDoorLocked(locked);
      }}
    />
  );
}
```

### 2. LightControl.jsx

Component điều khiển đèn với color picker, brightness control và preset modes.

#### Features:
- ✅ Light bulb visualization với glow effects
- ✅ Brightness slider với visual feedback
- ✅ 7 color preset modes (Ấm áp, Mát mẻ, Đêm, etc.)
- ✅ Custom color picker với hue slider
- ✅ Quick color buttons
- ✅ Power on/off với smooth transitions
- ✅ Animated light rays khi bật

#### Props:
```jsx
<LightControl
  isOn={boolean}            // Trạng thái bật/tắt
  brightness={number}       // Độ sáng (0-100)
  color={string}           // Màu sắc (hex format: #ffffff)
  colorMode={string}       // Chế độ màu ('manual', 'warm', 'cool', etc.)
  onToggle={async (on) => {}}       // Callback khi bật/tắt
  onBrightnessChange={(brightness) => {}}  // Callback khi thay đổi độ sáng
  onColorChange={(color) => {}}     // Callback khi thay đổi màu
  onColorModeChange={(mode) => {}}  // Callback khi thay đổi chế độ
  disabled={boolean}        // Vô hiệu hóa controls
/>
```

#### Color Modes:
- `manual` - Tùy chỉnh (Custom)
- `warm` - Ấm áp (#FFB366)
- `cool` - Mát mẻ (#87CEEB) 
- `night` - Đêm (#4169E1)
- `sunrise` - Bình minh (#FFA500)
- `focus` - Tập trung (#FFFFFF)
- `party` - Tiệc tùng (#FF1493)

#### Example:
```jsx
import LightControl from './LightControl';

function MyComponent() {
  const [lightState, setLightState] = useState({
    isOn: true,
    brightness: 75,
    color: '#ffffff',
    colorMode: 'warm'
  });

  return (
    <LightControl
      isOn={lightState.isOn}
      brightness={lightState.brightness}
      color={lightState.color}
      colorMode={lightState.colorMode}
      onToggle={async (on) => {
        await deviceApi.setLightPower(deviceId, on);
        setLightState(prev => ({...prev, isOn: on}));
      }}
      onBrightnessChange={(brightness) => {
        setLightState(prev => ({...prev, brightness}));
        deviceApi.setLightBrightness(deviceId, brightness);
      }}
      onColorChange={(color) => {
        setLightState(prev => ({...prev, color}));
        deviceApi.setLightColor(deviceId, color);
      }}
      onColorModeChange={(mode) => {
        setLightState(prev => ({...prev, colorMode: mode}));
        deviceApi.setLightMode(deviceId, mode);
      }}
    />
  );
}
```

### 3. DynamicDeviceDetail.jsx Integration

Components được tự động tích hợp vào `DynamicDeviceDetail` dựa trên:

#### Door Detection:
- `device.type === 'door'`
- `capabilities.category` contains 'access'
- `capabilities.capabilities` includes 'DOOR_CONTROL'

#### Light Detection:  
- `device.type === 'light'`
- `capabilities.category` contains 'lighting'
- `capabilities.capabilities` includes 'LIGHT_CONTROL', 'COLOR_CONTROL', or 'BRIGHTNESS_CONTROL'

## Demo Component

Sử dụng `DeviceControlDemo.jsx` để test và demo các tính năng:

```jsx
import DeviceControlDemo from './DeviceControlDemo';

// Hiển thị demo page
<DeviceControlDemo />
```

## Styling & Animations

### CSS Classes (globals.css):
```css
/* Door 3D animations */
.door-3d { transform-style: preserve-3d; }
.door-open { transform: rotateY(-25deg) translateX(8px); }
.door-closed { transform: rotateY(0deg) translateX(0px); }

/* Light glow effects */
.light-glow { animation: lightPulse 2s ease-in-out infinite alternate; }
.color-spectrum { /* Rainbow gradient background */ }

/* Interactive effects */
.device-control-btn:hover { transform: translateY(-1px); }
```

### Color Spectrum:
Sử dụng HSL color space cho smooth transitions:
- Hue: 0-360 degrees (Red→Orange→Yellow→Green→Cyan→Blue→Purple→Pink→Red)
- Saturation: 70% (vibrant colors)
- Lightness: 50% (balanced brightness)

## API Integration

### Device API Calls:
```javascript
// Door control
await deviceApi.updateDeviceControl(serialNumber, {
  door_status: open ? 'open' : 'closed',
  lock_status: locked ? 'locked' : 'unlocked'
});

// Light control  
await deviceApi.updateDeviceControl(serialNumber, {
  power_status: on,
  brightness: brightness,
  color: color,
  color_mode: mode
});
```

### Error Handling:
- Optimistic UI updates
- API call với 500ms debounce
- State rollback on API errors
- Loading states during processing

## Browser Support

- ✅ Chrome/Edge 88+
- ✅ Firefox 85+
- ✅ Safari 14+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- 🚀 Lightweight components (~15KB gzipped)
- 🚀 CSS-based animations (hardware accelerated)
- 🚀 Debounced API calls
- 🚀 Optimistic UI updates
- 🚀 Lazy loading of color calculations

## Contributing

1. Maintain TypeScript compatibility
2. Follow existing prop patterns
3. Add comprehensive error handling
4. Include loading states
5. Test on mobile devices
6. Update this README for new features 