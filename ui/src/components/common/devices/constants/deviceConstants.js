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
    color_mode: "Chế độ màu"
};

// Unit mapping
export const controlUnits = {
    gas: " PPM",
    hum: "%",
    temp: "°C",
    brightness: "%",
    sensitivity: "%",
    volume: "%",
    ppm: " PPM"
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
                    power_status: "toggle",
                    lock_status: "toggle"
                }
            };
        case "smoke":
            return {
                category: "SAFETY",
                capabilities: ["GAS_DETECTION", "TEMPERATURE_MONITORING", "ALARM_CONTROL"],
                controls: {
                    gas: "slider",
                    temp: "slider",
                    hum: "slider",
                    sensitivity: "slider",
                    alarm_status: "toggle",
                    buzzer_override: "toggle"
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
               capabilities?.category?.toLowerCase().includes('door') ||
               capabilities?.capabilities?.includes('DOOR_CONTROL');
    },
    
    isLightDevice: (device, capabilities) => {
        const deviceType = device?.type?.toLowerCase() || device?.template_type?.toLowerCase();
        return deviceType === 'light' || 
               capabilities?.category?.toLowerCase().includes('lighting') ||
               capabilities?.capabilities?.includes('LIGHT_CONTROL') ||
               capabilities?.capabilities?.includes('COLOR_CONTROL') ||
               capabilities?.capabilities?.includes('BRIGHTNESS_CONTROL');
    }
}; 