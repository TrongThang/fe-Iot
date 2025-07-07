import { io } from "socket.io-client";

// Socket configuration for IoT API
const SOCKET_CONFIG = {
  // Change this to match your IoT API URL (IoT API runs on port 7777)
  // Remove /api prefix as IoT API namespaces are directly /client and /device
  url: (() => {
    const baseUrl = process.env.REACT_APP_IOT_API_URL || 
                   process.env.REACT_APP_SMART_NET_IOT_API_URL || 
                   "http://localhost:7777";
    
    // Remove /api or /api/ suffix if present
    return baseUrl.replace(/\/api\/?$/, '');
  })(),
  options: {
    transports: ["websocket", "polling"],
    withCredentials: false,
    timeout: 20000,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    maxReconnectionAttempts: 5,
    forceNew: false,
    autoConnect: false, // We'll control connection manually
  }
};

class SocketService {
  constructor() {
    this.clientSocket = null;
    this.isConnected = false;
    this.connectedDevices = new Map();
    this.eventListeners = new Map();
    this.retryCount = 0;
    this.maxRetries = 5;
  }

  // Initialize client socket connection
  connect(accountId) {
    console.log("🚫 GLOBAL SOCKET CONNECTION DISABLED");
    console.log("💡 IoT API requires serialNumber + accountId for /client namespace");
    console.log("📋 Use device-specific connections instead:");
    console.log("   - socketService.connectToDevice(serialNumber, accountId)");
    console.log("   - useDeviceSocket(serialNumber, accountId, options)");
    
    return Promise.reject(new Error('Global socket connection disabled. Use device-specific connections.'));
  }

  // Setup client socket event listeners
  setupClientSocketEvents(resolve, reject) {
    if (!this.clientSocket) return;

    // Connection successful
    this.clientSocket.on('connect', () => {
      console.log('✅ Socket connected to /client namespace');
      console.log('📡 Socket ID:', this.clientSocket.id);
      console.log('🔍 Socket query params:', this.clientSocket.io.opts.query);
      this.isConnected = true;
      this.retryCount = 0;
      
      // If connected with device params, start real-time monitoring
      const query = this.clientSocket.io.opts.query;
      if (query.serialNumber && query.accountId) {
        console.log(`🔴 Starting real-time monitoring for device: ${query.serialNumber}`);
        this.clientSocket.emit('start_real_time_device', { serialNumber: query.serialNumber });
      }
      
      if (resolve) resolve(this.clientSocket);
    });

    // Connection error
    this.clientSocket.on('connect_error', (error) => {
      console.error('❌ Socket connection error:', error);
      console.error('🔍 Error details:', {
        message: error.message,
        description: error.description,
        context: error.context,
        type: error.type,
        transport: error.transport
      });
      
      // Specific error handling for common issues
      if (error.message === 'Invalid namespace') {
        console.error('🚨 Invalid namespace error - check URL configuration!');
        console.error('💡 Troubleshooting:');
        console.error('   - Remove /api from REACT_APP_IOT_API_URL');
        console.error('   - Ensure IoT API is running');
        console.error('   - Check if URL is correct');
        console.error(`   - Current URL: ${SOCKET_CONFIG.url}/client`);
      }
      
      this.isConnected = false;
      
      if (this.retryCount < this.maxRetries) {
        this.retryCount++;
        console.log(`🔄 Retrying connection (${this.retryCount}/${this.maxRetries})...`);
        setTimeout(() => {
          this.clientSocket.connect();
        }, 2000 * this.retryCount);
      } else {
        if (reject) reject(error);
      }
    });

    // Disconnection
    this.clientSocket.on('disconnect', (reason) => {
      console.log('🔌 Socket disconnected:', reason);
      this.isConnected = false;
      this.connectedDevices.clear();
      
      // Auto-reconnect for certain reasons
      if (reason === 'io server disconnect') {
        console.log('🔄 Server initiated disconnect, reconnecting...');
        this.clientSocket.connect();
      }
    });

    // Setup global event listeners
    this.setupGlobalEventListeners();
  }

  // Setup global event listeners for device notifications
  setupGlobalEventListeners() {
    if (!this.clientSocket) return;

    // Device connection events
    this.clientSocket.on('device_connect', (data) => {
      console.log('📱 Device connected:', data);
      this.emit('global_device_connect', data);
    });

    this.clientSocket.on('device_disconnect', (data) => {
      console.log('📱 Device disconnected:', data);
      this.emit('global_device_disconnect', data);
      this.connectedDevices.delete(data.serialNumber);
    });

    this.clientSocket.on('device_online', (data) => {
      console.log('🟢 Device online:', data);
      this.emit('global_device_online', data);
    });

    // Emergency alerts
    this.clientSocket.on('emergency_alert', (data) => {
      console.log('🚨 EMERGENCY ALERT:', data);
      this.emit('emergency_alert', data);
    });

    this.clientSocket.on('fire_alert', (data) => {
      console.log('🔥 FIRE ALERT:', data);
      this.emit('fire_alert', data);
    });

    this.clientSocket.on('smoke_alert', (data) => {
      console.log('💨 SMOKE ALERT:', data);
      this.emit('smoke_alert', data);
    });

    // Real-time monitoring confirmations
    this.clientSocket.on('realtime_started', (data) => {
      console.log('✅ Real-time monitoring started:', data);
      this.emit('realtime_started', data);
    });

    this.clientSocket.on('realtime_stopped', (data) => {
      console.log('⏹️ Real-time monitoring stopped:', data);
      this.emit('realtime_stopped', data);
    });
  }

  // Connect to a specific device for real-time monitoring
  // New strategy: Create dedicated device connection with serialNumber + accountId
  async connectToDevice(serialNumber, accountId) {
    if (!serialNumber || !accountId) {
      console.error('❌ Missing serialNumber or accountId');
      return false;
    }

    if (this.connectedDevices.has(serialNumber)) {
      console.log(`📱 Already connected to device ${serialNumber}`);
      return true;
    }

    console.log(`🔗 Creating device-specific connection for ${serialNumber} with account ${accountId}`);

    try {
      // Create new socket connection specifically for this device
      const deviceSocket = io(`${SOCKET_CONFIG.url}/client`, {
        ...SOCKET_CONFIG.options,
        query: {
          serialNumber: serialNumber,
          accountId: accountId,
          clientType: 'web_app'
        }
      });

      // Setup device socket events
      await new Promise((resolve, reject) => {
        deviceSocket.on('connect', () => {
          console.log(`✅ Device socket connected for ${serialNumber}`);
          console.log('📡 Device Socket ID:', deviceSocket.id);
          
          // Start real-time monitoring
          deviceSocket.emit('start_real_time_device', { serialNumber });
          
          // Setup device-specific event listeners
          try {
            this.setupDeviceEventListeners(serialNumber, deviceSocket);
          } catch (error) {
            console.error(`❌ Error setting up device listeners for ${serialNumber}:`, error);
          }
          
          // Mark as connected
          this.connectedDevices.set(serialNumber, {
            connected: true,
            lastUpdate: new Date(),
            socket: deviceSocket
          });
          
          resolve(true);
        });

        deviceSocket.on('connect_error', (error) => {
          console.error(`❌ Device socket connection error for ${serialNumber}:`, error);
          reject(error);
        });

        deviceSocket.on('disconnect', (reason) => {
          console.log(`🔌 Device socket disconnected for ${serialNumber}:`, reason);
          this.connectedDevices.delete(serialNumber);
        });

        // Connect
        deviceSocket.connect();
      });

      return true;
    } catch (error) {
      console.error(`❌ Failed to connect to device ${serialNumber}:`, error);
      return false;
    }
  }

  // Setup device-specific event listeners
  setupDeviceEventListeners(serialNumber, deviceSocket = null) {
    if (!serialNumber) {
      console.error('❌ Cannot setup device event listeners: serialNumber is required');
      return;
    }
    
    const socket = deviceSocket || this.clientSocket;
    if (!socket) {
      console.error('❌ Cannot setup device event listeners: socket is null');
      return;
    }

    // Validate socket has .on method
    if (typeof socket.on !== 'function') {
      console.error('❌ Cannot setup device event listeners: socket.on is not a function');
      return;
    }

    console.log(`🔧 Setting up event listeners for device ${serialNumber}`);

    // Real-time sensor data
    socket.on('sensorData', (data) => {
      console.log(`🌡️ Sensor data for ${serialNumber}:`, data);
      this.emit(`device_sensor_data_${serialNumber}`, data);
      this.emit('device_sensor_data', { serialNumber, ...data });
      this.emit('sensorData', data); // Emit global event too
    });

    // Real-time device value from IoT API
    socket.on('realtime_device_value', (data) => {
      console.log(`📊 Real-time device value for ${serialNumber}:`, data);
      this.emit(`device_sensor_data_${serialNumber}`, data);
      this.emit('device_sensor_data', { serialNumber, ...data });
      this.emit('realtime_device_value', data); // Emit global event too
    });

    // Device status updates
    socket.on('deviceStatus', (data) => {
      console.log(`📊 Device status for ${serialNumber}:`, data);
      this.emit(`device_status_${serialNumber}`, data);
      this.emit('device_status', { serialNumber, ...data });
    });

    // Alarm alerts
    socket.on('alarmAlert', (data) => {
      console.log(`🚨 Alarm alert for ${serialNumber}:`, data);
      this.emit(`device_alarm_${serialNumber}`, data);
      this.emit('device_alarm', { serialNumber, ...data });
    });

    // Gas sensor data
    socket.on('gasData', (data) => {
      console.log(`💨 Gas data for ${serialNumber}:`, data);
      this.emit(`device_gas_data_${serialNumber}`, data);
      this.emit('device_gas_data', { serialNumber, ...data });
    });

    // Temperature sensor data
    socket.on('temperatureData', (data) => {
      console.log(`🌡️ Temperature data for ${serialNumber}:`, data);
      this.emit(`device_temperature_data_${serialNumber}`, data);
      this.emit('device_temperature_data', { serialNumber, ...data });
    });

    // Humidity sensor data
    socket.on('humidityData', (data) => {
      console.log(`💧 Humidity data for ${serialNumber}:`, data);
      this.emit(`device_humidity_data_${serialNumber}`, data);
      this.emit('device_humidity_data', { serialNumber, ...data });
    });

    // Real-time monitoring confirmations
    socket.on('realtime_started', (data) => {
      console.log(`✅ Real-time monitoring started for ${serialNumber}:`, data);
      this.emit(`realtime_started_${serialNumber}`, data);
    });

    socket.on('realtime_stopped', (data) => {
      console.log(`⏹️ Real-time monitoring stopped for ${serialNumber}:`, data);
      this.emit(`realtime_stopped_${serialNumber}`, data);
    });

    // Command responses
    socket.on('command_response', (data) => {
      if (data.serialNumber === serialNumber || !data.serialNumber) {
        console.log(`📥 Command response for ${serialNumber}:`, data);
        this.emit(`device_command_response_${serialNumber}`, data);
        this.emit('device_command_response', { serialNumber, ...data });
      }
    });

    // Door-specific events
    socket.on('door_status', (data) => {
      if (data.serialNumber === serialNumber || !data.serialNumber) {
        console.log(`🚪 Door status for ${serialNumber}:`, data);
        this.emit(`door_status_${serialNumber}`, data);
        this.emit('door_status', { serialNumber, ...data });
      }
    });

    socket.on('door_command_response', (data) => {
      if (data.serialNumber === serialNumber || !data.serialNumber) {
        console.log(`🚪 Door command response for ${serialNumber}:`, data);
        this.emit(`door_command_response_${serialNumber}`, data);
        this.emit('door_command_response', { serialNumber, ...data });
      }
    });

    // ESP8266 specific events
    socket.on('esp8266_status', (data) => {
      if (data.serialNumber === serialNumber || !data.serialNumber) {
        console.log(`📊 ESP8266 status for ${serialNumber}:`, data);
        this.emit(`esp8266_status_${serialNumber}`, data);
        this.emit('esp8266_status', { serialNumber, ...data });
      }
    });

    // LED effects events
    socket.on('led_effect_set', (data) => {
      if (data.serialNumber === serialNumber || !data.serialNumber) {
        console.log(`💡 LED effect set for ${serialNumber}:`, data);
        this.emit(`led_effect_set_${serialNumber}`, data);
        this.emit('led_effect_set', { serialNumber, ...data });
      }
    });

    socket.on('led_state_updated', (data) => {
      if (data.serialNumber === serialNumber || !data.serialNumber) {
        console.log(`💡 LED state updated for ${serialNumber}:`, data);
        this.emit(`led_state_updated_${serialNumber}`, data);
        this.emit('led_state_updated', { serialNumber, ...data });
      }
    });

    // Real-time confirmation events
    socket.on('realtime_started', (data) => {
      if (data.serialNumber === serialNumber) {
        console.log(`🔴 Real-time started for ${serialNumber}`);
        this.emit(`realtime_started_${serialNumber}`, data);
      }
    });

    socket.on('realtime_stopped', (data) => {
      if (data.serialNumber === serialNumber) {
        console.log(`🔵 Real-time stopped for ${serialNumber}`);
        this.emit(`realtime_stopped_${serialNumber}`, data);
      }
    });

    // LED capabilities response
    socket.on('led_capabilities_response', (data) => {
      if (data.serialNumber === serialNumber || !data.serialNumber) {
        console.log(`🎨 LED capabilities for ${serialNumber}:`, data);
        this.emit('led_capabilities', data);
        this.emit(`led_capabilities_${serialNumber}`, data);
      }
    });
  }

