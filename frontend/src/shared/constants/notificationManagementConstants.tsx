import React from 'react';
import { IoPersonOutline as User, IoPeopleOutline as Group } from 'react-icons/io5';
import { Notification } from '../../domain/types/notification.types';

export const RECIPIENT_TYPES = ['All', 'All Students', 'All Faculty', 'All Students and Faculty'];
export const STATUSES = ['All', 'Sent', 'Failed'];

export const notificationColumns = [
  {
    header: 'Notification',
    key: 'title',
    render: (notification: Notification) => (
      <div className="flex items-center gap-3">
        <span
          className="text-2xl w-8 h-8 rounded-lg flex items-center justify-center bg-purple-900/20 text-purple-500"
        >
          {notification.recipientType === 'individual' ? <User /> : <Group />}
        </span>
        <div>
          <p className="font-medium text-gray-200">{notification.title}</p>
          <p className="text-xs text-gray-400">ID: {notification._id?.slice(0, 7)}</p>
        </div>
      </div>
    ),
    width: '20%',
  },
  {
    header: 'Recipient',
    key: 'recipient',
    render: (notification: Notification) => (
      <div className="text-sm text-gray-300">
        {notification.recipientType === 'individual'
          ? notification.recipientName || 'N/A'
          : notification.recipientType.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
      </div>
    ),
  },
  {
    header: 'Created By',
    key: 'createdBy',
    render: (notification: Notification) => (
      <div className="flex items-center text-gray-300">
        <User size={14} className="text-purple-400 mr-2" />
        <span className="text-sm">{notification.createdBy}</span>
      </div>
    ),
  },
  {
    header: 'Created At',
    key: 'createdAt',
    render: (notification: Notification) => (
      <div className="text-sm text-gray-300">{notification.createdAt}</div>
    ),
  },
  {
    header: 'Status',
    key: 'status',
    render: (notification: Notification) => (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
          notification.status.toLowerCase() === 'sent'
            ? 'bg-green-900/30 text-green-400 border-green-500/30'
            : 'bg-red-900/30 text-red-400 border-red-500/30'
        }`}
      >
        <span
          className="h-1.5 w-1.5 rounded-full mr-1.5"
          style={{ boxShadow: `0 0 8px currentColor`, backgroundColor: 'currentColor' }}
        ></span>
        {notification.status.charAt(0).toUpperCase() + notification.status.slice(1)}
      </span>
    ),
  },
]; 