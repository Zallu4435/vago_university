import React, { useState } from 'react';
import PaymentDetails from './PaymentDetails';
import { PaymentMethods } from './PaymentMethods';
import { PaymentSummary } from './PaymentSummary';
import { Button } from '../../Button';
import { 
  FaExclamationCircle, 
  FaArrowLeft, 
  FaCheckCircle 
} from 'react-icons/fa';
import { useApplicationForm } from '../../../../application/hooks/useApplicationForm';

interface PaymentProps {
  formData: {
    applicationId: string;
    [key: string]: any;
  };
  onComplete: () => void;
  onPrevious: () => void;
}

export const Payment: React.FC<PaymentProps> = ({ 
  formData, 
  onComplete, 
  onPrevious 
}) => {
  const [selectedMethod, setSelectedMethod] = useState<string>('stripe');
  const [isProcessing, setIsProcessing] = useState(false);
  const { processPayment, submitApplication } = useApplicationForm();
  const [submissionStatus, setSubmissionStatus] = useState<{
    success: boolean | null;
    message: string | null;
  }>({ success: null, message: null });

  const handlePayment = async (paymentDetails?: { paymentMethodId: string }) => {
    console.log('Starting payment process', { formData, selectedMethod, paymentDetails });
    setIsProcessing(true);
    setSubmissionStatus({ success: null, message: null });

    try {
      if (!selectedMethod) {
        throw new Error('Please select a payment method');
      }

      if (selectedMethod === 'stripe' && !paymentDetails?.paymentMethodId) {
        throw new Error('Payment method ID is required');
      }

      const paymentPayload = {
        applicationId: formData.applicationId,
        paymentDetails: {
          method: selectedMethod,
          amount: 1000.00,
          currency: 'INR',
          paymentMethodId: paymentDetails?.paymentMethodId,
        },
      };

      console.log('Payment Payload:', paymentPayload);
      const paymentResult = await processPayment(paymentPayload);
      console.log('Payment Result:', paymentResult);

      if (paymentResult.status !== 'completed') {
        let errorMessage = paymentResult.message || 'Payment processing failed';
        if (paymentResult.status === 'pending') {
          errorMessage = 'Payment is still processing. Please wait and try again.';
        } else if (paymentResult.status === 'requires_action') {
          errorMessage = 'Additional payment verification required. Please follow the instructions.';
        } else if (paymentResult.status === 'failed') {
          errorMessage = 'Payment failed. Please try a different payment method.';
        }
        throw new Error(errorMessage);
      }

      const submissionResult = await submitApplication({
        applicationId: formData.applicationId,
        paymentId: paymentResult.paymentId,
      });
      console.log('Submission Result:', submissionResult);

      setSubmissionStatus({
        success: true,
        message: submissionResult.message || 'Application submitted successfully!',
      });

      onComplete();
    } catch (error: any) {
      console.error('Payment and Submission Error:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Failed to submit application. Please try again.';
      setSubmissionStatus({
        success: false,
        message: errorMessage,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-md rounded-xl border border-cyan-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-5 border-b border-cyan-100 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-cyan-900 flex items-center gap-3">
          <FaCheckCircle className="text-cyan-600" />
          Application Fee Payment
        </h2>
      </div>

      <div className="p-6 space-y-6">
        {/* Status Notification */}
        {submissionStatus.message && (
          <div className={`
            mb-4 p-4 flex items-start gap-3 rounded-lg border-l-4 
            ${submissionStatus.success 
              ? 'bg-green-50 border-green-400' 
              : 'bg-red-50 border-red-400'}
          `}>
            <FaExclamationCircle 
              className={`mt-0.5 flex-shrink-0 ${
                submissionStatus.success 
                  ? 'text-green-500' 
                  : 'text-red-500'
              }`} 
              size={20} 
            />
            <p className={`text-sm ${
              submissionStatus.success 
                ? 'text-green-800' 
                : 'text-red-800'
            }`}>
              {submissionStatus.message}
            </p>
          </div>
        )}

        {/* Payment Info Banner */}
        <div className="bg-cyan-50 border-l-4 border-cyan-400 p-4 rounded-lg flex items-center gap-3">
          <FaExclamationCircle className="text-cyan-500 flex-shrink-0" size={20} />
          <p className="text-sm text-cyan-800">
            Complete the application fee payment to proceed with your admission process. 
            Please note that this fee is <strong>non-refundable</strong>.
          </p>
        </div>

        {/* Payment Summary */}
        <PaymentSummary 
          amount={1000.00}
          currency="INR"
          description="Application Processing Fee"
        />

        {/* Payment Methods */}
        <PaymentMethods 
          selectedMethod={selectedMethod}
          onMethodSelect={setSelectedMethod}
        />

        {/* Payment Details */}
        {selectedMethod === 'stripe' && (
          <PaymentDetails 
            method={selectedMethod}
            amount={1000.00}
            currency="INR"
            onSubmit={handlePayment}
          />
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between p-6 border-t border-cyan-100">
        <Button 
          label="Previous"
          variant="outline"
          type="button"
          onClick={onPrevious}
          icon={<FaArrowLeft />}
          className="text-cyan-600 border-cyan-200 hover:bg-cyan-50 px-4 py-2 rounded-lg flex items-center gap-2"
        />
      </div>
    </div>
  );
};