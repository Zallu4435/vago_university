import { useState } from 'react';

export default function FinancialServices() {
  const [studentInfo] = useState({
    name: "John Smith",
    accountBalance: "$3,450.00",
    paymentDueDate: "May 15, 2025",
    financialAidStatus: "Approved"
  });
  
  const [currentCharges] = useState([
    { description: "Tuition", amount: "$2,800.00" },
    { description: "Technology Fee", amount: "$250.00" },
    { description: "Health Insurance", amount: "$400.00" }
  ]);
  
  const [paymentHistory] = useState([
    { 
      date: "12/15/2024", 
      description: "Fall 2024 Tuition Payment", 
      method: "Credit Card", 
      amount: "$3,200.00",
      id: 1
    },
    { 
      date: "08/01/2024", 
      description: "Housing Fee Payment", 
      method: "Bank Transfer", 
      amount: "$1,800.00",
      id: 2
    },
    { 
      date: "05/15/2024", 
      description: "Enrollment Deposit", 
      method: "Credit Card", 
      amount: "$500.00",
      id: 3
    }
  ]);
  
  const [paymentAmount, setPaymentAmount] = useState("3,450.00");
  const [paymentMethod, setPaymentMethod] = useState("credit");
  
  const totalDue = () => {
    let total = 0;
    currentCharges.forEach(charge => {
      total += parseFloat(charge.amount.replace('$', '').replace(',', ''));
    });
    return total.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  };
  
  return (
    <div className="bg-amber-50 min-h-screen pb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-amber-500 text-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold">University Portal</h1>
          <div className="flex items-center gap-3">
            <span>{studentInfo.name}</span>
            <span className="bg-amber-200 text-orange-800 rounded-full w-8 h-8 flex items-center justify-center font-medium">JS</span>
            <span className="bg-white text-orange-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">3</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white">
        <div className="container mx-auto px-4">
          <nav className="flex">
            <a href="#" className="px-4 py-3 text-white hover:bg-orange-600 transition duration-200">Dashboard</a>
            <a href="#" className="px-4 py-3 text-white hover:bg-orange-600 transition duration-200">Academics</a>
            <a href="#" className="px-4 py-3 bg-orange-700 text-white font-medium">Financial</a>
            <a href="#" className="px-4 py-3 text-white hover:bg-orange-600 transition duration-200">Communication</a>
            <a href="#" className="px-4 py-3 text-white hover:bg-orange-600 transition duration-200">Campus Life</a>
          </nav>
        </div>
      </div>

      {/* Financial Services Summary */}
      <div className="container mx-auto px-4 mt-6">
        <div className="bg-gradient-to-r from-amber-100 to-orange-100 p-4 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-orange-800">Financial Services</h2>
          <div className="flex flex-col md:flex-row md:justify-between mt-2">
            <div className="text-orange-700">
              <span className="font-medium">Account Balance:</span> {studentInfo.accountBalance}
            </div>
            <div className="text-orange-700 mt-1 md:mt-0">
              <span className="font-medium">Payment Due:</span> {studentInfo.paymentDueDate}
            </div>
            <div className="text-orange-700 mt-1 md:mt-0">
              <span className="font-medium">Financial Aid Status:</span> 
              <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-sm ml-1">
                {studentInfo.financialAidStatus}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="container mx-auto px-4 mt-6">
        <div className="flex bg-gray-100 rounded-t-lg overflow-hidden">
          <a href="#" className="py-3 px-6 font-medium text-white bg-gradient-to-r from-orange-500 to-amber-500">
            Fees and Payments
          </a>
          <a href="#" className="py-3 px-6 text-amber-700 hover:text-orange-600 hover:bg-amber-50">
            Financial Aid
          </a>
          <a href="#" className="py-3 px-6 text-amber-700 hover:text-orange-600 hover:bg-amber-50">
            Scholarships
          </a>
        </div>
      </div>

      {/* Fee Payment Portal */}
      <div className="container mx-auto px-4">
        <div className="bg-gradient-to-r from-orange-600 to-amber-500 p-4 rounded-t-lg shadow-sm">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">Fee Payment Portal</h2>
            <span className="text-white font-medium">Spring 2025</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white p-6 shadow-md rounded-b-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Current Charges */}
            <div>
              <h3 className="text-lg font-semibold text-orange-800 mb-4 border-b border-amber-200 pb-2">Current Charges</h3>
              <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-4 rounded-lg border border-amber-200">
                <table className="w-full">
                  <tbody>
                    {currentCharges.map((charge, index) => (
                      <tr key={index} className={index !== currentCharges.length - 1 ? "border-b border-amber-200" : ""}>
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
              <h3 className="text-lg font-semibold text-orange-800 mb-4 border-b border-amber-200 pb-2">Make a Payment</h3>
              <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-4 rounded-lg border border-amber-200">
                <div className="mb-4">
                  <label htmlFor="paymentAmount" className="block text-orange-800 font-medium mb-1">Payment Amount: $</label>
                  <input 
                    type="text" 
                    id="paymentAmount" 
                    className="w-full border border-amber-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
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
                        checked={paymentMethod === "credit"}
                        onChange={() => setPaymentMethod("credit")}
                        className="mr-2 accent-orange-500"
                      />
                      Credit Card
                    </label>
                    
                    <label className="flex items-center text-orange-800">
                      <input 
                        type="radio" 
                        name="paymentMethod" 
                        value="bank" 
                        checked={paymentMethod === "bank"}
                        onChange={() => setPaymentMethod("bank")}
                        className="mr-2 accent-orange-500"
                      />
                      Bank Transfer
                    </label>
                    
                    <label className="flex items-center text-orange-800">
                      <input 
                        type="radio" 
                        name="paymentMethod" 
                        value="aid" 
                        checked={paymentMethod === "aid"}
                        onChange={() => setPaymentMethod("aid")}
                        className="mr-2 accent-orange-500"
                      />
                      Financial Aid
                    </label>
                  </div>
                </div>
                
                <div className="flex justify-between gap-2">
                  <button className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-md transition duration-200 flex-grow">
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
            <h3 className="text-lg font-semibold text-orange-800 mb-4 border-b border-amber-200 pb-2">Payment History</h3>
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
      </div>
      
      {/* Footer */}
      <div className="container mx-auto px-4 mt-6">
        <div className="text-center text-xs text-amber-700 border-t border-amber-200 pt-4">
          © 2025 University Portal Help | Privacy Policy | Terms of Use
        </div>
      </div>
    </div>
  );
}