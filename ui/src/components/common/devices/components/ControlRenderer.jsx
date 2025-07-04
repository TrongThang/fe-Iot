import React from 'react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { controlLabels, controlUnits, controlConfigs } from '../constants/deviceConstants';
import { colorUtils } from '../utils/deviceUtils';

const ControlRenderer = ({ 
    controlKey, 
    controlType, 
    value, 
    onControlChange, 
    onPowerToggle 
}) => {
    const label = controlLabels[controlKey] || controlKey.replace(/_/g, " ");
    const unit = controlUnits[controlKey] || "";

    const renderSlider = () => {
        // Special handling for brightness with visual feedback
        if (controlKey === "brightness") {
            return (
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        {/* Label + hình tròn */}
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{label}</span>
                            <div
                                className={`w-6 h-6 rounded-full transition-all duration-300 ${
                                    value > 0 ? 'bg-yellow-400 shadow-md' : 'bg-gray-300'
                                }`}
                                style={{
                                    opacity: value / 100,
                                    boxShadow: value > 50 ? `0 0 ${value / 5}px rgba(255, 193, 7, 0.6)` : 'none',
                                }}
                            />
                        </div>

                        {/* Giá trị số */}
                        <span className="text-sm text-slate-500">{value}{unit}</span>
                    </div>

                    {/* Slider */}
                    <Slider
                        value={[Number(value)]}
                        max={100}
                        min={0}
                        step={1}
                        className="w-full"
                        onValueChange={(newValue) => onControlChange(controlKey, newValue[0])}
                    />
                </div>
            );
        }

        // Standard slider
        const maxValue = controlConfigs.slider.getMax(controlKey);
        return (
            <div className="space-y-3">
                <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{label}</span>
                    <span className="text-sm text-slate-500">{value}{unit}</span>
                </div>
                <Slider
                    value={[Number(value)]}
                    max={maxValue}
                    min={0}
                    step={1}
                    className="w-full"
                    onValueChange={(newValue) => onControlChange(controlKey, newValue[0])}
                />
            </div>
        );
    };

    const renderToggle = () => {
        return (
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                <span className="text-sm font-medium">{label}</span>
                <Switch
                    checked={Boolean(value)}
                    onCheckedChange={(checked) => {
                        // Handle power_status specially - need to update parent
                        if (controlKey === 'power_status') {
                            onPowerToggle(checked);
                        } else {
                            onControlChange(controlKey, checked);
                        }
                    }}
                />
            </div>
        );
    };

    const renderColorPicker = () => {
        if (controlKey !== "color") return null;

        // Extract hue from HEX, HSL value or use name mapping
        const currentHue = colorUtils.extractHue(value);

        return (
            <div className="space-y-3">
                <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{label}</span>
                    <div className="flex items-center gap-2">
                        <div
                            className="w-6 h-6 rounded-full border-2 border-gray-300"
                            style={colorUtils.getColorStyle(currentHue)}
                        />
                        <span className="text-sm text-slate-500">
                            {colorUtils.getColorName(currentHue)}
                        </span>
                    </div>
                </div>

                {/* Color Hue Slider */}
                <div className="relative h-8 flex items-center">
                    {/* Color spectrum background */}
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

                    {/* Custom range input with inline styling */}
                    <style>{`
                        .color-range-slider {
                            -webkit-appearance: none;
                            appearance: none;
                            background: transparent;
                            cursor: pointer;
                        }
                        
                        .color-range-slider::-webkit-slider-track {
                            background: transparent;
                            height: 16px;
                            border-radius: 8px;
                        }
                        
                        .color-range-slider::-webkit-slider-thumb {
                            -webkit-appearance: none;
                            appearance: none;
                            height: 24px;
                            width: 24px;
                            border-radius: 50%;
                            background: hsl(${currentHue}, 70%, 50%);
                            border: 3px solid white;
                            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                            cursor: pointer;
                        }
                        
                        .color-range-slider::-moz-range-track {
                            background: transparent;
                            height: 16px;
                            border-radius: 8px;
                            border: none;
                        }
                        
                        .color-range-slider::-moz-range-thumb {
                            height: 24px;
                            width: 24px;
                            border-radius: 50%;
                            background: hsl(${currentHue}, 70%, 50%);
                            border: 3px solid white;
                            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                            cursor: pointer;
                        }
                    `}</style>

                    <input
                        type="range"
                        min={0}
                        max={360}
                        step={1}
                        value={currentHue}
                        onChange={(e) => {
                            const newHue = parseInt(e.target.value);
                            const colorValue = colorUtils.getColorFromHue(newHue); // Returns HEX format
                            onControlChange(controlKey, colorValue);
                        }}
                        className="absolute inset-0 w-full h-4 color-range-slider z-10"
                    />
                </div>

                <div className="text-center">
                    <span className="text-xs text-slate-400">
                        Màu hiện tại: <span className="font-medium">{colorUtils.getColorName(currentHue)}</span> ({currentHue}°)
                    </span>
                </div>
            </div>
        );
    };

    const renderButton = () => {
        return (
            <Button
                variant="outline"
                className="w-full"
                onClick={() => onControlChange(controlKey, !value)}
            >
                {label}
            </Button>
        );
    };

    const renderDefault = () => {
        return (
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                <span className="text-sm font-medium">{label}</span>
                <span className="text-sm">{value}{unit}</span>
            </div>
        );
    };

    // Main switch for control types
    switch (controlType) {
        case "slider":
            return renderSlider();
        case "toggle":
            return renderToggle();
        case "color_picker":
            return renderColorPicker();
        case "button":
            return renderButton();
        default:
            return renderDefault();
    }
};

export default ControlRenderer; 