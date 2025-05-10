import React, { useState } from 'react';
import { Input } from '../../Input';
import { Select } from '../../Select';
import { Button } from '../../Button';
import { RadioGroup } from '../../RadioGroup';
import { countryOptions, examOptions } from './options';
import { SubjectModal } from './SubjectModal';

export interface Subject {
  subject: string;
  otherSubject: string;
  marksObtained: string;
  maxMarks: string;
}

interface Props {
  initialData?: any;
  onNext: (data: {
    schoolName: string;
    country: string;
    from: string;
    to: string;
    examination: string;
    examMonthYear: string;
    resultType: 'actual' | 'predicted';
    subjects: Subject[];
  }) => void;
}

export const InternationalSchoolInfo: React.FC<Props> = ({initialData, onNext }) => {
  const [schoolName, setSchoolName] = useState('');
  const [country, setCountry] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [examination, setExamination] = useState('other');
  const [examMonthYear, setExamMonthYear] = useState('');
  const [resultType, setResultType] = useState<'actual' | 'predicted'>('actual');
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [showSubjectModal, setShowSubjectModal] = useState(false);

  const handleAddSubject = (newSubject: Subject) => {
    setSubjects([...subjects, newSubject]);
    setShowSubjectModal(false);
  };

  const handleNext = () => {
    onNext({
      schoolName,
      country,
      from,
      to,
      examination,
      examMonthYear,
      resultType,
      subjects,
    });
  };

  return (
    <div className="p-6">
      <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-4 border-b border-cyan-100">
        <h2 className="text-xl font-semibold text-cyan-900">International High School Education</h2>
      </div>

      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6 mb-8">
          <Input 
            id="schoolName" 
            label="Name of School" 
            value={schoolName} 
            onChange={e => setSchoolName(e.target.value)} 
            required 
            placeholder="Enter school name"
            className="border-cyan-200 focus:border-cyan-400 focus:ring-cyan-200"
            labelClassName="text-cyan-700"
          />
          <Select 
            id="country" 
            label="Country" 
            options={countryOptions} 
            value={country} 
            onChange={e => setCountry(e.target.value)} 
            required 
            placeholder="Select country"
            className="border-cyan-200 focus:border-cyan-400 focus:ring-cyan-200"
            labelClassName="text-cyan-700"
          />
          <Input 
            id="from" 
            label="From" 
            value={from} 
            onChange={e => setFrom(e.target.value)} 
            required 
            placeholder="Start year"
            className="border-cyan-200 focus:border-cyan-400 focus:ring-cyan-200"
            labelClassName="text-cyan-700"
          />
          <Input 
            id="to" 
            label="To" 
            value={to} 
            onChange={e => setTo(e.target.value)} 
            required 
            placeholder="End year"
            className="border-cyan-200 focus:border-cyan-400 focus:ring-cyan-200"
            labelClassName="text-cyan-700"
          />
          <Select 
            id="examination" 
            label="Examination" 
            options={examOptions} 
            value={examination} 
            onChange={e => setExamination(e.target.value)} 
            required 
            placeholder="Select examination"
            className="border-cyan-200 focus:border-cyan-400 focus:ring-cyan-200"
            labelClassName="text-cyan-700"
          />
          <Input 
            id="examMonthYear" 
            label="Exam Month/Year" 
            value={examMonthYear} 
            onChange={e => setExamMonthYear(e.target.value)} 
            required 
            placeholder="e.g. June 2023"
            className="border-cyan-200 focus:border-cyan-400 focus:ring-cyan-200"
            labelClassName="text-cyan-700"
          />
          <RadioGroup
            name="resultType"
            label="Result Type"
            options={[
              { label: 'Actual', value: 'actual' },
              { label: 'Predicted/Forecast', value: 'predicted' },
            ]}
            selectedValue={resultType}
            onChange={val => setResultType(val as 'actual' | 'predicted')}
            required
            className="md:col-span-2 mt-2 text-cyan-700"
          />
        </div>

        {/* Subjects Table */}
        <div className="border border-cyan-200 rounded-lg overflow-hidden mb-8">
          <div className="flex justify-between p-4 bg-gradient-to-r from-cyan-50 to-blue-50 border-b border-cyan-100">
            <h3 className="text-lg font-medium text-cyan-800">Subjects</h3>
            <Button 
              label="Add Subject" 
              onClick={() => setShowSubjectModal(true)} 
              variant="primary"
              className="bg-gradient-to-r from-cyan-400 to-blue-400 text-white px-4 py-2 rounded-lg hover:from-cyan-500 hover:to-blue-500 transition-all duration-300 shadow-sm relative overflow-hidden group" 
            />
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-cyan-50 border-b border-cyan-200">
                <th className="py-3 px-4 text-left font-medium text-cyan-800">Subject</th>
                <th className="py-3 px-4 text-left font-medium text-cyan-800">Other Subject</th>
                <th className="py-3 px-4 text-left font-medium text-cyan-800">Marks Obtained</th>
                <th className="py-3 px-4 text-left font-medium text-cyan-800">Maximum Marks</th>
              </tr>
            </thead>
            <tbody>
              {subjects.length === 0 ? (
                <tr>
                  <td className="py-2 px-3 text-gray-500" colSpan={4}>
                    No record(s)
                  </td>
                </tr>
              ) : (
                subjects.map((subj, idx) => (
                  <tr key={idx}>
                    <td className="py-2 px-3 border-b">{subj.subject}</td>
                    <td className="py-2 px-3 border-b">{subj.otherSubject}</td>
                    <td className="py-2 px-3 border-b">{subj.marksObtained}</td>
                    <td className="py-2 px-3 border-b">{subj.maxMarks}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end">
          <Button 
            label="Next" 
            type="button" 
            variant="primary" 
            onClick={handleNext}
            className="bg-gradient-to-r from-cyan-400 to-blue-400 text-white px-6 py-3 rounded-lg hover:from-cyan-500 hover:to-blue-500 transition-all duration-300 shadow-sm relative overflow-hidden group" 
          />
        </div>
      </div>

      <SubjectModal
        showModal={showSubjectModal}
        onClose={() => setShowSubjectModal(false)}
        onSubmit={handleAddSubject}
      />
    </div>
  );
};