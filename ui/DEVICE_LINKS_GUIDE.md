# Device Links Management Guide (V2)

## 🎯 Tổng quan

Device Links V2 là hệ thống quản lý liên kết thiết bị IoT với giao diện người dùng được thiết kế lại để tối ưu trải nghiệm sử dụng. Người dùng có thể tạo các quy tắc tự động hóa giữa thiết bị cảm biến (input) và thiết bị điều khiển (output).

## 🚀 Luồng sử dụng mới

### 1. Giao diện 2 khu vực
- **Khu vực xanh**: Thiết bị Input (Cảm biến)
- **Khu vực đỏ**: Thiết bị Output (Điều khiển)

### 2. Quy trình tạo liên kết
1. **Chọn thiết bị Input** từ danh sách cảm biến
2. **Nhập giá trị** cho các components muốn sử dụng
3. **Chọn thiết bị Output** từ danh sách điều khiển 
4. **Chọn hành động**: Bật hoặc Tắt thiết bị
5. **Tạo liên kết** - Hệ thống sẽ tạo một liên kết cho mỗi component có giá trị

## 📋 Ví dụ thực tế

### Scenario 1: Hệ thống tưới tiêu tự động
```
Input: Environment Monitor
├── Nhiệt độ: >35
├── Độ ẩm: <30
└── Ánh sáng: >1000

Output: Water Pump → Bật thiết bị

Kết quả: 3 liên kết được tạo
- Khi nhiệt độ > 35°C → bật máy bơm
- Khi độ ẩm < 30% → bật máy bơm  
- Khi ánh sáng > 1000 lux → bật máy bơm
```

### Scenario 2: Hệ thống báo cháy
```
Input: Smart Alarm
├── Khí gas: >100
└── Nhiệt độ: >50

Output: Emergency Light → Bật thiết bị

Kết quả: 2 liên kết được tạo
- Khi khí gas > 100ppm → bật đèn báo
- Khi nhiệt độ > 50°C → bật đèn báo
```

### Scenario 3: Hệ thống tiết kiệm năng lượng
```
Input: Motion Sensor
└── Motion: false (không có chuyển động)

Output: Room Light → Tắt thiết bị

Kết quả: 1 liên kết được tạo
- Khi không có chuyển động → tắt đèn
```

## 🔧 Cấu hình nâng cao

### Định dạng giá trị
- **Số**: `25`, `>30`, `<=100`, `>=50`
- **Boolean**: `true`, `false`
- **Text**: `"active"`, `"standby"`

### Logic Operators
- **AND**: Tất cả điều kiện phải đúng
- **OR**: Chỉ cần một điều kiện đúng

### Output Actions
- **turn_on**: Bật thiết bị khi điều kiện kích hoạt
- **turn_off**: Tắt thiết bị khi điều kiện kích hoạt

## 🎮 Mock Mode

### Bật Mock Mode
1. Toggle switch "Mock Mode" 
2. Hoặc click "Tạo dữ liệu mẫu"

### Dữ liệu mẫu bao gồm:
- **7 thiết bị**: Smart Alarm, Environment Monitor, Motion Sensor, etc.
- **7+ components**: Temperature, Gas, Humidity, Motion, Light
- **4 liên kết mẫu**: Các scenario thực tế

## 🔄 API Backend

### Tạo Device Link
```javascript
POST /api/device-links
{
  "input_device_id": "DEV_TEMP_001",
  "output_device_id": "DEV_PUMP_001", 
  "component_id": "COMP_TEMP_001",
  "value_active": ">35",
  "logic_operator": "AND",
  "output_action": "turn_on"
}
```

### Cập nhật Device Link
```javascript
PUT /api/device-links/:linkId
{
  "value_active": ">40",
  "output_action": "turn_off"
}
```

### Lấy danh sách Device Links
```javascript
GET /api/device-links
```

## 📊 Database Schema

```sql
device_links {
  id                    Int               @id @default(autoincrement())
  input_device_id       String            @db.VarChar(32)
  output_device_id      String            @db.VarChar(32)
  component_id          String            @db.VarChar(32)
  value_active          String            @db.VarChar(50)
  output_action         OutputAction      @default(turn_on)
  logic_operator        LogicOperator     @default(AND)
  created_at            DateTime?         @default(now())
  updated_at            DateTime?         @updatedAt
  deleted_at            DateTime?
}

enum OutputAction {
  turn_on
  turn_off
}

enum LogicOperator {
  AND
  OR  
}
```

## 🎯 Lợi ích của V2

✅ **Trực quan**: Thấy ngay input và output devices
✅ **Linh hoạt**: Có thể nhập giá trị cho nhiều components cùng lúc
✅ **Hiệu quả**: Tạo nhiều liên kết trong một lần
✅ **User-friendly**: Không cần chuyển step, mọi thứ hiển thị cùng lúc
✅ **Control**: Có thể chọn bật/tắt thiết bị output
✅ **Mock data**: Hỗ trợ test dễ dàng với dữ liệu mẫu

## 🔍 Troubleshooting

### Không có thiết bị trong danh sách?
- Bật Mock Mode để có dữ liệu test
- Kiểm tra thiết bị có components phù hợp không

### Liên kết không hoạt động?
- Kiểm tra điều kiện value_active
- Đảm bảo thiết bị online và có quyền truy cập
- Xem log backend để debug

### Cần hỗ trợ?
- Xem code trong `DeviceLinksManagerV2.jsx`
- Check API endpoint `/api/device-links`
- Test với Mock Mode trước khi dùng real data 