import React, { useState } from 'react';
import { InternationalSchoolInfo, Subject } from './InternationalSchoolInfo';
import { InternationalTestInfo } from './InternationalTestInfo';

export const InternationalEducation: React.FC = () => {
  const [step, setStep] = useState(1);
  const [schoolInfo, setSchoolInfo] = useState<null | {
    schoolName: string;
    country: string;
    from: string;
    to: string;
    examination: string;
    examMonthYear: string;
    resultType: 'actual' | 'predicted';
    subjects: Subject[];
  }>(null);

  return (
    <div className="w-full max-w-screen-2xl p-8 px-20">
      <div className="bg-white shadow-sm rounded-xl border border-cyan-100">
        {step === 1 && (
          <InternationalSchoolInfo
            onNext={data => {
              setSchoolInfo(data);
              setStep(2);
            }}
          />
        )}
        {step === 2 && <InternationalTestInfo />}
      </div>
    </div>
  );
};