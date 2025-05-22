import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { FiX, FiPhone, FiMail, FiShield, FiArrowLeft, FiSmartphone, FiAtSign, FiLock } from 'react-icons/fi';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import '../../firebase/phone-input.css';
import axios from 'axios';
import Cookies from 'js-cookie';
import { setAuth } from '../../presentation/redux/authSlice';

// Mobile OTP Component
const MobileOTPComponent = ({ onBack, onClose }: { onBack: () => void; onClose: () => void }) => {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phoneNumber, setPhoneNumber] = useState<string | undefined>('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendOTP = async () => {
    if (!phoneNumber || !phoneNumber.trim()) {
      setError('Please enter a valid phone number');
      return;
    }

    setLoading(true);
    setError('');

    // Simulate API call
    setTimeout(() => {
      setStep('otp');
      setLoading(false);
      console.log('OTP sent to:', phoneNumber);
    }, 2000);
  };

  const handleVerifyOTP = async () => {
    if (!otp.trim() || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    setError('');

    // Simulate verification
    setTimeout(() => {
      if (otp === '123456') {
        alert('Mobile OTP verification successful!');
        onClose();
      } else {
        setError('Invalid OTP. Please try again. (Use: 123456)');
      }
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {step === 'phone' && (
        <>
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <FiSmartphone className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Mobile Verification</h3>
            <p className="text-gray-600">We'll send a verification code to your phone number</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Phone Number</label>
            <PhoneInput
              defaultCountry="IN"
              value={phoneNumber}
              onChange={(value: string | undefined) => setPhoneNumber(value || '')}
              placeholder="Enter your phone number"
              international
              countryCallingCodeEditable={false}
              className="custom-phone-input w-full flex rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300"
            />
          </div>

          <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl">
            <p className="text-sm text-blue-800 font-medium mb-2">📱 Test Numbers:</p>
            <div className="text-sm text-blue-700 space-y-1">
              <div className="font-mono">+919876543210</div>
              <div className="font-mono">+15551234567</div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">{error}</div>
          )}

          <button
            onClick={handleSendOTP}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Sending OTP...
              </div>
            ) : (
              'Send OTP'
            )}
          </button>
        </>
      )}

      {step === 'otp' && (
        <>
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <FiShield className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Enter Verification Code</h3>
            <p className="text-gray-600 mb-1">We've sent a 6-digit code to</p>
            <p className="font-semibold text-gray-800 text-lg">{phoneNumber}</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Verification Code</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="000000"
              maxLength={6}
              className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-center text-2xl font-mono tracking-widest transition-all"
            />
          </div>

          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl">
            <p className="text-sm text-yellow-800">
              💡 <strong>Demo Mode:</strong> Use code <strong>123456</strong> to verify
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">{error}</div>
          )}

          <div className="space-y-3">
            <button
              onClick={handleVerifyOTP}
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-4 rounded-xl font-semibold hover:from-green-700 hover:to-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Verifying...
                </div>
              ) : (
                'Verify Code'
              )}
            </button>

            <button
              onClick={() => setStep('phone')}
              className="w-full text-blue-600 py-3 text-sm font-medium hover:text-blue-700 hover:bg-blue-50 rounded-xl transition-all"
            >
              Didn't receive code? Resend
            </button>
          </div>
        </>
      )}
    </div>
  );
};

