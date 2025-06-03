import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getToken } from 'firebase/messaging';
import axios from 'axios';
import { RootState } from '../presentation/redux/store';
import { IoNotificationsOutline as NotificationIcon } from 'react-icons/io5';
import { messaging, VAPID_KEY } from '../firebase/setup';
import httpClient from '../frameworks/api/httpClient';

// Constants
const NOTIFICATION_PERMISSION_KEY = 'notificationPermission';

// Types
interface User {
  id: string;
}

const NotificationPermissionModal: React.FC = () => {
  // Get user from Redux store
  const user = useSelector((state: RootState) => state.auth.user) as User | null;
  const collection = useSelector((state: RootState) => state.auth.collection)
  
  // Local state
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Check if modal should be shown on mount and user login
  useEffect(() => {
    const checkPermission = () => {
      const permission = localStorage.getItem(NOTIFICATION_PERMISSION_KEY);
      if (user && !permission) {
        setIsOpen(true);
      }
    };

    checkPermission();
  }, [user]);

  // Handle enabling notifications
  const handleEnableNotifications = async () => {
    try {
      setIsLoading(true);

      // Request browser notification permission
      const permission = await Notification.requestPermission();
      
      if (permission === 'granted') {
        // Get FCM token
        const token = await getToken(messaging, {
          vapidKey: VAPID_KEY,
        });

        // Send token to backend
        await httpClient.post(`/fcm/${collection}/${user?.id}/fcm-token`, {
          token,
        });

        // Store permission in localStorage
        localStorage.setItem(NOTIFICATION_PERMISSION_KEY, 'granted');
        
        // Close modal
        setIsOpen(false);
      } else {
        console.log('Notification permission denied');
        localStorage.setItem(NOTIFICATION_PERMISSION_KEY, 'denied');
        setIsOpen(false);
      }
    } catch (error) {
      console.error('Error enabling notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle disabling notifications
  const handleDisableNotifications = () => {
    localStorage.setItem(NOTIFICATION_PERMISSION_KEY, 'denied');
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
            <NotificationIcon className="text-2xl text-purple-400" />
          </div>
          <h2 className="text-xl font-semibold text-white">Enable Notifications</h2>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <p className="text-gray-300">
            Stay updated with important announcements, deadlines, and updates by enabling notifications.
          </p>
          <p className="text-sm text-gray-400">
            You can change this setting later in your profile settings.
          </p>
        </div>

        {/* Actions */}
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