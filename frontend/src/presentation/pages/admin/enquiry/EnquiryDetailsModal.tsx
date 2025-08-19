import React, { useState } from 'react';
import {
  IoCloseOutline as X,
  IoPersonOutline as User,
  IoCalendarOutline as Calendar,
  IoMailOutline as Mail,
  IoDocumentTextOutline as FileText,
  IoFlagOutline as Flag,
  IoTimeOutline as Clock,
  IoPencilOutline as Edit,
  IoCheckmarkOutline as Check,
  IoClose as Cancel,
} from 'react-icons/io5';
import { EnquiryDetailsModalProps } from '../../../../domain/types/management/enquirymanagement';
import { InfoCard, StatusBadge, statusOptions } from '../../../../shared/constants/enquiryManagementConstants';
import { formatDateTime } from '../../../../shared/utils/dateUtils';

const EnquiryDetailsModal: React.FC<EnquiryDetailsModalProps> = ({ isOpen, onClose, enquiry, onUpdateStatus }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState(false);

  if (!isOpen || !enquiry) return null;

  const handleEditClick = () => {
    setIsEditing(true);
    setSelectedStatus(enquiry.status);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setSelectedStatus(enquiry.status);
  };

  const handleSaveStatus = async () => {
    if (!onUpdateStatus || selectedStatus === enquiry.status) {
      setIsEditing(false);
      return;
    }

    setIsUpdating(true);
    try {
      await onUpdateStatus(enquiry.id, selectedStatus);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

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
                📧
              </div>
              <div>
                <h2 className="text-xl font-bold text-purple-100">Enquiry Details</h2>
                <div className="flex items-center mt-2">
                  <StatusBadge status={enquiry.status} />
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {!isEditing && onUpdateStatus && (
                <button
                  onClick={handleEditClick}
                  className="p-2 hover:bg-purple-500/20 rounded-full transition-colors"
                  title="Edit Status"
                >
                  <Edit size={20} className="text-purple-300" />
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 hover:bg-purple-500/20 rounded-full transition-colors"
              >
                <X size={24} className="text-purple-300" />
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-200px)] p-6 space-y-6 custom-scrollbar">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <InfoCard icon={User} label="Name" value={enquiry.name} />
            <InfoCard icon={Mail} label="Email" value={enquiry.email} />
            <InfoCard icon={FileText} label="Subject" value={enquiry.subject} />
            <InfoCard icon={Clock} label="Created At" value={formatDateTime(enquiry.createdAt)} />
            <InfoCard icon={Calendar} label="Updated At" value={formatDateTime(enquiry.updatedAt)} />
          </div>

          <div className="bg-gray-800/80 border border-purple-600/30 rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Flag size={18} className="text-purple-400" />
                <span className="ml-2 text-sm font-medium text-gray-300">Status</span>
              </div>
            </div>
            
            {isEditing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-3">
                  {statusOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setSelectedStatus(option.value)}
                      className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                        selectedStatus === option.value
                          ? 'border-purple-500 bg-purple-500/20'
                          : 'border-gray-600 bg-gray-700/50 hover:border-gray-500'
                      }`}
                    >
                      <span className={`font-medium ${option.color}`}>
                        {option.label}
                      </span>
                      {selectedStatus === option.value && (
                        <Check size={18} className="text-purple-400" />
                      )}
                    </button>
                  ))}
                </div>
                
                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-600">
                  <button
                    onClick={handleCancelEdit}
                    className="flex items-center px-4 py-2 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors"
                    disabled={isUpdating}
                  >
                    <Cancel size={16} className="mr-2" />
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveStatus}
                    className="flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-50"
                    disabled={isUpdating || selectedStatus === enquiry.status}
                  >
                    <Check size={16} className="mr-2" />
                    {isUpdating ? 'Updating...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <StatusBadge status={enquiry.status} />
                {onUpdateStatus && (
                  <button
                    onClick={handleEditClick}
                    className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    Edit Status
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="bg-gray-800/80 border border-purple-600/30 rounded-lg p-4 shadow-sm">
            <div className="flex items-center mb-4">
              <FileText size={18} className="text-purple-400" />
              <span className="ml-2 text-sm font-medium text-gray-300">Message</span>
            </div>
            <div className="bg-gray-900/60 border border-gray-700/50 rounded-lg p-4">
              <p className="text-white text-sm leading-relaxed whitespace-pre-wrap">
                {enquiry.message}
              </p>
            </div>
          </div>
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

        <style>{`
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

export default EnquiryDetailsModal; 