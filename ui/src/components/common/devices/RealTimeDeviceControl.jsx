import React, { useState, useEffect } from 'react';
import { 
  Thermometer, 
  Flame, 
  Wind, 
  Activity, 
  Wifi, 
  WifiOff, 
  Power, 
  AlertTriangle,
  Settings,
  Lightbulb,
  Lock,
  Unlock,
  RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDeviceSocket, useDoorSocket, useLEDSocket } from '@/hooks/useSocket';

const RealTimeDeviceControl = ({ device, accountId }) => {
  const [activeTab, setActiveTab] = useState('monitoring');
  const [showAdvancedControls, setShowAdvancedControls] = useState(false);

  // Main device socket for sensor data
  const {
    isConnected,
    isDeviceConnected,
    sensorData,
    deviceStatus,
    alarmData,
    lastUpdate,
    connectToDevice,
    disconnectFromDevice,
    sendCommand
  } = useDeviceSocket(device?.serial_number, accountId);

  // Door controls if device supports it
  const {
    doorStatus,
    doorCommandResponse,
    lastDoorUpdate,
    toggleDoor,
    openDoor,
    closeDoor,
    lockDoor,
    unlockDoor
  } = useDoorSocket(device?.serial_number, accountId, { 
    autoConnect: device?.type === 'door' || device?.capabilities?.includes('door_control') 
  });

  // LED controls if device supports it
  const {
    ledCapabilities,
    ledStatus,
    effectStatus,
    lastLedUpdate,
    setEffect,
    applyPreset,
    updateState,
    turnOn,
    turnOff,
    setBrightness,
    setColor
  } = useLEDSocket(device?.serial_number, accountId, { 
    autoConnect: device?.type === 'light' || device?.capabilities?.includes('led_control') 
  });

  if (!device) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-gray-500">Không có thiết bị được chọn</p>
        </CardContent>
      </Card>
    );
  }

  const formatTimestamp = (timestamp) => {
    return timestamp ? new Date(timestamp).toLocaleTimeString('vi-VN') : 'Không có dữ liệu';
  };

  const getSensorValue = (type) => {
    if (!sensorData) return 'N/A';
    
    switch (type) {
      case 'temperature':
        return sensorData.temperature ? `${sensorData.temperature}°C` : 'N/A';
      case 'humidity':
        return sensorData.humidity ? `${sensorData.humidity}%` : 'N/A';
      case 'gas':
        return sensorData.gas_level ? `${sensorData.gas_level} ppm` : 'N/A';
      case 'smoke':
        return sensorData.smoke_level ? `${sensorData.smoke_level}%` : 'N/A';
      default:
        return 'N/A';
    }
  };

  const getStatusColor = (value, type) => {
    if (!value || value === 'N/A') return 'text-gray-500';
    
    switch (type) {
      case 'temperature':
        const temp = parseFloat(value);
        if (temp > 35) return 'text-red-500';
        if (temp > 25) return 'text-yellow-500';
        return 'text-green-500';
      case 'gas':
        const gas = parseFloat(value);
        if (gas > 1000) return 'text-red-500';
        if (gas > 500) return 'text-yellow-500';
        return 'text-green-500';
      default:
        return 'text-blue-500';
    }
  };

  const handleToggleDevice = () => {
    sendCommand({
      action: 'toggle',
      state: { power_status: !device.power_status }
    });
  };

  const handleResetAlarm = () => {
    sendCommand({
      action: 'reset_alarm'
    });
  };

  const handleTestAlarm = () => {
    sendCommand({
      action: 'test_alarm'
    });
  };

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">{device.name}</CardTitle>
            <div className="flex items-center space-x-2">
              {isConnected ? (
                <Badge className="bg-green-100 text-green-700 border-green-200">
                  <Wifi className="w-3 h-3 mr-1" />
                  Đã kết nối
                </Badge>
              ) : (
                <Badge className="bg-red-100 text-red-700 border-red-200">
                  <WifiOff className="w-3 h-3 mr-1" />
                  Mất kết nối
                </Badge>
              )}
              <Badge variant="outline">
                {device.serial_number}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Trạng thái</p>
              <p className="font-medium">
                {isDeviceConnected ? 'Trực tuyến' : 'Ngoại tuyến'}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Cập nhật cuối</p>
              <p className="font-medium">{formatTimestamp(lastUpdate)}</p>
            </div>
            <div>
              <p className="text-gray-500">Loại thiết bị</p>
              <p className="font-medium capitalize">{device.type || 'Unknown'}</p>
            </div>
            <div>
              <p className="text-gray-500">Nguồn điện</p>
              <p className="font-medium">
                {device.power_status ? 'Bật' : 'Tắt'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Emergency Alert */}
      {alarmData && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-700">
            <strong>Cảnh báo khẩn cấp!</strong> {alarmData.message || 'Đã phát hiện bất thường'}
            <div className="mt-2">
              <Button 
                size="sm" 
                variant="destructive"
                onClick={handleResetAlarm}
              >
                Tắt cảnh báo
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Main Controls */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="monitoring">Giám sát</TabsTrigger>
          <TabsTrigger value="control">Điều khiển</TabsTrigger>
          <TabsTrigger value="led">LED</TabsTrigger>
          <TabsTrigger value="door">Cửa</TabsTrigger>
        </TabsList>

        {/* Monitoring Tab */}
        <TabsContent value="monitoring" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="w-5 h-5 mr-2" />
                Dữ liệu cảm biến Real-time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Temperature */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <Thermometer className="w-6 h-6 text-blue-600" />
                    <span className={`text-2xl font-bold ${getStatusColor(getSensorValue('temperature'), 'temperature')}`}>
                      {getSensorValue('temperature')}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">Nhiệt độ</p>
                </div>

                {/* Humidity */}
                <div className="bg-cyan-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <Wind className="w-6 h-6 text-cyan-600" />
                    <span className="text-2xl font-bold text-cyan-600">
                      {getSensorValue('humidity')}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">Độ ẩm</p>
                </div>

                {/* Gas Level */}
                <div className="bg-orange-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <Flame className="w-6 h-6 text-orange-600" />
                    <span className={`text-2xl font-bold ${getStatusColor(getSensorValue('gas'), 'gas')}`}>
                      {getSensorValue('gas')}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">Khí gas</p>
                </div>

                {/* Smoke Level */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <Wind className="w-6 h-6 text-gray-600" />
                    <span className="text-2xl font-bold text-gray-600">
                      {getSensorValue('smoke')}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">Khói</p>
                </div>
              </div>

              {sensorData && (
                <div className="mt-4 p-3 bg-gray-50 rounded text-sm">
                  <p className="text-gray-600">
                    Dữ liệu nhận lúc: {formatTimestamp(sensorData.timestamp)}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Control Tab */}
        <TabsContent value="control" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                Điều khiển thiết bị
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Basic Controls */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Nguồn điện</p>
                  <p className="text-sm text-gray-500">Bật/tắt thiết bị</p>
                </div>
                <Switch
                  checked={device.power_status}
                  onCheckedChange={handleToggleDevice}
                  disabled={!isConnected}
                />
              </div>

              {/* Emergency Controls */}
              <div className="border-t pt-4">
                <p className="font-medium mb-3">Điều khiển khẩn cấp</p>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="destructive"
                    onClick={handleResetAlarm}
                    disabled={!isConnected}
                    className="w-full"
                  >
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Tắt báo động
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleTestAlarm}
                    disabled={!isConnected}
                    className="w-full"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Test báo động
                  </Button>
                </div>
              </div>

              {/* Advanced Controls Toggle */}
              <div className="border-t pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowAdvancedControls(!showAdvancedControls)}
                  className="w-full"
                >
                  {showAdvancedControls ? 'Ẩn' : 'Hiện'} điều khiển nâng cao
                </Button>
              </div>

              {/* Advanced Controls */}
              {showAdvancedControls && (
                <div className="border-t pt-4 space-y-3">
                  <p className="font-medium">Điều khiển nâng cao</p>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      onClick={() => sendCommand({ action: 'reset' })}
                      disabled={!isConnected}
                    >
                      Reset thiết bị
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => sendCommand({ action: 'calibrate' })}
                      disabled={!isConnected}
                    >
                      Hiệu chuẩn
                    </Button>
                  </div>

                  <Button
                    variant="outline"
                    onClick={() => sendCommand({ action: 'get_status' })}
                    disabled={!isConnected}
                    className="w-full"
                  >
                    Cập nhật trạng thái
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* LED Control Tab */}
        <TabsContent value="led" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lightbulb className="w-5 h-5 mr-2" />
                Điều khiển LED
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {ledCapabilities ? (
                <>
                  {/* LED Power */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Đèn LED</p>
                      <p className="text-sm text-gray-500">Bật/tắt đèn</p>
                    </div>
                    <Switch
                      checked={ledStatus?.power_status || false}
                      onCheckedChange={(checked) => checked ? turnOn() : turnOff()}
                      disabled={!isConnected}
                    />
                  </div>

                  {/* Brightness Control */}
                  {ledStatus?.power_status && (
                    <div>
                      <p className="font-medium mb-2">Độ sáng: {ledStatus?.brightness || 100}%</p>
                      <Slider
                        value={[ledStatus?.brightness || 100]}
                        onValueChange={(value) => setBrightness(value[0])}
                        max={100}
                        step={1}
                        disabled={!isConnected}
                      />
                    </div>
                  )}

                  {/* Color Control */}
                  {ledStatus?.power_status && (
                    <div>
                      <p className="font-medium mb-2">Màu sắc</p>
                      <div className="grid grid-cols-6 gap-2">
                        {['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'].map((color) => (
                          <button
                            key={color}
                            className="w-8 h-8 rounded-full border-2 border-gray-300"
                            style={{ backgroundColor: color }}
                            onClick={() => setColor(color)}
                            disabled={!isConnected}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Preset Effects */}
                  <div>
                    <p className="font-medium mb-2">Hiệu ứng có sẵn</p>
                    <div className="grid grid-cols-2 gap-2">
                      {ledCapabilities.supported_presets?.slice(0, 6).map((preset) => (
                        <Button
                          key={preset}
                          variant="outline"
                          onClick={() => applyPreset({ preset })}
                          disabled={!isConnected}
                          className="text-xs"
                        >
                          {preset.replace('_', ' ')}
                        </Button>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">Thiết bị không hỗ trợ điều khiển LED</p>
                  <Button
                    variant="outline"
                    onClick={() => sendCommand({ action: 'get_capabilities' })}
                    disabled={!isConnected}
                    className="mt-2"
                  >
                    Kiểm tra lại
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Door Control Tab */}
        <TabsContent value="door" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lock className="w-5 h-5 mr-2" />
                Điều khiển cửa
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Door Status */}
              {doorStatus && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-medium">Trạng thái cửa</p>
                  <div className="grid grid-cols-2 gap-4 mt-2 text-sm">
                    <div>
                      <p className="text-gray-500">Vị trí</p>
                      <p className="capitalize">{doorStatus.position || 'Unknown'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Khóa</p>
                      <p className="capitalize">{doorStatus.lock_status || 'Unknown'}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Door Controls */}
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={() => openDoor()}
                  disabled={!isConnected}
                  className="w-full"
                >
                  <Unlock className="w-4 h-4 mr-2" />
                  Mở cửa
                </Button>
                <Button
                  onClick={() => closeDoor()}
                  disabled={!isConnected}
                  className="w-full"
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Đóng cửa
                </Button>
                <Button
                  onClick={() => lockDoor()}
                  disabled={!isConnected}
                  variant="outline"
                  className="w-full"
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Khóa
                </Button>
                <Button
                  onClick={() => unlockDoor()}
                  disabled={!isConnected}
                  variant="outline"
                  className="w-full"
                >
                  <Unlock className="w-4 h-4 mr-2" />
                  Mở khóa
                </Button>
              </div>

              {doorCommandResponse && (
                <div className="mt-4 p-3 bg-blue-50 rounded text-sm">
                  <p className="text-blue-700">
                    Phản hồi: {doorCommandResponse.message || 'Lệnh đã được thực hiện'}
                  </p>
                  <p className="text-blue-600 text-xs mt-1">
                    {formatTimestamp(doorCommandResponse.timestamp)}
                  </p>
                </div>
              )}

              {!doorStatus && !doorCommandResponse && (
                <div className="text-center py-8">
                  <p className="text-gray-500">Thiết bị không hỗ trợ điều khiển cửa</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RealTimeDeviceControl; 