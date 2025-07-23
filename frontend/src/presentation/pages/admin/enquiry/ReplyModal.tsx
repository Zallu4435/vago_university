import React from 'react';
import { FiX, FiSend } from 'react-icons/fi';
import { ReplyModalProps } from '../../../../domain/types/management/enquirymanagement';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { enquiryReplySchema, EnquiryReplyFormData } from '../../../../domain/validation/management/enquiryReplySchema';

const ReplyModal: React.FC<ReplyModalProps> = ({ enquiry, onClose, onSend }) => {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<EnquiryReplyFormData>({
    resolver: zodResolver(enquiryReplySchema),
    defaultValues: { replyMessage: '' },
  });

  const handleFormSubmit = async (data: EnquiryReplyFormData) => {
    await onSend(enquiry.id, data.replyMessage);
    reset();
  };

  return (
    <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 w-full max-w-2xl max-h-[90vh] rounded-2xl border border-purple-600/30 shadow-2xl overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 via-transparent to-purple-600/5 pointer-events-none" />

        <div className="bg-gradient-to-r from-purple-900 to-gray-900 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl shadow-lg border border-purple-600/30 bg-purple-500/20">
                💬
              </div>
              <div>
                <h2 className="text-xl font-bold text-purple-100">Reply to Enquiry</h2>
                <p className="text-sm text-purple-300">From: {enquiry.name}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-purple-500/20 rounded-full transition-colors"
            >
              <FiX size={24} className="text-purple-300" />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-200px)] p-6 space-y-6 custom-scrollbar">
          <div className="bg-gray-800/80 border border-purple-600/30 rounded-lg p-4 shadow-sm">
            <h3 className="font-medium text-white mb-3 flex items-center">
              <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
              Original Enquiry
            </h3>
            <div className="space-y-2 text-sm text-gray-300">
              <p><span className="font-medium text-purple-400">From:</span> {enquiry.name} ({enquiry.email})</p>
              <p><span className="font-medium text-purple-400">Subject:</span> {enquiry.subject}</p>
              <p><span className="font-medium text-purple-400">Message:</span></p>
              <div className="bg-gray-900/60 border border-gray-700/50 rounded-lg p-3 mt-2">
                <p className="text-gray-200 text-sm leading-relaxed whitespace-pre-wrap">{enquiry.message}</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit(handleFormSubmit)}>
            <label htmlFor="replyMessage" className="block text-sm font-medium text-gray-300 mb-2">
              Your Reply
            </label>
            <textarea
              id="replyMessage"
              {...register('replyMessage')}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(handleFormSubmit)();
                }
              }}
              placeholder="Type your reply message here..."
              className="w-full h-32 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-white placeholder-gray-400"
              disabled={isSubmitting}
            />
            {errors.replyMessage && <p className="text-red-400 text-xs mt-1">{errors.replyMessage.message}</p>}
            <div className="flex justify-end space-x-3 mt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2 text-gray-300 bg-gray-700 border border-gray-600 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 flex items-center gap-2 transition-colors"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <FiSend className="h-4 w-4" />
                    Send Reply
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        <style>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }

          .custom-scrollbar::-webkit-scrollbar-track {
            background: rgba(128, 90, 213, 0.1);
          }

          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(139, 92, 246, 0.3);
            border-radius: 3px;
          }

          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(139, 92, 246, 0.5);
          }
        `}</style>
      </div>
    </div>
  );
};

export default ReplyModal; 