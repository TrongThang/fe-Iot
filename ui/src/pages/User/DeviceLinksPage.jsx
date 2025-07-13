import React, { useState } from 'react';
import { Link, Settings, TestTube, ArrowLeft } from 'lucide-react';
import DeviceLinksManagerV2 from '../../components/common/devices/DeviceLinksManagerV2';

const DeviceLinksPage = () => {
    const [activeTab, setActiveTab] = useState('manager');

    const tabs = [
        {
            id: 'manager',
            label: 'Quản lý liên kết',
            icon: <Link size={20} />,
            component: <DeviceLinksManagerV2 />
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center">
                            <button
                                onClick={() => window.history.back()}
                                className="mr-4 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                            >
                                <ArrowLeft size={20} />
                            </button>
                            <div className="flex items-center">
                                <Link className="text-blue-600 mr-3" size={24} />
                                <div>
                                    <h1 className="text-xl font-semibold text-gray-900">
                                        Hệ thống liên kết thiết bị
                                    </h1>
                                    <p className="text-sm text-gray-600">
                                        Tự động liên kết và điều khiển thiết bị IoT
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span>Hoạt động</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex space-x-1 bg-white rounded-lg p-1 shadow-sm">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                activeTab === tab.id
                                    ? 'bg-blue-500 text-white'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                            }`}
                        >
                            {tab.icon}
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
                <div className="transition-all duration-300">
                    {tabs.find(tab => tab.id === activeTab)?.component}
                </div>
            </div>

            {/* Quick Info */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
                    <h3 className="text-lg font-semibold mb-2">Hướng dẫn nhanh</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-start space-x-2">
                            <span className="bg-white bg-opacity-20 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">1</span>
                            <div>
                                <p className="font-medium">Tạo liên kết</p>
                                <p className="opacity-90">Chọn thiết bị input/output và điều kiện</p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-2">
                            <span className="bg-white bg-opacity-20 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">2</span>
                            <div>
                                <p className="font-medium">Tự động kích hoạt</p>
                                <p className="opacity-90">Hệ thống sẽ theo dõi và kích hoạt tự động</p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-2">
                            <span className="bg-white bg-opacity-20 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">3</span>
                            <div>
                                <p className="font-medium">Quản lý & Test</p>
                                <p className="opacity-90">Chỉnh sửa, xóa hoặc test liên kết</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeviceLinksPage; 