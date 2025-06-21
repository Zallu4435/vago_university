import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '../../Input';
import { Button } from '../../Button';
import { subjectSchema } from '../../../../domain/validation/EducationSchema';

interface SubjectModalProps {
  showModal: boolean;
  onClose: () => void;
  onSubmit: (subject: {
    subject: string;
    otherSubject: string;
    grade: string;
  }) => void;
}

export const SubjectModal: React.FC<SubjectModalProps> = ({
  showModal,
  onClose,
  onSubmit,
}) => {
  const { control, handleSubmit, formState: { errors }, reset, watch } = useForm<{
    subject: string;
    otherSubject: string;
    grade: string;
  }>({
    resolver: zodResolver(subjectSchema),
    defaultValues: {
      subject: '',
      otherSubject: '',
      grade: '',
    },
    mode: 'onChange',
  });

  const subjectValue = watch('subject');

  useEffect(() => {
    if (showModal) {
      reset();
    }
  }, [showModal, reset]);

  const onFormSubmit = (data: {
    subject: string;
    otherSubject: string;
    grade: string;
  }) => {
    onSubmit(data);
    onClose();
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative border border-cyan-100">
        <button
          className="absolute top-4 right-4 text-cyan-400 hover:text-cyan-600"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        <h2 className="text-xl font-semibold mb-6 text-cyan-900">Add Subject</h2>
        <form onSubmit={handleSubmit(onFormSubmit)}>
          <Controller
            name="subject"
            control={control}
            render={({ field }) => (
              <Input
                id="subject"
                label="Subject"
                value={field.value}
                onChange={field.onChange}
                required
                placeholder="Enter subject"
                className="border-cyan-200 focus:border-cyan-400 focus:ring-cyan-200"
                labelClassName="text-cyan-700"
                error={errors.subject?.message}
              />
            )}
          />
          {subjectValue === 'other' && (
            <Controller
              name="otherSubject"
              control={control}
              render={({ field }) => (
                <Input
                  id="otherSubject"
                  label="Other Subject"
                  value={field.value}
                  onChange={field.onChange}
                  required
                  placeholder="Enter other subject name"
                  className="border-cyan-200 focus:border-cyan-400 focus:ring-cyan-200"
                  labelClassName="text-cyan-700"
                  error={errors.otherSubject?.message}
                />
              )}
            />
          )}
          <Controller
            name="grade"
            control={control}
            render={({ field }) => (
              <Input
                id="grade"
                label="Grade"
                value={field.value}
                onChange={field.onChange}
                required
                placeholder="Enter grade"
                className="border-cyan-200 focus:border-cyan-400 focus:ring-cyan-200"
                labelClassName="text-cyan-700"
                error={errors.grade?.message}
              />
            )}
          />
          <div className="flex justify-end mt-6">
            <Button
              label="Add"
              type="submit"
              variant="primary"
              className="bg-gradient-to-r from-cyan-400 to-blue-400 text-white px-4 py-2 rounded-lg hover:from-cyan-500 hover:to-blue-500 transition-all duration-300 shadow-sm relative overflow-hidden group"
            />
          </div>
        </form>
      </div>
    </div>
  );
};