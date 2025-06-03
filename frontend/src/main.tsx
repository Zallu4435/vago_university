import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./presentation/redux/store";
import App from "./App";

// React Query setup
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Toast notification setup
import { Toaster } from "react-hot-toast";

// Preferences context
import { PreferencesProvider } from "./presentation/context/PreferencesContext";

// Notification Permission Modal
import NotificationPermissionModal from "./components/NotificationPermissionModal";

// Firebase setup
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { messaging, VAPID_KEY } from "./firebase/setup";
import httpClient from "./frameworks/api/httpClient";

const queryClient = new QueryClient();

// Function to setup Firebase Messaging
async function setupFirebaseMessaging(registration: ServiceWorkerRegistration) {
  try {
    console.log('Setting up Firebase Messaging...');

    // Check notification permission
    if (Notification.permission !== 'granted') {
      console.log('Requesting notification permission...');
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        console.error('Notification permission denied');
        return;
      }
    }

    const messagingInstance = getMessaging();
    console.log('Getting FCM token...');

    const token = await getToken(messagingInstance, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: registration
    });

    console.log('Firebase Messaging Token:', token);

    // Get user ID and collection from Redux store
    const state = store.getState();
    const userId = state.auth.user?.id;
    const collection = state.auth.collection;

    if (!userId || !collection) {
      console.error('User ID or collection not found in Redux store');
      return;
    }

    // Send token to backend with correct endpoint format
    try {
      const response = await httpClient.post(`/fcm/${collection}/${userId}/fcm-token`, {
        token,
      });

      console.log(response, "response from the backen")
      if (response.status == 200) {
        console.log('Token sent to backend successfully');
      } else {
        console.error('Failed to send token to backend');
      }
    } catch (error) {
      console.error('Error sending token to backend:', error);
    }

    // Handle foreground messages
    onMessage(messagingInstance, (payload) => {
      console.log('Received foreground message:', payload);
      // You can show a toast notification here
    });

  } catch (error) {
    console.error('Error setting up Firebase Messaging:', error);
  }
}

// Register service worker and verify Firebase Messaging
if ('serviceWorker' in navigator) {
  console.log('Service Worker is supported');

  // First, unregister any existing service workers
  navigator.serviceWorker.getRegistrations().then(registrations => {
    for (let registration of registrations) {
      registration.unregister();
      console.log('Unregistered old service worker');
    }
  });

  window.addEventListener('load', async () => {
    console.log('Attempting to register service worker...');

    try {
      const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
        scope: '/'
      });
      console.log('Service Worker registered with scope:', registration.scope);

      // Wait for the service worker to be activated
      if (registration.active) {
        console.log('Service Worker is active');
        await setupFirebaseMessaging(registration);
      } else {
        console.log('Waiting for Service Worker to activate...');
        registration.addEventListener('activate', async () => {
          console.log('Service Worker activated');
          await setupFirebaseMessaging(registration);
        });
      }

      // Listen for service worker updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            console.log('Service Worker state:', newWorker.state);
            if (newWorker.state === 'activated') {
              setupFirebaseMessaging(registration);
            }
          });
        }
      });

    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  });
} else {
  console.log('Service Worker is not supported in this browser');
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>
  <QueryClientProvider client={queryClient}>
    <Provider store={store}>
      <PreferencesProvider>
        <NotificationPermissionModal />
        <BrowserRouter>
          <Toaster position="top-right" reverseOrder={false} />
          <App />
        </BrowserRouter>
      </PreferencesProvider>
    </Provider>
  </QueryClientProvider>
  // </React.StrictMode>
);



