import React, { useState } from 'react';
import { Payment } from './Payment/Payment';
import { Button } from '../Button';

interface FormSubmissionFlowProps {
  formData: any;
  onPaymentComplete: () => void;
  onBackToForm?: () => void; // Add this prop
}

export const FormSubmissionFlow: React.FC<FormSubmissionFlowProps> = ({
  formData,
  onPaymentComplete,
  onBackToForm
}) => {
  const [showPayment, setShowPayment] = useState(false);

  if (!showPayment) {
    return (
      <div className="max-w-4xl mx-auto bg-white shadow-sm rounded-xl border border-cyan-100 p-8">
        <div className="bg-cyan-50 border-l-4 border-cyan-400 p-4 rounded mb-6">
          <p className="text-sm text-cyan-800">
            Please review your application before final submission.<br />
            When ready, proceed to payment.
          </p>
        </div>
        {/* You can show a summary of formData here if you want */}
        <div className="flex justify-between mt-8">
          <Button
            label="Back to Form"
            onClick={onBackToForm}
            className="text-cyan-600 border-cyan-200 hover:bg-cyan-50 px-4 py-2 rounded-lg"
          />
          <Button
            label="Proceed to Payment"
            onClick={() => setShowPayment(true)}
            className="bg-gradient-to-r from-cyan-400 to-blue-400 text-white px-6 py-2 rounded-lg hover:from-cyan-500 hover:to-blue-500 transition-all duration-300 shadow-sm"
          />
        </div>
      </div>
    );
  }

  return (
    <Payment
      onComplete={onPaymentComplete}
      onPrevious={() => setShowPayment(false)} // <-- Add this
    />
  );
};