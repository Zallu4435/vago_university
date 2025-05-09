import React from 'react';
import TestRow from './TestRow';
import { testConfigs } from './options';

interface MappedTestsSectionProps {
  el1119Date: string;
  setEl1119Date: (v: string) => void;
  el1119Grade: string;
  setEl1119Grade: (v: string) => void;
  ceferDate: string;
  setCeferDate: (v: string) => void;
  ceferGrade: string;
  setCeferGrade: (v: string) => void;
  muetDate: string;
  setMuetDate: (v: string) => void;
  muetGrade: string;
  setMuetGrade: (v: string) => void;
  cambridgeDate: string;
  setCambridgeDate: (v: string) => void;
  cambridgeGrade: string;
  setCambridgeGrade: (v: string) => void;
}

const MappedTestsSection: React.FC<MappedTestsSectionProps> = ({
  el1119Date, setEl1119Date,
  el1119Grade, setEl1119Grade,
  ceferDate, setCeferDate,
  ceferGrade, setCeferGrade,
  muetDate, setMuetDate,
  muetGrade, setMuetGrade,
  cambridgeDate, setCambridgeDate,
  cambridgeGrade, setCambridgeGrade,
}) => {
  const valueMap = {
    el1119Date, el1119Grade,
    ceferDate, ceferGrade,
    muetDate, muetGrade,
    cambridgeDate, cambridgeGrade,
  };
  const setterMap = {
    el1119Date: setEl1119Date,
    el1119Grade: setEl1119Grade,
    ceferDate: setCeferDate,
    ceferGrade: setCeferGrade,
    muetDate: setMuetDate,
    muetGrade: setMuetGrade,
    cambridgeDate: setCambridgeDate,
    cambridgeGrade: setCambridgeGrade,
  };

  return (
    <div className="space-y-6">
      {testConfigs.map((test) => (
        <div className="bg-white rounded-lg border border-cyan-100 overflow-hidden" key={test.testName}>
          <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-4 border-b border-cyan-100">
            <h3 className="text-lg font-medium text-cyan-900">{test.testName}</h3>
          </div>
          <div className="p-6">
            <TestRow
              fields={test.fields.map(field => ({
                ...field,
                value: valueMap[field.id],
                onChange: (e: React.ChangeEvent<HTMLInputElement>) => setterMap[field.id](e.target.value),
              }))}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default MappedTestsSection;