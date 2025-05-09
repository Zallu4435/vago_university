import React, { useState, useEffect } from 'react';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { FaLock, FaUserShield, FaUsers } from 'react-icons/fa';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Animation hook for smooth entrance
  const useAnimation = (delay = 100) => {
    const [style, setStyle] = useState({ opacity: 0, transform: 'translateY(20px)' });
    
    useEffect(() => {
      const timer = setTimeout(() => {
        setStyle({
          opacity: 1,
          transform: 'none',
          transition: 'opacity 600ms ease-in-out, transform 600ms ease-out'
        });
      }, delay);
      return () => clearTimeout(timer);
    }, [delay]);
    
    return style;
  };

  const formAnimation = useAnimation(300);
  const backgroundAnimation = useAnimation(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      
      if (!email || !password) {
        setError('Please enter both email and password');
      } else if (email === 'admin@example.com' && password === 'password') {
        // Success - would redirect in a real app
        alert('Login successful!');
      } else {
        setError('Invalid email or password');
      }
    }, 1000);
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-gradient-to-b from-cyan-50 via-white to-cyan-50"
      style={backgroundAnimation}
    >
      <div className="w-full max-w-6xl flex shadow-xl rounded-xl overflow-hidden">
        {/* Left side - gradient background with info */}
        <div 
          className="hidden md:block w-1/2 bg-gradient-to-r from-cyan-600 to-blue-600 p-12 text-white"
          style={formAnimation}
        >
          <div className="h-full flex flex-col justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-6">Welcome Back</h1>
              <p className="text-cyan-100 mb-8">
                Sign in to access your account dashboard and manage your services.
              </p>
              
              <div className="space-y-6 mt-12">
                <div className="flex items-center">
                  <div className="bg-cyan-500 bg-opacity-30 p-2 rounded-full">
                    <FaUserShield className="w-5 h-5" />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-medium">Secure Access</h3>
                    <p className="text-sm text-cyan-200">Your data is protected with end-to-end encryption</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="bg-cyan-500 bg-opacity-30 p-2 rounded-full">
                    <FaUsers className="w-5 h-5" />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-medium">Multi-User Support</h3>
                    <p className="text-sm text-cyan-200">Collaborate with team members seamlessly</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-sm text-cyan-200">
              &copy; 2025 Academia University. All rights reserved.
            </div>
          </div>
        </div>
        
        {/* Right side - login form */}
        <div 
          className="w-full md:w-1/2 bg-white p-8 md:p-12"
          style={formAnimation}
        >
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-cyan-800 mb-4">Sign In</h2>
              <p className="text-cyan-600">Enter your credentials to access your account</p>
              <div className="w-20 h-1 bg-gradient-to-r from-cyan-400 to-blue-400 mx-auto mt-4" />
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
                  <span className="block sm:inline">{error}</span>
                </div>
              )}
              
              <Input
                id="email"
                type="email"
                label="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="border-cyan-200 focus:border-cyan-500 focus:ring-cyan-500"
              />
              
              <Input
                id="password"
                type="password"
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="border-cyan-200 focus:border-cyan-500 focus:ring-cyan-500"
              />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-cyan-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-cyan-700">
                    Remember me
                  </label>
                </div>
                <a href="#" className="text-sm text-cyan-600 hover:text-cyan-500">
                  Forgot password?
                </a>
              </div>
              
              <Button
                type="submit"
                label={isLoading ? 'Signing in...' : 'Sign in'}
                disabled={isLoading}
                variant="primary"
                className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
              />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;