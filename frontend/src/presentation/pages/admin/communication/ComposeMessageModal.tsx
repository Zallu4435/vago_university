// src/presentation/pages/admin/communication/modals/ComposeMessageModal.tsx
import React, { useState, useRef } from 'react';
import { IoAttachOutline as Paperclip, IoCloseOutline as X } from 'react-icons/io5';

interface ComposeMessageModalProps {
  initialForm: {
    to: { value: string; label: string }[];
    subject: string;
    message: string;
    attachments: File[];
  };
  userGroups: { value: string; label: string }[];
  onSend: (form: {
    to: { value: string; label: string }[];
    subject: string;
    message: string;
    attachments: File[];
  }) => void;
  onCancel: () => void;
  isOpen: boolean;
}

const ComposeMessageModal: React.FC<ComposeMessageModalProps> = ({
  initialForm,
  userGroups,
  onSend,
  onCancel,
  isOpen,
}) => {
  const [form, setForm] = useState(initialForm);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setForm((prev) => ({
      ...prev,
      attachments: [...prev.attachments, ...files],
    }));
  };

  const removeAttachment = (index: number) => {
    setForm((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = () => {
    if (form.to.length === 0 || !form.subject || !form.message) {
      alert('Please fill in all required fields.');
      return;
    }
    onSend(form);
    setForm({ to: [], subject: '', message: '', attachments: [] });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl mx-4 border border-purple-500/20">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white">
              {initialForm.to.length > 0 ? 'Reply to Message' : 'Compose New Message'}
            </h3>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                To <span className="text-red-400">*</span>
              </label>
              <select
                multiple
                value={form.to.map((t) => t.value)}
                onChange={(e) => {
                  const selected = Array.from(e.target.selectedOptions).map((option) => ({
                    value: option.value,
                    label: option.text,
                  }));
                  setForm((prev) => ({ ...prev, to: selected }));
                }}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {userGroups.map((group) => (
                  <option key={group.value} value={group.value}>
                    {group.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Subject <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={form.subject}
                onChange={(e) => setForm((prev) => ({ ...prev, subject: e.target.value }))}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter message subject..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Message <span className="text-red-400">*</span>
              </label>
              <textarea
                value={form.message}
                onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))}
                rows={8}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                placeholder="Type your message here..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Attachments
              </label>
              <div className="border-2 border-dashed border-gray-600 rounded-lg p-4">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  multiple
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center space-x-2 text-purple-400 hover:text-purple-300"
                >
                  <Paperclip size={16} />
                  <span>Add Attachment</span>
                </button>
                {form.attachments.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {form.attachments.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-700 p-2 rounded">
                        <span className="text-sm text-gray-300">{file.name}</span>
                        <button
                          onClick={() => removeAttachment(index)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 border border-gray-600 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Send Message
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComposeMessageModal;