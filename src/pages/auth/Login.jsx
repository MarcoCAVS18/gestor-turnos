// src/pages/auth/Login.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { Mail, Lock, Eye, EyeOff, Fingerprint } from 'lucide-react';
import { isBiometricAvailable, getStoredBiometricUid, verifyBiometric } from '../../services/biometricService';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import AuthLayout from '../../components/layout/AuthLayout';
import GoogleIcon from '../../components/icons/GoogleIcon';
import logger from '../../utils/logger';

const Login = () => {
  const { t } = useTranslation();
  const { login, loginWithGoogle, currentUser, unlockApp, isLocked } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [biometricLoading, setBiometricLoading] = useState(false);

  const [showBiometric] = useState(() => isBiometricAvailable());
  const [biometricUid] = useState(() => getStoredBiometricUid());

  const redirectTo = location.state?.redirectTo || '/dashboard';
  const wasAlreadyLoggedIn = useRef(currentUser != null);

  useEffect(() => {
    if (!wasAlreadyLoggedIn.current && currentUser && !isLocked) {
      navigate(redirectTo, { replace: true });
    }
  }, [currentUser, isLocked, navigate, redirectTo]);

  useEffect(() => {
    if (location.state && location.state.emailSent) {
      setSuccessMessage(t('auth.login.recoverySent'));
      setEmail(location.state.email || '');

      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [location, t]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      return setError(t('auth.errors.emailPasswordRequired'));
    }

    setLoading(true);
    setError('');
    try {
      await login(email, password);
      navigate(redirectTo);
    } catch (err) {
      setError(t('auth.errors.wrongPassword'));
      setLoading(false);
    }
  };

  const handleBiometricLogin = async () => {
    setBiometricLoading(true);
    setError('');
    try {
      await verifyBiometric(biometricUid);
      if (!currentUser) {
        setError(t('auth.errors.sessionExpired'));
        setBiometricLoading(false);
        return;
      }
      unlockApp();
      navigate('/dashboard');
    } catch {
      setError(t('auth.errors.biometricFailed'));
      setBiometricLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setError('');
    const safetyTimer = setTimeout(() => setGoogleLoading(false), 30000);
    try {
      await loginWithGoogle();
      navigate(redirectTo);
    } catch (err) {
      if (err.code === 'auth/popup-closed-by-user' || err.code === 'auth/cancelled-popup-request') {
        setError(t('auth.errors.popupClosed'));
      } else {
        setError(t('auth.errors.googleSignInFailed'));
      }
      logger.error('Google login error:', err);
    } finally {
      clearTimeout(safetyTimer);
      setGoogleLoading(false);
    }
  };

  return (
    <>
      <AuthLayout title={t('auth.login.title')} subtitle={t('auth.login.subtitle')}>
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
              label={t('auth.login.email')}
              icon={Mail}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('auth.login.emailPlaceholder')}
              required
            />
          </div>

          <div className="mb-1.5">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Lock size={16} className="inline mr-2" />
              {t('auth.login.password')}
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-offset-0 transition-colors"
                placeholder={t('auth.login.passwordPlaceholder')}
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
              {t('auth.login.forgotPassword')}
            </button>
          </div>

          <Button type="submit" loading={loading} className="w-full mb-3">
            {t('auth.login.continue')}
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
          onClick={handleGoogleLogin}
          loading={googleLoading}
          variant="secondary"
          className="w-full mb-3"
          icon={GoogleIcon}
          iconPosition="left"
          bgColor="#121212"
          textColor="white"
        >
          {t('auth.login.continueWithGoogle')}
        </Button>

        {showBiometric && (
          <Button
            onClick={handleBiometricLogin}
            loading={biometricLoading}
            variant="secondary"
            className="w-full mb-3"
            icon={Fingerprint}
            iconPosition="left"
          >
            {t('auth.login.continueWithBiometric')}
          </Button>
        )}

        <div className="text-center">
          <p className="text-gray-600 text-sm mb-1">{t('auth.login.noAccount')}</p>
          <button
            onClick={() => navigate('/register', { state: redirectTo ? { redirectTo } : undefined })}
            className="text-pink-600 hover:text-pink-800 font-bold text-sm"
          >
            {t('auth.login.registerHere')}
          </button>
        </div>
      </AuthLayout>
    </>
  );
};

export default Login;
