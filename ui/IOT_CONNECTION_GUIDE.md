# IoT Socket Connection Guide

## Overview

The IoT HomeConnect API uses **device-specific socket connections** that require both `serialNumber` and `accountId` for the `/client` namespace. Global socket connections have been disabled to prevent connection issues.

## Architecture

### IoT API Namespaces

1. **`/device`** - For IoT devices (ESP8266, Arduino, etc.)
   - Requires: `serialNumber`
   - Used by: Physical IoT devices

2. **`/client`** - For client applications (Web, Mobile)
   - Requires: `serialNumber` + `accountId`
   - Used by: Frontend applications

## Connection Strategy

### ❌ Old Strategy (DISABLED)
```javascript
// This will FAIL - IoT API rejects connections without serialNumber
socketService.connect(accountId) // Missing serialNumber
```

### ✅ New Strategy (REQUIRED)
```javascript
// Device-specific connection with both parameters
socketService.connectToDevice(serialNumber, accountId)

// Or use hooks
useDeviceSocket(serialNumber, accountId, options)
```

## Usage Examples

### 1. Device Detail Page
```jsx
import { useDeviceSocket } from '@/hooks/useSocket';

const DeviceDetail = ({ device }) => {
  const { user } = useSocketContext();
  const accountId = user?.account_id || user?.id;
  
  const { 
    isConnected, 
    sensorData, 
    connectToDevice 
  } = useDeviceSocket(device.serialNumber, accountId, { 
    autoConnect: true, 
    enableRealTime: true 
  });

  return (
    <div>
      <h1>{device.name}</h1>
      <p>Status: {isConnected ? 'Connected' : 'Disconnected'}</p>
      {sensorData && <pre>{JSON.stringify(sensorData, null, 2)}</pre>}
    </div>
  );
};
```

### 2. Gas Monitoring Device
```jsx
import { useDeviceSocket } from '@/hooks/useSocket';

const GasMonitoringDetail = ({ device }) => {
  const { user } = useSocketContext();
  const accountId = user?.account_id || user?.id;
  
  const { 
    isConnected, 
    sensorData,
    sendCommand 
  } = useDeviceSocket(device.serialNumber, accountId, { 
    autoConnect: true 
  });

  const updateGasThreshold = (threshold) => {
    sendCommand({
      action: 'update_config',
      config: { gasThreshold: threshold }
    });
  };

  return (
    <div>
      <h2>Gas Monitoring: {device.serialNumber}</h2>
      
      {/* Connection Status */}
      <div className={`status ${isConnected ? 'connected' : 'disconnected'}`}>
        {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
      </div>

      {/* Real-time Data */}
      {sensorData && (
        <div>
          <p>Gas Level: {sensorData.gas} PPM</p>
          <p>Temperature: {sensorData.temperature}°C</p>
          <p>Humidity: {sensorData.humidity}%</p>
        </div>
      )}

      {/* Controls */}
      <button onClick={() => updateGasThreshold(1000)}>
        Set Gas Threshold: 1000 PPM
      </button>
    </div>
  );
};
```

### 3. LED Control Device
```jsx
import { useLEDSocket } from '@/hooks/useSocket';

const LEDControlDetail = ({ device }) => {
  const { user } = useSocketContext();
  const accountId = user?.account_id || user?.id;
  
  const { 
    isConnected,
    setEffect,
    turnOn,
    turnOff 
  } = useLEDSocket(device.serialNumber, accountId, { 
    autoConnect: true 
  });

  return (
    <div>
      <h2>LED Control: {device.serialNumber}</h2>
      
      <button onClick={() => turnOn()}>Turn On</button>
      <button onClick={() => turnOff()}>Turn Off</button>
      <button onClick={() => setEffect({ effect: 'rainbow', speed: 500 })}>
        Rainbow Effect
      </button>
    </div>
  );
};
```

## Available Hooks

### 1. `useDeviceSocket(serialNumber, accountId, options)`
**General device connection with real-time data**

```javascript
const {
  isConnected,        // Connection status
  sensorData,         // Latest sensor data
  deviceStatus,       // Device status updates
  alarmData,          // Alarm/alert data
  connectToDevice,    // Manual connect function
  disconnectFromDevice, // Manual disconnect
  sendCommand         // Send commands to device
} = useDeviceSocket(serialNumber, accountId, {
  autoConnect: true,    // Auto-connect on mount
  enableRealTime: true  // Enable real-time monitoring
});
```

### 2. `useDoorSocket(serialNumber, accountId, options)`
**Door control specific functionality**

```javascript
const {
  isConnected,
  doorStatus,
  toggleDoor,
  openDoor,
  closeDoor,
  lockDoor,
  unlockDoor
} = useDoorSocket(serialNumber, accountId, {
  autoConnect: false  // Manual connect by default
});
```

### 3. `useLEDSocket(serialNumber, accountId, options)`
**LED control specific functionality**

