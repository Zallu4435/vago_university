import React from 'react';
import { FiDollarSign, FiX, FiFileText } from 'react-icons/fi';
import { ChargeDetailsModalProps } from '../../../../domain/types/management/financialmanagement';
import ReactDOM from 'react-dom';

const ChargeDetailsModal: React.FC<ChargeDetailsModalProps> = ({ charge, isOpen, onClose }) => {
  if (!isOpen) return null;

  const formattedDate = (date: string) => {
    const dateObj = new Date(date);
    return `${dateObj.getDate()}/${dateObj.getMonth() + 1}/${dateObj.getFullYear()}`;
  };

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm z-[10000] flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 w-full max-w-md rounded-2xl border border-purple-500/30 shadow-2xl overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 via-transparent to-purple-600/5 pointer-events-none" />
        <div className="absolute top-0 left-0 w-20 h-20 bg-purple-500/10 rounded-br-full" />
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-500/10 rounded-tl-full" />
        <div className="bg-gradient-to-r from-purple-900 to-gray-900 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl shadow-lg border border-purple-500/30 bg-purple-600/20">
                <FiDollarSign size={22} className="text-purple-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-purple-100">Charge Details</h2>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-purple-500/20 rounded-full transition-colors"
            >
              <FiX size={22} className="text-purple-300" />
            </button>
          </div>
        </div>
        <div className="p-6 space-y-4 text-purple-100">
          <div className="flex items-center gap-2">
            <FiFileText className="text-purple-400" />
            <span className="font-semibold">Title:</span>
            <span>{charge.title}</span>
          </div>
          <div className="flex items-center gap-2">
            <FiFileText className="text-purple-400" />
            <span className="font-semibold">Description:</span>
            <span>{charge.description}</span>
          </div>
          <div className="flex items-center gap-2">
            <FiDollarSign className="text-purple-400" />
            <span className="font-semibold">Amount:</span>
            <span>${charge.amount.toFixed(2)}</span>
          </div>
          <div className="flex items-center gap-2">
            <FiFileText className="text-purple-400" />
            <span className="font-semibold">Term:</span>
            <span>{charge.term}</span>
          </div>
          <div className="flex items-center gap-2">
            <FiFileText className="text-purple-400" />
            <span className="font-semibold">Due Date:</span>
            <span>{new Date(charge.dueDate).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <FiFileText className="text-purple-400" />
            <span className="font-semibold">Applicable For:</span>
            <span>{charge.applicableFor}</span>
          </div>
          <div className="flex items-center gap-2">
            <FiFileText className="text-purple-400" />
            <span className="font-semibold">Created At:</span>
            <span>{formattedDate(charge.createdAt)}</span>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ChargeDetailsModal; 