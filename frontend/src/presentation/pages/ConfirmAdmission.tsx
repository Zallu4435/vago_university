import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ConfirmAdmission = () => {
  const { id, action } = useParams();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [admissionDetails, setAdmissionDetails] = useState(null);

  useEffect(() => {
    // Validate parameters
    if (!id || !token || (action !== 'accept' && action !== 'reject')) {
      setError('Invalid confirmation link');
      setIsLoading(false);
      return;
    }

    // Fetch admission details to show the user what they're confirming
    const fetchAdmissionDetails = async () => {
      try {
        const response = await axios.get(`/api/admissions/${id}`, {
          params: { token }
        });
        setAdmissionDetails(response.data);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load admission details. The link may be expired or invalid.');
        setIsLoading(false);
      }
    };

    fetchAdmissionDetails();
  }, [id, token, action]);

  const handleConfirmation = async () => {
    setIsLoading(true);
    try {
      await axios.post(`/api/admissions/${id}/confirm/${action}`, null, {
        params: { token }
      });
      
      if (action === 'accept') {
        setSuccess('You have successfully accepted the admission offer! Your account has been created.');
      } else {
        setSuccess('You have declined the admission offer. Thank you for your response.');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred during confirmation');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="spinner border-t-4 border-blue-500 border-solid rounded-full w-12 h-12 animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full">
          <div className="text-red-500 text-center mb-4">
            <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Error</h2>
          <p className="text-gray-600 text-center">{error}</p>
          <div className="mt-6 text-center">
            <button 
              onClick={() => navigate('/')} 
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Return to Homepage
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full">
          <div className="text-green-500 text-center mb-4">
            <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Success</h2>
          <p className="text-gray-600 text-center">{success}</p>
          {action === 'accept' && (
            <div className="mt-6 text-center">
              <button 
                onClick={() => navigate('/login')} 
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Proceed to Login
              </button>
            </div>
          )}
          {action === 'reject' && (
            <div className="mt-6 text-center">
              <button 
                onClick={() => navigate('/')} 
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Return to Homepage
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          {action === 'accept' ? 'Accept Admission Offer' : 'Decline Admission Offer'}
        </h2>
        
        {admissionDetails && (
          <div className="mb-6 p-4 bg-gray-50 rounded-md">
            <h3 className="font-semibold text-lg mb-2">Admission Details:</h3>
            <p><span className="font-medium">Name:</span> {admissionDetails.fullName}</p>
            <p><span className="font-medium">Email:</span> {admissionDetails.email}</p>
            <p><span className="font-medium">Program:</span> {admissionDetails.program}</p>
          </div>
        )}
        
        <div className="mb-6">
          <p className="text-gray-600 text-center">
            {action === 'accept' 
              ? 'By accepting this offer, you confirm your enrollment in the program. A user account will be created for you.'
              : 'Are you sure you want to decline this admission offer? This action cannot be undone.'
            }
          </p>
        </div>
        
        <div className="flex justify-center space-x-4">
          <button
            onClick={handleConfirmation}
            className={`px-4 py-2 rounded ${
              action === 'accept' 
                ? 'bg-green-500 hover:bg-green-600' 
                : 'bg-red-500 hover:bg-red-600'
            } text-white`}
          >
            {action === 'accept' ? 'Accept Offer' : 'Decline Offer'}
          </button>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmAdmission;