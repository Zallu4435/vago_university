import React from 'react';
import { Input } from '../../Input';
import { Button } from '../../Button';
import { subjectFields } from './options';

interface SubjectModalProps {
  showModal: boolean;
  onClose: () => void;
  onSubmit: (subject: {
    subject: string;
    otherSubject: string;
    marksObtained: string;
    maxMarks: string;
  }) => void;
}

export const SubjectModal: React.FC<SubjectModalProps> = ({
  showModal,
  onClose,
  onSubmit,
}) => {
  const [subject, setSubject] = React.useState('');
  const [otherSubject, setOtherSubject] = React.useState('');
  const [marksObtained, setMarksObtained] = React.useState('');
  const [maxMarks, setMaxMarks] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      subject,
      otherSubject,
      marksObtained,
      maxMarks,
    });
    setSubject('');
    setOtherSubject('');
    setMarksObtained('');
    setMaxMarks('');
  };

  if (!showModal) return null;

  const fieldStateMap = {
    subject, setSubject,
    otherSubject, setOtherSubject,
    marksObtained, setMarksObtained,
    maxMarks, setMaxMarks,
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative border border-cyan-100">
        <button
          className="absolute top-4 right-4 text-cyan-400 hover:text-cyan-600"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        <h2 className="text-xl font-semibold mb-6 text-cyan-900">Add Subject</h2>
        <form onSubmit={handleSubmit}>
          {subjectFields.map(field => (
            <Input
              key={field.id}
              id={field.id}
              label={field.label}
              value={fieldStateMap[field.id]}
              onChange={e => fieldStateMap[`set${field.id.charAt(0).toUpperCase() + field.id.slice(1)}`](e.target.value)}
              required={field.required}
              placeholder={field.placeholder}
              className="border-cyan-200 focus:border-cyan-400 focus:ring-cyan-200"
              labelClassName="text-cyan-700"
            />
          ))}
          <div className="flex justify-end mt-6">
            <Button
              label="Add"
              type="submit"
              variant="primary"
              className="bg-gradient-to-r from-cyan-400 to-blue-400 text-white px-4 py-2 rounded-lg hover:from-cyan-500 hover:to-blue-500 transition-all duration-300 shadow-sm relative overflow-hidden group"
            />
          </div>
        </form>
      </div>
    </div>
  );
};