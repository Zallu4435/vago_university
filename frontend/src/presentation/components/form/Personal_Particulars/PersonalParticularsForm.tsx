import React, { useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PersonalInfo } from '../../../../domain/types/formTypes';
import { PersonalSection } from './PersonalSection';
import { AlternativeContactSection } from './AlternativeContactSection';
import { personalFormSchema, PersonalFormData } from '../../../../domain/validation/PersonalFormSchema';

interface PersonalParticularsFormProps {
  initialData?: PersonalInfo;
  onSave?: (data: PersonalInfo) => void;
  triggerValidation?: any;
}

export const PersonalParticularsForm: React.FC<PersonalParticularsFormProps> = ({
  initialData,
  onSave,
  triggerValidation,
}) => {
  const defaultValues: PersonalFormData = {
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
  };

  const methods = useForm<PersonalFormData>({
    resolver: zodResolver(personalFormSchema),
    defaultValues: initialData || defaultValues,
    mode: 'all', // This validates on blur and onChange
    criteriaMode: 'all', // Show all validation errors
    reValidateMode: 'onChange', // Re-validate when values change
  });

  const { reset, formState: { errors, isDirty }, watch, trigger, clearErrors } = methods;

  // Expose triggerValidation to parent
  React.useImperativeHandle(triggerValidation, () => ({
    trigger: async () => {
      const isValid = await trigger();
      console.log('Trigger validation result:', { isValid, errors });
      return isValid;
    },
  }));

  // Reset form when initialData changes
  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  // Watch form data and call onSave when form is dirty
// Setup a subscription to form changes instead of watch() in render
  useEffect(() => {
    // Subscribe to form changes
    const subscription = watch((formData, { name, type }) => {
      console.log('PersonalParticularsForm watch triggered', {
        changedField: name,
        type,
        isDirty,
        errors: Object.keys(errors).length > 0 ? errors : 'No errors',
      });
      
      if (isDirty && onSave) {
        console.log('Calling onSave with formData');
        onSave(formData);
      }
    });
    
    // Cleanup subscription on unmount
    return () => subscription.unsubscribe();
  }, [watch, isDirty, onSave, errors]);

  return (
    <div className="w-full max-w-screen-2xl mx-auto px-8">
      <div className="max-w-4xl mx-auto bg-white shadow-sm rounded-xl border border-cyan-100 mb-8">
        <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-4 border-b border-cyan-100">
          <h2 className="text-xl md:text-2xl font-bold text-cyan-800">
            Personal Particulars
          </h2>
        </div>
        
        <FormProvider {...methods}>
          <div className="p-4 md:p-6 lg:p-0">
            <div className="bg-cyan-50/30 rounded-lg p-4 md:p-6">
              <PersonalSection />
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
                <AlternativeContactSection />
              </div>
            </div>
          </div>
        </FormProvider>
      </div>
    </div>
  );
};