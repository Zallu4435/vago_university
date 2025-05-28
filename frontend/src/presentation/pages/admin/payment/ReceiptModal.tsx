import React from 'react';
import { FiX } from 'react-icons/fi';

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  receiptUrl: string;
}

const ReceiptModal: React.FC<ReceiptModalProps> = ({ isOpen, onClose, receiptUrl }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <FiX size={24} />
        </button>
        <h2 className="text-xl font-semibold text-white mb-4">Payment Receipt</h2>
        <div className="bg-gray-900 rounded-lg overflow-hidden">
          {receiptUrl.endsWith('.pdf') ? (
            <iframe
              src={receiptUrl}
              className="w-full h-[600px]"
              title="Payment Receipt"
            />
          ) : (
            <img
              src={receiptUrl}
              alt="Payment Receipt"
              className="w-full h-auto max-h-[600px] object-contain"
            />
          )}
        </div>
        <div className="mt-4 flex justify-end">
          <a
            href={receiptUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Download Receipt
          </a>
        </div>
      </div>
    </div>
  );
};

export default ReceiptModal;