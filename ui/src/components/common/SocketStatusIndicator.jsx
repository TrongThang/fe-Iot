import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Wifi, 
  WifiOff, 
  AlertTriangle,
  User,
  CheckCircle
} from 'lucide-react';
import { useSocketContext } from '@/contexts/SocketContext';
import { useAuth } from '@/contexts/AuthContext';

const SocketStatusIndicator = ({ className = "" }) => {
  const { isConnected } = useSocketContext();
  const { user, isAuthenticated } = useAuth();

  // Don't show anything if user is authenticated and connected
  if (isAuthenticated && isConnected) {
    return null;
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {/* User Status */}
      {!isAuthenticated && (
        <Alert className="border-orange-200 bg-orange-50">
          <User className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            <div className="flex items-center justify-between">
              <span>Vui lòng đăng nhập để sử dụng tính năng real-time</span>
              <Badge variant="outline" className="text-orange-600 border-orange-600">
                Chưa đăng nhập
              </Badge>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Socket Status */}
      {isAuthenticated && !isConnected && (
        <Alert className="border-red-200 bg-red-50">
          <WifiOff className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <div className="flex items-center justify-between">
              <span>Kết nối real-time không khả dụng</span>
              <Badge variant="outline" className="text-red-600 border-red-600">
                Không kết nối
              </Badge>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Connected Status (optional, can be hidden) */}
      {isAuthenticated && isConnected && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            <div className="flex items-center justify-between">
              <span>Kết nối real-time hoạt động</span>
              <Badge variant="outline" className="text-green-600 border-green-600">
                Đã kết nối
              </Badge>
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default SocketStatusIndicator; 