import React from 'react';
import { useAdmissionForm } from '../../../../application/context/AdmissionFormContext';
import Input from '../../../components/Input';

const Step1: React.FC = () => {
  const { formData, updateFormData } = useAdmissionForm();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    updateFormData({ [e.target.name]: e.target.value });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-[var(--color-text-light)] [data-theme=dark]:text-[var(--color-text-dark)] [data-theme=sepia]:text-[var(--color-text-sepia)] [data-theme=high-contrast]:text-[var(--color-text-high-contrast)] mb-1">
          Full Name
        </label>
        <Input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          placeholder="Enter your full name"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-[var(--color-text-light)] [data-theme=dark]:text-[var(--color-text-dark)] [data-theme=sepia]:text-[var(--color-text-sepia)] [data-theme=high-contrast]:text-[var(--color-text-high-contrast)] mb-1">
          Date of Birth
        </label>
        <Input
          type="date"
          name="dateOfBirth"
          value={formData.dateOfBirth}
          onChange={handleChange}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-[var(--color-text-light)] [data-theme=dark]:text-[var(--color-text-dark)] [data-theme=sepia]:text-[var(--color-text-sepia)] [data-theme=high-contrast]:text-[var(--color-text-high-contrast)] mb-1">
          Gender
        </label>
        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          className="w-full p-2 border rounded-md bg-[var(--color-background-light)] text-[var(--color-text-light)] [data-theme=dark]:bg-[var(--color-background-dark)] [data-theme=dark]:text-[var(--color-text-dark)] [data-theme=sepia]:bg-[var(--color-background-sepia)] [data-theme=sepia]:text-[var(--color-text-sepia)] [data-theme=high-contrast]:bg-[var(--color-background-high-contrast)] [data-theme=high-contrast]:text-[var(--color-text-high-contrast)]"
        >
          <option value="">Select gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </div>
    </div>
  );
};

export default Step1;