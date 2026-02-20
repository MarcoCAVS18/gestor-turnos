// src/pages/auth/Register.jsx

import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { hasProfanity } from '../../utils/profanityFilter';
import Button from '../../components/ui/Button';
import AuthLayout from '../../components/layout/AuthLayout';
import GoogleIcon from '../../components/icons/GoogleIcon';

const Register = () => {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { signup, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectTo = location.state?.redirectTo || '/';

  const [emailValid, setEmailValid] = useState(true);
  const [passwordStrength, setPasswordStrength] = useState({
    isValid: false,
    hasMinLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false
  });
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [nameValid, setNameValid] = useState(true);

  useEffect(() => {
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setEmailValid(emailRegex.test(email));
    } else {
      setEmailValid(true);
    }
  }, [email]);

  useEffect(() => {
    if (displayName) {
      setNameValid(displayName.trim().length >= 2);
    } else {
      setNameValid(true);
    }
  }, [displayName]);

  useEffect(() => {
    if (password) {
      const strength = {
        hasMinLength: password.length >= 6,
        hasUpperCase: /[A-Z]/.test(password),
        hasLowerCase: /[a-z]/.test(password),
        hasNumber: /[0-9]/.test(password)
      };

      strength.isValid = strength.hasMinLength && (
        (strength.hasUpperCase && strength.hasLowerCase) ||
        (strength.hasNumber && (strength.hasUpperCase || strength.hasLowerCase))
      );

      setPasswordStrength(strength);
    } else {
      setPasswordStrength({
        isValid: false,
        hasMinLength: false,
        hasUpperCase: false,
        hasLowerCase: false,
        hasNumber: false
      });
    }
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

    if (!nameValid) return setError('Name must be at least 2 characters');
    if (hasProfanity(displayName)) return setError('Please choose an appropriate name');
    if (!emailValid) return setError('Please enter a valid email');
    if (!passwordStrength.isValid) return setError('Password does not meet minimum requirements');
    if (password !== confirmPassword) return setError('Passwords do not match');

    try {
      setError('');
      setLoading(true);
      await signup(email, password, displayName);
      navigate(redirectTo);
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        setError('This email is already in use. Try signing in.');
      } else if (error.code === 'auth/weak-password') {
        setError('Password is too weak. It must be at least 6 characters.');
      } else {
        setError('Error creating account. Please try again.');
      }
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    try {
      setGoogleLoading(true);
      setError('');
      await loginWithGoogle();
      navigate(redirectTo);
    } catch (error) {
      if (error.code === 'auth/popup-closed-by-user') {
        setError('Sign-in popup was closed. Please try again.');
      } else if (error.code === 'auth/account-exists-with-different-credential') {
        setError('An account already exists with this email. Try a different sign-in method.');
      } else {
        setError('Could not register with Google. Please try again.');
      }
      setGoogleLoading(false);
    }
  };

  return (
    <AuthLayout title="Orary" subtitle="Create your account">
      {error && (
        <div className="mb-3 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            id="displayName"
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-offset-0 transition-colors ${
              !nameValid && displayName ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Your name"
            required
          />
          {!nameValid && displayName && (
            <p className="mt-1 text-xs text-red-500">Name must be at least 2 characters</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-offset-0 transition-colors ${
              !emailValid && email ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="your@email.com"
            required
          />
          {!emailValid && email && (
            <p className="mt-1 text-xs text-red-500">Please enter a valid email</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-offset-0 transition-colors ${
                password && !passwordStrength.isValid ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Minimum 6 characters"
              required
              minLength={6}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {password && (
            <div className="mt-1.5 text-xs space-y-0.5">
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
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
            Confirm Password
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-offset-0 transition-colors ${
                !passwordsMatch && confirmPassword ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Confirm your password"
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
          {!passwordsMatch && confirmPassword && (
            <p className="mt-1 text-xs text-red-500">Passwords do not match</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={loading || !emailValid || !passwordStrength.isValid || !passwordsMatch || !nameValid}
          loading={loading}
          className="w-full"
        >
          Register
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
        onClick={handleGoogleRegister}
        loading={googleLoading}
        variant="secondary"
        className="w-full mb-3"
        icon={GoogleIcon}
        iconPosition="left"
        bgColor="#121212"
        textColor="white"
      >
        Register with Google
      </Button>

      <div className="text-center">
        <p className="text-gray-600 text-sm mb-1">Already have an account?</p>
        <Link to="/login" className="text-pink-600 hover:text-pink-800 font-bold text-sm">
          Sign in here
        </Link>
      </div>
    </AuthLayout>
  );
};

export default Register;
