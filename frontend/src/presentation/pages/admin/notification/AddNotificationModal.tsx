import React from 'react';
import { IoClose as Close } from 'react-icons/io5';
import { AddNotificationModalProps } from '../../../../domain/types/management/notificationmanagement';
import { usePreventBodyScroll } from '../../../../shared/hooks/usePreventBodyScroll';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { notificationSchema, NotificationFormData } from '../../../../domain/validation/management/notificationSchema';

const AddNotificationModal: React.FC<AddNotificationModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  recipientTypes,
}) => {

  usePreventBodyScroll(isOpen);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<NotificationFormData>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      title: '',
      message: '',
      recipientType: '',
      recipientId: '',
      recipientName: '',
      createdBy: 'Admin',
    },
  });

  const onFormSubmit = (data: NotificationFormData) => {
    const notificationData = {
      ...data,
      isRead: false,
    };
    onSubmit(notificationData);
    reset();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">Create Notification</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <Close size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit(onFormSubmit)}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
            <input
              type="text"
              {...register('title')}
              className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-purple-500"
            />
            {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title.message}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Message</label>
            <textarea
              {...register('message')}
              className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-purple-500"
              rows={4}
            />
            {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message.message}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Recipient Type</label>
            <select
              {...register('recipientType')}
              className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-purple-500"
            >
              <option value="" disabled>Select a recipient</option>
              {recipientTypes.map((type) => (
                <option key={type} value={type.toLowerCase().replace(/\s+/g, '_')}>
                  {type}
                </option>
              ))}
            </select>
            {errors.recipientType && <p className="text-red-400 text-xs mt-1">{errors.recipientType.message}</p>}
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNotificationModal;