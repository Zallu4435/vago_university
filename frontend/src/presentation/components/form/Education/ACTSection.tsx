import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { Input } from '../../Input';

const ACTSection: React.FC = () => {
  const { control, formState: { errors } } = useFormContext();

  return (
    <div className="mb-8 bg-white rounded-lg border border-cyan-100 overflow-hidden">
      <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-4 border-b border-cyan-100">
        <h3 className="text-lg font-medium text-cyan-900">ACT Test Score</h3>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="flex flex-col">
            <span className="text-cyan-700 text-sm font-medium mb-2">Test Type</span>
            <span className="text-cyan-900">ACT</span>
          </div>
          <Controller
            name="international.act.date"
            control={control}
            render={({ field }) => (
              <Input
                id="actDate"
                label="Date Taken"
                value={field.value}
                onChange={field.onChange}
                placeholder="MM/YYYY"
                className="border-cyan-200 focus:border-cyan-400 focus:ring-cyan-200 bg-white"
                labelClassName="text-cyan-700"
                error={errors.international?.act?.date?.message}
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
                <td className="p-3 text-cyan-800">ACT Composite</td>
                <td className="p-3">
                  <Controller
                    name="international.act.composite"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="actComposite"
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="1-36"
                        className="border-cyan-200 focus:border-cyan-400 focus:ring-cyan-200 bg-white"
                        error={errors.international?.act?.composite?.message}
                      />
                    )}
                  />
                </td>
              </tr>
              <tr className="border-b border-cyan-100">
                <td className="p-3 text-cyan-800">ACT English</td>
                <td className="p-3">
                  <Controller
                    name="international.act.english"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="actEnglish"
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="1-36"
                        className="border-cyan-200 focus:border-cyan-400 focus:ring-cyan-200 bg-white"
                        error={errors.international?.act?.english?.message}
                      />
                    )}
                  />
                </td>
              </tr>
              <tr className="border-b border-cyan-100">
                <td className="p-3 text-cyan-800">ACT Math</td>
                <td className="p-3">
                  <Controller
                    name="international.act.math"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="actMath"
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="1-36"
                        className="border-cyan-200 focus:border-cyan-400 focus:ring-cyan-200 bg-white"
                        error={errors.international?.act?.math?.message}
                      />
                    )}
                  />
                </td>
              </tr>
              <tr className="border-b border-cyan-100">
                <td className="p-3 text-cyan-800">ACT Reading</td>
                <td className="p-3">
                  <Controller
                    name="international.act.reading"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="actReading"
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="1-36"
                        className="border-cyan-200 focus:border-cyan-400 focus:ring-cyan-200 bg-white"
                        error={errors.international?.act?.reading?.message}
                      />
                    )}
                  />
                </td>
              </tr>
              <tr className="border-b border-cyan-100">
                <td className="p-3 text-cyan-800">ACT Science</td>
                <td className="p-3">
                  <Controller
                    name="international.act.science"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="actScience"
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="1-36"
                        className="border-cyan-200 focus:border-cyan-400 focus:ring-cyan-200 bg-white"
                        error={errors.international?.act?.science?.message}
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

export default ACTSection;