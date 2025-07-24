import React, { useState } from 'react';
import { FaMobileAlt, FaCheckCircle, FaExclamationCircle, FaShieldAlt } from 'react-icons/fa';
import type { MobileOTPStep, MobileOTPComponentProps } from '../../../domain/types/auth/ForgotPassword';

const MobileOTPComponent = ({ onBack, onClose }: MobileOTPComponentProps) => {
  const [step, setStep] = useState<MobileOTPStep>('phone');
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

export default MobileOTPComponent; 