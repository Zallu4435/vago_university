import React from 'react';
import { 
  FiUser, 
  FiMail, 
  FiEye, 
  FiCheckCircle, 
  FiXCircle,
  FiCalendar,
  FiBriefcase
} from 'react-icons/fi';

const ApplicationsTable = ({
  filteredAdmissions,
  formatDate,
  handleViewDetails,
  handleActionClick,
  setAdmissionToDelete,
  setShowDeleteWarning
}) => {
  return (
    <div className="overflow-hidden rounded-lg backdrop-blur-sm border border-purple-500/20">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-800/60 border-b border-purple-500/20">
              <TableHeader>Applicant</TableHeader>
              <TableHeader>Email</TableHeader>
              <TableHeader>Program</TableHeader>
              <TableHeader>Applied On</TableHeader>
              <TableHeader>Status</TableHeader>
              <TableHeader>Actions</TableHeader>
            </tr>
          </thead>
          <tbody className="divide-y divide-purple-500/10">
            {filteredAdmissions.map((admission) => (
              <tr key={admission._id} className="hover:bg-purple-900/10 transition-all duration-200">
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white shadow-lg relative overflow-hidden">
                      <div className="absolute inset-0 bg-purple-500/20 backdrop-blur-sm"></div>
                      <span className="relative z-10 font-medium text-lg">{admission.fullName?.[0]?.toUpperCase() || <FiUser />}</span>
                    </div>
                    <div className="ml-3">
                      <p className="font-medium text-gray-200">{admission.fullName || 'N/A'}</p>
                      <p className="text-xs text-gray-400">ID: {admission._id.substring(0, 8)}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center text-gray-300">
                    <FiMail size={14} className="text-purple-400 mr-2" />
                    <span className="text-sm">{admission.email || 'N/A'}</span>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center text-gray-300">
                    <FiBriefcase size={14} className="text-purple-400 mr-2" />
                    <span className="text-sm">{admission.program || 'N/A'}</span>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center text-gray-300">
                    <FiCalendar size={14} className="text-purple-400 mr-2" />
                    <span className="text-sm">{formatDate(admission.createdAt)}</span>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <StatusBadge status={admission.status} />
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex space-x-2">
                    <ActionButton
                      icon={<FiEye size={16} />}
                      label="View Details"
                      onClick={() => handleViewDetails(admission)}
                      color="blue"
                    />
                    <ActionButton
                      icon={<FiCheckCircle size={16} />}
                      label="Take Action"
                      onClick={() => handleActionClick(admission)}
                      color="green"
                      disabled={admission.status !== 'pending'}
                    />
                    <ActionButton
                      icon={<FiXCircle size={16} />}
                      label="Delete"
                      onClick={() => {
                        setAdmissionToDelete(admission);
                        setShowDeleteWarning(true);
                      }}
                      color="red"
                      disabled={admission.status !== 'pending'}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const TableHeader = ({ children }) => (
  <th className="px-4 py-3.5 text-left text-xs font-medium text-purple-300 uppercase tracking-wider">
    {children}
  </th>
);

const StatusBadge = ({ status }) => {
  const getStatusStyles = () => {
    switch (status) {
      case 'approved':
        return 'bg-green-900/30 text-green-400 border-green-500/30';
      case 'rejected':
        return 'bg-red-900/30 text-red-400 border-red-500/30';
      case 'pending':
      default:
        return 'bg-yellow-900/30 text-yellow-400 border-yellow-500/30';
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusStyles()}`}
    >
      <span className="h-1.5 w-1.5 rounded-full mr-1.5" style={{ 
        boxShadow: `0 0 8px currentColor`,
        backgroundColor: 'currentColor'
      }}></span>
      {status?.charAt(0).toUpperCase() + status?.slice(1) || 'Pending'}
    </span>
  );
};

const ActionButton = ({ icon, label, onClick, color, disabled }) => {
  const colors = {
    blue: "text-blue-400 hover:bg-blue-900/30 border-blue-500/30 focus:ring-blue-500/50",
    green: "text-green-400 hover:bg-green-900/30 border-green-500/30 focus:ring-green-500/50",
    red: "text-red-400 hover:bg-red-900/30 border-red-500/30 focus:ring-red-500/50",
  };

  return (
    <button
      className={`p-1.5 border backdrop-blur-sm rounded-md focus:outline-none focus:ring-2 transition-all duration-300 hover:shadow-lg hover:shadow-${color}-500/20 ${colors[color]} ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      onClick={onClick}
      disabled={disabled}
      title={label}
    >
      {icon}
    </button>
  );
};

export default ApplicationsTable;