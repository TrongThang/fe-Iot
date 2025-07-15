import {
    Lightbulb,
    Flame,
    Thermometer,
    Palette,
    AlertTriangle,
    Droplets,
    Wind,
    Bell,
    Shield,
    Activity,
    Settings,
    Share2,
    DoorClosed,
    Users,
    Eye,
    Info,
} from "lucide-react";

// Label mapping cho các controls
export const controlLabels = {
    gas: "Nồng độ khí",
    hum: "Độ ẩm",
    temp: "Nhiệt độ",
    brightness: "Độ sáng",
    color: "Màu sắc",
    alarm_status: "Trạng thái báo động",
    buzzer_override: "Ghi đè buzzer",
    sensitivity: "Độ nhạy",
    volume: "Âm lượng",
    power_status: "Nguồn",
    ppm: "Nồng độ khói",
    door_status: "Trạng thái cửa",
    lock_status: "Khóa cửa",
    color_mode: "Chế độ màu",
    
    // Camera controls
    recording: "Ghi hình",
    motion_detection: "Phát hiện chuyển động",
    night_vision: "Chế độ ban đêm",
    
    // LED RGB controls
    rgb_control: "Điều khiển RGB",
    
    // Pump controls
    pump_speed: "Tốc độ bơm",
    water_flow: "Lưu lượng nước",
    pressure: "Áp suất",
    
    // Hub controls
    connection_status: "Trạng thái kết nối",
    
    // Security controls
    security_mode: "Chế độ bảo mật",
    
    // Environmental controls
    air_quality: "Chất lượng không khí"
};

// Unit mapping
export const controlUnits = {
    gas: " PPM",
    hum: "%",
    temp: "°C",
    brightness: "%",
    sensitivity: "%",
    volume: "%",
    ppm: " PPM",
    pump_speed: " RPM",
    water_flow: " L/min",
    pressure: " bar",
    air_quality: " AQI"
};

// Color name mappings for Vietnamese
export const colorNames = {
    red: "Đỏ",
    orange: "Cam", 
    yellow: "Vàng",
    green: "Xanh lá",
    cyan: "Xanh ngọc",
    blue: "Xanh dương",
    purple: "Tím",
    pink: "Hồng",
    white: "Trắng",
    warm: "Ấm",
    cool: "Mát"
};

// Color to hue mapping
export const colorToHue = {
    "red": 0,
    "orange": 30,
    "yellow": 60,
    "green": 120,
    "cyan": 180,
    "blue": 240,
    "purple": 270,
    "pink": 320,
    "white": 0,
    "warm": 30,
    "cool": 210
};

// Icon mapping dựa vào category và capabilities
export const getDeviceIcon = (category, capabilities) => {
    if (capabilities && capabilities.includes("DOOR_CONTROL")) return DoorClosed;
    if (capabilities && capabilities.includes("LIGHT_CONTROL")) return Lightbulb;
    if (capabilities && capabilities.includes("TEMPERATURE_MONITORING")) return Thermometer;
    if (capabilities && (capabilities.includes("GAS_DETECTION") || capabilities.includes("SMOKE_DETECTION"))) return Flame;
    if (capabilities && capabilities.includes("ALARM_CONTROL")) return Bell;
    if (category === "ACCESS_CONTROL") return DoorClosed;
    if (category === "SAFETY") return Shield;
    if (category === "LIGHTING") return Lightbulb;
    return Activity;
};

