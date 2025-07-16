import React from 'react';
import { FiUser, FiMail, FiEye, FiCheckCircle, FiXCircle, FiCalendar, FiBriefcase, FiEdit, FiBook } from 'react-icons/fi';

interface ColumnConfig<T> {
  header: string;
  key: keyof T | string;
  render?: (item: T) => React.ReactNode;
  width?: string;
}

interface ActionConfig<T> {
  icon: React.ReactNode | ((item: T) => React.ReactNode);
  label: string | ((item: T) => string);
  onClick: (item: T) => void;
  color: 'blue' | 'green' | 'red';
  disabled?: boolean | ((item: T) => boolean);
}

interface ApplicationsTableProps<T> {
  data: T[];
  columns: ColumnConfig<T>[];
  actions?: ActionConfig<T>[];
  formatDate?: (date: string) => string;
}

const ApplicationsTable = <T extends { _id: string }>({
  data,
  columns,
  actions = [],
  formatDate,
}: ApplicationsTableProps<T>) => {
  console.log('data', data)
  console.log('column', columns)
  console.log(actions)
  return (
    <div className="overflow-hidden rounded-lg backdrop-blur-sm border border-purple-500/20">
      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-800/60 border-b border-purple-500/20">
              {columns.map((column, index) => (
                <TableHeader key={index} width={column.width}>
                  {column.header}
                </TableHeader>
              ))}
              {actions.length > 0 && (
                <TableHeader>Actions</TableHeader>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-purple-500/10">
            {data.map((item) => (
              <tr key={item._id} className="hover:bg-purple-900/10 transition-all duration-200">
                {columns.map((column, index) => (
                  <td
                    key={index}
                    className="px-4 py-4 whitespace-nowrap"
                    style={{ width: column.width }}
                  >
                    {column.render
                      ? column.render(item)
                      : (item[column.key as keyof T] as unknown as string) || 'N/A'}
                  </td>
                ))}
                {actions.length > 0 && (
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      {actions.map((action, idx) => {
                        const icon = typeof action.icon === 'function' ? action.icon(item) : action.icon;
                        const label = typeof action.label === 'function' ? action.label(item) : action.label;
                        const disabled = typeof action.disabled === 'function' ? action.disabled(item) : !!action.disabled;
                        return (
                          <ActionButton
                            key={idx}
                            icon={icon}
                            label={label}
                            onClick={() => action.onClick(item)}
                            color={action.color}
                            disabled={disabled}
                          />
                        );
                      })}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const TableHeader = ({ children, width }: { children: React.ReactNode; width?: string }) => (
  <th
    className="px-4 py-3.5 text-left text-xs font-medium text-purple-300 uppercase tracking-wider"
    style={{ width }}
  >
    {children}
  </th>
);

const StatusBadge = ({ status }: { status: string }) => {
  const getStatusStyles = () => {
    switch (status?.toLowerCase()) {
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
      role="status"
    >
      <span
        className="h-1.5 w-1.5 rounded-full mr-1.5"
        style={{
          boxShadow: `0 0 8px currentColor`,
          backgroundColor: 'currentColor',
        }}
      ></span>
      {status?.charAt(0).toUpperCase() + status?.slice(1) || 'Pending'}
    </span>
  );
};

const ActionButton = ({ icon, label, onClick, color, disabled }: ActionConfig<any>) => {
  const colors = {
    blue: 'text-blue-400 hover:bg-blue-900/30 border-blue-500/30 focus:ring-blue-500/50',
    green: 'text-green-400 hover:bg-green-900/30 border-green-500/30 focus:ring-green-500/50',
    red: 'text-red-400 hover:bg-red-900/30 border-red-500/30 focus:ring-red-500/50',
  };

  return (
    <button
      className={`p-1.5 border backdrop-blur-sm rounded-md focus:outline-none focus:ring-2 transition-all duration-300 hover:shadow-lg hover:shadow-${color}-500/20 ${colors[color]} ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      onClick={onClick}
      disabled={disabled}
      title={label}
      aria-label={label}
    >
      {icon}
    </button>
  );
};

export default ApplicationsTable;