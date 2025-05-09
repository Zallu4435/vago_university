import React from 'react';
import { useAdmissionForm } from '../../../../application/context/AdmissionFormContext';
import Input from '../../../components/Input';

const Step2: React.FC = () => {
  const { formData, updateFormData } = useAdmissionForm();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFormData({ education: e.target.value });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-[var(--color-text-light)] [data-theme=dark]:text-[var(--color-text-dark)] [data-theme=sepia]:text-[var(--color-text-sepia)] [data-theme=high-contrast]:text-[var(--color-text-high-contrast)] mb-1">
          Education Details
        </label>
        <Input
          type="text"
          name="education"
          value={formData.education}
          onChange={handleChange}
          placeholder="Enter your high school, GPA, etc."
        />
      </div>
    </div>
  );
};

export default Step2;