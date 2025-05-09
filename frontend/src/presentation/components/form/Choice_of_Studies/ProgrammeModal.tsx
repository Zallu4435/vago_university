import React from 'react';
import { Select } from '../../Select';
import { Button } from '../../Button';
import { programmeOptions, majorOptions } from './options';

interface ProgrammeModalProps {
  showModal: boolean;
  onClose: () => void;
  onSubmit: (programme: string, major: string) => void;
  newProgramme: string;
  setNewProgramme: (value: string) => void;
  newMajor: string;
  setNewMajor: (value: string) => void;
}

export const ProgrammeModal: React.FC<ProgrammeModalProps> = ({
  showModal,
  onClose,
  onSubmit,
  newProgramme,
  setNewProgramme,
  newMajor,
  setNewMajor,
}) => {
  if (!showModal) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProgramme) return;
    onSubmit(newProgramme, newMajor);
  };

  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative border border-blue-100">
        <button
          className="absolute top-4 right-4 text-blue-400 hover:text-blue-600 transition-colors"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        <h2 className="text-xl font-semibold mb-6 text-blue-900">Add Programme</h2>
        <form onSubmit={handleSubmit}>
          <Select
            id="programme"
            label="Programme"
            options={programmeOptions}
            value={newProgramme}
            onChange={e => setNewProgramme(e.target.value)}
            required
            className="border-blue-200 focus:border-blue-400 focus:ring-blue-200 bg-white mb-4"
            labelClassName="text-blue-700"
          />
          <Select
            id="preferredMajor"
            label="Preferred Major"
            options={majorOptions}
            value={newMajor}
            onChange={e => setNewMajor(e.target.value)}
            disabled={!newProgramme}
            required={!!newProgramme}
            className="border-blue-200 focus:border-blue-400 focus:ring-blue-200 bg-white"
            labelClassName="text-blue-700"
          />
          <div className="flex justify-end mt-6">
            <Button 
              label="Add" 
              type="submit" 
              variant="primary"
              className="bg-gradient-to-r from-blue-400 to-sky-400 hover:from-blue-500 hover:to-sky-500 text-white px-6 py-2 rounded-lg transition-all duration-300 shadow-sm" 
            />
          </div>
        </form>
      </div>
    </div>
  );
};