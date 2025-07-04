import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { 
    Palette, 
    Zap, 
    Info, 
    Star,
    AlertCircle,
    Sparkles,
    Clock
} from 'lucide-react';
import ledApi from '../../../apis/modules/ledApi.js';

const LEDCapabilitiesPanel = ({ serialNumber, onApplyPreset, onApplyEffect }) => {
    const [capabilities, setCapabilities] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('presets');

    useEffect(() => {
        const loadCapabilities = async () => {
            if (!serialNumber) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                console.log(`📡 Loading full LED capabilities for: ${serialNumber}`);
                const caps = await ledApi.getLEDCapabilities(serialNumber);
                setCapabilities(caps);
                console.log(`✅ Loaded LED capabilities:`, caps);
            } catch (error) {
                console.error('❌ Failed to load LED capabilities:', error);
            } finally {
                setLoading(false);
            }
        };

        loadCapabilities();
    }, [serialNumber]);

    if (loading) {
        return (
            <Card>
                <CardContent className="p-6">
                    <div className="animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                        <div className="space-y-2">
                            <div className="h-3 bg-gray-200 rounded"></div>
                            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (!capabilities) {
        return (
            <Card>
                <CardContent className="p-6 text-center text-gray-500">
                    <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                    <p>Không thể tải thông tin LED</p>
                </CardContent>
            </Card>
        );
    }

    const renderColorPalette = () => (
        <div className="space-y-4">
            <h4 className="text-sm font-medium">Bảng màu được đề xuất</h4>
            {Object.entries(capabilities.color_palette || {}).map(([category, colors]) => (
                <div key={category} className="space-y-2">
                    <p className="text-xs font-medium text-gray-600 capitalize">
                        {category.replace('_', ' ')}
                    </p>
                    <div className="grid grid-cols-6 gap-2">
                        {colors.map((color, index) => (
                            <Button
                                key={index}
                                variant="outline"
                                className="h-8 w-full p-0 border-2"
                                style={{ backgroundColor: color }}
                                title={color}
                                onClick={() => onApplyEffect && onApplyEffect({
                                    effect: 'solid',
                                    color1: color,
                                    speed: 500
                                })}
                            />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );

    const renderRecommendedCombinations = () => (
        <div className="space-y-3">
            <h4 className="text-sm font-medium">Kết hợp được đề xuất</h4>
            <div className="grid gap-3">
                {(capabilities.recommended_combinations || []).map((combo, index) => (
                    <Card key={index} className="p-3">
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <h5 className="font-medium text-sm">{combo.name}</h5>
                                <p className="text-xs text-gray-600">
                                    {combo.effect} • {combo.speed}ms • {combo.brightness}%
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                    <div 
                                        className="w-4 h-4 rounded border"
                                        style={{ backgroundColor: combo.color1 }}
                                        title={combo.color1}
                                    />
                                    {combo.color2 && (
                                        <div 
                                            className="w-4 h-4 rounded border"
                                            style={{ backgroundColor: combo.color2 }}
                                            title={combo.color2}
                                        />
                                    )}
                                </div>
                            </div>
                            <Button
                                size="sm"
                                onClick={() => onApplyEffect && onApplyEffect({
                                    effect: combo.effect,
                                    speed: combo.speed,
                                    color1: combo.color1,
                                    color2: combo.color2,
                                    brightness: combo.brightness
                                })}
                            >
                                <Sparkles className="w-3 h-3 mr-1" />
                                Áp dụng
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );

    const renderEffects = () => (
        <div className="space-y-3">
            <h4 className="text-sm font-medium">
                Hiệu ứng LED ({capabilities.supported_effects?.length || 0})
            </h4>
            <div className="grid grid-cols-3 gap-2">
                {(capabilities.supported_effects || []).map((effect) => (
                    <Button
                        key={effect}
                        variant="outline"
                        size="sm"
                        className="text-xs"
                        onClick={() => onApplyEffect && onApplyEffect({
                            effect: effect,
                            speed: 500,
                            color1: '#FF0000'
                        })}
                    >
                        {effect}
                    </Button>
                ))}
            </div>
        </div>
    );

    const renderPerformanceNotes = () => (
        <div className="space-y-3">
            <h4 className="text-sm font-medium flex items-center">
                <Info className="w-4 h-4 mr-2" />
                Ghi chú hiệu suất
            </h4>
            <div className="space-y-2">
                {Object.entries(capabilities.performance_notes || {}).map(([effect, note]) => (
                    <div key={effect} className="p-2 bg-yellow-50 rounded text-xs">
                        <span className="font-medium">{effect}:</span> {note}
                    </div>
                ))}
            </div>
        </div>
    );

    const renderParameters = () => (
        <div className="space-y-3">
            <h4 className="text-sm font-medium">Thông số kỹ thuật</h4>
            <div className="grid gap-2">
                {Object.entries(capabilities.parameters || {}).map(([param, config]) => (
                    <div key={param} className="p-2 border rounded text-xs">
                        <div className="flex justify-between items-center">
                            <span className="font-medium capitalize">{param}:</span>
                            <Badge variant="outline" className="text-xs">
                                {config.min} - {config.max}
                            </Badge>
                        </div>
                        <p className="text-gray-600 mt-1">{config.description}</p>
                        <p className="text-gray-500">Mặc định: {config.default}</p>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                    <Zap className="w-5 h-5 mr-2" />
                    LED Capabilities
                    <Badge variant="outline" className="ml-2 text-xs">
                        {capabilities.serial_number?.slice(-4)}
                    </Badge>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="presets" className="text-xs">
                            <Palette className="w-3 h-3 mr-1" />
                            Presets
                        </TabsTrigger>
                        <TabsTrigger value="effects" className="text-xs">
                            <Sparkles className="w-3 h-3 mr-1" />
                            Effects
                        </TabsTrigger>
                        <TabsTrigger value="colors" className="text-xs">
                            <Star className="w-3 h-3 mr-1" />
                            Colors
                        </TabsTrigger>
                        <TabsTrigger value="info" className="text-xs">
                            <Info className="w-3 h-3 mr-1" />
                            Info
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="presets" className="mt-4">
                        <div className="space-y-3">
                            <h4 className="text-sm font-medium">
                                Presets có sẵn ({capabilities.supported_presets?.length || 0})
                            </h4>
                            <div className="grid grid-cols-2 gap-2">
                                {(capabilities.supported_presets || []).map((preset) => {
                                    const description = capabilities.preset_descriptions?.[preset] || 
                                                      capabilities.preset_descriptions?.[preset.replace('_mode', '_Mode')] ||
                                                      'Chế độ LED';
                                    return (
                                        <Button
                                            key={preset}
                                            variant="outline"
                                            size="sm"
                                            className="text-xs h-auto p-2 flex flex-col items-start"
                                            title={description}
                                            onClick={() => onApplyPreset && onApplyPreset(preset)}
                                        >
                                            <span className="font-medium">
                                                {ledApi.formatPresetLabel(preset)}
                                            </span>
                                            <span className="text-gray-500 text-left text-xs leading-tight">
                                                {description}
                                            </span>
                                        </Button>
                                    );
                                })}
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="effects" className="mt-4">
                        {renderEffects()}
                    </TabsContent>

                    <TabsContent value="colors" className="mt-4 space-y-6">
                        {renderColorPalette()}
                        {renderRecommendedCombinations()}
                    </TabsContent>

                    <TabsContent value="info" className="mt-4 space-y-6">
                        {renderParameters()}
                        {renderPerformanceNotes()}
                        
                        {/* Timestamp */}
                        <div className="pt-4 border-t text-xs text-gray-500 flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            Cập nhật: {new Date(capabilities.timestamp).toLocaleString('vi-VN')}
                        </div>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
};

export default LEDCapabilitiesPanel; 