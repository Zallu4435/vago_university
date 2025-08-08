import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { FaRegCheckCircle, FaRegIdCard, FaShieldAlt } from 'react-icons/fa';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { Input } from '../../components/base/Input';
import { Button } from '../../components/base/Button';
import { registerSchema } from '../../../domain/validation/register';
import { useRegisterUser } from '../../../application/hooks/useAuthQueries';
import { usePasswordStrength } from '../../../shared/hooks/usePasswordStrength';
import { useAnimation } from '../../../shared/hooks/useAnimation';
import type { RegisterFormData } from '../../../domain/types/auth/Register';

const RegisterPage = () => {
  const formAnimation = useAnimation(300);
  const backgroundAnimation = useAnimation(0);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [formError, setFormError] = useState('');

  const { register, handleSubmit, watch, formState: { errors }, reset } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false,
    },
  });

  const password = watch('password');
  const { passwordStrength, getPasswordStrengthColor, getPasswordStrengthText } = usePasswordStrength(password);

  const mutation = useRegisterUser();

  const onSubmit = (data: RegisterFormData) => {
    setFormError('');
    mutation.mutate(
      {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
      },
      {
        onSuccess: (response) => {
          setConfirmationMessage(response.message || 'Registration successful! Please check your email to confirm your account before logging in.');
          reset();
        },
        onError: (error: Error) => {
          setFormError(error.message || 'Registration failed');
        },
      }
    );
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gradient-to-b from-cyan-50 via-white to-cyan-50 px-3 sm:px-4 lg:px-6 py-2 sm:py-6 lg:py-8"
      style={backgroundAnimation}
    >
      <div className="w-full max-w-6xl flex flex-col lg:flex-row shadow-xl rounded-lg sm:rounded-xl overflow-hidden">
        <div className="w-full lg:w-1/2 bg-white p-4 sm:p-6 lg:p-8 xl:p-12" style={formAnimation}>
          <div className="max-w-md mx-auto">
            <div className="text-center mb-4 sm:mb-6 lg:mb-8">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-cyan-800 mb-2 sm:mb-4">Academy Registration</h2>
              <p className="text-sm sm:text-base text-cyan-600">Begin your journey at VAGO Academy</p>
              <div className="w-16 sm:w-20 lg:w-24 h-1 bg-gradient-to-r from-cyan-400 to-blue-400 mx-auto mt-3 sm:mt-4" />
            </div>

            {confirmationMessage ? (
              <div className="bg-green-100 border border-green-400 text-green-700 px-3 sm:px-4 py-2 sm:py-3 rounded relative mb-4 sm:mb-6 text-center text-sm sm:text-base" role="alert">
                <span className="block sm:inline text-base sm:text-lg font-semibold">{confirmationMessage}</span>
                <p className="mt-2 text-xs sm:text-sm text-green-600">You may close this page and log in after confirming your email.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 sm:space-y-4 lg:space-y-5">
                {formError && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded relative mb-4 text-center text-sm sm:text-base" role="alert">
                    <span className="block sm:inline">{formError}</span>
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <Input
                      id="firstName"
                      type="text"
                      label="First Name"
                      {...register('firstName')}
                      placeholder="John"
                      className="border-cyan-200 focus:border-cyan-500 focus:ring-cyan-500"
                    />
                    {errors.firstName && <p className="text-red-600 text-xs mt-1">{errors.firstName.message}</p>}
                  </div>
                  <div>
                    <Input
                      id="lastName"
                      type="text"
                      label="Last Name"
                      {...register('lastName')}
                      placeholder="Doe"
                      className="border-cyan-200 focus:border-cyan-500 focus:ring-cyan-500"
                    />
                    {errors.lastName && <p className="text-red-600 text-xs mt-1">{errors.lastName.message}</p>}
                  </div>
                </div>

                <div>
                  <Input
                    id="email"
                    type="email"
                    label="Email Address"
                    {...register('email')}
                    placeholder="you@example.com"
                    className="border-cyan-200 focus:border-cyan-500 focus:ring-cyan-500"
                  />
                  {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email.message}</p>}
                </div>

                <div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={isPasswordVisible ? "text" : "password"}
                      label="Password"
                      {...register('password')}
                      placeholder="••••••••"
                      className="border-cyan-200 focus:border-cyan-500 focus:ring-cyan-500 pr-10"
                    />
                    <button
                      type="button"
                      onMouseDown={() => setIsPasswordVisible(true)}
                      onMouseUp={() => setIsPasswordVisible(false)}
                      onMouseLeave={() => setIsPasswordVisible(false)}
                      onTouchStart={() => setIsPasswordVisible(true)}
                      onTouchEnd={() => setIsPasswordVisible(false)}
                      className="absolute right-3 top-[38px] text-gray-500 hover:text-gray-700 focus:outline-none"
                    >
                      {isPasswordVisible ? <FiEyeOff className="h-4 w-4 sm:h-5 sm:w-5" /> : <FiEye className="h-4 w-4 sm:h-5 sm:w-5" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-600 text-xs mt-1">{errors.password.message}</p>}
                  {password && (
                    <div className="mt-2">
                      <div className="flex gap-1 mb-1">
                        {[...Array(4)].map((_, i) => (
                          <div
                            key={i}
                            className={`h-1 flex-1 rounded-full ${i < passwordStrength ? getPasswordStrengthColor() : 'bg-gray-200'}`}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-gray-500">{getPasswordStrengthText()}</p>
                    </div>
                  )}
                </div>

                <div>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={isConfirmPasswordVisible ? "text" : "password"}
                      label="Confirm Password"
                      {...register('confirmPassword')}
                      placeholder="••••••••"
                      className="border-cyan-200 focus:border-cyan-500 focus:ring-cyan-500 pr-10"
                    />
                    <button
                      type="button"
                      onMouseDown={() => setIsConfirmPasswordVisible(true)}
                      onMouseUp={() => setIsConfirmPasswordVisible(false)}
                      onMouseLeave={() => setIsConfirmPasswordVisible(false)}
                      onTouchStart={() => setIsConfirmPasswordVisible(true)}
                      onTouchEnd={() => setIsConfirmPasswordVisible(false)}
                      className="absolute right-3 top-[38px] text-gray-500 hover:text-gray-700 focus:outline-none"
                    >
                      {isConfirmPasswordVisible ? <FiEyeOff className="h-4 w-4 sm:h-5 sm:w-5" /> : <FiEye className="h-4 w-4 sm:h-5 sm:w-5" />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="text-red-600 text-xs mt-1">{errors.confirmPassword.message}</p>}
                </div>

                <div className="flex items-start">
                  <input
                    id="terms"
                    type="checkbox"
                    {...register('acceptTerms')}
                    className="h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-cyan-300 rounded mt-1"
                  />
                  <label htmlFor="terms" className="ml-2 block text-xs sm:text-sm text-cyan-700">
                    I agree to the <Link to="/terms" className="text-cyan-600 hover:underline">Terms of Service</Link> and{' '}
                    <Link to="/privacy" className="text-cyan-600 hover:underline">Privacy Policy</Link>
                  </label>
                </div>
                {errors.acceptTerms && <p className="text-red-600 text-xs mt-1">{errors.acceptTerms.message}</p>}

                <Button
                  type="submit"
                  label={mutation.isPending ? 'Registering...' : 'Register'}
                  disabled={mutation.isPending}
                  variant="primary"
                  className="w-full"
                />

                <div className="text-center text-xs sm:text-sm text-cyan-700 mt-2 sm:mt-3 lg:mt-4 space-y-1 sm:space-y-2">
                  <div>
                    Already enrolled? <Link to="/login" className="text-cyan-600 hover:underline font-medium">Sign in</Link>
                    <span className="mx-1 sm:mx-2">|</span>
                    <Link to="/faculty/request" className="text-cyan-600 hover:underline font-medium">Apply as Faculty</Link>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>

        <div
          className="hidden lg:block lg:w-1/2 p-6 sm:p-8 lg:p-12 text-white bg-cover bg-center relative"
          style={{
            ...formAnimation,
            backgroundImage: `url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80')`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-900/30 to-blue-900/30"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 opacity-20 transform -rotate-45"
              style={{ textShadow: '0 0 20px rgba(0, 255, 255, 0.3)' }}
            >
              VAGO
            </span>
          </div>
          <div className="relative h-full flex flex-col justify-between p-4 sm:p-6 rounded-lg">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6">Welcome to VAGO Academy</h1>
              <p className="text-sm sm:text-base text-white mb-6 sm:mb-8">
                Register now to embark on your academic journey with VAGO Academy and discover our
                diverse programs and vibrant campus life.
              </p>
              <div className="space-y-4 sm:space-y-6 mt-8 sm:mt-12">
                <div className="flex items-center">
                  <div className="bg-cyan-500 bg-opacity-30 p-2 rounded-full">
                    <FaRegCheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div className="ml-3 sm:ml-4">
                    <h3 className="font-medium text-sm sm:text-base">Streamlined Enrollment</h3>
                    <p className="text-xs sm:text-sm text-white">Complete your registration in just a few minutes</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="bg-cyan-500 bg-opacity-30 p-2 rounded-full">
                    <FaRegIdCard className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div className="ml-3 sm:ml-4">
                    <h3 className="font-medium text-sm sm:text-base">Academic Excellence</h3>
                    <p className="text-xs sm:text-sm text-white">Access world-class education and resources</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="bg-cyan-500 bg-opacity-30 p-2 rounded-full">
                    <FaShieldAlt className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div className="ml-3 sm:ml-4">
                    <h3 className="font-medium text-sm sm:text-base">Secure Registration</h3>
                    <p className="text-xs sm:text-sm text-white">Your personal information is protected</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-xs sm:text-sm text-white">© 2025 VAGO Academy. All rights reserved.</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;