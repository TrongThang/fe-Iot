# Current Value Editor 🎛️

## Tổng quan

CurrentValueEditor là component React cho phép người dùng chỉnh sửa giá trị `current_value` của thiết bị IoT với cấu trúc mới được gộp theo `component_id`.

## Cấu trúc dữ liệu

### Cấu trúc mới (Grouped by component_id):

```json
[
    {
        "component_id": "TEMP_123456",
        "flow_type": "input",
        "unit": "°C",
        "datatype": "NUMBER",
        "min": -40,
        "max": 85,
        "instances": [
            {
                "index": 1,
                "value": "25.0",
                "name_display": "Cảm biến nhiệt độ"
            }
        ]
    },
    {
        "component_id": "RELAY_345678",
        "flow_type": "output",
        "unit": null,
        "datatype": "BOOLEAN",
        "instances": [
            {
                "index": 1,
                "value": "false",
                "name_display": "Relay Module 1"
            },
            {
                "index": 2,
                "value": "false",
                "name_display": "Relay Module 2"
            }
        ]
    }
]
```

## Tính năng chính

### 🎯 Chỉnh sửa giá trị
- **NUMBER**: Input field với validation min/max
- **BOOLEAN**: Toggle switch (true/false)
- **STRING**: Text input field

### 🔄 Quản lý thay đổi
- Theo dõi thay đổi theo thời gian thực
- Highlight các field đã thay đổi
- Hiển thị giá trị gốc vs giá trị mới
- Nút "Đặt lại" để hoàn tác thay đổi

### 📊 Giao diện trực quan
- Collapsible components cho tiết kiệm không gian
- Badge màu sắc cho flow_type (input/output)
- Hiển thị metadata (unit, datatype, min/max)
- Validation constraints cho từng datatype

## Cách sử dụng

### 1. Import component

```jsx
import CurrentValueEditor from './components/common/devices/CurrentValueEditor';
```

### 2. Sử dụng trong component

```jsx
<CurrentValueEditor 
    device={device}
    currentValue={device?.current_value}
    onCurrentValueChange={(updatedCurrentValue) => {
        console.log('🔄 Current value updated:', updatedCurrentValue);
        // Xử lý cập nhật dữ liệu
    }}
/>
```

### 3. Props

| Prop | Type | Description |
|------|------|-------------|
| `device` | Object | Thông tin thiết bị (cần có `serial_number`) |
| `currentValue` | Array | Cấu trúc current_value theo format mới |
| `onCurrentValueChange` | Function | Callback khi có thay đổi |

## API Backend

### Endpoint
```
PUT /api/devices/{serialNumber}/current-value
```

### Request Body
```json
{
    "current_value": [
        {
            "component_id": "TEMP_123456",
            "flow_type": "input",
            "unit": "°C",
            "datatype": "NUMBER",
            "min": -40,
            "max": 85,
            "instances": [
                {
                    "index": 1,
                    "value": "26.5",
                    "name_display": "Cảm biến nhiệt độ"
                }
            ]
        }
    ]
}
```

### Response
```json
{
    "success": true,
    "data": {
        "device_id": "...",
        "serial_number": "...",
        "current_value": [...]
    },
    "message": "Current value updated successfully"
}
```

## Demo Component

Để test và hiểu cách hoạt động, sử dụng `DemoCurrentValueEditor`:

```jsx
import DemoCurrentValueEditor from './components/common/devices/DemoCurrentValueEditor';

function App() {
    return (
        <div>
            <DemoCurrentValueEditor />
        </div>
    );
}
```

## Validation

### Frontend Validation
- **NUMBER**: Min/max constraints từ component metadata
- **BOOLEAN**: Chỉ accept "true"/"false" string
- **STRING**: Text validation cơ bản

### Backend Validation
- Kiểm tra cấu trúc current_value (phải là array)
- Validate từng component có đầy đủ fields
- Validate từng instance có index và value
- Xác thực quyền truy cập thiết bị

## Luồng xử lý

1. **Load data**: Component nhận current_value từ props
2. **Edit**: Người dùng chỉnh sửa giá trị trong UI
3. **Track changes**: Theo dõi thay đổi và highlight
4. **Save**: Gửi request PUT đến API
5. **Update**: Cập nhật dữ liệu local và gọi callback

## Lợi ích

### 🎯 Tối ưu hóa dữ liệu
- Thông tin component chỉ lưu 1 lần
- Instances array chứa data riêng biệt
- Giảm trùng lặp dữ liệu

### 🔧 Dễ sử dụng
- Giao diện trực quan và thân thiện
- Validation tự động
- Feedback rõ ràng về thay đổi

### 🚀 Hiệu suất
- Lazy loading cho components lớn
- Optimized re-render
- Efficient state management

## Ví dụ thực tế

### Smart Home Controller
```json
[
    {
        "component_id": "TEMP_LIVING_ROOM",
        "flow_type": "input",
        "unit": "°C",
        "datatype": "NUMBER",
        "min": 10,
        "max": 40,
        "instances": [
            {
                "index": 1,
                "value": "22.5",
                "name_display": "Nhiệt độ phòng khách"
            }
        ]
    },
    {
        "component_id": "LIGHT_CONTROLLER",
        "flow_type": "output",
        "unit": null,
        "datatype": "BOOLEAN",
        "instances": [
            {
                "index": 1,
                "value": "true",
                "name_display": "Đèn phòng khách"
            },
            {
                "index": 2,
                "value": "false",
                "name_display": "Đèn phòng ngủ"
            }
        ]
    }
]
```

## Troubleshooting

### Common Issues

1. **API Error 400**: Kiểm tra cấu trúc current_value
2. **API Error 403**: Kiểm tra quyền truy cập thiết bị
3. **API Error 404**: Kiểm tra serial_number thiết bị
4. **UI not updating**: Kiểm tra onCurrentValueChange callback

### Debug Tips

```javascript
// Log current value structure
console.log('Current value structure:', JSON.stringify(currentValue, null, 2));

// Check component instances
currentValue.forEach(comp => {
    console.log(`Component ${comp.component_id}: ${comp.instances.length} instances`);
});
```

## Tương lai

### Planned Features
- [ ] Bulk edit cho multiple instances
- [ ] Export/Import current_value
- [ ] History tracking
- [ ] Advanced validation rules
- [ ] Real-time sync với thiết bị
- [ ] Batch operations
- [ ] Custom input types

---

*Tạo bởi IoT Team - Cập nhật: 2024* 