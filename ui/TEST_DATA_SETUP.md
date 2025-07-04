# IoT Test Data Setup

## Tổng quan

Dữ liệu test này được tạo để test hệ thống Socket Real-time với các thiết bị IoT đã được implement trong UI.

## Cách sử dụng

1. Kết nối database MySQL của IoT_HomeConnect_API_v2
2. Chạy script SQL bên dưới để tạo dữ liệu mẫu
3. Login vào UI với các account đã tạo
4. Test các tính năng Real-time Socket

## Accounts Test

| Username | Password | Role | Customer ID | Account ID |
|----------|----------|------|-------------|------------|
| user_an | password123 | User | CUST001 | ACC001 |
| user_binh | password123 | User | CUST002 | ACC002 |
| user_cuong | password123 | User | CUST003 | ACC003 |
| admin_dung | password123 | Admin | CUST004 | ACC004 |

## Thiết bị IoT đã implement

### 1. ESP8266 Fire Alarm (Báo cháy thông minh)
- **Serial Numbers**: ESP8266_FIRE_001, ESP8266_FIRE_002
- **Sensors**: Nhiệt độ, khí gas, khói
- **Real-time features**: 
  - Live sensor readings
  - Emergency alerts với âm thanh
  - Test alarm functionality
- **Socket events**: `device:sensor_data`, `device:emergency_alert`

### 2. ESP8266 LED Controller (Điều khiển LED RGB)
- **Serial Numbers**: ESP8266_LED_001, ESP8266_LED_002, ESP8266_LED_003
- **Features**:
  - 15+ LED effects (solid, blink, rainbow, disco, chase, etc.)
  - 15+ presets (party_mode, relaxation_mode, sleep_mode, etc.)
  - Color picker (16M colors)
  - Brightness control
- **Socket events**: `device:led_effect`, `device:led_preset`, `device:led_color`

### 3. ESP-01 Door Controller (Điều khiển cửa)
- **Serial Numbers**: ESP01_DOOR_001, ESP01_DOOR_002, ESP01_DOOR_003
- **Features**:
  - Open/Close door control
  - Lock/Unlock functionality
  - Motion detection
  - Auto-lock configuration
- **Socket events**: `device:door_action`, `door:status_changed`
- **ESP-01 optimizations**: Batched commands, memory-efficient data

### 4. Security Camera (Camera an ninh)
- **Serial Numbers**: WIFI_CAM_001, WIFI_CAM_002
- **Features**:
  - Live streaming
  - Recording control
  - Motion detection alerts
  - Night vision mode
- **Socket events**: `device:camera_stream`, `device:motion_detected`

### 5. Environmental Sensor (Cảm biến môi trường)
- **Serial Numbers**: ENV_SENSOR_001, ENV_SENSOR_002
- **Sensors**: Temperature, humidity, pressure, light level, battery
- **Features**:
  - Real-time multi-sensor data
  - Battery monitoring
  - Calibration status
- **Socket events**: `device:sensor_data`, `device:battery_low`

### 6. ESP Socket Hub (Gateway trung tâm)
- **Serial Numbers**: ESP_HUB_001, ESP_HUB_002
- **Features**:
  - Gateway cho nhiều thiết bị ESP
  - Device connectivity monitoring
  - Network status tracking
  - Load balancing
- **Socket events**: `hub:device_connected`, `hub:status_update`

## SQL Script tạo dữ liệu

