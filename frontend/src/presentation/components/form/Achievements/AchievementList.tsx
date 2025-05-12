import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Button } from '../../Button';
import { columns } from './options';

interface Achievement {
  activity: string;
  level: string;
  levelOfAchievement: string;
  positionHeld: string;
  organizationName: string;
  fromDate: string;
  toDate: string;
  description: string;
}

interface Props {
  achievements: Achievement[];
  onAdd: () => void;
  onEdit: (achievement: Achievement, index: number) => void;
  onRemove: (index: number) => void;
  max: number;
  hasNoAchievements: boolean;
  onToggleNoAchievements: () => void;
}

export const AchievementList: React.FC<Props> = ({ 
  achievements, 
  onAdd, 
  onEdit,
  onRemove,
  max,
  hasNoAchievements,
  onToggleNoAchievements
}) => {
  const { formState: { errors } } = useFormContext();

  return (
    <div className="mb-8 bg-white rounded-xl border border-cyan-100 overflow-hidden">
      <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-4 border-b border-cyan-100">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-cyan-900">Your Achievements</h3>
          <div className="flex items-center space-x-4">
            <label className="flex items-center text-sm text-cyan-700">
              <input
                type="checkbox"
                checked={hasNoAchievements}
                onChange={onToggleNoAchievements}
                className="form-checkbox h-4 w-4 text-cyan-600 border-cyan-300 rounded focus:ring-cyan-200"
              />
              <span className="ml-2">No Achievements to Report</span>
            </label>
            <span className="text-cyan-600 text-sm">(Max {max} Achievements)</span>
            <Button
              label="Add Achievement"
              onClick={onAdd}
              disabled={achievements.length >= max || hasNoAchievements}
              className="bg-gradient-to-r from-cyan-400 to-blue-400 text-white px-4 py-2 rounded-lg hover:from-cyan-500 hover:to-blue-500 transition-all duration-300 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
        </div>
      </div>

      <div className="p-6">
        {errors.achievements?.achievements && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded mb-6">
            <p className="text-sm text-red-700">{errors.achievements.achievements.message}</p>
          </div>
        )}

        <div className="border border-cyan-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-cyan-50 border-b border-cyan-200">
                  {columns.map((col, idx) => (
                    <th key={idx} className="px-6 py-3 text-left text-cyan-800 font-medium whitespace-nowrap" style={{ minWidth: col.width }}>
                      {col.label}
                    </th>
                  ))}
                  <th className="px-6 py-3 text-left text-cyan-800 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {hasNoAchievements ? (
                  <tr>
                    <td colSpan={columns.length + 1} className="px-6 py-8 text-center text-cyan-600 bg-cyan-50/30">
                      <p className="font-medium">No Achievements to Report</p>
                      <p className="text-sm mt-1">You have indicated that you have no achievements to list</p>
                    </td>
                  </tr>
                ) : achievements.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length + 1} className="px-6 py-4 text-center text-cyan-600">
                      No record(s)
                    </td>
                  </tr>
                ) : (
                  achievements.map((achievement, index) => (
                    <tr key={index} className="border-b border-cyan-100 hover:bg-cyan-50">
                      {columns.map((col, idx) => (
                        <td key={idx} className="px-6 py-4 text-cyan-800" style={{ minWidth: col.width }}>
                          {col.key === 'index' ? index + 1 : achievement[col.key as keyof Achievement]}
                        </td>
                      ))}
                      <td className="px-6 py-4 whitespace-nowrap flex space-x-2">
                        <Button
                          label="Edit"
                          onClick={() => onEdit(achievement, index)}
                          className="text-cyan-600 hover:text-cyan-700 border border-cyan-200 hover:bg-cyan-50 px-3 py-1 rounded-md transition-all duration-300"
                        />
                        <Button
                          label="Remove"
                          onClick={() => onRemove(index)}
                          className="text-red-600 hover:text-red-700 border border-red-200 hover:bg-red-50 px-3 py-1 rounded-md transition-all duration-300"
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};