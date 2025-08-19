import React, { useState, useRef } from 'react';
import { IoCloseOutline as X, IoSearchOutline as Search, IoMailOutline as Mail } from 'react-icons/io5';
import { RecipientType, User, ComposeMessageModalProps, UserArrayWithUsers } from '../../../../domain/types/management/communicationmanagement';
import { usePreventBodyScroll } from '../../../../shared/hooks/usePreventBodyScroll';
import { ghostParticles, RECIPIENT_TYPES } from '../../../../shared/constants/communicationManagementConstants';
import { toast } from 'react-hot-toast';

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
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  usePreventBodyScroll(isOpen);

  React.useEffect(() => {
    if (isOpen) {
      setForm(initialForm);
      
      if (initialForm.to.length > 0) {
        setRecipientType('individual_students');
        loadUsers('individual_students');
      } else {
        setRecipientType('');
      }
      
      setUsers([]);
      setSearchTerm('');
    }
  }, [isOpen, initialForm]);

  const loadUsers = async (type: RecipientType, search?: string) => {
    if (!isOpen || !type) return;
    setIsLoadingUsers(true);
    try {
      const fetchedUsers = await fetchUsers(type, search);
      setUsers((fetchedUsers as UserArrayWithUsers)?.users || []);
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

  const handleCancel = () => {
    setRecipientType('');
    onCancel();
  };

  const handleSubmit = () => {
    if (form.to.length === 0 || !form.subject || !form.message) {
      alert('Please fill in all required fields.');
      return;
    }
    onSend(form);
    setForm({ to: [], subject: '', message: '' });
    setRecipientType('');
    toast.success('Message sent successfully!');
  };

  const handleRecipientTypeChange = (type: RecipientType) => {
    setRecipientType(type);
    
    if (type === '') {
      setForm(prev => ({ ...prev, to: [] }));
      setUsers([]);
    } else if (type === 'all_students') {
      setForm(prev => ({
        ...prev,
        to: [{ value: type, label: RECIPIENT_TYPES.find(t => t.value === type)?.label || '' }]
      }));
    } else if (type === 'individual_students') {
      setForm(prev => ({
        ...prev,
        to: prev.to.filter(t => !['all_students', 'all_faculty', 'all_users'].includes(t.value))
      }));
      loadUsers(type);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
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

      <div className="bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 w-full max-w-2xl max-h-[90vh] rounded-2xl border border-purple-600/30 shadow-2xl overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 via-transparent to-purple-600/5 pointer-events-none" />

        <div className="absolute top-0 left-0 w-20 h-20 bg-purple-500/10 rounded-br-full" />
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-500/10 rounded-tl-full" />

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
              onClick={handleCancel}
              className="p-2 hover:bg-purple-500/20 rounded-full transition-colors"
            >
              <X size={24} className="text-purple-300" />
            </button>
          </div>
        </div>

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

            {form.to.some(t => t.value === 'all_students') && (
              <div className="bg-green-900/20 border border-green-600/30 rounded-lg p-4 shadow-sm">
                <div className="flex items-center space-x-2 text-green-300">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium">All Students Selected</span>
                </div>
                <p className="text-xs text-green-400 mt-1">Message will be sent to all students. Individual user selection is disabled.</p>
              </div>
            )}

            {recipientType === 'individual_students' && !form.to.some(t => t.value === 'all_students') && (
              <div className="bg-gray-800/80 border border-purple-600/30 rounded-lg p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-purple-300">Search Recipients</label>
                  <span className="text-xs text-purple-400">Click users to select multiple recipients</span>
                </div>
                <div className="relative mb-2">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Type to search users by name or email..."
                    className="w-full pl-10 pr-3 py-2 bg-gray-900/60 border border-purple-600/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-200"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-300" size={18} />
                  {searchTerm && (
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        loadUsers(recipientType);
                      }}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-400 hover:text-purple-300 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
                <div className="max-h-40 overflow-y-auto bg-gray-900/60 rounded-lg custom-scrollbar">
                  {isLoadingUsers ? (
                    <div className="p-4 text-center text-purple-300">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500 mx-auto mb-2"></div>
                      Loading users...
                    </div>
                  ) : users.length > 0 ? (
                    <div className="divide-y divide-purple-600/30">
                      {users.map((user) => (
                        <div
                          key={user.id}
                          className={`p-2 hover:bg-gray-800/60 cursor-pointer flex items-center justify-between transition-colors ${
                            form.to.some(t => t.value === user.id) ? 'bg-purple-900/30 border-l-2 border-purple-500' : ''
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
                                to: [...prev.to, { value: user.id, label: user.name || user.email }]
                              }));
                            }
                          }}
                        >
                          <div>
                            <div className="text-white">{user.name || 'User Name'}</div>
                            <div className="text-sm text-purple-200">{user.email}</div>
                          </div>
                          {form.to.some(t => t.value === user.id) ? (
                            <div className="w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center">
                              <X size={12} className="text-white" />
                            </div>
                          ) : (
                            <div className="w-5 h-5 border-2 border-purple-600/30 rounded-full flex items-center justify-center">
                              <div className="w-2 h-2 bg-purple-600/30 rounded-full"></div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : searchTerm ? (
                    <div className="p-4 text-center text-purple-300">No users found for "{searchTerm}"</div>
                  ) : (
                    <div className="p-4 text-center text-purple-300">Enter a search term to find users</div>
                  )}
                </div>
              </div>
            )}

            <div className="bg-gray-800/80 border border-purple-600/30 rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-purple-300">
                  Selected Recipients ({form.to.length})
                </label>
                {form.to.length > 0 && (
                  <button
                    onClick={() => setForm(prev => ({ ...prev, to: [] }))}
                    className="text-xs text-red-400 hover:text-red-300 transition-colors"
                  >
                    Clear All
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {form.to.length === 0 ? (
                  <div className="text-purple-400 text-sm">No recipients selected</div>
                ) : (
                  form.to.map((recipient) => (
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
                        className="hover:text-red-400 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))
                )}
              </div>
              {form.to.length > 0 && (
                <div className="mt-2 text-xs text-purple-400">
                  {form.to.some(t => t.value === 'all_students') 
                    ? 'Broadcasting to all students' 
                    : `Selected ${form.to.length} individual user${form.to.length > 1 ? 's' : ''}`
                  }
                </div>
              )}
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


          </div>

          <div className="border-t border-purple-600/30 bg-gray-900/80 p-6">
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleCancel}
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

      <style>{`
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