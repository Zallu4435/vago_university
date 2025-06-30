import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FaCheckCircle, FaUpload, FaSpinner } from 'react-icons/fa';
import { facultyRequestSchema, type FacultyRequestFormData } from '../../../domain/validation/facultyRequestSchema';
import { facultyRequestService } from '../../../application/services/facultyRequest.service';
import { Link } from 'react-router-dom';

export default function FacultyRequestForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors }, watch, reset } = useForm<FacultyRequestFormData>({
    resolver: zodResolver(facultyRequestSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      department: '',
      qualification: '',
      experience: '',
      aboutMe: '',
      acceptTerms: false
    }
  });

  const onSubmit = async (data: FacultyRequestFormData) => {
    try {
      setIsSubmitting(true);
      setError(null);
      await facultyRequestService.submitRequest(data);
      setIsSubmitted(true);
      reset(); 
      
      // Reset form after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success message component
  const SuccessMessage = () => (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4 sm:p-6 flex flex-col items-center text-center max-w-lg mx-auto">
      <FaCheckCircle className="text-green-500 w-12 h-12 sm:w-16 sm:h-16 mb-3 sm:mb-4" />
      <h3 className="text-lg sm:text-xl font-semibold text-green-700 mb-1">Request Submitted Successfully!</h3>
      <p className="text-sm sm:text-base text-green-600 mb-3 sm:mb-4">Your faculty application is now pending admin approval.</p>
      <p className="text-xs sm:text-sm text-green-500">You will receive a confirmation email shortly.</p>
    </div>
  );

  // Main form component
  const FormComponent = () => (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-sm sm:text-base">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {/* Full Name */}
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="fullName"
            {...register('fullName')}
            className={`w-full px-3 sm:px-4 py-2 border ${
              errors.fullName ? 'border-red-300' : 'border-gray-300'
            } rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors text-sm sm:text-base`}
            placeholder="John Doe"
          />
          {errors.fullName && (
            <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.fullName.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            {...register('email')}
            className={`w-full px-3 sm:px-4 py-2 border ${
              errors.email ? 'border-red-300' : 'border-gray-300'
            } rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors text-sm sm:text-base`}
            placeholder="johndoe@example.com"
          />
          {errors.email && (
            <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            id="phone"
            {...register('phone')}
            className={`w-full px-3 sm:px-4 py-2 border ${
              errors.phone ? 'border-red-300' : 'border-gray-300'
            } rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors text-sm sm:text-base`}
            placeholder="(123) 456-7890"
          />
          {errors.phone && (
            <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.phone.message}</p>
          )}
        </div>

        {/* Department */}
        <div>
          <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
            Department <span className="text-red-500">*</span>
          </label>
          <select
            id="department"
            {...register('department')}
            className={`w-full px-3 sm:px-4 py-2 border ${
              errors.department ? 'border-red-300' : 'border-gray-300'
            } rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors bg-white text-sm sm:text-base`}
          >
            <option value="">Select Department</option>
            <option value="computer-science">Computer Science</option>
            <option value="business">Business</option>
          </select>
          {errors.department && (
            <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.department.message}</p>
          )}
        </div>

        {/* Qualification */}
        <div>
          <label htmlFor="qualification" className="block text-sm font-medium text-gray-700 mb-1">
            Highest Qualification <span className="text-red-500">*</span>
          </label>
          <select
            id="qualification"
            {...register('qualification')}
            className={`w-full px-3 sm:px-4 py-2 border ${
              errors.qualification ? 'border-red-300' : 'border-gray-300'
            } rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors bg-white text-sm sm:text-base`}
          >
            <option value="">Select Qualification</option>
            <option value="bachelors">Bachelor's Degree</option>
            <option value="masters">Master's Degree</option>
            <option value="phd">PhD</option>
            <option value="postdoc">Post Doctorate</option>
          </select>
          {errors.qualification && (
            <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.qualification.message}</p>
          )}
        </div>

        {/* Experience */}
        <div>
          <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
            Years of Experience <span className="text-red-500">*</span>
          </label>
          <select
            id="experience"
            {...register('experience')}
            className={`w-full px-3 sm:px-4 py-2 border ${
              errors.experience ? 'border-red-300' : 'border-gray-300'
            } rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors bg-white text-sm sm:text-base`}
          >
            <option value="">Select Experience</option>
            <option value="0-2">0-2 years</option>
            <option value="3-5">3-5 years</option>
            <option value="6-10">6-10 years</option>
            <option value="10+">More than 10 years</option>
          </select>
          {errors.experience && (
            <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.experience.message}</p>
          )}
        </div>
      </div>

      {/* About Me */}
      <div>
        <label htmlFor="aboutMe" className="block text-sm font-medium text-gray-700 mb-1">
          About Me / Additional Information
        </label>
        <textarea
          id="aboutMe"
          {...register('aboutMe')}
          className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors text-sm sm:text-base"
          placeholder="Tell us about your teaching philosophy, research interests, and why you want to join our faculty..."
          rows={4}
        ></textarea>
      </div>

      {/* File uploads */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {/* CV Upload */}
        <div>
          <label htmlFor="cv" className="block text-sm font-medium text-gray-700 mb-1">
            Upload CV <span className="text-red-500">*</span> <span className="text-gray-500 text-xs">(PDF, DOC, max 5MB)</span>
          </label>
          <div className={`border-2 border-dashed ${
            errors.cv ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50'
          } rounded-lg p-3 sm:p-4 text-center hover:bg-gray-100 transition-colors`}>
            <input
              type="file"
              id="cv"
              {...register('cv')}
              accept=".pdf,.doc,.docx"
              className="hidden"
            />
            <label htmlFor="cv" className="cursor-pointer flex flex-col items-center">
              <FaUpload className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400 mb-2" />
              <span className="text-xs sm:text-sm font-medium text-gray-700">
                {watch('cv')?.[0]?.name || 'Click to upload CV'}
              </span>
              <span className="text-xs text-gray-500 mt-1">PDF or DOC files only</span>
            </label>
          </div>
          {errors.cv && (
            <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.cv.message}</p>
          )}
        </div>

        {/* Certificates Upload */}
        <div>
          <label htmlFor="certificates" className="block text-sm font-medium text-gray-700 mb-1">
            Upload Certificates <span className="text-gray-500 text-xs">(PDF, JPG, PNG, max 5MB)</span>
          </label>
          <div className="border-2 border-dashed border-gray-300 bg-gray-50 rounded-lg p-3 sm:p-4 text-center hover:bg-gray-100 transition-colors">
            <input
              type="file"
              id="certificates"
              {...register('certificates')}
              accept=".pdf,.jpg,.jpeg,.png"
              className="hidden"
            />
            <label htmlFor="certificates" className="cursor-pointer flex flex-col items-center">
              <FaUpload className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400 mb-2" />
              <span className="text-xs sm:text-sm font-medium text-gray-700">
                {watch('certificates')?.[0]?.name || 'Click to upload certificates'}
              </span>
              <span className="text-xs text-gray-500 mt-1">PDF, JPG or PNG files</span>
            </label>
          </div>
          {errors.certificates && (
            <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.certificates.message}</p>
          )}
        </div>
      </div>

      {/* Terms and Conditions */}
      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            id="acceptTerms"
            type="checkbox"
            {...register('acceptTerms')}
            className="w-4 h-4 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500"
          />
        </div>
        <div className="ml-3">
          <label htmlFor="acceptTerms" className="text-xs sm:text-sm text-gray-700">
            I accept the <a href="#" className="text-cyan-600 hover:underline">Terms and Conditions</a> <span className="text-red-500">*</span>
          </label>
          {errors.acceptTerms && (
            <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.acceptTerms.message}</p>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-center">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`flex items-center px-4 sm:px-6 py-2 sm:py-3 font-medium rounded-lg text-white transition-colors text-sm sm:text-base ${
            isSubmitting 
              ? 'bg-cyan-400 cursor-not-allowed' 
              : 'bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500'
          }`}
        >
          {isSubmitting ? (
            <>
              <FaSpinner className="animate-spin -ml-1 mr-2 h-4 w-4" />
              Processing...
            </>
          ) : (
            'Submit Application'
          )}
        </button>
      </div>

      <div className="text-center text-xs sm:text-sm text-cyan-700 mt-3 sm:mt-4 space-y-2">
        <div>
          Already have an account? <Link to="/login" className="text-cyan-600 hover:underline font-medium">Sign in</Link>
          <span className="mx-1 sm:mx-2">|</span>
          <Link to="/register" className="text-cyan-600 hover:underline font-medium">Register as Student</Link>
        </div>
      </div>
    </form>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 via-white to-cyan-50 px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
      <div className="bg-white shadow-md rounded-lg p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto my-8 sm:my-12 lg:my-20">
        <div className="mb-6 sm:mb-8 text-center">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-cyan-800 mb-2 sm:mb-3">Faculty Position Application</h2>
          <p className="text-sm sm:text-base text-cyan-600">Complete the form below to apply for a faculty position at our institution</p>
        </div>
        
        {isSubmitted ? <SuccessMessage /> : <FormComponent />}
      </div>
    </div>
  );
}