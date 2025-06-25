// src/presentation/pages/ConfirmFaculty.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaSpinner, FaCheckCircle, FaEnvelope } from 'react-icons/fa';

const ConfirmFaculty = () => {
  const { id, action } = useParams();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [facultyDetails, setFacultyDetails] = useState(null);

  useEffect(() => {
    // Validate parameters
    if (!id || !token || (action !== 'accept' && action !== 'reject')) {
      setError('Invalid confirmation link');
      setIsLoading(false);
      return;
    }

    // Fetch faculty details
    const fetchFacultyDetails = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/admin/faculty/${id}/token`, {
          params: { token }
        });

        // window.alert('Success: ' + JSON.stringify(response.data.data, null, 2));
        //         console.log(response.data, "response.data")
        
        const facultyData = response.data.data.faculty;
        setFacultyDetails({
          fullName: facultyData.fullName,
          email: facultyData.email,
          department: facultyData.department,
          status: facultyData.status
        });
        setIsLoading(false);
      } catch (err: any) {
        setError(err.response?.data?.message || 'An error occurred during confirmation');
        setIsLoading(false);
      }
    };

    fetchFacultyDetails();
  }, [id, token, action]);

  const handleConfirmation = async () => {
    setIsLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/admin/faculty/${id}/confirm/${action}`, null, {
        params: { token }
      });
      
      if (action === 'accept') {
        setSuccess('Faculty application accepted. Login credentials have been sent to your email.');
      } else {
        setSuccess('Faculty application rejected. Thank you for your response.');
      }
    } catch (err: any) {
      if (err.response?.status === 400) {
        if (err.response.data.error === 'Token is required') {
          setError('Invalid confirmation link: Token is missing');
        } else if (err.response.data.error === 'Invalid action') {
          setError('Invalid confirmation action');
        } else {
          setError(err.response.data.error || 'Invalid request');
        }
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('An error occurred during confirmation. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-cyan-50 via-white to-cyan-50">
        <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full text-center">
          <FaSpinner className="animate-spin text-4xl text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600">Processing your request...</p>
        </div>
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-cyan-50 via-white to-cyan-50">
        <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full text-center">
          <FaCheckCircle className="text-4xl text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Success</h2>
          <p className="text-gray-600 mb-6">{success}</p>
          {action === 'accept' ? (
            <div className="space-y-4">
              <div className="flex items-center justify-center text-blue-600">
                <FaEnvelope className="mr-2" />
                <p>Check your email for login credentials</p>
              </div>
              <button 
                onClick={() => navigate('/login')}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Proceed to Login
              </button>
            </div>
          ) : (
            <button 
              onClick={() => navigate('/')}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Return to Homepage
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          {action === 'accept' ? 'Accept Faculty Application' : 'Decline Faculty Application'}
        </h2>
        
        {facultyDetails && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-lg mb-2">Faculty Details:</h3>
            <p className="mb-2"><span className="font-medium">Name:</span> {facultyDetails.fullName}</p>
            <p className="mb-2"><span className="font-medium">Email:</span> {facultyDetails.email}</p>
            <p className="mb-2"><span className="font-medium">Department:</span> {facultyDetails.department}</p>
            <p><span className="font-medium">Status:</span> <span className="capitalize">{facultyDetails.status}</span></p>
          </div>
        )}
        
        <div className="mb-6">
          <p className="text-gray-600 text-center">
            {action === 'accept' 
              ? 'By accepting this application, you confirm the faculty member\'s appointment. Login credentials will be sent to their email.'
              : 'Are you sure you want to decline this faculty application? This action cannot be undone.'
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
            {action === 'accept' ? 'Accept Application' : 'Decline Application'}
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

export default ConfirmFaculty;