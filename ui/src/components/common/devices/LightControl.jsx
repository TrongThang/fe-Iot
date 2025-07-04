import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '../../ui/button';
import { Card, CardContent } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Slider } from '../../ui/slider';
import { Switch } from '../../ui/switch';
import { 
    Lightbulb, 
    Palette,
    Settings,
    Music,
    TreePine,
    Gamepad,
    AlertTriangle,
    BedDouble,
    Coffee,
    Film,
    Heart,
    Gift,
    Waves,
    Star,
    Sparkles
} from 'lucide-react';

const LightControl = ({ 
    isOn = false,
    brightness = 75,
    color = "#ffffff",
    colorMode = "manual",
    serialNumber = null,
    ledModes = {}, // Danh sách LED modes nhận từ socket
    onToggle = () => {},
    onBrightnessChange = () => {},
    onColorChange = () => {},
    onColorModeChange = () => {},
    disabled = false 
}) => {
    const [selectedPreset, setSelectedPreset] = useState(colorMode);
    const [apiError, setApiError] = useState(null);
    
    // Sync selectedPreset với colorMode prop khi thay đổi từ bên ngoài
    useEffect(() => {
        setSelectedPreset(colorMode);
        console.log(`🔄 LightControl: Syncing selectedPreset with colorMode prop: ${colorMode}`);
    }, [colorMode]);

    // Icon mapping cho LED presets
    const getPresetIcon = (presetKey) => {
        const iconMap = {
            'manual': Settings,
            'party_mode': Music,
            'relaxation_mode': TreePine,
            'gaming_mode': Gamepad,
            'alarm_mode': AlertTriangle,
            'sleep_mode': BedDouble,
            'wake_up_mode': Coffee,
            'focus_mode': Lightbulb,
            'movie_mode': Film,
            'romantic_mode': Heart,
            'celebration_mode': Gift,
            'rainbow_dance': Sparkles,
            'ocean_wave': Waves,
            'meteor_shower': Star,
            'christmas_mode': TreePine,
            'disco_fever': Music
        };
        return iconMap[presetKey] || Sparkles;
    };

    // Fallback presets when no modes from socket
    const getFallbackPresets = () => ({
        manual: {
            key: 'manual',
            label: 'Tùy chỉnh',
            icon: Settings,
            color: color,
            description: 'Chọn màu tùy ý',
            brightness: null,
            isSystemDefault: true
        },
        party_mode: {
            key: 'party_mode',
            label: 'Tiệc tùng',
            icon: Music,
            color: '#FF0080',
            description: 'Ánh sáng disco năng lượng',
            brightness: 90,
            isSystemDefault: true
        },
        relaxation_mode: {
            key: 'relaxation_mode',
            label: 'Thư giãn',
            icon: TreePine,
            color: '#9370DB',
            description: 'Ánh sáng nhẹ nhàng thư giãn',
            brightness: 60,
            isSystemDefault: true
        },
        focus_mode: {
            key: 'focus_mode',
            label: 'Tập trung',
            icon: Lightbulb,
            color: '#4169E1',
            description: 'Ánh sáng ổn định tập trung',
            brightness: 90,
            isSystemDefault: true
        }
    });

    // Combine socket modes với fallback và thêm icons
    const colorPresets = useMemo(() => {
        console.log(`[LightControl] Processing LED modes for ${serialNumber}:`, {
            ledModes,
            ledModesKeys: Object.keys(ledModes || {}),
            ledModesCount: Object.keys(ledModes || {}).length
        });

        const fallback = getFallbackPresets();
        
        // Nếu có modes từ socket, sử dụng chúng
        if (ledModes && Object.keys(ledModes).length > 0) {
            const socketModes = {
                manual: fallback.manual // Luôn có manual mode
            };
            
            // Thêm modes từ socket với icons
            Object.entries(ledModes).forEach(([key, mode]) => {
                socketModes[key] = {
                    ...mode,
                    icon: getPresetIcon(key)
                };
            });
            
            console.log(`[LightControl] ✅ Using ${Object.keys(ledModes).length} LED modes from socket:`, socketModes);
            return socketModes;
        }
        
        // Fallback khi không có socket modes
        console.log('[LightControl] ⚠️ Using fallback LED presets (no socket modes)');
        return fallback;
    }, [ledModes, color, serialNumber]);

    // Auto-detect color mode when color changes
    useEffect(() => {
        if (colorMode === 'manual') {
            const detectedMode = detectModeFromColor(color);
            if (detectedMode !== 'manual' && detectedMode !== selectedPreset) {
                console.log(`🔍 Auto-detected color mode: ${detectedMode} for color ${color}`);
                setSelectedPreset(detectedMode);
            }
        }
    }, [color, colorMode, selectedPreset]);

    const detectModeFromColor = (color) => {
        for (const [key, preset] of Object.entries(colorPresets)) {
            if (key !== 'manual' && preset.color && preset.color.toLowerCase() === color.toLowerCase()) {
                return key;
            }
        }
        return 'manual';
    };

    const handlePresetChange = async (presetKey) => {
        console.log(`🎨 LightControl: Preset change to ${presetKey}`);
        setSelectedPreset(presetKey);
        
        // Color mode chỉ để hiển thị UI, KHÔNG gửi lên API
        onColorModeChange(presetKey);
        
        if (presetKey === 'manual') {
            // Manual mode - chỉ update UI
            if (colorPresets[presetKey]?.color !== color) {
                onColorChange(colorPresets[presetKey]?.color || color);
            }
            return;
        }
        
        // Apply preset - chỉ update local UI, socket sẽ handle preset application
        const preset = colorPresets[presetKey];
        if (preset) {
            if (preset.color !== color) {
                console.log(`🎨 Updating color to: ${preset.color}`);
                onColorChange(preset.color);
            }
            if (preset.brightness && preset.brightness !== brightness) {
                console.log(`💡 Updating brightness to: ${preset.brightness}%`);
                onBrightnessChange(preset.brightness);
            }
        }
        
        console.log(`✅ LED preset "${presetKey}" applied locally (socket will handle device communication)`);
    };

    const handleCustomColorChange = (newColor) => {
        console.log(`🎨 LightControl: Custom color change to ${newColor} (sẽ gửi lên API)`);
        setSelectedPreset('manual');
        // Set color mode về 'manual' cho UI, KHÔNG gửi lên API
        onColorModeChange('manual');
        onColorChange(newColor);
    };

    const handleBrightnessChange = (brightness) => {
        console.log(`💡 LightControl: Brightness change to ${brightness}%`);
        onBrightnessChange(brightness);
    };

    const handleToggle = (on) => {
        console.log(`🔌 LightControl: Toggle to ${on ? 'ON' : 'OFF'}`);
        onToggle(on);
    };

    // Convert hex to hue for color picker
    const hexToHue = (hex) => {
        const r = parseInt(hex.slice(1, 3), 16) / 255;
        const g = parseInt(hex.slice(3, 5), 16) / 255;
        const b = parseInt(hex.slice(5, 7), 16) / 255;

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
    };

    const hslToHex = (h, s, l) => {
        l /= 100;
        s /= 100;
        const a = s * Math.min(l, 1 - l);
        const f = n => {
            const k = (n + h / 30) % 12;
            const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
            return Math.round(255 * color).toString(16).padStart(2, '0');
        };
        return `#${f(0)}${f(8)}${f(4)}`;
    };

    const currentHue = hexToHue(color);
    const currentColor = colorPresets[selectedPreset]?.color || color;

    return (
        <Card className="overflow-hidden">
            <CardContent className="p-6">
                <div className="space-y-6">
                    {/* Light Visual Representation */}
                    <div className="relative">
                        <div className="text-center mb-6">
                            <h3 className="text-lg font-semibold mb-2">Điều khiển đèn LED</h3>
                            <div className="flex items-center justify-center space-x-2">
                                <Badge variant={isOn ? "default" : "secondary"}>
                                    {isOn ? 'Đang bật' : 'Đã tắt'}
                                </Badge>
                                <Badge variant="outline">
                                    {brightness}% độ sáng
                                </Badge>
                                {serialNumber && (
                                    <Badge variant="outline" className="text-xs">
                                        {serialNumber.slice(-4)}
                                    </Badge>
                                )}
                            </div>
                        </div>

                        {/* Light Bulb Visualization */}
                        <div className="relative w-full h-32 flex items-center justify-center mb-6">
                            <div className="relative">
                                {/* Light Bulb */}
                                <div 
                                    className={`w-16 h-20 rounded-full flex items-center justify-center transition-all duration-300 ${
                                        isOn ? 'shadow-2xl scale-110' : 'shadow-md'
                                    }`}
                                    style={{
                                        backgroundColor: isOn ? currentColor : '#f1f5f9',
                                        boxShadow: isOn 
                                            ? `0 0 30px ${currentColor}40, 0 0 60px ${currentColor}20` 
                                            : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                        opacity: isOn ? (brightness / 100) * 0.9 + 0.1 : 0.5
                                    }}
                                >
                                    <Lightbulb 
                                        className={`w-8 h-8 transition-all duration-300 ${
                                            isOn ? 'text-white drop-shadow-lg' : 'text-slate-400'
                                        }`}
                                    />
                                </div>

                                {/* Light Rays */}
                                {isOn && (
                                    <div className="absolute inset-0 pointer-events-none">
                                        {[...Array(8)].map((_, i) => (
                                            <div
                                                key={i}
                                                className="absolute w-1 h-4 bg-yellow-300 rounded-full animate-pulse"
                                                style={{
                                                    top: '50%',
                                                    left: '50%',
                                                    transform: `translate(-50%, -50%) rotate(${i * 45}deg) translateY(-40px)`,
                                                    animationDelay: `${i * 0.1}s`,
                                                    opacity: brightness / 100
                                                }}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* API Error Display */}
                    {apiError && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-600 flex items-center">
                                <AlertTriangle className="w-4 h-4 mr-2" />
                                {apiError}
                            </p>
                        </div>
                    )}

                    {/* Power Control */}
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                        <div className="flex items-center space-x-3">
                            <Lightbulb className={`w-6 h-6 ${isOn ? 'text-yellow-500' : 'text-slate-400'}`} />
                            <div>
                                <p className="font-medium">
                                    {isOn ? 'Đèn đang bật' : 'Đèn đang tắt'}
                                </p>
                                <p className="text-sm text-slate-600">
                                    {isOn ? 'Nhấn để tắt đèn' : 'Nhấn để bật đèn'}
                                </p>
                            </div>
                        </div>
                        
                        <Switch
                            checked={isOn}
                            onCheckedChange={handleToggle}
                            disabled={disabled}
                            className="data-[state=checked]:bg-yellow-500"
                        />
                    </div>

                    {/* Brightness Control */}
                    {isOn && (
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">Độ sáng</span>
                                <span className="text-sm text-slate-500">{brightness}%</span>
                            </div>
                            <Slider
                                value={[brightness]}
                                max={100}
                                min={1}
                                step={1}
                                className="w-full"
                                onValueChange={(value) => handleBrightnessChange(value[0])}
                                disabled={disabled}
                            />
                        </div>
                    )}

                    {/* LED Presets từ Backend */}
                    {isOn && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <Palette className="w-4 h-4 text-slate-600" />
                                    <span className="text-sm font-medium">Chế độ LED</span>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-2">
                                {Object.keys(colorPresets).length > 0 ? (
                                    Object.entries(colorPresets).map(([key, preset]) => {
                                        const IconComponent = preset.icon;
                                        const isSelected = selectedPreset === key;
                                        
                                        return (
                                            <Button
                                                key={key}
                                                variant={isSelected ? "default" : "outline"}
                                                onClick={() => handlePresetChange(key)}
                                                disabled={disabled}
                                                className={`h-16 flex-col space-y-1 relative overflow-hidden ${
                                                    isSelected ? 'ring-2 ring-blue-500' : ''
                                                }`}
                                                title={preset.description}
                                            >
                                                <div 
                                                    className="absolute inset-0 opacity-20"
                                                    style={{ backgroundColor: preset.color }}
                                                />
                                                <div className="relative z-10 flex flex-col items-center space-y-1">
                                                    <IconComponent className="w-4 h-4" />
                                                    <span className="text-xs font-medium">
                                                        {preset.label}
                                                    </span>
                                                </div>
                                            </Button>
                                        );
                                    })
                                ) : (
                                    <div className="col-span-2 text-center py-4 text-gray-500">
                                        Không có preset nào
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Custom Color Picker */}
                    {isOn && selectedPreset === 'manual' && (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">Màu tùy chỉnh</span>
                                <div className="flex items-center space-x-2">
                                    <div
                                        className="w-6 h-6 rounded-full border-2 border-gray-300"
                                        style={{ backgroundColor: color }}
                                    />
                                    <span className="text-sm text-slate-500 font-mono">{color}</span>
                                </div>
                            </div>

                            {/* Color Hue Slider */}
                            <div className="relative h-8 flex items-center">
                                <div
                                    className="absolute inset-0 h-4 rounded-lg border border-gray-200"
                                    style={{
                                        background: 'linear-gradient(to right, ' +
                                            '#ff0000 0%, #ff8000 8.33%, #ffff00 16.67%, #80ff00 25%, ' +
                                            '#00ff00 33.33%, #00ff80 41.67%, #00ffff 50%, #0080ff 58.33%, ' +
                                            '#0000ff 66.67%, #8000ff 75%, #ff00ff 83.33%, #ff0080 91.67%, ' +
                                            '#ff0000 100%)'
                                    }}
                                />

                                <input
                                    type="range"
                                    min={0}
                                    max={360}
                                    step={1}
                                    value={currentHue}
                                    onChange={(e) => {
                                        const newHue = parseInt(e.target.value);
                                        const newColor = hslToHex(newHue, 70, 50);
                                        handleCustomColorChange(newColor);
                                    }}
                                    className="absolute inset-0 w-full h-4 opacity-0 cursor-pointer z-10"
                                    disabled={disabled}
                                />

                                <div
                                    className="absolute w-6 h-6 rounded-full border-3 border-white shadow-lg pointer-events-none z-20"
                                    style={{
                                        backgroundColor: color,
                                        left: `calc(${(currentHue / 360) * 100}% - 12px)`,
                                        top: '50%',
                                        transform: 'translateY(-50%)'
                                    }}
                                />
                            </div>

                            {/* Quick Color Buttons */}
                            <div className="grid grid-cols-6 gap-2">
                                {[
                                    '#FF0000', '#FF8000', '#FFFF00', 
                                    '#00FF00', '#00FFFF', '#0000FF',
                                    '#8000FF', '#FF00FF', '#FFFFFF',
                                    '#FFB366', '#87CEEB', '#DDA0DD'
                                ].map((quickColor) => (
                                    <Button
                                        key={quickColor}
                                        variant="outline"
                                        className="h-8 w-full p-0 border-2"
                                        style={{ 
                                            backgroundColor: quickColor,
                                            borderColor: color === quickColor ? '#3b82f6' : '#e2e8f0'
                                        }}
                                        onClick={() => handleCustomColorChange(quickColor)}
                                        disabled={disabled}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Current Settings Summary */}
                    <div className="pt-4 border-t border-slate-200">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="flex justify-between">
                                <span className="text-slate-600">Trạng thái:</span>
                                <span className={`font-medium ${isOn ? 'text-green-600' : 'text-slate-600'}`}>
                                    {isOn ? 'Bật' : 'Tắt'}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-600">Chế độ:</span>
                                <span className="font-medium text-blue-600">
                                    {colorPresets[selectedPreset]?.label || 'Đang tải...'}
                                </span>
                            </div>
                        </div>
                        
                        {/* Debug info (remove in production) */}
                        {process.env.NODE_ENV === 'development' && serialNumber && (
                            <div className="mt-2 text-xs text-slate-400">
                                Serial: {serialNumber} | Presets: {Object.keys(colorPresets).length}
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default LightControl; 