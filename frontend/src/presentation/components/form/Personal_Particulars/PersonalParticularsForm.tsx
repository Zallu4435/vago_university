import React, { useEffect, useState } from 'react';
import { PersonalInfo } from '../../../../domain/types/formTypes';
import { PersonalSection } from './PersonalSection';
import { AlternativeContactSection } from './AlternativeContactSection';

interface PersonalParticularsFormProps {
  initialData?: PersonalInfo;
  onSave?: (data: PersonalInfo) => void;
}

export const PersonalParticularsForm: React.FC<PersonalParticularsFormProps> = ({
  initialData,
  onSave,
}) => {
  const [formData, setFormData] = useState<PersonalInfo>(initialData || {
    salutation: 'Mr',
    fullName: 'John Michael Doe',
    familyName: 'Doe',
    givenName: 'John Michael',
    gender: 'Male',
    dateOfBirth: '1995-06-15',
    postalCode: '123456',
    blockNumber: '12A',
    streetName: 'Orchard Road',
    buildingName: 'Sunshine Residences',
    floorNumber: '05',
    unitNumber: '123',
    stateCity: 'Singapore',
    country: 'Singapore',
    citizenship: 'Singaporean',
    residentialStatus: 'Permanent Resident',
    race: 'Chinese',
    religion: 'Buddhism',
    maritalStatus: 'Single',
    passportNumber: 'A12345678',
    emailAddress: 'john.doe@example.com',
    alternativeEmail: 'john.m.doe@gmail.com',
    mobileCountry: '+65',
    mobileArea: '',
    mobileNumber: '91234567',
    phoneCountry: '+65',
    phoneArea: '',
    phoneNumber: '61234567',
    alternateContactName: 'Jane Doe',
    relationshipWithApplicant: 'Sister',
    occupation: 'Teacher',
    altMobileCountry: '+65',
    altMobileArea: '',
    altMobileNumber: '98765432',
    altPhoneCountry: '+65',
    altPhoneArea: '',
    altPhoneNumber: '68765432',
  });

  // Use useEffect with initialData as a dependency, so it only updates when initialData changes
  // This avoids the immediate call on mount when applicationId may not be ready
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  // Only save data on form field changes, not on component mount
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    const updatedData = {
      ...formData,
      [id]: value,
    };
    
    setFormData(updatedData);
    
    // Only call onSave after user interaction, not on initial mount
    if (onSave) {
      onSave(updatedData);
    }
  };

  return (
    <div className="w-full max-w-screen-2xl mx-auto px-8">
      <div className="max-w-4xl mx-auto bg-white shadow-sm rounded-xl border border-cyan-100 mb-8">
        <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-4 border-b border-cyan-100">
          <h2 className="text-xl md:text-2xl font-bold text-cyan-800">
            Personal Particulars
          </h2>
        </div>
        {/* <form onSubmit={handleSubmit} className="p-4 md:p-6 lg:p-0"> */}
          <div className="bg-cyan-50/30 rounded-lg p-4 md:p-6">
            <PersonalSection formData={formData} onInputChange={handleInputChange} />
          </div>
          {/* Emergency / Next of Kin Section */}
          <div className="mt-8 rounded-xl border border-cyan-100 shadow-sm bg-white">
            <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-4 border-b border-cyan-100 rounded-t-xl flex items-center gap-2">
              <svg className="w-6 h-6 text-cyan-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 01-8 0M12 14v7m0 0H9m3 0h3m-6 0a9 9 0 1118 0c0 1.657-4.03 3-9 3s-9-1.343-9-3a9 9 0 0118 0z" />
              </svg>
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-cyan-800">
                  Emergency / Next of Kin Contact Details
                </h2>
                <p className="text-sm font-normal text-cyan-500">For urgent communication</p>
              </div>
            </div>
            <div className="bg-cyan-50/30 rounded-b-xl p-4 md:p-6">
              <AlternativeContactSection formData={formData} onInputChange={handleInputChange} />
            </div>
          </div>
        {/* </form> */}
      </div>
    </div>
  );
};