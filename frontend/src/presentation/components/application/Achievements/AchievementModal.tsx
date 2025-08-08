import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Input } from '../../base/Input';
import { Button } from '../../base/Button';
import { Select } from '../../base/Select';
import { Textarea } from '../../base/Textarea';
import { getReferenceFields, getSelectFields } from './fields';
import type { AchievementModalProps } from '../../../../domain/types/application';

export const AchievementModal: React.FC<AchievementModalProps> = ({
  show,
  onClose,
  onSubmit,
  newAchievement,
  setNewAchievement,
}) => {
  const { register, formState: { errors }, setValue, trigger } = useFormContext();

  if (!show) return null;

  const selectFields = getSelectFields(newAchievement, setNewAchievement);
  const referenceFields = getReferenceFields((newAchievement as any).reference, (updatedRef) => {
    setNewAchievement({ ...newAchievement, reference: updatedRef } as any);
    setValue('newAchievement.reference', updatedRef, { shouldValidate: false });
  });

  const handleSubmit = async () => {
    const isValid = await trigger(['newAchievement'], { shouldFocus: true });
    console.log('AchievementModal: Validation result', { isValid, errors, newAchievement });
    if (isValid) {
      onSubmit();
    } else {
      console.log('AchievementModal: Validation errors', {
        achievementErrors: errors.newAchievement,
        referenceErrors: (errors.newAchievement as any)?.reference,
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-cyan-100">
        <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-4 border-b border-cyan-100">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-cyan-900">Add Achievement</h2>
            <Button
              onClick={onClose}
              aria-label="Close"
              label="×"
              className="text-cyan-400 hover:text-cyan-600"
            />
          </div>
        </div>

        <div className="p-6">
          {errors.newAchievement && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded mb-6">
              <p className="text-sm text-red-700">
                Please complete all required fields.
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {selectFields.map(field => (
              <div key={field.id}>
                <Select
                  id={field.id}
                  label={field.label}
                  options={field.options}
                  value={field.value}
                  onChange={(val) => {
                    setNewAchievement({ ...newAchievement, [field.id]: val });
                    setValue(`newAchievement.${field.id}`, val, { shouldValidate: false });
                  }}
                  required
                  placeholder={field.placeholder}
                  className="border-cyan-200 focus:border-cyan-400 focus:ring-cyan-200 bg-white"
                  labelClassName="text-cyan-700"
                />
                {(errors.newAchievement as any)?.[field.id]?.message && (
                  <p className="text-sm text-red-700 mt-1">
                    {(errors.newAchievement as any)[field.id]?.message}
                  </p>
                )}
              </div>
            ))}

            {['organizationName', 'fromDate', 'toDate'].map((fieldKey) => (
              <div key={fieldKey}>
                <Input
                  id={fieldKey}
                  label={fieldKey === 'organizationName' ? 'Organization / Employer' :
                        fieldKey === 'fromDate' ? 'From (MM/YYYY)' : 'To (MM/YYYY)'}
                  {...register(`newAchievement.${fieldKey}`)}
                  value={(newAchievement as any)[fieldKey]}
                  onChange={e => {
                    setNewAchievement({ ...newAchievement, [fieldKey]: e.target.value });
                    setValue(`newAchievement.${fieldKey}`, e.target.value, { shouldValidate: false });
                  }}
                  placeholder={fieldKey.includes('Date') ? 'MM/YYYY' : 'Enter name'}
                  className="border-cyan-200 focus:border-cyan-400 focus:ring-cyan-200 bg-white"
                  labelClassName="text-cyan-700"
                />
                {(errors.newAchievement as any)?.[fieldKey]?.message && (
                  <p className="text-sm text-red-700 mt-1">
                    {(errors.newAchievement as any)[fieldKey]?.message}
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="mb-6">
            <Textarea
              id="description"
              label="Key Contribution Description"
              {...register('newAchievement.description')}
              value={newAchievement.description}
              onChange={e => {
                const value = e.target.value.slice(0, 1000);
                setNewAchievement({ ...newAchievement, description: value });
                setValue('newAchievement.description', value, { shouldValidate: false });
              }}
              placeholder="Describe your achievement (max 1000 characters)"
              className="border-cyan-200 focus:border-cyan-400 focus:ring-cyan-200 bg-white"
              labelClassName="text-cyan-700"
              maxLength={1000}
              rows={4}
            />
            {(errors.newAchievement as any)?.description?.message && (
              <p className="text-sm text-red-700 mt-1">
                {(errors.newAchievement as any).description.message}
              </p>
            )}
          </div>

          <div className="border-t border-cyan-100 pt-6 mt-6">
            <h3 className="text-lg font-medium text-cyan-800 mb-4">Reference Contact</h3>
            {(errors.newAchievement as any)?.reference && (
              <p className="text-sm text-red-700 mb-4">
                Please complete all reference contact fields.
              </p>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {referenceFields.map(field => {
                let errorMessage;
                if (field.registerId.startsWith('phone.')) {
                  const phoneField = field.registerId.split('.')[1];
                  errorMessage = (errors.newAchievement as any)?.reference?.phone?.[phoneField]?.message;
                } else {
                  errorMessage = (errors.newAchievement as any)?.reference?.[field.registerId]?.message;
                }

                return (
                  <div key={field.id}>
                    <Input
                      id={field.id}
                      label={field.label}
                      type={field.type || 'text'}
                      {...register(`newAchievement.reference.${field.registerId}`)}
                      value={field.value}
                      onChange={e => field.onChange(e.target.value)}
                      placeholder={field.placeholder}
                      className="border-cyan-200 focus:border-cyan-400 focus:ring-cyan-200 bg-white"
                      labelClassName="text-cyan-700"
                    />
                    {errorMessage && (
                      <p className="text-sm text-red-700 mt-1">{errorMessage}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 p-6 bg-gray-50 border-t border-cyan-100">
          <Button
            label="Cancel"
            variant="outline"
            onClick={onClose}
            className="text-cyan-600 border-cyan-200 hover:bg-cyan-50"
          />
          <Button
            label="Submit"
            variant="primary"
            onClick={handleSubmit}
            className="bg-gradient-to-r from-cyan-400 to-blue-400 text-white hover:from-cyan-500 hover:to-blue-500"
          />
        </div>
      </div>
    </div>
  );
};