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
  navigator.serviceWorker.addEventListener('message', async (event) => {
    if (event.data?.type === 'MARK_NOTIFICATION_READ' && event.data?.notificationId) {
      try {
        const state = store.getState();
        const userId = state.auth.user?.id;
        const collection = state.auth.collection;


        if (userId && collection) {
          const response = await httpClient.post(`/notifications/${event.data.notificationId}/mark-read`, {
            userId,
            collection
          });
        } else {
          console.error('[Service Worker] Missing user context for mark-as-read');
        }
      } catch (error) {
        console.error('[Service Worker] Failed to mark notification as read:', error);
      }
    }
  });

  window.addEventListener('load', async () => {
    try {
      const existingRegistrations = await navigator.serviceWorker.getRegistrations();

      const existingFCMWorker = existingRegistrations.find(reg =>
        reg.scope.includes(window.location.origin) &&
        reg.active &&
        reg.active.scriptURL.includes('firebase-messaging-sw.js')
      );

      if (existingFCMWorker) {
        if (existingFCMWorker.active) {
          await setupFirebaseMessaging(existingFCMWorker);
        } else {
          existingFCMWorker.addEventListener('activate', async () => {
            await setupFirebaseMessaging(existingFCMWorker);
          });
        }
        return;
      }

      const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
        scope: '/',
        updateViaCache: 'none'
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



