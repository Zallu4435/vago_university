import React, { useState } from 'react';
import { Payment } from './Payment/Payment';
import { Button } from '../Button';
import { 
  FaChevronLeft,    // Closest alternative to ChevronLeft
  FaCreditCard,     // CreditCard
  FaExclamationCircle, // Alternative to AlertCircle
  FaFileAlt         // Closest to FileText
} from 'react-icons/fa';

interface FormSubmissionFlowProps {
  formData: any;
  onPaymentComplete: () => void;
  onBackToForm?: () => void;
}

export const FormSubmissionFlow: React.FC<FormSubmissionFlowProps> = ({
  formData,
  onPaymentComplete,
  onBackToForm
}) => {
  const [showPayment, setShowPayment] = useState(false);

  const renderKeyValue = (label: string, value: any) => (
    <div className="flex justify-between py-2 text-sm border-b border-gray-200 last:border-0">
      <strong className="text-gray-700">{label}</strong>
      <span className="text-gray-900 font-medium max-w-[60%] text-right">
        {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value || '—'}
      </span>
    </div>
  );

  const renderSection = (title: string, data: any) => (
    <div className="mb-4 bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
        <h3 className="text-md font-semibold text-gray-800">{title}</h3>
      </div>
      <div className="p-4">
        {data && typeof data === 'object' ? (
          Object.entries(data).map(([key, value]) => {
            if (Array.isArray(value)) {
              return value.length ? (
                <div key={key} className="mb-3">
                  <strong className="text-gray-700 block mb-1">{key}:</strong>
                  <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                    {value.map((item, idx) => (
                      <li key={idx}>{typeof item === 'object' ? JSON.stringify(item) : item}</li>
                    ))}
                  </ul>
                </div>
              ) : null;
            }
            return renderKeyValue(key, value);
          })
        ) : (
          <p className="text-gray-500 text-sm italic">No data available.</p>
        )}
      </div>
    </div>
  );

  if (!showPayment) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-md rounded-xl border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-6 py-4">
            <h2 className="text-xl font-semibold">Application Summary</h2>
            <p className="text-blue-100 text-sm mt-1">Please review your information before proceeding</p>
          </div>

          {/* Alert Notice */}
          <div className="bg-amber-50 border-l-4 border-amber-400 p-4 flex items-start gap-3">
            <FaExclamationCircle className="text-amber-500 mt-0.5 flex-shrink-0" size={20} />
            <div>
              <p className="text-sm text-amber-800">
                Please carefully review your application details before final submission.
                Once submitted, changes cannot be made.
              </p>
            </div>
          </div>

          {/* Application Sections */}
          <div className="p-6">
            <div className="space-y-4 max-h-[60vh] overflow-auto pr-2">
              {renderSection('Personal Information', formData.personalInfo)}
              {renderSection('Choice of Study', formData.choiceOfStudy)}
              {renderSection('Education', formData.education)}
              {renderSection('Achievements', formData.achievements)}
              {renderSection('Other Information', formData.otherInformation)}
              {renderSection('Documents', formData.documents)}
              {renderSection('Declaration', formData.declaration)}
            </div>

            <div className="flex items-center justify-between mt-8 pt-4 border-t border-gray-200">
              <Button
                label="Back to Edit"
                onClick={onBackToForm}
                className="flex items-center gap-2 text-gray-600 bg-white border border-gray-300 hover:bg-gray-50 px-4 py-2 rounded-md font-medium transition-colors"
                icon={<FaChevronLeft size={16} />}
              />
              <Button
                label="Proceed to Payment"
                onClick={() => setShowPayment(true)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md font-medium transition-colors shadow-sm"
                icon={<FaCreditCard size={16} />}
              />
            </div>
          </div>
        </div>
        <div className="text-center mt-4">
          <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
            <FaFileAlt size={14} />
            Your information is secure and will only be used for application purposes
          </p>
        </div>
      </div>
    );
  }

  return (
    <Payment
      onComplete={onPaymentComplete}
      onPrevious={() => setShowPayment(false)}
    />
  );
};