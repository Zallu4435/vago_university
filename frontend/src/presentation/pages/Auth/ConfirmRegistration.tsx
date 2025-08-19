import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { FaSpinner, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { authService } from '../../../application/services/auth.service';
import type { ConfirmRegistrationStatus } from '../../../domain/types/auth/ConfirmRegistration';

const ConfirmRegistration = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<ConfirmRegistrationStatus>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const confirmRegistration = async () => {
      try {
        const token = searchParams.get('token');
        if (!token) {
          throw new Error('Invalid confirmation link: Token is missing');
        }
                
        const response = await authService.confirmRegistration(token);
        setStatus('success');
        setMessage(response.message || 'Email confirmed successfully. You can now log in.');
      } catch (error: unknown) {
        console.error('Confirmation error:', error);
        setStatus('error');
        let errorMessage = 'An error occurred while confirming your email.';
        if (error instanceof Error) {
          errorMessage = error.message;
        } else if (typeof error === 'string') {
          errorMessage = error;
        }
        setMessage(errorMessage);
      }
    };

    confirmRegistration();
  }, [searchParams]);

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <div className="flex flex-col items-center">
            <FaSpinner className="animate-spin text-4xl text-blue-500 mb-4" />
            <p className="text-lg text-gray-600">Confirming your email...</p>
          </div>
        );
      case 'success':
        return (
          <div className="flex flex-col items-center">
            <FaCheckCircle className="text-4xl text-green-500 mb-4" />
            <p className="text-lg text-gray-600 text-center mb-6">{message}</p>
            <button
              onClick={() => navigate('/login')}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Proceed to Login
            </button>
          </div>
        );
      case 'error':
        return (
          <div className="flex flex-col items-center">
            <FaTimesCircle className="text-4xl text-red-500 mb-4" />
            <p className="text-lg text-gray-600 text-center mb-6">{message}</p>
            <div className="space-x-4">
              <button
                onClick={() => navigate('/register')}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Register Again
              </button>
              <button
                onClick={() => navigate('/')}
                className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Return to Home
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-cyan-50 via-white to-cyan-50">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            {status === 'loading' ? 'Email Confirmation' : 
             status === 'success' ? 'Email Confirmed' : 
             'Confirmation Error'}
          </h2>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default ConfirmRegistration;
