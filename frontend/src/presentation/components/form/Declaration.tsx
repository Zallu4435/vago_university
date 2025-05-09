import React, { useState } from 'react';

export const Declaration: React.FC = () => {
  const [agreements, setAgreements] = useState({
    privacyPolicy: false,
    marketingEmail: false,
    marketingCall: false
  });

  const handleCheckboxChange = (field: keyof typeof agreements) => {
    setAgreements(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-sm rounded-xl border border-cyan-100">
      <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-4 border-b border-cyan-100">
        <h2 className="text-xl font-semibold text-cyan-900">Declaration and Agreement</h2>
      </div>

      <div className="p-6">
        <div className="bg-cyan-50 border-l-4 border-cyan-400 p-4 rounded mb-6">
          <p className="text-sm text-cyan-800">
            Please read the declaration and agreements carefully before proceeding.
          </p>
        </div>

        <div className="space-y-6">
          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="agree_privacy"
              className="mt-1 form-checkbox h-4 w-4 text-cyan-600 border-cyan-300 rounded focus:ring-cyan-200"
              checked={agreements.privacyPolicy}
              onChange={() => handleCheckboxChange('privacyPolicy')}
            />
            <label htmlFor="agree_privacy" className="text-cyan-800">
              I have read and I agree to the terms and conditions contained in the
              <a href="#" className="text-cyan-600 hover:text-cyan-700 hover:underline ml-1">Privacy Notice</a>
              <span className="text-red-500 ml-1">*</span>
            </label>
          </div>

          <div className="space-y-4 text-cyan-800">
            <p>
              I hereby declare that all information provided by me in connection with this application is true, accurate and complete.
            </p>

            <p>
              I understand that any inaccurate, incomplete or false information given or any omission of information required shall render this application invalid and NUS may at its discretion withdraw any offer of acceptance made to me on the basis of such information or, if already admitted, I may be liable to disciplinary action, which may result in my expulsion from NUS. And I hereby authorize NUS to obtain and verify any part of the information given by me from or with any source (such as Ministry of Education), as it deems appropriate.
            </p>

            <p>
              I declare and warrant that for any personal data of other individuals disclosed by me in connection with this application, I have, prior to disclosing such personal data to NUS, obtained the appropriate consent from the individuals whose personal data are being disclosed, to permit NUS to collect, use and disclose such personal data for purposes related to this application, as set out fully in the{' '}
              <a href="#" className="text-cyan-600 hover:text-cyan-700 hover:underline">Personal Data Notice</a>.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="marketing_email"
                className="mt-1 form-checkbox h-4 w-4 text-cyan-600 border-cyan-300 rounded focus:ring-cyan-200"
                checked={agreements.marketingEmail}
                onChange={() => handleCheckboxChange('marketingEmail')}
              />
              <label htmlFor="marketing_email" className="text-cyan-800">
                I agree to receive marketing, advertising and promotional information from NUS via postal mail, electronic mail and/or SMS/MMS. (Optional)
              </label>
            </div>

            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="marketing_call"
                className="mt-1 form-checkbox h-4 w-4 text-cyan-600 border-cyan-300 rounded focus:ring-cyan-200"
                checked={agreements.marketingCall}
                onChange={() => handleCheckboxChange('marketingCall')}
              />
              <label htmlFor="marketing_call" className="text-cyan-800">
                I agree to receive marketing, advertising and promotional information from NUS at my provided telephone number(s) via voice call/phone call. (Optional)
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};