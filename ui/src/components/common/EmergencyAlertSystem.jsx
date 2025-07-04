import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  Flame,
  Wind,
  Volume2,
  X,
  Phone,
  MapPin,
  Clock
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSocketContext } from '@/contexts/SocketContext';

const EmergencyAlertSystem = () => {
  const { emergencyAlerts, dismissEmergencyAlert, clearEmergencyAlerts } = useSocketContext();
  const [alertSounds, setAlertSounds] = useState(new Map());

  // Play alert sound based on type
  const playAlertSound = (alertType) => {
    try {
      // You can add different sound files for different alert types
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      // Create a simple alarm tone
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Different frequencies for different alert types
      switch (alertType) {
        case 'fire':
          oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
          break;
        case 'smoke':
          oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
          break;
        case 'emergency':
        default:
          oscillator.frequency.setValueAtTime(1000, audioContext.currentTime);
          break;
      }
      
      oscillator.type = 'square';
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      
      oscillator.start();
      
      // Play for 3 seconds
      setTimeout(() => {
        oscillator.stop();
        audioContext.close();
      }, 3000);
      
    } catch (error) {
      console.error('Error playing alert sound:', error);
    }
  };

  // Play sound when new emergency alerts arrive
  useEffect(() => {
    emergencyAlerts.forEach(alert => {
      if (!alertSounds.has(alert.id)) {
        playAlertSound(alert.type);
        setAlertSounds(prev => new Map(prev).set(alert.id, true));
      }
    });
  }, [emergencyAlerts, alertSounds]);

  const getAlertIcon = (type) => {
    switch (type) {
      case 'fire':
        return <Flame className="h-6 w-6 text-red-600" />;
      case 'smoke':
        return <Wind className="h-6 w-6 text-gray-600" />;
      case 'emergency':
      default:
        return <AlertTriangle className="h-6 w-6 text-red-600" />;
    }
  };

  const getAlertColor = (type) => {
    switch (type) {
      case 'fire':
        return 'border-red-500 bg-red-50';
      case 'smoke':
        return 'border-gray-500 bg-gray-50';
      case 'emergency':
      default:
        return 'border-orange-500 bg-orange-50';
    }
  };

  const getAlertTitle = (type) => {
    switch (type) {
      case 'fire':
        return 'CẢNH BÁO CHÁY!';
      case 'smoke':
        return 'PHÁT HIỆN KHÓI!';
      case 'emergency':
      default:
        return 'CẢNH BÁO KHẨN CẤP!';
    }
  };

  const formatAlertData = (alert) => {
    const data = alert.data;
    let details = [];

    if (data.temperature) {
      details.push(`Nhiệt độ: ${data.temperature}°C`);
    }
    if (data.gas_level || data.gasValue) {
      details.push(`Khí gas: ${data.gas_level || data.gasValue} ppm`);
    }
    if (data.smoke_level) {
      details.push(`Khói: ${data.smoke_level}%`);
    }
    if (data.severity) {
      details.push(`Mức độ: ${data.severity}`);
    }
    if (data.location) {
      details.push(`Vị trí: ${data.location}`);
    }

    return details;
  };

  const handleEmergencyCall = () => {
    // Emergency call functionality
    window.open('tel:114'); // Vietnam fire department
  };

  if (emergencyAlerts.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-4 max-w-md">
      {emergencyAlerts.map((alert) => (
        <Card 
          key={alert.id} 
          className={`shadow-lg border-2 ${getAlertColor(alert.type)} animate-pulse`}
        >
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center text-lg font-bold text-red-700">
                {getAlertIcon(alert.type)}
                <span className="ml-2">{getAlertTitle(alert.type)}</span>
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => dismissEmergencyAlert(alert.id)}
                className="h-6 w-6 text-red-600 hover:bg-red-100"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-3">
            {/* Device Information */}
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-xs">
                {alert.data.serialNumber || 'Unknown Device'}
              </Badge>
              <Badge variant="outline" className="text-xs">
                <Clock className="h-3 w-3 mr-1" />
                {new Date(alert.timestamp).toLocaleTimeString('vi-VN')}
              </Badge>
            </div>

            {/* Alert Details */}
            <div className="space-y-1">
              {formatAlertData(alert).map((detail, index) => (
                <p key={index} className="text-sm text-gray-700">
                  {detail}
                </p>
              ))}
            </div>

            {/* Alert Message */}
            {alert.data.message && (
              <Alert className="bg-red-100 border-red-300">
                <AlertDescription className="text-red-800 font-medium">
                  {alert.data.message}
                </AlertDescription>
              </Alert>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-2">
              <Button
                variant="destructive"
                size="sm"
                onClick={handleEmergencyCall}
                className="flex-1"
              >
                <Phone className="h-4 w-4 mr-2" />
                Gọi cứu hỏa (114)
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => dismissEmergencyAlert(alert.id)}
                className="flex-1"
              >
                Đã xử lý
              </Button>
            </div>

            {/* Location Info if available */}
            {alert.data.location && (
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="h-4 w-4 mr-2" />
                <span>Vị trí: {alert.data.location}</span>
              </div>
            )}
          </CardContent>
        </Card>
      ))}

      {/* Clear All Button if multiple alerts */}
      {emergencyAlerts.length > 1 && (
        <div className="flex justify-center">
          <Button
            variant="destructive"
            size="sm"
            onClick={clearEmergencyAlerts}
            className="w-full"
          >
            Xóa tất cả cảnh báo ({emergencyAlerts.length})
          </Button>
        </div>
      )}

      {/* Audio indicator */}
      <div className="flex justify-center">
        <Badge className="bg-red-100 text-red-700 border-red-200">
          <Volume2 className="h-3 w-3 mr-1 animate-pulse" />
          Âm thanh cảnh báo đang phát
        </Badge>
      </div>
    </div>
  );
};

export default EmergencyAlertSystem; 