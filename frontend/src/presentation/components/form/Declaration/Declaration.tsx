import React, { useState } from 'react';
import { SummaryPage } from '../Summary/SummaryPage';
import { Payment } from '../Payment/Payment';
import { Button } from '../../Button';

export const Declaration: React.FC = () => {
  const [step, setStep] = useState<'declaration' | 'summary' | 'payment'>('declaration');
  const [agreements, setAgreements] = useState({
    // ...existing agreements state
  });

  // Collect all form data here
  const formData = {
    // ...all sections' data
    declarations: agreements,
  };

  if (step === 'summary') {
    return (
      <SummaryPage
        formData={formData}
        onProceedToPayment={() => setStep('payment')}
      />
    );
  }

  if (step === 'payment') {
    return (
      <Payment
        onComplete={() => {
          // Show confirmation or redirect
        }}
      />
    );
  }

  // Declaration step
  return (
    <div className="max-w-4xl mx-auto bg-white shadow-sm rounded-xl border border-cyan-100">
      {/* ...existing declaration content... */}
      <div className="flex justify-between p-6 border-t border-cyan-100">
        <Button 
          label="Previous"
          className="text-cyan-600 border-cyan-200 hover:bg-cyan-50 px-4 py-2 rounded-lg"
        />
        <Button 
          label="Submit"
          disabled={!agreements.privacyPolicy}
          onClick={() => setStep('summary')}
          className="bg-gradient-to-r from-cyan-400 to-blue-400 text-white px-6 py-2 rounded-lg hover:from-cyan-500 hover:to-blue-500 transition-all duration-300 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>
    </div>
  );
};