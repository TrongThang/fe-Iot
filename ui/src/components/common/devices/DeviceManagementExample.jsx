import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { 
    Monitor,
    Shield,
    Share2,
    Users,
    Settings,
    Lightbulb
} from 'lucide-react';

// Import our new components
import DynamicDeviceDetail from './DynamicDeviceDetail';
import DeviceSecurityActions from './DeviceSecurityActions';
import DeviceShareModal from './DeviceShareModal';
import SharedUsersList from './SharedUsersList';

const DeviceManagementExample = () => {
    const [selectedDevice, setSelectedDevice] = useState(null);

    // Mock device data
    const mockDevices = [
        {
            id: 'device_001',
            device_id: 'device_001',
            serial_number: 'SN123456789',
            device_name: 'Smart Light - Living Room',
            name: 'Smart Light - Living Room',
            type: 'light',
            power_status: true,
            is_locked: false,
            owner_name: 'Nguyễn Văn A',
            owner_email: 'user@example.com',
            owner_id: 'user_001',
            created_at: '2024-01-01T00:00:00Z',
            last_updated: '2024-01-21T10:30:00Z',
            current_value: {
                brightness: 75,
                color: '#ff6b35',
                temp: 28,
                hum: 65
            },
            brightness: 75,
            color: '#ff6b35',
            temp: 28,
            humidity: 65,
            lock_history: [
                {
                    action: 'unlock',
                    timestamp: '2024-01-21T10:30:00Z',
                    user: 'Nguyễn Văn A'
                },
                {
                    action: 'lock',
                    timestamp: '2024-01-20T22:15:00Z',
                    user: 'Nguyễn Văn A'
                }
            ]
        },
        {
            id: 'device_002',
            device_id: 'device_002',
            serial_number: 'SN987654321',
            device_name: 'Smoke Detector - Kitchen',
            name: 'Smoke Detector - Kitchen',
            type: 'smoke',
            power_status: true,
            is_locked: false,
            owner_name: 'Trần Thị B',
            owner_email: 'user2@example.com',
            owner_id: 'user_002',
            created_at: '2024-01-05T00:00:00Z',
            last_updated: '2024-01-21T11:45:00Z',
            current_value: {
                gas: 450,
                ppm: 450,
                temp: 32,
                hum: 70,
                sensitivity: 80,
                alarm_status: false
            },
            gas: 450,
            ppm: 450,
            temp: 32,
            humidity: 70,
            sensitivity: 80,
            alarm_status: false
        }
    ];

    const handleDeviceSelect = (device) => {
        setSelectedDevice(device);
    };

    const handleSecurityUpdate = async (action, data) => {
        console.log(`🔒 Security update: ${action}`, data);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        return { success: true };
    };

    const handleShareDevice = async (deviceId, shareData) => {
        console.log(`📤 Sharing device ${deviceId}:`, shareData);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        return { success: true };
    };

    const handleRemoveSharedUser = async (deviceId, userId) => {
        console.log(`🗑️ Removing user ${userId} from device ${deviceId}`);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        return { success: true };
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Device Management Demo
                    </h1>
                    <p className="text-gray-600">
                        Demonstration of device security, sharing, and control features
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Device Selection Panel */}
                    <div className="lg:col-span-1">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Monitor className="w-5 h-5 mr-2" />
                                    Available Devices
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {mockDevices.map((device) => (
                                    <div
                                        key={device.id}
                                        className={`p-4 border rounded-lg cursor-pointer transition-all ${
                                            selectedDevice?.id === device.id
                                                ? 'border-blue-500 bg-blue-50'
                                                : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                        onClick={() => handleDeviceSelect(device)}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div className="flex-shrink-0">
                                                {device.type === 'light' ? (
                                                    <Lightbulb className="w-8 h-8 text-yellow-500" />
                                                ) : (
                                                    <Shield className="w-8 h-8 text-red-500" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-sm text-gray-900 truncate">
                                                    {device.device_name}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {device.serial_number}
                                                </p>
                                                <div className="flex items-center space-x-2 mt-1">
                                                    <Badge 
                                                        variant={device.power_status ? "default" : "secondary"}
                                                        className="text-xs"
                                                    >
                                                        {device.power_status ? "Online" : "Offline"}
                                                    </Badge>
                                                    {device.is_locked && (
                                                        <Badge variant="destructive" className="text-xs">
                                                            Locked
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Quick Actions */}
                        {selectedDevice && (
                            <Card className="mt-6">
                                <CardHeader>
                                    <CardTitle className="text-base">Quick Actions</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <DeviceShareModal 
                                        device={selectedDevice}
                                        onShareDevice={handleShareDevice}
                                        trigger={
                                            <Button variant="outline" className="w-full justify-start">
                                                <Share2 className="w-4 h-4 mr-2" />
                                                Share Device
                                            </Button>
                                        }
                                    />
                                    
                                    <Button 
                                        variant="outline" 
                                        className="w-full justify-start"
                                        onClick={() => console.log('View analytics')}
                                    >
                                        <Settings className="w-4 h-4 mr-2" />
                                        View Analytics
                                    </Button>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        {selectedDevice ? (
                            <Tabs defaultValue="controls" className="space-y-6">
                                <TabsList className="grid w-full grid-cols-4">
                                    <TabsTrigger value="controls">Controls</TabsTrigger>
                                    <TabsTrigger value="security">Security</TabsTrigger>
                                    <TabsTrigger value="sharing">Sharing</TabsTrigger>
                                    <TabsTrigger value="users">Users</TabsTrigger>
                                </TabsList>

                                <TabsContent value="controls" className="space-y-6">
                                    <DynamicDeviceDetail device={selectedDevice} />
                                </TabsContent>

                                <TabsContent value="security" className="space-y-6">
                                    <DeviceSecurityActions 
                                        device={selectedDevice}
                                        onSecurityUpdate={handleSecurityUpdate}
                                    />
                                </TabsContent>

                                <TabsContent value="sharing" className="space-y-6">
                                    <Card>
                                        <CardContent className="p-6">
                                            <div className="text-center space-y-4">
                                                <Share2 className="w-12 h-12 text-blue-500 mx-auto" />
                                                <h3 className="text-lg font-semibold">Share Device Access</h3>
                                                <p className="text-gray-600 max-w-md mx-auto">
                                                    Grant other users access to view or control this device. 
                                                    You can set different permission levels and expiry dates.
                                                </p>
                                                <DeviceShareModal 
                                                    device={selectedDevice}
                                                    onShareDevice={handleShareDevice}
                                                />
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                <TabsContent value="users" className="space-y-6">
                                    <SharedUsersList 
                                        device={selectedDevice}
                                        onRemoveSharedUser={handleRemoveSharedUser}
                                        refreshSharedUsers={0}
                                    />
                                </TabsContent>
                            </Tabs>
                        ) : (
                            <Card>
                                <CardContent className="p-12 text-center">
                                    <Monitor className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                        Select a Device
                                    </h3>
                                    <p className="text-gray-600 max-w-md mx-auto">
                                        Choose a device from the left panel to view its controls, 
                                        security settings, and sharing options.
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>

                {/* Feature Overview */}
                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                        <CardContent className="p-6 text-center">
                            <Shield className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                            <h3 className="font-semibold mb-2">Device Security</h3>
                            <p className="text-sm text-gray-600">
                                Lock devices, view security history, and enable emergency lockdown
                            </p>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardContent className="p-6 text-center">
                            <Share2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
                            <h3 className="font-semibold mb-2">Device Sharing</h3>
                            <p className="text-sm text-gray-600">
                                Share device access with custom permissions and expiry dates
                            </p>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardContent className="p-6 text-center">
                            <Users className="w-12 h-12 text-purple-500 mx-auto mb-4" />
                            <h3 className="font-semibold mb-2">User Management</h3>
                            <p className="text-sm text-gray-600">
                                View shared users, manage permissions, and track access history
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default DeviceManagementExample; 