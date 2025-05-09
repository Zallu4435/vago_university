import React from 'react';

interface PaymentSummaryProps {
  amount: number;
  currency: string;
  description: string;
}

export const PaymentSummary: React.FC<PaymentSummaryProps> = ({
  amount,
  currency,
  description,
}) => {
  return (
    <div className="border border-cyan-200 rounded-lg p-6">
      <h3 className="text-lg font-medium text-cyan-900 mb-4">Payment Summary</h3>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-cyan-800">{description}</span>
          <span className="text-lg font-medium text-cyan-900">
            {currency} {amount.toFixed(2)}
          </span>
        </div>
        
        <div className="border-t border-cyan-100 pt-4">
          <div className="flex justify-between items-center">
            <span className="font-medium text-cyan-800">Total Amount</span>
            <span className="text-xl font-semibold text-cyan-900">
              {currency} {amount.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};