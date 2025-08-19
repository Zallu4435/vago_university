import React from 'react';
import { ActionConfig, ApplicationsTableProps } from '../../../../domain/types/management';

const ApplicationsTable = <T extends { _id?: string; id?: string }>({
  data,
  columns,
  actions = [],
}: ApplicationsTableProps<T>) => {

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
              <tr key={item._id || item.id || Math.random().toString()} className="hover:bg-purple-900/10 transition-all duration-200">
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

const ActionButton = ({ icon, label, onClick, color, disabled }: ActionConfig<any>) => {
  const colors = {
    blue: 'text-blue-400 hover:bg-blue-900/30 border-blue-500/30 focus:ring-blue-500/50',
    green: 'text-green-400 hover:bg-green-900/30 border-green-500/30 focus:ring-green-500/50',
    red: 'text-red-400 hover:bg-red-900/30 border-red-500/30 focus:ring-red-500/50',
    yellow: 'text-yellow-400 hover:bg-yellow-900/30 border-yellow-500/30 focus:ring-yellow-500/50',
  };

  const resolvedLabel = typeof label === 'function' ? label({}) : label;
  const resolvedDisabled = typeof disabled === 'function' ? disabled({}) : !!disabled;
  const resolvedIcon = typeof icon === 'function' ? icon({}) : icon;

  return (
    <button
      className={`p-1.5 border backdrop-blur-sm rounded-md focus:outline-none focus:ring-2 transition-all duration-300 hover:shadow-lg hover:shadow-${color}-500/20 ${colors[color]} ${resolvedDisabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      onClick={onClick}
      disabled={resolvedDisabled}
      title={resolvedLabel}
      aria-label={resolvedLabel}
    >
      {resolvedIcon}
    </button>
  );
};

export default ApplicationsTable;