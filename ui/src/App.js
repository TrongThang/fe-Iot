import './App.css';
import './styles/emergency-alerts.css';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { AuthProvider } from '@/contexts/AuthContext';
import { SocketProvider } from '@/contexts/SocketContext';
import EmergencyAlertSystem from '@/components/common/EmergencyAlertSystem';
import SocketDebugPanel from '@/components/common/SocketDebugPanel';
import { Toaster } from 'sonner';
import fcmService from '@/services/fcmService';
import { useState, useEffect } from 'react';

// FCM Debug Panel Component
const FCMDebugPanel = () => {
  const [status, setStatus] = useState({});
  const [testResults, setTestResults] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showPanel, setShowPanel] = useState(false);

  const updateStatus = () => {
    if (fcmService) {
      const newStatus = fcmService.getStatus();
      setStatus(newStatus);
    }
  };

  useEffect(() => {
    updateStatus();
    const interval = setInterval(updateStatus, 5000);
    
    // Listen for Ctrl+F to toggle FCM debug panel
    const handleKeyPress = (e) => {
      if (e.ctrlKey && e.key === 'f') {
        e.preventDefault();
        setShowPanel(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      clearInterval(interval);
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  const handleRequestPermission = async () => {
    try {
      const result = await fcmService.requestPermission();
      setTestResults(prev => [...prev, {
        id: Date.now(),
        type: result.success ? 'success' : 'error',
        message: result.success ? 'Permission granted' : 'Permission denied',
        timestamp: new Date().toLocaleTimeString()
      }]);
      updateStatus();
    } catch (error) {
      setTestResults(prev => [...prev, {
        id: Date.now(),
        type: 'error',
        message: `Error: ${error.message}`,
        timestamp: new Date().toLocaleTimeString()
      }]);
    }
  };

  const handleRefreshToken = async () => {
    setIsRefreshing(true);
    try {
      const newToken = await fcmService.refreshToken();
      setTestResults(prev => [...prev, {
        id: Date.now(),
        type: newToken ? 'success' : 'error',
        message: newToken ? 'Token refreshed successfully' : 'Failed to refresh token',
        timestamp: new Date().toLocaleTimeString()
      }]);
      updateStatus();
    } catch (error) {
      setTestResults(prev => [...prev, {
        id: Date.now(),
        type: 'error',
        message: `Error: ${error.message}`,
        timestamp: new Date().toLocaleTimeString()
      }]);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleTestNotification = async (type) => {
    try {
      const result = await fcmService.testNotification(type);
      setTestResults(prev => [...prev, {
        id: Date.now(),
        type: result ? 'success' : 'warning',
        message: result ? `${type} notification sent` : 'Test failed - check permission',
        timestamp: new Date().toLocaleTimeString()
      }]);
    } catch (error) {
      setTestResults(prev => [...prev, {
        id: Date.now(),
        type: 'error',
        message: `Test error: ${error.message}`,
        timestamp: new Date().toLocaleTimeString()
      }]);
    }
  };

  if (!showPanel) return null;

  return (
    <div className="fixed top-4 right-4 w-96 bg-white shadow-lg border rounded-lg p-4 z-50 max-h-[80vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">📱 FCM Debug</h2>
        <button 
          onClick={() => setShowPanel(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>
      
      {/* Status */}
      <div className="bg-gray-50 p-3 rounded-lg mb-4">
        <h3 className="font-semibold mb-2">📊 Status</h3>
        <div className="space-y-1 text-sm">
          <div>Initialized: {status.isInitialized ? '✅' : '❌'}</div>
          <div>Has Token: {status.hasToken ? '✅' : '❌'}</div>
          <div>Permission: <span className={`px-2 py-1 rounded text-xs ${
            status.permission === 'granted' ? 'bg-green-100 text-green-800' :
            status.permission === 'denied' ? 'bg-red-100 text-red-800' :
            'bg-yellow-100 text-yellow-800'
          }`}>{status.permission}</span></div>
          <div>Service Worker: {status.serviceWorkerRegistered ? '✅' : '❌'}</div>
          {status.tokenAge && (
            <div className="text-xs text-gray-600">
              Token Age: {status.tokenAgeHours} hours
            </div>
          )}
        </div>
      </div>

      {/* Token Display */}
      {status.token && (
        <div className="bg-blue-50 p-3 rounded-lg mb-4">
          <h3 className="font-semibold mb-2">🎫 FCM Token</h3>
          <div className="text-xs font-mono bg-white p-2 rounded border break-all">
            {status.token.substring(0, 50)}...
          </div>
          <button
            onClick={() => navigator.clipboard.writeText(status.token)}
            className="mt-2 text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
          >
            Copy Full Token
          </button>
        </div>
      )}

      {/* Controls */}
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleRequestPermission}
            disabled={status.permission === 'granted'}
            className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            Request Permission
          </button>
          <button
            onClick={handleRefreshToken}
            disabled={isRefreshing}
            className="px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 text-sm"
          >
            {isRefreshing ? 'Refreshing...' : 'Refresh Token'}
          </button>
        </div>
        
        <div>
          <h4 className="font-semibold mb-2">🧪 Test Notifications</h4>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleTestNotification('test')}
              disabled={status.permission !== 'granted'}
              className="px-3 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50 text-sm"
            >
              Test
            </button>
            <button
              onClick={() => handleTestNotification('fire')}
              disabled={status.permission !== 'granted'}
              className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50 text-sm"
            >
              🔥 Fire
            </button>
            <button
              onClick={() => handleTestNotification('smoke')}
              disabled={status.permission !== 'granted'}
              className="px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50 text-sm"
            >
              💨 Smoke
            </button>
            <button
              onClick={() => handleTestNotification('gas')}
              disabled={status.permission !== 'granted'}
              className="px-3 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:opacity-50 text-sm"
            >
              ⚠️ Gas
            </button>
          </div>
        </div>
      </div>

      {/* Test Results */}
      <div className="mt-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold">📝 Results</h3>
          <button
            onClick={() => setTestResults([])}
            className="text-xs bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600"
          >
            Clear
          </button>
        </div>
        <div className="max-h-32 overflow-y-auto space-y-1">
          {testResults.length === 0 ? (
            <div className="text-gray-500 text-center py-2 text-sm">No results yet</div>
          ) : (
            testResults.slice(-3).reverse().map(result => (
              <div key={result.id} className="text-sm">
                <div className={`px-2 py-1 rounded text-xs ${
                  result.type === 'success' ? 'bg-green-100 text-green-800' :
                  result.type === 'error' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {result.message}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      
      <div className="mt-4 text-xs text-gray-500 text-center">
        Press Ctrl+F to toggle this panel
      </div>
    </div>
  );
};

function App() {
	return (
		<AuthProvider>
			<SocketProvider>
				<RouterProvider router={router} />
				<EmergencyAlertSystem />
				<SocketDebugPanel />
				<FCMDebugPanel />
				<Toaster />
			</SocketProvider>
		</AuthProvider>
	);
}

export default App;  