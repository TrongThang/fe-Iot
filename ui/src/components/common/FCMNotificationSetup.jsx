import React, { useState, useEffect } from 'react';
import {
  Bell,
  BellOff,
  CheckCircle,
  XCircle,
  AlertTriangle,
  TestTube,
  Flame,
  Wind,
  Settings
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSocketContext } from '@/contexts/SocketContext';

const FCMNotificationSetup = ({ showTestButtons = true, compact = false }) => {
  const {
    fcmPermission,
    fcmToken,
    requestFCMPermission,
    getFCMStatus,
    testFCMNotification
  } = useSocketContext();

  const [isRequesting, setIsRequesting] = useState(false);
  const [testingType, setTestingType] = useState(null);
  const [lastTestResult, setLastTestResult] = useState(null);

  // Get detailed FCM status
  const fcmStatus = getFCMStatus();

  const handleRequestPermission = async () => {
    setIsRequesting(true);
    setLastTestResult(null);

    try {
      const result = await requestFCMPermission();
      
      if (result.success) {
        setLastTestResult({
          type: 'success',
          message: 'Đã bật thông báo khẩn cấp thành công!'
        });
      } else {
        setLastTestResult({
          type: 'error',
          message: result.error || 'Không thể bật thông báo. Vui lòng kiểm tra cài đặt trình duyệt.'
        });
      }
    } catch (error) {
      console.error('Error requesting FCM permission:', error);
      setLastTestResult({
        type: 'error',
        message: 'Lỗi khi yêu cầu quyền thông báo.'
      });
    } finally {
      setIsRequesting(false);
    }
  };

  const handleTestNotification = async (type) => {
    setTestingType(type);
    
    try {
      const success = await testFCMNotification(type);
      
      if (success) {
        setLastTestResult({
          type: 'success',
          message: `Test thông báo ${type} đã được gửi!`
        });
      } else {
        setLastTestResult({
          type: 'error',
          message: 'Không thể gửi test notification. Kiểm tra quyền thông báo.'
        });
      }
    } catch (error) {
      console.error('Error testing notification:', error);
      setLastTestResult({
        type: 'error',
        message: 'Lỗi khi test thông báo.'
      });
    } finally {
      setTestingType(null);
    }
  };

  const getPermissionIcon = () => {
    switch (fcmPermission) {
      case 'granted':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'denied':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
    }
  };

  const getPermissionText = () => {
    switch (fcmPermission) {
      case 'granted':
        return 'Đã bật thông báo';
      case 'denied':
        return 'Thông báo bị từ chối';
      default:
        return 'Chưa cấp quyền thông báo';
    }
  };

  const getPermissionColor = () => {
    switch (fcmPermission) {
      case 'granted':
        return 'bg-green-50 border-green-200';
      case 'denied':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-yellow-50 border-yellow-200';
    }
  };

  if (compact) {
    return (
      <div className="flex items-center space-x-2">
        <Badge 
          variant="outline" 
          className={`${getPermissionColor()} flex items-center space-x-1`}
        >
          {getPermissionIcon()}
          <span className="text-xs">{getPermissionText()}</span>
        </Badge>
        
        {fcmPermission !== 'granted' && (
          <Button
            size="sm"
            variant="outline"
            onClick={handleRequestPermission}
            disabled={isRequesting || !fcmStatus.isSupported}
            className="text-xs"
          >
            {isRequesting ? 'Đang yêu cầu...' : 'Bật thông báo'}
          </Button>
        )}
      </div>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2 text-lg">
          <Bell className="h-5 w-5" />
          <span>Thông báo Khẩn cấp</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Browser Support Check */}
        {!fcmStatus.isSupported && (
          <Alert className="bg-red-50 border-red-200">
            <XCircle className="h-4 w-4 text-red-600" />
            <AlertTitle className="text-red-800">Không hỗ trợ</AlertTitle>
            <AlertDescription className="text-red-700">
              Trình duyệt này không hỗ trợ thông báo push. Vui lòng sử dụng Chrome, Firefox hoặc Safari.
            </AlertDescription>
          </Alert>
        )}

        {/* Permission Status */}
        <div className={`p-3 rounded-lg border ${getPermissionColor()}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {getPermissionIcon()}
              <span className="font-medium">{getPermissionText()}</span>
            </div>
            
            {fcmPermission === 'granted' && (
              <Badge variant="outline" className="text-xs bg-white">
                ✓ Hoạt động
              </Badge>
            )}
          </div>

          {fcmPermission === 'granted' && fcmToken && (
            <div className="mt-2 text-xs text-gray-600">
              Token: {fcmToken.substring(0, 20)}...
            </div>
          )}
        </div>

        {/* Permission Request Button */}
        {fcmPermission !== 'granted' && fcmStatus.isSupported && (
          <Alert className="bg-blue-50 border-blue-200">
            <Bell className="h-4 w-4 text-blue-600" />
            <AlertTitle className="text-blue-800">Bật thông báo khẩn cấp</AlertTitle>
            <AlertDescription className="text-blue-700 mb-3">
              Để nhận thông báo báo cháy và khí gas ngay cả khi không mở ứng dụng, 
              vui lòng cho phép thông báo.
            </AlertDescription>
            
            <Button
              onClick={handleRequestPermission}
              disabled={isRequesting}
              className="w-full"
              size="sm"
            >
              {isRequesting ? (
                <>
                  <Settings className="h-4 w-4 mr-2 animate-spin" />
                  Đang yêu cầu quyền...
                </>
              ) : (
                <>
                  <Bell className="h-4 w-4 mr-2" />
                  Bật thông báo khẩn cấp
                </>
              )}
            </Button>
          </Alert>
        )}

        {/* Test Notifications */}
        {showTestButtons && fcmPermission === 'granted' && (
          <div className="space-y-3">
            <div className="text-sm font-medium flex items-center space-x-2">
              <TestTube className="h-4 w-4" />
              <span>Test thông báo:</span>
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleTestNotification('fire')}
                disabled={testingType === 'fire'}
                className="flex flex-col items-center space-y-1 h-auto py-2"
              >
                <Flame className="h-4 w-4 text-red-500" />
                <span className="text-xs">Cháy</span>
              </Button>
              
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleTestNotification('smoke')}
                disabled={testingType === 'smoke'}
                className="flex flex-col items-center space-y-1 h-auto py-2"
              >
                <Wind className="h-4 w-4 text-gray-500" />
                <span className="text-xs">Khói</span>
              </Button>
              
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleTestNotification('gas')}
                disabled={testingType === 'gas'}
                className="flex flex-col items-center space-y-1 h-auto py-2"
              >
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                <span className="text-xs">Gas</span>
              </Button>
            </div>
          </div>
        )}

        {/* Test Results */}
        {lastTestResult && (
          <Alert className={
            lastTestResult.type === 'success' 
              ? 'bg-green-50 border-green-200' 
              : 'bg-red-50 border-red-200'
          }>
            {lastTestResult.type === 'success' ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <XCircle className="h-4 w-4 text-red-600" />
            )}
            <AlertDescription className={
              lastTestResult.type === 'success' ? 'text-green-700' : 'text-red-700'
            }>
              {lastTestResult.message}
            </AlertDescription>
          </Alert>
        )}

        {/* Instructions for denied permission */}
        {fcmPermission === 'denied' && (
          <Alert className="bg-gray-50 border-gray-200">
            <Settings className="h-4 w-4 text-gray-600" />
            <AlertTitle className="text-gray-800">Cách bật lại thông báo</AlertTitle>
            <AlertDescription className="text-gray-700">
              <ol className="list-decimal list-inside space-y-1 text-xs mt-2">
                <li>Nhấp vào biểu tượng khóa 🔒 trên thanh địa chỉ</li>
                <li>Chọn "Thông báo" → "Cho phép"</li>
                <li>Tải lại trang này</li>
              </ol>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default FCMNotificationSetup; 