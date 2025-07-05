import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useSocketContext } from '@/contexts/SocketContext';
import { 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  Settings, 
  CheckCircle, 
  XCircle,
  AlertTriangle,
  Eye,
  EyeOff 
} from 'lucide-react';

const SocketDebugPanel = () => {
  const { 
    isConnected, 
    getConnectionStatus, 
    connectSocket, 
    disconnectSocket,
    user,
    socketService 
  } = useSocketContext();
  
  const [debugInfo, setDebugInfo] = useState({});
  const [isVisible, setIsVisible] = useState(false);
  const [connectionLogs, setConnectionLogs] = useState([]);
  const [retryCount, setRetryCount] = useState(0);

  // Update debug info periodically
  useEffect(() => {
    const updateDebugInfo = () => {
      const status = getConnectionStatus();
      const socketInfo = {
        isConnected: status.isConnected,
        socketId: status.socketId,
        connectedDevices: status.connectedDevices,
        userId: user?.id || user?.account_id,
        apiUrl: socketService?.constructor?.name ? 
          socketService.clientSocket?.io?.uri || 'Not connected' : 'Socket service not available',
        timestamp: new Date().toLocaleTimeString('vi-VN')
      };
      
      setDebugInfo(socketInfo);
    };

    const interval = setInterval(updateDebugInfo, 2000);
    updateDebugInfo(); // Initial update
    
    return () => clearInterval(interval);
  }, [getConnectionStatus, user, socketService]);

  // Monitor connection status changes
  useEffect(() => {
    if (isConnected) {
      addLog('✅ Socket connected successfully', 'success');
    } else {
      addLog('❌ Socket disconnected', 'error');
    }
  }, [isConnected]);

  const addLog = (message, type = 'info') => {
    const logEntry = {
      id: Date.now(),
      message,
      type,
      timestamp: new Date().toLocaleTimeString('vi-VN')
    };
    
    setConnectionLogs(prev => [logEntry, ...prev.slice(0, 9)]); // Keep last 10 logs
  };

  const handleConnect = async () => {
    if (!user?.id && !user?.account_id) {
      addLog('⚠️ No user ID found. Please login first.', 'warning');
      return;
    }

    addLog('🔄 Attempting to connect...', 'info');
    setRetryCount(prev => prev + 1);
    
    try {
      const success = await connectSocket(user.id || user.account_id);
      if (success) {
        addLog('✅ Connection successful', 'success');
      } else {
        addLog('❌ Connection failed', 'error');
      }
    } catch (error) {
      addLog(`❌ Connection error: ${error.message}`, 'error');
    }
  };

  const handleDisconnect = () => {
    addLog('🔌 Disconnecting...', 'info');
    disconnectSocket();
    addLog('✅ Disconnected', 'success');
  };

  const getLogColor = (type) => {
    switch (type) {
      case 'success': return 'text-green-600';
      case 'error': return 'text-red-600';
      case 'warning': return 'text-yellow-600';
      default: return 'text-blue-600';
    }
  };

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-40">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsVisible(true)}
          className="bg-white shadow-lg border-gray-300"
        >
          <Settings className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-40 w-96">
      <Card className="shadow-xl border-2">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              Socket Debug Panel
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsVisible(false)}
              className="h-6 w-6"
            >
              <EyeOff className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Connection Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {isConnected ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600" />
              )}
              <span className="font-medium">
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
            <Badge variant={isConnected ? 'default' : 'destructive'}>
              {isConnected ? 'Online' : 'Offline'}
            </Badge>
          </div>

          {/* Debug Information */}
          <div className="space-y-2 text-sm">
            <div className="grid grid-cols-2 gap-2">
              <span className="text-gray-600">Socket ID:</span>
              <span className="font-mono text-xs">
                {debugInfo.socketId || 'Not connected'}
              </span>
              
              <span className="text-gray-600">User ID:</span>
              <span className="font-mono text-xs">
                {debugInfo.userId || 'Not available'}
              </span>
              
              <span className="text-gray-600">API URL:</span>
              <span className="font-mono text-xs break-all">
                {debugInfo.apiUrl || 'Not available'}
              </span>
              
              <span className="text-gray-600">Devices:</span>
              <span className="text-xs">
                {debugInfo.connectedDevices?.length || 0} connected
              </span>
            </div>
          </div>

          {/* Connection Controls */}
          <div className="flex space-x-2">
            <Button
              variant={isConnected ? "destructive" : "default"}
              size="sm"
              onClick={isConnected ? handleDisconnect : handleConnect}
              className="flex-1"
              disabled={!user?.id && !user?.account_id}
            >
              {isConnected ? (
                <>
                  <WifiOff className="h-4 w-4 mr-2" />
                  Disconnect
                </>
              ) : (
                <>
                  <Wifi className="h-4 w-4 mr-2" />
                  Connect
                </>
              )}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.reload()}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>

          {/* Retry Counter */}
          {retryCount > 0 && (
            <div className="text-xs text-gray-600">
              Connection attempts: {retryCount}
            </div>
          )}

          {/* Connection Logs */}
          <div className="space-y-1">
            <h4 className="text-sm font-medium text-gray-700">Connection Logs:</h4>
            <div className="bg-gray-50 rounded p-2 max-h-32 overflow-y-auto">
              {connectionLogs.length === 0 ? (
                <p className="text-xs text-gray-500">No logs yet...</p>
              ) : (
                connectionLogs.map(log => (
                  <div key={log.id} className="text-xs mb-1">
                    <span className="text-gray-400">{log.timestamp}</span>
                    <span className={`ml-2 ${getLogColor(log.type)}`}>
                      {log.message}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Warnings */}
          {!user?.id && !user?.account_id && (
            <Alert className="bg-yellow-50 border-yellow-200">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-yellow-800">
                No user ID found. Please login to connect to socket.
              </AlertDescription>
            </Alert>
          )}

          {/* Help */}
          <div className="text-xs text-gray-500 space-y-1">
            <p><strong>Socket URL:</strong> http://localhost:7777/client</p>
            <p><strong>Purpose:</strong> Debug socket connectivity issues</p>
            <p><strong>Note:</strong> Make sure IoT API is running on port 7777</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SocketDebugPanel; 