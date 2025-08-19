import React, { useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '../../base/Input';
import { Button } from '../../base/Button';
import { Textarea } from '../../base/Textarea';
import { HealthCondition, HealthConditionSchema } from '../../../../domain/validation/OtherInfoSchema';
import { HealthConditionFormProps } from '../../../../domain/types/application';


const HealthConditionForm: React.FC<HealthConditionFormProps> = ({ onAddCondition, showModal, onClose, condition, index }) => {
  const isEditing = condition !== null && condition !== undefined && index !== null && index !== undefined;

  const methods = useForm<HealthCondition>({
    resolver: zodResolver(HealthConditionSchema),
    defaultValues: isEditing
      ? { condition: condition.condition, details: condition.details }
      : { condition: '', details: '' },
    mode: 'onChange',
  });

  const { handleSubmit, reset, formState: { errors } } = methods;

  useEffect(() => {
    if (isEditing) {
      reset({ condition: condition.condition, details: condition.details });
    } else {
      reset({ condition: '', details: '' });
    }
  }, [condition, index, isEditing, reset]);

  const onSubmit = (data: HealthCondition) => {
    onAddCondition(data, isEditing ? index : undefined);
    reset({ condition: '', details: '' });
    onClose();
  };

  return (
    showModal && (
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-lg border border-cyan-100 max-w-2xl w-full">
              <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-4 border-b border-cyan-100">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-cyan-900">
                    {isEditing ? 'Edit Health Condition' : 'Add Health Condition'}
                  </h3>
                  <Button
                    onClick={() => {
                      reset({ condition: '', details: '' });
                      onClose();
                    }}
                    aria-label="Close"
                    label="×"
                    variant=""
                    className="text-cyan-400 hover:text-cyan-600 transition-colors px-2 py-0 text-xl font-bold"
                  />
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-6">
                  <Input
                    id="condition"
                    label="Health and Support Condition"
                    {...methods.register('condition')}
                    required
                    placeholder="Enter health or support condition"
                    className="border-cyan-200 focus:border-cyan-400 focus:ring-cyan-200 bg-white"
                    labelClassName="text-cyan-700"
                    error={errors.condition?.message}
                  />
                  <Textarea
                    id="details"
                    label="Health and Support Condition Details"
                    {...methods.register('details')}
                    rows={4}
                    required
                    placeholder="Provide details about your condition (at least 10 characters)"
                    maxLength={500}
                    className="border-cyan-200 focus:border-cyan-400 focus:ring-cyan-200 bg-white"
                    labelClassName="text-cyan-700"
                    error={errors.details?.message}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4 p-6 bg-gray-50 border-t border-cyan-100">
                <Button
                  label="Cancel"
                  variant="outline"
                  onClick={() => {
                    reset({ condition: '', details: '' });
                    onClose();
                  }}
                  className="text-cyan-600 border-cyan-200 hover:bg-cyan-50"
                />
                <Button
                  label={isEditing ? 'Save Changes' : 'Add'}
                  variant="primary"
                  type="submit"
                  className="bg-gradient-to-r from-cyan-400 to-blue-400 text-white hover:from-cyan-500 hover:to-blue-500"
                />
              </div>
            </div>
          </div>
        </form>
      </FormProvider>
    )
  );
};

export default HealthConditionForm;