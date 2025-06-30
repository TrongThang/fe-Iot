import React, { useState, useEffect, useCallback, useMemo } from 'react'
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    BarChart,
    Bar,
    Area,
    AreaChart
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { 
    BarChart3, 
    TrendingUp, 
    Calendar,
    Thermometer,
    Droplets,
    Zap,
    Shield,
    RefreshCw,
    AlertCircle,
    Database,
    MapPin,
    Activity
} from 'lucide-react'
import axiosPrivate from "@/apis/clients/private.client"

const StatisticsChart = ({ spaceId, spaceData, devices = [] }) => {
    const [statisticsData, setStatisticsData] = useState([])
    const [devicesInSpace, setDevicesInSpace] = useState([])
    const [selectedDevice, setSelectedDevice] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [selectedPeriod, setSelectedPeriod] = useState('daily')
    const [chartType, setChartType] = useState('line')
    const [viewMode, setViewMode] = useState('current')
    const [statsMode, setStatsMode] = useState('space')

    // Memoized constants
    const periodOptions = useMemo(() => [
        { value: 'daily', label: 'Hàng ngày', icon: Calendar },
        { value: 'weekly', label: 'Hàng tuần', icon: Calendar },
        { value: 'monthly', label: 'Hàng tháng', icon: Calendar },
        { value: 'yearly', label: 'Hàng năm', icon: Calendar }
    ], [])

    const chartTypeOptions = useMemo(() => [
        { value: 'line', label: 'Đường', icon: TrendingUp },
        { value: 'area', label: 'Vùng', icon: BarChart3 },
        { value: 'bar', label: 'Cột', icon: BarChart3 }
    ], [])

    const metricConfig = useMemo(() => ({
        temperature: { color: '#ef4444', icon: Thermometer, unit: '°C', label: 'Nhiệt độ' },
        humidity: { color: '#3b82f6', icon: Droplets, unit: '%', label: 'Độ ẩm' },
        gas: { color: '#f59e0b', icon: Shield, unit: 'PPM', label: 'Chất lượng không khí' },
        power_consumption: { color: '#8b5cf6', icon: Zap, unit: 'W', label: 'Năng lượng' },
        pressure: { color: '#10b981', icon: Shield, unit: 'hPa', label: 'Áp suất' },
        light: { color: '#f97316', icon: Zap, unit: 'Lux', label: 'Ánh sáng' },
        motion: { color: '#06b6d4', icon: Activity, unit: '', label: 'Chuyển động' },
        sound: { color: '#ec4899', icon: Activity, unit: 'dB', label: 'Âm thanh' },
    }), [])

    // Memoized format function
    const formatTimestamp = useCallback((date, period) => {
        console.log(`🕐 Formatting timestamp:`, { date, period })
        
        if (!date) {
            console.warn(`⚠️ Empty date for formatting`)
            return 'Không có ngày'
        }
        
        const dateObj = new Date(date)
        
        if (isNaN(dateObj.getTime())) {
            console.warn(`⚠️ Invalid date:`, date)
            return 'Ngày không hợp lệ'
        }
        
        let formatted = ''
        
        try {
            switch (period) {
                case 'daily':
                    formatted = dateObj.toLocaleDateString('vi-VN', { 
                        day: '2-digit', 
                        month: '2-digit',
                        year: '2-digit'
                    })
                    break
                case 'weekly':
                    const firstDayOfYear = new Date(dateObj.getFullYear(), 0, 1)
                    const pastDaysOfYear = (dateObj - firstDayOfYear) / 86400000
                    const weekNumber = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)
                    formatted = `Tuần ${weekNumber}/${dateObj.getFullYear()}`
                    break
                case 'monthly':
                    formatted = dateObj.toLocaleDateString('vi-VN', { 
                        month: '2-digit', 
                        year: 'numeric'
                    })
                    break
                case 'yearly':
                    formatted = dateObj.getFullYear().toString()
                    break
                default:
                    formatted = dateObj.toLocaleDateString('vi-VN')
            }
        } catch (err) {
            console.error(`❌ Error formatting date:`, err)
            formatted = 'Lỗi định dạng'
        }
        
        console.log(`✅ Formatted timestamp: "${formatted}"`)
        return formatted
    }, [])

    // Unified API call function
    const makeAPICall = useCallback(async (endpoint, params = {}) => {
        try {
            const response = await axiosPrivate.get(endpoint, { params })
            return response.data
        } catch (error) {
            console.error(`API Error for ${endpoint}:`, error)
            throw error
        }
    }, [])

    // Unified data fetching
    const fetchData = useCallback(async (type) => {
        if (!spaceId) return
        
        setLoading(true)
        setError(null)
        setStatisticsData([])

        try {
            let endpoint, params
            
            switch (type) {
                case 'space-stats':
                    endpoint = `statistic/space/${spaceId}/statistics`
                    params = { type: selectedPeriod }
                    break
                case 'device-stats':
                    if (!selectedDevice) return
                    endpoint = `statistic/statistics/${selectedDevice}`
                    params = { type: selectedPeriod }
                    break
                case 'devices':
                    endpoint = `statistic/space/${spaceId}/devices`
                    params = {}
                    break
                default:
                    return
            }

            console.log(`🔄 Fetching ${type} from ${endpoint}...`, { params })
            const result = await makeAPICall(endpoint, params)
            
            console.log(`📥 Raw API response for ${type}:`, result)
            console.log(`📥 Response type:`, typeof result, Array.isArray(result))
            
            // SỬA: Kiểm tra response format
            let actualData = null
            
            if (Array.isArray(result)) {
                // API trả về array trực tiếp
                console.log(`📊 Direct array response`)
                actualData = result
            } else if (result && result.success && result.data) {
                // API trả về {success: true, data: [...]}
                console.log(`📊 Wrapped response with success flag`)
                actualData = result.data
            } else if (result && Array.isArray(result.data)) {
                // API trả về {data: [...]} không có success
                console.log(`📊 Response with data property`)
                actualData = result.data
            } else {
                console.log(`❌ Unknown response format:`, result)
            }
            
            if (type === 'devices') {
                console.log(`📱 Setting devices:`, actualData)
                setDevicesInSpace(actualData || [])
                if (actualData && actualData.length > 0 && !selectedDevice) {
                    const deviceSerial = actualData[0].serial || actualData[0].serial_number
                    console.log(`🎯 Auto-selecting device:`, deviceSerial)
                    setSelectedDevice(deviceSerial)
                }
            } else {
                // Xử lý statistics data
                if (actualData && Array.isArray(actualData) && actualData.length > 0) {
                    console.log(`📊 Processing ${actualData.length} data points...`)
                    
                    const transformedData = actualData.map((item, index) => {
                        console.log(`🔄 Processing item ${index}:`, item)
                        
                        // Kiểm tra cấu trúc data
                        if (!item) {
                            console.warn(`⚠️ Null item at index ${index}`)
                            return null
                        }
                        
                        // Kiểm tra avg_value hoặc data nằm trực tiếp trong item
                        let sensorData = {}
                        
                        if (item.avg_value && typeof item.avg_value === 'object') {
                            console.log(`📊 Using avg_value:`, item.avg_value)
                            sensorData = item.avg_value
                        } else {
                            // Kiểm tra xem sensor data có nằm trực tiếp trong item không
                            console.log(`📊 Checking for direct sensor data in item`)
                            const directSensorKeys = ['temperature', 'humidity', 'gas', 'power_consumption', 'pressure', 'light', 'motion', 'sound']
                            const foundSensorData = {}
                            
                            directSensorKeys.forEach(key => {
                                if (item[key] !== undefined && item[key] !== null) {
                                    foundSensorData[key] = item[key]
                                }
                            })
                            
                            if (Object.keys(foundSensorData).length > 0) {
                                console.log(`📊 Found direct sensor data:`, foundSensorData)
                                sensorData = foundSensorData
                            } else {
                                console.warn(`⚠️ No sensor data found in item ${index}:`, item)
                            }
                        }
                        
                        const transformed = {
                            timestamp: formatTimestamp(item.timestamp, selectedPeriod),
                            rawTimestamp: item.timestamp,
                            total_samples: item.total_samples || 0,
                            active_devices: item.active_devices || 0,
                            // Spread sensor data ra ngoài
                            ...sensorData
                        }
                        
                        console.log(`✅ Transformed item ${index}:`, transformed)
                        return transformed
                    }).filter(Boolean)
                    
                    console.log(`📈 Final transformed data (${transformedData.length} items):`, transformedData)
                    
                    if (transformedData.length > 0) {
                        setStatisticsData(transformedData)
                        setError(null)
                        console.log(`✅ Successfully set statistics data`)
                    } else {
                        console.log(`❌ No valid data after transformation`)
                        setStatisticsData([])
                        setError(`Dữ liệu thống kê không hợp lệ`)
                    }
                } else {
                    console.log(`❌ No valid data array:`, actualData)
                    setStatisticsData([])
                    setError(`Không có dữ liệu thống kê cho khoảng thời gian đã chọn`)
                }
            }
        } catch (error) {
            console.error(`❌ Error fetching ${type}:`, error)
            if (type === 'devices') {
                console.log(`🔄 Fallback to props devices:`, devices)
                setDevicesInSpace(devices)
                if (devices.length > 0 && !selectedDevice) {
                    setSelectedDevice(devices[0].serial_number || devices[0].serial)
                }
            } else {
                setStatisticsData([])
                setError(`Lỗi khi tải dữ liệu: ${error.response?.data?.message || error.message}`)
            }
        } finally {
            setLoading(false)
        }
    }, [spaceId, selectedPeriod, selectedDevice, devices, makeAPICall, formatTimestamp])

    // Effects
    useEffect(() => {
        if (spaceId) {
            fetchData('devices')
        }
    }, [spaceId, fetchData])

    useEffect(() => {
        if (spaceId && viewMode === 'trend') {
            const type = statsMode === 'space' ? 'space-stats' : 'device-stats'
            fetchData(type)
        }
    }, [spaceId, selectedPeriod, viewMode, statsMode, selectedDevice, fetchData])

    // Debug effect để track statisticsData changes
    useEffect(() => {
        console.log(`📊 Statistics data changed:`, {
            length: statisticsData.length,
            data: statisticsData,
            viewMode,
            statsMode,
            selectedPeriod,
            selectedDevice
        })
    }, [statisticsData, viewMode, statsMode, selectedPeriod, selectedDevice])

    // Thêm effect để debug khi spaceId thay đổi
    useEffect(() => {
        console.log(`🏠 Space changed:`, { spaceId, viewMode, statsMode })
        if (spaceId && viewMode === 'trend') {
            console.log(`🔄 Auto-fetching data for space ${spaceId}`)
        }
    }, [spaceId, viewMode, statsMode])

    // Custom Tooltip Component
    const CustomTooltip = useCallback(({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-4 border border-slate-200 rounded-lg shadow-lg">
                    <p className="font-semibold text-slate-900 mb-2">{label}</p>
                    {payload.map((entry, index) => {
                        const config = metricConfig[entry.dataKey]
                        const IconComponent = config?.icon || Shield
                        const metricLabel = config?.label || entry.dataKey
                        const unit = config?.unit || ''
                        
                        return (
                            <div key={index} className="flex items-center space-x-2 text-sm">
                                <IconComponent className="h-4 w-4" style={{ color: entry.color }} />
                                <span>{metricLabel}:</span>
                                <span className="font-medium" style={{ color: entry.color }}>
                                    {typeof entry.value === 'number' ? entry.value.toFixed(1) : entry.value} {unit}
                                </span>
                            </div>
                        )
                    })}
                    {payload[0]?.payload?.total_samples && (
                        <div className="text-xs text-slate-500 mt-2 pt-2 border-t">
                            Tổng mẫu: {payload[0].payload.total_samples}
                        </div>
                    )}
                </div>
            )
        }
        return null
    }, [metricConfig])

    // Chart rendering functions
    const getMetricsToShow = useCallback(() => {
        if (statisticsData.length === 0) return []
        return Object.keys(statisticsData[0]).filter(key => 
            !['timestamp', 'rawTimestamp', 'total_samples', 'active_devices'].includes(key)
        )
    }, [statisticsData])

    const renderChartElements = useCallback((type, metrics) => {
        switch (type) {
            case 'line':
                return metrics.map(metric => (
                    <Line
                        key={metric}
                        type="monotone"
                        dataKey={metric}
                        stroke={metricConfig[metric]?.color || '#64748b'}
                        strokeWidth={3}
                        dot={{ r: 6, fill: metricConfig[metric]?.color || '#64748b' }}
                        activeDot={{ r: 8, fill: metricConfig[metric]?.color || '#64748b' }}
                        name={metricConfig[metric]?.label || metric}
                    />
                ))
            case 'area':
                return metrics.map(metric => (
                    <Area
                        key={metric}
                        type="monotone"
                        dataKey={metric}
                        stackId="1"
                        stroke={metricConfig[metric]?.color || '#64748b'}
                        fill={metricConfig[metric]?.color || '#64748b'}
                        fillOpacity={0.6}
                        name={metricConfig[metric]?.label || metric}
                    />
                ))
            case 'bar':
                return metrics.map(metric => (
                    <Bar
                        key={metric}
                        dataKey={metric}
                        fill={metricConfig[metric]?.color || '#64748b'}
                        radius={[4, 4, 0, 0]}
                        name={metricConfig[metric]?.label || metric}
                    />
                ))
            default:
                return null
        }
    }, [metricConfig])

    // Chart components
    const renderChart = useCallback(() => {
        console.log(`🎨 Rendering chart with data:`, {
            length: statisticsData.length,
            data: statisticsData,
            hasData: statisticsData.length > 0
        })
        
        if (statisticsData.length === 0) {
            return (
                <div className="flex items-center justify-center h-64 text-slate-500">
                    <div className="text-center">
                        <BarChart3 className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                        <h3 className="text-lg font-medium text-slate-700 mb-2">Không có dữ liệu</h3>
                        <p className="text-sm mb-4">
                            {statsMode === 'space' 
                                ? 'Không gian này chưa có dữ liệu thống kê'
                                : 'Thiết bị này chưa có dữ liệu thống kê'
                            }
                        </p>
                        
                        <div className="space-y-3">
                            <Button 
                                onClick={() => {
                                    console.log(`🔄 Manual refresh for:`, { spaceId, statsMode, selectedDevice, selectedPeriod })
                                    fetchData(statsMode === 'space' ? 'space-stats' : 'device-stats')
                                }}
                                variant="outline"
                                size="sm"
                            >
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Thử lại
                            </Button>
                            
                            {/* Debug panel */}
                            <details className="text-xs">
                                <summary className="cursor-pointer text-blue-600">Debug Info</summary>
                                <div className="mt-2 p-3 bg-gray-50 rounded text-left">
                                    <div><strong>Space ID:</strong> {spaceId}</div>
                                    <div><strong>Stats Mode:</strong> {statsMode}</div>
                                    <div><strong>Selected Device:</strong> {selectedDevice}</div>
                                    <div><strong>Period:</strong> {selectedPeriod}</div>
                                    <div><strong>View Mode:</strong> {viewMode}</div>
                                    <div><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</div>
                                    <div><strong>Error:</strong> {error || 'None'}</div>
                                    <div><strong>Data Length:</strong> {statisticsData.length}</div>
                                </div>
                            </details>
                        </div>
                    </div>
                </div>
            )
        }

        const metricsToShow = getMetricsToShow()
        console.log(`📈 Metrics available:`, metricsToShow)
        
        if (metricsToShow.length === 0) {
            return (
                <div className="flex items-center justify-center h-64 text-slate-500">
                    <div className="text-center">
                        <AlertCircle className="h-12 w-12 mx-auto mb-4 text-yellow-400" />
                        <h3 className="text-lg font-medium text-slate-700 mb-2">Không có metrics</h3>
                        <p className="text-sm">Dữ liệu không chứa thông tin sensor</p>
                        <div className="text-xs text-gray-500 mt-2 p-2 bg-gray-100 rounded">
                            <div>Available keys: {statisticsData.length > 0 ? Object.keys(statisticsData[0]).join(', ') : 'None'}</div>
                            <div>First item: {JSON.stringify(statisticsData[0])}</div>
                        </div>
                    </div>
                </div>
            )
        }

        let chartData = statisticsData
        if (statisticsData.length === 1) {
            const singlePoint = statisticsData[0]
            chartData = [
                { ...singlePoint, timestamp: 'Trước đó' },
                { ...singlePoint, timestamp: singlePoint.timestamp },
                { ...singlePoint, timestamp: 'Sau đó' }
            ]
        }

        const commonProps = {
            data: chartData,
            margin: { top: 5, right: 30, left: 20, bottom: 60 }
        }

        const chartElements = renderChartElements(chartType, metricsToShow)
        const ChartComponent = {
            line: LineChart,
            area: AreaChart,
            bar: BarChart
        }[chartType]

        console.log(`✅ Rendering ${chartType} chart with ${chartData.length} data points`)

        return (
            <ChartComponent {...commonProps}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                    dataKey="timestamp" 
                    stroke="#64748b" 
                    fontSize={12}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                {chartElements}
            </ChartComponent>
        )
    }, [statisticsData, chartType, statsMode, getMetricsToShow, renderChartElements, CustomTooltip, fetchData, spaceId, selectedDevice, selectedPeriod, viewMode, loading, error])

    // Current view component
    const renderCurrentView = useCallback(() => {
        const defaultData = {
            avg_temperature: 25,
            avg_humidity: 60,
            avg_gas: 45,
            avg_power: 1200,
            active_devices: 1,
            total_devices: 1,
            space_name: `Space ${spaceId}`
        }

        const displayData = spaceData || defaultData
        const isDefaultData = !spaceData

        const currentMetrics = [
            { key: 'avg_temperature', value: displayData.avg_temperature || 0, label: 'Nhiệt độ TB', unit: '°C', color: '#ef4444', icon: Thermometer },
            { key: 'avg_humidity', value: displayData.avg_humidity || 0, label: 'Độ ẩm TB', unit: '%', color: '#3b82f6', icon: Droplets },
            { key: 'avg_gas', value: displayData.avg_gas || 0, label: 'Chất lượng không khí', unit: 'PPM', color: '#f59e0b', icon: Shield },
            { key: 'avg_power', value: displayData.avg_power || 0, label: 'Năng lượng TB', unit: 'W', color: '#8b5cf6', icon: Zap }
        ]

        const deviceMetrics = [
            { key: 'active_devices', value: displayData.active_devices || 0, label: 'Thiết bị hoạt động', unit: '', color: '#06b6d4', icon: Activity },
            { key: 'total_devices', value: displayData.total_devices || 0, label: 'Tổng thiết bị', unit: '', color: '#10b981', icon: Database }
        ]

        return (
            <div className="space-y-6">
                {isDefaultData && (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                        <div className="flex items-center gap-2 text-amber-800">
                            <AlertCircle className="h-4 w-4" />
                            <span className="text-sm font-medium">
                                Đang hiển thị dữ liệu mẫu - Chọn không gian để xem dữ liệu thực
                            </span>
                        </div>
                    </div>
                )}
                
                <div>
                    <h4 className="font-semibold text-slate-900 mb-3">Thông số môi trường hiện tại</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {currentMetrics.map(metric => {
                            const IconComponent = metric.icon
                            return (
                                <div key={metric.key} className="p-4 bg-slate-50 rounded-lg border hover:shadow-sm transition-shadow">
                                    <div className="flex items-center gap-2 mb-2">
                                        <IconComponent className="h-5 w-5" style={{ color: metric.color }} />
                                        <span className="font-medium text-sm">{metric.label}</span>
                                    </div>
                                    <div className="text-2xl font-bold" style={{ color: metric.color }}>
                                        {metric.value} {metric.unit}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                <div>
                    <h4 className="font-semibold text-slate-900 mb-3">Trạng thái thiết bị</h4>
                    <div className="grid grid-cols-2 gap-4">
                        {deviceMetrics.map(metric => {
                            const IconComponent = metric.icon
                            return (
                                <div key={metric.key} className="p-4 bg-slate-50 rounded-lg border hover:shadow-sm transition-shadow">
                                    <div className="flex items-center gap-2 mb-2">
                                        <IconComponent className="h-5 w-5" style={{ color: metric.color }} />
                                        <span className="font-medium text-sm">{metric.label}</span>
                                    </div>
                                    <div className="text-2xl font-bold" style={{ color: metric.color }}>
                                        {metric.value}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    
                    <div className="mt-4 p-3 bg-white rounded-lg border">
                        <div className="flex justify-between text-sm text-slate-600 mb-2">
                            <span>Tỷ lệ thiết bị hoạt động</span>
                            <span>{displayData.total_devices > 0 ? Math.round((displayData.active_devices / displayData.total_devices) * 100) : 0}%</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-3">
                            <div 
                                className="bg-emerald-500 h-3 rounded-full transition-all duration-300"
                                style={{ 
                                    width: `${displayData.total_devices > 0 ? (displayData.active_devices / displayData.total_devices) * 100 : 0}%` 
                                }}
                            ></div>
                        </div>
                    </div>
                </div>

                {devicesInSpace.length > 0 && (
                    <div>
                        <h4 className="font-semibold text-slate-900 mb-3">Danh sách thiết bị trong không gian</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {devicesInSpace.slice(0, 6).map(device => (
                                <div key={device.device_id || device.serial} className="p-3 bg-white rounded-lg border hover:shadow-sm transition-shadow">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${device.power_status ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                                        <div className="flex-1">
                                            <p className="font-medium text-sm">{device.name || device.serial}</p>
                                            <p className="text-xs text-slate-500">{device.serial}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {devicesInSpace.length > 6 && (
                            <p className="text-sm text-slate-500 mt-2">
                                Và {devicesInSpace.length - 6} thiết bị khác...
                            </p>
                        )}
                    </div>
                )}

                {statisticsData.length > 0 && (
                    <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                        <h4 className="font-semibold text-slate-900 mb-2">✅ Dữ liệu thống kê đã tải</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p><strong>Số điểm dữ liệu:</strong> {statisticsData.length}</p>
                                <p><strong>Khoảng thời gian:</strong> {selectedPeriod}</p>
                            </div>
                            <div>
                                <p><strong>Metrics:</strong> {getMetricsToShow().length}</p>
                                <p><strong>Loại biểu đồ:</strong> {chartType}</p>
                            </div>
                        </div>
                        
                        <div className="mt-3">
                            <p className="font-medium mb-2">Metrics có sẵn:</p>
                            <div className="flex flex-wrap gap-2">
                                {Object.keys(statisticsData[0] || {}).map(key => (
                                    <Badge 
                                        key={key} 
                                        variant={['timestamp', 'rawTimestamp', 'total_samples', 'active_devices'].includes(key) ? 'secondary' : 'default'}
                                    >
                                        {metricConfig[key]?.label || key}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        )
    }, [spaceData, spaceId, devicesInSpace, statisticsData, selectedPeriod, chartType, getMetricsToShow, metricConfig])

    // Main content renderer
    const renderContent = useCallback(() => {
        if (!spaceId) {
            return (
                <div className="flex items-center justify-center h-64 text-slate-500">
                    <div className="text-center">
                        <MapPin className="h-16 w-16 mx-auto mb-4 text-slate-300" />
                        <h3 className="text-lg font-medium text-slate-700 mb-2">Chưa chọn không gian</h3>
                        <p className="text-sm">Vui lòng chọn không gian từ dropdown phía trên để xem thống kê</p>
                    </div>
                </div>
            )
        }

        if (viewMode === 'current') {
            return renderCurrentView()
        }

        if (loading) {
            return (
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <RefreshCw className="h-8 w-8 animate-spin text-blue-500 mx-auto mb-2" />
                        <span className="text-slate-600">
                            {statsMode === 'space' 
                                ? 'Đang tải dữ liệu thống kê không gian...' 
                                : 'Đang tải dữ liệu thống kê thiết bị...'
                            }
                        </span>
                    </div>
                </div>
            )
        }

        if (error) {
            return (
                <div className="flex items-center justify-center h-64 text-slate-500">
                    <div className="text-center">
                        <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-400" />
                        <h3 className="text-lg font-medium text-slate-700 mb-2">Lỗi tải dữ liệu</h3>
                        <p className="text-sm mb-4">{error}</p>
                        <Button 
                            onClick={() => fetchData(statsMode === 'space' ? 'space-stats' : 'device-stats')}
                            variant="outline"
                            size="sm"
                        >
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Thử lại
                        </Button>
                    </div>
                </div>
            )
        }

        return (
            <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                    {renderChart()}
                </ResponsiveContainer>
            </div>
        )
    }, [spaceId, viewMode, loading, error, statsMode, renderCurrentView, renderChart, fetchData])

    return (
        <Card className="border-0 shadow-sm">
            <CardHeader className="bg-slate-50/50">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div>
                        <CardTitle className="flex items-center space-x-2">
                            <BarChart3 className="h-5 w-5 text-blue-500" />
                            <span>Thống kê dữ liệu</span>
                            <Badge variant="secondary" className="ml-2">
                                {spaceData?.space_name || `Space ${spaceId}`}
                            </Badge>
                            {!spaceData && (
                                <Badge variant="outline" className="ml-2 text-amber-600 border-amber-300">
                                    Demo
                                </Badge>
                            )}
                        </CardTitle>
                        <p className="text-sm text-slate-600 mt-1">
                            {statsMode === 'space' 
                                ? `Thống kê tổng hợp của không gian ${spaceData?.space_name || `Space ${spaceId}`}`
                                : `Thống kê chi tiết của thiết bị ${selectedDevice}`
                            }
                            {!spaceData && viewMode === 'current' && (
                                <span className="text-amber-600 ml-2">(Dữ liệu mẫu)</span>
                            )}
                        </p>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-2">
                        <Select value={viewMode} onValueChange={setViewMode} disabled={!spaceId}>
                            <SelectTrigger className="w-32">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="current">Hiện tại</SelectItem>
                                <SelectItem value="trend">Xu hướng</SelectItem>
                            </SelectContent>
                        </Select>

                        {viewMode === 'trend' && (
                            <>
                                <Select value={statsMode} onValueChange={setStatsMode} disabled={!spaceId}>
                                    <SelectTrigger className="w-36">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="space">Theo không gian</SelectItem>
                                        <SelectItem value="device">Theo thiết bị</SelectItem>
                                    </SelectContent>
                                </Select>

                                {statsMode === 'device' && devicesInSpace.length > 0 && (
                                    <Select value={selectedDevice} onValueChange={setSelectedDevice}>
                                        <SelectTrigger className="w-48">
                                            <SelectValue placeholder="Chọn thiết bị" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {devicesInSpace.map(device => (
                                                <SelectItem key={device.device_id || device.serial} value={device.serial}>
                                                    <div className="flex items-center gap-2">
                                                        <div className={`w-2 h-2 rounded-full ${device.power_status ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                                                        <span>{device.name || device.serial}</span>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}

                                <Select value={selectedPeriod} onValueChange={setSelectedPeriod} disabled={!spaceId}>
                                    <SelectTrigger className="w-32">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {periodOptions.map(option => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <Select value={chartType} onValueChange={setChartType} disabled={!spaceId}>
                                    <SelectTrigger className="w-28">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {chartTypeOptions.map(option => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </>
                        )}

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => fetchData(statsMode === 'space' ? 'space-stats' : 'device-stats')}
                            disabled={loading || !spaceId || (statsMode === 'device' && !selectedDevice)}
                            className="flex items-center gap-2"
                        >
                            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                            Làm mới
                        </Button>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-6">
                {renderContent()}
            </CardContent>
        </Card>
    )
}

export default StatisticsChart