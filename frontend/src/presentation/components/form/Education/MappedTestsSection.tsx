import React from 'react';
import TestRow, { TestField } from './TestRow';

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
  const testConfigs = [
    {
      testName: 'EL1119',
      fields: [
        {
          id: 'el1119Date',
          label: 'Date Taken',
          value: el1119Date,
          onChange: (e: React.ChangeEvent<HTMLInputElement>) => setEl1119Date(e.target.value),
          placeholder: 'MM/YYYY',
        },
        {
          id: 'el1119Grade',
          label: 'Grade/Mark',
          value: el1119Grade,
          onChange: (e: React.ChangeEvent<HTMLInputElement>) => setEl1119Grade(e.target.value),
          placeholder: '',
        },
      ],
    },
    {
      testName: 'Tahap Keseluruhan CEFR Bahasa Inggeris',
      fields: [
        {
          id: 'ceferDate',
          label: 'Date Taken',
          value: ceferDate,
          onChange: (e: React.ChangeEvent<HTMLInputElement>) => setCeferDate(e.target.value),
          placeholder: 'MM/YYYY',
        },
        {
          id: 'ceferGrade',
          label: 'Grade/Mark',
          value: ceferGrade,
          onChange: (e: React.ChangeEvent<HTMLInputElement>) => setCeferGrade(e.target.value),
          placeholder: '',
        },
      ],
    },
    {
      testName: 'MUET (Aggregate Score)',
      fields: [
        {
          id: 'muetDate',
          label: 'Date Taken',
          value: muetDate,
          onChange: (e: React.ChangeEvent<HTMLInputElement>) => setMuetDate(e.target.value),
          placeholder: 'MM/YYYY',
        },
        {
          id: 'muetGrade',
          label: 'Grade/Mark',
          value: muetGrade,
          onChange: (e: React.ChangeEvent<HTMLInputElement>) => setMuetGrade(e.target.value),
          placeholder: '',
        },
      ],
    },
    {
      testName: 'C1 Advanced/Cambridge English Advanced',
      fields: [
        {
          id: 'cambridgeDate',
          label: 'Date Taken',
          value: cambridgeDate,
          onChange: (e: React.ChangeEvent<HTMLInputElement>) => setCambridgeDate(e.target.value),
          placeholder: 'MM/YYYY',
        },
        {
          id: 'cambridgeGrade',
          label: 'Grade/Mark',
          value: cambridgeGrade,
          onChange: (e: React.ChangeEvent<HTMLInputElement>) => setCambridgeGrade(e.target.value),
          placeholder: '',
        },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {testConfigs.map((test) => (
        <div 
          className="bg-white rounded-lg border border-cyan-100 overflow-hidden" 
          key={test.testName}
        >
          <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-4 border-b border-cyan-100">
            <h3 className="text-lg font-medium text-cyan-900">{test.testName}</h3>
          </div>
          
          <div className="p-6">
            <TestRow fields={test.fields as TestField[]} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default MappedTestsSection;