```javascript
const {
  isConnected,
  ledCapabilities,
  ledStatus,
  setEffect,
  applyPreset,
  turnOn,
  turnOff,
  setBrightness,
  setColor
} = useLEDSocket(serialNumber, accountId, {
  autoConnect: false  // Manual connect by default
});
```

## Configuration

### Environment Variables
```bash
# .env.local
REACT_APP_IOT_API_URL=http://localhost:7777
# or
REACT_APP_SMART_NET_IOT_API_URL=https://your-iot-api.com
```

### IoT API Requirements
- IoT API server running on configured URL
- Valid user authentication with `account_id`
- Device exists in database with `serial_number`
- User has access to the device (ownership or sharing)

## Event Listeners

### Real-time Events
```javascript
// Device-specific sensor data
socketService.on(`device_sensor_data_${serialNumber}`, handleSensorData);

// Device status updates
socketService.on(`device_status_${serialNumber}`, handleDeviceStatus);

// Alarm alerts
socketService.on(`device_alarm_${serialNumber}`, handleAlarmData);

// Real-time monitoring confirmations
socketService.on(`realtime_started_${serialNumber}`, handleRealtimeStarted);
socketService.on(`realtime_stopped_${serialNumber}`, handleRealtimeStopped);
```

### Global Events (Still Available)
```javascript
// Emergency alerts (broadcasted to all clients)
socketService.on('emergency_alert', handleEmergencyAlert);
socketService.on('fire_alert', handleFireAlert);
socketService.on('smoke_alert', handleSmokeAlert);

// Device connection events
socketService.on('device_connect', handleDeviceConnect);
socketService.on('device_disconnect', handleDeviceDisconnect);
```

## Debugging

### 1. Use SocketDebugPanel Component
```jsx
import SocketDebugPanel from '@/components/common/devices/SocketDebugPanel';

<SocketDebugPanel 
  deviceSerial="YOUR_DEVICE_SERIAL"
  deviceName="Gas Monitor #1" 
/>
```

### 2. Check Console Logs
Look for these log patterns:
- `🔗 Creating device-specific connection for [serialNumber]`
- `✅ Device socket connected for [serialNumber]`
- `🔴 Starting real-time monitoring for device: [serialNumber]`

### 3. Common Issues & Solutions

#### Issue: "Missing serialNumber or accountId"
```javascript
// ❌ Wrong
useDeviceSocket(undefined, accountId)

// ✅ Correct  
useDeviceSocket(device.serialNumber, user.account_id)
```

#### Issue: "Connection rejected by server"
- Check user is authenticated: `user.account_id` exists
- Verify device exists in database
- Ensure user has access to device
- Check IoT API server is running

#### Issue: "No real-time data"
```javascript
// Make sure to enable real-time monitoring
useDeviceSocket(serialNumber, accountId, { 
  autoConnect: true,
  enableRealTime: true  // This is important!
});
```

## Migration Guide

### From Old Global Connection
```javascript
// ❌ Old way (DISABLED)
const { isConnected } = useSocket(accountId);
socketService.connect(accountId);

// ✅ New way
const { isConnected } = useDeviceSocket(serialNumber, accountId, { autoConnect: true });
```

### Update Component Props
```javascript
// Components now need device serial number
<RealtimeSensorDisplay 
  deviceSerial={device.serialNumber}  // Required
  deviceName={device.name}
/>

<SocketDebugPanel
  deviceSerial={device.serialNumber}  // Required
/>
```

## Best Practices

1. **Always provide serialNumber**: Every device connection needs a valid serial number
2. **Use appropriate hook**: Choose the right hook for your device type (LED, Door, General)
3. **Handle connection states**: Check `isConnected` before sending commands
4. **Enable auto-connect carefully**: Only enable when you're sure the device should connect immediately
5. **Clean up connections**: Hooks automatically clean up on unmount
6. **Error handling**: Always handle connection errors gracefully

## Testing

### 1. Device Connection Test
```javascript
const testDeviceConnection = async () => {
  try {
    const success = await socketService.connectToDevice(serialNumber, accountId);
    console.log('Connection result:', success);
  } catch (error) {
    console.error('Connection failed:', error);
  }
};
```

### 2. Real-time Data Test
```javascript
const testRealtimeData = () => {
  socketService.on(`device_sensor_data_${serialNumber}`, (data) => {
    console.log('Real-time sensor data:', data);
  });
  
  // Start real-time monitoring
  socketService.clientSocket?.emit('start_real_time_device', { serialNumber });
};
```

### 3. Command Test
```javascript
const testCommand = () => {
  const command = {
    action: 'test_alarm',
    timestamp: new Date().toISOString()
  };
  
  socketService.sendCommand(serialNumber, command);
};
```

## Support

If you encounter issues:
1. Check console logs for error messages
2. Use SocketDebugPanel for detailed connection info
3. Verify IoT API server status
4. Ensure proper authentication and device access
5. Test with different devices to isolate issues 