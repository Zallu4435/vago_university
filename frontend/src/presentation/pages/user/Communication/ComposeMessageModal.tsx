import { useState, useEffect } from 'react';
import { useCommunicationManagement } from '../../../../application/hooks/useCommunication';
import { MessageForm, Admin } from '../../../../domain/types/communication';
import { communicationService } from '../../../../application/services/communicationService';
import { FaTimes, FaPaperPlane } from 'react-icons/fa';

export interface ComposeMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (form: MessageForm) => void;
  initialForm?: MessageForm;
}

const ComposeMessageModal: React.FC<ComposeMessageModalProps> = ({
  isOpen,
  onClose,
  onSend,
  initialForm,
}) => {
  const [recipients, setRecipients] = useState<Array<{ value: string; label: string }>>(
    initialForm?.to || [],
  );
  const [subject, setSubject] = useState(initialForm?.subject || '');
  const [message, setMessage] = useState(initialForm?.message || '');
  const [attachments, setAttachments] = useState<string[]>(initialForm?.attachments || []);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [isLoadingAdmins, setIsLoadingAdmins] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const fetchAdmins = async () => {
      if (isOpen) {
        setIsLoadingAdmins(true);
        setError(null);
        try {
          const adminList = await communicationService.getAllAdmins();
          setAdmins(adminList);
        } catch (err) {
          setError('Failed to load admins. Please try again.');
          console.error('Error fetching admins:', err);
        } finally {
          setIsLoadingAdmins(false);
        }
      }
    };

    fetchAdmins();
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      // Prevent background scrolling when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      // Re-enable background scrolling when modal is closed
      document.body.style.overflow = 'unset';
    }

    // Cleanup function to ensure scrolling is re-enabled if component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form: MessageForm = {
      to: recipients,
      subject,
      message,
      attachments,
      isAdmin: false,
    };
    onSend(form);
    setSubject('');
    setMessage('');
    setRecipients([]);
    setAttachments([]);
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto">
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-gradient-to-br from-black/20 via-black/40 to-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isAnimating ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleClose}
      />

      {/* Modal Container */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className={`relative w-full max-w-2xl transform transition-all duration-300 ${
            isAnimating ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'
          }`}
        >
          {/* Main Modal */}
          <div className="relative overflow-hidden rounded-3xl shadow-2xl bg-white/70 backdrop-blur-md border border-amber-100/50 group hover:shadow-2xl transition-all duration-500">
            {/* Background glow */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-200/0 to-amber-200/0 group-hover:from-orange-200/20 group-hover:to-amber-200/20 rounded-3xl blur transition-all duration-300"></div>
            <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full bg-gradient-to-br from-yellow-300/30 to-orange-300/30 blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-16 -right-16 w-48 h-48 rounded-full bg-gradient-to-br from-amber-200/20 to-orange-200/20 blur-2xl animate-pulse delay-700"></div>

            {/* Header */}
            <div className="relative bg-gradient-to-r from-amber-500 to-orange-500 px-6 sm:px-8 py-5 text-white overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="relative">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent"></div>
                      <FaPaperPlane size={16} className="text-white relative z-10 sm:size-20" />
                    </div>
                    <div className="absolute -inset-1 bg-gradient-to-br from-orange-400/30 to-amber-500/30 rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                      Compose Message
                    </h2>
                    <div className="h-1 w-12 sm:w-16 bg-gradient-to-r from-orange-400 to-amber-500 rounded-full mt-1 group-hover:w-16 sm:group-hover:w-24 transition-all duration-300"></div>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors duration-200"
                >
                  <FaTimes size={18} className="sm:size-20" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="relative z-10 p-6 sm:p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
                  <select
                    value={recipients[0]?.value || ''}
                    onChange={(e) => {
                      const option = e.target.options[e.target.selectedIndex];
                      setRecipients([
                        {
                          value: e.target.value,
                          label: option.text,
                        },
                      ]);
                    }}
                    className="block w-full px-4 py-3 bg-white/70 backdrop-blur-md border border-amber-100/50 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 text-sm sm:text-base disabled:opacity-50"
                    required
                    disabled={isLoadingAdmins}
                  >
                    <option value="">Select a recipient</option>
                    {admins.map((admin) => (
                      <option key={admin._id} value={admin._id}>
                        {admin.name} ({admin.email})
                      </option>
                    ))}
                  </select>
                  {isLoadingAdmins && (
                    <p className="mt-1 text-xs sm:text-sm text-gray-500">Loading admins...</p>
                  )}
                  {error && <p className="mt-1 text-xs sm:text-sm text-red-500">{error}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="block w-full px-4 py-3 bg-white/70 backdrop-blur-md border border-amber-100/50 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 text-sm sm:text-base"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={6}
                    className="block w-full px-4 py-3 bg-white/70 backdrop-blur-md border border-amber-100/50 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 text-sm sm:text-base"
                    required
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-6 border-t border-amber-100/50">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="group/btn px-6 py-3 text-gray-700 bg-white/70 backdrop-blur-md border border-amber-200/50 hover:bg-amber-100/50 rounded-full font-medium transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105 flex items-center space-x-2 text-sm sm:text-base"
                  >
                    <span>Cancel</span>
                    <FaTimes size={12} className="group-hover/btn:translate-x-1 transition-transform duration-300" />
                  </button>
                  <button
                    type="submit"
                    disabled={isLoadingAdmins}
                    className="group/btn px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-full font-medium transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center space-x-2 text-sm sm:text-base"
                  >
                    <span>Send Message</span>
                    <FaPaperPlane size={12} className="group-hover/btn:translate-x-1 transition-transform duration-300" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComposeMessageModal;
