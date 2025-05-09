import React from 'react';

const paymentMethods = [
  { id: 'credit_card', name: 'Credit Card', icon: '💳' },
  { id: 'debit_card', name: 'Debit Card', icon: '💳' },
  { id: 'bank_transfer', name: 'Bank Transfer', icon: '🏦' },
  { id: 'paypal', name: 'PayPal', icon: 'Ⓟ' },
];

interface PaymentMethodsProps {
  selectedMethod: string;
  onMethodSelect: (method: string) => void;
}

export const PaymentMethods: React.FC<PaymentMethodsProps> = ({
  selectedMethod,
  onMethodSelect,
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-cyan-900">Select Payment Method</h3>
      <div className="grid grid-cols-2 gap-4">
        {paymentMethods.map((method) => (
          <button
            key={method.id}
            onClick={() => onMethodSelect(method.id)}
            className={`p-4 border rounded-lg flex items-center space-x-3 transition-all duration-300 ${
              selectedMethod === method.id
                ? 'border-cyan-400 bg-cyan-50'
                : 'border-gray-200 hover:border-cyan-200'
            }`}
          >
            <span className="text-2xl">{method.icon}</span>
            <span className="text-cyan-800">{method.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};