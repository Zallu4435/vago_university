import { initializeApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getMessaging, Messaging } from "firebase/messaging";


const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBjBmm32nCdjBodbUW_qvysHNyrfvaDKpU",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "vago-university.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "vago-university",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "vago-university.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "963590986597",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:963590986597:web:4906c24584898696c39f8c",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-0M835WHH24"
};

let app;
let auth: Auth | undefined;
let messaging: Messaging | undefined;

try {
  app = initializeApp(firebaseConfig);

  try {
    auth = getAuth(app);
  } catch (authError) {
    console.error('[Firebase Setup] Error initializing Firebase auth:', authError);
  }

  try {
    messaging = getMessaging(app);
  } catch (messagingError) {
    console.error('[Firebase Setup] Error initializing Firebase messaging:', messagingError);
  }
} catch (error) {
  console.error('[Firebase Setup] Error initializing Firebase app:', error);
}

const vapidKeyFromEnv = import.meta.env.VITE_FIREBASE_VAPID_KEY;
export const VAPID_KEY = vapidKeyFromEnv || "BFIgVHVGhZRzHXnCFoFgPRvXOZ_YRRNBbJnMCgI3X2KGKbYrPUbkLzm5Jh-_LwBRcxNzTCvOKGbqmRvgdVCBRoM";

export { app, auth, messaging };

