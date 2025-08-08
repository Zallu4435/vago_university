import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { Input } from '../../base/Input';
import { getNestedObjectError } from '../../../../shared/utils/formErrors';

const IELTSSection: React.FC = () => {
  const { control, formState: { errors } } = useFormContext();

  return (
    <div className="mb-8 bg-white rounded-lg border border-cyan-100 overflow-hidden">
      <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-4 border-b border-cyan-100">
        <h3 className="text-lg font-medium text-cyan-900">IELTS Test Score</h3>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="flex flex-col">
            <span className="text-cyan-700 text-sm font-medium mb-2">Test Type</span>
            <span className="text-cyan-900">IELTS</span>
          </div>
          <Controller
            name="international.ielts.date"
            control={control}
            render={({ field }) => (
              <Input
                name="ieltsDate"
                id="ieltsDate"
                label="Date Taken"
                value={field.value}
                onChange={field.onChange}
                placeholder="MM/YYYY"
                className="border-cyan-200 focus:border-cyan-400 focus:ring-cyan-200 bg-white"
                labelClassName="text-cyan-700"
                error={getNestedObjectError(errors, 'international.ielts', 'date')}
              />
            )}
          />
        </div>

        <div className="border border-cyan-200 rounded-lg overflow-hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-cyan-50">
                <th className="text-left p-3 text-cyan-800 font-medium border-b border-cyan-200">Component</th>
                <th className="text-left p-3 text-cyan-800 font-medium border-b border-cyan-200">Score</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-cyan-100">
                <td className="p-3 text-cyan-800">Overall Band</td>
                <td className="p-3">
                  <Controller
                    name="international.ielts.overall"
                    control={control}
                    render={({ field }) => (
                      <Input
                        name="ieltsOverall"
                        id="ieltsOverall"
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="0.0 to 9.0"
                        className="border-cyan-200 focus:border-cyan-400 focus:ring-cyan-200 bg-white"
                        error={getNestedObjectError(errors, 'international.ielts', 'overall')}
                      />
                    )}
                  />
                </td>
              </tr>
              <tr className="border-b border-cyan-100">
                <td className="p-3 text-cyan-800">Reading</td>
                <td className="p-3">
                  <Controller
                    name="international.ielts.reading"
                    control={control}
                    render={({ field }) => (
                      <Input
                        name="ieltsReading"
                        id="ieltsReading"
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="0.0 to 9.0"
                        className="border-cyan-200 focus:border-cyan-400 focus:ring-cyan-200 bg-white"
                        error={getNestedObjectError(errors, 'international.ielts', 'reading')}
                      />
                    )}
                  />
                </td>
              </tr>
              <tr>
                <td className="p-3 text-cyan-800">Writing</td>
                <td className="p-3">
                  <Controller
                    name="international.ielts.writing"
                    control={control}
                    render={({ field }) => (
                      <Input
                        name="ieltsWriting"
                        id="ieltsWriting"
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="0.0 to 9.0"
                        className="border-cyan-200 focus:border-cyan-400 focus:ring-cyan-200 bg-white"
                        error={getNestedObjectError(errors, 'international.ielts', 'writing')}
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

export default IELTSSection;