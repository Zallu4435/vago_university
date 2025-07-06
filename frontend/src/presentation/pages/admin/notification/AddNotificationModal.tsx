import React, { useState, useEffect } from 'react';
import { IoClose as Close } from 'react-icons/io5';
import { Notification } from '../../../../domain/types/notification.types';

interface AddNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Notification, '_id' | 'createdAt' | 'status'>) => void;
  recipientTypes: string[];
}

interface FormData {
  title: string;
  message: string;
  recipientType: string;
  recipientId: string;
  recipientName: string;
  createdBy: string;
}

const AddNotificationModal: React.FC<AddNotificationModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  recipientTypes,
}) => {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    message: '',
    recipientType: '',
    recipientId: '',
    recipientName: '',
    createdBy: 'Admin', // Assume admin user for simplicity
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.title) newErrors.title = 'Title is required';
    if (!formData.message) newErrors.message = 'Message is required';
    if (!formData.recipientType) newErrors.recipientType = 'Please select a recipient type';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const notificationData: Omit<Notification, '_id' | 'createdAt' | 'status'> = {
        title: formData.title,
        message: formData.message,
        recipientType: formData.recipientType as 'all' | 'all_students' | 'all_faculty',
        recipientId: formData.recipientId,
        recipientName: formData.recipientName,
        createdBy: formData.createdBy,
        isRead: false,
      };
      onSubmit(notificationData);
      setFormData({
        title: '',
        message: '',
        recipientType: '',
        recipientId: '',
        recipientName: '',
        createdBy: 'Admin',
      });
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-purple-500"
            />
            {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-purple-500"
              rows={4}
            />
            {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Recipient Type</label>
            <select
              name="recipientType"
              value={formData.recipientType}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-purple-500"
            >
              <option value="" disabled>Select a recipient</option>
              {recipientTypes.map((type) => (
                <option key={type} value={type.toLowerCase().replace(/\s+/g, '_')}>
                  {type}
                </option>
              ))}
            </select>
            {errors.recipientType && <p className="text-red-400 text-xs mt-1">{errors.recipientType}</p>}
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