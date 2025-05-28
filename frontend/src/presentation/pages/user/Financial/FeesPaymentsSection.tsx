import { useState } from 'react';
import { useFinancial } from '../../../../application/hooks/useFinancial';
import { PaymentForm } from '../../../../domain/types/financial';

interface FeesPaymentsSectionProps {
  studentInfo: any;
  currentCharges: any[];
  paymentHistory: any[];
}

export default function FeesPaymentsSection({ studentInfo, currentCharges, paymentHistory }: FeesPaymentsSectionProps) {
  const { makePayment, loading, error } = useFinancial();
  const [paymentAmount, setPaymentAmount] = useState(studentInfo?.accountBalance || 0);
  const [paymentMethod, setPaymentMethod] = useState<'Credit Card' | 'Bank Transfer' | 'Financial Aid'>('Credit Card');

  const totalDue = () => {
    let total = 0;
    currentCharges.forEach((charge) => {
      total += charge.amount;
    });
    return total;
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    const payment: PaymentForm = {
      amount: paymentAmount,
      method: paymentMethod,
      term: studentInfo?.term || 'Spring 2025'
    };
    await makePayment(payment);
  };

  return (
    <>
      <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg p-4 mb-4 text-white shadow-lg">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold">Fee Payment Portal</h3>
          <span className="bg-amber-200 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">Spring 2025</span>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Current Charges */}
          <div>
            <h4 className="text-lg font-semibold text-orange-800 mb-4 border-b border-amber-200 pb-2">Current Charges</h4>
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
              <table className="w-full">
                <tbody>
                  {currentCharges.map((charge, index) => (
                    <tr
                      key={index}
                      className={index !== currentCharges.length - 1 ? 'border-b border-amber-200' : ''}
                    >
                      <td className="py-3 text-orange-800">{charge.description}</td>
                      <td className="py-3 text-right text-orange-800 font-medium">${charge.amount.toLocaleString()}</td>
                    </tr>
                  ))}
                  <tr className="border-t-2 border-amber-300">
                    <td className="py-3 text-orange-800 font-semibold">Total Due</td>
                    <td className="py-3 text-right text-orange-800 font-bold">${totalDue().toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          {/* Make a Payment */}
          <div>
            <h4 className="text-lg font-semibold text-orange-800 mb-4 border-b border-amber-200 pb-2">Make a Payment</h4>
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
              {error && (
                <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
                  {error}
                </div>
              )}
              <form onSubmit={handlePayment}>
                <div className="mb-4">
                  <label htmlFor="paymentAmount" className="block text-orange-800 font-medium mb-1">
                    Payment Amount: $
                  </label>
                  <input
                    type="number"
                    id="paymentAmount"
                    className="w-full border border-amber-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(parseFloat(e.target.value))}
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
                <div className="mb-4">
                  <p className="block text-orange-800 font-medium mb-2">Payment Method:</p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <label className="flex items-center text-orange-800">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="Credit Card"
                        checked={paymentMethod === 'Credit Card'}
                        onChange={() => setPaymentMethod('Credit Card')}
                        className="mr-2 accent-orange-500"
                      />
                      Credit Card
                    </label>
                    <label className="flex items-center text-orange-800">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="Bank Transfer"
                        checked={paymentMethod === 'Bank Transfer'}
                        onChange={() => setPaymentMethod('Bank Transfer')}
                        className="mr-2 accent-orange-500"
                      />
                      Bank Transfer
                    </label>
                    <label className="flex items-center text-orange-800">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="Financial Aid"
                        checked={paymentMethod === 'Financial Aid'}
                        onChange={() => setPaymentMethod('Financial Aid')}
                        className="mr-2 accent-orange-500"
                      />
                      Financial Aid
                    </label>
                  </div>
                </div>
                <div className="flex justify-between gap-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white py-2 px-4 rounded-md transition duration-200 flex-grow disabled:opacity-50"
                  >
                    {loading ? 'Processing...' : 'Proceed to Payment'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentAmount(totalDue())}
                    className="bg-amber-600 hover:bg-amber-700 text-white py-2 px-4 rounded-md transition duration-200"
                  >
                    Pay Full
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* Payment History */}
        <div className="mt-6">
          <h4 className="text-lg font-semibold text-orange-800 mb-4 border-b border-amber-200 pb-2">
            Payment History
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-amber-100 to-orange-100">
                  <th className="py-3 px-4 text-left text-orange-800 font-semibold">Date</th>
                  <th className="py-3 px-4 text-left text-orange-800 font-semibold">Description</th>
                  <th className="py-3 px-4 text-left text-orange-800 font-semibold">Method</th>
                  <th className="py-3 px-4 text-right text-orange-800 font-semibold">Amount</th>
                  <th className="py-3 px-4 text-center text-orange-800 font-semibold">Receipt</th>
                </tr>
              </thead>
              <tbody>
                {paymentHistory.map((payment) => (
                  <tr key={payment.id} className="border-b border-amber-100 hover:bg-amber-50">
                    <td className="py-3 px-4 text-orange-900">{payment.date}</td>
                    <td className="py-3 px-4 text-orange-800">{payment.description}</td>
                    <td className="py-3 px-4 text-orange-800">{payment.method}</td>
                    <td className="py-3 px-4 text-right text-orange-800 font-medium">${payment.amount.toLocaleString()}</td>
                    <td className="py-3 px-4 text-center">
                      <button className="text-orange-600 hover:text-orange-800 underline">View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}