import React, { useState } from 'react';
import { FiX, FiCheck, FiAlertCircle, FiTrash2 } from 'react-icons/fi';

const ApprovalModal = ({
  isOpen,
  onClose,
  onApprove,
  onReject,
  onDelete,
  applicantName,
}) => {
  const [action, setAction] = useState('approve');
  const [formData, setFormData] = useState({
    programDetails: '',
    startDate: '',
    scholarshipInfo: '',
    additionalNotes: '',
  });
  const [rejectReason, setRejectReason] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (action === 'approve') {
      onApprove(formData);
    } else if (action === 'reject') {
      onReject(rejectReason);
    } else if (action === 'delete') {
      onDelete();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            {action === 'approve' ? 'Approve Application' : 
             action === 'reject' ? 'Reject Application' : 
             'Delete Application'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FiX size={24} />
          </button>
        </div>

        <div className="mb-4">
          <p className="text-gray-600">
            {action === 'approve' ? `You are about to approve ${applicantName}'s application.` :
             action === 'reject' ? `You are about to reject ${applicantName}'s application.` :
             `You are about to delete ${applicantName}'s application.`}
          </p>
        </div>

        <div className="flex space-x-2 mb-4">
          <button
            type="button"
            onClick={() => setAction('approve')}
            className={`px-4 py-2 rounded-md ${
              action === 'approve' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            Approve
          </button>
          <button
            type="button"
            onClick={() => setAction('reject')}
            className={`px-4 py-2 rounded-md ${
              action === 'reject' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            Reject
          </button>
          <button
            type="button"
            onClick={() => setAction('delete')}
            className={`px-4 py-2 rounded-md ${
              action === 'delete' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            Delete
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {action === 'approve' && (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Program Details
                </label>
                <input
                  type="text"
                  value={formData.programDetails}
                  onChange={(e) => setFormData({ ...formData, programDetails: e.target.value })}
                  className="w-full border border-gray-300 rounded-md p-2"
                  placeholder="Enter program/course details"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full border border-gray-300 rounded-md p-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Scholarship Information
                </label>
                <input
                  type="text"
                  value={formData.scholarshipInfo}
                  onChange={(e) => setFormData({ ...formData, scholarshipInfo: e.target.value })}
                  className="w-full border border-gray-300 rounded-md p-2"
                  placeholder="Any scholarship details if applicable"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Notes
                </label>
                <textarea
                  value={formData.additionalNotes}
                  onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
                  className="w-full border border-gray-300 rounded-md p-2"
                  rows={3}
                  placeholder="Any additional information"
                />
              </div>
            </>
          )}

          {action === 'reject' && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reason for Rejection
              </label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2"
                rows={3}
                placeholder="Please provide a reason for rejection"
                required
              />
            </div>
          )}

          {action === 'delete' && (
            <div className="mb-4">
              <p className="text-red-600">
                Warning: This action cannot be undone. Are you sure you want to delete this application?
              </p>
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 rounded-md text-white ${
                action === 'approve' ? 'bg-blue-600 hover:bg-blue-700' :
                action === 'reject' ? 'bg-red-600 hover:bg-red-700' :
                'bg-red-600 hover:bg-red-700'
              }`}
            >
              {action === 'approve' ? 'Approve' :
               action === 'reject' ? 'Reject' :
               'Delete'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApprovalModal;