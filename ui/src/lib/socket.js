import { io } from "socket.io-client";

// Socket configuration for IoT API
const SOCKET_CONFIG = {
  // Change this to match your IoT API URL
  url: process.env.REACT_APP_API_URL || "http://localhost:3000",
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
    if (this.clientSocket && this.isConnected) {
      console.log("🔌 Socket already connected");
      return Promise.resolve(this.clientSocket);
    }

    return new Promise((resolve, reject) => {
      try {
        // Connect to /client namespace for web applications
        this.clientSocket = io(`${SOCKET_CONFIG.url}/client`, {
          ...SOCKET_CONFIG.options,
          query: {
            accountId: accountId,
            clientType: 'web_app'
          }
        });

        // Connection successful
        this.clientSocket.on('connect', () => {
          console.log('✅ Socket connected to /client namespace');
          console.log('📡 Socket ID:', this.clientSocket.id);
          this.isConnected = true;
          this.retryCount = 0;
          resolve(this.clientSocket);
        });

        // Connection error
        this.clientSocket.on('connect_error', (error) => {
          console.error('❌ Socket connection error:', error);
          this.isConnected = false;
          
          if (this.retryCount < this.maxRetries) {
            this.retryCount++;
            console.log(`🔄 Retrying connection (${this.retryCount}/${this.maxRetries})...`);
            setTimeout(() => {
              this.clientSocket.connect();
            }, 2000 * this.retryCount);
          } else {
            reject(error);
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

        // Global device events
        this.setupGlobalEventListeners();

        // Actually connect
        this.clientSocket.connect();

      } catch (error) {
        console.error('❌ Socket initialization error:', error);
        reject(error);
      }
    });
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
  }

  // Connect to a specific device for real-time monitoring
  connectToDevice(serialNumber, accountId) {
    if (!this.clientSocket || !this.isConnected) {
      console.error('❌ Socket not connected. Call connect() first.');
      return false;
    }

    if (this.connectedDevices.has(serialNumber)) {
      console.log(`📱 Already connected to device ${serialNumber}`);
      return true;
    }

    // Update query parameters for device-specific connection
    this.clientSocket.io.opts.query = {
      ...this.clientSocket.io.opts.query,
      serialNumber: serialNumber,
      accountId: accountId
    };

    // Join device-specific room
    this.clientSocket.emit('join_device_room', { serialNumber, accountId });

    // Start real-time monitoring
    this.clientSocket.emit('start_real_time_device', { serialNumber });

    // Setup device-specific event listeners
    this.setupDeviceEventListeners(serialNumber);

    this.connectedDevices.set(serialNumber, {
      connected: true,
      lastUpdate: new Date()
    });

    console.log(`✅ Connected to device ${serialNumber} for real-time monitoring`);
    return true;
  }

  // Setup device-specific event listeners
  setupDeviceEventListeners(serialNumber) {
    if (!this.clientSocket) return;

    // Real-time sensor data
    this.clientSocket.on('sensorData', (data) => {
      if (data.serialNumber === serialNumber || !data.serialNumber) {
        console.log(`🌡️ Sensor data for ${serialNumber}:`, data);
        this.emit(`device_sensor_data_${serialNumber}`, data);
        this.emit('device_sensor_data', { serialNumber, ...data });
      }
    });

    // Device status updates
    this.clientSocket.on('deviceStatus', (data) => {
      if (data.serialNumber === serialNumber || !data.serialNumber) {
        console.log(`📊 Device status for ${serialNumber}:`, data);
        this.emit(`device_status_${serialNumber}`, data);
        this.emit('device_status', { serialNumber, ...data });
      }
    });

    // Alarm alerts
    this.clientSocket.on('alarmAlert', (data) => {
      if (data.serialNumber === serialNumber || !data.serialNumber) {
        console.log(`🚨 Alarm alert for ${serialNumber}:`, data);
        this.emit(`device_alarm_${serialNumber}`, data);
        this.emit('device_alarm', { serialNumber, ...data });
      }
    });

    // Command responses
    this.clientSocket.on('command_response', (data) => {
      if (data.serialNumber === serialNumber || !data.serialNumber) {
        console.log(`📥 Command response for ${serialNumber}:`, data);
        this.emit(`device_command_response_${serialNumber}`, data);
        this.emit('device_command_response', { serialNumber, ...data });
      }
    });

    // Door-specific events
    this.clientSocket.on('door_status', (data) => {
      if (data.serialNumber === serialNumber || !data.serialNumber) {
        console.log(`🚪 Door status for ${serialNumber}:`, data);
        this.emit(`door_status_${serialNumber}`, data);
        this.emit('door_status', { serialNumber, ...data });
      }
    });

    this.clientSocket.on('door_command_response', (data) => {
      if (data.serialNumber === serialNumber || !data.serialNumber) {
        console.log(`🚪 Door command response for ${serialNumber}:`, data);
        this.emit(`door_command_response_${serialNumber}`, data);
        this.emit('door_command_response', { serialNumber, ...data });
      }
    });

    // ESP8266 specific events
    this.clientSocket.on('esp8266_status', (data) => {
      if (data.serialNumber === serialNumber || !data.serialNumber) {
        console.log(`📊 ESP8266 status for ${serialNumber}:`, data);
        this.emit(`esp8266_status_${serialNumber}`, data);
        this.emit('esp8266_status', { serialNumber, ...data });
      }
    });

    // LED effects events
    this.clientSocket.on('led_effect_set', (data) => {
      if (data.serialNumber === serialNumber || !data.serialNumber) {
        console.log(`💡 LED effect set for ${serialNumber}:`, data);
        this.emit(`led_effect_set_${serialNumber}`, data);
        this.emit('led_effect_set', { serialNumber, ...data });
      }
    });

    this.clientSocket.on('led_state_updated', (data) => {
      if (data.serialNumber === serialNumber || !data.serialNumber) {
        console.log(`💡 LED state updated for ${serialNumber}:`, data);
        this.emit(`led_state_updated_${serialNumber}`, data);
        this.emit('led_state_updated', { serialNumber, ...data });
      }
    });

    // Real-time confirmation events
    this.clientSocket.on('realtime_started', (data) => {
      if (data.serialNumber === serialNumber) {
        console.log(`🔴 Real-time started for ${serialNumber}`);
        this.emit(`realtime_started_${serialNumber}`, data);
      }
    });

    this.clientSocket.on('realtime_stopped', (data) => {
      if (data.serialNumber === serialNumber) {
        console.log(`🔵 Real-time stopped for ${serialNumber}`);
        this.emit(`realtime_stopped_${serialNumber}`, data);
      }
    });

    // LED capabilities response
    this.clientSocket.on('led_capabilities_response', (data) => {
      if (data.serialNumber === serialNumber || !data.serialNumber) {
        console.log(`🎨 LED capabilities for ${serialNumber}:`, data);
        this.emit('led_capabilities', data);
        this.emit(`led_capabilities_${serialNumber}`, data);
      }
    });
  }

  // Send commands to device
  sendCommand(serialNumber, commandData) {
    if (!this.clientSocket || !this.isConnected) {
      console.error('❌ Socket not connected');
      return false;
    }

    console.log(`🎮 Sending command to ${serialNumber}:`, commandData);
    this.clientSocket.emit('command', {
      serialNumber,
      ...commandData,
      timestamp: new Date().toISOString()
    });

    return true;
  }

  // Door-specific commands
  sendDoorCommand(serialNumber, action, state = {}) {
    if (!this.clientSocket || !this.isConnected) {
      console.error('❌ Socket not connected');
      return false;
    }

    const doorCommand = {
      action,
      state,
      timestamp: new Date().toISOString()
    };

    console.log(`🚪 Sending door command to ${serialNumber}:`, doorCommand);
    this.clientSocket.emit('door_command', doorCommand);

    return true;
  }

  // LED control commands
  setLEDEffect(serialNumber, effectData) {
    if (!this.clientSocket || !this.isConnected) {
      console.error('❌ Socket not connected');
      return false;
    }

    console.log(`🌟 Setting LED effect for ${serialNumber}:`, effectData);
    this.clientSocket.emit('setEffect', effectData);

    return true;
  }

  applyLEDPreset(serialNumber, presetData) {
    if (!this.clientSocket || !this.isConnected) {
      console.error('❌ Socket not connected');
      return false;
    }

    console.log(`🎨 Applying LED preset for ${serialNumber}:`, presetData);
    this.clientSocket.emit('applyPreset', presetData);

    return true;
  }

  updateLEDState(serialNumber, stateData) {
    if (!this.clientSocket || !this.isConnected) {
      console.error('❌ Socket not connected');
      return false;
    }

    console.log(`💡 Updating LED state for ${serialNumber}:`, stateData);
    this.clientSocket.emit('updateLEDState', stateData);

    return true;
  }

  // Get LED capabilities
  getLEDCapabilities(serialNumber) {
    if (!this.clientSocket || !this.isConnected) {
      console.error('❌ Socket not connected');
      return false;
    }

    console.log(`🔍 Getting LED capabilities for ${serialNumber}`);
    this.clientSocket.emit('getLEDCapabilities', { serialNumber });

    return true;
  }

  // Disconnect from specific device
  disconnectFromDevice(serialNumber) {
    if (!this.clientSocket || !this.isConnected) {
      return false;
    }

    // Stop real-time monitoring
    this.clientSocket.emit('stop_real_time_device', { serialNumber });

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
    if (this.eventListeners.has(event)) {
      this.eventListeners.get(event).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`❌ Error in event listener for ${event}:`, error);
        }
      });
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

  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      connectedDevices: this.getConnectedDevices(),
      socketId: this.clientSocket?.id || null
    };
  }
}

// Create singleton instance
const socketService = new SocketService();

export default socketService;
