import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { FaRegCheckCircle, FaRegIdCard, FaShieldAlt } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import Cookies from 'js-cookie';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { loginSchema } from '../../../domain/validation/login';
import { useLoginUser } from '../../../application/hooks/useAuthQueries';
import { useAnimation } from '../../../application/hooks/useAnimation';
import { setAuth } from '../../redux/authSlice';
import { toast } from 'react-hot-toast';

interface FormData {
  email: string;
  password: string;
}

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const formAnimation = useAnimation(300);
  const backgroundAnimation = useAnimation(0);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const mutation = useLoginUser();


const onSubmit = (data: FormData) => {
  mutation.mutate(data, {
    onSuccess: (response) => {
      Cookies.set('auth_token', response.token, { secure: true, sameSite: 'strict' });
      console.log(response, "response from the checking side....")
      dispatch(setAuth({
        token: response.token,
        user: response.user,
        collection: response.collection,
      }));
      toast.success('Login successful!');
      switch (response.collection) {
        case 'register':
          navigate('/admission');
          break;
        case 'admin':
          navigate('/admin');
          break;
        case 'user':
          navigate('/dashboard');
          break;
        case 'faculty':
          navigate('/faculty/courses');
          break;
      }
    },
    onError: (error: Error) => {
      toast.error(`Login failed: ${error.message}`);
    },
  });
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
              <h2 className="text-3xl font-bold text-cyan-800 mb-4">University Login</h2>
              <p className="text-cyan-600">Sign in to your Horizon University account</p>
              <div className="w-20 h-1 bg-gradient-to-r from-cyan-400 to-blue-400 mx-auto mt-4" />
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
              </div>

              <Button
                type="submit"
                label={
                  mutation.isPending ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      </svg>
                      Logging in...
                    </span>
                  ) : (
                    'Login'
                  )
                }
                disabled={mutation.isPending}
                variant="primary"
                className="w-full"
              />

              <div className="text-center text-sm text-cyan-700 mt-4">
                Don't have an account?{' '}
                <Link to="/register" className="text-cyan-600 hover:underline font-medium">Register</Link>
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
              <h1 className="text-3xl font-bold mb-6">Welcome Back to Horizon University</h1>
              <p className="text-white mb-8">
                Log in to continue your academic journey with Horizon University and access your personalized dashboard and resources.
              </p>
              <div className="space-y-6 mt-12">
                <div className="flex items-center">
                  <div className="bg-cyan-500 bg-opacity-30 p-2 rounded-full">
                    <FaRegCheckCircle className="w-5 h-5" />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-medium">Quick Access</h3>
                    <p className="text-sm text-white">Sign in to manage your account in seconds</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="bg-cyan-500 bg-opacity-30 p-2 rounded-full">
                    <FaRegIdCard className="w-5 h-5" />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-medium">Personalized Dashboard</h3>
                    <p className="text-sm text-white">Access your courses and resources</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="bg-cyan-500 bg-opacity-30 p-2 rounded-full">
                    <FaShieldAlt className="w-5 h-5" />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-medium">Secure Login</h3>
                    <p className="text-sm text-white">Your credentials are protected</p>
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

export default LoginPage;