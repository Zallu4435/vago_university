import { useState, useEffect } from 'react';
import { FaAt, FaShieldAlt, FaCheckCircle, FaExclamationCircle, FaLock } from 'react-icons/fa';
import { authService } from '../../../application/services/auth.service';
import type { EmailOTPStep, EmailOTPComponentProps } from '../../../domain/types/auth/ForgotPassword';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const EmailOTPComponent = ({ onClose, onVerified }: EmailOTPComponentProps) => {
  const navigate = useNavigate();
  const [step, setStep] = useState<EmailOTPStep>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

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
      setTimer(30);
    } catch (err: unknown) {
      let errorMsg = 'Failed to send OTP';
      if (err instanceof Error) {
        errorMsg = err.message;
      } else if (typeof err === 'string') {
        errorMsg = err;
      }
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setLoading(true);
    setError('');
    try {
      await authService.sendEmailOtp(email);
      setTimer(30); // Reset timer
      toast.success('New verification code sent!');
    } catch (err: unknown) {
      let errorMsg = 'Failed to resend OTP';
      if (err instanceof Error) {
        errorMsg = err.message;
      } else if (typeof err === 'string') {
        errorMsg = err;
      }
      setError(errorMsg);
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
    } catch (err: unknown) {
      let errorMsg = 'Failed to verify OTP';
      if (err instanceof Error) {
        errorMsg = err.message;
      } else if (typeof err === 'string') {
        errorMsg = err;
      }
      setError(errorMsg);
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
      toast.success('Password changed successfully! You are now logged in.');
      navigate('/login');
      onClose();
    } catch (err: unknown) {
      let errorMsg = 'Failed to reset password';
      if (err instanceof Error) {
        errorMsg = err.message;
      } else if (typeof err === 'string') {
        errorMsg = err;
      }
      setError(errorMsg);
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

            {timer > 0 ? (
              <div className="text-center text-slate-600 py-4 text-sm font-medium">
                Resend code in {timer} seconds
              </div>
            ) : (
              <button
                onClick={handleResendOTP}
                disabled={loading}
                className="w-full text-violet-600 py-4 text-sm font-bold hover:text-violet-700 hover:bg-violet-50/50 rounded-2xl transition-all duration-300 backdrop-blur-sm border border-transparent hover:border-violet-200"
              >
                Resend Code
              </button>
            )}
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

export default EmailOTPComponent;
