import React, { useState } from 'react';
import { Payment } from './Payment/Payment';
import { Button } from '../Button';
import { 
  FaChevronLeft,
  FaCreditCard,
  FaExclamationCircle, 
  FaFileAlt,
  FaUserCircle,
  FaGraduationCap,
  FaClipboardList,
  FaHeartbeat,
  FaBalanceScale,
  FaAward,
  FaCheckCircle,
  FaHome
} from 'react-icons/fa';

interface FormSubmissionFlowProps {
  formData: any;
  onPaymentComplete: () => void;
  onBackToForm?: () => void;
  onConfirm?: () => void;
}

export const FormSubmissionFlow: React.FC<FormSubmissionFlowProps> = ({
  formData,
  onPaymentComplete,
  onBackToForm,
  onConfirm
}) => {
  const [showPayment, setShowPayment] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<{
    success: boolean | null;
    message: string | null;
  }>({ success: null, message: null });

  // Utility function to format different types of data
  const formatValue = (value: any): string => {
    if (value === null || value === undefined) return '—';
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    if (typeof value === 'object') {
      return Object.entries(value)
        .map(([k, v]) => `${k}: ${formatValue(v)}`)
        .join(', ');
    }
    return String(value);
  };

  // Function to handle new application
  const handleStartNewApplication = () => {
    // Call the onPaymentComplete callback that resets the application state
    console.log("Starting new application...");
        localStorage.removeItem('applicationId')
    if (onPaymentComplete) {
      onPaymentComplete();
    }
  };

  // Function to handle home redirect
  const handleRedirectToHome = () => {
    console.log("Redirecting to home...");
    localStorage.removeItem('applicationId')
    // This would typically use router.push('/') or window.location
    window.location.href = '/';
  };

  // Render a section with a list of key-value pairs
  const renderKeyValueSection = (
    title: string, 
    data: Record<string, any>, 
    icon: React.ReactNode,
    excludeKeys: string[] = []
  ) => {
    if (!data) return null;
    
    const filteredEntries = Object.entries(data)
      .filter(([key]) => !excludeKeys.includes(key) && data[key] !== null && data[key] !== undefined)
      .filter(([, value]) => {
        if (Array.isArray(value)) return value.length > 0;
        if (typeof value === 'string') return value.trim() !== '';
        if (typeof value === 'object' && value !== null) return Object.keys(value).length > 0;
        return true;
      });

    if (filteredEntries.length === 0) return null;

    return (
      <div className="mb-4 bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center gap-3">
          {icon}
          <h3 className="text-md font-semibold text-gray-800">{title}</h3>
        </div>
        <div className="p-4">
          {filteredEntries.map(([key, value]) => {
            if (Array.isArray(value)) {
              return (
                <div key={key} className="mb-3">
                  <strong className="text-gray-700 block mb-1 capitalize">{key}:</strong>
                  <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                    {value.map((item, idx) => (
                      <li key={idx}>{formatValue(item)}</li>
                    ))}
                  </ul>
                </div>
              );
            }
            return (
              <div 
                key={key} 
                className="flex justify-between py-2 text-sm border-b border-gray-200 last:border-0"
              >
                <strong className="text-gray-700 capitalize">{key.replace(/([A-Z])/g, ' $1')}</strong>
                <span className="text-gray-900 font-medium max-w-[60%] text-right">
                  {formatValue(value)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  if (showConfirmation) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-md rounded-xl border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-green-800 text-white px-6 py-4">
            <h2 className="text-xl font-semibold">Application Submitted</h2>
            <p className="text-green-100 text-sm mt-1">Thank you for your submission!</p>
          </div>
          <div className="p-6 text-center">
            <FaCheckCircle className="text-green-500 mx-auto mb-4" size={48} />
            <p className="text-gray-700 mb-4">
              Your application has been successfully submitted. You will receive a confirmation email soon.
            </p>
            <p className="text-gray-500 text-sm mb-6">
              Application ID: <span className="font-medium">{formData.applicationId}</span>
            </p>
            <div className="flex justify-center space-x-4">
              <Button
                label="Start New Application"
                onClick={handleStartNewApplication}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md font-medium transition-colors shadow-sm flex items-center"
                icon={<FaFileAlt className="mr-2" size={16} />}
              />
              <Button
                label="Return to Home"
                onClick={handleRedirectToHome}
                className="bg-cyan-600 hover:bg-cyan-700 text-white px-5 py-2 rounded-md font-medium transition-colors shadow-sm flex items-center"
                icon={<FaHome className="mr-2" size={16} />}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!showPayment) {
    return (
      <div className="max-w-4xl mx-auto">
        {submissionStatus.success === true && (
          <div className="mb-4 bg-green-50 border-l-4 border-green-400 p-4 flex items-start gap-3">
            <FaExclamationCircle className="text-green-500 mt-0.5 flex-shrink-0" size={20} />
            <div>
              <p className="text-sm text-green-800">{submissionStatus.message}</p>
            </div>
          </div>
        )}
        {submissionStatus.success === false && (
          <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4 flex items-start gap-3">
            <FaExclamationCircle className="text-red-500 mt-0.5 flex-shrink-0" size={20} />
            <div>
              <p className="text-sm text-red-800">{submissionStatus.message}</p>
            </div>
          </div>
        )}
        <div className="bg-white shadow-md rounded-xl border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-6 py-4">
            <h2 className="text-xl font-semibold">Application Summary</h2>
            <p className="text-blue-100 text-sm mt-1">Please review your information before proceeding</p>
          </div>
          <div className="bg-amber-50 border-l-4 border-amber-400 p-4 flex items-start gap-3">
            <FaExclamationCircle className="text-amber-500 mt-0.5 flex-shrink-0" size={20} />
            <div>
              <p className="text-sm text-amber-800">
                Please carefully review your application details before final submission.
                Once submitted, changes cannot be made.
              </p>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4 max-h-[60vh] overflow-auto pr-2">
              {renderKeyValueSection(
                'Personal Information', 
                formData.personalInfo, 
                <FaUserCircle className="text-blue-600" />,
                ['applicationId']
              )}
              {formData.choiceOfStudy && (
                <div className="mb-4 bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                  <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center gap-3">
                    <FaGraduationCap className="text-blue-600" />
                    <h3 className="text-md font-semibold text-gray-800">Choices of Study</h3>
                  </div>
                  <div className="p-4">
                    {formData.choiceOfStudy.map((choice: any, index: number) => (
                      <div 
                        key={index} 
                        className="mb-2 pb-2 border-b border-gray-200 last:border-0"
                      >
                        <div className="flex justify-between">
                          <strong className="text-gray-700">Programme {index + 1}:</strong>
                          <span className="text-gray-900 font-medium">{choice.programme}</span>
                        </div>
                        <div className="flex justify-between">
                          <strong className="text-gray-700">Preferred Major:</strong>
                          <span className="text-gray-900 font-medium">{choice.preferredMajor}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {renderKeyValueSection(
                'Education', 
                formData.education, 
                <FaClipboardList className="text-blue-600" />
              )}
              {renderKeyValueSection(
                'Achievements', 
                formData.achievements, 
                <FaAward className="text-blue-600" />,
                ['achievements', 'editingIndex', 'showModal', 'newAchievement', 'hasNoAchievements']
              )}
              {renderKeyValueSection(
                'Other Information - Health', 
                formData.otherInformation?.health || {}, 
                <FaHeartbeat className="text-blue-600" />
              )}
              {renderKeyValueSection(
                'Other Information - Legal', 
                formData.otherInformation?.legal || {}, 
                <FaBalanceScale className="text-blue-600" />
              )}
              {renderKeyValueSection(
                'Declaration', 
                formData.declaration || {}, 
                <FaClipboardList className="text-blue-600" />
              )}
              {formData.documents && (
                <div className="mb-4 bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                  <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center gap-3">
                    <FaFileAlt className="text-blue-600" />
                    <h3 className="text-md font-semibold text-gray-800">Uploaded Documents</h3>
                  </div>
                  <div className="p-4">
                    <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                      {formData.documents.documents.map((doc: any, index: number) => (
                        <li key={index}>
                          {Object.entries(doc).map(([key, value]) => 
                            `${key}: ${formatValue(value)}`
                          ).join(', ')}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center justify-between mt-8 pt-4 border-t border-gray-200">
              <Button
                label="Back to Edit"
                onClick={onBackToForm}
                className="flex items-center gap-2 text-gray-600 bg-white border border-gray-300 hover:bg-gray-50 px-4 py-2 rounded-md font-medium transition-colors"
                icon={<FaChevronLeft size={16} />}
              />
              <Button
                label="Proceed to Payment"
                onClick={() => setShowPayment(true)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md font-medium transition-colors shadow-sm"
                icon={<FaCreditCard size={16} />}
              />
            </div>
          </div>
        </div>
        <div className="text-center mt-4">
          <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
            <FaFileAlt size={14} />
            Your information is secure and will only be used for application purposes
          </p>
        </div>
      </div>
    );
  }

  return (
    <Payment
      formData={formData}
      onComplete={() => setShowConfirmation(true)}
      onPrevious={() => setShowPayment(false)}
    />
  );
};