```sql
-- =====================================================
-- IoT Test Data Setup Script
-- Tạo dữ liệu mẫu để test Socket Real-time IoT System
-- =====================================================

-- 1. Tạo Role (vai trò)
INSERT INTO `role` (`id`, `name`, `created_at`, `updated_at`) VALUES
(1, 'Admin', NOW(), NOW()),
(2, 'User', NOW(), NOW()),
(3, 'Manager', NOW(), NOW());

-- 2. Tạo Customer (khách hàng)
INSERT INTO `customer` (`id`, `surname`, `lastname`, `phone`, `email`, `email_verified`, `birthdate`, `gender`, `created_at`, `updated_at`) VALUES
('CUST001', 'Nguyễn', 'Văn An', '0901234567', 'an.nguyen@example.com', true, '1990-01-15', true, NOW(), NOW()),
('CUST002', 'Trần', 'Thị Bình', '0902345678', 'binh.tran@example.com', true, '1985-05-20', false, NOW(), NOW()),
('CUST003', 'Lê', 'Văn Cường', '0903456789', 'cuong.le@example.com', true, '1992-08-10', true, NOW(), NOW()),
('CUST004', 'Phạm', 'Thị Dung', '0904567890', 'dung.pham@example.com', true, '1988-12-25', false, NOW(), NOW());

-- 3. Tạo Account (tài khoản)
INSERT INTO `account` (`account_id`, `customer_id`, `role_id`, `username`, `password`, `status`, `created_at`, `updated_at`) VALUES
('ACC001', 'CUST001', 2, 'user_an', '$2b$10$example_hashed_password_1', 1, NOW(), NOW()),
('ACC002', 'CUST002', 2, 'user_binh', '$2b$10$example_hashed_password_2', 1, NOW(), NOW()),
('ACC003', 'CUST003', 2, 'user_cuong', '$2b$10$example_hashed_password_3', 1, NOW(), NOW()),
('ACC004', 'CUST004', 1, 'admin_dung', '$2b$10$example_hashed_password_4', 1, NOW(), NOW());

-- 4. Tạo Groups (nhóm)
INSERT INTO `groups` (`group_id`, `group_name`, `group_description`, `icon_color`, `icon_name`, `created_at`, `updated_at`) VALUES
(1, 'Gia đình Nguyễn', 'Nhà riêng của gia đình Nguyễn Văn An', '#3B82F6', 'ic_family', NOW(), NOW()),
(2, 'Căn hộ Trần', 'Chung cư cao cấp của gia đình Trần', '#10B981', 'ic_apartment', NOW(), NOW()),
(3, 'Văn phòng SmartHome', 'Văn phòng công ty SmartHome Solutions', '#F59E0B', 'ic_company', NOW(), NOW()),
(4, 'Demo House', 'Nhà mẫu để demo sản phẩm', '#EF4444', 'ic_demo', NOW(), NOW());

-- 5. Tạo Houses (nhà)
INSERT INTO `houses` (`house_id`, `group_id`, `house_name`, `address`, `icon_name`, `icon_color`, `created_at`, `updated_at`) VALUES
(1, 1, 'Nhà Nguyễn Văn An', '123 Đường ABC, Quận 1, TP.HCM', 'ic_house', '#3B82F6', NOW(), NOW()),
(2, 2, 'Chung cư Vinhomes', '456 Đường XYZ, Quận 2, TP.HCM', 'ic_apartment', '#10B981', NOW(), NOW()),
(3, 3, 'Văn phòng District 1', '789 Nguyễn Huệ, Quận 1, TP.HCM', 'ic_office', '#F59E0B', NOW(), NOW()),
(4, 4, 'Demo Smart Home', '321 Tech Park, Quận 9, TP.HCM', 'ic_demo', '#EF4444', NOW(), NOW());

-- 6. Tạo Spaces (không gian)
INSERT INTO `spaces` (`space_id`, `house_id`, `space_name`, `space_description`, `icon_name`, `icon_color`, `created_at`) VALUES
(1, 1, 'Phòng khách', 'Phòng khách chính của nhà', 'ic_living_room', '#3B82F6', NOW()),
(2, 1, 'Phòng ngủ master', 'Phòng ngủ chính', 'ic_bedroom', '#8B5CF6', NOW()),
(3, 1, 'Nhà bếp', 'Khu vực nấu ăn', 'ic_kitchen', '#F59E0B', NOW()),
(4, 1, 'Phòng tắm', 'Phòng tắm chính', 'ic_bathroom', '#06B6D4', NOW()),
(5, 2, 'Phòng khách', 'Living room căn hộ', 'ic_living_room', '#10B981', NOW()),
(6, 2, 'Phòng ngủ', 'Bedroom căn hộ', 'ic_bedroom', '#8B5CF6', NOW()),
(7, 3, 'Văn phòng chính', 'Khu vực làm việc', 'ic_office', '#F59E0B', NOW()),
(8, 4, 'Demo Living Room', 'Phòng khách demo', 'ic_living_room', '#EF4444', NOW());

-- 7. Tạo Categories (danh mục thiết bị)
INSERT INTO `categories` (`category_id`, `name`, `key`, `slug`, `description`, `created_at`, `updated_at`) VALUES
(1, 'Fire Alarm System', 'fire_alarm', 'fire-alarm-system', 'Hệ thống báo cháy thông minh', NOW(), NOW()),
(2, 'Smart Lighting', 'smart_light', 'smart-lighting', 'Hệ thống đèn LED thông minh', NOW(), NOW()),
(3, 'Door Control', 'door_control', 'door-control', 'Hệ thống điều khiển cửa thông minh', NOW(), NOW()),
(4, 'Security Camera', 'camera', 'security-camera', 'Camera an ninh thông minh', NOW(), NOW()),
(5, 'Environmental Sensor', 'env_sensor', 'environmental-sensor', 'Cảm biến môi trường', NOW(), NOW()),
(6, 'Gateway Hub', 'gateway', 'gateway-hub', 'Trung tâm kết nối thiết bị', NOW(), NOW());

-- 8. Tạo Device Templates (mẫu thiết bị)
INSERT INTO `device_templates` (`template_id`, `device_type_id`, `name`, `created_by`, `device_template_note`, `status`, `production_cost`, `base_capabilities`, `created_at`, `updated_at`) VALUES
('TPL_FIRE001', 1, 'ESP8266 Fire Alarm', 'ACC004', 'Thiết bị báo cháy ESP8266 với cảm biến nhiệt độ, khí gas, khói', 'approved', 50.00, 
'{"sensors": ["temperature", "gas", "smoke"], "alerts": ["fire", "gas_leak", "smoke"], "communication": ["wifi", "socket"], "power": "5V"}', NOW(), NOW()),

('TPL_LED001', 2, 'ESP8266 LED Controller', 'ACC004', 'Điều khiển LED RGB với 15+ hiệu ứng', 'approved', 35.00,
'{"led_count": 64, "effects": ["solid", "blink", "rainbow", "disco", "chase"], "presets": ["party_mode", "relaxation_mode"], "colors": "16M"}', NOW(), NOW()),

('TPL_DOOR001', 3, 'ESP-01 Door Controller', 'ACC004', 'Điều khiển cửa thông minh với khóa điện tử', 'approved', 40.00,
'{"actuators": ["servo", "lock"], "sensors": ["door_sensor", "motion"], "communication": ["wifi"], "power": "12V"}', NOW(), NOW()),

('TPL_CAM001', 4, 'WiFi Security Camera', 'ACC004', 'Camera an ninh WiFi với night vision', 'approved', 80.00,
'{"video": ["1080p", "night_vision"], "audio": ["mic", "speaker"], "storage": ["cloud", "sd_card"], "features": ["motion_detect"]}', NOW(), NOW()),

('TPL_ENV001', 5, 'Environmental Sensor', 'ACC004', 'Cảm biến môi trường đa chức năng', 'approved', 25.00,
'{"sensors": ["temperature", "humidity", "pressure", "light"], "communication": ["wifi", "bluetooth"], "battery": "rechargeable"}', NOW(), NOW()),

('TPL_HUB001', 6, 'ESP Socket Hub', 'ACC004', 'Trung tâm kết nối cho nhiều thiết bị ESP', 'approved', 60.00,
'{"connectivity": ["wifi", "ethernet"], "devices_capacity": 32, "protocols": ["mqtt", "socket"], "power": "24V"}', NOW(), NOW());

-- 9. Tạo Firmware
INSERT INTO `firmware` (`firmware_id`, `version`, `file_path`, `template_id`, `name`, `is_approved`, `is_mandatory`, `note`, `created_at`, `updated_at`) VALUES
('FW_FIRE_V1', '1.0.0', '/firmware/fire_alarm_v1.bin', 'TPL_FIRE001', 'Fire Alarm Firmware v1.0', true, true, 'Firmware cơ bản cho báo cháy', NOW(), NOW()),
('FW_FIRE_V2', '1.1.0', '/firmware/fire_alarm_v1_1.bin', 'TPL_FIRE001', 'Fire Alarm Firmware v1.1', true, false, 'Thêm tính năng test alarm', NOW(), NOW()),
('FW_LED_V1', '1.0.0', '/firmware/led_controller_v1.bin', 'TPL_LED001', 'LED Controller Firmware v1.0', true, true, 'Firmware LED cơ bản', NOW(), NOW()),
('FW_LED_V2', '1.2.0', '/firmware/led_controller_v1_2.bin', 'TPL_LED001', 'LED Controller Firmware v1.2', true, false, 'Thêm 5 hiệu ứng mới', NOW(), NOW()),
('FW_DOOR_V1', '1.0.0', '/firmware/door_controller_v1.bin', 'TPL_DOOR001', 'Door Controller Firmware v1.0', true, true, 'Firmware cửa ESP-01', NOW(), NOW()),
('FW_CAM_V1', '1.0.0', '/firmware/camera_v1.bin', 'TPL_CAM001', 'Camera Firmware v1.0', true, true, 'Firmware camera cơ bản', NOW(), NOW()),
('FW_ENV_V1', '1.0.0', '/firmware/env_sensor_v1.bin', 'TPL_ENV001', 'Env Sensor Firmware v1.0', true, true, 'Firmware cảm biến môi trường', NOW(), NOW()),
('FW_HUB_V1', '1.0.0', '/firmware/hub_v1.bin', 'TPL_HUB001', 'Hub Firmware v1.0', true, true, 'Firmware trung tâm hub', NOW(), NOW());

-- 10. Tạo User Groups (gán user vào group)
INSERT INTO `user_groups` (`account_id`, `group_id`, `role`, `joined_at`) VALUES
('ACC001', 1, 'owner', NOW()),
('ACC002', 2, 'owner', NOW()),
('ACC003', 1, 'member', NOW()),
('ACC004', 3, 'admin', NOW()),
('ACC004', 4, 'admin', NOW());

-- 11. Tạo Devices (thiết bị IoT) với dữ liệu mẫu
INSERT INTO `devices` (`device_id`, `serial_number`, `template_id`, `space_id`, `account_id`, `group_id`, `firmware_id`, `name`, `power_status`, `attribute`, `current_value`, `link_status`, `runtime_capabilities`, `created_at`, `updated_at`) VALUES

-- ESP8266 Fire Alarm Devices
('DEV_FIRE001', 'ESP8266_FIRE_001', 'TPL_FIRE001', 1, 'ACC001', 1, 'FW_FIRE_V2', 'Báo cháy phòng khách', true, 
'{"location": "living_room", "sensitivity": "high", "test_interval": 30}',
'{"temperature": 25.5, "gas_level": 150, "smoke_level": 5, "last_test": "2024-01-15T10:30:00Z"}',
'linked',
'{"socket_connected": true, "last_heartbeat": "2024-01-15T14:30:00Z", "alert_enabled": true, "test_mode": false}',
NOW(), NOW()),

('DEV_FIRE002', 'ESP8266_FIRE_002', 'TPL_FIRE001', 3, 'ACC001', 1, 'FW_FIRE_V1', 'Báo cháy nhà bếp', true,
'{"location": "kitchen", "sensitivity": "medium", "test_interval": 30}',
'{"temperature": 28.2, "gas_level": 200, "smoke_level": 8, "last_test": "2024-01-15T09:00:00Z"}',
'linked',
'{"socket_connected": true, "last_heartbeat": "2024-01-15T14:29:00Z", "alert_enabled": true, "test_mode": false}',
NOW(), NOW()),

-- ESP8266 LED Controller Devices  
('DEV_LED001', 'ESP8266_LED_001', 'TPL_LED001', 1, 'ACC001', 1, 'FW_LED_V2', 'Đèn LED phòng khách', true,
'{"led_count": 64, "default_brightness": 80, "auto_mode": true}',
'{"power_status": true, "brightness": 75, "color": "#3B82F6", "effect": "solid", "preset": "relaxation_mode"}',
'linked',
'{"socket_connected": true, "last_heartbeat": "2024-01-15T14:31:00Z", "effects_available": true, "preset_loaded": true}',
NOW(), NOW()),

('DEV_LED002', 'ESP8266_LED_002', 'TPL_LED001', 2, 'ACC001', 1, 'FW_LED_V2', 'Đèn LED phòng ngủ', false,
'{"led_count": 32, "default_brightness": 50, "auto_mode": false}',
'{"power_status": false, "brightness": 50, "color": "#8B5CF6", "effect": "breathe", "preset": "sleep_mode"}',
'linked',
'{"socket_connected": true, "last_heartbeat": "2024-01-15T14:31:00Z", "effects_available": true, "preset_loaded": true}',
NOW(), NOW()),

-- ESP-01 Door Controller Devices
('DEV_DOOR001', 'ESP01_DOOR_001', 'TPL_DOOR001', 1, 'ACC001', 1, 'FW_DOOR_V1', 'Cửa chính phòng khách', false,
'{"door_type": "main_door", "auto_lock": true, "lock_delay": 30}',
'{"door_status": "closed", "lock_status": "locked", "motion_detected": false, "last_opened": "2024-01-15T08:30:00Z"}',
'linked',
'{"socket_connected": true, "last_heartbeat": "2024-01-15T14:25:00Z", "esp01_mode": true, "commands_queued": 0}',
NOW(), NOW()),

-- Security Camera Devices
('DEV_CAM001', 'WIFI_CAM_001', 'TPL_CAM001', 1, 'ACC001', 1, 'FW_CAM_V1', 'Camera phòng khách', true,
'{"resolution": "1080p", "night_vision": true, "motion_detect": true, "cloud_storage": true}',
'{"recording": true, "motion_alert": false, "night_mode": false, "storage_usage": "45%"}',
'linked',
'{"socket_connected": false, "last_heartbeat": "2024-01-15T14:10:00Z", "streaming_active": true, "alerts_enabled": true}',
NOW(), NOW()),

-- Environmental Sensor Devices
('DEV_ENV001', 'ENV_SENSOR_001', 'TPL_ENV001', 2, 'ACC001', 1, 'FW_ENV_V1', 'Cảm biến phòng ngủ', true,
'{"update_interval": 60, "battery_level": 85, "calibration_date": "2024-01-01"}',
'{"temperature": 23.5, "humidity": 65, "pressure": 1013.25, "light_level": 20, "battery": 85}',
'linked',
'{"socket_connected": true, "last_heartbeat": "2024-01-15T14:30:00Z", "battery_low": false, "calibration_ok": true}',
NOW(), NOW()),

-- ESP Socket Hub Devices
('DEV_HUB001', 'ESP_HUB_001', 'TPL_HUB001', 1, 'ACC001', 1, 'FW_HUB_V1', 'Hub phòng khách', true,
'{"max_devices": 32, "gateway_mode": true, "mesh_enabled": false}',
'{"connected_devices": 8, "network_status": "online", "uptime": "72h", "load": "25%"}',
'linked',
'{"socket_connected": true, "last_heartbeat": "2024-01-15T14:31:00Z", "gateway_active": true, "devices_online": 8}',
NOW(), NOW());

-- 12. Tạo Alert Types
INSERT INTO `alert_types` (`alert_type_id`, `alert_type_name`, `priority`, `created_at`, `updated_at`) VALUES
(1, 'Fire Detected', 10, NOW(), NOW()),
(2, 'Gas Leak', 9, NOW(), NOW()),
(3, 'Smoke Detected', 8, NOW(), NOW()),
(4, 'High Temperature', 7, NOW(), NOW()),
(5, 'Device Offline', 5, NOW(), NOW()),
(6, 'Motion Detected', 4, NOW(), NOW()),
(7, 'Door Opened', 3, NOW(), NOW()),
(8, 'Low Battery', 2, NOW(), NOW()),
(9, 'System Info', 1, NOW(), NOW());

-- 13. Tạo Shared Permissions
INSERT INTO `shared_permissions` (`device_serial`, `shared_with_user_id`, `permission_type`, `created_at`, `updated_at`) VALUES
('ESP8266_FIRE_001', 'ACC003', 'readonly', NOW(), NOW()),
('ESP8266_LED_001', 'ACC003', 'control', NOW(), NOW()),
('ESP01_DOOR_001', 'ACC003', 'readonly', NOW(), NOW()),
('ESP_HUB_001', 'ACC003', 'readonly', NOW(), NOW());

SELECT 'Test data setup completed successfully!' as status;
```

## Cách test Socket Real-time

1. **Chạy IoT_HomeConnect_API_v2**: Khởi động server socket API
2. **Login vào UI**: Sử dụng account `user_an` / `password123`
3. **Vào Device Management**: Tìm thiết bị với serial `ESP8266_FIRE_001`
4. **Bật Real-time mode**: Click nút "Enable Real-time"
5. **Xem live data**: Sensor data sẽ cập nhật real-time qua socket
6. **Test commands**: Thử gửi lệnh điều khiển thiết bị

## Troubleshooting

- **Socket không kết nối**: Kiểm tra REACT_APP_SOCKET_URL trong `.env`
- **Thiết bị không hiển thị**: Kiểm tra database connection
- **Real-time không hoạt động**: Kiểm tra API server có đang chạy
- **Auth error**: Kiểm tra JWT token trong localStorage

## Tính năng đã implement

✅ Socket connection với auto-reconnect  
✅ Real-time sensor monitoring  
✅ Device command sending  
✅ LED effects & presets control  
✅ Door control với ESP-01 optimization  
✅ Emergency alert system với audio  
✅ Multi-device support  
✅ User authentication integration  
✅ Connection status indicators  
✅ Error handling & retry logic 