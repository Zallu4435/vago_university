import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FaPaperPlane, FaTimes } from 'react-icons/fa';
import { usePreferences } from '../../../context/PreferencesContext';

export default function JoinRequestForm({ onSubmit, onCancel, isLoading, title }) {
  const [reason, setReason] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [reasonError, setReasonError] = useState(null);
  const { styles, theme } = usePreferences();

  const maxReasonLength = 500;
  const maxAdditionalInfoLength = 300;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (reason.trim().length === 0) {
      setReasonError('Reason is required.');
      return;
    }
    if (reason.length > maxReasonLength) {
      setReasonError(`Reason cannot exceed ${maxReasonLength} characters.`);
      return;
    }
    if (additionalInfo.length > maxAdditionalInfoLength) {
      setReasonError(`Additional information cannot exceed ${maxAdditionalInfoLength} characters.`);
      return;
    }
    setReasonError(null);
    onSubmit({ reason, additionalInfo });
    setReason('');
    setAdditionalInfo('');
  };

  return (
    <div className={`relative overflow-hidden rounded-2xl shadow-xl ${styles.card.background} border ${styles.border} group hover:${styles.card.hover} transition-all duration-500`}>
      <div className={`absolute -inset-0.5 bg-gradient-to-r ${styles.orb.secondary} rounded-2xl blur transition-all duration-300`}></div>
      <div className={`absolute -top-8 -left-8 w-48 h-48 rounded-full bg-gradient-to-br ${styles.orb.primary} blur-3xl animate-pulse`}></div>
      <div className={`absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-gradient-to-br ${styles.orb.secondary} blur-2xl animate-pulse delay-700`}></div>

      <div className="relative z-10 p-4 sm:p-6">
        <div className="flex items-center space-x-4 mb-4 sm:mb-6">
          <div className="relative">
            <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${styles.accent} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent"></div>
              <FaPaperPlane size={16} className="text-white relative z-10" />
            </div>
            <div className={`absolute -inset-1 bg-gradient-to-br ${styles.orb.primary} rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity duration-300`}></div>
          </div>
          <div>
            <h3 className={`text-lg sm:text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'} bg-clip-text`}>
              Request to Join {title}
            </h3>
            <div className={`h-1 w-16 bg-gradient-to-r ${styles.accent} rounded-full mt-1 group-hover:w-24 transition-all duration-300`}></div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          <div>
            <label
              htmlFor="reason"
              className={`block text-sm font-medium ${styles.textPrimary} mb-1`}
            >
              Why do you want to join?
            </label>
            <textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className={`block w-full px-4 py-2 ${styles.input.background} border ${styles.input.border} rounded-lg focus:${styles.input.focus} transition-all duration-300 text-sm sm:text-base ${styles.textSecondary} placeholder-${styles.textSecondary}`}
              rows={3}
              required
              placeholder="Tell us why you're interested in joining..."
              disabled={isLoading}
            />
            <div className="flex justify-between items-center mt-1">
              <p className={`text-xs ${reasonError ? styles.status.error : styles.textSecondary}`}>
                {reasonError || 'Required'}
              </p>
              <p className={`text-xs ${styles.textSecondary}`}>
                {reason.length}/{maxReasonLength}
              </p>
            </div>
          </div>

          <div>
            <label
              htmlFor="additionalInfo"
              className={`block text-sm font-medium ${styles.textPrimary} mb-1`}
            >
              Additional Information
            </label>
            <textarea
              id="additionalInfo"
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              className={`block w-full px-4 py-2 ${styles.input.background} border ${styles.input.border} rounded-lg focus:${styles.input.focus} transition-all duration-300 text-sm sm:text-base ${styles.textSecondary} placeholder-${styles.textSecondary}`}
              rows={2}
              placeholder="Any additional information you'd like to share..."
              disabled={isLoading}
            />
            <div className="flex justify-between items-center mt-1">
              <p className={`text-xs ${styles.textSecondary}`}>Optional</p>
              <p className={`text-xs ${styles.textSecondary}`}>
                {additionalInfo.length}/{maxAdditionalInfoLength}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-4 border-t border-amber-100/50">
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              className={`group/btn px-4 sm:px-6 py-2 sm:py-3 ${styles.textSecondary} ${styles.card.background} border ${styles.border} hover:${styles.card.hover} rounded-full font-medium transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2 text-sm sm:text-base`}
            >
              <span>Cancel</span>
              <FaTimes size={12} className="group-hover/btn:translate-x-1 transition-transform duration-300" />
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`group/btn px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r ${styles.accent} hover:${styles.button.primary} text-white rounded-full font-medium transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2 text-sm sm:text-base`}
            >
              <span>{isLoading ? 'Submitting...' : 'Submit Request'}</span>
              <FaPaperPlane size={12} className="group-hover/btn:translate-x-1 transition-transform duration-300" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

JoinRequestForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
};