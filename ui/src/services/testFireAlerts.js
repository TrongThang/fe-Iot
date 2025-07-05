// Test Fire Alerts Service - Simulate IoT Emergency Events
// Dựa trên IoT HomeConnect API socket events structure

import { io } from 'socket.io-client';

class TestFireAlertsService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
  }

  // Connect to IoT API để simulate device events
  connectAsTestDevice(apiUrl = 'http://localhost:3000', serialNumber = 'TEST_ESP8266_001') {
    return new Promise((resolve, reject) => {
      try {
        // Connect as IoT device to /device namespace (như trong device.socket.ts)
        this.socket = io(`${apiUrl}/device`, {
          query: {
            serialNumber: serialNumber,
            deviceType: 'ESP8266',
            clientType: 'iot_device'
          },
          transports: ['websocket']
        });

        this.socket.on('connect', () => {
          console.log(`✅ Test device ${serialNumber} connected to /device namespace`);
          this.isConnected = true;
          resolve({ success: true, serialNumber });
        });

        this.socket.on('connect_error', (error) => {
          console.error('❌ Test device connection failed:', error);
          reject(error);
        });

        this.socket.on('disconnect', () => {
          console.log('🔌 Test device disconnected');
          this.isConnected = false;
        });

      } catch (error) {
        reject(error);
      }
    });
  }

  // Disconnect test device
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.isConnected = false;
      console.log('🔌 Test device disconnected manually');
    }
  }

  // Simulate alarm_trigger event (Fire Alarm - High Priority)
  triggerFireAlarm(data = {}) {
    if (!this.isConnected || !this.socket) {
      throw new Error('Test device not connected. Call connectAsTestDevice() first.');
    }

    const fireAlarmData = {
      serialNumber: this.socket.io.opts.query.serialNumber,
      temperature: data.temperature || 85.5,
      smoke_level: data.smoke_level || 75,
      gas_level: data.gas_level || 0,
      severity: data.severity || 'critical',
      alarm_type: data.alarm_type || 'fire',
      location: data.location || 'Living Room',
      sensor_id: data.sensor_id || 'FIRE_SENSOR_01',
      timestamp: new Date().toISOString(),
      ...data
    };

    console.log('🚨 Simulating FIRE ALARM TRIGGER:', fireAlarmData);
    
    // Emit alarm_trigger event (theo device.socket.ts line 186)
    this.socket.emit('alarm_trigger', fireAlarmData);
    
    return fireAlarmData;
  }

  // Simulate fire_detected event
  triggerFireDetected(data = {}) {
    if (!this.isConnected || !this.socket) {
      throw new Error('Test device not connected. Call connectAsTestDevice() first.');
    }

    const fireData = {
      serialNumber: this.socket.io.opts.query.serialNumber,
      temperature: data.temperature || 90.2,
      flame_detected: true,
      sensor_value: data.sensor_value || 950,
      location: data.location || 'Kitchen',
      confidence: data.confidence || 95,
      timestamp: new Date().toISOString(),
      ...data
    };

    console.log('🔥 Simulating FIRE DETECTED:', fireData);
    
    // Emit fire_detected event (theo device.socket.ts line 211)
    this.socket.emit('fire_detected', fireData);
    
    return fireData;
  }

  // Simulate smoke_detected event
  triggerSmokeDetected(data = {}) {
    if (!this.isConnected || !this.socket) {
      throw new Error('Test device not connected. Call connectAsTestDevice() first.');
    }

    const smokeData = {
      serialNumber: this.socket.io.opts.query.serialNumber,
      smoke_level: data.smoke_level || 85,
      air_quality: data.air_quality || 'poor',
      visibility: data.visibility || 'low', 
      location: data.location || 'Bedroom',
      sensor_type: data.sensor_type || 'optical',
      timestamp: new Date().toISOString(),
      ...data
    };

    console.log('💨 Simulating SMOKE DETECTED:', smokeData);
    
    // Emit smoke_detected event (theo device.socket.ts line 220)
    this.socket.emit('smoke_detected', smokeData);
    
    return smokeData;
  }

  // Simulate gas leak detection
  triggerGasLeak(data = {}) {
    if (!this.isConnected || !this.socket) {
      throw new Error('Test device not connected. Call connectAsTestDevice() first.');
    }

    const gasData = {
      serialNumber: this.socket.io.opts.query.serialNumber,
      gas_level: data.gas_level || 45.7, // PPM
      gas_type: data.gas_type || 'LPG',
      concentration: data.concentration || 'high',
      location: data.location || 'Kitchen',
      sensor_id: data.sensor_id || 'GAS_SENSOR_01',
      alarm_threshold: data.alarm_threshold || 30,
      timestamp: new Date().toISOString(),
      ...data
    };

    console.log('⚠️ Simulating GAS LEAK:', gasData);
    
    // Emit alarm_trigger với gas type
    this.socket.emit('alarm_trigger', {
      ...gasData,
      alarm_type: 'gas',
      severity: 'high'
    });
    
    return gasData;
  }

  // Simulate alarmAlert event (generic alarm)
  triggerAlarmAlert(data = {}) {
    if (!this.isConnected || !this.socket) {
      throw new Error('Test device not connected. Call connectAsTestDevice() first.');
    }

    const alarmData = {
      serialNumber: this.socket.io.opts.query.serialNumber,
      alarmActive: true,
      temperature: data.temperature || 75.0,
      gasValue: data.gasValue || data.smoke_level || 0,
      severity: data.severity || 'medium',
      alarm_type: data.alarm_type || 'general',
      location: data.location || 'Unknown',
      timestamp: new Date().toISOString(),
      ...data
    };

    console.log('🚨 Simulating ALARM ALERT:', alarmData);
    
    // Emit alarmAlert event (theo device.socket.ts line 245)
    this.socket.emit('alarmAlert', alarmData);
    
    return alarmData;
  }

  // Simulate sensor data that might trigger alerts
  sendSensorData(data = {}) {
    if (!this.isConnected || !this.socket) {
      throw new Error('Test device not connected. Call connectAsTestDevice() first.');
    }

    const sensorData = {
      serialNumber: this.socket.io.opts.query.serialNumber,
      temperature: data.temperature || 22.5,
      humidity: data.humidity || 65,
      smoke_level: data.smoke_level || 0,
      gas_level: data.gas_level || 0,
      air_quality: data.air_quality || 'good',
      timestamp: new Date().toISOString(),
      ...data
    };

    console.log('🌡️ Simulating SENSOR DATA:', sensorData);
    
    // Emit sensorData event
    this.socket.emit('sensorData', sensorData);
    
    return sensorData;
  }

  // Test multiple alerts sequence
  async testEmergencySequence(options = {}) {
    const {
      interval = 3000, // 3 seconds between alerts
      includeGas = true,
      includeSmoke = true,
      includeFire = true
    } = options;

    console.log('🚨 Starting emergency test sequence...');
    const results = [];

    if (includeSmoke) {
      const smokeResult = this.triggerSmokeDetected({
        smoke_level: 60,
        location: 'Living Room'
      });
      results.push({ type: 'smoke', data: smokeResult });
      await this.delay(interval);
    }

    if (includeGas) {
      const gasResult = this.triggerGasLeak({
        gas_level: 35,
        gas_type: 'Natural Gas',
        location: 'Kitchen'
      });
      results.push({ type: 'gas', data: gasResult });
      await this.delay(interval);
    }

    if (includeFire) {
      const fireResult = this.triggerFireAlarm({
        temperature: 95,
        severity: 'critical',
        location: 'Bedroom'
      });
      results.push({ type: 'fire', data: fireResult });
    }

    console.log('✅ Emergency test sequence completed');
    return results;
  }

  // Utility function for delays
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Get connection status
  getConnectionStatus() {
    return {
      connected: this.isConnected,
      socketId: this.socket?.id || null,
      serialNumber: this.socket?.io?.opts?.query?.serialNumber || null
    };
  }

  // Listen for server responses (optional)
  onServerResponse(eventName, callback) {
    if (this.socket) {
      this.socket.on(eventName, callback);
    }
  }

  // Remove server response listener
  offServerResponse(eventName) {
    if (this.socket) {
      this.socket.off(eventName);
    }
  }
}

// Predefined test scenarios
export const TEST_SCENARIOS = {
  KITCHEN_FIRE: {
    type: 'fire_alarm',
    data: {
      temperature: 120,
      smoke_level: 90,
      location: 'Kitchen',
      severity: 'critical',
      alarm_type: 'fire'
    }
  },
  BEDROOM_SMOKE: {
    type: 'smoke_detected', 
    data: {
      smoke_level: 75,
      location: 'Bedroom',
      air_quality: 'poor',
      visibility: 'low'
    }
  },
  GAS_LEAK_LAUNDRY: {
    type: 'gas_leak',
    data: {
      gas_level: 55,
      gas_type: 'LPG',
      location: 'Laundry Room',
      concentration: 'dangerous'
    }
  },
  GENERAL_EMERGENCY: {
    type: 'alarm_alert',
    data: {
      severity: 'high',
      alarm_type: 'emergency',
      location: 'Basement',
      alarmActive: true
    }
  }
};

// Export singleton instance
const testFireAlertsService = new TestFireAlertsService();
export default testFireAlertsService; 