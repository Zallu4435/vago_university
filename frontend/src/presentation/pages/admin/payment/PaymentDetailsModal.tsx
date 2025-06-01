import React from 'react';
import {
  IoCloseOutline as X,
  IoPersonOutline as User,
  IoCalendarOutline as Calendar,
  IoCashOutline as DollarSign,
  IoCardOutline as CreditCard,
  IoDocumentTextOutline as FileText,
  IoDownloadOutline as Download,
} from 'react-icons/io5';
import { Payment } from '../../../../domain/types/financial';

interface PaymentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  payment: Payment | null;
}

const StatusBadge = ({ status }: { status: string }) => {
  const statusConfig = {
    completed: {
      bg: 'bg-green-600/30',
      text: 'text-green-100',
      border: 'border-green-500/50',
    },
    pending: {
      bg: 'bg-yellow-600/30',
      text: 'text-yellow-100',
      border: 'border-yellow-500/50',
    },
    failed: {
      bg: 'bg-red-600/30',
      text: 'text-red-100',
      border: 'border-red-500/50',
    },
  };

  const config = statusConfig[status?.toLowerCase()] || statusConfig.pending;

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${config.bg} ${config.text} ${config.border}`}
    >
      {status?.charAt(0)?.toUpperCase() + status?.slice(1)}
    </span>
  );
};

const InfoCard = ({ icon: Icon, label, value }: { icon: React.ComponentType<{ size?: number | string; className?: string }>; label: string; value: string }) => (
  <div className="bg-gray-800/80 border border-purple-600/30 rounded-lg p-4 shadow-sm">
    <div className="flex items-center mb-2">
      <Icon size={18} className="text-purple-400" />
      <span className="ml-2 text-sm font-medium text-gray-300">{label}</span>
    </div>
    <p className="text-white font-semibold">{value || 'N/A'}</p>
  </div>
);

const formatDate = (dateString: string): string => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const PaymentDetailsModal: React.FC<PaymentDetailsModalProps> = ({ isOpen, onClose, payment }) => {
  if (!isOpen || !payment) return null;

  return (
    <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 w-full max-w-lg max-h-[90vh] rounded-2xl border border-purple-600/30 shadow-2xl overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 via-transparent to-purple-600/5 pointer-events-none" />

        <div className="bg-gradient-to-r from-purple-900 to-gray-900 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-xl shadow-lg border border-purple-600/30 bg-purple-500/20"
              >
                💳
              </div>
              <div>
                <h2 className="text-xl font-bold text-purple-100">Payment Details</h2>
                <p className="text-sm text-purple-300">Payment ID: {payment._id}</p>
                <div className="flex items-center mt-2">
                  <StatusBadge status={payment.status} />
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-purple-500/20 rounded-full transition-colors"
            >
              <X size={24} className="text-purple-300" />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-200px)] p-6 space-y-6 custom-scrollbar">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <InfoCard icon={User} label="Student ID" value={payment.studentId} />
            <InfoCard icon={Calendar} label="Date" value={formatDate(payment.date)} />
            <InfoCard icon={DollarSign} label="Amount" value={`$${payment.amount?.toFixed(2)}`} />
            <InfoCard icon={CreditCard} label="Method" value={payment.method} />
            <InfoCard icon={FileText} label="Description" value={payment.description} />
            <InfoCard icon={FileText} label="Status" value={payment.status} />
          </div>

          {payment.receiptUrl && (
            <div className="mb-8">
              <a
                href={payment.receiptUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-semibold"
              >
                <Download className="mr-2" size={18} />
                Download Receipt
              </a>
            </div>
          )}

          {payment.metadata && Object.keys(payment.metadata).length > 0 && (
            <div className="bg-gray-800/80 border border-purple-600/30 rounded-lg p-4 shadow-sm">
              <div className="flex items-center mb-2">
                <FileText size={18} className="text-purple-400" />
                <span className="ml-2 text-sm font-medium text-gray-300">Metadata</span>
              </div>
              <pre className="text-white text-sm overflow-x-auto">
                {JSON.stringify(payment.metadata, null, 2)}
              </pre>
            </div>
          )}
        </div>

        <div className="border-t border-purple-600/30 bg-gray-900/80 p-6">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors border border-gray-500/50"
            >
              Close
            </button>
          </div>
        </div>

        <style jsx>{`
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
    </div>
  );
};

export default PaymentDetailsModal;