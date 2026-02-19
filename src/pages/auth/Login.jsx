// src/pages/auth/Login.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import Flex from '../../components/ui/Flex';
import Logo from '../../components/icons/Logo';
import DemoModal from '../../components/demos/DemoModal';

import GoogleIcon from '../../components/icons/GoogleIcon';

const Login = () => {
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Get redirect route
  const redirectTo = location.state?.redirectTo || '/dashboard';

  // Detect if coming from forgot-password
  useEffect(() => {
    if (location.state && location.state.emailSent) {
      setSuccessMessage('We have sent a recovery link to your email.');
      setEmail(location.state.email || '');
      
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 4000);
      
      return () => clearTimeout(timer);
    }
  }, [location]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      return setError('Please enter your email and password');
    }

    setLoading(true);
    setError('');
    try {
      await login(email, password);
      navigate(redirectTo);
    } catch (err) {
      setError('Incorrect email or password');
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setError('');
    try {
      await loginWithGoogle();
      navigate(redirectTo);
      setGoogleLoading(false);
    } catch (err) {
      // Use => specific error message from AuthContext, or fallback
      const errorMessage = err.message || 'Error signing in with Google';
      setError(errorMessage);
      setGoogleLoading(false);

      // Log error for debugging
      console.error('Google login error:', err);
    }
  };

  const handleRegister = () => {
    navigate('/register', { 
      state: redirectTo ? { redirectTo } : undefined 
    });
  };

  const handleForgotPassword = () => {
    navigate('/forgot-password', { state: { email } });
  };

  return (
    <div className="fixed inset-0">
      {/* Background video */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black opacity-50 z-10"></div>
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="absolute object-cover w-full h-full"
        >
          <source src="/assets/videos/sample_0.mp4" type="video/mp4" />
          Your browser does not support videos.
        </video>
      </div>
      
      {/* Login content */}
      <Flex variant="center" className="flex-col fixed inset-0 z-20 bg-transparent p-4 py-12 overflow-y-auto">
        <Logo />
        <div className="text-center text-white mb-4">
          <h1 className="text-4xl font-bold mb-2">Orary</h1>
          <p className="text-lg">Manage your work shifts easily.</p>
        </div>
        <Card className="w-full max-w-md shadow-2xl" padding="lg">
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}
          
          {successMessage && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md text-sm">
              {successMessage}
            </div>
          )}
          
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <Input
                type="email"
                label="Email"
                icon={Mail}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
              />
            </div>
            
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Lock size={16} className="inline mr-2" />
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-offset-0 transition-colors"
                  placeholder="Password"
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            
            {/* Password recovery link */}
            <div className="mb-4 text-right">
              <button 
                type="button"
                onClick={handleForgotPassword}
                className="text-sm text-pink-600 hover:text-pink-800"
              >
                Forgot your password?
              </button>
            </div>
            
            <Button
              type="submit"
              loading={loading}
              className="w-full mb-4"
            >
              Continue
            </Button>
          </form>
          
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-3 text-gray-500 text-sm">or</span>
            </div>
          </div>
          
          <Button
            onClick={handleGoogleLogin}
            loading={googleLoading}
            variant="secondary"
            className="w-full mb-4"
            icon={GoogleIcon}
            iconPosition="left"
            bgColor="#121212"
            textColor="white"
          >
            Continue with Google
          </Button>
          
          <div className="text-center">
            <p className="text-gray-600 mb-2">Don't have an account?</p>
            <button 
              onClick={handleRegister}
              className="text-pink-600 hover:text-pink-800 font-bold"
            >
              Register here!
            </button>
          </div>
        </Card>
      </Flex>

      {/* Onboarding demo overlay */}
      <DemoModal />
    </div>
  );
};

export default Login;