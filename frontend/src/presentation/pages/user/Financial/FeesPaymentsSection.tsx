import { useState } from 'react';
import PropTypes from 'prop-types';

export default function FeesPaymentsSection({ studentInfo, currentCharges, paymentHistory }) {
  const [paymentAmount, setPaymentAmount] = useState('3450.00');
  const [paymentMethod, setPaymentMethod] = useState('credit');

  const totalDue = () => {
    let total = 0;
    currentCharges.forEach((charge) => {
      total += parseFloat(charge.amount.replace('$', '').replace(',', ''));
    });
    return total.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
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
                      <td className="py-3 text-right text-orange-800 font-medium">{charge.amount}</td>
                    </tr>
                  ))}
                  <tr className="border-t-2 border-amber-300">
                    <td className="py-3 text-orange-800 font-semibold">Total Due</td>
                    <td className="py-3 text-right text-orange-800 font-bold">{totalDue()}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          {/* Make a Payment */}
          <div>
            <h4 className="text-lg font-semibold text-orange-800 mb-4 border-b border-amber-200 pb-2">Make a Payment</h4>
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
              <div className="mb-4">
                <label htmlFor="paymentAmount" className="block text-orange-800 font-medium mb-1">
                  Payment Amount: $
                </label>
                <input
                  type="text"
                  id="paymentAmount"
                  className="w-full border border-amber-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <p className="block text-orange-800 font-medium mb-2">Payment Method:</p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <label className="flex items-center text-orange-800">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="credit"
                      checked={paymentMethod === 'credit'}
                      onChange={() => setPaymentMethod('credit')}
                      className="mr-2 accent-orange-500"
                    />
                    Credit Card
                  </label>
                  <label className="flex items-center text-orange-800">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="bank"
                      checked={paymentMethod === 'bank'}
                      onChange={() => setPaymentMethod('bank')}
                      className="mr-2 accent-orange-500"
                    />
                    Bank Transfer
                  </label>
                  <label className="flex items-center text-orange-800">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="aid"
                      checked={paymentMethod === 'aid'}
                      onChange={() => setPaymentMethod('aid')}
                      className="mr-2 accent-orange-500"
                    />
                    Financial Aid
                  </label>
                </div>
              </div>
              <div className="flex justify-between gap-2">
                <button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white py-2 px-4 rounded-md transition duration-200 flex-grow">
                  Proceed to Payment
                </button>
                <button className="bg-amber-600 hover:bg-amber-700 text-white py-2 px-4 rounded-md transition duration-200">
                  Pay Full
                </button>
              </div>
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
                    <td className="py-3 px-4 text-right text-orange-800 font-medium">{payment.amount}</td>
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

FeesPaymentsSection.propTypes = {
  studentInfo: PropTypes.shape({
    name: PropTypes.string.isRequired,
    accountBalance: PropTypes.string.isRequired,
    paymentDueDate: PropTypes.string.isRequired,
    financialAidStatus: PropTypes.string.isRequired,
  }).isRequired,
  currentCharges: PropTypes.arrayOf(
    PropTypes.shape({
      description: PropTypes.string.isRequired,
      amount: PropTypes.string.isRequired,
    })
  ).isRequired,
  paymentHistory: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      date: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      method: PropTypes.string.isRequired,
      amount: PropTypes.string.isRequired,
    })
  ).isRequired,
};