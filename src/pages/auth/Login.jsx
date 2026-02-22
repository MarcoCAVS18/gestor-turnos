// src/pages/auth/Login.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import AuthLayout from '../../components/layout/AuthLayout';
import GoogleIcon from '../../components/icons/GoogleIcon';
import logger from '../../utils/logger';

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

  const redirectTo = location.state?.redirectTo || '/dashboard';

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
      if (err.code === 'auth/popup-closed-by-user') {
        setError('Sign-in popup was closed. Please try again.');
      } else {
        setError('Could not sign in with Google. Please try again.');
      }
      setGoogleLoading(false);
      logger.error('Google login error:', err);
    }
  };

  return (
    <>
      <AuthLayout title="Orary" subtitle="Manage your work shifts easily.">
        {error && (
          <div className="mb-3 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="mb-3 p-3 bg-green-100 text-green-700 rounded-lg text-sm">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="mb-3">
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

          <div className="mb-1.5">
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

          <div className="mb-3 text-right">
            <button
              type="button"
              onClick={() => navigate('/forgot-password', { state: { email } })}
              className="text-sm text-pink-600 hover:text-pink-800"
            >
              Forgot your password?
            </button>
          </div>

          <Button type="submit" loading={loading} className="w-full mb-3">
            Continue
          </Button>
        </form>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white px-3 text-gray-500 text-sm">or</span>
          </div>
        </div>

        <Button
          onClick={handleGoogleLogin}
          loading={googleLoading}
          variant="secondary"
          className="w-full mb-3"
          icon={GoogleIcon}
          iconPosition="left"
          bgColor="#121212"
          textColor="white"
        >
          Continue with Google
        </Button>

        <div className="text-center">
          <p className="text-gray-600 text-sm mb-1">Don't have an account?</p>
          <button
            onClick={() => navigate('/register', { state: redirectTo ? { redirectTo } : undefined })}
            className="text-pink-600 hover:text-pink-800 font-bold text-sm"
          >
            Register here!
          </button>
        </div>
      </AuthLayout>
    </>
  );
};

export default Login;
