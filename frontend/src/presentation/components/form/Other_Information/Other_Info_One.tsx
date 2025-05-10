import React, { useEffect, useState } from 'react';
import HealthConditionForm from './HealthConditionForm';
import HealthConditionTable from './HealthConditionTable';
import { Input } from '../../Input';
import { Button } from '../../Button';
import { radioOptions } from './options';
import { HealthInfo } from '../../../../domain/types/formTypes';

interface HealthCondition {
  condition: string;
  details: string;
}

interface Props {
  value: HealthInfo;
  onChange: (data: HealthInfo) => void;
  onNext: () => void;
}


const Other_Info_One: React.FC<Props> = ({ value, onChange, onNext }) => {
  const [hasHealthSupport, setHasHealthSupport] = useState<boolean | null>(null);
  const [conditions, setConditions] = useState<HealthCondition[]>([]);
  const [showModal, setShowModal] = useState(false);

  const handleAddCondition = (condition: HealthCondition) => {
    if (conditions.length < 3) {
      setConditions([...conditions, condition]);
    }
  };

  useEffect(() => {
    if (hasHealthSupport) {
      const details = conditions.map(c => `${c.condition}: ${c.details}`).join('; ');
      onChange({
        medicalConditions: details,
        disabilities: '',
        specialNeeds: '',
      });
    } else if (hasHealthSupport === false) {
      onChange({
        medicalConditions: 'None',
        disabilities: '',
        specialNeeds: '',
      });
    }
  }, [hasHealthSupport, conditions]);


  return (
    <div className="max-w-4xl mx-auto bg-white shadow-sm rounded-xl border border-cyan-100">
      <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-4 border-b border-cyan-100">
        <h2 className="text-xl font-semibold text-cyan-900">Health And Support</h2>
      </div>

      <div className="p-6">
        <div className="bg-cyan-50 border-l-4 border-cyan-400 p-4 rounded mb-6">
          <p className="text-sm text-cyan-800">
            Do you have any past or current health conditions or disabilities that may require support or facilities?
          </p>
        </div>

        <div className="mb-6 flex items-center space-x-6">
          {radioOptions.map(opt => (
            <div className="flex items-center" key={opt.label}>
              <input
                type="radio"
                id={`health_support_${opt.label.toLowerCase()}`}
                name="health_support"
                checked={hasHealthSupport === opt.value}
                onChange={() => setHasHealthSupport(opt.value)}
                className="form-radio h-4 w-4 text-cyan-600 border-cyan-300 focus:ring-cyan-200"
              />
              <label
                htmlFor={`health_support_${opt.label.toLowerCase()}`}
                className="ml-2 text-cyan-800"
              >
                {opt.label}
              </label>
            </div>
          ))}
        </div>

        {hasHealthSupport && (
          <>
            <div className="flex justify-between items-center mb-4">
              <span className="text-cyan-600 text-sm">Max 3 Conditions</span>
              <Button
                label="Add Health and Support Condition"
                onClick={() => setShowModal(true)}
                disabled={conditions.length >= 3}
                className="bg-gradient-to-r from-cyan-400 to-blue-400 text-white px-4 py-2 rounded-lg hover:from-cyan-500 hover:to-blue-500 transition-all duration-300 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
            <HealthConditionTable conditions={conditions} />
          </>
        )}

        <div className="bg-cyan-50 border-l-4 border-cyan-400 p-4 rounded mt-6">
          <p className="text-sm text-cyan-800">
            <strong>Note:</strong> Disclosure will not disadvantage your application. The information will enable
            the University to develop a better understanding of an applicant's need for support during their studies.
          </p>
        </div>
      </div>

      <div className="flex justify-between p-6 mt-4 border-t border-cyan-100">
        <Button
          label="Previous"
          disabled
          className="text-cyan-600 border-cyan-200 hover:bg-cyan-50 disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <Button
          label="Save and Next"
          onClick={onNext}
          className="bg-gradient-to-r from-cyan-400 to-blue-400 text-white px-6 py-2 rounded-lg hover:from-cyan-500 hover:to-blue-500 transition-all duration-300 shadow-sm"
        />
      </div>

      <HealthConditionForm
        onAddCondition={handleAddCondition}
        showModal={showModal}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
};

export default Other_Info_One;
