import React from 'react';
import { useFormContext, Controller, useFieldArray } from 'react-hook-form';
import { Input } from '../../base/Input';
import { Button } from '../../base/Button';

const APSection: React.FC = () => {
  const { control, formState: { errors } } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'international.ap.subjects',
  });

  return (
    <div className="mb-8 bg-white rounded-lg border border-cyan-100 overflow-hidden">
      <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-4 border-b border-cyan-100">
        <h3 className="text-lg font-medium text-cyan-900">AP Test Score</h3>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="flex flex-col">
            <span className="text-cyan-700 text-sm font-medium mb-2">Test Type</span>
            <span className="text-cyan-900">Advanced Placement (AP)</span>
          </div>
          <Controller
            name="international.ap.date"
            control={control}
            render={({ field }) => (
              <Input
                id="apDate"
                label="Date Taken"
                value={field.value}
                onChange={field.onChange}
                placeholder="MM/YYYY"
                className="border-cyan-200 focus:border-cyan-400 focus:ring-cyan-200 bg-white"
                labelClassName="text-cyan-700"
                error={errors.international?.ap?.date?.message}
              />
            )}
          />
        </div>

        <div className="border border-cyan-200 rounded-lg overflow-hidden">
          <div className="flex justify-between p-4 bg-gradient-to-r from-cyan-50 to-blue-50 border-b border-cyan-100">
            <h4 className="text-lg font-medium text-cyan-800">Subjects</h4>
            <Button
              label="Add Subject"
              onClick={() => append({ subject: '', score: '' })}
              variant="primary"
              className="bg-gradient-to-r from-cyan-400 to-blue-400 text-white px-4 py-2 rounded-lg hover:from-cyan-500 hover:to-blue-500 transition-all duration-300 shadow-sm"
            />
          </div>
          <table className="w-full">
            <thead>
              <tr className="bg-cyan-50 border-b border-cyan-200">
                <th className="text-left p-3 text-cyan-800 font-medium">Subject</th>
                <th className="text-left p-3 text-cyan-800 font-medium">Score</th>
                <th className="text-left p-3 text-cyan-800 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {fields.length === 0 ? (
                <tr>
                  <td className="p-3 text-gray-500" colSpan={3}>No subjects added</td>
                </tr>
              ) : (
                fields.map((field, index) => (
                  <tr key={field.id} className="border-b border-cyan-100">
                    <td className="p-3">
                      <Controller
                        name={`international.ap.subjects[${index}].subject`}
                        control={control}
                        render={({ field: subField }) => (
                          <Input
                            id={`apSubject-${index}`}
                            value={subField.value}
                            onChange={subField.onChange}
                            placeholder="AP Subject Name"
                            className="border-cyan-200 focus:border-cyan-400 focus:ring-cyan-200 bg-white"
                            error={errors.international?.ap?.subjects?.[index]?.subject?.message}
                          />
                        )}
                      />
                    </td>
                    <td className="p-3">
                      <Controller
                        name={`international.ap.subjects[${index}].score`}
                        control={control}
                        render={({ field: subField }) => (
                          <Input
                            id={`apScore-${index}`}
                            value={subField.value}
                            onChange={subField.onChange}
                            placeholder="1-5"
                            className="border-cyan-200 focus:border-cyan-400 focus:ring-cyan-200 bg-white"
                            error={errors.international?.ap?.subjects?.[index]?.score?.message}
                          />
                        )}
                      />
                    </td>
                    <td className="p-3">
                      <Button
                        label="Remove"
                        onClick={() => remove(index)}
                        variant="outline"
                        className="text-cyan-600 hover:text-cyan-700 border border-cyan-300 hover:border-cyan-400 px-3 py-1 rounded-md"
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
  );
};

export default APSection;