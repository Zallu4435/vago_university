import React from 'react';
import { Button } from '../../base/Button';
import type { HealthConditionTableProps } from '../../../../domain/types/application';

const HealthConditionTable: React.FC<HealthConditionTableProps> = ({ conditions, onRemove, onEdit }) => {
  return (
    <div className="border border-cyan-200 rounded-lg overflow-hidden">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-cyan-50 border-b border-cyan-200">
            <th className="px-6 py-3 text-left text-cyan-800 font-medium">
              Health and Support Condition
            </th>
            <th className="px-6 py-3 text-left text-cyan-800 font-medium">
              Health and Support Condition Details*
            </th>
            <th className="px-6 py-3 text-left text-cyan-800 font-medium">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {conditions.length === 0 ? (
            <tr>
              <td 
                className="px-6 py-4 text-center text-cyan-600" 
                colSpan={3}
              >
                No record(s)
              </td>
            </tr>
          ) : (
            conditions.map((condition, index) => (
              <tr 
                key={index} 
                className="border-b border-cyan-100 hover:bg-cyan-50"
              >
                <td className="px-6 py-4 text-cyan-800">
                  {condition.condition}
                </td>
                <td className="px-6 py-4 text-cyan-800">
                  {condition.details}
                </td>
                <td className="px-6 py-4 flex space-x-2">
                  <Button
                    label="Edit"
                    variant="outline"
                    onClick={() => onEdit(index)}
                    className="text-cyan-600 border-cyan-200 hover:bg-cyan-50 px-3 py-1"
                  />
                  <Button
                    label="Remove"
                    variant="outline"
                    onClick={() => onRemove(index)}
                    className="text-red-600 border-red-200 hover:bg-red-50 px-3 py-1"
                  />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default HealthConditionTable;