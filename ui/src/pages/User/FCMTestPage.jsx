import React, { useState, useEffect } from 'react';
import {
  Bell,
  Flame,
  Wind,
  AlertTriangle,
  TestTube,
  RefreshCw,
  CheckCircle,
  Info
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import FCMNotificationSetup from '@/components/common/FCMNotificationSetup';
import EmergencyAlertSystem from '@/components/common/EmergencyAlertSystem';
import { useSocketContext } from '@/contexts/SocketContext';

const FCMTestPage = () => {
  const {
    isConnected,
    emergencyAlerts,
    fcmPermission,
    fcmToken,
    getFCMStatus,
    testFCMNotification,
    fcmService
  } = useSocketContext();

  const [testResults, setTestResults] = useState([]);
  const [isTestingSocket, setIsTestingSocket] = useState(false);

  // Simulate socket emergency alert for testing
  const simulateSocketAlert = (type) => {
    setIsTestingSocket(true);
    
    const mockAlertData = {
      type: type,
      data: {
        serialNumber: 'TEST_DEVICE_001',
        temperature: 45,
        gas_level: 800,
        smoke_level: 75,
        severity: 'critical',
        location: 'Phòng test',
        message: `Test ${type} alert từ socket simulation`,
        timestamp: new Date().toISOString()
      },
      timestamp: new Date(),
      id: Date.now()
    };

    // Add to test results
    setTestResults(prev => [{
      type: 'Socket Alert Simulation',
      data: mockAlertData,
      timestamp: new Date(),
      success: true
    }, ...prev.slice(0, 9)]);

    // Simulate FCM notification from socket alert
    if (fcmService) {
      fcmService.sendEmergencyNotification(mockAlertData);
    }

    setTimeout(() => setIsTestingSocket(false), 1000);
  };

  const runFCMTest = async (type) => {
    try {
      const result = await testFCMNotification(type);
      
      setTestResults(prev => [{
        type: `FCM Test (${type})`,
        data: { type, success: result },
        timestamp: new Date(),
        success: result
      }, ...prev.slice(0, 9)]);
      
    } catch (error) {
      setTestResults(prev => [{
        type: `FCM Test (${type})`,
        data: { type, error: error.message },
        timestamp: new Date(),
        success: false
      }, ...prev.slice(0, 9)]);
    }
  };

  const clearTestResults = () => {
    setTestResults([]);
  };

  const fcmStatus = getFCMStatus();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold flex items-center justify-center space-x-2">
          <Bell className="h-8 w-8 text-blue-600" />
          <span>FCM Test & Demo Page</span>
        </h1>
        <p className="text-gray-600">
          Test và demo hệ thống thông báo FCM cho cảnh báo báo cháy/khí gas
        </p>
      </div>

      {/* Connection Status */}
      <Alert className="bg-blue-50 border-blue-200">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertTitle className="text-blue-800">Trạng thái kết nối</AlertTitle>
        <AlertDescription className="text-blue-700">
          <div className="grid grid-cols-2 gap-4 mt-2">
            <div className="flex items-center space-x-2">
              <span>Socket:</span>
              <Badge variant={isConnected ? "default" : "destructive"}>
                {isConnected ? "Kết nối" : "Ngắt kết nối"}
              </Badge>
            </div>
            <div className="flex items-center space-x-2">
              <span>FCM:</span>
              <Badge variant={fcmPermission === 'granted' ? "default" : "destructive"}>
                {fcmPermission === 'granted' ? "Hoạt động" : "Chưa bật"}
              </Badge>
            </div>
          </div>
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* FCM Setup */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Setup FCM</h2>
          <FCMNotificationSetup showTestButtons={true} />
        </div>

        {/* Test Controls */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Test Controls</h2>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TestTube className="h-5 w-5" />
                <span>Test FCM Notifications</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <Button
                  onClick={() => runFCMTest('fire')}
                  disabled={fcmPermission !== 'granted'}
                  className="flex flex-col items-center space-y-1 h-auto py-3"
                  variant="outline"
                >
                  <Flame className="h-5 w-5 text-red-500" />
                  <span className="text-xs">Test Cháy</span>
                </Button>
                
                <Button
                  onClick={() => runFCMTest('smoke')}
                  disabled={fcmPermission !== 'granted'}
                  className="flex flex-col items-center space-y-1 h-auto py-3"
                  variant="outline"
                >
                  <Wind className="h-5 w-5 text-gray-500" />
                  <span className="text-xs">Test Khói</span>
                </Button>
                
                <Button
                  onClick={() => runFCMTest('gas')}
                  disabled={fcmPermission !== 'granted'}
                  className="flex flex-col items-center space-y-1 h-auto py-3"
                  variant="outline"
                >
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  <span className="text-xs">Test Gas</span>
                </Button>
              </div>
              
              <div className="text-xs text-gray-500 text-center">
                {fcmPermission !== 'granted' && "Cần bật thông báo trước khi test"}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <RefreshCw className="h-5 w-5" />
                <span>Simulate Socket Alerts</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-gray-600">
                Giả lập socket alerts để test tích hợp FCM
              </p>
              
              <div className="grid grid-cols-3 gap-2">
                <Button
                  onClick={() => simulateSocketAlert('fire')}
                  disabled={isTestingSocket}
                  className="flex flex-col items-center space-y-1 h-auto py-3"
                  variant="outline"
                >
                  <Flame className="h-5 w-5 text-red-500" />
                  <span className="text-xs">Socket Fire</span>
                </Button>
                
                <Button
                  onClick={() => simulateSocketAlert('smoke')}
                  disabled={isTestingSocket}
                  className="flex flex-col items-center space-y-1 h-auto py-3"
                  variant="outline"
                >
                  <Wind className="h-5 w-5 text-gray-500" />
                  <span className="text-xs">Socket Smoke</span>
                </Button>
                
                <Button
                  onClick={() => simulateSocketAlert('emergency')}
                  disabled={isTestingSocket}
                  className="flex flex-col items-center space-y-1 h-auto py-3"
                  variant="outline"
                >
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  <span className="text-xs">Socket Emergency</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Test Results */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5" />
            <span>Test Results</span>
          </CardTitle>
          <Button 
            onClick={clearTestResults}
            variant="outline"
            size="sm"
            disabled={testResults.length === 0}
          >
            Clear
          </Button>
        </CardHeader>
        <CardContent>
          {testResults.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              Chưa có test results. Chạy test để xem kết quả.
            </div>
          ) : (
            <div className="space-y-2">
              {testResults.map((result, index) => (
                <div 
                  key={index}
                  className={`p-3 rounded-lg border ${
                    result.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {result.success ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                      )}
                      <span className="font-medium">{result.type}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {result.timestamp.toLocaleTimeString('vi-VN')}
                    </Badge>
                  </div>
                  
                  {result.data && (
                    <div className="mt-2 text-sm text-gray-600">
                      <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                        {JSON.stringify(result.data, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* FCM Status Details */}
      <Card>
        <CardHeader>
          <CardTitle>FCM Status Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Permission:</span>
              <Badge className="ml-2">{fcmStatus.permission}</Badge>
            </div>
            <div>
              <span className="font-medium">Supported:</span>
              <Badge className="ml-2">{fcmStatus.isSupported ? 'Yes' : 'No'}</Badge>
            </div>
            <div className="col-span-2">
              <span className="font-medium">Token:</span>
              <div className="text-xs text-gray-600 mt-1 break-all">
                {fcmStatus.token || 'No token available'}
              </div>
            </div>
            <div className="col-span-2">
              <span className="font-medium">Active Emergency Alerts:</span>
              <Badge className="ml-2">{emergencyAlerts.length}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Emergency Alert System (hiển thị alerts) */}
      <EmergencyAlertSystem />
    </div>
  );
};

export default FCMTestPage; 