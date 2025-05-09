import React from 'react';
import { AdmissionFormProvider } from '../../../application/context/AdmissionFormContext';
import FormWizard from '../../components/form/FormWizard';
import Step1 from './steps/step1';
import Step2 from './steps/Step2';
// import Step3 from './steps/Step3';
// import Step4 from './steps/Step4';
// import Step5 from './steps/Step5';
// import Step6 from './steps/Step6';
// import Step7 from './steps/Step7';
// import Step8 from './steps/Step8';
// import Step9 from './steps/Step9';
// import Step10 from './steps/Step10';
// import Step11 from './steps/Step11';
// import Step12 from './steps/Step12';
// import Step13 from './steps/Step13';
// import Step14 from './steps/Step14';
// import Step15 from './steps/Step15';

const steps = [
  { title: 'Personal Details', component: Step1 },
  { title: 'Education', component: Step2 },
//   { title: 'Other Information', component: Step3 },
//   { title: 'Health', component: Step4 },
//   { title: 'Contact Information', component: Step5 },
//   { title: 'Emergency Contact', component: Step6 },
//   { title: 'Program Selection', component: Step7 },
//   { title: 'Test Scores', component: Step8 },
//   { title: 'Recommendations', component: Step9 },
//   { title: 'Essays', component: Step10 },
//   { title: 'Financial Information', component: Step11 },
//   { title: 'Documents Upload', component: Step12 },
//   { title: 'Declaration', component: Step13 },
//   { title: 'Payment', component: Step14 },
//   { title: 'Review & Submit', component: Step15 },
];

const Apply: React.FC = () => {
  return (
    <AdmissionFormProvider>
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-background-light)] [data-theme=dark]:bg-[var(--color-background-dark)] [data-theme=sepia]:bg-[var(--color-background-sepia)] [data-theme=high-contrast]:bg-[var(--color-background-high-contrast)]">
        <div className="bg-white [data-theme=dark]:bg-gray-800 [data-theme=sepia]:bg-[var(--color-background-sepia)] [data-theme=high-contrast]:bg-black p-8 rounded-lg shadow-lg w-full max-w-lg">
          <h2 className="text-2xl font-bold text-center text-[var(--color-primary)] mb-6">Admission Application</h2>
          <FormWizard steps={steps} />
        </div>
      </div>
    </AdmissionFormProvider>
  );
};

export default Apply;