// src/pages/auth/Register.jsx

import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { hasProfanity } from '../../utils/profanityFilter';
import Button from '../../components/ui/Button';
import AuthLayout from '../../components/layout/AuthLayout';
import GoogleIcon from '../../components/icons/GoogleIcon';

const Register = () => {
  const { t } = useTranslation();
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

    if (!nameValid) return setError(t('auth.errors.nameTooShort'));
    if (hasProfanity(displayName)) return setError(t('auth.errors.inappropriateName'));
    if (!emailValid) return setError(t('auth.errors.invalidEmail'));
    if (!passwordStrength.isValid) return setError(t('auth.errors.passwordRequirements'));
    if (password !== confirmPassword) return setError(t('auth.errors.passwordsMismatch'));

    try {
      setError('');
      setLoading(true);
      await signup(email, password, displayName);
      navigate(redirectTo);
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        setError(t('auth.errors.emailInUse'));
      } else if (error.code === 'auth/weak-password') {
        setError(t('auth.errors.weakPassword'));
      } else {
        setError(t('auth.errors.createAccountFailed'));
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
        setError(t('auth.errors.popupClosed'));
      } else if (error.code === 'auth/account-exists-with-different-credential') {
        setError(t('auth.errors.accountExists'));
      } else {
        setError(t('auth.errors.googleRegisterFailed'));
      }
      setGoogleLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Create Account - Orary</title>
        <meta name="description" content="Create your free Orary account to start tracking work shifts and calculating earnings automatically." />
      </Helmet>
      <AuthLayout title={t('auth.register.title')} subtitle={t('auth.register.subtitle')}>
      {error && (
        <div className="mb-3 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-1">
            {t('auth.register.name')}
          </label>
          <input
            id="displayName"
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-offset-0 transition-colors ${
              !nameValid && displayName ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder={t('auth.register.namePlaceholder')}
            required
          />
          {!nameValid && displayName && (
            <p className="mt-1 text-xs text-red-500">{t('auth.register.passwordRequirements.minLength')}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            {t('auth.register.email')}
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-offset-0 transition-colors ${
              !emailValid && email ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder={t('auth.register.emailPlaceholder')}
            required
          />
          {!emailValid && email && (
            <p className="mt-1 text-xs text-red-500">{t('auth.errors.invalidEmail')}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            {t('auth.register.password')}
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
              placeholder={t('auth.register.passwordPlaceholder')}
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
                ✓ {t('auth.register.passwordRequirements.minLength')}
              </p>
              <p className={passwordStrength.hasUpperCase ? 'text-green-600' : 'text-gray-500'}>
                ✓ {t('auth.register.passwordRequirements.uppercase')}
              </p>
              <p className={passwordStrength.hasLowerCase ? 'text-green-600' : 'text-gray-500'}>
                ✓ {t('auth.register.passwordRequirements.lowercase')}
              </p>
              <p className={passwordStrength.hasNumber ? 'text-green-600' : 'text-gray-500'}>
                ✓ {t('auth.register.passwordRequirements.number')}
              </p>
            </div>
          )}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
            {t('auth.register.confirmPassword')}
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
              placeholder={t('auth.register.confirmPasswordPlaceholder')}
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
            <p className="mt-1 text-xs text-red-500">{t('auth.errors.passwordsMismatch')}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={loading || !emailValid || !passwordStrength.isValid || !passwordsMatch || !nameValid}
          loading={loading}
          className="w-full"
        >
          {t('auth.register.register')}
        </Button>
      </form>

      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-white px-3 text-gray-500 text-sm">{t('common.or')}</span>
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
        {t('auth.register.registerWithGoogle')}
      </Button>

      <div className="text-center">
        <p className="text-gray-600 text-sm mb-1">{t('auth.register.haveAccount')}</p>
        <Link to="/login" className="text-pink-600 hover:text-pink-800 font-bold text-sm">
          {t('auth.register.signInHere')}
        </Link>
      </div>
    </AuthLayout>
    </>
  );
};

export default Register;
