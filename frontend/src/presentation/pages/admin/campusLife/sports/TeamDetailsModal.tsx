import React from 'react';
import { IoCloseOutline as X, IoCreateOutline as Edit, IoPeopleOutline as Users, IoPersonOutline as User, IoTrophyOutline as Trophy, IoCalendarOutline as Calendar, IoInformationCircleOutline as Info, IoBusinessOutline as Building, IoStarOutline as Star } from 'react-icons/io5';

interface UpcomingGame {
  date: string;
  description: string;
  _id: string;
}

interface Team {
  id: string;
  name: string;
  sportType: string;
  category: string;
  organizer: string;
  organizerType: string;
  logo: string;
  color: string;
  division: string;
  coach: string;
  homeGames: number;
  record: string;
  upcomingGames: UpcomingGame[];
  playerCount: number;
  status: string;
  formedOn: string;
  description?: string;
}

interface TeamDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  team: Team | null;
  onEdit: (team: Team) => void;
}

const StatusBadge = ({ status }: { status: string }) => {
  const statusConfig = {
    active: {
      bg: 'bg-gradient-to-r from-green-500/20 to-teal-500/20',
      text: 'text-green-300',
      border: 'border-green-400/30',
      glow: 'shadow-green-500/20',
      icon: '✨',
    },
    pending: {
      bg: 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20',
      text: 'text-yellow-300',
      border: 'border-yellow-400/30',
      glow: 'shadow-yellow-500/20',
      icon: '⏳',
    },
    rejected: {
      bg: 'bg-gradient-to-r from-red-500/20 to-rose-500/20',
      text: 'text-red-300',
      border: 'border-red-400/30',
      glow: 'shadow-red-500/20',
      icon: '🚫',
    },
  };

  const config = statusConfig[status.toLowerCase()] || statusConfig.pending;

  return (
    <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold border backdrop-blur-sm shadow-lg ${config.bg} ${config.text} ${config.border} ${config.glow}`}>
      <span className="mr-2 text-base">{config.icon}</span>
      <span className="capitalize">{status}</span>
    </div>
  );
};

const InfoCard = ({ icon: Icon, label, value, accent = 'purple' }: { icon: React.ElementType; label: string; value: string | number; accent?: string }) => {
  const accentColors = {
    purple: 'border-purple-400/30 bg-purple-500/10 text-purple-300',
    blue: 'border-blue-400/30 bg-blue-500/10 text-blue-300',
    green: 'border-green-400/30 bg-green-500/10 text-green-300',
    pink: 'border-pink-400/30 bg-pink-500/10 text-pink-300',
    cyan: 'border-cyan-400/30 bg-cyan-500/10 text-cyan-300',
  };

  return (
    <div className={`group relative overflow-hidden rounded-xl border backdrop-blur-sm p-4 transition-all duration-300 hover:scale-105 hover:shadow-lg ${accentColors[accent]}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="relative z-10">
        <div className="flex items-center space-x-3 mb-2">
          <div className={`p-2 rounded-lg bg-gradient-to-br from-${accent}-400/20 to-${accent}-600/20 border border-${accent}-400/30`}>
            <Icon size={18} className={`text-${accent}-300`} />
          </div>
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">{label}</span>
        </div>
        <p className="text-white font-medium leading-relaxed">{value}</p>
      </div>
    </div>
  );
};

const TeamDetailsModal: React.FC<TeamDetailsModalProps> = ({ isOpen, onClose, team, onEdit }) => {
  if (!isOpen || !team) return null;

  const getOrganizerIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'student': return Users;
      case 'club': return Building;
      default: return User;
    }
  };

  const OrganizerIcon = getOrganizerIcon(team.organizerType);

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-4xl mx-auto">
        {/* Main Modal Container */}
        <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-purple-500/30 rounded-2xl shadow-2xl overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-transparent to-blue-600/10"></div>
          <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

          {/* Header Section */}
          <div className="relative z-10 px-8 py-6 border-b border-purple-500/20 bg-gradient-to-r from-purple-900/20 to-blue-900/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="text-4xl">{team.logo}</div>
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                    {team.name}
                  </h2>
                  <p className="text-sm text-gray-400 mt-1">Team ID: {team.id}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => onEdit(team)}
                  className="p-2 rounded-full bg-gray-800/50 border border-gray-600/30 hover:bg-gray-700/50 transition-all duration-200 hover:scale-110"
                >
                  <Edit size={20} className="text-purple-400 hover:text-purple-300" />
                </button>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full bg-gray-800/50 border border-gray-600/30 hover:bg-gray-700/50 transition-all duration-200 hover:scale-110"
                >
                  <X size={20} className="text-gray-400 hover:text-white" />
                </button>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="relative z-10 p-8">
            {/* Status and Key Info Row */}
            <div className="flex flex-wrap items-center justify-between mb-8 gap-4">
              <StatusBadge status={team.status} />
              <div className="flex items-center space-x-6 text-sm text-gray-300">
                <div className="flex items-center space-x-2">
                  <Users size={16} className="text-green-400" />
                  <span>{team.playerCount} players</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar size={16} className="text-purple-400" />
                  <span>{new Date(team.formedOn).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Main Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <InfoCard icon={Trophy} label="Sport Type" value={team.sportType} accent="purple" />
              <InfoCard icon={User} label="Coach" value={team.coach} accent="blue" />
              <InfoCard icon={Users} label="Player Count" value={team.playerCount} accent="green" />
              <InfoCard icon={Calendar} label="Formed On" value={new Date(team.formedOn).toLocaleDateString()} accent="pink" />
              <InfoCard icon={Star} label="Division" value={team.division} accent="cyan" />
              <InfoCard icon={OrganizerIcon} label="Organizer" value={team.organizer} accent="purple" />
              <InfoCard icon={Building} label="Category" value={team.category} accent="blue" />
              <InfoCard icon={Trophy} label="Record" value={team.record} accent="green" />
              <InfoCard icon={Users} label="Home Games" value={team.homeGames} accent="pink" />
            </div>

            {/* Description Section */}
            {team.description && (
              <div className="mb-8">
                <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-xl p-6 border border-purple-500/20 backdrop-blur-sm">
                  <div className="flex items-center space-x-2 mb-4">
                    <Info size={20} className="text-purple-400" />
                    <h3 className="text-lg font-semibold text-white">Team Description</h3>
                  </div>
                  <p className="text-gray-300 leading-relaxed">{team.description}</p>
                </div>
              </div>
            )}

            {/* Upcoming Games Section */}
            {team.upcomingGames.length > 0 && (
              <div className="mb-8">
                <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-xl p-6 border border-blue-500/20 backdrop-blur-sm">
                  <div className="flex items-center space-x-2 mb-4">
                    <Calendar size={20} className="text-blue-400" />
                    <h3 className="text-lg font-semibold text-white">Upcoming Games</h3>
                  </div>
                  <ul className="space-y-4">
                    {team.upcomingGames.map((game) => (
                      <li key={game._id} className="flex items-center space-x-4 text-gray-300">
                        <span className="text-sm font-medium text-blue-300">{new Date(game.date).toLocaleString()}</span>
                        <span className="text-sm">{game.description}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
              <button
                onClick={onClose}
                className="px-6 py-3 text-sm font-medium text-gray-300 bg-gray-800/50 border border-gray-600/30 rounded-xl hover:bg-gray-700/50 transition-all duration-200 backdrop-blur-sm"
              >
                Close
              </button>
              <button
                onClick={() => {
                  onClose();
                  onEdit(team);
                }}
                className="px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 border border-transparent rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-purple-500/25 transform hover:scale-105"
              >
                Edit Team
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamDetailsModal;