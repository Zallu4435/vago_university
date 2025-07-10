import { getMessaging, getToken, onMessage, deleteToken } from "firebase/messaging";
import { messaging, VAPID_KEY } from "../firebase/setup";
import store from "../appStore/store";
import httpClient from "../frameworks/api/httpClient";
import toast from "react-hot-toast";

export async function setupFirebaseMessaging(registration: ServiceWorkerRegistration) {
  try {
    console.log('[Firebase Setup] Starting Firebase messaging setup...', {
      timestamp: new Date().toISOString(),
      permission: Notification.permission,
      serviceWorkerState: registration.active?.state
    });

    if (Notification.permission !== 'granted') {
      console.log('[Firebase Setup] Requesting notification permission...');
      const permission = await Notification.requestPermission();
      console.log('[Firebase Setup] Permission result:', permission);
      if (permission !== 'granted') {
        console.error('[Firebase Setup] Notification permission denied');
        return;
      }
    }

    console.log('[Firebase Setup] Creating messaging instance...');
    const messagingInstance = getMessaging();
    console.log('[Firebase Setup] Got messaging instance');

    // Set up token refresh listener
    onMessage(messagingInstance, (payload) => {
      if (payload.data?.tokenRefresh === 'true') {
        console.log('[Firebase Setup] FCM token refresh triggered');
        setupFirebaseMessaging(registration);
      }
    });

    console.log('[Firebase Setup] Generating FCM token...');
    try {
      const token = await getToken(messagingInstance, {
        vapidKey: VAPID_KEY,
        serviceWorkerRegistration: registration
      });
      console.log('[Firebase Setup] FCM token generated successfully:', {
        tokenPreview: token.substring(0, 10) + '...',
        length: token.length
      });

      const state = store.getState();
      const userId = state.auth.user?.id;
      const collection = state.auth.collection;

      console.log('[Firebase Setup] User context:', {
        userId,
        collection,
        isAuthenticated: !!state.auth.user
      });

      if (!userId || !collection) {
        console.error('[Firebase Setup] User ID or collection not found in Redux store');
        return;
      }

      try {
        console.log('[Firebase Setup] Sending token to backend...');
        const response = await httpClient.post(`/fcm/${collection}/${userId}/fcm-token`, {
          token,
        });

        if (response.status === 200) {
          console.log('[Firebase Setup] Token sent to backend successfully:', response.data);
        } else {
          console.error('[Firebase Setup] Failed to send token to backend:', {
            status: response.status,
            data: response.data
          });
          // If token registration failed, delete the token and try again
          await deleteToken(messagingInstance);
          console.log('[Firebase Setup] Deleted invalid token, will retry registration');
          setTimeout(() => setupFirebaseMessaging(registration), 5000);
        }
      } catch (error) {
        console.error('[Firebase Setup] Error sending token to backend:', error);
        // If there was an error, try to get a new token
        await deleteToken(messagingInstance);
        console.log('[Firebase Setup] Deleted token after error, will retry registration');
        setTimeout(() => setupFirebaseMessaging(registration), 5000);
      }

      // Handle foreground messages
      onMessage(messagingInstance, (payload) => {
        console.log('[Firebase Setup] Received foreground message:', {
          payload,
          timestamp: new Date().toISOString(),
          hasNotification: !!payload.notification,
          hasData: !!payload.data
        });
        
        // Show browser notification for foreground messages
        if (payload.notification?.title) {
          new Notification(payload.notification.title, {
            body: payload.notification.body || '',
            icon: '/favicon.ico',
            data: payload.data || {},
            tag: payload.data?.notificationId,
            requireInteraction: true // Keep notification until user interacts
          });
        } else if (payload.data) {
          // For data-only messages, show toast
          toast(payload.data.message || 'New notification', {
            icon: '🔔',
            duration: 5000,
            position: 'top-right',
          });
        }
      });

      console.log('[Firebase Setup] Firebase messaging setup completed successfully');

    } catch (tokenError) {
      console.error('[Firebase Setup] Error generating FCM token:', tokenError);
      // If token generation failed, try again after a delay
      setTimeout(() => setupFirebaseMessaging(registration), 5000);
    }
  } catch (error) {
    console.error('[Firebase Setup] Error setting up Firebase Messaging:', error);
  }
} 