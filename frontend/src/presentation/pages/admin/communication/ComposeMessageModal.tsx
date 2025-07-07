import React, { useState, useRef, useEffect } from 'react';
import { IoAttachOutline as Paperclip, IoCloseOutline as X, IoSearchOutline as Search, IoMailOutline as Mail } from 'react-icons/io5';

type RecipientType = '' | 'all_students' | 'all_faculty' | 'all_users' | 'individual_students' | 'individual_faculty';

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
  { value: '', label: 'Select a recipient' },
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
  const [recipientType, setRecipientType] = useState<RecipientType>('');
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Prevent background scrolling
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }
    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, [isOpen]);

  const loadUsers = async (type: RecipientType, search?: string) => {
    if (!isOpen || !type) return;

    console.log('=== ComposeMessageModal - loadUsers DEBUG ===');
    console.log('type parameter:', type);
    console.log('search:', search);
    console.log('=============================================');

    setIsLoadingUsers(true);
    try {
      const fetchedUsers = await fetchUsers(type, search);
      setUsers(fetchedUsers?.users || []);
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
      loadUsers(recipientType, value);
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
    console.log('=== ComposeMessageModal - handleRecipientTypeChange DEBUG ===');
    console.log('New type selected:', type);
    console.log('Previous type was:', recipientType);
    console.log('===========================================================');
    
    setRecipientType(type);
    if (type === '') {
      setForm(prev => ({ ...prev, to: [] }));
      setUsers([]);
    } else if (type === 'all_students' || type === 'all_faculty' || type === 'all_users') {
      setForm(prev => ({
        ...prev,
        to: [{ value: type, label: RECIPIENT_TYPES.find(t => t.value === type)?.label || '' }]
      }));
    } else {
      setForm(prev => ({ ...prev, to: [] }));
      loadUsers(type);
    }
  };

  // Particle effect
  const ghostParticles = Array(30)
    .fill(0)
    .map((_, i) => ({
      size: Math.random() * 10 + 5,
      top: Math.random() * 100,
      left: Math.random() * 100,
      animDuration: Math.random() * 10 + 15,
      animDelay: Math.random() * 5,
    }));

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      {/* Background particles */}
      {ghostParticles.map((particle, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-purple-500/20 blur-sm"
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            top: `${particle.top}%`,
            left: `${particle.left}%`,
            animation: `floatParticle ${particle.animDuration}s infinite ease-in-out`,
            animationDelay: `${particle.animDelay}s`,
          }}
        />
      ))}

      {/* Main Modal Container */}
      <div className="bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 w-full max-w-2xl max-h-[90vh] rounded-2xl border border-purple-600/30 shadow-2xl overflow-hidden relative">
        {/* Inner glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 via-transparent to-purple-600/5 pointer-events-none" />

        {/* Corner decorations */}
        <div className="absolute top-0 left-0 w-20 h-20 bg-purple-500/10 rounded-br-full" />
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-500/10 rounded-tl-full" />

        {/* Header Section */}
        <div className="bg-gradient-to-r from-purple-900 to-gray-900 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-2xl shadow-lg border border-purple-600/30"
                style={{ backgroundColor: '#8B5CF620', borderColor: '#8B5CF6' }}
              >
                <Mail size={24} className="text-purple-300" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-purple-100">
                  {initialForm.to.length > 0 ? 'Reply to Message' : 'Compose New Message'}
                </h2>
              </div>
            </div>
            <button
              onClick={onCancel}
              className="p-2 hover:bg-purple-500/20 rounded-full transition-colors"
            >
              <X size={24} className="text-purple-300" />
            </button>
          </div>
        </div>

        {/* Content Section */}
        <div className="overflow-y-auto max-h-[calc(90vh-200px)] p-6 space-y-6 custom-scrollbar">
          <div className="space-y-4">
            <div className="bg-gray-800/80 border border-purple-600/30 rounded-lg p-4 shadow-sm">
              <label className="block text-sm font-medium text-purple-300 mb-2">
                Recipient Type <span className="text-red-400">*</span>
              </label>
              <select
                value={recipientType}
                onChange={(e) => handleRecipientTypeChange(e.target.value as RecipientType)}
                className="w-full px-3 py-2 bg-gray-900/60 border border-purple-600/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              >
                {RECIPIENT_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {(recipientType === 'individual_students' || recipientType === 'individual_faculty') && (
              <div className="bg-gray-800/80 border border-purple-600/30 rounded-lg p-4 shadow-sm">
                <label className="block text-sm font-medium text-purple-300 mb-2">Search Recipients</label>
                <div className="relative mb-2">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Search by name or email..."
                    className="w-full pl-10 pr-3 py-2 bg-gray-900/60 border border-purple-600/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-300" size={18} />
                </div>
                <div className="max-h-40 overflow-y-auto bg-gray-900/60 rounded-lg custom-scrollbar">
                  {isLoadingUsers ? (
                    <div className="p-4 text-center text-purple-300">Loading...</div>
                  ) : users.length > 0 ? (
                    <div className="divide-y divide-purple-600/30">
                      {users.map((user) => (
                        <div
                          key={user.id}
                          className={`p-2 hover:bg-gray-800/60 cursor-pointer flex items-center justify-between ${
                            form.to.some(t => t.value === user.id) ? 'bg-purple-900/30' : ''
                          }`}
                          onClick={() => {
                            const isSelected = form.to.some(t => t.value === user.id);
                            if (isSelected) {
                              setForm(prev => ({
                                ...prev,
                                to: prev.to.filter(t => t.value !== user.id)
                              }));
                            } else {
                              setForm(prev => ({
                                ...prev,
                                to: [...prev.to, { value: user.id, label: user.email }]
                              }));
                            }
                          }}
                        >
                          <div>
                            <div className="text-white">{user.name || 'User Name'}</div>
                            <div className="text-sm text-purple-200">{user.email}</div>
                          </div>
                          {form.to.some(t => t.value === user.id) && (
                            <div className="w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center">
                              <X size={12} className="text-white" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-purple-300">No users found</div>
                  )}
                </div>
              </div>
            )}

            <div className="bg-gray-800/80 border border-purple-600/30 rounded-lg p-4 shadow-sm">
              <label className="block text-sm font-medium text-purple-300 mb-2">Selected Recipients</label>
              <div className="flex flex-wrap gap-2">
                {form.to.map((recipient) => (
                  <div
                    key={recipient.value}
                    className="flex items-center gap-1 bg-gray-900/60 border border-purple-600/30 rounded-lg px-3 py-1 text-purple-300 text-sm"
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

            <div className="bg-gray-800/80 border border-purple-600/30 rounded-lg p-4 shadow-sm">
              <label className="block text-sm font-medium text-purple-300 mb-2">
                Subject <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={form.subject}
                onChange={(e) => setForm((prev) => ({ ...prev, subject: e.target.value }))}
                className="w-full px-3 py-2 bg-gray-900/60 border border-purple-600/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                placeholder="Enter message subject..."
              />
            </div>

            <div className="bg-gray-800/80 border border-purple-600/30 rounded-lg p-4 shadow-sm">
              <label className="block text-sm font-medium text-purple-300 mb-2">
                Message <span className="text-red-400">*</span>
              </label>
              <textarea
                value={form.message}
                onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))}
                rows={8}
                className="w-full px-3 py-2 bg-gray-900/60 border border-purple-600/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none"
                placeholder="Type your message here..."
              />
            </div>

            <div className="bg-gray-800/80 border border-purple-600/30 rounded-lg p-4 shadow-sm">
              <label className="block text-sm font-medium text-purple-300 mb-2">Attachments</label>
              <div className="border-2 border-dashed border-purple-600/30 rounded-lg p-4">
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
                  className="flex items-center space-x-2 text-purple-300 hover:text-purple-200 transition-colors"
                >
                  <Paperclip size={16} />
                  <span>Add Attachment</span>
                </button>
                {form.attachments.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {form.attachments.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-900/60 border border-purple-600/30 rounded-lg p-2">
                        <span className="text-sm text-purple-200">{file.name}</span>
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

          <div className="border-t border-purple-600/30 bg-gray-900/80 p-6">
            <div className="flex justify-end space-x-4">
              <button
                onClick={onCancel}
                className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors border border-gray-500/50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white py-3 px-6 rounded-lg font-semibold transition-colors border border-purple-500/50"
              >
                Send Message
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .no-scroll {
          overflow: hidden;
        }

        @keyframes floatParticle {
          0% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          25% {
            opacity: 0.8;
          }
          50% {
            transform: translateY(-20px) translateX(10px);
            opacity: 0.3;
          }
          75% {
            opacity: 0.7;
          }
          100% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(128, 90, 213, 0.1);
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(139, 92, 246, 0.3);
          border-radius: 3px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(139, 92, 246, 0.5);
        }
      `}</style>
    </div>
  );
};

export default ComposeMessageModal;