  // Send commands to device
  sendCommand(serialNumber, commandData) {
    const deviceConnection = this.connectedDevices.get(serialNumber);
    if (!deviceConnection || !deviceConnection.socket) {
      console.error('❌ Device not connected:', serialNumber);
      return false;
    }

    console.log(`🎮 Sending command to ${serialNumber}:`, commandData);
    deviceConnection.socket.emit('command', {
      serialNumber,
      ...commandData,
      timestamp: new Date().toISOString()
    });

    return true;
  }

  // Door-specific commands
  sendDoorCommand(serialNumber, action, state = {}) {
    const deviceConnection = this.connectedDevices.get(serialNumber);
    if (!deviceConnection || !deviceConnection.socket) {
      console.error('❌ Device not connected:', serialNumber);
      return false;
    }

    const doorCommand = {
      action,
      state,
      timestamp: new Date().toISOString()
    };

    console.log(`🚪 Sending door command to ${serialNumber}:`, doorCommand);
    deviceConnection.socket.emit('door_command', doorCommand);

    return true;
  }

  // LED control commands
  setLEDEffect(serialNumber, effectData) {
    const deviceConnection = this.connectedDevices.get(serialNumber);
    if (!deviceConnection || !deviceConnection.socket) {
      console.error('❌ Device not connected:', serialNumber);
      return false;
    }

    console.log(`🌟 Setting LED effect for ${serialNumber}:`, effectData);
    deviceConnection.socket.emit('setEffect', effectData);

    return true;
  }

  applyLEDPreset(serialNumber, presetData) {
    const deviceConnection = this.connectedDevices.get(serialNumber);
    if (!deviceConnection || !deviceConnection.socket) {
      console.error('❌ Device not connected:', serialNumber);
      return false;
    }

    console.log(`🎨 Applying LED preset for ${serialNumber}:`, presetData);
    deviceConnection.socket.emit('applyPreset', presetData);

    return true;
  }

  updateLEDState(serialNumber, stateData) {
    const deviceConnection = this.connectedDevices.get(serialNumber);
    if (!deviceConnection || !deviceConnection.socket) {
      console.error('❌ Device not connected:', serialNumber);
      return false;
    }

    console.log(`💡 Updating LED state for ${serialNumber}:`, stateData);
    deviceConnection.socket.emit('updateLEDState', stateData);

    return true;
  }

  // Get LED capabilities
  getLEDCapabilities(serialNumber) {
    const deviceConnection = this.connectedDevices.get(serialNumber);
    if (!deviceConnection || !deviceConnection.socket) {
      console.error('❌ Device not connected:', serialNumber);
      return false;
    }

    console.log(`🔍 Getting LED capabilities for ${serialNumber}`);
    deviceConnection.socket.emit('getLEDCapabilities', { serialNumber });

    return true;
  }

  // Disconnect from specific device
  disconnectFromDevice(serialNumber) {
    const deviceConnection = this.connectedDevices.get(serialNumber);
    if (!deviceConnection || !deviceConnection.socket) {
      console.log(`⚠️ Device ${serialNumber} not connected`);
      return false;
    }

    // Stop real-time monitoring
    deviceConnection.socket.emit('stop_real_time_device', { serialNumber });

    // Disconnect the device socket
    deviceConnection.socket.disconnect();

    // Remove device from connected list
    this.connectedDevices.delete(serialNumber);

    console.log(`🔵 Disconnected from device ${serialNumber}`);
    return true;
  }

  // Event emitter functionality
  on(event, callback) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event).push(callback);
    console.log(`📝 Event listener registered for: ${event} (${this.eventListeners.get(event).length} listeners)`);
  }

  off(event, callback) {
    if (this.eventListeners.has(event)) {
      const listeners = this.eventListeners.get(event);
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  emit(event, data) {
    console.log(`📡 Emitting event: ${event} with data:`, data);
    if (this.eventListeners.has(event)) {
      console.log(`📡 Found ${this.eventListeners.get(event).length} listeners for ${event}`);
      this.eventListeners.get(event).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`❌ Error in event listener for ${event}:`, error);
        }
      });
    } else {
      console.log(`📡 No listeners found for event: ${event}`);
    }
  }

  // Cleanup
  disconnect() {
    if (this.clientSocket) {
      this.clientSocket.disconnect();
      this.clientSocket = null;
    }
    this.isConnected = false;
    this.connectedDevices.clear();
    this.eventListeners.clear();
    console.log('🔌 Socket service disconnected');
  }

  // Utility methods
  isDeviceConnected(serialNumber) {
    return this.connectedDevices.has(serialNumber);
  }

  getConnectedDevices() {
    return Array.from(this.connectedDevices.keys());
  }

  // Getter for external access to connection status  
  get connected() {
    return this.isConnected;
  }

  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      connectedDevices: this.getConnectedDevices(),
      socketId: this.clientSocket?.id || null,
      url: SOCKET_CONFIG.url,
      namespace: '/client',
      fullUrl: `${SOCKET_CONFIG.url}/client`
    };
  }

  // Test connection without reconnecting
  testConnection() {
    if (!this.clientSocket) {
      return {
        success: false,
        message: 'Socket not initialized'
      };
    }

    return {
      success: this.isConnected,
      message: this.isConnected ? 'Connected' : 'Disconnected',
      socketId: this.clientSocket.id,
      transport: this.clientSocket.io.engine.transport.name,
      query: this.clientSocket.io.opts.query,
      url: `${SOCKET_CONFIG.url}/client`
    };
  }
}

// Create singleton instance
const socketService = new SocketService();

export default socketService;
