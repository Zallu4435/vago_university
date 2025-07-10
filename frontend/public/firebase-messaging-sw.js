// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

console.log('[SW] Service worker script starting');

// Initialize the Firebase app in the service worker by loading from env
const firebaseConfig = {
  apiKey: "AIzaSyBZVN-SZjvK_qXHD4GXD8o4i0uGc3q-DFY",
  authDomain: "university-management-pla-d4e23.firebaseapp.com",
  projectId: "university-management-pla-d4e23",
  storageBucket: "university-management-pla-d4e23.appspot.com",
  messagingSenderId: "963590986597",
  appId: "1:963590986597:web:c0e1e5d9c2c2f0c6c6f6f6"
};

try {
  console.log('[SW] Initializing Firebase with config:', {
    projectId: firebaseConfig.projectId,
    messagingSenderId: firebaseConfig.messagingSenderId
  });
  firebase.initializeApp(firebaseConfig);
  console.log('[SW] Firebase initialized successfully');
} catch (error) {
  console.error('[SW] Failed to initialize Firebase:', error);
}

// Retrieve an instance of  Firebase Messaging
try {
  console.log('[SW] Creating Firebase Messaging instance');
  const messaging = firebase.messaging();
  console.log('[SW] Firebase Messaging instance created successfully');

  // Handle background messages
  messaging.onBackgroundMessage(async (payload) => {
    console.log('[Service Worker] Received background message:', payload);

    // Check if any window clients are active (app is open)
    const windowClients = await clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    });

    // Only show notification if no window clients are active (app is in background)
    if (windowClients.length === 0 && payload.notification) {
      console.log('[Service Worker] App is in background, showing notification');
      const notificationOptions = {
        body: payload.notification.body,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: payload.data?.notificationId, // Prevent duplicate notifications
        data: payload.data,
        requireInteraction: true, // Keep notification until user interacts with it
        actions: [
          {
            action: 'view',
            title: 'View'
          },
          {
            action: 'dismiss',
            title: 'Dismiss'
          }
        ]
      };

      await self.registration.showNotification(
        payload.notification.title,
        notificationOptions
      );
    } else {
      console.log('[Service Worker] App is in foreground, skipping notification');
    }
  });
} catch (error) {
  console.error('[SW] Error setting up Firebase Messaging:', error);
}

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] Notification clicked:', event);

  const notification = event.notification;
  const action = event.action;
  const notificationData = notification.data;

  notification.close();

  if (action === 'view' && notificationData?.notificationId) {
    // Open the app to the notifications page
    const urlToOpen = new URL('/notifications', self.location.origin).href;
    
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true })
        .then((windowClients) => {
          // If a window client is available, focus it and navigate
          for (const client of windowClients) {
            if (client.url === urlToOpen) {
              return client.focus();
            }
          }
          // If no window client is available, open a new window
          return clients.openWindow(urlToOpen);
        })
    );
  }
});

// Handle service worker installation
self.addEventListener('install', (event) => {
  console.log('[SW] Service Worker installed', {
    timestamp: new Date().toISOString(),
    event: event
  });
  self.skipWaiting();
});

// Handle service worker activation
self.addEventListener('activate', (event) => {
  console.log('[SW] Service Worker activated', {
    timestamp: new Date().toISOString(),
    event: event
  });
  event.waitUntil(clients.claim());
});