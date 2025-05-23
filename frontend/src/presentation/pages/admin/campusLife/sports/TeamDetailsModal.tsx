// src/presentation/pages/admin/campusLife/sports/TeamDetailsModal.tsx
import React from 'react';
import { IoCloseOutline as X, IoCreateOutline as Edit } from 'react-icons/io5';

interface Team {
  id: string;
  name: string;
  sportType: string;
  coach: string;
  playerCount: number;
  status: string;
  formedOn: string;
  logo: string;
}

interface TeamDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  team: Team | null;
  onEdit: (team: Team) => void;
}

const TeamDetailsModal: React.FC<TeamDetailsModalProps> = ({
  isOpen,
  onClose,
  team,
  onEdit,
}) => {
  if (!isOpen || !team) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-gray-800 border-purple-500/20">
        <div className="mt-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-white">Team Details</h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onEdit(team)}
                className="text-purple-400 hover:text-purple-300"
              >
                <Edit size={20} />
              </button>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-200">
                <X size={20} />
              </button>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <span className="text-4xl">{team.logo}</span>
              <div>
                <h4 className="text-xl font-medium text-white">{team.name}</h4>
                <p className="text-sm text-gray-400">ID: {team.id}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400">Sport Type</label>
                <p className="mt-1 text-white">{team.sportType}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400">Coach</label>
                <p className="mt-1 text-white">{team.coach}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400">Player Count</label>
                <p className="mt-1 text-white">{team.playerCount}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400">Status</label>
                <p className="mt-1 text-white">{team.status}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400">Formed On</label>
                <p className="mt-1 text-white">{team.formedOn}</p>
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 border border-gray-600 rounded-md hover:bg-gray-600"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamDetailsModal;