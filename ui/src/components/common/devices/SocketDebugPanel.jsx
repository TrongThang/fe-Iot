import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Activity, 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  Settings, 
  User,
  Globe,
  Server,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  Zap
} from 'lucide-react';
import { useSocketContext } from '@/contexts/SocketContext';
import { useAuth } from '@/contexts/AuthContext';
import { useDeviceSocket } from '@/hooks/useSocket';
import socketService from '@/lib/socket';

const SocketDebugPanel = ({ deviceSerial, deviceName }) => {
  const { user } = useSocketContext();
  const { isAuthenticated } = useAuth();
  const [logs, setLogs] = useState([]);
  const [deviceConnectionStatus, setDeviceConnectionStatus] = useState('disconnected');
  const [envInfo, setEnvInfo] = useState({});

  // Use device-specific socket connection
  const accountId = user?.account_id || user?.id;
  const { 
    isConnected, 
    connectionStatus, 
    error,
    deviceData,
    reconnect 
  } = useDeviceSocket(deviceSerial, accountId, { 
    autoConnect: false, 
    enableRealTime: true 
  });

  useEffect(() => {
    // Check environment variables
    const info = {
      iotApiUrl: process.env.REACT_APP_IOT_API_URL || process.env.REACT_APP_SMART_NET_IOT_API_URL,
      nodeEnv: process.env.NODE_ENV,
      hasApiUrl: !!(process.env.REACT_APP_IOT_API_URL || process.env.REACT_APP_SMART_NET_IOT_API_URL)
    };
    setEnvInfo(info);

    addLog('info', '🔧 SocketDebugPanel initialized');
    addLog('info', `📋 Environment: ${info.nodeEnv}`);
    addLog('info', `🌐 API URL: ${info.iotApiUrl || 'NOT SET'}`);
    addLog('info', `👤 Account ID: ${accountId || 'NOT SET'}`);
    addLog('info', `🔌 Device Serial: ${deviceSerial || 'NOT SET'}`);
    
    if (!info.hasApiUrl) {
      addLog('error', '❌ Missing REACT_APP_SMART_NET_IOT_API_URL environment variable');
      addLog('info', '💡 Create .env.local file with: REACT_APP_SMART_NET_IOT_API_URL=http://localhost:7777');
    }
  }, [accountId, deviceSerial]);

  const addLog = (type, message) => {
    const logEntry = {
      id: Date.now() + Math.random(), // Ensure unique IDs
      type,
      message,
      timestamp: new Date().toLocaleTimeString()
    };
    setLogs(prev => [logEntry, ...prev.slice(0, 19)]);
  };

  const testDeviceConnection = async () => {
    if (!deviceSerial || !accountId) {
      addLog('error', '❌ Missing device serial or account ID');
      return;
    }

    addLog('info', '🔄 Testing device-specific connection...');
    
    try {
      const success = await socketService.connectToDevice(deviceSerial, accountId);
      if (success) {
        addLog('success', '✅ Device connection successful');
        setDeviceConnectionStatus('connected');
      } else {
        addLog('error', '❌ Device connection failed');
        setDeviceConnectionStatus('error');
      }
    } catch (error) {
      addLog('error', `❌ Connection error: ${error.message}`);
      setDeviceConnectionStatus('error');
    }
  };

  const clearLogs = () => {
    setLogs([]);
    addLog('info', '🧹 Logs cleared');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'connected': return 'bg-green-500';
      case 'connecting': return 'bg-yellow-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'connected': return <CheckCircle className="w-4 h-4" />;
      case 'connecting': return <Zap className="w-4 h-4" />;
      case 'error': return <XCircle className="w-4 h-4" />;
      default: return <WifiOff className="w-4 h-4" />;
    }
  };

  return (
    <Card className="w-full bg-gray-900 text-white border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Socket Debug Panel
          {deviceSerial && <Badge variant="outline">{deviceSerial}</Badge>}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Connection Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h3 className="font-semibold flex items-center gap-2">
              <User className="w-4 h-4" />
              Authentication Status
            </h3>
            <div className="flex items-center gap-2">
              {isAuthenticated ? (
                <>
                  <Badge className="bg-green-500">Authenticated</Badge>
                  <span className="text-sm text-gray-300">Account: {accountId}</span>
                </>
              ) : (
                <Badge className="bg-red-500">Not Authenticated</Badge>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold flex items-center gap-2">
              <Wifi className="w-4 h-4" />
              Device Connection Status
            </h3>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${getStatusColor(connectionStatus)}`} />
              <span className="capitalize">{connectionStatus}</span>
              {getStatusIcon(connectionStatus)}
            </div>
          </div>
        </div>

        {/* Global Connection Disabled Alert */}
        <Alert className="bg-blue-900 border-blue-700">
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>Global Socket Connection Disabled</strong><br/>
            IoT API requires both serialNumber + accountId for /client namespace. 
            Use device-specific connections only.
          </AlertDescription>
        </Alert>

        {/* Environment Info */}
        <div className="space-y-2">
          <h3 className="font-semibold">Environment Configuration</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-gray-400">IoT API URL:</span>
              <span className="ml-2 font-mono">{envInfo.iotApiUrl || 'NOT SET'}</span>
            </div>
            <div>
              <span className="text-gray-400">Environment:</span>
              <span className="ml-2">{envInfo.nodeEnv}</span>
            </div>
            <div>
              <span className="text-gray-400">Device Serial:</span>
              <span className="ml-2 font-mono">{deviceSerial || 'NOT SET'}</span>
            </div>
            <div>
              <span className="text-gray-400">Account ID:</span>
              <span className="ml-2 font-mono">{accountId || 'NOT SET'}</span>
            </div>
          </div>
        </div>

        {/* Connection Controls */}
        <div className="flex gap-2">
          <Button 
            onClick={testDeviceConnection} 
            disabled={!deviceSerial || !accountId}
            variant="outline"
            size="sm"
          >
            Test Device Connection
          </Button>
          <Button 
            onClick={reconnect} 
            disabled={!deviceSerial || !accountId}
            variant="outline"
            size="sm"
          >
            Reconnect Device
          </Button>
          <Button 
            onClick={clearLogs} 
            variant="outline"
            size="sm"
          >
            Clear Logs
          </Button>
        </div>

        {/* Error Display */}
        {error && (
          <Alert className="bg-red-900 border-red-700">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Connection Error:</strong> {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Device Data Display */}
        {deviceData && (
          <div className="space-y-2">
            <h3 className="font-semibold">Latest Device Data</h3>
            <pre className="bg-gray-800 p-2 rounded text-xs overflow-x-auto">
              {JSON.stringify(deviceData, null, 2)}
            </pre>
          </div>
        )}

        {/* Logs */}
        <div className="space-y-2">
          <h3 className="font-semibold">Connection Logs</h3>
          <div className="bg-gray-800 p-2 rounded max-h-60 overflow-y-auto">
            {logs.length === 0 ? (
              <p className="text-gray-500 text-sm">No logs yet...</p>
            ) : (
              <div className="space-y-1">
                {logs.map((log) => (
                  <div key={log.id} className="flex items-start gap-2 text-xs">
                    <span className="text-gray-400 font-mono">{log.timestamp}</span>
                    <span className={`
                      ${log.type === 'success' ? 'text-green-400' : 
                        log.type === 'error' ? 'text-red-400' : 
                        log.type === 'warning' ? 'text-yellow-400' : 
                        'text-gray-300'}
                    `}>
                      {log.message}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Usage Instructions */}
        <Alert className="bg-gray-800 border-gray-600">
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>Usage Instructions:</strong><br/>
            1. Ensure IoT API is running on configured URL<br/>
            2. Login to get valid account ID<br/>
            3. Navigate to device detail page with serialNumber<br/>
            4. Device-specific socket connection will be created automatically<br/>
            5. Use "Test Device Connection" button to verify connectivity
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};

export default SocketDebugPanel; 