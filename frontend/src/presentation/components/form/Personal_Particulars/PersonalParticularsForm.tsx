// PersonalParticularsForm.tsx
import React, { useState } from 'react';
import { Button } from '../../Button';
import { PersonalInfo } from '../../../../domain/types/formTypes';
import { PersonalSection } from './PersonalSection';
import { AlternativeContactSection } from './AlternativeContactSection';

interface PersonalParticularsFormProps {
  onNext: () => void;
  initialData?: PersonalInfo;
  onSave?: (data: PersonalInfo) => void;
}

export const PersonalParticularsForm: React.FC<PersonalParticularsFormProps> = ({
  onNext,
  initialData,
  onSave,
}) => {
  const [formData, setFormData] = useState<PersonalInfo>(initialData || {
    salutation: '',
    fullName: '',
    familyName: '',
    givenName: '',
    gender: '',
    dateOfBirth: '',
    postalCode: '',
    blockNumber: '',
    streetName: '',
    buildingName: '',
    floorNumber: '',
    unitNumber: '',
    stateCity: '',
    country: '',
    citizenship: '',
    residentialStatus: '',
    race: '',
    religion: '',
    maritalStatus: '',
    passportNumber: '',
    emailAddress: '',
    alternativeEmail: '',
    mobileCountry: '',
    mobileArea: '',
    mobileNumber: '',
    phoneCountry: '',
    phoneArea: '',
    phoneNumber: '',
    alternateContactName: '',
    relationshipWithApplicant: '',
    occupation: '',
    altMobileCountry: '',
    altMobileArea: '',
    altMobileNumber: '',
    altPhoneCountry: '',
    altPhoneArea: '',
    altPhoneNumber: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSave) {
      onSave(formData);
    }
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-screen-2xl p-4 md:p-6 lg:p-8">
      <h2 className="text-xl md:text-2xl font-bold mb-6 text-cyan-800 border-b border-cyan-100 pb-2">Personal Particulars</h2>

      <div className="bg-cyan-50/30 rounded-lg p-4 md:p-6">
        <PersonalSection formData={formData} onInputChange={handleInputChange} />
      </div>

      <h3 className="text-lg font-semibold mt-8 mb-4 text-cyan-700 border-b border-cyan-100 pb-2">Alternative Contact</h3>
      <div className="bg-cyan-50/30 rounded-lg p-4 md:p-6">
        <AlternativeContactSection formData={formData} onInputChange={handleInputChange} />
      </div>
    </form>
  );
};