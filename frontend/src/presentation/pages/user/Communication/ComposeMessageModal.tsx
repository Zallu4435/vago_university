import { useState, useEffect } from 'react';
import { useCommunicationManagement } from '../../../../application/hooks/useCommunication';
import { MessageForm, Admin } from '../../../../domain/types/communication';
import { communicationService } from '../../../../application/services/communicationService';

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
  initialForm
}) => {
  const [recipients, setRecipients] = useState<Array<{ value: string; label: string }>>(
    initialForm?.to || []
  );
  const [subject, setSubject] = useState(initialForm?.subject || '');
  const [message, setMessage] = useState(initialForm?.message || '');
  const [attachments, setAttachments] = useState<string[]>(initialForm?.attachments || []);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [isLoadingAdmins, setIsLoadingAdmins] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form: MessageForm = {
      to: recipients,
      subject,
      message,
      attachments,
      isAdmin: false
    };
    onSend(form);
    setSubject('');
    setMessage('');
    setRecipients([]);
    setAttachments([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Compose Message</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">To</label>
              <select
                value={recipients[0]?.value || ''}
                onChange={(e) => {
                  const option = e.target.options[e.target.selectedIndex];
                  setRecipients([{
                    value: e.target.value,
                    label: option.text
                  }]);
                }}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
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
                <p className="mt-1 text-sm text-gray-500">Loading admins...</p>
              )}
              {error && (
                <p className="mt-1 text-sm text-red-500">{error}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Subject</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={6}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                required
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoadingAdmins}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
              >
                Send Message
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ComposeMessageModal;