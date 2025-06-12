import React, { useState } from 'react';
import { FaTimes, FaVideo } from 'react-icons/fa';

interface RecordingModalProps {
  sessionId: number;
  setShowRecordingModal: (show: boolean) => void;
  uploadRecording: (sessionId: number, recordingUrl: string) => void;
}

export default function RecordingModal({ sessionId, setShowRecordingModal, uploadRecording }: RecordingModalProps) {
  const [recordingUrl, setRecordingUrl] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recordingUrl.trim() || !/^(https?:\/\/)/.test(recordingUrl)) {
      setError('Please enter a valid URL (e.g., https://youtube.com...)');
      return;
    }
    uploadRecording(sessionId, recordingUrl);
    setError('');
  };

  const handleClose = () => {
    setShowRecordingModal(false);
    setRecordingUrl('');
    setError('');
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 w-full max-w-md mx-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-white">Upload Recording</h3>
              <p className="text-white/80 text-sm mt-1">Add a recording link for the session</p>
            </div>
            <button
              onClick={handleClose}
              className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-all"
            >
              <FaTimes size={20} />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-700 text-sm animate-fadeInUp">
              {error}
            </div>
          )}
          <div className="relative group animate-fadeInUp">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Recording URL</label>
            <div className="relative flex items-center">
              <FaVideo size={16} className="absolute left-4 text-indigo-500" />
              <input
                type="url"
                value={recordingUrl}
                onChange={(e) => setRecordingUrl(e.target.value)}
                className="relative w-full px-4 py-3 pl-10 rounded-2xl border-2 border-gray-100 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all bg-white/80"
                placeholder="Enter recording URL (e.g., https://youtube.com)"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50/80 backdrop-blur-sm p-6 rounded-b-3xl border-t border-gray-100/50">
          <div className="flex justify-end space-x-3">
            <button
              onClick={handleClose}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-2xl font-medium hover:bg-gray-300 transition-all transform hover:scale-105"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
            >
              Upload Recording
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
