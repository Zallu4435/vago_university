import { useState, useEffect } from 'react';
import { FaPhone, FaEnvelope, FaShieldAlt, FaArrowLeft, FaTimes } from 'react-icons/fa';
import MobileOTPComponent from './MobileOTPComponent';
import EmailOTPComponent from './EmailOTPComponent';

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
        className="bg-white rounded-xl shadow-xl border border-cyan-100 max-w-lg w-full max-h-[90vh] overflow-y-auto transform transition-all animate-in slide-in-from-bottom-4 duration-500"
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
                <h3 className="text-xl font-bold text-slate-800 mb-4 tracking-tight">Account Recovery</h3>
                <p className="text-base text-slate-600 leading-relaxed max-w-md mx-auto">Choose your preferred method to securely reset your password</p>
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
                      <h4 className="text-lg font-bold text-slate-800 group-hover:text-sky-700 mb-2 transition-colors duration-300">Mobile Verification</h4>
                      <p className="text-sm text-slate-600 group-hover:text-sky-600 transition-colors duration-300">Receive OTP via SMS instantly</p>
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
                      <h4 className="text-lg font-bold text-slate-800 group-hover:text-violet-700 mb-2 transition-colors duration-300">Email Verification</h4>
                      <p className="text-sm text-slate-600 group-hover:text-violet-600 transition-colors duration-300">Secure OTP via Email delivery</p>
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
                  <p className="text-base text-slate-600 font-medium text-center">Your information is secure and encrypted</p>
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