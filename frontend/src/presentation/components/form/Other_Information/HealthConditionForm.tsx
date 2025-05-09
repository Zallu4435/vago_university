import React, { useState } from 'react';
import { Input } from '../../Input';
import { Button } from '../../Button';
import { Textarea } from '../../Textarea';

interface HealthCondition {
  condition: string;
  details: string;
}

interface HealthConditionFormProps {
  onAddCondition: (condition: HealthCondition) => void;
  showModal: boolean;
  onClose: () => void;
}

const HealthConditionForm: React.FC<HealthConditionFormProps> = ({ onAddCondition, showModal, onClose }) => {
  const [newCondition, setNewCondition] = useState<HealthCondition>({ condition: '', details: '' });

  const handleAddCondition = () => {
    if (newCondition.condition && newCondition.details) {
      onAddCondition(newCondition);
      setNewCondition({ condition: '', details: '' });
      onClose();
    }
  };

  return (
    showModal && (
      <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 backdrop-blur-sm">
        <div className="bg-white rounded-xl shadow-lg border border-cyan-100 max-w-2xl w-full">
          <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-4 border-b border-cyan-100">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-cyan-900">Add Health Condition</h3>
              <button
                onClick={onClose}
                className="text-cyan-400 hover:text-cyan-600 transition-colors"
                aria-label="Close"
              >
                ×
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="space-y-6">
              <Input
                id="condition"
                label="Health and Support Condition"
                value={newCondition.condition}
                onChange={e => setNewCondition({ ...newCondition, condition: e.target.value })}
                required
                className="border-cyan-200 focus:border-cyan-400 focus:ring-cyan-200 bg-white"
                labelClassName="text-cyan-700"
              />
              <Textarea
                id="details"
                label="Health and Support Condition Details"
                value={newCondition.details}
                onChange={e => setNewCondition({ ...newCondition, details: e.target.value })}
                rows={4}
                required
                className="border-cyan-200 focus:border-cyan-400 focus:ring-cyan-200 bg-white"
                labelClassName="text-cyan-700"
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 p-6 bg-gray-50 border-t border-cyan-100">
            <Button 
              label="Cancel" 
              variant="outline" 
              onClick={onClose}
              className="text-cyan-600 border-cyan-200 hover:bg-cyan-50"
            />
            <Button 
              label="Add" 
              variant="primary" 
              onClick={handleAddCondition}
              className="bg-gradient-to-r from-cyan-400 to-blue-400 text-white hover:from-cyan-500 hover:to-blue-500"
            />
          </div>
        </div>
      </div>
    )
  );
};
export default HealthConditionForm;
