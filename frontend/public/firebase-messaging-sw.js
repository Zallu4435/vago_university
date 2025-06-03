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
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/notification-icon.png',
    badge: '/notification-badge.png',
    vibrate: [200, 100, 200],
    data: payload.data || {},
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

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  console.log('Notification click received:', event);

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