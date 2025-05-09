import React from 'react';

interface HealthCondition {
  condition: string;
  details: string;
}

interface HealthConditionTableProps {
  conditions: HealthCondition[];
}

const HealthConditionTable: React.FC<HealthConditionTableProps> = ({ conditions }) => {
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
          </tr>
        </thead>
        <tbody>
          {conditions.length === 0 ? (
            <tr>
              <td 
                className="px-6 py-4 text-center text-cyan-600" 
                colSpan={2}
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
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};


export default HealthConditionTable;
