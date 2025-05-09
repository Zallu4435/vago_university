import React from 'react';
import { Input } from '../../Input';
import { Button } from '../../Button';
import { Select } from '../../Select';
import { Textarea } from '../../Textarea';
import { getReferenceFields, getSelectFields } from './fields';

interface ReferenceContact {
  firstName: string;
  lastName: string;
  position: string;
  email: string;
  phone: {
    country: string;
    area: string;
    number: string;
  };
}

interface Achievement {
  activity: string;
  level: string;
  levelOfAchievement: string;
  positionHeld: string;
  organizationName: string;
  fromDate: string;
  toDate: string;
  description: string;
}

interface AchievementModalProps {
  show: boolean;
  onClose: () => void;
  onSubmit: () => void;
  newAchievement: Achievement;
  setNewAchievement: (a: Achievement) => void;
  referenceContact: ReferenceContact;
  setReferenceContact: (r: ReferenceContact) => void;
}

export const AchievementModal: React.FC<AchievementModalProps> = ({
  show,
  onClose,
  onSubmit,
  newAchievement,
  setNewAchievement,
  referenceContact,
  setReferenceContact,
}) => {
  if (!show) return null;

  const selectFields = getSelectFields(newAchievement, setNewAchievement);
  const referenceFields = getReferenceFields(referenceContact, setReferenceContact);

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-cyan-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-4 border-b border-cyan-100">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-cyan-900">Add Achievement</h2>
            <Button
              onClick={onClose}
              aria-label="Close"
              label="×"
              variant="ghost"
              className="text-cyan-400 hover:text-cyan-600 transition-colors px-2 py-0 text-xl font-bold"
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-6">
            {selectFields.map(field => (
              <Select
                key={field.id}
                id={field.id}
                label={field.label}
                options={field.options}
                value={field.value}
                onChange={e => field.onChange(e.target.value)}
                required
                placeholder={field.placeholder}
                className="border-cyan-200 focus:border-cyan-400 focus:ring-cyan-200 bg-white"
                labelClassName="text-cyan-700"
              />
            ))}
            <Input
              id="organizationName"
              label="Name of Activity / Organisation / Employer"
              value={newAchievement.organizationName}
              onChange={e => setNewAchievement({ ...newAchievement, organizationName: e.target.value })}
              placeholder="Enter organization or employer name"
              className="border-cyan-200 focus:border-cyan-400 focus:ring-cyan-200 bg-white"
              labelClassName="text-cyan-700"
            />
            <Input
              id="fromDate"
              label="From (MM/YYYY)"
              value={newAchievement.fromDate}
              onChange={e => setNewAchievement({ ...newAchievement, fromDate: e.target.value })}
              required
              placeholder="MM/YYYY"
              className="border-cyan-200 focus:border-cyan-400 focus:ring-cyan-200 bg-white"
              labelClassName="text-cyan-700"
            />
            <Input
              id="toDate"
              label="To (MM/YYYY)"
              value={newAchievement.toDate}
              onChange={e => setNewAchievement({ ...newAchievement, toDate: e.target.value })}
              required
              placeholder="MM/YYYY"
              className="border-cyan-200 focus:border-cyan-400 focus:ring-cyan-200 bg-white"
              labelClassName="text-cyan-700"
            />
          </div>

          <div className="mb-6">
            <Textarea
              id="description"
              label="Key Contribution Description"
              value={newAchievement.description}
              onChange={e => setNewAchievement({ ...newAchievement, description: e.target.value.slice(0, 1000) })}
              required
              placeholder="Describe your achievement (max 1000 characters)"
              className="border-cyan-200 focus:border-cyan-400 focus:ring-cyan-200 bg-white"
              labelClassName="text-cyan-700"
              maxLength={1000}
              rows={4}
            />
          </div>

          {/* Reference Section */}
          <div className="border-t border-cyan-100 pt-6 mt-6">
            <h3 className="text-lg font-medium text-cyan-800 mb-4">Reference Contact</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              {referenceFields.map(field => (
                <Input
                  key={field.id}
                  id={field.id}
                  label={field.label}
                  type={field.type || 'text'}
                  value={field.value}
                  onChange={e => field.onChange(e.target.value)}
                  placeholder={field.placeholder} // <-- now included!
                  className="border-cyan-200 focus:border-cyan-400 focus:ring-cyan-200 bg-white"
                  labelClassName="text-cyan-700"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-4 p-6 bg-gray-50 border-t border-cyan-100">
          <Button
            label="Cancel"
            variant="outline"
            onClick={onClose}
            className="text-cyan-600 border-cyan-200 hover:bg-cyan-50"
          />
          <Button
            label="Submit"
            variant="primary"
            onClick={onSubmit}
            className="bg-gradient-to-r from-cyan-400 to-blue-400 text-white hover:from-cyan-500 hover:to-blue-500"
          />
        </div>
      </div>
    </div>
  );
};
