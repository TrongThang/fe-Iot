import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CurrentValueEditor from './CurrentValueEditor';

const DemoCurrentValueEditor = () => {
    const [demoCurrentValue, setDemoCurrentValue] = useState([
        {
            "component_id": "TEMP_123456",
            "flow_type": "input",
            "unit": "°C",
            "datatype": "NUMBER",
            "min": -40,
            "max": 85,
            "instances": [
                {
                    "index": 1,
                    "value": "25.0",
                    "name_display": "Cảm biến nhiệt độ"
                }
            ]
        },
        {
            "component_id": "LED_789012",
            "flow_type": "output",
            "unit": null,
            "datatype": "STRING",
            "instances": [
                {
                    "index": 1,
                    "value": "off",
                    "name_display": "Đèn LED"
                }
            ]
        },
        {
            "component_id": "RELAY_345678",
            "flow_type": "output",
            "unit": null,
            "datatype": "BOOLEAN",
            "instances": [
                {
                    "index": 1,
                    "value": "false",
                    "name_display": "Relay Module 1"
                },
                {
                    "index": 2,
                    "value": "false",
                    "name_display": "Relay Module 2"
                },
                {
                    "index": 3,
                    "value": "false",
                    "name_display": "Relay Module 3"
                }
            ]
        },
        {
            "component_id": "ANALOG_901234",
            "flow_type": "input",
            "unit": "V",
            "datatype": "NUMBER",
            "min": 0,
            "max": 3.3,
            "instances": [
                {
                    "index": 1,
                    "value": "0",
                    "name_display": "Analog Input 1"
                },
                {
                    "index": 2,
                    "value": "0",
                    "name_display": "Analog Input 2"
                }
            ]
        }
    ]);

    const mockDevice = {
        device_id: "DEMO_DEVICE",
        serial_number: "DEMO_SERIAL_001",
        name: "Demo Smart Device",
        current_value: demoCurrentValue
    };

    const handleCurrentValueChange = (updatedCurrentValue) => {
        console.log('🔄 Demo: Current value updated:', updatedCurrentValue);
        setDemoCurrentValue(updatedCurrentValue);
    };

    const resetToDefaults = () => {
        setDemoCurrentValue([
            {
                "component_id": "TEMP_123456",
                "flow_type": "input",
                "unit": "°C",
                "datatype": "NUMBER",
                "min": -40,
                "max": 85,
                "instances": [
                    {
                        "index": 1,
                        "value": "25.0",
                        "name_display": "Cảm biến nhiệt độ"
                    }
                ]
            },
            {
                "component_id": "LED_789012",
                "flow_type": "output",
                "unit": null,
                "datatype": "STRING",
                "instances": [
                    {
                        "index": 1,
                        "value": "off",
                        "name_display": "Đèn LED"
                    }
                ]
            },
            {
                "component_id": "RELAY_345678",
                "flow_type": "output",
                "unit": null,
                "datatype": "BOOLEAN",
                "instances": [
                    {
                        "index": 1,
                        "value": "false",
                        "name_display": "Relay Module 1"
                    },
                    {
                        "index": 2,
                        "value": "false",
                        "name_display": "Relay Module 2"
                    },
                    {
                        "index": 3,
                        "value": "false",
                        "name_display": "Relay Module 3"
                    }
                ]
            },
            {
                "component_id": "ANALOG_901234",
                "flow_type": "input",
                "unit": "V",
                "datatype": "NUMBER",
                "min": 0,
                "max": 3.3,
                "instances": [
                    {
                        "index": 1,
                        "value": "0",
                        "name_display": "Analog Input 1"
                    },
                    {
                        "index": 2,
                        "value": "0",
                        "name_display": "Analog Input 2"
                    }
                ]
            }
        ]);
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>🧪 Demo: Current Value Editor</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <p className="text-sm text-gray-600">
                            Đây là demo cho component CurrentValueEditor với cấu trúc current_value mới.
                            Bạn có thể chỉnh sửa giá trị các thành phần và xem kết quả thay đổi.
                        </p>
                        
                        <div className="flex items-center justify-between">
                            <div className="text-sm">
                                <strong>Mock Device:</strong> {mockDevice.name} ({mockDevice.serial_number})
                            </div>
                            <Button 
                                variant="outline" 
                                size="sm"
                                onClick={resetToDefaults}
                            >
                                Reset Demo
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Tabs defaultValue="editor" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="editor">Editor</TabsTrigger>
                    <TabsTrigger value="json">JSON View</TabsTrigger>
                </TabsList>
                
                <TabsContent value="editor">
                    <CurrentValueEditor 
                        device={mockDevice}
                        currentValue={demoCurrentValue}
                        onCurrentValueChange={handleCurrentValueChange}
                    />
                </TabsContent>
                
                <TabsContent value="json">
                    <Card>
                        <CardHeader>
                            <CardTitle>Current Value JSON</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <pre className="bg-gray-50 p-4 rounded-lg overflow-auto text-sm">
                                {JSON.stringify(demoCurrentValue, null, 2)}
                            </pre>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            <Card>
                <CardHeader>
                    <CardTitle>📊 Thống kê</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">
                                {demoCurrentValue.length}
                            </div>
                            <div className="text-sm text-gray-600">Component Types</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">
                                {demoCurrentValue.reduce((sum, comp) => sum + (comp.instances?.length || 0), 0)}
                            </div>
                            <div className="text-sm text-gray-600">Total Instances</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-orange-600">
                                {demoCurrentValue.filter(comp => comp.flow_type === 'input').length}
                            </div>
                            <div className="text-sm text-gray-600">Input Components</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-purple-600">
                                {demoCurrentValue.filter(comp => comp.flow_type === 'output').length}
                            </div>
                            <div className="text-sm text-gray-600">Output Components</div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>💡 Hướng dẫn sử dụng</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3 text-sm">
                        <div className="flex items-start space-x-3">
                            <span className="text-blue-600 font-semibold">1.</span>
                            <div>
                                <strong>Mở rộng Component:</strong> Click vào header của component để mở rộng/thu gọn
                            </div>
                        </div>
                        <div className="flex items-start space-x-3">
                            <span className="text-blue-600 font-semibold">2.</span>
                            <div>
                                <strong>Chỉnh sửa giá trị:</strong> Thay đổi giá trị trong các input fields
                            </div>
                        </div>
                        <div className="flex items-start space-x-3">
                            <span className="text-blue-600 font-semibold">3.</span>
                            <div>
                                <strong>Các loại dữ liệu:</strong>
                                <ul className="ml-4 mt-1 list-disc">
                                    <li>NUMBER: Input số với min/max validation</li>
                                    <li>BOOLEAN: Switch toggle</li>
                                    <li>STRING: Text input</li>
                                </ul>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3">
                            <span className="text-blue-600 font-semibold">4.</span>
                            <div>
                                <strong>Lưu thay đổi:</strong> Nút "Lưu thay đổi" sẽ gửi request lên server
                            </div>
                        </div>
                        <div className="flex items-start space-x-3">
                            <span className="text-blue-600 font-semibold">5.</span>
                            <div>
                                <strong>Theo dõi thay đổi:</strong> Các thay đổi sẽ được highlight với màu xanh
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default DemoCurrentValueEditor; 