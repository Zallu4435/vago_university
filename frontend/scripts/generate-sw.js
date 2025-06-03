import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read environment variables from .env file
const envFile = readFileSync('.env', 'utf8');
const envVars = envFile.split('\n').reduce((acc, line) => {
  const [key, value] = line.split('=');
  if (key && value) {
    acc[key.trim()] = value.trim();
  }
  return acc;
}, {});

// Generate service worker content
const swContent = `// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker
firebase.initializeApp({
  apiKey: "${envVars.VITE_FIREBASE_API_KEY}",
  authDomain: "${envVars.VITE_FIREBASE_AUTH_DOMAIN}",
  projectId: "${envVars.VITE_FIREBASE_PROJECT_ID}",
  storageBucket: "${envVars.VITE_FIREBASE_STORAGE_BUCKET}",
  messagingSenderId: "${envVars.VITE_FIREBASE_MESSAGING_SENDER_ID}",
  appId: "${envVars.VITE_FIREBASE_APP_ID}",
  measurementId: "${envVars.VITE_FIREBASE_MEASUREMENT_ID}"
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
});`;

// Write the service worker file
writeFileSync(
  join(__dirname, '../public/firebase-messaging-sw.js'),
  swContent
);

console.log('Service worker generated successfully!'); 