// Tạo capabilities fallback dựa vào device type
export const createFallbackCapabilities = (device) => {
    console.log("createFallbackCapabilities", device);
    const deviceType = device.type || device.template_type || "unknown";

    switch (deviceType) {
        // Camera devices
        case "camera":
            return {
                category: "SECURITY",
                capabilities: ["RECORDING", "LIVE_STREAMING", "MOTION_DETECTION", "NIGHT_VISION"],
                controls: {
                    power_status: "toggle",
                    recording: "toggle",
                    motion_detection: "toggle",
                    night_vision: "toggle"
                }
            };

        // LED devices
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
        case "led-rgb":
            return {
                category: "LIGHTING",
                capabilities: ["LIGHT_CONTROL", "BRIGHTNESS_CONTROL", "RGB_CONTROL", "COLOR_CONTROL"],
                controls: {
                    brightness: "slider",
                    color: "color_picker",
                    rgb_control: "rgb_picker",
                    power_status: "toggle",
                    color_mode: "select"
                }
            };
        case "led-white":
            return {
                category: "LIGHTING",
                capabilities: ["LIGHT_CONTROL", "BRIGHTNESS_CONTROL"],
                controls: {
                    brightness: "slider",
                    power_status: "toggle"
                }
            };
        case "led-single":
            return {
                category: "LIGHTING",
                capabilities: ["LIGHT_CONTROL"],
                controls: {
                    power_status: "toggle"
                }
            };

        // Door devices
        case "door":
        case "door-roller":
        case "door-sliding":
        case "door-swing":
            return {
                category: "DOOR_CONTROL",
                capabilities: ["DOOR_CONTROL", "LOCK_CONTROL"],
                controls: {
                    door_status: "toggle",
                    power_status: "toggle",
                    lock_status: "toggle"
                }
            };

        // Sensor devices
        case "smoke":
        case "sensor-smoke-fire":
            return {
                category: "SAFETY",
                capabilities: ["SMOKE_DETECTION", "FIRE_DETECTION", "TEMPERATURE_MONITORING", "ALARM_CONTROL"],
                controls: {
                    ppm: "slider",
                    temp: "slider",
                    hum: "slider",
                    sensitivity: "slider",
                    alarm_status: "toggle",
                    buzzer_override: "toggle"
                }
            };
        case "gas-sensor":
            return {
                category: "ENVIRONMENTAL_MONITORING",
                capabilities: ["GAS_DETECTION", "AIR_QUALITY", "TEMPERATURE_MONITORING", "HUMIDITY_MONITORING"],
                controls: {
                    gas: "slider",
                    temp: "slider",
                    hum: "slider",
                    air_quality: "slider",
                    sensitivity: "slider"
                }
            };
        case "temperature":
            return {
                category: "MONITORING",
                capabilities: ["TEMPERATURE_MONITORING", "HUMIDITY_MONITORING"],
                controls: {
                    temp: "slider",
                    hum: "slider"
                }
            };
        case "sensor":
            return {
                category: "MONITORING",
                capabilities: ["SENSOR_MONITORING", "TEMPERATURE_MONITORING", "HUMIDITY_MONITORING"],
                controls: {
                    temp: "slider",
                    hum: "slider",
                    sensitivity: "slider"
                }
            };

        // Pump devices
        case "pump":
            return {
                category: "WATER_CONTROL",
                capabilities: ["PUMP_CONTROL", "WATER_FLOW", "PRESSURE_MONITORING"],
                controls: {
                    power_status: "toggle",
                    pump_speed: "slider",
                    water_flow: "slider",
                    pressure: "slider"
                }
            };

        // Hub devices
        case "hub":
        case "hub-door":
            return {
                category: "HUB_CONTROL",
                capabilities: ["HUB_MANAGEMENT", "DEVICE_COORDINATION"],
                controls: {
                    power_status: "toggle",
                    connection_status: "display"
                }
            };

        // Controller devices
        case "controller":
            return {
                category: "CONTROLLER",
                capabilities: ["DEVICE_CONTROL", "AUTOMATION"],
                controls: {
                    power_status: "toggle"
                }
            };

        // Security devices
        case "security":
            return {
                category: "SECURITY",
                capabilities: ["SECURITY_MONITORING", "ALERT_SYSTEM"],
                controls: {
                    power_status: "toggle",
                    security_mode: "select",
                    alarm_status: "toggle"
                }
            };

        default:
            // Tạo controls mở rộng cho thiết bị chung
            return {
                category: "GENERAL",
                capabilities: ["INPUT", "OUTPUT", "SENSOR_MONITORING", "LIGHT_CONTROL", "COLOR_CONTROL"],
                controls: {
                    power_status: "toggle",
                    brightness: "slider",
                    color: "color_picker",
                    temp: "slider",
                    hum: "slider",
                    gas: "slider",
                    sensitivity: "slider"
                }
            };
    }
};

