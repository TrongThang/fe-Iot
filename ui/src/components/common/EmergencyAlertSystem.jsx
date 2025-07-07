import React, { useState, useEffect, useRef } from 'react';
import {
  AlertTriangle,
  Flame,
  Wind,
  Volume2,
  X,
  Phone,
  MapPin,
  Clock,
  Thermometer,
  Zap,
  Eye,
  Shield,
  Users
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSocketContext } from '@/contexts/SocketContext';
import { ALERT_MESSAGES, EMERGENCY_CONTACTS, getAlertType, getAlertSeverity } from '../../config/firebase';
import '../../styles/emergency-alerts.css';

const EmergencyAlertSystem = () => {
  const { emergencyAlerts, dismissEmergencyAlert, clearEmergencyAlerts } = useSocketContext();
  const [alertSounds, setAlertSounds] = useState(new Map());
  const [currentAlert, setCurrentAlert] = useState(null);
  const [showActionDialog, setShowActionDialog] = useState(false);
  const audioRef = useRef(null);

  // Enhanced alert sound system
  const playAlertSound = (alertType, severity = 'warning') => {
    try {
      // Stop any existing audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }

      // Create audio based on severity
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Enhanced frequency mapping for different alert types and severities
      let frequency, duration, pattern;
      
      switch (alertType) {
        case 'fire':
          frequency = 900;
          duration = severity === 'critical' ? 5000 : 3000;
          pattern = 'sawtooth';
          break;
        case 'gas':
          frequency = 700;
          duration = severity === 'critical' ? 4000 : 2500;
          pattern = 'square';
          break;
        case 'smoke':
          frequency = 600;
          duration = 2000;
          pattern = 'triangle';
          break;
        case 'temperature':
          frequency = 500;
          duration = 1500;
          pattern = 'sine';
          break;
        default:
          frequency = 800;
          duration = 2000;
          pattern = 'square';
      }

      // Adjust for severity
      if (severity === 'critical') {
        frequency += 200;
        gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
      } else if (severity === 'danger') {
        frequency += 100;
        gainNode.gain.setValueAtTime(0.12, audioContext.currentTime);
      } else {
        gainNode.gain.setValueAtTime(0.08, audioContext.currentTime);
      }
      
      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
      oscillator.type = pattern;
      oscillator.start();
      
      // For critical alerts, create pulsing effect
      if (severity === 'critical') {
        oscillator.frequency.exponentialRampToValueAtTime(frequency * 1.5, audioContext.currentTime + 0.5);
        oscillator.frequency.exponentialRampToValueAtTime(frequency, audioContext.currentTime + 1);
      }
      
      setTimeout(() => {
        oscillator.stop();
        audioContext.close();
      }, duration);
      
    } catch (error) {
      console.error('Error playing enhanced alert sound:', error);
    }
  };

  // Enhanced alert processing with severity detection
  useEffect(() => {
    emergencyAlerts.forEach(alert => {
      if (!alertSounds.has(alert.id)) {
        const alertType = getAlertType(alert.data || {});
        const alertValue = alert.data?.gas_level || alert.data?.gasValue || alert.data?.temperature || alert.data?.smoke_level || 0;
        const severity = getAlertSeverity(alertType, alertValue);
        
        playAlertSound(alertType, severity);
        setAlertSounds(prev => new Map(prev).set(alert.id, true));
        
        // Show action dialog for critical alerts
        if (severity === 'critical') {
          setCurrentAlert({
            ...alert,
            alertType,
            severity,
            alertValue
          });
          setShowActionDialog(true);
        }
      }
    });
  }, [emergencyAlerts, alertSounds]);

  // Enhanced icon system with severity support
  const getAlertIcon = (alertType, severity = 'warning') => {
    const sizeClass = severity === 'critical' ? 'h-7 w-7' : 'h-6 w-6';
    const pulseClass = severity === 'critical' ? 'animate-pulse' : '';
    
    switch (alertType) {
      case 'fire':
        return <Flame className={`${sizeClass} text-red-600 ${pulseClass}`} />;
      case 'gas':
        return <Zap className={`${sizeClass} text-orange-600 ${pulseClass}`} />;
      case 'smoke':
        return <Wind className={`${sizeClass} text-gray-700 ${pulseClass}`} />;
      case 'temperature':
        return <Thermometer className={`${sizeClass} text-red-500 ${pulseClass}`} />;
      default:
        return <AlertTriangle className={`${sizeClass} text-red-600 ${pulseClass}`} />;
    }
  };

  // Enhanced color system with severity levels
  const getAlertColor = (alertType, severity = 'warning') => {
    const baseColors = {
      fire: {
        critical: 'border-red-600 bg-red-100 shadow-red-200',
        danger: 'border-red-500 bg-red-50 shadow-red-100',
        warning: 'border-red-400 bg-red-25 shadow-red-50'
      },
      gas: {
        critical: 'border-orange-600 bg-orange-100 shadow-orange-200',
        danger: 'border-orange-500 bg-orange-50 shadow-orange-100',
        warning: 'border-orange-400 bg-orange-25 shadow-orange-50'
      },
      smoke: {
        critical: 'border-gray-600 bg-gray-100 shadow-gray-200',
        danger: 'border-gray-500 bg-gray-50 shadow-gray-100',
        warning: 'border-gray-400 bg-gray-25 shadow-gray-50'
      },
      temperature: {
        critical: 'border-red-600 bg-red-100 shadow-red-200',
        danger: 'border-red-500 bg-red-50 shadow-red-100',
        warning: 'border-yellow-400 bg-yellow-25 shadow-yellow-50'
      }
    };

    const colors = baseColors[alertType] || baseColors.fire;
    const pulseClass = severity === 'critical' ? 'animate-pulse' : '';
    
    return `${colors[severity] || colors.warning} ${pulseClass}`;
  };

  // Enhanced title system with Vietnamese messages
  const getAlertTitle = (alertType, severity = 'warning') => {
    const alertInfo = ALERT_MESSAGES[alertType];
    if (alertInfo) {
      return alertInfo.title;
    }
    
    // Fallback titles
    switch (alertType) {
      case 'fire':
        return '🔥 KHẨN CẤP - PHÁT HIỆN LỬA!';
      case 'gas':
        return '⚠️ KHẨN CẤP - RÒ RỈ KHÍ GAS!';
      case 'smoke':
        return '💨 CẢNH BÁO - PHÁT HIỆN KHÓI!';
      case 'temperature':
        return '🌡️ CẢNH BÁO - NHIỆT ĐỘ CAO!';
      default:
        return '🚨 CẢNH BÁO KHẨN CẤP!';
    }
  };

  // Enhanced alert data formatting with safety status
  const formatAlertData = (alert) => {
    const data = alert.data;
    const alertType = getAlertType(data || {});
    const alertValue = data?.gas_level || data?.gasValue || data?.temperature || data?.smoke_level || 0;
    const severity = getAlertSeverity(alertType, alertValue);
    let details = [];

    // Enhanced sensor data display
    if (data?.temperature !== undefined) {
      const tempStatus = data.temperature >= 55 ? '🔥 CỰC NGUY HIỂM' : 
                        data.temperature >= 45 ? '⚠️ NGUY HIỂM' : 
                        data.temperature >= 35 ? '⚠️ CAO' : '✅ Bình thường';
      details.push(`🌡️ Nhiệt độ: ${data.temperature}°C (${tempStatus})`);
    }
    
    if (data?.gas_level || data?.gasValue) {
      const gasValue = data.gas_level || data.gasValue;
      const gasStatus = gasValue >= 1000 ? '🔥 CỰC NGUY HIỂM' : 
                       gasValue >= 600 ? '⚠️ NGUY HIỂM' : 
                       gasValue >= 300 ? '⚠️ CAO' : '✅ An toàn';
      details.push(`⛽ Khí gas: ${gasValue} ppm (${gasStatus})`);
    }
    
    if (data?.smoke_level !== undefined) {
      const smokeStatus = data.smoke_level >= 800 ? '🔥 CỰC DẦY' : 
                         data.smoke_level >= 500 ? '⚠️ DẦY' : 
                         data.smoke_level >= 200 ? '⚠️ VỪA' : '✅ Ít';
      details.push(`💨 Khói: ${data.smoke_level} (${smokeStatus})`);
    }

    if (data?.flame_detected !== undefined) {
      details.push(`🔥 Lửa: ${data.flame_detected ? '🚨 PHÁT HIỆN' : '✅ Không'}`);
    }

    if (data?.humidity !== undefined) {
      details.push(`💧 Độ ẩm: ${data.humidity}%`);
    }

    // Enhanced severity and safety info
    const severityInfo = {
      critical: '🔴 CỰC KỲ NGUY HIỂM - Thoát hiểm ngay!',
      danger: '🟠 NGUY HIỂM - Cần xử lý ngay!',
      warning: '🟡 CẢNH BÁO - Theo dõi chặt chẽ'
    };
    
    details.push(`🚨 Mức độ: ${severityInfo[severity] || severityInfo.warning}`);

    // Location with enhanced formatting
    if (data?.location) {
      details.push(`📍 Vị trí: ${data.location}`);
    }

    // Device status
    const deviceName = data?.deviceName || data?.serialNumber || 'Thiết bị không xác định';
    details.push(`📱 Thiết bị: ${deviceName}`);

    // Emergency contacts for critical alerts
    if (severity === 'critical') {
      const contact = alertType === 'gas' ? EMERGENCY_CONTACTS.gas : EMERGENCY_CONTACTS.fire;
      details.push(`📞 Khẩn cấp: ${contact.name} - ${contact.number}`);
    }

    return details;
  };

  // Get safety recommendations based on alert type and severity
  const getSafetyRecommendations = (alertType, severity) => {
    const alertInfo = ALERT_MESSAGES[alertType];
    if (!alertInfo) return [];

    const recommendations = [...alertInfo.actions];
    
    // Add severity-specific recommendations
    if (severity === 'critical') {
      recommendations.unshift('🚨 THOÁT HIỂM NGAY LẬP TỨC!');
    }
    
    return recommendations.slice(0, 4); // Limit to 4 recommendations for UI
  };

  // Enhanced emergency call functionality
  const handleEmergencyCall = (alertType = 'fire') => {
    const contact = alertType === 'gas' ? EMERGENCY_CONTACTS.gas : EMERGENCY_CONTACTS.fire;
    console.log(`📞 Emergency call: ${contact.name} - ${contact.number}`);
    window.open(`tel:${contact.number}`, '_self');
  };

  // Handle action selection
  const handleActionClick = (action, alert) => {
    console.log('🎯 Action selected:', action);
    
    // Show confirmation
    const confirmed = window.confirm(
      `Bạn đã chọn hành động:\n"${action}"\n\nHãy thực hiện ngay để đảm bảo an toàn!\n\nBấm OK để xác nhận.`
    );
    
    if (confirmed) {
      // Dispatch action event
      window.dispatchEvent(new CustomEvent('emergency-action-selected', {
        detail: {
          alert,
          action,
          timestamp: new Date().toISOString()
        }
      }));
    }
  };

  if (emergencyAlerts.length === 0) {
    return null;
  }

      return (
      <div className="fixed top-4 right-4 z-50 space-y-4 max-w-lg emergency-alert-container">
      {emergencyAlerts.map((alert) => {
        const alertType = getAlertType(alert.data || {});
        const alertValue = alert.data?.gas_level || alert.data?.gasValue || alert.data?.temperature || alert.data?.smoke_level || 0;
        const severity = getAlertSeverity(alertType, alertValue);
        const alertInfo = ALERT_MESSAGES[alertType];
        const safetyRecommendations = getSafetyRecommendations(alertType, severity);
        
        return (
          <Card 
            key={alert.id} 
            className={`shadow-xl border-3 ${getAlertColor(alertType, severity)} backdrop-blur-sm`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center text-lg font-bold text-gray-800">
                  {getAlertIcon(alertType, severity)}
                  <span className="ml-3">{getAlertTitle(alertType, severity)}</span>
                </CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => dismissEmergencyAlert(alert.id)}
                  className="h-7 w-7 text-gray-600 hover:bg-gray-200 rounded-full"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              
              {/* Severity Badge */}
              <div className="flex items-center space-x-2 mt-2">
                <Badge 
                  variant={severity === 'critical' ? 'destructive' : 'outline'} 
                  className={`text-xs font-semibold ${
                    severity === 'critical' ? 'bg-red-600 text-white animate-pulse' :
                    severity === 'danger' ? 'bg-orange-500 text-white' :
                    'bg-yellow-500 text-white'
                  }`}
                >
                  {severity === 'critical' ? '🔴 CỰC NGUY HIỂM' :
                   severity === 'danger' ? '🟠 NGUY HIỂM' : '🟡 CẢNH BÁO'}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  <Clock className="h-3 w-3 mr-1" />
                  {new Date(alert.timestamp).toLocaleTimeString('vi-VN')}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Enhanced Alert Details */}
              <div className="space-y-2">
                {formatAlertData(alert).map((detail, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <div className="w-2 h-2 rounded-full bg-gray-400 mt-2 flex-shrink-0"></div>
                    <p className="text-sm text-gray-700 font-medium leading-relaxed">{detail}</p>
                  </div>
                ))}
              </div>

              {/* Enhanced Message */}
              {(alert.data.message || alertInfo) && (
                <Alert className={`${
                  severity === 'critical' ? 'bg-red-100 border-red-400' :
                  severity === 'danger' ? 'bg-orange-100 border-orange-400' :
                  'bg-yellow-100 border-yellow-400'
                }`}>
                  <AlertDescription className={`font-semibold ${
                    severity === 'critical' ? 'text-red-800' :
                    severity === 'danger' ? 'text-orange-800' :
                    'text-yellow-800'
                  }`}>
                    {alert.data.message || (alertInfo && alertInfo[severity]) || 'Cảnh báo từ thiết bị'}
                  </AlertDescription>
                </Alert>
              )}

              {/* Safety Recommendations */}
              {safetyRecommendations.length > 0 && (
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                  <h4 className="text-sm font-semibold text-blue-800 mb-2 flex items-center">
                    <Shield className="h-4 w-4 mr-1" />
                    Hành động khuyến nghị:
                  </h4>
                  <div className="space-y-1">
                    {safetyRecommendations.map((action, index) => (
                      <button
                        key={index}
                        onClick={() => handleActionClick(action, alert)}
                        className="block w-full text-left text-xs text-blue-700 hover:text-blue-900 hover:bg-blue-100 p-1 rounded transition-colors"
                      >
                        {index + 1}. {action}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Enhanced Action Buttons */}
              <div className="flex space-x-2">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleEmergencyCall(alertType)}
                  className={`flex-1 font-bold ${
                    severity === 'critical' ? 'animate-pulse bg-red-600 hover:bg-red-700' : ''
                  }`}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  {alertType === 'gas' ? 'Gọi Gas (1909)' : 'Gọi 114'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => dismissEmergencyAlert(alert.id)}
                  className="flex-1"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Đã xem
                </Button>
              </div>

              {/* Location and Additional Info */}
              <div className="grid grid-cols-1 gap-2 text-xs text-gray-600">
                {alert.data.location && (
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                    <span>📍 {alert.data.location}</span>
                  </div>
                )}
                
                {severity === 'critical' && (
                  <div className="flex items-center text-red-600 font-semibold">
                    <Users className="h-4 w-4 mr-2" />
                    <span>⚠️ Báo người xung quanh và thoát hiểm ngay!</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}

      {/* Enhanced Clear All Button */}
      {emergencyAlerts.length > 1 && (
        <div className="flex justify-center">
          <Button
            variant="destructive"
            size="sm"
            onClick={clearEmergencyAlerts}
            className="w-full bg-gray-600 hover:bg-gray-700"
          >
            <X className="h-4 w-4 mr-2" />
            Xóa tất cả ({emergencyAlerts.length})
          </Button>
        </div>
      )}

      {/* Enhanced Audio Indicator */}
      <div className="flex justify-center">
        <Badge className="bg-red-100 text-red-700 border-red-200 px-3 py-1">
          <Volume2 className="h-3 w-3 mr-2 animate-pulse" />
          🔊 Cảnh báo âm thanh đang phát
        </Badge>
      </div>
    </div>
  );
};

export default EmergencyAlertSystem; 