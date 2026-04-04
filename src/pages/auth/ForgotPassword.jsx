// src/pages/auth/ForgotPassword.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/ui/Button';
import AuthLayout from '../../components/layout/AuthLayout';
import logger from '../../utils/logger';

const ForgotPassword = () => {
  const { t } = useTranslation();
  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState(location.state?.email || '');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailValid, setEmailValid] = useState(false);

  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailValid(emailRegex.test(email));
  }, [email]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!emailValid) return setError(t('auth.errors.invalidEmail'));

    try {
      setError('');
      setLoading(true);
      await resetPassword(email);
      navigate('/login', { state: { emailSent: true, email } });
    } catch (error) {
      logger.error('Error sending recovery email:', error);
      setError(t('auth.forgotPassword.errorSend'));
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Forgot Password - Orary</title>
        <meta name="description" content="Reset your Orary account password to regain access to your shift tracking data." />
      </Helmet>
      <AuthLayout title={t('auth.forgotPassword.title')} subtitle={t('auth.forgotPassword.subtitle')}>
      <p className="text-center text-gray-600 text-sm mb-4">
        {t('auth.forgotPassword.description')}
      </p>

      {error && (
        <div className="mb-3 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('auth.forgotPassword.email')}</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-offset-0 transition-colors"
            placeholder={t('auth.forgotPassword.emailPlaceholder')}
            required
          />
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            onClick={() => navigate('/login')}
            variant="cancel"
            disabled={loading}
          >
            {t('common.cancel')}
          </Button>
          <Button
            type="submit"
            disabled={loading || !emailValid}
            loading={loading}
            loadingText={t('auth.forgotPassword.sending')}
            className="flex-1"
          >
            {t('auth.forgotPassword.sendLink')}
          </Button>
        </div>
      </form>
    </AuthLayout>
    </>
  );
};

export default ForgotPassword;
