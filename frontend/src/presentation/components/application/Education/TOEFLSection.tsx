import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { Input } from '../../base/Input';

const TOEFLSection: React.FC = () => {
  const { control, formState: { errors } } = useFormContext();

  return (
    <div className="mb-8 bg-white rounded-lg border border-cyan-100 overflow-hidden">
      <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-4 border-b border-cyan-100">
        <h3 className="text-lg font-medium text-cyan-900">TOEFL Test Score</h3>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-3 gap-6 mb-6">
          <div className="flex flex-col">
            <span className="text-cyan-700 text-sm font-medium mb-2">Test Type</span>
            <span className="text-cyan-900">TOEFL</span>
          </div>
          <Controller
            name="international.toefl.date"
            control={control}
            render={({ field }) => (
              <Input
                id="toeflDate"
                label="Date Taken"
                value={field.value}
                onChange={field.onChange}
                placeholder="MM/YYYY"
                className="border-cyan-200 focus:border-cyan-400 focus:ring-cyan-200 bg-white"
                labelClassName="text-cyan-700"
                error={errors.international?.toefl?.date?.message}
              />
            )}
          />
          <Controller
            name="international.toefl.grade"
            control={control}
            render={({ field }) => (
              <Input
                id="toeflGrade"
                label="Total Score"
                value={field.value}
                onChange={field.onChange}
                placeholder="Internet: 0-120; Paper: 310-677"
                className="border-cyan-200 focus:border-cyan-400 focus:ring-cyan-200 bg-white"
                labelClassName="text-cyan-700"
                error={errors.international?.toefl?.grade?.message}
              />
            )}
          />
        </div>

        <div className="flex items-center gap-6 p-4 bg-cyan-50/50 rounded-lg">
          <span className="text-cyan-700 text-sm font-medium">Test Format:</span>
          <Controller
            name="international.toefl.type"
            control={control}
            render={({ field }) => (
              <>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="toefl_type"
                    checked={field.value === 'online'}
                    onChange={() => field.onChange('online')}
                    className="form-radio h-4 w-4 text-cyan-600 border-cyan-300 focus:ring-cyan-200"
                  />
                  <span className="ml-2 text-cyan-800">Online</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="toefl_type"
                    checked={field.value === 'paper'}
                    onChange={() => field.onChange('paper')}
                    className="form-radio h-4 w-4 text-cyan-600 border-cyan-300 focus:ring-cyan-200"
                  />
                  <span className="ml-2 text-cyan-800">Paper-Based</span>
                </label>
                {errors.international?.toefl?.type && (
                  <p className="text-sm text-red-700 mt-2">{errors.international.toefl.type.message}</p>
                )}
              </>
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default TOEFLSection;