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

-- 11. Tạo Devices (thiết bị IoT)
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

('DEV_FIRE003', 'ESP8266_FIRE_003', 'TPL_FIRE001', 5, 'ACC002', 2, 'FW_FIRE_V2', 'Báo cháy căn hộ', true,
'{"location": "apartment_living", "sensitivity": "high", "test_interval": 30}',
'{"temperature": 24.8, "gas_level": 120, "smoke_level": 3, "last_test": "2024-01-15T11:00:00Z"}',
'linked',
'{"socket_connected": false, "last_heartbeat": "2024-01-15T14:20:00Z", "alert_enabled": true, "test_mode": false}',
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

('DEV_LED003', 'ESP8266_LED_003', 'TPL_LED001', 7, 'ACC004', 3, 'FW_LED_V1', 'Đèn LED văn phòng', true,
'{"led_count": 128, "default_brightness": 90, "auto_mode": true}',
'{"power_status": true, "brightness": 90, "color": "#F59E0B", "effect": "solid", "preset": "focus_mode"}',
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

('DEV_DOOR002', 'ESP01_DOOR_002', 'TPL_DOOR001', 3, 'ACC001', 1, 'FW_DOOR_V1', 'Cửa nhà bếp', false,
'{"door_type": "kitchen_door", "auto_lock": false, "lock_delay": 0}',
'{"door_status": "closed", "lock_status": "unlocked", "motion_detected": false, "last_opened": "2024-01-15T12:15:00Z"}',
'linked',
'{"socket_connected": true, "last_heartbeat": "2024-01-15T14:25:00Z", "esp01_mode": true, "commands_queued": 0}',
NOW(), NOW()),

('DEV_DOOR003', 'ESP01_DOOR_003', 'TPL_DOOR001', 5, 'ACC002', 2, 'FW_DOOR_V1', 'Cửa căn hộ', false,
'{"door_type": "apartment_door", "auto_lock": true, "lock_delay": 15}',
'{"door_status": "closed", "lock_status": "locked", "motion_detected": false, "last_opened": "2024-01-15T13:45:00Z"}',
'linked',
'{"socket_connected": true, "last_heartbeat": "2024-01-15T14:26:00Z", "esp01_mode": true, "commands_queued": 0}',
NOW(), NOW()),

-- Security Camera Devices
('DEV_CAM001', 'WIFI_CAM_001', 'TPL_CAM001', 1, 'ACC001', 1, 'FW_CAM_V1', 'Camera phòng khách', true,
'{"resolution": "1080p", "night_vision": true, "motion_detect": true, "cloud_storage": true}',
'{"recording": true, "motion_alert": false, "night_mode": false, "storage_usage": "45%"}',
'linked',
'{"socket_connected": false, "last_heartbeat": "2024-01-15T14:10:00Z", "streaming_active": true, "alerts_enabled": true}',
NOW(), NOW()),

('DEV_CAM002', 'WIFI_CAM_002', 'TPL_CAM001', 4, 'ACC001', 1, 'FW_CAM_V1', 'Camera phòng tắm', false,
'{"resolution": "720p", "night_vision": false, "motion_detect": true, "cloud_storage": false}',
'{"recording": false, "motion_alert": false, "night_mode": false, "storage_usage": "12%"}',
'unlinked',
'{"socket_connected": false, "last_heartbeat": "2024-01-15T13:50:00Z", "streaming_active": false, "alerts_enabled": false}',
NOW(), NOW()),

-- Environmental Sensor Devices
('DEV_ENV001', 'ENV_SENSOR_001', 'TPL_ENV001', 2, 'ACC001', 1, 'FW_ENV_V1', 'Cảm biến phòng ngủ', true,
'{"update_interval": 60, "battery_level": 85, "calibration_date": "2024-01-01"}',
'{"temperature": 23.5, "humidity": 65, "pressure": 1013.25, "light_level": 20, "battery": 85}',
'linked',
'{"socket_connected": true, "last_heartbeat": "2024-01-15T14:30:00Z", "battery_low": false, "calibration_ok": true}',
NOW(), NOW()),

('DEV_ENV002', 'ENV_SENSOR_002', 'TPL_ENV001', 7, 'ACC004', 3, 'FW_ENV_V1', 'Cảm biến văn phòng', true,
'{"update_interval": 30, "battery_level": 92, "calibration_date": "2024-01-10"}',
'{"temperature": 26.8, "humidity": 58, "pressure": 1011.80, "light_level": 350, "battery": 92}',
'linked',
'{"socket_connected": true, "last_heartbeat": "2024-01-15T14:31:00Z", "battery_low": false, "calibration_ok": true}',
NOW(), NOW()),

-- ESP Socket Hub Devices
('DEV_HUB001', 'ESP_HUB_001', 'TPL_HUB001', 1, 'ACC001', 1, 'FW_HUB_V1', 'Hub phòng khách', true,
'{"max_devices": 32, "gateway_mode": true, "mesh_enabled": false}',
'{"connected_devices": 8, "network_status": "online", "uptime": "72h", "load": "25%"}',
'linked',
'{"socket_connected": true, "last_heartbeat": "2024-01-15T14:31:00Z", "gateway_active": true, "devices_online": 8}',
NOW(), NOW()),

('DEV_HUB002', 'ESP_HUB_002', 'TPL_HUB001', 8, 'ACC004', 4, 'FW_HUB_V1', 'Demo Hub', true,
'{"max_devices": 32, "gateway_mode": true, "mesh_enabled": true}',
'{"connected_devices": 12, "network_status": "online", "uptime": "168h", "load": "40%"}',
'linked',
'{"socket_connected": true, "last_heartbeat": "2024-01-15T14:31:00Z", "gateway_active": true, "devices_online": 12}',
NOW(), NOW());

-- 12. Tạo Alert Types (loại cảnh báo)
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

-- 13. Tạo một số Alerts mẫu
INSERT INTO `alerts` (`device_serial`, `space_id`, `message`, `status`, `alert_type_id`, `created_at`, `updated_at`) VALUES
('ESP8266_FIRE_001', 1, 'Phát hiện nhiệt độ cao bất thường trong phòng khách', 'unread', 4, NOW(), NOW()),
('ESP8266_FIRE_002', 3, 'Cảnh báo: Nồng độ khí gas vượt ngưỡng an toàn', 'read', 2, NOW(), NOW()),
('ESP01_DOOR_001', 1, 'Cửa chính đã được mở', 'read', 7, NOW(), NOW()),
('WIFI_CAM_002', 4, 'Camera phòng tắm đã mất kết nối', 'unread', 5, NOW(), NOW()),
('ENV_SENSOR_001', 2, 'Pin cảm biến môi trường còn 15%', 'unread', 8, NOW(), NOW());

-- 14. Tạo Shared Permissions (chia sẻ thiết bị)
INSERT INTO `shared_permissions` (`device_serial`, `shared_with_user_id`, `permission_type`, `created_at`, `updated_at`) VALUES
('ESP8266_FIRE_001', 'ACC003', 'readonly', NOW(), NOW()),
('ESP8266_LED_001', 'ACC003', 'control', NOW(), NOW()),
('ESP01_DOOR_001', 'ACC003', 'readonly', NOW(), NOW()),
('ESP_HUB_001', 'ACC003', 'readonly', NOW(), NOW());

-- 15. Tạo một số Hourly Values mẫu (dữ liệu lịch sử)
INSERT INTO `hourly_values` (`device_serial`, `space_id`, `hour_timestamp`, `avg_value`, `sample_count`, `created_at`, `updated_at`) VALUES
('ESP8266_FIRE_001', 1, '2024-01-15 13:00:00', '{"temperature": 25.2, "gas_level": 145, "smoke_level": 4}', 60, NOW(), NOW()),
('ESP8266_FIRE_001', 1, '2024-01-15 14:00:00', '{"temperature": 25.5, "gas_level": 150, "smoke_level": 5}', 60, NOW(), NOW()),
('ENV_SENSOR_001', 2, '2024-01-15 13:00:00', '{"temperature": 23.2, "humidity": 62, "pressure": 1013.5, "light_level": 25}', 60, NOW(), NOW()),
('ENV_SENSOR_001', 2, '2024-01-15 14:00:00', '{"temperature": 23.5, "humidity": 65, "pressure": 1013.25, "light_level": 20}', 60, NOW(), NOW());

-- =====================================================
-- SUMMARY: Dữ liệu đã tạo
-- =====================================================
-- ✅ 4 Users với roles khác nhau
-- ✅ 4 Groups (gia đình, căn hộ, văn phòng, demo)  
-- ✅ 4 Houses với địa chỉ thực tế
-- ✅ 8 Spaces (phòng khách, phòng ngủ, nhà bếp, v.v.)
-- ✅ 6 Device Categories (báo cháy, LED, cửa, camera, cảm biến, hub)
-- ✅ 6 Device Templates với capabilities đầy đủ
-- ✅ 8 Firmware versions cho các thiết bị
-- ✅ 14 IoT Devices sẵn sàng test:
--    • 3x ESP8266 Fire Alarm (có real-time sensor data)
--    • 3x ESP8266 LED Controller (có effects & presets)  
--    • 3x ESP-01 Door Controller (có door & lock control)
--    • 2x Security Camera (có streaming & recording)
--    • 2x Environmental Sensor (có multi-sensor data)
--    • 2x ESP Socket Hub (có gateway functionality)
-- ✅ Alert types và sample alerts
-- ✅ Shared permissions giữa users
-- ✅ Hourly historical data

-- Để test Socket Real-time:
-- 1. Chọn device ESP8266_FIRE_001 (serial: ESP8266_FIRE_001)
-- 2. Account: ACC001 (user_an)  
-- 3. Bật Real-time trong UI
-- 4. Thiết bị sẽ connect qua Socket với data mẫu

SELECT 'Test data setup completed successfully!' as status; 