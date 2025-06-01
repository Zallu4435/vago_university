import { useState, useEffect } from 'react';
import { FaMoneyCheckAlt, FaTimes } from 'react-icons/fa';
import { useFinancial } from '../../../../application/hooks/useFinancial';
import { usePreferences } from '../../../context/PreferencesContext';

export default function FeesPaymentsSection({ studentInfo, paymentHistory }) {
  const { makePayment, loading, error } = useFinancial();
  const { styles, theme } = usePreferences();
  const [paymentAmount, setPaymentAmount] = useState(studentInfo[0]?.amount || 0);
  const [paymentMethod, setPaymentMethod] = useState('Razorpay');
  const [amountError, setAmountError] = useState(null);

  // Load Razorpay SDK dynamically
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const totalDue = () => {
    return studentInfo.reduce((sum, charge) => sum + (charge.amount || 0), 0);
  };

  console.log(studentInfo, 'studentInfo');

  const handlePayment = async (e) => {
    e.preventDefault();
    if (paymentAmount <= 0) {
      setAmountError('Payment amount must be greater than zero.');
      return;
    }
    setAmountError(null);

    try {
      // Call backend to create Razorpay order
      const payment = {
        amount: paymentAmount,
        method: paymentMethod,
        term: studentInfo[0]?.term || 'Spring 2025',
      };
      const response = await makePayment(payment);

      // Initialize Razorpay checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Replace with your Razorpay Key ID
        amount: paymentAmount * 100, // Razorpay expects amount in paise
        currency: 'INR',
        name: 'Your Institution Name',
        description: `Payment for ${studentInfo[0]?.term || 'Spring 2025'} Fees`,
        order_id: response.orderId, // Order ID from backend
        handler: async (response) => {
          // Handle successful payment
          try {
            await makePayment({
              ...payment,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature,
            });
            setPaymentAmount(0);
            alert('Payment successful!');
          } catch (err) {
            setAmountError('Payment verification failed.');
          }
        },
        prefill: {
          name: studentInfo[0]?.name || 'Student Name',
          email: studentInfo[0]?.email || '',
          contact: studentInfo[0]?.contact || '',
        },
        theme: {
          color: '#F59E0B', // Amber color to match theme
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (response) => {
        setAmountError(`Payment failed: ${response.error.description}`);
      });
      rzp.open();
    } catch (err) {
      setAmountError('Failed to initiate payment.');
    }
  };

  return (
    <div className="relative">
      <div className={`relative overflow-hidden rounded-t-2xl shadow-xl bg-gradient-to-r ${styles.accent} group mb-6`}>
        <div className={`absolute inset-0 bg-gradient-to-r ${styles.orb.primary}`}></div>
        <div className={`absolute -top-8 -left-8 w-48 h-48 rounded-full bg-gradient-to-br ${styles.orb.primary} blur-3xl animate-pulse`}></div>
        <div className={`absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-gradient-to-br ${styles.orb.secondary} blur-2xl animate-pulse delay-700`}></div>
        <div className="relative z-10 p-4 sm:p-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${styles.accent} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent"></div>
                <FaMoneyCheckAlt size={20} className="text-white relative z-10" />
              </div>
              <div className={`absolute -inset-1 bg-gradient-to-br ${styles.orb.primary} rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity duration-300`}></div>
            </div>
            <div>
              <h3 className={`text-xl sm:text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'} bg-clip-text`}>
                Fee Payment Portal
              </h3>
              <div className={`h-1 w-16 bg-gradient-to-r ${styles.accent} rounded-full mt-1 group-hover:w-24 transition-all duration-300`}></div>
            </div>
          </div>
          <span className={`bg-amber-200 text-orange-800 px-3 py-1 rounded-full text-xs sm:text-sm font-medium`}>
            Spring 2025
          </span>
        </div>
      </div>

      <div className={`relative overflow-hidden rounded-2xl shadow-xl ${styles.card.background} border ${styles.border} group hover:${styles.card.hover} transition-all duration-500`}>
        <div className={`absolute -inset-0.5 bg-gradient-to-r ${styles.orb.secondary} rounded-2xl blur transition-all duration-300`}></div>
        <div className="relative z-10 p-4 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            <div className="flex flex-col">
              <h4 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'} mb-4 border-b ${styles.border} pb-2`}>
                Current Charges
              </h4>
              <div className={`relative overflow-hidden rounded-lg ${styles.card.background} p-4 border ${styles.border} group/item hover:${styles.card.hover} transition-all duration-300 flex-1 min-h-[200px] flex flex-col justify-between`}>
                <div className={`absolute -inset-0.5 bg-gradient-to-r ${styles.orb.secondary} rounded-lg blur transition-all duration-300`}></div>
                <div className="relative z-10">
                  {studentInfo.length === 0 ? (
                    <p className={`text-sm ${styles.textSecondary} text-center py-4`}>No current charges.</p>
                  ) : (
                    <div className="space-y-4">
                      {studentInfo.map((charge) => (
                        <div
                          key={charge.id}
                          className={`p-4 rounded-lg border ${styles.border} bg-gradient-to-r ${styles.card.background} hover:${styles.card.hover} transition-all duration-300 shadow-sm`}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h5 className={`text-base font-semibold ${styles.textPrimary}`}>
                                {charge.chargeTitle || 'N/A'}
                              </h5>
                              {charge.chargeDescription && (
                                <p className={`text-sm ${styles.textSecondary} mt-1`}>
                                  {charge.chargeDescription}
                                </p>
                              )}
                              {charge.term && (
                                <p className={`text-sm ${styles.textSecondary} mt-1`}>
                                  <span className="font-medium">Term:</span> {charge.term}
                                </p>
                              )}
                              <p className={`text-sm ${styles.textSecondary} mt-1`}>
                                <span className="font-medium">Due Date:</span>{' '}
                                {charge.paymentDueDate
                                  ? new Date(charge.paymentDueDate).toLocaleDateString('en-US', {
                                      month: '2-digit',
                                      day: '2-digit',
                                      year: 'numeric',
                                    })
                                  : 'N/A'}
                              </p>
                            </div>
                            <div className={`text-right ${styles.textPrimary} font-bold text-base`}>
                              ${charge.amount?.toLocaleString('en-US', { minimumFractionDigits: 2 }) || '0.00'}
                            </div>
                          </div>
                        </div>
                      ))}
                      <div className={`p-4 rounded-lg border ${styles.border} bg-gradient-to-r ${styles.accent} ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-base">Total Due</span>
                          <span className="font-bold text-base">
                            ${totalDue().toLocaleString('en-US', { minimumFractionDigits: 2 }) || '0.00'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col">
              <h4 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'} mb-4 border-b ${styles.border} pb-2`}>
                Make a Payment
              </h4>
              <div className={`relative overflow-hidden rounded-lg ${styles.card.background} p-4 border ${styles.border} group/item hover:${styles.card.hover} transition-all duration-300 flex-1 min-h-[200px] flex flex-col justify-between`}>
                <div className={`absolute -inset-0.5 bg-gradient-to-r ${styles.orb.secondary} rounded-lg blur transition-all duration-300`}></div>
                <div className="relative z-10 flex flex-col h-full">
                  {error && (
                    <div className={`mb-4 p-3 ${styles.status.error} rounded-lg text-sm`}>
                      {error}
                    </div>
                  )}
                  {amountError && (
                    <div className={`mb-4 p-3 ${styles.status.error} rounded-lg text-sm`}>
                      {amountError}
                    </div>
                  )}
                  <form onSubmit={handlePayment} className="flex flex-col h-full justify-between">
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="paymentAmount" className={`block text-sm font-medium ${styles.textPrimary} mb-1`}>
                          Payment Amount ($)
                        </label>
                        <input
                          type="number"
                          id="paymentAmount"
                          className={`block w-full px-4 py-2 ${styles.input.background} border ${styles.input.border} rounded-full focus:${styles.input.focus} transition-all duration-300 text-sm sm:text-base ${styles.textSecondary}`}
                          value={paymentAmount}
                          onChange={(e) => setPaymentAmount(parseFloat(e.target.value) || 0)}
                          required
                          min="0"
                          step="0.01"
                          disabled={loading}
                          placeholder="0.00"
                        />
                      </div>
                      <div>
                        <p className={`block text-sm font-medium ${styles.textPrimary} mb-2`}>Payment Method</p>
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 flex-wrap">
                          <label className={`flex items-center text-sm ${styles.textSecondary} cursor-pointer`}>
                            <input
                              type="radio"
                              name="paymentMethod"
                              value="Razorpay"
                              checked={paymentMethod === 'Razorpay'}
                              onChange={() => setPaymentMethod('Razorpay')}
                              className={`mr-2 accent-amber-500 focus:ring-amber-500`}
                              disabled={loading}
                            />
                            Razorpay
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 mt-4">
                      <button
                        type="submit"
                        disabled={loading}
                        className={`group flex-1 bg-gradient-to-r ${styles.accent} hover:${styles.button.primary} text-white py-2 sm:py-3 px-4 rounded-full font-medium transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2 text-sm sm:text-base`}
                      >
                        <span>{loading ? 'Processing...' : 'Proceed to Payment'}</span>
                        <FaMoneyCheckAlt size={12} className="group-hover:translate-x-1 transition-transform duration-300" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentAmount(totalDue())}
                        disabled={loading}
                        className={`group bg-gradient-to-r ${styles.button.secondary} hover:${styles.button.primary} text-white py-2 sm:py-3 px-4 rounded-full font-medium transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2 text-sm sm:text-base`}
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

          <div className="mt-6">
            <h4 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'} mb-4 border-b ${styles.border} pb-2`}>
              Payment History
            </h4>
            <div className={`relative overflow-hidden rounded-lg ${styles.card.background} p-4 border ${styles.border} group/item hover:${styles.card.hover} transition-all duration-300`}>
              <div className={`absolute -inset-0.5 bg-gradient-to-r ${styles.orb.secondary} rounded-lg blur transition-all duration-300`}></div>
              <div className="relative z-10 overflow-x-auto">
                {paymentHistory.length === 0 ? (
                  <p className={`text-sm ${styles.textSecondary} text-center py-4`}>No payment history available.</p>
                ) : (
                  <table className="min-w-full text-sm sm:text-base">
                    <thead>
                      <tr className={`${styles.card.background}`}>
                        <th className={`py-3 px-2 sm:px-4 text-left ${styles.textPrimary} font-semibold`}>Date</th>
                        <th className={`py-3 px-2 sm:px-4 text-left ${styles.textPrimary} font-semibold`}>Description</th>
                        <th className={`py-3 px-2 sm:px-4 text-left ${styles.textPrimary} font-semibold`}>Method</th>
                        <th className={`py-3 px-2 sm:px-4 text-right ${styles.textPrimary} font-semibold`}>Amount</th>
                        <th className={`py-3 px-2 sm:px-4 text-center ${styles.textPrimary} font-semibold`}>Receipt</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paymentHistory.map((payment, index) => (
                        <tr
                          key={payment.id || `${payment.date}-${payment.description}-${index}`}
                          className={`border-b ${styles.border} hover:bg-amber-100/50 transition-all duration-200`}
                        >
                          <td className={`py-2 px-2 sm:px-4 ${styles.textPrimary}`}>
                            {payment.paidAt
                              ? new Date(payment.paidAt).toLocaleDateString('en-US', {
                                  month: '2-digit',
                                  day: '2-digit',
                                  year: 'numeric',
                                })
                              : 'N/A'}
                          </td>
                          <td className={`py-2 px-2 sm:px-4 ${styles.textSecondary}`}>
                            {payment.chargeTitle || payment.description || 'N/A'}
                          </td>
                          <td className={`py-2 px-2 sm:px-4 ${styles.textSecondary}`}>
                            {payment.method || 'N/A'}
                          </td>
                          <td className={`py-2 px-2 sm:px-4 text-right ${styles.textPrimary} font-medium`}>
                            ${payment.amount?.toLocaleString('en-US', { minimumFractionDigits: 2 }) || '0.00'}
                          </td>
                          <td className="py-2 px-2 sm:px-4 text-center">
                            <button className={`${styles.status.warning} hover:${styles.status.error} underline text-sm transition-all duration-200`}>
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