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
    const [outputAction, setOutputAction] = useState('turn_on');
    const [outputValue, setOutputValue] = useState('');
    const [hasData, setHasData] = useState(false);

    useEffect(() => {
        fetchDeviceLinks();
        fetchDevices();
    }, []);

    useEffect(() => {
        setHasData(devices.length > 0 || deviceLinks.length > 0);
    }, [devices, deviceLinks]);

    const fetchDeviceLinks = async () => {
        setIsLoading(true);
        try {
            const response = await deviceLinksApi.getDeviceLinks();
            setDeviceLinks(response || []);
        } catch (error) {
            setDeviceLinks([]);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchDevices = async () => {
        try {
            const response = await deviceApi.getDevicesWithComponents();
            let devicesList = Array.isArray(response) ? response : (typeof response === 'object' ? Object.values(response).find(val => Array.isArray(val)) || [] : []);
            setDevices(devicesList);
        } catch (error) {
            setDevices([]);
        }
    };

    const handleCreateLink = async () => {
        if (!selectedInputDevice || !selectedOutputDevice) {
            alert('Vui lòng chọn thiết bị Input và Output để tạo liên kết.');
            return;
        }
        const linkData = {
            input_device_id: selectedInputDevice.device_id,
            output_device_id: selectedOutputDevice.device_id,
            logic_operator: 'AND',
            output_action: outputAction,
            output_value: outputValue || ''
        };
        try {
            await deviceLinksApi.createDeviceLink(linkData);
            fetchDeviceLinks();
            alert('Tạo liên kết thành công!');
            setSelectedInputDevice(null);
            setSelectedOutputDevice(null);
            setOutputAction('turn_on');
            setOutputValue('');
            setShowCreateModal(false);
        } catch (error) {
            alert('Lỗi khi tạo liên kết thiết bị');
        }
    };

    const handleDeleteLink = async (linkId) => {
        if (window.confirm('Bạn có chắc muốn xóa liên kết này?')) {
            try {
                await deviceLinksApi.deleteDeviceLink(linkId);
                fetchDeviceLinks();
            } catch (error) {
                alert('Lỗi khi xóa liên kết thiết bị');
            }
        }
    };

    const renderCreateModal = () => {
        if (!showCreateModal) return null;
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-hidden shadow-xl">
                    <div className="flex justify-between items-center p-4 border-b bg-gray-50">
                        <h2 className="text-lg font-semibold text-gray-800">🔗 Tạo liên kết mới</h2>
                        <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600 p-1">
                            <X size={20} />
                        </button>
                    </div>
                    <div className="p-4 space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Thiết bị Input</label>
                            <select
                                className="w-full border rounded p-2"
                                value={selectedInputDevice?.device_id || ''}
                                onChange={e => {
                                    const device = devices.find(d => d.device_id === e.target.value);
                                    setSelectedInputDevice(device || null);
                                }}
                            >
                                <option value="">-- Chọn thiết bị Input --</option>
                                {devices.map(device => (
                                    <option key={device.device_id} value={device.device_id}>{device.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Thiết bị Output</label>
                            <select
                                className="w-full border rounded p-2"
                                value={selectedOutputDevice?.device_id || ''}
                                onChange={e => {
                                    const device = devices.find(d => d.device_id === e.target.value);
                                    setSelectedOutputDevice(device || null);
                                }}
                            >
                                <option value="">-- Chọn thiết bị Output --</option>
                                {devices.map(device => (
                                    <option key={device.device_id} value={device.device_id}>{device.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Hành động</label>
                            <div className="flex space-x-4">
                                <label className="flex items-center">
                                    <input type="radio" name="outputAction" value="turn_on" checked={outputAction === 'turn_on'} onChange={e => setOutputAction(e.target.value)} className="mr-2" />
                                    Bật thiết bị
                                </label>
                                <label className="flex items-center">
                                    <input type="radio" name="outputAction" value="turn_off" checked={outputAction === 'turn_off'} onChange={e => setOutputAction(e.target.value)} className="mr-2" />
                                    Tắt thiết bị
                                </label>
                            </div>
                        </div>
                        {outputAction === 'turn_on' && (
                            <div>
                                <label className="block text-sm font-medium mb-1">Output Value (tuỳ chọn)</label>
                                <input
                                    type="text"
                                    className="w-full border rounded p-2"
                                    value={outputValue}
                                    onChange={e => setOutputValue(e.target.value)}
                                    placeholder="Nhập giá trị output nếu có"
                                />
                            </div>
                        )}
                        <button onClick={handleCreateLink} className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 mt-4">Tạo liên kết</button>
                    </div>
                </div>
            </div>
        );
    };

    const renderExistingLinks = () => {
        if (deviceLinks && deviceLinks.length > 0) {
            return (
                <div className="space-y-4">
                    {deviceLinks.map((link, index) => (
                        <div key={index} className="bg-white rounded-lg border p-4 shadow-sm flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-3 bg-green-50 border-2 border-green-200 rounded-lg p-3 min-w-[200px]">
                                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                    <div>
                                        <h4 className="font-medium text-green-800">{link.input_device?.name || 'Unknown Device'}</h4>
                                    </div>
                                </div>
                                <ArrowRight className="text-gray-400" size={20} />
                                <div className="flex items-center space-x-3 bg-red-50 border-2 border-red-200 rounded-lg p-3 min-w-[200px]">
                                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                    <div>
                                        <h4 className="font-medium text-red-800">{link.output_device?.name || 'Unknown Device'}</h4>
                                        <p className="text-sm text-red-600">{link.output_action === 'turn_on' ? 'Bật thiết bị' : 'Tắt thiết bị'}</p>
                                        {link.output_value && link.output_value.trim() !== '' && (
                                            <span className="block text-xs">Output: {link.output_value}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => handleDeleteLink(link.id)} className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50">
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ))}
                </div>
            );
        }
        return <div className="text-center py-12 text-gray-500">Chưa có liên kết nào</div>;
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Quản lý liên kết thiết bị</h1>
                    <p className="text-gray-600">Tạo liên kết tự động giữa các thiết bị IoT</p>
                </div>
                <div className="flex space-x-2">
                    <button onClick={() => { fetchDevices(); fetchDeviceLinks(); }} className="flex items-center space-x-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300">
                        <RefreshCw size={20} />
                        <span>Làm mới</span>
                    </button>
                    {hasData && (
                        <button onClick={() => setShowCreateModal(true)} className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                            <Plus size={20} />
                            <span>Tạo liên kết mới</span>
                        </button>
                    )}
                </div>
            </div>
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
            {renderCreateModal()}
        </div>
    );
};

export default DeviceLinksManagerV2; 