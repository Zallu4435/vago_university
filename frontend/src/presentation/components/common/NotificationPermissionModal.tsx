import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getToken, Messaging } from 'firebase/messaging';
import { RootState } from '../../../appStore/store';
import { IoNotificationsOutline as NotificationIcon } from 'react-icons/io5';
import { messaging as firebaseMessaging, VAPID_KEY } from '../../../firebase/setup';

import httpClient from '../../../frameworks/api/httpClient';

const NOTIFICATION_PERMISSION_KEY = 'notificationPermission';

interface User {
  id: string;
  role?: string;
}

const NotificationPermissionModal: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user) as User | null;
  const collection = useSelector((state: RootState) => state.auth.collection)

  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkPermission = () => {
      const permission = localStorage.getItem(NOTIFICATION_PERMISSION_KEY);
      // Skip showing for admin users
      if (user && !permission && collection !== 'admin' && user.role !== 'admin') {
        setIsOpen(true);
      }
    };

    checkPermission();
  }, [user, collection]);

  const handleEnableNotifications = async () => {
    try {
      setIsLoading(true);

      const permission = await Notification.requestPermission();

      if (permission === 'granted') {
        try {
          if ('serviceWorker' in navigator) {
            const registrations = await navigator.serviceWorker.getRegistrations();
            let serviceWorkerRegistration;

            const existingFCMWorker = registrations.find(reg =>
              reg.active && reg.active.scriptURL.includes('firebase-messaging-sw.js')
            );

            if (existingFCMWorker) {
              serviceWorkerRegistration = existingFCMWorker;
            } else {
              serviceWorkerRegistration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
                scope: '/'
              });
            }

            const messaging = firebaseMessaging as Messaging;
            const token = await getToken(messaging, {
              vapidKey: VAPID_KEY,
              serviceWorkerRegistration
            });


            if (user?.id && collection) {
              await httpClient.post(`/fcm/${collection}/${user.id}/fcm-token`, {
                token,
              });
            } else {
              console.error('[NotificationModal] Missing user ID or collection');
            }
          } else {
            console.error('[NotificationModal] Service workers not supported');
          }
        } catch (fcmError) {
          console.error('[NotificationModal] Error setting up FCM:', fcmError);
        }

        localStorage.setItem(NOTIFICATION_PERMISSION_KEY, 'granted');

        setIsOpen(false);
      } else {
        localStorage.setItem(NOTIFICATION_PERMISSION_KEY, 'denied');
        setIsOpen(false);
      }
    } catch (error) {
      console.error('Error enabling notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisableNotifications = () => {
    localStorage.setItem(NOTIFICATION_PERMISSION_KEY, 'denied');
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
            <NotificationIcon className="text-2xl text-purple-400" />
          </div>
          <h2 className="text-xl font-semibold text-white">Enable Notifications</h2>
        </div>

        <div className="space-y-4">
          <p className="text-gray-300">
            Stay updated with important announcements, deadlines, and updates by enabling notifications.
          </p>
          <p className="text-sm text-gray-400">
            You can change this setting later in your profile settings.
          </p>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={handleEnableNotifications}
            disabled={isLoading}
            className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Enabling...
              </div>
            ) : (
              'Enable Notifications'
            )}
          </button>
          <button
            onClick={handleDisableNotifications}
            disabled={isLoading}
            className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Disable
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationPermissionModal; 