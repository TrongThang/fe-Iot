/* eslint-disable */
// Firebase Cloud Messaging Service Worker
// Handles FCM notifications when the app is in background

// Import Firebase scripts for service worker - Sử dụng Firebase 11.x compatible với SmartNet Solution
importScripts('https://www.gstatic.com/firebasejs/11.10.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/11.10.0/firebase-messaging-compat.js');

// Firebase configuration - Sử dụng cùng config với SmartNet Solution
const firebaseConfig = {
  apiKey: "AIzaSyDDG_6dS0sQf-ST3ZjzLCOO7JnhbA93Sek",
  authDomain: "homeconnect-teamiot.firebaseapp.com",
  projectId: "homeconnect-teamiot",
  storageBucket: "homeconnect-teamiot.firebasestorage.app",
  messagingSenderId: "697438598174",
  appId: "1:697438598174:web:0fb3109284f665c5532a0f",
  measurementId: "G-PVR53BGMC1"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firebase Messaging
const messaging = firebase.messaging();

console.log('🔧 Firebase Messaging Service Worker initialized');

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('📱 Background message received:', payload);

  const { notification, data } = payload;
  
  // Extract emergency alert data
  const isEmergency = data?.severity === 'critical' || 
                      data?.alertType === '1' || 
                      data?.alertType === '2';
  
  const notificationTitle = isEmergency 
    ? '🚨 CẢNH BÁO KHẨN CẤP!'
    : notification?.title || '🚨 Cảnh báo từ thiết bị';
    
  const notificationOptions = {
    body: notification?.body || 'Thiết bị IoT phát hiện tình huống bất thường',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    tag: isEmergency ? 'emergency-alert' : 'device-alert',
    requireInteraction: isEmergency, // Emergency alerts stay until user interacts
    silent: false,
    vibrate: isEmergency ? [200, 100, 200, 100, 200, 100, 200] : [200, 100, 200],
    data: {
      ...data,
      url: data?.deviceSerial ? `/devices/${data.deviceSerial}` : '/',
      timestamp: new Date().toISOString(),
      isEmergency: isEmergency
    },
    actions: [
      {
        action: 'view',
        title: '👁️ Xem chi tiết',
        icon: '/favicon.ico'
      },
      {
        action: 'dismiss',
        title: '✖️ Đóng',
        icon: '/favicon.ico'
      }
    ]
  };

  // Add emergency-specific options
  if (isEmergency) {
    notificationOptions.actions.unshift({
      action: 'emergency_call',
      title: '📞 Gọi cứu hỏa (114)',
      icon: '/favicon.ico'
    });
  }

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click events
self.addEventListener('notificationclick', (event) => {
  console.log('🖱️ Notification clicked:', event);
  
  const { action, notification } = event;
  const data = notification.data;
  
  event.notification.close();

  switch (action) {
    case 'emergency_call':
      // Open emergency call
      event.waitUntil(
        clients.openWindow('tel:114')
      );
      break;
      
    case 'view':
      // Open app to device page
      event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true })
          .then((clientList) => {
            // Check if app is already open
            for (const client of clientList) {
              if (client.url.includes(location.origin)) {
                client.focus();
                // Send message to open specific device
                client.postMessage({
                  type: 'NOTIFICATION_CLICK',
                  data: data
                });
                return;
              }
            }
            
            // If app is not open, open it
            return clients.openWindow(data?.url || '/');
          })
      );
      break;
      
    case 'dismiss':
      // Just close notification
      break;
      
    default:
      // Default action - open app
      event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true })
          .then((clientList) => {
            for (const client of clientList) {
              if (client.url.includes(location.origin)) {
                client.focus();
                client.postMessage({
                  type: 'NOTIFICATION_CLICK',
                  data: data
                });
                return;
              }
            }
            return clients.openWindow('/');
          })
      );
      break;
  }
});

// Handle notification close events
self.addEventListener('notificationclose', (event) => {
  console.log('🔕 Notification closed:', event);
  
  const data = event.notification.data;
  
  // Log emergency alert dismissal for analytics
  if (data?.isEmergency) {
    console.log('🚨 Emergency notification dismissed:', data);
  }
});

// Handle push events (optional - for custom handling)
self.addEventListener('push', (event) => {
  console.log('📬 Push event received:', event);
  
  if (event.data) {
    const payload = event.data.json();
    console.log('📬 Push payload:', payload);
    
    // Custom push handling if needed
    // Firebase Messaging will handle this automatically via onBackgroundMessage
  }
});

console.log('✅ Firebase Messaging Service Worker registered successfully'); 