import React from 'react';
import { FaInfoCircle, FaMoneyCheckAlt } from 'react-icons/fa';
import { PaymentSummaryProps } from '../../../../domain/types/application';

export const PaymentSummary: React.FC<PaymentSummaryProps> = ({
  amount,
  currency,
  description,
}) => {
  const formattedAmount = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
  }).format(amount);

  return (
    <div className="bg-white border border-cyan-200 rounded-xl overflow-hidden shadow-sm">
      <div className="bg-cyan-50 px-4 py-3 border-b border-cyan-200 flex items-center space-x-3">
        <FaMoneyCheckAlt className="text-cyan-600" size={20} />
        <h3 className="text-lg font-semibold text-cyan-900">Payment Summary</h3>
      </div>
      
      <div className="p-6 space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <FaInfoCircle className="text-cyan-500" />
            <span className="text-cyan-800 font-medium">{description}</span>
          </div>
          <span className="text-lg font-semibold text-cyan-900">
            {formattedAmount}
          </span>
        </div>
        
        <div className="border-t border-cyan-100 pt-4">
          <div className="flex justify-between items-center">
            <span className="text-cyan-800 font-semibold">Total Payable</span>
            <span className="text-xl font-bold text-cyan-900">
              {formattedAmount}
            </span>
          </div>
        </div>

        <div className="bg-amber-50 border-l-4 border-amber-400 p-3 rounded text-sm text-amber-800">
          <p>
            <strong>Note:</strong> This application fee is non-refundable and must be paid to complete your application process.
          </p>
        </div>
      </div>
    </div>
  );
};