// Control type configurations
export const controlConfigs = {
    slider: {
        defaultProps: {
            min: 0,
            max: 100,
            step: 1
        },
        getMax: (controlKey) => {
            switch (controlKey) {
                case "temp": return 50;
                case "gas": 
                case "ppm": return 2000;
                default: return 100;
            }
        }
    }
};

// Device type detection helpers
export const deviceTypeHelpers = {
    isLEDDevice: (device) => {
        return device?.type?.toLowerCase().includes('led') || 
               device?.template_type?.toLowerCase().includes('led');
    },
    
    isDoorDevice: (device, capabilities) => {
        const deviceType = device?.type?.toLowerCase() || device?.template_type?.toLowerCase();
        return deviceType === 'door' || 
               deviceType?.includes('door-') ||
               capabilities?.category?.toLowerCase().includes('door') ||
               capabilities?.capabilities?.includes('DOOR_CONTROL');
    },
    
    isLightDevice: (device, capabilities) => {
        const deviceType = device?.type?.toLowerCase() || device?.template_type?.toLowerCase();
        return deviceType === 'light' || 
               deviceType?.includes('led-') ||
               capabilities?.category?.toLowerCase().includes('lighting') ||
               capabilities?.capabilities?.includes('LIGHT_CONTROL') ||
               capabilities?.capabilities?.includes('COLOR_CONTROL') ||
               capabilities?.capabilities?.includes('BRIGHTNESS_CONTROL');
    },

    isCameraDevice: (device, capabilities) => {
        const deviceType = device?.type?.toLowerCase() || device?.template_type?.toLowerCase();
        return deviceType === 'camera' ||
               capabilities?.category?.toLowerCase().includes('security') ||
               capabilities?.capabilities?.includes('RECORDING') ||
               capabilities?.capabilities?.includes('LIVE_STREAMING');
    },

    isSensorDevice: (device, capabilities) => {
        const deviceType = device?.type?.toLowerCase() || device?.template_type?.toLowerCase();
        return deviceType === 'sensor' || 
               deviceType === 'smoke' ||
               deviceType === 'gas-sensor' ||
               deviceType === 'temperature' ||
               deviceType?.includes('sensor-') ||
               capabilities?.category?.toLowerCase().includes('monitoring') ||
               capabilities?.category?.toLowerCase().includes('safety') ||
               capabilities?.category?.toLowerCase().includes('environmental') ||
               capabilities?.capabilities?.includes('SENSOR_MONITORING');
    },

    isGasSensorDevice: (device, capabilities) => {
        const deviceType = device?.type?.toLowerCase() || device?.template_type?.toLowerCase();
        return deviceType === 'gas-sensor' ||
               capabilities?.category?.toLowerCase().includes('environmental') ||
               capabilities?.capabilities?.includes('GAS_DETECTION') ||
               capabilities?.capabilities?.includes('AIR_QUALITY');
    },

    isPumpDevice: (device, capabilities) => {
        const deviceType = device?.type?.toLowerCase() || device?.template_type?.toLowerCase();
        return deviceType === 'pump' ||
               capabilities?.category?.toLowerCase().includes('water') ||
               capabilities?.capabilities?.includes('PUMP_CONTROL');
    },

    isHubDevice: (device, capabilities) => {
        const deviceType = device?.type?.toLowerCase() || device?.template_type?.toLowerCase();
        return deviceType === 'hub' ||
               deviceType?.includes('hub-') ||
               capabilities?.category?.toLowerCase().includes('hub') ||
               capabilities?.capabilities?.includes('HUB_MANAGEMENT');
    },

    isSecurityDevice: (device, capabilities) => {
        const deviceType = device?.type?.toLowerCase() || device?.template_type?.toLowerCase();
        return deviceType === 'security' ||
               capabilities?.category?.toLowerCase().includes('security') ||
               capabilities?.capabilities?.includes('SECURITY_MONITORING');
    }
}; 