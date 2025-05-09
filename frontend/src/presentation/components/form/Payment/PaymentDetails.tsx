import React from 'react';
import { Input } from '../../Input';

interface PaymentDetailsProps {
  method: string;
  onSubmit: (details: any) => Promise<void>;
}

export const PaymentDetails: React.FC<PaymentDetailsProps> = ({
  method,
  onSubmit,
}) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-cyan-900">Payment Details</h3>

      {method === 'credit_card' || method === 'debit_card' ? (
        <div className="space-y-4">
          <Input
            id="card_number"
            label="Card Number"
            placeholder="1234 5678 9012 3456"
            required
            className="border-cyan-200 focus:border-cyan-400 focus:ring-cyan-200"
            labelClassName="text-cyan-700"
          />
          <div className="grid grid-cols-3 gap-4">
            <Input
              id="expiry_date"
              label="Expiry Date"
              placeholder="MM/YY"
              required
              className="border-cyan-200 focus:border-cyan-400 focus:ring-cyan-200"
              labelClassName="text-cyan-700"
            />
            <Input
              id="cvv"
              label="CVV"
              placeholder="123"
              required
              className="border-cyan-200 focus:border-cyan-400 focus:ring-cyan-200"
              labelClassName="text-cyan-700"
            />
          </div>
          <Input
            id="card_holder"
            label="Cardholder Name"
            placeholder="John Doe"
            required
            className="border-cyan-200 focus:border-cyan-400 focus:ring-cyan-200"
            labelClassName="text-cyan-700"
          />
        </div>
      ) : method === 'bank_transfer' ? (
        <div className="bg-cyan-50 p-4 rounded-lg">
          <p className="text-cyan-800">
            Please use the following bank details for transfer:
          </p>
          <div className="mt-4 space-y-2 text-cyan-700">
            <p>Bank: University Bank</p>
            <p>Account Name: University Admissions</p>
            <p>Account Number: 1234567890</p>
            <p>SWIFT Code: UBANKXX</p>
          </div>
        </div>
      ) : method === 'paypal' ? (
        <div className="text-center">
          <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300">
            Pay with PayPal
          </button>
        </div>
      ) : null}
    </div>
  );
};