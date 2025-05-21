import React from 'react';
import { FiClock, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { FaHandHoldingUsd } from 'react-icons/fa'; // optional: new icon for 'offered'

const StatusBadge = ({ status }) => {
    console.log(status)
  const statusConfig = {
    pending: {
      icon: <FiClock size={14} className="mr-1" />,
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-800',
      label: 'Pending',
    },
    approved: {
      icon: <FiCheckCircle size={14} className="mr-1" />,
      bgColor: 'bg-green-100',
      textColor: 'text-green-800',
      label: 'Approved',
    },
    rejected: {
      icon: <FiXCircle size={14} className="mr-1" />,
      bgColor: 'bg-red-100',
      textColor: 'text-red-800',
      label: 'Rejected',
    },
    offered: {
      icon: <FaHandHoldingUsd size={14} className="mr-1" />, // optional, can use another if preferred
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-800',
      label: 'Offered',
    },
  };

  console.log(status)

  const { icon, bgColor, textColor, label } = statusConfig[status] || statusConfig.pending;

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${bgColor} ${textColor} shadow-sm`}
    >
      {icon}
      {label}
    </span>
  );
};

export default StatusBadge;
