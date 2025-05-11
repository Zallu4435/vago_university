import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../../Button';
import { Select } from '../../Select';
import { programmeOptions, majorOptions } from './options';
import { createProgrammeChoiceSchema, ProgrammeChoiceFormData } from '../../../../domain/validation/ChoiceOfStudySchema';

interface ProgrammeModalProps {
  showModal: boolean;
  onClose: () => void;
  onSubmit: (data: ProgrammeChoiceFormData) => void;
  choices: { programme: string; preferredMajor: string }[]; // Added to check duplicates
}

export const ProgrammeModal: React.FC<ProgrammeModalProps> = ({
  showModal,
  onClose,
  onSubmit,
  choices,
}) => {
  const { control, handleSubmit, formState: { errors }, watch, reset } = useForm<ProgrammeChoiceFormData>({
    resolver: zodResolver(createProgrammeChoiceSchema(choices)),
    defaultValues: {
      programme: '',
      preferredMajor: '',
    },
    mode: 'onChange',
  });

  const selectedProgramme = watch('programme');

  // Reset form when modal opens
  useEffect(() => {
    if (showModal) {
      reset({ programme: '', preferredMajor: '' });
    }
  }, [showModal, reset]);

  if (!showModal) return null;

  const onFormSubmit = (data: ProgrammeChoiceFormData) => {
    console.log('ProgrammeModal submitting:', data);
    onSubmit(data);
  };

  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative border border-blue-100">
        <button
          className="absolute top-4 right-4 text-blue-400 hover:text-blue-600 transition-colors"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        <h2 className="text-xl font-semibold mb-6 text-blue-900">Add Programme</h2>
        <form onSubmit={handleSubmit(onFormSubmit)}>
          <Controller
            name="programme"
            control={control}
            render={({ field }) => (
              <Select
                id="programme"
                name="programme"
                label="Programme"
                options={programmeOptions}
                value={field.value}
                onChange={field.onChange}
                required
                className="border-blue-200 focus:border-blue-400 focus:ring-blue-200 bg-white mb-4"
                labelClassName="text-blue-700"
                error={errors.programme?.message}
              />
            )}
          />
          <Controller
            name="preferredMajor"
            control={control}
            render={({ field }) => (
              <Select
                id="preferredMajor"
                name="preferredMajor"
                label="Preferred Major"
                options={majorOptions}
                value={field.value || ''}
                onChange={field.onChange}
                disabled={!selectedProgramme}
                required={!!selectedProgramme && ['Engineering', 'Science'].includes(selectedProgramme)}
                className="border-blue-200 focus:border-blue-400 focus:ring-blue-200 bg-white"
                labelClassName="text-blue-700"
                error={errors.preferredMajor?.message}
              />
            )}
          />
          <div className="flex justify-end mt-6">
            <Button
              label="Add"
              type="submit"
              variant="primary"
              className="bg-gradient-to-r from-blue-400 to-sky-400 hover:from-blue-500 hover:to-sky-500 text-white px-6 py-2 rounded-lg transition-all duration-300 shadow-sm"
            />
          </div>
        </form>
      </div>
    </div>
  );
};