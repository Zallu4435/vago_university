import React from 'react';
import { IoCloseOutline as X, IoBusinessOutline as Building, IoPersonOutline as User } from 'react-icons/io5';

interface Club {
  id: string;
  name: string;
  category: string;
  createdBy: string;
  createdDate: string;
  members: number;
  status: string;
}

interface ClubRequest {
  id: string;
  clubName: string;
  requestedBy: string;
  category: string;
  reason: string;
  requestedAt: string;
  status: string;
}

interface ClubDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  club: Club | ClubRequest;
  onEdit?: (club: Club) => void;
}

const StatusBadge = ({ status }: { status: string }) => {
  const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border";
  if (status === 'Active') {
    return <span className={`${baseClasses} bg-green-900/30 text-green-400 border-green-500/30`}>● Active</span>;
  } else if (status === 'Inactive') {
    return <span className={`${baseClasses} bg-red-900/30 text-red-400 border-red-500/30`}>● Inactive</span>;
  } else if (status === 'Pending') {
    return <span className={`${baseClasses} bg-yellow-900/30 text-yellow-400 border-yellow-500/30`}>● Pending</span>;
  } else if (status === 'Approved') {
    return <span className={`${baseClasses} bg-green-900/30 text-green-400 border-green-500/30`}>● Approved</span>;
  } else if (status === 'Rejected') {
    return <span className={`${baseClasses} bg-red-900/30 text-red-400 border-red-500/30`}>● Rejected</span>;
  }
  return null;
};

const ClubDetailsModal: React.FC<ClubDetailsModalProps> = ({
  isOpen,
  onClose,
  club,
  onEdit,
}) => {
  if (!isOpen || !club) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-gray-800 border-purple-500/20">
        <div className="mt-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-white">Club Details</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-200">
              <X size={20} />
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Club Name</label>
              <p className="text-sm text-gray-200">
                {'name' in club ? club.name : club.clubName}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Club ID</label>
              <p className="text-sm text-gray-200">{club.id}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Created By</label>
              <div className="flex items-center">
                {'createdBy' in club && club.createdBy.includes('Admin') ? (
                  <Building size={14} className="text-purple-400 mr-2" />
                ) : (
                  <User size={14} className="text-purple-400 mr-2" />
                )}
                <span className="text-sm text-gray-200">
                  {'createdBy' in club ? club.createdBy : club.requestedBy}
                </span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
              <p className="text-sm text-gray-200 capitalize">{club.category}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Date</label>
              <p className="text-sm text-gray-200">
                {'createdDate' in club ? club.createdDate : club.requestedAt}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
              <StatusBadge status={club.status} />
            </div>
            {'members' in club && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Members</label>
                <p className="text-sm text-gray-200">{club.members}</p>
              </div>
            )}
            {'reason' in club && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Reason</label>
                <p className="text-sm text-gray-200">{club.reason}</p>
              </div>
            )}
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 border border-gray-600 rounded-md hover:bg-gray-600"
            >
              Close
            </button>
            {'name' in club && onEdit && (
              <button
                onClick={() => {
                  onClose();
                  onEdit(club);
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-md hover:bg-purple-700"
              >
                Edit Club
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClubDetailsModal;