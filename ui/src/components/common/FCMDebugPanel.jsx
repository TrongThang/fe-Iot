import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, CheckCircle, XCircle, RefreshCw, Play, Trash2, Copy, Info } from 'lucide-react';

const FCMDebugPanel = ({ fcmService }) => {
  const [status, setStatus] = useState({});
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [testResults, setTestResults] = useState([]);
  const [expandedSections, setExpandedSections] = useState({
    status: true,
    token: false,
    tests: false,
    logs: false
  });

  const updateStatus = () => {
    if (fcmService) {
      const newStatus = fcmService.getStatus();
      setStatus(newStatus);
      console.log('📊 FCM Status updated:', newStatus);
    }
  };

  useEffect(() => {
    updateStatus();
    
    // Update status every 5 seconds
    const interval = setInterval(updateStatus, 5000);
    
    // Listen for FCM events
    const handleTokenReady = (event) => {
      console.log('🎫 FCM Token ready event received:', event.detail);
      updateStatus();
      setTestResults(prev => [...prev, {
        id: Date.now(),
        type: 'success',
        message: 'FCM Token retrieved successfully',
        timestamp: new Date().toLocaleTimeString()
      }]);
    };

    const handleTokenCleared = () => {
      console.log('🧹 FCM Token cleared event received');
      updateStatus();
      setTestResults(prev => [...prev, {
        id: Date.now(),
        type: 'info',
        message: 'FCM Token cleared',
        timestamp: new Date().toLocaleTimeString()
      }]);
    };

    window.addEventListener('fcm-token-ready', handleTokenReady);
    window.addEventListener('fcm-token-cleared', handleTokenCleared);

    return () => {
      clearInterval(interval);
      window.removeEventListener('fcm-token-ready', handleTokenReady);
      window.removeEventListener('fcm-token-cleared', handleTokenCleared);
    };
  }, [fcmService]);

  const handleRequestPermission = async () => {
    if (!fcmService) return;

    try {
      const result = await fcmService.requestPermission();
      setTestResults(prev => [...prev, {
        id: Date.now(),
        type: result.success ? 'success' : 'error',
        message: result.success ? 'Permission granted successfully' : 'Permission denied',
        timestamp: new Date().toLocaleTimeString(),
        data: result
      }]);
      updateStatus();
    } catch (error) {
      setTestResults(prev => [...prev, {
        id: Date.now(),
        type: 'error',
        message: `Error requesting permission: ${error.message}`,
        timestamp: new Date().toLocaleTimeString()
      }]);
    }
  };

  const handleRefreshToken = async () => {
    if (!fcmService) return;

    setIsRefreshing(true);
    try {
      const newToken = await fcmService.refreshToken();
      setTestResults(prev => [...prev, {
        id: Date.now(),
        type: newToken ? 'success' : 'error',
        message: newToken ? 'Token refreshed successfully' : 'Failed to refresh token',
        timestamp: new Date().toLocaleTimeString(),
        data: { newToken }
      }]);
      updateStatus();
    } catch (error) {
      setTestResults(prev => [...prev, {
        id: Date.now(),
        type: 'error',
        message: `Error refreshing token: ${error.message}`,
        timestamp: new Date().toLocaleTimeString()
      }]);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleClearData = () => {
    if (!fcmService) return;

    fcmService.clearFCMData();
    setTestResults(prev => [...prev, {
      id: Date.now(),
      type: 'info',
      message: 'FCM data cleared',
      timestamp: new Date().toLocaleTimeString()
    }]);
    updateStatus();
  };

  const handleTestNotification = async (type) => {
    if (!fcmService) return;

    try {
      const result = await fcmService.testNotification(type);
      setTestResults(prev => [...prev, {
        id: Date.now(),
        type: result ? 'success' : 'warning',
        message: result ? `${type} notification test sent` : 'Test notification failed - check permission',
        timestamp: new Date().toLocaleTimeString(),
        data: { type, result }
      }]);
    } catch (error) {
      setTestResults(prev => [...prev, {
        id: Date.now(),
        type: 'error',
        message: `Test notification error: ${error.message}`,
        timestamp: new Date().toLocaleTimeString()
      }]);
    }
  };

  const copyToken = () => {
    if (status.token) {
      navigator.clipboard.writeText(status.token);
      setTestResults(prev => [...prev, {
        id: Date.now(),
        type: 'info',
        message: 'Token copied to clipboard',
        timestamp: new Date().toLocaleTimeString()
      }]);
    }
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getStatusIcon = (condition) => {
    if (condition) return <CheckCircle className="w-4 h-4 text-green-500" />;
    return <XCircle className="w-4 h-4 text-red-500" />;
  };

  const getPermissionBadge = (permission) => {
    const variants = {
      'granted': 'default',
      'denied': 'destructive',
      'default': 'secondary'
    };
    return (
      <Badge variant={variants[permission] || 'secondary'}>
        {permission}
      </Badge>
    );
  };

  const clearTestResults = () => {
    setTestResults([]);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="w-5 h-5" />
          FCM Debug Panel
          <Badge variant="outline" className="ml-auto">
            {status.isInitialized ? 'Ready' : 'Initializing...'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Status Section */}
        <div>
          <Button 
            variant="ghost" 
            className="w-full justify-between p-0 h-auto"
            onClick={() => toggleSection('status')}
          >
            <h3 className="text-lg font-semibold">📊 Service Status</h3>
            <span>{expandedSections.status ? '−' : '+'}</span>
          </Button>
          
          {expandedSections.status && (
            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  {getStatusIcon(status.isSupported)}
                  <span className="text-sm">Browser Support</span>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(status.isInitialized)}
                  <span className="text-sm">Initialized</span>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(status.serviceWorkerRegistered)}
                  <span className="text-sm">Service Worker</span>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(status.hasToken)}
                  <span className="text-sm">Has Token</span>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(status.hasSavedToken)}
                  <span className="text-sm">Saved Token</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm">Permission:</span>
                  {getPermissionBadge(status.permission)}
                </div>
              </div>
              
              {status.tokenAge && (
                <div className="text-sm text-gray-600">
                  Token Age: {status.tokenAgeHours} hours
                </div>
              )}
              
              <div className="text-sm text-gray-600">
                Handlers: {status.foregroundHandlers} foreground, {status.emergencyHandlers} emergency
              </div>
            </div>
          )}
        </div>

        <Separator />

        {/* Token Section */}
        <div>
          <Button 
            variant="ghost" 
            className="w-full justify-between p-0 h-auto"
            onClick={() => toggleSection('token')}
          >
            <h3 className="text-lg font-semibold">🎫 FCM Token</h3>
            <span>{expandedSections.token ? '−' : '+'}</span>
          </Button>
          
          {expandedSections.token && (
            <div className="mt-4 space-y-4">
              {status.token ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Current Token:</span>
                    <Button variant="outline" size="sm" onClick={copyToken}>
                      <Copy className="w-4 h-4 mr-1" />
                      Copy
                    </Button>
                  </div>
                  <div className="p-3 bg-gray-100 rounded-lg text-xs font-mono break-all">
                    {status.token}
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-yellow-50 rounded-lg text-sm">
                  No FCM token available. Request permission first.
                </div>
              )}
              
              {status.savedToken && status.savedToken !== status.token && (
                <div className="space-y-2">
                  <span className="text-sm font-medium">Saved Token:</span>
                  <div className="p-3 bg-gray-50 rounded-lg text-xs font-mono break-all">
                    {status.savedToken}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <Separator />

        {/* Controls */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">🎮 Controls</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRequestPermission}
              disabled={status.permission === 'granted'}
            >
              Request Permission
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefreshToken}
              disabled={isRefreshing || status.permission !== 'granted'}
            >
              {isRefreshing ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                'Refresh Token'
              )}
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleClearData}
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Clear Data
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={updateStatus}
            >
              Update Status
            </Button>
          </div>
        </div>

        <Separator />

        {/* Test Notifications */}
        <div>
          <Button 
            variant="ghost" 
            className="w-full justify-between p-0 h-auto"
            onClick={() => toggleSection('tests')}
          >
            <h3 className="text-lg font-semibold">🧪 Test Notifications</h3>
            <span>{expandedSections.tests ? '−' : '+'}</span>
          </Button>
          
          {expandedSections.tests && (
            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleTestNotification('test')}
                  disabled={status.permission !== 'granted'}
                >
                  <Play className="w-4 h-4 mr-1" />
                  Test
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleTestNotification('fire')}
                  disabled={status.permission !== 'granted'}
                  className="text-red-600 hover:text-red-700"
                >
                  🔥 Fire
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleTestNotification('smoke')}
                  disabled={status.permission !== 'granted'}
                  className="text-gray-600 hover:text-gray-700"
                >
                  💨 Smoke
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleTestNotification('gas')}
                  disabled={status.permission !== 'granted'}
                  className="text-orange-600 hover:text-orange-700"
                >
                  ⚠️ Gas
                </Button>
              </div>
              
              {status.permission !== 'granted' && (
                <div className="p-3 bg-yellow-50 rounded-lg text-sm">
                  Grant notification permission to test notifications
                </div>
              )}
            </div>
          )}
        </div>

        <Separator />

        {/* Test Results */}
        <div>
          <Button 
            variant="ghost" 
            className="w-full justify-between p-0 h-auto"
            onClick={() => toggleSection('logs')}
          >
            <h3 className="text-lg font-semibold">📝 Test Results</h3>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{testResults.length}</Badge>
              <span>{expandedSections.logs ? '−' : '+'}</span>
            </div>
          </Button>
          
          {expandedSections.logs && (
            <div className="mt-4 space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Recent activities:</span>
                <Button variant="outline" size="sm" onClick={clearTestResults}>
                  Clear
                </Button>
              </div>
              
              <div className="max-h-60 overflow-y-auto space-y-2">
                {testResults.length === 0 ? (
                  <div className="p-3 bg-gray-50 rounded-lg text-sm text-center">
                    No test results yet
                  </div>
                ) : (
                  testResults.slice(-10).reverse().map(result => (
                    <div key={result.id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        {result.type === 'success' && <CheckCircle className="w-4 h-4 text-green-500" />}
                        {result.type === 'error' && <XCircle className="w-4 h-4 text-red-500" />}
                        {result.type === 'warning' && <AlertCircle className="w-4 h-4 text-yellow-500" />}
                        {result.type === 'info' && <Info className="w-4 h-4 text-blue-500" />}
                        <span className="text-sm font-medium">{result.message}</span>
                        <span className="text-xs text-gray-500 ml-auto">{result.timestamp}</span>
                      </div>
                      {result.data && (
                        <div className="mt-2 text-xs text-gray-600 font-mono">
                          {JSON.stringify(result.data, null, 2)}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FCMDebugPanel; 