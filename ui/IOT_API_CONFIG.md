# IoT API Configuration Guide

## Setup Instructions

### 1. Create .env.local file
Create a file named `.env.local` in the `ui/` directory with the following content:

**For Local Development:**
```bash
# IoT API Configuration
REACT_APP_IOT_API_URL=http://localhost:7777
REACT_APP_SMART_NET_IOT_API_URL=http://localhost:7777
NODE_ENV=development
```

**For Production with Railway:**
```bash
# IoT API Configuration (remove /api suffix if present)
REACT_APP_IOT_API_URL=https://iothomeconnectapiv2-production.up.railway.app
REACT_APP_SMART_NET_IOT_API_URL=https://iothomeconnectapiv2-production.up.railway.app
NODE_ENV=production
```

**Important Notes:**
- Do NOT include `/api/` in the URL as socket namespaces are `/client` and `/device`
- The system will automatically remove `/api` suffix if present
- Socket connection will be to `{URL}/client` namespace

### 2. Start IoT API Server
Make sure the IoT API server is running:

```bash
cd IoT_HomeConnect_API_v2
npm start
# or
yarn start
```

The IoT API should be running on port 7777.

### 3. Start Frontend UI
```bash
cd ui
npm start
# or
yarn start
```

### 4. Test Connection
1. **Login to the system** (REQUIRED - socket will not connect without authentication)
2. Navigate to a device detail page (especially GAS MONITORING devices)
3. Check the Socket Debug Panel at the bottom for connection status
4. Look for these logs:
   - ✅ Socket connected to /client namespace
   - ✅ Real-time monitoring started
   - 📊 Real-time sensor data received

**Important Note**: Socket connection and real-time features are only available after user authentication. If you see "Vui lòng đăng nhập để sử dụng tính năng real-time" message, please login first.

### 5. Troubleshooting

#### Connection Issues
- **Check if IoT API is running**: Visit `http://localhost:7777/health` or `https://your-domain/health`
- **Check environment variables**: Use Socket Debug Panel's "Check Environment" button
- **Check user authentication**: Make sure `user.account_id` exists in AuthContext
- **Invalid namespace error**: Usually caused by wrong URL with `/api` suffix

#### Common Socket Errors
1. **"Invalid namespace"**: 
   - Remove `/api` from REACT_APP_IOT_API_URL
   - Ensure URL is correct without double slashes
   - Check if IoT API is running

2. **Connection timeout**:
   - Verify IoT API is accessible
   - Check firewall settings
   - Ensure correct port (7777 for local, 443/80 for production)

3. **Authentication errors**:
   - Check `user.account_id` exists and is valid
   - Verify user has access to the device
   - Check database permissions

4. **Continuous socket calls when not logged in**:
   - Socket service now prevents calls when `accountId` is undefined
   - Login first before accessing device pages
   - Check console for "🚫 No accountId provided" messages

#### Device Connection Issues
- **Check device serial number**: Must match exactly with IoT API database
- **Check device access**: User must have permission to access the device
- **Check socket query params**: Should include both `serialNumber` and `accountId`
- **Device not found**: Ensure device exists in database and is not deleted

#### Real-time Data Issues
- **Check IoT device connection**: Device must be connected to IoT API `/device` namespace
- **Check socket events**: Look for `sensorData`, `deviceStatus`, `esp8266_status` events
- **Check data format**: IoT API sends data in `{ data: { val: { temperature, gas, humidity } } }` format
- **Missing data**: Ensure device is sending data to IoT API

#### Debug Steps
1. **Check Socket Debug Panel logs**:
   - Look for "✅ Socket connected to /client namespace"
   - Check if real-time monitoring started
   - Verify device connection status

2. **Check browser console**:
   - Look for socket connection errors
   - Check if events are being received
   - Verify data format

3. **Test API endpoints**:
   - Test `/health` endpoint
   - Test device API endpoints
   - Check if user has device access

4. **Verify IoT API logs**:
   - Check if device is connected
   - Look for client connection logs
   - Verify real-time monitoring started

### 6. Gas Monitoring Device Configuration

For GAS MONITORING devices, you can configure:
- **Gas Threshold**: 100-2000 PPM (parts per million)
- **Sensitivity**: 10-100%
- **Humidity Threshold**: 60-95%
- **Temperature Threshold**: 25-60°C
- **Alarm Sound**: Enable/Disable

Use the control sliders in the GasMonitoringDetail component and click "Save Settings" to send configuration to the device.

### 7. Real-time Alerts

The system will show alerts for:
- **Gas Detection**: Warning (≥300 PPM), Danger (≥600 PPM), Critical (≥1000 PPM)
- **Temperature**: Warning (≥35°C), Danger (≥45°C), Critical (≥55°C)
- **Fire Detection**: Immediate critical alert
- **Smoke Detection**: Automatic alert based on sensor values

### 8. IoT API Socket Events

The frontend listens for these IoT API events:
- `sensorData`: Real-time sensor readings
- `deviceStatus`: Device status updates
- `esp8266_status`: ESP8266 specific status
- `alarmAlert`: Alarm notifications
- `emergency_alert`: Emergency alerts
- `fire_alert`: Fire detection alerts
- `smoke_alert`: Smoke detection alerts

### 9. Device Commands

The frontend can send these commands to devices:
- `update_config`: Update device configuration
- `command`: Generic device commands
- `reset_alarm`: Reset alarm state
- `test_alarm`: Test alarm functionality

### 10. Production Configuration

For production deployment:
1. Update `.env.local` with your production IoT API URL
2. Make sure IoT API server is accessible from frontend
3. Configure proper CORS settings in IoT API
4. Use HTTPS for secure connections

Example production config:
```bash
REACT_APP_IOT_API_URL=https://your-iot-api.com
REACT_APP_SMART_NET_IOT_API_URL=https://your-iot-api.com
NODE_ENV=production
``` 