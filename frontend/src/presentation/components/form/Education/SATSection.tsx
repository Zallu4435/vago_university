import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { Input } from '../../Input';

const SATSection: React.FC = () => {
  const { control, formState: { errors } } = useFormContext();

  return (
    <div className="mb-8 bg-white rounded-lg border border-cyan-100 overflow-hidden">
      <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-4 border-b border-cyan-100">
        <h3 className="text-lg font-medium text-cyan-900">SAT Test Score</h3>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="flex flex-col">
            <span className="text-cyan-700 text-sm font-medium mb-2">Test Type</span>
            <span className="text-cyan-900">SAT</span>
          </div>
          <Controller
            name="international.sat.date"
            control={control}
            render={({ field }) => (
              <Input
                id="satDate"
                label="Date Taken"
                value={field.value}
                onChange={field.onChange}
                placeholder="MM/YYYY"
                className="border-cyan-200 focus:border-cyan-400 focus:ring-cyan-200 bg-white"
                labelClassName="text-cyan-700"
                error={errors.international?.sat?.date?.message}
              />
            )}
          />
        </div>

        <div className="border border-cyan-200 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-cyan-50 border-b border-cyan-200">
                <th className="text-left p-3 text-cyan-800 font-medium">Component</th>
                <th className="text-left p-3 text-cyan-800 font-medium">Score</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-cyan-100">
                <td className="p-3 text-cyan-800">SAT Math</td>
                <td className="p-3">
                  <Controller
                    name="international.sat.math"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="satMath"
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="200-800"
                        className="border-cyan-200 focus:border-cyan-400 focus:ring-cyan-200 bg-white"
                        error={errors.international?.sat?.math?.message}
                      />
                    )}
                  />
                </td>
              </tr>
              <tr className="border-b border-cyan-100">
                <td className="p-3 text-cyan-800">SAT Reading & Writing</td>
                <td className="p-3">
                  <Controller
                    name="international.sat.reading"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="satReading"
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="200-800"
                        className="border-cyan-200 focus:border-cyan-400 focus:ring-cyan-200 bg-white"
                        error={errors.international?.sat?.reading?.message}
                      />
                    )}
                  />
                </td>
              </tr>
              <tr className="border-b border-cyan-100">
                <td className="p-3 text-cyan-800">SAT Essay</td>
                <td className="p-3">
                  <Controller
                    name="international.sat.essay"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="satEssay"
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="2-8"
                        className="border-cyan-200 focus:border-cyan-400 focus:ring-cyan-200 bg-white"
                        error={errors.international?.sat?.essay?.message}
                      />
                    )}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SATSection;