import React from 'react';
import { IoCloseOutline as X, IoBusinessOutline as Building, IoPersonOutline as User, IoPeopleOutline as Users } from 'react-icons/io5';

interface Event {
  id: string;
  name: string;
  organizer: string;
  organizerType: string;
  type: string;
  date: string;
  time: string;
  venue: string;
  status: string;
  description: string;
  maxParticipants: number;
  registrationRequired: boolean;
  participants: number;
  createdAt: string;
}

interface EventRequest {
  id: string;
  eventName: string;
  requestedBy: string;
  requesterType: string;
  type: string;
  proposedDate: string;
  proposedVenue: string;
  status: string;
  requestedAt: string;
  description: string;
  expectedParticipants: number;
}

interface EventDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event | EventRequest;
  onEdit?: (event: Event) => void;
}

const StatusBadge = ({ status }: { status: string }) => {
  const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border";
  if (status === 'upcoming') {
    return <span className={`${baseClasses} bg-blue-900/30 text-blue-400 border-blue-500/30`}>● Upcoming</span>;
  } else if (status === 'completed') {
    return <span className={`${baseClasses} bg-green-900/30 text-green-400 border-green-500/30`}>● Completed</span>;
  } else if (status === 'cancelled') {
    return <span className={`${baseClasses} bg-red-900/30 text-red-400 border-red-500/30`}>● Cancelled</span>;
  } else if (status === 'pending') {
    return <span className={`${baseClasses} bg-yellow-900/30 text-yellow-400 border-yellow-500/30`}>● Pending</span>;
  } else if (status === 'approved') {
    return <span className={`${baseClasses} bg-green-900/30 text-green-400 border-green-500/30`}>● Approved</span>;
  } else if (status === 'rejected') {
    return <span className={`${baseClasses} bg-red-900/30 text-red-400 border-red-500/30`}>● Rejected</span>;
  }
  return null;
};

const EventDetailsModal: React.FC<EventDetailsModalProps> = ({
  isOpen,
  onClose,
  event,
  onEdit,
}) => {
  if (!isOpen || !event) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-gray-800 border-purple-500/20">
        <div className="mt-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-white">Event Details</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-200">
              <X size={20} />
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Event Name</label>
              <p className="text-sm text-gray-200">
                {'name' in event ? event.name : event.eventName}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Event ID</label>
              <p className="text-sm text-gray-200">{event.id}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Organizer</label>
              <div className="flex items-center">
                {'organizerType' in event
                  ? event.organizerType === 'department'
                    ? <Building size={14} className="text-purple-400 mr-2" />
                    : event.organizerType === 'club'
                    ? <Users size={14} className="text-purple-400 mr-2" />
                    : <User size={14} className="text-purple-400 mr-2" />
                  : event.requesterType === 'department'
                  ? <Building size={14} className="text-purple-400 mr-2" />
                  : event.requesterType === 'club'
                  ? <Users size={14} className="text-purple-400 mr-2" />
                  : <User size={14} className="text-purple-400 mr-2" />
                }
                <span className="text-sm text-gray-200">
                  {'organizer' in event ? event.organizer : event.requestedBy}
                </span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Type</label>
              <p className="text-sm text-gray-200 capitalize">{event.type}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Date</label>
              <p className="text-sm text-gray-200">
                {'date' in event ? event.date : event.proposedDate}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Time</label>
              <p className="text-sm text-gray-200">
                {'time' in event ? event.time : 'TBD'}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Venue</label>
              <p className="text-sm text-gray-200">
                {'venue' in event ? event.venue : event.proposedVenue}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
              <StatusBadge status={event.status} />
            </div>
            {'participants' in event && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Participants</label>
                <p className="text-sm text-gray-200">
                  {event.participants}/{event.maxParticipants}
                </p>
              </div>
            )}
            {'expectedParticipants' in event && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Expected Participants</label>
                <p className="text-sm text-gray-200">{event.expectedParticipants}</p>
              </div>
            )}
            {event.description && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                <p className="text-sm text-gray-200">{event.description}</p>
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
            {'name' in event && onEdit && (
              <button
                onClick={() => {
                  onClose();
                  onEdit(event);
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-md hover:bg-purple-700"
              >
                Edit Event
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsModal;