import React, { useState } from 'react';
import Input from '../../components/Input';
import Button from '../../components/Button';

// Custom hook for fade-in animation
const useFadeIn = () => {
  const [opacity, setOpacity] = useState(0);
  
  React.useEffect(() => {
    const timer = setTimeout(() => setOpacity(1), 100);
    return () => clearTimeout(timer);
  }, []);
  
  return { opacity, transition: 'opacity 0.6s ease-in-out' };
};

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Animation styles
  const containerFade = useFadeIn();
  const formFade = { ...useFadeIn(), transition: 'opacity 0.8s ease-in-out, transform 0.6s ease-out', transform: `translateY(${containerFade.opacity * 0}px)` };
  const titleFade = { ...useFadeIn(), transition: 'opacity 0.9s ease-in-out, transform 0.7s ease-out', transform: `translateY(${containerFade.opacity * 0}px)` };
  
  // Custom register function to mimic react-hook-form behavior
  const register = (name) => ({
    value: name === 'email' ? email : password,
    onChange: (e) => name === 'email' ? setEmail(e.target.value) : setPassword(e.target.value)
  });

  const handleSubmit = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      if (!email || !password) {
        setApiError('Please enter both email and password');
      }
    }, 1500);
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-blue-50"
      style={{
        backgroundImage: "radial-gradient(circle at 50% 50%, #f0f7ff 0%, #e6f0fd 100%)",
        ...containerFade
      }}
    >
      {/* Logo Animation */}
      <div 
        className="absolute top-10 flex justify-center w-full"
        style={titleFade}
      >
        <div className="text-blue-600 font-bold text-xl flex items-center">
          <svg className="w-8 h-8 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838l-2.851 1.22v6.986l7-3V4.919l-7-3zM1 11.92v3.072c0 .53.385.97.884 1.051l7 1.12a1 1 0 001.147-.706L10 16.002l-3.063-1.308a1 1 0 01.26-1.95L10 13.383l3.063-.83a1 1 0 01.26 1.95L10 15.811v.19z"/>
          </svg>
          UNIVERSITY PORTAL
        </div>
      </div>
      
      <div 
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md border border-gray-200"
        style={{
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
          ...formFade
        }}
      >
        <h2 
          className="text-2xl font-bold text-center text-blue-600 mb-8"
          style={{textShadow: "0 1px 5px rgba(66, 153, 225, 0.2)"}}
        >
          Student Login
        </h2>
        
        <div className="space-y-5">
          <div className="group">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <Input 
                type="email"
                name="email"
                placeholder="Enter your email"
                register={register}
                error={apiError && !email}
              />
            </div>
          </div>
          
          <div className="group">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <Input 
                type="password"
                name="password"
                placeholder="Enter your password"
                register={register}
                error={apiError && !password}
              />
            </div>
          </div>
          
          {apiError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{apiError}</span>
            </div>
          )}
          
          <div className="pt-2">
            <Button
              type="button"
              variant="primary"
              disabled={isLoading}
              onClick={handleSubmit}
            >
              {isLoading ? (
                <div className="flex justify-center items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Logging in...
                </div>
              ) : 'Sign In'}
            </Button>
          </div>
          
          <div className="text-center mt-4">
            <a href="#" className="text-sm text-blue-600 hover:text-blue-500 transition-colors duration-300">Forgot your password?</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;