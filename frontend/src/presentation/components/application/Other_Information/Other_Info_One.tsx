import React, { useState } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import HealthConditionForm from './HealthConditionForm';
import HealthConditionTable from './HealthConditionTable';
import { Button } from '../../base/Button';
import { radioOptions } from './options';
import { getNestedError } from '../../../../shared/utils/formErrors';
import type { HealthCondition, OtherInfoOneProps } from '../../../../domain/types/application';

const Other_Info_One: React.FC<OtherInfoOneProps> = ({ onNext }) => {
  const { control, register, watch, setValue, formState: { errors }, trigger } = useFormContext();
  const [showModal, setShowModal] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editCondition, setEditCondition] = useState<HealthCondition | null>(null);
  const hasHealthSupport = watch('health.hasHealthSupport');
  const { fields: conditions, append, remove, update } = useFieldArray({
    control,
    name: 'health.conditions',
  });

  const handleAddCondition = (condition: HealthCondition) => {
    if (conditions.length < 3) {
      append(condition);
      setShowModal(false);
      const details = [...(conditions as unknown as HealthCondition[]), condition].map(c => `${c.condition}: ${c.details}`).join('; ');
      setValue('health.medicalConditions', details, { shouldValidate: true });
    }
  };

  const handleEditCondition = (condition: HealthCondition, index?: number) => {
    if (index !== undefined && index >= 0) {
      update(index, condition);
      const details = (conditions as unknown as HealthCondition[])
        .map((c, i) => (i === index ? condition : c))
        .map(c => `${c.condition}: ${c.details}`)
        .join('; ');
      setValue('health.medicalConditions', details, { shouldValidate: true });
      setEditIndex(null);
      setEditCondition(null);
      setShowModal(false);
    }
  };

  const handleRemoveCondition = (index: number) => {
    remove(index);
    const details = (conditions as unknown as HealthCondition[])
      .filter((_, i) => i !== index)
      .map(c => `${c.condition}: ${c.details}`)
      .join('; ');
    setValue('health.medicalConditions', details || '', { shouldValidate: true });
  };

  const handleEditClick = (index: number) => {
    setEditIndex(index);
    setEditCondition(conditions[index] as unknown as HealthCondition);
    setShowModal(true);
  };

  const handleHealthSupportChange = (value: string) => {
    setValue('health.hasHealthSupport', value, { shouldValidate: true });
    if (value === 'false') {
      setValue('health.medicalConditions', 'None', { shouldValidate: true });
      setValue('health.conditions', [], { shouldValidate: true });
    } else {
      const currentConditions = conditions || [];
      setValue('health.medicalConditions',
        currentConditions.length > 0
          ? (currentConditions as unknown as HealthCondition[]).map(c => `${c.condition}: ${c.details}`).join('; ')
          : '',
        { shouldValidate: true }
      );
    }
  };

  const handleNext = async () => {
    const isValid = await trigger('health', { shouldFocus: true });
    if (isValid) {
      onNext();
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-sm rounded-xl border border-cyan-100">
      <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-4 border-b border-cyan-100">
        <h2 className="text-xl font-semibold text-cyan-900">Health And Support</h2>
      </div>

      <div className="p-6">
        <div className="bg-cyan-50 border-l-4 border-cyan-400 p-4 rounded mb-6">
          <p className="text-sm text-cyan-800">
            Do you have any past or current health conditions or disabilities that may require support or facilities?
          </p>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-cyan-700 mb-2">
            Select an option<span className="text-red-500">*</span>
          </label>
          <div className="flex items-center space-x-6">
            {radioOptions.map(opt => (
              <div className="flex items-center" key={opt.label}>
                <input
                  type="radio"
                  id={`health_support_${opt.label.toLowerCase()}`}
                  {...register('health.hasHealthSupport', {
                    required: 'Please select whether you have health support needs',
                  })}
                  value={String(opt.value)}
                  checked={hasHealthSupport === String(opt.value)}
                  onChange={() => handleHealthSupportChange(String(opt.value))}
                  className="form-radio h-4 w-4 text-cyan-600 border-cyan-300 focus:ring-cyan-200"
                />
                <label
                  htmlFor={`health_support_${opt.label.toLowerCase()}`}
                  className="ml-2 text-cyan-800"
                >
                  {opt.label}
                </label>
              </div>
            ))}
            {getNestedError(errors, 'health.hasHealthSupport') && (
              <p className="text-sm text-red-700 mt-2">{getNestedError(errors, 'health.hasHealthSupport')}</p>
            )}
          </div>
        </div>

        {hasHealthSupport === 'true' && (
          <>
            <div className="flex justify-between items-center mb-4">
              <span className="text-cyan-600 text-sm">Max 3 Conditions</span>
              <Button
                label="Add Health and Support Condition"
                onClick={() => {
                  setEditIndex(null);
                  setEditCondition(null);
                  setShowModal(true);
                }}
                disabled={conditions.length >= 3}
                className="bg-gradient-to-r from-cyan-400 to-blue-400 text-white px-4 py-2 rounded-lg hover:from-cyan-500 hover:to-blue-500 transition-all duration-300 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
            <HealthConditionTable
              conditions={conditions as unknown as HealthCondition[]}
              onRemove={handleRemoveCondition}
              onEdit={handleEditClick}
            />
            {getNestedError(errors, 'health.conditions') && (
              <p className="text-sm text-red-700 mt-2">{getNestedError(errors, 'health.conditions')}</p>
            )}
            {getNestedError(errors, 'health.medicalConditions') && (
              <p className="text-sm text-red-700 mt-2">{getNestedError(errors, 'health.medicalConditions')}</p>
            )}
          </>
        )}

        <div className="bg-cyan-50 border-l-4 border-cyan-400 p-4 rounded mt-6">
          <p className="text-sm text-cyan-800">
            <strong>Note:</strong> Disclosure will not disadvantage your application. The information will enable
            the University to develop a better understanding of an applicant's need for support during their studies.
          </p>
        </div>
      </div>

      <div className="flex justify-between p-6 mt-4 border-t border-cyan-100">
        <Button
          label="Previous"
          disabled
          className="text-cyan-600 border-cyan-200 hover:bg-cyan-50 disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <Button
          label="Save and Next"
          onClick={handleNext}
          className="bg-gradient-to-r from-cyan-400 to-blue-400 text-white px-6 py-2 rounded-lg hover:from-cyan-500 hover:to-blue-500 transition-all duration-300 shadow-sm"
        />
      </div>

      <HealthConditionForm
        showModal={showModal}
        onClose={() => {
          setShowModal(false);
          setEditIndex(null);
          setEditCondition(null);
        }}
        onAddCondition={editIndex !== null ? handleEditCondition : handleAddCondition}
        condition={editCondition}
        index={editIndex}
      />
    </div>
  );
};

export default Other_Info_One;