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
      <h3 className="text-lg font-semibold text-cyan-900">Payment Details</h3>

      {method === 'credit_card' && (
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.target as HTMLFormElement;
            const details = {
              cardNumber: form.card_number.value,
              expiryDate: form.expiry_date.value,
              cvv: form.cvv.value,
              cardHolder: form.card_holder.value,
            };
            onSubmit(details);
          }}
        >
          <Input
            id="card_number"
            label="Card Number"
            placeholder="1234 5678 9012 3456"
            required
            className="border-cyan-200 focus:border-cyan-400 focus:ring-cyan-200"
            labelClassName="text-cyan-700"
          />
          <div className="grid grid-cols-2 gap-4">
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

          <button
            type="submit"
            className="mt-4 bg-cyan-600 text-white px-6 py-2 rounded-md hover:bg-cyan-700 transition"
          >
            Pay Now
          </button>
        </form>
      )}

      {method === 'stripe' && (
        <div className="bg-cyan-50 p-4 rounded-md border border-cyan-100 text-cyan-800">
          <p className="mb-2">
            Stripe payment integration goes here. Typically, you'd embed Stripe Elements or redirect
            to a Stripe checkout session.
          </p>
          <button
            onClick={() => onSubmit({ method: 'stripe' })}
            className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition"
          >
            Continue to Stripe
          </button>
        </div>
      )}
    </div>
  );
};
