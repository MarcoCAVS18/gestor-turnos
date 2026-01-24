// src/pages/auth/ResetPassword.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { confirmPasswordReset } from 'firebase/auth';
import { auth } from '../../services/firebase';

// New structured import
import Button from '../../components/ui/Button';
import Flex from '../../components/ui/Flex';
import Logo from '../../components/icons/Logo';

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const queryParams = new URLSearchParams(location.search);
  const oobCode = queryParams.get('oobCode');
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [passwordStrength, setPasswordStrength] = useState({
    isValid: false,
    hasMinLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false
  });
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  
  useEffect(() => {
    if (!oobCode) {
      setError('Invalid or expired link. Please request a new recovery link.');
    }
  }, [oobCode]);
  
  useEffect(() => {
    const strength = {
      hasMinLength: password.length >= 6,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password)
    };
    
    strength.isValid =
      strength.hasMinLength &&
      (
        (strength.hasUpperCase && strength.hasLowerCase) ||
        (strength.hasNumber && (strength.hasUpperCase || strength.hasLowerCase))
      );
    
    setPasswordStrength(strength);
  }, [password]);
  
  useEffect(() => {
    if (confirmPassword) {
      setPasswordsMatch(password === confirmPassword);
    } else {
      setPasswordsMatch(true);
    }
  }, [password, confirmPassword]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!passwordStrength.isValid) {
      return setError('Password does not meet minimum requirements.');
    }
    
    if (!passwordsMatch) {
      return setError('Passwords do not match.');
    }
    
    try {
      setLoading(true);
      setError('');
      
      await confirmPasswordReset(auth, oobCode, password);
      
      setSuccess(true);
      setTimeout(() => {
        navigate('/login', { state: { passwordReset: true } });
      }, 3000);
    } catch (error) {
      console.error('Error resetting password:', error);
      if (error.code === 'auth/expired-action-code') {
        setError('The link has expired. Please request a new recovery link.');
      } else if (error.code === 'auth/invalid-action-code') {
        setError('The link is invalid. Please request a new recovery link.');
      } else {
        setError('Error resetting your password. Please try again.');
      }
      setLoading(false);
    }
  };
  
  return (
    <div className="fixed inset-0">
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
      
      <Flex variant="center" className="flex-col fixed inset-0 z-20 bg-transparent p-4 py-12 overflow-y-auto">
        <Logo />
        <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-2xl">
          <h1 className="text-2xl font-bold text-center mb-2">Create new password</h1>
          <p className="text-center text-gray-600 mb-6">
            Enter and confirm your new password.
          </p>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}
          
          {success && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md text-sm">
              Your password has been successfully reset! You will be redirected in a few seconds...
            </div>
          )}
          
          {!success && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">New password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full p-2 border rounded focus:ring-pink-500 focus:border-pink-500 ${
                    password && !passwordStrength.isValid ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Minimum 6 characters"
                  required
                />
                {password && (
                  <div className="mt-2 text-xs space-y-1">
                    <p className={passwordStrength.hasMinLength ? 'text-green-600' : 'text-gray-500'}>
                      ✓ Minimum 6 characters
                    </p>
                    <p className={passwordStrength.hasUpperCase ? 'text-green-600' : 'text-gray-500'}>
                      ✓ At least one uppercase letter
                    </p>
                    <p className={passwordStrength.hasLowerCase ? 'text-green-600' : 'text-gray-500'}>
                      ✓ At least one lowercase letter
                    </p>
                    <p className={passwordStrength.hasNumber ? 'text-green-600' : 'text-gray-500'}>
                      ✓ At least one number
                    </p>
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2">Confirm password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full p-2 border rounded focus:ring-pink-500 focus:border-pink-500 ${
                    confirmPassword && !passwordsMatch ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Repeat your password"
                  required
                />
                {confirmPassword && !passwordsMatch && (
                  <p className="mt-1 text-xs text-red-500">
                    Passwords do not match
                  </p>
                )}
              </div>
              
              <Button
                type="submit"
                disabled={loading || !passwordStrength.isValid || !passwordsMatch}
                loading={loading}
                className="w-full"
              >
                Confirm new password
              </Button>
            </form>
          )}
          
          <div className="mt-4 text-center">
            <Button
              type="button"
              onClick={() => navigate('/login')}
              variant="ghost"
              className="text-sm text-pink-600 hover:text-pink-800"
            >
              Back to login
            </Button>
          </div>
        </div>
      </Flex>
    </div>
  );
};

export default ResetPassword;