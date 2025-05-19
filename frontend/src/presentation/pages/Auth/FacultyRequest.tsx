import { useState } from 'react';
import { FaCheckCircle, FaUpload, FaSpinner } from 'react-icons/fa';

export default function FacultyRequestForm() {
  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    department: '',
    qualification: '',
    experience: '',
    aboutMe: '',
    acceptTerms: false,
    cv: null,
    certificates: null
  });

  // Error state
  const [errors, setErrors] = useState({});
  
  // Submit state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    if (type === 'file') {
      setFormData({
        ...formData,
        [name]: files
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value
      });
    }
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    // Required fields
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    
    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10,}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    // Required selections
    if (!formData.department) newErrors.department = 'Department is required';
    if (!formData.qualification) newErrors.qualification = 'Qualification is required';
    if (!formData.experience) newErrors.experience = 'Years of experience is required';
    
    // File validations
    if (!formData.cv) {
      newErrors.cv = 'CV is required';
    } else if (formData.cv[0]) {
      const cvFile = formData.cv[0];
      const cvExtension = cvFile.name.split('.').pop().toLowerCase();
      if (!['pdf', 'doc', 'docx'].includes(cvExtension)) {
        newErrors.cv = 'Please upload PDF or DOC files only';
      } else if (cvFile.size > 5 * 1024 * 1024) { // 5MB limit
        newErrors.cv = 'File size must be less than 5MB';
      }
    }
    
    if (formData.certificates && formData.certificates[0]) {
      const certFile = formData.certificates[0];
      const certExtension = certFile.name.split('.').pop().toLowerCase();
      if (!['pdf', 'jpg', 'jpeg', 'png'].includes(certExtension)) {
        newErrors.certificates = 'Please upload PDF, JPG or PNG files only';
      } else if (certFile.size > 5 * 1024 * 1024) { // 5MB limit
        newErrors.certificates = 'File size must be less than 5MB';
      }
    }
    
    // Terms validation
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'You must accept the terms and conditions';
    }
    
    return newErrors;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const formErrors = validateForm();
    
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      
      // Reset form after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          department: '',
          qualification: '',
          experience: '',
          aboutMe: '',
          acceptTerms: false,
          cv: null,
          certificates: null
        });
      }, 5000);
    }, 1500);
  };

  // Success message component
  const SuccessMessage = () => (
    <div className="bg-green-50 border border-green-200 rounded-lg p-6 flex flex-col items-center text-center max-w-lg mx-auto">
      <FaCheckCircle className="text-green-500 w-16 h-16 mb-4" />
      <h3 className="text-xl font-semibold text-green-700 mb-1">Request Submitted Successfully!</h3>
      <p className="text-green-600 mb-4">Your faculty application is now pending admin approval.</p>
      <p className="text-sm text-green-500">You will receive a confirmation email shortly.</p>
    </div>
  );

  // Main form component
  const FormComponent = () => (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Full Name */}
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className={`w-full px-4 py-2 border ${
              errors.fullName ? 'border-red-300' : 'border-gray-300'
            } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
            placeholder="John Doe"
          />
          {errors.fullName && (
            <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
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
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-4 py-2 border ${
              errors.email ? 'border-red-300' : 'border-gray-300'
            } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
            placeholder="johndoe@example.com"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
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
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={`w-full px-4 py-2 border ${
              errors.phone ? 'border-red-300' : 'border-gray-300'
            } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
            placeholder="(123) 456-7890"
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
          )}
        </div>

        {/* Department */}
        <div>
          <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
            Department <span className="text-red-500">*</span>
          </label>
          <select
            id="department"
            name="department"
            value={formData.department}
            onChange={handleChange}
            className={`w-full px-4 py-2 border ${
              errors.department ? 'border-red-300' : 'border-gray-300'
            } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white`}
          >
            <option value="">Select Department</option>
            <option value="computer-science">Computer Science</option>
            <option value="mathematics">Mathematics</option>
            <option value="physics">Physics</option>
            <option value="chemistry">Chemistry</option>
            <option value="biology">Biology</option>
            <option value="engineering">Engineering</option>
            <option value="humanities">Humanities</option>
            <option value="business">Business</option>
          </select>
          {errors.department && (
            <p className="mt-1 text-sm text-red-600">{errors.department}</p>
          )}
        </div>

        {/* Qualification */}
        <div>
          <label htmlFor="qualification" className="block text-sm font-medium text-gray-700 mb-1">
            Highest Qualification <span className="text-red-500">*</span>
          </label>
          <select
            id="qualification"
            name="qualification"
            value={formData.qualification}
            onChange={handleChange}
            className={`w-full px-4 py-2 border ${
              errors.qualification ? 'border-red-300' : 'border-gray-300'
            } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white`}
          >
            <option value="">Select Qualification</option>
            <option value="bachelors">Bachelor's Degree</option>
            <option value="masters">Master's Degree</option>
            <option value="phd">PhD</option>
            <option value="postdoc">Post Doctorate</option>
          </select>
          {errors.qualification && (
            <p className="mt-1 text-sm text-red-600">{errors.qualification}</p>
          )}
        </div>

        {/* Experience */}
        <div>
          <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
            Years of Experience <span className="text-red-500">*</span>
          </label>
          <select
            id="experience"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            className={`w-full px-4 py-2 border ${
              errors.experience ? 'border-red-300' : 'border-gray-300'
            } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white`}
          >
            <option value="">Select Experience</option>
            <option value="0-2">0-2 years</option>
            <option value="3-5">3-5 years</option>
            <option value="6-10">6-10 years</option>
            <option value="10+">More than 10 years</option>
          </select>
          {errors.experience && (
            <p className="mt-1 text-sm text-red-600">{errors.experience}</p>
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
          name="aboutMe"
          value={formData.aboutMe}
          onChange={handleChange}
          rows="4"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          placeholder="Tell us about your teaching philosophy, research interests, and why you want to join our faculty..."
        ></textarea>
      </div>

      {/* File uploads */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* CV Upload */}
        <div>
          <label htmlFor="cv" className="block text-sm font-medium text-gray-700 mb-1">
            Upload CV <span className="text-red-500">*</span> <span className="text-gray-500 text-xs">(PDF, DOC, max 5MB)</span>
          </label>
          <div className={`border-2 border-dashed ${
            errors.cv ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50'
          } rounded-lg p-4 text-center hover:bg-gray-100 transition-colors`}>
            <input
              type="file"
              id="cv"
              name="cv"
              onChange={handleChange}
              accept=".pdf,.doc,.docx"
              className="hidden"
            />
            <label htmlFor="cv" className="cursor-pointer flex flex-col items-center">
              <FaUpload className="h-8 w-8 text-gray-400 mb-2" />
              <span className="text-sm font-medium text-gray-700">
                {formData.cv && formData.cv[0] 
                  ? formData.cv[0].name 
                  : 'Click to upload CV'
                }
              </span>
              <span className="text-xs text-gray-500 mt-1">PDF or DOC files only</span>
            </label>
          </div>
          {errors.cv && (
            <p className="mt-1 text-sm text-red-600">{errors.cv}</p>
          )}
        </div>

        {/* Certificates Upload */}
        <div>
          <label htmlFor="certificates" className="block text-sm font-medium text-gray-700 mb-1">
            Upload Certificates <span className="text-gray-500 text-xs">(PDF, JPG, PNG, max 5MB)</span>
          </label>
          <div className="border-2 border-dashed border-gray-300 bg-gray-50 rounded-lg p-4 text-center hover:bg-gray-100 transition-colors">
            <input
              type="file"
              id="certificates"
              name="certificates"
              onChange={handleChange}
              accept=".pdf,.jpg,.jpeg,.png"
              className="hidden"
            />
            <label htmlFor="certificates" className="cursor-pointer flex flex-col items-center">
              <FaUpload className="h-8 w-8 text-gray-400 mb-2" />
              <span className="text-sm font-medium text-gray-700">
                {formData.certificates && formData.certificates[0] 
                  ? formData.certificates[0].name 
                  : 'Click to upload certificates'
                }
              </span>
              <span className="text-xs text-gray-500 mt-1">PDF, JPG or PNG files</span>
            </label>
          </div>
          {errors.certificates && (
            <p className="mt-1 text-sm text-red-600">{errors.certificates}</p>
          )}
        </div>
      </div>

      {/* Terms and Conditions */}
      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            id="acceptTerms"
            name="acceptTerms"
            type="checkbox"
            checked={formData.acceptTerms}
            onChange={handleChange}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
        </div>
        <div className="ml-3">
          <label htmlFor="acceptTerms" className="text-sm text-gray-700">
            I accept the <a href="#" className="text-blue-600 hover:underline">Terms and Conditions</a> <span className="text-red-500">*</span>
          </label>
          {errors.acceptTerms && (
            <p className="mt-1 text-sm text-red-600">{errors.acceptTerms}</p>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-center">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`flex items-center px-6 py-3 font-medium rounded-lg text-white transition-colors ${
            isSubmitting 
              ? 'bg-blue-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
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
    </form>
  );

  return (
    <div className="bg-white shadow-md rounded-lg p-6 md:p-8 max-w-4xl mx-auto">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800">Faculty Position Application</h2>
        <p className="text-gray-600 mt-2">Complete the form below to apply for a faculty position at our institution</p>
      </div>
      
      {isSubmitted ? <SuccessMessage /> : <FormComponent />}
    </div>
  );
}