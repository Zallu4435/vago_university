import { getMessaging, getToken, onMessage, deleteToken } from "firebase/messaging";
import { messaging, VAPID_KEY } from "../firebase/setup";
import store from "../appStore/store";
import httpClient from "../frameworks/api/httpClient";
import toast from "react-hot-toast";

let retryCount = 0;
const MAX_RETRIES = 3;

export async function setupFirebaseMessaging(registration: ServiceWorkerRegistration) {
  try {
    if (retryCount >= MAX_RETRIES) {
      console.log('[Firebase Setup] Maximum retry attempts reached, aborting FCM setup');
      setTimeout(() => { retryCount = 0; }, 60000);
      return;
    }

    if (Notification.permission !== 'granted') {
      console.log('[Firebase Setup] Requesting notification permission...');
      const permission = await Notification.requestPermission();
      console.log('[Firebase Setup] Permission result:', permission);
      if (permission !== 'granted') {
        console.error('[Firebase Setup] Notification permission denied');
        return;
      }
    }

    let messagingInstance;
    try {
      messagingInstance = messaging;
      console.log('[Firebase Setup] Using pre-initialized messaging instance');
    } catch (err) {
      console.log('[Firebase Setup] Creating new messaging instance');
      messagingInstance = getMessaging();
    }
    console.log('[Firebase Setup] Got messaging instance');

    onMessage(messagingInstance, (payload) => {
      if (payload.data?.tokenRefresh === 'true') {
        console.log('[Firebase Setup] FCM token refresh triggered');
        retryCount = 0;
        setupFirebaseMessaging(registration);
      }
    });

    try {
      let token;
      try {
        token = await getToken(messagingInstance, {
          vapidKey: VAPID_KEY
        });
        console.log('[Firebase Setup] Token generated without explicit registration');
      } catch (initialError) {
        console.log('[Firebase Setup] Trying token generation with explicit registration', initialError);
        token = await getToken(messagingInstance, {
          vapidKey: VAPID_KEY,
          serviceWorkerRegistration: registration
        });
      }

      retryCount = 0;

      console.log('[Firebase Setup] FCM token generated successfully:', {
        tokenPreview: token.substring(0, 10) + '...',
        length: token.length
      });

      const state = store.getState();
      const userId = state.auth.user?.id;
      const collection = state.auth.collection;

      if (!userId || !collection) {
        console.error('[Firebase Setup] User ID or collection not found in Redux store');
        return;
      }

      try {
        const response = await httpClient.post(`/fcm/${collection}/${userId}/fcm-token`, {
          token,
        });

        if (response.status === 200) {
        } else {

          await deleteToken(messagingInstance);
          console.log('[Firebase Setup] Deleted invalid token, will retry registration');
          retryCount++;
          setTimeout(() => setupFirebaseMessaging(registration), 5000);
        }
      } catch (error) {
        console.error('[Firebase Setup] Error sending token to backend:', error);
        await deleteToken(messagingInstance);
        console.log('[Firebase Setup] Deleted token after error, will retry registration');
        retryCount++;
        setTimeout(() => setupFirebaseMessaging(registration), 5000);
      }

      onMessage(messagingInstance, (payload) => {
        console.log('[Firebase Setup] Received foreground message:', {
          payload,
          timestamp: new Date().toISOString(),
          hasNotification: !!payload.notification,
          hasData: !!payload.data
        });

        if (payload.notification?.title) {
          new Notification(payload.notification.title, {
            body: payload.notification.body || '',
            icon: '/favicon.ico',
            data: payload.data || {},
            tag: payload.data?.notificationId,
            requireInteraction: true
          });
        } else if (payload.data) {
          toast(payload.data.message || 'New notification', {
            icon: '🔔',
            duration: 5000,
            position: 'top-right',
          });
        }
      });


    } catch (tokenError) {
      console.error('[Firebase Setup] Error generating FCM token:', tokenError);
      retryCount++;

      const backoffDelay = Math.min(5000 * Math.pow(2, retryCount - 1), 60000);

      if (retryCount < MAX_RETRIES) {
        setTimeout(() => setupFirebaseMessaging(registration), backoffDelay);
      }
    }
  } catch (error) {
    console.error('[Firebase Setup] Error setting up Firebase Messaging:', error);
    retryCount++;
    if (retryCount < MAX_RETRIES) {
      setTimeout(() => setupFirebaseMessaging(registration), 5000);
    }
  }
} 