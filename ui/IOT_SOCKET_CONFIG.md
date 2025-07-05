# IoT Socket Connection Configuration Guide

## 🔧 Environment Setup

Create a `.env.local` file in the `ui/` directory with the following configuration:

```bash
# IoT API Configuration
# Use one of these URLs based on your environment:

# For local development (when running IoT API locally on port 7777)
REACT_APP_IOT_API_URL=http://localhost:7777

# Alternative environment variable name (if the above doesn't work)
# REACT_APP_SMART_NET_IOT_API_URL=http://localhost:7777
```

## ⚠️ Important Notes

1. **Do NOT include `/api` at the end of the URL**
   - ❌ Wrong: `http://localhost:7777/api`
   - ✅ Correct: `http://localhost:7777`

2. **IoT API uses direct namespaces `/client` and `/device`**
   - The socket service automatically appends `/client` to the URL
   - Final connection URL: `http://localhost:7777/client`

3. **Socket connection requires both serialNumber AND accountId**
   - Must be logged in to get account ID
   - Device serial number must be provided

## 🔌 Connection Flow

1. **Login** → Get `user.account_id` or `user.id`
2. **Navigate to Device Detail** → Get `deviceSerial`
3. **Auto-connect** → `socketService.connectToDevice(serialNumber, accountId)`
4. **Real-time Data** → Receive sensor data via socket events

## 🚨 Troubleshooting

### "Invalid namespace" Error
- Remove `/api` from `REACT_APP_IOT_API_URL`
- Ensure IoT API is running on the correct port

### "Device not connected" Error
- Check if you're logged in
- Verify device serial number is correct
- Ensure IoT API is running and accessible

### Connection Status Check
- Use Socket Debug Panel at bottom of device detail pages
- Check browser console for detailed connection logs
- Verify environment variables are loaded correctly

## 📋 Socket Events

The UI listens for these IoT API events:

- `sensorData` - Real-time sensor readings
- `deviceStatus` - Device status updates
- `alarmAlert` - Alarm notifications
- `emergency_alert` - Emergency alerts
- `fire_alert` - Fire alerts
- `smoke_alert` - Smoke alerts
- `realtime_started` - Monitoring started confirmation
- `realtime_stopped` - Monitoring stopped confirmation

## 🔧 Development Testing

1. Start IoT API server:
   ```bash
   cd IoT_HomeConnect_API_v2
   npm start
   ```

2. Start UI:
   ```bash
   cd ui
   npm start
   ```

3. Login and navigate to gas monitoring device
4. Check Socket Debug Panel for connection status
5. Monitor console logs for real-time data

## 📱 Production Deployment

1. Set environment variable:
   ```bash
   REACT_APP_IOT_API_URL=https://your-iot-api.com
   ```

2. Build and deploy:
   ```bash
   npm run build
   ```

3. Ensure IoT API is deployed and accessible
4. Test connection with production credentials 