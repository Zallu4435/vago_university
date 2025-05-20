import { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaTimesCircle, FaSpinner } from 'react-icons/fa';
import { admissionService } from '../services/admission.service';

const AdmissionConfirmation = () => {
  const { id, action } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const confirmAdmission = async () => {
      try {
        const token = searchParams.get('token');
        if (!token || !id || !action) {
          throw new Error('Invalid confirmation link');
        }

        if (action === 'accept') {
          await admissionService.confirmAdmission(id, token, true);
          setStatus('success');
          setMessage('Admission has been successfully confirmed!');
        } else if (action === 'reject') {
          await admissionService.confirmAdmission(id, token, false);
          setStatus('success');
          setMessage('Admission has been rejected.');
        } else {
          throw new Error('Invalid action');
        }
      } catch (error: any) {
        setStatus('error');
        setMessage(error.message || 'An error occurred while processing your request.');
      }
    };

    confirmAdmission();
  }, [id, action, searchParams]);

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <div className="flex flex-col items-center">
            <FaSpinner className="animate-spin text-4xl text-blue-500 mb-4" />
            <p className="text-lg text-gray-600">Processing your request...</p>
          </div>
        );
      case 'success':
        return (
          <div className="flex flex-col items-center">
            <FaCheckCircle className="text-4xl text-green-500 mb-4" />
            <p className="text-lg text-gray-600">{message}</p>
            <button
              onClick={() => navigate('/login')}
              className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Go to Login
            </button>
          </div>
        );
      case 'error':
        return (
          <div className="flex flex-col items-center">
            <FaTimesCircle className="text-4xl text-red-500 mb-4" />
            <p className="text-lg text-gray-600">{message}</p>
            <button
              onClick={() => navigate('/')}
              className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Return to Home
            </button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-cyan-50 via-white to-cyan-50">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            {status === 'loading' ? 'Processing Request' : 
             status === 'success' ? 'Request Processed' : 
             'Error Processing Request'}
          </h2>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AdmissionConfirmation; 