// Email OTP Component
const EmailOTPComponent = ({ onBack, onClose, onVerified }: { onBack: () => void; onClose: () => void; onVerified: (email: string) => void }) => {
  const dispatch = useDispatch();
  const [step, setStep] = useState<'email' | 'otp' | 'change-password'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

  const handleSendOTP = async () => {
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await axios.post(`${API_BASE_URL}/auth/send-email-otp`, { email }, { withCredentials: true });
      setStep('otp');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to send OTP. Please try again.');
      console.error('Send OTP error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp.trim() || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/verify-email-otp`, { email, otp }, { withCredentials: true });
      setResetToken(response.data.resetToken);
      setStep('change-password');
      onVerified(email);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Invalid OTP. Please try again.');
      console.error('Verify OTP error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!newPassword || newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post(
        `${API_BASE_URL}/auth/reset-password`,
        { resetToken, newPassword },
        { withCredentials: true }
      );
      const { token, user, collection } = response.data;
      
      // Store token in Redux
      dispatch(setAuth({ token, user, collection }));

      // Optionally store token in cookies for consistency
      Cookies.set('auth_token', token, {
        expires: 1 / 24, // 1 hour
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });

      alert('Password changed successfully! You are now logged in.');
      console.log('Login response:', response.data);
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to change password. Please try again.');
      console.error('Change password error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {step === 'email' && (
        <>
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <FiAtSign className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Email Verification</h3>
            <p className="text-gray-600">We'll send a verification code to your email address</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">{error}</div>
          )}

          <button
            onClick={handleSendOTP}
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-purple-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Sending Code...
              </div>
            ) : (
              'Send Verification Code'
            )}
          </button>
        </>
      )}

      {step === 'otp' && (
        <>
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <FiShield className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Enter Verification Code</h3>
            <p className="text-gray-600 mb-1">We've sent a 6-digit code to</p>
            <p className="font-semibold text-gray-800 text-lg">{email}</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Verification Code</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="000000"
              maxLength={6}
              className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-center text-2xl font-mono tracking-widest transition-all"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">{error}</div>
          )}

          <div className="space-y-3">
            <button
              onClick={handleVerifyOTP}
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-purple-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Verifying...
                </div>
              ) : (
                'Verify Code'
              )}
            </button>

            <button
              onClick={() => setStep('email')}
              className="w-full text-purple-600 py-3 text-sm font-medium hover:text-purple-700 hover:bg-purple-50 rounded-xl transition-all"
            >
              Didn't receive code? Resend
            </button>
          </div>
        </>
      )}

      {step === 'change-password' && (
        <>
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <FiLock className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Change Password</h3>
            <p className="text-gray-600">Enter a new password for your account</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">{error}</div>
          )}

          <button
            onClick={handleChangePassword}
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-purple-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Changing Password...
              </div>
            ) : (
              'Change Password'
            )}
          </button>
        </>
      )}
    </div>
  );
};

// Main Modal Component
export const ForgotPasswordModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [currentMethod, setCurrentMethod] = useState<'selection' | 'mobile' | 'email'>('selection');
  const [verifiedEmail, setVerifiedEmail] = useState<string>('');

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setCurrentMethod('selection');
      setVerifiedEmail('');
    }
  }, [isOpen]);

  const handleClose = () => {
    setCurrentMethod('selection');
    setVerifiedEmail('');
    onClose();
  };

  const handleBack = () => {
    setCurrentMethod('selection');
    setVerifiedEmail('');
  };

  const handleVerified = (email: string) => {
    setVerifiedEmail(email);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-screen overflow-y-auto transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            {currentMethod !== 'selection' && (
              <button
                onClick={handleBack}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <FiArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
            )}
            <h2 className="text-xl font-bold text-gray-800">
              {currentMethod === 'selection' && 'Reset Password'}
              {currentMethod === 'mobile' && 'Mobile Verification'}
              {currentMethod === 'email' && (verifiedEmail ? 'Change Password' : 'Email Verification')}
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors group"
          >
            <FiX className="w-6 h-6 text-gray-600 group-hover:text-gray-800" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Selection Screen */}
          {currentMethod === 'selection' && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <FiShield className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Account Recovery</h3>
                <p className="text-gray-600">Choose your preferred method to reset your password</p>
              </div>

              <div className="space-y-4">
                <button
                  onClick={() => setCurrentMethod('mobile')}
                  className="w-full group relative overflow-hidden bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 border-2 border-blue-200 hover:border-blue-300 rounded-2xl p-6 transition-all duration-200 hover:shadow-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                      <FiPhone className="w-7 h-7 text-white" />
                    </div>
                    <div className="text-left">
                      <h4 className="text-lg font-bold text-gray-800 group-hover:text-blue-700">Mobile Verification</h4>
                      <p className="text-sm text-gray-600 group-hover:text-blue-600">Get OTP via SMS</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setCurrentMethod('email')}
                  className="w-full group relative overflow-hidden bg-gradient-to-r from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 border-2 border-purple-200 hover:border-purple-300 rounded-2xl p-6 transition-all duration-200 hover:shadow-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                      <FiMail className="w-7 h-7 text-white" />
                    </div>
                    <div className="text-left">
                      <h4 className="text-lg font-bold text-gray-800 group-hover:text-purple-700">Email Verification</h4>
                      <p className="text-sm text-gray-600 group-hover:text-purple-600">Get OTP via Email</p>
                    </div>
                  </div>
                </button>
              </div>

              <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl">
                <p className="text-sm text-gray-600 text-center">🔒 Your information is secure and encrypted</p>
              </div>
            </div>
          )}

          {/* Mobile OTP Screen */}
          {currentMethod === 'mobile' && <MobileOTPComponent onBack={handleBack} onClose={handleClose} />}

          {/* Email OTP Screen */}
          {currentMethod === 'email' && (
            <EmailOTPComponent onBack={handleBack} onClose={handleClose} onVerified={handleVerified} />
          )}
        </div>
      </div>
    </div>
  );
};