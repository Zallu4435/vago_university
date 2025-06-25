import React, { useState, useEffect } from 'react';
import { FaPhone, FaEnvelope, FaShieldAlt, FaArrowLeft, FaMobileAlt, FaAt, FaLock, FaCheckCircle, FaExclamationCircle, FaTimes } from 'react-icons/fa';
import { authService } from '../../application/services/auth.service';

// Mobile OTP Component
interface MobileOTPComponentProps {
  onBack: () => void;
  onClose: () => void;
}
const MobileOTPComponent = ({ onBack, onClose }: MobileOTPComponentProps) => {
  const [step, setStep] = useState('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
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
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
      {step === 'phone' && (
        <>
          <div className="text-center mb-10">
            <div className="relative w-20 h-20 mx-auto mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-sky-400 to-sky-600 rounded-3xl shadow-2xl transform rotate-3 animate-pulse"></div>
              <div className="relative w-20 h-20 bg-gradient-to-br from-sky-500 to-sky-700 rounded-3xl flex items-center justify-center shadow-xl">
                <FaMobileAlt className="w-8 h-8 text-white drop-shadow-lg" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2 tracking-tight">Mobile Verification</h3>
            <p className="text-base text-slate-600 leading-relaxed">We'll send a secure verification code to your phone</p>
          </div>

          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">Phone Number</label>
            <div className="relative group">
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+1 (555) 123-4567"
                className="w-full p-4 bg-white/80 backdrop-blur-sm border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-sky-500/20 focus:border-sky-500 text-base font-medium text-slate-800 transition-all duration-300 group-hover:border-slate-300"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-sky-500/5 to-transparent rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-sky-50 to-sky-100/50 border-2 border-sky-200/50 p-6 rounded-2xl backdrop-blur-sm">
            <div className="flex items-start gap-3">
              <FaCheckCircle className="w-5 h-5 text-sky-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-bold text-sky-800 mb-2">📱 Test Numbers:</p>
                <div className="text-sm text-sky-700 space-y-1">
                  <div className="font-mono bg-white/60 px-3 py-1 rounded-lg">+919876543210</div>
                  <div className="font-mono bg-white/60 px-3 py-1 rounded-lg">+15551234567</div>
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-gradient-to-r from-red-50 to-red-100/50 border-2 border-red-200 text-red-700 px-6 py-4 rounded-2xl text-sm flex items-center gap-3 animate-in slide-in-from-top-4 duration-300">
              <FaExclamationCircle className="w-5 h-5 flex-shrink-0" />
              {error}
            </div>
          )}

          <button
            onClick={handleSendOTP}
            disabled={loading}
            className="group relative w-full overflow-hidden bg-gradient-to-r from-sky-500 to-sky-600 text-white py-5 rounded-2xl font-bold text-lg hover:from-sky-600 hover:to-sky-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98]"
          >
            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
            {loading ? (
              <div className="flex items-center justify-center gap-3">
                <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                <span className="font-bold">Sending OTP...</span>
              </div>
            ) : (
              <span className="relative z-10">Send Verification Code</span>
            )}
          </button>
        </>
      )}

      {step === 'otp' && (
        <>
          <div className="text-center mb-10">
            <div className="relative w-20 h-20 mx-auto mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-3xl shadow-2xl transform -rotate-3 animate-pulse"></div>
              <div className="relative w-20 h-20 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-3xl flex items-center justify-center shadow-xl">
                <FaShieldAlt className="w-8 h-8 text-white drop-shadow-lg" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2 tracking-tight">Enter Verification Code</h3>
            <p className="text-base text-slate-600 mb-2">We've sent a 6-digit code to</p>
            <p className="font-bold text-slate-800 text-lg bg-gradient-to-br from-slate-100 to-slate-200 px-3 py-1.5 rounded-lg inline-block">{phoneNumber}</p>
          </div>

          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">Verification Code</label>
            <div className="relative group">
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                maxLength={6}
                className="w-full p-4 bg-white/80 backdrop-blur-sm border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 text-center text-2xl font-mono tracking-[0.75rem] text-slate-800 transition-all duration-300 group-hover:border-slate-300"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-transparent rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 border-2 border-amber-200/50 p-6 rounded-2xl backdrop-blur-sm">
            <div className="flex items-start gap-3">
              <FaCheckCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-amber-800">
                💡 <strong>Demo Mode:</strong> Use code <strong className="bg-white/60 px-2 py-1 rounded font-mono">123456</strong> to verify
              </p>
            </div>
          </div>

          {error && (
            <div className="bg-gradient-to-r from-red-50 to-red-100/50 border-2 border-red-200 text-red-700 px-6 py-4 rounded-2xl text-sm flex items-center gap-3 animate-in slide-in-from-top-4 duration-300">
              <FaExclamationCircle className="w-5 h-5 flex-shrink-0" />
              {error}
            </div>
          )}

          <div className="space-y-4">
            <button
              onClick={handleVerifyOTP}
              disabled={loading}
              className="group relative w-full overflow-hidden bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-5 rounded-2xl font-bold text-lg hover:from-emerald-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98]"
            >
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
              {loading ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span className="font-bold">Verifying...</span>
                </div>
              ) : (
                <span className="relative z-10">Verify Code</span>
              )}
            </button>

            <button
              onClick={() => setStep('phone')}
              className="w-full text-sky-600 py-4 text-sm font-bold hover:text-sky-700 hover:bg-sky-50/50 rounded-2xl transition-all duration-300 backdrop-blur-sm border border-transparent hover:border-sky-200"
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
interface EmailOTPComponentProps {
  onBack: () => void;
  onClose: () => void;
  onVerified: (email: string) => void;
}
const EmailOTPComponent = ({ onBack, onClose, onVerified }: EmailOTPComponentProps) => {
  const [step, setStep] = useState('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendOTP = async () => {
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await authService.sendEmailOtp(email);
      setStep('otp');
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP');
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
      const result = await authService.verifyEmailOtp(email, otp);
      setResetToken(result.resetToken);
      setStep('change-password');
      onVerified(email);
    } catch (err: any) {
      setError(err.message || 'Failed to verify OTP');
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
      await authService.resetPassword(resetToken, newPassword);
      alert('Password changed successfully! You are now logged in.');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
      {step === 'email' && (
        <>
          <div className="text-center mb-10">
            <div className="relative w-20 h-20 mx-auto mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-400 to-violet-600 rounded-3xl shadow-2xl transform rotate-3 animate-pulse"></div>
              <div className="relative w-20 h-20 bg-gradient-to-br from-violet-500 to-violet-700 rounded-3xl flex items-center justify-center shadow-xl">
                <FaAt className="w-8 h-8 text-white drop-shadow-lg" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2 tracking-tight">Email Verification</h3>
            <p className="text-base text-slate-600 leading-relaxed">We'll send a secure verification code to your email</p>
          </div>

          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">Email Address</label>
            <div className="relative group">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full p-4 bg-white/80 backdrop-blur-sm border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-violet-500/20 focus:border-violet-500 text-base font-medium text-slate-800 transition-all duration-300 group-hover:border-slate-300"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-violet-500/5 to-transparent rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          </div>

          {error && (
            <div className="bg-gradient-to-r from-red-50 to-red-100/50 border-2 border-red-200 text-red-700 px-6 py-4 rounded-2xl text-sm flex items-center gap-3 animate-in slide-in-from-top-4 duration-300">
              <FaExclamationCircle className="w-5 h-5 flex-shrink-0" />
              {error}
            </div>
          )}

          <button
            onClick={handleSendOTP}
            disabled={loading}
            className="group relative w-full overflow-hidden bg-gradient-to-r from-violet-500 to-violet-600 text-white py-5 rounded-2xl font-bold text-lg hover:from-violet-600 hover:to-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98]"
          >
            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
            {loading ? (
              <div className="flex items-center justify-center gap-3">
                <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                <span className="font-bold">Sending Code...</span>
              </div>
            ) : (
              <span className="relative z-10">Send Verification Code</span>
            )}
          </button>
        </>
      )}

      {step === 'otp' && (
        <>
          <div className="text-center mb-10">
            <div className="relative w-20 h-20 mx-auto mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-3xl shadow-2xl transform -rotate-3 animate-pulse"></div>
              <div className="relative w-20 h-20 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-3xl flex items-center justify-center shadow-xl">
                <FaShieldAlt className="w-8 h-8 text-white drop-shadow-lg" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2 tracking-tight">Enter Verification Code</h3>
            <p className="text-base text-slate-600 mb-2">We've sent a 6-digit code to</p>
            <p className="font-bold text-slate-800 text-lg bg-gradient-to-br from-slate-100 to-slate-200 px-3 py-1.5 rounded-lg inline-block">{email}</p>
          </div>

          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">Verification Code</label>
            <div className="relative group">
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                maxLength={6}
                className="w-full p-4 bg-white/80 backdrop-blur-sm border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 text-center text-2xl font-mono tracking-[0.75rem] text-slate-800 transition-all duration-300 group-hover:border-slate-300"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-transparent rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 border-2 border-amber-200/50 p-6 rounded-2xl backdrop-blur-sm">
            <div className="flex items-start gap-3">
              <FaCheckCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-amber-800">
                💡 <strong>Demo Mode:</strong> Use code <strong className="bg-white/60 px-2 py-1 rounded font-mono">123456</strong> to verify
              </p>
            </div>
          </div>

          {error && (
            <div className="bg-gradient-to-r from-red-50 to-red-100/50 border-2 border-red-200 text-red-700 px-6 py-4 rounded-2xl text-sm flex items-center gap-3 animate-in slide-in-from-top-4 duration-300">
              <FaExclamationCircle className="w-5 h-5 flex-shrink-0" />
              {error}
            </div>
          )}

          <div className="space-y-4">
            <button
              onClick={handleVerifyOTP}
              disabled={loading}
              className="group relative w-full overflow-hidden bg-gradient-to-r from-violet-500 to-violet-600 text-white py-5 rounded-2xl font-bold text-lg hover:from-violet-600 hover:to-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98]"
            >
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
              {loading ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span className="font-bold">Verifying...</span>
                </div>
              ) : (
                <span className="relative z-10">Verify Code</span>
              )}
            </button>

            <button
              onClick={() => setStep('email')}
              className="w-full text-violet-600 py-4 text-sm font-bold hover:text-violet-700 hover:bg-violet-50/50 rounded-2xl transition-all duration-300 backdrop-blur-sm border border-transparent hover:border-violet-200"
            >
              Didn't receive code? Resend
            </button>
          </div>
        </>
      )}

      {step === 'change-password' && (
        <>
          <div className="text-center mb-10">
            <div className="relative w-20 h-20 mx-auto mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-400 to-violet-600 rounded-3xl shadow-2xl transform rotate-3 animate-pulse"></div>
              <div className="relative w-20 h-20 bg-gradient-to-br from-violet-500 to-violet-700 rounded-3xl flex items-center justify-center shadow-xl">
                <FaLock className="w-8 h-8 text-white drop-shadow-lg" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2 tracking-tight">Change Password</h3>
            <p className="text-base text-slate-600 leading-relaxed">Create a new secure password for your account</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">New Password</label>
              <div className="relative group">
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full p-4 bg-white/80 backdrop-blur-sm border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-violet-500/20 focus:border-violet-500 text-base font-medium text-slate-800 transition-all duration-300 group-hover:border-slate-300"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-violet-500/5 to-transparent rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">Confirm Password</label>
              <div className="relative group">
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full p-4 bg-white/80 backdrop-blur-sm border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-violet-500/20 focus:border-violet-500 text-base font-medium text-slate-800 transition-all duration-300 group-hover:border-slate-300"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-violet-500/5 to-transparent rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-gradient-to-r from-red-50 to-red-100/50 border-2 border-red-200 text-red-700 px-6 py-4 rounded-2xl text-sm flex items-center gap-3 animate-in slide-in-from-top-4 duration-300">
              <FaExclamationCircle className="w-5 h-5 flex-shrink-0" />
              {error}
            </div>
          )}

          <button
            onClick={handleChangePassword}
            disabled={loading}
            className="group relative w-full overflow-hidden bg-gradient-to-r from-violet-500 to-violet-600 text-white py-5 rounded-2xl font-bold text-lg hover:from-violet-600 hover:to-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98]"
          >
            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
            {loading ? (
              <div className="flex items-center justify-center gap-3">
                <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                <span className="font-bold">Changing Password...</span>
              </div>
            ) : (
              <span className="relative z-10">Change Password</span>
            )}
          </button>
        </>
      )}
    </div>
  );
};

