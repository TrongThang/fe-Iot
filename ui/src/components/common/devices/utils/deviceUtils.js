import { colorToHue } from '../constants/deviceConstants';

// Color conversion utilities
export const colorUtils = {
    // Convert HSL to HEX
    hslToHex: (h, s, l) => {
        l /= 100;
        s /= 100;
        const a = s * Math.min(l, 1 - l);
        const f = n => {
            const k = (n + h / 30) % 12;
            const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
            return Math.round(255 * color).toString(16).padStart(2, '0');
        };
        return `#${f(0)}${f(8)}${f(4)}`;
    },

    // Convert HEX to Hue
    hexToHue: (hex) => {
        // Convert hex to RGB
        const r = parseInt(hex.slice(1, 3), 16) / 255;
        const g = parseInt(hex.slice(3, 5), 16) / 255;
        const b = parseInt(hex.slice(5, 7), 16) / 255;

        // Convert RGB to HSL
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const diff = max - min;

        let hue = 0;
        if (diff !== 0) {
            switch (max) {
                case r: hue = ((g - b) / diff) % 6; break;
                case g: hue = (b - r) / diff + 2; break;
                case b: hue = (r - g) / diff + 4; break;
            }
        }
        hue = hue * 60;
        return Math.round(hue < 0 ? hue + 360 : hue);
    },

    // Extract hue from various color formats
    extractHue: (colorValue) => {
        if (typeof colorValue === 'string' && colorValue.startsWith('#')) {
            return colorUtils.hexToHue(colorValue);
        } else if (typeof colorValue === 'string' && colorValue.startsWith('hsl(')) {
            const hueMatch = colorValue.match(/hsl\((\d+)/);
            return hueMatch ? parseInt(hueMatch[1]) : 0;
        } else {
            // Use name mapping for backward compatibility
            return colorToHue[colorValue] || 0;
        }
    },

    // Get color name from hue value
    getColorName: (hue) => {
        if (hue >= 0 && hue < 15) return "Đỏ";
        if (hue >= 15 && hue < 45) return "Cam";
        if (hue >= 45 && hue < 75) return "Vàng";
        if (hue >= 75 && hue < 105) return "Xanh lá nhạt";
        if (hue >= 105 && hue < 135) return "Xanh lá";
        if (hue >= 135 && hue < 165) return "Xanh ngọc";
        if (hue >= 165 && hue < 195) return "Xanh lơ";
        if (hue >= 195 && hue < 225) return "Xanh da trời";
        if (hue >= 225 && hue < 255) return "Xanh dương";
        if (hue >= 255 && hue < 285) return "Tím";
        if (hue >= 285 && hue < 315) return "Hồng tím";
        if (hue >= 315 && hue < 345) return "Hồng";
        if (hue >= 345 && hue <= 360) return "Đỏ";
        return "Đỏ";
    },

    // Get color from hue (returns HEX)
    getColorFromHue: (hue) => {
        return colorUtils.hslToHex(hue, 70, 50);
    },

    // Get color style for display
    getColorStyle: (hue) => {
        return {
            backgroundColor: `hsl(${hue}, 70%, 50%)`,
        };
    }
};

// Device value helpers
export const deviceValueHelpers = {
    // Initialize default values for device
    initializeDeviceValues: (device) => {
        return {
            ...device.current_value,
            power_status: device.power_status,
            temp: device.temp || device.current_value?.temp || 25,
            hum: device.humidity || device.current_value?.humidity || device.current_value?.hum || 45,
            gas: device.gas || device.current_value?.gas || device.ppm || 300,
            ppm: device.ppm || device.current_value?.ppm || device.gas || 300,
            brightness: device.brightness || device.current_value?.brightness || 75,
            color: device.color || device.current_value?.color || "#ffffff",
            color_mode: device.color_mode || device.current_value?.color_mode || 'manual',
            sensitivity: device.sensitivity || device.current_value?.sensitivity || 70,
            alarm_status: device.alarm_status || device.current_value?.alarm_status || false,
            buzzer_override: device.buzzer_override || device.current_value?.buzzer_override || false,
            // Door specific values - tách biệt hoàn toàn với power_status
            door_status: device.current_value?.door_status || device.door_status || 'closed',
            lock_status: device.lock_status === 'locked' || device.current_value?.lock_status || false
        };
    },

    // Get device ID with fallback
    getDeviceId: (device) => device?.device_id || device?.id,

    // Get main display value based on capabilities
    getMainDisplayValue: (capabilities, currentValues) => {
        if (capabilities?.capabilities.includes("TEMPERATURE_MONITORING") && (currentValues.temp !== undefined || currentValues.temp !== 0)) {
            return {
                value: `${currentValues.temp || 0}°C`,
                label: "Nhiệt độ"
            };
        } else if (capabilities?.capabilities.includes("GAS_DETECTION") && (currentValues.gas !== undefined || currentValues.ppm !== undefined)) {
            const gasValue = currentValues.gas || currentValues.ppm || 0;
            return {
                value: `${gasValue} PPM`,
                label: "Nồng độ khí"
            };
        } else if (capabilities?.capabilities.includes("LIGHT_CONTROL") && (currentValues.brightness !== undefined || currentValues.brightness !== 0)) {
            return {
                value: `${currentValues.brightness || 0}%`,
                label: "Độ sáng"
            };
        }
        
        return {
            value: "N/A",
            label: "Trạng thái"
        };
    },

    // Check if device has warning status
    hasWarningStatus: (currentValues) => {
        const gasValue = currentValues.gas || currentValues.ppm || 0;
        return (gasValue > 1000) || (currentValues.temp > 35);
    }
};

// LED modes processing helpers
export const ledUtils = {
    // Process LED modes from socket capabilities
    processLEDModes: (ledCapabilities, deviceSerialNumber) => {
        console.log(`[LEDUtils] Processing LED modes for ${deviceSerialNumber}:`, {
            ledCapabilities,
            hasPresets: !!ledCapabilities?.supported_presets,
            presetsCount: ledCapabilities?.supported_presets?.length || 0
        });

        if (!ledCapabilities?.supported_presets) {
            console.log(`[LEDUtils] No LED presets from socket, returning empty object`);
            return {};
        }

        const desc = ledCapabilities.preset_descriptions || {};
        const modes = Object.fromEntries(
            ledCapabilities.supported_presets.map(key => [
                key,
                {
                    key,
                    label: desc[key] || key,
                    color: '#fff', // Có thể lấy từ ledCapabilities nếu có
                    description: desc[key] || key,
                    brightness: 80 // Có thể lấy từ ledCapabilities nếu có
                }
            ])
        );

        console.log(`[LEDUtils] ✅ Processed ${Object.keys(modes).length} LED modes:`, modes);
        return modes;
    }
};

// Stats grid helpers
export const statsHelpers = {
    // Generate stats array based on device capabilities and values
    generateStats: (capabilities, currentValues) => {
        const stats = [];

        // Add relevant stats based on capabilities - always show for demo
        stats.push({
            icon: "Thermometer",
            value: `${currentValues.temp || 0}°C`,
            label: "Nhiệt độ",
            color: currentValues.temp > 30 ? "text-red-500" : "text-blue-500"
        });

        stats.push({
            icon: "Droplets",
            value: `${currentValues.hum || 0}%`,
            label: "Độ ẩm",
            color: "text-blue-500"
        });

        const gasValue = currentValues.gas || currentValues.ppm || 0;
        stats.push({
            icon: "Wind",
            value: `${gasValue} PPM`,
            label: "Nồng độ khí",
            color: gasValue > 1000 ? "text-red-500" : "text-green-500"
        });

        if (capabilities?.capabilities.includes("LIGHT_CONTROL")) {
            stats.push({
                icon: "Lightbulb",
                value: `${currentValues.brightness || 0}%`,
                label: "Độ sáng",
                color: "text-yellow-500"
            });
        }

        if (capabilities?.capabilities.includes("COLOR_CONTROL")) {
            const colorValue = currentValues.color;
            const hue = colorUtils.extractHue(colorValue);
            const colorDisplayName = colorUtils.getColorName(hue);

            stats.push({
                icon: "Palette",
                value: colorDisplayName,
                label: "Màu sắc",
                color: "text-purple-500"
            });
        }

        return stats;
    }
}; 