// src/pages/auth/ResetPassword.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { confirmPasswordReset } from 'firebase/auth';
import { auth } from '../../services/firebase';
import Button from '../../components/ui/Button';
import AuthLayout from '../../components/layout/AuthLayout';
import logger from '../../utils/logger';

const ResetPassword = () => {
  const { t } = useTranslation();
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
      setError(t('auth.resetPassword.invalidLink'));
    }
  }, [oobCode, t]);

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

    if (!passwordStrength.isValid) return setError(t('auth.errors.passwordRequirements'));
    if (!passwordsMatch) return setError(t('auth.errors.passwordsMismatch'));

    try {
      setLoading(true);
      setError('');
      await confirmPasswordReset(auth, oobCode, password);
      setSuccess(true);
      setTimeout(() => {
        navigate('/login', { state: { passwordReset: true } });
      }, 3000);
    } catch (error) {
      logger.error('Error resetting password:', error);
      if (error.code === 'auth/expired-action-code') {
        setError(t('auth.resetPassword.expiredLink'));
      } else if (error.code === 'auth/invalid-action-code') {
        setError(t('auth.resetPassword.invalidLink'));
      } else {
        setError(t('auth.resetPassword.errorReset'));
      }
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Reset Password - Orary</title>
        <meta name="description" content="Set a new password for your Orary account." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <AuthLayout title={t('auth.resetPassword.title')} subtitle={t('auth.resetPassword.subtitle')}>
      {error && (
        <div className="mb-3 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-3 p-3 bg-green-100 text-green-700 rounded-lg text-sm">
          {t('auth.resetPassword.success')}
        </div>
      )}

      {!success && (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('auth.resetPassword.newPassword')}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-offset-0 transition-colors ${
                password && !passwordStrength.isValid ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder={t('auth.register.passwordPlaceholder')}
              required
            />
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
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('auth.resetPassword.confirmPassword')}</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-offset-0 transition-colors ${
                confirmPassword && !passwordsMatch ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder={t('auth.register.confirmPasswordPlaceholder')}
              required
            />
            {confirmPassword && !passwordsMatch && (
              <p className="mt-1 text-xs text-red-500">{t('auth.errors.passwordsMismatch')}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={loading || !passwordStrength.isValid || !passwordsMatch}
            loading={loading}
            loadingText={t('auth.resetPassword.resetting')}
            className="w-full"
          >
            {t('auth.resetPassword.resetButton')}
          </Button>
        </form>
      )}

      <div className="mt-3 text-center">
        <button
          onClick={() => navigate('/login')}
          className="text-sm text-pink-600 hover:text-pink-800 font-medium"
        >
          {t('auth.resetPassword.backToLogin')}
        </button>
      </div>
    </AuthLayout>
    </>
  );
};

export default ResetPassword;
