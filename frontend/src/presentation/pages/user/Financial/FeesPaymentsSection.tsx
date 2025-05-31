import { useState } from 'react';
import { FaMoneyCheckAlt, FaTimes } from 'react-icons/fa';
import { useFinancial } from '../../../../application/hooks/useFinancial';

export default function FeesPaymentsSection({ studentInfo, currentCharges, paymentHistory }) {
  const { makePayment, loading, error } = useFinancial();
  const [paymentAmount, setPaymentAmount] = useState(studentInfo?.accountBalance || 0);
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [amountError, setAmountError] = useState(null);

  const totalDue = () => {
    return currentCharges.reduce((sum, charge) => sum + (charge.amount || 0), 0);
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    if (paymentAmount <= 0) {
      setAmountError('Payment amount must be greater than zero.');
      return;
    }
    setAmountError(null);
    const payment = {
      amount: paymentAmount,
      method: paymentMethod,
      term: studentInfo?.term || 'Spring 2025',
    };
    await makePayment(payment);
    setPaymentAmount(0);
  };

  return (
    <div className="relative">
      {/* Header */}
      <div className="relative overflow-hidden rounded-t-2xl shadow-xl bg-gradient-to-r from-amber-600 to-orange-500 group mb-6">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/30 to-orange-600/30"></div>
        <div className="absolute -top-8 -left-8 w-48 h-48 rounded-full bg-gradient-to-br from-yellow-300/30 to-orange-300/30 blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-gradient-to-br from-amber-200/20 to-orange-200/20 blur-2xl animate-pulse delay-700"></div>
        <div className="relative z-10 p-4 sm:p-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent"></div>
                <FaMoneyCheckAlt size={20} className="text-white relative z-10" />
              </div>
              <div className="absolute -inset-1 bg-gradient-to-br from-orange-400/30 to-amber-500/30 rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                Fee Payment Portal
              </h3>
              <div className="h-1 w-16 bg-gradient-to-r from-orange-400 to-amber-500 rounded-full mt-1 group-hover:w-24 transition-all duration-300"></div>
            </div>
          </div>
          <span className="bg-amber-200 text-orange-800 px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
            Spring 2025
          </span>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-2xl shadow-xl bg-white/70 backdrop-blur-md border border-amber-100/50 group hover:shadow-2xl transition-all duration-500">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-200/0 to-amber-200/0 group-hover:from-orange-200/20 group-hover:to-amber-200/20 rounded-2xl blur transition-all duration-300"></div>
        <div className="relative z-10 p-4 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            {/* Current Charges */}
            <div className="flex flex-col">
              <h4 className="text-lg font-semibold text-orange-800 mb-4 border-b border-amber-200 pb-2">
                Current Charges
              </h4>
              <div className="relative overflow-hidden rounded-lg bg-amber-50 p-4 border border-amber-200/50 group/item hover:border-orange-200/50 hover:shadow-lg transition-all duration-300 flex-1 min-h-[200px] flex flex-col justify-between">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-200/0 to-amber-200/0 group-hover/item:from-orange-200/20 group-hover/item:to-amber-200/20 rounded-lg blur transition-all duration-300"></div>
                <div className="relative z-10">
                  {currentCharges.length === 0 ? (
                    <p className="text-gray-600 text-sm">No current charges.</p>
                  ) : (
                    <table className="w-full text-sm sm:text-base">
                      <tbody>
                        {currentCharges.map((charge, index) => (
                          <tr
                            key={charge.id || index}
                            className={index !== currentCharges.length - 1 ? 'border-b border-amber-200' : ''}
                          >
                            <td className="py-2 text-orange-800">{charge.description}</td>
                            <td className="py-2 text-right text-orange-800 font-medium">
                              ${charge.amount?.toLocaleString() || '0.00'}
                            </td>
                          </tr>
                        ))}
                        <tr className="border-t-2 border-amber-300">
                          <td className="py-2 text-orange-800 font-semibold">Total Due</td>
                          <td className="py-2 text-right text-orange-800 font-bold">
                            ${totalDue().toLocaleString() || '0.00'}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>

            {/* Make a Payment */}
            <div className="flex flex-col">
              <h4 className="text-lg font-semibold text-orange-800 mb-4 border-b border-amber-200 pb-2">
                Make a Payment
              </h4>
              <div className="relative overflow-hidden rounded-lg bg-amber-50 p-4 border border-amber-200/50 group/item hover:border-orange-200/50 hover:shadow-lg transition-all duration-300 flex-1 min-h-[200px] flex flex-col justify-between">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-200/0 to-amber-200/0 group-hover/item:from-orange-200/20 group-hover/item:to-amber-200/20 rounded-lg blur transition-all duration-300"></div>
                <div className="relative z-10 flex flex-col h-full">
                  {error && (
                    <div className="mb-4 p-3 bg-gray-200 text-red-600 rounded-lg text-sm">
                      {error}
                    </div>
                  )}
                  <form onSubmit={handlePayment} className="flex flex-col h-full justify-between">
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="paymentAmount" className="block text-sm font-medium text-gray-700 mb-1">
                          Payment Amount ($)
                        </label>
                        <input
                          type="number"
                          id="paymentAmount"
                          className="block w-full px-4 py-2 bg-white/70 backdrop-blur-md border border-amber-100/50 rounded-full focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 text-sm sm:text-base placeholder-gray-400"
                          value={paymentAmount}
                          onChange={(e) => setPaymentAmount(parseFloat(e.target.value) || 0)}
                          required
                          min="0"
                          step="0.01"
                          disabled={loading}
                          placeholder="0.00"
                        />
                        {amountError && (
                          <p className="mt-1 text-xs text-red-500">{amountError}</p>
                        )}
                      </div>
                      <div>
                        <p className="block text-sm font-medium text-gray-700 mb-2">Payment Method</p>
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 flex-wrap">
                          {['Credit Card', 'Bank Transfer', 'Financial Aid'].map((method) => (
                            <label key={method} className="flex items-center text-sm text-gray-600 cursor-pointer">
                              <input
                                type="radio"
                                name="paymentMethod"
                                value={method}
                                checked={paymentMethod === method}
                                onChange={() => setPaymentMethod(method)}
                                className="mr-2 accent-orange-500 focus:ring-orange-500"
                                disabled={loading}
                              />
                              {method}
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 mt-4">
                      <button
                        type="submit"
                        disabled={loading}
                        className="group flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white py-2 sm:py-3 px-4 rounded-full font-medium transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2 text-sm sm:text-base"
                      >
                        <span>{loading ? 'Processing...' : 'Proceed to Payment'}</span>
                        <FaMoneyCheckAlt size={12} className="group-hover:translate-x-1 transition-transform duration-300" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentAmount(totalDue())}
                        disabled={loading}
                        className="group bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white py-2 sm:py-3 px-4 rounded-full font-medium transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2 text-sm sm:text-base"
                      >
                        <span>Pay Full</span>
                        <FaMoneyCheckAlt size={12} className="group-hover:translate-x-1 transition-transform duration-300" />
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>

          {/* Payment History */}
          <div className="mt-6">
            <h4 className="text-lg font-semibold text-orange-800 mb-4 border-b border-amber-200 pb-2">
              Payment History
            </h4>
            <div className="relative overflow-hidden rounded-lg bg-amber-50 p-4 border border-amber-200/50 group/item hover:border-orange-200/50 hover:shadow-lg transition-all duration-300">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-200/0 to-amber-200/0 group-hover/item:from-orange-200/20 group-hover/item:to-amber-200/20 rounded-lg blur transition-all duration-300"></div>
              <div className="relative z-10 overflow-x-auto">
                {paymentHistory.length === 0 ? (
                  <p className="text-gray-600 text-sm">No payment history available.</p>
                ) : (
                  <table className="min-w-full text-sm sm:text-base">
                    <thead>
                      <tr className="bg-white/70 backdrop-blur-md">
                        <th className="py-3 px-2 sm:px-4 text-left text-orange-800 font-semibold">Date</th>
                        <th className="py-3 px-2 sm:px-4 text-left text-orange-800 font-semibold">Description</th>
                        <th className="py-3 px-2 sm:px-4 text-left text-orange-800 font-semibold">Method</th>
                        <th className="py-3 px-2 sm:px-4 text-right text-orange-800 font-semibold">Amount</th>
                        <th className="py-3 px-2 sm:px-4 text-center text-orange-800 font-semibold">Receipt</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paymentHistory.map((payment, index) => (
                        <tr
                          key={payment.id || `${payment.date}-${payment.description}-${index}`}
                          className="border-b border-amber-200/50 hover:bg-amber-100/50 transition-all duration-200"
                        >
                          <td className="py-2 px-2 sm:px-4 text-gray-700">{payment.date}</td>
                          <td className="py-2 px-2 sm:px-4 text-gray-600">{payment.description}</td>
                          <td className="py-2 px-2 sm:px-4 text-gray-600">{payment.method}</td>
                          <td className="py-2 px-2 sm:px-4 text-right text-gray-700 font-medium">
                            ${payment.amount?.toLocaleString() || '0.00'}
                          </td>
                          <td className="py-2 px-2 sm:px-4 text-center">
                            <button className="text-orange-600 hover:text-orange-800 underline text-sm transition-all duration-200">
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
