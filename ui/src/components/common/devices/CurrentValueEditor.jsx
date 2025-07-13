import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Save, RotateCcw, Edit3, ChevronDown, ChevronUp } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import deviceApi from '@/apis/modules/deviceApi';

const CurrentValueEditor = ({ device, currentValue, onCurrentValueChange }) => {
    const [editedValues, setEditedValues] = useState({});
    const [saving, setSaving] = useState(false);
    const [expandedComponents, setExpandedComponents] = useState({});

    // Initialize edited values from current_value
    useEffect(() => {
        if (currentValue && Array.isArray(currentValue)) {
            const initialValues = {};
            currentValue.forEach(component => {
                if (component.instances && Array.isArray(component.instances)) {
                    component.instances.forEach(instance => {
                        const key = `${component.component_id}_${instance.index}`;
                        initialValues[key] = instance.value;
                    });
                }
            });
            setEditedValues(initialValues);
        }
    }, [currentValue]);

    // Toggle component expansion
    const toggleComponent = (componentId) => {
        setExpandedComponents(prev => ({
            ...prev,
            [componentId]: !prev[componentId]
        }));
    };

    // Handle value change
    const handleValueChange = (componentId, instanceIndex, newValue) => {
        const key = `${componentId}_${instanceIndex}`;
        setEditedValues(prev => ({
            ...prev,
            [key]: newValue
        }));
    };

    // Reset all changes
    const handleReset = () => {
        if (currentValue && Array.isArray(currentValue)) {
            const resetValues = {};
            currentValue.forEach(component => {
                if (component.instances && Array.isArray(component.instances)) {
                    component.instances.forEach(instance => {
                        const key = `${component.component_id}_${instance.index}`;
                        resetValues[key] = instance.value;
                    });
                }
            });
            setEditedValues(resetValues);
        }
    };

    // Save changes
    const handleSave = async () => {
        try {
            setSaving(true);
            
            // Rebuild current_value with edited values
            const updatedCurrentValue = currentValue.map(component => ({
                ...component,
                instances: component.instances.map(instance => {
                    const key = `${component.component_id}_${instance.index}`;
                    return {
                        ...instance,
                        value: editedValues[key] || instance.value
                    };
                })
            }));

            // Call API to update device current_value
            await deviceApi.updateDeviceCurrentValue(device.serial_number, updatedCurrentValue);
            
            // Update parent component
            if (onCurrentValueChange) {
                onCurrentValueChange(updatedCurrentValue);
            }
            
            console.log('✅ Current value updated successfully');
        } catch (error) {
            console.error('❌ Failed to update current value:', error);
        } finally {
            setSaving(false);
        }
    };

    // Check if there are any changes
    const hasChanges = () => {
        if (!currentValue || !Array.isArray(currentValue)) return false;
        
        for (const component of currentValue) {
            if (component.instances && Array.isArray(component.instances)) {
                for (const instance of component.instances) {
                    const key = `${component.component_id}_${instance.index}`;
                    if (editedValues[key] !== instance.value) {
                        return true;
                    }
                }
            }
        }
        return false;
    };

    // Render input based on datatype
    const renderValueInput = (component, instance) => {
        const key = `${component.component_id}_${instance.index}`;
        const currentEditedValue = editedValues[key] || instance.value;
        
        switch (component.datatype) {
            case 'BOOLEAN':
                return (
                    <div className="flex items-center space-x-2">
                        <Switch
                            checked={currentEditedValue === 'true' || currentEditedValue === true}
                            onCheckedChange={(checked) => 
                                handleValueChange(component.component_id, instance.index, checked.toString())
                            }
                        />
                        <Label className="text-sm">
                            {currentEditedValue === 'true' || currentEditedValue === true ? 'Bật' : 'Tắt'}
                        </Label>
                    </div>
                );
            
            case 'NUMBER':
                return (
                    <div className="space-y-2">
                        <Input
                            type="number"
                            value={currentEditedValue}
                            onChange={(e) => 
                                handleValueChange(component.component_id, instance.index, e.target.value)
                            }
                            min={component.min}
                            max={component.max}
                            step={component.datatype === 'NUMBER' ? 0.1 : 1}
                            className="w-full"
                        />
                        {(component.min !== null || component.max !== null) && (
                            <div className="text-xs text-gray-500">
                                Giới hạn: {component.min || 0} - {component.max || 'không giới hạn'}
                                {component.unit && ` ${component.unit}`}
                            </div>
                        )}
                    </div>
                );
            
            case 'STRING':
            default:
                return (
                    <Input
                        type="text"
                        value={currentEditedValue}
                        onChange={(e) => 
                            handleValueChange(component.component_id, instance.index, e.target.value)
                        }
                        className="w-full"
                    />
                );
        }
    };

    // Get flow type badge color
    const getFlowTypeBadgeColor = (flowType) => {
        switch (flowType) {
            case 'input':
                return 'bg-blue-100 text-blue-800';
            case 'output':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (!currentValue || !Array.isArray(currentValue) || currentValue.length === 0) {
        return (
            <Card>
                <CardContent className="p-6 text-center">
                    <p className="text-gray-500">Không có dữ liệu current_value để chỉnh sửa</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                        <Edit3 className="w-5 h-5 mr-2" />
                        Chỉnh sửa giá trị thành phần
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleReset}
                            disabled={!hasChanges()}
                        >
                            <RotateCcw className="w-4 h-4 mr-1" />
                            Đặt lại
                        </Button>
                        <Button
                            size="sm"
                            onClick={handleSave}
                            disabled={!hasChanges() || saving}
                        >
                            {saving ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-1"></div>
                                    Đang lưu...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4 mr-1" />
                                    Lưu thay đổi
                                </>
                            )}
                        </Button>
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
                <div className="space-y-4">
                    {currentValue.map((component, index) => {
                        const isExpanded = expandedComponents[component.component_id] ?? true;
                        
                        return (
                            <Collapsible
                                key={component.component_id}
                                open={isExpanded}
                                onOpenChange={() => toggleComponent(component.component_id)}
                            >
                                <CollapsibleTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        className="w-full flex items-center justify-between p-4 h-auto border rounded-lg hover:bg-gray-50"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <Badge className={getFlowTypeBadgeColor(component.flow_type)}>
                                                {component.flow_type}
                                            </Badge>
                                            <div className="text-left">
                                                <div className="font-medium">{component.component_id}</div>
                                                <div className="text-sm text-gray-500">
                                                    {component.datatype}
                                                    {component.unit && ` (${component.unit})`}
                                                    {' • '}
                                                    {component.instances?.length || 0} instance(s)
                                                </div>
                                            </div>
                                        </div>
                                        {isExpanded ? (
                                            <ChevronUp className="w-4 h-4" />
                                        ) : (
                                            <ChevronDown className="w-4 h-4" />
                                        )}
                                    </Button>
                                </CollapsibleTrigger>
                                
                                <CollapsibleContent className="mt-3">
                                    <div className="pl-4 space-y-3">
                                        {component.instances && component.instances.map((instance, instanceIndex) => {
                                            const key = `${component.component_id}_${instance.index}`;
                                            const hasChanged = editedValues[key] !== instance.value;
                                            
                                            return (
                                                <div
                                                    key={instance.index}
                                                    className={`p-3 rounded-lg border-2 transition-colors ${
                                                        hasChanged 
                                                            ? 'border-blue-200 bg-blue-50' 
                                                            : 'border-gray-200 bg-gray-50'
                                                    }`}
                                                >
                                                    <div className="flex items-center justify-between mb-2">
                                                        <Label className="font-medium">
                                                            {instance.name_display}
                                                        </Label>
                                                        <div className="flex items-center space-x-2">
                                                            <Badge variant="secondary" className="text-xs">
                                                                Index {instance.index}
                                                            </Badge>
                                                            {hasChanged && (
                                                                <Badge variant="outline" className="text-xs text-blue-600">
                                                                    Đã thay đổi
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="space-y-2">
                                                        {renderValueInput(component, instance)}
                                                        
                                                        {hasChanged && (
                                                            <div className="text-xs text-gray-500 mt-1">
                                                                Giá trị gốc: <span className="font-mono">{instance.value}</span>
                                                                {' → '}
                                                                Giá trị mới: <span className="font-mono text-blue-600">{editedValues[key]}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </CollapsibleContent>
                            </Collapsible>
                        );
                    })}
                </div>
                
                {hasChanges() && (
                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-800">
                            💡 Bạn có thay đổi chưa lưu. Nhấn "Lưu thay đổi" để áp dụng các thay đổi vào thiết bị.
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default CurrentValueEditor; 