import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Flame, 
  Wind, 
  Thermometer, 
  AlertTriangle, 
  TestTube2,
  Zap,
  Activity
} from 'lucide-react';
import { useSocketContext } from '@/contexts/SocketContext';
import socketService from '@/lib/socket';
import RealtimeSensorDisplay from '@/components/common/devices/RealtimeSensorDisplay';
import EmergencyAlertSystem from '@/components/common/EmergencyAlertSystem';

const TestGasAlert = () => {
  const { user, isConnected } = useSocketContext();
  const [testDevice, setTestDevice] = useState('ESP8266_TEST_001');
  const [gasLevel, setGasLevel] = useState(0);
  const [temperature, setTemperature] = useState(25);
  const [humidity, setHumidity] = useState(50);
  const [smokeLevel, setSmokeLevel] = useState(0);
  const [flameDetected, setFlameDetected] = useState(false);
  const [testLogs, setTestLogs] = useState([]);

  const addLog = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString('vi-VN');
    setTestLogs(prev => [{
      id: Date.now(),
      timestamp,
      message,
      type
    }, ...prev.slice(0, 9)]); // Keep last 10 logs
  };

  // Simulate sending sensor data to backend
  const sendSensorData = () => {
    if (!isConnected) {
      addLog('❌ Socket không kết nối', 'error');
      return;
    }

    const data = {
      serialNumber: testDevice,
      gas: gasLevel,
      temperature: temperature,
      humidity: humidity,
      smoke_level: smokeLevel,
      flame_detected: flameDetected,
      timestamp: new Date().toISOString()
    };

    // Emit sensor data
    socketService.emit('sensorData', data);
    addLog(`📊 Gửi dữ liệu sensor: Gas ${gasLevel}ppm, Temp ${temperature}°C`, 'success');

    // Check if we should trigger alerts
    if (gasLevel >= 300 || temperature >= 35 || smokeLevel >= 200 || flameDetected) {
      setTimeout(() => {
        triggerEmergencyAlert(data);
      }, 500);
    }
  };

  // Trigger emergency alert
  const triggerEmergencyAlert = (sensorData) => {
    let alertType = 'gas';
    let severity = 'warning';
    let message = '';

    // Determine alert type and severity
    if (flameDetected) {
      alertType = 'fire';
      severity = 'critical';
      message = '🔥 PHÁT HIỆN LỬA! Gọi cứu hỏa 114 ngay!';
    } else if (gasLevel >= 1000) {
      alertType = 'gas';
      severity = 'critical';
      message = `🔥 KHẨN CẤP! Nồng độ khí gas cực kỳ nguy hiểm: ${gasLevel} ppm`;
    } else if (gasLevel >= 600) {
      alertType = 'gas';
      severity = 'danger';
      message = `⚠️ NGUY HIỂM! Nồng độ khí gas cao: ${gasLevel} ppm`;
    } else if (gasLevel >= 300) {
      alertType = 'gas';
      severity = 'warning';
      message = `⚠️ CẢNH BÁO! Phát hiện khí gas: ${gasLevel} ppm`;
    } else if (temperature >= 55) {
      alertType = 'temperature';
      severity = 'critical';
      message = `🌡️ KHẨN CẤP! Nhiệt độ cực cao: ${temperature}°C`;
    } else if (temperature >= 45) {
      alertType = 'temperature';
      severity = 'danger';
      message = `🌡️ NGUY HIỂM! Nhiệt độ quá cao: ${temperature}°C`;
    } else if (temperature >= 35) {
      alertType = 'temperature';
      severity = 'warning';
      message = `🌡️ CẢNH BÁO! Nhiệt độ cao: ${temperature}°C`;
    } else if (smokeLevel >= 800) {
      alertType = 'smoke';
      severity = 'critical';
      message = `💨 KHẨN CẤP! Khói cực dày: ${smokeLevel}`;
    } else if (smokeLevel >= 500) {
      alertType = 'smoke';
      severity = 'danger';
      message = `💨 NGUY HIỂM! Khói dày: ${smokeLevel}`;
    } else if (smokeLevel >= 200) {
      alertType = 'smoke';
      severity = 'warning';
      message = `💨 CẢNH BÁO! Phát hiện khói: ${smokeLevel}`;
    }

    const alertData = {
      serialNumber: testDevice,
      type: alertType,
      severity: severity,
      message: message,
      data: sensorData,
      timestamp: new Date().toISOString()
    };

    // Emit emergency alert
    socketService.emit('emergency_alert', alertData);
    socketService.emit('fire_alert', alertData);
    socketService.emit('alarmAlert', alertData);

    addLog(`🚨 Gửi cảnh báo: ${alertType} - ${severity}`, 'alert');
  };

  // Quick test scenarios
  const runScenario = (scenario) => {
    switch (scenario) {
      case 'safe':
        setGasLevel(100);
        setTemperature(25);
        setHumidity(50);
        setSmokeLevel(50);
        setFlameDetected(false);
        addLog('✅ Thiết lập kịch bản an toàn');
        break;
      case 'gas_warning':
        setGasLevel(400);
        setTemperature(30);
        setHumidity(60);
        setSmokeLevel(100);
        setFlameDetected(false);
        addLog('⚠️ Thiết lập kịch bản cảnh báo gas');
        break;
      case 'gas_danger':
        setGasLevel(800);
        setTemperature(35);
        setHumidity(65);
        setSmokeLevel(300);
        setFlameDetected(false);
        addLog('🚨 Thiết lập kịch bản nguy hiểm gas');
        break;
      case 'gas_critical':
        setGasLevel(1200);
        setTemperature(40);
        setHumidity(70);
        setSmokeLevel(500);
        setFlameDetected(false);
        addLog('🔥 Thiết lập kịch bản nguy hiểm cao gas');
        break;
      case 'fire':
        setGasLevel(1500);
        setTemperature(60);
        setHumidity(80);
        setSmokeLevel(900);
        setFlameDetected(true);
        addLog('🔥 Thiết lập kịch bản cháy lớn');
        break;
    }
  };

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube2 className="h-6 w-6 text-blue-600" />
            Test Hệ Thống Cảnh Báo Gas & Cháy
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Activity className="h-4 w-4" />
            <AlertDescription>
              Trang này dùng để test hệ thống cảnh báo khí gas và cháy. 
              Kết nối socket: {isConnected ? '✅ Đã kết nối' : '❌ Chưa kết nối'}
            </AlertDescription>
          </Alert>

          {/* Device Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="device">Serial Number Thiết Bị</Label>
              <Input
                id="device"
                value={testDevice}
                onChange={(e) => setTestDevice(e.target.value)}
                placeholder="Nhập serial number"
              />
            </div>
          </div>

          {/* Quick Scenarios */}
          <div className="space-y-2">
            <Label>Kịch Bản Test Nhanh</Label>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => runScenario('safe')}
                className="text-green-600 border-green-300"
              >
                ✅ An toàn
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => runScenario('gas_warning')}
                className="text-yellow-600 border-yellow-300"
              >
                ⚠️ Cảnh báo Gas
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => runScenario('gas_danger')}
                className="text-orange-600 border-orange-300"
              >
                🚨 Nguy hiểm Gas
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => runScenario('gas_critical')}
                className="text-red-600 border-red-300"
              >
                🔥 Gas Cực nguy hiểm
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => runScenario('fire')}
                className="text-red-800 border-red-600"
              >
                🔥 Cháy lớn
              </Button>
            </div>
          </div>

          {/* Manual Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-orange-500" />
                Khí Gas (ppm)
              </Label>
              <Input
                type="number"
                value={gasLevel}
                onChange={(e) => setGasLevel(Number(e.target.value))}
                min="0"
                max="3000"
              />
              <div className="text-xs text-gray-500">
                Cảnh báo: 300+ | Nguy hiểm: 600+ | Cực nguy hiểm: 1000+
              </div>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Thermometer className="h-4 w-4 text-red-500" />
                Nhiệt độ (°C)
              </Label>
              <Input
                type="number"
                value={temperature}
                onChange={(e) => setTemperature(Number(e.target.value))}
                min="0"
                max="100"
              />
              <div className="text-xs text-gray-500">
                Cảnh báo: 35+ | Nguy hiểm: 45+ | Cực nguy hiểm: 55+
              </div>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Wind className="h-4 w-4 text-gray-500" />
                Khói (level)
              </Label>
              <Input
                type="number"
                value={smokeLevel}
                onChange={(e) => setSmokeLevel(Number(e.target.value))}
                min="0"
                max="1000"
              />
              <div className="text-xs text-gray-500">
                Cảnh báo: 200+ | Nguy hiểm: 500+ | Cực nguy hiểm: 800+
              </div>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Flame className="h-4 w-4 text-red-600" />
                Phát hiện lửa
              </Label>
              <Button
                variant={flameDetected ? "destructive" : "outline"}
                onClick={() => setFlameDetected(!flameDetected)}
                className="w-full"
              >
                {flameDetected ? '🔥 CÓ LỬA' : '✅ KHÔNG CÓ'}
              </Button>
            </div>
          </div>

          {/* Send Data Button */}
          <div className="pt-4">
            <Button
              onClick={sendSensorData}
              className="w-full"
              disabled={!isConnected}
            >
              📊 Gửi Dữ Liệu Sensor
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Real-time Sensor Display */}
      <RealtimeSensorDisplay 
        deviceSerial={testDevice}
        deviceName="Test Gas Sensor"
      />

      {/* Test Logs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Logs Test
            <Badge variant="outline">{testLogs.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {testLogs.length === 0 ? (
              <p className="text-gray-500 text-center py-4">Chưa có logs</p>
            ) : (
              testLogs.map((log) => (
                <div
                  key={log.id}
                  className={`p-2 rounded-lg text-sm ${
                    log.type === 'error'
                      ? 'bg-red-100 text-red-800'
                      : log.type === 'alert'
                      ? 'bg-orange-100 text-orange-800'
                      : log.type === 'success'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <span className="font-mono text-xs opacity-75">{log.timestamp}</span>
                  <span className="ml-2">{log.message}</span>
                </div>
              ))
            )}
          </div>
          {testLogs.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setTestLogs([])}
              className="w-full mt-3"
            >
              Xóa Logs
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TestGasAlert; 