// Main Modal Component
export default function ForgotPasswordModal() {
  const [isOpen, setIsOpen] = useState(true);
  const [currentMethod, setCurrentMethod] = useState('selection');
  const [verifiedEmail, setVerifiedEmail] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setCurrentMethod('selection');
      setVerifiedEmail('');
    }
  }, [isOpen]);

  const handleClose = () => {
    setCurrentMethod('selection');
    setVerifiedEmail('');
    setIsOpen(false);
  };

  const handleBack = () => {
    setCurrentMethod('selection');
    setVerifiedEmail('');
  };

  const handleVerified = (email: string) => {
    setVerifiedEmail(email);
  };

  if (!isOpen) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-sky-500 to-sky-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:from-sky-600 hover:to-sky-700 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105"
        >
          Open Forgot Password Modal
        </button>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-300"
      onClick={handleClose}
    >
      <div
        className="bg-gradient-to-br from-white via-slate-50 to-slate-100/50 backdrop-blur-xl rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto transform transition-all animate-in slide-in-from-bottom-4 duration-500 border border-white/20"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white/80 backdrop-blur-xl border-b border-slate-200/50 z-10">
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center gap-4">
              {currentMethod !== 'selection' && (
                <button
                  onClick={handleBack}
                  className="group p-3 hover:bg-slate-100/80 rounded-2xl transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  <FaArrowLeft className="w-4 h-4 text-slate-600 group-hover:text-slate-800 transition-colors" />
                </button>
              )}
              <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
                {currentMethod === 'selection' && 'Reset Password'}
                {currentMethod === 'mobile' && 'Mobile Verification'}
                {currentMethod === 'email' && (verifiedEmail ? 'Change Password' : 'Email Verification')}
              </h2>
            </div>
            <button
              onClick={handleClose}
              className="group p-3 hover:bg-slate-100/80 rounded-2xl transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <FaTimes className="w-5 h-5 text-slate-600 group-hover:text-slate-800 transition-colors" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Selection Screen */}
          {currentMethod === 'selection' && (
            <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
              <div className="text-center mb-12">
                <div className="relative w-24 h-24 mx-auto mb-8">
                  <div className="absolute inset-0 bg-gradient-to-br from-sky-400 to-sky-600 rounded-3xl shadow-2xl transform rotate-6 animate-pulse"></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-400 to-violet-600 rounded-3xl shadow-2xl transform -rotate-6 animate-pulse" style={{animationDelay: '1s'}}></div>
                  <div className="relative w-24 h-24 bg-gradient-to-br from-slate-700 to-slate-900 rounded-3xl flex items-center justify-center shadow-2xl">
                    <FaShieldAlt className="w-10 h-10 text-white drop-shadow-lg" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-slate-800 mb-4 tracking-tight">Account Recovery</h3>
                <p className="text-lg text-slate-600 leading-relaxed max-w-md mx-auto">Choose your preferred method to securely reset your password</p>
              </div>

              <div className="space-y-6">
                <button
                  onClick={() => setCurrentMethod('mobile')}
                  className="group w-full relative overflow-hidden bg-gradient-to-br from-white to-slate-50/80 hover:from-slate-50 hover:to-slate-100/80 border-2 border-slate-200/60 hover:border-sky-300/60 rounded-3xl p-8 transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] backdrop-blur-sm"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 to-sky-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative flex items-center gap-6">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-sky-400 to-sky-600 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
                      <div className="relative w-14 h-14 bg-gradient-to-br from-sky-500 to-sky-700 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-500">
                        <FaPhone className="w-6 h-6 text-white drop-shadow-lg" />
                      </div>
                    </div>
                    <div className="text-left flex-1">
                      <h4 className="text-2xl font-bold text-slate-800 group-hover:text-sky-700 mb-2 transition-colors duration-300">Mobile Verification</h4>
                      <p className="text-lg text-slate-600 group-hover:text-sky-600 transition-colors duration-300">Receive OTP via SMS instantly</p>
                    </div>
                    <div className="text-sky-500 group-hover:translate-x-2 transition-transform duration-300">
                      <FaArrowLeft className="w-6 h-6 rotate-180" />
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setCurrentMethod('email')}
                  className="group w-full relative overflow-hidden bg-gradient-to-br from-white to-slate-50/80 hover:from-slate-50 hover:to-slate-100/80 border-2 border-slate-200/60 hover:border-violet-300/60 rounded-3xl p-8 transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] backdrop-blur-sm"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-violet-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative flex items-center gap-6">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-violet-400 to-violet-600 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
                      <div className="relative w-14 h-14 bg-gradient-to-br from-violet-500 to-violet-700 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-500">
                        <FaEnvelope className="w-6 h-6 text-white drop-shadow-lg" />
                      </div>
                    </div>
                    <div className="text-left flex-1">
                      <h4 className="text-2xl font-bold text-slate-800 group-hover:text-violet-700 mb-2 transition-colors duration-300">Email Verification</h4>
                      <p className="text-lg text-slate-600 group-hover:text-violet-600 transition-colors duration-300">Secure OTP via Email delivery</p>
                    </div>
                    <div className="text-violet-500 group-hover:translate-x-2 transition-transform duration-300">
                      <FaArrowLeft className="w-6 h-6 rotate-180" />
                    </div>
                  </div>
                </button>
              </div>

              <div className="bg-gradient-to-br from-slate-50 to-slate-100/50 border-2 border-slate-200/50 p-6 rounded-3xl backdrop-blur-sm">
                <div className="flex items-center justify-center gap-3">
                  <FaShieldAlt className="w-5 h-5 text-slate-600" />
                  <p className="text-lg text-slate-600 font-medium text-center">Your information is secure and encrypted</p>
                </div>
              </div>
            </div>
          )}

          {/* Mobile OTP Screen */}
          {currentMethod === 'mobile' && <MobileOTPComponent onBack={handleBack as () => void} onClose={handleClose as () => void} />}

          {/* Email OTP Screen */}
          {currentMethod === 'email' && (
            <EmailOTPComponent onBack={handleBack as () => void} onClose={handleClose as () => void} onVerified={handleVerified as (email: string) => void} />
          )}
        </div>
      </div>
    </div>
  );
}