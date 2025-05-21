import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { FaRegCheckCircle, FaRegIdCard, FaShieldAlt } from 'react-icons/fa';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { registerSchema } from '../../../domain/validation/register';
import { useRegisterUser } from '../../../application/hooks/useAuthQueries';
import { usePasswordStrength } from '../../../application/hooks/usePasswordStrength';
import { useAnimation } from '../../../application/hooks/useAnimation';
import { toast } from 'react-hot-toast'; 

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

const RegisterPage = () => {
  const navigate = useNavigate();
  const formAnimation = useAnimation(300);
  const backgroundAnimation = useAnimation(0);

  const { register, handleSubmit, watch, formState: { errors }, reset } = useForm<FormData>({
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

  const onSubmit = (data: FormData) => {
    mutation.mutate(
      {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
      },
      {
        onSuccess: () => {
          toast.success('Registration successful! Welcome to Horizon University.');
          reset();
          navigate('/login');
        },
        onError: (error: Error) => {
          toast.error(`Registration failed: ${error.message}`);
        },
      }
    );
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gradient-to-b from-cyan-50 via-white to-cyan-50"
      style={backgroundAnimation}
    >
      <div className="w-full max-w-6xl flex shadow-xl rounded-xl overflow-hidden">
        <div className="w-full md:w-1/2 bg-white p-8 md:p-12" style={formAnimation}>
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-cyan-800 mb-4">University Registration</h2>
              <p className="text-cyan-600">Begin your journey at Horizon University</p>
              <div className="w-20 h-1 bg-gradient-to-r from-cyan-400 to-blue-400 mx-auto mt-4" />
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <Input
                  id="password"
                  type="password"
                  label="Password"
                  {...register('password')}
                  placeholder="••••••••"
                  className="border-cyan-200 focus:border-cyan-500 focus:ring-cyan-500"
                />
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
                <Input
                  id="confirmPassword"
                  type="password"
                  label="Confirm Password"
                  {...register('confirmPassword')}
                  placeholder="••••••••"
                  className="border-cyan-200 focus:border-cyan-500 focus:ring-cyan-500"
                />
                {errors.confirmPassword && <p className="text-red-600 text-xs mt-1">{errors.confirmPassword.message}</p>}
              </div>

              <div className="flex items-center">
                <input
                  id="terms"
                  type="checkbox"
                  {...register('acceptTerms')}
                  className="h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-cyan-300 rounded"
                />
                <label htmlFor="terms" className="ml-2 block text-sm text-cyan-700">
                  I agree to the <Link to="/terms" className="text-cyan-600 hover:underline">Terms of Service</Link> and{' '}
                  <Link to="/privacy" className="text-cyan-600 hover:underline">Privacy Policy</Link>
                </label>
              </div>
              {errors.acceptTerms && <p className="text-red-600 text-xs mt-1">{errors.acceptTerms.message}</p>}

              <Button
                type="submit"
                label={
                  mutation.isPending ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      </svg>
                      Registering...
                    </span>
                  ) : (
                    'Register'
                  )
                }
                disabled={mutation.isPending}
                variant="primary"
                className="w-full"
              />

              <div className="text-center text-sm text-cyan-700 mt-4">
                Already enrolled? <Link to="/login" className="text-cyan-600 hover:underline font-medium">Sign in</Link>
                <span className="mx-2">|</span>
                <Link to="/faculty/request" className="text-cyan-600 hover:underline font-medium">Apply as Faculty</Link>
              </div>
            </form>
          </div>
        </div>

        <div
          className="hidden md:block w-1/2 p-12 text-white bg-cover bg-center relative"
          style={{
            ...formAnimation,
            backgroundImage: `url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80')`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-900/30 to-blue-900/30"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 opacity-20 transform -rotate-45"
              style={{ textShadow: '0 0 20px rgba(0, 255, 255, 0.3)' }}
            >
              HORIZON
            </span>
          </div>
          <div className="relative h-full flex flex-col justify-between p-6 rounded-lg">
            <div>
              <h1 className="text-3xl font-bold mb-6">Welcome to Horizon University</h1>
              <p className="text-white mb-8">
                Register now to embark on your academic journey with Horizon University and discover our
                diverse programs and vibrant campus life.
              </p>
              <div className="space-y-6 mt-12">
                <div className="flex items-center">
                  <div className="bg-cyan-500 bg-opacity-30 p-2 rounded-full">
                    <FaRegCheckCircle className="w-5 h-5" />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-medium">Streamlined Enrollment</h3>
                    <p className="text-sm text-white">Complete your registration in just a few minutes</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="bg-cyan-500 bg-opacity-30 p-2 rounded-full">
                    <FaRegIdCard className="w-5 h-5" />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-medium">Academic Excellence</h3>
                    <p className="text-sm text-white">Access world-class education and resources</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="bg-cyan-500 bg-opacity-30 p-2 rounded-full">
                    <FaShieldAlt className="w-5 h-5" />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-medium">Secure Registration</h3>
                    <p className="text-sm text-white">Your personal information is protected</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-sm text-white">© 2025 Horizon University. All rights reserved.</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;