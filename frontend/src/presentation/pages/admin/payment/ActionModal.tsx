import React from 'react';
import { FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { ActionModalProps } from '../../../../domain/types/management/financialmanagement';

const ActionModal: React.FC<ActionModalProps> = ({ isOpen, onClose, onConfirm, title, message, type }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-md p-6">
        <div className="flex items-center mb-4">
          {type === 'success' ? (
            <FiCheckCircle size={24} className="text-green-500 mr-2" />
          ) : (
            <FiXCircle size={24} className="text-red-500 mr-2" />
          )}
          <h2 className="text-xl font-semibold text-white">{title}</h2>
        </div>
        <p className="text-gray-300 mb-6">{message}</p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded-lg text-white ${
              type === 'success' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            {type === 'success' ? 'Approve' : 'Reject'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActionModal;