// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker
firebase.initializeApp({
  apiKey: "AIzaSyBjBmm32nCdjBodbUW_qvysHNyrfvaDKpU",
  authDomain: "vago-university.firebaseapp.com",
  projectId: "vago-university",
  storageBucket: "vago-university.firebasestorage.app",
  messagingSenderId: "963590986597",
  appId: "1:963590986597:web:4906c24584898696c39f8c",
  measurementId: "G-0M835WHH24"
});

// Retrieve an instance of Firebase Messaging
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message:', payload);
  
  try {
    // Check if this is a ping message
    if (payload.data && payload.data.eventType === 'ping') {
      console.log('[firebase-messaging-sw.js] Received ping message, not showing notification');
      return;
    }

    // Ensure we have notification data
    if (!payload.notification) {
      console.error('[firebase-messaging-sw.js] No notification data in payload');
      return;
    }

    const notificationTitle = payload.notification.title || 'New Notification';
    const notificationOptions = {
      body: payload.notification.body || 'You have a new notification',
      icon: '/notification-icon.png',
      badge: '/notification-badge.png',
      vibrate: [200, 100, 200],
      data: payload.data || {},
      requireInteraction: true, // Keep notification visible until user interacts
      actions: [
        {
          action: 'open',
          title: 'Open'
        },
        {
          action: 'close',
          title: 'Close'
        }
      ]
    };

    console.log('[firebase-messaging-sw.js] Showing notification:', {
      title: notificationTitle,
      options: notificationOptions
    });

    return self.registration.showNotification(notificationTitle, notificationOptions)
      .then(() => {
        console.log('[firebase-messaging-sw.js] Notification displayed successfully');
      })
      .catch((error) => {
        console.error('[firebase-messaging-sw.js] Error displaying notification:', error);
        // Try to show a basic notification as fallback
        return self.registration.showNotification('New Notification', {
          body: 'You have a new notification',
          requireInteraction: true
        });
      });
  } catch (error) {
    console.error('[firebase-messaging-sw.js] Error in background message handler:', error);
  }
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  console.log('[firebase-messaging-sw.js] Notification click received:', event);

  event.notification.close();

  if (event.action === 'open') {
    // Open the app or specific page
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then((clientList) => {
        // If a window is already open, focus it
        for (const client of clientList) {
          if (client.url === '/' && 'focus' in client) {
            return client.focus();
          }
        }
        // Otherwise, open a new window
        if (clients.openWindow) {
          return clients.openWindow('/');
        }
      })
    );
  }
});

// Add install event listener
self.addEventListener('install', (event) => {
  console.log('[firebase-messaging-sw.js] Installing...');
  // Skip waiting to activate immediately
  self.skipWaiting();
});

// Add activate event listener
self.addEventListener('activate', (event) => {
  console.log('[firebase-messaging-sw.js] Activating...');
  // Claim all clients to ensure the service worker controls all pages
  event.waitUntil(clients.claim());
});

// Add message event listener for debugging
self.addEventListener('message', (event) => {
  console.log('[firebase-messaging-sw.js] Received message:', event.data);
  // Only show notification for non-ping messages
  if (!event.data || event.data.eventType !== 'ping') {
    self.registration.showNotification('Debug Message', {
      body: 'Received message: ' + JSON.stringify(event.data),
      requireInteraction: true
    });
  }
});