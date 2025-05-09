import React from 'react';
import { Input } from '../../Input';
import { Button } from '../../Button';

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
    // Reset form
    setSubject('');
    setOtherSubject('');
    setMarksObtained('');
    setMaxMarks('');
  };

  if (!showModal) return null;

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
          <Input 
            id="subject" 
            label="Subject" 
            value={subject} 
            onChange={e => setSubject(e.target.value)} 
            required 
            className="border-cyan-200 focus:border-cyan-400 focus:ring-cyan-200"
            labelClassName="text-cyan-700"
          />
          <Input 
            id="otherSubject" 
            label="Other Subject" 
            value={otherSubject} 
            onChange={e => setOtherSubject(e.target.value)} 
            className="border-cyan-200 focus:border-cyan-400 focus:ring-cyan-200"
            labelClassName="text-cyan-700"
          />
          <Input 
            id="marksObtained" 
            label="Marks Obtained" 
            value={marksObtained} 
            onChange={e => setMarksObtained(e.target.value)} 
            required 
            className="border-cyan-200 focus:border-cyan-400 focus:ring-cyan-200"
            labelClassName="text-cyan-700"
          />
          <Input 
            id="maxMarks" 
            label="Maximum Marks" 
            value={maxMarks} 
            onChange={e => setMaxMarks(e.target.value)} 
            required 
            className="border-cyan-200 focus:border-cyan-400 focus:ring-cyan-200"
            labelClassName="text-cyan-700"
          />
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