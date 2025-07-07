import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import testFireAlertsService, { TEST_SCENARIOS } from '@/services/testFireAlerts';
import { useSocketContext } from '@/contexts/SocketContext';

const TestFireAlerts = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [apiUrl, setApiUrl] = useState('http://localhost:3000');
  const [serialNumber, setSerialNumber] = useState('TEST_ESP8266_001');
  const [testResults, setTestResults] = useState([]);
  
  const { fcmPermission, fcmToken, requestFCMPermission } = useSocketContext();

  useEffect(() => {
    // Check connection status on mount
    const status = testFireAlertsService.getConnectionStatus();
    setIsConnected(status.connected);
    
    // Listen for server responses
    testFireAlertsService.onServerResponse('pong', (data) => {
      console.log('📟 Server pong received:', data);
      addTestResult('info', 'Pong received from server', data);
    });

    testFireAlertsService.onServerResponse('heartbeat_ack', (data) => {
      console.log('💓 Heartbeat ACK received:', data);
      addTestResult('info', 'Heartbeat acknowledged', data);
    });

    return () => {
      // Cleanup listeners
      testFireAlertsService.offServerResponse('pong');
      testFireAlertsService.offServerResponse('heartbeat_ack');
    };
  }, []);

  const addTestResult = (type, message, data = null) => {
    const result = {
      id: Date.now(),
      type,
      message,
      data,
      timestamp: new Date().toLocaleTimeString()
    };
    setTestResults(prev => [result, ...prev].slice(0, 10)); // Keep last 10 results
  };

  const connectTestDevice = async () => {
    setLoading(true);
    setStatus('Connecting to IoT API...');
    
    try {
      const result = await testFireAlertsService.connectAsTestDevice(apiUrl, serialNumber);
      setIsConnected(true);
      setStatus(`✅ Connected as ${result.serialNumber}`);
      addTestResult('success', `Test device connected: ${result.serialNumber}`);
    } catch (error) {
      setStatus(`❌ Connection failed: ${error.message}`);
      addTestResult('error', 'Connection failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  const disconnectTestDevice = () => {
    testFireAlertsService.disconnect();
    setIsConnected(false);
    setStatus('🔌 Disconnected');
    addTestResult('info', 'Test device disconnected');
  };

  const setupFCM = async () => {
    if (fcmPermission !== 'granted') {
      const result = await requestFCMPermission();
      if (result.success) {
        addTestResult('success', 'FCM permission granted');
      } else {
        addTestResult('error', 'FCM permission denied');
      }
    }
  };

  // Test functions
  const testFireAlarm = () => {
    if (!isConnected) {
      addTestResult('error', 'Device not connected');
      return;
    }
    
    try {
      const result = testFireAlertsService.triggerFireAlarm({
        temperature: 95.5,
        location: 'Kitchen',
        severity: 'critical'
      });
      addTestResult('fire', 'Fire alarm triggered', result);
    } catch (error) {
      addTestResult('error', 'Fire alarm test failed', error.message);
    }
  };

  const testSmokeDetection = () => {
    if (!isConnected) {
      addTestResult('error', 'Device not connected');
      return;
    }
    
    try {
      const result = testFireAlertsService.triggerSmokeDetected({
        smoke_level: 80,
        location: 'Bedroom',
        air_quality: 'poor'
      });
      addTestResult('smoke', 'Smoke detection triggered', result);
    } catch (error) {
      addTestResult('error', 'Smoke detection test failed', error.message);
    }
  };

  const testGasLeak = () => {
    if (!isConnected) {
      addTestResult('error', 'Device not connected');
      return;
    }
    
    try {
      const result = testFireAlertsService.triggerGasLeak({
        gas_level: 45,
        gas_type: 'LPG',
        location: 'Kitchen'
      });
      addTestResult('gas', 'Gas leak triggered', result);
    } catch (error) {
      addTestResult('error', 'Gas leak test failed', error.message);
    }
  };

  const testScenario = (scenarioName) => {
    if (!isConnected) {
      addTestResult('error', 'Device not connected');
      return;
    }

    const scenario = TEST_SCENARIOS[scenarioName];
    if (!scenario) {
      addTestResult('error', `Unknown scenario: ${scenarioName}`);
      return;
    }

    try {
      let result;
      switch (scenario.type) {
        case 'fire_alarm':
          result = testFireAlertsService.triggerFireAlarm(scenario.data);
          break;
        case 'smoke_detected':
          result = testFireAlertsService.triggerSmokeDetected(scenario.data);
          break;
        case 'gas_leak':
          result = testFireAlertsService.triggerGasLeak(scenario.data);
          break;
        case 'alarm_alert':
          result = testFireAlertsService.triggerAlarmAlert(scenario.data);
          break;
        default:
          throw new Error(`Unsupported scenario type: ${scenario.type}`);
      }
      
      addTestResult(scenario.type, `Scenario ${scenarioName} executed`, result);
    } catch (error) {
      addTestResult('error', `Scenario ${scenarioName} failed`, error.message);
    }
  };

  const testEmergencySequence = async () => {
    if (!isConnected) {
      addTestResult('error', 'Device not connected');
      return;
    }

    setLoading(true);
    addTestResult('info', 'Starting emergency sequence...');
    
    try {
      const results = await testFireAlertsService.testEmergencySequence({
        interval: 2000, // 2 seconds
        includeSmoke: true,
        includeGas: true,
        includeFire: true
      });
      
      addTestResult('success', 'Emergency sequence completed', results);
    } catch (error) {
      addTestResult('error', 'Emergency sequence failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  const testPing = () => {
    if (!isConnected) {
      addTestResult('error', 'Device not connected');
      return;
    }

    try {
      testFireAlertsService.socket.emit('ping');
      addTestResult('info', 'Ping sent to server');
    } catch (error) {
      addTestResult('error', 'Ping failed', error.message);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  const getResultIcon = (type) => {
    switch (type) {
      case 'fire': return '🔥';
      case 'smoke': return '💨';
      case 'gas': return '⚠️';
      case 'success': return '✅';
      case 'error': return '❌';
      case 'info': return 'ℹ️';
      default: return '📋';
    }
  };

  const getResultColor = (type) => {
    switch (type) {
      case 'fire':
      case 'error': return 'text-red-600 border-red-200 bg-red-50';
      case 'smoke':
      case 'gas': return 'text-orange-600 border-orange-200 bg-orange-50';
      case 'success': return 'text-green-600 border-green-200 bg-green-50';
      case 'info': return 'text-blue-600 border-blue-200 bg-blue-50';
      default: return 'text-gray-600 border-gray-200 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold">🧪 Test Fire Alerts - IoT Simulator</h1>
        <p className="text-gray-600 mt-2">
          Simulate IoT ESP8266 device để test FCM fire alerts
        </p>
      </div>

      {/* FCM Status */}
      <div className="bg-white p-4 border rounded-lg shadow-sm">
        <h3 className="font-semibold mb-3">📱 FCM Status</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm">
              Permission: <span className={`px-2 py-1 rounded text-xs ${fcmPermission === 'granted' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {fcmPermission || 'not-requested'}
              </span>
            </p>
            {fcmToken && (
              <p className="text-xs text-gray-500 mt-1">
                Token: {fcmToken.substring(0, 30)}...
              </p>
            )}
          </div>
          {fcmPermission !== 'granted' && (
            <button
              onClick={setupFCM}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Setup FCM
            </button>
          )}
        </div>
      </div>

      {/* Connection Setup */}
      <div className="bg-white p-4 border rounded-lg shadow-sm">
        <h3 className="font-semibold mb-4">🔌 Connection Setup</h3>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">API URL</label>
            <input
              type="text"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              disabled={isConnected}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Serial Number</label>
            <input
              type="text"
              value={serialNumber}
              onChange={(e) => setSerialNumber(e.target.value)}
              disabled={isConnected}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex gap-2">
          {!isConnected ? (
            <button
              onClick={connectTestDevice}
              disabled={loading}
              className="flex-1 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
            >
              {loading ? 'Connecting...' : 'Connect Test Device'}
            </button>
          ) : (
            <button
              onClick={disconnectTestDevice}
              className="flex-1 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Disconnect
            </button>
          )}
        </div>

        {status && (
          <div className="mt-3 p-3 bg-gray-100 rounded text-sm">
            {status}
          </div>
        )}
      </div>

      {/* Test Controls */}
      {isConnected && (
        <div className="bg-white p-4 border rounded-lg shadow-sm">
          <h3 className="font-semibold mb-4">🚨 Emergency Test Controls</h3>
          
          {/* Individual Tests */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <button
              onClick={testFireAlarm}
              className="h-20 bg-red-500 text-white rounded hover:bg-red-600 flex flex-col items-center justify-center"
            >
              <span className="text-2xl">🔥</span>
              <span className="text-sm">Fire Alarm</span>
            </button>
            <button
              onClick={testSmokeDetection}
              className="h-20 bg-orange-500 text-white rounded hover:bg-orange-600 flex flex-col items-center justify-center"
            >
              <span className="text-2xl">💨</span>
              <span className="text-sm">Smoke Detection</span>
            </button>
            <button
              onClick={testGasLeak}
              className="h-20 bg-yellow-500 text-white rounded hover:bg-yellow-600 flex flex-col items-center justify-center"
            >
              <span className="text-2xl">⚠️</span>
              <span className="text-sm">Gas Leak</span>
            </button>
          </div>

          {/* Predefined Scenarios */}
          <div className="mb-6">
            <h4 className="font-medium mb-3">📝 Predefined Scenarios</h4>
            <div className="grid grid-cols-2 gap-2">
              {Object.keys(TEST_SCENARIOS).map((scenarioName) => (
                <button
                  key={scenarioName}
                  onClick={() => testScenario(scenarioName)}
                  className="p-2 text-sm border rounded hover:bg-gray-50"
                >
                  {scenarioName.replace(/_/g, ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Advanced Tests */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={testEmergencySequence}
              disabled={loading}
              className="h-12 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50"
            >
              {loading ? 'Running...' : '🚨 Emergency Sequence'}
            </button>
            <button
              onClick={testPing}
              className="h-12 border border-gray-300 rounded hover:bg-gray-50"
            >
              🏓 Test Ping
            </button>
          </div>
        </div>
      )}

      {/* Test Results */}
      <div className="bg-white p-4 border rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold">📊 Test Results</h3>
          {testResults.length > 0 && (
            <button
              onClick={clearResults}
              className="px-3 py-1 text-sm border rounded hover:bg-gray-50"
            >
              Clear
            </button>
          )}
        </div>

        {testResults.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No test results yet. Start testing to see results here.
          </p>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {testResults.map((result) => (
              <div
                key={result.id}
                className={`p-3 border rounded-lg ${getResultColor(result.type)}`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-lg flex-shrink-0">
                    {getResultIcon(result.type)}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium uppercase">
                        {result.type}
                      </span>
                      <span className="text-xs opacity-75">
                        {result.timestamp}
                      </span>
                    </div>
                    <p className="text-sm font-medium">{result.message}</p>
                    {result.data && (
                      <pre className="text-xs mt-2 p-2 bg-black bg-opacity-10 rounded overflow-x-auto">
                        {typeof result.data === 'string'
                          ? result.data
                          : JSON.stringify(result.data, null, 2)
                        }
                      </pre>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TestFireAlerts; 