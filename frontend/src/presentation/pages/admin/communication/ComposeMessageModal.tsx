// src/presentation/pages/admin/communication/modals/ComposeMessageModal.tsx
import React, { useState, useRef, useEffect } from 'react';
import { IoAttachOutline as Paperclip, IoCloseOutline as X, IoSearchOutline as Search } from 'react-icons/io5';

type RecipientType = 'all_students' | 'all_faculty' | 'all_users' | 'individual_students' | 'individual_faculty';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface ComposeMessageModalProps {
  initialForm: {
    to: { value: string; label: string }[];
    subject: string;
    message: string;
    attachments: File[];
  };
  onSend: (form: {
    to: { value: string; label: string }[];
    subject: string;
    message: string;
    attachments: File[];
  }) => void;
  onCancel: () => void;
  isOpen: boolean;
  fetchUsers: (type: RecipientType, search?: string) => Promise<User[]>;
}

const RECIPIENT_TYPES = [
  { value: 'all_students', label: 'All Students' },
  { value: 'all_faculty', label: 'All Faculty' },
  { value: 'all_users', label: 'All Students and Faculty' },
  { value: 'individual_students', label: 'Individual Students' },
  { value: 'individual_faculty', label: 'Individual Faculty' },
];

const ComposeMessageModal: React.FC<ComposeMessageModalProps> = ({
  initialForm,
  onSend,
  onCancel,
  isOpen,
  fetchUsers,
}) => {
  const [form, setForm] = useState(initialForm);
  const [recipientType, setRecipientType] = useState<RecipientType>('all_students');
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (recipientType === 'individual_students' || recipientType === 'individual_faculty') {
      loadUsers();
    } else {
      setUsers([]);
    }
  }, [recipientType]);

  const loadUsers = async (search?: string) => {
    if (!isOpen) return;
    
    setIsLoadingUsers(true);
    try {
      const fetchedUsers = await fetchUsers(recipientType, search);
      console.log(fetchedUsers?.data, "kokokokokok");
      setUsers(fetchedUsers?.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const handleSearch = (value: string) => { 
    setSearchTerm(value);
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    searchTimeoutRef.current = setTimeout(() => {
      loadUsers(value);
    }, 300);
  };

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

  const handleRecipientTypeChange = (type: RecipientType) => {
    setRecipientType(type);
    if (type === 'all_students' || type === 'all_faculty' || type === 'all_users') {
      setForm(prev => ({
        ...prev,
        to: [{ value: type, label: RECIPIENT_TYPES.find(t => t.value === type)?.label || '' }]
      }));
    } else {
      setForm(prev => ({ ...prev, to: [] }));
      loadUsers(); // Load users immediately when switching to individual selection
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex items-center justify-center overflow-y-auto py-8">
      <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl mx-4 border border-purple-500/20 my-8">
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
                Recipient Type <span className="text-red-400">*</span>
              </label>
              <select
                value={recipientType}
                onChange={(e) => handleRecipientTypeChange(e.target.value as RecipientType)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {RECIPIENT_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {(recipientType === 'individual_students' || recipientType === 'individual_faculty') && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Search Recipients
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Search by name or email..."
                    className="w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                </div>

                <div className="mt-2 max-h-60 overflow-y-auto bg-gray-700 rounded-lg">
                  {isLoadingUsers ? (
                    <div className="p-4 text-center text-gray-400">Loading...</div>
                  ) : users?.length > 0 ? (
                    <div className="divide-y divide-gray-600">
                      {users.map((user) => (
                        <div
                          key={user._id}
                          className={`p-2 hover:bg-gray-600 cursor-pointer flex items-center justify-between ${
                            form.to.some(t => t.value === user._id) ? 'bg-purple-900/30' : ''
                          }`}
                          onClick={() => {
                            const isSelected = form.to.some(t => t.value === user._id);
                            if (isSelected) {
                              setForm(prev => ({
                                ...prev,
                                to: prev.to.filter(t => t.value !== user._id)
                              }));
                            } else {
                              setForm(prev => ({
                                ...prev,
                                to: [...prev.to, { value: user._id, label: user.email }]
                              }));
                            }
                          }}
                        >
                          <div>
                            <div className="text-white">{user.name || "user name"}</div>
                            <div className="text-sm text-gray-400">{user.email}</div>
                          </div>
                          {form.to.some(t => t.value === user._id) && (
                            <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                              <X size={12} className="text-white" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-gray-400">No users found</div>
                  )}
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Selected Recipients
              </label>
              <div className="flex flex-wrap gap-2">
                {form.to.map((recipient) => (
                  <div
                    key={recipient.value}
                    className="flex items-center gap-1 bg-purple-900/30 text-purple-300 px-2 py-1 rounded-full text-sm"
                  >
                    <span>{recipient.label}</span>
                    <button
                      onClick={() => {
                        setForm((prev) => ({
                          ...prev,
                          to: prev.to.filter((t) => t.value !== recipient.value),
                        }));
                      }}
                      className="hover:text-red-400"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
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