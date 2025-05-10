import React, { useEffect, useState } from 'react';
import { InternationalSchoolInfo, Subject } from './InternationalSchoolInfo';
import { InternationalTestInfo } from './InternationalTestInfo';
import { InternationalEducationData } from '../../../../domain/types/formTypes';


interface Props {
  value?: InternationalEducationData | null | undefined;
  onChange: (data: InternationalEducationData) => void;
}

export const InternationalEducation: React.FC<Props> = ({ value, onChange }) => {
  const [step, setStep] = useState(1);
  // const [schoolInfo, setSchoolInfo] = useState<null | {
  //   schoolName: string;
  //   country: string;
  //   from: string;
  //   to: string;
  //   examination: string;
  //   examMonthYear: string;
  //   resultType: 'actual' | 'predicted';
  //   subjects: Subject[];
  // }>(null);
    const [schoolInfo, setSchoolInfo] = useState<InternationalEducationData | null>(value || null);


    useEffect(() => {
    if (schoolInfo) {
      onChange(schoolInfo);
    }
  }, [schoolInfo]);

  return (
    <div className="w-full max-w-screen-2xl">
      <div className="bg-white shadow-sm rounded-xl border border-cyan-100">
        {step === 1 && (
          <InternationalSchoolInfo
            initialData={value}
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