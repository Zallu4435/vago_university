import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { Input } from '../../base/Input';

const PTESection: React.FC = () => {
  const { control, formState: { errors } } = useFormContext();

  return (
    <div className="mb-8 bg-white rounded-lg border border-cyan-100 overflow-hidden">
      <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-4 border-b border-cyan-100">
        <h3 className="text-lg font-medium text-cyan-900">PTE Academic Test Score</h3>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="flex flex-col">
            <span className="text-cyan-700 text-sm font-medium mb-2">Test Type</span>
            <span className="text-cyan-900">PTE Academic</span>
          </div>
          <Controller
            name="international.pte.date"
            control={control}
            render={({ field }) => (
              <Input
                id="pteDate"
                label="Date Taken"
                value={field.value}
                onChange={field.onChange}
                placeholder="MM/YYYY"
                className="border-cyan-200 focus:border-cyan-400 focus:ring-cyan-200 bg-white"
                labelClassName="text-cyan-700"
                error={errors.international?.pte?.date?.message}
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
              <tr>
                <td className="border-b border-cyan-200 p-3 text-cyan-900">PTE Overall</td>
                <td className="border-b border-cyan-200 p-3">
                  <Controller
                    name="international.pte.overall"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="pteOverall"
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="<10 to 90 inclusive>"
                        className="border-cyan-200 focus:border-cyan-400 focus:ring-cyan-200 bg-white"
                        error={errors.international?.pte?.overall?.message}
                      />
                    )}
                  />
                </td>
              </tr>
              <tr>
                <td className="border-b border-cyan-200 p-3 text-cyan-900">PTE Reading</td>
                <td className="border-b border-cyan-200 p-3">
                  <Controller
                    name="international.pte.reading"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="pteReading"
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="<10 to 90 inclusive>"
                        className="border-cyan-200 focus:border-cyan-400 focus:ring-cyan-200 bg-white"
                        error={errors.international?.pte?.reading?.message}
                      />
                    )}
                  />
                </td>
              </tr>
              <tr>
                <td className="p-3 text-cyan-900">PTE Writing</td>
                <td className="p-3">
                  <Controller
                    name="international.pte.writing"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="pteWriting"
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="<10 to 90 inclusive>"
                        className="border-cyan-200 focus:border-cyan-400 focus:ring-cyan-200 bg-white"
                        error={errors.international?.pte?.writing?.message}
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

export default PTESection;