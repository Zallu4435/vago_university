import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { chargeSchema, ChargeFormDataRaw } from '../../../../domain/validation/management/chargeSchema';
import { FiX as X, FiDollarSign, FiCalendar, FiFileText } from 'react-icons/fi';
import { AddChargeModalProps, ChargeFormData } from '../../../../domain/types/financialmanagement';
import { usePreventBodyScroll } from '../../../../shared/hooks/usePreventBodyScroll';

const AddChargeModal: React.FC<AddChargeModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ChargeFormDataRaw>({
    resolver: zodResolver(chargeSchema) as any, // Type assertion to bypass resolver type mismatch
    defaultValues: {
      title: '',
      description: '',
      amount: '',
      term: '',
      dueDate: '',
      applicableFor: '',
    },
    mode: 'onChange',
  });

  const handleFormSubmit = (data: ChargeFormDataRaw) => {
    const transformed: ChargeFormData = {
      ...data,
      amount: typeof data.amount === 'string' ? Number(data.amount) : data.amount,
    };
    onSubmit(transformed);
    reset();
    onClose();
  };

  usePreventBodyScroll(isOpen);

  // Particle effect
  const ghostParticles = Array(30)
    .fill(0)
    .map((_, i) => ({
      size: Math.random() * 10 + 5,
      top: Math.random() * 100,
      left: Math.random() * 100,
      animDuration: Math.random() * 10 + 15,
      animDelay: Math.random() * 5,
    }));

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      {/* Background particles */}
      {ghostParticles.map((particle, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-purple-500/20 blur-sm"
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            top: `${particle.top}%`,
            left: `${particle.left}%`,
            animation: `floatParticle ${particle.animDuration}s infinite ease-in-out`,
            animationDelay: `${particle.animDelay}s`,
          }}
        />
      ))}

      {/* Main Container */}
      <div className="bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 w-full max-w-2xl max-h-[90vh] rounded-2xl border border-purple-500/30 shadow-2xl overflow-hidden relative">
        {/* Inner glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 via-transparent to-purple-600/5 pointer-events-none" />

        {/* Corner decorations */}
        <div className="absolute top-0 left-0 w-20 h-20 bg-purple-500/10 rounded-br-full" />
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-500/10 rounded-tl-full" />

        {/* Header */}
        <div className="bg-gradient-to-r from-purple-900 to-gray-900 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl shadow-lg border border-purple-500/30 bg-purple-600/20">
                <FiDollarSign className="text-purple-300" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-purple-100">Add New Charge</h2>
                <p className="text-purple-300 text-sm">Fill in the details to create a new charge</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-purple-500/20 rounded-full transition-colors"
            >
              <X size={24} className="text-purple-300" />
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-200px)] p-6 space-y-6 custom-scrollbar">
          <div className="bg-gray-800/80 border border-purple-500/30 rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-purple-100 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
              Charge Details
            </h3>
            <div className="grid grid-cols-1 gap-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-purple-300 mb-2">Title *</label>
                <Controller
                  name="title"
                  control={control}
                  render={({ field }) => (
                    <div className="relative">
                      <FiFileText className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-400" />
                      <input
                        {...field}
                        type="text"
                        className={`w-full pl-12 pr-4 py-3 bg-gray-900/60 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                          errors.title ? 'border-red-500' : 'border-purple-500/30'
                        }`}
                        placeholder="Enter charge title"
                      />
                    </div>
                  )}
                />
                {errors.title && <p className="mt-1 text-sm text-red-400">{errors.title.message}</p>}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-purple-300 mb-2">Description *</label>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <textarea
                      {...field}
                      rows={4}
                      className={`w-full px-4 py-3 bg-gray-900/60 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                        errors.description ? 'border-red-500' : 'border-purple-500/30'
                      }`}
                      placeholder="Enter charge description"
                    />
                  )}
                />
                {errors.description && <p className="mt-1 text-sm text-red-400">{errors.description.message}</p>}
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-purple-300 mb-2">Amount ($)*</label>
                <Controller
                  name="amount"
                  control={control}
                  render={({ field }) => (
                    <div className="relative">
                      <FiDollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-400" />
                      <input
                        {...field}
                        type="number"
                        step="0.01"
                        min="0"
                        className={`w-full pl-12 pr-4 py-3 bg-gray-900/60 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                          errors.amount ? 'border-red-500' : 'border-purple-500/30'
                        }`}
                        placeholder="Enter amount"
                      />
                    </div>
                  )}
                />
                {errors.amount && <p className="mt-1 text-sm text-red-400">{errors.amount.message}</p>}
              </div>

              {/* Term */}
              <div>
                <label className="block text-sm font-medium text-purple-300 mb-2">Term *</label>
                <Controller
                  name="term"
                  control={control}
                  render={({ field }) => (
                    <select
                      {...field}
                      className={`w-full px-4 py-3 bg-gray-900/60 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                        errors.term ? 'border-red-500' : 'border-purple-500/30'
                      }`}
                    >
                      <option value="">Select Term</option>
                      <option value="Fall 2024">Fall 2024</option>
                      <option value="Spring 2025">Spring 2025</option>
                      <option value="Summer 2025">Summer 2025</option>
                    </select>
                  )}
                />
                {errors.term && <p className="mt-1 text-sm text-red-400">{errors.term.message}</p>}
              </div>

              {/* Due Date */}
              <div>
                <label className="block text-sm font-medium text-purple-300 mb-2">Due Date *</label>
                <Controller
                  name="dueDate"
                  control={control}
                  render={({ field }) => (
                    <div className="relative">
                      <FiCalendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-400" />
                      <input
                        {...field}
                        type="date"
                        className={`w-full pl-12 pr-4 py-3 bg-gray-900/60 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                          errors.dueDate ? 'border-red-500' : 'border-purple-500/30'
                        }`}
                      />
                    </div>
                  )}
                />
                {errors.dueDate && <p className="mt-1 text-sm text-red-400">{errors.dueDate.message}</p>}
              </div>

              {/* Applicable For */}
              <div>
                <label className="block text-sm font-medium text-purple-300 mb-2">Applicable For *</label>
                <Controller
                  name="applicableFor"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      className={`w-full px-4 py-3 bg-gray-900/60 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                        errors.applicableFor ? 'border-red-500' : 'border-purple-500/30'
                      }`}
                      placeholder="e.g., batch_2024, cs_department"
                    />
                  )}
                />
                {errors.applicableFor && <p className="mt-1 text-sm text-red-400">{errors.applicableFor.message}</p>}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="border-t border-purple-500/30 bg-gray-900/80 p-6">
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={onClose}
                className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors border border-gray-500/50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                onClick={handleSubmit(handleFormSubmit)}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-blue-500/50 flex items-center justify-center"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Creating...
                  </div>
                ) : (
                  'Add Charge'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .no-scroll {
          overflow: hidden;
        }

        @keyframes floatParticle {
          0% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          25% {
            opacity: 0.8;
          }
          50% {
            transform: translateY(-20px) translateX(10px);
            opacity: 0.3;
          }
          75% {
            opacity: 0.7;
          }
          100% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
        }

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
  );
};

export default AddChargeModal;