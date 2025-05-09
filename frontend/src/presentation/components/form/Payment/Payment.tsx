import React, { useState } from 'react';
import { PaymentDetails } from './PaymentDetails';
import { PaymentMethods } from './PaymentMethods';
import { PaymentSummary } from './PaymentSummary';
import { Button } from '../../Button';

interface PaymentProps {
  onComplete: () => void;
}

export const Payment: React.FC<PaymentProps> = ({ onComplete }) => {
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleProcessPayment = async () => {
    setIsProcessing(true);
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1000));
      onComplete();
    } catch (error) {
      console.error('Payment failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-sm rounded-xl border border-cyan-100">
      <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-4 border-b border-cyan-100">
        <h2 className="text-xl font-semibold text-cyan-900">Application Fee Payment</h2>
      </div>

      <div className="p-6 space-y-6">
        <div className="bg-cyan-50 border-l-4 border-cyan-400 p-4 rounded">
          <p className="text-sm text-cyan-800">
            Please complete the payment of your application fee to proceed with the admission process.
            The application fee is non-refundable.
          </p>
        </div>

        <PaymentSummary 
          amount={75.00}
          currency="USD"
          description="Application Processing Fee"
        />

        <PaymentMethods 
          selectedMethod={selectedMethod}
          onMethodSelect={setSelectedMethod}
        />

        {selectedMethod && (
          <PaymentDetails 
            method={selectedMethod}
            onSubmit={handleProcessPayment}
          />
        )}
      </div>

      <div className="flex justify-between p-6 border-t border-cyan-100">
        <Button 
          label="Previous"
          variant="outline"
          type="button"
          className="text-cyan-600 border-cyan-200 hover:bg-cyan-50 px-4 py-2 rounded-lg"
        />
        <Button
          label={isProcessing ? "Processing..." : "Process Payment"}
          onClick={handleProcessPayment}
          disabled={isProcessing}
          type="button"
          variant="primary"
          className="bg-gradient-to-r from-cyan-400 to-blue-400 text-white px-6 py-2 rounded-lg hover:from-cyan-500 hover:to-blue-500 transition-all duration-300 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>
    </div>
  );
};