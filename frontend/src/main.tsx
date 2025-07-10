import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./appStore/store";
import App from "./App";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { PreferencesProvider } from "./application/context/PreferencesContext";
import NotificationPermissionModal from "./presentation/components/common/NotificationPermissionModal";
import { setupFirebaseMessaging } from "./services/firebase";
import httpClient from "./frameworks/api/httpClient";

const queryClient = new QueryClient();

if ('serviceWorker' in navigator) {
  console.log('[Service Worker] Browser supports service workers');
  
  // Add message listener for marking notifications as read
  navigator.serviceWorker.addEventListener('message', async (event) => {
    console.log('[Service Worker] Received message from service worker:', event.data);
    
    if (event.data?.type === 'MARK_NOTIFICATION_READ' && event.data?.notificationId) {
      console.log('[Service Worker] Processing mark-as-read request:', event.data.notificationId);
      try {
        // Get the notification service from the store
        const state = store.getState();
        const userId = state.auth.user?.id;
        const collection = state.auth.collection;

        console.log('[Service Worker] User context for mark-as-read:', {
          userId,
          collection,
          notificationId: event.data.notificationId
        });

        if (userId && collection) {
          console.log('[Service Worker] Sending mark-as-read request to backend');
          const response = await httpClient.post(`/notifications/${event.data.notificationId}/mark-read`, {
            userId,
            collection
          });
          console.log('[Service Worker] Successfully marked notification as read:', response.data);
        } else {
          console.error('[Service Worker] Missing user context for mark-as-read');
        }
      } catch (error) {
        console.error('[Service Worker] Failed to mark notification as read:', error);
      }
    }
  });

  // First, unregister any existing service workers
  navigator.serviceWorker.getRegistrations().then(registrations => {
    console.log('[Service Worker] Found existing service workers:', registrations.length);
    for (let registration of registrations) {
      console.log('[Service Worker] Unregistering service worker:', registration.scope);
      registration.unregister();
    }
  });

  window.addEventListener('load', async () => {
    try {
      console.log('[Service Worker] Registering service worker...');
      const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
        scope: '/'
      });

      console.log('[Service Worker] Service Worker registered successfully:', {
        scope: registration.scope,
        state: registration.active?.state
      });

      if (registration.active) {
        console.log('[Service Worker] Service worker is already active, setting up messaging');
        await setupFirebaseMessaging(registration);
      } else {
        console.log('[Service Worker] Service worker is not active, waiting for activation');
        registration.addEventListener('activate', async () => {
          console.log('[Service Worker] Service worker activated, setting up messaging');
          await setupFirebaseMessaging(registration);
        });
      }

      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        console.log('[Service Worker] New service worker found:', newWorker?.state);
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            console.log('[Service Worker] Service worker state changed:', newWorker.state);
            if (newWorker.state === 'activated') {
              console.log('[Service Worker] New service worker activated, setting up messaging');
              setupFirebaseMessaging(registration);
            }
          });
        }
      });

    } catch (error) {
      console.error('[Service Worker] Service Worker registration failed:', error);
    }
  });
} else {
  console.log('[Service Worker] Service Worker is not supported in this browser');
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



