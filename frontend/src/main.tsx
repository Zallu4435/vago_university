import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./presentation/redux/store";
import App from "./App";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { PreferencesProvider } from "./presentation/context/PreferencesContext";
import NotificationPermissionModal from "./components/NotificationPermissionModal";

import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { messaging, VAPID_KEY } from "./firebase/setup";
import httpClient from "./frameworks/api/httpClient";

const queryClient = new QueryClient();

async function setupFirebaseMessaging(registration: ServiceWorkerRegistration) {
  try {

    if (Notification.permission !== 'granted') {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        console.error('Notification permission denied');
        return;
      }
    }

    const messagingInstance = getMessaging();

    const token = await getToken(messagingInstance, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: registration
    });

    const state = store.getState();
    const userId = state.auth.user?.id;
    const collection = state.auth.collection;

    if (!userId || !collection) {
      console.error('User ID or collection not found in Redux store');
      return;
    }

    try {
      const response = await httpClient.post(`/fcm/${collection}/${userId}/fcm-token`, {
        token,
      });

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
    });

  } catch (error) {
    console.error('Error setting up Firebase Messaging:', error);
  }
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    for (let registration of registrations) {
      registration.unregister();
    }
  });

  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
        scope: '/'
      });
      if (registration.active) {
        await setupFirebaseMessaging(registration);
      } else {
        registration.addEventListener('activate', async () => {
          await setupFirebaseMessaging(registration);
        });
      }

      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
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



