import React, { useState, useEffect } from 'react';
import { 
    Plus, 
    Edit, 
    Trash2, 
    Settings, 
    AlertCircle,
    CheckCircle,
    X,
    ArrowRight,
    Power,
    Zap,
    Link2,
    Database,
    RefreshCw,
    Activity,
    ChevronRight,
    ArrowLeft
} from 'lucide-react';
import deviceLinksApi from '../../../apis/modules/deviceLinksApi';
import deviceApi from '../../../apis/modules/deviceApi';

const DeviceLinksManagerV2 = () => {
    const [deviceLinks, setDeviceLinks] = useState([]);
    const [devices, setDevices] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedInputDevice, setSelectedInputDevice] = useState(null);
    const [selectedOutputDevice, setSelectedOutputDevice] = useState(null);
    const [selectedComponentId, setSelectedComponentId] = useState('');
    const [outputAction, setOutputAction] = useState('turn_on');
    const [hasData, setHasData] = useState(false);
    const [componentValues, setComponentValues] = useState({});
    const [showComponentPanel, setShowComponentPanel] = useState(false);
    
    // Add state for components
    const [inputComponents, setInputComponents] = useState([]);
    const [deviceComponents, setDeviceComponents] = useState({}); // Cache all device components

    // Fetch data on component mount
    useEffect(() => {
        fetchDeviceLinks();
        fetchDevices();
    }, []);

    // Components are now fetched together with devices, no separate fetch needed

    // Re-fetch data when switching between mock and real mode
    useEffect(() => {
        // No longer needed as useMockData is removed
    }, []);

    // Check if we have meaningful data for device links
    useEffect(() => {
        const hasDevicesWithComponents = devices.some(device => 
            device.current_value && typeof device.current_value === 'object' && Object.keys(device.current_value).length > 0
        );
        const hasLinks = deviceLinks.length > 0;
        setHasData(hasDevicesWithComponents || hasLinks);
    }, [devices, deviceLinks]);

    const fetchDeviceLinks = async () => {
        try {
            setIsLoading(true);
            const response = await deviceLinksApi.getDeviceLinks();
            setDeviceLinks(response || []);
        } catch (error) {
            console.error('Error fetching device links:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchDevices = async () => {
        try {
            const response = await deviceApi.getDevicesWithComponents();
            console.log('Devices with components response:', response);
            
            // Handle both array and object response structures
            let devicesList = [];
            if (Array.isArray(response)) {
                devicesList = response;
            } else if (response && Array.isArray(response)) {
                devicesList = response;
            } else if (typeof response === 'object') {
                devicesList = Object.values(response).find(val => Array.isArray(val)) || [];
            }
            
            console.log('Final devices list with components:', devicesList);
            
            // Extract components and store in deviceComponents state
            const componentsData = {};
            devicesList.forEach(device => {
                if (device.components && Array.isArray(device.components)) {
                    componentsData[device.device_id] = device.components;
                }
            });
            
            setDevices(devicesList);
            setDeviceComponents(componentsData);
            
            console.log('Extracted components data:', componentsData);
        } catch (error) {
            console.error('Error fetching devices:', error);
            setDevices([]);
            setDeviceComponents({});
        }
    };

    // Update hasData when devices or deviceLinks change
    useEffect(() => {
        const devicesList = Array.isArray(devices) ? devices : [];
        const linksList = Array.isArray(deviceLinks) ? deviceLinks : [];
        
        // Prioritize showing data if we have device links (regardless of devices)
        const hasDeviceLinks = linksList.length > 0;
        
        // Has data if we have device links OR devices available
        setHasData(hasDeviceLinks || devicesList.length > 0);
        
        console.log('Data status:', {
            devices: devicesList.length,
            deviceLinks: linksList.length,
            hasDeviceLinks,
            hasData: hasDeviceLinks || devicesList.length > 0
        });
    }, [devices, deviceLinks]);

    const handleCreateLink = async () => {
        try {
            if (!selectedInputDevice || !selectedOutputDevice) {
                alert('Vui lòng chọn thiết bị Input và Output để tạo liên kết.');
                return;
            }

            // Validate that at least one component has a value
            const componentsWithValues = Object.entries(componentValues).filter(([_, value]) => value && value.trim() !== '');
            if (componentsWithValues.length === 0) {
                alert('Vui lòng nhập giá trị cho ít nhất một component.');
                return;
            }

            const newLinks = [];
            
            // Create links for each component that has a value
            for (const [componentId, value] of componentsWithValues) {
                const linkData = {
                    input_device_id: selectedInputDevice.device_id,
                    output_device_id: selectedOutputDevice.device_id,
                    component_id: componentId,
                    value_active: value,
                    logic_operator: 'AND',
                    output_action: outputAction
                };

                await deviceLinksApi.createDeviceLink(linkData);
            }

            fetchDeviceLinks();
            alert(`Tạo thành công ${componentsWithValues.length} liên kết!`);
            
            // Reset form
            setSelectedInputDevice(null);
            setSelectedOutputDevice(null);
            setComponentValues({});
            setInputComponents([]);
            setOutputAction('turn_on');
            setShowCreateModal(false);
            setShowComponentPanel(false);
        } catch (error) {
            console.error('Error creating device link:', error);
            alert('Lỗi khi tạo liên kết thiết bị');
        }
    };

    const handleDeleteLink = async (linkId) => {
        if (window.confirm('Bạn có chắc muốn xóa liên kết này?')) {
            try {
                await deviceLinksApi.deleteDeviceLink(linkId);
                fetchDeviceLinks();
            } catch (error) {
                console.error('Error deleting device link:', error);
                alert('Lỗi khi xóa liên kết thiết bị');
            }
        }
    };

    const openCreateModal = async () => {
        setSelectedInputDevice(null);
        setSelectedOutputDevice(null);
        setComponentValues({});
        setInputComponents([]);
        setOutputAction('turn_on');
        setShowComponentPanel(false);
        
        // Fetch devices with their components in one call
        await fetchDevices();
        
        setShowCreateModal(true);
    };

    // Handle input device selection
    const handleInputDeviceSelect = (device) => {
        setSelectedInputDevice(device);
        fetchInputComponents(device.device_id);
        setShowComponentPanel(true);
    };

    // Components are now fetched together with devices - no separate fetch needed

    // Fetch components for selected input device (keep for setting inputComponents)
    const fetchInputComponents = async (deviceId) => {
        if (!deviceId) {
            setInputComponents([]);
            return;
        }

        // Use cached components if available
        if (deviceComponents[deviceId]) {
            const inputComps = deviceComponents[deviceId].filter(comp => 
                comp.flow_type === 'input' || comp.flow_type === 'both'
            );
            setInputComponents(inputComps);
            return;
        }

        // Fallback to individual fetch
        try {
            const response = await deviceApi.getDeviceComponents(deviceId);
            console.log('Device components response:', response);
            
            const components = response || [];
            const inputComps = components.filter(comp => 
                comp.flow_type === 'input' || comp.flow_type === 'both'
            );
            
            setInputComponents(inputComps);
            console.log('Input components for device:', deviceId, inputComps);
        } catch (error) {
            console.error('Error fetching device components:', error);
            setInputComponents([]);
        }
    };

    // Get input components (now returns state)
    const getInputComponents = () => {
        return inputComponents;
    };

    // Render empty state
    const renderEmptyState = () => {
        if (!hasData) {
            return (
                <div className="text-center py-16 bg-gray-50 rounded-lg">
                    <Database className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Không có dữ liệu thiết bị</h3>
                    <p className="text-gray-500 mb-6">
                        Hệ thống cần có thiết bị với components để tạo liên kết.
                        <br />
                        Bạn có thể tạo dữ liệu mẫu hoặc làm mới để xem dữ liệu.
                    </p>
                    <div className="flex justify-center space-x-4">
                        <button
                            onClick={() => {
                                fetchDevices();
                                fetchDeviceLinks();
                            }}
                            className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                        >
                            <RefreshCw size={20} />
                            <span>Làm mới</span>
                        </button>
                    </div>
                </div>
            );
        }

        // No device links but has devices
        if (deviceLinks.length === 0) {
            return (
                <div className="text-center py-12">
                    <Link2 className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Chưa có liên kết nào</h3>
                    <p className="mt-1 text-sm text-gray-500">Bắt đầu tạo liên kết thiết bị đầu tiên</p>
                </div>
            );
        }

        return null;
    };

    // Render existing links
    const renderExistingLinks = () => {
        // If we have device links, show them regardless of hasData
        if (deviceLinks && deviceLinks.length > 0) {
            return (
                <div className="space-y-4">
                    {deviceLinks.map((link, index) => (
                        <div key={index} className="bg-white rounded-lg border p-4 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    {/* Input Device */}
                                    <div className="flex items-center space-x-3 bg-green-50 border-2 border-green-200 rounded-lg p-3 min-w-[200px]">
                                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                        <div>
                                            <h4 className="font-medium text-green-800">
                                                {link.input_device?.name || 'Unknown Device'}
                                            </h4>
                                            <p className="text-sm text-green-600">
                                                {link.component?.name_display || link.component?.name || 'Unknown Component'}: {link.value_active} {link.component?.unit || ''}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    {/* Arrow */}
                                    <ArrowRight className="text-gray-400" size={20} />
                                    
                                    {/* Output Device */}
                                    <div className="flex items-center space-x-3 bg-red-50 border-2 border-red-200 rounded-lg p-3 min-w-[200px]">
                                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                        <div>
                                            <h4 className="font-medium text-red-800">
                                                {link.output_device?.name || 'Unknown Device'}
                                            </h4>
                                            <p className="text-sm text-red-600">
                                                {link.output_action === 'turn_on' ? 'Bật thiết bị' : 'Tắt thiết bị'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                
                                <button
                                    onClick={() => handleDeleteLink(link.id)}
                                    className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            );
        }

        // Only show empty state if no device links at all
        const emptyState = renderEmptyState();
        if (emptyState) return emptyState;

        return null;
    };

    // Render create modal
    const renderCreateModal = () => {
        if (!showCreateModal) return null;

        // Get available devices for linking - simplified logic for real API data
        const linkedInputIds = deviceLinks.map(link => link.input_device_id);
        const linkedOutputIds = deviceLinks.map(link => link.output_device_id);
        
        // Input devices: có components với flow_type là 'input' hoặc 'both'
        const inputDevices = devices.filter(device => {
            const components = deviceComponents[device.device_id];
            if (!Array.isArray(components)) {
                console.log(`Device ${device.name} - No components array:`, components);
                return false;
            }
            
            console.log(`Device ${device.name} - Components structure:`, components.map(c => ({
                component_id: c.component_id,
                name: c.name,
                flow_type: c.flow_type,
                datatype: c.datatype
            })));
            
                        const hasInputComponents = components.some(comp => {
                console.log(`Component ${comp.name_display || comp.name} - flow_type: ${comp.flow_type}`);
                return comp.flow_type === 'input' || comp.flow_type === 'both';
            });
            
            console.log(`Device ${device.name} - Has input:`, hasInputComponents, 'Already linked as input:', linkedInputIds.includes(device.device_id));
            return hasInputComponents; // Allow reuse of input devices
        });
        
        // Output devices: có components với flow_type là 'output' hoặc 'both'  
        const outputDevices = devices.filter(device => {
            const components = deviceComponents[device.device_id];
            if (!Array.isArray(components)) {
                return false;
            }
            
                        const hasOutputComponents = components.some(comp => {
                console.log(`Component ${comp.name_display || comp.name} - flow_type: ${comp.flow_type}`);
                return comp.flow_type === 'output' || comp.flow_type === 'both';
            });
            
            console.log(`Device ${device.name} - Has output:`, hasOutputComponents, 'Already linked as output:', linkedOutputIds.includes(device.device_id));
            return hasOutputComponents; // Allow reuse of output devices
        });

        console.log('Modal devices:', {
            totalDevices: devices.length,
            inputDevices: inputDevices.length,
            outputDevices: outputDevices.length
        });

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-xl">
                    <div className="flex justify-between items-center p-4 border-b bg-gray-50">
                        <h2 className="text-lg font-semibold text-gray-800">🔗 Tạo automation rule mới</h2>
                        <button
                            onClick={() => setShowCreateModal(false)}
                            className="text-gray-400 hover:text-gray-600 p-1"
                        >
                            <X size={20} />
                        </button>
                    </div>
                    <div className="overflow-y-auto max-h-[calc(90vh-60px)]">

                    {/* Components are loaded with devices automatically */}

                    {/* Compact Stats */}
                    <div className="p-4 text-xs text-gray-600 bg-gray-50 border-b">
                        📊 {devices.length} thiết bị | 🟢 {inputDevices.length} input | 🔴 {outputDevices.length} output
                    </div>

                    {/* No devices available */}
                    {inputDevices.length === 0 && outputDevices.length === 0 && (
                        <div className="text-center py-6 bg-gray-50 rounded-lg m-4">
                            <AlertCircle className="mx-auto h-8 w-8 text-yellow-500 mb-2" />
                            <h3 className="text-sm font-medium text-gray-900 mb-1">Không có thiết bị khả dụng</h3>
                            <p className="text-xs text-gray-500">
                                Không có thiết bị nào với components phù hợp để tạo automation.
                            </p>
                        </div>
                    )}

                    {/* Tabbed Interface */}
                    <div className="p-4">
                        <div className="flex border-b mb-4">
                            <button
                                onClick={() => setShowComponentPanel(false)}
                                className={`px-4 py-2 text-sm font-medium transition-colors ${
                                    !showComponentPanel
                                        ? 'border-b-2 border-green-500 text-green-600'
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                🟢 Chọn thiết bị Input
                            </button>
                            {selectedInputDevice && (
                                <button
                                    onClick={() => setShowComponentPanel(true)}
                                    className={`px-4 py-2 text-sm font-medium transition-colors ${
                                        showComponentPanel
                                            ? 'border-b-2 border-blue-500 text-blue-600'
                                            : 'text-gray-500 hover:text-gray-700'
                                    }`}
                                >
                                    🔧 Cấu hình Components
                                </button>
                            )}
                        </div>

                        {/* Tab Content */}
                        {!showComponentPanel ? (
                            // Tab 1: Device Selection
                            <div className="space-y-4">
                                {/* Input Device Selection */}
                                <div className="border rounded-lg overflow-hidden">
                                    <div className="bg-green-50 px-4 py-3 border-b">
                                        <h3 className="text-sm font-medium text-green-800">
                                            Chọn thiết bị Input ({inputDevices.length} thiết bị)
                                        </h3>
                                    </div>
                                    <div className="p-4">
                                        {inputDevices.length === 0 ? (
                                            <div className="text-xs text-gray-500 text-center py-4">Không có thiết bị input</div>
                                        ) : (
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                                {inputDevices.map(device => (
                                                    <div
                                                        key={device.device_id}
                                                        onClick={() => handleInputDeviceSelect(device)}
                                                        className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                                                            selectedInputDevice?.device_id === device.device_id
                                                                ? 'border-green-500 bg-green-50'
                                                                : 'border-gray-200 hover:border-green-300'
                                                        }`}
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <div>
                                                                <div className="font-medium text-sm">{device.name}</div>
                                                                <div className="text-xs text-gray-500">
                                                                    {device.current_value && typeof device.current_value === 'object' 
                                                                        ? Object.keys(device.current_value).length 
                                                                        : 0} sensor(s)
                                                                </div>
                                                            </div>
                                                            {selectedInputDevice?.device_id === device.device_id && (
                                                                <ChevronRight size={16} className="text-green-500" />
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Output Device Selection - Show only if input selected */}
                                {selectedInputDevice && (
                                    <div className="border rounded-lg overflow-hidden">
                                        <div className="bg-red-50 px-4 py-3 border-b">
                                            <h3 className="text-sm font-medium text-red-800">
                                                Chọn thiết bị Output ({outputDevices.length} thiết bị)
                                            </h3>
                                        </div>
                                        <div className="p-4">
                                            {outputDevices.length === 0 ? (
                                                <div className="text-xs text-gray-500 text-center py-4">Không có thiết bị output</div>
                                            ) : (
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                                    {outputDevices.map(device => (
                                                        <div
                                                            key={device.device_id}
                                                            onClick={() => setSelectedOutputDevice(device)}
                                                            className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                                                                selectedOutputDevice?.device_id === device.device_id
                                                                    ? 'border-red-500 bg-red-50'
                                                                    : 'border-gray-200 hover:border-red-300'
                                                            }`}
                                                        >
                                                            <div className="flex items-center justify-between">
                                                                <div>
                                                                    <div className="font-medium text-sm">{device.name}</div>
                                                                    <div className="text-xs text-gray-500">Điều khiển</div>
                                                                </div>
                                                                {selectedOutputDevice?.device_id === device.device_id && (
                                                                    <CheckCircle size={16} className="text-red-500" />
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Action Selection - Show only if both devices selected */}
                                {selectedInputDevice && selectedOutputDevice && (
                                    <div className="border rounded-lg overflow-hidden">
                                        <div className="bg-blue-50 px-4 py-3 border-b">
                                            <h3 className="text-sm font-medium text-blue-800">
                                                Chọn hành động khi kích hoạt
                                            </h3>
                                        </div>
                                        <div className="p-4">
                                            <div className="text-sm text-gray-600 mb-3">
                                                <span className="font-medium">{selectedInputDevice.name}</span> 
                                                <span className="mx-2">→</span> 
                                                <span className="font-medium">{selectedOutputDevice.name}</span>
                                            </div>
                                            <div className="flex space-x-6">
                                                <label className="flex items-center">
                                                    <input
                                                        type="radio"
                                                        name="outputAction"
                                                        value="turn_on"
                                                        checked={outputAction === 'turn_on'}
                                                        onChange={(e) => setOutputAction(e.target.value)}
                                                        className="mr-2"
                                                    />
                                                    <span className="text-sm">🔋 Bật thiết bị</span>
                                                </label>
                                                <label className="flex items-center">
                                                    <input
                                                        type="radio"
                                                        name="outputAction"
                                                        value="turn_off"
                                                        checked={outputAction === 'turn_off'}
                                                        onChange={(e) => setOutputAction(e.target.value)}
                                                        className="mr-2"
                                                    />
                                                    <span className="text-sm">⏸️ Tắt thiết bị</span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            // Tab 2: Component Configuration
                            <div className="space-y-4">
                                <div className="flex items-center space-x-2 mb-4">
                                    <button
                                        onClick={() => setShowComponentPanel(false)}
                                        className="flex items-center space-x-1 text-gray-500 hover:text-gray-700"
                                    >
                                        <ArrowLeft size={16} />
                                        <span className="text-sm">Quay lại</span>
                                    </button>
                                    <span className="text-sm text-gray-400">|</span>
                                    <span className="text-sm font-medium">Cấu hình: {selectedInputDevice?.name}</span>
                                </div>

                                {getInputComponents().length === 0 ? (
                                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                                        <AlertCircle className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                                        <p className="text-sm text-gray-500">Không có components input để cấu hình</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {getInputComponents().map(component => (
                                            <div key={component.component_id} className="border rounded-lg p-4">
                                                <div className="mb-3">
                                                    <h4 className="font-medium text-gray-800">
                                                        {component.name_display || component.name}
                                                    </h4>
                                                    <p className="text-xs text-gray-500">
                                                        {component.datatype}{component.unit && ` - ${component.unit}`}
                                                    </p>
                                                </div>
                                                <input
                                                    type="text"
                                                    value={componentValues[component.component_id] || ''}
                                                    onChange={(e) => setComponentValues({
                                                        ...componentValues,
                                                        [component.component_id]: e.target.value
                                                    })}
                                                    placeholder="vd: >25, <=100, 1"
                                                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Create Button - Show only when ready */}
                    {selectedInputDevice && selectedOutputDevice && Object.keys(componentValues).filter(key => componentValues[key]?.trim()).length > 0 && (
                        <div className="border-t p-4 bg-gray-50">
                            <div className="flex justify-between items-center">
                                <div className="text-sm text-gray-600">
                                    ✅ Sẵn sàng tạo {Object.keys(componentValues).filter(key => componentValues[key]?.trim()).length} automation rule(s)
                                </div>
                                <button
                                    onClick={handleCreateLink}
                                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2"
                                >
                                    <span>🔗 Tạo liên kết</span>
                                </button>
                            </div>
                        </div>
                    )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Quản lý liên kết thiết bị
                    </h1>
                    <p className="text-gray-600">
                        Tạo liên kết tự động giữa các thiết bị IoT
                    </p>
                </div>
                <div className="flex space-x-2">
                    <button
                        onClick={() => {
                            fetchDevices();
                            fetchDeviceLinks();
                        }}
                        className="flex items-center space-x-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
                    >
                        <RefreshCw size={20} />
                        <span>Làm mới</span>
                    </button>
                    
                    {hasData && (
                        <button
                            onClick={openCreateModal}
                            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                        >
                            <Plus size={20} />
                            <span>Tạo liên kết mới</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Statistics */}
            {hasData && (
                <div className="grid grid-cols-4 gap-4">
                    <div className="bg-white p-4 rounded-lg border">
                        <div className="text-sm text-gray-600">Tổng thiết bị</div>
                        <div className="text-2xl font-bold">{devices.length}</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border">
                        <div className="text-sm text-gray-600">Thiết bị input</div>
                        <div className="text-2xl font-bold text-green-600">
                            {devices.filter(device => {
                                const components = deviceComponents[device.device_id];
                                return Array.isArray(components) && components.some(comp => 
                                    comp.flow_type === 'input' || comp.flow_type === 'both'
                                );
                            }).length}
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border">
                        <div className="text-sm text-gray-600">Thiết bị output</div>
                        <div className="text-2xl font-bold text-red-600">
                            {devices.filter(device => {
                                const components = deviceComponents[device.device_id];
                                return Array.isArray(components) && components.some(comp => 
                                    comp.flow_type === 'output' || comp.flow_type === 'both'
                                );
                            }).length}
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border">
                        <div className="text-sm text-gray-600">Liên kết hiện có</div>
                        <div className="text-2xl font-bold text-blue-600">{deviceLinks.length}</div>
                    </div>
                </div>
            )}

            {/* Existing Links */}
            <div className="bg-white rounded-lg border">
                <div className="p-4 border-b">
                    <h2 className="font-medium">Liên kết hiện có ({deviceLinks.length})</h2>
                </div>
                <div className="p-4">
                    {isLoading ? (
                        <div className="flex justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                    ) : (
                        renderExistingLinks()
                    )}
                </div>
            </div>

            {/* Create Modal */}
            {renderCreateModal()}
        </div>
    );
};

export default DeviceLinksManagerV2; 