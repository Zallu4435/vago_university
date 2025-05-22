import { useState } from "react";
import { FaCheck, FaEye, FaEyeSlash, FaShieldAlt, FaTimes } from "react-icons/fa";

interface PasswordChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPasswordChange: (passwords: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => void;
}

export const PasswordChangeModal = ({
  isOpen,
  onClose,
  onPasswordChange,
}: PasswordChangeModalProps) => {
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false
  });

  const handlePasswordUpdate = (field: string, value: string) => {
    setPasswords(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (
      passwords.currentPassword &&
      passwords.newPassword &&
      passwords.newPassword === passwords.confirmPassword
    ) {
      onPasswordChange(passwords);
      onClose();
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    }
  };

  const handleClose = () => {
    onClose();
    setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const togglePasswordVisibility = (field: string) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const isValid =
    passwords.currentPassword &&
    passwords.newPassword &&
    passwords.newPassword === passwords.confirmPassword;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl p-8 max-w-md w-full">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white flex items-center">
            <FaShieldAlt className="w-5 h-5 mr-3 text-orange-400" />
            Change Password
          </h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-cyan-300 text-sm font-medium">Current Password</label>
            <div className="relative">
              <input
                type={showPasswords.currentPassword ? "text" : "password"}
                value={passwords.currentPassword}
                onChange={(e) => handlePasswordUpdate('currentPassword', e.target.value)}
                className="w-full px-4 py-4 pr-12 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                placeholder="Enter current password"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('currentPassword')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
              >
                {showPasswords.currentPassword ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-cyan-300 text-sm font-medium">New Password</label>
            <div className="relative">
              <input
                type={showPasswords.newPassword ? "text" : "password"}
                value={passwords.newPassword}
                onChange={(e) => handlePasswordUpdate('newPassword', e.target.value)}
                className="w-full px-4 py-4 pr-12 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                placeholder="Enter new password"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('newPassword')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
              >
                {showPasswords.newPassword ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-cyan-300 text-sm font-medium">Confirm New Password</label>
            <div className="relative">
              <input
                type={showPasswords.confirmPassword ? "text" : "password"}
                value={passwords.confirmPassword}
                onChange={(e) => handlePasswordUpdate('confirmPassword', e.target.value)}
                className="w-full px-4 py-4 pr-12 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                placeholder="Confirm new password"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('confirmPassword')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
              >
                {showPasswords.confirmPassword ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
              </button>
            </div>
            {passwords.newPassword && passwords.confirmPassword && passwords.newPassword !== passwords.confirmPassword && (
              <p className="text-red-400 text-sm">Passwords do not match</p>
            )}
          </div>

          <div className="flex gap-4 pt-4">
            <button
              onClick={handleSubmit}
              disabled={!isValid}
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <FaCheck className="w-4 h-4 mr-2" />
              Update Password
            </button>
            <button
              onClick={handleClose}
              className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-400 hover:to-pink-400 text-white px-6 py-3 rounded-xl flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <FaTimes className="w-4 h-4 mr-2" />
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};